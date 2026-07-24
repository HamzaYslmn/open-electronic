import { describe, expect, it } from 'vitest'
import { VCC } from './constants'
import {
  analyse,
  dividerOutput,
  loadedOutput,
  outputImpedance,
  parallel,
} from './divider'

describe('unloaded divider', () => {
  it('halves the rail with two equal resistors', () => {
    // 3.3 V across 10k + 10k taps at exactly half.
    expect(dividerOutput(VCC, 10_000, 10_000)).toBeCloseTo(1.65, 12)
    // 10k over 20k is 2/3 of 3.3 V = 2.2 V, the classic LiPo sense divider.
    expect(dividerOutput(VCC, 10_000, 20_000)).toBeCloseTo(2.2, 12)
  })

  it('depends on the ratio, not the absolute values', () => {
    // Scaling both legs by 1000 changes the current, not the voltage.
    expect(dividerOutput(VCC, 10, 30)).toBeCloseTo(dividerOutput(VCC, 10_000, 30_000), 12)
  })
})

describe('output impedance', () => {
  it('is the parallel combination of both legs', () => {
    expect(outputImpedance(10_000, 10_000)).toBeCloseTo(5_000, 9)
    // 10k || 20k = 200M/30k = 6.667k
    expect(outputImpedance(10_000, 20_000)).toBeCloseTo(20_000 / 3, 6)
    // An open leg leaves the other one alone.
    expect(parallel(4_700, Infinity)).toBe(4_700)
  })
})

describe('loading', () => {
  it('matches the Thevenin form Vout*RL/(RL+Zout)', () => {
    const [vin, r1, r2, rl] = [VCC, 6_800, 3_300, 47_000]
    const thevenin =
      dividerOutput(vin, r1, r2) * (rl / (rl + outputImpedance(r1, r2)))
    expect(loadedOutput(vin, r1, r2, rl)).toBeCloseTo(thevenin, 12)
  })

  it('halves the output when RL equals Zout', () => {
    // 10k/10k has Zout = 5k, so a 5k load costs exactly 50%.
    const r = analyse(VCC, 10_000, 10_000, 5_000)
    expect(r.voutLoaded).toBeCloseTo(r.vout / 2, 12)
    expect(r.errorPct).toBeCloseTo(-50, 9)
    expect(r.stiffness).toBeCloseTo(1, 9)
  })

  it('costs 1/11 of the output at RL = 10*Zout', () => {
    // Error is -Zout/(Zout+RL), so ten times Zout gives -9.0909%.
    const r = analyse(VCC, 10_000, 10_000, 50_000)
    expect(r.errorPct).toBeCloseTo(-100 / 11, 9)
  })

  it('is untouched by an open load', () => {
    const r = analyse(VCC, 10_000, 20_000, Infinity)
    expect(r.voutLoaded).toBeCloseTo(r.vout, 12)
    expect(r.errorV).toBe(0)
    expect(r.iLoad).toBe(0)
    expect(r.iSupply).toBeCloseTo(r.iQuiescent, 12)
  })
})

describe('currents and power', () => {
  it('obeys KCL at the tap and conserves power', () => {
    const r = analyse(VCC, 6_800, 3_300, 22_000)
    // The R1 current splits between R2 and the load.
    expect(r.iSupply).toBeCloseTo(r.iR2 + r.iLoad, 12)
    // Everything the supply delivers ends up in one of the three resistors.
    expect(r.pR1 + r.pR2 + r.pLoad).toBeCloseTo(r.pTotal, 12)
  })

  it('flags a divider that cooks a 1/10 W part and one that upsets the ADC', () => {
    // 10R + 10R on 3.3 V draws 165 mA and burns 272 mW per resistor.
    const hot = analyse(VCC, 10, 10, Infinity)
    expect(hot.iQuiescent).toBeCloseTo(0.165, 12)
    expect(hot.pR1).toBeCloseTo(0.165 * 0.165 * 10, 9)
    expect(hot.overPower).toBe(true)
    expect(hot.adcUnfriendly).toBe(false)

    // 1M + 1M sips 1.65 uA but presents 500k to the sample-and-hold.
    const cold = analyse(VCC, 1e6, 1e6, Infinity)
    expect(cold.overPower).toBe(false)
    expect(cold.adcUnfriendly).toBe(true)
    expect(cold.zout).toBeCloseTo(500_000, 6)
  })
})
