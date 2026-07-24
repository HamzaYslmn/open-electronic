import { expm2, steadyState } from './state2'
import type { Matrix2 } from './state2'

/**
 * Unity-gain Sallen-Key second-order filter.
 *
 * One op-amp buys a two-pole roll-off, 40 dB per decade instead of the 20 a
 * single RC gives, and a Q that the passive RC cannot reach at all without an
 * inductor. Both topologies share the same pole pair:
 *
 *   w0 = 1/sqrt(R1·R2·C1·C2)
 *   low pass:   Q = sqrt(R1·R2·C1·C2) / (C2·(R1 + R2))
 *   high pass:  Q = sqrt(R1·R2·C1·C2) / (R1·(C1 + C2))
 *
 * The op-amp is taken as an ideal unity-gain buffer, so this is the K = 1 form.
 * That is the one worth building: it has no gain-setting resistors to drift and
 * its Q is far less sensitive to component tolerance than the equal-component
 * variant, where Q depends on a gain sitting close to 3 and goes unstable past
 * it.
 *
 * States are the two capacitor voltages, so the network is stepped with the
 * same exact zero-order-hold used everywhere else in this app and stays valid
 * at any Q the sliders reach.
 *
 * References: Sedra & Smith, Microelectronic Circuits, ch. 17; TI SLOA049,
 * Analysis of the Sallen-Key Architecture.
 */

export type FilterMode = 'lowpass' | 'highpass'

export type SallenKey = {
  mode: FilterMode
  r1: number
  r2: number
  c1: number
  c2: number
  /** Op-amp gain-bandwidth product, which caps what the topology can deliver. */
  gbw: number
}

export type SallenKeyReadout = {
  /** Pole frequency, Hz. Not the -3 dB point unless Q is 0.707. */
  f0: number
  q: number
  /** Damping ratio, 1/(2Q). */
  zeta: number
  /** Where the response is actually 3 dB down, Hz. */
  cutoff: number
  /** Height of the peak in the response, dB. Zero when Q is at or below 0.707. */
  peakingDb: number
  /** Frequency of that peak, Hz. Zero when there is none. */
  peakFrequency: number
  /** First overshoot of the step response, as a fraction. */
  overshoot: number
  /** Gain at the frequency the page is asked about, linear and in dB. */
  gain: number
  gainDb: number
  phase: number
  /** Loop gain runs out here; above it the op-amp, not the network, is in charge. */
  usableLimit: number
  /** Q is high enough that ordinary tolerances move it noticeably. */
  peaky: boolean
  /** The op-amp cannot hold the response up at this f0 and Q. */
  outOfBandwidth: boolean
}

const SQRT_HALF = Math.SQRT1_2

/** Above this, 1% parts start to move Q enough to matter. */
export const HIGH_Q = 3

export function poles(f: SallenKey) {
  const product = f.r1 * f.r2 * f.c1 * f.c2
  const w0 = product > 0 ? 1 / Math.sqrt(product) : 0
  const q =
    f.mode === 'lowpass'
      ? Math.sqrt(product) / (f.c2 * (f.r1 + f.r2))
      : Math.sqrt(product) / (f.r1 * (f.c1 + f.c2))
  return { w0, q }
}

/** |H| at one frequency, from the standard biquad forms. */
export function response(f: SallenKey, frequency: number) {
  const { w0, q } = poles(f)
  const w = 2 * Math.PI * frequency
  const x = w0 > 0 ? w / w0 : 0
  const real = 1 - x * x
  const imag = q > 0 ? x / q : 0
  const denominator = Math.hypot(real, imag)
  if (denominator === 0) return { gain: Infinity, phase: -90 }

  const numerator = f.mode === 'lowpass' ? 1 : x * x
  const gain = numerator / denominator
  const denominatorPhase = (Math.atan2(imag, real) * 180) / Math.PI
  const phase = (f.mode === 'lowpass' ? 0 : 180) - denominatorPhase
  return { gain, phase }
}

