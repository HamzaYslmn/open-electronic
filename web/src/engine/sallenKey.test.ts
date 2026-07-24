import { describe, expect, it } from 'vitest'
import { analyse, poles, response, simulate } from './sallenKey'
import type { SallenKey } from './sallenKey'

/** Equal R and C, which gives Q = 0.5 in the unity-gain low pass. */
const EQUAL: SallenKey = {
  mode: 'lowpass',
  r1: 10e3,
  r2: 10e3,
  c1: 10e-9,
  c2: 10e-9,
  gbw: 1e6,
}

/** A Butterworth pair: Q = 0.707 needs C1 twice C2 with equal resistors. */
const BUTTERWORTH: SallenKey = { ...EQUAL, c1: 20e-9, c2: 10e-9 }

describe('sallen-key', () => {
  it('puts the pole where the RC product says', () => {
    const { w0 } = poles(EQUAL)
    expect(w0).toBeCloseTo(1 / (10e3 * 10e-9), 6)
    expect(analyse(EQUAL, 1).f0).toBeCloseTo(1 / (2 * Math.PI * 10e3 * 10e-9), 6)
  })

  it('gives Q = 0.5 for equal components', () => {
    expect(poles(EQUAL).q).toBeCloseTo(0.5, 12)
  })

  it('reaches Butterworth with a 2:1 capacitor ratio', () => {
    const r = analyse(BUTTERWORTH, 1)
    expect(r.q).toBeCloseTo(Math.SQRT1_2, 9)
    // Maximally flat: no peak, and -3 dB exactly at f0.
    expect(r.peakingDb).toBe(0)
    expect(r.cutoff).toBeCloseTo(r.f0, 6)
  })

  it('is 3 dB down at the reported cutoff', () => {
    for (const f of [EQUAL, BUTTERWORTH, { ...EQUAL, c1: 100e-9 }]) {
      const r = analyse(f, 1)
      const { gain } = response(f, r.cutoff)
      expect(20 * Math.log10(gain)).toBeCloseTo(-3.0103, 6)
    }
  })

  it('rolls off at 40 dB per decade, twice as fast as one RC', () => {
    const r = analyse(BUTTERWORTH, 1)
    const a = response(BUTTERWORTH, r.f0 * 100).gain
    const b = response(BUTTERWORTH, r.f0 * 1000).gain
    expect(20 * Math.log10(a / b)).toBeCloseTo(40, 1)
  })

  it('passes DC and blocks it, according to the mode', () => {
    expect(response(BUTTERWORTH, 0).gain).toBeCloseTo(1, 12)
    expect(response({ ...BUTTERWORTH, mode: 'highpass' }, 0).gain).toBeCloseTo(0, 12)
  })

  it('peaks only once Q passes 1/sqrt(2)', () => {
    expect(analyse(BUTTERWORTH, 1).peakingDb).toBe(0)
    const high = analyse({ ...EQUAL, c1: 200e-9 }, 1)
    expect(high.q).toBeGreaterThan(Math.SQRT1_2)
    expect(high.peakingDb).toBeGreaterThan(0)
    // The peak must sit below the pole frequency for a low pass.
    expect(high.peakFrequency).toBeLessThan(high.f0)
    // And the reported height must match the response there.
    const { gain } = response({ ...EQUAL, c1: 200e-9 }, high.peakFrequency)
    expect(20 * Math.log10(gain)).toBeCloseTo(high.peakingDb, 6)
  })

  it('settles a step at the DC gain', () => {
    const dt = 1e-6
    const input = new Float64Array(20000).fill(1)
    const out = simulate(BUTTERWORTH, input, dt, false)
    expect(out[0]).toBeCloseTo(0, 9)
    expect(out[out.length - 1]).toBeCloseTo(1, 4)
  })

  it('overshoots a step by the predicted amount when Q is high', () => {
    const f: SallenKey = { ...EQUAL, c1: 200e-9 }
    const r = analyse(f, 1)
    const dt = 1 / (200 * r.f0)
    const out = simulate(f, new Float64Array(40000).fill(1), dt, false)
    let peak = 0
    for (const v of out) peak = Math.max(peak, v)
    expect(peak - 1).toBeCloseTo(r.overshoot, 2)
  })

  it('matches the analytic magnitude when driven with a sine', () => {
    const f = BUTTERWORTH
    const r = analyse(f, 1)
    const freq = r.f0
    const dt = 1 / (freq * 2000)
    const n = 2000 * 40
    const input = new Float64Array(n)
    for (let i = 0; i < n; i++) input[i] = Math.sin(2 * Math.PI * freq * i * dt)
    const out = simulate(f, input, dt)
    let peak = 0
    // Skip the first cycles so only the settled part is measured.
    for (let i = n / 2; i < n; i++) peak = Math.max(peak, out[i])
    expect(peak).toBeCloseTo(response(f, freq).gain, 2)
  })

  it('stays finite across extreme component values', () => {
    for (const c1 of [1e-12, 1e-4]) {
      for (const r1 of [100, 1e6]) {
        const f: SallenKey = { ...EQUAL, r1, c1 }
        const out = simulate(f, new Float64Array(512).fill(1), 1e-4, false)
        for (const v of out) expect(Number.isFinite(v)).toBe(true)
      }
    }
  })

  it('blocks DC through the high pass but passes the top end', () => {
    const hp: SallenKey = { ...BUTTERWORTH, mode: 'highpass' }
    const r = analyse(hp, 1)
    expect(response(hp, r.f0 / 1000).gain).toBeLessThan(1e-4)
    expect(response(hp, r.f0 * 1000).gain).toBeCloseTo(1, 3)
  })
})
