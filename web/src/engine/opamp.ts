import type { Key } from '../i18n'
/**
 * Operational amplifier behavioural model.
 *
 * The ideal closed-loop gain is exact algebra on the resistor network. Three
 * real limits sit on top of it, and they are the reason a circuit that works on
 * paper does not work on the bench:
 *
 *  1. Gain bandwidth product. A voltage-feedback op-amp is compensated so that
 *     open-loop gain falls at 20 dB/decade, i.e. gain times bandwidth is
 *     constant. The closed-loop corner is therefore GBW divided by the NOISE
 *     gain, not the signal gain (Analog Devices MT-033, "Voltage Feedback Op
 *     Amp Gain and Bandwidth"). An inverting stage of -10 and a non-inverting
 *     stage of +11 share the same noise gain of 11 and the same bandwidth.
 *  2. Slew rate. The output cannot move faster than SR volts per second no
 *     matter what the small-signal bandwidth says. A sine of peak Vp needs
 *     2*pi*f*Vp, so the full power bandwidth is SR / (2*pi*Vp).
 *  3. Output swing. The output stops a fixed headroom short of each rail.
 *
 * Every pole in the time-domain solver is discretised with an exact
 * zero-order hold, y[n] = target + (y[n-1] - target)*exp(-dt/tau), so it stays
 * stable for any dt. Slew limiting and rail clipping only ever shrink a step,
 * so they cannot destabilise it either.
 */

import { VCC } from './constants'

export type OpAmpMode =
  | 'inverting'
  | 'noninverting'
  | 'buffer'
  | 'summing'
  | 'difference'
  | 'integrator'
  | 'comparator'

export const OPAMP_MODES: ReadonlyArray<{ value: OpAmpMode; label: Key }> = [
  { value: 'inverting', label: 'common.inverting' },
  { value: 'noninverting', label: 'opt.nonInverting' },
  { value: 'buffer', label: 'opt.bufferUnityGain' },
  { value: 'summing', label: 'opt.summing' },
  { value: 'difference', label: 'opt.difference' },
  { value: 'integrator', label: 'opt.integrator' },
  { value: 'comparator', label: 'opt.comparatorHysteresis' },
]

/** The part itself, i.e. everything a datasheet tells you. */
export type OpAmp = {
  /** Gain bandwidth product, Hz. */
  gbw: number
  /** Slew rate, V/s. */
  slewRate: number
  /** Positive supply rail, V. */
  vpos: number
  /** Negative supply rail, V. Zero for single-supply ESP32 work. */
  vneg: number
  /** How close the output gets to each rail, V. Zero would be a perfect part. */
  headroom: number
}

/**
 * MCP6002 typicals: the jellybean rail-to-rail CMOS part that actually runs off
 * an ESP32's 3.3 V rail (1.8 to 6.0 V supply, GBWP 1 MHz, SR 0.6 V/us, output
 * swings to within about 25 mV of either rail). Default supply is VCC, not 5 V.
 */
export const MCP6002: OpAmp = {
  gbw: 1e6,
  slewRate: 0.6e6,
  vpos: VCC,
  vneg: 0,
  headroom: 0.025,
}

/** The resistor and capacitor network around the part. */
export type OpAmpConfig = {
  mode: OpAmpMode
  /** Feedback resistor, ohms. On the integrator this is the DC bleed across Cf. */
  rf: number
  /** Input resistor: Rin (inverting family) or Rg to bias (non-inverting). */
  rin: number
  /** Second input resistor of the summing amplifier, ohms. */
  rin2: number
  /** Integrator feedback capacitor, F. */
  cf: number
  /** DC level on the second input: summing input B, difference reference. */
  v2: number
  /**
   * DC reference the amplifier swings about. On a single supply this must sit
   * at mid rail or an inverting stage parks on the bottom rail.
   */
  vbias: number
  /** Comparator reference voltage feeding the non-inverting node through R2. */
  vref: number
  /** Comparator positive feedback resistor, output to the non-inverting node. */
  r1: number
  /** Comparator resistor from vref to the non-inverting node. */
  r2: number
}

/** Modes where the raw source lands on an op-amp pin, so common mode range bites. */
export function drivesInputPin(mode: OpAmpMode): boolean {
  return mode === 'noninverting' || mode === 'buffer' || mode === 'comparator'
}

