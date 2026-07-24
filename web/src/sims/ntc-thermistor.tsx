import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { analyseNtc, ntcResistance, toKelvin } from '../engine/sensing'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 1024

export default function NtcThermistor() {
  const [r0, setR0] = useState(10_000)
  const [beta, setBeta] = useState(3950)
  const [t0C, setT0C] = useState(25)
  const [tempC, setTempC] = useState(25)
  const [rSeries, setRSeries] = useState(10_000)
  const [dissipation, setDissipation] = useState(0.002)
  const [sweepLow, setSweepLow] = useState(-20)
  const [sweepHigh, setSweepHigh] = useState(120)

  const { r, traces, dt } = useMemo(() => {
    const t0 = toKelvin(t0C)
    const r = analyseNtc(r0, beta, t0, toKelvin(tempC), rSeries, dissipation, VCC)
    // Sweep the divider output across the temperature span.
    const step = (sweepHigh - sweepLow) / (N - 1)
    const volts = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      const rt = ntcResistance(r0, beta, t0, toKelvin(sweepLow + i * step))
      volts[i] = (VCC * rt) / (rSeries + rt)
    }
    return {
      r,
      dt: step,
      traces: [{ label: 'common.vout', color: TRACE_COLORS[0], samples: volts }],
    }
  }, [r0, beta, t0C, tempC, rSeries, dissipation, sweepLow, sweepHigh])

  return (
    <SimPage
      id="ntc-thermistor"
      lede="ntc-thermistor.lede"
      controls={
        <>
          <Group label="ntc-thermistor.thermistor">
            <Param label="ntc-thermistor.rAtReference" unit="Ω" value={r0} onChange={setR0} min={100} max={1e6} />
            <Param label="ntc-thermistor.beta" unit="K" value={beta} onChange={setBeta} min={2000} max={5000} log={false} step={10} />
            <Param label="ntc-thermistor.referenceTemp" unit="°C" value={t0C} onChange={setT0C} min={0} max={50} log={false} step={1} />
            <Param label="ntc-thermistor.dissipationConstant" unit="W/K" value={dissipation} onChange={setDissipation} min={0.0002} max={0.05} />
          </Group>
          <Group label="common.circuit">
            <Param label="common.seriesResistor" unit="Ω" value={rSeries} onChange={setRSeries} min={100} max={1e6} />
            <Param label="ntc-thermistor.temperatureNow" unit="°C" value={tempC} onChange={setTempC} min={-40} max={150} log={false} step={1} />
          </Group>
          <Group label="ntc-thermistor.sweepRange">
            <Param label="ntc-thermistor.from" unit="°C" value={sweepLow} onChange={setSweepLow} min={-50} max={50} log={false} step={5} />
            <Param label="ntc-thermistor.to" unit="°C" value={sweepHigh} onChange={setSweepHigh} min={30} max={200} log={false} step={5} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'ntc-thermistor.resistanceNow', value: formatSI(r.resistance, 'Ω'), note: <T k="ntc-thermistor.atC" vars={{ tempC }} /> },
          { label: 'common.dividerOutput', value: formatSI(r.vOut, 'V') },
          { label: 'common.sensitivity', value: `${(r.sensitivity * 1000).toFixed(2)} mV/K` },
          { label: 'ntc-thermistor.adcCountsPerK', value: r.countsPerK.toFixed(1) },
          { label: 'common.resolution', value: `${r.resolutionK.toFixed(3)} K`, note: 'common.perAdcCount' },
          { label: 'common.dividerCurrent', value: formatSI(r.current, 'A') },
          { label: 'ntc-thermistor.selfHeating', value: formatSI(r.selfHeatW, 'W'), warn: r.selfHeatSignificant },
          {
            label: 'ntc-thermistor.selfHeatingError',
            value: `${r.selfHeatK.toFixed(2)} K`,
            warn: r.selfHeatSignificant,
          },
        ]}
      />

      {r.selfHeatSignificant && (
        <Warning
          text="ntc-thermistor.warn1"
          vars={{ selfHeatW: formatSI(r.selfHeatW, 'W'), selfHeatK: r.selfHeatK.toFixed(2) }}
        />
      )}
      {rSeries !== r0 && (
        <Warning
          text="ntc-thermistor.warn2"
          vars={{ t0C, r0: formatSI(r0, 'Ω') }}
        />
      )}

      <Theory
        text={[
          'ntc-thermistor.theory1',
          'ntc-thermistor.steinhartHart1T',
          'ntc-thermistor.theCurveOnScreen',
          'ntc-thermistor.selfHeatingIsThe',
        ]}
      />
    </SimPage>
  )
}
