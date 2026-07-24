import type { Key } from '../i18n'
/**
 * Battery pack discharge under a constant load.
 *
 * Three pieces of real, published physics stacked together:
 *
 *  1. Open-circuit voltage against depth of discharge, from the Shepherd-derived
 *     model in Tremblay & Dessaint, "Experimental Validation of a Battery Dynamic
 *     Model for EV Applications", World Electric Vehicle Journal Vol 3 (2009).
 *     This is the same generic battery block Simulink ships. Its parameters are
 *     extracted from three points a datasheet always gives: the full voltage, the
 *     end of the exponential zone, and the end of the nominal (flat) zone.
 *  2. Terminal voltage V = EMF - I*Rint, i.e. the ohmic sag.
 *  3. Peukert's law, t = H*(C/(I*H))^k, for the capacity a cell actually gives up
 *     at a discharge rate other than the one it was rated at.
 *
 * Everything is base SI: volts, amps, ohms, seconds, coulombs, watts, joules.
 * Capacity is coulombs, not amp-hours, and Peukert's rated time is seconds, not
 * hours. Ah and Wh exist only at the display edge.
 *
 * The discharge march is done in CHARGE space, not time space. Charge removed is
 * the independent variable and always advances by a fixed increment, so the time
 * for each step falls out as dt = dq/I. There is no time integrator to go
 * unstable when the load is heavy and the current is climbing into the knee,
 * which is exactly where a forward-Euler coulomb counter blows up. The uniform
 * time grid the scope wants is produced afterwards by interpolating that table.
 */

/** Coulombs in one amp-hour. Display-edge conversion only. */
export const COULOMBS_PER_AH = 3600

/** Seconds in one hour. Peukert's rated time is quoted in hours on datasheets. */
export const SECONDS_PER_HOUR = 3600

/** Joules in one watt-hour. */
export const JOULES_PER_WH = 3600

export type Chemistry = 'lipo' | 'liion' | 'nimh' | 'lifepo4' | 'lead'

export type ChemistrySpec = {
  label: Key
  /** Marketing nominal voltage per cell, the number on the label. */
  nominal: number
  /** Fully charged open-circuit voltage per cell. */
  full: number
  /** Discharge cutoff per cell. Below this the model, and the cell, are done. */
  cutoff: number
  /** Open-circuit voltage at the end of the exponential zone. */
  vExp: number
  /** Depth of discharge, 0..1, where the exponential zone ends. */
  sExp: number
  /** Open-circuit voltage at the end of the flat nominal zone. */
  vNom: number
  /** Depth of discharge, 0..1, where the nominal zone ends and the knee starts. */
  sNom: number
  /** Peukert exponent. 1.0 is a perfect cell, lead acid is the worst offender. */
  peukert: number
  /** Rate the capacity is quoted at, in seconds. Lead acid is C/20, cells are C/5. */
  ratedSeconds: number
  /** Typical internal resistance of one cell, ohms. Default only, the user overrides. */
  cellResistance: number
  /** Continuous discharge the datasheet allows, as a multiple of capacity (C rate). */
  maxCRate: number
}

/**
 * Per-cell parameters. Voltages are typical datasheet figures for a healthy cell
 * at room temperature. Peukert exponents are the usual published ranges: about
 * 1.05 for lithium chemistries, 1.1 for NiMH, and 1.2 to 1.3 for lead acid
 * (1.25 is the classic flooded figure).
 *
 * The slope of the flat part of the curve is set entirely by vExp - vNom, since
 * the extraction below reduces to K = (vExp - vNom)*(1-sNom)/sNom. LiFePO4 gets
 * a small gap and a genuine plateau; lead acid gets a wide one because its
 * open-circuit voltage really does slide from 2.12 V to about 1.95 V a cell,
 * which is why a lead acid state-of-charge gauge can just read voltage.
 */
