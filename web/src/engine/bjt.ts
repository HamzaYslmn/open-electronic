/**
 * NPN bipolar junction transistor in the two jobs it actually gets in an ESP32
 * project: a saturated low side switch driven from a GPIO, and a voltage
 * divider biased common emitter amplifier.
 *
 * Model: the piecewise linear one every application note uses. A conducting
 * base-emitter junction drops VBE_ON, the forward active region gives
 * IC = hFE*IB, and once the collector runs out of available current the device
 * clamps at VCE_SAT. Both solvers are closed form and memoryless, i.e. there is
 * no integration anywhere, so no step size can make a trace ring or diverge.
 *
 * Not modelled: storage time and switching loss, the Early effect, hFE roll off
 * at high IC, and the soft knee of a real saturation curve.
 */

import { GPIO_MAX_MA, V_THERMAL } from './constants'
import { clamp, toDb } from './units'

/**
 * Base-emitter drop of a conducting silicon BJT. 2N2222A / BC547 datasheets
 * give VBE(on) = 0.6 to 0.75 V over the useful IC range; 0.7 V is the design
 * value every textbook uses. Real VBE(sat) creeps to 0.9 V at high IC.
 */
export const VBE_ON = 0.7

/**
 * Collector-emitter drop of a hard saturated small signal BJT. 2N2222A
 * datasheet: VCE(sat) = 0.3 V max at IC = 150 mA, around 0.2 V at 10 mA.
 */
export const VCE_SAT = 0.2

/**
 * Overdrive factor a switch design should aim for: drive the base 10x harder
 * than hFE strictly needs, so worst case hFE, temperature and load current
 * still leave the device saturated.
 */
export const ODF_TARGET = 10

/** Stiff divider rule of thumb: bleed at least 10x IB through R1/R2 so the
 *  bias point stops depending on hFE. */
export const STIFF_RATIO = 10

/** Parallel combination. An Infinity term contributes nothing, as it should. */
export function parallel(...values: number[]): number {
  let g = 0
  for (const r of values) {
    if (r <= 0) return 0
    g += 1 / r
  }
  return g > 0 ? 1 / g : Infinity
}

// ---------------------------------------------------------------- switch mode

export type SwitchState = 'off' | 'active' | 'saturated'

/** Everything except the drive level, which the scope varies sample by sample. */
export type SwitchStage = {
  /** Base resistor, ohms. */
  rb: number
  /** Load rail, volts. */
  vLoad: number
  /** Resistive load in the collector leg, ohms. */
  rLoad: number
  hfe: number
}

export type SwitchInput = SwitchStage & {
  /** Logic high applied to RB. VCC (3.3 V) for an ESP32 GPIO. */
  vDrive: number
}

/** IB = (Vdrive - VBE)/RB. Zero while the drive sits below the junction drop. */
export function baseCurrent(vDrive: number, rb: number): number {
  if (!(rb > 0)) return vDrive > VBE_ON ? Infinity : 0
  return Math.max(0, (vDrive - VBE_ON) / rb)
}

/** Collector current a resistive load pulls with the switch hard on:
 *  IC(sat) = (Vload - VCEsat)/Rload. */
export function saturationCurrent(vLoad: number, rLoad: number): number {
  if (!(rLoad > 0)) return Infinity
  return Math.max(0, (vLoad - VCE_SAT) / rLoad)
}

/** ODF = IB*hFE / IC(load). Below 1 the transistor cannot saturate. */
export function overdriveFactor(ib: number, hfe: number, icLoad: number): number {
  if (icLoad <= 0) return Infinity
  return (ib * hfe) / icLoad
}

export type SwitchOperatingPoint = {
  ib: number
  /** hFE*IB, the collector current the base drive could support. */
  icAvailable: number
  /** Collector current the load demands when saturated. */
  icSat: number
  /** Actual collector current, the smaller of the two. */
  ic: number
  vce: number
  state: SwitchState
}

/**
 * Solve the collector node. The transistor delivers hFE*IB until the load
 * cannot take any more current, at which point VCE collapses to VCE_SAT and
 * the load, not hFE, sets IC.
 */
