/**
 * The "Where is it used?" card shown on every simulator page.
 *
 * Kept as data next to the catalog rather than as JSX inside each sim, so the
 * card is rendered once by SimPage and adding a simulator means adding one entry
 * here. Each string answers the same two questions: where does this actually
 * turn up, and why does it matter if you get it wrong.
 */
export const USE_CASES: Record<string, string> = {
  'rc-filter':
    'The most common filter in electronics. Smoothing a PWM output into an analogue voltage, removing switching noise from a sensor line, anti-aliasing in front of an ADC, and setting the roll-off in audio tone controls. Get the cutoff wrong and you either pass the noise you meant to remove or slug the signal you meant to keep.',
  'rl-filter':
    'Less common than RC because inductors are bulky and expensive, but unavoidable where current rather than voltage must be smoothed: motor drive filters, switch-mode converter output stages, and EMI chokes on supply leads. Also the natural model for any winding you did not intend to be a filter, such as a long cable pair or a relay coil.',
  'rlc-resonance':
    'Tuned circuits in radio front ends, crystal and LC oscillators, and EMI filters. Just as often it is unintentional: any inductance with stray capacitance rings, which is why switching nodes overshoot and why a long supply lead into a decoupling capacitor can oscillate. Knowing f0 and Q tells you whether it will ring once or for a hundred cycles.',
  harmonics:
    'Understanding why a square wave upsets an audio chain, why non-sinusoidal load current on the mains causes trouble, and what THD actually measures. Directly relevant to PWM: the whole reason a PWM signal needs filtering is the harmonic content sitting above the fundamental.',
  'pwm-filter':
    'Making a cheap analogue output from a microcontroller that has no DAC, which covers most ESP32 use: setting a reference voltage, driving an analogue meter, generating a control voltage for a fan or a valve. The trade-off is always the same, less ripple means slower settling, and this page shows you exactly where the knee is.',
  'voltage-divider':
    'Everywhere. Scaling a battery voltage into an ADC range, setting the feedback point of a regulator, biasing a transistor, and making a reference. The trap it exposes is loading: a divider that reads correctly on a meter can read completely wrong once the circuit it feeds draws current.',
  'current-divider':
    'Working out how current splits between parallel paths: paralleled resistors sharing power, LEDs unwisely paralleled on one resistor, and multiple return paths in a ground plane. It is also the model for why paralleling batteries or regulators without ballast leads to one of them doing all the work.',
  'e-series':
    'You cannot buy the resistance your formula produced. This turns a calculated value into something purchasable, tells you the error you are accepting, and finds two-resistor combinations when a single standard value is not close enough, which matters for precision dividers and gain-setting networks.',
  capacitor:
    'Sizing decoupling and bulk capacitors, timing networks, energy storage for a burst load such as a radio transmission, and working out how long a supply rail holds up after power is removed. The energy figure is what tells you whether a capacitor can carry an ESP32 through a WiFi transmit spike.',
  coil:
    'Relays, solenoids, motors and switch-mode converters. The critical output is the kickback: interrupting current through an inductor produces a voltage spike that destroys the transistor doing the switching. This shows how big that spike is and what a flyback diode clamps it to, which is why that diode is not optional.',
  'led-resistor':
    'The first circuit anyone builds, and still the one most often got wrong. Driving indicator LEDs from a GPIO, sizing current for a panel of them, and checking the pin can actually source what you are asking. Drive an LED straight from a 3.3 V pin with no resistor and you exceed the GPIO rating and cook either the LED or the pin.',
  wheatstone:
    'The standard front end for resistive sensors: strain gauges in load cells, RTDs for temperature, and pressure sensors. The bridge exists because it measures a small change against a reference rather than an absolute value, which cancels supply drift and lets you amplify hard without amplifying the offset.',
  'bjt-switch':
    'Driving a relay, a buzzer, a motor or an LED string from a microcontroller pin that cannot supply the current. The overdrive factor is the point: a transistor that is not driven hard into saturation dissipates far more than expected and gets hot, which is the usual cause of a switching transistor failing in a hobby circuit.',
  'mosfet-switch':
    'The standard way to switch anything substantial from an ESP32: motors, heaters, LED strips, solenoids. The critical check is gate drive, since a 3.3 V pin cannot fully turn on a MOSFET specified at 10 V VGS. That is the single most common ESP32 hardware mistake, and it shows up as a FET that works on the bench and burns out under load.',
  'op-amp':
    'Amplifying a sensor signal into an ADC range, buffering a high-impedance source, summing and differencing, integrating, and comparing with hysteresis. Also for finding out why a circuit that works at DC misbehaves at speed: the gain-bandwidth limit and slew rate are what turn a textbook design into a distorted one.',
  rectifier:
    'Any mains or transformer-derived supply, and the front end of most non-USB power adapters. It tells you the ripple your smoothing capacitor leaves, which sets whether the regulator after it stays out of dropout, and the peak inverse voltage the diodes must survive.',
  zener:
    'Cheap voltage references, clamping an input to protect a pin, and low-current regulation where a proper regulator is overkill. The design is entirely about worst cases: the series resistor must pass enough current at minimum input and maximum load, without cooking the zener at maximum input and no load.',
  'timer-555':
    'Blinking lights, tone generation, PWM without a microcontroller, one-shot pulses, and reset supervision. Still worth knowing because it is often the cheapest and most reliable way to get a timed pulse without firmware, and because the astable duty limit explains a lot of confusing circuits.',
  buck:
    'Stepping a higher rail down efficiently: 12 V to 5 V, 5 V to 3.3 V, battery to logic. This is how nearly every ESP32 board makes its 3.3 V rail from USB. The inductor ripple and CCM/DCM boundary decide whether the converter is quiet and well behaved or noisy and load dependent.',
  boost:
    'Running something from a battery that is below the voltage it needs: 3.7 V lithium up to 5 V, or two AA cells up to 3.3 V. The catch this page makes visible is input current, which is always higher than output current, so a boost from a nearly flat cell draws far more than beginners expect.',
  'buck-boost':
    'The classic single-lithium-cell problem: a cell runs 4.2 V down to 3.0 V while the rail must hold 3.3 V, so the converter must step both down and up over the discharge. Also used in car electronics where 12 V sags on cranking and spikes on load dump.',
  lm2596:
    'The blue adjustable buck module in every parts kit, used to get 5 V or 3.3 V from a 12 V supply. This page exists because the modules are sold claiming 3 A while their thermal design gives out long before that, and because setting the feedback divider by trial and error is how people destroy what they are powering.',
  lm317:
    'Simple adjustable supplies, current sources for LEDs and battery charging, and cases where switching noise is unacceptable. The critical output is dissipation: a linear regulator burns the voltage difference as heat, so 12 V to 3.3 V at 1 A means nearly 9 W and a heatsink, which is why a buck converter usually wins.',
  battery:
    'Predicting how long a device runs, and why the last stretch of a discharge collapses so quickly. The sag figure matters for anything with a burst load: an ESP32 transmitting pulls enough current that internal resistance drops the rail, which is a common cause of brownout resets on a tired cell.',
  photovoltaic:
    'Sizing panels, understanding why an MPPT controller earns its cost, and why a panel rated 100 W rarely delivers it. The temperature coefficient is the practical takeaway: panels lose voltage as they heat, so a string sized on a datasheet at 25 °C can drop below the MPPT input window on a hot roof.',
  'resistive-heating':
    'Pyrography pens, hot wire foam cutters, 3D printer hot ends and nozzles, small kilns, and soldering equipment. The key output is the equilibrium temperature: element wire settles where dissipation equals cooling, so the same wire and voltage behave completely differently in still air, in a draught, or buried in insulation.',
  'heat-pump':
    'Deciding whether a heat pump is worth installing, and understanding why the answer depends on flow temperature. It explains why underfloor heating suits heat pumps and old high-temperature radiators do not, and why the seasonal figure rather than the headline COP determines the running cost.',
  'thermal-design':
    'Any part that dissipates real power: regulators, MOSFETs, motor drivers, LED arrays. It answers the only question that matters, whether the junction stays under its limit at the worst-case ambient, and works backwards to the heatsink you need if it does not.',
  'reactive-power':
    'Industrial installations billed for reactive power, motor loads, and understanding why a 3 kW motor needs more than 3 kVA of supply. The cable loss comparison is the practical payoff, since correcting power factor reduces current and the loss falls with its square.',
  'ac-impedance':
    'Filter and matching network design, understanding why a decoupling capacitor stops working above its self-resonance, and why cable and load impedance matters at frequency. Any time a circuit behaves differently at 1 kHz and 1 MHz, this is why.',
  transformer:
    'Mains power supplies, isolation for safety, and impedance matching in audio and RF. The reflected impedance relation is the one people forget, and it is why a transformer is the standard way to match a low-impedance speaker or antenna to a high-impedance source.',
  'i2c-pullup':
    'Every I2C sensor, display and EEPROM on an ESP32 project. I2C is open drain, so the bus cannot rise without a pull-up, and the resistor value is a genuine constraint rather than a formality: too large and the edges are too slow for the clock, too small and devices cannot pull the line low. This is the usual reason an I2C bus works with a short jumper and fails with a metre of ribbon cable.',
  'level-shifter':
    'Connecting a 3.3 V ESP32 to 5 V peripherals: older sensors, character LCDs, WS2812 strips, and most Arduino-era shields. It matters because feeding 5 V into a 3.3 V pin damages it over time, and because a 3.3 V output is often just below what a 5 V part reads as a valid high, giving intermittent faults rather than clean failures.',
  'ledc-pwm':
    'Dimming LEDs, driving motors and servos, and generating an analogue voltage from an ESP32. The frequency against resolution trade is a hardware limit people meet without noticing: asking for a high frequency silently reduces your duty resolution, which shows up as visible banding when dimming an LED at low brightness.',
  'servo-pwm':
    'Robot arms, pan and tilt mounts, RC conversions, and anything with a hobby servo. It matters because servos read pulse width rather than duty, so only a small slice of the timer range is useful, and a low LEDC resolution leaves too few steps across the travel to move smoothly.',
  debounce:
    'Any mechanical button, switch or relay contact read by a microcontroller. Contacts chatter for milliseconds on every press, so a naive read counts one press as several. This sizes the filter to ride over the bounce without becoming so slow it drops real presses.',
  'deep-sleep':
    'Any battery powered ESP32 node: sensors reporting to a server, trackers, remote monitors. Average current is the only figure that determines battery life, and this shows why the sleep current usually matters far more than the wake time. It is also how you discover that a permanently connected divider or a leaky regulator is what is really draining the pack.',
  'ws2812-power':
    'Addressable LED strips for lighting, signage and displays. The current is far higher than people expect, around 60 mA per pixel at full white, and the far end of a long strip browns out and shifts colour before the supply gives up. It also flags the 3.3 V data problem, which is why these strips work intermittently with an ESP32.',
  'crystal-caps':
    'Real-time clocks, radio frequency references, and any microcontroller with an external crystal. If the load capacitors are wrong the crystal still oscillates, just at the wrong frequency, so this is usually the answer when a clock drifts by minutes a month or a radio link will not tune.',
  'esp32-adc':
    'Reading a battery level, a potentiometer, or any analogue sensor on an ESP32. It matters because the ADC is only linear over part of its range, so a divider that lands outside the usable window reads compressed or flat exactly where you need accuracy, and because a high-impedance divider gives readings that quietly depend on the sampling rate.',
  'antenna-length':
    'Cutting a wire whip for a LoRa, WiFi or GPS module. It matters because a quarter wave is wavelength dependent and a 10% error can cost 10 dB, which is a factor of three in range. It also flags the ground plane requirement, which is why a bare whip on a small board performs so badly.',
  'link-budget':
    'Deciding whether a LoRa or WiFi link will actually work at the range you need, before installing anything. It shows why lower frequencies reach further, why LoRa trades data rate for sensitivity, and why a link designed with no margin fails the first time it rains.',
  'ntc-thermistor':
    'Temperature sensing in 3D printer hot ends and beds, battery packs, and general monitoring, where a thermistor is far cheaper than a digital sensor. The non-linearity is the design problem, and this shows where the divider is sensitive and where it goes blind, plus the self-heating error that makes a sensor read its own current.',
  'current-sense':
    'Battery monitoring, motor current limiting, power measurement, and overcurrent protection. The design is a three-way compromise between burden voltage, shunt dissipation and resolution, and this shows why a dedicated current-sense amplifier with a small shunt beats a large shunt read directly.',
  'lipo-charger':
    'The TP4056 module used in nearly every hobby lithium project. It matters because one resistor sets the charge current and getting it wrong either takes all day or charges the cell faster than it should be charged, and because the module is a linear charger that gets hot at high current.',
  'solar-sizing':
    'Off-grid sensor nodes, weather stations and remote monitors. The failure mode it prevents is the system that breaks even on paper: it works all summer, then a cloudy week drains the battery and it never recovers, because the panel has no surplus to refill with.',
  'trace-width':
    'Laying out any board that carries more than a few hundred milliamps: power rails, motor drives, LED strips. It is a thermal limit rather than a damage limit, so it tells you how hot the copper gets, and it flags separately that voltage drop is often the real constraint on long low-voltage traces.',
  'wire-gauge':
    'Wiring anything beyond a breadboard: battery leads, motor supplies, LED strip feeds, car and solar installations. The voltage drop figure is the useful one, since a supply that measures correctly at the source can arrive well below spec at the load, and the return conductor doubles the drop people usually calculate.',
  'resistor-code':
    'Reading the part you just pulled out of the drawer, or marking one in a BOM. It covers colour bands and all three SMD schemes, including EIA-96 which is unreadable without the table, and shows why tolerance and the E-series always go together.',
}
