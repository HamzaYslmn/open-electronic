/**
 * LM2596 150 kHz step-down (buck) module.
 *
 * Models the ubiquitous red "LM2596S-ADJ" board: fixed 150 kHz oscillator,
 * internal bipolar NPN switch, external catch diode, inductor and output
 * capacitor, output set by a feedback divider. Every device number below comes
 * from the TI LM2596 datasheet (SNVS124) and is named rather than inlined.
 *
 * The input side is deliberately not VCC. An LM2596 is a buck: it can only step
 * down, its datasheet floor is 4.5 V, and the reason it appears on an ESP32
 * board at all is to turn a 12 V or 24 V supply into the 3.3 V rail. So the
 * input rail here is a real supply voltage, not the logic rail.
 *
 * The switching waveform is piecewise linear and solved in closed form from the
 * steady-state volt-second balance, not integrated, so there is no step size
 * that can make it drift or blow up.
 */

import { R_MAX, R_MIN, nearest } from './eseries'
import type { SeriesName } from './eseries'

/** Feedback reference, 1.23 V typ (1.193 to 1.267 V over the temperature range). */
export const VREF = 1.23

/** Internal oscillator, fixed at 150 kHz typ. Not adjustable on this part. */
export const FSW = 150e3

/** Datasheet operating input range for the standard (non-HV) part. */
export const VIN_MIN = 4.5
export const VIN_MAX = 40

/** Adjustable version output range. */
export const VOUT_MIN = 1.23
export const VOUT_MAX = 37

/** Rated continuous load current. */
export const IOUT_MAX = 3

/** Internal current limit, minimum guaranteed. Typ 4.5 A, max 6.9 A. */
export const ILIM_MIN = 3.6

/** Switch saturation voltage at the rated 3 A, typ. The max spec is 1.4 V. */
export const VSAT_RATED = 1.16

/**
 * Equivalent switch on-resistance. The datasheet gives one saturation point,
 * 1.16 V at 3 A, so the switch is modelled as a plain resistance
 * Rsw = 1.16 V / 3 A = 387 mOhm. A real bipolar switch is an offset plus a
 * resistance, so this underestimates the drop at light load, where the switch
 * loss is a rounding error next to the quiescent current anyway.
 */
export const RSW = VSAT_RATED / IOUT_MAX

/** Operating quiescent current, 5 mA typ (10 mA max). */
export const IQ = 5e-3

/** Recommended maximum operating junction temperature. */
export const TJ_MAX = 125

/** Output voltage set by the feedback divider: Vout = Vref·(1 + R2/R1). */
export function outputVoltage(r1: number, r2: number): number {
  return r1 > 0 ? VREF * (1 + r2 / r1) : VREF
}

/** The same relation solved for the top resistor: R2 = R1·(Vout/Vref - 1). */
export function feedbackR2(vout: number, r1: number): number {
  return r1 * (vout / VREF - 1)
}

/** Switch drop at a given load, from the RSW model above. */
export function saturationVoltage(iout: number): number {
  return RSW * iout
}

/**
 * Steady-state duty cycle from volt-second balance on the inductor.
 *
 * On:  vL = Vin - Vsat - Vout   for D·T
 * Off: vL = Vout + Vd           for (1-D)·T
 * Setting the areas equal gives D = (Vout + Vd) / (Vin - Vsat + Vd), which
 * collapses to the ideal D = Vout/Vin once the drops go to zero.
 */
export function dutyCycle(von: number, voff: number): number {
  const total = von + voff
  return total > 0 ? voff / total : 1
}

/**
 * Peak-to-peak inductor ripple, dIL = Voff·(1 - D) / (fsw·L).
 *
 * `voff` is the voltage across the inductor while the diode conducts. With an
 * ideal diode that is just Vout, giving the textbook dIL = Vout·(1-D)/(fsw·L);
 * with a real catch diode it is Vout + Vf, which is what this page passes.
 */
export function rippleCurrent(voff: number, duty: number, fsw: number, l: number): number {
  return fsw > 0 && l > 0 ? (voff * (1 - duty)) / (fsw * l) : 0
}

export type BuckOperation = {
  /** Switch on-time as a fraction of the period. */
  duty: number
  /** Ideal duty ignoring every drop, Vout/Vin. */
  dutyIdeal: number
  /** Diode conduction time as a fraction of the period. 1-duty in CCM. */
  diodeFraction: number
  /** Peak-to-peak inductor current, A. Equal to ipk in DCM. */
  ripple: number
  ipk: number
  ivalley: number
  /** False when the inductor current hits zero every cycle. */
  ccm: boolean
  /** True when the input cannot support the output, i.e. no on-time solves it. */
  dropout: boolean
  /** di/dt while the switch is on, A/s. */
  slopeOn: number
  /** Magnitude of di/dt while the diode conducts, A/s. */
  slopeOff: number
  /** RMS inductor current, A. */
  irmsL: number
  /** RMS switch current, A. */
  irmsSwitch: number
  /** Average diode current, A. */
  idiodeAvg: number
  /** Switch saturation drop at this load, V. */
  vsat: number
}

