import { useMemo, useState } from 'react'
import { analyse, waveform } from '../engine/buckBoost'
import type { Topology } from '../engine/buckBoost'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Segmented, SimPage, Theory, Toggle, TRACE_COLORS, Warning } from '../ui'

const N = 4096

const MODE_LABEL: Record<string, string> = {
  buck: 'stepping down',
  boost: 'stepping up',
  'buck-boost': 'both legs active',
}

export default function BuckBoost() {
  const [topology, setTopology] = useState<Topology>('four-switch')
  const [vin, setVin] = useState(5)
  const [vout, setVout] = useState(3.3)
  const [iout, setIout] = useState(0.5)
  const [l, setL] = useState(22e-6)
  const [isat, setIsat] = useState(3)
  const [dcr, setDcr] = useState(0.05)
  const [cout, setCout] = useState(47e-6)
  const [esr, setEsr] = useState(0.03)
  const [fsw, setFsw] = useState(500e3)
  const [rds, setRds] = useState(0.05)
  const [vf, setVf] = useState(0.4)
  const [forceCascaded, setForceCascaded] = useState(false)
  const [periods, setPeriods] = useState(3)

  const { r, traces, dt } = useMemo(() => {
    const design = {
      vin, vout, iout, l, isat, dcr, cout, esr, fsw, rds, vf, topology, forceCascaded,
    }
    const r = analyse(design)
    const w = waveform(r.op, fsw, N, periods)
    return {
      r,
      dt: w.dt,
      traces: [
        { label: 'common.il', color: TRACE_COLORS[0], samples: w.il },
        { label: 'buck-boost.isw', color: TRACE_COLORS[1], samples: w.iSwitch },
        { label: 'buck-boost.irect', color: TRACE_COLORS[3], samples: w.iRect },
      ],
    }
  }, [topology, vin, vout, iout, l, isat, dcr, cout, esr, fsw, rds, vf, forceCascaded, periods])

  return (
    <SimPage
      id="buck-boost"
      lede="buck-boost.lede"
      controls={
        <>
          <Segmented
            label="common.topology"
            value={topology}
            onChange={setTopology}
            options={[
              { value: 'four-switch', label: 'buck-boost.4Switch' },
              { value: 'inverting', label: 'common.inverting' },
            ]}
          />

          <Group label="common.operatingPoint">
            <Param label="common.vin" unit="V" value={vin} onChange={setVin} min={0.5} max={60} />
            <Param label="buck-boost.vout" unit="V" value={vout} onChange={setVout} min={0.5} max={60} />
            <Param label="common.loadCurrent" unit="A" value={iout} onChange={setIout} min={0.001} max={20} />
            <Param label="common.switchingFreq" unit="Hz" value={fsw} onChange={setFsw} min={10e3} max={3e6} />
            {topology === 'four-switch' && (
              <Toggle label="buck-boost.forceBothLegs" value={forceCascaded} onChange={setForceCascaded} />
            )}
          </Group>

          <Group label="common.powerStage">
            <Param label="common.inductance" unit="H" value={l} onChange={setL} min={1e-7} max={1e-3} />
            <Param label="common.saturationCurrent" unit="A" value={isat} onChange={setIsat} min={0.1} max={50} />
            <Param label="common.inductorDcr" unit="Ω" value={dcr} onChange={setDcr} min={0.001} max={2} />
            <Param label="common.outputCap" unit="F" value={cout} onChange={setCout} min={1e-7} max={1e-2} />
            <Param label="common.capEsr" unit="Ω" value={esr} onChange={setEsr} min={0.0005} max={1} />
            <Param label="common.fetRdsOn" unit="Ω" value={rds} onChange={setRds} min={0.001} max={1} />
            {topology === 'inverting' && (
              <Param label="common.diodeVf" unit="V" value={vf} onChange={setVf} min={0.15} max={1.2} log={false} step={0.05} />
            )}
            <Param label="common.periodsShown" value={periods} onChange={setPeriods} int min={1} max={10} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'common.output', value: formatSI(r.voutSigned, 'V'), note: MODE_LABEL[r.op.mode] },
          { label: 'common.duty', value: `${(r.op.duty * 100).toFixed(1)}%`, note: <T k="common.ideal" vars={{ dutyIdeal: (r.op.dutyIdeal * 100).toFixed(1) }} />, warn: r.dutyLimited },
          { label: 'common.conduction', value: r.op.conduction.toUpperCase(), note: r.op.conduction === 'dcm' ? 'buck-boost.currentHitsZero' : 'common.continuous' },
          { label: 'buck-boost.conversionRatio', value: `${r.ratio.toFixed(3)}x` },
          { label: 'buck-boost.inductorAverage', value: formatSI(r.op.ilAvg, 'A') },
          { label: 'common.inductorRipple', value: formatSI(r.op.dIl, 'A'), note: <T k="buck-boost.ofAverage" vars={{ rippleRatio: (r.rippleRatio * 100).toFixed(0) }} /> },
          { label: 'buck-boost.inductorPeak', value: formatSI(r.op.ilPeak, 'A'), note: <T k="buck-boost.isat" vars={{ isat: formatSI(isat, 'A') }} />, warn: r.saturating },
          { label: 'common.inductorRms', value: formatSI(r.op.ilRms, 'A') },
          { label: 'common.inputCurrent', value: formatSI(r.iinAvg, 'A') },
          { label: 'common.outputRipple', value: formatSI(r.vRipple, 'V'), note: <T k="buck-boost.capEsr" vars={{ vRippleCap: formatSI(r.vRippleCap, 'V'), vRippleEsr: formatSI(r.vRippleEsr, 'V') }} /> },
          { label: 'buck-boost.coutRippleCurrent', value: formatSI(r.icoutRms, 'A'), note: 'buck-boost.rms' },
          { label: 'buck-boost.cinRippleCurrent', value: formatSI(r.icinRms, 'A'), note: 'buck-boost.rms' },
          { label: 'buck-boost.switchStress', value: formatSI(r.vSwitch, 'V') },
          { label: 'buck-boost.rectifierStress', value: formatSI(r.vRect, 'V') },
          { label: 'buck-boost.lFor40Ripple', value: formatSI(r.lTarget, 'H'), note: 'buck-boost.designTarget' },
          { label: 'buck-boost.lAtDcmBoundary', value: formatSI(r.lCrit, 'H') },
          { label: 'common.outputPower', value: formatSI(r.pOut, 'W') },
          { label: 'common.efficiency', value: `${(r.efficiency * 100).toFixed(1)}%`, note: <T k="buck-boost.loss" vars={{ total: formatSI(r.losses.total, 'W') }} /> },
        ]}
      />

      <Warning when={!r.op.reachable}
        text="buck-boost.warn1"
      />
      <Warning when={r.saturating}
        text="buck-boost.warn2"
        vars={{ ilPeak: formatSI(r.op.ilPeak, 'A'), isat: formatSI(isat, 'A') }}
      />
      <Warning when={r.dutyLimited}
        text="buck-boost.warn3"
      />
      <Warning when={r.op.conduction === 'dcm'}
        text="buck-boost.warn4"
      />

      <Theory
        text={[
          'buck-boost.theory1',
          'buck-boost.theFourSwitchStage',
          'buck-boost.rippleIsDilVl',
          'buck-boost.outputRippleHasTwo',
        ]}
      />
    </SimPage>
  )
}
