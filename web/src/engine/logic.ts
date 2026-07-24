/**
 * Logic-net timing shared by the I2C pull-up, level shifter and debounce pages.
 *
 * All three are the same physical problem: a resistance charging a capacitance
 * on a digital net, and the question of when it crosses a threshold. Keeping the
 * primitives here means one implementation of the RC edge maths rather than
 * three that drift apart.
 *
 * Everything is base SI: volts, amps, ohms, farads, seconds.
 */

import { VCC } from './constants'

/**
 * Time for an RC node starting at `from` to reach `to`, both as fractions of
 * the supply, charging toward it. t = -R*C*ln((1 - to)/(1 - from)).
 * Infinity when the target is at or above the rail, which it can never reach.
 */
export function riseTime(r: number, c: number, from = 0.1, to = 0.9): number {
  if (!(r > 0) || !(c > 0)) return 0
  if (to >= 1) return Infinity
  if (to <= from) return 0
  return -r * c * Math.log((1 - to) / (1 - from))
}

/**
 * The 10% to 90% figure the I2C specification uses, 2.2*R*C. This is the same
 * 0.8473 constant seen in the standard once the 30%/70% variant is folded in.
 */
export const RISE_10_90 = Math.log(9) // 2.1972

/** Time to charge from 0 to an absolute voltage, t = -R*C*ln(1 - v/vcc). */
export function timeToVoltage(r: number, c: number, v: number, vcc = VCC): number {
  if (!(r > 0) || !(c > 0) || !(vcc > 0)) return 0
  const frac = v / vcc
  if (frac >= 1) return Infinity
  if (frac <= 0) return 0
  return -r * c * Math.log(1 - frac)
}

/** Voltage on an RC node at time t, charging from `start` toward `vcc`. */
export function voltageAt(t: number, r: number, c: number, vcc = VCC, start = 0): number {
  const tau = r * c
  if (!(tau > 0)) return vcc
  return vcc + (start - vcc) * Math.exp(-t / tau)
}

// ---------------------------------------------------------------------------
// I2C pull-up sizing
// ---------------------------------------------------------------------------

export type I2cSpeed = 'standard' | 'fast' | 'fastplus'

export type I2cSpeedSpec = {
  label: string
  /** Bus clock, Hz. */
  frequency: number
  /** Maximum rise time the specification allows, seconds. */
  maxRise: number
  /** Maximum bus capacitance the specification allows, farads. */
  maxCapacitance: number
}

/** NXP UM10204 I2C specification, table 10. */
export const I2C_SPEEDS: Record<I2cSpeed, I2cSpeedSpec> = {
  standard: { label: 'Standard 100 kHz', frequency: 100e3, maxRise: 1000e-9, maxCapacitance: 400e-12 },
  fast: { label: 'Fast 400 kHz', frequency: 400e3, maxRise: 300e-9, maxCapacitance: 400e-12 },
  fastplus: { label: 'Fast plus 1 MHz', frequency: 1e6, maxRise: 120e-9, maxCapacitance: 550e-12 },
}

export const I2C_SPEED_OPTIONS = (Object.keys(I2C_SPEEDS) as I2cSpeed[]).map((value) => ({
  value,
  label: I2C_SPEEDS[value].label,
}))

/** Maximum the specification guarantees a device can sink while holding VOL. */
export const I2C_SINK_MA = 3
/** Highest output-low voltage a device may present while sinking that current. */
export const I2C_VOL = 0.4

/**
 * Smallest pull-up a device can still pull low: Rmin = (Vcc - VOL) / Isink.
 * Below this the bus never reaches a valid low level.
 */
export function pullupMin(vcc: number, sinkA = I2C_SINK_MA / 1000): number {
  return sinkA > 0 ? (vcc - I2C_VOL) / sinkA : Infinity
}

/**
 * Largest pull-up that still meets the rise-time limit, Rmax = tr / (0.8473*Cb).
 * The 0.8473 is ln((1-0.3)/(1-0.7)) from the specification's 30% to 70% points.
 */
export const I2C_RISE_CONSTANT = Math.log(0.7 / 0.3) // 0.8473

