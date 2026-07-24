import { describe, expect, it } from 'vitest'
import {
  CHEMISTRIES,
  COULOMBS_PER_AH,
  SECONDS_PER_HOUR,
  analyse,
  cellOcv,
  cutoffDepth,
  discharge,
  effectiveCapacity,
  maxPower,
  ocvCoefficients,
  peukertRuntime,
  solveCurrent,
} from './battery'
import type { Pack } from './battery'

const ah = (v: number) => v * COULOMBS_PER_AH
const hours = (v: number) => v * SECONDS_PER_HOUR

/** One ideal 18650: 2.5 Ah, zero internal resistance, so only Peukert bites. */
const ideal18650: Pack = {
  chemistry: 'liion',
  series: 1,
  parallel: 1,
  cellCapacity: ah(2.5),
  cellResistance: 0,
}

describe('open-circuit voltage model', () => {
  it('reproduces the datasheet anchor points it was fitted to', () => {
    const spec = CHEMISTRIES.liion
    const co = ocvCoefficients(spec)
    // Tremblay's extraction is exact at s = 0 and at the end of the nominal zone.
    expect(cellOcv(co, 0)).toBeCloseTo(spec.full, 9)
    expect(cellOcv(co, spec.sNom)).toBeCloseTo(spec.vNom, 9)
    // The exponential zone is fitted to 3 time constants, so it lands within 10 mV.
    expect(cellOcv(co, spec.sExp)).toBeCloseTo(spec.vExp, 1)
  })

  it('falls monotonically and hits cutoff exactly at full depth', () => {
    for (const spec of Object.values(CHEMISTRIES)) {
      const co = ocvCoefficients(spec)
      const sCut = cutoffDepth(co, spec.cutoff)
      expect(sCut).toBeGreaterThan(0.9)
      expect(cellOcv(co, sCut)).toBeCloseTo(spec.cutoff, 6)
      let prev = Infinity
      for (let i = 0; i <= 100; i++) {
        const v = cellOcv(co, (i / 100) * sCut)
        expect(v).toBeLessThan(prev)
        prev = v
      }
    }
  })
})

describe('peukert derating', () => {
  it('matches the textbook 100 Ah C20 lead acid case', () => {
    // t = H*(C/(I*H))^k with C = 100 Ah, H = 20 h, I = 10 A, k = 1.25
    //   = 20*(0.5)^1.25 = 8.409 h, i.e. 84.09 Ah delivered, not 100.
    const t = peukertRuntime(ah(100), 10, hours(20), 1.25)
    expect(t / SECONDS_PER_HOUR).toBeCloseTo(8.409, 3)
    expect(effectiveCapacity(ah(100), 10, hours(20), 1.25) / COULOMBS_PER_AH).toBeCloseTo(
      84.09,
      2,
    )
  })

  it('returns exactly the rated capacity at the rated rate, for any exponent', () => {
    // I = C/H puts the bracket at 1, so C^0 = 1 whatever k is.
    for (const k of [1.0, 1.05, 1.1, 1.25]) {
      expect(effectiveCapacity(ah(7), ah(7) / hours(20), hours(20), k)).toBeCloseTo(ah(7), 6)
    }
    // A perfect cell (k = 1) is rate independent by definition.
    expect(effectiveCapacity(ah(7), 100, hours(20), 1)).toBeCloseTo(ah(7), 6)
  })
})

describe('load solving and sag', () => {
  it('solves constant power so that V*I lands back on the setting', () => {
    // Rint*I^2 - OCV*I + P = 0 with OCV = 4 V, Rint = 0.1 Ohm, P = 10 W.
    const i = solveCurrent({ mode: 'power', value: 10 }, 4, 0.1)
    expect(i).toBeCloseTo(2.6795, 3)
    expect((4 - i * 0.1) * i).toBeCloseTo(10, 9)
    // Maximum power transfer: P = OCV^2/(4*Rint) = 40 W. Past that, no solution.
    expect(maxPower(4, 0.1)).toBeCloseTo(40, 9)
    expect(Number.isNaN(solveCurrent({ mode: 'power', value: 41 }, 4, 0.1))).toBe(true)
  })

  it('sags the terminal by exactly I*Rint at the start of the run', () => {
    // 3S1P 18650 at 70 mOhm a cell: Rint = 0.21 Ohm, 2 A load -> 420 mV of sag.
    const pack: Pack = { ...ideal18650, series: 3, cellResistance: 0.07 }
    const r = analyse(pack, { mode: 'current', value: 2 }, 64)
    expect(r.rint).toBeCloseTo(0.21, 9)
    expect(r.startVoltage).toBeCloseTo(3 * CHEMISTRIES.liion.full - 2 * 0.21, 6)
    expect(r.maxSag).toBeCloseTo(0.42, 6)
  })
})

