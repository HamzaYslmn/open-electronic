/**
 * Copper conductor sizing: AWG wire and PCB traces.
 *
 * Both pages answer the same question from different geometry, so the AWG
 * table, resistivity and voltage-drop maths live here once. `heating.ts`
 * re-exports awgDiameter rather than keeping its own copy.
 *
 * Base SI: metres, ohms, amps, volts, watts, kelvin.
 */

/** Resistivity of annealed copper at 20 C, ohm metres. */
export const RHO_COPPER_20C = 1.68e-8

/** Temperature coefficient of resistance for copper, per kelvin. */
export const ALPHA_COPPER = 0.00393

/** AWG 36 is defined as 0.005 inch; the series is geometric from there. */
export const AWG_REF_DIAMETER = 0.127e-3

/** One ounce of copper spread over a square foot, in metres of thickness. */
export const OZ_COPPER_THICKNESS = 34.79e-6

/**
 * AWG to conductor diameter in metres: d = 0.127 mm * 92^((36-n)/39).
 * The 92^(1/39) ratio makes six gauge steps almost exactly a factor of two in
 * area, which is why 3 gauges halves the area and 10 gauges is a factor of ten.
 */
export function awgDiameter(awg: number): number {
  return AWG_REF_DIAMETER * Math.pow(92, (36 - awg) / 39)
}

/** Circular cross-section area from diameter, m^2. */
export function circleArea(diameter: number): number {
  return Math.PI * (diameter / 2) ** 2
}

/** Resistivity of copper at a temperature, ohm metres. */
export function copperResistivity(tempC: number): number {
  return RHO_COPPER_20C * (1 + ALPHA_COPPER * (tempC - 20))
}

/** R = rho*L/A. */
export function resistance(area: number, length: number, tempC = 20): number {
  return area > 0 ? (copperResistivity(tempC) * length) / area : Infinity
}

// ---------------------------------------------------------------------------
// AWG wire
// ---------------------------------------------------------------------------

/**
 * Rule-of-thumb ampacity in amps per square millimetre. Chassis wiring runs
 * hotter than a bundle in a loom, which is why the two figures differ so much.
 * These are engineering guidance, not a code-compliant rating.
 */
export const AMPACITY_CHASSIS_A_PER_MM2 = 7.5
export const AMPACITY_BUNDLED_A_PER_MM2 = 3.5

export type WireReadout = {
  diameter: number
  area: number
  /** Ohms per metre of conductor at the working temperature. */
  ohmsPerMetre: number
  /** Resistance of the whole run, counting both conductors if it is a round trip. */
  loopResistance: number
  vDrop: number
  /** Drop as a fraction of the supply. */
  dropFraction: number
  /** Power lost as heat in the cable, W. */
  lossW: number
  /** Voltage actually arriving at the load, V. */
  vLoad: number
  ampacityChassis: number
  ampacityBundled: number
  /** Current density in the conductor, A/mm^2. */
  currentDensity: number
  overAmpacity: boolean
  excessiveDrop: boolean
}

/**
 * Size a run. `roundTrip` counts both the feed and the return conductor, which
 * is what actually matters for DC drop and the usual cause of people
 * underestimating it by half.
 */
export function analyseWire(
  awg: number,
  length: number,
  current: number,
  supply: number,
  tempC = 20,
  roundTrip = true,
  dropLimit = 0.03,
): WireReadout {
  const diameter = awgDiameter(awg)
  const area = circleArea(diameter)
  const ohmsPerMetre = resistance(area, 1, tempC)
  const conductors = roundTrip ? 2 : 1
  const loopResistance = ohmsPerMetre * length * conductors
  const vDrop = current * loopResistance
  const areaMm2 = area * 1e6
  return {
    diameter,
    area,
    ohmsPerMetre,
    loopResistance,
    vDrop,
    dropFraction: supply > 0 ? vDrop / supply : Infinity,
    lossW: current * current * loopResistance,
    vLoad: supply - vDrop,
    ampacityChassis: areaMm2 * AMPACITY_CHASSIS_A_PER_MM2,
    ampacityBundled: areaMm2 * AMPACITY_BUNDLED_A_PER_MM2,
    currentDensity: areaMm2 > 0 ? current / areaMm2 : Infinity,
    overAmpacity: current > areaMm2 * AMPACITY_BUNDLED_A_PER_MM2,
    excessiveDrop: supply > 0 && vDrop / supply > dropLimit,
  }
}

// ---------------------------------------------------------------------------
// PCB traces, IPC-2221
// ---------------------------------------------------------------------------

/** IPC-2221 constants: external layers cool far better than internal ones. */
export const IPC_K_EXTERNAL = 0.048
export const IPC_K_INTERNAL = 0.024
export const IPC_B = 0.44
export const IPC_C = 0.725

/**
 * IPC-2221 cross-section for a current and temperature rise:
 *   I = k * dT^0.44 * A^0.725,  so  A = (I / (k * dT^0.44))^(1/0.725)
 * A comes out in square mils, which is the unit the standard is written in.
 */
export function ipcAreaMils2(current: number, riseK: number, external: boolean): number {
  const k = external ? IPC_K_EXTERNAL : IPC_K_INTERNAL
  if (!(current > 0) || !(riseK > 0)) return 0
  return Math.pow(current / (k * Math.pow(riseK, IPC_B)), 1 / IPC_C)
}

/** Current a given cross-section carries at a temperature rise, the inverse. */
export function ipcCurrent(areaMils2: number, riseK: number, external: boolean): number {
  const k = external ? IPC_K_EXTERNAL : IPC_K_INTERNAL
  return k * Math.pow(riseK, IPC_B) * Math.pow(areaMils2, IPC_C)
}

const MIL = 25.4e-6

export type TraceReadout = {
  /** Copper thickness for the chosen weight, m. */
  thickness: number
  /** Required cross-section, m^2. */
  area: number
  /** Required trace width, m. */
  width: number
  /** Width in mils, the unit fabricators quote. */
  widthMils: number
  resistanceOhms: number
  vDrop: number
  lossW: number
  /** Current density, A/mm^2. */
  currentDensity: number
  /** True when the width is below what a cheap fab reliably etches. */
  belowFabLimit: boolean
}

/** Typical low-cost fabrication limit, 4 mil (about 0.1 mm). */
export const FAB_MIN_WIDTH = 4 * MIL

export function analyseTrace(
  current: number,
  riseK: number,
  external: boolean,
  ozCopper: number,
  length: number,
  tempC = 20,
): TraceReadout {
  const thickness = ozCopper * OZ_COPPER_THICKNESS
  const areaMils2 = ipcAreaMils2(current, riseK, external)
  const area = areaMils2 * MIL * MIL
  const width = thickness > 0 ? area / thickness : Infinity
  const r = resistance(area, length, tempC)
  return {
    thickness,
    area,
    width,
    widthMils: width / MIL,
    resistanceOhms: r,
    vDrop: current * r,
    lossW: current * current * r,
    currentDensity: area > 0 ? current / (area * 1e6) : Infinity,
    belowFabLimit: width < FAB_MIN_WIDTH,
  }
}
