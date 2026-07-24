import { useMemo, useState } from 'react'
import { T_AMBIENT_K, VCC, VCC_5V } from '../engine/constants'
import {
  analyse,
  celsiusToKelvin,
  kelvinToCelsius,
  linearRegulatorPower,
  simulate,
} from '../engine/thermal'
import type { ThermalChain } from '../engine/thermal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Segmented, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per warm-up sweep, same buffer depth as every other page. */
const N = 8192

/** Below this the part is comfortable to touch. Above it, it marks skin. */
const TOUCH_LIMIT_C = 60

/** Junction margin to design for. Datasheet limits are absolute maximums. */
const MARGIN_TARGET_K = 20

/**
 * Typical thermal figures for common packages, not a substitute for the
 * datasheet of the part actually on your board. For an unheatsinked device the
 * "sink" leg is the package's own path to air, i.e. Rsa = Rja - Rjc with no
 * interface, which is how the free-air entries below are built.
 */
const PACKAGES = [
  {
    value: 'sot223',
    label: 'SOT-223 (AMS1117) on copper pour',
    rjc: 15,
    rcs: 0.01,
    rsa: 45,
    cth: 2,
  },
  { value: 'sot23', label: 'SOT-23 small signal, free air', rjc: 75, rcs: 0.01, rsa: 175, cth: 0.3 },
  { value: 'dpak', label: 'DPAK on 1 sq inch copper', rjc: 3, rcs: 0.01, rsa: 47, cth: 3 },
  { value: 'to220-air', label: 'TO-220 bare, free air', rjc: 5, rcs: 0.01, rsa: 60, cth: 2 },
  { value: 'to220-sink', label: 'TO-220 bolted to a small sink', rjc: 5, rcs: 0.5, rsa: 5, cth: 20 },
  { value: 'to247-sink', label: 'TO-247 on a large sink', rjc: 0.7, rcs: 0.3, rsa: 1, cth: 200 },
] as const

type PackageId = (typeof PACKAGES)[number]['value']

const degC = (k: number) => `${kelvinToCelsius(k).toFixed(1)} °C`

