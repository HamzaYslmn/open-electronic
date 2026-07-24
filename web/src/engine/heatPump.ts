/**
 * Heat pump thermodynamics: the Carnot ceiling, a real COP from a second-law
 * efficiency fraction, and the running cost against a resistive heater.
 *
 * Everything is reversible-cycle bookkeeping plus one empirical number, eta,
 * the second-law (exergy) efficiency, which is what separates a catalogue
 * machine from a textbook one. Temperatures are kelvin, powers are watts,
 * energies are joules. Tariffs are quoted per kWh because that is how meters
 * bill, so J_PER_KWH converts at the boundary.
 *
 * No logic rail applies on this page: the input is mains electrical power, so
 * VCC from constants.ts is deliberately not used here.
 */

/** 0 degrees Celsius in kelvin. */
export const T0_K = 273.15

/** Joules in one kilowatt hour, 1000 W times 3600 s. */
export const J_PER_KWH = 3.6e6

/**
 * Heating degree-day base temperature. Below this outdoor temperature a
 * building needs heat; above it, internal and solar gains cover the loss.
 * 15.5 C is the long-standing UK/EU degree-day base (CIBSE TM41).
 */
export const HEATING_BASE_C = 15.5

/**
 * Practical single-stage vapour-compression limit. Past roughly a 60 K lift the
 * pressure ratio drives discharge temperature and volumetric efficiency out of
 * spec, and a real system goes cascade or two-stage. A fixed eta stops being a
 * fair model above this.
 */
export const MAX_LIFT_K = 60

/** Outdoor band where an air-source evaporator frosts and has to defrost. */
export const DEFROST_LOW_C = -7
export const DEFROST_HIGH_C = 5

export function toKelvin(celsius: number): number {
  return celsius + T0_K
}

export function toCelsius(kelvin: number): number {
  return kelvin - T0_K
}

/**
 * Carnot COP for heating: COP = Th / (Th - Tc), both absolute temperatures.
 * This is the ceiling no machine can beat. Zero lift means free heat, i.e. the
 * COP is unbounded, so the caller has to treat Infinity as "not pumping".
 */
export function carnotCop(thK: number, tcK: number): number {
  const lift = thK - tcK
  if (lift <= 0) return Infinity
  return thK / lift
}

/**
 * Real COP = eta * COP_carnot, eta being the second-law efficiency: the
 * fraction of the reversible ideal the machine actually reaches. Air-source
 * units land near 0.35 to 0.50, ground-source a little higher.
 */
export function cop(thK: number, tcK: number, eta: number): number {
  return eta * carnotCop(thK, tcK)
}

/** Heat delivered to the hot side for an electrical input W: Qh = COP * W. */
export function heatOutput(electricalW: number, copValue: number): number {
  return copValue * electricalW
}

/**
 * Heat lifted out of the cold side. First law on the whole machine:
 * Qh = W + Qc, so Qc = (COP - 1) * W. This is the part that is free.
 */
export function heatAbsorbed(electricalW: number, copValue: number): number {
  return (copValue - 1) * electricalW
}

/**
 * Price of one kWh of delivered heat: cost = tariff / COP.
 * A resistor is COP = 1 exactly, so its heat costs the tariff itself.
 */
export function costPerKwhHeat(tariffPerKwh: number, copValue: number): number {
  return copValue > 0 ? tariffPerKwh / copValue : Infinity
}

/**
 * Demand-weighted seasonal COP.
 *
 * Heating load at outdoor temperature T is proportional to (Tbase - T), the
 * degree-day model, so cold hours carry more weight than mild ones. Over a set
 * of temperature bins,
 *
 *   SCOP = sum(load_i) / sum(load_i / COP_i)
 *
 * which is a load-weighted harmonic mean, not an average of COPs. Outdoor
 * temperature is taken as uniformly distributed between the design temperature
 * and the base temperature: a real bin analysis uses measured hours per bin for
 * the site, and would shift this either way.
 *
 * Flow temperature is held fixed across the season. Weather compensation, i.e.
 * dropping the flow temperature when it is mild, would raise this number.
 */
export function seasonalCop(
  thK: number,
  designTcK: number,
  eta: number,
  baseK: number = toKelvin(HEATING_BASE_C),
  bins = 64,
): number {
  // Nothing to weight if the design temperature is already above the base.
  if (designTcK >= baseK) return cop(thK, designTcK, eta)

  let heat = 0
  let work = 0
  for (let i = 0; i < bins; i++) {
    // Bin centres, so neither endpoint is counted twice.
    const tK = designTcK + ((i + 0.5) / bins) * (baseK - designTcK)
    const load = baseK - tK // proportional to the heat demand at this temperature
    const c = cop(thK, tK, eta)
    if (c <= 0 || Number.isNaN(c)) continue
    heat += load
    // An infinite COP contributes heat at zero electrical cost, the correct
    // limit as the lift goes to zero.
    if (Number.isFinite(c)) work += load / c
  }
  return work > 0 ? heat / work : Infinity
}

