/**
 * Buck-boost converter: the classic inverting single-switch stage, and the
 * four-switch non-inverting stage.
 *
 * Both store energy in the inductor during the on-time and hand it to the
 * output during the off-time, so the ideal transfer is |Vout| = Vin·D/(1-D)
 * with the sign set by the topology. Everything here is steady state: exact
 * volt-second balance on the inductor and charge balance on the output
 * capacitor, all in closed form. The scope trace is likewise a closed-form
 * piecewise-linear inductor current rather than an integration, so it cannot
 * drift or go unstable however coarsely it is sampled.
 *
 * Conduction losses (FET Rds(on), inductor DCR, catch-diode Vf) stay inside the
 * volt-second balance, so they push the duty up the way they do on a bench.
 * Switching, gate-drive and core losses are not modelled, so the efficiency
 * figure is an optimistic upper bound, increasingly so above a few hundred kHz.
 *
 * References: Erickson & Maksimovic, "Fundamentals of Power Electronics",
 * ch. 2 (CCM volt-second balance) and ch. 5 (DCM, K = 2L/(R·Ts)).
 */

export type Topology = 'inverting' | 'four-switch'
export type OpMode = 'buck' | 'boost' | 'buck-boost'
export type Conduction = 'ccm' | 'dcm'

/**
 * Duty limits a real controller can hold. A minimum on-time and a minimum
 * off-time (order 100 ns) wall it in at both ends; past them the part skips
 * pulses instead of regulating, and the ripple and stress figures below stop
 * describing what the hardware does.
 */
export const MAX_DUTY = 0.85
export const MIN_DUTY = 0.05

/**
 * Dead band either side of Vin = Vout inside which a four-switch stage runs
 * both legs. Neither leg can reach 0% or 100% duty, so parts like the TPS63020
 * and LTC3115 blend through a band of roughly this width instead of switching
 * mode exactly at unity gain.
 */
export const MODE_BAND = 0.1

/** Ripple ratio dIL/IL that the inductor-sizing suggestion aims at. */
export const TARGET_RIPPLE = 0.4

export type BuckBoostDesign = {
  /** Input supply, V. Always positive. */
  vin: number
  /** Target output magnitude, V. The polarity comes from the topology. */
  vout: number
  /** Load current, A. */
  iout: number
  /** Inductance, H. */
  l: number
  /** Inductor saturation current, A. */
  isat: number
  /** Inductor DC resistance, ohms. */
  dcr: number
  /** Output capacitance, F. */
  cout: number
  /** Output capacitor ESR, ohms. */
  esr: number
  /** Switching frequency, Hz. */
  fsw: number
  /** FET on-resistance, ohms. */
  rds: number
  /** Catch-diode forward drop, V. The four-switch stage is synchronous, so it
   *  ignores this. */
  vf: number
  topology: Topology
  /** Force a four-switch stage to run both legs instead of picking buck or boost. */
  forceCascaded: boolean
}

/** Ideal cascaded transfer |Vout| = Vin·D/(1-D), so D = |Vout|/(|Vout| + Vin). */
export function dutyCascaded(vin: number, vout: number): number {
  const total = vin + vout
  return total > 0 ? vout / total : 0
}

/** Ideal buck leg, Vout = Vin·D. */
export function dutyBuck(vin: number, vout: number): number {
  return vin > 0 ? vout / vin : 1
}

/** Ideal boost leg, Vout = Vin/(1-D). */
export function dutyBoost(vin: number, vout: number): number {
  return vout > 0 ? 1 - vin / vout : 0
}

/**
 * Which leg or legs a stage runs at this operating point. The inverting stage
 * has only one answer; a four-switch stage drops to plain buck or plain boost
 * whenever it can, because running both legs costs two extra switching
 * transitions and pushes the inductor current up by 1/(1-D).
 */
export function selectMode(d: BuckBoostDesign): OpMode {
  if (d.topology === 'inverting' || d.forceCascaded) return 'buck-boost'
  if (d.vout < d.vin * (1 - MODE_BAND)) return 'buck'
  if (d.vout > d.vin * (1 + MODE_BAND)) return 'boost'
  return 'buck-boost'
}

