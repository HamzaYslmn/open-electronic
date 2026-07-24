import { describe, expect, it } from 'vitest'
import {
  BSS138_VGS_TH,
  EIA96_MANTISSA,
  TP4056_K,
  analyseCharger,
  analyseCrystal,
  analyseShifter,
  encodeResistor,
} from './parts'

describe('level shifter', () => {
  it('gives the FET a gate drive equal to the low-side rail', () => {
    const r = analyseShifter('bss138', 3.3, 5, 10_000, 100e-12, 100e3)
    expect(r.vgs).toBe(3.3)
    expect(r.vgsMargin).toBeCloseTo(3.3 - BSS138_VGS_TH, 12)
    expect(r.insufficientDrive).toBe(false)
  })

  it('flags too little gate drive on a 1.8 V rail', () => {
    // 1.8 V against a 1.3 V threshold leaves only 0.5 V, which is marginal.
    expect(analyseShifter('bss138', 1.6, 5, 10_000, 100e-12, 100e3).insufficientDrive).toBe(
      true,
    )
  })

  it('is limited by the pull-up charging the bus capacitance', () => {
    const weak = analyseShifter('bss138', 3.3, 5, 100_000, 100e-12, 100e3)
    const strong = analyseShifter('bss138', 3.3, 5, 1000, 100e-12, 100e3)
    expect(strong.worstRise).toBeLessThan(weak.worstRise)
    expect(strong.maxBitRate).toBeGreaterThan(weak.maxBitRate)
    // 100k into 100 pF is 22 us, so 100 kbit/s is hopeless.
    expect(weak.tooSlow).toBe(true)
    expect(strong.tooSlow).toBe(false)
  })

  it('divides high to low and flags a divider that under-drives', () => {
    // 5 V through 10k/20k gives 3.33 V, comfortably above 0.7*3.3 = 2.31 V.
    const ok = analyseShifter('divider', 3.3, 5, 10_000, 100e-12, 100e3, 10_000, 20_000)
    expect(ok.dividerOut).toBeCloseTo(5 * (20 / 30), 9)
    expect(ok.dividerTooLow).toBe(false)
    // Swap the resistors and it collapses to 1.67 V.
    const bad = analyseShifter('divider', 3.3, 5, 10_000, 100e-12, 100e3, 20_000, 10_000)
    expect(bad.dividerTooLow).toBe(true)
  })
})

describe('crystal load capacitors', () => {
  // A typical 32.768 kHz watch crystal: CL 12.5 pF, Cm 3 fF, C0 1.5 pF.
  const F = 32768
  const CM = 3e-15
  const C0 = 1.5e-12

  it('solves C1 = C2 = 2*(CL - Cstray)', () => {
    const r = analyseCrystal(F, 12.5e-12, 3e-12, CM, C0)
    expect(r.cLoad).toBeCloseTo(2 * (12.5e-12 - 3e-12), 15)
    expect(r.cLoad).toBeCloseTo(19e-12, 15)
  })

  it('reports no error when the standard part hits the target exactly', () => {
    // Stray 2 pF, CL 12 pF gives exactly 20 pF, which is an E24 value.
    const r = analyseCrystal(F, 12e-12, 2e-12, CM, C0)
    expect(r.cStandard).toBeCloseTo(20e-12, 15)
    expect(Math.abs(r.errorPpm)).toBeLessThan(0.01)
  })

  it('pulls the frequency when the load is wrong', () => {
    const r = analyseCrystal(F, 12.5e-12, 3e-12, CM, C0)
    // 19 pF snaps to 20 pF, so the actual load is higher and the crystal runs slow.
    expect(r.cStandard).toBeCloseTo(20e-12, 15)
    expect(r.actualCL).toBeGreaterThan(12.5e-12)
    expect(r.errorPpm).toBeLessThan(0)
    expect(r.errorHz).toBeLessThan(0)
  })

  it('flags stray capacitance already past the specified load', () => {
    expect(analyseCrystal(F, 6e-12, 8e-12, CM, C0).strayTooHigh).toBe(true)
    expect(analyseCrystal(F, 12.5e-12, 3e-12, CM, C0).strayTooHigh).toBe(false)
  })
})

