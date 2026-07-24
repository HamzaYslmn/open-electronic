import { describe, expect, it } from 'vitest'
import {
  analyseAstable,
  analyseMonostable,
  astableFrequency,
  dutyCycle,
  highTime,
  lowTime,
  pulseWidth,
  simulateAstable,
  simulateMonostable,
  thresholdVoltage,
} from './timer555'

/**
 * Measure the completed high and low run lengths of a two level trace, which is
 * how the timing would be read off a real scope.
 */
function runs(out: ArrayLike<number>, dt: number) {
  let min = out[0]
  let max = out[0]
  for (let i = 1; i < out.length; i++) {
    if (out[i] < min) min = out[i]
    if (out[i] > max) max = out[i]
  }
  const mid = (min + max) / 2
  const isHigh = (i: number) => out[i] > mid
  const edges: number[] = []
  for (let i = 1; i < out.length; i++) {
    if (isHigh(i - 1) !== isHigh(i)) edges.push(i)
  }
  const high: number[] = []
  const low: number[] = []
  for (let k = 1; k < edges.length; k++) {
    const len = (edges[k] - edges[k - 1]) * dt
    if (isHigh(edges[k - 1])) high.push(len)
    else low.push(len)
  }
  return { high, low, edges }
}

const N = 8192

describe('astable timing', () => {
  // R1 = R2 = 10k, C = 10 nF: the textbook worked example.
  const r1 = 10e3
  const r2 = 10e3
  const c = 10e-9

  it('matches the textbook intervals and the 1.44/((R1+2R2)C) shorthand', () => {
    expect(highTime(r1, r2, c)).toBeCloseTo(1.386294e-4, 9) // ln2 * 20k * 10n
    expect(lowTime(r2, c)).toBeCloseTo(6.93147e-5, 9) // ln2 * 10k * 10n
    const f = astableFrequency(r1, r2, c)
    expect(f).toBeCloseTo(4808.98, 1)
    // The shorthand rounds 1/ln2 = 1.4427 down to 1.44, so it reads 0.2% low.
    const shorthand = 1.44 / ((r1 + 2 * r2) * c)
    expect(Math.abs(f - shorthand) / f).toBeLessThan(0.005)
    expect(1 / (highTime(r1, r2, c) + lowTime(r2, c))).toBeCloseTo(f, 6)
  })

  it('never gets to 50% duty without a diode', () => {
    expect(dutyCycle(r1, r2)).toBeCloseTo(2 / 3, 12) // R1 = R2 -> 66.7%
    // Sweeping R2 from far below R1 to far above it, duty only ever approaches
    // 50% from above: t_high has R1 in it and t_low does not.
    for (const ratio of [0.001, 0.1, 1, 10, 1000, 1e6]) {
      const d = dutyCycle(1e3, 1e3 * ratio)
      expect(d).toBeGreaterThan(0.5)
      expect(d).toBeLessThanOrEqual(1)
    }
    expect(dutyCycle(1e3, 1e9)).toBeCloseTo(0.5, 5) // R2 >> R1 is the limit
  })

  it('reproduces the formula intervals in the time-domain trace', () => {
    const p = { vcc: 3.3, r1, r2, c, variant: 'cmos' as const }
    const period = highTime(r1, r2, c) + lowTime(r2, c)
    const { dt, out, cap } = simulateAstable(p, N, 4 * period)
    const { high, low } = runs(out, dt)
    expect(high.length).toBeGreaterThanOrEqual(3)
    expect(high[0]).toBeCloseTo(highTime(r1, r2, c), 6)
    expect(low[0]).toBeCloseTo(lowTime(r2, c), 6)
    // C must swing exactly between the two comparator levels, 1.1 V and 2.2 V.
    let min = cap[0]
    let max = cap[0]
    for (const v of cap) {
      if (v < min) min = v
      if (v > max) max = v
    }
    expect(min).toBeCloseTo(1.1, 2)
    expect(max).toBeCloseTo(2.2, 2)
  })

  it('is ratiometric: the same period at 3.3 V and at 15 V', () => {
    const period = highTime(r1, r2, c) + lowTime(r2, c)
    const base = { r1, r2, c, variant: 'cmos' as const }
    const a = simulateAstable({ ...base, vcc: 3.3 }, N, 4 * period)
    const b = simulateAstable({ ...base, vcc: 15 }, N, 4 * period)
    const ra = runs(a.out, a.dt)
    const rb = runs(b.out, b.dt)
    expect(ra.high[0]).toBeCloseTo(rb.high[0], 9)
    expect(ra.low[0]).toBeCloseTo(rb.low[0], 9)
    // Comparator levels scale with the rail, the timing does not.
    expect(thresholdVoltage(15)).toBeCloseTo(10, 9)
  })

  it('stays bounded when dt is thousands of time constants (Euler would blow up)', () => {
    const p = { vcc: 3.3, r1: 1e3, r2: 1e3, c: 1e-12, variant: 'cmos' as const }
    // 1 ns time constants sampled at 1 ms per point: 1e6 flips inside one step.
    const { cap, out } = simulateAstable(p, 512, 0.512)
    for (let i = 0; i < cap.length; i++) {
      expect(Number.isFinite(cap[i])).toBe(true)
      expect(cap[i]).toBeGreaterThanOrEqual(0)
      expect(cap[i]).toBeLessThanOrEqual(3.3)
      expect(out[i]).toBeGreaterThanOrEqual(0)
      expect(out[i]).toBeLessThanOrEqual(3.3)
    }
  })
})

