/**
 * AC network maths: complex impedance and transformers.
 *
 * Both pages are phasor arithmetic, so the small complex helpers live here once
 * rather than being reinvented per page.
 *
 * Base SI: ohms, henries, farads, hertz, volts, amps.
 */

/** A complex value in rectangular form. */
export type Complex = { re: number; im: number }

export const cAdd = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
})

export const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
})

export function cDiv(a: Complex, b: Complex): Complex {
  const d = b.re * b.re + b.im * b.im
  if (d === 0) return { re: Infinity, im: Infinity }
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}

export const cAbs = (a: Complex): number => Math.hypot(a.re, a.im)
/** Argument in degrees, which is how phase is always quoted in practice. */
export const cArgDeg = (a: Complex): number => (Math.atan2(a.im, a.re) * 180) / Math.PI

/** Angular frequency, rad/s. */
export const omega = (f: number): number => 2 * Math.PI * f

/** Inductive reactance, XL = 2*pi*f*L. Purely imaginary and positive. */
export const reactanceL = (f: number, l: number): number => omega(f) * l

/** Capacitive reactance magnitude, XC = 1/(2*pi*f*C). */
export function reactanceC(f: number, c: number): number {
  const w = omega(f)
  return w > 0 && c > 0 ? 1 / (w * c) : Infinity
}

export type Topology = 'series' | 'parallel'

export type ImpedanceReadout = {
  z: Complex
  magnitude: number
  phaseDeg: number
  /** Equivalent series resistance and reactance, ohms. */
  resistance: number
  reactance: number
  xl: number
  xc: number
  /** Resonant frequency of the L and C together, Hz. */
  resonance: number
  /** Quality factor at resonance for the chosen topology. */
  q: number
  /** -3 dB bandwidth around resonance, Hz. */
  bandwidth: number
  /** Current drawn from a 1 V source, A, i.e. the admittance magnitude. */
  admittance: number
  /** Which element dominates at this frequency. */
  character: 'inductive' | 'capacitive' | 'resistive'
  /** True when the network is at or extremely near resonance. */
  atResonance: boolean
}

/**
 * Series: Z = R + j(XL - XC).
 * Parallel: Z = 1/(1/R + 1/jXL + jwC), evaluated as complex admittances.
 */
export function analyseImpedance(
  topology: Topology,
  r: number,
  l: number,
  c: number,
  f: number,
): ImpedanceReadout {
  const xl = reactanceL(f, l)
  const xc = reactanceC(f, c)
  const w = omega(f)

  let z: Complex
  if (topology === 'series') {
    z = { re: r, im: xl - (Number.isFinite(xc) ? xc : 0) }
  } else {
    // Admittances add in parallel: Y = 1/R + 1/(jwL) + jwC
    const y: Complex = {
      re: r > 0 ? 1 / r : 0,
      im: (w * l > 0 ? -1 / (w * l) : 0) + w * c,
    }
    z = cDiv({ re: 1, im: 0 }, y)
  }

  const resonance = l > 0 && c > 0 ? 1 / (2 * Math.PI * Math.sqrt(l * c)) : 0
  // Series Q = (1/R)sqrt(L/C); parallel Q is its reciprocal form, R*sqrt(C/L).
  const q =
    l > 0 && c > 0 && r > 0
      ? topology === 'series'
        ? (1 / r) * Math.sqrt(l / c)
        : r * Math.sqrt(c / l)
      : 0
  const magnitude = cAbs(z)
  const reactance = z.im
  return {
    z,
    magnitude,
    phaseDeg: cArgDeg(z),
    resistance: z.re,
    reactance,
    xl,
    xc,
    resonance,
    q,
    bandwidth: q > 0 ? resonance / q : 0,
    admittance: magnitude > 0 ? 1 / magnitude : Infinity,
    character:
      Math.abs(reactance) < magnitude * 1e-6
        ? 'resistive'
        : reactance > 0
          ? 'inductive'
          : 'capacitive',
    atResonance: resonance > 0 && Math.abs(f - resonance) < resonance * 1e-3,
  }
}

// ---------------------------------------------------------------------------
// Transformers
// ---------------------------------------------------------------------------

export type TransformerReadout = {
  /** Turns ratio Np/Ns. */
  ratio: number
  /** Secondary open-circuit voltage, V. */
  vSecondaryNoLoad: number
  /** Secondary voltage under load, after winding drops, V. */
  vSecondaryLoaded: number
  /** Secondary and primary currents, A. */
  iSecondary: number
  iPrimary: number
  /** Load impedance reflected into the primary, ohms. */
  reflected: number
  /** Apparent power drawn, VA. */
  va: number
  /** Copper loss in each winding and in total, W. */
  lossPrimary: number
  lossSecondary: number
  lossTotal: number
  efficiency: number
  /** Regulation, (Vnl - Vfl)/Vfl as a fraction. */
  regulation: number
  /** Load exceeds the transformer's VA rating. */
  overRated: boolean
  /** Regulation worse than a rule-of-thumb 10%. */
  poorRegulation: boolean
}

/**
 * Ideal transformer with winding resistance. Vs = Vp*Ns/Np, Is = Ip*Np/Ns, and
 * a load Zs reflects into the primary as (Np/Ns)^2 * Zs, which is the whole
 * reason transformers are used for impedance matching as well as voltage.
 */
export function analyseTransformer(
  vPrimary: number,
  np: number,
  ns: number,
  loadOhms: number,
  rPrimary: number,
  rSecondary: number,
  vaRating: number,
): TransformerReadout {
  const ratio = ns > 0 ? np / ns : Infinity
  const vNoLoad = ratio > 0 ? vPrimary / ratio : 0
  // The secondary sees its own winding resistance in series with the load, and
  // the primary resistance reflected across the same ratio.
  const rReflected = rPrimary / (ratio * ratio)
  const iSecondary = loadOhms + rSecondary + rReflected > 0
    ? vNoLoad / (loadOhms + rSecondary + rReflected)
    : 0
  const vLoaded = iSecondary * loadOhms
  const iPrimary = iSecondary / ratio
  const lossSecondary = iSecondary * iSecondary * rSecondary
  const lossPrimary = iPrimary * iPrimary * rPrimary
  const pOut = vLoaded * iSecondary
  const lossTotal = lossPrimary + lossSecondary
  return {
    ratio,
    vSecondaryNoLoad: vNoLoad,
    vSecondaryLoaded: vLoaded,
    iSecondary,
    iPrimary,
    reflected: ratio * ratio * loadOhms,
    va: vLoaded * iSecondary,
    lossPrimary,
    lossSecondary,
    lossTotal,
    efficiency: pOut + lossTotal > 0 ? pOut / (pOut + lossTotal) : 0,
    regulation: vLoaded > 0 ? (vNoLoad - vLoaded) / vLoaded : Infinity,
    overRated: vaRating > 0 && vLoaded * iSecondary > vaRating,
    poorRegulation: vLoaded > 0 && (vNoLoad - vLoaded) / vLoaded > 0.1,
  }
}
