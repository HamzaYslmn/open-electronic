import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { HIGH_Q_LIMIT, analyse, simulate } from '../engine/rlc'
import type { RLCTopology } from '../engine/rlc'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'
import SourceControls, { useSource } from '../ui/SourceControls'

/** Samples per sweep, same as every other time-domain page. */
const N = 8192

/** Below this many samples per ring period the scope trace starts to alias. */
const MIN_SAMPLES_PER_RING = 8

const DAMPING_TEXT = {
  under: 'underdamped, it rings',
  critical: 'critically damped, fastest without overshoot',
  over: 'overdamped, no ringing',
} as const

function Schematic({ topology }: { topology: RLCTopology }) {
  const series = topology === 'series'
  return (
    <svg className="schematic" viewBox="0 0 260 110" aria-label={`${topology} RLC network`}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="34" r="10" />
        <path d="M18 34a6 6 0 0 1 12 0M24 24V14M24 44v36h212" />
        <rect x="56" y="26" width="36" height="16" />
        <path d="M34 34h22" />
        {series ? (
          <>
            <path d="M92 34h14" />
            <path d="M106 34a5.5 5.5 0 0 1 11 0a5.5 5.5 0 0 1 11 0a5.5 5.5 0 0 1 11 0a5.5 5.5 0 0 1 11 0" />
            <path d="M150 34h70" />
            <path d="M186 34v12M172 46h28M172 56h28M186 56v24" />
          </>
        ) : (
          <>
            <path d="M92 34h128" />
            <path d="M140 34v10" />
            <path d="M140 44a5.5 5.5 0 0 0 0 11a5.5 5.5 0 0 0 0 11M140 66v14" />
            <path d="M190 34v12M176 46h28M176 56h28M190 56v24" />
          </>
        )}
        <circle cx="220" cy="34" r="3" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="68" y="20">
          R
        </text>
        <text x={series ? 122 : 148} y={series ? 20 : 62}>
          L
        </text>
        <text x={series ? 204 : 208} y="62">
          C
        </text>
        <text x="4" y="60">
          Vin
        </text>
        <text x="200" y="24">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function RLCResonance() {
  const [topology, setTopology] = useState<RLCTopology>('series')
  const [r, setR] = useState(10)
  const [l, setL] = useState(100e-6)
  const [c, setC] = useState(100e-9)
  // Default stimulus is a 0 to 3.3 V step, which is what an ESP32 pin does to a
  // trace with parasitic L and C: that edge is where the ringing comes from.
  const [source, patchSource] = useSource({
    kind: 'dc',
    amplitude: VCC,
    offset: 0,
    frequency: 50e3,
    cycles: 4,
  })

  const { dt, traces, readout, peakVout, peakCurrent } = useMemo(() => {
    const readout = analyse(r, l, c, topology)

    // A step has no period, so window it on the settling time instead. Cap an
    // underdamped ring at 60 cycles so 8192 samples still resolve each one.
    const settleSpan = Math.max(5 * readout.tauDominant, 2 / readout.f0)
    const ringCap = 60 / readout.f0
    const dcSpan =
      readout.damping === 'under' && settleSpan > ringCap ? ringCap : settleSpan

    const { dt, samples: input } = sweep(source, N, source.cycles, dcSpan)
    // Skip the warm-up pass for a step so the transient starts from rest.
    const { vout, current } = simulate(input, dt, r, l, c, topology, source.kind !== 'dc')

    let peakVout = 0
    let peakCurrent = 0
    for (let k = 0; k < N; k++) {
      peakVout = Math.max(peakVout, Math.abs(vout[k]))
      peakCurrent = Math.max(peakCurrent, Math.abs(current[k]))
    }

    return {
      dt,
      traces: [
        { label: 'Vin', color: TRACE_COLORS[0], samples: input },
        { label: 'Vout', color: TRACE_COLORS[1], samples: vout },
      ],
      readout,
      peakVout,
      peakCurrent,
    }
  }, [topology, r, l, c, source])

  const drive = source.kind === 'dc' ? source.amplitude + source.offset : source.amplitude
  const overshootWarn = topology === 'series' && peakVout > 1.5 * Math.abs(drive)
  const lossyQ = readout.q > HIGH_Q_LIMIT
  // Samples per ring period on the current time base.
  const perRing = readout.fd > 0 ? 1 / (readout.fd * dt) : Infinity
  const aliased = perRing < MIN_SAMPLES_PER_RING

  return (
    <SimPage
      id="rlc-resonance"
      lede="Step response of an RLC network. The horizontal axis is time, the trace is the capacitor voltage (series) or the tank node voltage (parallel). Drop R to watch it ring, raise it to damp it out."
      controls={
        <>
          <Segmented
            label="Topology"
            value={topology}
            onChange={setTopology}
            options={[
              { value: 'series', label: 'Series' },
              { value: 'parallel', label: 'Parallel' },
            ]}
          />
          <Schematic topology={topology} />

          <Group label="Components">
            <Param label="Resistor" unit="Ω" value={r} onChange={setR} min={0.01} max={1e6} />
            <Param label="Inductor" unit="H" value={l} onChange={setL} min={1e-9} max={1} />
            <Param label="Capacitor" unit="F" value={c} onChange={setC} min={1e-12} max={1e-3} />
          </Group>

          <SourceControls value={source} onChange={patchSource} maxAmplitude={24} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'Resonance f0', value: formatSI(readout.f0, 'Hz') },
          {
            label: 'Q factor',
            value: readout.q.toFixed(3),
            note: lossyQ ? '(ideal L and C, see below)' : undefined,
            warn: lossyQ,
          },
          { label: 'Bandwidth', value: formatSI(readout.bw, 'Hz') },
          {
            label: 'Damping zeta',
            value: readout.zeta.toFixed(4),
            note: `(${DAMPING_TEXT[readout.damping]})`,
          },
          {
            label: 'Ring frequency fd',
            value: readout.fd > 0 ? formatSI(readout.fd, 'Hz') : 'none',
            note: readout.fd > 0 ? `(${(readout.fd / readout.f0).toFixed(3)} x f0)` : undefined,
            warn: aliased,
          },
          {
            label: 'Half power band',
            value: `${formatSI(readout.fLow, 'Hz')} to ${formatSI(readout.fHigh, 'Hz')}`,
          },
          { label: 'Damping alpha', value: formatSI(readout.alpha, 'rad/s') },
          { label: 'Settling to 1%', value: formatSI(readout.settling, 's') },
          {
            label: 'Impedance Z0',
            value: formatSI(readout.z0, 'Ω'),
            note: '(sqrt(L/C))',
          },
          {
            label: 'R for critical',
            value: formatSI(readout.rCritical, 'Ω'),
          },
          {
            label: 'Overshoot',
            value:
              topology === 'series' && readout.damping === 'under'
                ? `${(readout.overshoot * 100).toFixed(1)} %`
                : 'none',
          },
          {
            label: 'Peak Vout',
            value: formatSI(peakVout, 'V'),
            note: `(drive ${formatSI(drive, 'V')})`,
            warn: overshootWarn,
          },
          {
            label: 'Peak coil current',
            value: formatSI(peakCurrent, 'A'),
            note: '(check Isat)',
          },
        ]}
      />

      {overshootWarn && (
        <Warning>
          The capacitor reaches {formatSI(peakVout, 'V')} on a {formatSI(drive, 'V')} drive.
          An undamped series RLC tops out near 2x the supply, so rate the capacitor and the
          switching device for the peak, not the rail. Add series R or a snubber.
        </Warning>
      )}

      {lossyQ && (
        <Warning>
          Q above {HIGH_Q_LIMIT} assumes a lossless L and C. A real inductor's winding
          resistance and core loss, plus the capacitor ESR, both sit in the loop and will
          hold the measured Q well below this. Add the coil DCR into R for a realistic
          answer.
        </Warning>
      )}

      {aliased && (
        <Warning>
          The scope window holds {perRing.toFixed(1)} samples per ring cycle, so the drawn
          trace is aliased. The numbers above are still exact, they come from closed form,
          not the trace. Shorten the window or raise the source frequency to see the real
          ring.
        </Warning>
      )}

      <Theory>
        <p>
          Resonance is where the two reactances cancel, <code>Xl = Xc</code>, giving
          <code> f0 = 1 / (2·pi·sqrt(L·C))</code>. It does not depend on R.
        </p>
        <p>
          R sets how fast the stored energy leaks away. Series:{' '}
          <code>Q = (1/R)·sqrt(L/C)</code> and <code>alpha = R / (2L)</code>. Parallel:{' '}
          <code>Q = R·sqrt(C/L)</code> and <code>alpha = 1 / (2·R·C)</code>. The two are
          reciprocal about the characteristic impedance <code>Z0 = sqrt(L/C)</code>, so
          series wants R small for a high Q and parallel wants R large.
        </p>
        <p>
          From there, <code>BW = f0 / Q</code>, <code>zeta = 1 / (2Q) = alpha / w0</code> and
          the ring frequency is <code>wd = w0·sqrt(1 - zeta²)</code>. zeta below 1 rings,
          zeta at 1 is critical damping (fastest settle with no overshoot), zeta above 1
          crawls in without ringing. First peak overshoot is
          <code> exp(-pi·zeta / sqrt(1 - zeta²))</code>, which is 100% at zeta = 0 and why a
          lossless step doubles the supply.
        </p>
        <p>
          The trace is a two-state simulation of <code>[Vc, Il]</code> using exact
          zero-order-hold discretisation, <code>x[n+1] = xss + e^(A·dt)·(x[n] - xss)</code>.
          The matrix exponential is closed form, so the solver is exact for a piecewise
          constant drive and stable at any step size. Forward Euler on a resonant
          second-order system diverges as soon as <code>dt &gt; 2/w0</code>.
        </p>
        <p>
          Parallel here is driven Thevenin style, i.e. the source feeds R in series into the
          L-C node. That is the same circuit as a current step <code>Vin/R</code> into
          R || L || C, so the parallel Q applies. Its output decays to zero because the
          inductor is a short at DC.
        </p>
      </Theory>
    </SimPage>
  )
}
