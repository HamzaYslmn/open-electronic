/**
 * Single-diode (five-parameter) photovoltaic model.
 *
 *   I = Iph - I0*(exp((V + I*Rs)/a) - 1) - (V + I*Rs)/Rsh
 *
 * where a = Ns*n*k*T/q is the modified thermal voltage of a string of Ns cells
 * in series. The five parameters (Iph, I0, a, Rs, Rsh) are extracted from three
 * datasheet numbers, Isc and Voc at STC plus the ideality factor, and the two
 * parasitic resistances. That is the standard STC extraction used by De Soto,
 * Klein and Beckman (2006) and Villalva, Gazoli and Filho (2009).
 *
 * The equation is implicit in I, so every point is solved numerically. The
 * residual is strictly decreasing in I, so the root is unique and a bisection
 * converges from any bracket. That matters here: users drag Rs, Rsh and the
 * ideality factor into corners where a Newton iteration seeded badly would run
 * off to a non-physical branch. A closed form exists via the Lambert W
 * function, but its argument overflows double precision for ordinary panel
 * values and would need its own log-space rewrite to be safe, so bisection is
 * both simpler and more robust.
 *
 * All values are base SI: volts, amps, ohms, watts, kelvin, metres, W/m^2.
 */

import { T_AMBIENT_K } from './constants'

/** Boltzmann constant, J/K (SI defining constant). */
export const K_B = 1.380649e-23

/** Elementary charge, C (SI defining constant). */
export const Q_E = 1.602176634e-19

/** Standard test conditions irradiance, AM1.5G. */
export const G_STC = 1000

/** STC cell temperature, 25 C. Identical to the house ambient constant. */
export const T_STC_K = T_AMBIENT_K

/**
 * Crystalline silicon bandgap at 25 C, in eV.
 *
 * Bandgap narrowing with temperature (about -0.27 mV/K, De Soto's
 * Eg/Eg_ref = 1 - 0.0002677*dT) is deliberately left out. Including it steepens
 * dVoc/dT by roughly 0.05 %/K and pushes the model outside the -0.30 to
 * -0.35 %/K band that c-Si datasheets actually quote.
 */
export const EG_SI_EV = 1.121

/**
 * Isc temperature coefficient for c-Si, as a fraction of Isc per kelvin.
 * Datasheets quote +0.04 to +0.06 %/K, so 0.05 %/K is the middle of the range.
 */
export const ALPHA_ISC_PER_K = 5e-4

/**
 * IEC 61215 module qualification temperature range, K (-40 C to 85 C).
 * Outside it the linear Isc coefficient and the fixed bandgap stop holding.
 */
export const TEMP_MIN_K = 233.15
export const TEMP_MAX_K = 358.15

/**
 * Below this irradiance a real cell's shunt resistance climbs and the ideality
 * factor drifts with injection level, so a fixed-parameter model reads
 * optimistic. Flagged rather than corrected.
 */
export const LOW_LIGHT_W_M2 = 100

/** Fill factor below this means the parasitics, not the diode, set the output. */
export const POOR_FILL_FACTOR = 0.6

/** exp() argument cap. exp(700) is about 1e304, still a finite double. */
const EXP_CLAMP = 700

/** How close to the shunt ceiling Voc is allowed when Rsh cannot support it. */
const SHUNT_LIMIT_MARGIN = 0.999

export type PanelSpec = {
  /** Cells in series, Ns. One string is assumed. */
  cells: number
  /** Short circuit current at STC, A. */
  iscStc: number
  /** Open circuit voltage at STC, V. */
  vocStc: number
  /** Diode ideality factor per cell, n. 1.0 to 1.5 for c-Si. */
  ideality: number
  /** Lumped series resistance, ohms. */
  rs: number
  /** Lumped shunt resistance, ohms. */
  rsh: number
  /** Edge length of one square cell, m. Sets the aperture area. */
  cellEdge: number
}

export type Conditions = {
  /** Plane-of-array irradiance, W/m^2. */
  irradiance: number
  /** Cell temperature, K. Not ambient: a cell in sun runs well above it. */
  cellTempK: number
}

