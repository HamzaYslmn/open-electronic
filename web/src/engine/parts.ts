import type { Key } from '../i18n'
/**
 * Small discrete-part calculators: level shifters, crystal load capacitors,
 * TP4056 charging and resistor markings. Each is short enough that a module of
 * its own would be noise, and they share the preferred-value and RC helpers
 * already in the codebase.
 *
 * Base SI: volts, amps, ohms, farads, hertz, seconds.
 */

import { VCC, VCC_5V } from './constants'
import { nearestByRatio } from './eseries'
import { riseTime } from './logic'

// ---------------------------------------------------------------------------
// Level shifting
// ---------------------------------------------------------------------------

export type ShifterKind = 'bss138' | 'divider'

/** BSS138 threshold voltage, the common logic-level part used in these boards. */
export const BSS138_VGS_TH = 1.3

export type ShifterReadout = {
  /** Gate-source voltage available to turn the FET on, V. */
  vgs: number
  /** Margin over the threshold, V. */
  vgsMargin: number
  /** Rise time on each side, s. */
  riseLow: number
  riseHigh: number
  /** Slowest edge, which sets the speed limit. */
  worstRise: number
  /** Usable bit rate, taking three rise times per bit as the practical limit. */
  maxBitRate: number
  /** Divider output for the high-to-low direction, V. */
  dividerOut: number
  /** Divider output is below the receiving side's logic-high threshold. */
  dividerTooLow: boolean
  /** FET has too little gate drive to switch reliably. */
  insufficientDrive: boolean
  /** Chosen bit rate is beyond what the edges support. */
  tooSlow: boolean
}

/**
 * A BSS138 shifter is two pull-ups and a FET whose gate sits at the low-side
 * rail. Pulling the low side down forward-biases the body diode and then turns
 * the FET on, which is what makes it bidirectional. Its speed is set entirely
 * by the pull-ups charging the bus capacitance.
 */
export function analyseShifter(
  kind: ShifterKind,
  vLow: number,
  vHigh: number,
  rPullup: number,
  capacitance: number,
  bitRate: number,
  r1 = 10_000,
  r2 = 20_000,
): ShifterReadout {
  const vgs = vLow
  const riseLow = riseTime(rPullup, capacitance)
  const riseHigh = riseTime(rPullup, capacitance)
  const worstRise = Math.max(riseLow, riseHigh)
  // A divider shifts high to low only, and is only as fast as its own RC.
  const dividerOut = r1 + r2 > 0 ? (vHigh * r2) / (r1 + r2) : 0
  const dividerRise = riseTime((r1 * r2) / (r1 + r2), capacitance)
  const effectiveRise = kind === 'divider' ? dividerRise : worstRise
  const maxBitRate = effectiveRise > 0 ? 1 / (3 * effectiveRise) : Infinity
  return {
    vgs,
    vgsMargin: vgs - BSS138_VGS_TH,
    riseLow,
    riseHigh,
    worstRise: effectiveRise,
    maxBitRate,
    dividerOut,
    // The receiving side needs about 0.7 of its rail to read a solid high.
    dividerTooLow: dividerOut < 0.7 * vLow,
    insufficientDrive: kind === 'bss138' && vgs - BSS138_VGS_TH < 0.5,
    tooSlow: bitRate > maxBitRate,
  }
}

// ---------------------------------------------------------------------------
// Crystal load capacitors
// ---------------------------------------------------------------------------

export type CrystalReadout = {
  /** Each load capacitor, farads. */
  cLoad: number
  /** Nearest standard value, farads. */
  cStandard: number
  /** Load actually presented with the standard parts, farads. */
  actualCL: number
  /** Frequency error the mismatch causes, in parts per million. */
  errorPpm: number
  /** Absolute frequency error, Hz. */
  errorHz: number
  /** Stray capacitance is already past the specified load. */
  strayTooHigh: boolean
  /** Error is outside a typical timekeeping requirement. */
  outOfSpec: boolean
}

