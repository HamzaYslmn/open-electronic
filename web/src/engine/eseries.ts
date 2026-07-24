/**
 * IEC 60063 preferred numbers (the E series) and the two-resistor combinations
 * that get you closer than any single standard value can.
 *
 * A series with N steps per decade is built from value = 10^(k/N) for
 * k = 0..N-1, rounded to the number of significant figures the series carries
 * (2 for E6/E12/E24, 3 for E48/E96). E48 and E96 are exactly that rounding.
 * E6, E12 and E24 are not: IEC 60063 keeps the historical values 27, 33, 39,
 * 47, 82 and friends where the arithmetic gives 26.1, 31.6, 38.3, 46.4, 82.5.
 * The tables below are the published ones, so the deviations are preserved
 * rather than recomputed away.
 *
 * Everything here is in base SI ohms. No supply rail is involved, so this
 * module does not touch constants.ts.
 */

export type SeriesName = 'E6' | 'E12' | 'E24' | 'E48' | 'E96'

export const SERIES_NAMES: readonly SeriesName[] = ['E6', 'E12', 'E24', 'E48', 'E96']

/** Steps per decade, i.e. the N in 10^(k/N). */
export const SERIES_STEPS: Record<SeriesName, number> = {
  E6: 6,
  E12: 12,
  E24: 24,
  E48: 48,
  E96: 96,
}

/**
 * Tolerance IEC 60063 pairs with each series, as a fraction.
 * The bands interlock: an E12 part at 10% covers the gaps an E12 grid leaves.
 */
export const SERIES_TOLERANCE: Record<SeriesName, number> = {
  E6: 0.2,
  E12: 0.1,
  E24: 0.05,
  E48: 0.02,
  E96: 0.01,
}

/**
 * Published mantissas as integers, to keep decade scaling exact.
 * E6/E12/E24 are two significant figures (10..91), E48/E96 are three (100..976).
 */
const MANTISSAS: Record<SeriesName, readonly number[]> = {
  E6: [10, 15, 22, 33, 47, 68],
  E12: [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82],
  E24: [
    10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68,
    75, 82, 91,
  ],
  E48: [
    100, 105, 110, 115, 121, 127, 133, 140, 147, 154, 162, 169, 178, 187, 196, 205, 215,
    226, 237, 249, 261, 274, 287, 301, 316, 332, 348, 365, 383, 402, 422, 442, 464, 487,
    511, 536, 562, 590, 619, 649, 681, 715, 750, 787, 825, 866, 909, 953,
  ],
  E96: [
    100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130, 133, 137, 140, 143, 147,
    150, 154, 158, 162, 165, 169, 174, 178, 182, 187, 191, 196, 200, 205, 210, 215, 221,
    226, 232, 237, 243, 249, 255, 261, 267, 274, 280, 287, 294, 301, 309, 316, 324, 332,
    340, 348, 357, 365, 374, 383, 392, 402, 412, 422, 432, 442, 453, 464, 475, 487, 499,
    511, 523, 536, 549, 562, 576, 590, 604, 619, 634, 649, 665, 681, 698, 715, 732, 750,
    768, 787, 806, 825, 845, 866, 887, 909, 931, 953, 976,
  ],
}

/** Significant figures each table carries, so the mantissas can be de-scaled. */
const SIG_FIGS: Record<SeriesName, number> = { E6: 2, E12: 2, E24: 2, E48: 3, E96: 3 }

/** Stock range this page searches: 1 ohm to 10 MOhm covers every common kit. */
export const R_MIN = 1
export const R_MAX = 10e6

/**
 * mantissa/10^(sig-1) * 10^decade, arranged so the result is a clean double.
 * Multiplying 4.7 by 1000 leaves float dust (4700.000000000001); 47 * 100
 * does not.
 */
function scaled(mantissa: number, sig: number, decade: number): number {
  const e = decade - (sig - 1)
  return e >= 0 ? mantissa * 10 ** e : mantissa / 10 ** -e
}

/** The mantissas of a series normalised to [1, 10). */
export function decade(series: SeriesName): number[] {
  const sig = SIG_FIGS[series]
  return MANTISSAS[series].map((m) => scaled(m, sig, 0))
}

/**
 * Every standard value of `series` inside [lo, hi], ascending.
 * Decades are generated rather than tabulated, which is the whole point of a
 * preferred-number series: the mantissa list repeats every decade.
 */
export function seriesValues(series: SeriesName, lo = R_MIN, hi = R_MAX): number[] {
  if (!(lo > 0) || !(hi >= lo)) return []
  const sig = SIG_FIGS[series]
  const out: number[] = []
  const first = Math.floor(Math.log10(lo))
  const last = Math.ceil(Math.log10(hi))
  for (let d = first; d <= last; d++) {
    for (const m of MANTISSAS[series]) {
      const v = scaled(m, sig, d)
      // Guard the ends with a relative epsilon so 1e6 is not lost to rounding.
      if (v >= lo * (1 - 1e-12) && v <= hi * (1 + 1e-12)) out.push(v)
    }
  }
  return out
}