describe('monostable timing', () => {
  const r = 100e3
  const c = 10e-9

  it('gives the ln3 pulse that the 1.1 R C rule approximates', () => {
    const t = pulseWidth(r, c)
    expect(t).toBeCloseTo(1.0986123e-3, 9) // ln3 * 100k * 10n
    // The rule of thumb rounds ln3 = 1.0986 up to 1.1, so it reads 1.3% long.
    expect(Math.abs(1.1 * r * c - t) / t).toBeLessThan(0.015)
  })

  it('holds the output high while the trigger is held past the timeout', () => {
    const t = pulseWidth(r, c)
    const span = 4 * t
    const base = {
      vcc: 3.3,
      r,
      c,
      variant: 'cmos' as const,
      triggerDelay: 0.2 * t,
    }

    const normal = simulateMonostable({ ...base, triggerWidth: t / 20 }, N, span)
    expect(runs(normal.out, normal.dt).high[0]).toBeCloseTo(t, 5)

    // Trigger comparator overrides the threshold, so the pulse follows the
    // trigger and C keeps charging past 2/3 Vcc toward the rail.
    const held = simulateMonostable({ ...base, triggerWidth: 1.5 * t }, N, span)
    const heldRuns = runs(held.out, held.dt)
    expect(heldRuns.high[0]).toBeCloseTo(1.5 * t, 5)
    expect(Math.max(...held.cap)).toBeGreaterThan(thresholdVoltage(3.3) + 0.2)
  })
})

describe('model validity flags', () => {
  it('catches an out of range rail and an overloaded discharge pin', () => {
    const p = { vcc: 3.3, r1: 10e3, r2: 10e3, c: 10e-9 }
    expect(analyseAstable({ ...p, variant: 'bipolar' }).supplyOutOfRange).toBe(true)
    expect(analyseAstable({ ...p, variant: 'cmos' }).supplyOutOfRange).toBe(false)
    // NE555 output high is Vcc - 1.7 V, so 3.3 V in gives 1.6 V out.
    expect(analyseAstable({ ...p, variant: 'bipolar' }).outputHigh).toBeCloseTo(1.6, 9)

    const ok = analyseAstable({ vcc: 3.3, r1: 10e3, r2: 10e3, c: 10e-9, variant: 'cmos' })
    expect(ok.dischargeOverload).toBe(false)
    expect(ok.dischargePeak).toBeCloseTo(2.2 / 10e3 + 3.3 / 10e3, 9)

    // R2 = 10 ohms asks pin 7 to sink 220 mA the instant it turns on.
    const hot = analyseAstable({ vcc: 3.3, r1: 10e3, r2: 10, c: 10e-9, variant: 'cmos' })
    expect(hot.dischargeOverload).toBe(true)

    // Idle monostable: the transistor holds C down and sinks Vcc/R forever.
    const mono = analyseMonostable({
      vcc: 3.3,
      r: 10,
      c: 10e-9,
      variant: 'cmos',
      triggerWidth: 1e-6,
      triggerDelay: 0,
    })
    expect(mono.idleCurrent).toBeCloseTo(0.33, 9)
    expect(mono.dischargeOverload).toBe(true)
  })
})
