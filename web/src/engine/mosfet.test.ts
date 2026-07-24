import { describe, expect, it } from 'vitest'
import { GPIO_MAX_MA, T_AMBIENT_K } from './constants'
import {
  DEFAULTS,
  TJ_MAX_K,
  analyse,
  gateChargeTime,
  gatePeakCurrent,
  junctionTemp,
  kFactor,
  operatingPoint,
  rdsOnAt,
  saturationCurrent,
  switchingLoss,
  waveform,
} from './mosfet'
import { mean } from './signal'

const GPIO_MAX_A = GPIO_MAX_MA / 1000

describe('channel model', () => {
  it('reproduces the datasheet RDS(on) at its own quote condition', () => {
    // 22 mohm at VGS = 5 V, Vth = 2 V -> k = 1/(0.022*3) = 15.152 A/V^2
    expect(kFactor(0.022, 5, 2)).toBeCloseTo(15.1515, 3)
    expect(rdsOnAt(0.022, 5, 2, 5)).toBeCloseTo(0.022, 12)
  })

  it('scales RDS(on) up when a 3V3 GPIO drives a part quoted at 5 V', () => {
    // rds = rds_spec * (Vgs_spec - Vth)/(Vgs - Vth) = 0.022 * 3 / 1.3
    expect(rdsOnAt(0.022, 5, 2, 3.3)).toBeCloseTo(0.0507692, 7)
    // A 10 V part with a 4 V threshold has no channel at all on 3.3 V.
    expect(rdsOnAt(0.044, 10, 4, 3.3)).toBe(Infinity)
  })

  it('solves the load line in both regions and stays on it', () => {
    const k = kFactor(0.022, 5, 2)
    const vSupply = 5

    // Small load resistance: the load line is steep and lands in saturation.
    const sat = operatingPoint(k, 3.3, 2, vSupply, 0.1)
    expect(sat.region).toBe('saturation')
    expect(sat.id).toBeCloseTo(saturationCurrent(k, 3.3, 2), 9) // 0.5*k*1.3^2
    expect(sat.id).toBeCloseTo(12.803, 3)
    expect(sat.vds).toBeCloseTo(vSupply - sat.id * 0.1, 9)

    // Large load resistance: only 50 mA flows, the channel is deep in triode
    // and its chord resistance collapses onto 1/(k*Vov).
    const tri = operatingPoint(k, 3.3, 2, vSupply, 100)
    expect(tri.region).toBe('triode')
    expect(tri.vds).toBeCloseTo(vSupply - tri.id * 100, 9)
    expect(tri.rdsOp / rdsOnAt(0.022, 5, 2, 3.3)).toBeCloseTo(1, 2)
  })

  it('is fully off below threshold', () => {
    const k = kFactor(0.044, 10, 4)
    const off = operatingPoint(k, 3.3, 4, 12, 5)
    expect(off.region).toBe('cutoff')
    expect(off.id).toBe(0)
    expect(off.vds).toBe(12) // the whole rail sits across the FET
  })
})

