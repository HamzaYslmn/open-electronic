import { sym } from '../i18n'
import type { Key } from '../i18n'
/**
 * Analogue front ends that end at the ESP32 ADC: the converter itself, NTC
 * thermistors and current shunts. All three share the same quantisation and
 * divider maths, so it lives here once.
 *
 * Base SI: volts, amps, ohms, kelvin, watts.
 */

import { ADC_BITS, T_AMBIENT_K, VCC } from './constants'

export const KELVIN_OFFSET = 273.15
export const toKelvin = (c: number) => c + KELVIN_OFFSET
export const toCelsius = (k: number) => k - KELVIN_OFFSET

// ---------------------------------------------------------------------------
// The ADC
// ---------------------------------------------------------------------------

export type Attenuation = '0' | '2.5' | '6' | '11'

export type AttenSpec = {
  label: Key
  /** Nominal full-scale input, V. */
  fullScale: number
  /** Range the datasheet actually guarantees as linear, V. */
  usableLow: number
  usableHigh: number
}

/** ESP32 ADC attenuation settings, from the datasheet's recommended ranges. */
export const ATTENUATIONS: Record<Attenuation, AttenSpec> = {
  '0': { label: 'opt.0Db', fullScale: 1.1, usableLow: 0.1, usableHigh: 0.95 },
  '2.5': { label: 'opt.25Db', fullScale: 1.5, usableLow: 0.1, usableHigh: 1.25 },
  '6': { label: 'opt.6Db', fullScale: 2.2, usableLow: 0.15, usableHigh: 1.75 },
  '11': { label: 'opt.11Db', fullScale: 3.9, usableLow: 0.15, usableHigh: 3.1 },
}

export const ATTENUATION_OPTIONS = (Object.keys(ATTENUATIONS) as Attenuation[]).map(
  (value) => ({ value, label: ATTENUATIONS[value].label }),
)

/** Volts per least significant bit. */
export function lsb(fullScale: number, bits = ADC_BITS): number {
  return fullScale / Math.pow(2, bits)
}

/** Raw count for an input voltage, clipped to the converter's range. */
export function adcCount(v: number, fullScale: number, bits = ADC_BITS): number {
  const max = Math.pow(2, bits) - 1
  return Math.min(max, Math.max(0, Math.round((v / fullScale) * Math.pow(2, bits))))
}

/** Two-resistor divider ratio, Vout/Vin = R2/(R1+R2). */
export function dividerRatio(r1: number, r2: number): number {
  return r1 + r2 > 0 ? r2 / (r1 + r2) : 0
}

export type AdcReadout = {
  spec: AttenSpec
  lsbVolts: number
  /** Divider output at the top of the battery range, V. */
  vAdcMax: number
  /** Divider output at the bottom, V. */
  vAdcMin: number
  count: number
  /** Volts per LSB referred back to the battery, i.e. the real resolution. */
  batteryResolution: number
  /** Continuous current the divider wastes at the top of the range, A. */
  drain: number
  /** Battery capacity the divider alone consumes in a day, coulombs. */
  dailyDrain: number
  /** Divider source impedance seen by the ADC, ohms. */
  sourceImpedance: number
  overRange: boolean
  underRange: boolean
  /** Source impedance too high for the sample-and-hold to settle. */
  tooStiff: boolean
}

/** Recommended maximum source impedance for the ESP32 ADC input. */
export const ADC_MAX_SOURCE_Z = 10_000

export function analyseAdc(
  atten: Attenuation,
  r1: number,
  r2: number,
  vBatMax: number,
  vBatMin: number,
): AdcReadout {
  const spec = ATTENUATIONS[atten]
  const ratio = dividerRatio(r1, r2)
  const vAdcMax = vBatMax * ratio
  const vAdcMin = vBatMin * ratio
  const step = lsb(spec.fullScale)
  const sourceZ = r1 + r2 > 0 ? (r1 * r2) / (r1 + r2) : 0
  const drain = r1 + r2 > 0 ? vBatMax / (r1 + r2) : Infinity
  return {
    spec,
    lsbVolts: step,
    vAdcMax,
    vAdcMin,
    count: adcCount(vAdcMax, spec.fullScale),
    batteryResolution: ratio > 0 ? step / ratio : Infinity,
    drain,
    dailyDrain: drain * 86400,
    sourceImpedance: sourceZ,
    overRange: vAdcMax > spec.usableHigh,
    underRange: vAdcMin < spec.usableLow,
    tooStiff: sourceZ > ADC_MAX_SOURCE_Z,
  }
}

// ---------------------------------------------------------------------------
// NTC thermistors
// ---------------------------------------------------------------------------

/**
 * Beta equation: 1/T = 1/T0 + ln(R/R0)/B.
 * Accurate to about half a kelvin over a 50 K span around T0, which is why
 * datasheets quote different B values for different intervals.
 */
export function ntcResistance(r0: number, b: number, t0: number, tempK: number): number {
  if (!(tempK > 0) || !(t0 > 0)) return NaN
  return r0 * Math.exp(b * (1 / tempK - 1 / t0))
}

/** The inverse: temperature from a measured resistance. */
export function ntcTemperature(r0: number, b: number, t0: number, r: number): number {
  if (!(r > 0) || !(r0 > 0)) return NaN
  return 1 / (1 / t0 + Math.log(r / r0) / b)
}

/**
 * Steinhart-Hart, the three-term fit: 1/T = A + B*ln(R) + C*ln(R)^3.
 * Good to a few millikelvin over a wide span, at the cost of needing three
 * calibration points rather than one.
 */
