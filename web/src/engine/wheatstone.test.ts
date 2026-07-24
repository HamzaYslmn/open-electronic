import { describe, expect, it } from 'vitest'
import { VCC } from './constants'
import {
  ADC_LSB,
  ARMS,
  analyse,
  armValue,
  balanceResistance,
  excitationCurrent,
  nodeVoltages,
  outputVoltage,
  sensitivity,
  sweepArm,
  theveninImpedance,
  withArm,
} from './wheatstone'
import type { Bridge } from './wheatstone'

const equal: Bridge = { vin: VCC, r1: 1000, r2: 1000, r3: 1000, r4: 1000 }

describe('bridge output', () => {
  it('nulls whenever R1/R2 equals R3/R4', () => {
    expect(outputVoltage(equal)).toBe(0)
    // Ratios matter, absolute values do not: 1k/2k against 2k/4k is still 0.5.
    const scaled: Bridge = { vin: VCC, r1: 1000, r2: 2000, r3: 2000, r4: 4000 }
    expect(outputVoltage(scaled)).toBeCloseTo(0, 15)
    const r = analyse(scaled, 'R4')
    expect(r.balanced).toBe(true)
    expect(r.ratioLeft).toBeCloseTo(r.ratioRight, 12)
    // Both taps sit at 2/3 of the rail.
    expect(r.va).toBeCloseTo((2 * VCC) / 3, 12)
  })

  it('matches the divider pair by hand when off balance', () => {
    // Left tap 1/2, right tap 2/3 -> Vout = 3.3·(0.5 - 0.6667) = -0.55 V
    const b: Bridge = { vin: VCC, r1: 1000, r2: 1000, r3: 1000, r4: 2000 }
    const { va, vb } = nodeVoltages(b)
    expect(va).toBeCloseTo(1.65, 12)
    expect(vb).toBeCloseTo(2.2, 12)
    expect(outputVoltage(b)).toBeCloseTo(-0.55, 12)
  })

  it('follows the quarter bridge law, Vout = -Vin·x/(2·(2+x))', () => {
    const x = 1e-3 // 1000 microstrain on a GF=2 gauge, i.e. dR/R = 0.001
    const b = withArm(equal, 'R4', 1000 * (1 + x))
    const exact = (-VCC * x) / (2 * (2 + x))
    expect(outputVoltage(b)).toBeCloseTo(exact, 15)
    // The textbook linear rule Vout = -Vin/4·x is 0.05% high at this deviation.
    const linear = (-VCC / 4) * x
    expect(Math.abs(outputVoltage(b) / linear - 1)).toBeLessThan(1e-3)
    // Small-signal sensitivity per unit dR/R is exactly Vin/4 at balance.
    expect(analyse(equal, 'R4').sensFractional).toBeCloseTo(-VCC / 4, 15)
    expect(sensitivity(equal, 'R4')).toBeCloseTo(-VCC / 4000, 15)
  })
})

describe('sensitivity and balance', () => {
  const skew: Bridge = { vin: VCC, r1: 470, r2: 1000, r3: 2200, r4: 1500 }

  it('agrees with a numerical derivative on every arm', () => {
    for (const { value: arm } of ARMS) {
      const r = armValue(skew, arm)
      const h = r * 1e-5
      const up = outputVoltage(withArm(skew, arm, r + h))
      const down = outputVoltage(withArm(skew, arm, r - h))
      const numeric = (up - down) / (2 * h)
      expect(sensitivity(skew, arm) / numeric).toBeCloseTo(1, 8)
    }
    // Adjacent arms push the output opposite ways, which is what lets a
    // half bridge double the signal.
    expect(Math.sign(sensitivity(skew, 'R1'))).toBe(-Math.sign(sensitivity(skew, 'R2')))
    expect(Math.sign(sensitivity(skew, 'R3'))).toBe(-Math.sign(sensitivity(skew, 'R4')))
  })

  it('reports the arm value that nulls the bridge, for any arm', () => {
    expect(outputVoltage(skew)).not.toBeCloseTo(0, 3)
    for (const { value: arm } of ARMS) {
      const trimmed = withArm(skew, arm, balanceResistance(skew, arm))
      expect(Math.abs(outputVoltage(trimmed))).toBeLessThan(1e-12)
      expect(analyse(trimmed, arm).balanced).toBe(true)
    }
    // R4 balance is R2·R3/R1 = 1000·2200/470
    expect(balanceResistance(skew, 'R4')).toBeCloseTo(4680.851, 3)
  })
})

