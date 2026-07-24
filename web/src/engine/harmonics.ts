/**
 * Fourier harmonic synthesis and distortion metrics.
 *
 *   v(t) = Vdc + sum over n of Vn * sin(2*pi*n*f0*t + phi_n)
 *
 * Every sample is evaluated in closed form, so there is no recursion, no
 * accumulated state and no stability limit: dt may be far larger than the
 * period and the output still stays inside +/- sum(Vn) + Vdc.
 *
 * Pure numbers in, pure numbers out. Nothing here imports React or any UI.
 */

import { VCC } from './constants'

/** Ten sliders is the practical limit before the control column stops being usable. */
export const MAX_HARMONICS = 10

export type Harmonic = {
  /** Peak amplitude in volts, always >= 0. Sign lives in the phase. */
  amplitude: number
  /** Phase offset phi_n in radians. */
  phase: number
}

export type PresetKind = 'sine' | 'square' | 'triangle' | 'sawtooth'

export const PRESET_KINDS: ReadonlyArray<PresetKind> = [
  'sine',
  'square',
  'triangle',
  'sawtooth',
]

/**
 * Signed Fourier coefficient a_n of the classic series, normalised so a_1 = 1.
 *
 * square    v = (4A/pi)  * sum over odd n of sin(n*w*t) / n
 * sawtooth  v = (2A/pi)  * sum over all n of ((-1)^(n+1)/n) * sin(n*w*t)
 * triangle  v = (8A/pi^2)* sum over odd n = 2k+1 of ((-1)^k/n^2) * sin(n*w*t)
 *
 * (Standard results, e.g. Horowitz & Hill appendix on Fourier series.)
 */
function coefficient(kind: PresetKind, n: number): number {
  switch (kind) {
    case 'sine':
      return n === 1 ? 1 : 0
    case 'square':
      return n % 2 === 1 ? 1 / n : 0
    case 'sawtooth':
      return (n % 2 === 1 ? 1 : -1) / n
    case 'triangle': {
      if (n % 2 === 0) return 0
      const k = (n - 1) / 2
      return (k % 2 === 0 ? 1 : -1) / (n * n)
    }
  }
}

/**
 * Peak amplitude of the ideal waveform whose fundamental is 1 V peak.
 * Read straight off the series above: a square with fundamental V1 has
 * peak V1*pi/4, a sawtooth V1*pi/2, a triangle V1*pi^2/8.
 */
export const IDEAL_PEAK: Record<PresetKind, number> = {
  sine: 1,
  square: Math.PI / 4,
  sawtooth: Math.PI / 2,
  triangle: (Math.PI * Math.PI) / 8,
}

/**
 * Build a harmonic list from a named series, scaled so harmonic 1 has exactly
 * `fundamental` volts of peak amplitude. A negative coefficient becomes a
 * positive amplitude with pi radians of phase, which keeps every amplitude
 * slider one-sided.
 */
export function preset(
  kind: PresetKind,
  fundamental: number,
  count = MAX_HARMONICS,
): Harmonic[] {
  return Array.from({ length: count }, (_, i) => {
    const a = coefficient(kind, i + 1) * fundamental
    return { amplitude: Math.abs(a), phase: a < 0 ? Math.PI : 0 }
  })
}

/**
 * Name the series the current list matches, or 'custom'. Comparison is on the
 * phasor Vn*e^(j*phi_n) relative to the fundamental, so the overall level does
 * not matter, only the shape.
 */
export function detectPreset(
  harmonics: ReadonlyArray<Harmonic>,
  tol = 1e-3,
): PresetKind | 'custom' {
  const v1 = harmonics[0]?.amplitude ?? 0
  if (!(v1 > 0)) return 'custom'
  for (const kind of PRESET_KINDS) {
    const want = preset(kind, v1, harmonics.length)
    const same = harmonics.every((h, i) => {
      const w = want[i]
      const dx = h.amplitude * Math.cos(h.phase) - w.amplitude * Math.cos(w.phase)
      const dy = h.amplitude * Math.sin(h.phase) - w.amplitude * Math.sin(w.phase)
      return Math.hypot(dx, dy) <= tol * v1
    })
    if (same) return kind
  }
  return 'custom'
}

/** Instantaneous sum, v(t) = dc + sum Vn*sin(2*pi*n*f0*t + phi_n). */
export function valueAt(
  harmonics: ReadonlyArray<Harmonic>,
  f0: number,
  dc: number,
  t: number,
): number {
  const w = 2 * Math.PI * f0 * t
  let v = dc
  for (let i = 0; i < harmonics.length; i++) {
    const h = harmonics[i]
    if (h.amplitude === 0) continue
    v += h.amplitude * Math.sin(w * (i + 1) + h.phase)
  }
  return v
}

/** Sample the sum into n points spaced dt apart. Closed form, so any dt is safe. */
export function synthesise(
  harmonics: ReadonlyArray<Harmonic>,
  f0: number,
  dc: number,
  n: number,
  dt: number,
): Float64Array {
  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) out[i] = valueAt(harmonics, f0, dc, i * dt)
  return out
}

