import { useMemo, useState } from 'react'
import { GPIO_MAX_MA } from '../engine/constants'
import { analyse, peakMagnitude, simulate, timeConstant } from '../engine/rl'
import type { RLMode } from '../engine/rl'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'
import SourceControls, { useSource } from '../ui/SourceControls'

/** Samples per sweep, matched to the rest of the scope pages. */
const N = 8192

/** 10% to 90% rise time of a first-order step, ln(9)·tau. */
const RISE_TIME_TAUS = 2.197

function Schematic({ mode }: { mode: RLMode }) {
  const series = mode === 'lowpass' ? 'L' : 'R'
  const shunt = mode === 'lowpass' ? 'R' : 'L'
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 110" aria-label={t('{mode} RL network', { mode })}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="34" r="10" />
        <path d="M18 34a6 6 0 0 1 12 0M24 24V14M24 44v36h212M34 34h36" />
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
        <circle cx="224" cy="34" r="3" />
      </g>
      <g fill="currentColor" fontSize="11">
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
      </g>
    </svg>
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
        { label: 'Vin', color: TRACE_COLORS[0], samples: input },
        { label: 'Vout', color: TRACE_COLORS[1], samples: out },
        {
          label: mode === 'lowpass' ? 'V(L)' : 'V(R)',
          color: TRACE_COLORS[2],
          samples: other,
        },
      ],
      readout: analyse(r, l, rw, source.frequency, mode),
      ipk: peakMagnitude(current),
    }
  }, [mode, r, l, rw, source])

  const ratio = readout.fc > 0 && Number.isFinite(readout.fc) ? source.frequency / readout.fc : 0
  const pass = mode === 'lowpass' ? ratio < 1 : ratio > 1
  const band =
    source.kind === 'dc'
      ? '(step response)'
      : ratio < 0.1 || ratio > 10
        ? pass
          ? '(deep in the passband)'
          : '(deep in the stopband)'
        : '(near the corner)'

  const saturating = ipk > isat
  const overGpio = ipk * 1000 > GPIO_MAX_MA

  return (
    <SimPage
      id="rl-filter"
      lede="The dual of the RC filter: swap the capacitor for an inductor and the corner moves to R/L. Winding resistance is part of the model, because it is what stops real RL filters behaving like the textbook."
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
            <Param label="Resistor" unit="Ω" value={r} onChange={setR} min={1} max={1e6} />
            <Param label="Inductor" unit="H" value={l} onChange={setL} min={1e-9} max={10} />
            <Param
              label="Winding resistance"
              unit="Ω"
              value={rw}
              onChange={setRw}
              min={1e-3}
              max={1e3}
              hint="Coil DCR. Slide to the bottom for the ideal case."
            />
            <Param
              label="Saturation current"
              unit="A"
              value={isat}
              onChange={setIsat}
              min={1e-3}
              max={20}
              hint="Datasheet Isat. Past this the core gives up and L collapses."
            />
          </Group>

          <SourceControls value={source} onChange={patchSource} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      {saturating && (
        <Warning
          text="Peak coil current {ipk} is past the {isat} saturation rating. A saturated core loses inductance, so the real corner climbs and this trace is no longer valid. Raise R, pick a bigger core, or cut the drive."
          vars={{ ipk: formatSI(ipk, 'A'), isat: formatSI(isat, 'A') }}
        />
      )}
      {overGpio && (
        <Warning
          text="Peak current {ipk} exceeds the {GPIO_MAX_MA} mA an ESP32 pin can source. Drive this network from a buffer or a MOSFET, not straight off a GPIO."
          vars={{ ipk: formatSI(ipk, 'A'), GPIO_MAX_MA }}
        />
      )}

      <ReadoutGrid
        items={[
          {
            label: 'Cutoff fc',
            value: formatSI(readout.fc, 'Hz'),
            note: <T k="(R total {rTotal})" vars={{ rTotal: formatSI(readout.rTotal, 'Ω') }} />,
          },
          { label: 'Time constant', value: formatSI(readout.tau, 's') },
          {
            label: 'Rise time (10-90%)',
            value: formatSI(RISE_TIME_TAUS * readout.tau, 's'),
          },
          {
            label: <T k="Gain at {frequency}" vars={{ frequency: formatSI(source.frequency, 'Hz') }} />,
            value: `${readout.gainDb.toFixed(2)} dB`,
            note: `(${readout.gain.toFixed(4)}x)`,
          },
          { label: 'Phase shift', value: `${readout.phase.toFixed(1)}°` },
          {
            label: 'f / fc',
            value: ratio < 0.01 ? ratio.toExponential(1) : ratio.toFixed(2),
            note: band,
          },
          { label: 'Reactance XL', value: formatSI(readout.xl, 'Ω') },
          { label: 'Source load |Z|', value: formatSI(readout.z, 'Ω') },
          {
            label: 'Peak coil current',
            value: formatSI(ipk, 'A'),
            note: <T k="(Isat {isat})" vars={{ isat: formatSI(isat, 'A') }} />,
            warn: saturating || overGpio,
          },
          {
            label: mode === 'lowpass' ? 'Passband loss (DCR)' : 'DC feedthrough (DCR)',
            value: Number.isFinite(readout.parasiticDb)
              ? `${readout.parasiticDb.toFixed(2)} dB`
              : '-∞ dB',
            warn: mode === 'lowpass' ? readout.parasiticDb < -1 : readout.parasiticDb > -20,
          },
        ]}
      />

      <Theory
        text={[
          "An inductor opposes a change in current the way a capacitor opposes a change in voltage, so the whole RC page maps across: `tau = L / R` instead of `R·C`, and `fc = R / (2·pi·L)` instead of `1 / (2·pi·R·C)`. Reactance runs the other way, `XL = 2·pi·f·L` rises with frequency while `Xc` falls, which is why the output across the resistor is the low pass here and the high pass there.",
          "Magnitude is `|H| = R / |Z|` for the low pass and `sqrt(Rw² + XL²) / |Z|` for the high pass, with `|Z| = sqrt((R + Rw)² + XL²)`. With a lossless winding those collapse to the familiar `1 / sqrt(1 + (f/fc)²)` and `(f/fc) / sqrt(1 + (f/fc)²)`, and phase to `-atan(f/fc)` and `90° - atan(f/fc)`.",
          "Winding resistance is in series with everything, so it never drops out. It raises the corner (fc uses R + Rw), costs the low pass some passband, and leaves the high pass a DC feedthrough floor of `Rw / (R + Rw)`. That, plus core saturation and self-resonance, is why filters at signal level are built from capacitors and inductors are kept for power work.",
          "The scope trace is not the transfer function. The solver integrates the loop current, `L·di/dt = v - i·(R + Rw)`, with exact zero-order-hold discretisation, `i[n] = i∞ + (i[n-1] - i∞)·e^(-dt/tau)`. That is stable at any step size, and the two element voltages come straight out of KVL, so `V(R) + V(L)` equals Vin sample for sample.",
        ]}
      />
    </SimPage>
  )
}
