import { describe, expect, it } from 'vitest'
import {
  analyseImpedance,
  analyseTransformer,
  cAbs,
  cArgDeg,
  cDiv,
  cMul,
  reactanceC,
  reactanceL,
} from './ac'

describe('complex helpers', () => {
  it('multiplies and divides consistently', () => {
    const a = { re: 3, im: 4 }
    const b = { re: 1, im: -2 }
    expect(cAbs(a)).toBeCloseTo(5, 12)
    const back = cDiv(cMul(a, b), b)
    expect(back.re).toBeCloseTo(a.re, 9)
    expect(back.im).toBeCloseTo(a.im, 9)
  })

  it('gives 90 degrees for a purely inductive impedance', () => {
    expect(cArgDeg({ re: 0, im: 10 })).toBeCloseTo(90, 9)
    expect(cArgDeg({ re: 0, im: -10 })).toBeCloseTo(-90, 9)
    expect(cArgDeg({ re: 10, im: 0 })).toBeCloseTo(0, 9)
  })
})

describe('reactance', () => {
  it('rises with frequency for an inductor and falls for a capacitor', () => {
    // 1 mH at 1 kHz: 2*pi*1000*1e-3 = 6.283 ohm
    expect(reactanceL(1000, 1e-3)).toBeCloseTo(6.2832, 4)
    // 1 uF at 1 kHz: 1/(2*pi*1000*1e-6) = 159.15 ohm
    expect(reactanceC(1000, 1e-6)).toBeCloseTo(159.155, 3)
    expect(reactanceL(2000, 1e-3)).toBeCloseTo(2 * reactanceL(1000, 1e-3), 9)
    expect(reactanceC(2000, 1e-6)).toBeCloseTo(reactanceC(1000, 1e-6) / 2, 9)
  })
})

describe('series RLC', () => {
  const R = 10
  const L = 1e-3
  const C = 1e-6

  it('finds the textbook resonant frequency', () => {
    // f0 = 1/(2*pi*sqrt(1e-3*1e-6)) = 5032.9 Hz
    const r = analyseImpedance('series', R, L, C, 1000)
    expect(r.resonance).toBeCloseTo(5032.92, 1)
  })

  it('collapses to pure resistance at resonance', () => {
    const r0 = analyseImpedance('series', R, L, C, 5032.92)
    expect(r0.magnitude).toBeCloseTo(R, 2)
    expect(Math.abs(r0.phaseDeg)).toBeLessThan(0.1)
    expect(r0.xl).toBeCloseTo(r0.xc, 1)
  })

  it('is capacitive below resonance and inductive above', () => {
    expect(analyseImpedance('series', R, L, C, 500).character).toBe('capacitive')
    expect(analyseImpedance('series', R, L, C, 50_000).character).toBe('inductive')
    expect(analyseImpedance('series', R, L, C, 500).phaseDeg).toBeLessThan(0)
    expect(analyseImpedance('series', R, L, C, 50_000).phaseDeg).toBeGreaterThan(0)
  })

  it('computes Q and bandwidth from the component values', () => {
    const r = analyseImpedance('series', R, L, C, 5032.92)
    // Q = (1/R)*sqrt(L/C) = (1/10)*sqrt(1000) = 3.162
    expect(r.q).toBeCloseTo(3.1623, 3)
    expect(r.bandwidth).toBeCloseTo(r.resonance / r.q, 6)
  })
})

describe('parallel RLC', () => {
  it('peaks in impedance at resonance, the opposite of series', () => {
    const R = 1000
    const L = 1e-3
    const C = 1e-6
    const f0 = 5032.92
    const at = analyseImpedance('parallel', R, L, C, f0)
    const below = analyseImpedance('parallel', R, L, C, f0 / 10)
    const above = analyseImpedance('parallel', R, L, C, f0 * 10)
    expect(at.magnitude).toBeCloseTo(R, 0)
    expect(below.magnitude).toBeLessThan(at.magnitude)
    expect(above.magnitude).toBeLessThan(at.magnitude)
  })
})

describe('transformer', () => {
  it('scales voltage down and current up by the turns ratio', () => {
    // 230 V, 10:1, into 10 ohm, ideal windings.
    const t = analyseTransformer(230, 100, 10, 10, 0, 0, 100)
    expect(t.ratio).toBe(10)
    expect(t.vSecondaryNoLoad).toBeCloseTo(23, 9)
    expect(t.vSecondaryLoaded).toBeCloseTo(23, 9)
    expect(t.iSecondary).toBeCloseTo(2.3, 9)
    expect(t.iPrimary).toBeCloseTo(0.23, 9)
  })

  it('reflects load impedance by the square of the ratio', () => {
    const t = analyseTransformer(230, 100, 10, 8, 0, 0, 100)
    expect(t.reflected).toBeCloseTo(100 * 8, 9)
    // This is why an 8 ohm speaker on a 10:1 transformer looks like 800 ohm.
  })

  it('loses voltage to winding resistance and reports regulation', () => {
    const ideal = analyseTransformer(230, 100, 10, 10, 0, 0, 100)
    const real = analyseTransformer(230, 100, 10, 10, 20, 0.5, 100)
    expect(real.vSecondaryLoaded).toBeLessThan(ideal.vSecondaryLoaded)
    expect(real.regulation).toBeGreaterThan(0)
    expect(real.efficiency).toBeLessThan(1)
    expect(real.lossTotal).toBeCloseTo(real.lossPrimary + real.lossSecondary, 12)
  })

  it('flags a load past the VA rating', () => {
    // 23 V at 2.3 A is 52.9 VA, over a 20 VA transformer.
    expect(analyseTransformer(230, 100, 10, 10, 0, 0, 20).overRated).toBe(true)
    expect(analyseTransformer(230, 100, 10, 10, 0, 0, 100).overRated).toBe(false)
  })

  it('flags poor regulation on a weak transformer', () => {
    expect(analyseTransformer(230, 100, 10, 2, 40, 2, 100).poorRegulation).toBe(true)
    expect(analyseTransformer(230, 100, 10, 100, 1, 0.1, 100).poorRegulation).toBe(false)
  })
})