/**
 * Modes whose DC operating point is vbias rather than 0 V. On a single supply
 * every one of them has to be built around a mid-rail reference, including the
 * non-inverting stage, whose ground leg returns to vbias instead of to ground.
 */
export function usesBias(mode: OpAmpMode): boolean {
  return mode !== 'buffer' && mode !== 'comparator'
}

/** How close the output can get to each supply rail. */
export function outputLimits(amp: OpAmp): { hi: number; lo: number } {
  return { hi: amp.vpos - amp.headroom, lo: amp.vneg + amp.headroom }
}

/**
 * Small-signal closed-loop gain dVout/dVin.
 *   inverting  Av = -Rf/Rin
 *   non-inv    Av = 1 + Rf/Rg
 *   buffer     Av = 1
 *   summing    dVout/dV1 = -Rf/R1
 *   difference Av = Rf/Rin (with matched ratios on both branches)
 *   integrator Av(DC) = -Rf/Rin, the bleed resistor sets the DC gain
 * The comparator is open loop, so a linear gain is not defined.
 */
export function signalGain(cfg: OpAmpConfig): number {
  switch (cfg.mode) {
    case 'buffer':
      return 1
    case 'noninverting':
      return 1 + cfg.rf / cfg.rin
    case 'inverting':
    case 'summing':
    case 'integrator':
      return -cfg.rf / cfg.rin
    case 'difference':
      return cfg.rf / cfg.rin
    case 'comparator':
      return NaN
  }
}

/**
 * Noise gain: the gain the feedback loop itself sees, 1 + Rf/Rg. This is what
 * divides GBW. For the integrator the feedback impedance falls with frequency,
 * so by the time the GBW pole matters the noise gain is already down at 1, and
 * the useful limit is instead that the integrator's unity gain frequency must
 * sit well below GBW.
 */
export function noiseGain(cfg: OpAmpConfig): number {
  switch (cfg.mode) {
    case 'buffer':
    case 'comparator':
    case 'integrator':
      return 1
    case 'summing': {
      // The inverting node sees R1 in parallel with R2 to the bias rail.
      const rpar = (cfg.rin * cfg.rin2) / (cfg.rin + cfg.rin2)
      return 1 + cfg.rf / rpar
    }
    default:
      return 1 + cfg.rf / cfg.rin
  }
}

/** Closed-loop -3 dB bandwidth, BW = GBW / noise gain. */
export function bandwidth(cfg: OpAmpConfig, amp: OpAmp): number {
  const ng = noiseGain(cfg)
  return ng > 0 ? amp.gbw / ng : Infinity
}

/** Largest sine the output can follow without slew limiting: SR / (2*pi*Vpeak). */
export function fullPowerBandwidth(slewRate: number, vPeak: number): number {
  return vPeak > 0 ? slewRate / (2 * Math.PI * vPeak) : Infinity
}

/** Slope a sine of peak Vp at frequency f demands of the output, V/s. */
export function requiredSlew(freq: number, vPeak: number): number {
  return 2 * Math.PI * freq * vPeak
}

/**
 * Inverting Schmitt trigger thresholds.
 *
 * The signal drives the inverting pin. The non-inverting node sits on a divider
 * between vref (through R2) and the output (through R1), so by superposition
 *   Vth = (vref*R2 + Vout*R1) / (R1 + R2)
 * With R2 >> R1, which is the usual design, that reduces to the familiar
 *   Vth = vref +- Vout*R1/(R1 + R2)
 * and the hysteresis band is exactly (Vhigh - Vlow)*R1/(R1 + R2).
 */
export function thresholds(
  cfg: OpAmpConfig,
  amp: OpAmp,
): { upper: number; lower: number; hysteresis: number } {
  const { hi, lo } = outputLimits(amp)
  const sum = cfg.r1 + cfg.r2
  const k = sum > 0 ? cfg.r1 / sum : 0
  const base = sum > 0 ? (cfg.vref * cfg.r2) / sum : cfg.vref
  return { upper: base + hi * k, lower: base + lo * k, hysteresis: (hi - lo) * k }
}

