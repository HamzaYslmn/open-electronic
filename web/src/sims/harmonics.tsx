import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import {
  MAX_HARMONICS,
  analyse,
  detectPreset,
  preset,
  synthesise,
  synthesiseIdeal,
} from '../engine/harmonics'
import type { Harmonic, PresetKind } from '../engine/harmonics'
import { timeBase } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Segmented, Toggle } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import type { Trace } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per sweep, same as every other time-domain page. */
const N = 8192

/** Peak volts per harmonic slider. Ten at full travel is well past the rail. */
const MAX_AMPLITUDE = 2

const PRESET_OPTIONS: ReadonlyArray<{ value: PresetKind | 'custom'; label: string }> = [
  { value: 'sine', label: 'Sine' },
  { value: 'square', label: 'Square' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'sawtooth', label: 'Saw' },
]

export default function Harmonics() {
  // Fundamental at 1.2 V peak keeps the summed square inside the 3.3 V rail.
  const [harmonics, setHarmonics] = useState<Harmonic[]>(() =>
    preset('square', 1.2, MAX_HARMONICS),
  )
  const [freq, setFreq] = useState(1_000)
  // Single-supply output, so the waveform sits on half the rail by default.
  const [dc, setDc] = useState(VCC / 2)
  const [cycles, setCycles] = useState(3)
  const [zeroPhase, setZeroPhase] = useState(false)

  const kind = detectPreset(harmonics)

  const setAmplitude = (index: number, value: number) =>
    setHarmonics((list) =>
      list.map((h, i) => (i === index ? { ...h, amplitude: value } : h)),
    )

  const applyPreset = (next: PresetKind | 'custom') => {
    if (next === 'custom') return
    setHarmonics(preset(next, harmonics[0].amplitude || 1, MAX_HARMONICS))
  }

  const { dt, traces, readout } = useMemo(() => {
    const shaped = zeroPhase ? harmonics.map((h) => ({ ...h, phase: 0 })) : harmonics
    // Periodic by construction, so the DC fallback span is never used.
    const { dt } = timeBase(
      { kind: 'sine', amplitude: shaped[0].amplitude, frequency: freq, offset: dc },
      N,
      cycles,
      1,
    )
    const list: Trace[] = [
      {
        label: 'Sum',
        color: TRACE_COLORS[0],
        samples: synthesise(shaped, freq, dc, N, dt),
      },
      {
        label: 'H1',
        color: TRACE_COLORS[1],
        samples: synthesise([shaped[0]], freq, dc, N, dt),
      },
    ]
    if (kind !== 'custom' && !zeroPhase) {
      list.push({
        label: 'Ideal',
        color: TRACE_COLORS[3],
        samples: synthesiseIdeal(kind, shaped[0].amplitude, freq, dc, N, dt),
      })
    }
    return { dt, traces: list, readout: analyse(shaped, dc, VCC) }
  }, [harmonics, freq, dc, cycles, zeroPhase, kind])

  const clips = readout.clipsHigh || readout.clipsLow

  return (
    <SimPage
      id="harmonics"
      lede="Add up to ten sine waves, each an integer multiple of one fundamental, and watch the sum take shape. Horizontal axis is time."
      controls={
        <>
          <Segmented
            label="Fourier series preset"
            value={kind}
            onChange={applyPreset}
            options={PRESET_OPTIONS}
          />

          <Group label="Harmonic amplitudes">
            {harmonics.map((h, i) => (
              <Param
                key={i}
                label={i === 0 ? 'H1 fundamental' : `H${i + 1}`}
                unit="V"
                value={h.amplitude}
                onChange={(v) => setAmplitude(i, v)}
                min={0}
                max={MAX_AMPLITUDE}
                log={false}
                step={0.01}
                hint={formatSI((i + 1) * freq, 'Hz')}
              />
            ))}
            <Toggle label="Force every phase to 0" value={zeroPhase} onChange={setZeroPhase} />
          </Group>

          <Group label="Fundamental">
            <Param
              label="Frequency f0"
              unit="Hz"
              value={freq}
              onChange={setFreq}
              min={1}
              max={100e3}
            />
            <Param
              label="DC offset"
              unit="V"
              value={dc}
              onChange={setDc}
              min={0}
              max={VCC}
              log={false}
              step={0.05}
            />
            <Param
              label="Cycles shown"
              value={cycles}
              onChange={(v) => setCycles(Math.round(v))}
              min={1}
              max={20}
              log={false}
              step={1}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'THD',
            value: Number.isFinite(readout.thd)
              ? `${(readout.thd * 100).toFixed(2)} %`
              : 'undefined',
            note: Number.isFinite(readout.thd)
              ? <T k="({distortion} of harmonics 2 to 10)" vars={{ distortion: formatSI(readout.distortion, 'V') }} />
              : '(no fundamental to compare against)',
            warn: !Number.isFinite(readout.thd),
          },
          {
            label: 'THD-R',
            value: `${(readout.thdR * 100).toFixed(2)} %`,
            note: '(as a share of total rms)',
          },
          {
            label: 'Crest factor',
            value: readout.crest.toFixed(3),
            note: '(sine 1.414, triangle 1.732)',
          },
          { label: 'RMS, AC only', value: formatSI(readout.rmsAc, 'V') },
          {
            label: 'RMS, with DC',
            value: formatSI(readout.rmsTotal, 'V'),
            note: <T k="(DC {dc})" vars={{ dc: formatSI(dc, 'V') }} />,
          },
          {
            label: 'Peak to peak',
            value: formatSI(readout.vmax - readout.vmin, 'V'),
            note: <T k="(peak {peakAc})" vars={{ peakAc: formatSI(readout.peakAc, 'V') }} />,
          },
          {
            label: 'Swing',
            value: `${formatSI(readout.vmin, 'V')} to ${formatSI(readout.vmax, 'V')}`,
            note: <T k="(rail headroom {headroom})" vars={{ headroom: formatSI(readout.headroom, 'V') }} />,
            warn: clips,
          },
          {
            label: 'Occupied bandwidth',
            value: formatSI(readout.top * freq, 'Hz'),
            note: <T k="({active} active, top is H{top})" vars={{ active: readout.active, top: readout.top }} />,
          },
        ]}
      />

      {clips && (
        <Warning
          text="The sum swings {swing}. A single-supply DAC or a filtered PWM pin cannot produce that, the real output would flat-top and add distortion this model does not include. Trim the amplitudes or move the DC offset."
          vars={{
            // Whole phrases rather than glued fragments, so each one is a key a
            // translation can put wherever its own grammar needs it.
            swing:
              readout.clipsLow && readout.clipsHigh
                ? 'below 0 V and above the supply rail'
                : readout.clipsLow
                  ? 'below 0 V'
                  : 'above the supply rail',
          }}
        />
      )}

      <Theory
        text={[
          "Every periodic waveform is a sum of sines at integer multiples of one fundamental: `v(t) = Vdc + sum Vn·sin(2·pi·n·f0·t + phi_n)`. Each slider sets one Vn. The scope evaluates that sum directly, so there is no solver and no step-size limit.",
          "The presets are the classic series. Square is odd harmonics at `1/n` all in phase, sawtooth is every harmonic at `1/n` with alternating sign, triangle is odd harmonics at `1/n²` with alternating sign. Their ideal peaks are `V1·pi/4`, `V1·pi/2` and `V1·pi²/8`, which is the amber trace.",
          "Distortion is the energy that is not the fundamental: `THD = sqrt(V2² + V3² + ... ) / V1`. An ideal square is 48.3%, a triangle 12.1%. Ten terms only get part of the way there. THD-R divides by the total rms instead, so it can never exceed 100%, which is what a meter reads.",
          "By Parseval the rms is `sqrt(sum Vn² / 2)` and depends only on the amplitudes, never on phase. The peak does depend on phase, so crest factor does too: flip the phase toggle on a sawtooth and the rms will not move.",
          "Truncating at a step leaves ringing that never goes away. The overshoot converges to 8.95% of the jump, i.e. 1.179 times the flat top, which is why a square built from harmonics reads a crest factor near 1.18 instead of the ideal 1.0. Adding terms narrows the ripple, it does not shrink it.",
        ]}
      />
    </SimPage>
  )
}
