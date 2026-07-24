/**
 * Buck (step down) converter in steady state.
 *
 * Duty comes from volt-second balance on the inductor, so the switch, rectifier
 * and winding drops are folded into the on-state and off-state inductor voltages
 * rather than bolted on afterwards. That keeps the current waveform exactly
 * periodic for any set of parasitics: the rise over the on time equals the fall
 * over the off time by construction.
 *
 * The scope trace is the closed-form piecewise-linear solution of di/dt = v/L,
 * evaluated per sample, so there is no integrator to go unstable when the user
 * drags the switching frequency across three decades.
 *
 * Reference: Erickson & Maksimovic, "Fundamentals of Power Electronics",
 * ch. 2 (CCM volt-second balance) and ch. 5 (DCM buck).
 */

/** Schottky forward drop, SS34 at about 1 A and 25 C (Vishay SS34 datasheet). */
export const SCHOTTKY_VF = 0.4

/**
 * High side turn-on and turn-off transition times, typical of the integrated
 * FET in a small monolithic buck such as the MP1584EN. Only used for the hard
 * switching loss estimate, which is a first-order figure, not a simulation.
 */
export const SWITCH_RISE_S = 10e-9
export const SWITCH_FALL_S = 10e-9

/** Controller quiescent supply current, typical for a small integrated buck. */
export const CONTROLLER_IQ = 100e-6

/** Low side device: a second FET (synchronous) or a Schottky catch diode. */
export type Rectifier = 'sync' | 'diode'

export type ConductionMode = 'ccm' | 'dcm'

/** Everything the topology needs, all in base SI units. */
export type BuckSpec = {
  vin: number
  vout: number
  /** Load current, i.e. the average inductor current. */
  iout: number
  l: number
  c: number
  /** Output capacitor equivalent series resistance. */
  esr: number
  fsw: number
  /** On resistance of the switching FET, used for both FETs when synchronous. */
  rdsOn: number
  /** Inductor DC winding resistance. */
  dcr: number
  rectifier: Rectifier
}

export type BuckOp = {
  mode: ConductionMode
  /** True when Vin cannot reach Vout, i.e. the required duty is 1 or more. */
  dropout: boolean
  /** On time as a fraction of the switching period. */
  duty: number
  /** Ideal Vout/Vin, kept for comparison with the loss-corrected duty. */
  dutyIdeal: number
  /** Fraction of the period the inductor carries current. 1 in CCM. */
  conduction: number
  /** Peak to peak inductor current. Equals the peak in DCM, where it starts at 0. */
  ripple: number
  peak: number
  valley: number
  /** RMS inductor current, which drives the copper losses. */
  irms: number
  /** Load current at the CCM/DCM boundary for this L and fsw. */
  boundary: number
  /** Inductor voltage while the high side switch is on. */
  von: number
  /** Inductor voltage magnitude while the rectifier conducts. */
  voff: number
}

export type BuckRipple = {
  /** Ripple from charging and discharging the capacitance. */
  cap: number
  /** Ripple from the ripple current across the ESR. */
  esr: number
  /** Worst-case sum. The two do not peak at the same instant, so this is an upper bound. */
  total: number
}

export type BuckLosses = {
  /** Winding resistance, Irms^2 * DCR. */
  inductor: number
  /** High side FET conduction. */
  switchCond: number
  /** Low side FET conduction, or diode forward loss. */
  rectifier: number
  /** Hard switching transition loss in the high side FET. */
  switching: number
  /** Ripple current heating the capacitor ESR. */
  capacitor: number
  /** Controller quiescent draw. */
  quiescent: number
  total: number
}

export type BuckReadout = {
  op: BuckOp
  ripple: BuckRipple
  loss: BuckLosses
  pout: number
  pin: number
  /** Average input current, from power balance rather than Iout*D. */
  iin: number
  /** 0 to 1. */
  efficiency: number
}

/** Ideal conversion ratio, D = Vout / Vin. */
export function dutyIdeal(vin: number, vout: number): number {
  return vin > 0 ? vout / vin : Infinity
}

/**
 * Inductor voltages including parasitic drops, evaluated at the average current.
 *
 * On:  vL = Vin - Iout*(Rds + DCR) - Vout
 * Off: vL = -(Vout + Iout*DCR + Vf)          with a catch diode
 *      vL = -(Vout + Iout*(Rds + DCR))       with a synchronous FET
 */
export function inductorVolts(spec: BuckSpec): { von: number; voff: number } {
  const { vin, vout, iout, rdsOn, dcr, rectifier } = spec
  const von = vin - iout * (rdsOn + dcr) - vout
  const voff =
    rectifier === 'diode' ? vout + iout * dcr + SCHOTTKY_VF : vout + iout * (rdsOn + dcr)
  return { von, voff }
}