/**
 * A crystal is cut to hit its marked frequency with a specific capacitance
 * across it. That load is the two capacitors in series plus stray, so
 * CL = C1*C2/(C1+C2) + Cstray, and with C1 = C2 that is C1/2 + Cstray.
 *
 * Getting it wrong pulls the frequency. The sensitivity comes from the motional
 * and shunt capacitances: df/f = Cm / (2*(C0 + CL)), evaluated as the difference
 * between the actual and specified load.
 */
export function analyseCrystal(
  frequency: number,
  clSpec: number,
  cStray: number,
  cMotional: number,
  cShunt: number,
): CrystalReadout {
  const cLoad = 2 * (clSpec - cStray)
  // Explicit femtofarad-to-millifarad range: the default snapping window starts
  // at 1 milli (it is sized for resistors) and would clamp picofarads to it.
  const cStandard = cLoad > 0 ? nearestByRatio('E24', cLoad, 1e-15, 1e-3) : NaN
  // With stray alone already over the specified load there is no capacitor to
  // fit, so the best case is fitting none at all. Reporting that honestly beats
  // propagating the NaN into every figure on the page.
  const actualCL = cLoad > 0 ? cStandard / 2 + cStray : cStray
  // Pull between two loads, from the standard pulling formula.
  const pull =
    (cMotional / 2) * (1 / (cShunt + actualCL) - 1 / (cShunt + clSpec))
  return {
    cLoad,
    cStandard,
    actualCL,
    errorPpm: pull * 1e6,
    errorHz: pull * frequency,
    strayTooHigh: cLoad <= 0,
    outOfSpec: Math.abs(pull * 1e6) > 20,
  }
}

// ---------------------------------------------------------------------------
// TP4056 charging
// ---------------------------------------------------------------------------

/** TP4056 programming constant: Ichg = 1200 V / Rprog. */
export const TP4056_K = 1200
/** Constant-voltage float, V. */
export const TP4056_VFLOAT = 4.2
/** Charge terminates when current falls to about a tenth of the set value. */
export const TP4056_TERMINATE_FRACTION = 0.1

export type ChargerReadout = {
  /** Charge current the program resistor sets, A. */
  current: number
  /** Nearest standard resistor and the current it really gives. */
  rStandard: number
  actualCurrent: number
  /** Charge rate as a multiple of capacity per hour. */
  cRate: number
  /** Rough time in the constant-current phase, s. */
  ccTime: number
  /** Rough time in the constant-voltage tail, s. */
  cvTime: number
  totalTime: number
  /** Power the chip dissipates at the start of charging, W. */
  dissipation: number
  overRate: boolean
  hot: boolean
}

/**
 * The TP4056 charges at a constant current until the cell reaches 4.2 V, then
 * holds that voltage while current decays. The CC phase moves most of the
 * charge; the CV tail is slow and contributes the last 10 to 20%.
 */
export function analyseCharger(
  rProg: number,
  capacityAh: number,
  vInput: number,
  startFraction = 0,
): ChargerReadout {
  const current = rProg > 0 ? TP4056_K / rProg : 0
  const rStandard = nearestByRatio('E24', rProg)
  const actualCurrent = rStandard > 0 ? TP4056_K / rStandard : 0
  const capacity = capacityAh * 3600
  // CC carries the cell to about 80% of capacity, CV finishes the rest.
  const ccCharge = capacity * (0.8 - startFraction)
  const ccTime = actualCurrent > 0 ? Math.max(0, ccCharge) / actualCurrent : Infinity
  // The tail decays exponentially to the termination threshold; ln(1/0.1) of a
  // time constant set by the remaining charge at the initial rate.
  const cvTime =
    actualCurrent > 0
      ? ((capacity * 0.2) / actualCurrent) * Math.log(1 / TP4056_TERMINATE_FRACTION)
      : Infinity
  return {
    current,
    rStandard,
    actualCurrent,
    cRate: capacityAh > 0 ? actualCurrent / capacityAh : Infinity,
    ccTime,
    cvTime,
    totalTime: ccTime + cvTime,
    dissipation: (vInput - 3.0) * actualCurrent,
    overRate: capacityAh > 0 && actualCurrent / capacityAh > 1,
    hot: (vInput - 3.0) * actualCurrent > 1,
  }
}

// ---------------------------------------------------------------------------
// Resistor markings
// ---------------------------------------------------------------------------

