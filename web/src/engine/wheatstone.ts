import { sym } from '../i18n'
/**
 * Wheatstone bridge: two voltage dividers across one excitation supply, read
 * differentially.
 *
 *      Vin ---+---------+
 *             |         |
 *            R1        R3
 *             |         |
 *             A         B      Vout = V(A) - V(B)
 *             |         |
 *            R2        R4
 *             |         |
 *      GND ---+---------+
 *
 * Everything here is closed form, so there is no solver to destabilise. The
 * only numerical care needed is guarding the divisions when an arm pair sums
 * to zero, which the UI cannot reach but a caller could.
 */

import type { Key } from '../i18n'

import { ADC_BITS, ADC_FULL_SCALE } from './constants'

/** Which arm carries the sensor, i.e. the one the sweep varies. */
export type Arm = 'R1' | 'R2' | 'R3' | 'R4'

export const ARMS: ReadonlyArray<{ value: Arm; label: Key }> = [
  { value: 'R1', label: sym('R1') },
  { value: 'R2', label: sym('R2') },
  { value: 'R3', label: sym('R3') },
  { value: 'R4', label: sym('R4') },
]

export type Bridge = {
  /** Excitation voltage across the whole bridge, in volts. */
  vin: number
  r1: number
  r2: number
  r3: number
  r4: number
}

/**
 * Standard 1/4 W axial or 1206 chip rating. Past this an arm self-heats, and a
 * resistor that heats is a resistor that has drifted, which shows up directly
 * as bridge offset.
 */
export const RESISTOR_POWER_W = 0.25

/**
 * Espressif recommends the ESP32 ADC sees under 10 kOhm of source impedance:
 * above that the sample-and-hold capacitor does not settle inside the sampling
 * window and the reading droops.
 */
export const ADC_MAX_SOURCE_OHMS = 10_000

/** One ADC count at the project default (3.3 V full scale, 12 bit). */
export const ADC_LSB = ADC_FULL_SCALE / Math.pow(2, ADC_BITS)

/** Below a nanovolt the bridge is nulled as far as any real instrument cares. */
const BALANCE_EPS = 1e-9

/** Fraction of the supply at the tap of a top/bottom divider: rb / (rt + rb). */
function divide(rTop: number, rBottom: number): number {
  const sum = rTop + rBottom
  return sum > 0 ? rBottom / sum : 0
}

/** Node voltages at the two taps, referred to the bridge ground. */
export function nodeVoltages(b: Bridge): { va: number; vb: number } {
  return { va: b.vin * divide(b.r1, b.r2), vb: b.vin * divide(b.r3, b.r4) }
}

/** Vout = Vin·(R2/(R1+R2) - R4/(R3+R4)), open circuit. */
export function outputVoltage(b: Bridge): number {
  const { va, vb } = nodeVoltages(b)
  return va - vb
}

/**
 * Thevenin resistance looking into the output terminals with the supply
 * shorted, so each pair is in parallel and the two pairs are in series:
 * Rth = R1||R2 + R3||R4.
 */
export function theveninImpedance(b: Bridge): number {
  const left = b.r1 + b.r2 > 0 ? (b.r1 * b.r2) / (b.r1 + b.r2) : 0
  const right = b.r3 + b.r4 > 0 ? (b.r3 * b.r4) / (b.r3 + b.r4) : 0
  return left + right
}

/**
 * dVout/dR for one arm, in volts per ohm. Differentiating the divider pair:
 *   dVout/dR1 = -Vin·R2/(R1+R2)²      dVout/dR2 = +Vin·R1/(R1+R2)²
 *   dVout/dR3 = +Vin·R4/(R3+R4)²      dVout/dR4 = -Vin·R3/(R3+R4)²
 * This is the tangent at the present operating point, not the chord: a bridge
 * with one varying arm is nonlinear, and the error grows with deviation.
 */
export function sensitivity(b: Bridge, arm: Arm): number {
  const left = b.r1 + b.r2
  const right = b.r3 + b.r4
  switch (arm) {
    case 'R1':
      return left > 0 ? (-b.vin * b.r2) / (left * left) : 0
    case 'R2':
      return left > 0 ? (b.vin * b.r1) / (left * left) : 0
    case 'R3':
      return right > 0 ? (b.vin * b.r4) / (right * right) : 0
    case 'R4':
      return right > 0 ? (-b.vin * b.r3) / (right * right) : 0
  }
}

/** Present value of one arm. */
export function armValue(b: Bridge, arm: Arm): number {
  return arm === 'R1' ? b.r1 : arm === 'R2' ? b.r2 : arm === 'R3' ? b.r3 : b.r4
}

/** Copy of the bridge with one arm replaced. */
export function withArm(b: Bridge, arm: Arm, value: number): Bridge {
  return {
    ...b,
    r1: arm === 'R1' ? value : b.r1,
    r2: arm === 'R2' ? value : b.r2,
    r3: arm === 'R3' ? value : b.r3,
    r4: arm === 'R4' ? value : b.r4,
  }
}

