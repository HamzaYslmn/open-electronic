import { describe, expect, it } from 'vitest'
import { ADC_BITS, VCC } from './constants'
import {
  ATTENUATIONS,
  adcCount,
  analyseAdc,
  analyseCurrentSense,
  analyseNtc,
  dividerRatio,
  lsb,
  ntcResistance,
  ntcTemperature,
  steinhartTemperature,
  toKelvin,
} from './sensing'

describe('adc quantisation', () => {
  it('splits full scale into 4096 steps', () => {
    expect(Math.pow(2, ADC_BITS)).toBe(4096)
    expect(lsb(3.9)).toBeCloseTo(3.9 / 4096, 12)
    // 11 dB attenuation gives about 0.95 mV per count.
    expect(lsb(ATTENUATIONS['11'].fullScale) * 1000).toBeCloseTo(0.952, 3)
  })

  it('clips rather than wrapping past the ends', () => {
    expect(adcCount(-1, 3.9)).toBe(0)
    expect(adcCount(99, 3.9)).toBe(4095)
    expect(adcCount(3.9 / 2, 3.9)).toBe(2048)
  })
})

describe('battery sense divider', () => {
  it('halves a LiPo into the 11 dB range with equal resistors', () => {
    const r = analyseAdc('11', 100_000, 100_000, 4.2, 3.0)
    expect(dividerRatio(100_000, 100_000)).toBeCloseTo(0.5, 12)
    expect(r.vAdcMax).toBeCloseTo(2.1, 9)
    expect(r.vAdcMin).toBeCloseTo(1.5, 9)
    expect(r.overRange).toBe(false)
    expect(r.underRange).toBe(false)
  })

  it('reports resolution referred back to the battery', () => {
    const r = analyseAdc('11', 100_000, 100_000, 4.2, 3.0)
    // Halved input means each ADC step is worth two steps at the battery.
    expect(r.batteryResolution).toBeCloseTo(2 * r.lsbVolts, 12)
  })

  it('flags a divider that overruns the attenuation range', () => {
    // No division at all: 4.2 V straight in is past the 3.1 V usable top.
    expect(analyseAdc('11', 0, 100_000, 4.2, 3.0).overRange).toBe(true)
    // 0 dB attenuation tops out at 0.95 V, so even halved it overruns.
    expect(analyseAdc('0', 100_000, 100_000, 4.2, 3.0).overRange).toBe(true)
  })

  it('trades divider drain against source impedance', () => {
    const stiff = analyseAdc('11', 1000, 1000, 4.2, 3.0)
    const gentle = analyseAdc('11', 1e6, 1e6, 4.2, 3.0)
    expect(stiff.drain).toBeGreaterThan(gentle.drain)
    // A megohm pair is far past what the sample-and-hold can charge.
    expect(gentle.tooStiff).toBe(true)
    expect(stiff.tooStiff).toBe(false)
    expect(stiff.dailyDrain).toBeCloseTo(stiff.drain * 86400, 9)
  })
})

describe('ntc thermistor', () => {
  const R0 = 10_000
  const B = 3950
  const T0 = toKelvin(25)

  it('returns R0 at the reference temperature', () => {
    expect(ntcResistance(R0, B, T0, T0)).toBeCloseTo(R0, 9)
  })

  it('falls as it warms and rises as it cools', () => {
    // A 10k/3950 part reads about 3.59k at 50 C and about 33.6k at 0 C:
    //   10k*exp(3950*(1/323.15 - 1/298.15)) = 3588
    //   10k*exp(3950*(1/273.15 - 1/298.15)) = 33621
    expect(ntcResistance(R0, B, T0, toKelvin(50))).toBeCloseTo(3588, -2)
    expect(ntcResistance(R0, B, T0, toKelvin(0))).toBeCloseTo(33_621, -2)
  })

  it('inverts exactly', () => {
    for (const c of [-20, 0, 25, 60, 100]) {
      const r = ntcResistance(R0, B, T0, toKelvin(c))
      expect(ntcTemperature(R0, B, T0, r)).toBeCloseTo(toKelvin(c), 9)
    }
  })

  it('agrees with Steinhart-Hart on a fitted part', () => {
    // Beta form is Steinhart with C = 0, A = 1/T0 - ln(R0)/B, B' = 1/B.
    const a = 1 / T0 - Math.log(R0) / B
    const r = ntcResistance(R0, B, T0, toKelvin(40))
    expect(steinhartTemperature(a, 1 / B, 0, r)).toBeCloseTo(toKelvin(40), 6)
  })

  it('is most sensitive near the reference and loses resolution at the ends', () => {
    const mid = analyseNtc(R0, B, T0, toKelvin(25), 10_000, 0.002, VCC)
    const hot = analyseNtc(R0, B, T0, toKelvin(120), 10_000, 0.002, VCC)
    expect(Math.abs(mid.sensitivity)).toBeGreaterThan(Math.abs(hot.sensitivity))
    expect(mid.resolutionK).toBeLessThan(hot.resolutionK)
    // Sensitivity is negative: the divider output falls as it warms.
    expect(mid.sensitivity).toBeLessThan(0)
  })

  it('flags self heating when the divider current is too generous', () => {
    // A 100 ohm series resistor pushes milliamps through the bead.
    expect(analyseNtc(R0, B, T0, toKelvin(25), 100, 0.002, VCC).selfHeatSignificant).toBe(true)
    expect(analyseNtc(R0, B, T0, toKelvin(25), 100_000, 0.002, VCC).selfHeatSignificant).toBe(false)
  })
})

describe('current sensing', () => {
  const FS = ATTENUATIONS['11'].fullScale

  it('develops I*R across the shunt and burns I^2*R', () => {
    const r = analyseCurrentSense('shunt', 2, 0.05, 20, 12, FS)
    expect(r.vShunt).toBeCloseTo(0.1, 12)
    expect(r.pShunt).toBeCloseTo(0.2, 12)
    expect(r.vOut).toBeCloseTo(2.0, 12)
  })

  it('improves resolution with more gain', () => {
    const low = analyseCurrentSense('shunt', 1, 0.01, 10, 12, FS)
    const high = analyseCurrentSense('shunt', 1, 0.01, 50, 12, FS)
    expect(high.resolution).toBeLessThan(low.resolution)
    expect(high.resolution).toBeCloseTo(low.resolution / 5, 12)
  })

  it('flags a clipping front end', () => {
    expect(analyseCurrentSense('shunt', 5, 0.1, 20, 12, FS).clipping).toBe(true)
    expect(analyseCurrentSense('shunt', 1, 0.01, 20, 12, FS).clipping).toBe(false)
  })

  it('flags a shunt that wastes real power', () => {
    // 10 A through 0.1 ohm is 10 W, which is absurd for a sense resistor.
    expect(analyseCurrentSense('shunt', 10, 0.1, 10, 12, FS).wastefulShunt).toBe(true)
    expect(analyseCurrentSense('shunt', 1, 0.01, 10, 12, FS).wastefulShunt).toBe(false)
  })

  it('uses the datasheet sensitivity for an ACS712', () => {
    const r = analyseCurrentSense('acs712-5', 2, 0, 1, 5, FS)
    // 185 mV/A on a mid-rail offset.
    expect(r.vOut).toBeCloseTo(VCC / 2 + 2 * 0.185, 9)
    expect(r.resolution).toBeCloseTo(lsb(FS) / 0.185, 12)
  })
})
