import { describe, expect, it } from 'vitest'
import { GPIO_MAX_MA, VCC, VCC_5V, V_THERMAL } from './constants'
import {
  ODF_TARGET,
  VCE_SAT,
  ampTrace,
  analyseAmp,
  analyseSwitch,
  switchTrace,
} from './bjt'
import type { AmpInput, SwitchStage } from './bjt'
import { generate, peakToPeak } from './signal'

/** 3V3 GPIO through 1k into a 5 V, 100 ohm load. hFE 100. */
const STAGE: SwitchStage = { rb: 1000, vLoad: VCC_5V, rLoad: 100, hfe: 100 }

/** 3V3 rail, 22k/10k divider, 3k3 collector, 680R emitter. */
const AMP: AmpInput = {
  vcc: VCC,
  r1: 22_000,
  r2: 10_000,
  rc: 3_300,
  re: 680,
  hfe: 100,
  bypassed: false,
}

describe('bjt switch', () => {
  it('saturates with the textbook numbers', () => {
    const s = analyseSwitch({ ...STAGE, vDrive: VCC })
    // IB = (3.3 - 0.7)/1k = 2.6 mA, load wants (5 - 0.2)/100 = 48 mA
    expect(s.ib).toBeCloseTo(2.6e-3, 9)
    expect(s.icSat).toBeCloseTo(48e-3, 9)
    expect(s.ibMin).toBeCloseTo(0.48e-3, 9) // 48 mA / 100
    expect(s.odf).toBeCloseTo(5.4167, 3) // 260 mA available / 48 mA needed
    expect(s.state).toBe('saturated')
    expect(s.vce).toBe(VCE_SAT)
    expect(s.ic).toBeCloseTo(48e-3, 9)
    expect(s.pCollector).toBeCloseTo(9.6e-3, 9) // 0.2 V * 48 mA
  })

  it('falls out of saturation with a starved base and burns far more heat', () => {
    const weak = analyseSwitch({ ...STAGE, rb: 10_000, vDrive: VCC })
    const hard = analyseSwitch({ ...STAGE, vDrive: VCC })
    // IB = 260 uA -> only 26 mA available, less than the 48 mA the load wants
    expect(weak.state).toBe('active')
    expect(weak.odf).toBeLessThan(1)
    expect(weak.ic).toBeCloseTo(26e-3, 9)
    expect(weak.vce).toBeCloseTo(5 - 26e-3 * 100, 9) // 2.4 V across the device
    expect(weak.pCollector).toBeCloseTo(62.4e-3, 9)
    expect(weak.pCollector / hard.pCollector).toBeGreaterThan(6)
  })

  it('sizes RB for the target overdrive and flags a GPIO over its limit', () => {
    const s = analyseSwitch({ ...STAGE, vDrive: VCC })
    // RB(max) = (3.3 - 0.7)/(10 * 0.48 mA) = 541.7 ohm
    expect(s.rbForTarget).toBeCloseTo(541.667, 3)
    const sized = analyseSwitch({ ...STAGE, rb: s.rbForTarget, vDrive: VCC })
    expect(sized.odf).toBeCloseTo(ODF_TARGET, 9)

    expect(s.overGpio).toBe(false) // 2.6 mA
    const brutal = analyseSwitch({ ...STAGE, rb: 100, vDrive: VCC })
    expect(brutal.ib * 1000).toBeGreaterThan(GPIO_MAX_MA) // 26 mA
    expect(brutal.overGpio).toBe(true)
  })

  it('switches between the two rails and is independent of the time base', () => {
    const drive = { kind: 'square' as const, amplitude: VCC / 2, offset: VCC / 2, frequency: 1 }
    const slow = switchTrace(generate(drive, 1024, 1e-3), STAGE)
    const fast = switchTrace(generate({ ...drive, frequency: 1e6 }, 1024, 1e-9), STAGE)
    for (const trace of [slow.vce, fast.vce]) {
      for (const v of trace) expect(v === VCE_SAT || v === VCC_5V).toBe(true)
      expect(peakToPeak(trace)).toBeCloseTo(VCC_5V - VCE_SAT, 9)
    }
    expect(slow.ic[0]).toBeCloseTo(48e-3, 9) // high half of the square
    expect(slow.ic[600]).toBe(0) // low half, base off
  })
})

