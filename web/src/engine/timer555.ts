/**
 * 555 timer: astable (free running) and monostable (one shot).
 *
 * Every interval is an RC crossing between two comparator levels set by the
 * internal 5k-5k-5k divider that gives the part its name, so all timing is
 * ratiometric: change Vcc and the frequency does not move.
 *
 * Astable, C charges through R1+R2 and discharges through R2 alone:
 *   t_high = ln2 * (R1 + R2) * C        (1/3 Vcc up to 2/3 Vcc)
 *   t_low  = ln2 * R2 * C               (2/3 Vcc back down to 1/3 Vcc)
 *   f      = 1 / (ln2 * (R1 + 2*R2) * C) = 1.44 / ((R1 + 2*R2) * C)
 *   duty   = (R1 + R2) / (R1 + 2*R2)    (always above 50% for R1 > 0)
 *
 * Monostable, C charges from 0 through R until it hits 2/3 Vcc:
 *   t = ln3 * R * C = 1.1 * R * C
 *
 * The time-domain traces are not a re-derivation of those formulas. They are an
 * exact-exponential state machine: each step relaxes the capacitor with the
 * closed-form solution and solves analytically for the comparator crossing time
 * inside the step, so the edges land in the right place at any dt and nothing
 * can diverge the way forward Euler would.
 *
 * Datasheet numbers below come from TI NE555 (SLFS022) and TI TLC555 (SLFS029).
 */

export type Timer555Mode = 'astable' | 'monostable'
export type Timer555Variant = 'bipolar' | 'cmos'

/** Threshold comparator (pin 6) trips at 2/3 Vcc. */
export const THRESHOLD_RATIO = 2 / 3
/** Trigger comparator (pin 2) trips at 1/3 Vcc. */
export const TRIGGER_RATIO = 1 / 3

/** ln 2 = 0.6931, one RC crossing from 1/3 Vcc to 2/3 Vcc. */
export const K_ASTABLE = Math.LN2
/** ln 3 = 1.0986, i.e. the "1.1" in t = 1.1*R*C, from 0 V to 2/3 Vcc. */
export const K_MONOSTABLE = Math.log(3)

/**
 * Discharge transistor on resistance. The NE555 datasheet gives 0.1 V
 * saturation at 10 mA sink, i.e. about 10 ohms. It only shows up in monostable
 * mode, where C sits directly on pin 7 and dumps through the transistor.
 */
export const R_DISCHARGE_ON = 10

/**
 * Threshold pin input bias, 30 nA typical (250 nA max). It flows through the
 * timing resistors, so its IR drop shifts the effective threshold and becomes a
 * direct timing error. This is what puts a practical ceiling on R.
 */
export const THRESHOLD_BIAS_A = 30e-9

/** Timing error fraction above which the readout stops being trustworthy. */
const BIAS_ERROR_LIMIT = 0.05

export type VariantSpec = {
  label: string
  /** Datasheet supply range. */
  minSupply: number
  maxSupply: number
  /** Output high sits this far below Vcc at the rated load. */
  outputDrop: number
  /** Output low saturation above ground. */
  outputSat: number
  /** Pin 7 sink rating. */
  maxDischargeA: number
  /** Quiescent supply current with the output low. */
  quiescentA: number
  /** Practical oscillation ceiling. */
  maxFrequency: number
}

export const VARIANTS: Record<Timer555Variant, VariantSpec> = {
  // NE555: bipolar totem pole, Vcc 4.5 to 16 V, VOH typ Vcc-1.7 V at 100 mA,
  // VOL typ 0.1 V at 5 mA, ICC typ 3 mA at 5 V, usable to roughly 500 kHz.
  bipolar: {
    label: 'NE555 bipolar',
    minSupply: 4.5,
    maxSupply: 16,
    outputDrop: 1.7,
    outputSat: 0.1,
    maxDischargeA: 0.2,
    quiescentA: 3e-3,
    maxFrequency: 500e3,
  },
  // TLC555: CMOS output, Vcc 2 to 15 V, swings within ~0.3 V of the rail at
  // 10 mA, ICC typ 170 uA at 5 V, specified to 2.1 MHz. The only sane choice
  // on a 3.3 V ESP32 rail.
  cmos: {
    label: 'TLC555 CMOS',
    minSupply: 2,
    maxSupply: 15,
    outputDrop: 0.3,
    outputSat: 0.05,
    maxDischargeA: 0.1,
    quiescentA: 170e-6,
    maxFrequency: 2.1e6,
  },
}

