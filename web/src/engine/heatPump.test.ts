import { describe, expect, it } from 'vitest'
import {
  J_PER_KWH,
  analyse,
  carnotCop,
  cop,
  copSweep,
  costPerKwhHeat,
  seasonalCop,
  toKelvin,
} from './heatPump'

/** A7/W45 style operating point: 7 C outdoor air, 45 C flow, 1 kW electrical. */
const BASE = {
  flowC: 45,
  outdoorC: 7,
  eta: 0.45,
  electricalW: 1000,
  tariffPerKwh: 0.3,
  designOutdoorC: -10,
  seasonalHeatJ: 12_000 * J_PER_KWH, // 12 MWh of heat per season
}

describe('carnot ceiling', () => {
  it('matches the textbook ratio and is unbounded at zero lift', () => {
    // Th/(Th-Tc): 300 K over a 50 K lift is exactly 6
    expect(carnotCop(300, 250)).toBe(6)
    // 45 C flow from 7 C air: 318.15 / 38
    expect(carnotCop(toKelvin(45), toKelvin(7))).toBeCloseTo(8.372368, 5)
    expect(carnotCop(300, 300)).toBe(Infinity)
    expect(carnotCop(300, 310)).toBe(Infinity)
    // No real machine beats Carnot, so eta < 1 always lands under the ceiling.
    const th = toKelvin(45)
    const tc = toKelvin(-10)
    expect(cop(th, tc, 0.45)).toBeLessThan(carnotCop(th, tc))
  })
})

describe('energy balance', () => {
  it('obeys the first law: Qh = W + Qc', () => {
    const r = analyse(BASE)
    expect(r.cop).toBeCloseTo(0.45 * 8.372368, 5) // 3.7676
    expect(r.heatW).toBeCloseTo(3767.57, 1)
    expect(r.absorbedW).toBeCloseTo(2767.57, 1)
    expect(r.heatW).toBeCloseTo(BASE.electricalW + r.absorbedW, 9)
  })

  it('collapses to a resistor at COP 1', () => {
    // eta chosen so that eta * carnot == 1 exactly
    const carnot = carnotCop(toKelvin(45), toKelvin(7))
    const r = analyse({ ...BASE, eta: 1 / carnot })
    expect(r.cop).toBeCloseTo(1, 12)
    expect(r.heatW).toBeCloseTo(BASE.electricalW, 9) // all heat, none free
    expect(r.absorbedW).toBeCloseTo(0, 9)
    expect(r.heatCostPerKwh).toBeCloseTo(BASE.tariffPerKwh, 12)
    expect(r.savingFraction).toBeCloseTo(0, 12)
  })
})

describe('running cost', () => {
  it('divides the tariff by the COP', () => {
    const r = analyse(BASE)
    expect(costPerKwhHeat(0.3, 1)).toBe(0.3) // resistive baseline
    expect(r.heatCostPerKwh).toBeCloseTo(0.3 / 3.767565, 6) // 0.0796 per kWh
    expect(r.resistiveCostPerKwh).toBe(0.3)
    expect(r.savingFraction).toBeCloseTo(1 - 1 / r.cop, 12)
  })

  it('flags the case where a resistor wins', () => {
    // Poor machine, 80 K lift: eta 0.10 * 4.164 = 0.416, worse than a heater.
    const r = analyse({ ...BASE, eta: 0.1, flowC: 60, outdoorC: -20 })
    expect(r.cop).toBeCloseTo(0.416437, 5)
    expect(r.belowResistive).toBe(true)
    expect(r.extremeLift).toBe(true) // 80 K is past the single-stage envelope
    expect(r.heatCostPerKwh).toBeGreaterThan(r.resistiveCostPerKwh)
    expect(r.savingFraction).toBeLessThan(0)
    expect(r.absorbedW).toBeLessThan(0) // it is dumping heat, not lifting it
  })
})

describe('seasonal estimate', () => {
  it('sits between the design-point and base-point COPs', () => {
    const th = toKelvin(45)
    const scop = seasonalCop(th, toKelvin(-10), 0.45)
    expect(cop(th, toKelvin(-10), 0.45)).toBeCloseTo(2.6031, 3)
    expect(cop(th, toKelvin(15.5), 0.45)).toBeCloseTo(4.8531, 3)
    expect(scop).toBeGreaterThan(2.6031)
    expect(scop).toBeLessThan(4.8531)
    // A milder winter means less time at the cold, low-COP end.
    expect(seasonalCop(th, toKelvin(0), 0.45)).toBeGreaterThan(scop)
    // COP is linear in eta, so the load-weighted mean of COPs is too.
    expect(seasonalCop(th, toKelvin(-10), 0.9)).toBeCloseTo(2 * scop, 10)
  })

  it('converts the season into electricity and money', () => {
    const r = analyse(BASE)
    expect(r.seasonalElectricityJ * r.scop).toBeCloseTo(BASE.seasonalHeatJ, 0)
    // 12 MWh of heat, resistive, at 0.30 per kWh
    expect(r.resistiveSeasonalCost).toBeCloseTo(3600, 6)
    expect(r.seasonalCost).toBeCloseTo(3600 / r.scop, 6)
    expect(r.seasonalSaving).toBeCloseTo(r.resistiveSeasonalCost - r.seasonalCost, 9)
    expect(r.seasonalSavingFraction).toBeCloseTo(1 - 1 / r.scop, 12)
    // Run time at the rated point: seasonal heat divided by heat output.
    expect(r.runtimeS).toBeCloseTo(BASE.seasonalHeatJ / r.heatW, 3)
  })
})

describe('cop sweep', () => {
  it('stays finite and rises with outdoor temperature', () => {
    const n = 512
    const { carnot, real, stepK } = copSweep(toKelvin(45), 0.45, -25, 15, n)
    expect(stepK).toBeCloseTo(40 / (n - 1), 12)
    for (let i = 0; i < n; i++) {
      expect(Number.isFinite(carnot[i])).toBe(true)
      expect(real[i]).toBeCloseTo(0.45 * carnot[i], 12)
      if (i > 0) expect(carnot[i]).toBeGreaterThan(carnot[i - 1])
    }
    expect(carnot[0]).toBeCloseTo(carnotCop(toKelvin(45), toKelvin(-25)), 12)
  })
})