/**
 * Steady-state operating point, closed form.
 *
 * CCM is the ordinary case: the inductor current is a triangle riding on the DC
 * load current. Below half a ripple of load the valley would go negative, which
 * a catch diode cannot do, so the converter drops into DCM and the on-time
 * shrinks. Both branches are solved algebraically, no iteration and no solver.
 */
export function operate(
  vin: number,
  vout: number,
  iout: number,
  l: number,
  vd: number,
  dcr: number,
  fsw = FSW,
): BuckOperation {
  const vsat = saturationVoltage(iout)
  const dutyIdeal = vin > 0 ? vout / vin : 1
  // The DCR drop is in series with the inductor, so it comes off the on-state
  // volts and adds to the off-state volts.
  const von = vin - vsat - iout * dcr - vout
  const voff = vout + vd + iout * dcr

  if (!(von > 0) || !(voff > 0) || !(l > 0) || !(fsw > 0)) {
    // Dropout: the switch stays on and the part is a series pass element. Not a
    // regulator any more, so the page must say so rather than quote a duty.
    return {
      duty: 1,
      dutyIdeal,
      diodeFraction: 0,
      ripple: 0,
      ipk: iout,
      ivalley: iout,
      ccm: true,
      dropout: true,
      slopeOn: 0,
      slopeOff: 0,
      irmsL: iout,
      irmsSwitch: iout,
      idiodeAvg: 0,
      vsat,
    }
  }

  const duty = dutyCycle(von, voff)
  const ripple = rippleCurrent(voff, duty, fsw, l)
  const slopeOn = von / l
  const slopeOff = voff / l

  if (iout >= ripple / 2) {
    // CCM. Mean square of a linear ramp centred on Iout with peak-to-peak dIL
    // is Iout² + dIL²/12; weight it by the conduction fraction per device.
    const msL = iout * iout + (ripple * ripple) / 12
    return {
      duty,
      dutyIdeal,
      diodeFraction: 1 - duty,
      ripple,
      ipk: iout + ripple / 2,
      ivalley: iout - ripple / 2,
      ccm: true,
      dropout: false,
      slopeOn,
      slopeOff,
      irmsL: Math.sqrt(msL),
      irmsSwitch: Math.sqrt(duty * msL),
      idiodeAvg: iout * (1 - duty),
      vsat,
    }
  }

  // DCM. Current ramps 0 -> Ipk in t1 and Ipk -> 0 in t2, then sits at zero.
  // Ipk·(t1 + t2) / 2T = Iout with t1 = Ipk/m1 and t2 = Ipk/m2 gives
  // Ipk = sqrt(2·Iout·T·m1·m2 / (m1 + m2)).
  const t = 1 / fsw
  const ipk = Math.sqrt((2 * iout * t * slopeOn * slopeOff) / (slopeOn + slopeOff))
  const d1 = ipk / (slopeOn * t)
  const d2 = ipk / (slopeOff * t)
  // Mean square of a 0..Ipk ramp is Ipk²/3 over the interval it occupies.
  const msRamp = (ipk * ipk) / 3
  return {
    duty: d1,
    dutyIdeal,
    diodeFraction: d2,
    ripple: ipk,
    ipk,
    ivalley: 0,
    ccm: false,
    dropout: false,
    slopeOn,
    slopeOff,
    irmsL: Math.sqrt((d1 + d2) * msRamp),
    irmsSwitch: Math.sqrt(d1 * msRamp),
    idiodeAvg: (ipk / 2) * d2,
    vsat,
  }
}

/**
 * Sample the steady-state inductor current over `cycles` switching periods.
 *
 * Piecewise linear evaluation of the closed-form solution above, so the trace is
 * exact at every sample and cannot accumulate error however coarse dt gets.
 */
export function inductorWave(
  op: BuckOperation,
  cycles: number,
  n: number,
  fsw = FSW,
): { dt: number; samples: Float64Array } {
  const period = 1 / fsw
  const dt = (cycles * period) / n
  const samples = new Float64Array(n)
  const { duty: d1, diodeFraction: d2 } = op

  for (let i = 0; i < n; i++) {
    const p = ((i * cycles) / n) % 1
    let y: number
    if (p < d1) y = op.ivalley + op.slopeOn * p * period
    else if (p < d1 + d2) y = op.ipk - op.slopeOff * (p - d1) * period
    else y = 0 // DCM idle time, the diode is off and the inductor is empty
    samples[i] = y > 0 ? y : 0
  }
  return { dt, samples }
}

