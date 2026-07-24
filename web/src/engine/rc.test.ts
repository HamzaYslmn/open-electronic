import { describe, expect, it } from 'vitest'
import { analyse, cutoff, magnitude, phaseDeg, simulate, timeConstant } from './rc'
import { generate, mean, peakToPeak } from './signal'

describe('rc frequency response', () => {
  it('computes the textbook corner frequency', () => {
    // 1 kOhm + 100 nF -> 1591.5 Hz
    expect(cutoff(1000, 100e-9)).toBeCloseTo(1591.549, 2)
    expect(timeConstant(1000, 100e-9)).toBeCloseTo(1e-4)
  })

  it('is -3 dB at the cutoff for both modes', () => {
    const fc = cutoff(1000, 100e-9)
    expect(magnitude(fc, fc, 'lowpass')).toBeCloseTo(Math.SQRT1_2, 12)
    expect(magnitude(fc, fc, 'highpass')).toBeCloseTo(Math.SQRT1_2, 12)
  })

  it('rolls off at 20 dB/decade above cutoff', () => {
    const fc = 1000
    const a = 20 * Math.log10(magnitude(10 * fc, fc, 'lowpass'))
    const b = 20 * Math.log10(magnitude(100 * fc, fc, 'lowpass'))
    expect(a - b).toBeCloseTo(20, 1)
  })

  it('gives 45 degrees of phase at cutoff', () => {
    expect(phaseDeg(1000, 1000, 'lowpass')).toBeCloseTo(-45, 9)
    expect(phaseDeg(1000, 1000, 'highpass')).toBeCloseTo(45, 9)
  })

  it('passes DC through a lowpass and blocks it in a highpass', () => {
    expect(magnitude(0, 1000, 'lowpass')).toBe(1)
    expect(magnitude(0, 1000, 'highpass')).toBe(0)
  })
})

describe('rc time-domain simulation', () => {
  const tau = 1e-3

  it('reaches 63.2% of the step after one time constant', () => {
    const dt = tau / 1000
    const n = 1001 // index 1000 is exactly t = tau
    const step = new Float64Array(n).fill(1)
    const y = simulate(step, dt, tau, 'lowpass', false)
    // y starts seeded at input[0], so drive it from zero for a true step.
    const fromZero = simulate(
      Float64Array.from({ length: n }, (_, i) => (i === 0 ? 0 : 1)),
      dt,
      tau,
      'lowpass',
      false,
    )
    expect(y[0]).toBe(1)
    expect(fromZero[1000]).toBeCloseTo(1 - Math.exp(-1), 2)
  })

  it('matches the analytic gain for a sine input', () => {
    const freq = 1591.549 // == fc for tau = 1e-4
    const t = 1e-4
    const n = 4096
    const dt = 8 / freq / n // 8 cycles
    const input = generate(
      { kind: 'sine', amplitude: 1, frequency: freq, offset: 0 },
      n,
      dt,
    )
    const out = simulate(input, dt, t, 'lowpass')
    // peak-to-peak ratio is the voltage gain: expect -3 dB (0.7071)
    expect(peakToPeak(out) / peakToPeak(input)).toBeCloseTo(Math.SQRT1_2, 2)
  })

  it('strips the DC offset in highpass mode', () => {
    const n = 4096
    const freq = 1000
    const dt = 8 / freq / n
    const input = generate(
      { kind: 'sine', amplitude: 1, frequency: freq, offset: 5 },
      n,
      dt,
    )
    const out = simulate(input, dt, 1e-4, 'highpass')
    expect(mean(input)).toBeCloseTo(5, 1)
    expect(mean(out)).toBeCloseTo(0, 1)
  })

  it('stays bounded when dt is much larger than tau (Euler would diverge)', () => {
    const n = 500
    const dt = 1 // 1000x the time constant
    const input = generate({ kind: 'square', amplitude: 1, frequency: 0.1, offset: 0 }, n, dt)
    const out = simulate(input, dt, 1e-3, 'lowpass')
    for (const v of out) expect(Math.abs(v)).toBeLessThanOrEqual(1.0001)
  })
})

describe('analyse', () => {
  it('reports reactance and source impedance', () => {
    const r = analyse(1000, 100e-9, 1591.549, 'lowpass')
    expect(r.gainDb).toBeCloseTo(-3.0103, 2)
    expect(r.xc).toBeCloseTo(1000, 0) // Xc == R at cutoff, by definition
    expect(r.z).toBeCloseTo(Math.SQRT2 * 1000, 0)
  })
})