/** Threshold comparator level in volts. */
export function thresholdVoltage(vcc: number): number {
  return THRESHOLD_RATIO * vcc
}

/** Trigger comparator level in volts. */
export function triggerVoltage(vcc: number): number {
  return TRIGGER_RATIO * vcc
}

/** Astable output high time, t_high = ln2 * (R1 + R2) * C. */
export function highTime(r1: number, r2: number, c: number): number {
  return K_ASTABLE * (r1 + r2) * c
}

/** Astable output low time, t_low = ln2 * R2 * C. */
export function lowTime(r2: number, c: number): number {
  return K_ASTABLE * r2 * c
}

/** Astable frequency, f = 1 / (ln2 * (R1 + 2*R2) * C), i.e. 1.44/((R1+2R2)C). */
export function astableFrequency(r1: number, r2: number, c: number): number {
  const period = K_ASTABLE * (r1 + 2 * r2) * c
  return period > 0 ? 1 / period : Infinity
}

/**
 * Duty cycle as a fraction, (R1 + R2) / (R1 + 2*R2). C charges through both
 * resistors and discharges through one, so the classic circuit is always above
 * 50% and only approaches it as R2 grows past R1.
 */
export function dutyCycle(r1: number, r2: number): number {
  const denom = r1 + 2 * r2
  return denom > 0 ? (r1 + r2) / denom : 1
}

/** Monostable output pulse, t = ln3 * R * C, the "1.1 R C" rule of thumb. */
export function pulseWidth(r: number, c: number): number {
  return K_MONOSTABLE * r * c
}

/**
 * Average supply current in astable mode, chip quiescent excluded.
 *
 * While charging, every electron through R1+R2 lands in C, and C moves by
 * Vcc/3 in t_high, so i = C*(Vcc/3)/t_high = Vcc / (3*ln2*(R1+R2)).
 * While discharging, C dumps through R2 into pin 7 (not out of the supply) but
 * R1 still drains Vcc/R1 straight to ground through the saturated transistor.
 */
export function timingCurrent(vcc: number, r1: number, r2: number, c: number): number {
  const tHigh = highTime(r1, r2, c)
  const tLow = lowTime(r2, c)
  const period = tHigh + tLow
  if (period <= 0) return 0
  const iCharge = r1 + r2 > 0 ? vcc / (3 * K_ASTABLE * (r1 + r2)) : Infinity
  const iLow = r1 > 0 ? vcc / r1 : Infinity
  return (tHigh * iCharge + tLow * iLow) / period
}

/**
 * Peak sink into pin 7 the instant the discharge transistor turns on: C is at
 * 2/3 Vcc behind R2, and R1 is still pulling from the rail.
 */
export function dischargePeak(vcc: number, r1: number, r2: number): number {
  return (r2 > 0 ? thresholdVoltage(vcc) / r2 : Infinity) + (r1 > 0 ? vcc / r1 : Infinity)
}

/** Fractional timing error from threshold bias current across the timing R. */
export function biasError(vcc: number, rTotal: number): number {
  return vcc > 0 ? (THRESHOLD_BIAS_A * rTotal) / (vcc / 3) : Infinity
}

/* ------------------------------------------------------------------ */
/* Time domain                                                         */
/* ------------------------------------------------------------------ */

export type Waveforms = {
  dt: number
  span: number
  /** Capacitor voltage. */
  cap: Float64Array
  /** Output pin voltage. */
  out: Float64Array
  /** Trigger pin voltage, monostable only. */
  trigger?: Float64Array
}

/** Exact zero-order-hold relaxation of an RC node toward `target`. */
function relax(v: number, target: number, tau: number, dt: number): number {
  if (!(tau > 0)) return target
  return target + (v - target) * Math.exp(-dt / tau)
}

/**
 * Time for a node relaxing from v toward `target` to cross `vth`, from
 * t = tau * ln((v - target) / (vth - target)). Infinity when the threshold sits
 * on the far side of the target and is never reached; 0 when already past it.
 */
