import { describe, expect, it } from 'vitest'
import {
  SERIES_NAMES,
  SERIES_STEPS,
  SERIES_TOLERANCE,
  analyse,
  bestParallelPair,
  bestSeriesPair,
  bracket,
  decade,
  halfStepError,
  nearest,
  parallelOf,
  ratioCap,
  relError,
  seriesValues,
  worstCaseError,
} from './eseries'

describe('e-series tables', () => {
  it('reproduces the published IEC 60063 lists', () => {
    for (const s of SERIES_NAMES) {
      const d = decade(s)
      expect(d).toHaveLength(SERIES_STEPS[s])
      expect(d[0]).toBe(1)
      expect(d[d.length - 1]).toBeLessThan(10)
      for (let i = 1; i < d.length; i++) expect(d[i]).toBeGreaterThan(d[i - 1])
    }
    // E48 and E96 are exactly 10^(k/N) to 3 significant figures.
    for (const s of ['E48', 'E96'] as const) {
      const n = SERIES_STEPS[s]
      decade(s).forEach((v, k) => {
        expect(v).toBeCloseTo(Number((10 ** (k / n)).toPrecision(3)), 12)
      })
    }
    // E24 is not: 10^(10/24) is 2.61 but the standard keeps 2.7, and 3.16 -> 3.3.
    expect(10 ** (10 / 24)).toBeCloseTo(2.61, 2)
    expect(decade('E24')[10]).toBe(2.7)
    expect(10 ** (12 / 24)).toBeCloseTo(3.162, 3)
    expect(decade('E24')[12]).toBe(3.3)

    // The mantissas repeat every decade, and the scaling stays exact.
    const kilo = seriesValues('E12', 1e3, 1e4)
    expect(kilo).toHaveLength(13) // the 12 in the decade plus the 10k endpoint
    expect(kilo).toContain(4700) // not 4700.000000000001
    expect(kilo).toContain(8200)
    expect(seriesValues('E24', 1, 10)).toContain(4.7)
    expect(seriesValues('E96', 1e3, 1e4)).toContain(4750)
  })
})


describe('nearest standard value', () => {
  it('picks by relative error, not by absolute ohms', () => {
    expect(nearest('E24', 4700)).toBe(4700)
    expect(relError(nearest('E24', 4700), 4700)).toBe(0)

    // 5 kOhm sits between 4.7k (-6.0%) and 5.6k (+12%), so 4.7k wins on error
    // even though 5.6k would win on plain distance in ohms (600 against 300).
    const b = bracket('E12', 5000)
    expect([b.below, b.above]).toEqual([4700, 5600])
    expect(relError(4700, 5000)).toBeCloseTo(-0.06, 12)
    expect(relError(5600, 5000)).toBeCloseTo(0.12, 12)
    expect(nearest('E12', 5000)).toBe(4700)
  })

  it('quantifies the gap each series can force on an arbitrary target', () => {
    // Worst target in a gap [a,b] is the arithmetic midpoint, error (b-a)/(b+a).
    expect(worstCaseError('E6')).toBeCloseTo(5 / 25, 12) // 10 to 15, exactly 20%
    expect(worstCaseError('E12')).toBeCloseTo(3 / 27, 12) // 12 to 15, 11.1%
    expect(worstCaseError('E24')).toBeCloseTo(2 / 28, 12) // 13 to 15, 7.1%

    // E6 lands exactly on its 20% grade; the rounded tables overshoot theirs,
    // which is why an E24 part at 5% cannot cover every target.
    expect(worstCaseError('E6')).toBeCloseTo(SERIES_TOLERANCE.E6, 12)
    expect(worstCaseError('E24')).toBeGreaterThan(SERIES_TOLERANCE.E24)

    // Geometric half step 10^(1/2N) - 1, the ideal-grid version of the same idea.
    expect(halfStepError('E12')).toBeCloseTo(0.10069, 5)
    expect(halfStepError('E96')).toBeCloseTo(0.01206, 5)
  })
})

