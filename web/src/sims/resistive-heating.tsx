import { useMemo, useState } from 'react'
import {
  KELVIN_OFFSET,
  MATERIALS,
  analyse,
  awgDiameter,
  findMaterial,
  simulate,
} from '../engine/heating'
import type { HeatingInput, MaterialKey } from '../engine/heating'
import { formatSI } from '../engine/units'
import { Group, Segmented, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 4096

const MATERIAL_OPTIONS = MATERIALS.map((m) => ({ value: m.key, label: m.label }))

const toC = (k: number) => k - KELVIN_OFFSET

export default function ResistiveHeating() {
  const [materialKey, setMaterialKey] = useState<MaterialKey>('nichrome80')
  const [sizing, setSizing] = useState<'awg' | 'diameter'>('awg')
  const [awg, setAwg] = useState(26)
  const [diameterMm, setDiameterMm] = useState(0.4)
  const [length, setLength] = useState(0.5)
  // Pyrography pens and nichrome cutters run from a low-voltage supply, not the
  // 3.3 V logic rail, so this page defaults to a bench supply voltage.
  const [supply, setSupply] = useState(12)
  const [h, setH] = useState(25)
  const [ambientC, setAmbientC] = useState(20)
  const [targetC, setTargetC] = useState(400)

  const { r, traces, dt } = useMemo(() => {
    const material = findMaterial(materialKey)
    const diameter = sizing === 'awg' ? awgDiameter(awg) : diameterMm / 1000
    const input: HeatingInput = {
      material,
      diameter,
      length,
      supply,
      h,
      ambient: ambientC + KELVIN_OFFSET,
      target: targetC + KELVIN_OFFSET,
    }
    const r = analyse(input)
    // Show five time constants, which is 99.3% of the way to equilibrium.
    const span = Number.isFinite(r.tau) && r.tau > 0 ? 5 * r.tau : 60
    const dt = span / N
    const sim = simulate(input, N, dt)
    return {
      r,
      dt,
      traces: [
        { label: 'T', color: TRACE_COLORS[4], samples: sim.temp.map(toC) },
        { label: 'P', color: TRACE_COLORS[3], samples: sim.power },
      ],
    }
  }, [materialKey, sizing, awg, diameterMm, length, supply, h, ambientC, targetC])

  const material = findMaterial(materialKey)

  return (
    <SimPage
      id="resistive-heating"
      lede="Nichrome and Kanthal elements: pyrography tips, foam cutters, small furnaces. The scope shows wire temperature in °C and dissipated power in W against time, settling at equilibrium rather than climbing forever."
      controls={
        <>
          <Group label="Element">
            <Select label="Alloy" value={materialKey} onChange={setMaterialKey} options={MATERIAL_OPTIONS} />
            <Segmented
              label="Size by"
              value={sizing}
              onChange={setSizing}
              options={[
                { value: 'awg', label: 'AWG' },
                { value: 'diameter', label: 'Diameter' },
              ]}
            />
            {sizing === 'awg' ? (
              <Param label="Gauge" unit="AWG" value={awg} onChange={(v) => setAwg(Math.round(v))} min={10} max={40} log={false} step={1} />
            ) : (
              <Param label="Diameter" unit="mm" value={diameterMm} onChange={setDiameterMm} min={0.05} max={3} />
            )}
            <Param label="Length" unit="m" value={length} onChange={setLength} min={0.01} max={20} />
          </Group>

          <Group label="Drive and environment">
            <Param label="Supply" unit="V" value={supply} onChange={setSupply} min={0.5} max={240} />
            <Param label="Convection h" unit="W/m²K" value={h} onChange={setH} min={5} max={200} log={false} step={1} />
            <Param label="Ambient" unit="°C" value={ambientC} onChange={setAmbientC} min={-20} max={60} log={false} step={1} />
            <Param label="Target temperature" unit="°C" value={targetC} onChange={setTargetC} min={30} max={1300} log={false} step={10} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="°C" />

      <ReadoutGrid
        items={[
          { label: 'Resistance cold', value: formatSI(r.rCold, 'Ω'), note: 'at 20 °C' },
          { label: 'Resistance hot', value: formatSI(r.rHot, 'Ω'), note: 'at equilibrium' },
          { label: 'Inrush current', value: formatSI(r.currentCold, 'A'), warn: r.overCurrent },
          { label: 'Settled current', value: formatSI(r.currentHot, 'A') },
          { label: 'Power cold', value: formatSI(r.powerCold, 'W') },
          { label: 'Power settled', value: formatSI(r.powerHot, 'W') },
          {
            label: 'Equilibrium temp',
            value: `${toC(r.equilibrium).toFixed(0)} °C`,
            note: `limit ${toC(material.maxTemp).toFixed(0)} °C`,
            warn: r.overTemp,
          },
          { label: 'Thermal tau', value: formatSI(r.tau, 's') },
          {
            label: 'Time to target',
            value: r.reachable ? formatSI(r.tTarget, 's') : 'never',
            note: r.reachable ? undefined : '(below equilibrium)',
            warn: !r.reachable,
          },
          { label: 'Settling time', value: formatSI(r.tSettle, 's'), note: '5 tau' },
          { label: 'Surface load', value: formatSI(r.surfaceLoad, 'W/m²') },
          { label: 'Hold duty', value: r.holdDuty <= 1 ? `${(r.holdDuty * 100).toFixed(0)}%` : 'over 100%', warn: r.holdDuty > 1 },
          { label: 'Radiated share', value: `${(r.radiation * 100).toFixed(0)}%`, note: 'rest is convection' },
          { label: 'Current limit', value: formatSI(r.limitCurrent, 'A'), note: 'at service temp' },
          { label: 'Wire mass', value: formatSI(r.mass, 'kg') },
          { label: 'Energy to target', value: formatSI(r.energyToTarget, 'J') },
        ]}
      />

      {r.overTemp && (
        <Warning>
          Equilibrium is above the {toC(material.maxTemp).toFixed(0)} °C continuous rating for{' '}
          {material.label}. The element will oxidise fast and fail early. Use thicker wire, a
          longer run, or less voltage.
        </Warning>
      )}
      {!r.reachable && (
        <Warning>
          The target sits above the equilibrium temperature, so the wire never reaches it no
          matter how long it runs. Raise the supply or reduce the cooling.
        </Warning>
      )}
      {materialKey === 'copper' && (
        <Warning>
          Copper is here for contrast, not for building elements. Its temperature coefficient
          is roughly 80x that of nichrome, so its resistance and therefore its power swing
          wildly as it heats, and it oxidises away quickly at element temperatures.
        </Warning>
      )}

      <Theory>
        <p>
          Resistance is <code>R = rho·L/A</code>, so power at a fixed supply is{' '}
          <code>P = V²/R</code>. Halving the length halves the resistance and doubles the
          power, which is the usual way people accidentally burn out a pen tip.
        </p>
        <p>
          Temperature is not that formula. The wire obeys a balance:{' '}
          <code>m·c·dT/dt = P - h·As·(T - Tamb)</code>. The loss term grows with temperature,
          so the wire settles at <code>Tamb + P/(h·As)</code> rather than climbing forever.
          That equilibrium is what the trace converges to, and the time constant{' '}
          <code>m·c/(h·As)</code> is independent of length: a longer wire has proportionally
          more mass and more surface.
        </p>
        <p>
          Resistance drifts with temperature too, so the settled power is not the switch-on
          power. This is why the simulation freezes the power over each step and applies the
          exact solution: the feedback is negative for every real element alloy, hotter means
          more resistance means less power, so it converges rather than running away.
        </p>
        <p>
          Element makers size on surface load, watts per square metre of wire surface, not on
          total power. Two elements of the same wattage behave very differently if one packs
          it into half the surface.
        </p>
      </Theory>
    </SimPage>
  )
}
