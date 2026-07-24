/**
 * LM317 adjustable linear regulator: divider sizing, dissipation and thermals.
 *
 * The part is a floating regulator. It holds Vref between OUT and ADJ, so R1
 * (OUT to ADJ) sets a fixed program current Vref/R1, and that current plus the
 * adjust pin current flows through R2 (ADJ to ground) to lift the output:
 *
 *   Vout = Vref * (1 + R2/R1) + Iadj * R2
 *
 * Everything here is closed form, so there is no solver and nothing to make
 * unstable. Temperatures are in kelvin like the rest of the engine; convert at
 * the display edge with ZERO_C_K. Temperature differences are identical in K
 * and C, so a rise or a thermal resistance needs no conversion at all.
 *
 * Datasheet reference: TI LM317 (SLVS044).
 */

/** Zero Celsius in kelvin. Datasheets quote limits in C, the engine stores K. */
export const ZERO_C_K = 273.15

/** Reference voltage between OUT and ADJ. 1.25 V nominal. */
import { nearestByRatio } from './eseries'

export const V_REF = 1.25

/** Worst case reference over line, load and temperature: 1.20 V to 1.30 V. */
export const V_REF_MIN = 1.2
export const V_REF_MAX = 1.3

/**
 * Adjust pin current, 50 uA typical (100 uA max). It flows out of ADJ into R2,
 * so it adds Iadj*R2 to the output. Negligible with the classic 240 ohm R1,
 * significant once the divider is scaled up into the tens of kilohms.
 */
export const I_ADJ = 50e-6

/**
 * Dropout: the regulator needs this much input-to-output differential before it
 * stops regulating. 3 V is the guaranteed number at full current over
 * temperature; a lightly loaded room-temperature part manages closer to 2 V.
 */
export const DROPOUT_V = 3

/**
 * Minimum load current needed to stay in regulation: 3.5 mA typical, 5 mA max
 * at moderate differentials, rising to 10 mA max at the full 40 V. The classic
 * 240 ohm R1 draws 5.2 mA, which is exactly why that value is on every
 * reference schematic: the divider alone holds the part in regulation with the
 * load disconnected.
 */
export const I_LOAD_MIN = 5e-3

/** Guaranteed output current for the TO-220 part. Internal limit is ~2.2 A typical. */
export const I_OUT_MAX = 1.5

/** Absolute maximum input-to-output differential. */
export const V_IO_MAX = 40

/** Maximum operating junction temperature, 125 C. */
export const TJ_MAX_K = 125 + ZERO_C_K

/** Internal thermal shutdown trips near 175 C junction. */
export const TJ_SHUTDOWN_K = 175 + ZERO_C_K

export type PackageId = 'to220' | 'to263' | 'sot223'

/**
 * Package thermal data, K/W.
 *
 * rthJC is junction to case, the floor set by the part itself, and it is all
 * that matters once a heatsink is bolted on. rthJA is junction to ambient in
 * still air with no heatsink, which depends heavily on board copper: treat
 * these as within roughly 30%, not as precision figures.
 */
export const PACKAGES: ReadonlyArray<{
  value: PackageId
  label: string
  rthJC: number
  rthJA: number
}> = [
  { value: 'to220', label: 'TO-220', rthJC: 4, rthJA: 50 },
  { value: 'to263', label: 'TO-263 (D2PAK)', rthJC: 3, rthJA: 35 },
  { value: 'sot223', label: 'SOT-223', rthJC: 15, rthJA: 120 },
]

/**
 * Closest E24 value. The table and the matching rule live in the eseries
 * module so the whole codebase agrees on one set of preferred numbers.
 */
export function nearestE24(value: number): number {
  return nearestByRatio('E24', value)
}

/** Program current set by R1, Iprog = Vref / R1. Constant, independent of load. */
export function programCurrent(r1: number, vref = V_REF): number {
  return r1 > 0 ? vref / r1 : Infinity
}

/** Vout = Vref*(1 + R2/R1) + Iadj*R2. */
export function outputVoltage(r1: number, r2: number, iadj = I_ADJ, vref = V_REF): number {
  if (!(r1 > 0)) return NaN
  return vref * (1 + r2 / r1) + iadj * r2
}

/**
 * The same equation solved for R2: R2 = (Vout - Vref) / (Vref/R1 + Iadj).
 * The denominator is the total current the divider bottom leg has to carry.
 */
export function adjustResistor(vout: number, r1: number, iadj = I_ADJ, vref = V_REF): number {
  const i = programCurrent(r1, vref) + iadj
  return Number.isFinite(i) && i > 0 ? (vout - vref) / i : NaN
}