describe('tp4056 charger', () => {
  it('sets current from the program resistor', () => {
    // The datasheet default: 1.2k gives 1 A.
    expect(analyseCharger(1200, 2, 5).current).toBeCloseTo(1, 9)
    // 10k gives 120 mA.
    expect(analyseCharger(10_000, 2, 5).current).toBeCloseTo(0.12, 9)
    expect(TP4056_K).toBe(1200)
  })

  it('snaps to a standard resistor and reports the real current', () => {
    // 1210 snaps down to 1200; 1250 would snap UP to 1300, since log distance
    // puts it nearer (ln(1300/1250) = 0.039 against ln(1250/1200) = 0.041).
    const r = analyseCharger(1210, 2, 5)
    expect(r.rStandard).toBeCloseTo(1200, 6)
    expect(r.actualCurrent).toBeCloseTo(1, 6)
    expect(analyseCharger(1250, 2, 5).rStandard).toBeCloseTo(1300, 6)
  })

  it('flags charging above 1C', () => {
    // 1 A into a 0.5 Ah cell is 2C.
    expect(analyseCharger(1200, 0.5, 5).overRate).toBe(true)
    expect(analyseCharger(1200, 2, 5).overRate).toBe(false)
  })

  it('gives a sensible total charge time', () => {
    // 1 A into 2 Ah: CC to 80% is 1.6 Ah, i.e. 5760 s, plus a slow tail.
    const r = analyseCharger(1200, 2, 5)
    expect(r.ccTime).toBeCloseTo(5760, 0)
    expect(r.cvTime).toBeGreaterThan(0)
    expect(r.totalTime).toBeCloseTo(r.ccTime + r.cvTime, 9)
  })

  it('flags the chip getting hot on a high input voltage', () => {
    // The TP4056 is linear: (Vin - Vcell) * I all becomes heat.
    expect(analyseCharger(1200, 2, 5).hot).toBe(true)
    expect(analyseCharger(10_000, 2, 5).hot).toBe(false)
  })
})

describe('resistor codes', () => {
  it('encodes a 4 band 4.7k as yellow violet red', () => {
    const c = encodeResistor(4700, 4)
    // Band names are dictionary keys, since they are shown on the page.
    expect(c.bands.slice(0, 3)).toEqual(['opt.yellow', 'opt.violet', 'opt.red2'])
    expect(c.value).toBeCloseTo(4700, 6)
  })

  it('encodes a 5 band 4.75k as yellow violet green', () => {
    const c = encodeResistor(4750, 5)
    expect(c.bands.slice(0, 3)).toEqual(['opt.yellow', 'opt.violet', 'opt.green'])
  })

  it('produces the standard SMD codes', () => {
    // 3 digit: 47 x 10^2. 4 digit: 470 x 10^1, so the trailing digit is the
    // exponent, not a zero.
    expect(encodeResistor(4700, 4).smd3).toBe('472')
    expect(encodeResistor(4700, 4).smd4).toBe('4701')
    expect(encodeResistor(100, 4).smd3).toBe('101')
    expect(encodeResistor(1e6, 4).smd3).toBe('105')
  })

  it('produces EIA-96 codes from the E96 table', () => {
    // 100 ohm is mantissa 100, index 1, multiplier 1 -> 01A
    expect(encodeResistor(100, 5).eia96).toBe('01A')
    // 4750 is mantissa 475, index 66, multiplier 10 -> 66B
    expect(EIA96_MANTISSA[65]).toBe(475)
    expect(encodeResistor(4750, 5).eia96).toBe('66B')
  })

  it('says so when a value is not an E96 member', () => {
    expect(encodeResistor(4700, 5).eia96).toBe('not in E96')
  })
})
