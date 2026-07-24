import { useMemo, useState } from 'react'
import { GPIO_MAX_MA } from '../engine/constants'
import { analyse, peakMagnitude, simulate, timeConstant } from '../engine/rl'
import type { RLMode } from '../engine/rl'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { bandLabel, Dot, Group, Oscilloscope, Param, ReadoutGrid, Schematic, Segmented, SimPage, SourceControls, Theory, useSource, Warning } from '../ui'

/** Samples per sweep, matched to the rest of the scope pages. */
const N = 8192

/** 10% to 90% rise time of a first-order step, ln(9)·tau. */
const RISE_TIME_TAUS = 2.197

function Diagram({ mode }: { mode: RLMode }) {
  const series = mode === 'lowpass' ? 'L' : 'R'
  const shunt = mode === 'lowpass' ? 'R' : 'L'
  return (
    <Schematic viewBox="0 0 260 110" label="rl-filter.rlNetwork">
      <circle cx="24" cy="34" r="10" />
      <path d="M18 34a6 6 0 0 1 12 0M24 44v36h212M34 34h36" />
      {series === 'R' ? (
        <rect x="70" y="26" width="48" height="16" />
      ) : (
        <path d="M70 34a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0" />
      )}
      <path d="M118 34h102" />
      {shunt === 'R' ? (
        <>
          <rect x="142" y="48" width="16" height="30" />
          <path d="M150 34v14M150 78v2" />
        </>
      ) : (
        <path d="M150 46a5 5 0 0 0 0 10a5 5 0 0 0 0 10a5 5 0 0 0 0 10M150 34v12M150 76v4" />
      )}
      <Dot x={150} y={34} />
      <circle cx="224" cy="34" r="3" />
      <text x="88" y="18">
        {series}
      </text>
      <text x="166" y="62">
        {shunt}
      </text>
      <text x="4" y="60">
        Vin
      </text>
      <text x="212" y="24">
        Vout
      </text>
    </Schematic>
  )
}

export default function RLFilter() {
  const [mode, setMode] = useState<RLMode>('lowpass')
  const [r, setR] = useState(1_000)
  const [l, setL] = useState(100e-3)
  const [rw, setRw] = useState(50)
  const [isat, setIsat] = useState(0.5)
  const [source, patchSource] = useSource()

  const { dt, traces, readout, ipk } = useMemo(() => {
    const tau = timeConstant(l, r + rw)
    // A DC step has no period, so window it on the time constant instead:
    // 5 tau is 99.3% settled, which frames the whole current ramp.
    const { dt, samples: input } = sweep(source, N, source.cycles, Math.max(5 * tau, 1e-6))
    // Skip the warm-up pass for a step so the transient stays visible.
    const { current, vR, vL } = simulate(input, dt, r, l, rw, source.kind !== 'dc')
    const out = mode === 'lowpass' ? vR : vL
    const other = mode === 'lowpass' ? vL : vR
    return {
      dt,
      traces: [
        { label: 'common.vin', samples: input },
        { label: 'common.vout', samples: out },
        {
          label: mode === 'lowpass' ? 'V(L)' : 'V(R)',
          samples: other,
        },
      ],
      readout: analyse(r, l, rw, source.frequency, mode),
      ipk: peakMagnitude(current),
    }
  }, [mode, r, l, rw, source])

  const ratio = readout.fc > 0 && Number.isFinite(readout.fc) ? source.frequency / readout.fc : 0
  const pass = mode === 'lowpass' ? ratio < 1 : ratio > 1
  const band = bandLabel(source.kind === 'dc', ratio, pass)

  const saturating = ipk > isat
  const overGpio = ipk * 1000 > GPIO_MAX_MA

  return (
    <SimPage
      id="rl-filter"
      lede="rl-filter.lede"
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
          <Diagram mode={mode} />

          <Group label="common.components">
            <Param label="common.resistor" unit="Ω" value={r} onChange={setR} min={1} max={1e6} />
            <Param label="common.inductor" unit="H" value={l} onChange={setL} min={1e-9} max={10} />
            <Param
              label="rl-filter.windingResistance"
              unit="Ω"
              value={rw}
              onChange={setRw}
              min={1e-3}
              max={1e3}
              hint="rl-filter.coilDcrSlideTo"
            />
            <Param
              label="common.saturationCurrent"
              unit="A"
              value={isat}
              onChange={setIsat}
              min={1e-3}
              max={20}
              hint="rl-filter.datasheetIsatPastThis"
            />
          </Group>

          <SourceControls value={source} onChange={patchSource} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <Warning when={saturating}
        text="rl-filter.warn1"
        vars={{ ipk: formatSI(ipk, 'A'), isat: formatSI(isat, 'A') }}
      />
      <Warning when={overGpio}
        text="rl-filter.warn2"
        vars={{ ipk: formatSI(ipk, 'A'), GPIO_MAX_MA }}
      />

      <ReadoutGrid
        items={[
          {
            label: 'common.cutoffFc',
            value: formatSI(readout.fc, 'Hz'),
            note: <T k="rl-filter.rTotal" vars={{ rTotal: formatSI(readout.rTotal, 'Ω') }} />,
          },
          { label: 'common.timeConstant', value: formatSI(readout.tau, 's') },
          {
            label: 'common.riseTime1090',
            value: formatSI(RISE_TIME_TAUS * readout.tau, 's'),
          },
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
          { label: 'common.reactanceXl', value: formatSI(readout.xl, 'Ω') },
          { label: 'common.sourceLoadZ', value: formatSI(readout.z, 'Ω') },
          {
            label: 'common.peakCoilCurrent',
            value: formatSI(ipk, 'A'),
            note: <T k="rl-filter.isat" vars={{ isat: formatSI(isat, 'A') }} />,
            warn: saturating || overGpio,
          },
          {
            label: mode === 'lowpass' ? 'rl-filter.passbandLossDcr' : 'rl-filter.dcFeedthroughDcr',
            value: Number.isFinite(readout.parasiticDb)
              ? `${readout.parasiticDb.toFixed(2)} dB`
              : 'rl-filter.db',
            warn: mode === 'lowpass' ? readout.parasiticDb < -1 : readout.parasiticDb > -20,
          },
        ]}
      />

      <Theory
        text={[
          'rl-filter.anInductorOpposesA',
          'rl-filter.magnitudeIsHR',
          'rl-filter.windingResistanceIsIn',
          'rl-filter.theScopeTraceIs',
        ]}
      />
    </SimPage>
  )
}