export type BuckDesign = {
  /** Supply feeding the module, V. */
  vin: number
  /** Output the divider is being designed for, V. */
  voutTarget: number
  /** Load current, A. */
  iout: number
  /** Feedback resistor from FB to ground, ohms. Datasheet suggests 1k to 5k. */
  r1: number
  /** Preferred-value series the divider is built from. */
  series: SeriesName
  /** Inductor, H. Module ships 33 uH. */
  l: number
  /** Output capacitor, F. */
  cout: number
  /** Output capacitor ESR, ohms. Dominates the ripple on an electrolytic. */
  esr: number
  /** Catch diode forward drop at the load current, V. */
  vd: number
  /** Inductor DC resistance, ohms. */
  dcr: number
  /** Junction-to-ambient thermal resistance, °C/W. */
  thetaJA: number
  /** Ambient temperature, °C. */
  tAmbC: number
}

export type BuckReadout = {
  /** Exact R2 the target needs, ohms. */
  r2Ideal: number
  /** Nearest value in the chosen series, ohms. Zero means FB tied to Vout. */
  r2: number
  /** Output the fitted divider actually produces, V. Drives everything below. */
  vout: number
  /** Signed relative error of vout against the target. */
  voutError: number
  /** Current down the feedback divider, Vref/R1. */
  dividerCurrent: number
  op: BuckOperation
  /** Output ripple, peak to peak, V. */
  vripple: number
  vrippleEsr: number
  vrippleCap: number
  pOut: number
  pSwitch: number
  pDiode: number
  pInductor: number
  pQuiescent: number
  pLoss: number
  pIn: number
  /** Dissipation inside the LM2596 itself, i.e. what sets its temperature. */
  pIc: number
  efficiency: number
  /** Average current drawn from the supply, A. */
  iin: number
  /** Junction temperature, °C. */
  tj: number
  /** Lowest input that still regulates this output at this load, V. */
  vinMinimum: number
  /** vin - vinMinimum, V. Negative means dropout. */
  headroom: number
  vinLow: boolean
  vinHigh: boolean
  overCurrent: boolean
  /** Peak inductor current is above the minimum guaranteed current limit. */
  overLimit: boolean
  overTemp: boolean
  dcm: boolean
  dropout: boolean
  voutBelowRef: boolean
  voutHigh: boolean
}

/** Everything the LM2596 page reports, derived once per parameter change. */
export function analyse(d: BuckDesign): BuckReadout {
  const r2Ideal = feedbackR2(d.voutTarget, d.r1)
  // R2 = 0 is legal and means FB tied straight to the output, i.e. Vout = Vref.
  const r2 =
    r2Ideal > 0 ? nearest(d.series, Math.min(Math.max(r2Ideal, R_MIN), R_MAX)) : 0
  const vout = outputVoltage(d.r1, r2)

  const op = operate(d.vin, vout, d.iout, d.l, d.vd, d.dcr)

  // Ripple voltage: the ESR term is the ripple current straight through the
  // resistance, the capacitive term is the charge the triangle moves,
  // dV = dI / (8·fsw·C). They do not actually peak together, so the sum is an
  // upper bound rather than a prediction.
  const vrippleEsr = op.ripple * d.esr
  const vrippleCap = d.cout > 0 ? op.ripple / (8 * FSW * d.cout) : Infinity

  const pOut = vout * d.iout
  const pSwitch = RSW * op.irmsSwitch * op.irmsSwitch
  const pDiode = d.vd * op.idiodeAvg
  const pInductor = d.dcr * op.irmsL * op.irmsL
  const pQuiescent = d.vin * IQ
  const pLoss = pSwitch + pDiode + pInductor + pQuiescent
  const pIn = pOut + pLoss
  // Only the switch and the quiescent current heat the IC. The diode and the
  // inductor are separate parts with their own thermal paths.
  const pIc = pSwitch + pQuiescent
  const tj = d.tAmbC + d.thetaJA * pIc

  const vinMinimum = Math.max(VIN_MIN, vout + op.vsat + d.iout * d.dcr)

  return {
    r2Ideal,
    r2,
    vout,
    voutError: d.voutTarget > 0 ? (vout - d.voutTarget) / d.voutTarget : 0,
    dividerCurrent: d.r1 > 0 ? VREF / d.r1 : Infinity,
    op,
    vripple: vrippleEsr + vrippleCap,
    vrippleEsr,
    vrippleCap,
    pOut,
    pSwitch,
    pDiode,
    pInductor,
    pQuiescent,
    pLoss,
    pIn,
    pIc,
    efficiency: pIn > 0 ? pOut / pIn : 0,
    iin: d.vin > 0 ? pIn / d.vin : 0,
    tj,
    vinMinimum,
    headroom: d.vin - vinMinimum,
    vinLow: d.vin < VIN_MIN,
    vinHigh: d.vin > VIN_MAX,
    overCurrent: d.iout > IOUT_MAX,
    overLimit: op.ipk > ILIM_MIN,
    overTemp: tj > TJ_MAX,
    dcm: !op.ccm,
    dropout: op.dropout,
    voutBelowRef: d.voutTarget < VREF,
    voutHigh: vout > VOUT_MAX,
  }
}
