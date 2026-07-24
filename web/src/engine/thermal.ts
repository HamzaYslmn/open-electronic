/**
 * Heatsink and junction temperature maths.
 *
 * The thermal circuit is the exact dual of an electrical one: dissipated power
 * is the current source, temperature rise is the voltage, thermal resistance in
 * K/W is the resistor and thermal capacitance in J/K is the capacitor. Every
 * formula below is that analogy applied to the standard datasheet chain,
 * junction to case to sink to ambient (see any power semiconductor datasheet
 * thermal section, or JEDEC JESD51 for how Rth is defined and measured).
 *
 * Temperatures are stored in kelvin, the SI base unit. A difference in kelvin
 * and a difference in degrees Celsius are numerically identical, so every
 * resistance, rise and margin here reads the same in either scale; only the
 * absolute temperatures need converting at the display edge.
 */

/** 0 degrees Celsius expressed in kelvin. */
export const KELVIN_OFFSET = 273.15

export function celsiusToKelvin(c: number): number {
  return c + KELVIN_OFFSET
}

export function kelvinToCelsius(k: number): number {
  return k - KELVIN_OFFSET
}

/**
 * Quiescent (ground pin) current of a small linear regulator. AMS1117
 * datasheet: 5 mA typical, and it is drawn from the input, so it dissipates
 * Vin*Iq regardless of the load. Small next to the pass element loss, but it
 * dominates at light load.
 */
export const LDO_IQ_TYPICAL = 5e-3

/**
 * Power burnt by a linear regulator, W.
 * P = (Vin - Vout)*Iout + Vin*Iq
 * A linear regulator throws away the whole voltage difference as heat, so the
 * dissipation is set by the drop, not by the output power.
 */
export function linearRegulatorPower(
  vin: number,
  vout: number,
  iout: number,
  iq: number = LDO_IQ_TYPICAL,
): number {
  return Math.max(0, vin - vout) * iout + vin * iq
}

export type ThermalChain = {
  /** Steady dissipation inside the die, W. */
  power: number
  /** Ambient air temperature, K. */
  ambient: number
  /** Junction to case thermal resistance, K/W. Set by the package. */
  rjc: number
  /** Case to sink thermal resistance, K/W. The mounting interface. */
  rcs: number
  /** Sink to ambient thermal resistance, K/W. The heatsink rating. */
  rsa: number
  /** Absolute maximum junction temperature from the datasheet, K. */
  tjMax: number
}

/** Series chain junction to ambient: Rja = Rjc + Rcs + Rsa. */
export function totalResistance(c: Pick<ThermalChain, 'rjc' | 'rcs' | 'rsa'>): number {
  return c.rjc + c.rcs + c.rsa
}

/** Steady-state junction temperature: Tj = Ta + P*(Rjc + Rcs + Rsa). */
export function junctionTemp(c: ThermalChain): number {
  return c.ambient + c.power * totalResistance(c)
}

/** Steady-state case temperature: Tc = Ta + P*(Rcs + Rsa). */
export function caseTemp(c: ThermalChain): number {
  return c.ambient + c.power * (c.rcs + c.rsa)
}

/** Steady-state heatsink temperature: Ts = Ta + P*Rsa. */
export function sinkTemp(c: ThermalChain): number {
  return c.ambient + c.power * c.rsa
}

/**
 * Heatsink needed to land exactly on Tjmax:
 * Rsa_required = (Tjmax - Ta)/P - Rjc - Rcs
 *
 * A result of zero or less means the package and its mounting interface
 * already spend the whole budget, so no heatsink of any size will help.
 * Zero power returns Infinity: nothing to remove, any sink will do.
 */
export function requiredSinkResistance(c: ThermalChain): number {
  if (c.power <= 0) return Infinity
  return (c.tjMax - c.ambient) / c.power - c.rjc - c.rcs
}

/** Dissipation that puts the junction exactly at Tjmax: Pmax = (Tjmax - Ta)/Rja. */
export function maxPower(c: ThermalChain): number {
  const r = totalResistance(c)
  if (r <= 0) return Infinity
  return Math.max(0, (c.tjMax - c.ambient) / r)
}

