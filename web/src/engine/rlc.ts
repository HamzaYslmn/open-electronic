/**
 * Series and parallel RLC resonance.
 *
 * The figures of merit (f0, Q, bandwidth, zeta) are closed form. The scope trace
 * is a two-state simulation of x = [v, iL] using exact zero-order-hold
 * discretisation, x[n+1] = xss + exp(A*dt)*(x[n] - xss), with the matrix
 * exponential evaluated in closed form. That is exact for a piecewise constant
 * input and cannot go unstable at any dt. Forward Euler on a resonant
 * second-order system grows without bound as soon as dt > 2/w0, which the
 * frequency slider reaches immediately.
 *
 * Topologies, both driven from a voltage source so the page speaks one unit:
 *   series:   Vin -> R -> L -> C -> ground, output is the capacitor voltage.
 *             Settles to Vin at DC.
 *   parallel: Vin -> R -> node, with L and C from that node to ground, output
 *             is the node voltage. This is the Thevenin form of a current
 *             source is = Vin/R feeding R || L || C, so the parallel Q applies.
 *             Settles to 0 at DC because the inductor is a short.
 *
 * References: Nilsson & Riedel, Electric Circuits, ch. 8 (natural and step
 * response of RLC circuits); Sedra & Smith, appendix on second-order networks.
 */

export type RLCTopology = 'series' | 'parallel'

export type Damping = 'under' | 'critical' | 'over'

/** Within this fraction of zeta = 1 the network is reported as critically damped. */
const CRITICAL_TOLERANCE = 1e-3

/** Settling is quoted as the time for the envelope to fall inside 1% of final. */
const SETTLING_BAND = 0.01

/** Above this Q the ideal L and C model stops being believable: real ESR dominates. */
export const HIGH_Q_LIMIT = 50

/** Undamped natural frequency in rad/s, w0 = 1 / sqrt(L*C). */
export function angularResonance(l: number, c: number): number {
  return l > 0 && c > 0 ? 1 / Math.sqrt(l * c) : Infinity
}

/** Resonant frequency, f0 = 1 / (2*pi*sqrt(L*C)). */
export function resonantFrequency(l: number, c: number): number {
  return angularResonance(l, c) / (2 * Math.PI)
}

/** Characteristic impedance of the tank, Z0 = sqrt(L/C). Both Q formulas reduce to it. */
export function characteristicImpedance(l: number, c: number): number {
  return c > 0 ? Math.sqrt(l / c) : Infinity
}

/**
 * Quality factor.
 * Series:   Q = (1/R) * sqrt(L/C) = Z0/R.
 * Parallel: Q = R * sqrt(C/L)     = R/Z0.
 */
export function qualityFactor(
  r: number,
  l: number,
  c: number,
  topology: RLCTopology,
): number {
  const z0 = characteristicImpedance(l, c)
  if (topology === 'series') return r > 0 ? z0 / r : Infinity
  return Number.isFinite(z0) && z0 > 0 ? r / z0 : 0
}

/**
 * Neper (damping) frequency alpha in rad/s.
 * Series: alpha = R / (2L). Parallel: alpha = 1 / (2*R*C).
 */
export function neperFrequency(
  r: number,
  l: number,
  c: number,
  topology: RLCTopology,
): number {
  if (topology === 'series') return l > 0 ? r / (2 * l) : Infinity
  return r > 0 && c > 0 ? 1 / (2 * r * c) : Infinity
}

/** Damping ratio zeta = alpha / w0 = 1 / (2Q). */
export function dampingRatio(
  r: number,
  l: number,
  c: number,
  topology: RLCTopology,
): number {
  const w0 = angularResonance(l, c)
  return Number.isFinite(w0) && w0 > 0 ? neperFrequency(r, l, c, topology) / w0 : Infinity
}

/** Under, critically or over damped, with a small band around zeta = 1. */
export function dampingRegime(zeta: number): Damping {
  if (Math.abs(zeta - 1) <= CRITICAL_TOLERANCE) return 'critical'
  return zeta < 1 ? 'under' : 'over'
}