export const CHEMISTRIES: Record<Chemistry, ChemistrySpec> = {
  lipo: {
    label: 'opt.lipoPouch',
    nominal: 3.7,
    full: 4.2,
    cutoff: 3.0,
    vExp: 3.95,
    sExp: 0.08,
    vNom: 3.7,
    sNom: 0.85,
    peukert: 1.05,
    ratedSeconds: 5 * SECONDS_PER_HOUR,
    cellResistance: 0.05,
    maxCRate: 5,
  },
  liion: {
    label: 'opt.liIon18650',
    nominal: 3.6,
    full: 4.2,
    cutoff: 2.5,
    vExp: 3.9,
    sExp: 0.1,
    vNom: 3.6,
    sNom: 0.85,
    peukert: 1.05,
    ratedSeconds: 5 * SECONDS_PER_HOUR,
    cellResistance: 0.07,
    maxCRate: 2,
  },
  nimh: {
    label: 'opt.nimh',
    nominal: 1.2,
    full: 1.4,
    cutoff: 1.0,
    vExp: 1.28,
    sExp: 0.05,
    vNom: 1.22,
    sNom: 0.85,
    peukert: 1.1,
    ratedSeconds: 5 * SECONDS_PER_HOUR,
    cellResistance: 0.04,
    maxCRate: 2,
  },
  lifepo4: {
    label: 'opt.lifepo4',
    nominal: 3.2,
    full: 3.65,
    cutoff: 2.5,
    // The surface charge falls away fast, then the plateau moves 80 mV across
    // 85% of the pack. That flatness is why LiFePO4 needs coulomb counting
    // rather than a voltage gauge.
    vExp: 3.33,
    sExp: 0.05,
    vNom: 3.25,
    sNom: 0.9,
    peukert: 1.05,
    ratedSeconds: 5 * SECONDS_PER_HOUR,
    cellResistance: 0.03,
    maxCRate: 3,
  },
  lead: {
    label: 'opt.leadAcidSla',
    nominal: 2.0,
    full: 2.12,
    cutoff: 1.75,
    vExp: 2.1,
    sExp: 0.05,
    vNom: 1.95,
    sNom: 0.85,
    peukert: 1.25,
    // Lead acid capacity is quoted at the 20 hour rate, which is why an SLA
    // gives so much less than its label at any current an ESP32 project draws.
    ratedSeconds: 20 * SECONDS_PER_HOUR,
    cellResistance: 0.025,
    maxCRate: 0.5,
  },
}

export const CHEMISTRY_OPTIONS = (Object.keys(CHEMISTRIES) as Chemistry[]).map((value) => ({
  value,
  label: CHEMISTRIES[value].label,
}))

/** Load the pack is discharged into. */
export type LoadMode = 'current' | 'resistance' | 'power'

/**
 * Tremblay OCV coefficients, re-parameterised on fractional depth of discharge s
 * so they do not have to be re-derived every time Peukert changes the usable
 * capacity. E(s) = E0 - K/(1-s) + A*exp(-b*s).
 */
export type OcvCoefficients = { e0: number; k: number; a: number; b: number }

/**
 * Extract the OCV coefficients from the three datasheet points.
 *
 * Tremblay's procedure, with charge normalised to capacity (s = it/Q):
 *   A  = Vfull - Vexp
 *   b  = 3/sExp                 (three time constants, so the exponential zone
 *                                has decayed to ~5% by sExp)
 *   K  = (Vfull - Vnom - A*(1 - e^(-b*sNom))) * (1 - sNom)/sNom
 *   E0 = Vfull + K - A          (from E(0) = Vfull)
 */
export function ocvCoefficients(spec: ChemistrySpec): OcvCoefficients {
  const a = spec.full - spec.vExp
  const b = spec.sExp > 0 ? 3 / spec.sExp : Infinity
  const decay = Number.isFinite(b) ? Math.exp(-b * spec.sNom) : 0
  const k = ((spec.full - spec.vNom - a * (1 - decay)) * (1 - spec.sNom)) / spec.sNom
  return { e0: spec.full + k - a, k, a, b }
}

