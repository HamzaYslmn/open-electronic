/**
 * Capacitor bank maths: series/parallel combination, stored energy and charge,
 * and the RC charge/discharge curve.
 *
 * Every time-domain value here is closed form, v(t) = V(1 - e^(-t/RC)) and its
 * inverse, so the curve is exact at any sample spacing. There is no integrator
 * to go unstable when the user drags R or C and dt ends up larger than tau,
 * which is exactly where forward Euler would blow up.
 */

export type CapMode = 'series' | 'parallel'
export type CurveMode = 'charge' | 'discharge'

/** Parallel bank: C = sum(Ci). The plates just add area. */
export function parallelCapacitance(values: readonly number[]): number {
  let sum = 0
  for (const c of values) sum += c
  return sum
}

/**
 * Series bank: 1/C = sum(1/Ci), so C = 1 / sum(1/Ci).
 * Every capacitor carries the same charge and the voltages add, so the total
 * is always smaller than the smallest member. A zero member shorts the string
 * to zero capacitance.
 */
export function seriesCapacitance(values: readonly number[]): number {
  let recip = 0
  for (const c of values) {
    if (c <= 0) return 0
    recip += 1 / c
  }
  return recip > 0 ? 1 / recip : 0
}

export function combine(values: readonly number[], mode: CapMode): number {
  return mode === 'series' ? seriesCapacitance(values) : parallelCapacitance(values)
}

/** Stored energy, E = 0.5*C*V^2, in joules. */
export function energy(c: number, v: number): number {
  return 0.5 * c * v * v
}

/** Stored charge, Q = C*V, in coulombs. */
export function charge(c: number, v: number): number {
  return c * v
}

/** Time constant, tau = R*C, in seconds. */
export function timeConstant(r: number, c: number): number {
  return r * c
}

/**
 * Voltage on each member of a series string at total voltage v.
 * The charge is common, so Vi = Q/Ci = v * Ctotal / Ci: the smallest capacitor
 * takes the most voltage, which is how series strings fail in practice.
 * A parallel bank sees the full voltage on every member.
 */
export function memberVoltages(
  values: readonly number[],
  mode: CapMode,
  v: number,
): number[] {
  if (mode === 'parallel') return values.map(() => v)
  const total = seriesCapacitance(values)
  return values.map((c) => (c > 0 ? (v * total) / c : 0))
}

/** Charging from empty through R: v(t) = V*(1 - e^(-t/tau)). */
export function chargeVoltage(t: number, supply: number, tau: number): number {
  if (t <= 0) return 0
  if (tau <= 0) return supply // ideal wire, the step lands instantly
  return supply * (1 - Math.exp(-t / tau))
}

/** Discharging into R from v0: v(t) = V0 * e^(-t/tau). */
export function dischargeVoltage(t: number, v0: number, tau: number): number {
  if (t <= 0) return v0
  if (tau <= 0) return 0
  return v0 * Math.exp(-t / tau)
}

/**
 * Inverse of the charging curve: t = -tau*ln(1 - v/V).
 * Infinite when the target is at or above the supply, since the exponential
 * only approaches it. Callers must surface that rather than print a number.
 */
export function timeToCharge(target: number, supply: number, tau: number): number {
  if (supply <= 0 || tau <= 0) return target <= 0 ? 0 : Infinity
  if (target <= 0) return 0
  if (target >= supply) return Infinity
  return -tau * Math.log(1 - target / supply)
}

/** Inverse of the discharging curve: t = -tau*ln(v/V0). */
export function timeToDischarge(target: number, v0: number, tau: number): number {
  if (v0 <= 0 || tau <= 0) return target >= v0 ? 0 : Infinity
  if (target >= v0) return 0
  if (target <= 0) return Infinity
  return -tau * Math.log(target / v0)
}

export type CapCurve = {
  /** Voltage across the capacitor, volts. */
  vc: Float64Array
  /** Voltage across the series resistor, volts. Sign follows the current. */
  vr: Float64Array
}

/**
 * Sample the charge or discharge curve into scope buffers.
 * Evaluated point by point from the closed form, so the trace is exact and
 * bounded by the supply no matter how coarse dt is.
 */
export function curve(
  n: number,
  dt: number,
  supply: number,
  tau: number,
  mode: CurveMode,
): CapCurve {
  const vc = new Float64Array(n)
  const vr = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const t = i * dt
    if (mode === 'charge') {
      vc[i] = chargeVoltage(t, supply, tau)
      // KVL round the loop: the resistor takes whatever the capacitor has not.
      vr[i] = supply - vc[i]
    } else {
      vc[i] = dischargeVoltage(t, supply, tau)
      // Current reverses on discharge, so the resistor drop flips sign.
      vr[i] = -vc[i]
    }
  }
  return { vc, vr }
}

export type CapacitorInput = {
  values: readonly number[]
  mode: CapMode
  /** Series resistance, ohms. */
  r: number
  /** Supply for charging, or the starting voltage for discharging. */
  supply: number
  /** Voltage the user wants a time for. */
  target: number
  curveMode: CurveMode
}

export type CapacitorReadout = {
  /** Combined capacitance of the bank, farads. */
  total: number
  tau: number
  /** Charge at the full supply, coulombs. */
  q: number
  /** Energy at the full supply, joules. */
  e: number
  /** Energy stored once the target voltage is reached, joules. */
  eTarget: number
  /** Time to reach the target voltage. Infinite when unreachable. */
  tTarget: number
  /** 10% to 90% transition, 2.197*tau. */
  tRise: number
  /** 5 tau, i.e. 99.3% settled. */
  tSettle: number
  /** Inrush at t = 0, supply/R, amps. */
  peakCurrent: number
  /**
   * Energy burned in R over a full charge. Equals the energy stored, whatever
   * R is: the classic half-CV-squared result.
   */
  eResistor: number
  /** Highest voltage on any single member of the bank. */
  maxMemberVoltage: number
  /** False when the target sits where the exponential never gets to. */
  reachable: boolean
}

export function analyse(input: CapacitorInput): CapacitorReadout {
  const { values, mode, r, supply, target, curveMode } = input
  const total = combine(values, mode)
  const tau = timeConstant(r, total)
  const tTarget =
    curveMode === 'charge'
      ? timeToCharge(target, supply, tau)
      : timeToDischarge(target, supply, tau)

  return {
    total,
    tau,
    q: charge(total, supply),
    e: energy(total, supply),
    eTarget: energy(total, Math.min(target, supply)),
    tTarget,
    tRise: 2.197 * tau, // ln(9) * tau
    tSettle: 5 * tau,
    peakCurrent: r > 0 ? supply / r : Infinity,
    eResistor: energy(total, supply),
    maxMemberVoltage: Math.max(0, ...memberVoltages(values, mode, supply)),
    reachable: Number.isFinite(tTarget),
  }
}