describe('loading, power and limits', () => {
  it('gives Rth = R1||R2 + R3||R4 and flags a source the ADC cannot sample', () => {
    expect(theveninImpedance(equal)).toBeCloseTo(1000, 12)
    expect(theveninImpedance({ vin: VCC, r1: 1000, r2: 1000, r3: 2000, r4: 2000 })).toBeCloseTo(
      1500,
      12,
    )
    // 100k arms -> 100k source, well past the 10k the ESP32 S&H can settle.
    const stiff = analyse({ vin: VCC, r1: 100e3, r2: 100e3, r3: 100e3, r4: 99e3 }, 'R4')
    expect(stiff.rth).toBeCloseTo(99748.7, 1)
    expect(stiff.overRth).toBe(true)
    expect(analyse(equal, 'R4').overRth).toBe(false)
  })

  it('conserves power and flags a cooked arm or an unreadable output', () => {
    const hot: Bridge = { vin: VCC, r1: 10, r2: 10, r3: 10, r4: 10 }
    const r = analyse(hot, 'R4')
    // Each branch draws 3.3/20 = 165 mA, so the bridge draws 330 mA.
    expect(excitationCurrent(hot)).toBeCloseTo(0.33, 12)
    expect(r.power).toBeCloseTo(VCC * 0.33, 12) // sum of I²R equals Vin·I
    expect(r.maxArmPower).toBeCloseTo(0.165 * 0.165 * 10, 12) // 272 mW
    expect(r.overPower).toBe(true)

    // A balanced bridge puts out nothing, which is below one ADC count.
    expect(ADC_LSB).toBeCloseTo(3.3 / 4096, 12)
    expect(analyse(equal, 'R4').belowLsb).toBe(true)
    const big = analyse({ vin: VCC, r1: 1000, r2: 1000, r3: 1000, r4: 2000 }, 'R4')
    expect(big.belowLsb).toBe(false)
    expect(big.counts).toBeCloseTo(0.55 / ADC_LSB, 6)
  })
})

describe('arm sweep', () => {
  it('tracks the closed form, crosses zero at balance and stays finite', () => {
    const b = withArm(equal, 'R4', 1100)
    const n = 512
    const s = sweepArm(b, 'R4', 550, 1650, n)

    expect(s.vout.length).toBe(n)
    expect(s.step).toBeCloseTo(1100 / (n - 1), 12)
    expect(s.vout[0]).toBeCloseTo(outputVoltage(withArm(b, 'R4', 550)), 15)
    expect(s.vout[n - 1]).toBeCloseTo(outputVoltage(withArm(b, 'R4', 1650)), 15)
    for (let i = 0; i < n; i++) expect(Number.isFinite(s.vout[i])).toBe(true)

    // Monotonically falling: more R4 means a higher B tap means a lower Vout.
    for (let i = 1; i < n; i++) expect(s.vout[i]).toBeLessThan(s.vout[i - 1])

    // Balance is at R4 = 1000, inside the window, so the curve changes sign.
    const cross = s.vout.findIndex((v) => v < 0)
    expect(Math.abs(550 + cross * s.step - 1000)).toBeLessThanOrEqual(s.step)

    // The tangent meets the curve at the operating point and drifts away from
    // it: that gap is the single-arm bridge nonlinearity.
    const opIndex = Math.round((1100 - 550) / s.step)
    expect(s.tangent[opIndex]).toBeCloseTo(s.vout[opIndex], 4)
    expect(Math.abs(s.tangent[0] - s.vout[0])).toBeGreaterThan(
      Math.abs(s.tangent[opIndex] - s.vout[opIndex]),
    )
  })
})