/**
 * Open-circuit voltage of one cell at fractional depth of discharge s.
 * The K/(1-s) term is what produces the knee: it runs away as the cell empties,
 * which is why the curve falls off a cliff instead of sloping to zero.
 */
export function cellOcv(co: OcvCoefficients, s: number): number {
  // Hold s just short of 1: at s = 1 the polarisation term is a pole, and the
  // cell is far past cutoff long before it gets there anyway.
  const sc = s < 0 ? 0 : s > 0.999 ? 0.999 : s
  return co.e0 - co.k / (1 - sc) + co.a * Math.exp(-co.b * sc)
}

/**
 * Fractional depth at which the unloaded cell reaches its cutoff voltage.
 *
 * Rated capacity is defined as the charge a cell gives up between full and
 * cutoff, so the model's own cutoff crossing has to be the point where the rated
 * capacity is spent. Solve E0 - K/(1-s) = Vcut for s; the exponential term is
 * below 1e-12 anywhere near the knee (b is 30 or more), so it drops out.
 * Anything the pack loses before this point is sag or Peukert, which is the
 * whole subject of the page, rather than an artefact of the curve fit.
 */
export function cutoffDepth(co: OcvCoefficients, cutoff: number): number {
  const headroom = co.e0 - cutoff
  if (!(headroom > 0)) return 0
  const s = 1 - co.k / headroom
  return s < 0 ? 0 : s > 0.999 ? 0.999 : s
}

export type Pack = {
  chemistry: Chemistry
  /** Cells in series. Sets pack voltage. */
  series: number
  /** Strings in parallel. Sets pack capacity and divides pack resistance. */
  parallel: number
  /** Rated capacity of one cell, coulombs. */
  cellCapacity: number
  /** Internal resistance of one cell, ohms. */
  cellResistance: number
}

/** Pack rated capacity, coulombs. Parallel strings add capacity. */
export function packCapacity(pack: Pack): number {
  return pack.cellCapacity * pack.parallel
}

/** Pack internal resistance, ohms. Series adds, parallel divides. */
export function packResistance(pack: Pack): number {
  return pack.parallel > 0 ? (pack.cellResistance * pack.series) / pack.parallel : Infinity
}

/** Pack cutoff and nominal voltages, i.e. the per-cell figures times the string. */
export function packCutoff(pack: Pack): number {
  return CHEMISTRIES[pack.chemistry].cutoff * pack.series
}
export function packNominal(pack: Pack): number {
  return CHEMISTRIES[pack.chemistry].nominal * pack.series
}

/**
 * Peukert overestimates badly below the rated rate: at a low enough current the
 * law predicts capacity a cell simply does not have, because self discharge and
 * the fixed cutoff take over. Cap the bonus rather than print a fantasy runtime.
 */
export const PEUKERT_MAX_GAIN = 1.3

/**
 * Capacity actually available at a steady current, coulombs.
 *
 * Peukert: t = H*(C/(I*H))^k, so the charge delivered is
 *   Ceff = I*t = C*(C/(I*H))^(k-1).
 * At I = C/H (the rated rate) the bracket is 1 and Ceff = C, as it must be.
 */
export function effectiveCapacity(
  rated: number,
  current: number,
  ratedSeconds: number,
  peukert: number,
): number {
  if (!(current > 0) || !(rated > 0) || !(ratedSeconds > 0)) return rated
  const ratio = rated / (current * ratedSeconds)
  const eff = rated * Math.pow(ratio, peukert - 1)
  return Math.min(eff, rated * PEUKERT_MAX_GAIN)
}

/** Peukert runtime in seconds at a steady current, straight from t = H*(C/(I*H))^k. */
export function peukertRuntime(
  rated: number,
  current: number,
  ratedSeconds: number,
  peukert: number,
): number {
  if (!(current > 0)) return Infinity
  return effectiveCapacity(rated, current, ratedSeconds, peukert) / current
}

