import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type { Key } from './i18n'

/**
 * Single source of truth for the whole app: routes, the home grid and the
 * roadmap all derive from this list. Adding a simulator means one engine
 * module, one page folder and one entry here.
 */

export const CATEGORIES = [
  'cat.filtersSignals',
  'cat.fundamentals',
  'cat.semiconductors',
  'cat.powerConversion',
  'cat.energyThermal',
  'cat.acPowerQuality',
  'cat.embeddedEsp32',
  'cat.sensorsMeasurement',
  'cat.pcbWiring',
] as const

export type Category = (typeof CATEGORIES)[number]

/**
 * One hue per category, applied as the --cat custom property on each section so
 * the catalogue is scannable by colour. Values sit in the same lightness band as
 * the Obsidian purple accent, so nothing shouts louder than anything else.
 */
export const CATEGORY_COLOR: Record<Category, string> = {
  'cat.filtersSignals': '#a882ff',
  'cat.fundamentals': '#56b6f7',
  'cat.semiconductors': '#4ade80',
  'cat.powerConversion': '#fbbf24',
  'cat.energyThermal': '#fb7185',
  'cat.acPowerQuality': '#f472b6',
  'cat.embeddedEsp32': '#38bdf8',
  'cat.sensorsMeasurement': '#a3e635',
  'cat.pcbWiring': '#fb923c',
}

export type Sim = {
  id: string
  title: Key
  blurb: Key
  category: Category
  status: 'ready' | 'planned'
  /** Headline formula, shown on the card so the maths is visible up front. */
  formula: string
  Component?: LazyExoticComponent<ComponentType>
}

