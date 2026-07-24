import { describe, expect, it } from 'vitest'
import {
  analyse,
  bandwidth,
  fullPowerBandwidth,
  idealOutput,
  noiseGain,
  outputLimits,
  signalGain,
  simulate,
  thresholds,
} from './opamp'
import type { OpAmp, OpAmpConfig } from './opamp'
import { generate, peakToPeak } from './signal'

/** Rf/Rin = 10, bias at 0 V so the algebra is the bare textbook form. */
const cfg = (over: Partial<OpAmpConfig> = {}): OpAmpConfig => ({
  mode: 'inverting',
  rf: 10e3,
  rin: 1e3,
  rin2: 10e3,
  cf: 100e-9,
  v2: 0,
  vbias: 0,
  vref: 1.65,
  r1: 10e3,
  r2: 100e3,
  ...over,
})

/** Ideal-ish split supply part, so rails and headroom stay out of the way. */
const split = (over: Partial<OpAmp> = {}): OpAmp => ({
  gbw: 1e6,
  slewRate: 0.6e6,
  vpos: 12,
  vneg: -12,
  headroom: 0,
  ...over,
})

/** MCP6002 on an ESP32 rail: 0 to 3.3 V, 25 mV of headroom each end. */
const single = (over: Partial<OpAmp> = {}): OpAmp => ({
  gbw: 1e6,
  slewRate: 0.6e6,
  vpos: 3.3,
  vneg: 0,
  headroom: 0.025,
  ...over,
})

describe('closed-loop gain', () => {
  it('matches the textbook formula for every configuration', () => {
    expect(signalGain(cfg({ mode: 'inverting' }))).toBeCloseTo(-10, 12)
    expect(signalGain(cfg({ mode: 'noninverting' }))).toBeCloseTo(11, 12) // 1 + Rf/Rg
    expect(signalGain(cfg({ mode: 'buffer' }))).toBe(1)
    expect(signalGain(cfg({ mode: 'difference', rf: 20e3, rin: 10e3 }))).toBeCloseTo(2, 12)

    // Summing: Vout = -Rf*(V1/R1 + V2/R2) with all three resistors equal.
    const sum = cfg({ mode: 'summing', rf: 10e3, rin: 10e3, rin2: 10e3, v2: 0.5 })
    expect(idealOutput(sum, 1)).toBeCloseTo(-1.5, 12)

    // Difference rejects the common part: (Rf/Rin)*(V+ - V-).
    const diff = cfg({ mode: 'difference', rf: 20e3, rin: 10e3, v2: 0.5 })
    expect(idealOutput(diff, 1)).toBeCloseTo(1, 12)
    expect(idealOutput(diff, 2.5)).toBeCloseTo(4, 12) // 2*(2.5-0.5)

    // Single supply: the stage swings about Vbias, so 1.65 V in gives 1.65 V
    // out at unity gain and a 0.5 V dip comes out 0.5 V above the bias.
    const biased = cfg({ mode: 'inverting', rf: 10e3, rin: 10e3, vbias: 1.65 })
    expect(idealOutput(biased, 1.65)).toBeCloseTo(1.65, 12)
    expect(idealOutput(biased, 1.15)).toBeCloseTo(2.15, 12)
  })
})

describe('gain bandwidth product', () => {
  it('divides GBW by the noise gain, not the signal gain', () => {
    const amp = split()
    const inv = cfg({ mode: 'inverting' }) // Av = -10
    const ni = cfg({ mode: 'noninverting' }) // Av = +11

    expect(noiseGain(inv)).toBeCloseTo(11, 12)
    expect(noiseGain(ni)).toBeCloseTo(11, 12)
    // Different signal gains, identical bandwidth: 1 MHz / 11.
    expect(bandwidth(inv, amp)).toBeCloseTo(90_909.09, 2)
    expect(bandwidth(ni, amp)).toBeCloseTo(bandwidth(inv, amp), 9)

    // A buffer has noise gain 1, so it gets the whole GBW.
    expect(bandwidth(cfg({ mode: 'buffer' }), amp)).toBeCloseTo(1e6, 6)

    // Summing: the inverting node sees R1 || R2 = 5k, so NG = 1 + 10k/5k.
    expect(noiseGain(cfg({ mode: 'summing', rf: 10e3, rin: 10e3, rin2: 10e3 }))).toBeCloseTo(
      3,
      12,
    )
  })
})

