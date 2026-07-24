/**
 * Boost (step-up) converter power stage, in both conduction modes.
 *
 * Steady state only, and every result is closed form. The inductor current in a
 * switching converter is exactly piecewise linear inside one period, so the
 * waveform is evaluated point by point from the two slopes rather than
 * integrated. Nothing here can go unstable when the user drags the frequency or
 * the inductance slider and dt stops being small next to L/R.
 *
 * The duty cycle comes out of volt-second balance on the inductor and the input
 * current out of charge balance on the output capacitor, i.e. the two standard
 * steady-state constraints.
 *
 * Sources:
 *   Erickson & Maksimovic, Fundamentals of Power Electronics, ch. 2 (volt-second
 *   and charge balance), ch. 3 (the gain ceiling set by inductor resistance) and
 *   ch. 5 (discontinuous conduction mode).
 *   TI SLVA372, Basic Calculation of a Boost Converter's Power Stage.
 */

export type ConductionMode = 'CCM' | 'DCM'

/**
 * Typical Schottky forward drop at roughly 1 A, 25 C. Datasheet figure shared by
 * the usual small rectifiers (SS34, B340, MBRS340). Named rather than inlined
 * because it moves the duty cycle by several percent on a 3.3 V input.
 */
export const SCHOTTKY_VF = 0.35

/**
 * Duty above this is where the ideal CCM model stops being useful: the
 * right-half-plane zero moves down to where the loop cannot be compensated, the
 * diode conduction window gets too short for the output cap, and the parasitic
 * resistances start eating the gain (see maxOutputVoltage). Common design rule,
 * quoted by most controller datasheets as a max duty clamp of 85 to 90%.
 */
export const MAX_PRACTICAL_DUTY = 0.85

/** Usual design target for peak-to-peak inductor ripple over average input current. */
export const RIPPLE_TARGET = 0.4
/** Past this the peak current and the core loss both get out of hand. */
export const RIPPLE_LIMIT = 0.6

export type BoostInput = {
  /** Input rail, volts. */
  vin: number
  /** Regulated output, volts. */
  vout: number
  /** Load current, amps. */
  iout: number
  /** Inductance, henries. */
  l: number
  /** Inductor saturation current from the datasheet, amps. */
  isat: number
  /** Switching frequency, hertz. */
  fsw: number
  /** Output capacitance, farads. */
  cout: number
  /** Output capacitor ESR, ohms. */
  esr: number
  /** Rectifier forward drop, volts. */
  vd: number
  /** Switch on resistance, ohms. */
  ron: number
  /** Inductor DC resistance, ohms. */
  dcr: number
}

export type BoostReadout = {
  mode: ConductionMode
  /** Duty solved with the real drops included. NaN when there is no solution. */
  duty: number
  /** Ideal duty, 1 - Vin/Vout, for comparison. */
  dutyIdeal: number
  period: number
  ton: number
  toff: number
  /** Fraction of the period the diode actually conducts. Equals 1-duty in CCM. */
  d2: number
  /** Inductor voltage while the switch is on, volts. Sets the rising slope. */
  vOn: number
  /** Inductor voltage magnitude while the diode conducts. Sets the falling slope. */
  vOff: number
  /** Average inductor current, which is also the average input current. */
  iin: number
  ipeak: number
  ivalley: number
  /** RMS inductor current, what actually heats the winding. */
  ilRms: number
  /** RMS switch current. */
  iswRms: number
  /** Peak-to-peak inductor ripple, amps. */
  ripple: number
  /** ripple / iin. */
  rippleRatio: number
  /** Load current at which this design falls out of CCM. */
  ioutBoundary: number
  /** Inductance needed to just stay in CCM at this load. */
  lBoundary: number
  /** Output ripple from the capacitance alone, volts. */
  vRippleCap: number
  /** Output ripple from the ESR alone, volts. */
  vRippleEsr: number
  vRipple: number
  /** Drain voltage the switch has to block. */
  vSwitchStress: number
  /** Reverse voltage the rectifier has to block. */
  vDiodeStress: number
  pin: number
  pout: number
  ploss: number
  efficiency: number
  /** Highest output this power stage can reach at this load, volts. */
  voutMax: number
  gain: number
  /** False when the requested output is above voutMax. */
  achievable: boolean
  /** False when Vout is not above Vin, where a boost has nothing to do. */
  stepUp: boolean
  extremeDuty: boolean
  saturating: boolean
  highRipple: boolean
}

