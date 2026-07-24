/**
 * N-channel MOSFET used as a low side switch, driven straight from an ESP32 GPIO.
 *
 * The point of this model is the gate drive margin. A datasheet quotes RDS(on) at
 * some VGS (often 10 V), and a 3.3 V GPIO cannot get anywhere near it. The square
 * law channel model below reproduces that: RDS(on) is not a constant, it is
 * 1/(k*(VGS - Vth)) and it blows up as VGS approaches the threshold.
 *
 * Operating point is solved in closed form against the resistive load line, so
 * there is no iteration and nothing to diverge. The switching waveform is
 * piecewise linear and evaluated directly at each sample time, i.e. exact at any
 * dt, so dragging the frequency slider cannot destabilise it.
 *
 * Square law reference: Sedra and Smith, Microelectronic Circuits, MOSFET
 * triode and saturation regions. Switching loss reference: the standard
 * hard switching approximation used in every gate driver application note.
 */

import { T_AMBIENT_K, VCC, VCC_5V } from './constants'

/** Kelvin at 0 degrees Celsius. Everything internal is kelvin; convert at the UI edge. */
export const CELSIUS_ZERO_K = 273.15

/** Absolute maximum junction temperature of a common plastic package, 150 C. */
export const TJ_MAX_K = CELSIUS_ZERO_K + 150

/** Absolute maximum VGS of a typical power MOSFET, from the datasheet ratings table. */
export const VGS_MAX = 20

export function toCelsius(kelvin: number): number {
  return kelvin - CELSIUS_ZERO_K
}

/** cutoff: channel off. triode: ohmic, i.e. a good switch. saturation: constant current. */
export type Region = 'cutoff' | 'triode' | 'saturation'

export type MosfetParams = {
  /** Gate drive voltage the GPIO actually delivers, V. */
  vgsDrive: number
  /** Gate threshold voltage VGS(th), V. */
  vth: number
  /** RDS(on) as quoted on the datasheet, ohms. */
  rdsOnSpec: number
  /** The VGS that quote is taken at. A datasheet condition, not a supply rail. */
  vgsSpec: number
  /** Drain rail feeding the load, V. */
  vSupply: number
  /** Load resistance, ohms. */
  rLoad: number
  /** Switching frequency, Hz. */
  fsw: number
  /** Duty cycle, 0 to 1. */
  duty: number
  /** Datasheet turn-on transition time, s. */
  tr: number
  /** Datasheet turn-off transition time, s. */
  tf: number
  /** Total gate charge Qg, coulombs. */
  qg: number
  /** Series gate resistor, ohms. */
  rg: number
  /** Junction to ambient thermal resistance, K/W. */
  rthJA: number
  /** Ambient temperature, kelvin. */
  ta: number
}

/**
 * IRLZ44N in a TO-220, free air, switching a 5 V load.
 *
 * The gate runs off VCC because that is all an ESP32 GPIO has. The drain rail is
 * VCC_5V because the loads a GPIO cannot drive directly, i.e. a WS2812 strip, a
 * 5 V fan or a relay coil, sit on 5 V or higher. That is the whole reason the FET
 * is in the circuit.
 */
export const DEFAULTS: MosfetParams = {
  vgsDrive: VCC,
  vth: 2.0, // IRLZ44N VGS(th) is specified 1.0 to 2.0 V, take the worst case
  rdsOnSpec: 0.022, // 22 mohm
  vgsSpec: 5, // datasheet condition for the 22 mohm figure
  vSupply: VCC_5V,
  rLoad: 5,
  fsw: 1_000,
  duty: 0.5,
  tr: 100e-9,
  tf: 50e-9,
  qg: 48e-9,
  rg: 330,
  rthJA: 62, // TO-220 in free air, no heatsink
  ta: T_AMBIENT_K,
}

/**
 * Square law transconductance parameter k, in A/V^2.
 *
 * Deep in triode Id = k*(VGS - Vth)*VDS, so the channel looks like a resistor of
 * 1/(k*(VGS - Vth)). Invert that at the datasheet operating point:
 *   k = 1 / (RDS(on)_spec * (VGS_spec - Vth))
 */
export function kFactor(rdsOnSpec: number, vgsSpec: number, vth: number): number {
  const ov = vgsSpec - vth
  return ov > 0 && rdsOnSpec > 0 ? 1 / (rdsOnSpec * ov) : 0
}