export type LoadSpec = { mode: LoadMode; value: number }

/**
 * Current drawn at a given open-circuit voltage, solved with the sag included.
 *
 *  current mode:    I is the setting.
 *  resistance mode: I = OCV/(R + Rint), the pack is a source behind Rint.
 *  power mode:      V*I = P with V = OCV - I*Rint gives Rint*I^2 - OCV*I + P = 0.
 *                   Take the low-current root, the one a real supply settles on.
 *                   The discriminant goes negative past P = OCV^2/(4*Rint),
 *                   which is the maximum power transfer limit: no load can pull
 *                   more than that out of this pack, at any voltage.
 */
export function solveCurrent(load: LoadSpec, ocv: number, rint: number): number {
  if (load.mode === 'current') return load.value
  if (load.mode === 'resistance') {
    const total = load.value + rint
    return total > 0 ? ocv / total : Infinity
  }
  if (!(load.value > 0)) return 0
  if (rint <= 0) return ocv > 0 ? load.value / ocv : Infinity
  const disc = ocv * ocv - 4 * rint * load.value
  // NaN here means the load is unreachable; callers must flag it, not print it.
  if (disc < 0) return NaN
  return (ocv - Math.sqrt(disc)) / (2 * rint)
}

/** Largest power this pack can deliver at a given OCV, P = OCV^2/(4*Rint). */
export function maxPower(ocv: number, rint: number): number {
  return rint > 0 ? (ocv * ocv) / (4 * rint) : Infinity
}

export type DischargeResult = {
  /** Seconds per sample of the resampled traces. */
  dt: number
  /** Terminal voltage against uniform time, volts. */
  terminal: Float64Array
  /** Open-circuit voltage against the same time base, volts. The sag is the gap. */
  ocv: Float64Array
  /** Load current against the same time base, amps. */
  current: Float64Array
  /** Time from full to cutoff, seconds. */
  runtime: number
  /** Charge actually delivered before cutoff, coulombs. */
  delivered: number
  /** Energy delivered to the load, joules. */
  energy: number
  /** Energy burned inside the pack in Rint, joules. */
  lossJoules: number
  /** Capacity Peukert says is available at this rate, coulombs. */
  usableCapacity: number
  /** Mean load current over the run, amps. */
  meanCurrent: number
  /** Terminal voltage at t = 0, volts. */
  startVoltage: number
  /** Terminal voltage at cutoff, volts. */
  endVoltage: number
  /** Lowest terminal voltage seen, volts. */
  minVoltage: number
  /** Largest OCV minus terminal gap over the run, volts. */
  maxSag: number
  /** True when the load asked for more power than the pack can ever deliver. */
  overPower: boolean
  /** True when Peukert's low-rate bonus hit PEUKERT_MAX_GAIN. */
  peukertCapped: boolean
}

/** Steps of the charge-space march. Independent of the scope sample count. */
const MARCH_STEPS = 2048

/** Fixed-point passes to settle Peukert against the mean current it produces. */
const PEUKERT_PASSES = 4

/**
 * Discharge the pack into the load and return traces on a uniform time base.
 *
 * Peukert needs a current before it can give a capacity, and a varying load
 * (resistance or power mode) does not have one until the run is over. So the
 * march is repeated a few times, each pass feeding the previous pass's mean
 * current back into the capacity. It converges immediately because the exponent
 * is k-1, i.e. 0.05 to 0.25, so the capacity barely moves between passes.
 */