/** The five model parameters evaluated at one operating condition. */
export type ModelParams = {
  /** Photocurrent, A. */
  iph: number
  /** Diode saturation current, A. */
  i0: number
  /** Modified thermal voltage of the whole string, V. */
  a: number
  rs: number
  rsh: number
}

/** Modified thermal voltage of a series string: a = Ns*n*k*T/q. */
export function thermalVoltage(cells: number, ideality: number, tempK: number): number {
  return (cells * ideality * K_B * tempK) / Q_E
}

/** Aperture area of one series string of square cells, m^2. */
export function moduleArea(spec: PanelSpec): number {
  return spec.cells * spec.cellEdge * spec.cellEdge
}

/**
 * Photocurrent at STC, backed out of Isc.
 *
 * At V = 0 the diode term is negligible, so Isc = Iph - Isc*Rs/Rsh and
 * Iph = Isc*(Rs + Rsh)/Rsh. Standard STC extraction, De Soto (2006).
 */
export function photocurrentStc(spec: PanelSpec): number {
  return spec.rsh > 0 ? (spec.iscStc * (spec.rs + spec.rsh)) / spec.rsh : spec.iscStc
}

/**
 * True when Rsh is too small to sustain the stated Voc: the shunt drains the
 * whole photocurrent before the terminals ever reach Voc, so the open circuit
 * voltage collapses to roughly Iph*Rsh. The extraction below caps Voc at that
 * ceiling so the model stays physical instead of producing a negative I0.
 */
export function isShuntLimited(spec: PanelSpec): boolean {
  return photocurrentStc(spec) * spec.rsh <= spec.vocStc
}

/**
 * Diode saturation current at STC, from the open circuit condition I = 0 at
 * V = Voc (where the series resistance drops nothing, because no current
 * flows):
 *
 *   0 = Iph - I0*(exp(Voc/a) - 1) - Voc/Rsh
 *   I0 = (Iph - Voc/Rsh) / (exp(Voc/a) - 1)
 */
export function saturationCurrentStc(spec: PanelSpec): number {
  const iph = photocurrentStc(spec)
  const a = thermalVoltage(spec.cells, spec.ideality, T_STC_K)
  const ceiling = SHUNT_LIMIT_MARGIN * iph * spec.rsh
  const voc = Math.min(spec.vocStc, ceiling)
  const denom = Math.exp(Math.min(voc / a, EXP_CLAMP)) - 1
  if (!(denom > 0)) return 0
  return Math.max(0, iph - voc / spec.rsh) / denom
}

/**
 * Model parameters at an arbitrary irradiance and cell temperature.
 *
 * Photocurrent is linear in irradiance with a small positive temperature term:
 *   Iph = (G/G_stc) * Iph_stc * (1 + alpha*(T - T_stc))
 *
 * Saturation current follows the Shockley temperature law I0 proportional to
 * T^3 * exp(-Eg/(n*k*T)), written as a ratio against the STC value:
 *   I0(T) = I0_stc * (T/T_stc)^3 * exp( (q*Eg/(n*k)) * (1/T_stc - 1/T) )
 *
 * That exponential is what makes Voc fall: dVoc/dT works out to
 * (Voc_cell - Eg/q - 3*n*k*T/q)/T per cell, i.e. about -2 mV/K, which is the
 * -0.3 %/K quoted on every c-Si datasheet.
 */
export function paramsAt(spec: PanelSpec, cond: Conditions): ModelParams {
  const t = cond.cellTempK
  const dT = t - T_STC_K

  const iph =
    (cond.irradiance / G_STC) * photocurrentStc(spec) * (1 + ALPHA_ISC_PER_K * dT)

  const i0Stc = saturationCurrentStc(spec)
  // Eg in eV times q gives joules; dividing by n*k gives kelvin.
  const egOverNk = (EG_SI_EV * Q_E) / (spec.ideality * K_B)
  const scale = Math.pow(t / T_STC_K, 3) * Math.exp(egOverNk * (1 / T_STC_K - 1 / t))
  const i0 = i0Stc * scale

  return { iph, i0, a: thermalVoltage(spec.cells, spec.ideality, t), rs: spec.rs, rsh: spec.rsh }
}

