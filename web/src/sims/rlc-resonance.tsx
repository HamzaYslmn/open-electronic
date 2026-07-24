import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { HIGH_Q_LIMIT, analyse, simulate } from '../engine/rlc'
import type { RLCTopology } from '../engine/rlc'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
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
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 110" aria-label={t('rlc-resonance.rlcNetwork')}>
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
        { label: 'common.vin', color: TRACE_COLORS[0], samples: input },
        { label: 'common.vout', color: TRACE_COLORS[1], samples: vout },
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
      lede="rlc-resonance.lede"
      controls={
        <>
          <Segmented
            label="common.topology"
            value={topology}
            onChange={setTopology}
            options={[
              { value: 'series', label: 'common.series' },
              { value: 'parallel', label: 'common.parallel' },
            ]}
          />
          <Schematic topology={topology} />

          <Group label="common.components">
            <Param label="common.resistor" unit="Ω" value={r} onChange={setR} min={0.01} max={1e6} />
            <Param label="common.inductor" unit="H" value={l} onChange={setL} min={1e-9} max={1} />
            <Param label="common.capacitor" unit="F" value={c} onChange={setC} min={1e-12} max={1e-3} />
          </Group>

          <SourceControls value={source} onChange={patchSource} maxAmplitude={24} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'common.resonanceF0', value: formatSI(readout.f0, 'Hz') },
          {
            label: 'common.qFactor',
            value: readout.q.toFixed(3),
            note: lossyQ ? 'rlc-resonance.idealLAndC' : undefined,
            warn: lossyQ,
          },
          { label: 'common.bandwidth', value: formatSI(readout.bw, 'Hz') },
          {
            label: 'rlc-resonance.dampingZeta',
            value: readout.zeta.toFixed(4),
            note: `(${DAMPING_TEXT[readout.damping]})`,
          },
          {
            label: 'rlc-resonance.ringFrequencyFd',
            value: readout.fd > 0 ? formatSI(readout.fd, 'Hz') : 'common.none',
            note: readout.fd > 0 ? `(${(readout.fd / readout.f0).toFixed(3)} x f0)` : undefined,
            warn: aliased,
          },
          {
            label: 'rlc-resonance.halfPowerBand',
            value: `${formatSI(readout.fLow, 'Hz')} to ${formatSI(readout.fHigh, 'Hz')}`,
          },
          { label: 'rlc-resonance.dampingAlpha', value: formatSI(readout.alpha, 'rad/s') },
          { label: 'common.settlingTo1', value: formatSI(readout.settling, 's') },
          {
            label: 'rlc-resonance.impedanceZ0',
            value: formatSI(readout.z0, 'Ω'),
            note: 'rlc-resonance.sqrtLC',
          },
          {
            label: 'rlc-resonance.rForCritical',
            value: formatSI(readout.rCritical, 'Ω'),
          },
          {
            label: 'rlc-resonance.overshoot',
            value:
              topology === 'series' && readout.damping === 'under'
                ? `${(readout.overshoot * 100).toFixed(1)} %`
                : 'common.none',
          },
          {
            label: 'rlc-resonance.peakVout',
            value: formatSI(peakVout, 'V'),
            note: <T k="rlc-resonance.drive" vars={{ drive: formatSI(drive, 'V') }} />,
            warn: overshootWarn,
          },
          {
            label: 'common.peakCoilCurrent',
            value: formatSI(peakCurrent, 'A'),
            note: 'rlc-resonance.checkIsat',
          },
        ]}
      />

      {overshootWarn && (
        <Warning
          text="rlc-resonance.warn1"
          vars={{ peakVout: formatSI(peakVout, 'V'), drive: formatSI(drive, 'V') }}
        />
      )}

      {lossyQ && (
        <Warning
          text="rlc-resonance.warn2"
          vars={{ HIGH_Q_LIMIT }}
        />
      )}

      {aliased && (
        <Warning
          text="rlc-resonance.warn3"
          vars={{ perRing: perRing.toFixed(1) }}
        />
      )}

      <Theory
        text={[
          'rlc-resonance.theory1',
          'rlc-resonance.rSetsHowFast',
          'rlc-resonance.fromThereBwF0',
          'rlc-resonance.theTraceIsA',
          'rlc-resonance.parallelHereIsDriven',
        ]}
      />
    </SimPage>
  )
}
