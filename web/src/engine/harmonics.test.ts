import { describe, expect, it } from 'vitest'
import {
  IDEAL_PEAK,
  analyse,
  detectPreset,
  idealAt,
  preset,
  synthesise,
  valueAt,
} from './harmonics'
import { rms } from './signal'

/** sum of 1/n^2 over the odd n present in a 10 term series: 1, 3, 5, 7, 9 */
const ODD_SUM_SQ = 1 + 1 / 9 + 1 / 25 + 1 / 49 + 1 / 81 // 1.1838646...

describe('fourier presets', () => {
  it('matches the textbook coefficients, with sign carried as pi of phase', () => {
    // Square: odd harmonics only, 1/n, all in phase.
    const sq = preset('square', 1)
    expect(sq).toHaveLength(10)
    expect(sq[0].amplitude).toBeCloseTo(1, 12)
    expect(sq[1].amplitude).toBe(0) // no even harmonics
    expect(sq[2].amplitude).toBeCloseTo(1 / 3, 12)
    expect(sq[4].amplitude).toBeCloseTo(1 / 5, 12)
    expect(sq.every((x) => x.phase === 0)).toBe(true)
    expect(preset('square', 2.5)[2].amplitude).toBeCloseTo(2.5 / 3, 12) // scales

    // Triangle: odd harmonics at 1/n^2, sign (-1)^k for n = 2k+1.
    const tri = preset('triangle', 1)
    expect(tri[1].amplitude).toBe(0)
    expect(tri[2].amplitude).toBeCloseTo(1 / 9, 12)
    expect(tri[2].phase).toBeCloseTo(Math.PI, 12) // k = 1, inverted
    expect(tri[4].phase).toBe(0) // k = 2

    // Sawtooth: every harmonic at 1/n, sign (-1)^(n+1).
    const saw = preset('sawtooth', 1)
    expect(saw[1].amplitude).toBeCloseTo(1 / 2, 12)
    expect(saw[1].phase).toBeCloseTo(Math.PI, 12) // n = 2, inverted
    expect(saw[2].phase).toBe(0)

    // Each series is recognisable again at any level, and stops being itself
    // the moment a term that does not belong to it appears.
    for (const kind of ['sine', 'square', 'triangle', 'sawtooth'] as const) {
      expect(detectPreset(preset(kind, 1.7))).toBe(kind)
    }
    const tweaked = preset('square', 1)
    tweaked[3] = { amplitude: 0.4, phase: 0 } // an even harmonic a square cannot have
    expect(detectPreset(tweaked)).toBe('custom')
  })
})

describe('synthesis', () => {
  it('sums the series exactly at a quarter period', () => {
    // At t = T/4 every even harmonic vanishes, so the square series collapses to
    // the Leibniz partial sum 1 - 1/3 + 1/5 - 1/7 + 1/9 = 0.8349206...
    const t = 0.25 / 1000
    expect(valueAt(preset('square', 1), 1000, 0, t)).toBeCloseTo(0.8349206, 7)
    // The triangle peaks there, at sum of 1/n^2 over the odd n present.
    expect(valueAt(preset('triangle', 1), 1000, 0, t)).toBeCloseTo(ODD_SUM_SQ, 7)
    // DC rides on top untouched.
    expect(valueAt(preset('sine', 2), 1000, 1.65, t)).toBeCloseTo(3.65, 12)
  })

  it('overshoots the ideal square by the Wilbraham-Gibbs constant', () => {
    // Ideal square peak is V1*pi/4 = 0.7854 for a 1 V fundamental.
    expect(IDEAL_PEAK.square).toBeCloseTo(Math.PI / 4, 12)
    expect(idealAt('square', 1, 1000, 0, 0.1 / 1000)).toBeCloseTo(Math.PI / 4, 12)
    expect(idealAt('triangle', 1, 1000, 0, 0.25 / 1000)).toBeCloseTo(
      Math.PI ** 2 / 8,
      12,
    )
    // Truncating the series rings: the peak sits above the flat top and stays
    // there, converging on (2/pi)*Si(pi) = 1.178980 times the half jump, i.e.
    // 8.95% of the full 2A step. Adding terms narrows the ripple, not its height.
    const over = (n: number) => analyse(preset('square', 1, n)).peakAc / (Math.PI / 4)
    expect(over(10)).toBeCloseTo(1.18233, 4)
    expect(over(41)).toBeCloseTo(1.17898, 2)
    expect(over(41)).toBeLessThan(over(10))
    expect(over(41)).toBeGreaterThan(1.1)
  })

  it('stays bounded when dt is far larger than the period', () => {
    // Closed form, so a 1e6 period step must not wind up or diverge.
    const h = preset('sawtooth', 1)
    const bound = h.reduce((s, x) => s + x.amplitude, 0)
    const out = synthesise(h, 1000, 1.65, 500, 1e6 / 1000)
    for (const v of out) {
      expect(Number.isFinite(v)).toBe(true)
      expect(Math.abs(v - 1.65)).toBeLessThanOrEqual(bound + 1e-12)
    }
  })
})

