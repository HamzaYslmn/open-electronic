/**
 * Sinusoidal steady state AC power: the power triangle, and the shunt bank that
 * corrects the power factor.
 *
 * Mains voltages, not VCC. Power factor only becomes a problem on a distribution
 * feed, where the utility meters kWh but has to build the network for kVA, so the
 * defaults here are a 230 V / 50 Hz single phase supply.
 *
 * Everything is closed form. The waveforms are evaluated point by point from the
 * phasor solution rather than integrated, so there is no state, no recursion and
 * no stability condition: any dt is safe.
 *
 * Pure numbers in, pure numbers out. Nothing here imports React or any UI.
 */

import { clamp } from './units'

/** Positive phi means the current lags the voltage, i.e. an inductive load. */
export type LoadKind = 'lagging' | 'leading'

/**
 * IEC 61140 extra-low-voltage limit for AC RMS. Above this the page is modelling
 * a mains circuit and the safety notes apply.
 */
export const SELV_LIMIT_V = 50

/**
 * Power factor below which most commercial tariffs start charging for reactive
 * demand. 0.9 is the common threshold, some utilities use 0.95.
 */
export const PF_PENALTY_LIMIT = 0.9

/**
 * IEC 60831-1 permits a low voltage PFC capacitor to run at 1.10 x Un for 8 h in
 * every 24 h, so the bank is sized at least 1.1x the nominal line voltage.
 */
export const CAP_OVERVOLTAGE_FACTOR = 1.1

/**
 * Floor on the power factor input. At PF = 0 the load draws pure reactive power
 * and S = P / PF is infinite, which is not a circuit anyone builds.
 */
const PF_FLOOR = 0.01

/** Signed phase angle in radians, phi = +/- acos(PF). Lagging is positive. */
export function phaseFromPf(pf: number, kind: LoadKind): number {
  const phi = Math.acos(clamp(pf, PF_FLOOR, 1))
  return kind === 'leading' ? -phi : phi
}

/** Apparent power, S = Vrms * Irms, in VA. */
export function apparentPower(vrms: number, irms: number): number {
  return vrms * irms
}

/** Real power, P = S * cos(phi), in W. This is the part that does work. */
export function realPower(s: number, phi: number): number {
  return s * Math.cos(phi)
}

/**
 * Reactive power, Q = S * sin(phi), in var. Positive is inductive, i.e. absorbed
 * by the load. It nets to zero over a cycle but still has to flow in the copper.
 */
export function reactivePower(s: number, phi: number): number {
  return s * Math.sin(phi)
}

/**
 * Reactive power the correction bank must supply to move a load of P watts from
 * phi1 to phi2, Qc = P * (tan(phi1) - tan(phi2)).
 * Positive means a capacitor, negative means an inductor.
 */
export function correctionVar(p: number, phi1: number, phi2: number): number {
  return p * (Math.tan(phi1) - Math.tan(phi2))
}

/** Shunt capacitance for Qc var on an Vrms line, C = Qc / (2*pi*f*Vrms^2). */
export function correctionCapacitance(qc: number, f: number, vrms: number): number {
  const denom = 2 * Math.PI * f * vrms * vrms
  return denom > 0 ? qc / denom : 0
}

/**
 * Shunt inductance that absorbs |Qc| var, from Q = V^2 / Xl with Xl = 2*pi*f*L,
 * i.e. L = Vrms^2 / (2*pi*f*|Qc|). Used when the load is already leading.
 */
export function correctionInductance(qc: number, f: number, vrms: number): number {
  const denom = 2 * Math.PI * f * Math.abs(qc)
  return denom > 0 ? (vrms * vrms) / denom : Infinity
}

export type Waveforms = {
  /** Seconds per sample. */
  dt: number
  /** Line voltage, V. */
  v: Float64Array
  /** Current drawn by the load, A. */
  iLoad: Float64Array
  /** Current in the supply cable after the correction bank is fitted, A. */
  iLine: Float64Array
  /** Instantaneous power at the load, W. Negative where energy flows back. */
  p: Float64Array
}

/**
 * One window of the steady state solution:
 *   v(t)  = sqrt(2)*Vrms * sin(w*t)
 *   i(t)  = sqrt(2)*Irms * sin(w*t - phi)     phi > 0, the current lags
 *   iq(t) = sqrt(2)*Iq   * cos(w*t)           the bank leads v by 90 degrees
 *   p(t)  = v(t) * i(t)
 * `iq` is signed: positive is a capacitor, negative an inductor, so one term
 * covers both. The line current is the point by point sum, which is the phasor
 * addition done in the time domain.
 */
export function waveforms(
  vrms: number,
  frequency: number,
  irms: number,
  phi: number,
  iq: number,
  n: number,
  cycles: number,
): Waveforms {
  const f = frequency > 0 ? frequency : 1
  const dt = cycles / f / n
  const w = 2 * Math.PI * f
  const vPeak = Math.SQRT2 * vrms
  const iPeak = Math.SQRT2 * irms
  const qPeak = Math.SQRT2 * iq

  const v = new Float64Array(n)
  const iLoad = new Float64Array(n)
  const iLine = new Float64Array(n)
  const p = new Float64Array(n)

  for (let k = 0; k < n; k++) {
    const a = w * k * dt
    const vk = vPeak * Math.sin(a)
    const ik = iPeak * Math.sin(a - phi)
    v[k] = vk
    iLoad[k] = ik
    iLine[k] = ik + qPeak * Math.cos(a)
    p[k] = vk * ik
  }

  return { dt, v, iLoad, iLine, p }
}