/**
 * CCM duty from volt-second balance, von*D = voff*(1-D), so D = voff/(von+voff).
 * With no parasitics this collapses to the textbook D = Vout/Vin.
 */
export function dutyCCM(von: number, voff: number): number {
  const sum = von + voff
  return sum > 0 ? voff / sum : 1
}

/**
 * Peak to peak inductor ripple over the off time, dIL = Voff*(1-D)/(fsw*L).
 * Voff is Vout in the lossless case, so this is the usual Vout*(1-D)/(fsw*L).
 */
export function rippleCurrent(voff: number, d: number, fsw: number, l: number): number {
  return fsw > 0 && l > 0 ? (voff * (1 - d)) / (fsw * l) : Infinity
}

/**
 * Load current at which the valley just reaches zero, Iboundary = dIL/2.
 * Below this the inductor current stops each cycle and the converter is in DCM.
 */
export function boundaryCurrent(ripple: number): number {
  return ripple / 2
}

/**
 * DCM on time fraction. Charge balance on a triangular pulse that starts and
 * ends at zero gives Iout = (1/2)*Ipk*(D1+D2) with Ipk = Von*D1/(L*fsw) and
 * D2 = D1*Von/Voff, hence
 *   D1 = sqrt(2*L*fsw*Iout*Voff / (Von*(Von+Voff)))
 * which is the familiar sqrt(2*L*fsw*Iout*Vout/(Vin*(Vin-Vout))) when lossless.
 */
export function dutyDCM(
  von: number,
  voff: number,
  iout: number,
  l: number,
  fsw: number,
): number {
  const denom = von * (von + voff)
  if (denom <= 0) return 0
  return Math.sqrt((2 * l * fsw * iout * voff) / denom)
}

/** Solve the steady-state operating point, picking CCM or DCM automatically. */
export function operatingPoint(spec: BuckSpec): BuckOp {
  const { vin, vout, iout, l, fsw } = spec
  const { von, voff } = inductorVolts(spec)
  const ideal = dutyIdeal(vin, vout)

  // Von <= 0 means the input rail cannot push current into the inductor even at
  // 100% duty. The switch stays on and Vout simply follows Vin minus the drops.
  if (von <= 0 || voff <= 0 || l <= 0 || fsw <= 0) {
    return {
      mode: 'ccm',
      dropout: true,
      duty: 1,
      dutyIdeal: ideal,
      conduction: 1,
      ripple: 0,
      peak: iout,
      valley: iout,
      irms: iout,
      boundary: 0,
      von: Math.max(von, 0),
      voff,
    }
  }

  const d = dutyCCM(von, voff)
  const ripple = rippleCurrent(voff, d, fsw, l)
  const boundary = boundaryCurrent(ripple)

  if (iout >= boundary) {
    // Continuous conduction: a triangle riding on the DC load current.
    // RMS of DC plus a triangle: Irms^2 = Iout^2 + dIL^2/12.
    return {
      mode: 'ccm',
      dropout: false,
      duty: d,
      dutyIdeal: ideal,
      conduction: 1,
      ripple,
      peak: iout + ripple / 2,
      valley: iout - ripple / 2,
      irms: Math.sqrt(iout * iout + (ripple * ripple) / 12),
      boundary,
      von,
      voff,
    }
  }

  // Discontinuous conduction: the current hits zero before the period ends and
  // the duty collapses well below Vout/Vin to keep the output regulated.
  const d1 = dutyDCM(von, voff, iout, l, fsw)
  const peak = (von * d1) / (l * fsw)
  const d2 = (d1 * von) / voff
  const conduction = Math.min(d1 + d2, 1)
  // RMS of a triangular pulse of height Ipk occupying a fraction k: Ipk^2*k/3.
  return {
    mode: 'dcm',
    dropout: false,
    duty: d1,
    dutyIdeal: ideal,
    conduction,
    ripple: peak,
    peak,
    valley: 0,
    irms: Math.sqrt((peak * peak * conduction) / 3),
    boundary,
    von,
    voff,
  }
}

/** Inductor current at phase p (0 to 1) through the switching period. */
export function currentAtPhase(op: BuckOp, p: number): number {
  if (op.mode === 'ccm') {
    if (op.duty <= 0) return op.valley
    if (op.duty >= 1) return op.peak
    const swing = op.peak - op.valley
    return p < op.duty
      ? op.valley + swing * (p / op.duty)
      : op.peak - swing * ((p - op.duty) / (1 - op.duty))
  }
  const d2 = op.conduction - op.duty
  if (p < op.duty) return op.duty > 0 ? op.peak * (p / op.duty) : 0
  if (p < op.conduction) return d2 > 0 ? op.peak * (1 - (p - op.duty) / d2) : 0
  return 0
}

