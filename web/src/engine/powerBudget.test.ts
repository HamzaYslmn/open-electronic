import { describe, expect, it } from 'vitest'
import {
  COULOMBS_PER_AH,
  DEFAULT_DERATING,
  MA_PER_CHANNEL,
  SECONDS_PER_DAY,
  analyseDeepSleep,
  analyseSolar,
  analyseStrip,
} from './powerBudget'

describe('duty cycled battery life', () => {
  // A typical sensor node: 80 mA for 3 s, then 10 uA for an hour.
  const PROFILE = {
    activeCurrent: 0.08,
    activeTime: 3,
    sleepCurrent: 10e-6,
    sleepTime: 3600,
  }

  it('averages current over the whole cycle', () => {
    const r = analyseDeepSleep(PROFILE, 2, 3.7)
    // (0.08*3 + 10e-6*3600) / 3603 = 0.276/3603 = 76.6 uA
    expect(r.averageCurrent).toBeCloseTo((0.08 * 3 + 10e-6 * 3600) / 3603, 12)
    expect(r.averageCurrent * 1e6).toBeCloseTo(76.6, 0)
    expect(r.duty).toBeCloseTo(3 / 3603, 9)
  })

  it('derives runtime from the derated capacity', () => {
    const r = analyseDeepSleep(PROFILE, 2, 3.7)
    const usable = 2 * COULOMBS_PER_AH * DEFAULT_DERATING
    expect(r.runtimeS).toBeCloseTo(usable / r.averageCurrent, 6)
    // 2 Ah derated to 5760 C against 76.6 uA is 75.2 Ms, i.e. about 870 days.
    // An hourly wake really is that cheap, which is the whole point of deep sleep.
    expect(r.runtimeDays).toBeCloseTo(870, -1)
  })

  it('identifies when sleep current dominates the budget', () => {
    // Sleep contributes 36 mAs of 276 mAs, so the wake still dominates here.
    expect(analyseDeepSleep(PROFILE, 2, 3.7).sleepDominated).toBe(false)
    // Raise the sleep current to 500 uA and it takes over completely.
    const leaky = analyseDeepSleep({ ...PROFILE, sleepCurrent: 500e-6 }, 2, 3.7)
    expect(leaky.sleepDominated).toBe(true)
    expect(leaky.runtimeDays).toBeLessThan(analyseDeepSleep(PROFILE, 2, 3.7).runtimeDays)
  })

  it('scales daily energy consistently with the average current', () => {
    const r = analyseDeepSleep(PROFILE, 2, 3.7)
    expect(r.whPerDay).toBeCloseTo((r.averageCurrent * 3.7 * SECONDS_PER_DAY) / 3600, 12)
  })

  it('counts the wake cycles the pack supports', () => {
    const r = analyseDeepSleep(PROFILE, 2, 3.7)
    expect(r.cycles).toBeCloseTo(r.runtimeS / r.period, 6)
  })

  it('reports wakes per day from the cycle period', () => {
    // 3 s + 3600 s = 3603 s per cycle, so 86400/3603 = 23.98 wakes a day.
    const r = analyseDeepSleep(PROFILE, 2, 3.7)
    expect(r.wakesPerDay).toBeCloseTo(SECONDS_PER_DAY / r.period, 9)
    expect(r.wakesPerDay).toBeCloseTo(23.98, 1)
  })
})

describe('solar sizing', () => {
  it('sizes the panel from daily consumption and peak sun hours', () => {
    // 10 Wh/day, 4 peak sun hours, 70% system efficiency: 10/(4*0.7) = 3.57 W
    const r = analyseSolar(10, 4, 0.7, 3, 0.5, 3.7, 5)
    expect(r.panelW).toBeCloseTo(3.571, 3)
  })

  it('sizes the battery from autonomy and depth of discharge', () => {
    // 10 Wh/day for 3 days at 50% DoD is 60 Wh, i.e. 16.2 Ah at 3.7 V.
    const r = analyseSolar(10, 4, 0.7, 3, 0.5, 3.7, 5)
    expect(r.batteryAh).toBeCloseTo(60 / 3.7, 3)
  })

  it('flags a panel that cannot keep up', () => {
    // A 1 W panel harvesting 2.8 Wh cannot cover 10 Wh a day.
    const short = analyseSolar(10, 4, 0.7, 3, 0.5, 3.7, 1)
    expect(short.deficit).toBe(true)
    expect(short.surplusWh).toBeLessThan(0)
    expect(short.daysToRecharge).toBe(Infinity)

    const ample = analyseSolar(10, 4, 0.7, 3, 0.5, 3.7, 20)
    expect(ample.deficit).toBe(false)
    expect(ample.daysToRecharge).toBeGreaterThan(0)
    expect(Number.isFinite(ample.daysToRecharge)).toBe(true)
  })
})

describe('led strip supply', () => {
  it('draws 60 mA per LED at full white', () => {
    const r = analyseStrip(100, 1, 3, 60, 18)
    expect(3 * MA_PER_CHANNEL).toBeCloseTo(0.06, 12)
    // 100 LEDs at 60 mA plus 1 mA quiescent each.
    expect(r.peakCurrent).toBeCloseTo(100 * 0.06 + 100 * 0.001, 9)
    expect(r.peakPower).toBeCloseTo(r.peakCurrent * 5, 9)
  })

  it('scales with brightness and colour count', () => {
    const white = analyseStrip(100, 1, 3, 60, 18)
    const dimRed = analyseStrip(100, 0.25, 1, 60, 18)
    expect(dimRed.actualCurrent).toBeLessThan(white.actualCurrent)
    // One channel at quarter brightness is a twelfth of the LED current.
    expect(dimRed.actualCurrent - 100 * 0.001).toBeCloseTo(
      (white.actualCurrent - 100 * 0.001) / 12,
      9,
    )
  })

  it('recommends a supply with headroom over the peak', () => {
    const r = analyseStrip(100, 1, 3, 60, 18)
    expect(r.recommendedSupplyA).toBeCloseTo(r.peakCurrent * 1.25, 9)
  })

  it('predicts brownout on a long thin run and fixes it with thicker wire', () => {
    const thin = analyseStrip(300, 1, 3, 60, 24)
    expect(thin.browningOut).toBe(true)
    expect(thin.injectionPoints).toBeGreaterThan(1)

    const thick = analyseStrip(300, 1, 3, 60, 12)
    expect(thick.endDrop).toBeLessThan(thin.endDrop)
  })

  it('halves the drop against a lumped load, since the strip tapers', () => {
    const r = analyseStrip(100, 1, 3, 60, 18)
    expect(r.endDrop).toBeCloseTo((r.actualCurrent * r.feedResistance) / 2, 12)
    expect(r.endVoltage).toBeCloseTo(5 - r.endDrop, 12)
  })
})
