import type { Key } from '../i18n'
/**
 * LED series resistor sizing.
 *
 * The LED is modelled as a constant forward drop Vf, which is the standard
 * piecewise-linear approximation: above the knee a diode's I-V curve is steep
 * enough that Vf moves only tens of millivolts across the useful current range,
 * so the series resistor sets the current, not the diode. Everything here is
 * algebraic, there is no time-domain state to integrate.
 *
 * All values are base SI: volts, amps, ohms, watts.
 */

import { GPIO_MAX_MA } from './constants'
import { bracketWide, decade as seriesDecade, nearestByRatio } from './eseries'

/**
 * E24 preferred numbers (IEC 60063), 24 mantissas per decade at 5% tolerance.
 * Sourced from the eseries module so there is one table in the codebase.
 */
export const E24: readonly number[] = seriesDecade('E24').map((m) => m * 10)

/**
 * Below this drop across the resistor the current is set more by the LED's own
 * Vf spread than by the resistor. Common design rule of thumb: keep at least a
 * few hundred millivolts, i.e. roughly 20% of the supply, across the resistor.
 */
export const HEADROOM_MIN_V = 0.5

/** Vf spread used for the sensitivity readout. Typical bin-to-bin part spread. */
export const VF_SPREAD_V = 0.1

/**
 * Typical forward voltages at 20 mA for 5 mm through-hole parts. Real parts
 * vary by bin, so these are starting points, not datasheet guarantees.
 */
export const LED_TYPES: ReadonlyArray<{ id: string; label: Key; vf: number }> = [
  { id: 'ir', label: 'opt.infrared940Nm', vf: 1.2 },
  { id: 'red', label: 'opt.red', vf: 2.0 },
  { id: 'amber', label: 'opt.amberYellow', vf: 2.1 },
  { id: 'green-gap', label: 'opt.greenGapOlder', vf: 2.2 },
  { id: 'green', label: 'opt.greenIngan', vf: 3.0 },
  { id: 'blue', label: 'opt.blue', vf: 3.2 },
  { id: 'white', label: 'common.white', vf: 3.2 },
  { id: 'uv', label: 'opt.uv395Nm', vf: 3.4 },
]

/** Nearest E24 value, measured on relative error since tolerance is a ratio. */
export function nearestE24(value: number): number {
  return nearestByRatio('E24', value)
}

/** Smallest E24 value greater than or equal to `value`. Rounding up is the safe
 *  direction for an LED: more resistance means less current. */
export function e24AtLeast(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return NaN
  const { below, above } = bracketWide('E24', value)
  // An exact hit must stay put rather than being pushed to the next value up.
  return below >= value * (1 - 1e-9) ? below : above
}

/**
 * Series resistor for a target current.
 * KVL around the loop: Vs = Vf + I*R, so R = (Vs - Vf) / If.
 * Returns Infinity when the supply cannot forward-bias the LED.
 */
export function seriesResistor(supply: number, vf: number, current: number): number {
  const headroom = supply - vf
  if (headroom <= 0 || current <= 0) return Infinity
  return headroom / current
}

/** Ohm's law on the resistor: I = (Vs - Vf) / R. Zero when the LED cannot conduct. */
export function currentThrough(supply: number, vf: number, r: number): number {
  const headroom = supply - vf
  if (headroom <= 0 || !(r > 0)) return 0
  return headroom / r
}

export type LedInput = {
  /** Supply rail in volts. Defaults to VCC at the page level. */
  supply: number
  /** LED forward voltage in volts. */
  vf: number
  /** Target forward current in amps. */
  target: number
  /** Datasheet absolute maximum forward current in amps. */
  maxCurrent: number
  /** Resistor package power rating in watts. */
  rating: number
  /** True when the LED hangs straight off an ESP32 GPIO rather than a driver. */
  fromGpio: boolean
}

export type LedReadout = {
  /** Volts across the resistor, Vs - Vf. */
  headroom: number
  /** Exact resistor for the target current. */
  idealR: number
  /** Nearest E24 value, and the next E24 step up (the safe rounding). */
  r: number
  rUp: number
  /** Current that actually flows with the E24 resistor. */
  current: number
  /** Signed fractional error against the target, e.g. -0.044 for 4.4% low. */
  currentError: number
  /** Dissipation, I^2*R in the resistor and Vf*I in the die. */
  rPower: number
  ledPower: number
  totalPower: number
  /** Fraction of supply power that reaches the LED, equal to Vf/Vs. */
  efficiency: number
  /** Current change for a VF_SPREAD_V shift in Vf, in amps. */
  vfSensitivity: number
  noConduction: boolean
  lowHeadroom: boolean
  overGpio: boolean
  overLedMax: boolean
  overRating: boolean
}

/** Everything the LED page reports, derived once per parameter change. */
export function analyse(input: LedInput): LedReadout {
  const { supply, vf, target, maxCurrent, rating, fromGpio } = input
  const headroom = supply - vf
  const noConduction = headroom <= 0

  const idealR = seriesResistor(supply, vf, target)
  const r = Number.isFinite(idealR) ? nearestE24(idealR) : Infinity
  const rUp = Number.isFinite(idealR) ? e24AtLeast(idealR) : Infinity

  const current = noConduction ? 0 : currentThrough(supply, vf, r)
  // P = I^2*R in the resistor, Vf*I in the die, Vs*I out of the supply.
  const rPower = current * current * (Number.isFinite(r) ? r : 0)
  const ledPower = vf * current
  const totalPower = supply * current

  return {
    headroom,
    idealR,
    r,
    rUp,
    current,
    currentError: target > 0 ? (current - target) / target : 0,
    rPower,
    ledPower,
    totalPower,
    efficiency: supply > 0 ? vf / supply : 0,
    // dI/dVf = -1/R, so a Vf shift moves the current by VF_SPREAD_V / R.
    vfSensitivity: Number.isFinite(r) && r > 0 ? VF_SPREAD_V / r : 0,
    noConduction,
    lowHeadroom: !noConduction && headroom < HEADROOM_MIN_V,
    overGpio: fromGpio && current > GPIO_MAX_MA / 1000,
    overLedMax: current > maxCurrent,
    overRating: rPower > rating,
  }
}