/**
 * Ideal output for one input sample: infinite gain, infinite bandwidth, no rails.
 * The inverting family swings about vbias, which is the non-inverting pin
 * voltage, so a single supply design biased at VCC/2 works out of the box.
 */
export function idealOutput(cfg: OpAmpConfig, vin: number): number {
  switch (cfg.mode) {
    case 'buffer':
      return vin
    case 'noninverting':
      // The Rg leg returns to vbias, so Vout = Vbias + (1 + Rf/Rg)*(Vin - Vbias).
      // With vbias at 0 that is the split-supply textbook form.
      return cfg.vbias + (1 + cfg.rf / cfg.rin) * (vin - cfg.vbias)
    case 'inverting':
    case 'integrator':
      return cfg.vbias - (cfg.rf / cfg.rin) * (vin - cfg.vbias)
    case 'summing':
      // Vout = Vbias - Rf*((V1-Vbias)/R1 + (V2-Vbias)/R2)
      return (
        cfg.vbias -
        cfg.rf * ((vin - cfg.vbias) / cfg.rin + (cfg.v2 - cfg.vbias) / cfg.rin2)
      )
    case 'difference':
      // Vout = Vref + (Rf/Rin)*(V+ - V-), matched ratios assumed.
      return cfg.vbias + (cfg.rf / cfg.rin) * (vin - cfg.v2)
    case 'comparator':
      return vin
  }
}

export type OpAmpTrace = {
  output: Float64Array
  /** Moving comparator threshold, null outside comparator mode. */
  threshold: Float64Array | null
  /** Samples pinned to a rail. */
  clipped: number
  /** Samples where the slew limiter was active. */
  slewed: number
  /** Largest slope the linear response demanded before limiting, V/s. */
  peakSlope: number
  /** Comparator output transitions over the window. */
  transitions: number
}

/**
 * Run the amplifier over a sampled input.
 *
 * `warmup` runs one throwaway pass and seeds the second with its final state,
 * so a periodic source shows the settled waveform instead of the first-cycle
 * transient. Turn it off to watch a step response slew and settle.
 */
export function simulate(
  input: ArrayLike<number>,
  dt: number,
  cfg: OpAmpConfig,
  amp: OpAmp,
  warmup = true,
): OpAmpTrace {
  const n = input.length
  const output = new Float64Array(n)
  const threshold = cfg.mode === 'comparator' ? new Float64Array(n) : null
  const { hi, lo } = outputLimits(amp)
  const maxStep = Math.max(amp.slewRate, 0) * dt
  const clampOut = (v: number) => (v > hi ? hi : v < lo ? lo : v)

  let clipped = 0
  let slewed = 0
  let peakSlope = 0
  let transitions = 0
  if (n === 0) return { output, threshold, clipped, slewed, peakSlope, transitions }

  // Fraction of the previous state that survives one sample. exp() keeps this
  // in [0,1) for any dt, which is what makes the solver unconditionally stable.
  const tauGbw = noiseGain(cfg) / (2 * Math.PI * Math.max(amp.gbw, 1e-9))
  const alphaGbw = Math.exp(-dt / tauGbw)
  const tauInt = Math.max(cfg.rf * cfg.cf, 1e-12)
  const alphaInt = Math.exp(-dt / tauInt)

  const { upper, lower } = thresholds(cfg, amp)

  /** Move the output one sample toward target through pole, slew and rails. */
  const settle = (y: number, target: number, pole: boolean): number => {
    let next = pole ? target + (y - target) * alphaGbw : target
    const step = next - y
    const slope = Math.abs(step) / dt
    if (slope > peakSlope) peakSlope = slope
    if (Math.abs(step) > maxStep) {
      next = y + Math.sign(step) * maxStep
      slewed++
    }
    if (next > hi || next < lo) {
      next = clampOut(next)
      clipped++
    }
    return next
  }

  const thTrace = threshold
  const pass = (yInit: number, intInit: number, high: boolean, write: boolean) => {
    let y = yInit
    let vInt = intInit
    let outHigh = high
    for (let i = 0; i < n; i++) {
      const x = input[i]
      let target: number

      if (cfg.mode === 'comparator') {
        // Inverting Schmitt: the pin crossing the live threshold flips the
        // output, and the flip moves the threshold away from the signal.
        if (outHigh && x > upper) {
          outHigh = false
          transitions++
        } else if (!outHigh && x < lower) {
          outHigh = true
          transitions++
        }
        if (write && thTrace) thTrace[i] = outHigh ? upper : lower
        // Open loop, so no GBW pole: the edge rate is slew alone.
        target = outHigh ? hi : lo
      } else {
        target = idealOutput(cfg, x)
        if (cfg.mode === 'integrator') {
          // Practical integrator: Zf = Rf || 1/(sCf), a one-pole lag whose DC
          // value is -Rf/Rin*Vin and whose initial slope is -Vin/(Rin*Cf),
          // since (Rf/Rin)/(Rf*Cf) = 1/(Rin*Cf).
          vInt = target + (vInt - target) * alphaInt
          target = vInt
        }
      }

      y = settle(y, target, cfg.mode !== 'comparator')
      if (write) output[i] = y
    }
    return { y, vInt, outHigh }
  }

  // Rest state before the stimulus arrives: the DC operating point, so a step
  // shows its real slew-limited edge instead of starting already settled.
  const outHigh0 = input[0] < upper
  const dcPoint = clampOut(usesBias(cfg.mode) ? cfg.vbias : 0)
  let seed = {
    y: cfg.mode === 'comparator' ? (outHigh0 ? hi : lo) : dcPoint,
    vInt: dcPoint,
    outHigh: outHigh0,
  }

  if (warmup) {
    const end = pass(seed.y, seed.vInt, seed.outHigh, false)
    clipped = 0
    slewed = 0
    peakSlope = 0
    transitions = 0
    seed = end
  }
  pass(seed.y, seed.vInt, seed.outHigh, true)

  return { output, threshold, clipped, slewed, peakSlope, transitions }
}

