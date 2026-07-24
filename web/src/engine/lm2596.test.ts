import { describe, expect, it } from 'vitest'
import {
  FSW,
  ILIM_MIN,
  VREF,
  analyse,
  dutyCycle,
  feedbackR2,
  inductorWave,
  operate,
  outputVoltage,
  rippleCurrent,
} from './lm2596'
import type { BuckDesign } from './lm2596'
import { mean } from './signal'

/** 12 V wall supply into the stock module: 33 uH, 220 uF, SS34 catch diode. */
const BASE: BuckDesign = {
  vin: 12,
  voutTarget: 5,
  iout: 1,
  r1: 1000,
  series: 'E96',
  l: 33e-6,
  cout: 220e-6,
  esr: 0.1,
  vd: 0.5,
  dcr: 0.05,
  thetaJA: 50,
  tAmbC: 25,
}

describe('feedback divider', () => {
  it('matches the datasheet worked example', () => {
    // LM2596 datasheet: R1 = 1 kOhm, Vout = 5 V gives R2 = 3.07 kOhm.
    expect(feedbackR2(5, 1000)).toBeCloseTo(3065, 0)
    // FB tied straight to the output (R2 = 0) parks at the reference.
    expect(outputVoltage(1000, 0)).toBe(VREF)
    expect(outputVoltage(1000, 1690)).toBeCloseTo(3.3087, 4)
  })

  it('round trips a target through the divider equation', () => {
    for (const v of [1.5, 3.3, 5, 12, 24]) {
      expect(outputVoltage(2200, feedbackR2(v, 2200))).toBeCloseTo(v, 12)
    }
  })
})

describe('duty and ripple', () => {
  it('collapses to D = Vout/Vin with ideal parts', () => {
    // von = Vin - Vout, voff = Vout when the switch and diode drops vanish.
    expect(dutyCycle(12 - 3.3, 3.3)).toBeCloseTo(3.3 / 12, 12)
    expect(dutyCycle(24 - 5, 5)).toBeCloseTo(5 / 24, 12)
  })

  it('gives the textbook inductor ripple', () => {
    // 12 V to 5 V, D = 5/12, 33 uH at 150 kHz: dIL = 5·(7/12)/(150k·33u).
    expect(rippleCurrent(5, 5 / 12, FSW, 33e-6)).toBeCloseTo(0.58923, 5)
    // Ripple is inversely proportional to L, so doubling L halves it.
    const a = rippleCurrent(5, 5 / 12, FSW, 33e-6)
    const b = rippleCurrent(5, 5 / 12, FSW, 66e-6)
    expect(a / b).toBeCloseTo(2, 12)
  })

  it('balances volt-seconds at the real operating point', () => {
    const op = operate(12, 5, 1, 33e-6, 0.5, 0.05)
    expect(op.ccm).toBe(true)
    // Rise over the on-time must equal the fall over the off-time, or the
    // current would walk away cycle to cycle.
    const rise = op.slopeOn * (op.duty / FSW)
    const fall = op.slopeOff * (op.diodeFraction / FSW)
    expect(rise).toBeCloseTo(fall, 12)
    expect(rise).toBeCloseTo(op.ripple, 12)
    expect(op.ipk - op.ivalley).toBeCloseTo(op.ripple, 12)
  })
})

describe('conduction mode', () => {
  it('drops into DCM below half a ripple of load and keeps the average', () => {
    const heavy = operate(12, 5, 1, 33e-6, 0.5, 0.05)
    const light = operate(12, 5, 0.1, 33e-6, 0.5, 0.05)
    expect(light.ccm).toBe(false)
    expect(light.ivalley).toBe(0)
    // Less on-time per cycle than CCM, and the diode stops conducting early.
    expect(light.duty).toBeLessThan(heavy.duty)
    expect(light.duty + light.diodeFraction).toBeLessThan(1)

    // The waveform is the whole claim: its mean must be the load current in
    // both modes, since the capacitor cannot pass DC.
    for (const [op, iout] of [
      [heavy, 1],
      [light, 0.1],
    ] as const) {
      const { samples } = inductorWave(op, 4, 8192)
      expect(mean(samples) / iout).toBeCloseTo(1, 2)
      expect(samples.every((v) => v >= 0 && v <= op.ipk + 1e-9)).toBe(true)
    }
  })
})

