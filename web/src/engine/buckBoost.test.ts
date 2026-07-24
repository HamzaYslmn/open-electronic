import { describe, expect, it } from 'vitest'
import {
  analyse,
  dutyBoost,
  dutyBuck,
  dutyCascaded,
  operatingPoint,
  selectMode,
  waveform,
} from './buckBoost'
import type { BuckBoostDesign } from './buckBoost'
import { mean, peakToPeak } from './signal'

/** Ideal 5 V to -12 V at 1 A, no parasitics, so every figure is hand-checkable. */
const IDEAL: BuckBoostDesign = {
  vin: 5,
  vout: 12,
  iout: 1,
  l: 100e-6,
  isat: 10,
  dcr: 0,
  cout: 100e-6,
  esr: 0,
  fsw: 100e3,
  rds: 0,
  vf: 0,
  topology: 'inverting',
  forceCascaded: false,
}

describe('ideal transfer function', () => {
  it('matches the textbook duty for each leg', () => {
    // D = |Vout|/(|Vout| + Vin): 12/(12+5)
    expect(dutyCascaded(5, 12)).toBeCloseTo(12 / 17, 12)
    // and it inverts back: Vout = Vin*D/(1-D)
    const d = dutyCascaded(5, 12)
    expect((5 * d) / (1 - d)).toBeCloseTo(12, 9)
    expect(dutyBuck(3.3, 1.8)).toBeCloseTo(1.8 / 3.3, 12)
    expect(dutyBoost(3.3, 5)).toBeCloseTo(1 - 3.3 / 5, 12)
  })

  it('reports the inverting output as negative and conserves power', () => {
    const r = analyse(IDEAL)
    expect(r.voutSigned).toBe(-12)
    expect(r.op.duty).toBeCloseTo(12 / 17, 9)
    // IL = Iout/(1-D) = 1/(5/17) = 3.4 A, dIL = Vin*D/(fsw*L)
    expect(r.op.ilAvg).toBeCloseTo(3.4, 6)
    expect(r.op.dIl).toBeCloseTo((5 * (12 / 17)) / (100e3 * 100e-6), 9)
    expect(r.efficiency).toBeCloseTo(1, 12)
    // Lossless: Vin*Iin must equal Vout*Iout, i.e. Iin = Iout*D/(1-D) = 2.4 A
    expect(r.iinAvg).toBeCloseTo(2.4, 6)
    // Output cap carries Iout*sqrt(D/(1-D)) plus the inductor ripple term
    expect(r.icoutRms).toBeCloseTo(Math.sqrt(2.4), 2)
    // Cap alone holds the rail up for the whole on-time: dV = Iout*D/(fsw*C)
    expect(r.vRipple).toBeCloseTo((1 * (12 / 17)) / (100e3 * 100e-6), 6)
  })
})

describe('losses inside the volt-second balance', () => {
  const lossy: BuckBoostDesign = { ...IDEAL, dcr: 0.05, rds: 0.08, vf: 0.4 }

  it('needs more duty than the ideal formula once drops are counted', () => {
    const r = analyse(lossy)
    expect(r.op.duty).toBeGreaterThan(r.op.dutyIdeal)
    expect(r.efficiency).toBeLessThan(1)
    expect(r.efficiency).toBeGreaterThan(0.7)
    // Pin = Pout + losses, and the supply current follows from it
    expect(r.pIn).toBeCloseTo(r.pOut + r.losses.total, 9)
    expect(r.iinAvg * lossy.vin).toBeCloseTo(r.pIn, 9)
  })

  it('holds vL(on)*D = vL(off)*(1-D) in every mode', () => {
    // Volt-second balance is the one thing that must survive the loss terms,
    // otherwise the inductor current would not be periodic.
    const cases: BuckBoostDesign[] = [
      lossy, // inverting, cascaded
      { ...lossy, topology: 'four-switch', vin: 5, vout: 1.8, iout: 2 }, // buck leg
      { ...lossy, topology: 'four-switch', vin: 3.3, vout: 12, iout: 0.3 }, // boost leg
      { ...lossy, topology: 'four-switch', vin: 3.3, vout: 3.4, iout: 1 }, // both legs
    ]
    const modes = cases.map((c) => operatingPoint(c).mode)
    expect(modes).toEqual(['buck-boost', 'buck', 'boost', 'buck-boost'])
    for (const c of cases) {
      const op = operatingPoint(c)
      expect(op.conduction).toBe('ccm')
      expect(op.vLon * op.duty).toBeCloseTo(op.vLoff * (1 - op.duty), 9)
    }
  })
})