/**
 * RDS(on) at an arbitrary gate drive: rds = 1/(k*(VGS - Vth)), i.e.
 *   RDS(on)(VGS) = RDS(on)_spec * (VGS_spec - Vth) / (VGS - Vth)
 * Returns Infinity at or below threshold, where there is no channel.
 */
export function rdsOnAt(
  rdsOnSpec: number,
  vgsSpec: number,
  vth: number,
  vgs: number,
): number {
  const ov = vgs - vth
  if (ov <= 0) return Infinity
  const k = kFactor(rdsOnSpec, vgsSpec, vth)
  return k > 0 ? 1 / (k * ov) : Infinity
}

/** Saturation (constant current) drain current, Id = 0.5*k*(VGS - Vth)^2. */
export function saturationCurrent(k: number, vgs: number, vth: number): number {
  const ov = vgs - vth
  return ov > 0 ? 0.5 * k * ov * ov : 0
}

/** Triode drain current, Id = k*((VGS - Vth)*VDS - VDS^2/2), valid for VDS < VGS - Vth. */
export function triodeCurrent(k: number, vgs: number, vth: number, vds: number): number {
  const ov = vgs - vth
  if (ov <= 0 || vds <= 0) return 0
  // Past pinch-off the parabola folds back down, which is unphysical, so clamp.
  const v = Math.min(vds, ov)
  return k * (ov * v - (v * v) / 2)
}

/** Drain current picking the right region for the given VDS. */
export function drainCurrent(k: number, vgs: number, vth: number, vds: number): number {
  const ov = vgs - vth
  if (ov <= 0 || vds <= 0) return 0
  return vds < ov ? triodeCurrent(k, vgs, vth, vds) : saturationCurrent(k, vgs, vth)
}

export type OperatingPoint = {
  region: Region
  /** Drain current at the solved operating point, A. */
  id: number
  /** Drain to source voltage at the solved operating point, V. */
  vds: number
  /** Overdrive VGS - Vth, V. Negative means the channel never opens. */
  vov: number
  /** Chord resistance VDS/ID at the operating point, ohms. */
  rdsOp: number
}

/**
 * Intersect the channel characteristic with the resistive load line
 * VDS = Vsupply - ID*Rload. Closed form, no iteration.
 *
 * Saturation branch: ID = 0.5*k*Vov^2 directly, valid while the resulting VDS
 * still exceeds Vov. Triode branch: substituting the load line into
 * ID = k*(Vov*VDS - VDS^2/2) gives
 *   (k*Rl/2)*VDS^2 - (k*Rl*Vov + 1)*VDS + Vsupply = 0
 * whose smaller root is the physical one (the larger root sits past pinch-off).
 */
export function operatingPoint(
  k: number,
  vgs: number,
  vth: number,
  vSupply: number,
  rLoad: number,
): OperatingPoint {
  const vov = vgs - vth
  if (vov <= 0 || k <= 0 || vSupply <= 0) {
    return { region: 'cutoff', id: 0, vds: Math.max(vSupply, 0), vov, rdsOp: Infinity }
  }

  const rl = Math.max(rLoad, 1e-9)
  const idSat = 0.5 * k * vov * vov
  const vdsSat = vSupply - idSat * rl
  if (vdsSat >= vov) {
    return { region: 'saturation', id: idSat, vds: vdsSat, vov, rdsOp: vdsSat / idSat }
  }

  const a = k * rl
  const b = a * vov + 1
  // In the triode branch the discriminant is provably above 1, but guard anyway.
  const disc = b * b - 2 * a * vSupply
  const vds = disc > 0 ? (b - Math.sqrt(disc)) / a : vov
  const id = (vSupply - vds) / rl
  return { region: 'triode', id, vds, vov, rdsOp: id > 0 ? vds / id : Infinity }
}

/**
 * Miller plateau voltage: the VGS that sustains the load current in saturation,
 * from Id = 0.5*k*(VGS - Vth)^2 rearranged, VGS = Vth + sqrt(2*Id/k).
 * The gate sits here while VDS slews, which is the flat part of the gate trace.
 */
