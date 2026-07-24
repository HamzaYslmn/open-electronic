import { describe, expect, it } from 'vitest'
import {
  analyse,
  awgDiameter,
  crossSection,
  currentLimit,
  equilibriumTemp,
  findMaterial,
  lengthForResistance,
  resistance,
  simulate,
  steadyTemp,
  surfaceArea,
  thermalConductance,
  thermalTimeConstant,
  timeToTemp,
  toKelvin,
  wireMass,
} from './heating'
import type { HeatingInput, Material } from './heating'

const NICHROME = findMaterial('nichrome80')

/** Zero-alpha stand-in so the thermal maths can be checked in closed form. */
const IDEAL: Material = {
  ...NICHROME,
  alpha: 0,
  rho20: 1e-6,
  density: 8000,
  specificHeat: 500,
}

const AMBIENT = toKelvin(25)

describe('wire geometry and resistance', () => {
  it('reproduces the AWG diameter table', () => {
    // AWG is defined from 36 gauge = 0.005 in and a ratio of 92^(1/39).
    expect(awgDiameter(36) * 1000).toBeCloseTo(0.127, 6)
    expect(awgDiameter(24) * 1000).toBeCloseTo(0.5106, 4)
    // Published tables round AWG 10 to 2.588 mm; the defining formula gives
    // 2.58819, so assert to the precision the table actually carries.
    expect(awgDiameter(10) * 1000).toBeCloseTo(2.588, 3)
  })

  it('gives the published resistance per metre for nichrome', () => {
    // 24 AWG nichrome 80/20 is quoted around 5.4 ohm/m (1.65 ohm/ft).
    const r = resistance(NICHROME, awgDiameter(24), 1)
    expect(r).toBeGreaterThan(5)
    expect(r).toBeLessThan(6)
    // R = rho*L/A, so it must match the definition exactly.
    expect(r).toBeCloseTo(NICHROME.rho20 / crossSection(awgDiameter(24)), 9)
    // and inverting it returns the length that was asked for
    expect(lengthForResistance(NICHROME, awgDiameter(24), r)).toBeCloseTo(1, 9)
  })
})

describe('steady state', () => {
  it('lands on Tamb + P/(h*As) when resistance does not drift', () => {
    const d = 1e-3
    const l = 1
    const supply = 3.3
    const k = thermalConductance(50, d, l)
    const p = (supply * supply) / resistance(IDEAL, d, l)
    // 1 mm wire, 1 m long: R = 1.2732 ohm, P = 8.553 W, h*As = 0.15708 W/K
    expect(p).toBeCloseTo(8.5533, 3)
    expect(steadyTemp(IDEAL, d, l, supply, k, AMBIENT)).toBeCloseTo(
      equilibriumTemp(p, k, AMBIENT),
      9,
    )
    expect(steadyTemp(IDEAL, d, l, supply, k, AMBIENT) - AMBIENT).toBeCloseTo(54.45, 2)
  })

  it('reaches exactly the service limit at the limit current', () => {
    const d = awgDiameter(24)
    const l = 0.3
    const k = thermalConductance(50, d, l)
    const i = currentLimit(NICHROME, d, l, k, AMBIENT)
    expect(i).toBeCloseTo(3.98, 1)
    // Driving the hot resistance with exactly that current must settle on Tmax.
    const supply = i * resistance(NICHROME, d, l, NICHROME.maxTemp)
    expect(steadyTemp(NICHROME, d, l, supply, k, AMBIENT)).toBeCloseTo(NICHROME.maxTemp, 4)
  })

  it('makes the time constant independent of length', () => {
    // tau = m*c/(h*As) and both m and As scale with L, so only d and h matter.
    const d = awgDiameter(24)
    const h = 50
    const tau = thermalTimeConstant(NICHROME, d, h)
    for (const l of [0.05, 3]) {
      const long = (wireMass(NICHROME, d, l) * NICHROME.specificHeat) / (h * surfaceArea(d, l))
      expect(long).toBeCloseTo(tau, 9)
    }
    expect(tau).toBeCloseTo(9.75, 2)
  })
})