function timeToReach(v: number, target: number, vth: number, tau: number): number {
  const a = v - target
  const b = vth - target
  if (b === 0) return Infinity
  const ratio = a / b
  if (ratio <= 0) return Infinity
  if (ratio <= 1) return 0
  if (!(tau > 0)) return 0
  return tau * Math.log(ratio)
}

/** Safety valve: a period far below dt would otherwise spin this loop forever. */
const MAX_FLIPS_PER_STEP = 64

export type AstableParams = {
  vcc: number
  r1: number
  r2: number
  c: number
  variant: Timer555Variant
}

/**
 * Free running oscillator. Starts on the periodic steady state (C at 1/3 Vcc,
 * charging) so the scope shows the settled waveform. `fromPowerOn` starts C at
 * 0 V instead, which reproduces the real first cycle: it runs ln3 instead of
 * ln2 long because C has to climb the whole way from ground.
 */
export function simulateAstable(
  p: AstableParams,
  n: number,
  span: number,
  fromPowerOn = false,
): Waveforms {
  const spec = VARIANTS[p.variant]
  const dt = span / n
  const cap = new Float64Array(n)
  const out = new Float64Array(n)

  const vHigh = Math.max(0, p.vcc - spec.outputDrop)
  const vLow = Math.min(spec.outputSat, p.vcc)
  const vTh = thresholdVoltage(p.vcc)
  const vTr = triggerVoltage(p.vcc)
  const tauUp = (p.r1 + p.r2) * p.c
  const tauDown = p.r2 * p.c

  let v = fromPowerOn ? 0 : vTr
  let charging = true

  for (let i = 0; i < n; i++) {
    cap[i] = v
    out[i] = charging ? vHigh : vLow

    let remaining = dt
    let flips = 0
    while (remaining > 0 && flips++ < MAX_FLIPS_PER_STEP) {
      const target = charging ? p.vcc : 0
      const tau = charging ? tauUp : tauDown
      const vth = charging ? vTh : vTr
      const cross = timeToReach(v, target, vth, tau)
      if (!(cross < remaining)) {
        // No comparator edge inside this step, so relax the whole way.
        v = relax(v, target, tau, remaining)
        remaining = 0
      } else {
        v = vth
        charging = !charging
        remaining -= cross
      }
    }
  }

  return { dt, span, cap, out }
}

export type MonostableParams = {
  vcc: number
  r: number
  c: number
  variant: Timer555Variant
  /** How long pin 2 is held below 1/3 Vcc. */
  triggerWidth: number
  /** Time from the start of the window to the trigger edge. */
  triggerDelay: number
}

/**
 * One shot. Idle holds C at ground through the discharge transistor, a falling
 * trigger starts the output pulse, and the threshold comparator ends it.
 *
 * The 555 is not retriggerable: a trigger during the pulse does nothing. But a
 * trigger held low past the timeout does hold the output high, because the
 * trigger comparator overrides the threshold on the internal flip flop, so C
 * keeps charging toward Vcc until the trigger is released.
 */
export function simulateMonostable(p: MonostableParams, n: number, span: number): Waveforms {
  const spec = VARIANTS[p.variant]
  const dt = span / n
  const cap = new Float64Array(n)
  const out = new Float64Array(n)
  const trigger = new Float64Array(n)

  const vHigh = Math.max(0, p.vcc - spec.outputDrop)
  const vLow = Math.min(spec.outputSat, p.vcc)
  const vTh = thresholdVoltage(p.vcc)
  const tauUp = p.r * p.c
  const tauReset = R_DISCHARGE_ON * p.c

  let v = 0
  let timing = false

  for (let i = 0; i < n; i++) {
    const t = i * dt
    const low = t >= p.triggerDelay && t < p.triggerDelay + p.triggerWidth
    trigger[i] = low ? 0 : p.vcc
    if (!timing && low) timing = true

    cap[i] = v
    out[i] = timing ? vHigh : vLow

    let remaining = dt
    let flips = 0
    while (remaining > 0 && flips++ < MAX_FLIPS_PER_STEP) {
      if (!timing) {
        v = relax(v, 0, tauReset, remaining)
        remaining = 0
        continue
      }
      const cross = timeToReach(v, p.vcc, vTh, tauUp)
      // Trigger still low wins over the threshold, so C carries on to Vcc.
      if (low || !(cross < remaining)) {
        v = relax(v, p.vcc, tauUp, remaining)
        remaining = 0
      } else {
        v = vTh
        timing = false
        remaining -= cross
      }
    }
  }

  return { dt, span, cap, out, trigger }
}

