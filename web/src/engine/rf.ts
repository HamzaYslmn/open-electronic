/**
 * RF geometry and link budgets, shared by the antenna and link-budget pages.
 * Both start from the same wavelength arithmetic.
 *
 * Base SI: metres, hertz, watts. Powers are also carried in dBm because that is
 * how every radio datasheet quotes them.
 */

/** Speed of light in vacuum, m/s (exact, by definition of the metre). */
export const C_LIGHT = 299792458

/** Wavelength in metres for a frequency in hertz. */
export function wavelength(frequency: number): number {
  return frequency > 0 ? C_LIGHT / frequency : Infinity
}

/**
 * Velocity factor: how much slower the wave travels in the conductor and its
 * surroundings than in free space. A bare wire is about 0.95, coax 0.66 to 0.85,
 * a trace on FR-4 nearer 0.5 because half the field is in the laminate.
 */
export const VELOCITY_FACTORS = [
  { value: 'wire', label: 'Bare wire, 0.95', vf: 0.95 },
  { value: 'coax', label: 'Coax dielectric, 0.66', vf: 0.66 },
  { value: 'pcb', label: 'PCB microstrip, 0.55', vf: 0.55 },
  { value: 'free', label: 'Free space, 1.00', vf: 1.0 },
] as const

export type BandPreset = { label: string; frequency: number }

export const BANDS: BandPreset[] = [
  { label: 'LoRa 433 MHz', frequency: 433e6 },
  { label: 'LoRa 868 MHz (EU)', frequency: 868e6 },
  { label: 'LoRa 915 MHz (US)', frequency: 915e6 },
  { label: 'GPS L1 1575 MHz', frequency: 1575.42e6 },
  { label: 'WiFi/BLE 2.4 GHz', frequency: 2450e6 },
  { label: 'WiFi 5 GHz', frequency: 5500e6 },
]

export type AntennaReadout = {
  lambda: number
  /** Physical element lengths after the velocity factor, metres. */
  quarterWave: number
  halfWave: number
  fullWave: number
  /** A 5/8 wave whip, common on handheld sets for its slightly higher gain. */
  fiveEighths: number
  /** Radius of a quarter-wave ground plane radial. */
  groundRadial: number
  /** Physical length of one full wave in free space, for reference. */
  freeSpaceQuarter: number
}

export function analyseAntenna(frequency: number, vf: number): AntennaReadout {
  const lambda = wavelength(frequency)
  const physical = lambda * vf
  return {
    lambda,
    quarterWave: physical / 4,
    halfWave: physical / 2,
    fullWave: physical,
    fiveEighths: physical * 0.625,
    groundRadial: physical / 4,
    freeSpaceQuarter: lambda / 4,
  }
}

// ---------------------------------------------------------------------------
// Link budget
// ---------------------------------------------------------------------------

/** Watts to dBm. */
export function wattsToDbm(w: number): number {
  return w > 0 ? 10 * Math.log10(w * 1000) : -Infinity
}

/** dBm to watts. */
export function dbmToWatts(dbm: number): number {
  return Math.pow(10, dbm / 10) / 1000
}

/**
 * Free space path loss in dB, in the form every RF text quotes it:
 *   FSPL = 20*log10(d_km) + 20*log10(f_MHz) + 32.44
 * The 32.44 folds in the unit conversion and the 4*pi/c constant.
 */
export function fspl(distance: number, frequency: number): number {
  if (!(distance > 0) || !(frequency > 0)) return 0
  const dKm = distance / 1000
  const fMHz = frequency / 1e6
  return 20 * Math.log10(dKm) + 20 * Math.log10(fMHz) + 32.44
}

/** Distance at which FSPL reaches a given loss, the inverse of fspl(). */
export function rangeForLoss(lossDb: number, frequency: number): number {
  if (!(frequency > 0)) return 0
  const fMHz = frequency / 1e6
  const dKm = Math.pow(10, (lossDb - 32.44 - 20 * Math.log10(fMHz)) / 20)
  return dKm * 1000
}

export type RadioPreset = {
  label: string
  /** Receiver sensitivity, dBm. */
  sensitivity: number
  /** Typical transmit power, dBm. */
  txPower: number
}

/** Sensitivities from the SX1276 and typical ESP32 WiFi datasheets. */
export const RADIOS: Record<string, RadioPreset> = {
  'lora-sf7': { label: 'LoRa SF7 125 kHz', sensitivity: -123, txPower: 14 },
  'lora-sf9': { label: 'LoRa SF9 125 kHz', sensitivity: -129, txPower: 14 },
  'lora-sf12': { label: 'LoRa SF12 125 kHz', sensitivity: -137, txPower: 14 },
  'wifi-11b': { label: 'WiFi 802.11b 1 Mbps', sensitivity: -98, txPower: 20 },
  'wifi-11n': { label: 'WiFi 802.11n MCS7', sensitivity: -72, txPower: 14 },
  ble: { label: 'BLE 1 Mbps', sensitivity: -97, txPower: 4 },
}

export const RADIO_OPTIONS = Object.entries(RADIOS).map(([value, r]) => ({
  value,
  label: r.label,
}))

/** Margin below which a link is not dependable in the real world. */
export const MARGIN_MIN_DB = 10

export type LinkReadout = {
  fsplDb: number
  /** Total loss including cables and connectors. */
  totalLossDb: number
  /** Received power, dBm. */
  prxDbm: number
  /** Power over the sensitivity floor, dB. */
  marginDb: number
  /** Range at which the margin reaches zero, metres. */
  maxRange: number
  /** Range that still leaves MARGIN_MIN_DB of headroom, metres. */
  reliableRange: number
  /** Effective radiated power, dBm and watts. */
  eirpDbm: number
  eirpW: number
  /** Received power in watts, for a sense of how tiny it is. */
  prxW: number
  linkFails: boolean
  marginal: boolean
}

export function analyseLink(
  txDbm: number,
  gainTx: number,
  gainRx: number,
  extraLossDb: number,
  distance: number,
  frequency: number,
  sensitivity: number,
): LinkReadout {
  const fsplDb = fspl(distance, frequency)
  const totalLossDb = fsplDb + extraLossDb
  const prxDbm = txDbm + gainTx + gainRx - totalLossDb
  const marginDb = prxDbm - sensitivity
  // Budget available for path loss alone, once the fixed terms are settled.
  const lossBudget = txDbm + gainTx + gainRx - extraLossDb - sensitivity
  return {
    fsplDb,
    totalLossDb,
    prxDbm,
    marginDb,
    maxRange: rangeForLoss(lossBudget, frequency),
    reliableRange: rangeForLoss(lossBudget - MARGIN_MIN_DB, frequency),
    eirpDbm: txDbm + gainTx,
    eirpW: dbmToWatts(txDbm + gainTx),
    prxW: dbmToWatts(prxDbm),
    linkFails: marginDb < 0,
    marginal: marginDb >= 0 && marginDb < MARGIN_MIN_DB,
  }
}
