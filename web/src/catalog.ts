import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * Single source of truth for the whole app: routes, the home grid and the
 * roadmap all derive from this list. Adding a simulator means one engine
 * module, one page folder and one entry here.
 */

export const CATEGORIES = [
  'Filters & Signals',
  'Fundamentals',
  'Semiconductors',
  'Power Conversion',
  'Energy & Thermal',
  'AC & Power Quality',
  'Embedded / ESP32',
  'Sensors & Measurement',
  'PCB & Wiring',
] as const

export type Category = (typeof CATEGORIES)[number]

/**
 * One hue per category, applied as the --cat custom property on each section so
 * the catalogue is scannable by colour. Values sit in the same lightness band as
 * the Obsidian purple accent, so nothing shouts louder than anything else.
 */
export const CATEGORY_COLOR: Record<Category, string> = {
  'Filters & Signals': '#a882ff',
  Fundamentals: '#56b6f7',
  Semiconductors: '#4ade80',
  'Power Conversion': '#fbbf24',
  'Energy & Thermal': '#fb7185',
  'AC & Power Quality': '#f472b6',
  'Embedded / ESP32': '#38bdf8',
  'Sensors & Measurement': '#a3e635',
  'PCB & Wiring': '#fb923c',
}

export type Sim = {
  id: string
  title: string
  blurb: string
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
    title: 'RC Filter (Low / High Pass)',
    blurb: 'First-order RC response in time and frequency, with live scope traces.',
    category: 'Filters & Signals',
    status: 'ready',
    formula: 'fc = 1 / (2·pi·R·C)',
    Component: lazy(() => import('./sims/rc-filter')),
  },
  {
    id: 'rl-filter',
    title: 'RL Filter',
    blurb: 'Inductive first-order filter, the dual of the RC case.',
    category: 'Filters & Signals',
    status: 'ready',
    formula: 'tau = L/R,  fc = R / (2·pi·L)',
    Component: lazy(() => import('./sims/rl-filter')),
  },
  {
    id: 'rlc-resonance',
    title: 'RLC Resonance',
    blurb: 'Series and parallel resonance, damping and step ringing.',
    category: 'Filters & Signals',
    status: 'ready',
    formula: 'f0 = 1/(2·pi·sqrt(LC)),  Q = (1/R)·sqrt(L/C)',
    Component: lazy(() => import('./sims/rlc-resonance')),
  },
  {
    id: 'harmonics',
    title: 'Harmonics Synthesiser',
    blurb: 'Add harmonics to build square, triangle and distorted waveforms. THD readout.',
    category: 'Filters & Signals',
    status: 'ready',
    formula: 'v(t) = sum Vn·sin(2·pi·n·f·t + phi_n)',
    Component: lazy(() => import('./sims/harmonics')),
  },
  {
    id: 'pwm-filter',
    title: 'PWM Low-Pass Filter',
    blurb: 'Turn PWM into an analogue voltage. Ripple against settling time.',
    category: 'Filters & Signals',
    status: 'ready',
    formula: 'Vripple ~= Vs·D·(1-D) / (f·tau)',
    Component: lazy(() => import('./sims/pwm-filter')),
  },

  // ---------------- Fundamentals ----------------
  {
    id: 'voltage-divider',
    title: 'Voltage Divider',
    blurb: 'Unloaded and loaded divider, output impedance, error from the load.',
    category: 'Fundamentals',
    status: 'ready',
    formula: 'Vout = Vin·R2/(R1+R2)',
    Component: lazy(() => import('./sims/voltage-divider')),
  },
  {
    id: 'current-divider',
    title: 'Current Divider',
    blurb: 'Branch currents through parallel paths.',
    category: 'Fundamentals',
    status: 'ready',
    formula: 'Ix = I·Gx / sum(G)',
    Component: lazy(() => import('./sims/current-divider')),
  },
  {
    id: 'e-series',
    title: 'Standard Resistor Values',
    blurb: 'Nearest E12/E24/E96 value and two-resistor combinations for any target.',
    category: 'Fundamentals',
    status: 'ready',
    formula: 'E96: 10^(n/96),  error = (Rstd-Rideal)/Rideal',
    Component: lazy(() => import('./sims/e-series')),
  },
  {
    id: 'capacitor',
    title: 'Capacitor Calculator',
    blurb: 'Series/parallel, stored energy, charge and discharge curves.',
    category: 'Fundamentals',
    status: 'ready',
    formula: 'E = 0.5·C·V^2,  v(t) = V(1 - e^(-t/RC))',
    Component: lazy(() => import('./sims/capacitor')),
  },
  {
    id: 'coil',
    title: 'Coil / Inductor Simulator',
    blurb: 'Current ramp, stored energy and the kickback a coil produces when switched.',
    category: 'Fundamentals',
    status: 'ready',
    formula: 'i(t) = (V/R)(1 - e^(-tR/L)),  E = 0.5·L·I^2',
    Component: lazy(() => import('./sims/coil')),
  },
  {
    id: 'led-resistor',
    title: 'LED Series Resistor',
    blurb: 'Resistor pick, dissipation, and a warning when a GPIO cannot source the current.',
    category: 'Fundamentals',
    status: 'ready',
    formula: 'R = (Vs - Vf) / If',
    Component: lazy(() => import('./sims/led-resistor')),
  },
  {
    id: 'wheatstone',
    title: 'Wheatstone Bridge',
    blurb: 'Bridge output against sensor resistance, and the balance condition.',
    category: 'Fundamentals',
    status: 'ready',
    formula: 'Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))',
    Component: lazy(() => import('./sims/wheatstone')),
  },

  // ---------------- Semiconductors ----------------
  {
    id: 'bjt-switch',
    title: 'BJT as Switch / Amplifier',
    blurb: 'Base drive for hard saturation, overdrive factor, plus common-emitter bias.',
    category: 'Semiconductors',
    status: 'ready',
    formula: 'IB = (Vin - VBE)/RB,  ODF = IB·hFE / IC',
    Component: lazy(() => import('./sims/bjt-switch')),
  },
  {
    id: 'mosfet-switch',
    title: 'MOSFET Circuit Simulator',
    blurb: 'Gate drive margin, operating region, conduction and switching losses.',
    category: 'Semiconductors',
    status: 'ready',
    formula: 'Pcond = I^2·RDS(on),  Psw = 0.5·V·I·(tr+tf)·f',
    Component: lazy(() => import('./sims/mosfet-switch')),
  },
  {
    id: 'op-amp',
    title: 'Operational Amplifier',
    blurb: 'Inverting, non-inverting, summing, difference, integrator and comparator modes.',
    category: 'Semiconductors',
    status: 'ready',
    formula: 'Av(inv) = -Rf/Rin,  Av(non-inv) = 1 + Rf/Rg',
    Component: lazy(() => import('./sims/op-amp')),
  },
  {
    id: 'rectifier',
    title: 'Diode Rectifier',
    blurb: 'Half and full wave with a smoothing cap. Ripple, PIV and diode dissipation.',
    category: 'Semiconductors',
    status: 'ready',
    formula: 'Vripple = Iload / (f·C)',
    Component: lazy(() => import('./sims/rectifier')),
  },
  {
    id: 'zener',
    title: 'Zener Regulator',
    blurb: 'Series resistor sizing across the load range, zener power check.',
    category: 'Semiconductors',
    status: 'ready',
    formula: 'Rs = (Vin - Vz)/(Iz + IL)',
    Component: lazy(() => import('./sims/zener')),
  },
  {
    id: 'timer-555',
    title: '555 Timer',
    blurb: 'Astable and monostable timing, duty cycle and the resulting waveform.',
    category: 'Semiconductors',
    status: 'ready',
    formula: 'f = 1.44/((R1+2·R2)·C),  t = 1.1·R·C',
    Component: lazy(() => import('./sims/timer-555')),
  },

  // ---------------- Power Conversion ----------------
  {
    id: 'buck',
    title: 'Buck Converter',
    blurb: 'Duty, inductor ripple, output ripple and the CCM/DCM boundary.',
    category: 'Power Conversion',
    status: 'ready',
    formula: 'D = Vout/Vin,  dIL = Vout(1-D)/(f·L)',
    Component: lazy(() => import('./sims/buck')),
  },
  {
    id: 'boost',
    title: 'Boost Converter',
    blurb: 'Step-up duty, switch stress and inductor sizing.',
    category: 'Power Conversion',
    status: 'ready',
    formula: 'D = 1 - Vin/Vout,  dIL = Vin·D/(f·L)',
    Component: lazy(() => import('./sims/boost')),
  },
  {
    id: 'buck-boost',
    title: 'Buck-Boost Converter',
    blurb: 'Inverting and four-switch topologies across the full input range.',
    category: 'Power Conversion',
    status: 'ready',
    formula: 'Vout = -Vin·D/(1-D)',
    Component: lazy(() => import('./sims/buck-boost')),
  },
  {
    id: 'lm2596',
    title: 'LM2596 Module',
    blurb: 'The ubiquitous 150 kHz buck module: feedback divider, limits, efficiency.',
    category: 'Power Conversion',
    status: 'ready',
    formula: 'Vout = 1.23·(1 + R2/R1)',
    Component: lazy(() => import('./sims/lm2596')),
  },
  {
    id: 'lm317',
    title: 'Linear Regulator (LM317)',
    blurb: 'Set resistors, dissipation and whether it needs a heatsink.',
    category: 'Power Conversion',
    status: 'ready',
    formula: 'Vout = 1.25·(1 + R2/R1),  Pd = (Vin-Vout)·I',
    Component: lazy(() => import('./sims/lm317')),
  },
  {
    id: 'battery',
    title: 'Battery Simulator',
    blurb: 'Discharge under load with internal resistance sag and Peukert derating.',
    category: 'Power Conversion',
    status: 'ready',
    formula: 'V = EMF - I·Rint,  t = H·(C/(I·H))^k',
    Component: lazy(() => import('./sims/battery')),
  },

  // ---------------- Energy & Thermal ----------------
  {
    id: 'photovoltaic',
    title: 'Photovoltaic Panel',
    blurb: 'Single-diode model: I-V and P-V curves, MPP against irradiance and temperature.',
    category: 'Energy & Thermal',
    status: 'ready',
    formula: 'I = Iph - I0·(e^(V/(n·Vt)) - 1) - (V+I·Rs)/Rsh',
    Component: lazy(() => import('./sims/photovoltaic')),
  },
  {
    id: 'resistive-heating',
    title: 'Resistive Heating',
    blurb: 'Nichrome and pyrography tips: wire sizing, power, and time to temperature.',
    category: 'Energy & Thermal',
    status: 'ready',
    formula: 'R = rho·L/A,  P = V^2/R,  Q = m·c·dT',
    Component: lazy(() => import('./sims/resistive-heating')),
  },
  {
    id: 'heat-pump',
    title: 'Heat Pump / COP',
    blurb: 'Carnot ceiling against real COP, and the cost compared with resistive heating.',
    category: 'Energy & Thermal',
    status: 'ready',
    formula: 'COP_carnot = Th/(Th-Tc),  COP = eta·COP_carnot',
    Component: lazy(() => import('./sims/heat-pump')),
  },
  {
    id: 'thermal-design',
    title: 'Heatsink / Thermal',
    blurb: 'Junction temperature from dissipation and the thermal resistance chain.',
    category: 'Energy & Thermal',
    status: 'ready',
    formula: 'Tj = Ta + P·(Rjc + Rcs + Rsa)',
    Component: lazy(() => import('./sims/thermal-design')),
  },

  // ---------------- AC & Power Quality ----------------
  {
    id: 'reactive-power',
    title: 'Reactive Energy / Power Factor',
    blurb: 'Real, reactive and apparent power, with the capacitor needed to correct PF.',
    category: 'AC & Power Quality',
    status: 'ready',
    formula: 'S = V·I,  P = S·cos(phi),  Q = S·sin(phi)',
    Component: lazy(() => import('./sims/reactive-power')),
  },
  {
    id: 'ac-impedance',
    title: 'AC Impedance',
    blurb: 'Series and parallel RLC impedance against frequency, magnitude and phase.',
    category: 'AC & Power Quality',
    status: 'ready',
    formula: 'ZL = j·w·L,  ZC = 1/(j·w·C)',
    Component: lazy(() => import('./sims/ac-impedance')),
  },
  {
    id: 'transformer',
    title: 'Transformer',
    blurb: 'Turns ratio, reflected impedance, regulation and core loss estimate.',
    category: 'AC & Power Quality',
    status: 'ready',
    formula: 'Vs = Vp·Ns/Np,  Zref = (Np/Ns)^2·Zs',
    Component: lazy(() => import('./sims/transformer')),
  },

  // ---------------- Embedded / ESP32 ----------------
  {
    id: 'i2c-pullup',
    title: 'I2C Pull-Up Resistor',
    blurb: 'Pull-up window from bus capacitance and speed, with the rise-time check.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'Rmax = tr/(0.8473·Cb),  Rmin = (Vcc-0.4)/3mA',
    Component: lazy(() => import('./sims/i2c-pullup')),
  },
  {
    id: 'level-shifter',
    title: 'Logic Level Shifter',
    blurb: 'BSS138 bidirectional shifter and divider shifting, with speed limits.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'VGS = Vcc_low - Vsignal,  tr = 0.8473·R·C',
    Component: lazy(() => import('./sims/level-shifter')),
  },
  {
    id: 'ledc-pwm',
    title: 'ESP32 LEDC PWM',
    blurb: 'The frequency against resolution trade-off, and the real duty step size.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'f_max = 80 MHz / 2^bits',
    Component: lazy(() => import('./sims/ledc-pwm')),
  },
  {
    id: 'servo-pwm',
    title: 'Servo PWM',
    blurb: 'Angle to pulse width to duty ticks at a chosen timer resolution.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'duty = (pulse_us/20000)·2^bits',
    Component: lazy(() => import('./sims/servo-pwm')),
  },
  {
    id: 'debounce',
    title: 'Switch Debounce RC',
    blurb: 'RC and Schmitt trigger debounce sizing from measured bounce time.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 't = -tau·ln(1 - Vth/Vcc)',
    Component: lazy(() => import('./sims/debounce')),
  },
  {
    id: 'deep-sleep',
    title: 'Deep Sleep Battery Life',
    blurb: 'Average current from a duty-cycled wake profile, and months of runtime.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'Iavg = (Ion·ton + Isleep·tsleep)/T',
    Component: lazy(() => import('./sims/deep-sleep')),
  },
  {
    id: 'ws2812-power',
    title: 'WS2812 LED Power',
    blurb: 'Strip current, supply sizing and where to inject power along the run.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'I = n·60mA·brightness,  Vdrop = I·R_wire',
    Component: lazy(() => import('./sims/ws2812-power')),
  },
  {
    id: 'crystal-caps',
    title: 'Crystal Load Capacitors',
    blurb: 'Load cap pick from the crystal spec, plus the frequency pull it causes.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'C1 = C2 = 2·(CL - Cstray)',
    Component: lazy(() => import('./sims/crystal-caps')),
  },
  {
    id: 'esp32-adc',
    title: 'ESP32 ADC / VBAT Sense',
    blurb: 'Attenuation ranges, divider design for battery sensing, effective resolution.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'LSB = Vfs/4096,  Vadc = Vbat·R2/(R1+R2)',
    Component: lazy(() => import('./sims/esp32-adc')),
  },
  {
    id: 'antenna-length',
    title: 'Antenna Length',
    blurb: 'Quarter and half wave lengths for 433/868/915 MHz and 2.4 GHz, velocity factor included.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'lambda = c/f,  L = 0.25·lambda·vf',
    Component: lazy(() => import('./sims/antenna-length')),
  },
  {
    id: 'link-budget',
    title: 'RF Link Budget (LoRa / WiFi)',
    blurb: 'Free-space path loss against receiver sensitivity, with the fade margin.',
    category: 'Embedded / ESP32',
    status: 'ready',
    formula: 'FSPL = 20·log(d) + 20·log(f) + 32.44',
    Component: lazy(() => import('./sims/link-budget')),
  },

  // ---------------- Sensors & Measurement ----------------
  {
    id: 'ntc-thermistor',
    title: 'NTC Thermistor',
    blurb: 'Beta and Steinhart-Hart conversion, divider output curve, self-heating.',
    category: 'Sensors & Measurement',
    status: 'ready',
    formula: '1/T = 1/T0 + ln(R/R0)/B',
    Component: lazy(() => import('./sims/ntc-thermistor')),
  },
  {
    id: 'current-sense',
    title: 'Current Sensing',
    blurb: 'Shunt sizing against burden voltage, plus ACS712 and INA219 resolution.',
    category: 'Sensors & Measurement',
    status: 'ready',
    formula: 'Vshunt = I·Rs,  Pshunt = I^2·Rs',
    Component: lazy(() => import('./sims/current-sense')),
  },
  {
    id: 'lipo-charger',
    title: 'LiPo Charger (TP4056)',
    blurb: 'Program resistor to charge current, CC/CV phases and charge time.',
    category: 'Sensors & Measurement',
    status: 'ready',
    formula: 'Ichg = 1200 V / Rprog',
    Component: lazy(() => import('./sims/lipo-charger')),
  },
  {
    id: 'solar-sizing',
    title: 'Solar + Battery Sizing',
    blurb: 'Panel and battery pick from a daily load profile, with autonomy days.',
    category: 'Sensors & Measurement',
    status: 'ready',
    formula: 'Wh_day = Iavg·V·24,  Cbat = Wh·days/(V·DoD)',
    Component: lazy(() => import('./sims/solar-sizing')),
  },

  // ---------------- PCB & Wiring ----------------
  {
    id: 'trace-width',
    title: 'PCB Trace Width',
    blurb: 'IPC-2221 width for a current and temperature rise, internal or external.',
    category: 'PCB & Wiring',
    status: 'ready',
    formula: 'I = k·dT^0.44·A^0.725',
    Component: lazy(() => import('./sims/trace-width')),
  },
  {
    id: 'wire-gauge',
    title: 'Wire Gauge (AWG)',
    blurb: 'AWG to diameter and resistance, ampacity and voltage drop over a run.',
    category: 'PCB & Wiring',
    status: 'ready',
    formula: 'd = 0.127·92^((36-n)/39) mm',
    Component: lazy(() => import('./sims/wire-gauge')),
  },
  {
    id: 'resistor-code',
    title: 'Resistor Colour / SMD Code',
    blurb: 'Four and five band colours plus 3-digit, 4-digit and EIA-96 SMD codes.',
    category: 'PCB & Wiring',
    status: 'ready',
    formula: 'value = (digits)·10^multiplier',
    Component: lazy(() => import('./sims/resistor-code')),
  },
]

export const READY = SIMULATORS.filter((s) => s.status === 'ready')

export function simPath(sim: Sim): string {
  return `/sim/${sim.id}`
}