/**
 * Ideal CCM duty. Volt-second balance with no drops gives
 * Vin·D·T = (Vout - Vin)·(1-D)·T, i.e. D = 1 - Vin/Vout.
 */
export function idealDuty(vin: number, vout: number): number {
  return vout > 0 ? 1 - vin / vout : NaN
}

/**
 * Highest output the power stage can reach at this load.
 *
 * Volt-second balance with the switch drop Iavg·Ron, the diode drop Vd and the
 * winding drop Iavg·DCR, substituting Iavg = Iout/(1-D), is a quadratic in
 * x = 1-D:
 *   x²·(Vout + Vd) - x·(Vin + Iout·Ron) + Iout·(DCR + Ron) = 0
 * Real roots exist only while the discriminant is non-negative, and setting it
 * to zero and solving for Vout gives the ceiling below. With Ron = Vd = 0 this
 * reduces to Erickson's M_max = 0.5·sqrt(R / R_L) for the load resistance R.
 */
export function maxOutputVoltage(
  vin: number,
  iout: number,
  vd: number,
  ron: number,
  dcr: number,
): number {
  const rloss = dcr + ron
  if (iout <= 0 || rloss <= 0) return Infinity
  const b = vin + iout * ron
  return (b * b) / (4 * iout * rloss) - vd
}

/**
 * CCM duty including the diode, switch and winding drops: the larger root of the
 * quadratic above. The larger root is the physical operating point, the smaller
 * one is the unstable high-duty branch where more duty gives less output.
 * Returns NaN when the requested output is past maxOutputVoltage.
 */
export function ccmDuty(
  vin: number,
  vout: number,
  iout: number,
  vd = 0,
  ron = 0,
  dcr = 0,
): number {
  const a = vout + vd
  if (a <= 0) return NaN
  const b = vin + iout * ron
  const c = iout * (dcr + ron)
  const disc = b * b - 4 * a * c
  if (disc < 0) return NaN
  const x = (b + Math.sqrt(disc)) / (2 * a) // x = 1 - D
  return 1 - x
}

/**
 * DCM duty. The inductor starts each period at zero, so
 *   Ipk = Vin·D/(fsw·L),  D2 = D·Vin/(Vout + Vd - Vin),  Iout = Ipk·D2/2,
 * which solves to D = sqrt(2·L·fsw·Iout·(Vout + Vd - Vin)) / Vin.
 * Winding and switch resistance are left out here: DCM only happens at light
 * load, where their drops are second order next to the diode.
 */
export function dcmDuty(
  vin: number,
  vout: number,
  iout: number,
  l: number,
  fsw: number,
  vd = 0,
): number {
  const swing = vout + vd - vin
  if (swing <= 0 || vin <= 0 || l <= 0 || fsw <= 0 || iout <= 0) return NaN
  return Math.sqrt(2 * l * fsw * iout * swing) / vin
}

/** Peak-to-peak inductor ripple: dI = v·ton/L with ton = D/fsw. */
export function rippleCurrent(vL: number, duty: number, fsw: number, l: number): number {
  if (fsw <= 0 || l <= 0) return Infinity
  return (vL * duty) / (fsw * l)
}

/**
 * Load current at the CCM/DCM boundary, where the valley current just touches
 * zero: Iout_crit = Vin·D·(1-D) / (2·fsw·L).
 */
export function boundaryLoadCurrent(
  vL: number,
  duty: number,
  fsw: number,
  l: number,
): number {
  if (fsw <= 0 || l <= 0) return 0
  return (vL * duty * (1 - duty)) / (2 * fsw * l)
}

