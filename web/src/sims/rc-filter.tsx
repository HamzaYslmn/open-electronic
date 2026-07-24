import { useMemo, useState } from 'react'
import { analyse, simulate, timeConstant } from '../engine/rc'
import type { RCMode } from '../engine/rc'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory } from '../ui/Readout'
import SimPage from '../ui/SimPage'
import SourceControls, { useSource } from '../ui/SourceControls'

/** Samples per sweep. Well past the pixel width, so zooming reveals real detail. */
const N = 8192

function Schematic({ mode }: { mode: RCMode }) {
  const [first, second] = mode === 'lowpass' ? ['R', 'C'] : ['C', 'R']
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 110" aria-label={t('rc-filter.rcNetwork')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="34" r="10" />
        <path d="M18 34a6 6 0 0 1 12 0M24 24V14M24 44v36h212M34 34h36" />
        {first === 'R' ? (
          <rect x="70" y="26" width="44" height="16" />
        ) : (
          <path d="M84 20v28M96 20v28" />
        )}
        <path d={first === 'R' ? 'M114 34h46' : 'M70 34h14M96 34h64'} />
        <path d="M160 34h60" />
        {second === 'C' ? (
          <path d="M150 46v10M136 56h28M136 66h28M150 66v14" />
        ) : (
          <rect x="142" y="48" width="16" height="30" />
        )}
        <path d={second === 'C' ? 'M150 34v12' : 'M150 34v14M150 78v2'} />
        <circle cx="224" cy="34" r="3" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="86" y="18">
          {first}
        </text>
        <text x="166" y="62">
          {second}
        </text>
        <text x="4" y="60">
          Vin
        </text>
        <text x="212" y="24">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function RCFilter() {
  const [mode, setMode] = useState<RCMode>('lowpass')
  const [r, setR] = useState(1_000)
  const [c, setC] = useState(100e-9)
  const [source, patchSource] = useSource()

  const { dt, traces, readout } = useMemo(() => {
    const tau = timeConstant(r, c)
    // A DC step has no period, so window it on the time constant instead:
    // 5 tau is 99.3% settled, which frames the whole charging curve.
    const { dt, samples: input } = sweep(source, N, source.cycles, Math.max(5 * tau, 1e-6))
    // Skip the warm-up pass for a step so the transient stays visible.
    const output = simulate(input, dt, tau, mode, source.kind !== 'dc')
    return {
      dt,
      traces: [
        { label: 'common.vin', color: TRACE_COLORS[0], samples: input },
        { label: 'common.vout', color: TRACE_COLORS[1], samples: output },
      ],
      readout: analyse(r, c, source.frequency, mode),
    }
  }, [mode, r, c, source])

  const ratio = readout.fc > 0 ? source.frequency / readout.fc : 0
  const pass = mode === 'lowpass' ? ratio < 1 : ratio > 1
  // Parenthesised here rather than in the note, so the whole phrase is one
  // dictionary key instead of a fragment glued to punctuation.
  const band =
    source.kind === 'dc'
      ? '(step response)'
      : ratio < 0.1 || ratio > 10
        ? pass
          ? '(deep in the passband)'
          : '(deep in the stopband)'
        : '(near the corner)'

  return (
    <SimPage
      id="rc-filter"
      lede="rc-filter.lede"
      controls={
        <>
          <Segmented
            label="common.filterTopology"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'lowpass', label: 'common.lowPass' },
              { value: 'highpass', label: 'common.highPass' },
            ]}
          />
          <Schematic mode={mode} />

          <Group label="common.components">
            <Param label="common.resistor" unit="Ω" value={r} onChange={setR} min={1} max={10e6} />
            <Param
              label="common.capacitor"
              unit="F"
              value={c}
              onChange={setC}
              min={1e-12}
              max={1e-3}
            />
          </Group>

          <SourceControls value={source} onChange={patchSource} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'common.cutoffFc', value: formatSI(readout.fc, 'Hz') },
          { label: 'common.timeConstant', value: formatSI(readout.tau, 's') },
          { label: 'common.riseTime1090', value: formatSI(2.197 * readout.tau, 's') },
          {
            label: <T k="common.gainAt" vars={{ frequency: formatSI(source.frequency, 'Hz') }} />,
            value: `${readout.gainDb.toFixed(2)} dB`,
            note: `(${readout.gain.toFixed(4)}x)`,
          },
          { label: 'common.phaseShift', value: `${readout.phase.toFixed(1)}°` },
          {
            label: 'common.fFc',
            value: ratio < 0.01 ? ratio.toExponential(1) : ratio.toFixed(2),
            note: band,
          },
          { label: 'rc-filter.reactanceXc', value: formatSI(readout.xc, 'Ω') },
          { label: 'common.sourceLoadZ', value: formatSI(readout.z, 'Ω') },
        ]}
      />

      <Theory
        text={[
          'rc-filter.cutoffIsWhereThe',
          'rc-filter.magnitudeIsH1',
          'rc-filter.theScopeTraceIs',
        ]}
      />
    </SimPage>
  )
}