/**
 * Conduction resistance in series with the inductor, averaged over a period.
 * The four-switch stage always has exactly two FETs in the path, one per leg,
 * so both count in full. The inverting stage only has its FET in the path
 * during the on-time, so weight that by D; its catch diode is modelled by the
 * forward drop instead of a resistance.
 */
export function pathResistance(
  topology: Topology,
  dcr: number,
  rds: number,
  duty: number,
): number {
  return topology === 'four-switch' ? dcr + 2 * rds : dcr + rds * duty
}

export type DutySolution = {
  duty: number
  /**
   * False when the losses make that output unattainable at that load for any
   * duty. `duty` is then the peak of the output-against-duty curve, i.e. the
   * most the stage can deliver before resistive drop wins.
   */
  reachable: boolean
}

/**
 * Steady-state duty with the conduction drops left inside the volt-second
 * balance, so a lossy stage needs more on-time than the ideal formula says.
 *
 * Cascaded: (Vin - IL·R)·D = (Vc + IL·R)·(1-D) with IL = Iout/(1-D) and
 *   Vc = Vout + Vf, which is (Vin + Vc)·D² - (Vin + 2·Vc)·D + (Iout·R + Vc) = 0.
 *   The smaller root is physical; the other one is the D -> 1 runaway.
 * Buck: Vin·D = Vout + Iout·R, with IL = Iout.
 * Boost: Vout·(1-D)² - Vin·(1-D) + Iout·R = 0, larger root of (1-D).
 */
export function dutyLossy(
  mode: OpMode,
  vin: number,
  vout: number,
  iout: number,
  vf: number,
  rpath: number,
): DutySolution {
  if (mode === 'buck') {
    // No quadratic: the drop is carried by the load current, not by IL/(1-D).
    const duty = vin > 0 ? (vout + iout * rpath) / vin : 1
    return { duty, reachable: duty <= 1 }
  }

  if (mode === 'boost') {
    const disc = vin * vin - 4 * vout * iout * rpath
    if (disc < 0) return { duty: 1 - vin / (2 * vout), reachable: false }
    const offTime = (vin + Math.sqrt(disc)) / (2 * vout)
    return { duty: 1 - offTime, reachable: true }
  }

  const vc = vout + vf
  const a = vin + vc
  const b = vin + 2 * vc
  const c = iout * rpath + vc
  const disc = b * b - 4 * a * c
  if (disc < 0) return { duty: b / (2 * a), reachable: false }
  return { duty: (b - Math.sqrt(disc)) / (2 * a), reachable: true }
}

/**
 * Duty in discontinuous conduction, where the inductor empties before the
 * period ends and the duty no longer follows the CCM law.
 *
 * The current is a triangle of height Ipk = vLon·D/(fsw·L) that falls back to
 * zero over D2 = vLon·D/vLoff. Charge balance on the output then fixes D:
 *   pulsed output (boost, buck-boost): Iout = Ipk·D2/2
 *   continuous output (buck):          Iout = Ipk·(D + D2)/2
 * This ignores the conduction drops. DCM already means the design missed its
 * ripple target, and the page flags it rather than pretending to regulate here.
 */
export function dutyDcm(
  vLon: number,
  vLoff: number,
  iout: number,
  l: number,
  fsw: number,
  continuousOutput: boolean,
): number {
  if (!(vLon > 0) || !(vLoff > 0) || !(l > 0) || !(fsw > 0)) return 0
  const denom = vLon * (continuousOutput ? vLon + vLoff : vLon)
  return Math.sqrt((2 * fsw * l * iout * vLoff) / denom)
}

/** Peak-to-peak inductor ripple, dIL = vL(on)·D/(fsw·L). */
export function rippleCurrent(vLon: number, duty: number, fsw: number, l: number): number {
  return fsw > 0 && l > 0 ? (vLon * duty) / (fsw * l) : Infinity
}

/**
 * Inductance that puts this operating point at a given ripple ratio
 * r = dIL/IL: dIL = vL(on)·D/(fsw·L) = r·IL, so L = vL(on)·D/(r·fsw·IL).
 * r = 2 is the CCM/DCM boundary, where the valley current just reaches zero.
 */
export function inductanceFor(
  ratio: number,
  vLon: number,
  duty: number,
  fsw: number,
  ilAvg: number,
): number {
  const denom = ratio * fsw * ilAvg
  return denom > 0 ? (vLon * duty) / denom : Infinity
}

