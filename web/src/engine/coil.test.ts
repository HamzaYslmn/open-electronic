import { describe, expect, it } from 'vitest'
import {
  VF_SILICON,
  V_SWITCH_SAT,
  analyse,
  currentAt,
  decayTime,
  energy,
  kickVoltage,
  onCurrent,
  reactance,
  simulate,
  timeConstant,
} from './coil'
import type { CoilParams } from './coil'

/** 100 mH / 70 ohm is a small relay coil. 3.3 V is the house rail. */
const BASE: CoilParams = {
  supply: 3.3,
  l: 0.1,
  r: 70,
  frequency: 100,
  duty: 0.5,
  protection: 'silicon',
  turnOff: 1e-6,
  vBreakdown: 40,
  iSat: 0.2,
}

describe('coil statics', () => {
  it('computes the textbook time constant and reactance', () => {
    // tau = L/R = 0.1 / 70 = 1.4286 ms
    expect(timeConstant(0.1, 70)).toBeCloseTo(1.428571e-3, 9)
    // XL = 2*pi*100*0.1 = 62.832 ohm
    expect(reactance(100, 0.1)).toBeCloseTo(62.8319, 4)
    // A 1 H coil at 50 Hz is 314.16 ohm, the classic mains-choke number.
    expect(reactance(50, 1)).toBeCloseTo(314.159, 3)
  })

  it('follows the exponential ramp at 1, 2 and 5 time constants', () => {
    const tau = timeConstant(0.1, 70)
    const final = onCurrent(3.3, 70)
    expect(currentAt(3.3, 70, 0.1, tau) / final).toBeCloseTo(0.632121, 6)
    expect(currentAt(3.3, 70, 0.1, 2 * tau) / final).toBeCloseTo(0.864665, 6)
    expect(currentAt(3.3, 70, 0.1, 5 * tau) / final).toBeCloseTo(0.993262, 6)
    // (3.3 - 0.2) / 70 = 44.29 mA through a saturated switch
    expect(final).toBeCloseTo(0.0442857, 7)
  })

  it('stores 0.5*L*I^2 and quadruples it when the current doubles', () => {
    expect(energy(0.1, 0.05)).toBeCloseTo(1.25e-4, 12)
    expect(energy(0.1, 0.1) / energy(0.1, 0.05)).toBeCloseTo(4, 12)
  })
})

describe('flyback', () => {
  it('turns a small current into a lethal kick via L*di/dt', () => {
    // 0.1 H interrupted from 50 mA in 1 us: 0.1 * 0.05 / 1e-6 = 5000 V
    expect(kickVoltage(0.1, 0.05, 1e-6)).toBeCloseTo(5000, 6)
    // Ten times slower turn-off, ten times less kick.
    expect(kickVoltage(0.1, 0.05, 1e-5)).toBeCloseTo(500, 6)
  })

  it('clamps the switch to supply plus Vf once a diode is fitted', () => {
    const open = analyse({ ...BASE, protection: 'none' }, { iPeak: 0.05, iMin: 0, iRms: 0.03 })
    const clamped = analyse(BASE, { iPeak: 0.05, iMin: 0, iRms: 0.03 })
    expect(open.vSwitchOpen).toBeCloseTo(3.3 + 5000, 3)
    expect(open.overBreakdown).toBe(true) // 5003 V past a 40 V part
    expect(clamped.vSwitchClamped).toBeCloseTo(3.3 + VF_SILICON, 12)
    expect(clamped.clampOverBreakdown).toBe(false)
  })

  it('freewheels to zero on the L/R * ln(1 + I*R/Vf) curve', () => {
    // tau*ln(1 + 0.05*70/0.7) = 1.428571e-3 * ln(6) = 2.55966 ms
    expect(decayTime(0.1, 70, 0.05, VF_SILICON)).toBeCloseTo((0.1 / 70) * Math.log(6), 12)
    expect(decayTime(0.1, 70, 0.05, VF_SILICON)).toBeCloseTo(2.5597e-3, 6)
    // With negligible winding resistance the diode drop alone sets the ramp,
    // t -> L*I/Vf = 0.1*0.05/0.7 = 7.143 ms.
    expect(decayTime(0.1, 1e-9, 0.05, VF_SILICON)).toBeCloseTo(7.142857e-3, 7)
    // The diode is what makes a relay slow to drop out: milliseconds, not the
    // microsecond collapse of an unclamped switch.
    expect(decayTime(0.1, 70, 0.05, VF_SILICON)).toBeGreaterThan(1000 * BASE.turnOff)
  })
})

describe('coil time-domain solver', () => {
  it('lands exactly on the analytic ramp at every sample', () => {
    // 1 Hz drive, 1000 samples over one cycle, so dt = 1 ms. L/R = 1 ms too.
    const p: CoilParams = { ...BASE, l: 0.1, r: 100, frequency: 1, duty: 0.9 }
    const { dt, clamped, measure } = simulate(p, 1000, 1)
    const final = (p.supply - V_SWITCH_SAT) / p.r
    expect(dt).toBeCloseTo(1e-3, 12)
    expect(clamped[0]).toBe(0)
    expect(clamped[1]).toBeCloseTo(final * (1 - Math.exp(-1)), 12)
    expect(clamped[2]).toBeCloseTo(final * (1 - Math.exp(-2)), 12)
    expect(clamped[5]).toBeCloseTo(final * (1 - Math.exp(-5)), 12)
    expect(measure.iPeak).toBeCloseTo(final, 9) // settled long before turn-off
  })

  it('stays bounded when dt is 100000x the time constant', () => {
    // Forward Euler would explode here: dt/tau is 1e5.
    const p: CoilParams = { ...BASE, l: 1e-6, r: 100, frequency: 10 }
    const { clamped, unclamped } = simulate(p, 1000, 1)
    const final = (p.supply - V_SWITCH_SAT) / p.r
    for (let i = 0; i < clamped.length; i++) {
      expect(Number.isFinite(clamped[i])).toBe(true)
      expect(clamped[i]).toBeGreaterThanOrEqual(0)
      expect(clamped[i]).toBeLessThanOrEqual(final * 1.0001)
      expect(unclamped[i]).toBeLessThanOrEqual(final * 1.0001)
    }
  })

  it('flags saturation and the GPIO limit instead of returning a fake number', () => {
    // 3.3 V into a 10 ohm coil is 310 mA: past a 200 mA core and way past the
    // 12 mA an ESP32 pin can sink.
    const p: CoilParams = { ...BASE, r: 10, l: 0.01, frequency: 10 }
    const { measure } = simulate(p, 4096, 2)
    const r = analyse(p, measure)
    expect(measure.iPeak).toBeCloseTo(0.31, 3)
    expect(r.saturating).toBe(true)
    expect(r.overGpio).toBe(true)
    // Slow the drive down enough and the current still reaches the same peak,
    // but a 1 A core is no longer saturated.
    expect(analyse({ ...p, iSat: 1 }, measure).saturating).toBe(false)
  })
})