describe('bjt common emitter amplifier', () => {
  it('places the Q point where the exact divider solution says', () => {
    const q = analyseAmp(AMP)
    // VTH = 3.3*10/32 = 1.03125 V, RTH = 6875 ohm
    expect(q.vth).toBeCloseTo(1.03125, 9)
    expect(q.rth).toBeCloseTo(6875, 9)
    // IB = (1.03125 - 0.7)/(6875 + 101*680) = 4.384 uA
    expect(q.ib).toBeCloseTo(4.384e-6, 9)
    expect(q.ic).toBeCloseTo(0.4384e-3, 6)
    expect(q.ve).toBeCloseTo(0.3011, 4)
    expect(q.vc).toBeCloseTo(1.8532, 4)
    expect(q.vce).toBeCloseTo(1.5521, 4)
    expect(q.region).toBe('active')
    expect(q.stiff).toBe(true) // 103 uA of divider current against 4.4 uA of IB
  })

  it('gains -RC/(RE + re) unbypassed and -RC/re bypassed', () => {
    const open = analyseAmp(AMP)
    const bypassed = analyseAmp({ ...AMP, bypassed: true })
    // re = VT/IE, about 58 ohm here. Derived from V_THERMAL rather than written
    // out, so correcting the thermal voltage cannot silently invalidate this.
    const re = V_THERMAL / open.ie
    expect(open.reSmall).toBeCloseTo(re, 9)
    expect(re).toBeGreaterThan(55)
    expect(re).toBeLessThan(62)
    expect(open.av).toBeCloseTo(-3300 / (680 + re), 2) // about -4.47
    expect(bypassed.av).toBeCloseTo(-3300 / re, 1) // about -57
    // Same Q point, so the bypass cap buys exactly (RE + re)/re of gain.
    expect(bypassed.av / open.av).toBeCloseTo((680 + open.reSmall) / open.reSmall, 6)
    // Headroom is fixed, so more gain means a smaller usable input.
    expect(bypassed.maxInput).toBeLessThan(open.maxInput)
    expect(open.maxInput * Math.abs(open.av)).toBeCloseTo(open.swing, 9)
  })

  it('flags saturation and cutoff instead of returning impossible values', () => {
    // 100k collector resistor: the rail cannot support that much drop.
    const sat = analyseAmp({ ...AMP, rc: 100_000 })
    expect(sat.region).toBe('saturated')
    expect(sat.vce).toBe(VCE_SAT)
    expect(sat.vc).toBeLessThan(AMP.vcc)
    expect(sat.swing).toBe(0)

    // Divider too low to forward bias the junction at all.
    const off = analyseAmp({ ...AMP, r2: 1_000 })
    expect(off.vth).toBeLessThan(0.7)
    expect(off.region).toBe('cutoff')
    expect(off.ic).toBe(0)
    expect(off.vce).toBeCloseTo(AMP.vcc, 9)
    expect(Math.abs(off.av)).toBe(0)
    expect(off.swing).toBe(0)
  })

  it('inverts the input and clips at the rail and at saturation', () => {
    const q = analyseAmp(AMP)
    const n = 512
    const dt = 1 / (1e3 * n) // exactly one cycle, so 128 is the peak and 384 the trough
    const small = generate({ kind: 'sine', amplitude: 0.01, offset: 0, frequency: 1e3 }, n, dt)
    const out = ampTrace(small, AMP)
    // Inverting: a rising base pulls the collector down.
    expect(out.base[0]).toBeCloseTo(q.vb, 9)
    expect(out.collector[128]).toBeLessThan(q.vc) // sine peak
    expect(out.collector[384]).toBeGreaterThan(q.vc) // sine trough
    expect(peakToPeak(out.collector) / peakToPeak(small)).toBeCloseTo(Math.abs(q.av), 6)

    // 1 V of drive is 3x the headroom, so both ends must clamp, not run away.
    const huge = generate({ kind: 'sine', amplitude: 1, offset: 0, frequency: 1e3 }, n, dt)
    const clipped = ampTrace(huge, AMP)
    for (const v of clipped.collector) {
      expect(v).toBeGreaterThanOrEqual(q.ve + VCE_SAT - 1e-12)
      expect(v).toBeLessThanOrEqual(AMP.vcc + 1e-12)
    }
    expect(Math.max(...clipped.collector)).toBeCloseTo(AMP.vcc, 9)
    expect(Math.min(...clipped.collector)).toBeCloseTo(q.ve + VCE_SAT, 9)
  })
})
