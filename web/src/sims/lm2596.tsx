import { useMemo, useState } from 'react'
import {
  FSW,
  IOUT_MAX,
  TJ_MAX,
  VIN_MAX,
  VIN_MIN,
  VREF,
  analyse,
  inductorWave,
} from '../engine/lm2596'
import { SERIES_NAMES } from '../engine/eseries'
import type { SeriesName } from '../engine/eseries'
import { formatSI } from '../engine/units'
import { T, sym } from '../i18n'
import { Group, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 4096

const SERIES_OPTIONS = SERIES_NAMES.map((value) => ({ value, label: sym(value) }))

export default function Lm2596() {
  // The LM2596 is a step-down module, so its input is well above the 3.3 V rail
  // this project defaults to. 12 V in, 5 V out is the commonest use of it.
  const [vin, setVin] = useState(12)
  const [voutTarget, setVoutTarget] = useState(5)
  const [iout, setIout] = useState(1)
  const [r1, setR1] = useState(1000)
  const [series, setSeries] = useState<SeriesName>('E24')
  const [l, setL] = useState(33e-6)
  const [cout, setCout] = useState(220e-6)
  const [esr, setEsr] = useState(0.08)
  const [vd, setVd] = useState(0.5)
  const [dcr, setDcr] = useState(0.05)
  const [thetaJA, setThetaJA] = useState(50)
  const [tAmbC, setTAmbC] = useState(25)
  const [cycles, setCycles] = useState(3)

  const { r, traces, dt } = useMemo(() => {
    const r = analyse({
      vin, voutTarget, iout, r1, series, l, cout, esr, vd, dcr, thetaJA, tAmbC,
    })
    const w = inductorWave(r.op, cycles, N)
    return {
      r,
      dt: w.dt,
      traces: [{ label: 'common.il', color: TRACE_COLORS[0], samples: w.samples }],
    }
  }, [vin, voutTarget, iout, r1, series, l, cout, esr, vd, dcr, thetaJA, tAmbC, cycles])

  return (
    <SimPage
      id="lm2596"
      lede="lm2596.lede"
      controls={
        <>
          <Group label="common.operatingPoint">
            <Param label="common.vin" unit="V" value={vin} onChange={setVin} min={3} max={45} log={false} step={0.5} />
            <Param label="lm2596.voutTarget" unit="V" value={voutTarget} onChange={setVoutTarget} min={1} max={38} log={false} step={0.1} />
            <Param label="common.loadCurrent" unit="A" value={iout} onChange={setIout} min={0.01} max={4} log={false} step={0.05} />
          </Group>

          <Group label="lm2596.feedbackDivider">
            <Param label="lm2596.r1FbToGnd" unit="Ω" value={r1} onChange={setR1} min={200} max={20_000} />
            <Select label="lm2596.resistorSeries" value={series} onChange={setSeries} options={SERIES_OPTIONS} />
          </Group>

          <Group label="common.powerStage">
            <Param label="common.inductor" unit="H" value={l} onChange={setL} min={4.7e-6} max={470e-6} />
            <Param label="common.inductorDcr" unit="Ω" value={dcr} onChange={setDcr} min={0.005} max={1} />
            <Param label="common.outputCap" unit="F" value={cout} onChange={setCout} min={1e-6} max={4.7e-3} />
            <Param label="common.capEsr" unit="Ω" value={esr} onChange={setEsr} min={0.001} max={2} />
            <Param label="common.diodeVf" unit="V" value={vd} onChange={setVd} min={0.2} max={1} log={false} step={0.05} />
            <Param label="common.periodsShown" value={cycles} onChange={(v) => setCycles(Math.round(v))} min={1} max={10} log={false} step={1} />
          </Group>

          <Group label="common.thermal">
            <Param label="lm2596.thetaJa" unit="°C/W" value={thetaJA} onChange={setThetaJA} min={10} max={120} log={false} step={1} />
            <Param label="common.ambient" unit="°C" value={tAmbC} onChange={setTAmbC} min={-20} max={70} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'lm2596.r2Ideal', value: formatSI(r.r2Ideal, 'Ω') },
          { label: <T k="lm2596.r2From" vars={{ series }} />, value: formatSI(r.r2, 'Ω') },
          {
            label: 'lm2596.actualVout',
            value: formatSI(r.vout, 'V'),
            note: <T k="lm2596.offTarget" vars={{ voutError: (r.voutError * 100).toFixed(2) }} />,
            warn: Math.abs(r.voutError) > 0.05,
          },
          { label: 'common.dividerCurrent', value: formatSI(r.dividerCurrent, 'A') },
          { label: 'common.duty', value: `${(r.op.duty * 100).toFixed(1)}%`, note: <T k="common.ideal" vars={{ dutyIdeal: (r.op.dutyIdeal * 100).toFixed(1) }} /> },
          { label: 'common.inductorRipple', value: formatSI(r.op.ripple, 'A') },
          { label: 'common.peakCurrent', value: formatSI(r.op.ipk, 'A'), warn: r.overLimit },
          { label: 'common.outputRipple', value: formatSI(r.vripple, 'V'), note: <T k="lm2596.esrCap" vars={{ vrippleEsr: formatSI(r.vrippleEsr, 'V'), vrippleCap: formatSI(r.vrippleCap, 'V') }} /> },
          { label: 'common.inputCurrent', value: formatSI(r.iin, 'A') },
          { label: 'common.outputPower', value: formatSI(r.pOut, 'W') },
          { label: 'common.totalLoss', value: formatSI(r.pLoss, 'W') },
          { label: 'common.efficiency', value: `${(r.efficiency * 100).toFixed(1)}%` },
          { label: 'lm2596.lossInTheIc', value: formatSI(r.pIc, 'W'), note: 'lm2596.setsItsTemperature' },
          { label: 'lm2596.diodeLoss', value: formatSI(r.pDiode, 'W') },
          {
            label: 'common.junctionTemp',
            value: `${r.tj.toFixed(0)} °C`,
            note: <T k="lm2596.maxC" vars={{ TJ_MAX }} />,
            warn: r.overTemp,
          },
          {
            label: 'lm2596.minimumVin',
            value: formatSI(r.vinMinimum, 'V'),
            note: <T k="lm2596.headroom" vars={{ headroom: formatSI(r.headroom, 'V') }} />,
            warn: r.dropout,
          },
          { label: 'common.conduction', value: r.dcm ? 'common.dcm' : 'common.ccm', warn: r.dcm },
          { label: 'common.switchingFreq', value: formatSI(FSW, 'Hz'), note: 'lm2596.fixed' },
        ]}
      />

      {r.dropout && (
        <Warning
          text="lm2596.warn1"
          vars={{ vinMinimum: formatSI(r.vinMinimum, 'V') }}
        />
      )}
      {r.vinLow && (
        <Warning
          text="lm2596.warn2"
          vars={{ VIN_MIN }}
        />
      )}
      {r.vinHigh && (
        <Warning
          text="lm2596.warn3"
          vars={{ VIN_MAX }}
        />
      )}
      {r.overCurrent && (
        <Warning
          text="lm2596.warn4"
          vars={{ IOUT_MAX }}
        />
      )}
      {r.overLimit && (
        <Warning
          text="lm2596.warn5"
        />
      )}
      {r.overTemp && (
        <Warning
          text="lm2596.warn6"
          vars={{ tj: r.tj.toFixed(0), TJ_MAX }}
        />
      )}
      {r.voutBelowRef && (
        <Warning
          text="lm2596.warn7"
          vars={{ VREF }}
        />
      )}

      <Theory
        text={[
          'lm2596.theory1',
          'lm2596.theSwitchingFrequencyIs',
          'lm2596.efficiencyIsDominatedBy',
          'lm2596.theThermalCheckIs',
        ]} vars={{ VREF }}
      />
    </SimPage>
  )
}
