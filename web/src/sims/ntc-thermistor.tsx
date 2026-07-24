import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { analyseNtc, ntcResistance, toKelvin } from '../engine/sensing'
import { formatSI } from '../engine/units'
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
      traces: [{ label: 'Vout', color: TRACE_COLORS[0], samples: volts }],
    }
  }, [r0, beta, t0C, tempC, rSeries, dissipation, sweepLow, sweepHigh])

  return (
    <SimPage
      id="ntc-thermistor"
      lede="A thermistor is not linear, and that is the whole design problem. The scope sweeps divider output against TEMPERATURE, not time: the horizontal axis runs from the low to the high limit you set, in °C."
      controls={
        <>
          <Group label="Thermistor">
            <Param label="R at reference" unit="Ω" value={r0} onChange={setR0} min={100} max={1e6} />
            <Param label="Beta" unit="K" value={beta} onChange={setBeta} min={2000} max={5000} log={false} step={10} />
            <Param label="Reference temp" unit="°C" value={t0C} onChange={setT0C} min={0} max={50} log={false} step={1} />
            <Param label="Dissipation constant" unit="W/K" value={dissipation} onChange={setDissipation} min={0.0002} max={0.05} />
          </Group>
          <Group label="Circuit">
            <Param label="Series resistor" unit="Ω" value={rSeries} onChange={setRSeries} min={100} max={1e6} />
            <Param label="Temperature now" unit="°C" value={tempC} onChange={setTempC} min={-40} max={150} log={false} step={1} />
          </Group>
          <Group label="Sweep range">
            <Param label="From" unit="°C" value={sweepLow} onChange={setSweepLow} min={-50} max={50} log={false} step={5} />
            <Param label="To" unit="°C" value={sweepHigh} onChange={setSweepHigh} min={30} max={200} log={false} step={5} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'Resistance now', value: formatSI(r.resistance, 'Ω'), note: `at ${tempC} °C` },
          { label: 'Divider output', value: formatSI(r.vOut, 'V') },
          { label: 'Sensitivity', value: `${(r.sensitivity * 1000).toFixed(2)} mV/K` },
          { label: 'ADC counts per K', value: r.countsPerK.toFixed(1) },
          { label: 'Resolution', value: `${r.resolutionK.toFixed(3)} K`, note: 'per ADC count' },
          { label: 'Divider current', value: formatSI(r.current, 'A') },
          { label: 'Self heating', value: formatSI(r.selfHeatW, 'W'), warn: r.selfHeatSignificant },
          {
            label: 'Self heating error',
            value: `${r.selfHeatK.toFixed(2)} K`,
            warn: r.selfHeatSignificant,
          },
        ]}
      />

      {r.selfHeatSignificant && (
        <Warning>
          The bead is dissipating {formatSI(r.selfHeatW, 'W')}, warming itself by{' '}
          {r.selfHeatK.toFixed(2)} K. It is measuring its own current, not the ambient. Raise
          the series resistor, or switch the divider on only while sampling.
        </Warning>
      )}
      {rSeries !== r0 && (
        <Warning>
          Sensitivity peaks when the series resistor equals the thermistor's resistance at the
          temperature you care most about. For best resolution around {t0C} °C, set the series
          resistor to {formatSI(r0, 'Ω')}.
        </Warning>
      )}

      <Theory>
        <p>
          The Beta equation is <code>1/T = 1/T0 + ln(R/R0)/B</code>, rearranged to{' '}
          <code>R = R0·exp(B·(1/T - 1/T0))</code>. One parameter, one calibration point, good
          to about half a kelvin over a 50 K span. Datasheets quote different B values for
          different intervals, e.g. B25/85, precisely because it is only a local fit.
        </p>
        <p>
          Steinhart-Hart, <code>1/T = A + B·ln(R) + C·ln(R)³</code>, gets to a few millikelvin
          over a wide range but needs three calibration points. The Beta form is the special
          case with C = 0.
        </p>
        <p>
          The curve on screen is the real design constraint. Sensitivity is highest where the
          thermistor's resistance matches the series resistor, and falls away at both ends: at
          high temperature the thermistor is a short next to the fixed resistor, and at low
          temperature it swamps it. So a 10k NTC with a 10k series resistor resolves beautifully
          near 25 °C and poorly at 120 °C.
        </p>
        <p>
          Self heating is the trap. Current through the bead makes heat, the dissipation
          constant (typically 1 to 5 mW/K in still air) converts that to a temperature error,
          and the sensor confidently reports it. Keep the current small, or power the divider
          only for the microseconds you are sampling.
        </p>
      </Theory>
    </SimPage>
  )
}
