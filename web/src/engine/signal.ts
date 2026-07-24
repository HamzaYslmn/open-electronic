import type { Key } from '../i18n'
/**
 * Source waveform generation. All generators are pure functions of time so any
 * simulator can resample them at whatever dt its solver needs.
 */

export type WaveKind = 'sine' | 'square' | 'triangle' | 'sawtooth' | 'dc' | 'pwm'

export const WAVE_KINDS: ReadonlyArray<{ value: WaveKind; label: Key }> = [
  { value: 'sine', label: 'common.sine' },
  { value: 'square', label: 'common.square' },
  { value: 'triangle', label: 'common.triangle' },
  { value: 'sawtooth', label: 'opt.sawtooth' },
  { value: 'pwm', label: 'common.pwm2' },
  { value: 'dc', label: 'opt.dcStep' },
]

export type Source = {
  kind: WaveKind
  /** Peak amplitude in volts (half of peak-to-peak for symmetric waves). */
  amplitude: number
  frequency: number
  /** DC offset in volts. */
  offset: number
  /** Duty cycle 0..1, used by 'pwm' only. */
  duty?: number
}

/**
 * Instantaneous source voltage at time t.
 * Square/PWM swing between offset±amplitude; 'dc' is a step at t=0 so the RC
 * step response is visible without a separate code path.
 */
export function sourceAt(src: Source, t: number): number {
  const { kind, amplitude: a, frequency: f, offset } = src
  // phase in [0,1)
  const phase = kind === 'dc' ? 0 : (t * f) % 1
  const p = phase < 0 ? phase + 1 : phase

  switch (kind) {
    case 'sine':
      return offset + a * Math.sin(2 * Math.PI * p)
    case 'square':
      return offset + (p < 0.5 ? a : -a)
    case 'pwm':
      return offset + (p < (src.duty ?? 0.5) ? a : -a)
    case 'triangle':
      // 0 -> +a -> 0 -> -a -> 0
      return offset + a * (p < 0.5 ? 4 * p - 1 : 3 - 4 * p) * -1
    case 'sawtooth':
      return offset + a * (2 * p - 1)
    case 'dc':
      return offset + (t >= 0 ? a : 0)
  }
}

/** Sample a source into a buffer of n points spaced dt apart. */
export function generate(src: Source, n: number, dt: number): Float64Array {
  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) out[i] = sourceAt(src, i * dt)
  return out
}

/**
 * Choose a time base that shows `cycles` periods of the source.
 * DC gets a window sized by the caller's fallback span instead of 1/f.
 */
export function timeBase(
  src: Source,
  n: number,
  cycles: number,
  dcSpan: number,
): { dt: number; span: number } {
  const span = src.kind === 'dc' || src.frequency <= 0 ? dcSpan : cycles / src.frequency
  return { dt: span / n, span }
}

/**
 * Generate one sweep: pick the time base, then sample it. This is the entry
 * point every time-domain simulator uses, so the window rule lives in one place.
 */
export function sweep(
  src: Source,
  n: number,
  cycles: number,
  dcSpan: number,
): { dt: number; samples: Float64Array } {
  const { dt } = timeBase(src, n, cycles, dcSpan)
  return { dt, samples: generate(src, n, dt) }
}

/** Peak-to-peak of a sampled trace. */
export function peakToPeak(samples: ArrayLike<number>): number {
  if (samples.length === 0) return 0
  let min = samples[0]
  let max = samples[0]
  for (let i = 1; i < samples.length; i++) {
    const v = samples[i]
    if (v < min) min = v
    if (v > max) max = v
  }
  return max - min
}

/** True RMS of a sampled trace (includes any DC component). */
export function rms(samples: ArrayLike<number>): number {
  if (samples.length === 0) return 0
  let sum = 0
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i]
  return Math.sqrt(sum / samples.length)
}

/** Arithmetic mean, i.e. the DC component of a trace. */
export function mean(samples: ArrayLike<number>): number {
  if (samples.length === 0) return 0
  let sum = 0
  for (let i = 0; i < samples.length; i++) sum += samples[i]
  return sum / samples.length
}
