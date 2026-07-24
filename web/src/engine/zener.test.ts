import { describe, expect, it } from 'vitest'
import {
  analyse,
  largestE24AtMost,
  lineRegulation,
  maxZenerCurrent,
  operate,
  outputImpedance,
  seriesResistor,
} from './zener'
import type { ZenerDesign } from './zener'

/** 5 V USB rail down to 3.3 V with a 1N4728A (3.3 V, 1 W, Zzt 10 ohm). */
const BASE: ZenerDesign = {
  vinMin: 4.75,
  vinMax: 5.25,
  vz: 3.3,
  rz: 10,
  pzMax: 1,
  izMin: 0.005,
  ilMin: 0,
  ilMax: 0.02,
  rs: 56,
}

describe('series resistor sizing', () => {
  it('matches the textbook Rs = (Vin - Vz)/(Iz + IL)', () => {
    // 12 V in, 5.1 V zener, 5 mA keep-alive, 20 mA load -> 6.9 / 0.025 = 276 ohm
    expect(seriesResistor(12, 5.1, 0.005, 0.02)).toBeCloseTo(276, 9)
  })

  it('brackets Rs between the power limit and the regulation limit', () => {
    const r = analyse(BASE)
    // Iz_max = 0.5 * 1 W / 3.3 V = 151.5 mA -> Rs_min = 1.95 / 0.1515 = 12.87 ohm
    expect(r.izMaxAllowed).toBeCloseTo(maxZenerCurrent(1, 3.3), 12)
    expect(r.rsMin).toBeCloseTo(12.87, 2)
    // Rs_max = (4.75 - 3.3) / (5 mA + 20 mA) = 58 ohm
    expect(r.rsMax).toBeCloseTo(58, 9)
    expect(r.windowValid).toBe(true)
    // Biggest E24 part inside the window wastes the least current.
    expect(r.rsSuggested).toBe(56)
  })

  it('snaps to E24, and gives up when the window is empty', () => {
    expect(largestE24AtMost(58)).toBe(56)
    expect(largestE24AtMost(1000)).toBe(1000)
    expect(largestE24AtMost(4.7)).toBeCloseTo(4.7, 12)
    expect(largestE24AtMost(0.99)).toBeCloseTo(0.91, 12)
    expect(Number.isNaN(largestE24AtMost(0))).toBe(true)
    // A 100 mW part can only take 15.2 mA derated, so Rs_min climbs past Rs_max.
    const r = analyse({ ...BASE, pzMax: 0.1 })
    expect(r.rsMin).toBeGreaterThan(r.rsMax)
    expect(r.windowValid).toBe(false)
    expect(Number.isNaN(r.rsSuggested)).toBe(true)
  })
})

describe('operating point', () => {
  it('shunts the current the load leaves behind', () => {
    // (10 - 5)/100 = 50 mA through Rs, 20 mA to the load, 30 mA to the zener.
    const op = operate(10, 100, 0.02, 5)
    expect(op.vout).toBe(5)
    expect(op.iz).toBeCloseTo(0.03, 12)
    expect(op.pz).toBeCloseTo(0.15, 12) // Pz = Vz * Iz
    expect(op.prs).toBeCloseTo(0.25, 12) // 50 mA^2 * 100 ohm
    expect(op.regulating).toBe(true)
  })

  it('falls out of regulation into a plain series drop', () => {
    // Not enough headroom: the zener never conducts, Vout = Vin - IL*Rs.
    const op = operate(5, 100, 0.01, 5.1)
    expect(op.iz).toBe(0)
    expect(op.regulating).toBe(false)
    expect(op.vout).toBeCloseTo(4, 12)
    expect(op.vout).toBeLessThan(5.1)
  })

  it('puts worst case zener stress at Vin max with the lightest load', () => {
    const corners = [
      [BASE.vinMin, BASE.ilMin],
      [BASE.vinMin, BASE.ilMax],
      [BASE.vinMax, BASE.ilMax],
    ]
    const hot = analyse(BASE).hot
    for (const [vin, il] of corners) {
      expect(operate(vin, BASE.rs, il, BASE.vz).pz).toBeLessThanOrEqual(hot.pz)
    }
    // (5.25 - 3.3)/56 = 34.8 mA, so 115 mW in a 1 W part.
    expect(hot.iz).toBeCloseTo(0.03482, 5)
    expect(hot.pz).toBeCloseTo(0.11491, 5)
    expect(analyse(BASE).overPower).toBe(false)
  })

  it('flags over-power and dropout at the right resistor values', () => {
    // 5 ohm: 390 mA into a 1 W, 3.3 V zener is 1.29 W. Cooked.
    const small = analyse({ ...BASE, rs: 5 })
    expect(small.overPower).toBe(true)
    expect(small.pzFraction).toBeGreaterThan(1)
    // 100 ohm: only 14.5 mA available at Vin min, less than the 20 mA load.
    const big = analyse({ ...BASE, rs: 100 })
    expect(big.dropout).toBe(true)
    expect(big.cold.regulating).toBe(false)
    // Vin has to reach Vz + Rs*(Izmin + ILmax) = 3.3 + 100*0.025 = 5.8 V.
    expect(big.vinDropout).toBeCloseTo(5.8, 9)
  })
})

describe('regulation quality', () => {
  it('divides input ripple by Rs and Zz', () => {
    // dVout/dVin = 10 / 110, and Rs || Zz = 1000/110 = 9.09 ohm.
    expect(lineRegulation(100, 10)).toBeCloseTo(1 / 11, 12)
    expect(outputImpedance(100, 10)).toBeCloseTo(9.0909, 4)
    // An ideal zener (Zz = 0) is a perfect clamp: no ripple, no output impedance.
    expect(lineRegulation(100, 0)).toBe(0)
    expect(outputImpedance(100, 0)).toBe(0)
    const r = analyse(BASE)
    expect(r.rippleDb).toBeCloseTo(20 * Math.log10(10 / 66), 9)
    expect(r.loadSwing).toBeCloseTo(outputImpedance(56, 10) * 0.02, 12)
  })
})
