/**
 * Resistive heating: nichrome hot-wire cutters and pyrography tips.
 *
 * Electrical side is Ohm's law with a temperature dependent resistivity,
 * rho(T) = rho20*(1 + alpha*(T - 293.15)) and R = rho*L/A, so the wire gets
 * slightly more resistive as it heats and settles at less power than it drew
 * cold.
 *
 * Thermal side is the lumped first-order energy balance
 *   m*c*dT/dt = P(T) - h*As*(T - Tamb)
 * which is what makes the wire settle at an equilibrium instead of climbing
 * forever. The lump is fair here: the Biot number for a sub-millimetre wire in
 * air is around 1e-4, far below the 0.1 rule of thumb, so there is no radial
 * gradient worth modelling inside the wire.
 *
 * The transient uses exact zero-order-hold steps. Power is held constant over
 * one sample, the balance is then linear, and its exact solution is
 *   T[n+1] = Teq[n] + (T[n] - Teq[n])*exp(-dt/tau),   tau = m*c/(h*As).
 * That is unconditionally stable at any dt. Forward Euler would diverge once
 * dt > 2*tau, and tau here is only a few seconds, so a coarse time base hits
 * that immediately.
 *
 * Loss is convection only, as the classic element-sizing formula has it.
 * Radiation is not in the balance, so `radiationShare` reports how much of the
 * loss it would have been at the computed temperature: once that is large the
 * real element runs cooler than this page says, and the page must surface it.
 *
 * Temperatures are kelvin. Everything else is base SI: m, ohm, A, V, W, J, kg.
 */

import { T_AMBIENT_K } from './constants'

export const KELVIN_OFFSET = 273.15

export const toCelsius = (k: number): number => k - KELVIN_OFFSET
export const toKelvin = (c: number): number => c + KELVIN_OFFSET

/** Resistivity and TCR are quoted at 20 C, which is not the 25 C ambient. */
export const RHO_REF_TEMP = toKelvin(20)

/** Stefan-Boltzmann constant, W/(m^2*K^4). CODATA exact value. */
export const STEFAN_BOLTZMANN = 5.670374419e-8

/**
 * AWG is defined geometrically: 36 gauge is 0.005 in (0.127 mm), 0000 gauge is
 * 0.46 in, and the 39 steps between them are a geometric series of ratio
 * 92^(1/39). So d(n) = 0.127 mm * 92^((36-n)/39).
 */
export const AWG_REF_DIAMETER = 0.127e-3

export type MaterialKey = 'nichrome80' | 'nichrome60' | 'kanthal-a1' | 'ss304' | 'copper'

export type Material = {
  key: MaterialKey
  label: string
  /** Resistivity at 20 C, ohm metres. */
  rho20: number
  /** Temperature coefficient of resistance, per kelvin, averaged over the
   *  working range from the maker's resistance-factor table. */
  alpha: number
  /** kg/m^3. */
  density: number
  /** Specific heat capacity, J/(kg*K). */
  specificHeat: number
  /** Maximum continuous element temperature, K. */
  maxTemp: number
  /** Total hemispherical emissivity of the surface once oxidised. */
  emissivity: number
}

/**
 * Typical published alloy data (Kanthal/Sandvik resistance alloy datasheets).
 * These are nominal, not guarantees: real spools vary a few percent in
 * resistivity and rather more in diameter tolerance.
 *
 * The point of NiCr and FeCrAl is the tiny alpha. Copper's is 80x larger,
 * which is exactly why copper is wiring and not an element.
 */
export const MATERIALS: readonly Material[] = [
  {
    key: 'nichrome80',
    label: 'Nichrome 80/20 (NiCr A)',
    rho20: 1.09e-6,
    alpha: 1.0e-4,
    density: 8300,
    specificHeat: 460,
    maxTemp: toKelvin(1200),
    emissivity: 0.87,
  },
  {
    key: 'nichrome60',
    label: 'Nichrome 60/16 (NiCr C)',
    rho20: 1.11e-6,
    alpha: 1.5e-4,
    density: 8200,
    specificHeat: 460,
    maxTemp: toKelvin(1150),
    emissivity: 0.87,
  },
  {
    key: 'kanthal-a1',
    label: 'Kanthal A1 (FeCrAl)',
    rho20: 1.45e-6,
    alpha: 4.0e-5,
    density: 7100,
    specificHeat: 460,
    maxTemp: toKelvin(1400),
    emissivity: 0.7,
  },
  {
    key: 'ss304',
    label: 'Stainless 304',
    rho20: 7.2e-7,
    alpha: 9.4e-4,
    density: 8000,
    specificHeat: 500,
    maxTemp: toKelvin(870),
    emissivity: 0.6,
  },
  {
    key: 'copper',
    label: 'Copper (for contrast)',
    rho20: 1.68e-8,
    alpha: 3.93e-3,
    density: 8960,
    specificHeat: 385,
    // Not an element material. The limit is the enamel, class H is 180 C.
    maxTemp: toKelvin(180),
    emissivity: 0.1,
  },
]

