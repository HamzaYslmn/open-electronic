/**
 * PWM through an RC low pass: the one-bit DAC every ESP32 project reaches for
 * when it needs an analogue voltage and there is no real DAC pin left.
 *
 * The drive is a rectangular wave between 0 and Vs at f_pwm with duty D. An RC
 * low pass is linear and time invariant, so its response to a periodic drive
 * splits exactly into a periodic steady state plus a single decaying
 * exponential. That gives a closed-form trace, i.e. nothing integrates step by
 * step and nothing can blow up however far the frequency slider is dragged.
 *
 * References: standard first-order RC step response; the exact rectangular-wave
 * ripple follows from matching charge and discharge over one period.
 */

import { ADC_BITS, ADC_FULL_SCALE, GPIO_MAX_MA } from './constants'

/**
 * ESP32 LEDC default timer clock (APB, 80 MHz). Duty resolution is bounded by
 * it: the timer counts 2^bits steps per PWM period, so 2^bits * f <= 80 MHz.
 */
export const LEDC_CLK_HZ = 80e6

/**
 * Rule of thumb thresholds for f_pwm / fc. At 100 the switching fundamental is
 * down 40 dB and the output reads as a DC level; below 20 (26 dB) the ripple
 * dominates and the RC is not really smoothing anything.
 */
export const FC_RATIO_GOOD = 100
export const FC_RATIO_MIN = 20

/** ESP32 ADC least significant bit, volts. Used to size the ripple. */
export const ADC_LSB = ADC_FULL_SCALE / Math.pow(2, ADC_BITS)

/** Time constant in seconds, tau = R*C. */
export function timeConstant(r: number, c: number): number {
  return r * c
}

/** -3 dB corner of the filter, fc = 1 / (2*pi*R*C). */
export function cutoff(r: number, c: number): number {
  const tau = timeConstant(r, c)
  return tau > 0 ? 1 / (2 * Math.PI * tau) : Infinity
}

/**
 * DC output. The low pass has unity DC gain and the rectangle's mean is D*Vs,
 * so Vout_avg = D * Vs regardless of R and C.
 */
export function meanOutput(vs: number, duty: number): number {
  return duty * vs
}

/**
 * Small-ripple estimate, the version quoted in every application note:
 * Vpp ~= Vs * D * (1-D) / (f * R * C). It is the first-order expansion of
 * steadyState() and is only trustworthy while tau >> 1/f.
 */
export function rippleApprox(vs: number, duty: number, f: number, tau: number): number {
  if (!(f > 0) || !(tau > 0)) return 0
  return (vs * duty * (1 - duty)) / (f * tau)
}

/**
 * Settling time to within `band` of the final value: t = -tau * ln(band).
 * The familiar "5 tau" rule of thumb is this with band = 0.0067, i.e. 99.3%.
 */
export function settlingTime(tau: number, band = 0.01): number {
  if (!(tau > 0) || !(band > 0) || band >= 1) return 0
  return -tau * Math.log(band)
}

/** Filter attenuation at frequency f, in dB: -10*log10(1 + (f/fc)^2). */
export function attenuationDb(f: number, fc: number): number {
  if (!Number.isFinite(fc) || fc <= 0) return -Infinity
  const x = f / fc
  return -10 * Math.log10(1 + x * x)
}

/**
 * Largest LEDC duty resolution usable at this frequency, from
 * 2^bits * f <= LEDC_CLK_HZ. The ESP32 timer tops out at 20 bits.
 */
export function maxDutyBits(f: number, clk = LEDC_CLK_HZ): number {
  if (!(f > 0)) return 20
  return Math.max(1, Math.min(20, Math.floor(Math.log2(clk / f))))
}

/** Duty the hardware can actually produce with `bits` of register resolution. */
export function quantiseDuty(duty: number, bits: number): number {
  const steps = Math.pow(2, Math.max(1, Math.round(bits)))
  return Math.min(1, Math.max(0, Math.round(duty * steps) / steps))
}

