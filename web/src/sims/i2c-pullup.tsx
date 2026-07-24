import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import {
  I2C_SPEED_OPTIONS,
  I2C_VOL,
  analyseI2c,
  voltageAt,
} from '../engine/logic'
import type { I2cSpeed } from '../engine/logic'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Select, SimPage, Theory, TRACE_COLORS, Warning } from '../ui'

const N = 2048

export default function I2cPullup() {
  const [speed, setSpeed] = useState<I2cSpeed>('fast')
  const [busC, setBusC] = useState(100e-12)
  const [rPullup, setRPullup] = useState(4700)
  const [vcc, setVcc] = useState(VCC)

  const { r, traces, dt } = useMemo(() => {
    const r = analyseI2c(speed, busC, rPullup, vcc)
    // Show the release edge: the device lets go and the pull-up drags the line
    // up through RC. Window it on the chosen pull-up so the shape stays visible.
    const span = Math.max(r.rise * 4, 1e-9)
    const dt = span / N
    const chosen = new Float64Array(N)
    const recommended = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      chosen[i] = voltageAt(i * dt, rPullup, busC, vcc, I2C_VOL)
      recommended[i] = Number.isFinite(r.rRecommended)
        ? voltageAt(i * dt, r.rRecommended, busC, vcc, I2C_VOL)
        : 0
    }
    return {
      r,
      dt,
      traces: [
        { label: 'i2c-pullup.sda', color: TRACE_COLORS[0], samples: chosen },
        ...(Number.isFinite(r.rRecommended)
          ? [{ label: 'i2c-pullup.idealR', color: TRACE_COLORS[2], samples: recommended }]
          : []),
      ],
    }
  }, [speed, busC, rPullup, vcc])

  return (
    <SimPage
      id="i2c-pullup"
      lede="i2c-pullup.lede"
      controls={
        <>
          <Group label="common.bus">
            <Select label="i2c-pullup.speed" value={speed} onChange={setSpeed} options={I2C_SPEED_OPTIONS} />
            <Param label="i2c-pullup.busCapacitance" unit="F" value={busC} onChange={setBusC} min={10e-12} max={1e-9} />
            <Param label="common.supply" unit="V" value={vcc} onChange={setVcc} min={1.8} max={5.5} log={false} step={0.1} />
          </Group>
          <Group label="common.pullUp">
            <Param label="common.resistor" unit="Ω" value={rPullup} onChange={setRPullup} min={200} max={100_000} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'i2c-pullup.minimumR', value: formatSI(r.rMin, 'Ω'), note: 'i2c-pullup.fromThe3Ma' },
          { label: 'i2c-pullup.maximumR', value: formatSI(r.rMax, 'Ω'), note: 'i2c-pullup.fromTheRiseTime' },
          {
            label: 'i2c-pullup.recommended',
            value: Number.isFinite(r.rRecommended) ? formatSI(r.rRecommended, 'Ω') : 'common.none',
            warn: r.windowEmpty,
          },
          {
            label: 'common.riseTime',
            value: formatSI(r.rise, 's'),
            note: <T k="i2c-pullup.limit" vars={{ maxRise: formatSI(r.spec.maxRise, 's') }} />,
            warn: r.tooSlow,
          },
          {
            label: 'i2c-pullup.riseVsBitPeriod',
            value: `${(r.riseFraction * 100).toFixed(1)}%`,
            warn: r.riseFraction > 0.3,
          },
          { label: 'i2c-pullup.sinkCurrent', value: formatSI(r.sinkCurrent, 'A'), note: 'i2c-pullup.whileHeldLow' },
          { label: 'i2c-pullup.powerPerLine', value: formatSI(r.lowPower, 'W'), note: 'i2c-pullup.staticWhenLow' },
          {
            label: 'i2c-pullup.busCapacitance',
            value: formatSI(busC, 'F'),
            note: <T k="i2c-pullup.limit2" vars={{ maxCapacitance: formatSI(r.spec.maxCapacitance, 'F') }} />,
            warn: r.overCapacitance,
          },
        ]}
      />

      <Warning when={r.windowEmpty}
        text="i2c-pullup.warn1"
      />
      <Warning when={!r.windowEmpty && r.outOfWindow}
        text="i2c-pullup.warn2"
        vars={{
          rPullup: formatSI(rPullup, 'Ω'),
          rMin: formatSI(r.rMin, 'Ω'),
          rMax: formatSI(r.rMax, 'Ω'),
        }}
      />
      <Warning when={r.overCapacitance}
        text="i2c-pullup.warn3"
        vars={{ maxCapacitance: formatSI(r.spec.maxCapacitance, 'F') }}
      />

      <Theory
        text={[
          'i2c-pullup.theory1',
          'i2c-pullup.theFloorComesFrom',
          'i2c-pullup.theCeilingComesFrom',
          'i2c-pullup.theWindowSpansDecades',
        ]} vars={{ I2C_VOL }}
      />
    </SimPage>
  )
}