describe('losses and limits', () => {
  it('reports a plausible efficiency that falls as the input rises', () => {
    const low = analyse(BASE)
    const high = analyse({ ...BASE, vin: 24 })
    // A 12 V to 5 V buck at 1 A lands in the high 80s on this loss budget.
    expect(low.efficiency).toBeGreaterThan(0.85)
    expect(low.efficiency).toBeLessThan(0.95)
    // More input means a shorter duty, so the diode conducts longer and the
    // quiescent current costs more power.
    expect(high.efficiency).toBeLessThan(low.efficiency)
    expect(high.pDiode).toBeGreaterThan(low.pDiode)
    // Energy has to balance: in equals out plus the itemised losses.
    expect(low.pIn).toBeCloseTo(
      low.pOut + low.pSwitch + low.pDiode + low.pInductor + low.pQuiescent,
      12,
    )
    expect(low.iin * BASE.vin).toBeCloseTo(low.pIn, 12)
    expect(low.tj).toBeCloseTo(BASE.tAmbC + BASE.thetaJA * low.pIc, 12)
  })

  it('flags every datasheet limit it is pushed past', () => {
    expect(analyse({ ...BASE, vin: 4 }).vinLow).toBe(true)
    expect(analyse({ ...BASE, vin: 45 }).vinHigh).toBe(true)
    expect(analyse({ ...BASE, iout: 4 }).overCurrent).toBe(true)
    expect(analyse({ ...BASE, iout: 3.5 }).op.ipk).toBeGreaterThan(ILIM_MIN)
    expect(analyse({ ...BASE, iout: 3.5 }).overLimit).toBe(true)
    // Worst case for the die is full current at a high duty, i.e. the lowest
    // input that still regulates. 8 V to 5 V at 3 A in still air cooks it.
    const hot = analyse({ ...BASE, vin: 8, iout: 3 })
    expect(hot.dropout).toBe(false)
    expect(hot.overTemp).toBe(true)
    // Only the switch and the quiescent draw heat the IC, not the diode.
    expect(hot.pIc).toBeCloseTo(hot.pSwitch + hot.pQuiescent, 12)
    // A buck cannot boost: asking for 5 V from a 5 V rail is dropout.
    const dry = analyse({ ...BASE, vin: 5 })
    expect(dry.dropout).toBe(true)
    expect(dry.headroom).toBeLessThan(0)
    expect(dry.op.duty).toBe(1)
  })
})

describe('numerical robustness', () => {
  it('stays finite and bounded across the whole parameter space', () => {
    for (const vin of [4, 5, 12, 24, 40, 45]) {
      for (const voutTarget of [1.23, 3.3, 5, 12]) {
        for (const iout of [0, 1e-3, 0.5, 3, 4]) {
          for (const l of [4.7e-6, 33e-6, 470e-6]) {
            const r = analyse({ ...BASE, vin, voutTarget, iout, l })
            const bad = [...Object.entries(r), ...Object.entries(r.op)].filter(
              ([, v]) => typeof v === 'number' && !Number.isFinite(v),
            )
            expect(bad.map(([k]) => k), `${vin} V, ${iout} A, ${l} H`).toEqual([])
            expect(r.op.duty).toBeGreaterThanOrEqual(0)
            expect(r.op.duty).toBeLessThanOrEqual(1)
            expect(r.efficiency).toBeGreaterThanOrEqual(0)
            expect(r.efficiency).toBeLessThanOrEqual(1)
            const { samples } = inductorWave(r.op, 3, 1024)
            expect(samples.every(Number.isFinite)).toBe(true)
          }
        }
      }
    }
  })
})