export const SIMULATORS: Sim[] = [
  // ---------------- Filters & Signals ----------------
  {
    id: 'rc-filter',
    title: 'rc-filter.title',
    blurb: 'rc-filter.blurb',
    category: 'cat.filtersSignals',
    status: 'ready',
    formula: 'fc = 1 / (2·pi·R·C)',
    Component: lazy(() => import('./sims/rc-filter')),
  },
  {
    id: 'rl-filter',
    title: 'rl-filter.title',
    blurb: 'rl-filter.blurb',
    category: 'cat.filtersSignals',
    status: 'ready',
    formula: 'tau = L/R,  fc = R / (2·pi·L)',
    Component: lazy(() => import('./sims/rl-filter')),
  },
  {
    id: 'sallen-key',
    title: 'sallen-key.title',
    blurb: 'sallen-key.blurb',
    category: 'cat.filtersSignals',
    status: 'ready',
    formula: 'w0 = 1/sqrt(R1·R2·C1·C2)',
    Component: lazy(() => import('./sims/sallen-key')),
  },
  {
    id: 'rlc-resonance',
    title: 'rlc-resonance.title',
    blurb: 'rlc-resonance.blurb',
    category: 'cat.filtersSignals',
    status: 'ready',
    formula: 'f0 = 1/(2·pi·sqrt(LC)),  Q = (1/R)·sqrt(L/C)',
    Component: lazy(() => import('./sims/rlc-resonance')),
  },
  {
    id: 'harmonics',
    title: 'harmonics.title',
    blurb: 'harmonics.blurb',
    category: 'cat.filtersSignals',
    status: 'ready',
    formula: 'v(t) = sum Vn·sin(2·pi·n·f·t + phi_n)',
    Component: lazy(() => import('./sims/harmonics')),
  },
  {
    id: 'pwm-filter',
    title: 'pwm-filter.title',
    blurb: 'pwm-filter.blurb',
    category: 'cat.filtersSignals',
    status: 'ready',
    formula: 'Vripple ~= Vs·D·(1-D) / (f·tau)',
    Component: lazy(() => import('./sims/pwm-filter')),
  },

  // ---------------- Fundamentals ----------------
  {
    id: 'voltage-divider',
    title: 'voltage-divider.title',
    blurb: 'voltage-divider.blurb',
    category: 'cat.fundamentals',
    status: 'ready',
    formula: 'Vout = Vin·R2/(R1+R2)',
    Component: lazy(() => import('./sims/voltage-divider')),
  },
  {
    id: 'current-divider',
    title: 'current-divider.title',
    blurb: 'current-divider.blurb',
    category: 'cat.fundamentals',
    status: 'ready',
    formula: 'Ix = I·Gx / sum(G)',
    Component: lazy(() => import('./sims/current-divider')),
  },
  {
    id: 'e-series',
    title: 'e-series.title',
    blurb: 'e-series.blurb',
    category: 'cat.fundamentals',
    status: 'ready',
    formula: 'E96: 10^(n/96),  error = (Rstd-Rideal)/Rideal',
    Component: lazy(() => import('./sims/e-series')),
  },
  {
    id: 'capacitor',
    title: 'capacitor.title',
    blurb: 'capacitor.blurb',
    category: 'cat.fundamentals',
    status: 'ready',
    formula: 'E = 0.5·C·V^2,  v(t) = V(1 - e^(-t/RC))',
    Component: lazy(() => import('./sims/capacitor')),
  },
  {
    id: 'coil',
    title: 'coil.title',
    blurb: 'coil.blurb',
    category: 'cat.fundamentals',
    status: 'ready',
    formula: 'i(t) = (V/R)(1 - e^(-tR/L)),  E = 0.5·L·I^2',
    Component: lazy(() => import('./sims/coil')),
  },
  {
    id: 'led-resistor',
    title: 'led-resistor.title',
    blurb: 'led-resistor.blurb',
    category: 'cat.fundamentals',
    status: 'ready',
    formula: 'R = (Vs - Vf) / If',
    Component: lazy(() => import('./sims/led-resistor')),
  },
  {
    id: 'wheatstone',
    title: 'wheatstone.title',
    blurb: 'wheatstone.blurb',
    category: 'cat.fundamentals',
    status: 'ready',
    formula: 'Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))',
    Component: lazy(() => import('./sims/wheatstone')),
  },

  // ---------------- Semiconductors ----------------
  {
    id: 'bjt-switch',
    title: 'bjt-switch.title',
    blurb: 'bjt-switch.blurb',
    category: 'cat.semiconductors',
    status: 'ready',
    formula: 'IB = (Vin - VBE)/RB,  ODF = IB·hFE / IC',
    Component: lazy(() => import('./sims/bjt-switch')),
  },
  {
    id: 'mosfet-switch',
    title: 'mosfet-switch.title',
    blurb: 'mosfet-switch.blurb',
    category: 'cat.semiconductors',
    status: 'ready',
    formula: 'Pcond = I^2·RDS(on),  Psw = 0.5·V·I·(tr+tf)·f',
    Component: lazy(() => import('./sims/mosfet-switch')),
  },
  {
    id: 'op-amp',
    title: 'op-amp.title',
    blurb: 'op-amp.blurb',
    category: 'cat.semiconductors',
    status: 'ready',
    formula: 'Av(inv) = -Rf/Rin,  Av(non-inv) = 1 + Rf/Rg',
    Component: lazy(() => import('./sims/op-amp')),
  },
  {
    id: 'rectifier',
    title: 'rectifier.title',
    blurb: 'rectifier.blurb',
    category: 'cat.semiconductors',
    status: 'ready',
    formula: 'Vripple = Iload / (f·C)',
    Component: lazy(() => import('./sims/rectifier')),
  },
  {
    id: 'zener',
    title: 'zener.title',
    blurb: 'zener.blurb',
    category: 'cat.semiconductors',
    status: 'ready',
    formula: 'Rs = (Vin - Vz)/(Iz + IL)',
    Component: lazy(() => import('./sims/zener')),
  },
  {
    id: 'timer-555',
    title: 'timer-555.title',
    blurb: 'timer-555.blurb',
    category: 'cat.semiconductors',
    status: 'ready',
    formula: 'f = 1.44/((R1+2·R2)·C),  t = 1.1·R·C',
    Component: lazy(() => import('./sims/timer-555')),
  },

  // ---------------- Power Conversion ----------------
  {
    id: 'buck',
    title: 'buck.title',
    blurb: 'buck.blurb',
    category: 'cat.powerConversion',
    status: 'ready',
    formula: 'D = Vout/Vin,  dIL = Vout(1-D)/(f·L)',
    Component: lazy(() => import('./sims/buck')),
  },
  {
    id: 'boost',
    title: 'boost.title',
    blurb: 'boost.blurb',
    category: 'cat.powerConversion',
    status: 'ready',
    formula: 'D = 1 - Vin/Vout,  dIL = Vin·D/(f·L)',
    Component: lazy(() => import('./sims/boost')),
  },
  {
    id: 'buck-boost',
    title: 'buck-boost.title',
    blurb: 'buck-boost.blurb',
    category: 'cat.powerConversion',
    status: 'ready',
    formula: 'Vout = -Vin·D/(1-D)',
    Component: lazy(() => import('./sims/buck-boost')),
  },
  {
    id: 'motor-drive',
    title: 'motor-drive.title',
    blurb: 'motor-drive.blurb',
    category: 'cat.powerConversion',
    status: 'ready',
    formula: 'L·di/dt = V - i·R - ke·w',
    Component: lazy(() => import('./sims/motor-drive')),
  },
  {
    id: 'lm2596',
    title: 'lm2596.title',
    blurb: 'lm2596.blurb',
    category: 'cat.powerConversion',
    status: 'ready',
    formula: 'Vout = 1.23·(1 + R2/R1)',
    Component: lazy(() => import('./sims/lm2596')),
  },
  {
    id: 'lm317',
    title: 'lm317.title',
    blurb: 'lm317.blurb',
    category: 'cat.powerConversion',
    status: 'ready',
    formula: 'Vout = 1.25·(1 + R2/R1),  Pd = (Vin-Vout)·I',
    Component: lazy(() => import('./sims/lm317')),
  },
  {
    id: 'battery',
    title: 'battery.title',
    blurb: 'battery.blurb',
    category: 'cat.powerConversion',
    status: 'ready',
    formula: 'V = EMF - I·Rint,  t = H·(C/(I·H))^k',
    Component: lazy(() => import('./sims/battery')),
  },

  // ---------------- Energy & Thermal ----------------
  {
    id: 'photovoltaic',
    title: 'photovoltaic.title',
    blurb: 'photovoltaic.blurb',
    category: 'cat.energyThermal',
    status: 'ready',
    formula: 'I = Iph - I0·(e^(V/(n·Vt)) - 1) - (V+I·Rs)/Rsh',
    Component: lazy(() => import('./sims/photovoltaic')),
  },
  {
    id: 'resistive-heating',
    title: 'resistive-heating.title',
    blurb: 'resistive-heating.blurb',
    category: 'cat.energyThermal',
    status: 'ready',
    formula: 'R = rho·L/A,  P = V^2/R,  Q = m·c·dT',
    Component: lazy(() => import('./sims/resistive-heating')),
  },
  {
    id: 'heat-pump',
    title: 'heat-pump.title',
    blurb: 'heat-pump.blurb',
    category: 'cat.energyThermal',
    status: 'ready',
    formula: 'COP_carnot = Th/(Th-Tc),  COP = eta·COP_carnot',
    Component: lazy(() => import('./sims/heat-pump')),
  },
  {
    id: 'thermal-design',
    title: 'thermal-design.title',
    blurb: 'thermal-design.blurb',
    category: 'cat.energyThermal',
    status: 'ready',
    formula: 'Tj = Ta + P·(Rjc + Rcs + Rsa)',
    Component: lazy(() => import('./sims/thermal-design')),
  },

  // ---------------- AC & Power Quality ----------------
  {
    id: 'reactive-power',
    title: 'reactive-power.title',
    blurb: 'reactive-power.blurb',
    category: 'cat.acPowerQuality',
    status: 'ready',
    formula: 'S = V·I,  P = S·cos(phi),  Q = S·sin(phi)',
    Component: lazy(() => import('./sims/reactive-power')),
  },
  {
    id: 'ac-impedance',
    title: 'ac-impedance.title',
    blurb: 'ac-impedance.blurb',
    category: 'cat.acPowerQuality',
    status: 'ready',
    formula: 'ZL = j·w·L,  ZC = 1/(j·w·C)',
    Component: lazy(() => import('./sims/ac-impedance')),
  },
  {
    id: 'transformer',
    title: 'transformer.title',
    blurb: 'transformer.blurb',
    category: 'cat.acPowerQuality',
    status: 'ready',
    formula: 'Vs = Vp·Ns/Np,  Zref = (Np/Ns)^2·Zs',
    Component: lazy(() => import('./sims/transformer')),
  },

  // ---------------- Embedded / ESP32 ----------------
  {
    id: 'i2c-pullup',
    title: 'i2c-pullup.title',
    blurb: 'i2c-pullup.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'Rmax = tr/(0.8473·Cb),  Rmin = (Vcc-0.4)/3mA',
    Component: lazy(() => import('./sims/i2c-pullup')),
  },
  {
    id: 'level-shifter',
    title: 'level-shifter.title',
    blurb: 'level-shifter.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'VGS = Vcc_low - Vsignal,  tr = 0.8473·R·C',
    Component: lazy(() => import('./sims/level-shifter')),
  },
  {
    id: 'ledc-pwm',
    title: 'ledc-pwm.title',
    blurb: 'ledc-pwm.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'f_max = 80 MHz / 2^bits',
    Component: lazy(() => import('./sims/ledc-pwm')),
  },
  {
    id: 'servo-pwm',
    title: 'servo-pwm.title',
    blurb: 'servo-pwm.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'duty = (pulse_us/20000)·2^bits',
    Component: lazy(() => import('./sims/servo-pwm')),
  },
  {
    id: 'debounce',
    title: 'debounce.title',
    blurb: 'debounce.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 't = -tau·ln(1 - Vth/Vcc)',
    Component: lazy(() => import('./sims/debounce')),
  },
  {
    id: 'deep-sleep',
    title: 'deep-sleep.title',
    blurb: 'deep-sleep.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'Iavg = (Ion·ton + Isleep·tsleep)/T',
    Component: lazy(() => import('./sims/deep-sleep')),
  },
  {
    id: 'ws2812-power',
    title: 'ws2812-power.title',
    blurb: 'ws2812-power.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'I = n·60mA·brightness,  Vdrop = I·R_wire',
    Component: lazy(() => import('./sims/ws2812-power')),
  },
  {
    id: 'crystal-caps',
    title: 'crystal-caps.title',
    blurb: 'crystal-caps.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'C1 = C2 = 2·(CL - Cstray)',
    Component: lazy(() => import('./sims/crystal-caps')),
  },
  {
    id: 'esp32-adc',
    title: 'esp32-adc.title',
    blurb: 'esp32-adc.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'LSB = Vfs/4096,  Vadc = Vbat·R2/(R1+R2)',
    Component: lazy(() => import('./sims/esp32-adc')),
  },
  {
    id: 'antenna-length',
    title: 'antenna-length.title',
    blurb: 'antenna-length.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'lambda = c/f,  L = 0.25·lambda·vf',
    Component: lazy(() => import('./sims/antenna-length')),
  },
  {
    id: 'link-budget',
    title: 'link-budget.title',
    blurb: 'link-budget.blurb',
    category: 'cat.embeddedEsp32',
    status: 'ready',
    formula: 'FSPL = 20·log(d) + 20·log(f) + 32.44',
    Component: lazy(() => import('./sims/link-budget')),
  },

  // ---------------- Sensors & Measurement ----------------
  {
    id: 'ntc-thermistor',
    title: 'ntc-thermistor.title',
    blurb: 'ntc-thermistor.blurb',
    category: 'cat.sensorsMeasurement',
    status: 'ready',
    formula: '1/T = 1/T0 + ln(R/R0)/B',
    Component: lazy(() => import('./sims/ntc-thermistor')),
  },
  {
    id: 'current-sense',
    title: 'current-sense.title',
    blurb: 'current-sense.blurb',
    category: 'cat.sensorsMeasurement',
    status: 'ready',
    formula: 'Vshunt = I·Rs,  Pshunt = I^2·Rs',
    Component: lazy(() => import('./sims/current-sense')),
  },
  {
    id: 'lipo-charger',
    title: 'lipo-charger.title',
    blurb: 'lipo-charger.blurb',
    category: 'cat.sensorsMeasurement',
    status: 'ready',
    formula: 'Ichg = 1200 V / Rprog',
    Component: lazy(() => import('./sims/lipo-charger')),
  },
  {
    id: 'solar-sizing',
    title: 'solar-sizing.title',
    blurb: 'solar-sizing.blurb',
    category: 'cat.sensorsMeasurement',
    status: 'ready',
    formula: 'Wh_day = Iavg·V·24,  Cbat = Wh·days/(V·DoD)',
    Component: lazy(() => import('./sims/solar-sizing')),
  },

  // ---------------- PCB & Wiring ----------------
  {
    id: 'trace-width',
    title: 'trace-width.title',
    blurb: 'trace-width.blurb',
    category: 'cat.pcbWiring',
    status: 'ready',
    formula: 'I = k·dT^0.44·A^0.725',
    Component: lazy(() => import('./sims/trace-width')),
  },
  {
    id: 'wire-gauge',
    title: 'wire-gauge.title',
    blurb: 'wire-gauge.blurb',
    category: 'cat.pcbWiring',
    status: 'ready',
    formula: 'd = 0.127·92^((36-n)/39) mm',
    Component: lazy(() => import('./sims/wire-gauge')),
  },
  {
    id: 'resistor-code',
    title: 'resistor-code.title',
    blurb: 'resistor-code.blurb',
    category: 'cat.pcbWiring',
    status: 'ready',
    formula: 'value = (digits)·10^multiplier',
    Component: lazy(() => import('./sims/resistor-code')),
  },
]

export const READY = SIMULATORS.filter((s) => s.status === 'ready')

export function simPath(sim: Sim): string {
  return `/sim/${sim.id}`
}
