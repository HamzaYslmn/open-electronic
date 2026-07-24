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
      lede="photovoltaic.lede"
      controls={
        <>
          <Group label="photovoltaic.panelDatasheetAtStc">
            <Param label="common.cellsInSeries" value={cells} onChange={(v) => setCells(Math.round(v))} min={1} max={144} log={false} step={1} />
            <Param label="photovoltaic.isc" unit="A" value={isc} onChange={setIsc} min={0.05} max={20} />
            <Param label="photovoltaic.voc" unit="V" value={voc} onChange={setVoc} min={0.4} max={100} />
            <Param label="photovoltaic.cellEdge" unit="m" value={cellEdge} onChange={setCellEdge} min={0.01} max={0.25} log={false} step={0.001} />
          </Group>

          <Group label="photovoltaic.modelParameters">
            <Param label="photovoltaic.idealityN" value={ideality} onChange={setIdeality} min={1} max={2} log={false} step={0.01} />
            <Param label="common.seriesRs" unit="Ω" value={rs} onChange={setRs} min={0.001} max={5} />
            <Param label="photovoltaic.shuntRsh" unit="Ω" value={rsh} onChange={setRsh} min={5} max={100_000} />
          </Group>

          <Group label="photovoltaic.conditions">
            <Param label="photovoltaic.irradiance" unit="W/m²" value={irradiance} onChange={setIrradiance} min={1} max={1400} log={false} step={10} />
            <Param label="photovoltaic.cellTemperature" unit="°C" value={cellTempC} onChange={setCellTempC} min={-40} max={85} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dv} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'photovoltaic.pmp', value: formatSI(r.now.pmp, 'W') },
          { label: 'photovoltaic.vmp', value: formatSI(r.now.vmp, 'V') },
          { label: 'photovoltaic.imp', value: formatSI(r.now.imp, 'A') },
          { label: 'photovoltaic.voc', value: formatSI(r.now.voc, 'V') },
          { label: 'photovoltaic.isc', value: formatSI(r.now.isc, 'A') },
          {
            label: 'photovoltaic.fillFactor',
            value: r.now.ff.toFixed(3),
            note: r.poorFill ? 'photovoltaic.poor' : 'photovoltaic.healthy',
            warn: r.poorFill,
          },
          { label: 'common.efficiency', value: `${(r.efficiency * 100).toFixed(1)}%`, note: <T k="photovoltaic.overM" vars={{ area: r.area.toFixed(2) }} /> },
          { label: 'photovoltaic.pmpAtStc', value: formatSI(r.stc.pmp, 'W'), note: '1000 W/m², 25 °C' },
          {
            label: 'photovoltaic.vocTempCoeff',
            value: `${(r.betaVoc * 1000).toFixed(1)} mV/K`,
            note: `${(r.betaVocFrac * 100).toFixed(2)} %/K`,
          },
          {
            label: 'photovoltaic.pmpTempCoeff',
            value: `${r.gammaPmp.toFixed(3)} W/K`,
            note: `${(r.gammaPmpFrac * 100).toFixed(2)} %/K`,
          },
          { label: 'photovoltaic.seriesLoss', value: formatSI(r.seriesLoss, 'W'), note: 'photovoltaic.impRs' },
          { label: 'photovoltaic.shuntLoss', value: formatSI(r.shuntLoss, 'W'), note: 'photovoltaic.leakedThroughRsh' },
        ]}
      />

      {r.shuntLimited && (
        <Warning
          text="photovoltaic.warn1"
        />
      )}
      {r.lowLight && (
        <Warning
          text="photovoltaic.warn2"
        />
      )}
      {r.tempOutOfRange && (
        <Warning text="photovoltaic.warn3" />
      )}

      <Theory
        text={[
          'photovoltaic.theory1',
          'photovoltaic.photocurrentScalesAlmostExactly',
          'photovoltaic.temperatureWorksTheOther',
          'photovoltaic.fillFactorPmpVoc',
        ]}
      />
    </SimPage>
  )
}