/** Mean square of a straight ramp from a to b. Used for every RMS below. */
export function rampMeanSquare(a: number, b: number): number {
  return (a * a + a * b + b * b) / 3
}

export type OperatingPoint = {
  mode: OpMode
  conduction: Conduction
  /** Duty of the energy-storing switch, 0..1. */
  duty: number
  /** Same duty with every conduction drop set to zero, for comparison. */
  dutyIdeal: number
  /** Fraction of the period the rectifier conducts. Equals 1-D in CCM. */
  d2: number
  /** Inductor voltage while the main switch is on, V. */
  vLon: number
  /** Inductor voltage magnitude while it is freewheeling, V. */
  vLoff: number
  /** Average inductor current, A. */
  ilAvg: number
  /** Peak-to-peak inductor ripple, A. */
  dIl: number
  ilPeak: number
  ilValley: number
  ilRms: number
  /** Inductor current where the rectifier stops conducting: the valley in CCM,
   *  zero in DCM. */
  ilEnd: number
  /** True when the losses put this output out of reach at this load. */
  reachable: boolean
}

/** Solve the steady-state operating point. */
export function operatingPoint(d: BuckBoostDesign): OperatingPoint {
  const mode = selectMode(d)
  // Only the inverting stage has a diode. The four-switch stage is synchronous.
  const vf = d.topology === 'inverting' ? d.vf : 0
  const dutyIdeal =
    mode === 'buck'
      ? dutyBuck(d.vin, d.vout)
      : mode === 'boost'
        ? dutyBoost(d.vin, d.vout)
        : dutyCascaded(d.vin, d.vout)

  // The FET term of the path resistance depends on the duty it is solving for,
  // so iterate. It is a second-order correction and settles in a few passes.
  // Keep the resistance that produced the final duty rather than recomputing
  // it afterwards, so the volt-second balance below is exact.
  let duty = clamp01(dutyIdeal)
  let rpath = pathResistance(d.topology, d.dcr, d.rds, duty)
  let reachable = true
  for (let i = 0; i < 4; i++) {
    rpath = pathResistance(d.topology, d.dcr, d.rds, duty)
    const solution = dutyLossy(mode, d.vin, d.vout, d.iout, vf, rpath)
    reachable = solution.reachable
    duty = clamp01(solution.duty)
    if (!reachable) break
  }
  const ilAvgCcm = mode === 'buck' ? d.iout : d.iout / Math.max(1 - duty, 1e-9)
  // Volt-second balance holds with the drops in place: vLon·D = vLoff·(1-D).
  const drop = ilAvgCcm * rpath
  const vLon = (mode === 'buck' ? d.vin - d.vout : d.vin) - drop
  const vLoff = (mode === 'boost' ? d.vout - d.vin : d.vout + vf) + drop
  const dIlCcm = rippleCurrent(vLon, duty, d.fsw, d.l)

  // The valley current reaching zero is the CCM/DCM boundary.
  const conduction: Conduction = dIlCcm / 2 > ilAvgCcm ? 'dcm' : 'ccm'

  if (conduction === 'ccm') {
    return {
      mode,
      conduction,
      duty,
      dutyIdeal,
      d2: 1 - duty,
      vLon,
      vLoff,
      ilAvg: ilAvgCcm,
      dIl: dIlCcm,
      ilPeak: ilAvgCcm + dIlCcm / 2,
      ilValley: ilAvgCcm - dIlCcm / 2,
      ilEnd: ilAvgCcm - dIlCcm / 2,
      ilRms: Math.sqrt(ilAvgCcm * ilAvgCcm + (dIlCcm * dIlCcm) / 12),
      reachable,
    }
  }

  // Discontinuous: redo it from the lossless triangle.
  const continuousOutput = mode === 'buck'
  const vOn = mode === 'buck' ? d.vin - d.vout : d.vin
  const vOff = mode === 'boost' ? d.vout - d.vin : d.vout + vf
  const dutyD = clamp01(dutyDcm(vOn, vOff, d.iout, d.l, d.fsw, continuousOutput))
  const ilPeak = rippleCurrent(vOn, dutyD, d.fsw, d.l)
  const d2 = vOff > 0 ? Math.min((vOn * dutyD) / vOff, 1 - dutyD) : 0
  const conducting = dutyD + d2

  return {
    mode,
    conduction,
    duty: dutyD,
    dutyIdeal,
    d2,
    vLon: vOn,
    vLoff: vOff,
    ilAvg: (ilPeak * conducting) / 2,
    dIl: ilPeak,
    ilPeak,
    ilValley: 0,
    ilEnd: 0,
    ilRms: ilPeak * Math.sqrt(conducting / 3),
    reachable,
  }
}

