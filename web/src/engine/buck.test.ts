import { describe, expect, it } from 'vitest'
import {
  SCHOTTKY_VF,
  analyse,
  boundaryCurrent,
  inductorVolts,
  inductorWaveform,
  operatingPoint,
  outputRipple,
} from './buck'
import type { BuckSpec } from './buck'
import { mean, peakToPeak } from './signal'

/**
 * 12 V to 5 V at 2 A, 10 uH, 100 kHz, every parasitic zeroed so the numbers are
 * the ones you get out of a textbook by hand.
 *   D = 5/12 = 0.41667
 *   dIL = 5*(1-D)/(100k*10u) = 2.9167 A
 *   dVout = dIL/(8*100k*100u) = 36.46 mV
 */
const IDEAL: BuckSpec = {
  vin: 12,
  vout: 5,
  iout: 2,
  l: 10e-6,
  c: 100e-6,
  esr: 0,
  fsw: 100e3,
  rdsOn: 0,
  dcr: 0,
  rectifier: 'sync',
}

/** Numeric charge delivered to the capacitor over one period, in coulombs. */
function chargeAbove(samples: ArrayLike<number>, iout: number, dt: number): number {
  let q = 0
  for (let i = 0; i < samples.length; i++) if (samples[i] > iout) q += (samples[i] - iout) * dt
  return q
}

