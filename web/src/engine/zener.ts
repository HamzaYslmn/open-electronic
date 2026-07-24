/**
 * Zener shunt regulator sizing.
 *
 * Topology: Vin -> Rs -> output node, zener from that node to ground, load in
 * parallel with the zener. The zener swallows whatever current the load does
 * not take, so Rs has a two-sided constraint: small enough to feed the heaviest
 * load at the lowest input, large enough that the zener survives the highest
 * input with no load at all.
 *
 * DC model: an ideal Vz clamp once the zener conducts, which is what the sizing
 * equation Rs = (Vin - Vz) / (Iz + IL) assumes. Regulation quality is a separate
 * small-signal result around that operating point using the datasheet dynamic
 * impedance Zzt. Folding Zzt into the DC solution instead would mean
 * extrapolating a straight line from the test current down to the knee, where a
 * real zener is nowhere near linear (1N4728A: Zzt 10 ohm at 76 mA, Zzk 400 ohm
 * at 1 mA), so the tangent-line output voltage would be badly wrong at low Iz.
 */

/**
 * Fraction of the rated dissipation a design should actually use. Zener power
 * ratings are quoted at a 25 C lead or ambient temperature; in still air on a
 * real board, half the rating is the usual working budget.
 */
import { bracketWide } from './eseries'

export const POWER_DERATING = 0.5

/** Stock through-hole and chip resistor power ratings, in watts. */
const WATTAGES = [0.0625, 0.1, 0.125, 0.25, 0.5, 1, 2, 3, 5, 10]

export type ZenerDesign = {
  /** Lowest the supply ever goes, V. */
  vinMin: number
  /** Highest the supply ever goes, V. */
  vinMax: number
  /** Nominal zener voltage at the datasheet test current, V. */
  vz: number
  /** Datasheet dynamic impedance Zzt, ohms. Sets regulation, not the DC point. */
  rz: number
  /** Rated dissipation of the package, W. */
  pzMax: number
  /** Lowest zener current that still counts as regulating (above the knee), A. */
  izMin: number
  /** Lightest load, A. Worst case for the zener. */
  ilMin: number
  /** Heaviest load, A. Worst case for regulation. */
  ilMax: number
  /** The series resistor actually fitted, ohms. */
  rs: number
}

export type OpPoint = {
  /** Node voltage across the zener and the load, V. */
  vout: number
  /** Zener current, A. Zero once the part falls out of conduction. */
  iz: number
  /** Current through the series resistor, A. */
  irs: number
  /** Zener dissipation, Pz = Vz * Iz. */
  pz: number
  /** Series resistor dissipation, Irs^2 * Rs. */
  prs: number
  regulating: boolean
}

/** Zener current the package can carry: Iz_max = derating * Pz_max / Vz. */
export function maxZenerCurrent(pzMax: number, vz: number, derating = POWER_DERATING): number {
  return vz > 0 ? (derating * pzMax) / vz : 0
}

/**
 * The sizing equation: Rs = (Vin - Vz) / (Iz + IL).
 * Total current through Rs is the zener current plus the load current, and the
 * drop across it is the input headroom.
 */
export function seriesResistor(vin: number, vz: number, iz: number, il: number): number {
  const total = iz + il
  return total > 0 ? (vin - vz) / total : Infinity
}

/**
 * Largest usable Rs. Worst case for regulation is the lowest input with the
 * heaviest load, where the zener is closest to its knee.
 */
export function maxSeriesResistor(
  vinMin: number,
  vz: number,
  izMin: number,
  ilMax: number,
): number {
  return seriesResistor(vinMin, vz, izMin, ilMax)
}

/**
 * Smallest usable Rs. Worst case for the zener is the highest input with the
 * lightest load, where nearly all the resistor current is diverted into it.
 */
export function minSeriesResistor(
  vinMax: number,
  vz: number,
  izMaxAllowed: number,
  ilMin: number,
): number {
  return seriesResistor(vinMax, vz, izMaxAllowed, ilMin)
}

/**
 * DC operating point for one corner of the input and load range.
 * Closed form, no iteration: the zener either clamps or it does not.
 */
export function operate(vin: number, rs: number, il: number, vz: number): OpPoint {
  // Assume the zener clamps, then check the current it would have to shunt.
  let vout = vz
  let iz = rs > 0 ? (vin - vz) / rs - il : 0

  if (!(iz > 0)) {
    // Out of regulation: the zener is off, so Rs and the load are just a series
    // drop. A constant-current load cannot pull the node below ground, so clamp
    // there rather than reporting a negative output.
    iz = 0
    vout = Math.max(0, vin - il * rs)
  }

  const irs = rs > 0 ? (vin - vout) / rs : 0
  return { vout, iz, irs, pz: vout * iz, prs: irs * irs * rs, regulating: iz > 0 }
}

/**
 * Output impedance of the shunt, Rs in parallel with the zener's dynamic
 * impedance Zz. This is also the load regulation, dVout/dIload in V/A.
 */
export function outputImpedance(rs: number, rz: number): number {
  return rs + rz > 0 ? (rs * rz) / (rs + rz) : 0
}