export function analyse(f: SallenKey, frequency: number): SallenKeyReadout {
  const { w0, q } = poles(f)
  const f0 = w0 / (2 * Math.PI)
  const zeta = q > 0 ? 1 / (2 * q) : Infinity

  // The -3 dB point of a biquad, which only equals f0 at Q = 0.707.
  const k = 1 - 1 / (2 * q * q)
  const inner = Math.sqrt(Math.max(k * k + 1, 0))
  const lowRatio = Math.sqrt(Math.max(k + inner, 0))
  const cutoff = f.mode === 'lowpass' ? f0 * lowRatio : lowRatio > 0 ? f0 / lowRatio : 0

  // A biquad only peaks once Q passes 1/sqrt(2).
  const peaks = q > SQRT_HALF
  const peakRatio = peaks ? Math.sqrt(1 - 1 / (2 * q * q)) : 0
  const peakFrequency = peaks ? (f.mode === 'lowpass' ? f0 * peakRatio : f0 / peakRatio) : 0
  const peakGain = peaks ? q / Math.sqrt(1 - 1 / (4 * q * q)) : 1
  const peakingDb = peaks ? 20 * Math.log10(peakGain) : 0

  const { gain, phase } = response(f, frequency)

  return {
    f0,
    q,
    zeta,
    cutoff,
    peakingDb,
    peakFrequency,
    overshoot: zeta < 1 ? Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)) : 0,
    gain,
    gainDb: gain > 0 ? 20 * Math.log10(gain) : -Infinity,
    phase,
    // A unity-gain buffer holds up until the loop gain is gone. Q·f0 is the
    // usual rule of thumb for where the op-amp stops behaving ideally.
    usableLimit: f.gbw / Math.max(q, 1),
    peaky: q > HIGH_Q,
    outOfBandwidth: f0 * Math.max(q, 1) > f.gbw / 10,
  }
}

/** State space in capacitor voltages, so zero-order-hold is exact. */
function stateSpace(f: SallenKey): {
  a: Matrix2
  b: [number, number]
  c: [number, number]
  d: number
} {
  if (f.mode === 'lowpass') {
    // States are the node voltages: x0 at the mid node, x1 at the output.
    return {
      a: [
        [
          1 / (f.r2 * f.c2) - 1 / (f.r1 * f.c1) - 1 / (f.r2 * f.c1),
          1 / (f.r2 * f.c1) - 1 / (f.r2 * f.c2),
        ],
        [1 / (f.r2 * f.c2), -1 / (f.r2 * f.c2)],
      ],
      b: [1 / (f.r1 * f.c1), 0],
      c: [0, 1],
      d: 0,
    }
  }
  // High pass: states are the capacitor voltages and the output is what is
  // left of the input after both of them, which is a direct feedthrough.
  return {
    a: [
      [-1 / (f.r2 * f.c1), (1 / f.r1 - 1 / f.r2) / f.c1],
      [-1 / (f.r2 * f.c2), -1 / (f.r2 * f.c2)],
    ],
    b: [1 / (f.r2 * f.c1), 1 / (f.r2 * f.c2)],
    c: [-1, -1],
    d: 1,
  }
}

/**
 * Run the filter over a sampled input. Warm-up runs the input through once and
 * keeps the final state, so a periodic source starts in its steady state
 * instead of showing a switch-on transient that is not what the user asked for.
 */
export function simulate(
  f: SallenKey,
  input: Float64Array,
  dt: number,
  warmUp = true,
): Float64Array {
  const { a, b, c, d } = stateSpace(f)
  const phi = expm2(a, dt)
  const out = new Float64Array(input.length)

  let x0 = 0
  let x1 = 0
  const step = (u: number) => {
    const [s0, s1] = steadyState(a, b, u)
    const d0 = x0 - s0
    const d1 = x1 - s1
    x0 = s0 + phi[0][0] * d0 + phi[0][1] * d1
    x1 = s1 + phi[1][0] * d0 + phi[1][1] * d1
  }

  if (warmUp) for (let i = 0; i < input.length; i++) step(input[i])

  for (let i = 0; i < input.length; i++) {
    out[i] = c[0] * x0 + c[1] * x1 + d * input[i]
    step(input[i])
  }
  return out
}
