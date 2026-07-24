import type { Key } from '../i18n'
/**
 * ESP32 LEDC peripheral timing, shared by the PWM resolution and servo pages.
 *
 * The LEDC timer divides an 80 MHz APB clock by a fractional divider into
 * 2^bits steps per period, so frequency and resolution trade directly against
 * each other. Both pages are the same arithmetic asked from opposite ends.
 *
 * Base SI throughout: hertz, seconds, volts.
 */

import { VCC } from './constants'

/** APB clock feeding the LEDC timer, Hz. */
export const APB_CLOCK = 80e6

/** Hardware limits on the duty resolution register. */
export const BITS_MIN = 1
export const BITS_MAX = 20

/** Highest frequency achievable at a given resolution: f = 80 MHz / 2^bits. */
export function maxFrequency(bits: number): number {
  return APB_CLOCK / Math.pow(2, bits)
}

/**
 * Highest resolution that still reaches `frequency`, i.e. floor(log2(80e6/f)),
 * clamped to what the register can hold. Returns 0 when the frequency is out of
 * reach at any resolution.
 */
export function maxBits(frequency: number): number {
  if (!(frequency > 0)) return BITS_MAX
  const ideal = Math.floor(Math.log2(APB_CLOCK / frequency))
  if (ideal < BITS_MIN) return 0
  return Math.min(BITS_MAX, ideal)
}

/** Number of duty steps at a resolution, 2^bits. */
export function steps(bits: number): number {
  return Math.pow(2, bits)
}

/** Duty register value for a fractional duty, rounded to a whole step. */
export function dutyCount(duty: number, bits: number): number {
  const n = steps(bits)
  return Math.round(Math.min(Math.max(duty, 0), 1) * n)
}

/** Duty actually produced by a register value. */
export function dutyFromCount(count: number, bits: number): number {
  const n = steps(bits)
  return n > 0 ? count / n : 0
}

export type LedcReadout = {
  /** Resolution actually usable at the requested frequency, bits. */
  bits: number
  /** Duty steps available, 2^bits. */
  stepCount: number
  /** Highest frequency this resolution supports, Hz. */
  fMax: number
  /** Smallest duty change, as a fraction. */
  stepFraction: number
  /** Smallest duty change expressed as an analogue voltage on a filtered pin. */
  stepVolts: number
  /** Duty register value for the requested duty. */
  count: number
  /** Duty the register actually gives, as a fraction. */
  actualDuty: number
  /** Quantisation error of the requested duty, as a fraction of full scale. */
  dutyError: number
  /** Period and on-time, seconds. */
  period: number
  onTime: number
  /** Requested frequency cannot be produced at any resolution. */
  unreachable: boolean
  /** The requested resolution had to be reduced to reach the frequency. */
  clamped: boolean
}

export function analyseLedc(
  frequency: number,
  requestedBits: number,
  duty: number,
  vcc = VCC,
): LedcReadout {
  const usable = Math.min(requestedBits, maxBits(frequency))
  const bits = Math.max(0, usable)
  const stepCount = bits > 0 ? steps(bits) : 0
  const count = bits > 0 ? dutyCount(duty, bits) : 0
  const actualDuty = bits > 0 ? dutyFromCount(count, bits) : 0
  const period = frequency > 0 ? 1 / frequency : Infinity
  return {
    bits,
    stepCount,
    fMax: bits > 0 ? maxFrequency(bits) : 0,
    stepFraction: stepCount > 0 ? 1 / stepCount : 0,
    stepVolts: stepCount > 0 ? vcc / stepCount : 0,
    count,
    actualDuty,
    dutyError: actualDuty - duty,
    period,
    onTime: period * actualDuty,
    unreachable: maxBits(frequency) === 0,
    clamped: usable < requestedBits,
  }
}

// ---------------------------------------------------------------------------
// Hobby servo signalling
// ---------------------------------------------------------------------------

/** Standard analogue servo frame: 50 Hz, i.e. a 20 ms period. */
export const SERVO_FRAME_HZ = 50

export type ServoSpec = {
  label: Key
  /** Pulse width at the minimum angle, seconds. */
  minPulse: number
  /** Pulse width at the maximum angle, seconds. */
  maxPulse: number
  /** Mechanical travel between those pulses, degrees. */
  travel: number
}

export const SERVO_TYPES: Record<string, ServoSpec> = {
  standard: { label: 'opt.standard10To', minPulse: 1000e-6, maxPulse: 2000e-6, travel: 180 },
  extended: { label: 'opt.extended05To', minPulse: 500e-6, maxPulse: 2500e-6, travel: 180 },
  narrow: { label: 'opt.narrow10To', minPulse: 1000e-6, maxPulse: 2000e-6, travel: 90 },
}

export const SERVO_OPTIONS = Object.entries(SERVO_TYPES).map(([value, s]) => ({
  value,
  label: s.label,
}))

/** Pulse width for an angle, linearly interpolated across the travel. */
export function pulseForAngle(spec: ServoSpec, angle: number): number {
  const frac = spec.travel > 0 ? Math.min(Math.max(angle / spec.travel, 0), 1) : 0
  return spec.minPulse + frac * (spec.maxPulse - spec.minPulse)
}

export type ServoReadout = {
  pulse: number
  /** Duty as a fraction of the 20 ms frame. */
  duty: number
  /** LEDC register value at the chosen resolution. */
  count: number
  /** Pulse the quantised register actually produces, seconds. */
  actualPulse: number
  /** Angle that pulse corresponds to, degrees. */
  actualAngle: number
  /** Angular resolution: degrees per duty step. */
  degreesPerStep: number
  /** Register counts spanning the whole travel. */
  countsOverTravel: number
  /** Highest resolution usable at the frame rate. */
  maxBits: number
  /** Resolution is so coarse the servo steps visibly. */
  coarse: boolean
}

export function analyseServo(
  spec: ServoSpec,
  angle: number,
  bits: number,
  frameHz = SERVO_FRAME_HZ,
): ServoReadout {
  const period = 1 / frameHz
  const pulse = pulseForAngle(spec, angle)
  const duty = pulse / period
  const count = dutyCount(duty, bits)
  const actualPulse = dutyFromCount(count, bits) * period
  const span = spec.maxPulse - spec.minPulse
  const stepSeconds = period / steps(bits)
  const degreesPerStep = span > 0 ? (stepSeconds / span) * spec.travel : Infinity
  return {
    pulse,
    duty,
    count,
    actualPulse,
    actualAngle:
      span > 0 ? ((actualPulse - spec.minPulse) / span) * spec.travel : 0,
    degreesPerStep,
    countsOverTravel: stepSeconds > 0 ? span / stepSeconds : 0,
    maxBits: maxBits(frameHz),
    // Cheap servos resolve about 0.5 degrees at best, so a step coarser than
    // that is the controller limiting the machine rather than the other way up.
    coarse: degreesPerStep > 0.5,
  }
}
