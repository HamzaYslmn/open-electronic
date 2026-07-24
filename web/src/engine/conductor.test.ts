import { describe, expect, it } from 'vitest'
import {
  IPC_K_EXTERNAL,
  RHO_COPPER_20C,
  analyseTrace,
  analyseWire,
  awgDiameter,
  circleArea,
  copperResistivity,
  ipcAreaMils2,
  ipcCurrent,
  resistance,
} from './conductor'

describe('awg geometry', () => {
  it('reproduces the published diameter table', () => {
    // AWG 36 is the definition point: exactly 0.005 inch.
    expect(awgDiameter(36)).toBeCloseTo(0.127e-3, 12)
    // Published values, to the precision the tables carry.
    expect(awgDiameter(10) * 1000).toBeCloseTo(2.588, 3)
    expect(awgDiameter(20) * 1000).toBeCloseTo(0.812, 3)
    expect(awgDiameter(30) * 1000).toBeCloseTo(0.255, 3)
  })

  it('halves the area every three gauges, to within a percent', () => {
    const a20 = circleArea(awgDiameter(20))
    const a23 = circleArea(awgDiameter(23))
    expect(a20 / a23).toBeCloseTo(2, 1)
    // and ten gauges is a factor of ten in area
    const a30 = circleArea(awgDiameter(30))
    expect(a20 / a30).toBeCloseTo(10, 0)
  })

  it('gives the published resistance per metre for copper', () => {
    // AWG 24 is about 84 mohm/m at 20 C.
    const r24 = resistance(circleArea(awgDiameter(24)), 1)
    expect(r24).toBeGreaterThan(0.08)
    expect(r24).toBeLessThan(0.09)
  })

  it('raises copper resistivity by about 0.39% per kelvin', () => {
    expect(copperResistivity(20)).toBeCloseTo(RHO_COPPER_20C, 12)
    expect(copperResistivity(120) / RHO_COPPER_20C).toBeCloseTo(1.393, 3)
  })
})

describe('wire runs', () => {
  it('counts both conductors on a round trip', () => {
    const oneWay = analyseWire(18, 5, 2, 12, 20, false)
    const round = analyseWire(18, 5, 2, 12, 20, true)
    expect(round.loopResistance).toBeCloseTo(2 * oneWay.loopResistance, 12)
    expect(round.vDrop).toBeCloseTo(2 * oneWay.vDrop, 12)
  })

  it('computes drop and loss consistently', () => {
    const r = analyseWire(18, 5, 2, 12)
    expect(r.vDrop).toBeCloseTo(2 * r.loopResistance, 12)
    expect(r.lossW).toBeCloseTo(2 * 2 * r.loopResistance, 12)
    expect(r.vLoad).toBeCloseTo(12 - r.vDrop, 12)
    expect(r.dropFraction).toBeCloseTo(r.vDrop / 12, 12)
  })

  it('flags a thin wire carrying too much current', () => {
    // 24 AWG is 0.205 mm^2, so bundled ampacity is about 0.7 A.
    expect(analyseWire(24, 1, 5, 12).overAmpacity).toBe(true)
    expect(analyseWire(12, 1, 5, 12).overAmpacity).toBe(false)
  })

  it('flags an excessive voltage drop on a long thin run', () => {
    // 5 A down 10 m of 22 AWG is a disaster at 12 V.
    const bad = analyseWire(22, 10, 5, 12)
    expect(bad.excessiveDrop).toBe(true)
    expect(bad.vDrop).toBeGreaterThan(1)
    // Short and fat is fine.
    expect(analyseWire(12, 1, 5, 12).excessiveDrop).toBe(false)
  })
})

describe('ipc-2221 traces', () => {
  it('inverts its own current formula', () => {
    const a = ipcAreaMils2(2, 10, true)
    expect(ipcCurrent(a, 10, true)).toBeCloseTo(2, 9)
  })

  it('needs roughly twice the copper on an internal layer', () => {
    // k halves internally, and area scales as (1/k)^(1/0.725), so about 2.6x.
    const ext = ipcAreaMils2(3, 10, true)
    const int = ipcAreaMils2(3, 10, false)
    expect(int / ext).toBeCloseTo(Math.pow(2, 1 / 0.725), 3)
  })

  it('matches the standard worked example', () => {
    // 1 A, 10 K rise, external:
    //   10^0.44 = 2.7542, k*dT^0.44 = 0.048*2.7542 = 0.13220
    //   A = (1/0.13220)^(1/0.725) = 7.5643^1.3793 = 16.30 mils^2
    // On 1 oz copper (1.370 mils thick) that is 11.9 mils, i.e. 0.30 mm, which
    // is what the published IPC calculators give for this case.
    const a = ipcAreaMils2(1, 10, true)
    expect(a).toBeCloseTo(16.3, 1)
    const r = analyseTrace(1, 10, true, 1, 0.05)
    expect(r.widthMils).toBeCloseTo(11.9, 1)
    expect(r.width * 1000).toBeCloseTo(0.302, 2)
    expect(IPC_K_EXTERNAL).toBe(0.048)
  })

  it('widens for more current and narrows for more allowed rise', () => {
    const base = analyseTrace(1, 10, true, 1, 0.05)
    expect(analyseTrace(3, 10, true, 1, 0.05).width).toBeGreaterThan(base.width)
    expect(analyseTrace(1, 30, true, 1, 0.05).width).toBeLessThan(base.width)
    // Twice the copper weight halves the width for the same cross-section.
    expect(analyseTrace(1, 10, true, 2, 0.05).width).toBeCloseTo(base.width / 2, 9)
  })

  it('flags a trace too fine for a cheap fabricator', () => {
    expect(analyseTrace(0.02, 10, true, 1, 0.05).belowFabLimit).toBe(true)
    expect(analyseTrace(2, 10, true, 1, 0.05).belowFabLimit).toBe(false)
  })
})