const frac = (x: number) => x - Math.floor(x)

/**
 * The waveform the series converges to, phase-aligned with the series above:
 * every one of these crosses zero going positive at t = 0.
 */
export function idealAt(
  kind: PresetKind,
  fundamental: number,
  f0: number,
  dc: number,
  t: number,
): number {
  const a = IDEAL_PEAK[kind] * fundamental
  const p = frac(t * f0)
  switch (kind) {
    case 'sine':
      return dc + a * Math.sin(2 * Math.PI * p)
    case 'square':
      return dc + (p < 0.5 ? a : -a)
    case 'sawtooth':
      // Ramp up through zero at t = 0, jump down at the half period.
      return dc + a * (2 * frac(p + 0.5) - 1)
    case 'triangle':
      // 0 -> +a at T/4 -> 0 at T/2 -> -a at 3T/4 -> 0
      return dc + a * (p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4)
  }
}

export function synthesiseIdeal(
  kind: PresetKind,
  fundamental: number,
  f0: number,
  dc: number,
  n: number,
  dt: number,
): Float64Array {
  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) out[i] = idealAt(kind, fundamental, f0, dc, i * dt)
  return out
}

/** Index of the highest harmonic with any amplitude, 0 when the list is silent. */
export function topHarmonic(harmonics: ReadonlyArray<Harmonic>): number {
  let top = 0
  for (let i = 0; i < harmonics.length; i++) if (harmonics[i].amplitude > 0) top = i + 1
  return top
}

/** Samples per period used for the peak search. 4096 puts the peak error under 1e-6. */
const PEAK_STEPS = 4096

export type HarmonicReadout = {
  /** Peak amplitude of harmonic 1, in volts. */
  fundamental: number
  /** RSS of harmonics 2..N, i.e. the distortion voltage, in volts. */
  distortion: number
  /** IEEE THD-F: distortion / fundamental. Infinite when there is no fundamental. */
  thd: number
  /** THD-R: distortion / total AC rms. Always < 1. */
  thdR: number
  /** RMS of the AC part. Parseval: sqrt(sum Vn^2 / 2), independent of phase. */
  rmsAc: number
  /** True RMS including the DC term. */
  rmsTotal: number
  /** Largest excursion of the AC part from the DC level. */
  peakAc: number
  vmax: number
  vmin: number
  /** peakAc / rmsAc. Sine 1.414, square 1.0, triangle 1.732. Phase dependent. */
  crest: number
  /** Number of harmonics with non-zero amplitude. */
  active: number
  /** Highest harmonic number present. */
  top: number
  /** Volts of margin to the nearer rail; negative means the output would clip. */
  headroom: number
  clipsHigh: boolean
  clipsLow: boolean
}

/**
 * Everything the page reports. `rail` defaults to the ESP32 3.3 V supply: the
 * waveform is assumed to come out of a single-supply DAC or filtered PWM pin,
 * so anything below 0 V or above the rail cannot actually be produced.
 */
export function analyse(
  harmonics: ReadonlyArray<Harmonic>,
  dc = 0,
  rail = VCC,
): HarmonicReadout {
  const fundamental = harmonics[0]?.amplitude ?? 0

  let sumSq = 0
  let distSq = 0
  let active = 0
  for (let i = 0; i < harmonics.length; i++) {
    const a = harmonics[i].amplitude
    if (a > 0) active++
    sumSq += a * a
    if (i > 0) distSq += a * a
  }

  const distortion = Math.sqrt(distSq)
  const rmsAc = Math.sqrt(sumSq / 2)
  const totalAmp = Math.sqrt(sumSq)

  // The shape does not depend on f0, so scan exactly one period of a 1 Hz
  // fundamental. The peak is phase dependent, unlike the rms above.
  let maxAc = -Infinity
  let minAc = Infinity
  for (let i = 0; i < PEAK_STEPS; i++) {
    const v = valueAt(harmonics, 1, 0, i / PEAK_STEPS)
    if (v > maxAc) maxAc = v
    if (v < minAc) minAc = v
  }
  if (!Number.isFinite(maxAc)) {
    maxAc = 0
    minAc = 0
  }

  const peakAc = Math.max(Math.abs(maxAc), Math.abs(minAc))
  const vmax = dc + maxAc
  const vmin = dc + minAc

  return {
    fundamental,
    distortion,
    thd: fundamental > 0 ? distortion / fundamental : distortion > 0 ? Infinity : 0,
    thdR: totalAmp > 0 ? distortion / totalAmp : 0,
    rmsAc,
    rmsTotal: Math.hypot(dc, rmsAc),
    peakAc,
    vmax,
    vmin,
    crest: rmsAc > 0 ? peakAc / rmsAc : 0,
    active,
    top: topHarmonic(harmonics),
    headroom: Math.min(rail - vmax, vmin),
    clipsHigh: vmax > rail,
    clipsLow: vmin < 0,
  }
}
