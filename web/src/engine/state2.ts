/**
 * Exact stepping for a two-state linear system, x' = A·x + B·u.
 *
 * Every second-order page in this app needs the same thing: advance a state
 * pair by dt with a piecewise constant input, and stay correct when a slider
 * puts dt far above or below the natural period. Zero-order-hold does that,
 * x[n+1] = xss + exp(A·dt)·(x[n] - xss), and the matrix exponential of a 2x2
 * has a closed form, so there is no integration and nothing to diverge.
 *
 * Forward Euler on a resonant second-order system grows without bound as soon
 * as dt exceeds 2/w0, which a frequency slider reaches immediately.
 */

export type Matrix2 = readonly [readonly [number, number], readonly [number, number]]

/**
 * exp(A·t) in closed form.
 *
 * Shifting by half the trace leaves a traceless matrix whose square is a
 * multiple of the identity (Cayley-Hamilton), so the exponential collapses to
 * two scalars: exp(A·t) = k0·I + k1·(A - tr/2·I). The sign of the discriminant
 * picks trig, linear or hyperbolic.
 *
 * The decaying envelope is folded into those scalars rather than multiplied in
 * afterwards: cosh(r·t) on its own overflows to Infinity long before e^(tr/2·t)
 * could bring it back, and Infinity times zero is NaN.
 */
export function expm2(a: Matrix2, t: number): Matrix2 {
  const half = (a[0][0] + a[1][1]) / 2
  const det = a[0][0] * a[1][1] - a[0][1] * a[1][0]
  const disc = half * half - det
  const scale = Math.abs(half * half) + Math.abs(det) + 1e-30

  let k0: number
  let k1: number
  if (disc < -1e-12 * scale) {
    const w = Math.sqrt(-disc)
    const envelope = Math.exp(half * t)
    k0 = envelope * Math.cos(w * t)
    k1 = (envelope * Math.sin(w * t)) / w
  } else if (disc > 1e-12 * scale) {
    // Real poles: evaluate each one directly, so nothing intermediate is large.
    const r = Math.sqrt(disc)
    const e1 = Math.exp((half + r) * t)
    const e2 = Math.exp((half - r) * t)
    k0 = (e1 + e2) / 2
    k1 = (e1 - e2) / (2 * r)
  } else {
    const envelope = Math.exp(half * t)
    k0 = envelope
    k1 = envelope * t
  }

  return [
    [k0 + k1 * (a[0][0] - half), k1 * a[0][1]],
    [k1 * a[1][0], k0 + k1 * (a[1][1] - half)],
  ]
}

/** Where the state settles for a held input: the solution of A·x + B·u = 0. */
export function steadyState(a: Matrix2, b: readonly [number, number], u: number) {
  const det = a[0][0] * a[1][1] - a[0][1] * a[1][0]
  if (det === 0) return [0, 0] as [number, number]
  const f0 = b[0] * u
  const f1 = b[1] * u
  return [
    -(a[1][1] * f0 - a[0][1] * f1) / det,
    -(-a[1][0] * f0 + a[0][0] * f1) / det,
  ] as [number, number]
}