export type BuckBoostReadout = {
  op: OperatingPoint
  /** Output with its sign: negative for the inverting stage. */
  voutSigned: number
  /** |Vout|/Vin. */
  ratio: number
  /** Average supply current, A, taken as Pin/Vin so it carries the losses. */
  iinAvg: number
  /** dIL/IL. 0.3 to 0.4 is the usual design target; 2 is the DCM boundary. */
  rippleRatio: number
  /** Inductance at the CCM/DCM boundary for this load, H. */
  lCrit: number
  /** Inductance that would hit TARGET_RIPPLE, H. */
  lTarget: number
  /** Peak-to-peak output ripple, V. Capacitor term plus ESR term. */
  vRipple: number
  vRippleCap: number
  vRippleEsr: number
  /** Output capacitor RMS ripple current, A. */
  icoutRms: number
  /** Input capacitor RMS ripple current, A. */
  icinRms: number
  /** Average rectifier current (diode, or the synchronous FET replacing it), A. */
  iRectAvg: number
  /** Off-state voltage on the input-side switch, V. */
  vSwitch: number
  /** Off-state voltage on the rectifier, V. */
  vRect: number
  losses: {
    switching: number
    diode: number
    inductor: number
    total: number
  }
  pOut: number
  pIn: number
  efficiency: number
  /** Inductor peak current is past the saturation rating. */
  saturating: boolean
  /** Duty outside what a controller can actually hold. */
  dutyLimited: boolean
}