export function findMaterial(key: MaterialKey): Material {
  return MATERIALS.find((m) => m.key === key) ?? MATERIALS[0]
}

/** Wire diameter in metres for an AWG number. Defined once in `conductor`. */
export { awgDiameter } from './conductor'

/** Conductor cross-section, A = pi*d^2/4, in m^2. */
export function crossSection(diameter: number): number {
  return (Math.PI * diameter * diameter) / 4
}

/** Convecting surface of a round wire, As = pi*d*L. The end faces are noise. */
export function surfaceArea(diameter: number, length: number): number {
  return Math.PI * diameter * length
}

/** Mass of the wire, m = density * A * L, in kg. */
export function wireMass(material: Material, diameter: number, length: number): number {
  return material.density * crossSection(diameter) * length
}

/**
 * Resistivity at temperature: rho = rho20*(1 + alpha*(T - 293.15)).
 * Clamped to a tenth of the cold value so a wild alpha or a cryogenic input
 * can never produce zero or negative resistance.
 */
export function resistivityAt(material: Material, temp: number): number {
  const factor = 1 + material.alpha * (temp - RHO_REF_TEMP)
  return material.rho20 * Math.max(factor, 0.1)
}

/** R = rho(T)*L/A. */
export function resistance(
  material: Material,
  diameter: number,
  length: number,
  temp: number = RHO_REF_TEMP,
): number {
  const a = crossSection(diameter)
  return a > 0 ? (resistivityAt(material, temp) * length) / a : Infinity
}

/** Invert R = rho*L/A for the length of wire that gives a wanted resistance. */
export function lengthForResistance(
  material: Material,
  diameter: number,
  target: number,
  temp: number = RHO_REF_TEMP,
): number {
  const rho = resistivityAt(material, temp)
  return rho > 0 ? (target * crossSection(diameter)) / rho : 0
}

/** Thermal conductance to ambient, h*As, in W/K. */
export function thermalConductance(h: number, diameter: number, length: number): number {
  return h * surfaceArea(diameter, length)
}

/**
 * Thermal time constant, tau = m*c/(h*As).
 * The length cancels (m and As are both proportional to L), leaving
 * tau = density*c*d/(4h): a thick wire is slow, a thin one is quick, and a
 * long element heats no slower than a short one of the same gauge.
 */
export function thermalTimeConstant(material: Material, diameter: number, h: number): number {
  return h > 0 ? (material.density * material.specificHeat * diameter) / (4 * h) : Infinity
}

/**
 * Steady-state temperature with the resistance change included.
 *
 * Balance is h*As*(T - Tamb) = V^2/R(T). Substituting the linear R(T) and
 * writing u = T - 293.15 gives the quadratic
 *   alpha*u^2 + (1 + alpha*b)*u + (b - V^2/(k*R20)) = 0,  b = 293.15 - Tamb.
 * Solved in the numerically stable form root = C/q, which also degrades
 * exactly to the textbook T = Tamb + P/(h*As) when alpha is zero.
 */
export function steadyTemp(
  material: Material,
  diameter: number,
  length: number,
  supply: number,
  k: number,
  ambient: number,
): number {
  const r20 = resistance(material, diameter, length, RHO_REF_TEMP)
  if (!(k > 0) || !(r20 > 0) || !Number.isFinite(r20)) return Infinity
  const a = material.alpha
  const b = RHO_REF_TEMP - ambient
  const bq = 1 + a * b
  const c = b - (supply * supply) / (k * r20)
  const disc = bq * bq - 4 * a * c
  // A negative discriminant means the loss curve never catches the power
  // curve, i.e. thermal runaway. Only possible with a negative alpha.
  if (disc < 0) return Infinity
  const q = -(bq + Math.sign(bq || 1) * Math.sqrt(disc)) / 2
  const u = q !== 0 ? c / q : 0
  return RHO_REF_TEMP + u
}

