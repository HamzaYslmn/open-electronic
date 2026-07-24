import type { Key } from '../i18n'
/**
 * Diode rectifiers: half wave, full wave bridge and centre tapped, each with a
 * capacitor input (reservoir) filter feeding a resistive load.
 *
 * This page deliberately does not use VCC. A rectifier lives on a transformer
 * secondary or on the mains, so the sensible defaults here are tens of volts,
 * not the 3.3 V logic rail.
 *
 * The time-domain solver switches between two linear sub-circuits, diode
 * conducting and diode off, and integrates each one with exact zero-order-hold
 * discretisation, v[n] = vInf + (v[n-1] - vInf)*exp(-dt/tau). Both branches have
 * |exp(-dt/tau)| < 1 for every dt, so the solver cannot blow up when the user
 * drags the frequency or capacitance slider. Forward Euler would diverge as soon
 * as dt passed 2*tau, and tau here is Rs*C, which is microseconds.
 */
import { mean, rms } from './signal'

export type Topology = 'half' | 'bridge' | 'centre'

export const TOPOLOGIES: ReadonlyArray<{ value: Topology; label: Key }> = [
  { value: 'half', label: 'common.halfWave' },
  { value: 'bridge', label: 'opt.bridge' },
  { value: 'centre', label: 'opt.centreTap' },
]

export type Diode = {
  id: string
  label: Key
  /** Forward drop at or near rated current, V. */
  vf: number
  /** IO, maximum average rectified forward current, A. */
  io: number
  /** VRRM, repetitive peak reverse voltage, V. */
  vrrm: number
  /** IFSM, non repetitive surge current, one 8.3 ms half sine, A. */
  isurge: number
}

/**
 * Datasheet figures, not round numbers. Vf is the drop at the current the part
 * is normally run at, which is why the silicon parts read closer to 1 V than to
 * the textbook 0.7 V: 0.7 V is the drop at a few milliamps, and a rectifier
 * charging a reservoir cap works at amps.
 */
export const DIODES: ReadonlyArray<Diode> = [
  { id: '1N4148', label: 'opt.1n4148Signal', vf: 1.0, io: 0.15, vrrm: 100, isurge: 1 },
  { id: '1N4007', label: 'opt.1n40071ASilicon', vf: 0.9, io: 1, vrrm: 1000, isurge: 30 },
  { id: '1N5408', label: 'opt.1n54083ASilicon', vf: 1.0, io: 3, vrrm: 1000, isurge: 200 },
  { id: '1N5819', label: 'opt.1n5819Schottky', vf: 0.45, io: 1, vrrm: 40, isurge: 25 },
]

/** Diodes stacked in series in the conduction path. Only the bridge has two. */
export function seriesDiodes(topology: Topology): number {
  return topology === 'bridge' ? 2 : 1
}

/** Total diodes in the circuit. */
export function diodeCount(topology: Topology): number {
  return topology === 'half' ? 1 : topology === 'centre' ? 2 : 4
}

/** Output pulses per input cycle. Both full wave arrangements double the ripple frequency. */
export function pulses(topology: Topology): number {
  return topology === 'half' ? 1 : 2
}

/** Voltage the rectifier arm presents before the diode drops are taken off. */
export function rectify(v: number, topology: Topology): number {
  return topology === 'half' ? v : Math.abs(v)
}

export type RectifierSpec = {
  topology: Topology
  /** Forward drop of one diode, V. */
  vf: number
  /** Winding plus diode bulk resistance in the charging path, ohms. */
  rs: number
  /** Reservoir capacitance, F. */
  c: number
  /** Load resistance, ohms. */
  rload: number
}

export type RectifierTrace = {
  /** Load voltage, i.e. the reservoir cap voltage. */
  vout: Float64Array
  /** Same rectifier with the cap removed, for comparison on the scope. */
  vraw: Float64Array
  /** Current through the conducting diode path, A. */
  idiode: Float64Array
}

/**
 * Run the rectifier over a sampled secondary voltage.
 *
 * Conducting, the node sees the rectified drive behind Rs into C parallel RL, so
 * it settles toward vDrive*RL/(Rs+RL) with tau = (Rs||RL)*C. Off, the cap simply
 * discharges into the load with tau = RL*C. `warmup` throwaway passes seed the
 * cap so the visible pass is the steady state rather than the first-charge
 * transient; the seed starts at the peak, which is the upper bound on the cap
 * voltage, so convergence is fast from above.
 */