/**
 * Value of the chosen arm that nulls the bridge. Balance is R1/R2 = R3/R4,
 * i.e. R1·R4 = R2·R3, solved for the arm in question.
 */
export function balanceResistance(b: Bridge, arm: Arm): number {
  switch (arm) {
    case 'R1':
      return b.r4 > 0 ? (b.r2 * b.r3) / b.r4 : Infinity
    case 'R2':
      return b.r3 > 0 ? (b.r1 * b.r4) / b.r3 : Infinity
    case 'R3':
      return b.r2 > 0 ? (b.r1 * b.r4) / b.r2 : Infinity
    case 'R4':
      return b.r1 > 0 ? (b.r2 * b.r3) / b.r1 : Infinity
  }
}

/** Supply current: the two arms sit in parallel across Vin, output unloaded. */
export function excitationCurrent(b: Bridge): number {
  const left = b.r1 + b.r2
  const right = b.r3 + b.r4
  return (left > 0 ? b.vin / left : 0) + (right > 0 ? b.vin / right : 0)
}

/** Dissipation in each arm, P = I²R with the branch current of that pair. */
export function armPower(b: Bridge): [number, number, number, number] {
  const left = b.r1 + b.r2
  const right = b.r3 + b.r4
  const il = left > 0 ? b.vin / left : 0
  const ir = right > 0 ? b.vin / right : 0
  return [il * il * b.r1, il * il * b.r2, ir * ir * b.r3, ir * ir * b.r4]
}

export type ArmSweep = {
  /** Ohms per sample, i.e. the horizontal step of the plotted curve. */
  step: number
  from: number
  to: number
  /** True bridge output at each swept resistance. */
  vout: Float64Array
  /** Tangent line through the operating point, for comparison. */
  tangent: Float64Array
}

/**
 * Vout against the sensor arm resistance, swept linearly from `from` to `to`.
 * The tangent trace is the small-signal approximation Vout(R0) + S·(R - R0),
 * so the gap between the two curves is the bridge nonlinearity.
 */
export function sweepArm(b: Bridge, arm: Arm, from: number, to: number, n: number): ArmSweep {
  const count = Math.max(2, Math.floor(n))
  const step = (to - from) / (count - 1)
  const vout = new Float64Array(count)
  const tangent = new Float64Array(count)
  const r0 = armValue(b, arm)
  const v0 = outputVoltage(b)
  const s = sensitivity(b, arm)
  for (let i = 0; i < count; i++) {
    const r = from + i * step
    vout[i] = outputVoltage(withArm(b, arm, r))
    tangent[i] = v0 + s * (r - r0)
  }
  return { step, from, to, vout, tangent }
}

export type BridgeReadout = {
  vout: number
  va: number
  vb: number
  balanced: boolean
  /** Arm value that would null the bridge. */
  balanceR: number
  ratioLeft: number
  ratioRight: number
  /** dVout/dR of the sensor arm, volts per ohm. */
  sens: number
  /** Vout per unit fractional change dR/R of the sensor arm. Vin/4 when balanced and equal-armed. */
  sensFractional: number
  rth: number
  current: number
  power: number
  maxArmPower: number
  /** Output expressed in ADC counts at 3.3 V full scale, 12 bit. */
  counts: number
  /** Output smaller than one ADC count: needs an instrumentation amp. */
  belowLsb: boolean
  /** Source impedance too high for the ESP32 sample-and-hold. */
  overRth: boolean
  overPower: boolean
  /** A tap sits outside the ADC input range. */
  nodeOverRange: boolean
}

/** Everything the page reports, derived once per parameter change. */
export function analyse(b: Bridge, arm: Arm): BridgeReadout {
  const { va, vb } = nodeVoltages(b)
  const vout = va - vb
  const sens = sensitivity(b, arm)
  const powers = armPower(b)
  const maxArmPower = Math.max(...powers)
  const rth = theveninImpedance(b)
  return {
    vout,
    va,
    vb,
    balanced: Math.abs(vout) < BALANCE_EPS,
    balanceR: balanceResistance(b, arm),
    ratioLeft: b.r2 > 0 ? b.r1 / b.r2 : Infinity,
    ratioRight: b.r4 > 0 ? b.r3 / b.r4 : Infinity,
    sens,
    sensFractional: sens * armValue(b, arm),
    rth,
    current: excitationCurrent(b),
    power: powers[0] + powers[1] + powers[2] + powers[3],
    maxArmPower,
    counts: Math.abs(vout) / ADC_LSB,
    belowLsb: Math.abs(vout) < ADC_LSB,
    overRth: rth > ADC_MAX_SOURCE_OHMS,
    overPower: maxArmPower > RESISTOR_POWER_W,
    nodeOverRange:
      Math.max(va, vb) > ADC_FULL_SCALE || Math.min(va, vb) < 0,
  }
}