export default function ThermalDesign() {
  const [mode, setMode] = useState<'ldo' | 'watts'>('ldo')
  const [watts, setWatts] = useState(2)
  // 5 V is genuine here: a USB rail feeding a 3.3 V regulator is the standard
  // ESP32 board topology, and the drop across it is the whole point.
  const [vin, setVin] = useState(VCC_5V)
  const [vout, setVout] = useState(VCC)
  const [iout, setIout] = useState(0.5)

  const [pkg, setPkg] = useState<PackageId>('sot223')
  const [rjc, setRjc] = useState(15)
  const [rcs, setRcs] = useState(0.01)
  const [rsa, setRsa] = useState(45)
  const [cth, setCth] = useState(2)

  const [ambientC, setAmbientC] = useState(kelvinToCelsius(T_AMBIENT_K))
  const [tjMaxC, setTjMaxC] = useState(125)

  const loadPackage = (id: PackageId) => {
    setPkg(id)
    const p = PACKAGES.find((x) => x.value === id)
    if (!p) return
    setRjc(p.rjc)
    setRcs(p.rcs)
    setRsa(p.rsa)
    setCth(p.cth)
  }

  const { dt, traces, r, power, efficiency } = useMemo(() => {
    const power = mode === 'ldo' ? linearRegulatorPower(vin, vout, iout) : watts
    const chain: ThermalChain = {
      power,
      ambient: celsiusToKelvin(ambientC),
      rjc,
      rcs,
      rsa,
      tjMax: celsiusToKelvin(tjMaxC),
    }
    const r = analyse(chain, cth)

    // Window on five thermal time constants, 99.3% of the way to steady state.
    const span = Math.max(5 * r.tau, 1)
    const dt = span / N
    const t = simulate(chain, cth, N, dt)
    const limit = new Float64Array(N).fill(tjMaxC)
    const pOut = vout * iout

    return {
      dt,
      power,
      r,
      efficiency: pOut > 0 ? pOut / (pOut + power) : 0,
      traces: [
        { label: 'Tj', color: TRACE_COLORS[1], samples: t.tj.map(kelvinToCelsius), quiet: true },
        { label: 'Tcase', color: TRACE_COLORS[0], samples: t.tc.map(kelvinToCelsius), quiet: true },
        { label: 'Tsink', color: TRACE_COLORS[2], samples: t.ts.map(kelvinToCelsius), quiet: true },
        { label: 'Tj max', color: TRACE_COLORS[4], samples: limit, quiet: true },
      ],
    }
  }, [mode, watts, vin, vout, iout, rjc, rcs, rsa, cth, ambientC, tjMaxC])

  return (
    <SimPage
      id="thermal-design"
      lede="Junction temperature through the Rjc, Rcs, Rsa chain. The scope shows the warm-up from a cold start, so the horizontal axis is time in seconds, not a waveform: the die steps up instantly and then rides the heatsink as it soaks."
      controls={
        <>
          <Segmented
            label="Where the heat comes from"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'ldo', label: 'Linear regulator' },
              { value: 'watts', label: 'Direct watts' },
            ]}
          />

          {mode === 'ldo' ? (
            <Group label="Regulator">
              <Param
                label="Input"
                unit="V"
                value={vin}
                onChange={setVin}
                min={1}
                max={40}
                log={false}
                step={0.1}
              />
              <Param
                label="Output"
                unit="V"
                value={vout}
                onChange={setVout}
                min={0.8}
                max={24}
                log={false}
                step={0.1}
              />
              <Param
                label="Load current"
                unit="A"
                value={iout}
                onChange={setIout}
                min={1e-3}
                max={5}
                hint="ESP32 peaks near 500 mA on a WiFi transmit burst."
              />
            </Group>
          ) : (
            <Group label="Load">
              <Param label="Dissipation" unit="W" value={watts} onChange={setWatts} min={0.01} max={500} />
            </Group>
          )}

          <Group label="Thermal path">
            <Select
              label="Load typical package"
              value={pkg}
              onChange={loadPackage}
              options={PACKAGES}
            />
            <Param
              label="Rjc junction to case"
              unit="K/W"
              value={rjc}
              onChange={setRjc}
              min={0.05}
              max={200}
            />
            <Param
              label="Rcs interface"
              unit="K/W"
              value={rcs}
              onChange={setRcs}
              min={0.01}
              max={10}
              hint="Grease 0.2, pad 0.5, dry contact 1.0 on a TO-220. Use 0.01 for a soldered tab."
            />
            <Param
              label="Rsa sink to air"
              unit="K/W"
              value={rsa}
              onChange={setRsa}
              min={0.1}
              max={500}
            />
            <Param
              label="Sink heat capacity"
              unit="J/K"
              value={cth}
              onChange={setCth}
              min={0.1}
              max={10000}
              hint="Mass times specific heat. Aluminium is 897 J/(kg·K), so 20 g is 18 J/K."
            />
          </Group>

          <Group label="Limits">
            <Param
              label="Ambient"
              unit="°C"
              value={ambientC}
              onChange={setAmbientC}
              min={-40}
              max={85}
              log={false}
              step={1}
              hint="Inside a sealed enclosure, 20 K above the room is normal."
            />
            <Param
              label="Tj max"
              unit="°C"
              value={tjMaxC}
              onChange={setTjMaxC}
              min={85}
              max={200}
              log={false}
              step={5}
              hint="125 °C for most silicon, 150 to 175 °C for power MOSFETs."
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="°C" />

      <ReadoutGrid
        items={[
          {
            label: 'Junction Tj',
            value: degC(r.tj),
            note: <T k="({rise} K over ambient)" vars={{ rise: r.rise.toFixed(1) }} />,
            warn: r.overTemp,
          },
          { label: 'Case Tc', value: degC(r.tc) },
          {
            label: 'Sink Ts',
            value: degC(r.ts),
            note:
              kelvinToCelsius(r.ts) > TOUCH_LIMIT_C ? '(will burn on contact)' : '(safe to touch)',
          },
          {
            label: 'Dissipation',
            value: formatSI(power, 'W'),
            note: mode === 'ldo' ? <T k="({efficiency}% efficient)" vars={{ efficiency: (efficiency * 100).toFixed(0) }} /> : undefined,
          },
          { label: 'Rth junction to air', value: formatSI(r.rTotal, 'K/W') },
          {
            label: 'Margin to Tj max',
            value: `${r.margin.toFixed(1)} K`,
            note: r.margin >= MARGIN_TARGET_K ? undefined : <T k="(aim for {MARGIN_TARGET_K} K)" vars={{ MARGIN_TARGET_K }} />,
            warn: r.margin < MARGIN_TARGET_K,
          },
          {
            label: 'Rsa required',
            value: r.sinkImpossible ? 'none exists' : formatSI(r.requiredRsa, 'K/W'),
            note: <T k="(to sit on {tjMaxC} °C)" vars={{ tjMaxC: tjMaxC.toFixed(0) }} />,
            warn: r.sinkImpossible,
          },
          {
            label: 'Power ceiling',
            value: formatSI(r.maxPower, 'W'),
            note: <T k="(at {ambientC} °C ambient)" vars={{ ambientC: ambientC.toFixed(0) }} />,
          },
          {
            label: 'Budget used',
            value: `${(r.utilisation * 100).toFixed(0)}%`,
            note: '(of the ambient to Tj max span)',
            warn: r.utilisation > 1,
          },
          {
            label: 'Sink time constant',
            value: formatSI(r.tau, 's'),
            note: '(63% of the rise)',
          },
        ]}
      />

      {r.overTemp && r.sinkImpossible && (
        <Warning
          text="{tj} junction against a {tjMaxC} °C limit, and Rjc + Rcs alone already spend the whole budget at {power}. No heatsink can fix this: cut the dissipation below {maxPower}, improve the mounting, or move to a package with a lower Rjc."
          vars={{
            tj: degC(r.tj),
            tjMaxC: tjMaxC.toFixed(0),
            power: formatSI(power, 'W'),
            maxPower: formatSI(r.maxPower, 'W'),
          }}
        />
      )}
      {r.overTemp && !r.sinkImpossible && (
        <Warning
          text="{tj} junction against a {tjMaxC} °C limit. Needs a sink of {requiredRsa} or better just to reach the limit, so target roughly {e} for {MARGIN_TARGET_K} K of margin, or drop the power below {maxPower}."
          vars={{
            tj: degC(r.tj),
            tjMaxC: tjMaxC.toFixed(0),
            requiredRsa: formatSI(r.requiredRsa, 'K/W'),
            e: formatSI(Math.max(0, r.requiredRsa - MARGIN_TARGET_K / Math.max(power, 1e-9)), 'K/W'),
            MARGIN_TARGET_K,
            maxPower: formatSI(r.maxPower, 'W'),
          }}
        />
      )}
      {!r.overTemp && r.margin < MARGIN_TARGET_K && (
        <Warning
          text="Only {margin} K of margin. Tj max is an absolute maximum, not an operating point: leave {MARGIN_TARGET_K} K or more for part spread, a hot enclosure and a blocked airflow path."
          vars={{ margin: r.margin.toFixed(1), MARGIN_TARGET_K }}
        />
      )}
      {mode === 'ldo' && vout > vin && (
        <Warning
          text="Output is above the input, so this regulator is in dropout and the model does not apply. A linear regulator can only step down."
        />
      )}

      <Theory
        text={[
          "Heat flow is the electrical analogy: power is current, temperature rise is voltage, thermal resistance in K/W is resistance. The three legs sit in series, so `Tj = Ta + P·(Rjc + Rcs + Rsa)`. Rjc comes from the package, Rcs from the mounting interface, Rsa from the heatsink and the air moving over it.",
          "Turn it round to size the sink: `Rsa_required = (Tjmax - Ta)/P - Rjc - Rcs`. If that is zero or negative the package and the interface have already used the whole budget, and no heatsink helps. The matching power ceiling is `Pmax = (Tjmax - Ta)/Rth(j-a)`.",
          "A kelvin and a degree Celsius are the same size, so every resistance, rise and margin on this page is identical in either scale. Only the absolute temperatures differ.",
          "The trace is a transient, not a waveform. The sink carries essentially all the heat capacity, so it is the single pole: `tau = Rsa·Cth` and `Ts(t) = Ts(∞) + (Ta - Ts(∞))·e^(-t/tau)`, integrated with the same exact zero-order-hold step the RC page uses so it stays stable at any dt. The die and the interface hold almost no heat next to a lump of aluminium, so on this time base the junction just sits `P·(Rjc + Rcs)` above the sink, which is why it jumps at t = 0 and then crawls. Real sinks are multi-pole, so treat the early part of the curve as indicative and the endpoint as the answer.",
          "A linear regulator throws the whole voltage difference away as heat: `P = (Vin - Vout)·Iout + Vin·Iq`. Dropping 5 V to 3.3 V at 500 mA burns 0.85 W, which is why a bare SOT-223 AMS1117 runs hot on an ESP32 board and a switching regulator does not.",
        ]}
      />
    </SimPage>
  )
}
