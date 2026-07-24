import { useMemo, useState } from 'react'
import { analyse, waveform } from '../engine/buckBoost'
import type { Topology } from '../engine/buckBoost'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Segmented, Toggle } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

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
        { label: 'IL', color: TRACE_COLORS[0], samples: w.il },
        { label: 'Isw', color: TRACE_COLORS[1], samples: w.iSwitch },
        { label: 'Irect', color: TRACE_COLORS[3], samples: w.iRect },
      ],
    }
  }, [topology, vin, vout, iout, l, isat, dcr, cout, esr, fsw, rds, vf, forceCascaded, periods])

  return (
    <SimPage
      id="buck-boost"
      lede="A converter that works whether the input is above or below the output, which is exactly the ESP32-on-a-LiPo problem: a cell runs 4.2 V down to 3.0 V while the rail must hold 3.3 V. The scope shows inductor, switch and rectifier current over a few switching periods."
      controls={
        <>
          <Segmented
            label="Topology"
            value={topology}
            onChange={setTopology}
            options={[
              { value: 'four-switch', label: '4-switch' },
              { value: 'inverting', label: 'Inverting' },
            ]}
          />

          <Group label="Operating point">
            <Param label="Vin" unit="V" value={vin} onChange={setVin} min={0.5} max={60} />
            <Param label="|Vout|" unit="V" value={vout} onChange={setVout} min={0.5} max={60} />
            <Param label="Load current" unit="A" value={iout} onChange={setIout} min={0.001} max={20} />
            <Param label="Switching freq" unit="Hz" value={fsw} onChange={setFsw} min={10e3} max={3e6} />
            {topology === 'four-switch' && (
              <Toggle label="Force both legs" value={forceCascaded} onChange={setForceCascaded} />
            )}
          </Group>

          <Group label="Power stage">
            <Param label="Inductance" unit="H" value={l} onChange={setL} min={1e-7} max={1e-3} />
            <Param label="Saturation current" unit="A" value={isat} onChange={setIsat} min={0.1} max={50} />
            <Param label="Inductor DCR" unit="Ω" value={dcr} onChange={setDcr} min={0.001} max={2} />
            <Param label="Output cap" unit="F" value={cout} onChange={setCout} min={1e-7} max={1e-2} />
            <Param label="Cap ESR" unit="Ω" value={esr} onChange={setEsr} min={0.0005} max={1} />
            <Param label="FET Rds(on)" unit="Ω" value={rds} onChange={setRds} min={0.001} max={1} />
            {topology === 'inverting' && (
              <Param label="Diode Vf" unit="V" value={vf} onChange={setVf} min={0.15} max={1.2} log={false} step={0.05} />
            )}
            <Param label="Periods shown" value={periods} onChange={(v) => setPeriods(Math.round(v))} min={1} max={10} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'Output', value: formatSI(r.voutSigned, 'V'), note: MODE_LABEL[r.op.mode] },
          { label: 'Duty', value: `${(r.op.duty * 100).toFixed(1)}%`, note: <T k="ideal {dutyIdeal}%" vars={{ dutyIdeal: (r.op.dutyIdeal * 100).toFixed(1) }} />, warn: r.dutyLimited },
          { label: 'Conduction', value: r.op.conduction.toUpperCase(), note: r.op.conduction === 'dcm' ? 'current hits zero' : 'continuous' },
          { label: 'Conversion ratio', value: `${r.ratio.toFixed(3)}x` },
          { label: 'Inductor average', value: formatSI(r.op.ilAvg, 'A') },
          { label: 'Inductor ripple', value: formatSI(r.op.dIl, 'A'), note: <T k="{rippleRatio}% of average" vars={{ rippleRatio: (r.rippleRatio * 100).toFixed(0) }} /> },
          { label: 'Inductor peak', value: formatSI(r.op.ilPeak, 'A'), note: <T k="Isat {isat}" vars={{ isat: formatSI(isat, 'A') }} />, warn: r.saturating },
          { label: 'Inductor RMS', value: formatSI(r.op.ilRms, 'A') },
          { label: 'Input current', value: formatSI(r.iinAvg, 'A') },
          { label: 'Output ripple', value: formatSI(r.vRipple, 'V'), note: <T k="cap {vRippleCap} + esr {vRippleEsr}" vars={{ vRippleCap: formatSI(r.vRippleCap, 'V'), vRippleEsr: formatSI(r.vRippleEsr, 'V') }} /> },
          { label: 'Cout ripple current', value: formatSI(r.icoutRms, 'A'), note: 'RMS' },
          { label: 'Cin ripple current', value: formatSI(r.icinRms, 'A'), note: 'RMS' },
          { label: 'Switch stress', value: formatSI(r.vSwitch, 'V') },
          { label: 'Rectifier stress', value: formatSI(r.vRect, 'V') },
          { label: 'L for 40% ripple', value: formatSI(r.lTarget, 'H'), note: 'design target' },
          { label: 'L at DCM boundary', value: formatSI(r.lCrit, 'H') },
          { label: 'Output power', value: formatSI(r.pOut, 'W') },
          { label: 'Efficiency', value: `${(r.efficiency * 100).toFixed(1)}%`, note: <T k="loss {total}" vars={{ total: formatSI(r.losses.total, 'W') }} /> },
        ]}
      />

      {!r.op.reachable && (
        <Warning
          text="Losses put this output out of reach at this load: the duty needed exceeds what the stage can hold. Lower the load current, raise the input, or cut the resistive losses (lower DCR and Rds(on))."
        />
      )}
      {r.saturating && (
        <Warning
          text="Peak inductor current {ilPeak} is past the {isat} saturation rating. A saturated inductor loses inductance, so current runs away within a single switching cycle. Choose a larger core or raise L."
          vars={{ ilPeak: formatSI(r.op.ilPeak, 'A'), isat: formatSI(isat, 'A') }}
        />
      )}
      {r.dutyLimited && (
        <Warning
          text="Duty is outside the range a real controller can hold. Near 0 or 1 the on-time approaches the minimum pulse width and the output collapses or pulse-skips."
        />
      )}
      {r.op.conduction === 'dcm' && (
        <Warning
          text="Running in discontinuous conduction: inductor current reaches zero each cycle. The conversion ratio then depends on load, not just duty, so the output moves as the load changes and the control loop gets harder."
        />
      )}

      <Theory
        text={[
          "The inverting buck-boost gives `Vout = -Vin·D/(1-D)`, so duty is `D = |Vout|/(|Vout| + Vin)`. It steps up or down freely, but the output is negative and both switch and rectifier stand off `Vin + |Vout|`.",
          "The four-switch stage puts a buck leg and a boost leg around one inductor. It keeps the output positive and, crucially, runs as a plain buck when Vin is comfortably above Vout and a plain boost when it is below, only using both legs in the narrow band between. That is why it is far more efficient than the inverting stage: in either single-leg mode only one pair of switches is chopping.",
          "Ripple is `dIL = vL(on)·D/(fsw·L)`. Aim for 30 to 40% of the average current: less means a bulky inductor, more pushes the peak toward saturation and raises RMS heating. When ripple exceeds twice the average, current hits zero and the converter drops into discontinuous conduction.",
          "Output ripple has two parts that do not peak together: the capacitor term `dIL/(8·fsw·C)` and the ESR term `dIL·ESR`. In most real designs with ceramic output caps the ESR term is small, but with electrolytics it dominates completely.",
        ]}
      />
    </SimPage>
  )
}