/** Ring frequency in rad/s, wd = w0*sqrt(1 - zeta^2). Zero when not underdamped. */
export function dampedAngular(w0: number, zeta: number): number {
  return zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0
}

/** -3 dB bandwidth, BW = f0 / Q. */
export function bandwidth(f0: number, q: number): number {
  return q > 0 ? f0 / q : Infinity
}

/**
 * Resistance that puts the network exactly at zeta = 1.
 * Series: R = 2*sqrt(L/C). Parallel: R = 0.5*sqrt(L/C).
 */
export function criticalResistance(
  l: number,
  c: number,
  topology: RLCTopology,
): number {
  const z0 = characteristicImpedance(l, c)
  return topology === 'series' ? 2 * z0 : z0 / 2
}

/**
 * Fractional first-peak overshoot of a second-order step response,
 * Mp = exp(-pi*zeta / sqrt(1 - zeta^2)). Zero unless underdamped.
 * Applies to the series capacitor voltage, which is the only branch here whose
 * step response has a non-zero final value.
 */
export function overshootFraction(zeta: number): number {
  if (zeta >= 1 || zeta < 0) return 0
  return Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta))
}

/**
 * exp(-alpha*t) folded into the two scalar coefficients of the matrix
 * exponential: exp(A*t) = ec*I + es*(A + alpha*I).
 *
 * (A + alpha*I) is traceless in both topologies, so by Cayley-Hamilton its
 * square is (alpha^2 - w0^2)*I and the whole exponential collapses to two
 * scalars. Sign of that discriminant selects trig, linear or hyperbolic.
 * The overdamped branch is written with the pole exponentials once wr*t is
 * large, because exp(-alpha*t)*cosh(wr*t) underflows times overflows to NaN.
 */
function expCoeffs(alpha: number, w0: number, t: number): [number, number] {
  const disc = alpha * alpha - w0 * w0
  const scale = alpha * alpha + w0 * w0

  if (disc < -1e-12 * scale) {
    const wd = Math.sqrt(-disc)
    const e = Math.exp(-alpha * t)
    return [e * Math.cos(wd * t), (e * Math.sin(wd * t)) / wd]
  }

  if (disc > 1e-12 * scale) {
    const wr = Math.sqrt(disc)
    if (wr * t < 20) {
      // sinh keeps its precision as wr*t -> 0, where the pole difference cancels.
      const e = Math.exp(-alpha * t)
      return [e * Math.cosh(wr * t), (e * Math.sinh(wr * t)) / wr]
    }
    // Both poles are negative, so both exponentials are bounded by 1.
    const e1 = Math.exp((wr - alpha) * t)
    const e2 = Math.exp(-(alpha + wr) * t)
    return [(e1 + e2) / 2, (e1 - e2) / (2 * wr)]
  }

  // Repeated root: exp(A*t) = e^(-alpha*t) * (I + (A + alpha*I)*t).
  const e = Math.exp(-alpha * t)
  return [e, e * t]
}

export type RLCTraces = {
  /** Capacitor voltage (series) or tank node voltage (parallel), in volts. */
  vout: Float64Array
  /** Inductor current in amps. */
  current: Float64Array
}

/**
 * Run the network over a sampled drive voltage.
 *
 * `warmup` runs one throwaway pass and seeds the second with its final state,
 * so a periodic drive shows the settled waveform instead of the first-cycle
 * transient. Leave it off to watch the step response from rest.
 */
