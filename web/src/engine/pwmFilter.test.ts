import { describe, expect, it } from 'vitest'
import { mean } from './signal'
import {
  analyse,
  attenuationDb,
  cutoff,
  maxDutyBits,
  quantiseDuty,
  rippleApprox,
  settlingTime,
  simulate,
  steadyState,
} from './pwmFilter'

describe('steady-state ripple', () => {
  it('matches the hand-computed symmetric case', () => {
    // Vs = 1, D = 0.5, T = tau = 1 s. a = b = e^-0.5 = 0.6065307.
    // Vmax = (1-a)/(1-a^2) = 1/(1+a) = 0.6224593, Vmin = a*Vmax = 0.3775407.
    const ss = steadyState(1, 0.5, 1, 1)
    expect(ss.vmax).toBeCloseTo(0.6224593, 6)
    expect(ss.vmin).toBeCloseTo(0.3775407, 6)
    expect(ss.vpp).toBeCloseTo(0.2449186, 6)
    // 50% duty is symmetric about Vs/2, so the ripple straddles the mean.
    expect((ss.vmax + ss.vmin) / 2).toBeCloseTo(0.5, 12)
  })

  it('collapses to Vs*D*(1-D)/(f*tau) once tau >> 1/f', () => {
    const vs = 3.3
    const duty = 0.3
    const f = 10e3
    const tau = 1 // 1 MOhm * 1 uF, i.e. 10000 PWM periods per tau
    const exact = steadyState(vs, duty, f, tau).vpp
    expect(exact / rippleApprox(vs, duty, f, tau)).toBeCloseTo(1, 3)

    // At tau comparable to the period the linear estimate is optimistic.
    expect(rippleApprox(1, 0.5, 1, 1)).toBeGreaterThan(steadyState(1, 0.5, 1, 1).vpp)

    // Both extremes stay physical: no filter is full swing, huge tau is flat DC.
    const none = steadyState(3.3, 0.4, 5e3, 0)
    expect(none.vpp).toBeCloseTo(3.3, 12)

    const heavy = steadyState(3.3, 0.4, 5e3, 1e6)
    expect(heavy.vpp).toBeLessThan(1e-6)
    expect(heavy.vmin).toBeCloseTo(0.4 * 3.3, 6)
  })
})

describe('time-domain response', () => {
  it('averages to D*Vs over a whole period whatever the ripple', () => {
    const vs = 3.3
    const duty = 0.5
    const f = 1000
    const n = 20_000
    const dt = 1 / f / n // exactly one PWM period
    const y = simulate({ vs, duty, f, tau: 1e-3, n, dt })
    // Unity DC gain: the mean is D*Vs even with 700 mV of ripple on top.
    expect(steadyState(vs, duty, f, 1e-3).vpp).toBeGreaterThan(0.5)
    expect(mean(y)).toBeCloseTo(1.65, 3)
  })

  it('charges through 63.2% at one tau and 99.3% at five tau', () => {
    const tau = 10e-3 // 10 kOhm * 1 uF
    const target = 0.5 * 3.3
    const n = 5001
    const dt = tau / 1000 // index 1000 is t = tau, index 5000 is t = 5 tau
    const y = simulate({ vs: 3.3, duty: 0.5, f: 100e3, tau, n, dt, y0: 0 })
    expect(y[0]).toBeCloseTo(0, 6)
    expect(y[1000]).toBeCloseTo(target * (1 - Math.exp(-1)), 3)
    expect(y[5000]).toBeCloseTo(target * (1 - Math.exp(-5)), 3)
  })

  it('stays inside the rails when dt dwarfs both tau and the PWM period', () => {
    // 1 s per sample against a 200 us period and a 1 ms tau. Forward Euler
    // would diverge here; the closed form cannot.
    const y = simulate({ vs: 3.3, duty: 0.37, f: 5000, tau: 1e-3, n: 1000, dt: 1, y0: 0 })
    for (const v of y) {
      expect(Number.isFinite(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(3.3)
    }
  })
})

describe('filter and hardware limits', () => {
  it('reports textbook settling and attenuation', () => {
    expect(settlingTime(1e-3, 0.01)).toBeCloseTo(4.60517e-3, 8)
    expect(attenuationDb(1591.549, cutoff(1000, 100e-9))).toBeCloseTo(-3.0103, 3)
    // One decade above the corner a first-order filter is down 20 dB.
    expect(attenuationDb(10_000, 1000)).toBeCloseTo(-20.043, 3)
  })

  it('caps LEDC duty resolution at 2^bits * f <= 80 MHz', () => {
    expect(maxDutyBits(5000)).toBe(13) // floor(log2(16000))
    expect(maxDutyBits(80e6 / 1024)).toBe(10) // exactly 78125 Hz
    expect(quantiseDuty(1 / 3, 2)).toBeCloseTo(0.25, 12)
    expect(quantiseDuty(0.5, 10)).toBeCloseTo(0.5, 12)
  })

  it('flags an over-resolution timer and an over-driven GPIO', () => {
    const ok = analyse({ vs: 3.3, r: 10_000, c: 1e-6, f: 5000, duty: 0.5, bits: 10 })
    expect(ok.vavg).toBeCloseTo(1.65, 9)
    expect(ok.bitsOk).toBe(true)
    expect(ok.gpioOk).toBe(true) // 3.3 V / 10 kOhm = 0.33 mA
    expect(ok.smoothing).toBe('good') // fc = 15.9 Hz against 5 kHz

    const bad = analyse({ vs: 3.3, r: 100, c: 1e-6, f: 5000, duty: 0.5, bits: 14 })
    expect(bad.bitsOk).toBe(false) // 14 bits needs f <= 4883 Hz
    expect(bad.gpioOk).toBe(false) // 33 mA, way past the 12 mA pin limit
    expect(bad.smoothing).toBe('poor') // fc = 1.59 kHz, only 3.1x below f_pwm
  })
})
