import { describe, expect, it } from 'vitest'
import { GPIO_MAX_MA, VCC } from './constants'
import { analyse, currentThrough, e24AtLeast, nearestE24, seriesResistor } from './led'
import type { LedInput } from './led'

/** A red LED at 20 mA off the ESP32 rail, the default case. */
const base: LedInput = {
  supply: VCC,
  vf: 2.0,
  target: 0.02,
  maxCurrent: 0.02,
  rating: 0.25,
  fromGpio: true,
}

describe('series resistor', () => {
  it('matches the hand calculation from KVL', () => {
    // 5 V rail, 2 V red LED, 20 mA: (5 - 2)/0.02 = 150 ohms, the classic answer.
    expect(seriesResistor(5, 2.0, 0.02)).toBeCloseTo(150, 9)
    // 3.3 V rail, same LED at 10 mA: 1.3/0.01 = 130 ohms, an exact E24 value.
    expect(seriesResistor(VCC, 2.0, 0.01)).toBeCloseTo(130, 9)
    // Round trip: the resistor that gives 20 mA does give 20 mA back.
    expect(currentThrough(5, 2.0, seriesResistor(5, 2.0, 0.02))).toBeCloseTo(0.02, 12)
  })
})

describe('E24 snapping', () => {
  it('picks the nearest preferred value by ratio, across decades', () => {
    expect(nearestE24(150)).toBeCloseTo(150, 9)
    // 65 sits between 62 and 68; 68 is closer in percent (4.6% against 4.8%).
    expect(nearestE24(65)).toBeCloseTo(68, 9)
    expect(nearestE24(9.6)).toBeCloseTo(10, 9)
    expect(nearestE24(0.33)).toBeCloseTo(0.33, 9)
    expect(nearestE24(4700)).toBeCloseTo(4700, 9)
    expect(nearestE24(1e6)).toBeCloseTo(1e6, 9)
  })

  it('never rounds down when asked for the safe value', () => {
    expect(e24AtLeast(65)).toBeCloseTo(68, 9)
    expect(e24AtLeast(151)).toBeCloseTo(160, 9)
    // An exact hit must stay put, not jump a step.
    expect(e24AtLeast(150)).toBeCloseTo(150, 9)
    expect(e24AtLeast(0.95)).toBeCloseTo(1, 9)
  })
})

describe('analyse', () => {
  it('reports the current that really flows after the E24 snap', () => {
    const r = analyse(base)
    expect(r.headroom).toBeCloseTo(1.3, 9)
    expect(r.idealR).toBeCloseTo(65, 9)
    expect(r.r).toBeCloseTo(68, 9)
    expect(r.rUp).toBeCloseTo(68, 9)
    // 1.3 / 68 = 19.12 mA, i.e. 4.4% under the 20 mA target.
    expect(r.current).toBeCloseTo(0.0191176, 7)
    expect(r.currentError).toBeCloseTo(-0.0441, 4)
    // dI/dVf = -1/R: 100 mV of Vf spread moves the current by 1.47 mA.
    expect(r.vfSensitivity).toBeCloseTo(0.1 / 68, 9)
  })

  it('conserves power between the resistor, the die and the supply', () => {
    const r = analyse(base)
    expect(r.rPower).toBeCloseTo(r.current * r.current * r.r, 12)
    expect(r.ledPower + r.rPower).toBeCloseTo(r.totalPower, 12)
    // Only Vf/Vs of the supply power reaches the LED: 2.0/3.3 = 60.6%.
    expect(r.efficiency).toBeCloseTo(2.0 / 3.3, 9)
  })

  it('flags a GPIO asked for more than its rated current', () => {
    // 19.1 mA out of a pin rated for 12 mA.
    expect(analyse(base).overGpio).toBe(true)
    expect(analyse({ ...base, target: 0.005 }).overGpio).toBe(false)
    // The same current through a driver transistor is not a pin problem.
    expect(analyse({ ...base, fromGpio: false }).overGpio).toBe(false)
    expect(GPIO_MAX_MA).toBe(12)
  })

  it('refuses to invent current when Vf is above the rail', () => {
    expect(seriesResistor(VCC, 3.4, 0.02)).toBe(Infinity)
    expect(currentThrough(VCC, 3.4, 100)).toBe(0)

    const r = analyse({ ...base, vf: 3.4 })
    expect(r.noConduction).toBe(true)
    expect(r.current).toBe(0)
    expect(r.rPower).toBe(0)
    expect(r.ledPower).toBe(0)
    expect(r.totalPower).toBe(0)
  })

  it('flags thin headroom and an overloaded resistor package', () => {
    // A 3.2 V white LED on 3.3 V leaves 100 mV, so Vf spread sets the current.
    const white = analyse({ ...base, vf: 3.2 })
    expect(white.noConduction).toBe(false)
    expect(white.lowHeadroom).toBe(true)
    // Headroom is exactly the 100 mV spread, so a bin shift wipes out the
    // whole current: sensitivity equals the operating current itself.
    expect(white.vfSensitivity).toBeCloseTo(white.current, 9)

    // 100 mA through 13 ohms is 0.13 W, past a 1/8 W package.
    const hot = analyse({ ...base, target: 0.1, rating: 0.125 })
    expect(hot.r).toBeCloseTo(13, 9)
    expect(hot.rPower).toBeCloseTo(0.13, 9)
    expect(hot.overRating).toBe(true)
    expect(hot.overLedMax).toBe(true)
    expect(analyse({ ...base, target: 0.1, rating: 0.25 }).overRating).toBe(false)
  })
})
