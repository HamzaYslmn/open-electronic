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
      lede="current-sense.lede"
      controls={
        <>
          <Group label="common.method">
            <Select label="current-sense.sensor" value={method} onChange={setMethod} options={SENSE_OPTIONS} />
            <Param label="common.current" unit="A" value={current} onChange={setCurrent} min={0.001} max={30} />
            <Param label="current-sense.supplyBeingMeasured" unit="V" value={supply} onChange={setSupply} min={1} max={60} />
          </Group>
          {isShunt && (
            <Group label="current-sense.shuntFrontEnd">
              <Param label="current-sense.shuntResistance" unit="Ω" value={rShunt} onChange={setRShunt} min={0.0001} max={10} />
              <Param label="current-sense.amplifierGain" value={gain} onChange={setGain} min={1} max={500} />
            </Group>
          )}
        </>
      }
    >
      <ReadoutGrid
        items={
          method === 'ina219'
            ? [
                { label: 'current-sense.sensor', value: spec.label, note: 'current-sense.digitalI2c' },
                { label: 'current-sense.shuntVoltage', value: formatSI(current * rShunt, 'V'), note: 'current-sense.acrossTheInternal0' },
                { label: 'common.resolution', value: '10 µV', note: 'current-sense.perLsbOnThe' },
                { label: 'current-sense.currentResolution', value: formatSI(10e-6 / rShunt, 'A'), note: 'current-sense.atThisShunt' },
                { label: 'current-sense.shuntPower', value: formatSI(current * current * rShunt, 'W') },
              ]
            : [
                { label: 'current-sense.shuntVoltage', value: formatSI(r.vShunt, 'V'), note: isShunt ? 'current-sense.burden' : 'n/a' },
                { label: 'current-sense.shuntPower', value: formatSI(r.pShunt, 'W'), warn: r.wastefulShunt },
                { label: 'current-sense.outputToAdc', value: formatSI(r.vOut, 'V'), warn: r.clipping },
                { label: 'current-sense.adcRangeUsed', value: `${(r.rangeUsed * 100).toFixed(1)}%`, warn: r.underusingRange || r.clipping },
                { label: 'common.resolution', value: formatSI(r.resolution, 'A'), note: 'common.perAdcCount' },
                {
                  label: 'current-sense.burden2',
                  value: `${(r.burdenFraction * 100).toFixed(3)}%`,
                  note: 'current-sense.ofTheSupply',
                  warn: r.burdenFraction > 0.02,
                },
                ...(spec.sensitivity > 0
                  ? [
                      { label: 'common.sensitivity', value: `${(spec.sensitivity * 1000).toFixed(0)} mV/A` },
                      { label: 'current-sense.sensorRange', value: formatSI(spec.range, 'A') },
                      { label: 'current-sense.zeroCurrentOutput', value: formatSI(spec.offset, 'V') },
                    ]
                  : []),
              ]
        }
      />

      {r.clipping && (
        <Warning
          text="current-sense.warn1"
          vars={{ vOut: formatSI(r.vOut, 'V'), FULL_SCALE: formatSI(FULL_SCALE, 'V') }}
        />
      )}
      {r.underusingRange && !r.clipping && (
        <Warning
          text="current-sense.warn2"
          vars={{ rangeUsed: (r.rangeUsed * 100).toFixed(0) }}
        />
      )}
      {r.wastefulShunt && (
        <Warning
          text="current-sense.warn3"
          vars={{ pShunt: formatSI(r.pShunt, 'W') }}
        />
      )}
      {method.startsWith('acs712') && (
        <Warning
          text="current-sense.warn4"
        />
      )}

      <Theory
        text={[
          'current-sense.theory1',
          'current-sense.dissipationIsIR',
          'current-sense.theResolutionYouActually',
          'current-sense.hallEffectPartsLike',
        ]}
      />
    </SimPage>
  )
}