export function discharge(pack: Pack, load: LoadSpec, n: number): DischargeResult {
  const spec = CHEMISTRIES[pack.chemistry]
  const co = ocvCoefficients(spec)
  const rated = packCapacity(pack)
  const rint = packResistance(pack)
  const cutoff = packCutoff(pack)

  // Seed the iteration with the current at a full pack.
  const fullOcv = spec.full * pack.series
  let guess = solveCurrent(load, fullOcv, rint)
  if (!Number.isFinite(guess) || guess <= 0) guess = rated / spec.ratedSeconds

  let march = marchOnce(co, pack, load, rint, cutoff, spec, guess, rated)
  for (let pass = 1; pass < PEUKERT_PASSES; pass++) {
    if (!(march.meanCurrent > 0)) break
    march = marchOnce(co, pack, load, rint, cutoff, spec, march.meanCurrent, rated)
  }

  const grid = resample(march, n)
  return {
    dt: grid.dt,
    terminal: grid.terminal,
    ocv: grid.ocv,
    current: grid.current,
    runtime: march.runtime,
    delivered: march.delivered,
    energy: march.energy,
    lossJoules: march.lossJoules,
    usableCapacity: march.usableCapacity,
    meanCurrent: march.meanCurrent,
    startVoltage: march.startVoltage,
    endVoltage: march.endVoltage,
    minVoltage: march.minVoltage,
    maxSag: march.maxSag,
    overPower: march.overPower,
    peukertCapped: march.peukertCapped,
  }
}

type March = {
  t: number[]
  v: number[]
  e: number[]
  i: number[]
  runtime: number
  delivered: number
  energy: number
  lossJoules: number
  usableCapacity: number
  meanCurrent: number
  startVoltage: number
  endVoltage: number
  minVoltage: number
  maxSag: number
  overPower: boolean
  peukertCapped: boolean
}

/**
 * One pass of the charge-space march at a fixed Peukert current assumption.
 *
 * Totals are snapshotted at each accepted sample rather than after the step, so
 * runtime, charge and energy all describe the same instant. Without that the
 * mean current would be biased by the last half-open interval.
 */
function marchOnce(
  co: OcvCoefficients,
  pack: Pack,
  load: LoadSpec,
  rint: number,
  cutoff: number,
  spec: ChemistrySpec,
  assumedCurrent: number,
  rated: number,
): March {
  const usable = effectiveCapacity(rated, assumedCurrent, spec.ratedSeconds, spec.peukert)
  const peukertCapped = spec.peukert > 1 && usable >= rated * PEUKERT_MAX_GAIN - 1e-12
  const dq = usable / MARCH_STEPS
  // Spending the whole usable capacity walks the curve exactly to its cutoff.
  const sCut = cutoffDepth(co, spec.cutoff)

  const t: number[] = []
  const v: number[] = []
  const e: number[] = []
  const i: number[] = []

  let time = 0
  let charge = 0
  let joules = 0
  let ohmic = 0
  let runtime = 0
  let delivered = 0
  let energy = 0
  let lossJoules = 0
  let minV = Infinity
  let maxSag = 0
  let overPower = false
  let startVoltage = 0

  for (let step = 0; step <= MARCH_STEPS; step++) {
    const s = (step / MARCH_STEPS) * sCut
    const ocv = cellOcv(co, s) * pack.series
    const current = solveCurrent(load, ocv, rint)

    // Past the maximum power transfer point there is no operating point at all.
    if (!Number.isFinite(current)) {
      overPower = true
      break
    }

    const terminal = ocv - current * rint
    if (step === 0) startVoltage = terminal
    if (terminal <= cutoff) break

    t.push(time)
    v.push(terminal)
    e.push(ocv)
    i.push(current)
    runtime = time
    delivered = charge
    energy = joules
    lossJoules = ohmic
    if (terminal < minV) minV = terminal
    if (ocv - terminal > maxSag) maxSag = ocv - terminal

    // No load means no discharge, and an unbounded runtime. Stop rather than
    // divide by zero and report a fake number.
    if (!(current > 0)) break

    // Exact quadrature in charge space: dt = dq/I, dE = V*dq, dLoss = I*Rint*dq.
    time += dq / current
    charge += dq
    joules += terminal * dq
    ohmic += current * rint * dq
  }

  return {
    t,
    v,
    e,
    i,
    runtime,
    delivered,
    energy,
    lossJoules,
    usableCapacity: usable,
    meanCurrent: runtime > 0 ? delivered / runtime : 0,
    startVoltage,
    endVoltage: v.length ? v[v.length - 1] : startVoltage,
    minVoltage: Number.isFinite(minV) ? minV : startVoltage,
    maxSag,
    overPower,
    peukertCapped,
  }
}