/**
 * Thermal time constant of the heatsink, s: tau = Rsa*Cth.
 * Cth is the sink's heat capacity, mass times specific heat, e.g. 20 g of
 * aluminium at 897 J/(kg*K) is about 18 J/K.
 */
export function thermalTimeConstant(rsa: number, cth: number): number {
  return rsa * cth
}

export type ThermalTransient = {
  /** Junction temperature per sample, K. */
  tj: Float64Array
  /** Case temperature per sample, K. */
  tc: Float64Array
  /** Heatsink temperature per sample, K. */
  ts: Float64Array
}

/**
 * Warm-up from ambient at constant power.
 *
 * Single lumped capacitance on the sink node. The die and the interface hold
 * almost no heat next to a lump of aluminium, so on this time base they follow
 * the sink instantly and only the sink integrates: Ts(t) = Ts_inf + (Ta -
 * Ts_inf)*exp(-t/tau), with Tj sitting P*(Rjc + Rcs) above it. That is why the
 * junction trace steps up at t = 0 and then climbs slowly.
 *
 * The recurrence is exact zero-order-hold, ts[n] = ts_inf + (ts[n-1] -
 * ts_inf)*exp(-dt/tau), the same form used in engine/rc.ts. It cannot overshoot
 * or oscillate at any dt, unlike forward Euler.
 */
export function simulate(
  c: ThermalChain,
  cth: number,
  n: number,
  dt: number,
): ThermalTransient {
  const tj = new Float64Array(n)
  const tc = new Float64Array(n)
  const ts = new Float64Array(n)
  if (n === 0) return { tj, tc, ts }

  const tau = thermalTimeConstant(c.rsa, cth)
  // Fraction of the remaining gap that survives one sample.
  const alpha = tau > 0 ? Math.exp(-dt / tau) : 0
  const sinkFinal = sinkTemp(c)
  const caseRise = c.power * c.rcs
  const dieRise = c.power * (c.rjc + c.rcs)

  let sink = c.ambient
  for (let i = 0; i < n; i++) {
    ts[i] = sink
    tc[i] = sink + caseRise
    tj[i] = sink + dieRise
    sink = sinkFinal + (sink - sinkFinal) * alpha
  }
  return { tj, tc, ts }
}

/** Everything the thermal page reports, derived once per parameter change. */
export type ThermalReadout = {
  power: number
  /** Rja, K/W. */
  rTotal: number
  /** Junction rise over ambient, K. */
  rise: number
  /** Steady-state temperatures, K. */
  tj: number
  tc: number
  ts: number
  /** Tjmax - Tj, K. Negative means the part is past its limit. */
  margin: number
  /** Share of the allowed rise used up. 1.0 is exactly at Tjmax. */
  utilisation: number
  /** Sink needed to hit Tjmax exactly, K/W. */
  requiredRsa: number
  /** Rjc + Rcs alone blow the budget, so no heatsink can rescue it. */
  sinkImpossible: boolean
  /** Dissipation allowed by the present chain, W. */
  maxPower: number
  overTemp: boolean
  /** Sink time constant, s. */
  tau: number
}

export function analyse(c: ThermalChain, cth = 0): ThermalReadout {
  const rTotal = totalResistance(c)
  const tj = junctionTemp(c)
  const rise = tj - c.ambient
  const budget = c.tjMax - c.ambient
  const requiredRsa = requiredSinkResistance(c)
  return {
    power: c.power,
    rTotal,
    rise,
    tj,
    tc: caseTemp(c),
    ts: sinkTemp(c),
    margin: c.tjMax - tj,
    utilisation: budget > 0 ? rise / budget : Infinity,
    requiredRsa,
    sinkImpossible: requiredRsa <= 0,
    maxPower: maxPower(c),
    overTemp: tj > c.tjMax,
    tau: thermalTimeConstant(c.rsa, cth),
  }
}