/* ------------------------------------------------------------------ */
/* Readouts                                                            */
/* ------------------------------------------------------------------ */

export type AstableReadout = {
  spec: VariantSpec
  vThreshold: number
  vTrigger: number
  outputHigh: number
  outputLow: number
  tauCharge: number
  tauDischarge: number
  tHigh: number
  tLow: number
  period: number
  freq: number
  duty: number
  /** Average draw from the rail, chip quiescent included. */
  supplyCurrent: number
  dischargePeak: number
  biasError: number
  /** Supply outside the variant's datasheet range. */
  supplyOutOfRange: boolean
  /** Past the variant's practical frequency ceiling. */
  tooFast: boolean
  /** Pin 7 asked to sink more than it is rated for. */
  dischargeOverload: boolean
  /** Timing R so high that threshold bias current corrupts the result. */
  biasSuspect: boolean
}

export function analyseAstable(p: AstableParams): AstableReadout {
  const spec = VARIANTS[p.variant]
  const tHigh = highTime(p.r1, p.r2, p.c)
  const tLow = lowTime(p.r2, p.c)
  const period = tHigh + tLow
  const peak = dischargePeak(p.vcc, p.r1, p.r2)
  const freq = astableFrequency(p.r1, p.r2, p.c)
  const err = biasError(p.vcc, p.r1 + p.r2)

  return {
    spec,
    vThreshold: thresholdVoltage(p.vcc),
    vTrigger: triggerVoltage(p.vcc),
    outputHigh: Math.max(0, p.vcc - spec.outputDrop),
    outputLow: Math.min(spec.outputSat, p.vcc),
    tauCharge: (p.r1 + p.r2) * p.c,
    tauDischarge: p.r2 * p.c,
    tHigh,
    tLow,
    period,
    freq,
    duty: dutyCycle(p.r1, p.r2),
    supplyCurrent: spec.quiescentA + timingCurrent(p.vcc, p.r1, p.r2, p.c),
    dischargePeak: peak,
    biasError: err,
    supplyOutOfRange: p.vcc < spec.minSupply || p.vcc > spec.maxSupply,
    tooFast: freq > spec.maxFrequency,
    dischargeOverload: peak > spec.maxDischargeA,
    biasSuspect: err > BIAS_ERROR_LIMIT,
  }
}

export type MonostableReadout = {
  spec: VariantSpec
  vThreshold: number
  vTrigger: number
  outputHigh: number
  outputLow: number
  tau: number
  pulse: number
  /** 3 time constants through the discharge transistor, i.e. 95% reset. */
  resetTime: number
  /** Fastest repeat rate that still gets a full pulse plus reset. */
  maxRate: number
  /** Idle draw: the discharge transistor holds C down and sinks Vcc/R forever. */
  idleCurrent: number
  biasError: number
  supplyOutOfRange: boolean
  dischargeOverload: boolean
  biasSuspect: boolean
  /** Trigger longer than the pulse, so the output length follows the trigger. */
  triggerTooWide: boolean
}

export function analyseMonostable(p: MonostableParams): MonostableReadout {
  const spec = VARIANTS[p.variant]
  const pulse = pulseWidth(p.r, p.c)
  const resetTime = 3 * R_DISCHARGE_ON * p.c
  const idle = p.r > 0 ? p.vcc / p.r : Infinity
  const err = biasError(p.vcc, p.r)

  return {
    spec,
    vThreshold: thresholdVoltage(p.vcc),
    vTrigger: triggerVoltage(p.vcc),
    outputHigh: Math.max(0, p.vcc - spec.outputDrop),
    outputLow: Math.min(spec.outputSat, p.vcc),
    tau: p.r * p.c,
    pulse,
    resetTime,
    maxRate: pulse + resetTime > 0 ? 1 / (pulse + resetTime) : Infinity,
    idleCurrent: idle,
    biasError: err,
    supplyOutOfRange: p.vcc < spec.minSupply || p.vcc > spec.maxSupply,
    dischargeOverload: idle > spec.maxDischargeA,
    biasSuspect: err > BIAS_ERROR_LIMIT,
    triggerTooWide: p.triggerWidth >= pulse,
  }
}