/** Signed relative error of a realised value against the target. */
export function relError(actual: number, target: number): number {
  return target === 0 ? NaN : (actual - target) / target
}

/** Two resistors in series. */
export function seriesOf(a: number, b: number): number {
  return a + b
}

/** Two resistors in parallel, R = a·b / (a + b). */
export function parallelOf(a: number, b: number): number {
  return a + b === 0 ? 0 : (a * b) / (a + b)
}

/**
 * Half a step in log space, 10^(1/2N) - 1: how far a target can sit from a
 * neighbour on a perfectly geometric grid. E12 gives 10.1%, E24 4.9%,
 * E96 1.2%, which is where the matching tolerance grades come from.
 */
export function halfStepError(series: SeriesName): number {
  return 10 ** (1 / (2 * SERIES_STEPS[series])) - 1
}

/**
 * Largest relative error the real published table can force on an arbitrary
 * target. Inside a gap [a, b] the worst target is the arithmetic midpoint,
 * where both neighbours are (b-a)/2 away, i.e. an error of (b-a)/(b+a).
 *
 * This is not the same as halfStepError: E24 has a 13 to 15 gap worth 7.1%,
 * well past its 5% grade, because the table is rounded rather than geometric.
 */
export function worstCaseError(series: SeriesName): number {
  const d = decade(series)
  // Wrap the decade so the last-to-first gap (e.g. 9.1 to 10) is included.
  const values = [...d, d[0] * 10]
  let worst = 0
  for (let i = 1; i < values.length; i++) {
    const gap = (values[i] - values[i - 1]) / (values[i] + values[i - 1])
    if (gap > worst) worst = gap
  }
  return worst
}

/**
 * Range used when snapping an arbitrary computed value to a real part. Wider
 * than [R_MIN, R_MAX] on purpose: milliohm shunts and gigaohm bias resistors
 * are both real, and a caller snapping 0.91 ohms must not be clamped to 1.
 */
export const WIDE_LO = 1e-3
export const WIDE_HI = 1e9

/**
 * Nearest standard value measured on log distance.
 *
 * For a geometric series this is the right rule and it differs from `nearest`:
 * 65 is 3 ohms from both 62 and 68, so relative-to-target ties, but as a ratio
 * 68 is nearer (4.5% against 4.7%). Use this when snapping a computed value to
 * a purchasable part, which is what every component picker wants.
 */
export function nearestByRatio(
  series: SeriesName,
  target: number,
  lo = WIDE_LO,
  hi = WIDE_HI,
): number {
  if (!(target > 0) || !Number.isFinite(target)) return NaN
  let best = NaN
  let bestErr = Infinity
  for (const v of seriesValues(series, lo, hi)) {
    const err = Math.abs(Math.log(v / target))
    if (err < bestErr) {
      bestErr = err
      best = v
    }
  }
  return best
}

/** `bracket` over the wide range, for callers that must handle sub-ohm values. */
export function bracketWide(series: SeriesName, target: number) {
  return bracket(series, target, WIDE_LO, WIDE_HI)
}

/** The standard values immediately below and above `target` (inclusive). */
export function bracket(
  series: SeriesName,
  target: number,
  lo = R_MIN,
  hi = R_MAX,
): { below: number; above: number } {
  const values = seriesValues(series, lo, hi)
  let below = values[0]
  let above = values[values.length - 1]
  for (const v of values) {
    if (v <= target * (1 + 1e-12)) below = v
    else {
      above = v
      break
    }
  }
  return { below, above }
}

/**
 * Nearest single standard value. Closeness is measured on relative error, not
 * absolute ohms, because component tolerance is a percentage: 100 ohms off a
 * 1 kOhm target matters, off a 1 MOhm target it does not.
 */
export function nearest(series: SeriesName, target: number, lo = R_MIN, hi = R_MAX): number {
  const { below, above } = bracket(series, target, lo, hi)
  return Math.abs(relError(below, target)) <= Math.abs(relError(above, target))
    ? below
    : above
}

/** One realisable pair and what it actually measures. */
export type Combo = {
  /** Smaller resistor. */
  a: number
  /** Larger resistor. */
  b: number
  /** Resistance the pair actually presents. */
  value: number
  /** Signed relative error against the target. */
  error: number
}

/** Index of the last entry <= x in an ascending array, or -1. */
function floorIndex(values: number[], x: number): number {
  let lo = 0
  let hi = values.length - 1
  let best = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (values[mid] <= x) {
      best = mid
      lo = mid + 1
    } else hi = mid - 1
  }
  return best
}