/**
 * Interpolate the charge-space table onto n evenly spaced times. The table is
 * monotone in time by construction, so a single forward cursor is enough.
 */
function resample(
  march: March,
  n: number,
): { dt: number; terminal: Float64Array; ocv: Float64Array; current: Float64Array } {
  const terminal = new Float64Array(n)
  const ocv = new Float64Array(n)
  const current = new Float64Array(n)
  const span = march.runtime
  const dt = span > 0 ? span / (n - 1) : 1

  if (march.t.length === 0) return { dt, terminal, ocv, current }
  if (march.t.length === 1 || span <= 0) {
    terminal.fill(march.v[0])
    ocv.fill(march.e[0])
    current.fill(march.i[0])
    return { dt, terminal, ocv, current }
  }

  let j = 0
  for (let k = 0; k < n; k++) {
    const time = k * dt
    while (j < march.t.length - 2 && march.t[j + 1] < time) j++
    const t0 = march.t[j]
    const t1 = march.t[j + 1]
    const f = t1 > t0 ? (time - t0) / (t1 - t0) : 0
    const g = f < 0 ? 0 : f > 1 ? 1 : f
    terminal[k] = march.v[j] + (march.v[j + 1] - march.v[j]) * g
    ocv[k] = march.e[j] + (march.e[j + 1] - march.e[j]) * g
    current[k] = march.i[j] + (march.i[j + 1] - march.i[j]) * g
  }
  return { dt, terminal, ocv, current }
}

export type BatteryReadout = DischargeResult & {
  /** Pack rated capacity, coulombs. */
  rated: number
  /** Pack internal resistance, ohms. */
  rint: number
  /** Pack cutoff voltage, volts. */
  cutoff: number
  /** Pack nominal (label) voltage, volts. */
  nominal: number
  /** Pack fully charged open-circuit voltage, volts. */
  fullVoltage: number
  /** Mean current as a multiple of rated capacity per hour, i.e. the C rate. */
  cRate: number
  /**
   * Usable capacity as a fraction of rated. Below 1 at rates above the rating,
   * above 1 below it: Peukert genuinely predicts a bonus at a trickle, which is
   * why PEUKERT_MAX_GAIN caps it.
   */
  capacityRatio: number
  /** Round trip efficiency of the pack itself, delivered / (delivered + Rint loss). */
  efficiency: number
  /** True when the mean current is past the datasheet continuous rating. */
  overCRate: boolean
  /** True when the pack never gets going: sagged to cutoff while still full. */
  deadOnArrival: boolean
}

/** Everything the battery page reports, derived once per parameter change. */
export function analyse(pack: Pack, load: LoadSpec, n: number): BatteryReadout {
  const spec = CHEMISTRIES[pack.chemistry]
  const result = discharge(pack, load, n)
  const rated = packCapacity(pack)
  // C rate is current divided by the capacity expressed per hour.
  const cRate = rated > 0 ? result.meanCurrent / (rated / SECONDS_PER_HOUR) : 0
  return {
    ...result,
    rated,
    rint: packResistance(pack),
    cutoff: packCutoff(pack),
    nominal: packNominal(pack),
    fullVoltage: spec.full * pack.series,
    cRate,
    capacityRatio: rated > 0 ? result.usableCapacity / rated : 0,
    efficiency:
      result.energy + result.lossJoules > 0
        ? result.energy / (result.energy + result.lossJoules)
        : 0,
    overCRate: cRate > spec.maxCRate,
    deadOnArrival: result.runtime <= 0,
  }
}