describe('buck steady state', () => {
  it('gives the textbook duty and ripple with no parasitics', () => {
    const op = operatingPoint(IDEAL)
    expect(op.mode).toBe('ccm')
    expect(op.dropout).toBe(false)
    expect(op.duty).toBeCloseTo(5 / 12, 10)
    expect(op.duty).toBeCloseTo(op.dutyIdeal, 10)
    expect(op.ripple).toBeCloseTo(2.9166667, 6)
    expect(op.boundary).toBeCloseTo(boundaryCurrent(op.ripple), 12)
    expect(op.boundary).toBeCloseTo(1.4583333, 6)
    expect(op.peak).toBeCloseTo(2 + 1.4583333, 6)
    expect(op.valley).toBeCloseTo(2 - 1.4583333, 6)
    // Ripple is inversely proportional to L: double L, halve the ripple.
    expect(operatingPoint({ ...IDEAL, l: 20e-6 }).ripple).toBeCloseTo(op.ripple / 2, 9)
  })

  it('output ripple follows dIL/(8*fsw*C) and adds the ESR term', () => {
    const op = operatingPoint(IDEAL)
    const clean = outputRipple(IDEAL, op)
    expect(clean.cap).toBeCloseTo(0.0364583, 6)
    expect(clean.esr).toBe(0)
    // 50 mOhm of ESR on 2.9167 A of ripple is 146 mV, i.e. four times the
    // capacitive term. This is why electrolytics ripple so badly.
    const lossy = outputRipple({ ...IDEAL, esr: 0.05 }, op)
    expect(lossy.esr).toBeCloseTo(0.1458333, 6)
    expect(lossy.total).toBeCloseTo(0.0364583 + 0.1458333, 6)
  })

  it('drops into DCM below half the ripple current', () => {
    const light: BuckSpec = { ...IDEAL, iout: 0.5 }
    const op = operatingPoint(light)
    expect(light.iout).toBeLessThan(op.boundary)
    expect(op.mode).toBe('dcm')
    expect(op.valley).toBe(0)
    // Closed form: D1 = sqrt(2*L*fsw*Iout*Vout/(Vin*(Vin-Vout))) = sqrt(5/84)
    expect(op.duty).toBeCloseTo(Math.sqrt(5 / 84), 9)
    expect(op.duty).toBeLessThan(op.dutyIdeal) // duty collapses at light load
    expect(op.peak).toBeCloseTo(1.7078250, 6)
    // Charge balance: the triangle must still average to the load current.
    expect(0.5 * op.peak * op.conduction).toBeCloseTo(light.iout, 9)
    // One extra amp of load and the same converter is back in CCM.
    expect(operatingPoint({ ...IDEAL, iout: 2 }).mode).toBe('ccm')
  })

  it('capacitor ripple matches the charge integrated off the current waveform', () => {
    for (const spec of [IDEAL, { ...IDEAL, iout: 0.5 }]) {
      const op = operatingPoint(spec)
      const { dt, samples } = inductorWaveform(spec, op, 20000, 1)
      const numeric = chargeAbove(samples, spec.iout, dt) / spec.c
      expect(numeric).toBeCloseTo(outputRipple(spec, op).cap, 3)
    }
  })

  it('the current waveform is exactly periodic and averages to the load current', () => {
    const n = 8192
    const periods = 2
    const op = operatingPoint(IDEAL)
    const { dt, samples } = inductorWaveform(IDEAL, op, n, periods)
    expect(dt).toBeCloseTo(periods / IDEAL.fsw / n, 15)
    expect(mean(samples)).toBeCloseTo(IDEAL.iout, 3)
    expect(peakToPeak(samples)).toBeCloseTo(op.ripple, 2)
    // Closed form, so nothing accumulates: one period later is the same point.
    expect(samples[n / periods]).toBeCloseTo(samples[0], 6)
    for (const v of samples) {
      expect(Number.isFinite(v)).toBe(true)
      expect(v).toBeLessThanOrEqual(op.peak + 1e-9)
      expect(v).toBeGreaterThanOrEqual(op.valley - 1e-9)
    }
  })

  it('parasitic drops raise the duty and still balance volt-seconds', () => {
    // 5 V USB down to 3.3 V for an ESP32, 500 kHz, real FET and winding.
    const real: BuckSpec = {
      vin: 5,
      vout: 3.3,
      iout: 0.5,
      l: 10e-6,
      c: 22e-6,
      esr: 5e-3,
      fsw: 500e3,
      rdsOn: 50e-3,
      dcr: 40e-3,
      rectifier: 'sync',
    }
    const op = operatingPoint(real)
    const { von, voff } = inductorVolts(real)
    expect(op.duty).toBeCloseTo((3.3 + 0.5 * 0.09) / 5, 9)
    expect(op.duty).toBeGreaterThan(op.dutyIdeal)
    // Rise over the on time must equal fall over the off time, or the current
    // would walk away cycle to cycle.
    const rise = (von * op.duty) / (real.l * real.fsw)
    const fall = (voff * (1 - op.duty)) / (real.l * real.fsw)
    expect(rise).toBeCloseTo(fall, 12)
    expect(op.ripple).toBeCloseTo(fall, 12)
    // A catch diode needs a longer on time than a synchronous FET.
    const diode = operatingPoint({ ...real, rectifier: 'diode' })
    expect(diode.duty).toBeGreaterThan(op.duty)
    expect(inductorVolts({ ...real, rectifier: 'diode' }).voff).toBeCloseTo(
      3.3 + 0.5 * 0.04 + SCHOTTKY_VF,
      9,
    )
  })

  it('a synchronous rectifier beats a Schottky and losses grow with Rds(on)', () => {
    const base: BuckSpec = {
      vin: 5,
      vout: 3.3,
      iout: 0.5,
      l: 10e-6,
      c: 22e-6,
      esr: 5e-3,
      fsw: 500e3,
      rdsOn: 50e-3,
      dcr: 40e-3,
      rectifier: 'sync',
    }
    const sync = analyse(base)
    const diode = analyse({ ...base, rectifier: 'diode' })
    const sloppy = analyse({ ...base, rdsOn: 0.5 })

    expect(sync.efficiency).toBeGreaterThan(0.9)
    expect(sync.efficiency).toBeLessThan(1)
    expect(diode.efficiency).toBeLessThan(sync.efficiency)
    expect(sloppy.efficiency).toBeLessThan(sync.efficiency)
    // Power balance has to close: Pin = Pout + losses, Iin = Pin/Vin.
    expect(sync.pin).toBeCloseTo(sync.pout + sync.loss.total, 12)
    expect(sync.iin).toBeCloseTo(sync.pin / base.vin, 12)
    // Step down means the input current is well below the output current.
    expect(sync.iin).toBeLessThan(base.iout)
  })

  it('flags dropout when the input cannot reach the output', () => {
    const flat = analyse({ ...IDEAL, vin: 4.5, vout: 5 })
    expect(flat.op.dropout).toBe(true)
    expect(flat.op.duty).toBe(1)
    expect(flat.op.ripple).toBe(0)
    expect(operatingPoint(IDEAL).dropout).toBe(false)
  })
})
