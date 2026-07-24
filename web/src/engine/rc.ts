/**
 * First-order RC filter math.
 *
 * Frequency response is the closed-form transfer function; the time-domain
 * trace uses exact zero-order-hold discretisation rather than forward Euler,
 * so the result stays correct (and stable) even when dt is comparable to tau.
 * Forward Euler diverges once dt > 2*tau, which is easy to hit when the user
 * drags the frequency slider.
 */

export type RCMode = 'lowpass' | 'highpass'

/** Time constant in seconds. */
export function timeConstant(r: number, c: number): number {
  return r * c
}

/** -3 dB corner frequency, fc = 1 / (2*pi*R*C). */
export function cutoff(r: number, c: number): number {
  const tau = timeConstant(r, c)
  return tau > 0 ? 1 / (2 * Math.PI * tau) : Infinity
}

/** Voltage gain magnitude (linear, not dB) at frequency f. */
export function magnitude(f: number, fc: number, mode: RCMode): number {
  if (!Number.isFinite(fc) || fc <= 0) return mode === 'lowpass' ? 1 : 0
  const x = f / fc
  const denom = Math.sqrt(1 + x * x)
  return mode === 'lowpass' ? 1 / denom : x / denom
}

/** Phase shift of Vout relative to Vin, in degrees. */
export function phaseDeg(f: number, fc: number, mode: RCMode): number {
  if (!Number.isFinite(fc) || fc <= 0) return 0
  const lag = (Math.atan(f / fc) * 180) / Math.PI
  return mode === 'lowpass' ? -lag : 90 - lag
}

/**
 * Run the filter over a sampled input.
 *
 * `warmup` runs one throwaway pass and seeds the second pass with its final
 * state. For a periodic input that lands on the periodic steady state, so the
 * scope shows the settled waveform instead of the first-cycle transient.
 * Leave it off to watch the step/charging response.
 */
export function simulate(
  input: ArrayLike<number>,
  dt: number,
  tau: number,
  mode: RCMode,
  warmup = true,
): Float64Array {
  const n = input.length
  const out = new Float64Array(n)
  if (n === 0) return out

  // alpha is the fraction of the previous state that survives one sample.
  const alpha = tau > 0 ? Math.exp(-dt / tau) : 0

  const pass = (yInit: number, xInit: number, write: boolean): [number, number] => {
    let y = yInit
    let xPrev = xInit
    for (let i = 0; i < n; i++) {
      const x = input[i]
      y =
        mode === 'lowpass'
          ? x + (y - x) * alpha // settles toward x with time constant tau
          : alpha * (y + x - xPrev) // differentiator: passes changes, drops DC
      if (write) out[i] = y
      xPrev = x
    }
    return [y, xPrev]
  }

  let y0 = mode === 'lowpass' ? input[0] : 0
  let x0 = input[0]
  if (warmup) [y0, x0] = pass(y0, x0, false)
  pass(y0, x0, true)
  return out
}

/** Everything the RC page reports, derived once per parameter change. */
export type RCReadout = {
  tau: number
  fc: number
  gain: number
  gainDb: number
  phase: number
  /** Capacitive reactance at the source frequency. */
  xc: number
  /** Magnitude of the series impedance seen by the source. */
  z: number
}

export function analyse(r: number, c: number, f: number, mode: RCMode): RCReadout {
  const tau = timeConstant(r, c)
  const fc = cutoff(r, c)
  const gain = magnitude(f, fc, mode)
  const xc = f > 0 && c > 0 ? 1 / (2 * Math.PI * f * c) : Infinity
  return {
    tau,
    fc,
    gain,
    gainDb: 20 * Math.log10(gain),
    phase: phaseDeg(f, fc, mode),
    xc,
    z: Number.isFinite(xc) ? Math.hypot(r, xc) : Infinity,
  }
}