/**
 * Line regulation, dVout/dVin = Zz / (Rs + Zz). Rs and Zz form a divider for
 * anything riding on the input, so this is also the ripple attenuation.
 */
export function lineRegulation(rs: number, rz: number): number {
  return rs + rz > 0 ? rz / (rs + rz) : 1
}

/** Largest E24 value not exceeding `value`, e.g. 58 -> 56. */
export function largestE24AtMost(value: number): number {
  if (!(value > 0) || !Number.isFinite(value)) return NaN
  return bracketWide('E24', value).below
}

/** Smallest stock resistor wattage that covers `p`. */
export function standardWattage(p: number): number {
  return WATTAGES.find((w) => w >= p) ?? WATTAGES[WATTAGES.length - 1]
}

export type ZenerReadout = {
  /** Rs bounds set by the two worst cases, ohms. */
  rsMin: number
  rsMax: number
  /** Largest E24 value inside the window, NaN when the window is empty. */
  rsSuggested: number
  windowValid: boolean
  /** Vin max with the lightest load: the corner that stresses the zener. */
  hot: OpPoint
  /** Vin min with the heaviest load: the corner that loses regulation first. */
  cold: OpPoint
  /** Derated current budget for the zener, A. */
  izMaxAllowed: number
  /** Worst case zener dissipation as a fraction of the rating. */
  pzFraction: number
  /** Over the absolute rating, i.e. the part is being destroyed. */
  overPower: boolean
  /** Over the derated budget but under the rating: works, runs hot. */
  overDerated: boolean
  /** Zener falls below izMin at the low input, heavy load corner. */
  dropout: boolean
  /** Input below which regulation is lost at the heaviest load, V. */
  vinDropout: number
  /** Input above which the zener exceeds its derated budget, V. */
  vinPowerLimit: number
  /** Rs || Zz, the output impedance and the load regulation in V/A. */
  zout: number
  /** dVout/dVin, dimensionless. */
  lineReg: number
  /** Input ripple attenuation in dB (negative). */
  rippleDb: number
  /** Output shift across the whole load range, V. */
  loadSwing: number
  /** Output shift across the whole input range, V. */
  lineSwing: number
  /** Worst case current drawn from the supply, A. Set by Vin max, not the load. */
  supplyMax: number
  /** Worst case total dissipation, resistor plus zener, W. */
  pTotal: number
  /** Stock wattage for Rs with 2x headroom, W. */
  rsWattage: number
  /** Load power over input power at full load, mid input. */
  efficiency: number
}

/** Everything the zener page reports, derived once per parameter change. */
export function analyse(d: ZenerDesign): ZenerReadout {
  const izMaxAllowed = maxZenerCurrent(d.pzMax, d.vz)
  const rsMin = minSeriesResistor(d.vinMax, d.vz, izMaxAllowed, d.ilMin)
  const rsMax = maxSeriesResistor(d.vinMin, d.vz, d.izMin, d.ilMax)
  const windowValid = rsMax > 0 && rsMin > 0 && rsMin <= rsMax

  // Pick the largest E24 part in the window: the bigger Rs is, the less current
  // the zener has to burn, so efficiency and zener temperature both improve.
  let rsSuggested = NaN
  if (windowValid) {
    const candidate = largestE24AtMost(rsMax)
    rsSuggested = candidate >= rsMin ? candidate : NaN
  }

  const hot = operate(d.vinMax, d.rs, d.ilMin, d.vz)
  const cold = operate(d.vinMin, d.rs, d.ilMax, d.vz)

  const zout = outputImpedance(d.rs, d.rz)
  const lineReg = lineRegulation(d.rs, d.rz)

  // Small-signal shifts across the specified ranges, valid while regulating.
  const loadSwing = zout * (d.ilMax - d.ilMin)
  const lineSwing = lineReg * (d.vinMax - d.vinMin)

  const vinNom = (d.vinMin + d.vinMax) / 2
  const irsNom = d.rs > 0 ? (vinNom - d.vz) / d.rs : 0
  const efficiency = irsNom > 0 ? (d.vz * d.ilMax) / (vinNom * irsNom) : 0

  return {
    rsMin,
    rsMax,
    rsSuggested,
    windowValid,
    hot,
    cold,
    izMaxAllowed,
    pzFraction: d.pzMax > 0 ? hot.pz / d.pzMax : Infinity,
    overPower: hot.pz > d.pzMax,
    overDerated: hot.pz > POWER_DERATING * d.pzMax && hot.pz <= d.pzMax,
    dropout: cold.iz < d.izMin,
    // Iz hits izMin when Vin = Vz + Rs*(izMin + IL_max).
    vinDropout: d.vz + d.rs * (d.izMin + d.ilMax),
    vinPowerLimit: d.vz + d.rs * (izMaxAllowed + d.ilMin),
    zout,
    lineReg,
    rippleDb: 20 * Math.log10(lineReg),
    loadSwing,
    lineSwing,
    supplyMax: hot.irs,
    pTotal: hot.pz + hot.prs,
    rsWattage: standardWattage(2 * hot.prs),
    efficiency,
  }
}