export function pullupMax(maxRise: number, busC: number): number {
  return busC > 0 ? maxRise / (I2C_RISE_CONSTANT * busC) : Infinity
}

/** Rise time a given pull-up actually produces on the 30% to 70% points. */
export function i2cRiseTime(r: number, busC: number): number {
  return I2C_RISE_CONSTANT * r * busC
}

export type I2cReadout = {
  spec: I2cSpeedSpec
  rMin: number
  rMax: number
  /** Geometric mean of the window, which is the value to actually fit. */
  rRecommended: number
  /** Rise time of the chosen pull-up, seconds. */
  rise: number
  /** Rise time as a fraction of one bit period. */
  riseFraction: number
  /** Current the device sinks while holding the line low, amps. */
  sinkCurrent: number
  /** Static power burned per line while held low, watts. */
  lowPower: number
  /** No resistance satisfies both limits at this capacitance and speed. */
  windowEmpty: boolean
  /** The chosen pull-up is outside the window. */
  outOfWindow: boolean
  /** Bus capacitance is past what the specification allows. */
  overCapacitance: boolean
  /** Chosen pull-up is too slow for the selected speed. */
  tooSlow: boolean
}

export function analyseI2c(
  speed: I2cSpeed,
  busC: number,
  rPullup: number,
  vcc = VCC,
): I2cReadout {
  const spec = I2C_SPEEDS[speed]
  const rMin = pullupMin(vcc)
  const rMax = pullupMax(spec.maxRise, busC)
  const rise = i2cRiseTime(rPullup, busC)
  const windowEmpty = !(rMax > rMin)
  return {
    spec,
    rMin,
    rMax,
    // Geometric, not arithmetic: the window spans decades, so the midpoint in
    // log space is the balanced choice between drive current and edge speed.
    rRecommended: windowEmpty ? NaN : Math.sqrt(rMin * rMax),
    rise,
    riseFraction: rise * spec.frequency,
    sinkCurrent: (vcc - I2C_VOL) / rPullup,
    lowPower: ((vcc - I2C_VOL) * I2C_VOL) / rPullup,
    windowEmpty,
    outOfWindow: rPullup < rMin || rPullup > rMax,
    overCapacitance: busC > spec.maxCapacitance,
    tooSlow: rise > spec.maxRise,
  }
}

// ---------------------------------------------------------------------------
// Contact debounce
// ---------------------------------------------------------------------------

/** ESP32 input thresholds, as fractions of the supply. */
export const VIH_FRAC = 0.75
export const VIL_FRAC = 0.25

export type DebounceReadout = {
  tau: number
  /** Time to cross the logic-high threshold from a fully discharged start. */
  tRise: number
  /** Time to fall back below the logic-low threshold from the rail. */
  tFall: number
  /** Widest glitch the filter fully suppresses, seconds. */
  rejected: number
  /** Presses per second the filter can still follow. */
  maxRate: number
  /** Current the switch shorts to ground on close, amps. */
  contactCurrent: number
  /** Filter is slower than the bounce it must reject. */
  tooFast: boolean
  /** Filter is so slow it eats real presses. */
  tooSlow: boolean
}

/**
 * RC debounce with a Schmitt-trigger input. The filter must be slow enough to
 * ride over the bounce burst but fast enough to follow a real press.
 */
export function analyseDebounce(
  r: number,
  c: number,
  bounceTime: number,
  pressRate: number,
  vcc = VCC,
): DebounceReadout {
  const tau = r * c
  const tRise = timeToVoltage(r, c, VIH_FRAC * vcc, vcc)
  // Falling from the rail toward ground, crossing VIL: t = -tau*ln(VIL/Vcc).
  const tFall = tau > 0 ? -tau * Math.log(VIL_FRAC) : 0
  return {
    tau,
    tRise,
    tFall,
    // A glitch shorter than the rise time never lifts the node past VIH.
    rejected: tRise,
    maxRate: tRise + tFall > 0 ? 1 / (tRise + tFall) : Infinity,
    contactCurrent: r > 0 ? vcc / r : Infinity,
    tooFast: tRise < bounceTime,
    tooSlow: pressRate > 0 && 1 / pressRate < 2 * (tRise + tFall),
  }
}