export type SteadyState = {
  /** Output at the end of the off time, i.e. the bottom of the ripple. */
  vmin: number
  /** Output at the end of the on time, i.e. the top of the ripple. */
  vmax: number
  /** Peak-to-peak ripple. */
  vpp: number
}

/**
 * Exact steady-state ripple of an RC low pass driven by a 0..Vs rectangle.
 *
 * With T = 1/f, a = e^(-D*T/tau) and b = e^(-(1-D)*T/tau), matching the two
 * halves of a period (Vmax = Vs + (Vmin-Vs)*a and Vmin = Vmax*b) gives
 *   Vmax = Vs (1-a) / (1-a*b),  Vmin = b*Vmax,  Vpp = Vs (1-a)(1-b) / (1-a*b).
 * Note a*b = e^(-T/tau), so every factor is written with expm1: when tau >> T
 * all three approach 1 and the naive subtraction loses every significant digit.
 */
export function steadyState(
  vs: number,
  duty: number,
  f: number,
  tau: number,
): SteadyState {
  const dc = vs * duty
  if (!(f > 0)) return { vmin: dc, vmax: dc, vpp: 0 }
  if (!(tau > 0)) return { vmin: 0, vmax: vs, vpp: vs }

  const t = 1 / f
  const oneMinusA = -Math.expm1((-duty * t) / tau)
  const oneMinusB = -Math.expm1((-(1 - duty) * t) / tau)
  const oneMinusAb = -Math.expm1(-t / tau)
  // tau so large that T/tau underflows: the ripple is below double precision.
  if (!(oneMinusAb > 0)) return { vmin: dc, vmax: dc, vpp: 0 }

  const vmax = (vs * oneMinusA) / oneMinusAb
  const vpp = (vs * oneMinusA * oneMinusB) / oneMinusAb
  return { vmin: vmax - vpp, vmax, vpp }
}

/**
 * Periodic steady-state output at time t, with a rising edge at t = 0.
 * Charging: Vs + (Vmin - Vs)*e^(-t'/tau) during the on time.
 * Discharging: Vmax*e^(-t''/tau) during the off time.
 */
function steadyAt(
  ss: SteadyState,
  vs: number,
  duty: number,
  f: number,
  tau: number,
  t: number,
): number {
  if (!(f > 0)) return ss.vmax
  const period = 1 / f
  const raw = (t * f) % 1
  const p = raw < 0 ? raw + 1 : raw
  if (!(tau > 0)) return p < duty ? vs : 0
  return p < duty
    ? vs + (ss.vmin - vs) * Math.exp((-p * period) / tau)
    : ss.vmax * Math.exp((-(p - duty) * period) / tau)
}

export type SimulateOptions = {
  vs: number
  duty: number
  f: number
  tau: number
  /** Sample count. */
  n: number
  /** Seconds per sample. */
  dt: number
  /** Output at t = 0. Omit to start already settled, i.e. pure ripple. */
  y0?: number
}

/**
 * Output trace, n samples spaced dt apart, first PWM rising edge at t = 0.
 *
 * y(t) = y_ss(t) + (y0 - y_ss(0)) * e^(-t/tau)
 *
 * This is the exact solution, not a discretisation, so it is stable and
 * accurate at any dt: no forward Euler, no accumulating state, no dependence
 * on dt being small next to tau or next to the PWM period.
 */
export function simulate({ vs, duty, f, tau, n, dt, y0 }: SimulateOptions): Float64Array {
  const out = new Float64Array(n)
  if (n <= 0) return out
  const ss = steadyState(vs, duty, f, tau)
  const start = steadyAt(ss, vs, duty, f, tau, 0)
  const offset = (y0 ?? start) - start

  for (let i = 0; i < n; i++) {
    const t = i * dt
    const decay = tau > 0 ? Math.exp(-t / tau) : 0
    out[i] = steadyAt(ss, vs, duty, f, tau, t) + offset * decay
  }
  return out
}