export function steinhartTemperature(a: number, b: number, c: number, r: number): number {
  if (!(r > 0)) return NaN
  const ln = Math.log(r)
  return 1 / (a + b * ln + c * ln * ln * ln)
}

export type NtcReadout = {
  /** Thermistor resistance at the working temperature, ohms. */
  resistance: number
  /** Divider output, V. */
  vOut: number
  /** Sensitivity at this temperature, V/K. Negative for the usual topology. */
  sensitivity: number
  /** Same in ADC counts per kelvin, which is what actually limits resolution. */
  countsPerK: number
  /** Smallest temperature step the ADC can distinguish, K. */
  resolutionK: number
  /** Power the thermistor dissipates, W, and the error it causes, K. */
  selfHeatW: number
  selfHeatK: number
  /** Divider current, A. */
  current: number
  /** Self heating is large enough to matter. */
  selfHeatSignificant: boolean
}

/**
 * NTC in the low leg by default, i.e. Vout = Vcc*Rntc/(Rseries+Rntc), so the
 * output falls as it warms.
 */
export function analyseNtc(
  r0: number,
  b: number,
  t0: number,
  tempK: number,
  rSeries: number,
  dissipationConstant: number,
  vcc = VCC,
  fullScale = ATTENUATIONS['11'].fullScale,
): NtcReadout {
  const r = ntcResistance(r0, b, t0, tempK)
  const vOut = vcc * dividerRatio(rSeries, r)
  const current = rSeries + r > 0 ? vcc / (rSeries + r) : 0
  const selfHeatW = current * current * r
  // dV/dT from the chain rule: dR/dT = -R*B/T^2, and dV/dR of the divider.
  const dRdT = (-r * b) / (tempK * tempK)
  const dVdR = (vcc * rSeries) / Math.pow(rSeries + r, 2)
  const sensitivity = dVdR * dRdT
  const step = lsb(fullScale)
  const countsPerK = Math.abs(sensitivity) / step
  return {
    resistance: r,
    vOut,
    sensitivity,
    countsPerK,
    resolutionK: countsPerK > 0 ? 1 / countsPerK : Infinity,
    selfHeatW,
    selfHeatK: dissipationConstant > 0 ? selfHeatW / dissipationConstant : Infinity,
    current,
    selfHeatSignificant:
      dissipationConstant > 0 && selfHeatW / dissipationConstant > 0.5,
  }
}

// ---------------------------------------------------------------------------
// Current sensing
// ---------------------------------------------------------------------------

export type SenseMethod = 'shunt' | 'acs712-5' | 'acs712-20' | 'acs712-30' | 'ina219'

export type SenseSpec = {
  label: Key
  /** Volts out per amp in. Zero means the shunt path computes it. */
  sensitivity: number
  /** Full scale current the part supports, A. */
  range: number
  /** Quiescent output with no current, V. Bidirectional parts sit mid-rail. */
  offset: number
}

export const SENSE_METHODS: Record<SenseMethod, SenseSpec> = {
  shunt: { label: 'opt.shuntAmplifier', sensitivity: 0, range: Infinity, offset: 0 },
  'acs712-5': { label: sym('ACS712 5 A'), sensitivity: 0.185, range: 5, offset: VCC / 2 },
  'acs712-20': { label: sym('ACS712 20 A'), sensitivity: 0.1, range: 20, offset: VCC / 2 },
  'acs712-30': { label: sym('ACS712 30 A'), sensitivity: 0.066, range: 30, offset: VCC / 2 },
  ina219: { label: 'opt.ina219Digital', sensitivity: 0, range: Infinity, offset: 0 },
}

export const SENSE_OPTIONS = (Object.keys(SENSE_METHODS) as SenseMethod[]).map((value) => ({
  value,
  label: SENSE_METHODS[value].label,
}))

export type CurrentSenseReadout = {
  /** Voltage developed across the shunt, V. */
  vShunt: number
  /** Power burned in the shunt, W. */
  pShunt: number
  /** Amplified output presented to the ADC, V. */
  vOut: number
  /** Resolution referred to the input, A per LSB. */
  resolution: number
  /** Fraction of the ADC range actually used. */
  rangeUsed: number
  /** Shunt burden as a fraction of the supply it sits in. */
  burdenFraction: number
  clipping: boolean
  wastefulShunt: boolean
  underusingRange: boolean
}

export function analyseCurrentSense(
  method: SenseMethod,
  current: number,
  rShunt: number,
  gain: number,
  supply: number,
  fullScale: number,
): CurrentSenseReadout {
  const spec = SENSE_METHODS[method]
  const isShunt = spec.sensitivity === 0
  const vShunt = isShunt ? current * rShunt : 0
  const vOut = isShunt ? vShunt * gain : spec.offset + current * spec.sensitivity
  const step = lsb(fullScale)
  // Referred to input: one LSB at the output divided by the volts-per-amp.
  const voltsPerAmp = isShunt ? rShunt * gain : spec.sensitivity
  return {
    vShunt,
    pShunt: current * current * rShunt * (isShunt ? 1 : 0),
    vOut,
    resolution: voltsPerAmp > 0 ? step / voltsPerAmp : Infinity,
    rangeUsed: fullScale > 0 ? vOut / fullScale : 0,
    burdenFraction: supply > 0 ? vShunt / supply : 0,
    clipping: vOut > fullScale,
    wastefulShunt: isShunt && current * current * rShunt > 0.25,
    underusingRange: fullScale > 0 && vOut < fullScale * 0.25,
  }
}

/** Room temperature in kelvin, re-exported so pages need one import. */
export const T_ROOM_K = T_AMBIENT_K
