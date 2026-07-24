import { useMemo, useState } from 'react'
import { VCC_5V } from '../engine/constants'
import {
  ATTENUATIONS,
  SENSE_METHODS,
  SENSE_OPTIONS,
  analyseCurrentSense,
} from '../engine/sensing'
import type { SenseMethod } from '../engine/sensing'
import { formatSI } from '../engine/units'
import { Group, Select } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const FULL_SCALE = ATTENUATIONS['11'].fullScale

export default function CurrentSense() {
  const [method, setMethod] = useState<SenseMethod>('shunt')
  const [current, setCurrent] = useState(1)
  const [rShunt, setRShunt] = useState(0.05)
  const [gain, setGain] = useState(20)
  const [supply, setSupply] = useState(VCC_5V)

  const spec = SENSE_METHODS[method]
  const isShunt = spec.sensitivity === 0 && method !== 'ina219'

  const r = useMemo(
    () => analyseCurrentSense(method, current, rShunt, gain, supply, FULL_SCALE),
    [method, current, rShunt, gain, supply],
  )

  return (
    <SimPage
      id="current-sense"
      lede="Measuring current means turning it into a voltage the ADC can read, without stealing too much of the supply doing it. The shunt is a compromise between burden voltage, dissipation and resolution."
      controls={
        <>
          <Group label="Method">
            <Select label="Sensor" value={method} onChange={setMethod} options={SENSE_OPTIONS} />
            <Param label="Current" unit="A" value={current} onChange={setCurrent} min={0.001} max={30} />
            <Param label="Supply being measured" unit="V" value={supply} onChange={setSupply} min={1} max={60} />
          </Group>
          {isShunt && (
            <Group label="Shunt front end">
              <Param label="Shunt resistance" unit="Ω" value={rShunt} onChange={setRShunt} min={0.0001} max={10} />
              <Param label="Amplifier gain" value={gain} onChange={setGain} min={1} max={500} />
            </Group>
          )}
        </>
      }
    >
      <ReadoutGrid
        items={
          method === 'ina219'
            ? [
                { label: 'Sensor', value: spec.label, note: 'digital, I2C' },
                { label: 'Shunt voltage', value: formatSI(current * rShunt, 'V'), note: 'across the internal 0.1 Ω' },
                { label: 'Resolution', value: '10 µV', note: 'per LSB on the shunt ADC' },
                { label: 'Current resolution', value: formatSI(10e-6 / rShunt, 'A'), note: 'at this shunt' },
                { label: 'Shunt power', value: formatSI(current * current * rShunt, 'W') },
              ]
            : [
                { label: 'Shunt voltage', value: formatSI(r.vShunt, 'V'), note: isShunt ? 'burden' : 'n/a' },
                { label: 'Shunt power', value: formatSI(r.pShunt, 'W'), warn: r.wastefulShunt },
                { label: 'Output to ADC', value: formatSI(r.vOut, 'V'), warn: r.clipping },
                { label: 'ADC range used', value: `${(r.rangeUsed * 100).toFixed(1)}%`, warn: r.underusingRange || r.clipping },
                { label: 'Resolution', value: formatSI(r.resolution, 'A'), note: 'per ADC count' },
                {
                  label: 'Burden',
                  value: `${(r.burdenFraction * 100).toFixed(3)}%`,
                  note: 'of the supply',
                  warn: r.burdenFraction > 0.02,
                },
                ...(spec.sensitivity > 0
                  ? [
                      { label: 'Sensitivity', value: `${(spec.sensitivity * 1000).toFixed(0)} mV/A` },
                      { label: 'Sensor range', value: formatSI(spec.range, 'A') },
                      { label: 'Zero-current output', value: formatSI(spec.offset, 'V') },
                    ]
                  : []),
              ]
        }
      />

      {r.clipping && (
        <Warning
          text="{vOut} is past the {FULL_SCALE} ADC full scale, so the reading pins at maximum and you lose the top of the range entirely. Reduce the gain or the shunt."
          vars={{ vOut: formatSI(r.vOut, 'V'), FULL_SCALE: formatSI(FULL_SCALE, 'V') }}
        />
      )}
      {r.underusingRange && !r.clipping && (
        <Warning
          text="Only {rangeUsed}% of the ADC range is in use, so most of the converter's resolution is wasted. Raise the gain until full-scale current lands near the top of the range."
          vars={{ rangeUsed: (r.rangeUsed * 100).toFixed(0) }}
        />
      )}
      {r.wastefulShunt && (
        <Warning
          text="{pShunt} in the shunt is significant heat, and the resistor's own temperature coefficient will then shift the reading. Use a lower value with more gain, or a proper 4-wire sense resistor."
          vars={{ pShunt: formatSI(r.pShunt, 'W') }}
        />
      )}
      {method.startsWith('acs712') && (
        <Warning
          text="The ACS712 is a 5 V part with a mid-rail zero point, so its quiescent output is about 2.5 V, well above what an ESP32 pin tolerates. It needs a divider or a 3.3 V-friendly alternative. Its noise floor also makes it poor below a few hundred milliamps."
        />
      )}

      <Theory
        text={[
          "A shunt turns current into voltage by Ohm's law, `Vshunt = I·R`. That voltage is subtracted from the supply reaching the load, which is the burden. Keep it under a percent or two of the rail, so a 5 V supply wants a burden well under 50 mV.",
          "Dissipation is `I²·R` and it rises with the square of current, so a shunt sized for convenience at 1 A becomes a heater at 10 A. Worse, the heat changes the resistance, so the measurement drifts as the load increases: the reason precision shunts use low-tempco alloys and four-wire connections.",
          "The resolution you actually get is one ADC step referred back to the input, `Vlsb / (R·gain)`. Gain is what rescues you from the burden-versus- resolution trap: a small shunt keeps the burden low, and the amplifier recovers the signal. That is exactly what a dedicated current-sense amplifier does, and it also handles the common-mode problem of high-side sensing, where the shunt sits at supply potential rather than near ground.",
          "Hall-effect parts like the ACS712 avoid the burden entirely by measuring the magnetic field, giving full isolation. The price is offset drift, noise, and a zero point that sits at half the supply, so they are good for amps and poor for milliamps.",
        ]}
      />
    </SimPage>
  )
}