/**
 * Inductance that just keeps this load in CCM,
 * L_crit = Vin·D·(1-D) / (2·fsw·Iout), i.e. D(1-D)²R/(2·fsw) with R = Vout/Iout.
 */
export function criticalInductance(
  vL: number,
  duty: number,
  fsw: number,
  iout: number,
): number {
  if (fsw <= 0 || iout <= 0) return Infinity
  return (vL * duty * (1 - duty)) / (2 * fsw * iout)
}

function blank(base: Partial<BoostReadout>): BoostReadout {
  return {
    mode: 'CCM',
    duty: NaN,
    dutyIdeal: NaN,
    period: NaN,
    ton: NaN,
    toff: NaN,
    d2: NaN,
    vOn: NaN,
    vOff: NaN,
    iin: NaN,
    ipeak: NaN,
    ivalley: NaN,
    ilRms: NaN,
    iswRms: NaN,
    ripple: NaN,
    rippleRatio: NaN,
    ioutBoundary: NaN,
    lBoundary: NaN,
    vRippleCap: NaN,
    vRippleEsr: NaN,
    vRipple: NaN,
    vSwitchStress: NaN,
    vDiodeStress: NaN,
    pin: NaN,
    pout: NaN,
    ploss: NaN,
    efficiency: NaN,
    voutMax: NaN,
    gain: NaN,
    achievable: false,
    stepUp: false,
    extremeDuty: false,
    saturating: false,
    highRipple: false,
    ...base,
  }
}

/** Everything the boost page reports, derived once per parameter change. */
export function analyse(input: BoostInput): BoostReadout {
  const { vin, vout, iout, l, isat, fsw, cout, esr, vd, ron, dcr } = input

  const period = fsw > 0 ? 1 / fsw : Infinity
  const pout = vout * iout
  const gain = vin > 0 ? vout / vin : Infinity
  const voutMax = maxOutputVoltage(vin, iout, vd, ron, dcr)
  const dutyIdeal = idealDuty(vin, vout)
  const stress = {
    // The switch blocks the output plus the drop across the conducting diode.
    vSwitchStress: vout + vd,
    // The diode blocks the output while the switch pulls the node to ground.
    vDiodeStress: vout,
    voutMax,
    gain,
    pout,
    period,
    dutyIdeal,
  }

  // A boost cannot step down. At Vout <= Vin the switch never needs to turn on
  // and the inductor plus diode is just a lossy wire, so there is no operating
  // point to report.
  if (!(vin > 0) || !(vout > vin) || l <= 0 || fsw <= 0 || iout <= 0) {
    return blank({ ...stress, stepUp: false, achievable: false })
  }

  let duty = ccmDuty(vin, vout, iout, vd, ron, dcr)
  if (!Number.isFinite(duty) || duty <= 0 || duty >= 1) {
    return blank({ ...stress, stepUp: true, achievable: false })
  }

  let mode: ConductionMode = 'CCM'
  let iin = iout / (1 - duty) // charge balance: the diode carries IL for (1-D)
  let vOn = vin - iin * (dcr + ron)
  let ripple = rippleCurrent(vOn, duty, fsw, l)
  let ivalley = iin - ripple / 2
  let ipeak = iin + ripple / 2
  let d2 = 1 - duty
  let ilRms = Math.sqrt(iin * iin + (ripple * ripple) / 12)
  let iswRms = ilRms * Math.sqrt(duty)

  // The CCM solution is only valid while the current never reaches zero. Once
  // the valley goes negative the diode has already turned off, so re-solve in
  // DCM rather than reporting a duty the converter would never run at.
  if (ivalley < 0) {
    mode = 'DCM'
    duty = dcmDuty(vin, vout, iout, l, fsw, vd)
    if (!Number.isFinite(duty) || duty <= 0) {
      return blank({ ...stress, stepUp: true, achievable: false })
    }
    ipeak = (vin * duty) / (fsw * l)
    ivalley = 0
    ripple = ipeak
    d2 = (duty * vin) / (vout + vd - vin)
    iin = 0.5 * ipeak * (duty + d2)
    vOn = vin
    // Triangle over (D + D2) of the period, zero for the rest.
    ilRms = ipeak * Math.sqrt((duty + d2) / 3)
    iswRms = ipeak * Math.sqrt(duty / 3)
  }

  const vOff = mode === 'CCM' ? vout + vd + iin * dcr - vin : vout + vd - vin

  // The output cap alone feeds the load whenever the diode is off.
  const capOnlyFraction = mode === 'CCM' ? duty : 1 - d2
  const vRippleCap = cout > 0 ? (iout * capOnlyFraction) / (fsw * cout) : Infinity
  // Diode current steps from zero to Ipeak at turn-off, so the cap current step
  // is Ipeak and the ESR turns that straight into volts.
  const vRippleEsr = ipeak * esr

  const pin = vin * iin
  const rippleRatio = iin > 0 ? ripple / iin : Infinity

  return {
    ...stress,
    mode,
    duty,
    ton: duty * period,
    toff: (1 - duty) * period,
    d2,
    vOn,
    vOff,
    iin,
    ipeak,
    ivalley,
    ilRms,
    iswRms,
    ripple,
    rippleRatio,
    ioutBoundary: boundaryLoadCurrent(vOn, duty, fsw, l),
    lBoundary: criticalInductance(vOn, duty, fsw, iout),
    vRippleCap,
    vRippleEsr,
    // Conservative: the two peaks do not line up in time, so the real ripple is
    // a little under the sum.
    vRipple: vRippleCap + vRippleEsr,
    pin,
    ploss: pin - pout,
    efficiency: pin > 0 ? pout / pin : 0,
    achievable: true,
    stepUp: true,
    extremeDuty: duty > MAX_PRACTICAL_DUTY,
    saturating: isat > 0 && ipeak > isat,
    highRipple: rippleRatio > RIPPLE_LIMIT,
  }
}

