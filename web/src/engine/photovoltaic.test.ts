import { describe, expect, it } from 'vitest'
import {
  G_STC,
  T_STC_K,
  analyse,
  currentAt,
  ivCurve,
  maxPowerPoint,
  openCircuitVoltage,
  operatingPoint,
  paramsAt,
  thermalVoltage,
} from './photovoltaic'
import type { PanelSpec } from './photovoltaic'

/** A conventional 60 cell mono panel: about 250 W at STC. */
const PANEL: PanelSpec = {
  cells: 60,
  iscStc: 8.8,
  vocStc: 37.5,
  ideality: 1.2,
  rs: 0.35,
  rsh: 300,
  cellEdge: 0.156,
}

const STC = { irradiance: G_STC, cellTempK: T_STC_K }

describe('single diode model', () => {
  it('puts the thermal voltage of one cell near 25.9 mV at 25 C', () => {
    // a = Ns*n*kT/q, so one cell with n = 1 is just kT/q, 25.69 mV at 298.15 K.
    expect(thermalVoltage(1, 1, T_STC_K)).toBeCloseTo(0.0256926, 6)
    // A 60 cell string with n = 1.2 scales by 72.
    expect(thermalVoltage(60, 1.2, T_STC_K)).toBeCloseTo(0.0256926 * 72, 4)
  })

  it('reproduces the datasheet Isc and Voc at STC', () => {
    const op = operatingPoint(PANEL, STC)
    // Isc is the photocurrent less the shunt leak, so it lands just under.
    expect(op.isc).toBeGreaterThan(PANEL.iscStc * 0.98)
    expect(op.isc).toBeLessThanOrEqual(PANEL.iscStc)
    expect(op.voc).toBeCloseTo(PANEL.vocStc, 1)
  })

  it('brackets the maximum power point inside the curve', () => {
    const op = operatingPoint(PANEL, STC)
    expect(op.vmp).toBeGreaterThan(0)
    expect(op.vmp).toBeLessThan(op.voc)
    expect(op.imp).toBeLessThan(op.isc)
    // Pmp really is the maximum: nothing on the curve beats it.
    const p = paramsAt(PANEL, STC)
    const curve = ivCurve(p, op.voc, 400)
    expect(op.pmp).toBeGreaterThanOrEqual(Math.max(...curve.watts) - 1e-6)
  })

  it('gives a healthy c-Si fill factor between 0.7 and 0.85', () => {
    const op = operatingPoint(PANEL, STC)
    expect(op.ff).toBeGreaterThan(0.7)
    expect(op.ff).toBeLessThan(0.85)
  })

  it('scales photocurrent with irradiance, so Isc is near linear in G', () => {
    const half = operatingPoint(PANEL, { ...STC, irradiance: G_STC / 2 })
    const full = operatingPoint(PANEL, STC)
    expect(half.isc / full.isc).toBeCloseTo(0.5, 2)
    // Voc falls only logarithmically with irradiance, so it holds up.
    expect(half.voc).toBeGreaterThan(full.voc * 0.9)
  })

  it('loses roughly 0.3% of Voc per kelvin of cell temperature', () => {
    const r = analyse(PANEL, STC)
    // Negative coefficient, and the magnitude is the standard c-Si figure.
    expect(r.betaVoc).toBeLessThan(0)
    expect(Math.abs(r.betaVocFrac)).toBeGreaterThan(0.002)
    expect(Math.abs(r.betaVocFrac)).toBeLessThan(0.005)
    // A hot panel really does make less power than a cold one.
    const hot = operatingPoint(PANEL, { ...STC, cellTempK: T_STC_K + 30 })
    expect(hot.pmp).toBeLessThan(operatingPoint(PANEL, STC).pmp)
  })

  it('is monotonic: current only falls as voltage rises', () => {
    const p = paramsAt(PANEL, STC)
    const voc = openCircuitVoltage(p)
    let prev = currentAt(p, 0)
    for (let k = 1; k <= 200; k++) {
      const i = currentAt(p, (k / 200) * voc)
      expect(i).toBeLessThanOrEqual(prev + 1e-9)
      prev = i
    }
  })

  it('reports an efficiency in the plausible range for silicon', () => {
    const r = analyse(PANEL, STC)
    expect(r.area).toBeCloseTo(60 * 0.156 * 0.156, 6)
    expect(r.efficiency).toBeGreaterThan(0.1)
    expect(r.efficiency).toBeLessThan(0.25)
  })

  it('flags low light and keeps the solver stable in near darkness', () => {
    const dark = analyse(PANEL, { ...STC, irradiance: 20 })
    expect(dark.lowLight).toBe(true)
    expect(Number.isFinite(dark.now.pmp)).toBe(true)
    expect(dark.now.pmp).toBeGreaterThanOrEqual(0)
  })

  it('finds no power at zero irradiance instead of returning NaN', () => {
    const night = analyse(PANEL, { ...STC, irradiance: 0 })
    expect(Number.isFinite(night.now.pmp)).toBe(true)
    expect(night.now.pmp).toBeLessThan(0.1)
  })

  it('keeps maxPowerPoint inside the bracket for a degenerate curve', () => {
    const p = paramsAt(PANEL, { ...STC, irradiance: 1 })
    const voc = openCircuitVoltage(p)
    const mpp = maxPowerPoint(p, voc)
    expect(mpp.vmp).toBeGreaterThanOrEqual(0)
    expect(mpp.vmp).toBeLessThanOrEqual(Math.max(voc, 0))
    expect(Number.isFinite(mpp.pmp)).toBe(true)
  })
})
