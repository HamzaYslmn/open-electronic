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
import { Group, Segmented, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

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
        { label: 'Vterm', color: TRACE_COLORS[0], samples: r.terminal },
        { label: 'OCV', color: TRACE_COLORS[1], samples: r.ocv },
      ],
    }
  }, [chemistry, series, parallel, capacityAh, mode, loadValue])

  const spec = CHEMISTRIES[chemistry]
  const hours = r.runtime / 3600

  return (
    <SimPage
      id="battery"
      lede="Discharge a pack into a constant load and watch it sag. The scope plots terminal voltage against the open-circuit voltage over time: the gap between the two traces is the loss in the pack's own internal resistance."
      controls={
        <>
          <Group label="Pack">
            <Select
              label="Chemistry"
              value={chemistry}
              onChange={setChemistry}
              options={CHEMISTRY_OPTIONS}
            />
            <Param label="Cells in series" value={series} onChange={(v) => setSeries(Math.round(v))} min={1} max={16} log={false} step={1} />
            <Param label="Cells in parallel" value={parallel} onChange={(v) => setParallel(Math.round(v))} min={1} max={16} log={false} step={1} />
            <Param label="Cell capacity" unit="Ah" value={capacityAh} onChange={setCapacityAh} min={0.05} max={200} />
          </Group>

          <Group label="Load">
            <Segmented
              label="Load type"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'current', label: 'Current' },
                { value: 'resistance', label: 'Resistor' },
                { value: 'power', label: 'Power' },
              ]}
            />
            <Param
              label="Load"
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
            label: 'Runtime',
            value: hours >= 1 ? `${hours.toFixed(2)} h` : `${(r.runtime / 60).toFixed(1)} min`,
            warn: r.deadOnArrival,
          },
          { label: 'Mean current', value: formatSI(r.meanCurrent, 'A') },
          { label: 'C rate', value: `${r.cRate.toFixed(2)} C`, note: `max ${spec.maxCRate} C`, warn: r.overCRate },
          { label: 'Energy delivered', value: `${(r.energy / JOULES_PER_WH).toFixed(2)} Wh` },
          { label: 'Charge delivered', value: `${(r.delivered / COULOMBS_PER_AH).toFixed(3)} Ah` },
          { label: 'Rated capacity', value: `${(r.rated / COULOMBS_PER_AH).toFixed(3)} Ah` },
          {
            label: 'Peukert usable',
            value: `${(r.capacityRatio * 100).toFixed(0)}%`,
            note: 'of rated at this rate',
          },
          { label: 'Pack resistance', value: formatSI(r.rint, 'Ω') },
          { label: 'Loss in pack', value: `${(r.lossJoules / JOULES_PER_WH).toFixed(2)} Wh` },
          { label: 'Pack efficiency', value: `${(r.efficiency * 100).toFixed(1)}%` },
          { label: 'Start voltage', value: formatSI(r.startVoltage, 'V') },
          { label: 'Cutoff voltage', value: formatSI(r.cutoff, 'V') },
          { label: 'Worst sag', value: formatSI(r.maxSag, 'V') },
          { label: 'Nominal voltage', value: formatSI(r.nominal, 'V'), note: `${series}S${parallel}P` },
        ]}
      />

      {r.overPower && (
        <Warning>
          The load asks for more power than this pack can ever deliver. Maximum power transfer
          caps it at <code>OCV² / (4·Rint)</code>, and past that no operating point exists at
          any voltage. Reduce the load or add cells in parallel to drop Rint.
        </Warning>
      )}
      {r.overCRate && !r.overPower && (
        <Warning>
          Drawing {r.cRate.toFixed(2)} C, past the {spec.maxCRate} C continuous rating for{' '}
          {spec.label}. Real cells overheat and age fast here, which this model does not
          simulate: it will happily show you a runtime you should not use.
        </Warning>
      )}
      {r.deadOnArrival && (
        <Warning>
          The pack is already below its cutoff at the first sample, so there is no usable
          runtime. The load is too heavy for this pack size.
        </Warning>
      )}

      <Theory>
        <p>
          Terminal voltage is <code>V = OCV(depth) - I·Rint</code>. The open-circuit curve
          falls with depth of discharge, and the internal resistance subtracts a further drop
          proportional to current. That is the whole reason a battery reads 4.2 V at rest and
          3.7 V the moment you load it.
        </p>
        <p>
          Peukert's law captures the fact that capacity is not a constant:{' '}
          <code>t = H·(C/(I·H))^k</code>. With k above 1, heavy discharge extracts less total
          charge. Lead acid is the worst offender at k around 1.2 to 1.3; lithium is close to
          1.05, which is why a LiPo holds its rating far better under load.
        </p>
        <p>
          Resistive and constant-power loads behave differently as the pack drains. A resistor
          draws less current as voltage falls, so it tails off gently. A constant-power load
          draws <em>more</em> current as voltage falls, which accelerates the collapse at the
          end: this is exactly the behaviour of a switching regulator feeding an ESP32, and it
          is why the last few percent of a pack disappears so suddenly.
        </p>
      </Theory>
    </SimPage>
  )
}