describe('comparator hysteresis', () => {
  it('places the thresholds either side of the reference and refuses to chatter', () => {
    const amp = single()
    const { hi, lo } = outputLimits(amp)
    expect(hi).toBeCloseTo(3.275, 12)
    expect(lo).toBeCloseTo(0.025, 12)

    // Vth = (Vref*R2 + Vout*R1)/(R1+R2) with Vref 1.65, R1 10k, R2 100k.
    const t = thresholds(cfg({ mode: 'comparator' }), amp)
    expect(t.upper).toBeCloseTo(1.797727, 6)
    expect(t.lower).toBeCloseTo(1.502273, 6)
    // Band is exactly (Vhi - Vlo)*R1/(R1+R2) = 3.25 * 10/110.
    expect(t.hysteresis).toBeCloseTo(0.295455, 6)
    expect(t.upper - t.lower).toBeCloseTo(t.hysteresis, 12)

    // With R2 >> R1 it collapses to the quoted Vth = Vref +- Vout*R1/(R1+R2).
    const stiff = thresholds(cfg({ mode: 'comparator', r1: 10e3, r2: 10e6 }), amp)
    const k = 10e3 / 10.01e6
    expect(stiff.upper).toBeCloseTo(1.65 + hi * k, 2)
    expect(stiff.lower).toBeCloseTo(1.65 + lo * k, 2)

    // Two edges per cycle for a signal that clears both thresholds.
    const c = cfg({ mode: 'comparator' })
    const n = 8192
    const freq = 1e3
    const dt = 4 / freq / n // 4 cycles
    // Sine centred on the reference, big enough to clear both thresholds.
    const input = generate({ kind: 'sine', amplitude: 1, frequency: freq, offset: 1.65 }, n, dt)
    const r = simulate(input, dt, c, amp, false)
    expect(r.transitions).toBe(8) // two edges per cycle, four cycles
    for (const v of r.output) {
      expect(v).toBeGreaterThanOrEqual(0.025 - 1e-12)
      expect(v).toBeLessThanOrEqual(3.275 + 1e-12)
    }

    // A signal smaller than the hysteresis band cannot make it toggle at all.
    const tiny = generate(
      { kind: 'sine', amplitude: 0.05, frequency: freq, offset: 1.65 },
      n,
      dt,
    )
    expect(simulate(tiny, dt, c, amp, false).transitions).toBe(0)
  })
})

