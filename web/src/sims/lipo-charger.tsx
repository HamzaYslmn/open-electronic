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
        { label: 'lipo-charger.vcell', color: TRACE_COLORS[1], samples: voltage },
      ],
    }
  }, [rProg, capacityAh, vInput])

  return (
    <SimPage
      id="lipo-charger"
      lede="lipo-charger.lede"
      controls={
        <>
          <Group label="lipo-charger.charger">
            <Param label="lipo-charger.rprog" unit="Ω" value={rProg} onChange={setRProg} min={600} max={20_000} />
            <Param label="lipo-charger.inputVoltage" unit="V" value={vInput} onChange={setVInput} min={4} max={8} log={false} step={0.1} />
          </Group>
          <Group label="lipo-charger.cell">
            <Param label="common.capacity" unit="Ah" value={capacityAh} onChange={setCapacityAh} min={0.05} max={20} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'lipo-charger.setCurrent', value: formatSI(r.current, 'A'), note: 'lipo-charger.1200Rprog' },
          { label: 'lipo-charger.nearestResistor', value: formatSI(r.rStandard, 'Ω'), note: 'E24' },
          { label: 'common.actualCurrent', value: formatSI(r.actualCurrent, 'A') },
          { label: 'common.cRate', value: `${r.cRate.toFixed(2)} C`, warn: r.overRate },
          { label: 'lipo-charger.ccPhase', value: `${(r.ccTime / 60).toFixed(0)} min` },
          { label: 'lipo-charger.cvTail', value: `${(r.cvTime / 60).toFixed(0)} min` },
          { label: 'lipo-charger.totalChargeTime', value: `${(r.totalTime / 3600).toFixed(2)} h` },
          { label: 'lipo-charger.floatVoltage', value: `${TP4056_VFLOAT} V` },
          { label: 'lipo-charger.chipDissipation', value: formatSI(r.dissipation, 'W'), warn: r.hot },
        ]}
      />

      {r.overRate && (
        <Warning
          text="lipo-charger.warn1"
          vars={{ cRate: r.cRate.toFixed(2), capacityAh: formatSI(1200 / capacityAh, 'Ω') }}
        />
      )}
      {r.hot && (
        <Warning
          text="lipo-charger.warn2"
          vars={{ dissipation: formatSI(r.dissipation, 'W') }}
        />
      )}
      <Warning
        text="lipo-charger.warn3"
      />

      <Theory
        text={[
          'lipo-charger.theory1',
          'lipo-charger.lithiumChargingIsConstant',
          'lipo-charger.theCvTailIs',
          'lipo-charger.becauseItIsA',
        ]}
      />
    </SimPage>
  )
}
