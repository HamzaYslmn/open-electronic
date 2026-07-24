import { describe, expect, it } from 'vitest'
import { RPM_PER_RAD_S, analyse, simulate } from './motor'
import type { Motor } from './motor'

/** A generic 12 V brushed motor, the middle preset. */
const M: Motor = {
  supply: 12,
  duty: 1,
  kv: 500,
  resistance: 3,
  inductance: 1e-3,
  inertia: 5e-6,
  friction: 1e-6,
  loadTorque: 0,
  fpwm: 20_000,
}

describe('dc motor', () => {
  it('ties the torque constant to the speed constant', () => {
    // kt [N·m/A] and ke [V·s/rad] are the same number in SI.
    const r = analyse(M)
    expect(r.kt).toBeCloseTo(r.ke, 12)
    expect(r.ke).toBeCloseTo(60 / (2 * Math.PI * 500), 12)
  })

  it('approaches the no-load speed when nothing loads the shaft', () => {
    const r = analyse({ ...M, friction: 0 })
    // With no friction and no load the back EMF must equal the supply.
    expect(r.backEmf).toBeCloseTo(12, 9)
    expect(r.speedRpm).toBeCloseTo(12 * 500, 6)
    expect(r.current).toBeCloseTo(0, 9)
  })

  it('draws stall current with the rotor held', () => {
    // A load past the stall torque cannot be turned at all.
    const r = analyse({ ...M, loadTorque: 10 })
    expect(r.stalled).toBe(true)
    expect(r.speedRpm).toBe(0)
    expect(r.current).toBeCloseTo(12 / 3, 9)
  })

  it('makes stall current far larger than the running current', () => {
    const r = analyse({ ...M, loadTorque: 2e-3 })
    expect(r.stalled).toBe(false)
    expect(r.stallCurrent).toBeGreaterThan(r.current * 5)
  })

  it('scales speed with duty', () => {
    const full = analyse({ ...M, friction: 0 })
    const half = analyse({ ...M, duty: 0.5, friction: 0 })
    expect(half.speedRpm).toBeCloseTo(full.speedRpm / 2, 6)
  })

  it('balances torque against load in steady state', () => {
    const load = 1.5e-3
    const r = analyse({ ...M, loadTorque: load })
    // Motor torque covers the load plus what viscous friction eats.
    expect(r.torque).toBeCloseTo(load + M.friction * r.speedRad, 12)
    expect(r.kt * r.current).toBeCloseTo(r.torque, 12)
  })

  it('peaks the ripple at half duty', () => {
    const half = analyse({ ...M, duty: 0.5 }).ripple
    expect(analyse({ ...M, duty: 0.25 }).ripple).toBeLessThan(half)
    expect(analyse({ ...M, duty: 0.75 }).ripple).toBeLessThan(half)
    // Vs·D·(1-D)/(f·L) at D = 0.5.
    expect(half).toBeCloseTo((12 * 0.25) / (20_000 * 1e-3), 9)
  })

  it('starts with an inrush spike and settles to the steady state', () => {
    const r = analyse(M)
    const t = simulate(M, 4096, 40 * r.mechanicalTau)
    let peak = 0
    for (const i of t.current) peak = Math.max(peak, i)
    // Nothing opposes the supply at t = 0 but the winding resistance.
    expect(peak).toBeGreaterThan(r.current * 10)
    expect(peak).toBeLessThanOrEqual(12 / 3 + 1e-6)
    // And it must converge, not oscillate away.
    expect(t.current[t.current.length - 1]).toBeCloseTo(r.current, 3)
    expect(t.speedRpm[t.speedRpm.length - 1]).toBeCloseTo(r.speedRpm, 0)
  })

  it('stays finite across extreme parameters', () => {
    for (const inductance of [1e-6, 1e-1]) {
      for (const inertia of [1e-8, 1e-2]) {
        const t = simulate({ ...M, inductance, inertia }, 512, 1)
        for (const i of t.current) expect(Number.isFinite(i)).toBe(true)
        for (const w of t.speedRpm) expect(Number.isFinite(w)).toBe(true)
      }
    }
  })

  it('converts rad/s to rpm the standard way', () => {
    expect(RPM_PER_RAD_S).toBeCloseTo(9.5493, 4)
  })
})