describe('losses and thermals', () => {
  it('matches the textbook switching loss', () => {
    // 0.5 * 100 V * 10 A * 200 ns * 100 kHz = 10 W
    expect(switchingLoss(100, 10, 100e-9, 100e-9, 100e3)).toBeCloseTo(10, 9)
    // Halving the frequency halves the loss.
    expect(switchingLoss(100, 10, 100e-9, 100e-9, 50e3)).toBeCloseTo(5, 9)
  })

  it('puts Tj on the right side of the 150 C limit', () => {
    // 62 K/W in free air: 2 W is 124 K of rise, i.e. 149 C from a 25 C ambient.
    expect(junctionTemp(T_AMBIENT_K, 2, 62)).toBeCloseTo(422.15, 9)
    expect(junctionTemp(T_AMBIENT_K, 2, 62)).toBeLessThan(TJ_MAX_K)
    expect(junctionTemp(T_AMBIENT_K, 2.1, 62)).toBeGreaterThan(TJ_MAX_K)
  })

  it('flags the two classic ESP32 gate drive mistakes', () => {
    // A standard (non logic level) FET simply never turns on from a GPIO.
    const std = analyse(
      { ...DEFAULTS, vth: 4, vgsSpec: 10, rdsOnSpec: 0.044 },
      GPIO_MAX_A,
    )
    expect(std.belowThreshold).toBe(true)
    expect(std.region).toBe('cutoff')
    expect(std.id).toBe(0)
    expect(std.pCond).toBe(0)

    // A logic level part works but not at its quoted RDS(on).
    const logic = analyse(DEFAULTS, GPIO_MAX_A)
    expect(logic.belowThreshold).toBe(false)
    expect(logic.underDriven).toBe(true)
    expect(logic.rdsOn).toBeGreaterThan(DEFAULTS.rdsOnSpec)
    expect(logic.region).toBe('triode')

    // 3.3 V through 330 ohm is 10 mA, inside the GPIO rating; 100 ohm is not.
    expect(gatePeakCurrent(3.3, 330)).toBeCloseTo(0.01, 9)
    expect(logic.gateOverCurrent).toBe(false)
    expect(analyse({ ...DEFAULTS, rg: 100 }, GPIO_MAX_A).gateOverCurrent).toBe(true)
  })

  it('lets the gate resistor set the transition time when it is the slower limit', () => {
    // t = Qg*Rg/Vdrive = 48 nC * 330 / 3.3 = 4.8 us, far slower than the 100 ns die.
    expect(gateChargeTime(48e-9, 330, 3.3)).toBeCloseTo(4.8e-6, 12)
    const slow = analyse(DEFAULTS, GPIO_MAX_A)
    expect(slow.trEff).toBeCloseTo(4.8e-6, 12)
    // 5 ohm moves the same charge in 73 ns, so the die is the limit again.
    const fast = analyse({ ...DEFAULTS, rg: 5 }, GPIO_MAX_A)
    expect(fast.trEff).toBe(DEFAULTS.tr)
    expect(fast.pSw).toBeLessThan(slow.pSw)
  })
})

describe('switching waveform', () => {
  const p = { ...DEFAULTS, fsw: 100e3, tr: 250e-9, tf: 250e-9, rg: 5 }

  it('integrates to the closed form conduction plus switching loss', () => {
    const a = analyse(p, GPIO_MAX_A)
    const w = waveform(p, a, 65536, 2) // whole cycles, so the mean is the average power
    // The two disagree by Von*Id*(tf - 3*tr)/4 per period, i.e. how the on-state
    // drop is booked during the edges. Well under 1% while Von is small.
    expect(Math.abs(mean(w.p) / (a.pCond + a.pSw) - 1)).toBeLessThan(0.01)
    expect(mean(w.p)).toBeCloseTo(a.pCond + a.pSw, 2)
  })

  it('stays bounded and finite when dt is far larger than a transition', () => {
    // 1 MHz sampled at 1024 points over 5 cycles: dt is ~1 us against a 250 ns edge.
    const fastP = { ...p, fsw: 1e6 }
    const a = analyse(fastP, GPIO_MAX_A)
    const w = waveform(fastP, a, 1024, 5)
    for (let i = 0; i < w.vds.length; i++) {
      expect(Number.isFinite(w.p[i])).toBe(true)
      expect(w.vds[i]).toBeGreaterThanOrEqual(0)
      expect(w.vds[i]).toBeLessThanOrEqual(fastP.vSupply + 1e-12)
      expect(w.id[i]).toBeGreaterThanOrEqual(0)
      expect(w.id[i]).toBeLessThanOrEqual(a.id + 1e-12)
      expect(w.vgs[i]).toBeLessThanOrEqual(fastP.vgsDrive + 1e-12)
    }
  })

  it('never leaves the rail when the gate cannot reach threshold', () => {
    const offP = { ...p, vth: 4, vgsSpec: 10, rdsOnSpec: 0.044 }
    const a = analyse(offP, GPIO_MAX_A)
    const w = waveform(offP, a, 4096, 2)
    for (let i = 0; i < w.vds.length; i++) {
      expect(w.vds[i]).toBeCloseTo(offP.vSupply, 12)
      expect(w.id[i]).toBe(0)
    }
    expect(mean(w.p)).toBe(0)
  })
})