/** How well the RC is doing its job, from the f_pwm / fc ratio. */
export type Smoothing = 'good' | 'marginal' | 'poor'

export function smoothing(ratio: number): Smoothing {
  if (ratio >= FC_RATIO_GOOD) return 'good'
  if (ratio >= FC_RATIO_MIN) return 'marginal'
  return 'poor'
}

export type PwmFilterSpec = {
  /** Rail the PWM pin swings between 0 and vs. Defaults to VCC on the page. */
  vs: number
  r: number
  c: number
  /** PWM switching frequency, Hz. */
  f: number
  /** Commanded duty, 0..1, before hardware quantisation. */
  duty: number
  /** LEDC duty register resolution, bits. */
  bits: number
}

export type PwmFilterReadout = {
  tau: number
  fc: number
  /** f_pwm / fc. */
  ratio: number
  smoothing: Smoothing
  attenDb: number
  /** Duty the LEDC hardware actually produces. */
  dutyEff: number
  /** Output step for one duty count, Vs / 2^bits. */
  dutyStepV: number
  /** Largest resolution the LEDC clock allows at this frequency. */
  maxBits: number
  bitsOk: boolean
  /** Mean output, D*Vs. */
  vavg: number
  vmin: number
  vmax: number
  /** Exact peak-to-peak ripple. */
  vpp: number
  /** The Vs*D*(1-D)/(f*tau) estimate, for comparison. */
  vppApprox: number
  /** Ripple as a percentage of the mean output. */
  ripplePercent: number
  /** Ripple measured in ESP32 ADC counts. */
  rippleLsb: number
  /** Bits of a Vs full-scale DAC that the ripple still leaves usable. */
  effectiveBits: number
  /** Settling to within 1% of the final value. */
  settle1pc: number
  /** The 5 tau rule of thumb, 99.3% settled. */
  settle5tau: number
  /** Worst-case pin current, at power-on with the cap still empty. */
  gpioPeakA: number
  gpioOk: boolean
}

/** Everything the PWM filter page reports, derived once per parameter change. */
export function analyse(spec: PwmFilterSpec): PwmFilterReadout {
  const { vs, r, c, f, bits } = spec
  const tau = timeConstant(r, c)
  const fc = cutoff(r, c)
  const dutyEff = quantiseDuty(spec.duty, bits)
  const steps = Math.pow(2, Math.max(1, Math.round(bits)))

  const ss = steadyState(vs, dutyEff, f, tau)
  const vavg = meanOutput(vs, dutyEff)
  const ratio = Number.isFinite(fc) && fc > 0 ? f / fc : 0
  // Worst case is a rising edge with the capacitor still at 0 V, i.e. power-on.
  const gpioPeakA = r > 0 ? vs / r : Infinity

  return {
    tau,
    fc,
    ratio,
    smoothing: smoothing(ratio),
    attenDb: attenuationDb(f, fc),
    dutyEff,
    dutyStepV: vs / steps,
    maxBits: maxDutyBits(f),
    bitsOk: Math.round(bits) <= maxDutyBits(f),
    vavg,
    vmin: ss.vmin,
    vmax: ss.vmax,
    vpp: ss.vpp,
    vppApprox: rippleApprox(vs, dutyEff, f, tau),
    ripplePercent: vavg > 0 ? (ss.vpp / vavg) * 100 : 0,
    rippleLsb: ss.vpp / ADC_LSB,
    effectiveBits: ss.vpp > 0 ? Math.max(0, Math.log2(vs / ss.vpp)) : Infinity,
    settle1pc: settlingTime(tau, 0.01),
    settle5tau: 5 * tau,
    gpioPeakA,
    gpioOk: gpioPeakA * 1000 <= GPIO_MAX_MA,
  }
}
