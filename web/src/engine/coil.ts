import { sym } from '../i18n'
import type { Key } from '../i18n'
/**
 * Series RL coil driven by a low-side switch: a relay, a solenoid, a motor
 * winding, anything with an iron core hanging off a GPIO through a transistor.
 *
 * Two things happen. While the switch is closed the current ramps toward V/R
 * with time constant L/R, storing 0.5*L*I^2 in the core. When the switch opens
 * the current cannot stop instantly, so the coil generates whatever voltage it
 * takes to keep it flowing, Vkick = L*di/dt. That is what kills the transistor.
 *
 * The time-domain solver uses exact zero-order-hold discretisation in both
 * phases (the same form as engine/rc.ts), so it stays stable and exact for any
 * dt, including dt far larger than L/R when the user drags the drive frequency.
 */
import { GPIO_MAX_MA } from './constants'
import { rms } from './signal'

/** 1N4001 forward drop at rated current, datasheet Vf at 1 A, 25 C. */
export const VF_SILICON = 0.7

/** 1N5819 Schottky forward drop, datasheet Vf at 1 A, 25 C. */
export const VF_SCHOTTKY = 0.35

/**
 * On-state drop of the low-side switch, i.e. Vce(sat) of a saturated 2N2222 at
 * a few tens of mA. A logic-level MOSFET is lower, this is the pessimistic case.
 */
export const V_SWITCH_SAT = 0.2

export type Protection = 'none' | 'silicon' | 'schottky'

export const PROTECTION_OPTIONS: ReadonlyArray<{ value: Protection; label: Key }> = [
  { value: 'none', label: 'opt.none' },
  { value: 'silicon', label: sym('1N4001') },
  { value: 'schottky', label: sym('1N5819') },
]

/** Forward drop of the freewheel diode. Zero means no clamp is fitted. */
export function clampDrop(p: Protection): number {
  return p === 'silicon' ? VF_SILICON : p === 'schottky' ? VF_SCHOTTKY : 0
}

export type CoilParams = {
  /** Supply feeding the coil, in volts. */
  supply: number
  /** Inductance in henries. */
  l: number
  /** Coil DC resistance in ohms. */
  r: number
  /** Switching frequency of the drive, in hertz. */
  frequency: number
  /** Drive duty cycle, 0 to 1. */
  duty: number
  protection: Protection
  /** Switch turn-off time in seconds. This sets di/dt, so it sets the kick. */
  turnOff: number
  /** Switch collector-emitter (or drain-source) breakdown rating, in volts. */
  vBreakdown: number
  /** Current at which the core saturates and L collapses, in amps. */
  iSat: number
}

/** Time constant of a series RL, tau = L / R. */
export function timeConstant(l: number, r: number): number {
  return r > 0 ? l / r : Infinity
}

/** Inductive reactance, XL = 2*pi*f*L. */
export function reactance(f: number, l: number): number {
  return 2 * Math.PI * f * l
}

/** Energy stored in the core, E = 0.5*L*I^2. */
export function energy(l: number, i: number): number {
  return 0.5 * l * i * i
}

/** Steady current the switch settles at, (V - Vce_sat) / R, never negative. */
export function onCurrent(supply: number, r: number): number {
  return r > 0 ? Math.max(0, (supply - V_SWITCH_SAT) / r) : 0
}

/** Charging curve, i(t) = (V/R)(1 - e^(-t*R/L)). */
export function currentAt(supply: number, r: number, l: number, t: number): number {
  const tau = timeConstant(l, r)
  if (!Number.isFinite(tau)) return 0
  return onCurrent(supply, r) * (1 - Math.exp(-t / tau))
}

/**
 * Flyback voltage generated across the coil when the switch interrupts it,
 * Vkick = L * di/dt with di/dt = -I / t_off. This is the ideal upper bound:
 * in a real board the winding's own parasitic capacitance and the transistor's
 * avalanche both hold it lower, but the bound is what sizes the part.
 */
export function kickVoltage(l: number, i: number, turnOff: number): number {
  return turnOff > 0 ? (l * i) / turnOff : Infinity
}

/**
 * Time for the freewheel current to reach zero through a clamp diode.
 * Off-state loop is L*di/dt = -(i*R + Vf), so i(t) = (I + Vf/R)e^(-t*R/L) - Vf/R
 * and i hits zero at t = (L/R)*ln(1 + I*R/Vf).
 */
export function decayTime(l: number, r: number, i: number, vf: number): number {
  if (i <= 0) return 0
  if (vf <= 0) return 0
  if (r <= 0) return (l * i) / vf // no resistance, the diode drop does all the work
  return timeConstant(l, r) * Math.log(1 + (i * r) / vf)
}

export type CoilMeasure = {
  /** Peak coil current over the last complete switching cycle. */
  iPeak: number
  /** Trough of the same cycle, so peak minus min is the ripple. */
  iMin: number
  iRms: number
}

export type CoilSim = {
  dt: number
  /** Current with the selected protection fitted. */
  clamped: Float64Array
  /** Current with no clamp at all, collapsing inside the switch turn-off time. */
  unclamped: Float64Array
  measure: CoilMeasure
}

/**
 * Sample the coil current over `cycles` switching periods.
 *
 * Switch closed: the current settles toward (V - Vce_sat)/R.
 * Switch open, diode fitted: the current freewheels and settles toward -Vf/R,
 *   but the diode blocks reverse current so the run stops at zero.
 * Switch open, no diode: the current is forced linearly to zero over t_off.
 * Both phases advance with y = target + (y - target)*exp(-dt/tau), which is the
 * exact solution at the sample instants for any dt.
 */
