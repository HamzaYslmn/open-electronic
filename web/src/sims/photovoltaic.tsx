import { useMemo, useState } from 'react'
import {
  G_STC,
  T_STC_K,
  analyse,
  ivCurve,
  paramsAt,
} from '../engine/photovoltaic'
import type { PanelSpec } from '../engine/photovoltaic'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 2048
const KELVIN_OFFSET = 273.15

export default function Photovoltaic() {
  const [cells, setCells] = useState(60)
  const [isc, setIsc] = useState(8.8)
  const [voc, setVoc] = useState(37.5)
  const [ideality, setIdeality] = useState(1.2)
  const [rs, setRs] = useState(0.35)
  const [rsh, setRsh] = useState(300)
  const [cellEdge, setCellEdge] = useState(0.156)
  const [irradiance, setIrradiance] = useState(G_STC)
  const [cellTempC, setCellTempC] = useState(T_STC_K - KELVIN_OFFSET)

  const { traces, dv, r } = useMemo(() => {
    const spec: PanelSpec = { cells, iscStc: isc, vocStc: voc, ideality, rs, rsh, cellEdge }
    const cond = { irradiance, cellTempK: cellTempC + KELVIN_OFFSET }
    const r = analyse(spec, cond)
    const curve = ivCurve(paramsAt(spec, cond), r.now.voc, N)
    return {
      r,
      // The horizontal axis is volts, not seconds. The scope draws whatever
      // array it is handed, so dv per sample stands in for dt.
      dv: curve.dv,
      traces: [
        { label: 'I', color: TRACE_COLORS[0], samples: curve.amps },
        { label: 'P/10', color: TRACE_COLORS[3], samples: curve.watts.map((w) => w / 10) },
      ],
    }
  }, [cells, isc, voc, ideality, rs, rsh, cellEdge, irradiance, cellTempC])

  return (
    <SimPage
      id="photovoltaic"
      lede="Single diode model of a silicon panel. The scope plots the I-V and P-V curves against PANEL VOLTAGE, not time: the horizontal axis runs 0 V to Voc. Power is scaled down by 10 so it shares the axis with current."
      controls={
        <>
          <Group label="Panel (datasheet, at STC)">
            <Param label="Cells in series" value={cells} onChange={(v) => setCells(Math.round(v))} min={1} max={144} log={false} step={1} />
            <Param label="Isc" unit="A" value={isc} onChange={setIsc} min={0.05} max={20} />
            <Param label="Voc" unit="V" value={voc} onChange={setVoc} min={0.4} max={100} />
            <Param label="Cell edge" unit="m" value={cellEdge} onChange={setCellEdge} min={0.01} max={0.25} log={false} step={0.001} />
          </Group>

          <Group label="Model parameters">
            <Param label="Ideality n" value={ideality} onChange={setIdeality} min={1} max={2} log={false} step={0.01} />
            <Param label="Series Rs" unit="Ω" value={rs} onChange={setRs} min={0.001} max={5} />
            <Param label="Shunt Rsh" unit="Ω" value={rsh} onChange={setRsh} min={5} max={100_000} />
          </Group>

          <Group label="Conditions">
            <Param label="Irradiance" unit="W/m²" value={irradiance} onChange={setIrradiance} min={1} max={1400} log={false} step={10} />
            <Param label="Cell temperature" unit="°C" value={cellTempC} onChange={setCellTempC} min={-40} max={85} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dv} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'Pmp', value: formatSI(r.now.pmp, 'W') },
          { label: 'Vmp', value: formatSI(r.now.vmp, 'V') },
          { label: 'Imp', value: formatSI(r.now.imp, 'A') },
          { label: 'Voc', value: formatSI(r.now.voc, 'V') },
          { label: 'Isc', value: formatSI(r.now.isc, 'A') },
          {
            label: 'Fill factor',
            value: r.now.ff.toFixed(3),
            note: r.poorFill ? '(poor)' : '(healthy)',
            warn: r.poorFill,
          },
          { label: 'Efficiency', value: `${(r.efficiency * 100).toFixed(1)}%`, note: <T k="over {area} m²" vars={{ area: r.area.toFixed(2) }} /> },
          { label: 'Pmp at STC', value: formatSI(r.stc.pmp, 'W'), note: '1000 W/m², 25 °C' },
          {
            label: 'Voc temp coeff',
            value: `${(r.betaVoc * 1000).toFixed(1)} mV/K`,
            note: `${(r.betaVocFrac * 100).toFixed(2)} %/K`,
          },
          {
            label: 'Pmp temp coeff',
            value: `${r.gammaPmp.toFixed(3)} W/K`,
            note: `${(r.gammaPmpFrac * 100).toFixed(2)} %/K`,
          },
          { label: 'Series loss', value: formatSI(r.seriesLoss, 'W'), note: 'Imp²·Rs' },
          { label: 'Shunt loss', value: formatSI(r.shuntLoss, 'W'), note: 'leaked through Rsh' },
        ]}
      />

      {r.shuntLimited && (
        <Warning
          text="Shunt resistance is too low to support the stated Voc, so the model collapses Voc toward Iph·Rsh. Raise Rsh or lower Voc: a real panel this shunted would be faulty."
        />
      )}
      {r.lowLight && (
        <Warning
          text="Below 100 W/m² the single diode model gets optimistic. Real panels lose fill factor faster than this in low light because the shunt path dominates."
        />
      )}
      {r.tempOutOfRange && (
        <Warning text="Cell temperature is outside the range this model was fitted over." />
      )}

      <Theory
        text={[
          "The single diode model is `I = Iph - I0·(e^((V + I·Rs)/a) - 1) - (V + I·Rs)/Rsh`, where `a = Ns·n·k·T/q` is the modified thermal voltage of the whole series string. It is implicit in I, so the solver iterates rather than evaluating a formula.",
          "Photocurrent scales almost exactly with irradiance, which is why Isc tracks sunlight linearly. Voc only moves with the logarithm of irradiance, so a panel in cloud keeps most of its voltage and loses current.",
          "Temperature works the other way. Isc creeps up a little, but I0 climbs steeply with T, so Voc falls about 0.3% per kelvin and takes Pmp with it. This is why a cold bright day outperforms a hot one, and why panel Vmp must be checked at the lowest expected temperature when sizing a string against an MPPT input.",
          "Fill factor `Pmp / (Voc·Isc)` measures how square the knee is. Series resistance flattens the top of the curve and shunt resistance tilts the flat current region, both dragging FF down from the 0.75 to 0.82 a healthy c-Si module shows.",
        ]}
      />
    </SimPage>
  )
}
