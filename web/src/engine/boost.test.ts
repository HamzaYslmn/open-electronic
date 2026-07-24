import { describe, expect, it } from 'vitest'
import { analyse, ccmDuty, idealDuty, maxOutputVoltage, waveform } from './boost'
import type { BoostInput } from './boost'
import { mean } from './signal'

/** Lossless power stage, so every result is a textbook figure. */
const ideal = (over: Partial<BoostInput> = {}): BoostInput => ({
  vin: 5,
  vout: 12,
  iout: 1,
  l: 10e-6,
  isat: 100,
  fsw: 100e3,
  cout: 100e-6,
  esr: 0,
  vd: 0,
  ron: 0,
  dcr: 0,
  ...over,
})

describe('boost duty cycle', () => {
  it('gives the textbook duty and reduces to it when the drops are zero', () => {
    // 3.3 V ESP32 rail up to 5 V: D = 1 - 3.3/5
    expect(idealDuty(3.3, 5)).toBeCloseTo(0.34, 12)
    expect(ccmDuty(3.3, 5, 0.5)).toBeCloseTo(0.34, 12)
    // 5 V to 12 V: D = 1 - 5/12
    expect(ccmDuty(5, 12, 1)).toBeCloseTo(7 / 12, 12)
  })

  it('keeps volt-second balance once the real drops are in', () => {
    const r = analyse({
      vin: 3.3,
      vout: 5,
      iout: 0.5,
      l: 6.8e-6,
      isat: 2,
      fsw: 500e3,
      cout: 22e-6,
      esr: 0.02,
      vd: 0.35,
      ron: 0.1,
      dcr: 0.05,
    })
    expect(r.mode).toBe('CCM')
    // The inductor has to reset every period: v_on·D == v_off·(1-D).
    expect(r.vOn * r.duty).toBeCloseTo(r.vOff * (1 - r.duty), 12)
    // Charge balance on the output cap: the diode carries IL for (1-D).
    expect(r.iin).toBeCloseTo(0.5 / (1 - r.duty), 12)
    // Drops push the duty above the ideal 1 - 3.3/5 = 0.34.
    expect(r.duty).toBeGreaterThan(r.dutyIdeal)
    expect(r.duty).toBeCloseTo(0.3971, 3)
  })

  it('refuses to step down', () => {
    const r = analyse(ideal({ vin: 12, vout: 5 }))
    expect(r.stepUp).toBe(false)
    expect(r.achievable).toBe(false)
    expect(Number.isNaN(r.duty)).toBe(true)
  })
})

