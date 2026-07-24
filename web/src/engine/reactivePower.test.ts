import { describe, expect, it } from 'vitest'
import {
  analyse,
  phaseFromPf,
  realPower,
  reactivePower,
  traceScale,
  waveforms,
} from './reactivePower'
import { mean, rms } from './signal'

/** A 3 kW single phase motor at 0.75 PF on a 230 V / 50 Hz feed. */
const MOTOR = {
  vrms: 230,
  frequency: 50,
  p: 3000,
  pf: 0.75,
  pfTarget: 0.95,
  kind: 'lagging' as const,
  rLine: 0.2,
}

/** Mean of the product of two traces, i.e. the real power in a p = v*i sense. */
function meanProduct(a: Float64Array, b: Float64Array): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum / a.length
}

describe('power triangle', () => {
  it('splits 1 kVA at 0.8 PF into 800 W and 600 var', () => {
    const phi = phaseFromPf(0.8, 'lagging')
    expect(realPower(1000, phi)).toBeCloseTo(800, 9)
    expect(reactivePower(1000, phi)).toBeCloseTo(600, 9)
    // 3-4-5 triangle: P^2 + Q^2 = S^2
    expect(Math.hypot(realPower(1000, phi), reactivePower(1000, phi))).toBeCloseTo(1000, 9)
  })

  it('reports S, Q and line current for the 3 kW motor', () => {
    const r = analyse(MOTOR)
    expect(r.s).toBeCloseTo(4000, 9) // 3000 / 0.75
    expect(r.q).toBeCloseTo(2645.751, 3) // 4000 * sin(41.41 deg)
    expect(r.irms).toBeCloseTo(17.391, 3) // 4000 / 230
    expect(r.phiDeg).toBeCloseTo(41.4096, 3)
  })
})

describe('correction bank', () => {
  it('gives the textbook capacitor for 0.75 to 0.95 at 230 V / 50 Hz', () => {
    // Qc = 3000*(tan 41.41 - tan 18.19) = 3000*(0.881917 - 0.328684) = 1659.70 var
    // C  = 1659.70 / (2*pi*50*230^2) = 99.87 uF
    const r = analyse(MOTOR)
    expect(r.qc).toBeCloseTo(1659.699, 2)
    expect(r.capacitance * 1e6).toBeCloseTo(99.87, 2)
    expect(r.iq).toBeCloseTo(1659.699 / 230, 6)
    expect(r.needsInductor).toBe(false)
    // Xc = 1/(2*pi*f*C) must agree with V/Ic
    expect(r.xq).toBeCloseTo(1 / (2 * Math.PI * 50 * r.capacitance), 6)
  })

  it('cancels the whole reactive load when the target is unity', () => {
    const r = analyse({ ...MOTOR, pfTarget: 1 })
    expect(r.qc).toBeCloseTo(r.q, 9)
    expect(r.qAfter).toBeCloseTo(0, 9)
    expect(r.irmsAfter).toBeCloseTo(3000 / 230, 9) // pure resistive, I = P/V
    expect(r.sAfter).toBeCloseTo(3000, 9)
  })

  it('asks for an inductor when the load already leads', () => {
    const r = analyse({ ...MOTOR, kind: 'leading' })
    expect(r.q).toBeLessThan(0)
    expect(r.qc).toBeLessThan(0)
    expect(r.needsInductor).toBe(true)
    expect(r.capacitance).toBe(0)
    // L = V^2 / (2*pi*f*|Qc|), mirrored from the capacitor case
    expect(r.inductance).toBeCloseTo(230 ** 2 / (2 * Math.PI * 50 * Math.abs(r.qc)), 9)
  })

  it('drops copper loss with the square of the current', () => {
    const r = analyse(MOTOR)
    // I falls as PF rises, so loss falls as (pf1/pf2)^2
    expect(r.lossBefore / r.lossAfter).toBeCloseTo((0.95 / 0.75) ** 2, 9)
    // 4000 VA at 230 V is 17.3913... A; use the exact ratio, not a truncation.
    expect(r.lossBefore).toBeCloseTo((4000 / 230) ** 2 * 0.2, 3)
    expect(r.lossSaved).toBeCloseTo(r.lossBefore - r.lossAfter, 12)
  })
})

describe('waveforms', () => {
  const N = 4096
  const CYCLES = 2

  it('reproduces the phasor numbers in the time domain', () => {
    const r = analyse(MOTOR)
    const w = waveforms(230, 50, r.irms, r.phi, r.iq, N, CYCLES)
    // Exactly CYCLES whole periods, so the discrete averages are the true ones.
    expect(rms(w.v)).toBeCloseTo(230, 8)
    expect(rms(w.iLoad)).toBeCloseTo(4000 / 230, 6)
    expect(mean(w.p)).toBeCloseTo(3000, 5) // average of v*i is the real power
    expect(meanProduct(w.v, w.iLoad) / (rms(w.v) * rms(w.iLoad))).toBeCloseTo(0.75, 9)
    // p(t) = P + S*cos(2wt - phi), so it swings P +- S. A sampled trace only
    // straddles those extrema, it does not land on them, so match to 2 places.
    // p(t) dipping negative is the point: that is energy handed back to source.
    expect(Math.min(...w.p)).toBeCloseTo(3000 - 4000, 2)
    expect(Math.max(...w.p)).toBeCloseTo(3000 + 4000, 2)
    expect(Math.min(...w.p)).toBeLessThan(0)
  })

  it('sums the bank current into a smaller, more in-phase line current', () => {
    const r = analyse(MOTOR)
    const w = waveforms(230, 50, r.irms, r.phi, r.iq, N, CYCLES)
    // Phasor sum done sample by sample: |I_line| = P / (V * pfTarget)
    expect(rms(w.iLine)).toBeCloseTo(3000 / (230 * 0.95), 6)
    // The bank is lossless, so the real power is unchanged.
    expect(meanProduct(w.v, w.iLine)).toBeCloseTo(3000, 5)
    // and the line PF is now the target.
    expect(meanProduct(w.v, w.iLine) / (rms(w.v) * rms(w.iLine))).toBeCloseTo(0.95, 9)
  })

  it('stays bounded and finite for extreme inputs', () => {
    // 400 Hz avionics feed, near worst case PF, one cycle window.
    const r = analyse({ ...MOTOR, frequency: 400, pf: 0.05, vrms: 480 })
    const w = waveforms(480, 400, r.irms, r.phi, r.iq, 512, 1)
    const bound = Math.SQRT2 * r.irms * 1.0001
    for (let i = 0; i < w.v.length; i++) {
      expect(Number.isFinite(w.v[i])).toBe(true)
      expect(Math.abs(w.v[i])).toBeLessThanOrEqual(Math.SQRT2 * 480 * 1.0001)
      expect(Math.abs(w.iLoad[i])).toBeLessThanOrEqual(bound)
    }
    expect(traceScale(325, 24.6)).toBe(10) // 13.2 rounds down to the 1-2-5 grid
    expect(traceScale(325, 7000)).toBeCloseTo(0.05, 12)
  })
})
