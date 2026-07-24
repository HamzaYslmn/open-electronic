import { useMemo, useState } from 'react'
import {
  CHEMISTRIES,
  CHEMISTRY_OPTIONS,
  COULOMBS_PER_AH,
  JOULES_PER_WH,
  analyse,
} from '../engine/battery'
import type { Chemistry, LoadMode } from '../engine/battery'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Segmented, Select, SimPage, Theory, Warning } from '../ui'

const N = 4096

const LOAD_UNITS: Record<LoadMode, string> = {
  current: 'A',
  resistance: 'Ω',
  power: 'W',
}

export default function Battery() {
  const [chemistry, setChemistry] = useState<Chemistry>('lipo')
  const [series, setSeries] = useState(1)
  const [parallel, setParallel] = useState(1)
  const [capacityAh, setCapacityAh] = useState(2)
  const [mode, setMode] = useState<LoadMode>('current')
  const [loadValue, setLoadValue] = useState(0.5)

  const { r, traces, dt } = useMemo(() => {
    const spec = CHEMISTRIES[chemistry]
    const pack = {
      chemistry,
      series,
      parallel,
      cellCapacity: capacityAh * COULOMBS_PER_AH,
      cellResistance: spec.cellResistance,
    }
    const r = analyse(pack, { mode, value: loadValue }, N)
    return {
      r,
      dt: r.dt,
      traces: [
        { label: 'battery.vterm', samples: r.terminal },
        { label: 'battery.ocv', samples: r.ocv },
      ],
    }
  }, [chemistry, series, parallel, capacityAh, mode, loadValue])

  const spec = CHEMISTRIES[chemistry]
  const hours = r.runtime / 3600

  return (
    <SimPage
      id="battery"
      lede="battery.lede"
      controls={
        <>
          <Group label="battery.pack">
            <Select
              label="battery.chemistry"
              value={chemistry}
              onChange={setChemistry}
              options={CHEMISTRY_OPTIONS}
            />
            <Param label="common.cellsInSeries" value={series} onChange={setSeries} int min={1} max={16} log={false} step={1} />
            <Param label="battery.cellsInParallel" value={parallel} onChange={setParallel} int min={1} max={16} log={false} step={1} />
            <Param label="battery.cellCapacity" unit="Ah" value={capacityAh} onChange={setCapacityAh} min={0.05} max={200} />
          </Group>

          <Group label="common.load">
            <Segmented
              label="common.loadType"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'current', label: 'common.current' },
                { value: 'resistance', label: 'common.resistor' },
                { value: 'power', label: 'battery.power' },
              ]}
            />
            <Param
              label="common.load"
              unit={LOAD_UNITS[mode]}
              value={loadValue}
              onChange={setLoadValue}
              min={mode === 'resistance' ? 0.05 : 0.001}
              max={mode === 'resistance' ? 10_000 : 500}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'common.runtime',
            value: hours >= 1 ? `${hours.toFixed(2)} h` : `${(r.runtime / 60).toFixed(1)} min`,
            warn: r.deadOnArrival,
          },
          { label: 'battery.meanCurrent', value: formatSI(r.meanCurrent, 'A') },
          { label: 'common.cRate', value: `${r.cRate.toFixed(2)} C`, note: <T k="battery.maxC" vars={{ maxCRate: spec.maxCRate }} />, warn: r.overCRate },
          { label: 'battery.energyDelivered', value: `${(r.energy / JOULES_PER_WH).toFixed(2)} Wh` },
          { label: 'battery.chargeDelivered', value: `${(r.delivered / COULOMBS_PER_AH).toFixed(3)} Ah` },
          { label: 'battery.ratedCapacity', value: `${(r.rated / COULOMBS_PER_AH).toFixed(3)} Ah` },
          {
            label: 'battery.peukertUsable',
            value: `${(r.capacityRatio * 100).toFixed(0)}%`,
            note: 'battery.ofRatedAtThis',
          },
          { label: 'battery.packResistance', value: formatSI(r.rint, 'Ω') },
          { label: 'battery.lossInPack', value: `${(r.lossJoules / JOULES_PER_WH).toFixed(2)} Wh` },
          { label: 'battery.packEfficiency', value: `${(r.efficiency * 100).toFixed(1)}%` },
          { label: 'battery.startVoltage', value: formatSI(r.startVoltage, 'V') },
          { label: 'battery.cutoffVoltage', value: formatSI(r.cutoff, 'V') },
          { label: 'battery.worstSag', value: formatSI(r.maxSag, 'V') },
          { label: 'battery.nominalVoltage', value: formatSI(r.nominal, 'V'), note: <T k="battery.sP" vars={{ series, parallel }} /> },
        ]}
      />

      <Warning when={r.overPower}
        text="battery.warn1"
      />
      <Warning when={r.overCRate && !r.overPower}
        text="battery.warn2"
        vars={{ cRate: r.cRate.toFixed(2), maxCRate: spec.maxCRate, label: spec.label }}
      />
      <Warning when={r.deadOnArrival}
        text="battery.warn3"
      />

      <Theory
        text={[
          'battery.theory1',
          'battery.peukertSLawCaptures',
          'battery.resistiveAndConstantPower',
        ]}
      />
    </SimPage>
  )
}
