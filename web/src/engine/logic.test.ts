import { describe, expect, it } from 'vitest'
import { VCC } from './constants'
import {
  I2C_RISE_CONSTANT,
  I2C_SPEEDS,
  analyseDebounce,
  analyseI2c,
  i2cRiseTime,
  pullupMax,
  pullupMin,
  riseTime,
  timeToVoltage,
  voltageAt,
} from './logic'

describe('rc edge primitives', () => {
  it('gives the textbook 2.2*R*C for a 10% to 90% edge', () => {
    const r = 1000
    const c = 100e-9
    expect(riseTime(r, c) / (r * c)).toBeCloseTo(Math.log(9), 9)
    expect(riseTime(r, c)).toBeCloseTo(2.1972e-4, 8)
  })

  it('reaches 63.2% of the rail after one time constant', () => {
    const tau = 1e-3
    expect(voltageAt(tau, 1000, 1e-6, VCC)).toBeCloseTo(VCC * (1 - Math.exp(-1)), 9)
    // and the inverse agrees
    expect(timeToVoltage(1000, 1e-6, VCC * (1 - Math.exp(-1)), VCC)).toBeCloseTo(tau, 9)
  })

  it('never reaches the rail itself', () => {
    expect(timeToVoltage(1000, 1e-6, VCC, VCC)).toBe(Infinity)
    expect(riseTime(1000, 1e-6, 0, 1)).toBe(Infinity)
  })
})

describe('i2c pull-up window', () => {
  it('uses the specification rise constant of 0.8473', () => {
    expect(I2C_RISE_CONSTANT).toBeCloseTo(0.8473, 4)
  })

  it('sets the floor from the 3 mA sink limit', () => {
    // (3.3 - 0.4) / 3 mA = 966 ohm
    expect(pullupMin(VCC)).toBeCloseTo((VCC - 0.4) / 0.003, 6)
    expect(pullupMin(VCC)).toBeGreaterThan(900)
    expect(pullupMin(VCC)).toBeLessThan(1000)
  })

  it('sets the ceiling from the rise-time limit', () => {
    // Fast mode, 300 ns into 100 pF: 300e-9 / (0.8473 * 100e-12) = 3540 ohm
    const rMax = pullupMax(I2C_SPEEDS.fast.maxRise, 100e-12)
    expect(rMax).toBeCloseTo(3540, -1)
    // and a pull-up at exactly Rmax produces exactly the limit rise time
    expect(i2cRiseTime(rMax, 100e-12)).toBeCloseTo(I2C_SPEEDS.fast.maxRise, 12)
  })

  it('recommends a value inside the window and flags one outside', () => {
    const r = analyseI2c('fast', 100e-12, 2200, VCC)
    expect(r.windowEmpty).toBe(false)
    expect(r.rRecommended).toBeGreaterThan(r.rMin)
    expect(r.rRecommended).toBeLessThan(r.rMax)
    expect(r.outOfWindow).toBe(false)
    expect(r.tooSlow).toBe(false)

    const weak = analyseI2c('fast', 100e-12, 10_000, VCC)
    expect(weak.outOfWindow).toBe(true)
    expect(weak.tooSlow).toBe(true)
  })

  it('closes the window entirely on an overloaded fast-plus bus', () => {
    // 1 MHz with 120 ns into 400 pF gives Rmax = 354 ohm, below the 966 ohm floor.
    const r = analyseI2c('fastplus', 400e-12, 1000, VCC)
    expect(r.rMax).toBeLessThan(r.rMin)
    expect(r.windowEmpty).toBe(true)
    expect(Number.isNaN(r.rRecommended)).toBe(true)
  })

  it('flags a bus past the capacitance the specification allows', () => {
    expect(analyseI2c('fast', 600e-12, 1000, VCC).overCapacitance).toBe(true)
    expect(analyseI2c('fast', 200e-12, 1000, VCC).overCapacitance).toBe(false)
  })
})

describe('debounce filter', () => {
  it('crosses the 75% threshold at 1.386 time constants', () => {
    const r = analyseDebounce(10_000, 100e-9, 1e-3, 5, VCC)
    // -ln(1 - 0.75) = 1.3863
    expect(r.tRise / r.tau).toBeCloseTo(Math.log(4), 9)
    // falling to 25% takes -ln(0.25) = 1.3863 as well, by symmetry
    expect(r.tFall / r.tau).toBeCloseTo(Math.log(4), 9)
  })

  it('flags a filter faster than the bounce it must reject', () => {
    // 1 us filter against 5 ms of bounce is useless.
    expect(analyseDebounce(1000, 1e-9, 5e-3, 5, VCC).tooFast).toBe(true)
    // 10k with 1 uF gives 13.9 ms of rise, comfortably over 5 ms of bounce.
    expect(analyseDebounce(10_000, 1e-6, 5e-3, 5, VCC).tooFast).toBe(false)
  })

  it('flags a filter so slow it swallows real presses', () => {
    // 1 MOhm and 10 uF is 13.9 s per edge: 5 presses per second is hopeless.
    expect(analyseDebounce(1e6, 10e-6, 1e-3, 5, VCC).tooSlow).toBe(true)
    expect(analyseDebounce(10_000, 1e-6, 1e-3, 5, VCC).tooSlow).toBe(false)
  })

  it('reports the current the contact shorts to ground', () => {
    expect(analyseDebounce(10_000, 1e-6, 1e-3, 5, VCC).contactCurrent).toBeCloseTo(
      VCC / 10_000,
      12,
    )
  })
})
