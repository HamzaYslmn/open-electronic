/**
 * Resistive voltage divider.
 *
 * Two resistors in series across the supply with the output taken at their
 * junction. Every result here is closed form, so there is no time-domain
 * solver: the page is a calculator, not a scope.
 *
 * Unloaded:  Vout = Vin * R2 / (R1 + R2)
 * Loaded:    R2' = R2 || RL, then Vout = Vin * R2' / (R1 + R2')
 * Thevenin:  Zout = R1 || R2, and the loaded output is identically
 *            Vout_unloaded * RL / (RL + Zout), which is why a divider sags
 *            as soon as RL stops being large compared with Zout.
 */

/**
 * Power a common 0603 chip resistor dissipates at 70 C ambient. 0402 is 1/16 W,
 * 0805 is 1/8 W, 1206 and most axial parts are 1/4 W. 1/10 W is the honest
 * default for a hand-built ESP32 board.
 */
export const RESISTOR_POWER_RATING_W = 0.1

/**
 * Espressif's guidance for the ESP32 ADC: keep the impedance driving the pin
 * below roughly 10 kOhm, otherwise the sample-and-hold capacitor cannot settle
 * inside the sampling window and the conversion reads low. A divider feeding an
 * ADC pin is judged on its Thevenin Zout, not on R1 or R2 alone.
 */
export const ADC_MAX_SOURCE_OHMS = 10_000

/**
 * Below this the load is stiff enough to ignore: RL = 10*Zout costs 9.1% of the
 * output, RL = 100*Zout costs 1%.
 */
export const STIFF_LOAD_RATIO = 10

/** Two resistors in parallel, a*b/(a+b). Infinity means "not connected". */
export function parallel(a: number, b: number): number {
  if (!Number.isFinite(a)) return b
  if (!Number.isFinite(b)) return a
  const sum = a + b
  return sum > 0 ? (a * b) / sum : 0
}

/** Unloaded output, Vout = Vin * R2 / (R1 + R2). */
export function dividerOutput(vin: number, r1: number, r2: number): number {
  const sum = r1 + r2
  return sum > 0 ? (vin * r2) / sum : 0
}

/** Thevenin impedance looking back into the tap with Vin shorted, Zout = R1 || R2. */
export function outputImpedance(r1: number, r2: number): number {
  return parallel(r1, r2)
}

/** Output with RL hung on the tap: R2 || RL takes the place of R2. */
export function loadedOutput(vin: number, r1: number, r2: number, rl: number): number {
  return dividerOutput(vin, r1, parallel(r2, rl))
}

/** Everything the divider page reports, derived once per parameter change. */
export type DividerReadout = {
  /** Open-circuit output. */
  vout: number
  /** Output with RL connected. */
  voutLoaded: number
  /** Thevenin source impedance at the tap. */
  zout: number
  /** R2 || RL, i.e. the effective lower leg. */
  r2Effective: number
  /** Ratio R2/(R1+R2), the unloaded transfer. */
  ratio: number
  /** Current wasted in the string with nothing attached, Vin/(R1+R2). */
  iQuiescent: number
  /** What the supply actually delivers with RL connected. Also the R1 current. */
  iSupply: number
  iR2: number
  iLoad: number
  pR1: number
  pR2: number
  pLoad: number
  /** Total drawn from the supply, Vin*iSupply. */
  pTotal: number
  /** Signed shift the load causes, in volts. Negative: the load pulls it down. */
  errorV: number
  /** Same, as a percentage of the unloaded output. */
  errorPct: number
  /** RL / Zout. At or above STIFF_LOAD_RATIO the load barely matters. */
  stiffness: number
  /** Either resistor is over its package rating. */
  overPower: boolean
  /** Zout is too high to drive an ESP32 ADC pin directly. */
  adcUnfriendly: boolean
}

export function analyse(
  vin: number,
  r1: number,
  r2: number,
  rl: number,
  rating: number = RESISTOR_POWER_RATING_W,
): DividerReadout {
  const vout = dividerOutput(vin, r1, r2)
  const r2Effective = parallel(r2, rl)
  const voutLoaded = dividerOutput(vin, r1, r2Effective)
  const zout = outputImpedance(r1, r2)

  const series = r1 + r2
  const seriesLoaded = r1 + r2Effective
  const iQuiescent = series > 0 ? vin / series : 0
  // KCL at the tap: the R1 current splits between R2 and RL.
  const iSupply = seriesLoaded > 0 ? vin / seriesLoaded : 0
  const iR2 = r2 > 0 ? voutLoaded / r2 : 0
  const iLoad = Number.isFinite(rl) && rl > 0 ? voutLoaded / rl : 0

  // P = I²R across R1, V²/R across the shunt legs.
  const pR1 = iSupply * iSupply * r1
  const pR2 = r2 > 0 ? (voutLoaded * voutLoaded) / r2 : 0
  const pLoad = Number.isFinite(rl) && rl > 0 ? (voutLoaded * voutLoaded) / rl : 0

  const errorV = voutLoaded - vout
  const stiffness = zout > 0 ? rl / zout : Infinity

  return {
    vout,
    voutLoaded,
    zout,
    r2Effective,
    ratio: series > 0 ? r2 / series : 0,
    iQuiescent,
    iSupply,
    iR2,
    iLoad,
    pR1,
    pR2,
    pLoad,
    pTotal: vin * iSupply,
    errorV,
    errorPct: vout !== 0 ? (errorV / vout) * 100 : 0,
    stiffness,
    overPower: pR1 > rating || pR2 > rating,
    adcUnfriendly: zout > ADC_MAX_SOURCE_OHMS,
  }
}