/**
 * Largest R1 that still keeps the part in regulation unloaded, Vref / Imin.
 * 1.25 / 5 mA = 250 ohm, hence the 240 ohm standard value.
 */
export function maxProgramResistor(iMin = I_LOAD_MIN, vref = V_REF): number {
  return iMin > 0 ? vref / iMin : Infinity
}

/** Pass element dissipation, Pd = (Vin - Vout) * I. A linear regulator burns the difference. */
export function dissipation(vin: number, vout: number, i: number): number {
  return (vin - vout) * i
}

/** Tj = Ta + Pd * Rth. */
export function junctionTemp(ambientK: number, pd: number, rth: number): number {
  return ambientK + pd * rth
}

/** Series thermal path with a heatsink: junction to case, case to sink, sink to air. */
export function heatsinkPath(rthJC: number, rthCS: number, rthSA: number): number {
  return rthJC + rthCS + rthSA
}

/** Power the package can shed before Tj hits its limit, Pd = (Tj_max - Ta) / Rth. */
export function maxDissipation(ambientK: number, rth: number, tjMaxK = TJ_MAX_K): number {
  return rth > 0 ? (tjMaxK - ambientK) / rth : Infinity
}

/**
 * Sink-to-ambient resistance needed to keep Tj at its limit:
 *   Rsa = (Tj_max - Ta)/Pd - Rjc - Rcs
 * A zero or negative result means no heatsink is enough, i.e. the junction to
 * case path alone already blows the budget. Reduce Pd or use a switcher.
 */
export function requiredSinkResistance(
  pd: number,
  ambientK: number,
  rthJC: number,
  rthCS: number,
  tjMaxK = TJ_MAX_K,
): number {
  if (!(pd > 0)) return Infinity
  return (tjMaxK - ambientK) / pd - rthJC - rthCS
}

export type LM317Design = {
  /** Unregulated input, V. */
  vin: number
  /** OUT to ADJ resistor, ohms. Sets the program current. */
  r1: number
  /** ADJ to ground resistor, ohms. Sets the output. */
  r2: number
  /** Load current, A. */
  iout: number
  /** Ambient air temperature, K. */
  ambientK: number
  /** Package junction to case, K/W. */
  rthJC: number
  /** Case to heatsink interface, K/W. Grease alone is about 0.5, a pad about 2. */
  rthCS: number
  /** Heatsink to ambient, K/W. */
  rthSA: number
  /** Package junction to ambient in free air, K/W. Used when no heatsink is fitted. */
  rthJA: number
  heatsink: boolean
}

/** Total junction to ambient resistance for the fitted arrangement. */
export function totalThermalResistance(d: LM317Design): number {
  return d.heatsink ? heatsinkPath(d.rthJC, d.rthCS, d.rthSA) : d.rthJA
}

export type LM317Readout = {
  /** Output with the fitted divider, V. */
  vout: number
  /** Output ignoring Iadj, i.e. the textbook 1.25*(1+R2/R1). */
  voutIdeal: number
  /** Volts contributed by the adjust pin current, Iadj*R2. */
  iadjTerm: number
  /** Output at the 1.20 V and 1.30 V reference corners, resistors assumed exact. */
  voutMin: number
  voutMax: number
  /** Divider current set by R1, A. */
  iProgram: number
  /** Largest R1 that still meets the minimum load spec unloaded, ohms. */
  r1Max: number
  /** True when the divider alone holds the part in regulation with no load. */
  minLoadOk: boolean
  /** Total current out of the OUT pin, load plus divider, A. */
  iDevice: number
  /** Vin - Vout, V. Negative when the input is below the output. */
  headroom: number
  /** Lowest input that still regulates, V. */
  vinMin: number
  dropout: boolean
  /** Input-to-output differential past the 40 V absolute maximum. */
  overDifferential: boolean
  overCurrent: boolean
  /** Pass element dissipation, W. */
  pd: number
  /** Power delivered to the load, W. */
  pLoad: number
  efficiency: number
  /** Junction to ambient resistance actually fitted, K/W. */
  rthTotal: number
  /** Temperature rise above ambient, K. */
  riseK: number
  /** Junction temperature as fitted, K. */
  tjK: number
  /** Junction temperature with no heatsink at all, K. */
  tjFreeAirK: number
  overTemp: boolean
  /** Past the internal thermal shutdown, so the output folds back on its own. */
  shutdown: boolean
  /** True when free air alone cannot hold Tj under its limit. */
  needsHeatsink: boolean
  /** Sink-to-ambient resistance required, K/W. Zero or less means impossible. */
  rthSinkNeeded: number
  heatsinkImpossible: boolean
  /** Power the fitted thermal path can shed at this ambient, W. */
  pdMax: number
  /** Load current at which Tj reaches its limit, A. */
  ioutThermal: number
  /** Usable load current, the lower of the thermal and the rated limit, A. */
  ioutCeiling: number
}

