import { describe, expect, it } from 'vitest'
import {
  I_ADJ,
  I_OUT_MAX,
  TJ_MAX_K,
  V_REF,
  ZERO_C_K,
  adjustResistor,
  analyse,
  dissipation,
  junctionTemp,
  maxProgramResistor,
  nearestE24,
  outputVoltage,
  requiredSinkResistance,
  suggest,
  thermalCurve,
} from './lm317'
import type { LM317Design } from './lm317'

/** The classic ESP32 supply: 9 V wall wart down to 3.3 V, TO-220 on a small sink. */
const base: LM317Design = {
  vin: 9,
  r1: 240,
  r2: 390,
  iout: 0.4,
  ambientK: 25 + ZERO_C_K,
  rthJC: 4,
  rthCS: 0.5,
  rthSA: 10,
  rthJA: 50,
  heatsink: true,
}

describe('lm317 divider', () => {
  it('reproduces the reference 240/390 design', () => {
    // 1.25*(1 + 390/240) = 3.28125, plus 50 uA * 390 = 19.5 mV
    expect(outputVoltage(240, 390)).toBeCloseTo(3.30075, 6)
    // R2 = 0 shorts ADJ to ground, so the output is the bare reference
    expect(outputVoltage(240, 0)).toBe(V_REF)
    // Vref / 5 mA = 250 ohm is the minimum load limit, so 240 passes, 270 does not
    expect(maxProgramResistor()).toBeCloseTo(250, 9)
    expect(analyse({ ...base, r1: 240 }).minLoadOk).toBe(true)
    expect(analyse({ ...base, r1: 270 }).minLoadOk).toBe(false)
  })

  it('solves R2 for a target and lands back on it', () => {
    const r2 = adjustResistor(3.3, 240)
    expect(r2).toBeCloseTo(389.86, 2)
    expect(outputVoltage(240, r2)).toBeCloseTo(3.3, 12)
    // and the nearest stock part is the value on every reference schematic
    expect(nearestE24(r2)).toBe(390)
    expect(suggest(3.3, 240).r2E24).toBe(390)
    expect(Math.abs(suggest(3.3, 240).errorPct)).toBeLessThan(0.1)
  })

  it('shows Iadj taking over once the divider is scaled up', () => {
    // Iadj*R2 is the whole difference between the two forms, by construction
    expect(outputVoltage(10e3, 10e3) - outputVoltage(10e3, 10e3, 0)).toBeCloseTo(
      I_ADJ * 10e3,
      12,
    )
    // 10k/10k should give 2.5 V but the 50 uA adds 0.5 V, a 20% error
    expect(outputVoltage(10e3, 10e3, 0)).toBeCloseTo(2.5, 12)
    expect(outputVoltage(10e3, 10e3)).toBeCloseTo(3.0, 12)
    // the same ratio in the 240 ohm world is a 0.6% error
    expect(outputVoltage(240, 240) - outputVoltage(240, 240, 0)).toBeCloseTo(0.012, 6)
  })

})

describe('lm317 thermals', () => {
  it('computes textbook dissipation, junction temperature and sink size', () => {
    // 12 V in, 5 V out, 500 mA: 7 V across the pass element
    expect(dissipation(12, 5, 0.5)).toBeCloseTo(3.5, 12)
    // 3.5 W into 10 K/W from 25 C ambient is a 35 K rise, i.e. 60 C
    expect(junctionTemp(25 + ZERO_C_K, 3.5, 10) - ZERO_C_K).toBeCloseTo(60, 12)
    // (125 - 25)/5 W = 20 K/W total, minus 4 junction-to-case and 0.5 interface
    expect(requiredSinkResistance(5, 25 + ZERO_C_K, 4, 0.5)).toBeCloseTo(15.5, 12)
    // 30 W at 25 C ambient needs 3.33 K/W total, which the package alone eats
    expect(requiredSinkResistance(30, 25 + ZERO_C_K, 4, 0.5)).toBeLessThan(0)
  })

  it('flags dropout below 3 V of headroom and clears it above', () => {
    const tight = analyse({ ...base, vin: 5 }) // 1.7 V of headroom
    expect(tight.dropout).toBe(true)
    expect(tight.vinMin).toBeCloseTo(6.30075, 5)
    expect(analyse({ ...base, vin: 7 }).dropout).toBe(false)
    // below dropout the pass element is saturated, never a negative dissipation
    expect(analyse({ ...base, vin: 2 }).pd).toBe(0)
  })

  it('needs a heatsink in free air and is comfortable with one', () => {
    const r = analyse(base)
    // (9 - 3.30075) * (0.4 + 5.208 mA) = 2.309 W
    expect(r.pd).toBeCloseTo(2.3094, 3)
    // 50 K/W bare TO-220 is a 115 K rise, i.e. 140 C: past the 125 C limit
    expect(r.tjFreeAirK - ZERO_C_K).toBeCloseTo(140.5, 1)
    expect(r.needsHeatsink).toBe(true)
    expect(r.heatsinkImpossible).toBe(false)
    // 4 + 0.5 + 10 = 14.5 K/W brings the junction back to 58 C
    expect(r.rthTotal).toBe(14.5)
    expect(r.tjK - ZERO_C_K).toBeCloseTo(58.5, 1)
    expect(r.overTemp).toBe(false)
    // without the sink the same design cooks
    expect(analyse({ ...base, heatsink: false }).overTemp).toBe(true)
  })

  it('reports a current ceiling that lands exactly on Tj max', () => {
    const r = analyse(base)
    expect(r.ioutThermal).toBeGreaterThan(base.iout)
    // running at the reported ceiling must put the junction on the limit
    expect(analyse({ ...base, iout: r.ioutThermal }).tjK).toBeCloseTo(TJ_MAX_K, 9)
    // a cold, low-headroom design is limited by the part's rating, not by heat
    const easy = analyse({ ...base, vin: 6.5, rthSA: 2 })
    expect(easy.ioutThermal).toBeGreaterThan(I_OUT_MAX)
    expect(easy.ioutCeiling).toBe(I_OUT_MAX)
  })

  it('sweeps a straight, monotonic Tj curve that agrees with analyse', () => {
    const n = 2048
    const { di, tjK, tjFreeAirK } = thermalCurve(base, n)
    expect(di).toBeCloseTo(I_OUT_MAX / (n - 1), 12)

    // no load still dissipates the divider current
    expect(tjK[0]).toBeCloseTo(analyse({ ...base, iout: 0 }).tjK, 9)
    // the curve must agree with the single-point solver at an arbitrary index
    const k = 1234
    expect(tjK[k]).toBeCloseTo(analyse({ ...base, iout: k * di }).tjK, 9)
    expect(tjFreeAirK[k]).toBeCloseTo(
      analyse({ ...base, iout: k * di, heatsink: false }).tjK,
      9,
    )

    // monotonic rising and linear: equal steps in current, equal steps in temperature
    const step = tjK[1] - tjK[0]
    expect(step).toBeGreaterThan(0)
    for (let i = 1; i < n; i++) {
      expect(tjK[i]).toBeGreaterThan(tjK[i - 1])
      expect(tjK[i] - tjK[i - 1]).toBeCloseTo(step, 9)
    }
  })
})