describe('discharge run', () => {
  it('runs for the Peukert time and stays inside the voltage envelope', () => {
    // 2.5 Ah 18650 at 0.5 A is exactly its 5 hour rating, so Peukert is neutral
    // and an ideal cell should last the full 5 h.
    const load = { mode: 'current', value: 0.5 } as const
    const r = analyse(ideal18650, load, 512)
    const expected = peukertRuntime(ah(2.5), 0.5, hours(5), CHEMISTRIES.liion.peukert)
    expect(expected / SECONDS_PER_HOUR).toBeCloseTo(5, 6)
    expect(r.runtime / expected).toBeCloseTo(1, 2)
    expect(r.meanCurrent).toBeCloseTo(0.5, 6)

    // Traces stay bounded and monotone: no integrator to run away.
    for (let i = 1; i < r.terminal.length; i++) {
      expect(Number.isFinite(r.terminal[i])).toBe(true)
      expect(r.terminal[i]).toBeLessThanOrEqual(r.terminal[i - 1] + 1e-12)
    }
    expect(r.terminal[0]).toBeCloseTo(CHEMISTRIES.liion.full, 3)
    expect(r.terminal[r.terminal.length - 1]).toBeGreaterThanOrEqual(r.cutoff - 1e-9)
    // Delivered energy is the charge times the mean voltage, which for this cell
    // sits between the cutoff and the full voltage.
    const meanV = r.energy / r.delivered
    expect(meanV).toBeGreaterThan(r.cutoff)
    expect(meanV).toBeLessThan(r.fullVoltage)
  })

  it('penalises lead acid far harder than LiFePO4 at the same C rate', () => {
    // Both packs sized to 7 Ah and pulled at 1 A, i.e. about C/7.
    const load = { mode: 'current', value: 1 } as const
    const lead = analyse(
      { chemistry: 'lead', series: 6, parallel: 1, cellCapacity: ah(7), cellResistance: 0 },
      load,
      64,
    )
    const lfp = analyse(
      { chemistry: 'lifepo4', series: 4, parallel: 1, cellCapacity: ah(7), cellResistance: 0 },
      load,
      64,
    )
    // k = 1.25 off a 20 hour rating: C/(I*H) = 7/20 -> 0.35^0.25 = 0.769.
    expect(lead.capacityRatio).toBeCloseTo(Math.pow(7 / 20, 0.25), 3)
    expect(lead.capacityRatio).toBeLessThan(0.8)
    // k = 1.05 off a 5 hour rating is nearly free: this rate is below the rating,
    // so Peukert hands back slightly more than the label.
    expect(lfp.capacityRatio).toBeGreaterThan(0.99)

    // LiFePO4 is the flat one: less voltage swing across the middle of the run.
    const spread = (t: Float64Array) => t[Math.floor(t.length * 0.2)] - t[Math.floor(t.length * 0.8)]
    expect(spread(lfp.terminal) / lfp.nominal).toBeLessThan(spread(lead.terminal) / lead.nominal)
  })

  it('refuses to invent an operating point past maximum power transfer', () => {
    // One 18650 behind 70 mOhm can deliver at most 4.2^2/(4*0.07) = 63 W.
    const pack: Pack = { ...ideal18650, cellResistance: 0.07 }
    const ok = analyse(pack, { mode: 'power', value: 5 }, 64)
    expect(ok.overPower).toBe(false)
    expect(ok.runtime).toBeGreaterThan(0)
    // Sag under 5 W is real but the pack still works, and Rint eats some energy.
    expect(ok.efficiency).toBeLessThan(1)
    expect(ok.efficiency).toBeGreaterThan(0.9)

    const dead = analyse(pack, { mode: 'power', value: 200 }, 64)
    expect(dead.overPower).toBe(true)
    expect(dead.deadOnArrival).toBe(true)
    expect(dead.runtime).toBe(0)
    for (const v of dead.terminal) expect(Number.isFinite(v)).toBe(true)
  })

  it('gives a heavier load a shorter run and a lower delivered energy', () => {
    const light = discharge(ideal18650, { mode: 'current', value: 0.25 }, 64)
    const heavy = discharge(ideal18650, { mode: 'current', value: 4 }, 64)
    expect(heavy.runtime).toBeLessThan(light.runtime)
    // Peukert alone: k = 1.05 costs about 10% of the charge at 16x the rate.
    expect(heavy.delivered).toBeLessThan(light.delivered)
    expect(heavy.energy).toBeLessThan(light.energy)
    expect(heavy.runtime).toBeGreaterThan(0)
    expect(Number.isFinite(heavy.dt)).toBe(true)
  })
})
