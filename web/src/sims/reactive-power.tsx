import { useMemo, useState } from 'react'
import { analyse, traceScale, waveforms } from '../engine/reactivePower'
import type { LoadKind } from '../engine/reactivePower'
import { formatSI } from '../engine/units'
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
      lede="Watch current lag voltage and instantaneous power dip negative. That negative dip is energy the load borrows and hands straight back, which the cable has to carry both ways for nothing. Current and power traces are scaled onto the voltage axis; the readouts carry the true values."
      controls={
        <>
          <Group label="Supply">
            <Param label="Line voltage" unit="V" value={vrms} onChange={setVrms} min={12} max={690} />
            <Param label="Frequency" unit="Hz" value={frequency} onChange={setFrequency} min={16} max={400} log={false} step={1} />
            <Param label="Cable resistance" unit="Ω" value={rLine} onChange={setRLine} min={0.001} max={10} />
          </Group>

          <Group label="Load">
            <Param label="Real power" unit="W" value={p} onChange={setP} min={10} max={500_000} />
            <Segmented
              label="Load type"
              value={kind}
              onChange={setKind}
              options={[
                { value: 'lagging', label: 'Inductive' },
                { value: 'leading', label: 'Capacitive' },
              ]}
            />
            <Param label="Present PF" value={pf} onChange={setPf} min={0.05} max={1} log={false} step={0.01} />
            <Param label="Target PF" value={pfTarget} onChange={setPfTarget} min={0.05} max={1} log={false} step={0.01} />
            <Param label="Cycles shown" value={cycles} onChange={(v) => setCycles(Math.round(v))} min={1} max={8} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'Apparent power S', value: formatSI(r.s, 'VA') },
          { label: 'Real power P', value: formatSI(p, 'W') },
          { label: 'Reactive power Q', value: formatSI(r.q, 'var') },
          { label: 'Phase angle', value: `${r.phiDeg.toFixed(1)}°`, note: kind === 'lagging' ? 'current lags' : 'current leads' },
          { label: 'Line current', value: formatSI(r.irms, 'A') },
          { label: 'Correction needed', value: formatSI(Math.abs(r.qc), 'var'), warn: r.targetTooLow },
          {
            label: r.needsInductor ? 'Shunt inductor' : 'Shunt capacitor',
            value: r.needsInductor ? formatSI(r.inductance, 'H') : formatSI(r.capacitance, 'F'),
          },
          { label: 'Bank reactance', value: formatSI(Math.abs(r.xq), 'Ω') },
          { label: 'Bank voltage rating', value: formatSI(r.capVoltageRating, 'V'), note: 'minimum' },
          { label: 'Current after', value: formatSI(r.irmsAfter, 'A'), note: `${(r.currentReduction * 100).toFixed(1)}% lower` },
          { label: 'Cable loss before', value: formatSI(r.lossBefore, 'W') },
          { label: 'Cable loss after', value: formatSI(r.lossAfter, 'W'), note: `saves ${formatSI(r.lossSaved, 'W')}` },
          { label: 'Peak p(t)', value: formatSI(r.pPeak, 'W') },
          { label: 'Reverse flow peak', value: formatSI(r.pReverse, 'W'), note: 'handed back each cycle' },
          { label: 'Reactive energy / day', value: `${(r.qEnergyDay / 1000).toFixed(1)} kvarh` },
          { label: 'After correction', value: `${(r.qEnergyDayAfter / 1000).toFixed(1)} kvarh` },
        ]}
      />

      {r.targetTooLow && (
        <Warning>
          The target power factor is at or below the present one, so there is nothing to
          correct. Raise the target above {pf.toFixed(2)}.
        </Warning>
      )}
      {r.needsInductor && !r.targetTooLow && (
        <Warning>
          This load already leads, so correcting it needs a shunt <em>inductor</em>, not a
          capacitor. Capacitive loads at scale are unusual: long lightly loaded cables and
          large filter banks are the usual causes.
        </Warning>
      )}
      {r.isMains && (
        <Warning>
          These are mains potentials. A correction capacitor stays charged after
          disconnection and must carry bleed resistors, and it must be rated for at least{' '}
          {formatSI(r.capVoltageRating, 'V')} RMS.
        </Warning>
      )}

      <Theory>
        <p>
          With a sinusoidal supply, <code>S = Vrms·Irms</code>, <code>P = S·cos(phi)</code> and{' '}
          <code>Q = S·sin(phi)</code>. Only P does work. Q is energy shuttled into the load's
          magnetic field and back out every half cycle, and the cable carries it both ways.
        </p>
        <p>
          That is what the negative dip in p(t) on the trace is. Instantaneous power is{' '}
          <code>P + S·cos(2wt - phi)</code>, so it swings <code>P ± S</code>. Once S exceeds
          P, which is exactly when the power factor drops below 1, the trough goes below zero
          and power flows backwards.
        </p>
        <p>
          Correction adds a shunt reactance that supplies Q locally instead of dragging it
          down the cable: <code>Qc = P·(tan(phi1) - tan(phi2))</code>, giving{' '}
          <code>C = Qc / (2·pi·f·V²)</code>. The load still draws the same Q, it just comes
          from a capacitor a metre away rather than a generator miles away.
        </p>
        <p>
          The payoff is I²R. Cable loss falls with the square of current, so dragging power
          factor from 0.75 to 0.95 cuts current by about 21% and cable loss by about 38%. That
          is also why utilities bill industrial sites for reactive power: it occupies their
          conductors without registering on an energy meter.
        </p>
      </Theory>
    </SimPage>
  )
}