/** Diode branch current for a junction voltage vd, clamped against overflow. */
function diodeCurrent(p: ModelParams, vd: number): number {
  return p.i0 * (Math.exp(Math.min(vd / p.a, EXP_CLAMP)) - 1)
}

/** Residual of the single-diode equation. Strictly decreasing in i. */
function residual(p: ModelParams, v: number, i: number): number {
  const vd = v + i * p.rs
  return p.iph - diodeCurrent(p, vd) - vd / p.rsh - i
}

/**
 * Terminal current at a terminal voltage.
 *
 * d(residual)/dI = -I0*Rs/a*exp(...) - Rs/Rsh - 1 < 0 for every I, so the
 * residual crosses zero exactly once and bisection cannot pick a wrong root or
 * diverge.
 */
export function currentAt(p: ModelParams, v: number): number {
  const guess = Math.abs(p.iph) + Math.abs(v) / p.rsh + 1
  let lo = -guess
  let hi = guess
  for (let k = 0; k < 64 && residual(p, v, lo) < 0; k++) lo *= 2
  for (let k = 0; k < 64 && residual(p, v, hi) > 0; k++) hi *= 2

  for (let k = 0; k < 80; k++) {
    const mid = 0.5 * (lo + hi)
    if (residual(p, v, mid) > 0) lo = mid
    else hi = mid
    if (hi - lo < 1e-15 * (1 + Math.abs(hi))) break
  }
  return 0.5 * (lo + hi)
}

/**
 * Open circuit voltage: the V where I = 0. Rs drops nothing at zero current,
 * so this depends only on Iph, I0, a and Rsh. The residual is again strictly
 * decreasing in V, and a*ln(Iph/I0 + 1) is the Rsh -> infinity answer, hence a
 * valid upper bracket because the shunt only ever steals current.
 */
export function openCircuitVoltage(p: ModelParams): number {
  if (!(p.iph > 0) || !(p.i0 > 0)) return 0
  const g = (v: number) => p.iph - diodeCurrent(p, v) - v / p.rsh
  let lo = 0
  let hi = p.a * Math.log(p.iph / p.i0 + 1)
  if (!(hi > 0) || !Number.isFinite(hi)) return 0

  for (let k = 0; k < 80; k++) {
    const mid = 0.5 * (lo + hi)
    if (g(mid) > 0) lo = mid
    else hi = mid
    if (hi - lo < 1e-12 * (1 + hi)) break
  }
  return 0.5 * (lo + hi)
}

export type MppResult = { vmp: number; imp: number; pmp: number }

/**
 * Maximum power point. P(V) = V*I(V) is unimodal on [0, Voc], so a coarse scan
 * brackets the peak and golden section refines it without needing dP/dV, which
 * is itself implicit.
 */
export function maxPowerPoint(p: ModelParams, voc: number): MppResult {
  if (!(voc > 0)) return { vmp: 0, imp: 0, pmp: 0 }
  const power = (v: number) => v * currentAt(p, v)

  const steps = 64
  let bestK = 0
  let bestP = -Infinity
  for (let k = 0; k <= steps; k++) {
    const pw = power((k / steps) * voc)
    if (pw > bestP) {
      bestP = pw
      bestK = k
    }
  }

  let lo = (Math.max(0, bestK - 1) / steps) * voc
  let hi = (Math.min(steps, bestK + 1) / steps) * voc
  const r = (Math.sqrt(5) - 1) / 2
  let c = hi - r * (hi - lo)
  let d = lo + r * (hi - lo)
  let fc = power(c)
  let fd = power(d)
  for (let k = 0; k < 60 && hi - lo > 1e-10 * voc; k++) {
    if (fc < fd) {
      lo = c
      c = d
      fc = fd
      d = lo + r * (hi - lo)
      fd = power(d)
    } else {
      hi = d
      d = c
      fd = fc
      c = hi - r * (hi - lo)
      fc = power(c)
    }
  }

  const vmp = 0.5 * (lo + hi)
  const imp = currentAt(p, vmp)
  return { vmp, imp, pmp: vmp * imp }
}

export type OperatingPoint = {
  params: ModelParams
  isc: number
  voc: number
  vmp: number
  imp: number
  pmp: number
  /** Fill factor, Pmp / (Voc*Isc). 0.7 to 0.82 for a healthy c-Si panel. */
  ff: number
}

