import { describe, expect, it } from 'vitest'
import {
  analyse,
  celsiusToKelvin,
  junctionTemp,
  kelvinToCelsius,
  linearRegulatorPower,
  maxPower,
  requiredSinkResistance,
  simulate,
  totalResistance,
} from './thermal'
import type { ThermalChain } from './thermal'

/** 10 W, 25 C ambient, 4 K/W total: a hand-checkable chain. */
const chain: ThermalChain = {
  power: 10,
  ambient: celsiusToKelvin(25),
  rjc: 1,
  rcs: 0.5,
  rsa: 2.5,
  tjMax: celsiusToKelvin(125),
}

describe('steady state', () => {
  it('adds the chain in series and lands on the textbook junction temp', () => {
    // Rja = 1 + 0.5 + 2.5 = 4 K/W, 10 W -> 40 K rise -> 65 C
    expect(totalResistance(chain)).toBeCloseTo(4, 12)
    expect(kelvinToCelsius(junctionTemp(chain))).toBeCloseTo(65, 9)

    const r = analyse(chain)
    expect(kelvinToCelsius(r.tc)).toBeCloseTo(55, 9) // 25 + 10*(0.5+2.5)
    expect(kelvinToCelsius(r.ts)).toBeCloseTo(50, 9) // 25 + 10*2.5
    expect(r.margin).toBeCloseTo(60, 9)
    expect(r.utilisation).toBeCloseTo(0.4, 9) // 40 K of a 100 K budget
    expect(r.overTemp).toBe(false)
  })

  it('inverts itself: the required Rsa lands the junction exactly on Tjmax', () => {
    // (125 - 25)/10 - 1 - 0.5 = 8.5 K/W
    const rsa = requiredSinkResistance(chain)
    expect(rsa).toBeCloseTo(8.5, 9)
    expect(junctionTemp({ ...chain, rsa })).toBeCloseTo(chain.tjMax, 9)

    const r = analyse({ ...chain, rsa })
    expect(r.margin).toBeCloseTo(0, 9)
    expect(r.utilisation).toBeCloseTo(1, 9)
  })

  it('flags a chain no heatsink can rescue', () => {
    // 100 W through Rjc + Rcs = 1.5 K/W is already 150 K, past the 100 K budget
    const hot = analyse({ ...chain, power: 100 })
    expect(hot.requiredRsa).toBeCloseTo(-0.5, 9)
    expect(hot.sinkImpossible).toBe(true)
    expect(hot.overTemp).toBe(true)
  })

  it('reports the power ceiling for the present chain', () => {
    // (125 - 25)/4 = 25 W
    expect(maxPower(chain)).toBeCloseTo(25, 9)
    expect(junctionTemp({ ...chain, power: maxPower(chain) })).toBeCloseTo(chain.tjMax, 9)
  })
})

describe('linear regulator dissipation', () => {
  it('burns the whole voltage drop plus the quiescent term', () => {
    // 5 V to 3.3 V at 500 mA: 1.7*0.5 = 0.85 W, plus 5*5 mA = 25 mW
    expect(linearRegulatorPower(5, 3.3, 0.5)).toBeCloseTo(0.875, 12)
    // At zero load only the quiescent current remains
    expect(linearRegulatorPower(5, 3.3, 0)).toBeCloseTo(0.025, 12)
  })
})

describe('warm-up transient', () => {
  const cth = 40 // tau = 2.5 K/W * 40 J/K = 100 s

  it('steps the die instantly, then charges the sink with tau = Rsa*Cth', () => {
    const dt = 1
    const n = 1001
    const { tj, ts } = simulate(chain, cth, n, dt)

    // t = 0: sink still at ambient, junction already P*(Rjc+Rcs) = 15 K above it
    expect(ts[0]).toBeCloseTo(chain.ambient, 12)
    expect(tj[0] - chain.ambient).toBeCloseTo(15, 12)

    // t = tau: 63.2% of the 25 K sink rise
    expect(ts[100] - chain.ambient).toBeCloseTo(25 * (1 - Math.exp(-1)), 9)
    // t = 10 tau: 25*exp(-10) = 1.1 mK short of the 65 C steady state
    expect(junctionTemp(chain) - tj[1000]).toBeCloseTo(25 * Math.exp(-10), 9)
    expect(kelvinToCelsius(tj[1000])).toBeCloseTo(65, 2)
  })

  it('stays bounded and monotonic when dt is 10000x tau (Euler would blow up)', () => {
    const final = junctionTemp(chain)
    const { tj } = simulate(chain, cth, 200, 1e6)
    for (let i = 0; i < tj.length; i++) {
      expect(tj[i]).toBeGreaterThanOrEqual(chain.ambient - 1e-9)
      expect(tj[i]).toBeLessThanOrEqual(final + 1e-9)
      if (i > 0) expect(tj[i]).toBeGreaterThanOrEqual(tj[i - 1] - 1e-9)
    }
    expect(tj[tj.length - 1]).toBeCloseTo(final, 9)
  })
})

describe('an AMS1117 on a copper pour, the classic ESP32 case', () => {
  it('is fine at 250 mA and over its limit at 1 A', () => {
    // SOT-223, Rjc 15 + Rsa 45 = 60 K/W junction to ambient
    const ldo = (iout: number): ThermalChain => ({
      power: linearRegulatorPower(5, 3.3, iout),
      ambient: celsiusToKelvin(25),
      rjc: 15,
      rcs: 0.01,
      rsa: 45,
      tjMax: celsiusToKelvin(125),
    })

    const light = analyse(ldo(0.25))
    expect(light.power).toBeCloseTo(0.45, 12) // 1.7*0.25 + 0.025
    expect(kelvinToCelsius(light.tj)).toBeCloseTo(25 + 0.45 * 60.01, 6)
    expect(light.overTemp).toBe(false)

    const heavy = analyse(ldo(1))
    expect(heavy.power).toBeCloseTo(1.725, 12)
    expect(heavy.overTemp).toBe(true) // 1.725 W * 60 K/W = 103 K rise
    // A fix exists, but only with a better sink path than the pour provides
    expect(heavy.requiredRsa).toBeGreaterThan(0)
    expect(heavy.requiredRsa).toBeLessThan(45)
  })
})