/**
 * Sample the inductor current over `periods` switching cycles.
 * Closed form, so dt can be anything without the trace drifting or blowing up.
 */
export function inductorWaveform(
  spec: BuckSpec,
  op: BuckOp,
  n: number,
  periods: number,
): { dt: number; samples: Float64Array } {
  const period = spec.fsw > 0 ? 1 / spec.fsw : 1
  const dt = (periods * period) / n
  const samples = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const p = ((i * dt) / period) % 1
    samples[i] = currentAtPhase(op, p)
  }
  return { dt, samples }
}

/**
 * Output ripple voltage.
 *
 * CCM: the capacitor absorbs the triangular AC part of the inductor current.
 * The charge in one half period is dQ = (1/2)*(dIL/2)*(T/2), so
 *   dVout = dIL / (8*fsw*C)
 * DCM: the pulse is above Iout only over a similar triangle of height
 * (Ipk - Iout), giving dQ = (1/2)*(Ipk-Iout)^2*(D1+D2)/(Ipk*fsw).
 *
 * ESR adds dV = dIL*ESR. On a ceramic output that term is small, on an
 * electrolytic it usually dominates. ESL is ignored.
 */
export function outputRipple(spec: BuckSpec, op: BuckOp): BuckRipple {
  const { c, esr, fsw, iout } = spec
  if (c <= 0 || fsw <= 0) return { cap: Infinity, esr: Infinity, total: Infinity }

  let cap: number
  if (op.mode === 'ccm') {
    cap = op.ripple / (8 * fsw * c)
  } else if (op.peak > 0) {
    const excess = Math.max(op.peak - iout, 0)
    cap = (0.5 * excess * excess * op.conduction) / (op.peak * fsw * c)
  } else {
    cap = 0
  }

  const esrRipple = op.ripple * esr
  return { cap, esr: esrRipple, total: cap + esrRipple }
}

/** First-order loss budget. Every term is a steady-state average over a period. */
export function losses(spec: BuckSpec, op: BuckOp): BuckLosses {
  const { vin, iout, rdsOn, dcr, esr, fsw, rectifier } = spec
  const i2 = op.irms * op.irms

  // Split the RMS between the two devices by how long each conducts.
  let i2hs: number
  let i2ls: number
  let idiodeAvg: number
  if (op.mode === 'ccm') {
    i2hs = i2 * op.duty
    i2ls = i2 * (1 - op.duty)
    idiodeAvg = iout * (1 - op.duty)
  } else {
    const d2 = Math.max(op.conduction - op.duty, 0)
    i2hs = (op.peak * op.peak * op.duty) / 3
    i2ls = (op.peak * op.peak * d2) / 3
    idiodeAvg = 0.5 * op.peak * d2
  }

  const inductor = i2 * dcr
  const switchCond = i2hs * rdsOn
  const rectifierLoss = rectifier === 'diode' ? SCHOTTKY_VF * idiodeAvg : i2ls * rdsOn

  // Hard switching: the FET carries current while the switch node slews.
  // P = 0.5*Vin*I*(tr+tf)*fsw. DCM turns on at zero current, so only the
  // turn-off edge costs anything, and it costs it at the peak current.
  const switched = op.mode === 'ccm' ? iout : op.peak
  const transition = op.mode === 'ccm' ? SWITCH_RISE_S + SWITCH_FALL_S : SWITCH_FALL_S
  const switching = 0.5 * vin * switched * transition * fsw

  // The capacitor carries the AC part of the inductor current: Irms^2 - Iout^2.
  const capacitor = Math.max(i2 - iout * iout, 0) * esr
  const quiescent = vin * CONTROLLER_IQ

  const total = inductor + switchCond + rectifierLoss + switching + capacitor + quiescent
  return {
    inductor,
    switchCond,
    rectifier: rectifierLoss,
    switching,
    capacitor,
    quiescent,
    total,
  }
}

/** Everything the buck page reports, derived once per parameter change. */
export function analyse(spec: BuckSpec): BuckReadout {
  const op = operatingPoint(spec)
  const ripple = outputRipple(spec, op)
  const loss = losses(spec, op)
  const pout = spec.vout * spec.iout
  const pin = pout + loss.total
  return {
    op,
    ripple,
    loss,
    pout,
    pin,
    iin: spec.vin > 0 ? pin / spec.vin : 0,
    efficiency: pin > 0 ? pout / pin : 0,
  }
}
