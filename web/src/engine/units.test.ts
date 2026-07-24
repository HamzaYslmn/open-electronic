import { describe, expect, it } from 'vitest'
import { formatSI, parseSI, toDb } from './units'

describe('formatSI', () => {
  it('picks the prefix that keeps the mantissa in [1, 1000)', () => {
    expect(formatSI(4700, 'Ω')).toBe('4.7 kΩ')
    expect(formatSI(1e-7, 'F')).toBe('100 nF')
    expect(formatSI(0.0022, 'H')).toBe('2.2 mH')
    expect(formatSI(1_500_000, 'Hz')).toBe('1.5 MHz')
    expect(formatSI(999, 'Ω')).toBe('999 Ω')
  })

  it('handles zero, negatives and non-finite values', () => {
    expect(formatSI(0, 'V')).toBe('0 V')
    expect(formatSI(-3.3, 'V')).toBe('-3.3 V')
    expect(formatSI(NaN)).toBe('n/a')
    expect(formatSI(Infinity)).toBe('∞')
  })
})

describe('parseSI', () => {
  it('parses prefixed values', () => {
    expect(parseSI('4.7k')).toBeCloseTo(4700)
    expect(parseSI('100n')).toBeCloseTo(1e-7)
    expect(parseSI('2.2 uF')).toBeCloseTo(2.2e-6)
    expect(parseSI('1M')).toBeCloseTo(1e6)
    expect(parseSI('-3.5m')).toBeCloseTo(-3.5e-3)
    expect(parseSI('12')).toBe(12)
  })

  it('parses EIA/RKM notation', () => {
    expect(parseSI('4k7')).toBeCloseTo(4700)
    expect(parseSI('4R7')).toBeCloseTo(4.7)
    expect(parseSI('1M2')).toBeCloseTo(1.2e6)
  })

  it('rejects garbage instead of guessing', () => {
    expect(parseSI('')).toBeNaN()
    expect(parseSI('abc')).toBeNaN()
  })

  it('round-trips through formatSI', () => {
    for (const v of [4700, 1e-7, 2.2e-6, 3.3, 1.5e6, 0.047]) {
      expect(parseSI(formatSI(v))).toBeCloseTo(v, 12)
    }
  })
})

describe('toDb', () => {
  it('maps the half-power amplitude ratio to -3 dB', () => {
    expect(toDb(Math.SQRT1_2)).toBeCloseTo(-3.0103, 3)
    expect(toDb(1)).toBe(0)
    expect(toDb(0.1)).toBeCloseTo(-20)
  })
})