export function plateauVoltage(k: number, vth: number, id: number): number {
  return k > 0 && id > 0 ? vth + Math.sqrt((2 * id) / k) : vth
}

/** Conduction loss, Pcond = D * Id^2 * RDS(on). D is the fraction of the period conducting. */
export function conductionLoss(id: number, rds: number, duty = 1): number {
  return Number.isFinite(rds) ? duty * id * id * rds : 0
}

/**
 * Hard switching loss, Psw = 0.5 * Vds * Id * (tr + tf) * fsw.
 *
 * Each transition is modelled as current rise at full VDS followed by voltage
 * fall at full ID, giving a triangular power pulse of area 0.5*V*I*t. That is
 * the clamped inductive case, the conservative one. A purely resistive crossover
 * with both quantities ramping together would give V*I*t/6 instead.
 */
export function switchingLoss(
  vds: number,
  id: number,
  tr: number,
  tf: number,
  fsw: number,
): number {
  return 0.5 * vds * id * (tr + tf) * fsw
}

/** Gate drive loss, Pgate = Qg * Vdrive * fsw. Burned in Rg and the GPIO driver, not the FET. */
export function gateDriveLoss(qg: number, vgsDrive: number, fsw: number): number {
  return qg * vgsDrive * fsw
}

/** Peak gate current when the drive steps: Ig = Vdrive / Rg, since Ciss looks like a short. */
export function gatePeakCurrent(vgsDrive: number, rg: number): number {
  return rg > 0 ? vgsDrive / rg : Infinity
}

/**
 * Lower bound on a transition: t = Qg / Ig_peak = Qg * Rg / Vdrive.
 * Real gate current falls as VGS rises, so the true time is longer, but this
 * already shows when the gate resistor, not the die, sets the switching speed.
 */
export function gateChargeTime(qg: number, rg: number, vgsDrive: number): number {
  return vgsDrive > 0 ? (qg * rg) / vgsDrive : Infinity
}

/** Junction temperature, Tj = Ta + P * Rth(j-a). Kelvin in, kelvin out. */
export function junctionTemp(ta: number, power: number, rthJA: number): number {
  return ta + power * rthJA
}

export type MosfetAnalysis = OperatingPoint & {
  k: number
  /** RDS(on) the datasheet quote scales to at the actual gate drive, ohms. */
  rdsOn: number
  /** Current an ideal (zero ohm) switch would pass, A. */
  idIdeal: number
  vPlateau: number
  /** Transition times after the gate drive limit is applied, s. */
  trEff: number
  tfEff: number
  tGate: number
  igPeak: number
  pCond: number
  pSw: number
  pGate: number
  /** Channel dissipation, i.e. what heats the junction. Gate loss is not included. */
  pTotal: number
  pLoad: number
  efficiency: number
  tj: number
  /** VGS is at or below Vth, the FET never turns on at all. */
  belowThreshold: boolean
  /** VGS is under the voltage the RDS(on) quote assumes, so RDS(on) is higher than the datasheet. */
  underDriven: boolean
  /** Peak gate current exceeds the GPIO rating. */
  gateOverCurrent: boolean
  /** Transitions eat more than 20% of the period, the switch model stops holding. */
  transitionBound: boolean
  overTemp: boolean
  overGateRating: boolean
}

