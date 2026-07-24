import { describe, expect, it } from 'vitest'
import {
  analyse,
  chargeVoltage,
  combine,
  curve,
  dischargeVoltage,
  energy,
  charge as storedCharge,
  memberVoltages,
  parallelCapacitance,
  seriesCapacitance,
  timeToCharge,
  timeToDischarge,
} from './capacitor'
import { VCC } from './constants'

describe('capacitor combination', () => {
  it('adds in parallel, halves equal caps in series, product-over-sum otherwise', () => {
    expect(parallelCapacitance([100e-9, 100e-9])).toBeCloseTo(200e-9, 15)
    expect(seriesCapacitance([100e-9, 100e-9])).toBeCloseTo(50e-9, 15)
    // 1 uF and 2 uF in series -> (1*2)/(1+2) = 0.6667 uF
    expect(seriesCapacitance([1e-6, 2e-6])).toBeCloseTo(2e-12 / 3e-6, 15)
    // A series bank is always smaller than its smallest member.
    const s = seriesCapacitance([1e-6, 2e-6, 4.7e-6])
    expect(s).toBeLessThan(1e-6)
    expect(combine([1e-6, 2e-6, 4.7e-6], 'parallel')).toBeCloseTo(7.7e-6, 15)
  })

  it('splits series voltage inversely with capacitance', () => {
    // 100 nF and 200 nF across 3 V: the small cap takes twice the volts.
    const v = memberVoltages([100e-9, 200e-9], 'series', 3)
    expect(v[0]).toBeCloseTo(2, 12)
    expect(v[1]).toBeCloseTo(1, 12)
    expect(v[0] + v[1]).toBeCloseTo(3, 12)
    // Parallel members all sit at the full rail.
    expect(memberVoltages([100e-9, 200e-9], 'parallel', 3)).toEqual([3, 3])
  })
})

describe('energy and charge', () => {
  it('matches half C V squared at the ESP32 rail', () => {
    // 1000 uF at 3.3 V -> 0.5 * 1e-3 * 10.89 = 5.445 mJ, Q = 3.3 mC
    expect(energy(1e-3, VCC)).toBeCloseTo(5.445e-3, 12)
    expect(storedCharge(1e-3, VCC)).toBeCloseTo(3.3e-3, 12)
    // Energy is quadratic: doubling the voltage quadruples it.
    expect(energy(1e-3, 2 * VCC) / energy(1e-3, VCC)).toBeCloseTo(4, 12)
  })
})

describe('charge and discharge curves', () => {
  const tau = 1e-3

  it('hits the textbook percentages at 1, 2 and 5 tau', () => {
    expect(chargeVoltage(tau, 1, tau)).toBeCloseTo(0.6321, 4)
    expect(chargeVoltage(2 * tau, 1, tau)).toBeCloseTo(0.8647, 4)
    expect(chargeVoltage(5 * tau, 1, tau)).toBeCloseTo(0.9933, 4)
    expect(dischargeVoltage(tau, 1, tau)).toBeCloseTo(0.3679, 4)
  })

  it('inverts the curve exactly and refuses unreachable targets', () => {
    // t = -RC*ln(1 - v/V), so 63.21% of the rail lands on exactly one tau.
    expect(timeToCharge(0.6321205588, 1, tau)).toBeCloseTo(tau, 9)
    expect(timeToCharge(VCC / 2, VCC, tau)).toBeCloseTo(Math.LN2 * tau, 12)
    // The exponential only approaches the rail, it never arrives.
    expect(timeToCharge(VCC, VCC, tau)).toBe(Infinity)
    expect(timeToCharge(4, VCC, tau)).toBe(Infinity)
    expect(timeToDischarge(0, VCC, tau)).toBe(Infinity)
    // Round trip: charge to a level, ask when, feed the time back in.
    const t = timeToCharge(2, VCC, tau)
    expect(chargeVoltage(t, VCC, tau)).toBeCloseTo(2, 12)
  })

  it('stays bounded and monotonic when dt is far larger than tau', () => {
    // dt is 1000x tau here. A forward Euler integrator would oscillate and
    // diverge; the closed form cannot leave [0, supply].
    const { vc, vr } = curve(64, 1, VCC, 1e-3, 'charge')
    for (let i = 0; i < vc.length; i++) {
      expect(vc[i]).toBeGreaterThanOrEqual(0)
      expect(vc[i]).toBeLessThanOrEqual(VCC)
      if (i > 0) expect(vc[i]).toBeGreaterThanOrEqual(vc[i - 1])
      // KVL: the two drops must always sum to the supply while charging.
      expect(vc[i] + vr[i]).toBeCloseTo(VCC, 12)
    }
    const down = curve(64, 1, VCC, 1e-3, 'discharge')
    expect(down.vc[0]).toBeCloseTo(VCC, 12)
    for (let i = 1; i < down.vc.length; i++) {
      expect(down.vc[i]).toBeLessThanOrEqual(down.vc[i - 1])
      expect(down.vc[i]).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('analyse', () => {
  it('reports tau, inrush and the half-CV-squared resistor loss', () => {
    const r = analyse({
      values: [100e-6, 100e-6],
      mode: 'parallel',
      r: 1000,
      supply: VCC,
      target: VCC / 2,
      curveMode: 'charge',
    })
    expect(r.total).toBeCloseTo(200e-6, 12)
    expect(r.tau).toBeCloseTo(0.2, 12) // 1k * 200u
    expect(r.peakCurrent).toBeCloseTo(VCC / 1000, 12)
    expect(r.tTarget).toBeCloseTo(Math.LN2 * 0.2, 12)
    // Charging through any resistor burns exactly as much as it stores.
    expect(r.eResistor).toBeCloseTo(r.e, 15)
    expect(r.maxMemberVoltage).toBeCloseTo(VCC, 12)
    expect(r.reachable).toBe(true)
  })

  it('flags a target the exponential never reaches', () => {
    const r = analyse({
      values: [1e-6],
      mode: 'series',
      r: 10_000,
      supply: VCC,
      target: VCC,
      curveMode: 'charge',
    })
    expect(r.reachable).toBe(false)
    expect(r.tTarget).toBe(Infinity)
  })
})