/**
 * How far apart the two parts of a pair may be, as a ratio.
 *
 * Both combinations reduce to "big part, trimmed by the small one", and the
 * trim is worth b/a of the result. Once that is smaller than the tolerance of
 * the big part the correction is buried in the part's own spread, so the pair
 * is a fiction: 47R in parallel with 10M measures 47R and nothing else. The
 * grade tolerance is therefore the natural bound, giving 5x for E6 up to 100x
 * for E96.
 */
export function ratioCap(series: SeriesName): number {
  return 1 / SERIES_TOLERANCE[series]
}

/**
 * Best two-resistor pair, series or parallel.
 *
 * Both combinations are monotonically increasing in b for fixed a, so within
 * any contiguous slice of the sorted table the best partner is the entry
 * closest to the exact ideal, clamped into that slice. Clamping instead of
 * discarding is what keeps the answer the true optimum of the bounded problem
 * rather than a near miss, and the search stays O(n log n).
 */
function bestPair(
  series: SeriesName,
  target: number,
  mode: 'series' | 'parallel',
  lo: number,
  hi: number,
  maxRatio: number,
): Combo | null {
  const values = seriesValues(series, lo, hi)
  if (values.length === 0 || !(target > 0)) return null
  let best: Combo | null = null

  for (const a of values) {
    // Ideal partner: series needs target - a, parallel needs 1/(1/target - 1/a).
    // Parallel is only solvable when a is strictly above the target; series
    // only when a leaves something over. Both reject non-finite partners.
    const ideal = mode === 'series' ? target - a : (a * target) / (a - target)
    if (!(ideal > 0) || !Number.isFinite(ideal)) continue

    // Index window allowed by the ratio bound.
    const jLo = floorIndex(values, a / maxRatio) + 1
    const jHi = floorIndex(values, a * maxRatio)
    if (jLo > jHi) continue

    const i = floorIndex(values, ideal)
    for (const raw of [i, i + 1]) {
      const j = raw < jLo ? jLo : raw > jHi ? jHi : raw
      const b = values[j]
      const value = mode === 'series' ? seriesOf(a, b) : parallelOf(a, b)
      const error = relError(value, target)
      if (best === null || Math.abs(error) < Math.abs(best.error) - 1e-15) {
        best = { a: Math.min(a, b), b: Math.max(a, b), value, error }
      }
    }
  }
  return best
}

/** Closest a + b from the series. */
export function bestSeriesPair(
  series: SeriesName,
  target: number,
  lo = R_MIN,
  hi = R_MAX,
  maxRatio = ratioCap(series),
): Combo | null {
  return bestPair(series, target, 'series', lo, hi, maxRatio)
}

/** Closest a || b from the series. Both parts necessarily exceed the target. */
export function bestParallelPair(
  series: SeriesName,
  target: number,
  lo = R_MIN,
  hi = R_MAX,
  maxRatio = ratioCap(series),
): Combo | null {
  return bestPair(series, target, 'parallel', lo, hi, maxRatio)
}

/** Everything the e-series page reports, derived once per parameter change. */
export type ESeriesReadout = {
  series: SeriesName
  target: number
  /** Series grade tolerance as a fraction. */
  tolerance: number
  steps: number
  /** Half a step on the ideal geometric grid, 10^(1/2N) - 1. */
  halfStep: number
  /** Worst relative error the published table can force on any target. */
  worstCase: number
  single: number
  singleError: number
  below: number
  above: number
  /** Tolerance band of the chosen single value, in ohms. */
  bandLow: number
  bandHigh: number
  /** True when the target lies inside that band, i.e. a stock part can meet it. */
  inBand: boolean
  /** True when the target is outside the searched stock range. */
  outOfRange: boolean
  /** Widest ratio allowed between the two parts of a pair. */
  maxRatio: number
  seriesPair: Combo | null
  parallelPair: Combo | null
}

export function analyse(
  target: number,
  series: SeriesName,
  lo = R_MIN,
  hi = R_MAX,
): ESeriesReadout {
  const single = nearest(series, target, lo, hi)
  const { below, above } = bracket(series, target, lo, hi)
  const tolerance = SERIES_TOLERANCE[series]
  const bandLow = single * (1 - tolerance)
  const bandHigh = single * (1 + tolerance)
  return {
    series,
    target,
    tolerance,
    steps: SERIES_STEPS[series],
    halfStep: halfStepError(series),
    worstCase: worstCaseError(series),
    single,
    singleError: relError(single, target),
    below,
    above,
    bandLow,
    bandHigh,
    inBand: target >= bandLow && target <= bandHigh,
    outOfRange: target < lo || target > hi,
    maxRatio: ratioCap(series),
    seriesPair: bestSeriesPair(series, target, lo, hi),
    parallelPair: bestParallelPair(series, target, lo, hi),
  }
}
