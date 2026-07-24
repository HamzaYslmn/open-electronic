import { useCallback, useState } from 'react'
import { VCC } from '../engine/constants'
import { WAVE_KINDS } from '../engine/signal'
import type { Source, WaveKind } from '../engine/signal'
import type { Key } from '../i18n'
import Param from './Param'
import { Group, Segmented, Select } from './Controls'

export type SourceState = Source & {
  /** How many periods the scope window covers. */
  cycles: number
}

/**
 * Default stimulus: a 0 to 3.3 V swing, which is what an ESP32 actually puts out
 * of a PWM pin or DAC. Simulators that model a bipolar or mains signal override
 * amplitude and offset explicitly.
 */
export const ESP32_SOURCE: SourceState = {
  kind: 'sine',
  amplitude: VCC / 2,
  offset: VCC / 2,
  frequency: 1_000,
  duty: 0.5,
  cycles: 3,
}

export function useSource(init: Partial<SourceState> = {}) {
  const [source, setSource] = useState<SourceState>({ ...ESP32_SOURCE, ...init })
  const patch = useCallback(
    (p: Partial<SourceState>) => setSource((s) => ({ ...s, ...p })),
    [],
  )
  return [source, patch] as const
}

export type SourceControlsProps = {
  value: SourceState
  onChange: (patch: Partial<SourceState>) => void
  /** Largest peak amplitude the slider allows. */
  maxAmplitude?: number
  label?: Key
}

/** The stimulus controls shared by every time-domain simulator. */
export default function SourceControls({
  value,
  onChange,
  maxAmplitude = 50,
  label = 'common.source',
}: SourceControlsProps) {
  const isLogic = Math.abs(value.offset - value.amplitude) < 1e-9

  return (
    <Group label={label}>
      <Select
        label="ui.waveform"
        value={value.kind}
        onChange={(kind: WaveKind) => onChange({ kind })}
        options={WAVE_KINDS}
      />

      <Segmented
        label="ui.signalSwing"
        value={isLogic ? 'ui.logic' : 'ui.bipolar'}
        onChange={(mode) =>
          onChange(
            mode === 'logic'
              ? { amplitude: VCC / 2, offset: VCC / 2 }
              : { amplitude: value.amplitude, offset: 0 },
          )
        }
        options={[
          { value: 'logic', label: 'ui.0To3v3' },
          { value: 'bipolar', label: 'ui.bipolar2' },
        ]}
      />

      {value.kind !== 'dc' && (
        <Param
          label="common.frequency"
          unit="Hz"
          value={value.frequency}
          onChange={(frequency) => onChange({ frequency })}
          min={0.1}
          max={1e6}
        />
      )}
      <Param
        label={value.kind === 'dc' ? 'ui.stepHeight' : 'ui.amplitudePeak'}
        unit="V"
        value={value.amplitude}
        onChange={(amplitude) => onChange({ amplitude })}
        min={0.01}
        max={maxAmplitude}
      />
      <Param
        label="common.dcOffset"
        unit="V"
        value={value.offset}
        onChange={(offset) => onChange({ offset })}
        min={-maxAmplitude}
        max={maxAmplitude}
        log={false}
        step={0.05}
      />
      {value.kind === 'pwm' && (
        <Param
          label="common.duty"
          value={value.duty ?? 0.5}
          onChange={(duty) => onChange({ duty })}
          min={0.01}
          max={0.99}
          log={false}
          step={0.01}
        />
      )}
      {value.kind !== 'dc' && (
        <Param
          label="common.cyclesShown"
          value={value.cycles}
          onChange={(cycles) => onChange({ cycles: Math.round(cycles) })}
          min={1}
          max={20}
          log={false}
          step={1}
        />
      )}
    </Group>
  )
}