export function analyse(p: MosfetParams, gpioMaxA: number): MosfetAnalysis {
  const k = kFactor(p.rdsOnSpec, p.vgsSpec, p.vth)
  const op = operatingPoint(k, p.vgsDrive, p.vth, p.vSupply, p.rLoad)
  const duty = Math.min(Math.max(p.duty, 0), 1)

  const igPeak = gatePeakCurrent(p.vgsDrive, p.rg)
  const tGate = gateChargeTime(p.qg, p.rg, p.vgsDrive)
  // A transition cannot be faster than the drive can move the gate charge.
  const trEff = Math.max(p.tr, tGate)
  const tfEff = Math.max(p.tf, tGate)

  const pCond = conductionLoss(op.id, op.rdsOp, duty)
  // With no switching there is no crossover loss.
  const switching = p.fsw > 0 && duty > 0 && duty < 1
  const pSw = switching ? switchingLoss(p.vSupply, op.id, trEff, tfEff, p.fsw) : 0
  const pGate = switching ? gateDriveLoss(p.qg, p.vgsDrive, p.fsw) : 0
  const pTotal = pCond + pSw

  const pLoad = duty * op.id * op.id * Math.max(p.rLoad, 0)
  const period = p.fsw > 0 ? 1 / p.fsw : Infinity

  return {
    ...op,
    k,
    rdsOn: rdsOnAt(p.rdsOnSpec, p.vgsSpec, p.vth, p.vgsDrive),
    idIdeal: p.rLoad > 0 ? p.vSupply / p.rLoad : Infinity,
    vPlateau: plateauVoltage(k, p.vth, op.id),
    trEff,
    tfEff,
    tGate,
    igPeak,
    pCond,
    pSw,
    pGate,
    pTotal,
    pLoad,
    efficiency: pLoad + pTotal > 0 ? pLoad / (pLoad + pTotal) : 0,
    tj: junctionTemp(p.ta, pTotal, p.rthJA),
    belowThreshold: p.vgsDrive <= p.vth,
    underDriven: p.vgsDrive < p.vgsSpec,
    gateOverCurrent: igPeak > gpioMaxA,
    transitionBound: switching && trEff + tfEff > 0.2 * period,
    overTemp: junctionTemp(p.ta, pTotal, p.rthJA) > TJ_MAX_K,
    overGateRating: p.vgsDrive > VGS_MAX,
  }
}

export type MosfetWaveform = {
  dt: number
  vgs: Float64Array
  vds: Float64Array
  id: Float64Array
  /** Instantaneous channel dissipation vds*id, W. */
  p: Float64Array
}

/**
 * One switching cycle, drawn piecewise linear and evaluated in closed form at
 * every sample, so it is exact for any dt and cannot blow up.
 *
 * Turn-on window: first half is current rise at full VDS, second half is voltage
 * fall at full ID. Turn-off mirrors it. Integrating vds*id over that shape gives
 * exactly 0.5*V*I*(tr + tf) per period, which is the closed form above.
 *
 * The gate trace shows the Miller plateau across the voltage slewing half. The
 * jump from the plateau to the full drive voltage is drawn as a step: it is real
 * gate charge, but it happens after the drain has finished moving and it carries
 * no loss, so it is not worth its own time constant here.
 */
export function waveform(
  p: MosfetParams,
  a: MosfetAnalysis,
  n: number,
  cycles: number,
): MosfetWaveform {
  const fsw = Math.max(p.fsw, 1e-9)
  const period = 1 / fsw
  const duty = Math.min(Math.max(p.duty, 0.001), 0.999)
  const ton = duty * period
  const toff = period - ton

  // Keep each transition inside its own phase so the piecewise description holds.
  const tr = Math.min(a.trEff, 0.9 * ton)
  const tf = Math.min(a.tfEff, 0.9 * toff)

  const dt = (cycles * period) / n
  const vgs = new Float64Array(n)
  const vds = new Float64Array(n)
  const id = new Float64Array(n)
  const pw = new Float64Array(n)

  const vOff = p.vSupply
  const vOn = a.region === 'cutoff' ? p.vSupply : a.vds
  const iOn = a.id
  const drive = p.vgsDrive
  // With no channel there is no plateau, so the gate just ramps to the drive rail.
  const top = a.region === 'cutoff' ? drive : a.vPlateau

  for (let i = 0; i < n; i++) {
    const tc = (i * dt) % period
    let g = 0
    let v = vOff
    let d = 0

    if (tr > 0 && tc < tr) {
      const u = tc / tr
      if (u < 0.5) {
        d = iOn * 2 * u
        v = vOff
        g = top * 2 * u
      } else {
        d = iOn
        v = vOff + (vOn - vOff) * (2 * u - 1)
        g = top
      }
    } else if (tc < ton) {
      d = iOn
      v = vOn
      g = drive
    } else if (tf > 0 && tc < ton + tf) {
      const u = (tc - ton) / tf
      if (u < 0.5) {
        d = iOn
        v = vOn + (vOff - vOn) * 2 * u
        g = top
      } else {
        d = iOn * (2 - 2 * u)
        v = vOff
        g = top * (2 - 2 * u)
      }
    }

    vgs[i] = g
    vds[i] = v
    id[i] = d
    pw[i] = v * d
  }

  return { dt, vgs, vds, id, p: pw }
}