export function simulate(
  input: ArrayLike<number>,
  dt: number,
  spec: RectifierSpec,
  warmup = 4,
): RectifierTrace {
  const n = input.length
  const vout = new Float64Array(n)
  const vraw = new Float64Array(n)
  const idiode = new Float64Array(n)
  if (n === 0) return { vout, vraw, idiode }

  const drop = seriesDiodes(spec.topology) * spec.vf
  const rs = Math.max(spec.rs, 1e-6) // a real winding is never a hard voltage source
  const rl = Math.max(spec.rload, 1e-6)
  const c = Math.max(spec.c, 0)

  const gain = rl / (rs + rl)
  const tauOn = ((rs * rl) / (rs + rl)) * c
  const tauOff = rl * c
  const aOn = tauOn > 0 ? Math.exp(-dt / tauOn) : 0
  const aOff = tauOff > 0 ? Math.exp(-dt / tauOff) : 0

  let peak = 0
  for (let i = 0; i < n; i++) {
    const drive = rectify(input[i], spec.topology) - drop
    vraw[i] = drive > 0 ? drive * gain : 0
    if (drive > peak) peak = drive
  }

  const pass = (vStart: number, write: boolean): number => {
    let v = vStart
    for (let i = 0; i < n; i++) {
      const drive = rectify(input[i], spec.topology) - drop
      // Complementarity test: solve the step assuming the diode is off, then
      // check the assumption. If the drive still clears the decayed node
      // voltage the diode must have conducted, so redo the step with the
      // conducting sub-circuit. Testing against v before the decay instead
      // would leave the node with no state at all when C is zero, and the
      // falling side of every hump would chatter on and off.
      const vOff = v * aOff
      const on = drive > vOff
      if (on) {
        const vInf = drive * gain
        v = vInf + (v - vInf) * aOn
      } else {
        v = vOff
      }
      if (write) {
        vout[i] = v
        idiode[i] = on ? Math.max(0, (drive - v) / rs) : 0
      }
    }
    return v
  }

  let v = peak * gain
  for (let k = 0; k < warmup; k++) v = pass(v, false)
  pass(v, true)
  return { vout, vraw, idiode }
}

/**
 * Peak to peak ripple of a capacitor input filter, Vr = Idc / (fr*C).
 * It is the linear-discharge approximation: the cap alone supplies the load for
 * one whole ripple period, dV = I*t/C. fr is the line frequency for a half wave
 * rectifier and twice the line frequency for either full wave arrangement.
 */
export function rippleVoltage(idc: number, fRipple: number, c: number): number {
  if (fRipple <= 0) return 0 // a DC input never stops conducting, so no ripple
  return c > 0 ? idc / (fRipple * c) : Infinity
}

/** Vdc = Vpeak - drops - Vripple/2, the midpoint of the ripple sawtooth. */
export function dcOutput(vPeak: number, drop: number, vripple: number): number {
  return vPeak - drop - vripple / 2
}

export type OperatingPoint = {
  fRipple: number
  /** Peak the cap charges to, i.e. Vpeak less the diode drops. */
  vPeakOut: number
  vdc: number
  idc: number
  vripple: number
}

/**
 * Textbook operating point. Idc = Vdc/RL and Vr = Idc/(fr*C) and
 * Vdc = Vpk - Vr/2 are simultaneous, so substituting gives
 * Vdc = (Vpeak - drops) / (1 + 1/(2*fr*C*RL)).
 * Assumes a sine input and small ripple; the simulation is the authority once
 * the ripple gets large enough that the conduction angle matters.
 */
export function operatingPoint(
  spec: RectifierSpec,
  vPeak: number,
  fLine: number,
): OperatingPoint {
  const fRipple = pulses(spec.topology) * Math.max(fLine, 0)
  const vPeakOut = Math.max(0, vPeak - seriesDiodes(spec.topology) * spec.vf)
  const sag = fRipple > 0 && spec.c > 0 ? 1 / (2 * fRipple * spec.c * spec.rload) : 0
  const vdc = vPeakOut / (1 + sag)
  const idc = spec.rload > 0 ? vdc / spec.rload : 0
  return { fRipple, vPeakOut, vdc, idc, vripple: rippleVoltage(idc, fRipple, spec.c) }
}

/**
 * Peak inverse voltage across one diode.
 * Bridge: the blocking diode sits across the winding less the two conducting
 * drops, so PIV is one Vpeak.
 * Half wave and centre tapped: the blocking diode has the negative winding peak
 * on its anode and the held-up DC on its cathode, PIV = Vpeak + Vdc, which is
 * the textbook 2*Vpeak once a reservoir cap holds Vdc up near the peak.
 */