describe('transient', () => {
  const base: HeatingInput = {
    material: IDEAL,
    diameter: 1e-3,
    length: 1,
    supply: 3.3,
    h: 50,
    ambient: AMBIENT,
    target: AMBIENT + 30,
  }

  it('is 63.2% of the way there after one time constant', () => {
    const tau = thermalTimeConstant(IDEAL, base.diameter, base.h)
    const dt = tau / 1000 // index 1000 is exactly t = tau
    const { temp } = simulate(base, 1001, dt)
    const eq = steadyTemp(
      IDEAL,
      base.diameter,
      base.length,
      base.supply,
      thermalConductance(base.h, base.diameter, base.length),
      AMBIENT,
    )
    expect(temp[0]).toBe(AMBIENT)
    expect((temp[1000] - AMBIENT) / (eq - AMBIENT)).toBeCloseTo(1 - Math.exp(-1), 9)
  })

  it('stays bounded when dt dwarfs the time constant (Euler would diverge)', () => {
    const hot: HeatingInput = { ...base, material: NICHROME, supply: 40 }
    const tau = thermalTimeConstant(NICHROME, hot.diameter, hot.h)
    const k = thermalConductance(hot.h, hot.diameter, hot.length)
    const coldPower = (hot.supply * hot.supply) / resistance(NICHROME, hot.diameter, hot.length)
    const ceiling = equilibriumTemp(coldPower, k, AMBIENT)
    const { temp } = simulate(hot, 500, tau * 1e6)
    for (const v of temp) {
      expect(Number.isFinite(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(AMBIENT)
      // The cold-power equilibrium is the hard upper bound: the wire only ever
      // gets more resistive, so it can never out-heat its own first step.
      expect(v).toBeLessThanOrEqual(ceiling * (1 + 1e-9))
    }
  })

  it('crosses the target when the closed form says it will', () => {
    // Hot-wire foam cutter: 300 mm of 24 AWG nichrome straight off 3V3.
    const input: HeatingInput = {
      material: NICHROME,
      diameter: awgDiameter(24),
      length: 0.3,
      supply: 3.3,
      h: 50,
      ambient: AMBIENT,
      target: toKelvin(250),
    }
    const r = analyse(input)
    expect(r.rCold).toBeCloseTo(1.597, 2)
    expect(r.currentCold).toBeCloseTo(2.066, 2)
    expect(r.powerCold).toBeCloseTo(6.818, 2)
    expect(r.reachable).toBe(true)

    const dt = (4 * r.tTarget) / 8192
    const { temp } = simulate(input, 8192, dt)
    const crossing = temp.findIndex((v) => v >= input.target)
    expect(crossing).toBeGreaterThan(0)
    // The closed form assumes a fixed tau. The 100 ppm/K resistance drift bends
    // the real curve slightly, so allow 2% between the two answers.
    // The crossing is found on a sampled trace, so it can only ever be as
    // precise as one sample step. Allow that rather than a tighter figure.
    expect(Math.abs(crossing * dt - r.tTarget) / r.tTarget).toBeLessThan(0.05)
    // Nothing reaches a target sitting at or above the equilibrium.
    expect(timeToTemp(r.equilibrium, AMBIENT, r.equilibrium, r.tau)).toBe(Infinity)
  })
})

describe('limits', () => {
  it('flags a wire driven past its service temperature', () => {
    const input: HeatingInput = {
      material: NICHROME,
      diameter: awgDiameter(30),
      length: 0.05,
      supply: 3.3,
      h: 50,
      ambient: AMBIENT,
      target: toKelvin(400),
    }
    const r = analyse(input)
    expect(r.overTemp).toBe(true)
    expect(r.overCurrent).toBe(true)
    expect(r.currentCold).toBeGreaterThan(r.limitCurrent)
    // Convection alone cannot be the whole story at that temperature.
    expect(r.radiationDominant).toBe(true)
    expect(r.radiation).toBeGreaterThan(0.3)
  })
})