export const BAND_COLORS = [
  { name: 'opt.black', digit: 0, hex: '#1a1a1a' },
  { name: 'opt.brown', digit: 1, hex: '#8b4513' },
  { name: 'opt.red2', digit: 2, hex: '#d02020' },
  { name: 'opt.orange', digit: 3, hex: '#e07020' },
  { name: 'opt.yellow', digit: 4, hex: '#e0c020' },
  { name: 'opt.green', digit: 5, hex: '#20a040' },
  { name: 'opt.blue2', digit: 6, hex: '#2060d0' },
  { name: 'opt.violet', digit: 7, hex: '#8040c0' },
  { name: 'opt.grey', digit: 8, hex: '#808080' },
  { name: 'opt.white', digit: 9, hex: '#f0f0f0' },
] as const

/** EIA-96 mantissa table: code 01 to 96 maps onto the E96 series. */
export const EIA96_MANTISSA = [
  100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130, 133, 137, 140, 143, 147, 150,
  154, 158, 162, 165, 169, 174, 178, 182, 187, 191, 196, 200, 205, 210, 215, 221, 226, 232,
  237, 243, 249, 255, 261, 267, 274, 280, 287, 294, 301, 309, 316, 324, 332, 340, 348, 357,
  365, 374, 383, 392, 402, 412, 422, 432, 442, 453, 464, 475, 487, 499, 511, 523, 536, 549,
  562, 576, 590, 604, 619, 634, 649, 665, 681, 698, 715, 732, 750, 768, 787, 806, 825, 845,
  866, 887, 909, 931, 953, 976,
]

/** EIA-96 multiplier letters. */
export const EIA96_MULTIPLIER: Record<string, number> = {
  Z: 0.001, Y: 0.01, R: 0.01, X: 0.1, S: 0.1, A: 1, B: 10, H: 10, C: 100, D: 1000,
  E: 10_000, F: 100_000,
}

export type ResistorCodes = {
  /** Three colour digits and a multiplier exponent, for a 4 or 5 band part. */
  bands: Key[]
  /** Three digit SMD code, e.g. 472. */
  smd3: string
  /** Four digit SMD code, e.g. 4701. */
  smd4: string
  /** EIA-96 code, e.g. 68C. */
  eia96: string
  /** The value the codes actually represent, ohms. */
  value: number
}

/** Split a value into a mantissa with `digits` significant figures and an exponent. */
function split(value: number, digits: number): { mantissa: number; exp: number } {
  if (!(value > 0)) return { mantissa: 0, exp: 0 }
  const exp = Math.floor(Math.log10(value)) - (digits - 1)
  return { mantissa: Math.round(value / Math.pow(10, exp)), exp }
}

export function encodeResistor(value: number, bandCount: 4 | 5): ResistorCodes {
  const digits = bandCount === 4 ? 2 : 3
  const { mantissa, exp } = split(value, digits)
  const chars = String(mantissa).padStart(digits, '0').split('')
  const bands = chars.map((d) => BAND_COLORS[Number(d)]?.name ?? 'opt.black')
  // The multiplier band is itself a colour, for exponents 0 to 9.
  bands.push(BAND_COLORS[Math.max(0, Math.min(9, exp))]?.name ?? 'opt.black')

  const s3 = split(value, 2)
  const s4 = split(value, 3)
  // EIA-96 needs the E96 index of the three-digit mantissa.
  const idx = EIA96_MANTISSA.indexOf(s4.mantissa)
  const letter =
    Object.entries(EIA96_MULTIPLIER).find(
      ([, m]) => Math.abs(m - Math.pow(10, s4.exp)) < Math.pow(10, s4.exp) * 1e-9,
    )?.[0] ?? '?'

  return {
    bands,
    smd3: `${s3.mantissa}${s3.exp}`,
    smd4: `${s4.mantissa}${s4.exp}`,
    eia96: idx >= 0 ? `${String(idx + 1).padStart(2, '0')}${letter}` : 'not in E96',
    value: mantissa * Math.pow(10, exp),
  }
}

/** Re-exported so the pages need a single import for their defaults. */
export const DEFAULT_LOW_RAIL = VCC
export const DEFAULT_HIGH_RAIL = VCC_5V
