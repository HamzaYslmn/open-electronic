import { useMemo, useState } from 'react'
import { analyse, traceScale, waveforms } from '../engine/reactivePower'
import type { LoadKind } from '../engine/reactivePower'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 4096

export default function ReactivePower() {
  // Power factor correction is a mains problem, so this page is one of the few
  // that does not default to the 3.3 V rail.
  const [vrms, setVrms] = useState(230)
  const [frequency, setFrequency] = useState(50)
  const [p, setP] = useState(3000)
  const [pf, setPf] = useState(0.75)
  const [pfTarget, setPfTarget] = useState(0.95)
  const [kind, setKind] = useState<LoadKind>('lagging')
  const [rLine, setRLine] = useState(0.2)
  const [cycles, setCycles] = useState(2)

  const { r, traces, dt } = useMemo(() => {
    const r = analyse({ vrms, frequency, p, pf, pfTarget, kind, rLine })
    const w = waveforms(vrms, frequency, r.irms, r.phi, r.iq, N, cycles)
    // v, i and p have wildly different magnitudes, so scale the current and
    // power traces onto the voltage axis. The readouts carry the real numbers.
    const iScale = traceScale(r.vPeak, Math.SQRT2 * r.irms)
    const pScale = traceScale(r.vPeak, r.pPeak)
    return {
      r,
      dt: w.dt,
      traces: [
        { label: 'v', color: TRACE_COLORS[0], samples: w.v },
        { label: `i x${iScale.toFixed(0)}`, color: TRACE_COLORS[1], samples: w.iLoad.map((x) => x * iScale) },
        { label: `p x${pScale.toPrecision(2)}`, color: TRACE_COLORS[3], samples: w.p.map((x) => x * pScale) },
      ],
    }
  }, [vrms, frequency, p, pf, pfTarget, kind, rLine, cycles])

  return (
    <SimPage
      id="reactive-power"
      lede="reactive-power.lede"
      controls={
        <>
          <Group label="common.supply">
            <Param label="reactive-power.lineVoltage" unit="V" value={vrms} onChange={setVrms} min={12} max={690} />
            <Param label="common.frequency" unit="Hz" value={frequency} onChange={setFrequency} min={16} max={400} log={false} step={1} />
            <Param label="reactive-power.cableResistance" unit="Ω" value={rLine} onChange={setRLine} min={0.001} max={10} />
          </Group>

          <Group label="common.load">
            <Param label="reactive-power.realPower" unit="W" value={p} onChange={setP} min={10} max={500_000} />
            <Segmented
              label="common.loadType"
              value={kind}
              onChange={setKind}
              options={[
                { value: 'lagging', label: 'reactive-power.inductive' },
                { value: 'leading', label: 'reactive-power.capacitive' },
              ]}
            />
            <Param label="reactive-power.presentPf" value={pf} onChange={setPf} min={0.05} max={1} log={false} step={0.01} />
            <Param label="reactive-power.targetPf" value={pfTarget} onChange={setPfTarget} min={0.05} max={1} log={false} step={0.01} />
            <Param label="common.cyclesShown" value={cycles} onChange={(v) => setCycles(Math.round(v))} min={1} max={8} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'reactive-power.apparentPowerS', value: formatSI(r.s, 'VA') },
          { label: 'reactive-power.realPowerP', value: formatSI(p, 'W') },
          { label: 'reactive-power.reactivePowerQ', value: formatSI(r.q, 'var') },
          { label: 'reactive-power.phaseAngle', value: `${r.phiDeg.toFixed(1)}°`, note: kind === 'lagging' ? 'reactive-power.currentLags' : 'reactive-power.currentLeads' },
          { label: 'reactive-power.lineCurrent', value: formatSI(r.irms, 'A') },
          { label: 'reactive-power.correctionNeeded', value: formatSI(Math.abs(r.qc), 'var'), warn: r.targetTooLow },
          {
            label: r.needsInductor ? 'reactive-power.shuntInductor' : 'reactive-power.shuntCapacitor',
            value: r.needsInductor ? formatSI(r.inductance, 'H') : formatSI(r.capacitance, 'F'),
          },
          { label: 'reactive-power.bankReactance', value: formatSI(Math.abs(r.xq), 'Ω') },
          { label: 'reactive-power.bankVoltageRating', value: formatSI(r.capVoltageRating, 'V'), note: 'reactive-power.minimum' },
          { label: 'reactive-power.currentAfter', value: formatSI(r.irmsAfter, 'A'), note: <T k="reactive-power.lower" vars={{ currentReduction: (r.currentReduction * 100).toFixed(1) }} /> },
          { label: 'reactive-power.cableLossBefore', value: formatSI(r.lossBefore, 'W') },
          { label: 'reactive-power.cableLossAfter', value: formatSI(r.lossAfter, 'W'), note: <T k="reactive-power.saves" vars={{ lossSaved: formatSI(r.lossSaved, 'W') }} /> },
          { label: 'reactive-power.peakPT', value: formatSI(r.pPeak, 'W') },
          { label: 'reactive-power.reverseFlowPeak', value: formatSI(r.pReverse, 'W'), note: 'reactive-power.handedBackEachCycle' },
          { label: 'reactive-power.reactiveEnergyDay', value: `${(r.qEnergyDay / 1000).toFixed(1)} kvarh` },
          { label: 'reactive-power.afterCorrection', value: `${(r.qEnergyDayAfter / 1000).toFixed(1)} kvarh` },
        ]}
      />

      {r.targetTooLow && (
        <Warning
          text="reactive-power.warn1"
          vars={{ pf: pf.toFixed(2) }}
        />
      )}
      {r.needsInductor && !r.targetTooLow && (
        <Warning
          text="reactive-power.warn2"
        />
      )}
      {r.isMains && (
        <Warning
          text="reactive-power.warn3"
          vars={{ capVoltageRating: formatSI(r.capVoltageRating, 'V') }}
        />
      )}

      <Theory
        text={[
          'reactive-power.theory1',
          'reactive-power.thatIsWhatThe',
          'reactive-power.correctionAddsAShunt',
          'reactive-power.thePayoffIsI',
        ]}
      />
    </SimPage>
  )
}