export type BoostWaveform = {
  dt: number
  /** Inductor current, amps. */
  il: Float64Array
  /** Current through the switch, amps. Zero while the diode conducts. */
  isw: Float64Array
  /** Current through the diode into the output cap, amps. */
  idiode: Float64Array
}

/**
 * Sample the steady-state switching waveforms over `cycles` periods.
 *
 * Evaluated from the closed-form piecewise-linear shape, so the trace is exact
 * and bounded by Ipeak at any sample spacing. Nothing accumulates, so a coarse
 * dt loses detail but never diverges.
 */
export function waveform(r: BoostReadout, n: number, cycles: number): BoostWaveform {
  const il = new Float64Array(n)
  const isw = new Float64Array(n)
  const idiode = new Float64Array(n)
  const period = Number.isFinite(r.period) ? r.period : 1
  const dt = (cycles * period) / n
  if (!r.achievable || !Number.isFinite(r.duty)) return { dt, il, isw, idiode }

  const { duty, d2, ipeak, ivalley, mode } = r
  const rise = ipeak - ivalley

  for (let i = 0; i < n; i++) {
    // Phase inside the switching period, in [0,1).
    const p = ((i * dt) / period) % 1
    let current: number
    let conducting: 'switch' | 'diode' | 'none'

    if (p < duty) {
      // Switch on: the inductor sees vOn and the current ramps up.
      current = ivalley + (rise * p) / duty
      conducting = 'switch'
    } else if (mode === 'CCM' || p < duty + d2) {
      // Diode on: the inductor sees Vin - Vout - Vd and the current ramps down.
      const fall = mode === 'CCM' ? 1 - duty : d2
      current = ipeak - (ipeak - ivalley) * ((p - duty) / fall)
      conducting = 'diode'
    } else {
      // DCM idle: current is zero and the switch node rings at Vout.
      current = 0
      conducting = 'none'
    }

    il[i] = current
    if (conducting === 'switch') isw[i] = current
    else if (conducting === 'diode') idiode[i] = current
  }

  return { dt, il, isw, idiode }
}