describe('boost currents and ripple', () => {
  it('matches dIL = Vin·D/(fsw·L) and Iin = Iout/(1-D)', () => {
    const r = analyse(ideal())
    // D = 7/12, dIL = 5·(7/12)/(100k·10u) = 2.9167 A
    expect(r.ripple).toBeCloseTo(2.916667, 6)
    // Iin = 1/(1 - 7/12) = 2.4 A, well above the 1 A load
    expect(r.iin).toBeCloseTo(2.4, 9)
    expect(r.ipeak).toBeCloseTo(2.4 + 2.916667 / 2, 5)
    expect(r.ivalley).toBeCloseTo(2.4 - 2.916667 / 2, 5)
    // Lossless, so all the power gets through and the stress is the output rail.
    expect(r.efficiency).toBeCloseTo(1, 12)
    expect(r.vSwitchStress).toBeCloseTo(12, 12)
    expect(r.vDiodeStress).toBeCloseTo(12, 12)
  })

  it('charges the diode drop straight to the efficiency', () => {
    const r = analyse(ideal({ vd: 0.35 }))
    // Iin = Iout·(Vout+Vd)/Vin, so eta = Vout/(Vout+Vd)
    expect(r.iin).toBeCloseTo(12.35 / 5, 9)
    expect(r.efficiency).toBeCloseTo(12 / 12.35, 9)
    expect(r.ploss).toBeCloseTo(0.35 * 1, 9) // Vd·Iout
  })

  it('crosses into DCM below the boundary load and solves the DCM duty there', () => {
    // Iout_crit = Vin·D·(1-D)/(2·fsw·L) = 5·(7/12)·(5/12)/(2·100k·100u) = 60.8 mA
    const big = analyse(ideal({ l: 100e-6 }))
    expect(big.ioutBoundary).toBeCloseTo(0.06076389, 8)

    expect(analyse(ideal({ l: 100e-6, iout: 0.06076389 * 1.05 })).mode).toBe('CCM')
    expect(analyse(ideal({ l: 100e-6, iout: 0.06076389 * 0.9 })).mode).toBe('DCM')

    // 50 mA load: D = sqrt(2·L·fsw·Iout·(Vout-Vin))/Vin = sqrt(7)/5
    const r = analyse(ideal({ l: 100e-6, iout: 0.05 }))
    expect(r.mode).toBe('DCM')
    expect(r.duty).toBeCloseTo(Math.sqrt(7) / 5, 9)
    expect(r.ipeak).toBeCloseTo(0.2645751, 6)
    expect(r.ivalley).toBe(0)
    expect(r.d2).toBeCloseTo(0.3779645, 6)
    // Still lossless, so Iin = Iout·Vout/Vin
    expect(r.iin).toBeCloseTo(0.12, 9)
    expect(r.duty + r.d2).toBeLessThan(1) // there really is an idle window
  })
})

describe('boost limits and waveform', () => {
  it('caps the gain at the value inductor resistance allows', () => {
    // Erickson: M_max = 0.5·sqrt(R/R_L). With Vin=5, Iout=1, DCR=0.5 that is
    // Vout_max = Vin²/(4·Iout·DCR) = 12.5 V.
    expect(maxOutputVoltage(5, 1, 0, 0, 0.5)).toBeCloseTo(12.5, 9)
    expect(Number.isNaN(ccmDuty(5, 15, 1, 0, 0, 0.5))).toBe(true)

    const over = analyse(ideal({ vout: 15, dcr: 0.5, l: 100e-6 }))
    expect(over.achievable).toBe(false)
    expect(over.stepUp).toBe(true)

    // Just under the ceiling: x=1-D solves 12x² - 5x + 0.5 = 0 -> x = 0.25.
    const ok = analyse(ideal({ vout: 12, dcr: 0.5, l: 100e-6 }))
    expect(ok.achievable).toBe(true)
    expect(ok.duty).toBeCloseTo(0.75, 9)
    expect(ok.iin).toBeCloseTo(4, 9)
    expect(ok.ploss).toBeCloseTo(4 * 4 * 0.5, 6) // Iin²·DCR = 8 W
  })

  it('produces a waveform whose averages obey charge balance', () => {
    const r = analyse(ideal())
    const { il, isw, idiode } = waveform(r, 8192, 4)
    expect(mean(il)).toBeCloseTo(r.iin, 2)
    expect(mean(idiode)).toBeCloseTo(1, 2) // diode average == load current
    expect(mean(isw)).toBeCloseTo(r.iin - 1, 2)
    expect(Math.max(...il)).toBeCloseTo(r.ipeak, 2)
    expect(Math.min(...il)).toBeCloseTo(r.ivalley, 2)
  })

  it('stays bounded across extreme inductance and frequency', () => {
    for (const l of [1e-9, 1e-6, 1e-3, 1]) {
      for (const fsw of [1e3, 100e3, 5e6]) {
        const r = analyse(ideal({ l, fsw }))
        const { il } = waveform(r, 2048, 3)
        for (const v of il) {
          expect(Number.isFinite(v)).toBe(true)
          expect(v).toBeGreaterThanOrEqual(-1e-9)
          expect(v).toBeLessThanOrEqual(r.ipeak + 1e-9)
        }
      }
    }
  })
})