/** Everything the buck-boost page reports, derived once per parameter change. */
export function analyse(d: BuckBoostDesign): BuckBoostReadout {
  const op = operatingPoint(d)
  const vf = d.topology === 'inverting' ? d.vf : 0

  // A buck feeds the output through the inductor continuously; every other mode
  // hands it over in pulses through the rectifier. Symmetrically, a boost draws
  // continuously from the input and the others chop it.
  const pulsedOutput = op.mode !== 'buck'
  const pulsedInput = op.mode !== 'boost'

  const meanSqSwitch = op.duty * rampMeanSquare(op.ilValley, op.ilPeak)
  const meanSqRect = op.d2 * rampMeanSquare(op.ilPeak, op.ilEnd)
  const avgSwitch = (op.duty * (op.ilValley + op.ilPeak)) / 2
  const avgRect = (op.d2 * (op.ilPeak + op.ilEnd)) / 2

  const pInductor = op.ilRms * op.ilRms * d.dcr
  // Two FETs carry the full inductor current at every instant in the four-switch
  // stage, one per leg. The inverting stage has a single FET, on only during D.
  const pSwitching =
    d.topology === 'four-switch'
      ? 2 * op.ilRms * op.ilRms * d.rds
      : meanSqSwitch * d.rds
  const pDiode = vf * avgRect

  const pOut = d.vout * d.iout
  const total = pInductor + pSwitching + pDiode
  const pIn = pOut + total

  // The capacitor carries the load alone whenever the rectifier is off, so it
  // loses Iout·(1-D2)·T of charge. A buck never does that: the inductor is
  // always connected, so only the ripple current reaches the capacitor.
  const vRippleCap = pulsedOutput
    ? d.cout > 0
      ? (d.iout * (1 - op.d2)) / (d.fsw * d.cout)
      : Infinity
    : d.cout > 0
      ? op.dIl / (8 * d.fsw * d.cout)
      : Infinity
  // ESR sees the whole step in capacitor current: the inductor peak for a
  // pulsed output, the ripple alone for a buck.
  const vRippleEsr = d.esr * (pulsedOutput ? op.ilPeak : op.dIl)

  // RMS of a waveform minus its own DC content is what the capacitor carries.
  const icoutRms = pulsedOutput
    ? Math.sqrt(Math.max(0, meanSqRect - avgRect * avgRect))
    : op.dIl / Math.sqrt(12)
  const icinRms = pulsedInput
    ? Math.sqrt(Math.max(0, meanSqSwitch - avgSwitch * avgSwitch))
    : op.dIl / Math.sqrt(12)

  // The inverting switch node swings from Vin down to -(Vout + Vf), so the FET
  // and the diode both stand off Vin + Vout. The four-switch stage splits that:
  // the input leg only ever sees Vin, the output leg only Vout. That is the
  // whole reason to spend two extra FETs and a second gate driver.
  const inverting = d.topology === 'inverting'
  const vSwitch = inverting ? d.vin + d.vout + vf : d.vin
  const vRect = inverting ? d.vin + d.vout : d.vout

  // Boundary and target inductance are quoted for the CCM duty, so they stay
  // meaningful (they are the "make L bigger than this" numbers) once the actual
  // point has fallen into DCM.
  const ccmDuty =
    op.conduction === 'ccm' ? op.duty : op.mode === 'buck' ? dutyBuck(d.vin, d.vout) : op.mode === 'boost' ? dutyBoost(d.vin, d.vout) : dutyCascaded(d.vin, d.vout)
  const ccmIlAvg = op.mode === 'buck' ? d.iout : d.iout / Math.max(1 - ccmDuty, 1e-9)
  const ccmVLon = op.mode === 'buck' ? d.vin - d.vout : d.vin

  return {
    op,
    voutSigned: inverting ? -d.vout : d.vout,
    ratio: d.vin > 0 ? d.vout / d.vin : Infinity,
    iinAvg: d.vin > 0 ? pIn / d.vin : Infinity,
    rippleRatio: op.ilAvg > 0 ? op.dIl / op.ilAvg : Infinity,
    lCrit: inductanceFor(2, ccmVLon, ccmDuty, d.fsw, ccmIlAvg),
    lTarget: inductanceFor(TARGET_RIPPLE, ccmVLon, ccmDuty, d.fsw, ccmIlAvg),
    vRipple: vRippleCap + vRippleEsr,
    vRippleCap,
    vRippleEsr,
    icoutRms,
    icinRms,
    iRectAvg: avgRect,
    vSwitch,
    vRect,
    losses: { switching: pSwitching, diode: pDiode, inductor: pInductor, total },
    pOut,
    pIn,
    efficiency: pIn > 0 ? pOut / pIn : 0,
    saturating: op.ilPeak > d.isat,
    dutyLimited: op.duty > MAX_DUTY || op.duty < MIN_DUTY,
  }
}

/**
 * Inductor current at a point in the switching period, phase 0..1.
 * Straight lines between known endpoints, evaluated directly, so the trace is
 * exact at any sample rate and has nothing to accumulate error in.
 */
export function inductorCurrentAt(op: OperatingPoint, phase: number): number {
  const p = phase - Math.floor(phase)
  if (op.duty > 0 && p < op.duty) {
    return op.ilValley + (op.ilPeak - op.ilValley) * (p / op.duty)
  }
  const off = p - op.duty
  if (op.d2 > 0 && off < op.d2) {
    return op.ilPeak + (op.ilEnd - op.ilPeak) * (off / op.d2)
  }
  return 0 // DCM idle time: the inductor is empty and both devices are off
}

export type Waveforms = {
  dt: number
  /** Inductor current, A. */
  il: Float64Array
  /** Current in the input-side switch, A. */
  iSwitch: Float64Array
  /** Current in the rectifier, A. */
  iRect: Float64Array
}

/** Sample `periods` switching periods of the stage. */
export function waveform(
  op: OperatingPoint,
  fsw: number,
  n: number,
  periods: number,
): Waveforms {
  const dt = fsw > 0 ? periods / fsw / n : 0
  const il = new Float64Array(n)
  const iSwitch = new Float64Array(n)
  const iRect = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const phase = ((i * periods) / n) % 1
    const current = inductorCurrentAt(op, phase)
    il[i] = current
    if (phase < op.duty) iSwitch[i] = current
    else if (phase < op.duty + op.d2) iRect[i] = current
  }
  return { dt, il, iSwitch, iRect }
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0
  return v < 0 ? 0 : v > 0.999 ? 0.999 : v
}