export function solveSwitch({ vDrive, rb, vLoad, rLoad, hfe }: SwitchInput): SwitchOperatingPoint {
  const ib = baseCurrent(vDrive, rb)
  const icSat = saturationCurrent(vLoad, rLoad)
  if (ib <= 0) return { ib: 0, icAvailable: 0, icSat, ic: 0, vce: vLoad, state: 'off' }

  const icAvailable = hfe * ib
  if (icAvailable >= icSat) {
    return { ib, icAvailable, icSat, ic: icSat, vce: VCE_SAT, state: 'saturated' }
  }
  // Forward active: the load resistor drops what the collector current asks for.
  return {
    ib,
    icAvailable,
    icSat,
    ic: icAvailable,
    vce: vLoad - icAvailable * rLoad,
    state: 'active',
  }
}

export type SwitchReadout = SwitchOperatingPoint & {
  /** Smallest base current that still saturates: IB(min) = IC(load)/hFE. */
  ibMin: number
  odf: number
  /** Largest RB that still hits ODF_TARGET. NaN when the drive cannot turn the
   *  transistor on at all. */
  rbForTarget: number
  /** VCE*IC, the heat in the collector junction. */
  pCollector: number
  /** VBE*IB, the heat in the base junction. */
  pBase: number
  pTransistor: number
  pLoad: number
  pBaseResistor: number
  /** Base current is past what an ESP32 pin will source. */
  overGpio: boolean
}

export function analyseSwitch(input: SwitchInput): SwitchReadout {
  const op = solveSwitch(input)
  const { vDrive, rLoad, hfe } = input
  const ibMin = hfe > 0 ? op.icSat / hfe : Infinity
  const odf = overdriveFactor(op.ib, hfe, op.icSat)

  return {
    ...op,
    ibMin,
    odf,
    rbForTarget:
      vDrive > VBE_ON && ibMin > 0 ? (vDrive - VBE_ON) / (ODF_TARGET * ibMin) : NaN,
    pCollector: op.vce * op.ic,
    pBase: VBE_ON * op.ib,
    pTransistor: op.vce * op.ic + VBE_ON * op.ib,
    pLoad: op.ic * op.ic * rLoad,
    pBaseResistor: Math.max(0, vDrive - VBE_ON) * op.ib,
    overGpio: op.ib > GPIO_MAX_MA / 1000,
  }
}

/**
 * Collector waveform for a drive waveform. The model has no storage elements,
 * so this is a per-sample algebraic solve and dt never enters the maths: any
 * time base is stable by construction. Real switching edges are slower than
 * this because of base charge storage.
 */
export function switchTrace(
  drive: ArrayLike<number>,
  stage: SwitchStage,
): { vce: Float64Array; ic: Float64Array } {
  const n = drive.length
  const vce = new Float64Array(n)
  const ic = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const op = solveSwitch({ ...stage, vDrive: drive[i] })
    vce[i] = op.vce
    ic[i] = op.ic
  }
  return { vce, ic }
}

// ------------------------------------------------------------- amplifier mode

export type AmpRegion = 'active' | 'saturated' | 'cutoff'

export type AmpInput = {
  /** Supply rail. VCC (3.3 V) for an ESP32 board. */
  vcc: number
  /** Upper divider resistor, rail to base. */
  r1: number
  /** Lower divider resistor, base to ground. */
  r2: number
  rc: number
  re: number
  hfe: number
  /** Emitter degeneration shorted at signal frequencies by a bypass cap. */
  bypassed: boolean
}

export type AmpReadout = {
  /** Thevenin equivalent of the bias divider. */
  vth: number
  rth: number
  ib: number
  ic: number
  ie: number
  vb: number
  ve: number
  vc: number
  vce: number
  /** Small signal emitter resistance r_e = VT/IE. */
  reSmall: number
  /** Midband voltage gain, negative because a common emitter inverts. */
  av: number
  avDb: number
  zin: number
  zout: number
  /** Peak symmetric output swing before one rail clips. */
  swing: number
  /** Peak input that swing corresponds to. */
  maxInput: number
  dividerCurrent: number
  /** Divider current expressed in units of IB. */
  stiffness: number
  stiff: boolean
  region: AmpRegion
}