export function simulate(p: CoilParams, n: number, cycles: number): CoilSim {
  const freq = p.frequency > 0 ? p.frequency : 1
  const period = 1 / freq
  const span = (cycles > 0 ? cycles : 1) * period
  const dt = span / n

  const tau = timeConstant(p.l, p.r)
  const decay = Number.isFinite(tau) && tau > 0 ? Math.exp(-dt / tau) : 0
  const duty = p.duty < 0 ? 0 : p.duty > 1 ? 1 : p.duty
  const onTime = period * duty

  const vf = clampDrop(p.protection)
  const iOn = onCurrent(p.supply, p.r)
  // Freewheel target. Negative because the diode drop drives the current down.
  const iFree = p.r > 0 ? -vf / p.r : -Infinity

  const clamped = new Float64Array(n)
  const unclamped = new Float64Array(n)
  let ic = 0
  let iu = 0
  let atOpen = 0 // current latched at the instant the switch last opened

  // Sample k is the state at t = k*dt, so the initial condition lands on index 0
  // and each step advances over the interval that follows it.
  for (let k = 0; k < n; k++) {
    const t = k * dt
    const edge = Math.floor(t / period) * period + onTime
    const on = t < edge

    // With no clamp the current is dragged to zero by the switch itself.
    const collapse = (since: number) =>
      since < p.turnOff ? atOpen * (1 - since / p.turnOff) : 0

    iu = on ? ic : collapse(t - edge)
    clamped[k] = vf > 0 ? ic : iu
    unclamped[k] = iu

    if (on) {
      atOpen = ic
      ic = iOn + (ic - iOn) * decay
    } else if (vf > 0) {
      // Freewheel through the diode, and stop at zero because it blocks reverse.
      const next = iFree + (ic - iFree) * decay
      ic = next > 0 ? next : 0
    } else {
      ic = collapse(t + dt - edge)
    }
  }

  // Measure over the last complete cycle so the numbers describe the settled
  // waveform, not the first-cycle build-up.
  const per = Math.max(1, Math.round(n / (cycles > 0 ? cycles : 1)))
  const from = Math.max(0, n - per)
  const window = clamped.subarray(from)
  let iPeak = 0
  let iMin = window.length > 0 ? window[0] : 0
  for (const v of window) {
    if (v > iPeak) iPeak = v
    if (v < iMin) iMin = v
  }

  return { dt, clamped, unclamped, measure: { iPeak, iMin, iRms: rms(window) } }
}

export type CoilReadout = {
  tau: number
  /** Current the coil would settle at if left switched on, (V - Vsat)/R. */
  iSteady: number
  iPeak: number
  /** Peak to trough swing of the coil current over one switching cycle. */
  ripple: number
  /** True when the current never reaches zero, i.e. continuous conduction. */
  continuous: boolean
  /** Energy in the core at the peak, 0.5*L*Ipeak^2. */
  energyPeak: number
  xl: number
  /** Magnitude of the coil impedance at the drive frequency. */
  z: number
  /** Coil voltage the instant the switch opens with no clamp fitted. */
  kick: number
  /** What the switch actually sees with no clamp: supply plus the kick. */
  vSwitchOpen: number
  /** What a flyback diode clamps the switch to: supply plus Vf. */
  vSwitchClamped: number
  /** Forward drop of the fitted clamp, 0 when none. */
  vf: number
  hasClamp: boolean
  /** Time for the freewheel current to reach zero through the clamp. */
  release: number
  /** Average copper loss in the winding over the cycle. */
  coilPower: number
  /** Average diode dissipation, triangular freewheel current approximation. */
  diodePower: number
  /** Kick exceeds the switch breakdown rating. */
  overBreakdown: boolean
  /** Even the clamped switch node exceeds the rating. */
  clampOverBreakdown: boolean
  /** Peak current is past the core saturation point, so L is not constant. */
  saturating: boolean
  /** Coil current is beyond what an ESP32 pin can sink, so it needs a switch. */
  overGpio: boolean
}

/** Everything the coil page reports, derived from the params plus the trace. */
export function analyse(p: CoilParams, m: CoilMeasure): CoilReadout {
  const tau = timeConstant(p.l, p.r)
  const vf = clampDrop(p.protection)
  const hasClamp = vf > 0
  const kick = kickVoltage(p.l, m.iPeak, p.turnOff)
  const vSwitchOpen = p.supply + kick
  const vSwitchClamped = p.supply + vf
  const xl = reactance(p.frequency, p.l)
  const release = hasClamp ? decayTime(p.l, p.r, m.iPeak, vf) : p.turnOff

  // Freewheel current falls roughly linearly from Ipeak to zero over `release`,
  // so its average over one switching period is Ipeak*release*f/2.
  const diodePower = hasClamp ? (vf * m.iPeak * release * p.frequency) / 2 : 0

  return {
    tau,
    iSteady: onCurrent(p.supply, p.r),
    iPeak: m.iPeak,
    ripple: m.iPeak - m.iMin,
    continuous: m.iMin > 1e-9,
    energyPeak: energy(p.l, m.iPeak),
    xl,
    z: Math.hypot(p.r, xl),
    kick,
    vSwitchOpen,
    vSwitchClamped,
    vf,
    hasClamp,
    release,
    coilPower: m.iRms * m.iRms * p.r,
    diodePower,
    overBreakdown: vSwitchOpen > p.vBreakdown,
    clampOverBreakdown: vSwitchClamped > p.vBreakdown,
    saturating: m.iPeak > p.iSat,
    overGpio: m.iPeak > GPIO_MAX_MA / 1000,
  }
}