/**
 * 1-2-5 rounded multiplier that lifts `value` to about `reference`, so a current
 * or power trace can share the volts axis of the scope without vanishing. Pure
 * display maths, kept here so the page stays about wiring.
 */
export function traceScale(reference: number, value: number): number {
  if (!(value > 0) || !(reference > 0) || !Number.isFinite(reference)) return 1
  const raw = reference / value
  const exp = Math.floor(Math.log10(raw))
  const base = Math.pow(10, exp)
  const m = raw / base
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * base
}

export type ReactivePowerInput = {
  /** Line voltage, RMS volts. */
  vrms: number
  /** Line frequency, Hz. */
  frequency: number
  /** Real power drawn by the load, W. */
  p: number
  /** Present power factor, magnitude 0..1. */
  pf: number
  /** Power factor to correct to, magnitude 0..1. */
  pfTarget: number
  kind: LoadKind
  /** Loop resistance of the supply cable, ohms, for the I^2*R comparison. */
  rLine: number
}

export type ReactivePowerReadout = {
  /** Signed load angle, radians and degrees. */
  phi: number
  phiDeg: number
  phiTarget: number
  phiTargetDeg: number
  /** Apparent power now, VA. */
  s: number
  /** Reactive power now, var. */
  q: number
  /** Line current now, A. */
  irms: number

  /** var the bank must supply. Positive is capacitive. */
  qc: number
  /** Signed RMS current in the bank, A. Positive leads the voltage. */
  iq: number
  /** Reactance of the bank at the line frequency, ohms. */
  xq: number
  /** Shunt capacitance in farads, 0 when an inductor is needed instead. */
  capacitance: number
  /** Shunt inductance in henries, 0 when a capacitor is needed instead. */
  inductance: number
  needsInductor: boolean
  /** True when the target PF is below the present PF, so nothing is worth doing. */
  targetTooLow: boolean

  /** Apparent, reactive and current figures after correction. */
  sAfter: number
  qAfter: number
  irmsAfter: number
  /** Fraction the line current drops by, 0..1. */
  currentReduction: number

  /** I^2*R in the supply cable, W. */
  lossBefore: number
  lossAfter: number
  lossSaved: number

  /** Extremes of p(t) = P +/- S, W. pReverse is the magnitude of the negative dip. */
  pPeak: number
  pReverse: number

  vPeak: number
  /** Minimum RMS voltage rating for the bank, V. */
  capVoltageRating: number
  /** Reactive energy over 24 h, var-hours, before and after. */
  qEnergyDay: number
  qEnergyDayAfter: number
  /** True when the supply is above the extra-low-voltage limit. */
  isMains: boolean
  penalised: boolean
}

/** Everything the page reports, derived once per parameter change. */
export function analyse(inp: ReactivePowerInput): ReactivePowerReadout {
  const { vrms, frequency: f, p, kind, rLine } = inp
  const pf = clamp(inp.pf, PF_FLOOR, 1)
  const pfTarget = clamp(inp.pfTarget, PF_FLOOR, 1)

  const phi = phaseFromPf(pf, kind)
  const phiTarget = phaseFromPf(pfTarget, kind)

  // S = P / cos(phi), then I = S / V. Same triangle, read backwards.
  const s = p / pf
  const irms = vrms > 0 ? s / vrms : 0
  const q = reactivePower(s, phi)

  const qc = correctionVar(p, phi, phiTarget)
  const iq = vrms > 0 ? qc / vrms : 0
  const xq = Math.abs(iq) > 0 ? vrms / Math.abs(iq) : Infinity
  const needsInductor = qc < 0

  const sAfter = p / pfTarget
  const qAfter = reactivePower(sAfter, phiTarget)
  const irmsAfter = vrms > 0 ? sAfter / vrms : 0

  const lossBefore = irms * irms * rLine
  const lossAfter = irmsAfter * irmsAfter * rLine

  return {
    phi,
    phiDeg: (phi * 180) / Math.PI,
    phiTarget,
    phiTargetDeg: (phiTarget * 180) / Math.PI,
    s,
    q,
    irms,

    qc,
    iq,
    xq,
    capacitance: qc > 0 ? correctionCapacitance(qc, f, vrms) : 0,
    inductance: qc < 0 ? correctionInductance(qc, f, vrms) : 0,
    needsInductor,
    targetTooLow: pfTarget < pf,

    sAfter,
    qAfter,
    irmsAfter,
    currentReduction: irms > 0 ? 1 - irmsAfter / irms : 0,

    lossBefore,
    lossAfter,
    lossSaved: lossBefore - lossAfter,

    // p(t) = P - S*cos(2*w*t - phi), so it swings S either side of P.
    pPeak: p + s,
    pReverse: Math.max(0, s - p),

    vPeak: Math.SQRT2 * vrms,
    capVoltageRating: CAP_OVERVOLTAGE_FACTOR * vrms,
    qEnergyDay: Math.abs(q) * 24,
    qEnergyDayAfter: Math.abs(qAfter) * 24,
    isMains: vrms >= SELV_LIMIT_V,
    penalised: pf < PF_PENALTY_LIMIT,
  }
}