describe('topology and mode selection', () => {
  it('splits the stress across two legs in the four-switch stage', () => {
    const inv = analyse(IDEAL)
    const four = analyse({ ...IDEAL, topology: 'four-switch', forceCascaded: true })
    // Single switch stands off Vin + |Vout|; each four-switch leg sees one rail
    expect(inv.vSwitch).toBeCloseTo(17, 9)
    expect(inv.vRect).toBeCloseTo(17, 9)
    expect(four.vSwitch).toBeCloseTo(5, 9)
    expect(four.vRect).toBeCloseTo(12, 9)
    expect(four.voutSigned).toBe(12) // non-inverting
    // Same energy path, so the currents are unchanged
    expect(four.op.duty).toBeCloseTo(inv.op.duty, 9)
    expect(four.op.ilPeak).toBeCloseTo(inv.op.ilPeak, 9)
  })

  it('drops to a plain buck or boost leg outside the dead band', () => {
    const base: BuckBoostDesign = { ...IDEAL, topology: 'four-switch', vin: 3.3 }
    expect(selectMode({ ...base, vout: 1.8 })).toBe('buck')
    expect(selectMode({ ...base, vout: 5 })).toBe('boost')
    expect(selectMode({ ...base, vout: 3.4 })).toBe('buck-boost')
    expect(selectMode({ ...base, vout: 1.8, forceCascaded: true })).toBe('buck-boost')
    // A buck leg carries only the load current; cascaded carries Iout/(1-D)
    const buck = analyse({ ...base, vout: 1.8, iout: 1, l: 22e-6, fsw: 500e3 })
    expect(buck.op.ilAvg).toBeCloseTo(1, 9)
    expect(analyse({ ...base, vout: 1.8, iout: 1, l: 22e-6, fsw: 500e3, forceCascaded: true }).op.ilAvg).toBeGreaterThan(1)
  })
})

describe('discontinuous conduction', () => {
  // 3V3 to -3V3 at 20 mA through 10 uH: the valley hits zero long before the
  // period ends, so the CCM duty law no longer applies.
  const light: BuckBoostDesign = {
    ...IDEAL,
    vin: 3.3,
    vout: 3.3,
    iout: 0.02,
    l: 10e-6,
    fsw: 500e3,
  }

  it('detects DCM and solves the lower duty it actually runs at', () => {
    const r = analyse(light)
    expect(r.op.conduction).toBe('dcm')
    // D = sqrt(2*fsw*L*Iout*|Vout|)/Vin = sqrt(0.66)/3.3
    expect(r.op.duty).toBeCloseTo(Math.sqrt(0.66) / 3.3, 6)
    expect(r.op.duty).toBeLessThan(dutyCascaded(3.3, 3.3))
    expect(r.op.ilValley).toBe(0)
    // Charge balance still holds: the rectifier delivers the whole load current
    expect(r.iRectAvg).toBeCloseTo(0.02, 6)
    // The inductor that would put this load on the CCM boundary
    expect(r.lCrit).toBeGreaterThan(light.l)
    expect(r.op.duty + r.op.d2).toBeLessThan(1)
  })

  it('flags saturation and duty limits instead of returning a quiet number', () => {
    const hard = analyse({ ...IDEAL, iout: 4, isat: 5, vout: 40 })
    expect(hard.op.duty).toBeGreaterThan(0.85)
    expect(hard.dutyLimited).toBe(true)
    expect(hard.op.ilPeak).toBeGreaterThan(5)
    expect(hard.saturating).toBe(true)
  })
})

describe('inductor current waveform', () => {
  it('averages to IL and swings by exactly dIL', () => {
    const op = operatingPoint(IDEAL)
    const { il, iRect } = waveform(op, IDEAL.fsw, 8192, 4)
    expect(mean(il) / op.ilAvg).toBeCloseTo(1, 2)
    expect(peakToPeak(il)).toBeCloseTo(op.dIl, 2)
    // The rectifier hands over the whole load current, averaged over a period
    expect(mean(iRect)).toBeCloseTo(IDEAL.iout, 2)
  })

  it('stays bounded at any sample rate, including under one point per period', () => {
    const op = operatingPoint(IDEAL)
    for (const [n, periods] of [
      [64, 1000],
      [17, 1],
      [8192, 4],
    ]) {
      const { il } = waveform(op, IDEAL.fsw, n, periods)
      for (const v of il) {
        expect(Number.isFinite(v)).toBe(true)
        expect(v).toBeGreaterThanOrEqual(op.ilValley - 1e-12)
        expect(v).toBeLessThanOrEqual(op.ilPeak + 1e-12)
      }
    }
  })
})