/**
 * Textbook equilibrium, Teq = Tamb + P/(h*As), for a fixed power.
 * Exact when alpha is zero, and within a percent for NiCr or FeCrAl.
 */
export function equilibriumTemp(p: number, k: number, ambient: number): number {
  return k > 0 ? ambient + p / k : Infinity
}

/**
 * Time to cross a target on the way to equilibrium:
 * t = -tau*ln((Teq - Ttarget)/(Teq - T0)), the inverted first-order response.
 * Infinite once the target sits at or above the equilibrium, since the
 * exponential only ever approaches it.
 */
export function timeToTemp(
  target: number,
  start: number,
  equilibrium: number,
  tau: number,
): number {
  if (target <= start) return 0
  if (!(tau > 0) || !Number.isFinite(equilibrium) || target >= equilibrium) return Infinity
  return -tau * Math.log((equilibrium - target) / (equilibrium - start))
}

/**
 * Steady current that lands the wire exactly on its maximum service
 * temperature: P = h*As*(Tmax - Tamb) and I = sqrt(P/R(Tmax)). This is the
 * honest continuous rating for resistance wire, since it fails by oxidising
 * and melting rather than by any current figure on its own.
 */
export function currentLimit(
  material: Material,
  diameter: number,
  length: number,
  k: number,
  ambient: number,
): number {
  const p = k * (material.maxTemp - ambient)
  const r = resistance(material, diameter, length, material.maxTemp)
  if (!(p > 0) || !(r > 0) || !Number.isFinite(r)) return 0
  return Math.sqrt(p / r)
}

/**
 * Share of the surface loss that radiation would carry at this temperature,
 * comparing eps*sigma*(T^4 - Tamb^4) against the modelled h*(T - Tamb).
 * The model ignores radiation, so this is the size of the error, not a term
 * in the balance.
 */
export function radiationShare(
  material: Material,
  temp: number,
  ambient: number,
  h: number,
): number {
  if (!Number.isFinite(temp) || temp <= ambient) return 0
  const rad =
    material.emissivity *
    STEFAN_BOLTZMANN *
    (Math.pow(temp, 4) - Math.pow(ambient, 4))
  const conv = h * (temp - ambient)
  const total = rad + conv
  return total > 0 ? rad / total : 0
}

export type HeatingInput = {
  material: Material
  /** Wire diameter, metres. */
  diameter: number
  /** Wire length, metres. */
  length: number
  /** Volts across the wire. */
  supply: number
  /** Convective heat transfer coefficient, W/(m^2*K). */
  h: number
  /** Ambient temperature, K. */
  ambient: number
  /** Temperature the user wants a time for, K. */
  target: number
}

export type HeatSim = {
  /** Wire temperature, K. */
  temp: Float64Array
  /** Instantaneous dissipation, W. Sags as the wire heats and R rises. */
  power: Float64Array
}

/**
 * Heat-up transient from `start`.
 *
 * Each step freezes the power over one sample and applies the exact solution
 * of the linear balance, so the trace is stable and bounded at any dt. The
 * resistance feedback is negative for every real element alloy (hotter means
 * more resistance means less power), so the recurrence is a contraction and
 * cannot run away.
 */
export function simulate(
  input: HeatingInput,
  n: number,
  dt: number,
  start = input.ambient,
): HeatSim {
  const { material, diameter, length, supply, h, ambient } = input
  const temp = new Float64Array(n)
  const power = new Float64Array(n)
  if (n === 0) return { temp, power }

  const k = thermalConductance(h, diameter, length)
  const tau = thermalTimeConstant(material, diameter, h)
  // No loss path means no equilibrium, so there is nothing physical to draw.
  // The page clamps h and the geometry well away from this.
  if (!(k > 0) || !(tau > 0) || !Number.isFinite(tau)) {
    temp.fill(start)
    return { temp, power }
  }

  const a = crossSection(diameter)
  const decay = Math.exp(-dt / tau)
  let t = start
  for (let i = 0; i < n; i++) {
    temp[i] = t
    const r = (resistivityAt(material, t) * length) / a
    const p = r > 0 ? (supply * supply) / r : 0
    power[i] = p
    const eq = ambient + p / k
    t = eq + (t - eq) * decay
  }
  return { temp, power }
}