/** Solve the whole curve summary at one irradiance and cell temperature. */
export function operatingPoint(spec: PanelSpec, cond: Conditions): OperatingPoint {
  const params = paramsAt(spec, cond)
  const voc = openCircuitVoltage(params)
  const isc = currentAt(params, 0)
  const { vmp, imp, pmp } = maxPowerPoint(params, voc)
  const ideal = voc * isc
  return { params, isc, voc, vmp, imp, pmp, ff: ideal > 0 ? pmp / ideal : 0 }
}

export type IVCurve = {
  /** Volts per sample, i.e. the horizontal step of the plot. */
  dv: number
  volts: Float64Array
  amps: Float64Array
  watts: Float64Array
}

/** Sample the I-V and P-V curves from 0 V to Voc. */
export function ivCurve(p: ModelParams, voc: number, n: number): IVCurve {
  const span = voc > 0 ? voc : 1
  const dv = span / (n - 1)
  const volts = new Float64Array(n)
  const amps = new Float64Array(n)
  const watts = new Float64Array(n)
  for (let k = 0; k < n; k++) {
    const v = k * dv
    const i = currentAt(p, v)
    volts[k] = v
    amps[k] = i
    watts[k] = v * i
  }
  return { dv, volts, amps, watts }
}

export type PVReadout = {
  /** Operating point at the requested irradiance and cell temperature. */
  now: OperatingPoint
  /** The same panel at 1000 W/m^2 and 25 C, for comparison. */
  stc: OperatingPoint
  /** Aperture area, m^2. */
  area: number
  /** Pmp / (G * area), the module conversion efficiency. */
  efficiency: number
  /** dVoc/dT in V/K, and as a fraction of Voc per kelvin. */
  betaVoc: number
  betaVocFrac: number
  /** dPmp/dT in W/K, and as a fraction of Pmp per kelvin. */
  gammaPmp: number
  gammaPmpFrac: number
  /** Imp^2*Rs burnt in the series resistance at the maximum power point, W. */
  seriesLoss: number
  /** Junction voltage squared over Rsh leaked at the maximum power point, W. */
  shuntLoss: number
  /** Rsh cannot support the stated Voc, so Voc collapses toward Iph*Rsh. */
  shuntLimited: boolean
  lowLight: boolean
  poorFill: boolean
  tempOutOfRange: boolean
}

/** Everything the photovoltaic page reports, derived once per change. */
export function analyse(spec: PanelSpec, cond: Conditions): PVReadout {
  const now = operatingPoint(spec, cond)
  const stc = operatingPoint(spec, { irradiance: G_STC, cellTempK: T_STC_K })

  // Central difference over 1 K. Datasheet coefficients are quoted as straight
  // lines, so a local slope is the like-for-like comparison.
  const dT = 1
  const hot = operatingPoint(spec, { ...cond, cellTempK: cond.cellTempK + dT })
  const cold = operatingPoint(spec, { ...cond, cellTempK: cond.cellTempK - dT })
  const betaVoc = (hot.voc - cold.voc) / (2 * dT)
  const gammaPmp = (hot.pmp - cold.pmp) / (2 * dT)

  const area = moduleArea(spec)
  const vd = now.vmp + now.imp * spec.rs

  return {
    now,
    stc,
    area,
    efficiency: cond.irradiance * area > 0 ? now.pmp / (cond.irradiance * area) : 0,
    betaVoc,
    betaVocFrac: now.voc > 0 ? betaVoc / now.voc : 0,
    gammaPmp,
    gammaPmpFrac: now.pmp > 0 ? gammaPmp / now.pmp : 0,
    seriesLoss: now.imp * now.imp * spec.rs,
    shuntLoss: spec.rsh > 0 ? (vd * vd) / spec.rsh : 0,
    shuntLimited: isShuntLimited(spec),
    lowLight: cond.irradiance < LOW_LIGHT_W_M2,
    poorFill: now.ff < POOR_FILL_FACTOR,
    tempOutOfRange: cond.cellTempK < TEMP_MIN_K || cond.cellTempK > TEMP_MAX_K,
  }
}