describe('time domain solver', () => {
  it('reproduces the analytic gain well inside the bandwidth', () => {
    const amp = split()
    const c = cfg({ mode: 'inverting' }) // Av = -10, BW = 90.9 kHz
    const n = 8192
    const freq = 1e3
    const dt = 4 / freq / n
    const input = generate({ kind: 'sine', amplitude: 0.1, frequency: freq, offset: 0 }, n, dt)
    const r = simulate(input, dt, c, amp)
    expect(peakToPeak(r.output) / peakToPeak(input)).toBeCloseTo(10, 2)
    expect(r.clipped).toBe(0)
    expect(r.slewed).toBe(0)
  })

  it('clips at the rails instead of returning an impossible swing', () => {
    const amp = single() // 0 to 3.3 V
    const c = cfg({ mode: 'noninverting' }) // Av = +11, so 1 V in asks for 11 V
    const n = 8192
    const freq = 1e3
    const dt = 4 / freq / n
    const input = generate({ kind: 'sine', amplitude: 1, frequency: freq, offset: 0 }, n, dt)
    const r = simulate(input, dt, c, amp)
    expect(r.clipped).toBeGreaterThan(0)
    for (const v of r.output) {
      expect(v).toBeGreaterThanOrEqual(0.025 - 1e-12)
      expect(v).toBeLessThanOrEqual(3.275 + 1e-12)
    }
  })

  it('never moves the output faster than the slew rate', () => {
    const amp = split() // SR = 0.6 V/us
    const c = cfg({ mode: 'buffer' })
    const n = 8192
    const freq = 200e3 // above the 95.5 kHz full power bandwidth
    const dt = 4 / freq / n

    // A 1 V peak sine at 200 kHz demands 2*pi*f*Vp = 1.257 MV/s from a part
    // that can only do 0.6 MV/s. FPBW = SR/(2*pi*Vp) = 95.5 kHz.
    const a = analyse(c, amp, freq, 1)
    expect(a.slewNeeded).toBeCloseTo(1.2566e6, -2)
    expect(a.slewLimited).toBe(true)
    expect(a.fullPowerBw).toBeCloseTo(95_492.97, 1)
    expect(fullPowerBandwidth(0.6e6, 1)).toBeCloseTo(a.fullPowerBw, 9)

    const input = generate({ kind: 'sine', amplitude: 1, frequency: freq, offset: 0 }, n, dt)
    const r = simulate(input, dt, c, amp)
    expect(r.slewed).toBeGreaterThan(0)
    const maxStep = amp.slewRate * dt
    for (let i = 1; i < n; i++) {
      expect(Math.abs(r.output[i] - r.output[i - 1])).toBeLessThanOrEqual(maxStep * (1 + 1e-9))
    }
    // Slew limiting turns the sine into a triangle, so amplitude is lost.
    expect(peakToPeak(r.output)).toBeLessThan(peakToPeak(input))
  })

  it('integrates a square wave into a ramp of -Vin/(Rin*Cf)', () => {
    // Rin*Cf = 10k * 100n = 1 ms, so 1 V in gives 1000 V/s down.
    const c = cfg({ mode: 'integrator', rin: 10e3, cf: 100e-9, rf: 10e6, vbias: 0 })
    const amp = split({ vpos: 15, vneg: -15, slewRate: 1e6 })
    const n = 8192
    const freq = 100
    const dt = 2 / freq / n
    const input = generate({ kind: 'square', amplitude: 1, frequency: freq, offset: 0 }, n, dt)
    const r = simulate(input, dt, c, amp, false)

    // Measure in the middle of the first (positive input) half cycle.
    const a = Math.round(1e-3 / dt)
    const b = Math.round(2e-3 / dt)
    const slope = (r.output[b] - r.output[a]) / ((b - a) * dt)
    expect(input[a]).toBeCloseTo(1, 12)
    expect(slope).toBeCloseTo(-1000, -1) // within 5 V/s of -1/(Rin*Cf)
    expect(r.clipped).toBe(0)

    // Unity gain crossover of the ideal integrator, 1/(2*pi*Rin*Cf).
    expect(analyse(c, amp, freq, 1).integratorUnity).toBeCloseTo(159.155, 3)
  })

  it('stays bounded when dt dwarfs every time constant', () => {
    // dt of 1 s against a 1.75 us closed-loop pole. Forward Euler would explode.
    const amp = split({ gbw: 1e6 })
    const c = cfg({ mode: 'inverting' })
    const slow = simulate(
      generate({ kind: 'square', amplitude: 0.5, frequency: 0.1, offset: 0 }, 500, 1),
      1,
      c,
      amp,
    )
    for (const v of slow.output) {
      expect(Number.isFinite(v)).toBe(true)
      expect(Math.abs(v)).toBeLessThanOrEqual(12)
    }

    // And the other extreme: a part so slow its pole never moves in one sample.
    const sleepy = simulate(
      generate({ kind: 'sine', amplitude: 0.5, frequency: 1e6, offset: 0 }, 500, 1e-9),
      1e-9,
      c,
      split({ gbw: 1 }),
    )
    for (const v of sleepy.output) {
      expect(Number.isFinite(v)).toBe(true)
      expect(Math.abs(v)).toBeLessThanOrEqual(12)
    }
  })
})
