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
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Segmented, Select, SimPage, Theory, TRACE_COLORS, Warning } from '../ui'

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
      lede="resistive-heating.lede"
      controls={
        <>
          <Group label="resistive-heating.element">
            <Select label="resistive-heating.alloy" value={materialKey} onChange={setMaterialKey} options={MATERIAL_OPTIONS} />
            <Segmented
              label="resistive-heating.sizeBy"
              value={sizing}
              onChange={setSizing}
              options={[
                { value: 'awg', label: 'resistive-heating.awg' },
                { value: 'diameter', label: 'common.diameter' },
              ]}
            />
            {sizing === 'awg' ? (
              <Param label="common.gauge" unit="AWG" value={awg} onChange={setAwg} int min={10} max={40} log={false} step={1} />
            ) : (
              <Param label="common.diameter" unit="mm" value={diameterMm} onChange={setDiameterMm} min={0.05} max={3} />
            )}
            <Param label="resistive-heating.length" unit="m" value={length} onChange={setLength} min={0.01} max={20} />
          </Group>

          <Group label="resistive-heating.driveAndEnvironment">
            <Param label="common.supply" unit="V" value={supply} onChange={setSupply} min={0.5} max={240} />
            <Param label="resistive-heating.convectionH" unit="W/m²K" value={h} onChange={setH} min={5} max={200} log={false} step={1} />
            <Param label="common.ambient" unit="°C" value={ambientC} onChange={setAmbientC} min={-20} max={60} log={false} step={1} />
            <Param label="resistive-heating.targetTemperature" unit="°C" value={targetC} onChange={setTargetC} min={30} max={1300} log={false} step={10} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="°C" />

      <ReadoutGrid
        items={[
          { label: 'resistive-heating.resistanceCold', value: formatSI(r.rCold, 'Ω'), note: 'resistive-heating.at20C' },
          { label: 'resistive-heating.resistanceHot', value: formatSI(r.rHot, 'Ω'), note: 'resistive-heating.atEquilibrium' },
          { label: 'resistive-heating.inrushCurrent', value: formatSI(r.currentCold, 'A'), warn: r.overCurrent },
          { label: 'resistive-heating.settledCurrent', value: formatSI(r.currentHot, 'A') },
          { label: 'resistive-heating.powerCold', value: formatSI(r.powerCold, 'W') },
          { label: 'resistive-heating.powerSettled', value: formatSI(r.powerHot, 'W') },
          {
            label: 'resistive-heating.equilibriumTemp',
            value: `${toC(r.equilibrium).toFixed(0)} °C`,
            note: <T k="resistive-heating.limitC" vars={{ maxTemp: toC(material.maxTemp).toFixed(0) }} />,
            warn: r.overTemp,
          },
          { label: 'resistive-heating.thermalTau', value: formatSI(r.tau, 's') },
          {
            label: 'resistive-heating.timeToTarget',
            value: r.reachable ? formatSI(r.tTarget, 's') : 'common.never',
            note: r.reachable ? undefined : 'resistive-heating.belowEquilibrium',
            warn: !r.reachable,
          },
          { label: 'resistive-heating.settlingTime', value: formatSI(r.tSettle, 's'), note: 'resistive-heating.5Tau' },
          { label: 'resistive-heating.surfaceLoad', value: formatSI(r.surfaceLoad, 'W/m²') },
          { label: 'resistive-heating.holdDuty', value: r.holdDuty <= 1 ? `${(r.holdDuty * 100).toFixed(0)}%` : 'resistive-heating.over100', warn: r.holdDuty > 1 },
          { label: 'resistive-heating.radiatedShare', value: `${(r.radiation * 100).toFixed(0)}%`, note: 'resistive-heating.restIsConvection' },
          { label: 'resistive-heating.currentLimit', value: formatSI(r.limitCurrent, 'A'), note: 'resistive-heating.atServiceTemp' },
          { label: 'resistive-heating.wireMass', value: formatSI(r.mass, 'kg') },
          { label: 'resistive-heating.energyToTarget', value: formatSI(r.energyToTarget, 'J') },
        ]}
      />

      <Warning when={r.overTemp}
        text="resistive-heating.warn1"
        vars={{ maxTemp: toC(material.maxTemp).toFixed(0), label: material.label }}
      />
      <Warning when={!r.reachable}
        text="resistive-heating.warn2"
      />
      <Warning when={materialKey === 'copper'}
        text="resistive-heating.warn3"
      />

      <Theory
        text={[
          'resistive-heating.theory1',
          'resistive-heating.temperatureIsNotThat',
          'resistive-heating.resistanceDriftsWithTemperature',
          'resistive-heating.elementMakersSizeOn',
        ]}
      />
    </SimPage>
  )
}
