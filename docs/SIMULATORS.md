# Simulator catalogue

49 simulators across 9 categories. The app's home page is generated from
[`web/src/catalog.ts`](web/src/catalog.ts); this file is the reference for the maths each one implements.

Status: **ready** means the page exists, everything else is planned.

## Filters & Signals

| Simulator | Core maths | Status |
| --- | --- | --- |
| RC Filter (low/high pass) | `fc = 1/(2·pi·R·C)`, `\|H\| = 1/sqrt(1+(f/fc)^2)`, `phi = -atan(f/fc)` | **ready** |
| RL Filter | `tau = L/R`, `fc = R/(2·pi·L)` | planned |
| RLC Resonance | `f0 = 1/(2·pi·sqrt(LC))`, `Q = (1/R)·sqrt(L/C)`, `BW = f0/Q` | planned |
| Harmonics Synthesiser | `v(t) = sum Vn·sin(2·pi·n·f·t + phi_n)`, `THD = sqrt(sum V2..n^2)/V1` | planned |
| PWM Low-Pass Filter | `Vripple ~= Vs·D·(1-D)/(f·tau)`, settling `~5·tau` | planned |

## Fundamentals

| Simulator | Core maths | Status |
| --- | --- | --- |
| Voltage Divider | `Vout = Vin·R2/(R1+R2)`, loaded case uses `R2 \|\| RL` | planned |
| Current Divider | `Ix = I·Gx/sum(G)` | planned |
| Standard Resistor Values | E12/E24/E96 series `10^(n/N)`, plus two-resistor combinations | planned |
| Capacitor Calculator | `E = 0.5·C·V^2`, `v(t) = V(1-e^(-t/RC))` | planned |
| Coil / Inductor | `i(t) = (V/R)(1-e^(-tR/L))`, `E = 0.5·L·I^2`, flyback | planned |
| LED Series Resistor | `R = (Vs-Vf)/If`, plus GPIO source-current warning | planned |
| Wheatstone Bridge | `Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))` | planned |

## Semiconductors

| Simulator | Core maths | Status |
| --- | --- | --- |
| BJT as Switch / Amplifier | `IB = (Vin-VBE)/RB`, overdrive factor, `Av ~= -Rc/Re` | planned |
| MOSFET Circuit | region from `VGS` vs `Vth`, `Pcond = I^2·RDS(on)`, switching loss | planned |
| Operational Amplifier | `-Rf/Rin`, `1+Rf/Rg`, summing, difference, integrator, comparator with hysteresis; rail clipping and GBW limit | planned |
| Diode Rectifier | half/full wave, `Vripple = Iload/(f·C)`, PIV | planned |
| Zener Regulator | `Rs = (Vin-Vz)/(Iz+IL)`, zener dissipation | planned |
| 555 Timer | `f = 1.44/((R1+2·R2)·C)`, monostable `t = 1.1·R·C` | planned |

## Power Conversion

| Simulator | Core maths | Status |
| --- | --- | --- |
| Buck Converter | `D = Vout/Vin`, `dIL = Vout(1-D)/(f·L)`, `dV = dIL/(8·f·C)`, CCM boundary | planned |
| Boost Converter | `D = 1 - Vin/Vout`, `dIL = Vin·D/(f·L)` | planned |
| Buck-Boost | `Vout = -Vin·D/(1-D)` | planned |
| LM2596 Module | buck at 150 kHz, `Vout = 1.23(1+R2/R1)`, 4.5-40 V and 3 A limits | planned |
| Linear Regulator (LM317) | `Vout = 1.25(1+R2/R1)`, `Pd = (Vin-Vout)·I` | planned |
| Battery Simulator | `V = EMF - I·Rint`, Peukert `t = H(C/(I·H))^k` | planned |

## Energy & Thermal

| Simulator | Core maths | Status |
| --- | --- | --- |
| Photovoltaic Panel | single diode `I = Iph - I0(e^(V/(n·Vt))-1) - (V+I·Rs)/Rsh`, I-V and P-V curves, MPP | planned |
| Resistive Heating | `R = rho·L/A`, `P = V^2/R`, `Q = m·c·dT` (nichrome, pyrography tips) | planned |
| Heat Pump / COP | `COP_carnot = Th/(Th-Tc)`, real `COP = eta·COP_carnot` | planned |
| Heatsink / Thermal | `Tj = Ta + P·(Rjc+Rcs+Rsa)` | planned |

## AC & Power Quality

| Simulator | Core maths | Status |
| --- | --- | --- |
| Reactive Energy / PF | `S = V·I`, `P = S·cos(phi)`, `Q = S·sin(phi)`, correction `C = Q/(2·pi·f·V^2)` | planned |
| AC Impedance | `ZL = j·w·L`, `ZC = 1/(j·w·C)` | planned |
| Transformer | `Vs = Vp·Ns/Np`, `Zref = (Np/Ns)^2·Zs` | planned |

## Embedded / ESP32

| Simulator | Core maths | Status |
| --- | --- | --- |
| I2C Pull-Up | `Rmax = tr/(0.8473·Cb)`, `Rmin = (Vcc-0.4)/3mA` | planned |
| Logic Level Shifter | BSS138 bidirectional, `VGS` margin, rise time | planned |
| ESP32 LEDC PWM | `f_max = 80 MHz / 2^bits` | planned |
| Servo PWM | `duty = (pulse_us/20000)·2^bits` | planned |
| Switch Debounce RC | `t = -tau·ln(1 - Vth/Vcc)` | planned |
| Deep Sleep Battery Life | `Iavg = (Ion·ton + Isleep·tsleep)/T` | planned |
| WS2812 LED Power | `I = n·60mA·brightness`, wire drop and injection points | planned |
| Crystal Load Caps | `C1 = C2 = 2(CL - Cstray)` | planned |
| ESP32 ADC / VBAT Sense | attenuation ranges, `LSB = Vfs/4096` | planned |
| Antenna Length | `lambda = c/f`, `L = 0.25·lambda·vf` | planned |
| RF Link Budget | `FSPL = 20log(d) + 20log(f) + 32.44`, fade margin | planned |

## Sensors & Measurement

| Simulator | Core maths | Status |
| --- | --- | --- |
| NTC Thermistor | Beta `1/T = 1/T0 + ln(R/R0)/B`, Steinhart-Hart | planned |
| Current Sensing | `Vshunt = I·Rs`, `P = I^2·Rs`, ACS712 and INA219 resolution | planned |
| LiPo Charger (TP4056) | `Ichg = 1200 V / Rprog`, CC/CV phases | planned |
| Solar + Battery Sizing | daily Wh against load profile, autonomy days | planned |

## PCB & Wiring

| Simulator | Core maths | Status |
| --- | --- | --- |
| PCB Trace Width | IPC-2221 `I = k·dT^0.44·A^0.725` (k = 0.048 external, 0.024 internal) | planned |
| Wire Gauge (AWG) | `d = 0.127·92^((36-n)/39)` mm, ampacity, voltage drop | planned |
| Resistor Colour / SMD Code | 4 and 5 band, 3-digit, 4-digit and EIA-96 | planned |

## Adding one

1. `web/src/engine/<domain>.ts` with the formulas, plus `<domain>.test.ts`.
2. `web/src/pages/<name>/<Name>.tsx` using `Param` and `Oscilloscope`.
3. In `web/src/catalog.ts`, set `status: 'ready'` and add
   `Component: lazy(() => import('./pages/<name>/<Name>'))`.

Routes and the home grid update themselves.
