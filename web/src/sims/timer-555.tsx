import { sym } from '../i18n'
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
          { label: 'common.vout', color: TRACE_COLORS[0], samples: w.out },
          { label: 'timer-555.vcap', color: TRACE_COLORS[1], samples: w.cap },
        ],
        items: [
          { label: 'common.frequency', value: formatSI(r.freq, 'Hz') },
          { label: 'common.period', value: formatSI(r.period, 's') },
          { label: 'timer-555.timeHigh', value: formatSI(r.tHigh, 's') },
          { label: 'timer-555.timeLow', value: formatSI(r.tLow, 's') },
          {
            label: 'common.dutyCycle',
            value: `${(r.duty * 100).toFixed(1)}%`,
            note: r.duty > 0.5 ? 'timer-555.always50WithoutA' : undefined,
          },
          { label: 'timer-555.threshold23Vcc', value: formatSI(r.vThreshold, 'V') },
          { label: 'timer-555.trigger13Vcc', value: formatSI(r.vTrigger, 'V') },
          { label: 'common.outputSwing', value: `${r.outputLow.toFixed(2)} to ${r.outputHigh.toFixed(2)} V` },
          { label: 'common.supplyCurrent', value: formatSI(r.supplyCurrent, 'A') },
          {
            label: 'timer-555.pin7PeakSink',
            value: formatSI(r.dischargePeak, 'A'),
            warn: r.dischargeOverload,
          },
        ] as ReadoutItem[],
        warnings: [
          r.supplyOutOfRange && {
            text: 'timer-555.wantsToVAt',
            vars: {
              part: r.spec.label,
              min: r.spec.minSupply,
              max: r.spec.maxSupply,
              vcc: formatSI(vcc, 'V'),
            },
          },
          r.tooFast && {
            text: 'timer-555.pastThePracticalCeiling',
            vars: { ceiling: formatSI(r.spec.maxFrequency, 'Hz') },
          },
          r.dischargeOverload && {
            text: 'timer-555.dischargePinIsAsked',
            vars: {
              peak: formatSI(r.dischargePeak, 'A'),
              rating: formatSI(r.spec.maxDischargeA, 'A'),
            },
          },
          r.biasSuspect && {
            text: 'timer-555.timingResistanceIsHigh',
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
        { label: 'common.vout', color: TRACE_COLORS[0], samples: w.out },
        { label: 'timer-555.vcap', color: TRACE_COLORS[1], samples: w.cap },
        ...(w.trigger ? [{ label: 'timer-555.trig', color: TRACE_COLORS[3], samples: w.trigger }] : []),
      ],
      items: [
        { label: 'common.pulseWidth', value: formatSI(r.pulse, 's') },
        { label: 'common.timeConstant', value: formatSI(r.tau, 's') },
        { label: 'timer-555.recoveryTime', value: formatSI(r.resetTime, 's') },
        { label: 'timer-555.maxRetriggerRate', value: formatSI(r.maxRate, 'Hz') },
        { label: 'timer-555.threshold23Vcc', value: formatSI(r.vThreshold, 'V') },
        { label: 'common.outputSwing', value: `${r.outputLow.toFixed(2)} to ${r.outputHigh.toFixed(2)} V` },
        {
          label: 'timer-555.dischargeCurrent',
          value: formatSI(r.idleCurrent, 'A'),
          warn: r.dischargeOverload,
        },
      ] as ReadoutItem[],
      warnings: [
        r.supplyOutOfRange && {
          text: 'timer-555.wantsToV',
          vars: { part: r.spec.label, min: r.spec.minSupply, max: r.spec.maxSupply },
        },
        r.dischargeOverload && { text: 'timer-555.dischargePinIsOver' },
        r.biasSuspect && {
          text: 'timer-555.timingResistanceIsHigh2',
        },
      ].filter(Boolean) as WarnMsg[],
    }
  }, [mode, variant, vcc, r1, r2, c, rMono, cMono, fromPowerOn, cycles])

  return (
    <SimPage
      id="timer-555"
      lede="timer-555.lede"
      controls={
        <>
          <Segmented
            label="common.mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'astable', label: 'timer-555.astable' },
              { value: 'monostable', label: 'timer-555.monostable' },
            ]}
          />

          <Group label="common.supply">
            <Select
              label="timer-555.variant"
              value={variant}
              onChange={setVariant}
              options={VARIANT_OPTIONS}
            />
            <Param label="timer-555.vcc" unit="V" value={vcc} onChange={setVcc} min={1} max={18} log={false} step={0.1} />
          </Group>

          {mode === 'astable' ? (
            <Group label="timer-555.timingNetwork">
              <Param label={sym('R1')} unit="Ω" value={r1} onChange={setR1} min={100} max={10e6} />
              <Param label={sym('R2')} unit="Ω" value={r2} onChange={setR2} min={100} max={10e6} />
              <Param label={sym('C')} unit="F" value={c} onChange={setC} min={1e-12} max={1e-3} />
              <Param
                label="common.cyclesShown"
                value={cycles}
                onChange={(v) => setCycles(Math.round(v))}
                min={1}
                max={12}
                log={false}
                step={1}
              />
              <Toggle
                label="timer-555.startFromPowerOn"
                value={fromPowerOn}
                onChange={setFromPowerOn}
              />
            </Group>
          ) : (
            <Group label="timer-555.timingNetwork">
              <Param label={sym('R')} unit="Ω" value={rMono} onChange={setRMono} min={100} max={10e6} />
              <Param label={sym('C')} unit="F" value={cMono} onChange={setCMono} min={1e-12} max={1e-3} />
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
          'timer-555.theory1',
          'timer-555.frequencyIs144',
          'timer-555.monostableTimingIs1',
          'timer-555.bothTripPointsScale',
        ]}
      />
    </SimPage>
  )
}
