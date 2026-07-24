import type { Key } from '../i18n'
import { expm2, steadyState } from './state2'
import type { Matrix2 } from './state2'

/**
 * Brushed DC motor on a PWM driver.
 *
 * Two coupled first-order systems, which is why a motor is neither a resistor
 * nor an inductor and why it browns out a supply that looked adequate on paper:
 *
 *   electrical:  L·di/dt = v - i·R - ke·w        (back EMF opposes the supply)
 *   mechanical:  J·dw/dt = kt·i - b·w - Tload    (torque accelerates the rotor)
 *
 * At standstill there is no back EMF, so the winding is just R and the current
 * is the stall current, several times the running figure. That surge is what
 * trips a driver or drops the rail an ESP32 is sharing.
 *
 * In SI the torque and back-EMF constants are the same number, kt [N·m/A] =
 * ke [V·s/rad], which follows from the motor being lossless as an energy
 * converter. Datasheets quote Kv in rpm/V instead, hence the conversion.
 *
 * References: Fitzgerald, Electric Machinery, ch. 7; Franklin, Powell &
 * Emami-Naeini, Feedback Control of Dynamic Systems, DC motor model.
 */

export const RPM_PER_RAD_S = 60 / (2 * Math.PI)

/** Driver dead time and diode drops are ignored; this is the ideal-bridge case. */
export type Motor = {
  /** Supply feeding the bridge, in volts. */
  supply: number
  /** PWM duty, 0 to 1. */
  duty: number
  /** Speed constant in rpm per volt, as datasheets quote it. */
  kv: number
  /** Winding resistance, ohms. */
  resistance: number
  /** Winding inductance, henries. */
  inductance: number
  /** Rotor inertia, kg·m². */
  inertia: number
  /** Viscous friction, N·m per rad/s. */
  friction: number
  /** Load torque opposing rotation, N·m. */
  loadTorque: number
  /** PWM switching frequency, Hz. */
  fpwm: number
}

export type MotorReadout = {
  /** Back-EMF constant, V·s/rad. Equal to the torque constant in SI. */
  ke: number
  kt: number
  /** Average voltage the bridge applies. */
  applied: number
  speedRad: number
  speedRpm: number
  current: number
  torque: number
  backEmf: number
  /** Free-running speed at this duty with no load and no friction. */
  noLoadRpm: number
  /** Current with the rotor held still: supply over winding resistance. */
  stallCurrent: number
  stallTorque: number
  /** Peak-to-peak current ripple from chopping the supply. */
  ripple: number
  electricalTau: number
  mechanicalTau: number
  pElectrical: number
  pMechanical: number
  pCopper: number
  efficiency: number
  /** The load is more than the motor can turn at this duty. */
  stalled: boolean
}

export function analyse(m: Motor): MotorReadout {
  const ke = m.kv > 0 ? RPM_PER_RAD_S / m.kv : Infinity
  const kt = ke
  const applied = m.supply * m.duty

  // Steady state of the two equations solved together.
  const denominator = kt * ke + m.resistance * m.friction
  let speedRad = (kt * applied - m.resistance * m.loadTorque) / denominator
  let stalled = false
  if (!(speedRad > 0)) {
    // Not enough torque to turn: the rotor sits still and draws the stall
    // current, which is the case that damages drivers.
    stalled = true
    speedRad = 0
  }

  const current = stalled ? applied / m.resistance : (m.friction * speedRad + m.loadTorque) / kt
  const backEmf = ke * speedRad
  const torque = kt * current
  const shaftTorque = Math.max(torque - m.friction * speedRad, 0)

  const pElectrical = applied * current
  const pMechanical = shaftTorque * speedRad
  const pCopper = current * current * m.resistance

  return {
    ke,
    kt,
    applied,
    speedRad,
    speedRpm: speedRad * RPM_PER_RAD_S,
    current,
    torque,
    backEmf,
    noLoadRpm: applied * m.kv,
    stallCurrent: applied / m.resistance,
    stallTorque: (kt * applied) / m.resistance,
    // Same chopped-inductor ripple as a buck: the winding is the inductor.
    ripple:
      m.fpwm > 0 && m.inductance > 0
        ? (m.supply * m.duty * (1 - m.duty)) / (m.fpwm * m.inductance)
        : 0,
    electricalTau: m.inductance / m.resistance,
    // The classic mechanical time constant, set by how hard the back EMF
    // brakes the rotor rather than by friction.
    mechanicalTau: (m.inertia * m.resistance) / (kt * ke),
    pElectrical,
    pMechanical,
    pCopper,
    efficiency: pElectrical > 0 ? pMechanical / pElectrical : 0,
    stalled,
  }
}

export type MotorTrace = {
  dt: number
  current: Float64Array
  speedRpm: number[]
}

/**
 * Startup from rest at a fixed duty, stepped with exact zero-order-hold
 * discretisation so the inrush spike is real rather than a sampling artefact.
 */
export function simulate(m: Motor, samples: number, seconds: number): MotorTrace {
  const r = analyse(m)
  const dt = seconds / samples
  const a: Matrix2 = [
    [-m.resistance / m.inductance, -r.ke / m.inductance],
    [r.kt / m.inertia, -m.friction / m.inertia],
  ]
  // The load torque is a second, constant input; folding it into B with u = 1
  // keeps the solver to one input.
  const b: [number, number] = [r.applied / m.inductance, -m.loadTorque / m.inertia]
  const [ssCurrent, ssSpeed] = steadyState(a, b, 1)

  const phi = expm2(a, dt)
  const current = new Float64Array(samples)
  const speedRpm: number[] = new Array(samples)

  let i = 0
  let w = 0
  for (let n = 0; n < samples; n++) {
    current[n] = i
    speedRpm[n] = w * RPM_PER_RAD_S
    const di = i - ssCurrent
    const dw = w - ssSpeed
    i = ssCurrent + phi[0][0] * di + phi[0][1] * dw
    w = ssSpeed + phi[1][0] * di + phi[1][1] * dw
    // A motor held by its load cannot be driven backwards by this model.
    if (w < 0) w = 0
  }

  return { dt, current, speedRpm }
}

/** Ready-made motors, so the page opens on something recognisable. */
export const MOTORS: ReadonlyArray<{
  value: string
  label: Key
  supply: number
  kv: number
  resistance: number
  inductance: number
  inertia: number
  friction: number
}> = [
  {
    value: 'n20',
    label: 'motor-drive.n20',
    supply: 6,
    kv: 1000,
    resistance: 8,
    inductance: 1.5e-3,
    inertia: 1.5e-7,
    friction: 2e-7,
  },
  {
    value: 'rs385',
    label: 'motor-drive.rs385',
    supply: 12,
    kv: 500,
    resistance: 3,
    inductance: 1e-3,
    inertia: 5e-6,
    friction: 1e-6,
  },
  {
    value: 'rs775',
    label: 'motor-drive.rs775',
    supply: 12,
    kv: 800,
    resistance: 0.6,
    inductance: 3e-4,
    inertia: 4e-5,
    friction: 6e-6,
  },
]