describe('two-resistor combinations', () => {
  it('finds the exact pair when the series contains one', () => {
    // 1.5k + 1.5k = 3k, and 1.5k is an E6 value.
    const s = bestSeriesPair('E6', 3000)
    expect([s?.a, s?.b, s?.value, s?.error]).toEqual([1500, 1500, 3000, 0])

    // 10k || 10k = 5k exactly.
    expect(parallelOf(10000, 10000)).toBe(5000)
    const p = bestParallelPair('E6', 5000)
    expect([p?.a, p?.b, p?.value, p?.error]).toEqual([10000, 10000, 5000, 0])
  })

  it('matches hand-worked combinations for non-standard targets', () => {
    // 4.7k is an E12 value, but 4.7k cannot be summed from two E12 parts.
    // Closest is 820 + 3900 = 4720, i.e. 20/4700 high.
    const s = bestSeriesPair('E12', 4700)
    expect([s?.a, s?.b]).toEqual([820, 3900])
    expect(s?.value).toBe(4720)
    expect(s?.error).toBeCloseTo(20 / 4700, 12)

    // 82 || 110 = 9020/192 = 46.979, i.e. 0.044% under a 47 ohm target.
    const p = bestParallelPair('E24', 47)
    expect([p?.a, p?.b]).toEqual([82, 110])
    expect(p?.value).toBeCloseTo(9020 / 192, 12)
    expect(p?.error).toBeCloseTo(-0.000443, 6)
  })

  it('keeps both parts realistic: parallel above target, ratio inside the cap', () => {
    for (const s of SERIES_NAMES) {
      for (const target of [47, 1234, 68000]) {
        const p = bestParallelPair(s, target)
        const q = bestSeriesPair(s, target)
        expect(p).not.toBeNull()
        expect(q).not.toBeNull()
        // A parallel combination is always below both of its parts.
        expect(p!.a).toBeGreaterThan(target)
        expect(p!.b).toBeGreaterThan(target)
        expect(parallelOf(p!.a, p!.b)).toBeCloseTo(p!.value, 9)
        expect(q!.a + q!.b).toBeCloseTo(q!.value, 9)
        // No fictional trims: a 10M resistor across a 47R is not a combination.
        expect(p!.b / p!.a).toBeLessThanOrEqual(ratioCap(s) + 1e-12)
        expect(q!.b / q!.a).toBeLessThanOrEqual(ratioCap(s) + 1e-12)
      }
    }
  })

  it('cuts the worst-case error by more than half against a single part', () => {
    for (const s of SERIES_NAMES) {
      let worstSingle = 0
      let worstPair = 0
      // 400 log-spaced targets over 3 decades, well inside the 1R to 10M pool.
      for (let i = 0; i < 400; i++) {
        const r = analyse(100 * 10 ** ((3 * i) / 399), s)
        worstSingle = Math.max(worstSingle, Math.abs(r.singleError))
        worstPair = Math.max(
          worstPair,
          Math.min(Math.abs(r.seriesPair!.error), Math.abs(r.parallelPair!.error)),
        )
      }
      // A dense sweep should approach, but never exceed, the table's worst gap.
      expect(worstSingle).toBeLessThanOrEqual(worstCaseError(s) + 1e-12)
      expect(worstSingle).toBeGreaterThan(0.9 * worstCaseError(s))
      // Two parts always buy back a factor of 2.5 or better, and the finer the
      // series the bigger the win: E24 pairs land under 0.6%, past the E96 grade.
      expect(worstPair).toBeLessThan(worstSingle / 2.5)
    }
    expect(
      Math.abs(analyse(1234, 'E24').parallelPair!.error),
    ).toBeLessThan(SERIES_TOLERANCE.E96)
  })
})

describe('analyse', () => {
  it('reports the tolerance band, and flags targets it cannot reach', () => {
    // 12.5k with E6: 10k is 20% low, 15k is 20% high, so no stock part covers it.
    const r = analyse(12500, 'E6')
    expect(r.single).toBe(10000)
    expect(r.singleError).toBeCloseTo(-0.2, 12)
    expect(r.bandLow).toBeCloseTo(8000, 9) // 10k at 20%
    expect(r.bandHigh).toBeCloseTo(12000, 9)
    expect(r.inBand).toBe(false)
    expect(Math.abs(r.seriesPair!.error)).toBeLessThan(0.05)

    // 4.6k with E24: 4.7k at 5% covers 4.465k to 4.935k, so a stock part works.
    const ok = analyse(4600, 'E24')
    expect(ok.single).toBe(4700)
    expect(ok.inBand).toBe(true)

    // Outside the searched stock range the answer is clamped and flagged,
    // never extrapolated into parts nobody sells.
    const high = analyse(50e6, 'E24')
    expect(high.outOfRange).toBe(true)
    expect(high.single).toBe(10e6) // clamped to the top of the searched pool
    expect(Number.isFinite(high.singleError)).toBe(true)

    for (const s of SERIES_NAMES) {
      const bottom = analyse(1, s)
      expect(bottom.outOfRange).toBe(false)
      expect(bottom.single).toBe(1)
      expect(Number.isNaN(bottom.singleError)).toBe(false)
    }
  })
})
