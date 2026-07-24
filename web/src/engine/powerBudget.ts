/**
 * Energy budgets: duty-cycled battery life, solar sizing and LED strip supply.
 *
 * All three are averaging problems over a repeating cycle, and the solar page
 * consumes the deep-sleep result directly, so they share one module.
 *
 * Base SI internally: amps, volts, seconds, joules, metres.
 */

import { VCC_5V } from './constants'
import { RHO_COPPER_20C, circleArea, awgDiameter } from './conductor'

export const SECONDS_PER_HOUR = 3600
export const SECONDS_PER_DAY = 86400
export const COULOMBS_PER_AH = 3600
export const JOULES_PER_WH = 3600

/**
 * Real capacity is below the label: cells age, the cutoff is reached before
 * they are truly empty, and regulators are not perfect. 0.8 is the usual
 * planning figure and it is a knob because chemistry and duty change it.
 */
export const DEFAULT_DERATING = 0.8

export type DutyProfile = {
  /** Current while awake and working, A. */
  activeCurrent: number
  /** How long each wake lasts, s. */
  activeTime: number
  /** Current while in deep sleep, A. */
  sleepCurrent: number
  /** Sleep between wakes, s. */
  sleepTime: number
}

export type DeepSleepReadout = {
  period: number
  /** Duty cycle of the awake phase, 0..1. */
  duty: number
  /** Time-averaged current, A. */
  averageCurrent: number
  /** Charge one full cycle costs, coulombs. */
  chargePerCycle: number
  /** Energy one full cycle costs, joules. */
  energyPerCycle: number
  /** Runtime in seconds and days. */
  runtimeS: number
  runtimeDays: number
  /** Wakes the pack supports before it is flat. */
  cycles: number
  /** Fraction of the average current the sleep phase is responsible for. */
  sleepShare: number
  /** Daily consumption, Wh, which is what the solar page needs. */
  whPerDay: number
  /** Sleep current dominates, so shortening the wake will not help. */
  sleepDominated: boolean
}

/**
 * Average current over one wake/sleep cycle:
 *   Iavg = (Ion*ton + Isleep*tsleep) / (ton + tsleep)
 * Runtime then follows from the derated capacity.
 */
export function analyseDeepSleep(
  p: DutyProfile,
  capacityAh: number,
  packVoltage: number,
  derating = DEFAULT_DERATING,
): DeepSleepReadout {
  const period = p.activeTime + p.sleepTime
  const chargePerCycle = p.activeCurrent * p.activeTime + p.sleepCurrent * p.sleepTime
  const averageCurrent = period > 0 ? chargePerCycle / period : 0
  const usable = capacityAh * COULOMBS_PER_AH * derating
  const runtimeS = averageCurrent > 0 ? usable / averageCurrent : Infinity
  const sleepContribution = period > 0 ? (p.sleepCurrent * p.sleepTime) / period : 0
  return {
    period,
    duty: period > 0 ? p.activeTime / period : 0,
    averageCurrent,
    chargePerCycle,
    energyPerCycle: chargePerCycle * packVoltage,
    runtimeS,
    runtimeDays: runtimeS / SECONDS_PER_DAY,
    cycles: period > 0 ? runtimeS / period : Infinity,
    sleepShare: averageCurrent > 0 ? sleepContribution / averageCurrent : 0,
    whPerDay: (averageCurrent * packVoltage * SECONDS_PER_DAY) / JOULES_PER_WH,
    sleepDominated: averageCurrent > 0 && sleepContribution / averageCurrent > 0.5,
  }
}

// ---------------------------------------------------------------------------
// Solar and battery sizing
// ---------------------------------------------------------------------------

export type SolarReadout = {
  /** Panel watts needed to cover the daily load, W. */
  panelW: number
  /** Battery capacity for the requested autonomy, Ah at the pack voltage. */
  batteryAh: number
  /** Energy the panel actually harvests on an average day, Wh. */
  harvestWh: number
  /** Surplus or deficit over a day, Wh. */
  surplusWh: number
  /** Hours of panel output needed to replace one day's use. */
  rechargeHours: number
  /** Days to refill an empty battery from the surplus. */
  daysToRecharge: number
  /** Panel cannot keep up with the load, so the battery only ever drains. */
  deficit: boolean
}