export function simulate(
  input: ArrayLike<number>,
  dt: number,
  r: number,
  l: number,
  c: number,
  topology: RLCTopology,
  warmup = true,
): RLCTraces {
  const n = input.length
  const vout = new Float64Array(n)
  const current = new Float64Array(n)
  if (n === 0) return { vout, current }

  const w0 = angularResonance(l, c)
  const alpha = neperFrequency(r, l, c, topology)
  if (!Number.isFinite(w0) || !Number.isFinite(alpha) || !(dt > 0)) {
    return { vout, current }
  }

  const [ec, es] = expCoeffs(alpha, w0, dt)
  const series = topology === 'series'

  // Ad = ec*I + es*(A + alpha*I), written out for each topology.
  //   series A   = [[0, 1/C], [-1/L, -R/L]]
  //   parallel A = [[-1/(R*C), -1/C], [1/L, 0]]
  const a00 = series ? ec + es * alpha : ec - es * alpha
  const a01 = series ? es / c : -es / c
  const a10 = series ? -es / l : es / l
  const a11 = series ? ec - es * alpha : ec + es * alpha

  const pass = (v0: number, i0: number, write: boolean): [number, number] => {
    let v = v0
    let i = i0
    for (let k = 0; k < n; k++) {
      if (write) {
        vout[k] = v
        current[k] = i
      }
      const u = input[k]
      // State the network is heading for while u is held over this sample.
      const vss = series ? u : 0
      const iss = series ? 0 : u / r
      const dv = v - vss
      const di = i - iss
      v = vss + a00 * dv + a01 * di
      i = iss + a10 * dv + a11 * di
    }
    return [v, i]
  }

  let v0 = 0
  let i0 = 0
  if (warmup) [v0, i0] = pass(0, 0, false)
  pass(v0, i0, true)
  return { vout, current }
}

export type RLCReadout = {
  /** Resonant frequency in Hz. */
  f0: number
  /** Undamped natural frequency in rad/s. */
  w0: number
  /** Neper frequency in rad/s. */
  alpha: number
  q: number
  zeta: number
  damping: Damping
  /** -3 dB bandwidth in Hz. */
  bw: number
  /** Lower and upper half-power frequencies in Hz. */
  fLow: number
  fHigh: number
  /** Ring frequency in Hz, 0 unless underdamped. */
  fd: number
  /** Characteristic impedance sqrt(L/C). */
  z0: number
  /** Resistance for exactly critical damping. */
  rCritical: number
  /** Fractional first-peak overshoot of the series step response. */
  overshoot: number
  /** Slowest pole time constant, 1 / |Re(s_slow)|. */
  tauDominant: number
  /** Time for the response to settle inside 1% of its final value. */
  settling: number
}

export function analyse(
  r: number,
  l: number,
  c: number,
  topology: RLCTopology,
): RLCReadout {
  const w0 = angularResonance(l, c)
  const alpha = neperFrequency(r, l, c, topology)
  const zeta = dampingRatio(r, l, c, topology)
  const q = qualityFactor(r, l, c, topology)
  const f0 = w0 / (2 * Math.PI)
  const bw = bandwidth(f0, q)

  // Half-power edges: f = f0*(sqrt(1 + zeta^2) +/- zeta). Their difference is
  // exactly BW and their geometric mean is exactly f0.
  const root = Math.sqrt(1 + zeta * zeta)
  const fLow = f0 * (root - zeta)
  const fHigh = f0 * (root + zeta)

  // Slowest pole. Overdamped roots are -alpha +/- sqrt(alpha^2 - w0^2); the
  // slow one is written as w0^2/(alpha + wr) to dodge the cancellation.
  let slow = alpha
  if (zeta > 1 && Number.isFinite(alpha)) {
    const wr = Math.sqrt(alpha * alpha - w0 * w0)
    slow = (w0 * w0) / (alpha + wr)
  }
  const tauDominant = slow > 0 ? 1 / slow : Infinity

  return {
    f0,
    w0,
    alpha,
    q,
    zeta,
    damping: dampingRegime(zeta),
    bw,
    fLow,
    fHigh,
    fd: dampedAngular(w0, zeta) / (2 * Math.PI),
    z0: characteristicImpedance(l, c),
    rCritical: criticalResistance(l, c, topology),
    overshoot: overshootFraction(zeta),
    tauDominant,
    settling: tauDominant * Math.log(1 / SETTLING_BAND),
  }
}
