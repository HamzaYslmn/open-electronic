import { describe, expect, it } from 'vitest'
import { VCC } from './constants'
import {
  analyse,
  branchCurrents,
  currentShares,
  equivalentResistance,
} from './currentDivider'

describe('equivalent resistance', () => {
  it('halves for two equal branches and quarters for four', () => {
    expect(equivalentResistance([1000, 1000])).toBeCloseTo(500, 9)
    expect(equivalentResistance([1000, 1000, 1000, 1000])).toBeCloseTo(250, 9)
  })

  it('stays below the smallest branch, whatever else is added', () => {
    const smallest = 220
    for (const bank of [
      [smallest, 1e6],
      [smallest, 4700, 10_000],
      [smallest, 330, 470, 1000],
    ]) {
      expect(equivalentResistance(bank)).toBeLessThan(smallest)
    }
    // product over sum: 220 || 330 = 220*330/550 = 132
    expect(equivalentResistance([220, 330])).toBeCloseTo(132, 9)
  })
})

describe('branch currents', () => {
  it('matches the two-branch product-over-sum form, at any total', () => {
    // I1 = I * R2/(R1+R2): 4 mA through 1k || 3k -> 3 mA and 1 mA
    const [i1, i2] = branchCurrents([1000, 3000], 4e-3)
    expect(i1).toBeCloseTo(3e-3, 12)
    expect(i2).toBeCloseTo(1e-3, 12)
    // The split is a conductance ratio, so it does not move with the total.
    const [s1, s2] = currentShares([1000, 3000])
    expect(s1).toBeCloseTo(0.75, 12)
    expect(s2).toBeCloseTo(0.25, 12)
    expect(branchCurrents([1000, 3000], 400e-3)[0]).toBeCloseTo(300e-3, 12)
  })

  it('obeys KCL for four unequal branches', () => {
    const bank = [120, 470, 2200, 33_000]
    const total = 37e-3
    const currents = branchCurrents(bank, total)
    expect(currents.reduce((a, b) => a + b, 0)).toBeCloseTo(total, 12)
    // Every branch carries Itotal * Req / Rx, i.e. the same node voltage.
    const v = total * equivalentResistance(bank)
    bank.forEach((r, i) => expect(currents[i]).toBeCloseTo(v / r, 12))
  })

})

describe('analyse', () => {
  it('loads a 3V3 rail through a series resistor', () => {
    // 3.3 V, Rs = 100, bank = 1k || 1k = 500 -> I = 3.3/600 = 5.5 mA, V = 2.75 V
    const r = analyse([1000, 1000], { kind: 'voltage', supply: VCC, series: 100 })
    expect(r.req).toBeCloseTo(500, 9)
    expect(r.total).toBeCloseTo(5.5e-3, 12)
    expect(r.voltage).toBeCloseTo(2.75, 12)
    expect(r.branches[0].current).toBeCloseTo(2.75e-3, 12)
    expect(r.overGpio).toBe(false)
    expect(r.anyOverPower).toBe(false)
  })

  it('conserves power: sum of I²R equals V·Itotal', () => {
    const bank = [470, 1500, 6800]
    const total = 20e-3
    const r = analyse(bank, { kind: 'current', current: total })
    expect(r.totalPower).toBeCloseTo(r.voltage * total, 12)
    expect(r.totalPower).toBeCloseTo(total * total * r.req, 12)
    // Hottest branch is the lowest resistance, since it takes the most current.
    expect(r.branches[0].power).toBeGreaterThan(r.branches[2].power)
  })

  it('flags a bank past the GPIO limit and past the resistor rating', () => {
    // 200 mA into 100 || 100 -> 100 mA each, P = 0.1²·100 = 1 W in a 0.25 W part
    const r = analyse([100, 100], { kind: 'current', current: 200e-3 })
    expect(r.branches[0].power).toBeCloseTo(1, 12)
    expect(r.anyOverPower).toBe(true)
    expect(r.overGpio).toBe(true) // 200 mA past the 12 mA pin rating
  })

  it('gives the whole current to a shorted branch', () => {
    const r = analyse([0, 1000], { kind: 'current', current: 10e-3 })
    expect(r.shorted).toBe(true)
    expect(r.req).toBe(0)
    expect(r.branches[0].current).toBeCloseTo(10e-3, 12)
    expect(r.branches[1].current).toBe(0)
    expect(r.voltage).toBe(0)
  })
})
