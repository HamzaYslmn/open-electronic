/**
 * SI formatting and parsing. Everything in the engine is stored in base SI units
 * (V, A, Ω, F, H, s, Hz, W); prefixes exist only at the display/input edge.
 */

const PREFIXES: ReadonlyArray<{ exp: number; sym: string }> = [
  { exp: 12, sym: 'T' },
  { exp: 9, sym: 'G' },
  { exp: 6, sym: 'M' },
  { exp: 3, sym: 'k' },
  { exp: 0, sym: '' },
  { exp: -3, sym: 'm' },
  { exp: -6, sym: 'µ' },
  { exp: -9, sym: 'n' },
  { exp: -12, sym: 'p' },
  { exp: -15, sym: 'f' },
]

/** Parse multipliers. 'u' and 'μ' (U+03BC) both alias 'µ' (U+00B5); 'R' is the
 *  resistor-notation decimal point handled separately in parseSI. */
const MULTIPLIER: Record<string, number> = {
  T: 1e12,
  G: 1e9,
  M: 1e6,
  k: 1e3,
  K: 1e3,
  '': 1,
  m: 1e-3,
  µ: 1e-6,
  μ: 1e-6,
  u: 1e-6,
  n: 1e-9,
  p: 1e-12,
  f: 1e-15,
}

/**
 * Format a value with an SI prefix: formatSI(4700, 'Ω') -> "4.7 kΩ".
 * `digits` is significant digits, not decimals, so small and large values
 * both stay readable.
 */
export function formatSI(value: number, unit = '', digits = 3): string {
  if (Number.isNaN(value)) return 'n/a'
  if (!Number.isFinite(value)) return value > 0 ? '∞' : '-∞'
  if (value === 0) return `0 ${unit}`.trim()

  const abs = Math.abs(value)
  // Pick the prefix that puts the mantissa in [1, 1000).
  const chosen =
    PREFIXES.find((p) => abs >= Math.pow(10, p.exp)) ?? PREFIXES[PREFIXES.length - 1]
  const mantissa = value / Math.pow(10, chosen.exp)

  // toPrecision then strip trailing zeros: 4.70 -> 4.7, 100.0 -> 100
  let text = mantissa.toPrecision(digits)
  if (text.includes('e')) text = String(Number(text))
  else if (text.includes('.')) text = text.replace(/\.?0+$/, '')

  return `${text} ${chosen.sym}${unit}`.trim()
}

/**
 * Parse human input into base SI. Accepts "4.7k", "100n", "1M2" (EIA style),
 * "4R7", "2.2 uF", "-3.5m". Returns NaN when unparseable so callers can reject.
 */
export function parseSI(input: string): number {
  const text = input.trim().replace(/\s+/g, '')
  if (!text) return NaN

  // EIA/RKM notation: digit-prefix-digit, e.g. 4k7, 1M2, 4R7, 2R2
  const rkm = /^(-?\d+)([TGMkKmµμunpfR])(\d+)$/.exec(text)
  if (rkm) {
    const [, whole, sym, frac] = rkm
    const mult = sym === 'R' ? 1 : MULTIPLIER[sym]
    if (mult === undefined) return NaN
    const sign = whole.startsWith('-') ? -1 : 1
    const magnitude = Math.abs(Number(whole)) + Number(`0.${frac}`)
    return sign * magnitude * mult
  }

  const plain = /^(-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)([TGMkKmµμunpf]?)/.exec(text)
  if (!plain) return NaN
  const [, num, sym] = plain
  const mult = MULTIPLIER[sym]
  if (mult === undefined) return NaN
  return Number(num) * mult
}

/** Clamp helper used by every parameter control. */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

/** Linear ratio -> decibels (20·log10 for amplitude quantities). */
export function toDb(ratio: number): number {
  return 20 * Math.log10(ratio)
}
