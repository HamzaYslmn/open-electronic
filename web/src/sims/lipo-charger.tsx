import { useMemo, useState } from 'react'
import {
  TP4056_TERMINATE_FRACTION,
  TP4056_VFLOAT,
  analyseCharger,
} from '../engine/parts'
import { formatSI } from '../engine/units'
import { Group } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 2048

export default function LipoCharger() {
  const [rProg, setRProg] = useState(1200)
  const [capacityAh, setCapacityAh] = useState(2)
  const [vInput, setVInput] = useState(5)

  const { r, traces, dt } = useMemo(() => {
    const r = analyseCharger(rProg, capacityAh, vInput)
    const span = Number.isFinite(r.totalTime) ? r.totalTime * 1.15 : 3600
    const dt = span / N
    const current = new Float64Array(N)
    const voltage = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      const t = i * dt
      if (t < r.ccTime) {
        // Constant current: cell voltage climbs toward the float voltage.
        current[i] = r.actualCurrent
        voltage[i] = 3.0 + (TP4056_VFLOAT - 3.0) * (t / Math.max(r.ccTime, 1e-9))
      } else {
        // Constant voltage: held at float while current decays exponentially.
        const tail = t - r.ccTime
        const tau = r.cvTime / Math.log(1 / TP4056_TERMINATE_FRACTION)
        current[i] = r.actualCurrent * Math.exp(-tail / Math.max(tau, 1e-9))
        voltage[i] = TP4056_VFLOAT
      }
    }
    return {
      r,
      dt,
      traces: [
        { label: 'I', color: TRACE_COLORS[0], samples: current },
        { label: 'Vcell', color: TRACE_COLORS[1], samples: voltage },
      ],
    }
  }, [rProg, capacityAh, vInput])

  return (
    <SimPage
      id="lipo-charger"
      lede="The TP4056 module everyone uses. The scope shows the classic CC/CV profile against time: constant current until the cell reaches 4.2 V, then constant voltage while the current tails away."
      controls={
        <>
          <Group label="Charger">
            <Param label="Rprog" unit="Ω" value={rProg} onChange={setRProg} min={600} max={20_000} />
            <Param label="Input voltage" unit="V" value={vInput} onChange={setVInput} min={4} max={8} log={false} step={0.1} />
          </Group>
          <Group label="Cell">
            <Param label="Capacity" unit="Ah" value={capacityAh} onChange={setCapacityAh} min={0.05} max={20} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'Set current', value: formatSI(r.current, 'A'), note: '1200 / Rprog' },
          { label: 'Nearest resistor', value: formatSI(r.rStandard, 'Ω'), note: 'E24' },
          { label: 'Actual current', value: formatSI(r.actualCurrent, 'A') },
          { label: 'C rate', value: `${r.cRate.toFixed(2)} C`, warn: r.overRate },
          { label: 'CC phase', value: `${(r.ccTime / 60).toFixed(0)} min` },
          { label: 'CV tail', value: `${(r.cvTime / 60).toFixed(0)} min` },
          { label: 'Total charge time', value: `${(r.totalTime / 3600).toFixed(2)} h` },
          { label: 'Float voltage', value: `${TP4056_VFLOAT} V` },
          { label: 'Chip dissipation', value: formatSI(r.dissipation, 'W'), warn: r.hot },
        ]}
      />

      {r.overRate && (
        <Warning
          text="Charging at {cRate} C. Most lithium cells want 0.5 C to 1 C, and going faster shortens life sharply and generates heat the little TP4056 board cannot shed. Raise Rprog: {capacityAh} gives exactly 1 C for this cell."
          vars={{ cRate: r.cRate.toFixed(2), capacityAh: formatSI(1200 / capacityAh, 'Ω') }}
        />
      )}
      {r.hot && (
        <Warning
          text="The chip dissipates {dissipation} at the start of charging. It is a linear charger, so every volt between input and cell becomes heat in that small package. It will thermally throttle, stretching the charge time well past the estimate here. Keep the input close to 5 V."
          vars={{ dissipation: formatSI(r.dissipation, 'W') }}
        />
      )}
      <Warning
        text="A bare TP4056 board has no protection. The version with the DW01 and dual MOSFET adds over-discharge, over-current and short-circuit protection, and lithium cells should not be used without it. Neither version does cell balancing, so neither is suitable for a multi-cell series pack."
      />

      <Theory
        text={[
          "Charge current is set by one resistor: `Ichg = 1200 / Rprog` amps with Rprog in ohms. The datasheet default of 1.2 kΩ gives 1 A, and 10 kΩ gives 120 mA, which is the right order for a small 200 mAh cell.",
          "Lithium charging is constant current then constant voltage. During CC the current is fixed and the cell voltage climbs. Once it reaches 4.2 V the charger holds that voltage instead and the current decays as the cell fills. Charging stops when the current falls to about a tenth of the set value.",
          "The CV tail is slower than people expect. It carries only the last fifth or so of the capacity but takes a substantial part of the total time, because current is decaying exponentially the whole way. This is why charging to 90% is much faster per unit of energy than charging to 100%, and why stopping early is kind to the cell.",
          "Because it is a linear charger, the input to cell voltage difference all becomes heat: `P = (Vin - Vcell)·I`. At 1 A from 5 V into a 3.0 V empty cell that is 2 W in a SOP-8, which is why these boards get hot and throttle. Feeding them from anything above 5 V makes it markedly worse.",
        ]}
      />
    </SimPage>
  )
}
