import { describe, expect, it } from 'vitest'
import {
  C_LIGHT,
  RADIOS,
  analyseAntenna,
  analyseLink,
  dbmToWatts,
  fspl,
  rangeForLoss,
  wattsToDbm,
  wavelength,
} from './rf'

describe('wavelength and antenna geometry', () => {
  it('gives the familiar lengths for the common bands', () => {
    // 868 MHz: lambda = 345.4 mm, quarter wave 86.4 mm in free space.
    expect(wavelength(868e6) * 1000).toBeCloseTo(345.4, 1)
    expect(analyseAntenna(868e6, 1).quarterWave * 1000).toBeCloseTo(86.3, 1)
    // 2.45 GHz quarter wave is the well known 30.6 mm.
    expect(analyseAntenna(2450e6, 1).quarterWave * 1000).toBeCloseTo(30.6, 1)
  })

  it('shortens the element by the velocity factor', () => {
    const free = analyseAntenna(868e6, 1)
    const wire = analyseAntenna(868e6, 0.95)
    expect(wire.quarterWave).toBeCloseTo(free.quarterWave * 0.95, 12)
    // The free-space reference is reported unshortened.
    expect(wire.freeSpaceQuarter).toBeCloseTo(free.quarterWave, 12)
  })

  it('keeps the element ratios exact', () => {
    const a = analyseAntenna(433e6, 0.95)
    expect(a.halfWave).toBeCloseTo(2 * a.quarterWave, 12)
    expect(a.fullWave).toBeCloseTo(4 * a.quarterWave, 12)
    expect(a.fiveEighths).toBeCloseTo(a.fullWave * 0.625, 12)
  })

  it('uses the defined speed of light', () => {
    expect(C_LIGHT).toBe(299792458)
    expect(wavelength(C_LIGHT)).toBeCloseTo(1, 12)
  })
})

describe('dBm conversion', () => {
  it('round trips watts and dBm', () => {
    expect(wattsToDbm(0.001)).toBeCloseTo(0, 9) // 1 mW is 0 dBm by definition
    expect(wattsToDbm(1)).toBeCloseTo(30, 9)
    expect(dbmToWatts(20)).toBeCloseTo(0.1, 9)
    expect(dbmToWatts(wattsToDbm(0.025))).toBeCloseTo(0.025, 12)
  })
})

describe('free space path loss', () => {
  it('matches the standard worked figure', () => {
    // 1 km at 868 MHz: 20log10(1) + 20log10(868) + 32.44 = 91.2 dB
    expect(fspl(1000, 868e6)).toBeCloseTo(91.21, 1)
    // 1 km at 2450 MHz is 100.2 dB
    expect(fspl(1000, 2450e6)).toBeCloseTo(100.23, 1)
  })

  it('adds 6 dB per doubling of distance and of frequency', () => {
    expect(fspl(2000, 868e6) - fspl(1000, 868e6)).toBeCloseTo(6.02, 2)
    expect(fspl(1000, 1736e6) - fspl(1000, 868e6)).toBeCloseTo(6.02, 2)
  })

  it('inverts back to distance', () => {
    const d = 3500
    expect(rangeForLoss(fspl(d, 868e6), 868e6)).toBeCloseTo(d, 6)
  })
})

describe('link budget', () => {
  const lora = RADIOS['lora-sf12']

  it('computes received power and margin consistently', () => {
    const r = analyseLink(14, 2, 2, 1, 1000, 868e6, lora.sensitivity)
    expect(r.prxDbm).toBeCloseTo(14 + 2 + 2 - r.totalLossDb, 9)
    expect(r.marginDb).toBeCloseTo(r.prxDbm - lora.sensitivity, 9)
    expect(r.totalLossDb).toBeCloseTo(r.fsplDb + 1, 9)
    expect(r.eirpDbm).toBe(16)
  })

  it('gives LoRa SF12 a very long theoretical free-space range', () => {
    // 14 dBm into -137 dBm sensitivity is a 151 dB budget: tens of km.
    const r = analyseLink(14, 0, 0, 0, 1000, 868e6, lora.sensitivity)
    expect(r.maxRange).toBeGreaterThan(50_000)
    expect(r.linkFails).toBe(false)
  })

  it('flags a link that does not close', () => {
    // WiFi 802.11n at 5 km is hopeless.
    const r = analyseLink(14, 2, 2, 0, 5000, 2450e6, RADIOS['wifi-11n'].sensitivity)
    expect(r.linkFails).toBe(true)
    expect(r.marginDb).toBeLessThan(0)
  })

  it('flags a link that closes but without usable headroom', () => {
    const sens = -100
    // Place the receiver exactly where 5 dB of margin remains.
    const budget = 14 + 0 + 0 - sens
    const d = rangeForLoss(budget - 5, 868e6)
    const r = analyseLink(14, 0, 0, 0, d, 868e6, sens)
    expect(r.marginDb).toBeCloseTo(5, 6)
    expect(r.marginal).toBe(true)
    expect(r.linkFails).toBe(false)
  })

  it('puts the reliable range inside the absolute maximum range', () => {
    const r = analyseLink(14, 2, 2, 1, 1000, 868e6, lora.sensitivity)
    expect(r.reliableRange).toBeLessThan(r.maxRange)
    // 10 dB of margin costs a factor of about 3.16 in distance.
    expect(r.maxRange / r.reliableRange).toBeCloseTo(Math.pow(10, 0.5), 2)
  })
})
