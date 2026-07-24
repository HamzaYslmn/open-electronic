import { describe, expect, it } from 'vitest'
import {
  analyse,
  angularResonance,
  characteristicImpedance,
  criticalResistance,
  dampingRatio,
  qualityFactor,
  resonantFrequency,
  simulate,
} from './rlc'

// 100 uH + 100 nF: f0 = 50.329 kHz, Z0 = 31.623 ohm. Hand-checkable throughout.
const L = 100e-6
const C = 100e-9
const VS = 3.3

/** Textbook underdamped series step response of the capacitor voltage. */
function analyticSeriesStep(t: number, r: number): number {
  const w0 = 1 / Math.sqrt(L * C)
  const alpha = r / (2 * L)
  const wd = Math.sqrt(w0 * w0 - alpha * alpha)
  return VS * (1 - Math.exp(-alpha * t) * (Math.cos(wd * t) + (alpha / wd) * Math.sin(wd * t)))
}

function constant(n: number, v: number): Float64Array {
  return new Float64Array(n).fill(v)
}

describe('rlc figures of merit', () => {
  it('computes the textbook resonance, impedance and reciprocal Q', () => {
    expect(resonantFrequency(L, C)).toBeCloseTo(50329.21, 1)
    expect(angularResonance(L, C)).toBeCloseTo(316227.766, 2)
    expect(characteristicImpedance(L, C)).toBeCloseTo(Math.sqrt(1000), 9)
    // f0 does not depend on R at all.
    expect(analyse(1, L, C, 'series').f0).toBeCloseTo(analyse(1e5, L, C, 'parallel').f0, 9)

    // Series Q = Z0/R, parallel Q = R/Z0, so at any R the two multiply to 1.
    const qs = qualityFactor(10, L, C, 'series')
    const qp = qualityFactor(10, L, C, 'parallel')
    expect(qs).toBeCloseTo(Math.sqrt(1000) / 10, 9)
    expect(qp).toBeCloseTo(10 / Math.sqrt(1000), 9)
    expect(qs * qp).toBeCloseTo(1, 12)
    expect(dampingRatio(10, L, C, 'series')).toBeCloseTo(1 / (2 * qs), 12)
    expect(dampingRatio(10, L, C, 'parallel')).toBeCloseTo(1 / (2 * qp), 12)
  })

  it('places the half power edges symmetrically in log frequency around f0', () => {
    const a = analyse(10, L, C, 'series')
    expect(a.fHigh - a.fLow).toBeCloseTo(a.bw, 6)
    expect(a.bw).toBeCloseTo(a.f0 / a.q, 9)
    // Geometric mean of the band edges is exactly f0.
    expect(Math.sqrt(a.fLow * a.fHigh)).toBeCloseTo(a.f0, 6)
  })

  it('classifies damping about the critical resistance', () => {
    const rcSeries = criticalResistance(L, C, 'series')
    const rcParallel = criticalResistance(L, C, 'parallel')
    expect(rcSeries).toBeCloseTo(2 * Math.sqrt(L / C), 9)
    expect(rcParallel).toBeCloseTo(0.5 * Math.sqrt(L / C), 9)

    expect(analyse(rcSeries, L, C, 'series').zeta).toBeCloseTo(1, 9)
    expect(analyse(rcSeries, L, C, 'series').damping).toBe('critical')
    expect(analyse(rcSeries / 10, L, C, 'series').damping).toBe('under')
    expect(analyse(rcSeries * 10, L, C, 'series').damping).toBe('over')
    // Parallel flips: more resistance means less damping.
    expect(analyse(rcParallel * 10, L, C, 'parallel').damping).toBe('under')
    expect(analyse(rcParallel / 10, L, C, 'parallel').damping).toBe('over')
  })
})

describe('rlc step response', () => {
  it('matches the closed-form underdamped series step at fine and coarse dt', () => {
    const r = 10 // zeta = 0.158, ring period 20.1 us
    for (const dt of [2e-8, 5e-6]) {
      const n = dt < 1e-7 ? 2000 : 40
      const { vout } = simulate(constant(n, VS), dt, r, L, C, 'series', false)
      for (let k = 0; k < n; k++) {
        expect(vout[k]).toBeCloseTo(analyticSeriesStep(k * dt, r), 8)
      }
    }
    // The coarse run steps a quarter ring period at a time and is still exact,
    // which is the whole point of zero-order-hold rather than forward Euler.
  })

  it('reproduces the critically damped step, Vs*(1 - e^-w0t*(1 + w0t))', () => {
    const r = criticalResistance(L, C, 'series')
    const w0 = angularResonance(L, C)
    const dt = 1e-7
    const n = 500
    const { vout } = simulate(constant(n, VS), dt, r, L, C, 'series', false)
    for (let k = 0; k < n; k++) {
      const t = k * dt
      expect(vout[k]).toBeCloseTo(VS * (1 - Math.exp(-w0 * t) * (1 + w0 * t)), 8)
      // No overshoot at critical damping.
      expect(vout[k]).toBeLessThanOrEqual(VS + 1e-12)
    }
  })

  it('peaks at Vs*(1 + exp(-pi*zeta/sqrt(1-zeta^2)))', () => {
    const r = 10
    const a = analyse(r, L, C, 'series')
    const { vout } = simulate(constant(20000, VS), 1e-9, r, L, C, 'series', false)
    const peak = Math.max(...vout)
    expect(a.overshoot).toBeCloseTo(0.6046791, 6)
    expect(peak).toBeCloseTo(VS * (1 + a.overshoot), 4)
  })

  it('gives the classic parallel ringing pulse, (is/C)*e^-at*sin(wd t)/wd', () => {
    // Parallel is driven Thevenin style, so the Norton current step is Vs/R.
    const r = 200 // Q = 6.3, underdamped
    const w0 = angularResonance(L, C)
    const alpha = 1 / (2 * r * C)
    const wd = Math.sqrt(w0 * w0 - alpha * alpha)
    const is = VS / r
    const dt = 1e-8
    const n = 4000
    const { vout } = simulate(constant(n, VS), dt, r, L, C, 'parallel', false)
    for (let k = 0; k < n; k++) {
      const t = k * dt
      expect(vout[k]).toBeCloseTo((is / C) * Math.exp(-alpha * t) * (Math.sin(wd * t) / wd), 8)
    }
    // Inductor is a short at DC, so the node voltage decays to zero.
    expect(Math.abs(vout[n - 1])).toBeLessThan(0.05)
  })

  it('stays bounded when dt dwarfs the ring period (Euler would diverge)', () => {
    // Q = 31623, and dt is ~50 ring periods. A lossless LC step can never take
    // the capacitor past 2*Vs, so that is the physical bound to check.
    const hiQ = simulate(constant(2000, VS), 1e-3, 0.001, L, C, 'series', false)
    for (const v of hiQ.vout) {
      expect(Number.isFinite(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(-0.01)
      expect(v).toBeLessThanOrEqual(2 * VS + 0.01)
    }
    for (const i of hiQ.current) expect(Number.isFinite(i)).toBe(true)

    // Extreme overdamping, zeta = 15811: the exp branch must not overflow.
    const slow = simulate(constant(2000, VS), 1e-3, 1e6, 1, 1e-3, 'series', false)
    for (const v of slow.vout) {
      expect(Number.isFinite(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(-1e-9)
      expect(v).toBeLessThanOrEqual(VS + 1e-9)
    }
  })
})
