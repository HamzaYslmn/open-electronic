import { useMemo, useState } from 'react'
import { analyse, simulate, timeConstant } from '../engine/rc'
import type { RCMode } from '../engine/rc'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
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
  return (
    <svg className="schematic" viewBox="0 0 260 110" aria-label={`${mode} RC network`}>
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
        { label: 'Vin', color: TRACE_COLORS[0], samples: input },
        { label: 'Vout', color: TRACE_COLORS[1], samples: output },
      ],
      readout: analyse(r, c, source.frequency, mode),
    }
  }, [mode, r, c, source])

  const ratio = readout.fc > 0 ? source.frequency / readout.fc : 0
  const pass = mode === 'lowpass' ? ratio < 1 : ratio > 1
  const band =
    source.kind === 'dc'
      ? 'step response'
      : ratio < 0.1 || ratio > 10
        ? pass
          ? 'deep in the passband'
          : 'deep in the stopband'
        : 'near the corner'

  return (
    <SimPage
      id="rc-filter"
      lede="A resistor and a capacitor: the most common filter in electronics. Adjust anything and the scope updates immediately."
      controls={
        <>
          <Segmented
            label="Filter topology"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'lowpass', label: 'Low pass' },
              { value: 'highpass', label: 'High pass' },
            ]}
          />
          <Schematic mode={mode} />

          <Group label="Components">
            <Param label="Resistor" unit="Ω" value={r} onChange={setR} min={1} max={10e6} />
            <Param
              label="Capacitor"
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
          { label: 'Cutoff fc', value: formatSI(readout.fc, 'Hz') },
          { label: 'Time constant', value: formatSI(readout.tau, 's') },
          { label: 'Rise time (10-90%)', value: formatSI(2.197 * readout.tau, 's') },
          {
            label: `Gain at ${formatSI(source.frequency, 'Hz')}`,
            value: `${readout.gainDb.toFixed(2)} dB`,
            note: `(${readout.gain.toFixed(4)}x)`,
          },
          { label: 'Phase shift', value: `${readout.phase.toFixed(1)}°` },
          {
            label: 'f / fc',
            value: ratio < 0.01 ? ratio.toExponential(1) : ratio.toFixed(2),
            note: `(${band})`,
          },
          { label: 'Reactance Xc', value: formatSI(readout.xc, 'Ω') },
          { label: 'Source load |Z|', value: formatSI(readout.z, 'Ω') },
        ]}
      />

      <Theory>
        <p>
          Cutoff is where the capacitor's reactance equals the resistance, so
          <code> fc = 1 / (2·pi·R·C)</code> and the output is down 3 dB.
        </p>
        <p>
          Magnitude is <code>|H| = 1 / sqrt(1 + (f/fc)²)</code> for the low pass and
          <code> (f/fc) / sqrt(1 + (f/fc)²)</code> for the high pass. Phase is
          <code> -atan(f/fc)</code> and <code>90° - atan(f/fc)</code> respectively.
        </p>
        <p>
          The scope trace is not that formula. It is a sample-by-sample simulation using
          exact zero-order-hold discretisation,{' '}
          <code>y[n] = x[n] + (y[n-1] - x[n])·e^(-dt/tau)</code>, which stays stable at any
          step size and reproduces clipping, ringing and PWM edges that a frequency-domain
          answer cannot show.
        </p>
      </Theory>
    </SimPage>
  )
}