describe('distortion metrics', () => {
  it('matches the hand-computed THD of each truncated series', () => {
    // Square, 5 terms: sqrt(1/9 + 1/25 + 1/49 + 1/81) / 1 = 0.4287948
    expect(analyse(preset('square', 1)).thd).toBeCloseTo(Math.sqrt(ODD_SUM_SQ - 1), 9)
    expect(analyse(preset('square', 1)).thd).toBeCloseTo(0.4287948, 6)
    // Scaling the whole waveform must not change THD.
    expect(analyse(preset('square', 3.3)).thd).toBeCloseTo(0.4287948, 6)
    // A full square is 48.34%: sqrt(pi^2/8 - 1). Five terms only get to 42.9%.
    expect(analyse(preset('square', 1, 401)).thd).toBeCloseTo(
      Math.sqrt(Math.PI ** 2 / 8 - 1),
      2,
    )
    // Triangle, 5 terms: 12.05%, heading for the exact sqrt(pi^4/96 - 1) = 12.12%
    const tri = analyse(preset('triangle', 1)).thd
    expect(tri).toBeCloseTo(0.1204765, 6)
    expect(tri).toBeLessThan(Math.sqrt(Math.PI ** 4 / 96 - 1))
    // A lone sine is distortion free.
    expect(analyse(preset('sine', 1)).thd).toBe(0)
  })

  it('reports crest factors that match the textbook waveforms', () => {
    // Sine: peak/rms = sqrt(2) exactly.
    expect(analyse(preset('sine', 1)).crest).toBeCloseTo(Math.SQRT2, 4)
    // Triangle: continuous, so no ringing, and the crest lands on sqrt(3) = 1.732.
    expect(analyse(preset('triangle', 1, 401)).crest).toBeCloseTo(Math.sqrt(3), 2)
    // Square is flatter than a sine, so its crest drops toward 1. It never gets
    // there: the ringing pins it at the Gibbs constant 1.179.
    const sq = analyse(preset('square', 1)).crest
    expect(sq).toBeCloseTo(1.2070, 3)
    expect(analyse(preset('square', 1, 101)).crest).toBeLessThan(sq)
    expect(analyse(preset('square', 1, 101)).crest).toBeGreaterThan(1.17)
  })

  it('obeys Parseval: rms is fixed by the amplitudes, the peak is not', () => {
    const h = preset('square', 2)
    const r = analyse(h)
    // 4096 samples over exactly 2 periods: harmonics stay orthogonal in the sum.
    const samples = synthesise(h, 1000, 0, 4096, 2 / 1000 / 4096)
    expect(rms(samples)).toBeCloseTo(r.rmsAc, 9)

    // Rotate every term to a cosine. Same amplitudes, so the same rms, but now
    // they all peak together at t = 0: sum of 1/n over odd n = 1.787302.
    const cosine = h.map((x) => ({ ...x, phase: Math.PI / 2 }))
    const c = analyse(cosine)
    expect(c.rmsAc).toBeCloseTo(r.rmsAc, 12)
    expect(c.peakAc).toBeCloseTo(2 * (1 + 1 / 3 + 1 / 5 + 1 / 7 + 1 / 9), 9)
    expect(c.crest).toBeGreaterThan(1.9 * r.crest)
  })

  it('flags a swing that a single supply rail cannot produce', () => {
    // 1 V fundamental centred on 1.65 V fits inside 0 to 3.3 V.
    const ok = analyse(preset('sine', 1), 1.65, 3.3)
    expect(ok.clipsHigh).toBe(false)
    expect(ok.clipsLow).toBe(false)
    expect(ok.headroom).toBeCloseTo(0.65, 3)
    // 2 V of fundamental on the same offset runs off both ends.
    const hot = analyse(preset('sine', 2), 1.65, 3.3)
    expect(hot.clipsHigh).toBe(true)
    expect(hot.clipsLow).toBe(true)
    expect(hot.headroom).toBeLessThan(0)
    // No fundamental but energy elsewhere: THD is undefined, not a silent number.
    const noFund = preset('square', 1)
    noFund[0] = { amplitude: 0, phase: 0 }
    expect(analyse(noFund).thd).toBe(Infinity)
  })
})