/**
 * Size a panel and battery from a daily consumption figure.
 *
 * Peak sun hours is the standard trick: it folds a whole day's irradiance curve
 * into an equivalent number of hours at full rating, so panel output is simply
 * watts times peak sun hours. Losses cover the charge controller, wiring,
 * temperature derating and dirt.
 */
export function analyseSolar(
  whPerDay: number,
  peakSunHours: number,
  systemEfficiency: number,
  autonomyDays: number,
  depthOfDischarge: number,
  packVoltage: number,
  panelW: number,
): SolarReadout {
  const required =
    peakSunHours > 0 && systemEfficiency > 0
      ? whPerDay / (peakSunHours * systemEfficiency)
      : Infinity
  const harvestWh = panelW * peakSunHours * systemEfficiency
  const surplusWh = harvestWh - whPerDay
  const batteryWh =
    depthOfDischarge > 0 ? (whPerDay * autonomyDays) / depthOfDischarge : Infinity
  return {
    panelW: required,
    batteryAh: packVoltage > 0 ? batteryWh / packVoltage : Infinity,
    harvestWh,
    surplusWh,
    rechargeHours: panelW > 0 ? whPerDay / (panelW * systemEfficiency) : Infinity,
    daysToRecharge: surplusWh > 0 ? batteryWh / surplusWh : Infinity,
    deficit: surplusWh <= 0,
  }
}

// ---------------------------------------------------------------------------
// Addressable LED strips
// ---------------------------------------------------------------------------

/** A WS2812 draws about 20 mA per colour channel at full brightness. */
export const MA_PER_CHANNEL = 0.02
/** Quiescent draw of the controller in each package, even when dark. */
export const QUIESCENT_A = 0.001

export type StripReadout = {
  /** Worst case: every LED full white. */
  peakCurrent: number
  /** At the requested brightness and colour mix. */
  actualCurrent: number
  peakPower: number
  actualPower: number
  /** Resistance of the supply run, ohms. */
  feedResistance: number
  /**
   * Voltage lost by the far end. Current tapers along the strip as LEDs draw
   * their share, so the average current in the conductor is about half the
   * total, which halves the drop against a naive I*R estimate.
   */
  endDrop: number
  endVoltage: number
  /** Injection points needed to keep the drop inside the tolerance. */
  injectionPoints: number
  /** Supply current rating to recommend, with headroom. */
  recommendedSupplyA: number
  browningOut: boolean
}

export function analyseStrip(
  ledCount: number,
  brightness: number,
  channelsLit: number,
  ledsPerMetre: number,
  awg: number,
  supply = VCC_5V,
  dropTolerance = 0.2,
): StripReadout {
  const peakCurrent = ledCount * (3 * MA_PER_CHANNEL) + ledCount * QUIESCENT_A
  const actualCurrent =
    ledCount * channelsLit * MA_PER_CHANNEL * brightness + ledCount * QUIESCENT_A
  const length = ledsPerMetre > 0 ? ledCount / ledsPerMetre : 0
  const area = circleArea(awgDiameter(awg))
  // Both conductors, feed and return.
  const feedResistance = area > 0 ? (2 * RHO_COPPER_20C * length) / area : Infinity
  // Distributed load: the far end sees roughly half of what a lumped load would.
  const endDrop = (actualCurrent * feedResistance) / 2
  const allowed = supply * dropTolerance
  return {
    peakCurrent,
    actualCurrent,
    peakPower: peakCurrent * supply,
    actualPower: actualCurrent * supply,
    feedResistance,
    endDrop,
    endVoltage: supply - endDrop,
    injectionPoints: allowed > 0 ? Math.max(1, Math.ceil(endDrop / allowed)) : 1,
    recommendedSupplyA: peakCurrent * 1.25,
    browningOut: endDrop > allowed,
  }
}
