/**
 * Parallel current divider: 2 to 4 branches sharing one node pair.
 *
 * Every branch sees the same node voltage, so Kirchhoff's current law splits the
 * total in proportion to conductance:
 *   G = 1/R,  sum(G) = G1 + G2 + ...,  Req = 1 / sum(G),
 *   V = Itotal * Req,  Ix = V / Rx = Itotal * Gx / sum(G)
 * The familiar two-branch form Ix = Itotal * Rother / (R1 + R2) is that same
 * expression with sum(G) written out, not a separate rule.
 *
 * Pure numbers in base SI throughout: ohms, siemens, amps, volts, watts.
 */

import { GPIO_MAX_MA } from './constants'

/** Dissipation rating of a plain through-hole axial resistor, in watts. */
export const QUARTER_WATT = 0.25

/** Conductance G = 1/R, in siemens. R at or below zero is a short, i.e. infinite G. */
export function conductance(r: number): number {
  return r > 0 ? 1 / r : Infinity
}

/** sum(G) over the bank. Infinite if any branch is a short. */
export function totalConductance(resistors: readonly number[]): number {
  let sum = 0
  for (const r of resistors) sum += conductance(r)
  return sum
}

/**
 * Equivalent resistance of the bank, Req = 1 / sum(1/Rx).
 * Always lower than the smallest branch. Empty bank is an open circuit.
 */
export function equivalentResistance(resistors: readonly number[]): number {
  if (resistors.length === 0) return Infinity
  const sumG = totalConductance(resistors)
  if (!Number.isFinite(sumG)) return 0 // a short across the bank collapses it
  return sumG > 0 ? 1 / sumG : Infinity
}

/** Index of the first zero-or-negative branch, or -1. That branch is a short. */
function shortIndex(resistors: readonly number[]): number {
  return resistors.findIndex((r) => r <= 0)
}

/**
 * Branch currents for a given total, Ix = Itotal * Gx / sum(G).
 * A shorted branch takes the whole total and starves the rest; with more than
 * one short the split is indeterminate, so the first one is credited with it.
 */
export function branchCurrents(
  resistors: readonly number[],
  total: number,
): number[] {
  const short = shortIndex(resistors)
  if (short >= 0) return resistors.map((_, i) => (i === short ? total : 0))
  const sumG = totalConductance(resistors)
  if (sumG <= 0) return resistors.map(() => 0)
  return resistors.map((r) => (total * (1 / r)) / sumG)
}

/** Fraction of the total each branch carries, Gx / sum(G). Independent of Itotal. */
export function currentShares(resistors: readonly number[]): number[] {
  return branchCurrents(resistors, 1)
}

/** Dissipation in one branch, P = I²R. */
export function branchPower(current: number, r: number): number {
  return current * current * r
}

/**
 * How the bank is fed. A real current source is the textbook case; a rail
 * through a series resistance is what an ESP32 project actually looks like.
 */
export type Drive =
  | { kind: 'current'; current: number }
  | { kind: 'voltage'; supply: number; series: number }

/**
 * Current delivered into the bank. A voltage source sees Rs in series with Req,
 * so Itotal = Vs / (Rs + Req). An ideal current source delivers its setting
 * whatever the bank does.
 */
export function sourceCurrent(drive: Drive, req: number): number {
  if (drive.kind === 'current') return drive.current
  const loop = drive.series + req
  return loop > 0 ? drive.supply / loop : Infinity
}

export type BranchResult = {
  /** Branch resistance, ohms. */
  r: number
  /** Branch conductance, siemens. */
  g: number
  /** Branch current, amps. */
  current: number
  /** Gx / sum(G), i.e. the fraction of the total this branch carries. */
  share: number
  /** I²R, watts. */
  power: number
  /** Over the per-resistor rating passed to analyse. */
  overPower: boolean
}

export type CurrentDividerReadout = {
  branches: BranchResult[]
  /** 1 / sum(G), ohms. */
  req: number
  /** Voltage across the bank, V = Itotal * Req. */
  voltage: number
  /** Total current into the bank, amps. */
  total: number
  /** Sum of the branch dissipations, equal to V * Itotal. */
  totalPower: number
  /** Largest branch current, amps. */
  maxCurrent: number
  /** Any branch over its power rating. */
  anyOverPower: boolean
  /** Total draw past what one ESP32 GPIO may source or sink. */
  overGpio: boolean
  /** A branch resistance at or below zero, so the bank is shorted. */
  shorted: boolean
}

/** Everything the current divider page reports, derived once per change. */
export function analyse(
  resistors: readonly number[],
  drive: Drive,
  rating = QUARTER_WATT,
): CurrentDividerReadout {
  const req = equivalentResistance(resistors)
  const total = sourceCurrent(drive, req)
  const currents = branchCurrents(resistors, total)
  const shares = currentShares(resistors)

  const branches: BranchResult[] = resistors.map((r, i) => {
    const power = branchPower(currents[i], r)
    return {
      r,
      g: conductance(r),
      current: currents[i],
      share: shares[i],
      power,
      overPower: power > rating,
    }
  })

  let totalPower = 0
  let maxCurrent = 0
  for (const b of branches) {
    totalPower += b.power
    if (Math.abs(b.current) > Math.abs(maxCurrent)) maxCurrent = b.current
  }

  return {
    branches,
    req,
    voltage: Number.isFinite(req) ? total * req : NaN,
    total,
    totalPower,
    maxCurrent,
    anyOverPower: branches.some((b) => b.overPower),
    overGpio: Math.abs(total) > GPIO_MAX_MA / 1000,
    shorted: shortIndex(resistors) >= 0,
  }
}
