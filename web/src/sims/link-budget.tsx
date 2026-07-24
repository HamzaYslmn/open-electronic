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
import { Group, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

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
        { label: 'Prx', color: TRACE_COLORS[0], samples: prx },
        { label: 'sensitivity', color: TRACE_COLORS[4], samples: floor, quiet: true },
      ],
    }
  }, [radioKey, frequency, txDbm, gainTx, gainRx, extraLoss, distance, radio.sensitivity])

  return (
    <SimPage
      id="link-budget"
      lede="Will the link close? The scope sweeps received power against DISTANCE, not time: the horizontal axis runs from zero out past the maximum range, and the flat line is the receiver's sensitivity floor. Where they cross, the link dies."
      controls={
        <>
          <Group label="Radio">
            <Select label="Mode" value={radioKey} onChange={(k) => { setRadioKey(k); setTxDbm(RADIOS[k].txPower) }} options={RADIO_OPTIONS} />
            <Select
              label="Band"
              value={String(BANDS.findIndex((b) => b.frequency === frequency))}
              onChange={(i) => setFrequency(BANDS[Number(i)]?.frequency ?? frequency)}
              options={BAND_OPTIONS}
            />
            <Param label="Frequency" unit="Hz" value={frequency} onChange={setFrequency} min={1e6} max={10e9} />
          </Group>

          <Group label="Budget">
            <Param label="TX power" unit="dBm" value={txDbm} onChange={setTxDbm} min={-20} max={30} log={false} step={1} />
            <Param label="TX antenna gain" unit="dBi" value={gainTx} onChange={setGainTx} min={-10} max={25} log={false} step={0.5} />
            <Param label="RX antenna gain" unit="dBi" value={gainRx} onChange={setGainRx} min={-10} max={25} log={false} step={0.5} />
            <Param label="Cable and misc loss" unit="dB" value={extraLoss} onChange={setExtraLoss} min={0} max={30} log={false} step={0.5} />
            <Param label="Distance" unit="m" value={distance} onChange={setDistance} min={1} max={100_000} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="dBm" />

      <ReadoutGrid
        items={[
          { label: 'Free space path loss', value: `${r.fsplDb.toFixed(1)} dB` },
          { label: 'Total loss', value: `${r.totalLossDb.toFixed(1)} dB` },
          { label: 'EIRP', value: `${r.eirpDbm.toFixed(1)} dBm`, note: formatSI(r.eirpW, 'W') },
          { label: 'Received power', value: `${r.prxDbm.toFixed(1)} dBm`, note: formatSI(r.prxW, 'W') },
          { label: 'Sensitivity', value: `${radio.sensitivity} dBm` },
          {
            label: 'Link margin',
            value: `${r.marginDb.toFixed(1)} dB`,
            warn: r.linkFails || r.marginal,
          },
          { label: 'Range at 0 dB margin', value: formatSI(r.maxRange, 'm') },
          {
            label: `Range at ${MARGIN_MIN_DB} dB margin`,
            value: formatSI(r.reliableRange, 'm'),
            note: 'usable in practice',
          },
        ]}
      />

      {r.linkFails && (
        <Warning>
          The link does not close: received power is {Math.abs(r.marginDb).toFixed(1)} dB below
          the sensitivity floor. Halving the distance buys 6 dB, and so does doubling both
          antenna gains. A slower LoRa spreading factor buys far more.
        </Warning>
      )}
      {r.marginal && (
        <Warning>
          Only {r.marginDb.toFixed(1)} dB of margin. Free space loss is the best case: rain,
          foliage, a wall, a hand near the antenna or simple multipath fading each eat several
          dB. Aim for at least {MARGIN_MIN_DB} dB before calling a link dependable.
        </Warning>
      )}

      <Theory>
        <p>
          The whole budget is one line in dB:{' '}
          <code>Prx = Ptx + Gtx + Grx - FSPL - losses</code>, and the link closes when Prx sits
          above the receiver's sensitivity. Working in decibels turns every multiplication into
          an addition, which is the only reason this is tractable by hand.
        </p>
        <p>
          Free space path loss is <code>20·log10(d_km) + 20·log10(f_MHz) + 32.44</code>. Two
          consequences worth internalising: doubling the distance costs 6 dB, and so does
          doubling the frequency. That second one is why 868 MHz reaches so much further than
          2.4 GHz at the same power, before you even consider that lower frequencies penetrate
          obstacles better.
        </p>
        <p>
          Sensitivity is where LoRa earns its keep. Spreading the signal over more time buys
          processing gain: SF7 gets to about -123 dBm, SF12 to about -137 dBm. That 14 dB is a
          factor of five in range, paid for in data rate and airtime.
        </p>
        <p>
          Never design to zero margin. This model assumes clear line of sight with nothing in
          the first Fresnel zone, which almost never holds. Ten dB is a working minimum, and
          twenty is sensible for anything you cannot easily go and fix.
        </p>
      </Theory>
    </SimPage>
  )
}