export type HeatingReadout = {
  /** Conductor cross-section, m^2. */
  area: number
  /** Convecting surface, m^2. */
  surface: number
  /** Wire mass, kg. */
  mass: number
  /** Resistance at 20 C and at the settled temperature, ohms. */
  rCold: number
  rHot: number
  /** Switch-on and settled current, amps. */
  currentCold: number
  currentHot: number
  /** Switch-on and settled dissipation, watts. */
  powerCold: number
  powerHot: number
  /** Thermal conductance to ambient, W/K. */
  k: number
  /** Settled temperature with the resistance shift included, K. */
  equilibrium: number
  /** Settled temperature from the fixed-power textbook form, K. */
  equilibriumSimple: number
  /** m*c/(h*As), seconds. */
  tau: number
  /** Time to reach the target temperature, seconds. */
  tTarget: number
  /** 5 tau, i.e. 99.3% of the way to equilibrium. */
  tSettle: number
  reachable: boolean
  /** Surface power density, W/m^2. Element makers size on this. */
  surfaceLoad: number
  /** Current density in the conductor, A/m^2. */
  currentDensity: number
  /** Steady current that puts the wire at its service limit, amps. */
  limitCurrent: number
  /** Heat needed to take the whole wire from ambient to target, joules. */
  energyToTarget: number
  /** Average-power fraction that holds the target, 0 to 1. Above 1 it cannot. */
  holdDuty: number
  /** Fraction of the loss radiation would carry at equilibrium, 0 to 1. */
  radiation: number
  overTemp: boolean
  overCurrent: boolean
  /** Radiation is being ignored but is no longer a small term. */
  radiationDominant: boolean
}

/** Radiation above this share of the loss makes the convection-only answer optimistic. */
export const RADIATION_WARN_SHARE = 0.3

/** Everything the resistive heating page reports, derived once per change. */
export function analyse(input: HeatingInput): HeatingReadout {
  const { material, diameter, length, supply, h, ambient, target } = input
  const area = crossSection(diameter)
  const surface = surfaceArea(diameter, length)
  const mass = wireMass(material, diameter, length)
  const k = thermalConductance(h, diameter, length)

  const rCold = resistance(material, diameter, length, RHO_REF_TEMP)
  const currentCold = rCold > 0 ? supply / rCold : 0
  const powerCold = supply * currentCold

  const equilibrium = steadyTemp(material, diameter, length, supply, k, ambient)
  const rHot = Number.isFinite(equilibrium)
    ? resistance(material, diameter, length, equilibrium)
    : rCold
  const currentHot = rHot > 0 ? supply / rHot : 0
  const powerHot = supply * currentHot

  const tau = thermalTimeConstant(material, diameter, h)
  const tTarget = timeToTemp(target, ambient, equilibrium, tau)
  const limitCurrent = currentLimit(material, diameter, length, k, ambient)
  // Holding a target below equilibrium is an average-power problem: the
  // thermal tau is seconds and a PWM period is milliseconds, so the wire only
  // sees the mean. Duty = required power / available power.
  const holdDuty = powerHot > 0 ? (k * (target - ambient)) / powerHot : Infinity
  const radiation = radiationShare(material, equilibrium, ambient, h)

  return {
    area,
    surface,
    mass,
    rCold,
    rHot,
    currentCold,
    currentHot,
    powerCold,
    powerHot,
    k,
    equilibrium,
    equilibriumSimple: equilibriumTemp(powerCold, k, ambient),
    tau,
    tTarget,
    tSettle: 5 * tau,
    reachable: Number.isFinite(tTarget),
    surfaceLoad: surface > 0 ? powerHot / surface : Infinity,
    currentDensity: area > 0 ? currentCold / area : Infinity,
    limitCurrent,
    energyToTarget: mass * material.specificHeat * Math.max(0, target - ambient),
    holdDuty,
    radiation,
    overTemp: equilibrium > material.maxTemp,
    overCurrent: limitCurrent > 0 && currentCold > limitCurrent,
    radiationDominant: radiation > RADIATION_WARN_SHARE,
  }
}

/** Default ambient, re-exported so the page does not reach into constants twice. */
export const DEFAULT_AMBIENT = T_AMBIENT_K