/** Everything the op-amp page reports, derived once per parameter change. */
export type OpAmpReadout = {
  gain: number
  gainDb: number
  noiseGain: number
  /** Closed-loop -3 dB bandwidth, Hz. */
  bandwidth: number
  /** |H(f)| / |H(0)| at the signal frequency, from the single closed-loop pole. */
  gainError: number
  /** Output peak the ideal gain asks for, V. */
  voutPeak: number
  /** Slope that peak needs at the signal frequency, V/s. */
  slewNeeded: number
  /** Largest undistorted sine at this output peak, Hz. */
  fullPowerBw: number
  slewLimited: boolean
  hi: number
  lo: number
  /** Input impedance seen by the source, ohms. */
  inputZ: number
  /** Ideal integrator unity gain frequency, 1/(2*pi*Rin*Cf). */
  integratorUnity: number
  /** Where the DC bleed resistor stops the integration, 1/(2*pi*Rf*Cf). */
  integratorCorner: number
  upper: number
  lower: number
  hysteresis: number
}

export function analyse(
  cfg: OpAmpConfig,
  amp: OpAmp,
  freq: number,
  vinPeak: number,
): OpAmpReadout {
  const { hi, lo } = outputLimits(amp)
  const gain = signalGain(cfg)
  const bw = bandwidth(cfg, amp)
  const voutPeak =
    cfg.mode === 'comparator' ? (hi - lo) / 2 : Math.abs(gain) * vinPeak
  const slewNeeded = requiredSlew(freq, voutPeak)
  const inputZ = drivesInputPin(cfg.mode) ? Infinity : cfg.rin

  return {
    gain,
    gainDb: 20 * Math.log10(Math.abs(gain)),
    noiseGain: noiseGain(cfg),
    bandwidth: bw,
    gainError: bw > 0 ? 1 / Math.sqrt(1 + (freq / bw) ** 2) : 0,
    voutPeak,
    slewNeeded,
    fullPowerBw: fullPowerBandwidth(amp.slewRate, voutPeak),
    slewLimited: slewNeeded > amp.slewRate,
    hi,
    lo,
    inputZ,
    integratorUnity: 1 / (2 * Math.PI * cfg.rin * cfg.cf),
    integratorCorner: 1 / (2 * Math.PI * cfg.rf * cfg.cf),
    ...thresholds(cfg, amp),
  }
}