/**
 * Voltage divider bias, solved exactly rather than with the "ignore IB"
 * approximation, so a floppy divider shows up as a shifted Q point instead of
 * silently reading right.
 *
 *   VTH = VCC*R2/(R1+R2),  RTH = R1||R2
 *   IB  = (VTH - VBE) / (RTH + (hFE+1)*RE)
 *   IC  = hFE*IB,  IE = (hFE+1)*IB
 *   VCE = VCC - IC*RC - IE*RE
 *
 * Gain is the standard midband result with the emitter resistance included:
 *   Av = -RC / (RE' + r_e),  r_e = VT/IE,  RE' = 0 when RE is bypassed.
 * With RE >> r_e this collapses to the familiar Av = -RC/RE.
 */
export function analyseAmp({ vcc, r1, r2, rc, re, hfe, bypassed }: AmpInput): AmpReadout {
  const vth = (vcc * r2) / (r1 + r2)
  const rth = parallel(r1, r2)

  let region: AmpRegion = 'active'
  let ib = (vth - VBE_ON) / (rth + (hfe + 1) * re)
  let ic = hfe * ib
  let ie = (hfe + 1) * ib

  if (!(ib > 0)) {
    region = 'cutoff'
    ib = 0
    ic = 0
    ie = 0
  }

  let ve = ie * re
  let vc = vcc - ic * rc
  let vce = vc - ve

  if (region === 'active' && vce < VCE_SAT) {
    // Out of the active region: VCE is pinned at VCE_SAT and the rail plus the
    // two resistors set IC, so hFE no longer controls anything.
    region = 'saturated'
    ic = (vcc - VCE_SAT) / (rc + (re * (hfe + 1)) / hfe)
    ie = (ic * (hfe + 1)) / hfe
    ve = ie * re
    vce = VCE_SAT
    vc = ve + VCE_SAT
    ib = rth > 0 ? Math.max(0, (vth - VBE_ON - ve) / rth) : ib
  }

  const vb = region === 'cutoff' ? vth : ve + VBE_ON
  const reSmall = ie > 0 ? V_THERMAL / ie : Infinity
  const reAc = bypassed ? 0 : re
  const av = -rc / (reAc + reSmall)
  const zin = parallel(r1, r2, (hfe + 1) * (reAc + reSmall))

  // Positive swing runs out at the rail, negative swing at saturation.
  const swing = Math.max(0, Math.min(ic * rc, vce - VCE_SAT))
  const gain = Math.abs(av)
  const dividerCurrent = vcc / (r1 + r2)
  const stiffness = ib > 0 ? dividerCurrent / ib : Infinity

  return {
    vth,
    rth,
    ib,
    ic,
    ie,
    vb,
    ve,
    vc,
    vce,
    reSmall,
    av,
    avDb: gain > 0 ? toDb(gain) : -Infinity,
    zin,
    zout: rc, // ignores ro, which is 10s of kOhm and rarely dominates
    swing,
    maxInput: gain > 0 ? swing / gain : Infinity,
    dividerCurrent,
    stiffness,
    stiff: stiffness >= STIFF_RATIO,
    region,
  }
}

/**
 * Base and collector waveforms for an AC coupled input. Quasi-static: the
 * midband gain is applied sample by sample and the result is clipped at the
 * rail and at saturation. Memoryless again, so dt cannot destabilise it.
 * A real stage clips softly at cutoff and the coupling caps roll off the low
 * end, neither of which is here.
 */
export function ampTrace(
  ac: ArrayLike<number>,
  amp: AmpInput,
): { base: Float64Array; collector: Float64Array } {
  const q = analyseAmp(amp)
  const floor = Math.min(q.ve + VCE_SAT, amp.vcc)
  const n = ac.length
  const base = new Float64Array(n)
  const collector = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    base[i] = q.vb + ac[i]
    collector[i] = clamp(q.vc + q.av * ac[i], floor, amp.vcc)
  }
  return { base, collector }
}
