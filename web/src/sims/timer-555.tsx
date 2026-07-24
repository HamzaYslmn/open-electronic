import { useMemo, useState } from 'react'
import {
  VARIANTS,
  analyseAstable,
  analyseMonostable,
  simulateAstable,
  simulateMonostable,
} from '../engine/timer555'
import type { Timer555Mode, Timer555Variant } from '../engine/timer555'
import { VCC_5V } from '../engine/constants'
import { formatSI } from '../engine/units'
import { Group, Segmented, Select, Toggle } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import type { ReadoutItem, WarnMsg } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 8192

const VARIANT_OPTIONS = (Object.keys(VARIANTS) as Timer555Variant[]).map((value) => ({
  value,
  label: VARIANTS[value].label,
}))

export default function Timer555() {
  const [mode, setMode] = useState<Timer555Mode>('astable')
  const [variant, setVariant] = useState<Timer555Variant>('bipolar')
  // The classic NE555 wants 4.5 V or more, so this is one of the few pages that
  // does not default to the 3.3 V rail. The CMOS variant does run from 3.3 V.
  const [vcc, setVcc] = useState(VCC_5V)
  const [r1, setR1] = useState(10_000)
  const [r2, setR2] = useState(47_000)
  const [c, setC] = useState(1e-6)
  const [rMono, setRMono] = useState(100_000)
  const [cMono, setCMono] = useState(1e-6)
  const [fromPowerOn, setFromPowerOn] = useState(false)
  const [cycles, setCycles] = useState(3)

  const { dt, traces, items, warnings } = useMemo(() => {
    if (mode === 'astable') {
      const p = { vcc, r1, r2, c, variant }
      const r = analyseAstable(p)
      const span = r.period > 0 && Number.isFinite(r.period) ? r.period * cycles : 1e-3
      const w = simulateAstable(p, N, span, fromPowerOn)
      return {
        dt: w.dt,
        traces: [
          { label: 'Vout', color: TRACE_COLORS[0], samples: w.out },
          { label: 'Vcap', color: TRACE_COLORS[1], samples: w.cap },
        ],
        items: [
          { label: 'Frequency', value: formatSI(r.freq, 'Hz') },
          { label: 'Period', value: formatSI(r.period, 's') },
          { label: 'Time high', value: formatSI(r.tHigh, 's') },
          { label: 'Time low', value: formatSI(r.tLow, 's') },
          {
            label: 'Duty cycle',
            value: `${(r.duty * 100).toFixed(1)}%`,
            note: r.duty > 0.5 ? '(always >50% without a diode)' : undefined,
          },
          { label: 'Threshold 2/3 Vcc', value: formatSI(r.vThreshold, 'V') },
          { label: 'Trigger 1/3 Vcc', value: formatSI(r.vTrigger, 'V') },
          { label: 'Output swing', value: `${r.outputLow.toFixed(2)} to ${r.outputHigh.toFixed(2)} V` },
          { label: 'Supply current', value: formatSI(r.supplyCurrent, 'A') },
          {
            label: 'Pin 7 peak sink',
            value: formatSI(r.dischargePeak, 'A'),
            warn: r.dischargeOverload,
          },
        ] as ReadoutItem[],
        warnings: [
          r.supplyOutOfRange && {
            text: '{part} wants {min} to {max} V. At {vcc} the timing is not trustworthy.',
            vars: {
              part: r.spec.label,
              min: r.spec.minSupply,
              max: r.spec.maxSupply,
              vcc: formatSI(vcc, 'V'),
            },
          },
          r.tooFast && {
            text: 'Past the practical ceiling of about {ceiling} for this variant. Propagation delay starts to dominate the RC timing.',
            vars: { ceiling: formatSI(r.spec.maxFrequency, 'Hz') },
          },
          r.dischargeOverload && {
            text: 'Discharge pin is asked to sink {peak}, over its {rating} rating. Raise R1.',
            vars: {
              peak: formatSI(r.dischargePeak, 'A'),
              rating: formatSI(r.spec.maxDischargeA, 'A'),
            },
          },
          r.biasSuspect && {
            text: 'Timing resistance is high enough that threshold bias current shifts the result. Use larger C and smaller R.',
          },
        ].filter(Boolean) as WarnMsg[],
      }
    }

    // The trigger has to be shorter than the pulse it starts, otherwise the 555
    // stays held and the output width is set by the trigger, not by R and C.
    // Scale both off the nominal 1.1·R·C so they stay sane at any timing.
    const nominal = 1.1 * rMono * cMono
    const p = {
      vcc,
      r: rMono,
      c: cMono,
      variant,
      triggerWidth: nominal * 0.05,
      triggerDelay: nominal * 0.15,
    }
    const r = analyseMonostable(p)
    const span = Number.isFinite(r.pulse) && r.pulse > 0 ? r.pulse * 2.5 : 1e-3
    const w = simulateMonostable(p, N, span)
    return {
      dt: w.dt,
      traces: [
        { label: 'Vout', color: TRACE_COLORS[0], samples: w.out },
        { label: 'Vcap', color: TRACE_COLORS[1], samples: w.cap },
        ...(w.trigger ? [{ label: 'Trig', color: TRACE_COLORS[3], samples: w.trigger }] : []),
      ],
      items: [
        { label: 'Pulse width', value: formatSI(r.pulse, 's') },
        { label: 'Time constant', value: formatSI(r.tau, 's') },
        { label: 'Recovery time', value: formatSI(r.resetTime, 's') },
        { label: 'Max retrigger rate', value: formatSI(r.maxRate, 'Hz') },
        { label: 'Threshold 2/3 Vcc', value: formatSI(r.vThreshold, 'V') },
        { label: 'Output swing', value: `${r.outputLow.toFixed(2)} to ${r.outputHigh.toFixed(2)} V` },
        {
          label: 'Discharge current',
          value: formatSI(r.idleCurrent, 'A'),
          warn: r.dischargeOverload,
        },
      ] as ReadoutItem[],
      warnings: [
        r.supplyOutOfRange && {
          text: '{part} wants {min} to {max} V.',
          vars: { part: r.spec.label, min: r.spec.minSupply, max: r.spec.maxSupply },
        },
        r.dischargeOverload && { text: 'Discharge pin is over its sink rating. Raise R.' },
        r.biasSuspect && {
          text: 'Timing resistance is high enough that threshold bias current shifts the result.',
        },
      ].filter(Boolean) as WarnMsg[],
    }
  }, [mode, variant, vcc, r1, r2, c, rMono, cMono, fromPowerOn, cycles])

  return (
    <SimPage
      id="timer-555"
      lede="The 555 in its two classic configurations. The scope shows the output pin against the capacitor voltage, so you can watch it ramp between the 1/3 and 2/3 Vcc trip points."
      controls={
        <>
          <Segmented
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'astable', label: 'Astable' },
              { value: 'monostable', label: 'Monostable' },
            ]}
          />

          <Group label="Supply">
            <Select
              label="Variant"
              value={variant}
              onChange={setVariant}
              options={VARIANT_OPTIONS}
            />
            <Param label="Vcc" unit="V" value={vcc} onChange={setVcc} min={1} max={18} log={false} step={0.1} />
          </Group>

          {mode === 'astable' ? (
            <Group label="Timing network">
              <Param label="R1" unit="Ω" value={r1} onChange={setR1} min={100} max={10e6} />
              <Param label="R2" unit="Ω" value={r2} onChange={setR2} min={100} max={10e6} />
              <Param label="C" unit="F" value={c} onChange={setC} min={1e-12} max={1e-3} />
              <Param
                label="Cycles shown"
                value={cycles}
                onChange={(v) => setCycles(Math.round(v))}
                min={1}
                max={12}
                log={false}
                step={1}
              />
              <Toggle
                label="Start from power on"
                value={fromPowerOn}
                onChange={setFromPowerOn}
              />
            </Group>
          ) : (
            <Group label="Timing network">
              <Param label="R" unit="Ω" value={rMono} onChange={setRMono} min={100} max={10e6} />
              <Param label="C" unit="F" value={cMono} onChange={setCMono} min={1e-12} max={1e-3} />
            </Group>
          )}
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />
      <ReadoutGrid items={items} />
      {warnings.map((w, i) => (
        <Warning key={i} text={w.text} vars={w.vars} />
      ))}

      <Theory
        text={[
          "The capacitor charges through R1+R2 toward Vcc and discharges through R2 alone, so the high time `0.693·(R1+R2)·C` is always longer than the low time `0.693·R2·C`. That is why a plain astable can never reach 50% duty: you need a diode across R2 to let it charge through R1 only.",
          "Frequency is `1.44 / ((R1 + 2·R2)·C)`. The 0.693 is ln2, from the capacitor crossing between the 1/3 and 2/3 Vcc comparator trip points, which is a factor of two in the remaining distance to the rail.",
          "Monostable timing is `1.1·R·C`, where 1.1 is ln3: the capacitor starts at 0 V rather than 1/3 Vcc, so it covers more of the exponential.",
          "Both trip points scale with Vcc, which is why the timing is supply independent to first order. The trace is simulated with the same exact zero-order-hold relaxation used elsewhere in this app, not drawn from the formula, so the power-on first cycle really does run ln3 long instead of ln2.",
        ]}
      />
    </SimPage>
  )
}
