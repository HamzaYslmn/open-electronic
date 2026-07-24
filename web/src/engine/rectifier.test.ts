import { describe, expect, it } from 'vitest'
import { generate } from './signal'
import {
  analyse,
  diodeCount,
  diodeLoss,
  operatingPoint,
  peakInverseVoltage,
  rippleVoltage,
  seriesDiodes,
  simulate,
} from './rectifier'
import type { RectifierSpec } from './rectifier'

const N = 8192
const F = 50
const CYCLES = 4
const DT = CYCLES / F / N

/** One sweep of a bipolar sine of the given peak amplitude. */
const sine = (peak: number) =>
  generate({ kind: 'sine', amplitude: peak, frequency: F, offset: 0 }, N, DT)

const spec = (over: Partial<RectifierSpec> = {}): RectifierSpec => ({
  topology: 'bridge',
  vf: 0,
  rs: 0.001,
  c: 0,
  rload: 1000,
  ...over,
})

describe('unfiltered rectification', () => {
  // Textbook: a half wave rectified sine averages Vm/pi and has an RMS of Vm/2,
  // giving a ripple factor of 1.21. No cap, so the sim must land on it exactly.
  it('gives Vm/pi and a ripple factor of 1.21 for half wave', () => {
    const input = sine(10)
    const s = spec({ topology: 'half' })
    const r = analyse(s, input, simulate(input, DT, s), F)
    expect(r.vdc).toBeCloseTo(10 / Math.PI, 2)
    expect(r.rippleFactor).toBeCloseTo(1.211, 2)
    expect(r.fRipple).toBe(50)
  })

  // Full wave doubles the average to 2*Vm/pi and drops the ripple factor to 0.482.
  it('gives 2*Vm/pi and a ripple factor of 0.482 for a bridge', () => {
    const input = sine(10)
    const s = spec()
    const r = analyse(s, input, simulate(input, DT, s), F)
    expect(r.vdc).toBeCloseTo((2 * 10) / Math.PI, 2)
    expect(r.rippleFactor).toBeCloseTo(0.483, 2)
    expect(r.fRipple).toBe(100)
  })

  it('subtracts one drop for half wave and two for a bridge', () => {
    const input = sine(10)
    const half = simulate(input, DT, spec({ topology: 'half', vf: 0.7 }))
    const bridge = simulate(input, DT, spec({ vf: 0.7 }))
    expect(Math.max(...half.vout)).toBeCloseTo(9.3, 2)
    expect(Math.max(...bridge.vout)).toBeCloseTo(8.6, 2)
    // Centre tap shares the bridge's ripple frequency but only one drop.
    const centre = simulate(input, DT, spec({ topology: 'centre', vf: 0.7 }))
    expect(Math.max(...centre.vout)).toBeCloseTo(9.3, 2)
  })
})

describe('capacitor input filter', () => {
  const s = spec({ vf: 0.9, rs: 0.05, c: 4700e-6, rload: 100 })
  const input = sine(12 * Math.SQRT2)
  const r = analyse(s, input, simulate(input, DT, s), F)

  it('matches the closed form Vdc = (Vpeak - drops)/(1 + 1/(2*fr*C*RL))', () => {
    // 16.97 V peak - 1.8 V of drops = 15.17 V, sagging to 15.01 V at 150 mA.
    expect(r.ideal.vdc).toBeCloseTo(15.011, 2)
    expect(Math.abs(r.vdc - r.ideal.vdc) / r.ideal.vdc).toBeLessThan(0.03)
  })

  it('measures a ripple close to Iload/(2f*C) and a high crest factor', () => {
    // 150 mA / (100 Hz * 4700 uF) = 0.319 V peak to peak.
    expect(r.ideal.vripple).toBeCloseTo(0.319, 2)
    expect(r.vRipplePP).toBeGreaterThan(0.7 * r.ideal.vripple)
    expect(r.vRipplePP).toBeLessThan(1.1 * r.ideal.vripple)
    // A capacitor input filter conducts in a narrow spike, never near 180 deg.
    expect(r.conductionAngle).toBeLessThan(30)
    expect(r.crestFactor).toBeGreaterThan(5)
  })

  it('holds Vripple = Idc/(fr*C) exactly and reports no ripple on DC in', () => {
    expect(rippleVoltage(0.1, 100, 1e-3)).toBeCloseTo(1, 12)
    expect(rippleVoltage(0.1, 0, 1e-3)).toBe(0)
    expect(operatingPoint(spec({ c: 1e-3, rload: 100, vf: 0.7 }), 10, 50).fRipple).toBe(100)
  })
})

describe('diode stress', () => {
  it('puts 2*Vpeak on a half wave or centre tapped diode and Vpeak on a bridge', () => {
    const s = spec({ topology: 'half', vf: 0, c: 10e-3, rload: 1000 })
    const input = sine(10)
    const r = analyse(s, input, simulate(input, DT, s), F)
    // The cap holds Vdc near the peak, so PIV = Vpeak + Vdc approaches 2*Vpeak.
    expect(r.piv / r.vPeakIn).toBeGreaterThan(1.9)
    expect(peakInverseVoltage('centre', 10, 9.8)).toBeCloseTo(19.8, 9)
    expect(peakInverseVoltage('bridge', 10, 9.8)).toBe(10)
  })

  it('splits the conduction loss by topology', () => {
    // Every coulomb crosses one junction in a half wave and two in a bridge.
    expect(diodeLoss('half', 0.7, 1)).toEqual({ total: 0.7, perDiode: 0.7 })
    expect(diodeLoss('bridge', 0.7, 1)).toEqual({ total: 1.4, perDiode: 0.35 })
    expect(diodeLoss('centre', 0.7, 1)).toEqual({ total: 0.7, perDiode: 0.35 })
    expect(seriesDiodes('bridge')).toBe(2)
    expect(diodeCount('bridge')).toBe(4)
  })

  it('stays bounded when dt dwarfs both time constants (Euler would diverge)', () => {
    const n = 500
    const dt = 1 // 10x the RL*C discharge tau, 20000x the charging tau
    const input = generate({ kind: 'sine', amplitude: 10, frequency: 0.3, offset: 0 }, n, dt)
    const { vout, idiode } = simulate(input, dt, spec({ c: 1e-3, rload: 100, rs: 0.05 }))
    for (let i = 0; i < n; i++) {
      expect(Number.isFinite(vout[i])).toBe(true)
      expect(vout[i]).toBeGreaterThanOrEqual(0)
      expect(vout[i]).toBeLessThanOrEqual(10)
      expect(idiode[i]).toBeGreaterThanOrEqual(0)
    }
  })
})
