import { describe, expect, it } from 'vitest'
import { analyse, cutoff, magnitude, phaseDeg, reactance, simulate, timeConstant } from './rl'
import { generate, peakToPeak } from './signal'

// Reference part: 100 mH into 1 kOhm, lossless winding.
// tau = L/R = 1e-4 s, fc = R/(2*pi*L) = 1591.549 Hz, the same corner as the
// 1 kOhm + 100 nF RC so the duality is directly comparable.
const L = 100e-3
const R = 1000
const FC = 1591.5494

describe('rl frequency response', () => {
  it('computes the textbook corner frequency and reactance', () => {
    expect(timeConstant(L, R)).toBeCloseTo(1e-4, 12)
    expect(cutoff(L, R)).toBeCloseTo(FC, 3)
    // At the corner the reactance equals the resistance, by definition.
    expect(reactance(FC, L)).toBeCloseTo(R, 3)
  })

  it('is -3 dB at the cutoff for both modes', () => {
    expect(magnitude(FC, R, L, 0, 'lowpass')).toBeCloseTo(Math.SQRT1_2, 6)
    expect(magnitude(FC, R, L, 0, 'highpass')).toBeCloseTo(Math.SQRT1_2, 6)
    // Low pass passes DC, high pass blocks it.
    expect(magnitude(0, R, L, 0, 'lowpass')).toBe(1)
    expect(magnitude(0, R, L, 0, 'highpass')).toBe(0)
  })

  it('rolls off at 20 dB/decade past the corner', () => {
    const lpA = 20 * Math.log10(magnitude(10 * FC, R, L, 0, 'lowpass'))
    const lpB = 20 * Math.log10(magnitude(100 * FC, R, L, 0, 'lowpass'))
    expect(lpA - lpB).toBeCloseTo(20, 1)
    // The high pass rolls off the other way, below the corner.
    const hpA = 20 * Math.log10(magnitude(FC / 100, R, L, 0, 'highpass'))
    const hpB = 20 * Math.log10(magnitude(FC / 10, R, L, 0, 'highpass'))
    expect(hpB - hpA).toBeCloseTo(20, 1)
  })

  it('gives 45 degrees of phase at the cutoff', () => {
    expect(phaseDeg(FC, R, L, 0, 'lowpass')).toBeCloseTo(-45, 3)
    expect(phaseDeg(FC, R, L, 0, 'highpass')).toBeCloseTo(45, 3)
  })

  it('lets winding resistance shift fc and floor the response', () => {
    const rw = 100
    const rt = R + rw
    const lp = analyse(R, L, rw, 0, 'lowpass')
    const hp = analyse(R, L, rw, 0, 'highpass')
    expect(lp.rTotal).toBe(1100)
    expect(lp.fc).toBeCloseTo(rt / (2 * Math.PI * L), 6) // 1750.7 Hz, not 1591.5
    expect(lp.tau).toBeCloseTo(L / rt, 12)
    // Passband tops out at R/(R+Rw), and the high pass leaks DC at Rw/(R+Rw).
    expect(lp.gain).toBeCloseTo(1000 / 1100, 9)
    expect(lp.parasiticDb).toBeCloseTo(-0.8279, 3)
    expect(hp.gain).toBeCloseTo(100 / 1100, 9)
  })
})

describe('rl time-domain simulation', () => {
  it('reaches 63.2% of the final current after one time constant', () => {
    const tau = L / R
    const dt = tau / 1000
    const n = 1001 // index 1000 is exactly t = tau after the step at index 1
    const step = Float64Array.from({ length: n }, (_, i) => (i === 0 ? 0 : 1))
    const { current, vR } = simulate(step, dt, R, L, 0, false)
    const iFinal = 1 / R
    expect(current[0]).toBe(0)
    expect(current[1000] / iFinal).toBeCloseTo(1 - Math.exp(-1), 4)
    expect(vR[1000]).toBeCloseTo(0.63212, 4)
  })

  it('matches the analytic gain and keeps KVL exact', () => {
    const n = 4096
    const dt = 8 / FC / n // 8 cycles at the corner frequency
    const input = generate({ kind: 'sine', amplitude: 1, frequency: FC, offset: 0 }, n, dt)
    const { vR, vL } = simulate(input, dt, R, L, 0)
    // Peak-to-peak ratio is the voltage gain: expect -3 dB (0.7071) on both taps.
    expect(peakToPeak(vR) / peakToPeak(input)).toBeCloseTo(Math.SQRT1_2, 2)
    expect(peakToPeak(vL) / peakToPeak(input)).toBeCloseTo(Math.SQRT1_2, 2)
    for (let i = 0; i < n; i++) expect(vR[i] + vL[i]).toBeCloseTo(input[i], 12)
  })

  it('stays bounded when dt is far larger than tau (Euler would diverge)', () => {
    const n = 500
    const dt = 1 // 1e6 times the time constant of a 1 uH coil in 1 kOhm
    const input = generate({ kind: 'square', amplitude: 1, frequency: 0.1, offset: 0 }, n, dt)
    const { current, vR } = simulate(input, dt, R, 1e-6, 0)
    for (let i = 0; i < n; i++) {
      expect(Math.abs(current[i])).toBeLessThanOrEqual(1 / R + 1e-12)
      expect(Math.abs(vR[i])).toBeLessThanOrEqual(1.0001)
    }
  })
})