/**
 * COP against outdoor temperature, the curve the page plots. Pure sampling of
 * the closed-form COP, so there is no integrator to go unstable; the caller
 * keeps toC below thK so the Carnot branch stays finite.
 */
export function copSweep(
  thK: number,
  eta: number,
  fromC: number,
  toC: number,
  n: number,
): { carnot: Float64Array; real: Float64Array; stepK: number } {
  const carnot = new Float64Array(n)
  const real = new Float64Array(n)
  const stepK = n > 1 ? (toC - fromC) / (n - 1) : 0
  for (let i = 0; i < n; i++) {
    const c = carnotCop(thK, toKelvin(fromC + i * stepK))
    carnot[i] = c
    real[i] = eta * c
  }
  return { carnot, real, stepK }
}

export type HeatPumpInput = {
  /** Hot side, i.e. the water flow temperature into the emitters, in Celsius. */
  flowC: number
  /** Cold side, i.e. the outdoor air or ground loop temperature, in Celsius. */
  outdoorC: number
  /** Second-law efficiency, 0 to 1. */
  eta: number
  /** Electrical input power in watts. */
  electricalW: number
  /** Electricity price per kWh, in whatever currency the caller uses. */
  tariffPerKwh: number
  /** Coldest outdoor temperature the season is sized against, in Celsius. */
  designOutdoorC: number
  /** Heat the building needs over the whole heating season, in joules. */
  seasonalHeatJ: number
}

export type HeatPumpReadout = {
  thK: number
  tcK: number
  /** Temperature lift the compressor has to cover, in kelvin. */
  liftK: number
  carnot: number
  cop: number
  /** Heat delivered, in watts. */
  heatW: number
  /** Heat lifted from the cold side, in watts. The free part. */
  absorbedW: number
  /** Cost of a kWh of delivered heat, same currency as the tariff. */
  heatCostPerKwh: number
  /** Same for a resistive heater, which is the tariff itself. */
  resistiveCostPerKwh: number
  /** Fraction of the resistive bill saved at this operating point, 1 - 1/COP. */
  savingFraction: number
  scop: number
  /** Electricity the season needs, in joules. */
  seasonalElectricityJ: number
  seasonalCost: number
  resistiveSeasonalCost: number
  seasonalSaving: number
  /** Fraction of the seasonal bill saved, 1 - 1/SCOP. */
  seasonalSavingFraction: number
  /** Seconds of running at this operating point to cover the season. */
  runtimeS: number
  /** Cold side is at or above the hot side: nothing to pump, model invalid. */
  noLift: boolean
  /** COP is below 1, so a plain resistor delivers more heat per unit bought. */
  belowResistive: boolean
  /** Lift is past the single-stage envelope, a fixed eta is optimistic. */
  extremeLift: boolean
  /** Air-source evaporator frosts here, so real capacity and COP drop. */
  defrostBand: boolean
  /** eta above 1 would beat Carnot, which the second law forbids. */
  etaInvalid: boolean
}

/** Everything the heat pump page reports, derived once per parameter change. */
export function analyse(input: HeatPumpInput): HeatPumpReadout {
  const {
    flowC,
    outdoorC,
    eta,
    electricalW,
    tariffPerKwh,
    designOutdoorC,
    seasonalHeatJ,
  } = input

  const thK = toKelvin(flowC)
  const tcK = toKelvin(outdoorC)
  const liftK = thK - tcK
  const carnot = carnotCop(thK, tcK)
  const copValue = cop(thK, tcK, eta)
  const heatW = heatOutput(electricalW, copValue)

  const scop = seasonalCop(thK, toKelvin(designOutdoorC), eta)
  const seasonalElectricityJ = scop > 0 ? seasonalHeatJ / scop : Infinity
  const seasonalHeatKwh = seasonalHeatJ / J_PER_KWH
  const seasonalCost = (seasonalElectricityJ / J_PER_KWH) * tariffPerKwh
  // A resistor turns every bought kWh into exactly one kWh of heat.
  const resistiveSeasonalCost = seasonalHeatKwh * tariffPerKwh

  return {
    thK,
    tcK,
    liftK,
    carnot,
    cop: copValue,
    heatW,
    absorbedW: heatAbsorbed(electricalW, copValue),
    heatCostPerKwh: costPerKwhHeat(tariffPerKwh, copValue),
    resistiveCostPerKwh: tariffPerKwh,
    savingFraction: copValue > 0 ? 1 - 1 / copValue : -Infinity,
    scop,
    seasonalElectricityJ,
    seasonalCost,
    resistiveSeasonalCost,
    seasonalSaving: resistiveSeasonalCost - seasonalCost,
    seasonalSavingFraction: scop > 0 ? 1 - 1 / scop : -Infinity,
    runtimeS: heatW > 0 ? seasonalHeatJ / heatW : Infinity,
    noLift: liftK <= 0,
    belowResistive: copValue < 1,
    extremeLift: liftK > MAX_LIFT_K,
    defrostBand: outdoorC >= DEFROST_LOW_C && outdoorC <= DEFROST_HIGH_C,
    etaInvalid: eta > 1,
  }
}