/** Everything the LM317 page reports, derived once per parameter change. */
export function analyse(d: LM317Design): LM317Readout {
  const vout = outputVoltage(d.r1, d.r2)
  const voutIdeal = outputVoltage(d.r1, d.r2, 0)
  const iProgram = programCurrent(d.r1)
  const iDevice = d.iout + iProgram

  // A negative headroom is not a negative dissipation: below dropout the pass
  // element is simply saturated, so clamp rather than report generated power.
  const headroom = d.vin - vout
  const pd = headroom > 0 ? dissipation(d.vin, vout, iDevice) : 0

  const rthTotal = totalThermalResistance(d)
  const riseK = pd * rthTotal
  const tjK = junctionTemp(d.ambientK, pd, rthTotal)
  const tjFreeAirK = junctionTemp(d.ambientK, pd, d.rthJA)

  const rthSinkNeeded = requiredSinkResistance(pd, d.ambientK, d.rthJC, d.rthCS)
  const pdMax = maxDissipation(d.ambientK, rthTotal)
  // Back out the load current that lands exactly on Tj_max at this headroom.
  const ioutThermal = headroom > 0 ? Math.max(0, pdMax / headroom - iProgram) : Infinity

  const pLoad = vout * d.iout
  const pIn = d.vin * iDevice

  return {
    vout,
    voutIdeal,
    iadjTerm: I_ADJ * d.r2,
    voutMin: outputVoltage(d.r1, d.r2, I_ADJ, V_REF_MIN),
    voutMax: outputVoltage(d.r1, d.r2, I_ADJ, V_REF_MAX),
    iProgram,
    r1Max: maxProgramResistor(),
    minLoadOk: iProgram >= I_LOAD_MIN,
    iDevice,
    headroom,
    vinMin: vout + DROPOUT_V,
    dropout: headroom < DROPOUT_V,
    overDifferential: headroom > V_IO_MAX,
    overCurrent: d.iout > I_OUT_MAX,
    pd,
    pLoad,
    efficiency: pIn > 0 ? pLoad / pIn : 0,
    rthTotal,
    riseK,
    tjK,
    tjFreeAirK,
    overTemp: tjK > TJ_MAX_K,
    shutdown: tjK >= TJ_SHUTDOWN_K,
    needsHeatsink: tjFreeAirK > TJ_MAX_K,
    rthSinkNeeded,
    heatsinkImpossible: tjFreeAirK > TJ_MAX_K && rthSinkNeeded <= 0,
    pdMax,
    ioutThermal,
    ioutCeiling: Math.min(ioutThermal, I_OUT_MAX),
  }
}

/** Divider suggestion for a target output. */
export type LM317Suggestion = {
  /** Exact R2 for the target, ohms. */
  r2Exact: number
  /** Nearest E24 value, ohms. */
  r2E24: number
  /** Output actually produced by the E24 part, V. */
  voutE24: number
  /** Signed error of the E24 part against the target, in percent. */
  errorPct: number
}

export function suggest(vTarget: number, r1: number): LM317Suggestion {
  const r2Exact = adjustResistor(vTarget, r1)
  const r2E24 = nearestE24(r2Exact)
  const voutE24 = outputVoltage(r1, r2E24)
  return {
    r2Exact,
    r2E24,
    voutE24,
    errorPct: vTarget > 0 ? (100 * (voutE24 - vTarget)) / vTarget : 0,
  }
}

/**
 * Junction temperature against load current, for the scope. Tj is linear in
 * Iout at fixed headroom, so this is the closed form evaluated on a grid:
 *   Tj(I) = Ta + (Vin - Vout) * (I + Iprog) * Rth
 * `di` is the current step per sample, i.e. the horizontal axis scale.
 */
export function thermalCurve(
  d: LM317Design,
  n: number,
  ioutMax = I_OUT_MAX,
): { di: number; tjK: Float64Array; tjFreeAirK: Float64Array } {
  const di = n > 1 ? ioutMax / (n - 1) : ioutMax
  const tjK = new Float64Array(n)
  const tjFreeAirK = new Float64Array(n)

  const headroom = Math.max(0, d.vin - outputVoltage(d.r1, d.r2))
  const iProgram = programCurrent(d.r1)
  const rthTotal = totalThermalResistance(d)

  for (let k = 0; k < n; k++) {
    const pd = headroom * (k * di + iProgram)
    tjK[k] = junctionTemp(d.ambientK, pd, rthTotal)
    tjFreeAirK[k] = junctionTemp(d.ambientK, pd, d.rthJA)
  }
  return { di, tjK, tjFreeAirK }
}
