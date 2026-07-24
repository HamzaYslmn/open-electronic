import { describe, expect, it } from 'vitest'
import { VCC } from './constants'
import {
  APB_CLOCK,
  SERVO_FRAME_HZ,
  SERVO_TYPES,
  analyseLedc,
  analyseServo,
  maxBits,
  maxFrequency,
  pulseForAngle,
} from './ledc'

describe('ledc frequency against resolution', () => {
  it('halves the maximum frequency for every extra bit', () => {
    expect(maxFrequency(1)).toBe(APB_CLOCK / 2)
    expect(maxFrequency(8)).toBe(APB_CLOCK / 256)
    // 13 bits is the Arduino default for LEDs: 80e6/8192 = 9765.6 Hz
    expect(maxFrequency(13)).toBeCloseTo(9765.625, 3)
  })

  it('inverts to the largest resolution that still reaches a frequency', () => {
    // 5 kHz: 80e6/5e3 = 16000, log2 = 13.97, so 13 bits.
    expect(maxBits(5000)).toBe(13)
    // 1 kHz allows 16 bits (80e6/1e3 = 80000, log2 = 16.3).
    expect(maxBits(1000)).toBe(16)
    // 50 Hz servo frame would allow 20 bits, but the register caps at 20.
    expect(maxBits(SERVO_FRAME_HZ)).toBe(20)
  })

  it('reports nothing usable past the clock', () => {
    expect(maxBits(APB_CLOCK)).toBe(0)
    expect(analyseLedc(APB_CLOCK, 8, 0.5, VCC).unreachable).toBe(true)
  })

  it('clamps a requested resolution the frequency cannot support', () => {
    // 100 kHz allows floor(log2(800)) = 9 bits, so asking for 12 is clamped.
    const r = analyseLedc(100e3, 12, 0.5, VCC)
    expect(r.bits).toBe(9)
    expect(r.clamped).toBe(true)
    expect(r.stepCount).toBe(512)
  })

  it('quantises duty to whole register steps', () => {
    // 8 bits: 256 steps, so 0.5 lands exactly on 128.
    const exact = analyseLedc(1000, 8, 0.5, VCC)
    expect(exact.count).toBe(128)
    expect(exact.actualDuty).toBeCloseTo(0.5, 12)
    expect(exact.dutyError).toBeCloseTo(0, 12)

    // A duty between steps carries an error under half a step.
    const off = analyseLedc(1000, 8, 0.5 + 1 / 512, VCC)
    expect(Math.abs(off.dutyError)).toBeLessThanOrEqual(1 / 512 + 1e-12)
  })

  it('turns the duty step into an analogue voltage on a filtered pin', () => {
    const r = analyseLedc(1000, 10, 0.5, VCC)
    // 10 bits over 3.3 V is 3.22 mV per step.
    expect(r.stepVolts).toBeCloseTo(VCC / 1024, 9)
    expect(r.onTime).toBeCloseTo(r.period * r.actualDuty, 12)
  })
})

describe('servo signalling', () => {
  const std = SERVO_TYPES.standard

  it('maps angle linearly onto pulse width', () => {
    expect(pulseForAngle(std, 0)).toBeCloseTo(1000e-6, 9)
    expect(pulseForAngle(std, 90)).toBeCloseTo(1500e-6, 9)
    expect(pulseForAngle(std, 180)).toBeCloseTo(2000e-6, 9)
  })

  it('clamps angles outside the travel rather than extrapolating', () => {
    expect(pulseForAngle(std, -20)).toBeCloseTo(std.minPulse, 9)
    expect(pulseForAngle(std, 400)).toBeCloseTo(std.maxPulse, 9)
  })

  it('converts a mid-travel pulse to the right duty at 50 Hz', () => {
    // 1.5 ms in a 20 ms frame is 7.5%.
    const r = analyseServo(std, 90, 16)
    expect(r.duty).toBeCloseTo(0.075, 9)
    expect(r.count).toBe(Math.round(0.075 * 65536))
  })

  it('shows why low resolution ruins servo control', () => {
    // At 8 bits a whole 1 ms of travel is only 12.8 counts, about 14 deg/step.
    const coarse = analyseServo(std, 90, 8)
    expect(coarse.countsOverTravel).toBeCloseTo(12.8, 1)
    expect(coarse.degreesPerStep).toBeGreaterThan(10)
    expect(coarse.coarse).toBe(true)

    // At 16 bits it is 3277 counts, well under a tenth of a degree.
    const fine = analyseServo(std, 90, 16)
    expect(fine.countsOverTravel).toBeGreaterThan(3000)
    expect(fine.degreesPerStep).toBeLessThan(0.1)
    expect(fine.coarse).toBe(false)
  })

  it('lands the quantised pulse back on nearly the requested angle', () => {
    const r = analyseServo(std, 45, 16)
    expect(r.actualAngle).toBeCloseTo(45, 1)
    expect(Math.abs(r.actualPulse - r.pulse)).toBeLessThan(r.actualPulse * 0.001)
  })
})
