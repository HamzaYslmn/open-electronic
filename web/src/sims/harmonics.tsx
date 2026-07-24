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
import { T, sym } from '../i18n'
import type { Key } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Segmented, SimPage, Theory, Toggle, TRACE_COLORS, Warning } from '../ui'
import type { Trace } from '../ui'

/** Samples per sweep, same as every other time-domain page. */
const N = 8192

/** Peak volts per harmonic slider. Ten at full travel is well past the rail. */
const MAX_AMPLITUDE = 2

const PRESET_OPTIONS: ReadonlyArray<{ value: PresetKind | 'custom'; label: Key }> = [
  { value: 'sine', label: 'common.sine' },
  { value: 'square', label: 'common.square' },
  { value: 'triangle', label: 'common.triangle' },
  { value: 'sawtooth', label: 'harmonics.saw' },
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
        label: 'harmonics.sum',
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
        label: 'harmonics.ideal',
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
      lede="harmonics.lede"
      controls={
        <>
          <Segmented
            label="harmonics.fourierSeriesPreset"
            value={kind}
            onChange={applyPreset}
            options={PRESET_OPTIONS}
          />

          <Group label="harmonics.harmonicAmplitudes">
            {harmonics.map((h, i) => (
              <Param
                key={i}
                label={i === 0 ? 'harmonics.h1Fundamental' : sym(`H${i + 1}`)}
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
            <Toggle label="harmonics.forceEveryPhaseTo" value={zeroPhase} onChange={setZeroPhase} />
          </Group>

          <Group label="harmonics.fundamental">
            <Param
              label="harmonics.frequencyF0"
              unit="Hz"
              value={freq}
              onChange={setFreq}
              min={1}
              max={100e3}
            />
            <Param
              label="common.dcOffset"
              unit="V"
              value={dc}
              onChange={setDc}
              min={0}
              max={VCC}
              log={false}
              step={0.05}
            />
            <Param
              label="common.cyclesShown"
              value={cycles}
              onChange={setCycles} int
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
            label: 'harmonics.thd',
            value: Number.isFinite(readout.thd)
              ? `${(readout.thd * 100).toFixed(2)} %`
              : 'harmonics.undefined',
            note: Number.isFinite(readout.thd)
              ? <T k="harmonics.ofHarmonics2To" vars={{ distortion: formatSI(readout.distortion, 'V') }} />
              : 'harmonics.noFundamentalToCompare',
            warn: !Number.isFinite(readout.thd),
          },
          {
            label: 'harmonics.thdR',
            value: `${(readout.thdR * 100).toFixed(2)} %`,
            note: 'harmonics.asAShareOf',
          },
          {
            label: 'harmonics.crestFactor',
            value: readout.crest.toFixed(3),
            note: 'harmonics.sine1414Triangle',
          },
          { label: 'harmonics.rmsAcOnly', value: formatSI(readout.rmsAc, 'V') },
          {
            label: 'harmonics.rmsWithDc',
            value: formatSI(readout.rmsTotal, 'V'),
            note: <T k="harmonics.dc" vars={{ dc: formatSI(dc, 'V') }} />,
          },
          {
            label: 'harmonics.peakToPeak',
            value: formatSI(readout.vmax - readout.vmin, 'V'),
            note: <T k="harmonics.peak" vars={{ peakAc: formatSI(readout.peakAc, 'V') }} />,
          },
          {
            label: 'harmonics.swing',
            value: `${formatSI(readout.vmin, 'V')} to ${formatSI(readout.vmax, 'V')}`,
            note: <T k="harmonics.railHeadroom" vars={{ headroom: formatSI(readout.headroom, 'V') }} />,
            warn: clips,
          },
          {
            label: 'harmonics.occupiedBandwidth',
            value: formatSI(readout.top * freq, 'Hz'),
            note: <T k="harmonics.activeTopIsH" vars={{ active: readout.active, top: readout.top }} />,
          },
        ]}
      />

      <Warning when={clips}
        text="harmonics.warn1"
        vars={{
          // Whole phrases rather than glued fragments, so each one is a key a
          // translation can put wherever its own grammar needs it.
          swing:
            readout.clipsLow && readout.clipsHigh
              ? 'harmonics.below0VAnd'
              : readout.clipsLow
                ? 'harmonics.below0V'
                : 'harmonics.aboveTheSupplyRail',
        }}
      />

      <Theory
        text={[
          'harmonics.theory1',
          'harmonics.thePresetsAreThe',
          'harmonics.distortionIsTheEnergy',
          'harmonics.byParsevalTheRms',
          'harmonics.truncatingAtAStep',
        ]}
      />
    </SimPage>
  )
}
