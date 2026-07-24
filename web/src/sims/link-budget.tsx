import { useMemo, useState } from 'react'
import {
  BANDS,
  MARGIN_MIN_DB,
  RADIOS,
  RADIO_OPTIONS,
  analyseLink,
  fspl,
} from '../engine/rf'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Select, SimPage, Theory, TRACE_COLORS, Warning } from '../ui'

const N = 1024
const BAND_OPTIONS = BANDS.map((b, i) => ({ value: String(i), label: b.label }))

export default function LinkBudget() {
  const [radioKey, setRadioKey] = useState('lora-sf12')
  const [frequency, setFrequency] = useState(868e6)
  const [txDbm, setTxDbm] = useState(14)
  const [gainTx, setGainTx] = useState(2)
  const [gainRx, setGainRx] = useState(2)
  const [extraLoss, setExtraLoss] = useState(2)
  const [distance, setDistance] = useState(2000)

  const radio = RADIOS[radioKey]

  const { r, traces, dt } = useMemo(() => {
    const r = analyseLink(txDbm, gainTx, gainRx, extraLoss, distance, frequency, radio.sensitivity)
    // Sweep received power against distance out to twice the maximum range, so
    // the crossing of the sensitivity floor is visible on the trace.
    const span = Math.max(r.maxRange * 2, distance * 1.5, 100)
    const step = span / N
    const prx = new Float64Array(N)
    const floor = new Float64Array(N).fill(radio.sensitivity)
    for (let i = 0; i < N; i++) {
      const d = Math.max((i + 1) * step, 1)
      prx[i] = txDbm + gainTx + gainRx - fspl(d, frequency) - extraLoss
    }
    return {
      r,
      dt: step,
      traces: [
        { label: 'link-budget.prx', color: TRACE_COLORS[0], samples: prx },
        { label: 'link-budget.sensitivity', color: TRACE_COLORS[4], samples: floor, quiet: true },
      ],
    }
  }, [radioKey, frequency, txDbm, gainTx, gainRx, extraLoss, distance, radio.sensitivity])

  return (
    <SimPage
      id="link-budget"
      lede="link-budget.lede"
      controls={
        <>
          <Group label="link-budget.radio">
            <Select label="common.mode" value={radioKey} onChange={(k) => { setRadioKey(k); setTxDbm(RADIOS[k].txPower) }} options={RADIO_OPTIONS} />
            <Select
              label="link-budget.band"
              value={String(BANDS.findIndex((b) => b.frequency === frequency))}
              onChange={(i) => setFrequency(BANDS[Number(i)]?.frequency ?? frequency)}
              options={BAND_OPTIONS}
            />
            <Param label="common.frequency" unit="Hz" value={frequency} onChange={setFrequency} min={1e6} max={10e9} />
          </Group>

          <Group label="link-budget.budget">
            <Param label="link-budget.txPower" unit="dBm" value={txDbm} onChange={setTxDbm} min={-20} max={30} log={false} step={1} />
            <Param label="link-budget.txAntennaGain" unit="dBi" value={gainTx} onChange={setGainTx} min={-10} max={25} log={false} step={0.5} />
            <Param label="link-budget.rxAntennaGain" unit="dBi" value={gainRx} onChange={setGainRx} min={-10} max={25} log={false} step={0.5} />
            <Param label="link-budget.cableAndMiscLoss" unit="dB" value={extraLoss} onChange={setExtraLoss} min={0} max={30} log={false} step={0.5} />
            <Param label="link-budget.distance" unit="m" value={distance} onChange={setDistance} min={1} max={100_000} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="dBm" />

      <ReadoutGrid
        items={[
          { label: 'link-budget.freeSpacePathLoss', value: `${r.fsplDb.toFixed(1)} dB` },
          { label: 'common.totalLoss', value: `${r.totalLossDb.toFixed(1)} dB` },
          { label: 'link-budget.eirp', value: `${r.eirpDbm.toFixed(1)} dBm`, note: formatSI(r.eirpW, 'W') },
          { label: 'link-budget.receivedPower', value: `${r.prxDbm.toFixed(1)} dBm`, note: formatSI(r.prxW, 'W') },
          { label: 'common.sensitivity', value: `${radio.sensitivity} dBm` },
          {
            label: 'link-budget.linkMargin',
            value: `${r.marginDb.toFixed(1)} dB`,
            warn: r.linkFails || r.marginal,
          },
          { label: 'link-budget.rangeAt0Db', value: formatSI(r.maxRange, 'm') },
          {
            label: <T k="link-budget.rangeAtDbMargin" vars={{ MARGIN_MIN_DB }} />,
            value: formatSI(r.reliableRange, 'm'),
            note: 'link-budget.usableInPractice',
          },
        ]}
      />

      <Warning when={r.linkFails}
        text="link-budget.warn1"
        vars={{ marginDb: Math.abs(r.marginDb).toFixed(1) }}
      />
      <Warning when={r.marginal}
        text="link-budget.warn2"
        vars={{ marginDb: r.marginDb.toFixed(1), MARGIN_MIN_DB }}
      />

      <Theory
        text={[
          'link-budget.theory1',
          'link-budget.freeSpacePathLoss2',
          'link-budget.sensitivityIsWhereLora',
          'link-budget.neverDesignToZero',
        ]}
      />
    </SimPage>
  )
}
