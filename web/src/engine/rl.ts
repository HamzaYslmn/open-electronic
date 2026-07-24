/**
 * First-order RL filter math, the exact dual of src/engine/rc.ts.
 *
 * The circuit is one series loop: source, external resistor R, inductor L with
 * its winding resistance Rw. Taking the output across R gives a low pass,
 * taking it across the inductor gives a high pass, both with tau = L / R and
 * fc = R / (2*pi*L) where R is the total series resistance.
 *
 * Winding resistance is modelled because it is the reason real RL filters
 * disappoint: it never leaves the loop, so it shifts fc up and puts a floor on
 * the stopband. Set it to 0 for the textbook case.
 *
 * The time-domain solver integrates the loop current, L*di/dt = v - i*R, with
 * exact zero-order-hold discretisation rather than forward Euler. Euler on this
 * equation diverges once dt > 2*tau, which is trivially reached when the user
 * drags the frequency slider, so it is not used here.
 */

export type RLMode = 'lowpass' | 'highpass'

/** Time constant tau = L / R, seconds. R is the total series resistance. */
export function timeConstant(l: number, r: number): number {
  return r > 0 ? l / r : Infinity
}

/** -3 dB corner frequency, fc = R / (2*pi*L). Dual of fc = 1/(2*pi*R*C). */
export function cutoff(l: number, r: number): number {
  const tau = timeConstant(l, r)
  return tau > 0 && Number.isFinite(tau) ? 1 / (2 * Math.PI * tau) : Infinity
}

/** Inductive reactance XL = 2*pi*f*L, ohms. Rises with frequency, unlike Xc. */
export function reactance(f: number, l: number): number {
  return 2 * Math.PI * f * l
}

/**
 * Voltage gain magnitude (linear, not dB) at frequency f.
 *
 * Low pass, output across R:  |H| = R / |Z|
 * High pass, output across L: |H| = sqrt(Rw^2 + XL^2) / |Z|
 * with |Z| = sqrt((R + Rw)^2 + XL^2).
 */
export function magnitude(
  f: number,
  r: number,
  l: number,
  rw: number,
  mode: RLMode,
): number {
  const xl = reactance(f, l)
  const z = Math.hypot(r + rw, xl)
  if (z <= 0) return mode === 'lowpass' ? 1 : 0
  return mode === 'lowpass' ? r / z : Math.hypot(rw, xl) / z
}

/**
 * Phase of Vout relative to Vin, in degrees.
 * The loop current lags Vin by atan(XL / Rtotal). The low pass output is in
 * phase with that current; the high pass output leads it by atan(XL / Rw),
 * which is the ideal 90 degrees only when the winding is lossless.
 */
export function phaseDeg(
  f: number,
  r: number,
  l: number,
  rw: number,
  mode: RLMode,
): number {
  const xl = reactance(f, l)
  const lag = Math.atan2(xl, r + rw)
  const lead = mode === 'lowpass' ? 0 : Math.atan2(xl, rw)
  return ((lead - lag) * 180) / Math.PI
}

export type RLTrace = {
  /** Loop current in amps, the state variable the solver actually integrates. */
  current: Float64Array
  /** Voltage across the external resistor, i.e. the low pass output. */
  vR: Float64Array
  /** Voltage across the inductor including its winding resistance, i.e. the high pass output. */
  vL: Float64Array
}

/**
 * Run the loop over a sampled input.
 *
 * `warmup` runs one throwaway pass and seeds the second pass with its final
 * current. For a periodic input that lands on the periodic steady state, so the
 * scope shows the settled waveform instead of the first-cycle transient. Leave
 * it off to watch the current ramp up from zero.
 */
export function simulate(
  input: ArrayLike<number>,
  dt: number,
  r: number,
  l: number,
  rw = 0,
  warmup = true,
): RLTrace {
  const n = input.length
  const current = new Float64Array(n)
  const vR = new Float64Array(n)
  const vL = new Float64Array(n)
  if (n === 0) return { current, vR, vL }

  const rTotal = r + rw
  const tau = timeConstant(l, rTotal)
  // Fraction of the previous current that survives one sample. It is in [0, 1]
  // for every dt, so the solver can undershoot but never overshoot or ring.
  const alpha = tau > 0 && Number.isFinite(tau) ? Math.exp(-dt / tau) : 0

  const pass = (iInit: number, write: boolean): number => {
    let i = iInit
    for (let k = 0; k < n; k++) {
      // Current the loop would settle to if this sample were held forever.
      const target = rTotal > 0 ? input[k] / rTotal : 0
      i = target + (i - target) * alpha
      if (write) {
        current[k] = i
        vR[k] = i * r
        // KVL: whatever the resistor does not drop, the inductor does.
        vL[k] = input[k] - i * r
      }
    }
    return i
  }

  let i0 = rTotal > 0 ? input[0] / rTotal : 0
  if (warmup) i0 = pass(i0, false)
  pass(i0, true)
  return { current, vR, vL }
}

/** Largest absolute value in a trace, used for the saturation check. */
export function peakMagnitude(samples: ArrayLike<number>): number {
  let peak = 0
  for (let i = 0; i < samples.length; i++) {
    const v = Math.abs(samples[i])
    if (v > peak) peak = v
  }
  return peak
}

/** Everything the RL page reports, derived once per parameter change. */
export type RLReadout = {
  tau: number
  fc: number
  gain: number
  gainDb: number
  phase: number
  /** Inductive reactance at the source frequency. */
  xl: number
  /** External R plus winding resistance, the R that sets tau and fc. */
  rTotal: number
  /** Magnitude of the series impedance the source has to drive. */
  z: number
  /**
   * What the winding resistance costs, in dB. Low pass: the passband never
   * reaches 0 dB. High pass: this is the DC feedthrough floor instead, since a
   * resistive winding cannot block DC.
   */
  parasiticDb: number
}

export function analyse(
  r: number,
  l: number,
  rw: number,
  f: number,
  mode: RLMode,
): RLReadout {
  const rTotal = r + rw
  const xl = reactance(f, l)
  const gain = magnitude(f, r, l, rw, mode)
  const floor = rTotal > 0 ? (mode === 'lowpass' ? r : rw) / rTotal : 1
  return {
    tau: timeConstant(l, rTotal),
    fc: cutoff(l, rTotal),
    gain,
    gainDb: 20 * Math.log10(gain),
    phase: phaseDeg(f, r, l, rw, mode),
    xl,
    rTotal,
    z: Math.hypot(rTotal, xl),
    parasiticDb: 20 * Math.log10(floor),
  }
}
