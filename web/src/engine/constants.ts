/**
 * Project-wide defaults.
 *
 * Every simulator here is aimed at ESP32 work, so 3.3 V is the default rail
 * unless the part being modelled genuinely demands something else (LM2596 input,
 * mains transformer, car electronics). Simulators should import VCC rather than
 * hardcoding a supply, so changing the house default changes every page.
 */

/** ESP32 logic rail. The default supply for every simulator. */
export const VCC = 3.3

/** Legacy 5 V rail, for parts that genuinely need it (WS2812, servos, USB). */
export const VCC_5V = 5

/** ESP32 GPIO source/sink current before the pin is out of spec. */
export const GPIO_MAX_MA = 12

/** ESP32 ADC full scale at the default 11 dB attenuation. */
export const ADC_FULL_SCALE = 3.3
export const ADC_BITS = 12

/** Room temperature in kelvin, used by every thermal and diode model. */
export const T_AMBIENT_K = 298.15

/**
 * Thermal voltage kT/q at T_AMBIENT_K, in volts.
 * 1.380649e-23 * 298.15 / 1.602176634e-19 = 0.0256926. The rounder 0.02585 seen
 * in textbooks is the 300 K value, which does not match T_AMBIENT_K.
 */
export const V_THERMAL = 0.0256926