export function peakInverseVoltage(
  topology: Topology,
  vPeak: number,
  vdc: number,
): number {
  return topology === 'bridge' ? vPeak : vPeak + vdc
}

/**
 * Conduction loss. Every coulomb that reaches the load crosses seriesDiodes
 * junctions, so the total is nSeries*Vf*Idc whatever the topology, and the
 * charge is shared evenly by the diodes in the circuit.
 */
export function diodeLoss(
  topology: Topology,
  vf: number,
  idc: number,
): { total: number; perDiode: number } {
  const total = seriesDiodes(topology) * vf * idc
  return { total, perDiode: total / diodeCount(topology) }
}

export type RectifierReadout = {
  vPeakIn: number
  vRmsIn: number
  fRipple: number
  /** Measured mean of the simulated output. */
  vdc: number
  vRipplePP: number
  vRippleRms: number
  /** Vr(rms)/Vdc. 1.21 for an unfiltered half wave, 0.482 unfiltered full wave. */
  rippleFactor: number
  idc: number
  /** True load power, from the RMS output, so the ripple counts. */
  pLoad: number
  iPeak: number
  iAvgPerDiode: number
  iRmsPerDiode: number
  /** Ipeak/Idc, the crest factor the transformer and diodes actually see. */
  crestFactor: number
  /** Width of one conduction pulse, in degrees of the line cycle. */
  conductionAngle: number
  piv: number
  pDiodeTotal: number
  pDiodePer: number
  /** Closed-form comparison, see operatingPoint(). */
  ideal: OperatingPoint
  overPiv: boolean
  overCurrent: boolean
  overSurge: boolean
  /** Drops exceed the peak: the rectifier never turns on. */
  deadOutput: boolean
}

/** Everything the rectifier page reports, derived from one simulated sweep. */
export function analyse(
  spec: RectifierSpec,
  input: ArrayLike<number>,
  trace: RectifierTrace,
  fLine: number,
  diode?: Diode,
): RectifierReadout {
  const n = input.length
  let vPeakIn = 0
  for (let i = 0; i < n; i++) {
    const a = Math.abs(input[i])
    if (a > vPeakIn) vPeakIn = a
  }

  let vMin = n > 0 ? trace.vout[0] : 0
  let vMax = vMin
  let iPeak = 0
  let onCount = 0
  for (let i = 0; i < n; i++) {
    const v = trace.vout[i]
    if (v < vMin) vMin = v
    if (v > vMax) vMax = v
    const i_ = trace.idiode[i]
    if (i_ > 0) onCount++
    if (i_ > iPeak) iPeak = i_
  }

  const vdc = mean(trace.vout)
  const vRmsOut = rms(trace.vout)
  const vRippleRms = Math.sqrt(Math.max(0, vRmsOut * vRmsOut - vdc * vdc))
  const rload = Math.max(spec.rload, 1e-9)
  const idc = vdc / rload

  const nSeries = seriesDiodes(spec.topology)
  const count = diodeCount(spec.topology)
  const share = nSeries / count // fraction of the conduction time one diode sees
  const loss = diodeLoss(spec.topology, spec.vf, idc)
  const piv = peakInverseVoltage(spec.topology, vPeakIn, vdc)
  const iAvgPerDiode = idc * share

  return {
    vPeakIn,
    vRmsIn: rms(input),
    fRipple: pulses(spec.topology) * Math.max(fLine, 0),
    vdc,
    vRipplePP: vMax - vMin,
    vRippleRms,
    rippleFactor: vdc > 0 ? vRippleRms / vdc : 0,
    idc,
    pLoad: (vRmsOut * vRmsOut) / rload,
    iPeak,
    iAvgPerDiode,
    iRmsPerDiode: rms(trace.idiode) * Math.sqrt(share),
    crestFactor: idc > 0 ? iPeak / idc : 0,
    conductionAngle: n > 0 ? ((onCount / n) * 360) / pulses(spec.topology) : 0,
    piv,
    pDiodeTotal: loss.total,
    pDiodePer: loss.perDiode,
    ideal: operatingPoint(spec, vPeakIn, fLine),
    overPiv: diode ? piv > diode.vrrm : false,
    overCurrent: diode ? iAvgPerDiode > diode.io : false,
    overSurge: diode ? iPeak > diode.isurge : false,
    deadOutput: vPeakIn <= nSeries * spec.vf,
  }
}
