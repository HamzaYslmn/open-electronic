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
import { T } from '../i18n'
import { Group, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 4096

const SERIES_OPTIONS = SERIES_NAMES.map((value) => ({ value, label: value }))

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
      traces: [{ label: 'IL', color: TRACE_COLORS[0], samples: w.samples }],
    }
  }, [vin, voutTarget, iout, r1, series, l, cout, esr, vd, dcr, thetaJA, tAmbC, cycles])

  return (
    <SimPage
      id="lm2596"
      lede="The blue buck module from every parts kit. Pick the feedback divider for a target rail, then check it against the real limits: 3 A, 40 V, and a package that gets hot long before it hits either. The scope shows inductor current at the fixed 150 kHz."
      controls={
        <>
          <Group label="Operating point">
            <Param label="Vin" unit="V" value={vin} onChange={setVin} min={3} max={45} log={false} step={0.5} />
            <Param label="Vout target" unit="V" value={voutTarget} onChange={setVoutTarget} min={1} max={38} log={false} step={0.1} />
            <Param label="Load current" unit="A" value={iout} onChange={setIout} min={0.01} max={4} log={false} step={0.05} />
          </Group>

          <Group label="Feedback divider">
            <Param label="R1 (FB to gnd)" unit="Ω" value={r1} onChange={setR1} min={200} max={20_000} />
            <Select label="Resistor series" value={series} onChange={setSeries} options={SERIES_OPTIONS} />
          </Group>

          <Group label="Power stage">
            <Param label="Inductor" unit="H" value={l} onChange={setL} min={4.7e-6} max={470e-6} />
            <Param label="Inductor DCR" unit="Ω" value={dcr} onChange={setDcr} min={0.005} max={1} />
            <Param label="Output cap" unit="F" value={cout} onChange={setCout} min={1e-6} max={4.7e-3} />
            <Param label="Cap ESR" unit="Ω" value={esr} onChange={setEsr} min={0.001} max={2} />
            <Param label="Diode Vf" unit="V" value={vd} onChange={setVd} min={0.2} max={1} log={false} step={0.05} />
            <Param label="Periods shown" value={cycles} onChange={(v) => setCycles(Math.round(v))} min={1} max={10} log={false} step={1} />
          </Group>

          <Group label="Thermal">
            <Param label="Theta JA" unit="°C/W" value={thetaJA} onChange={setThetaJA} min={10} max={120} log={false} step={1} />
            <Param label="Ambient" unit="°C" value={tAmbC} onChange={setTAmbC} min={-20} max={70} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'R2 ideal', value: formatSI(r.r2Ideal, 'Ω') },
          { label: <T k="R2 from {series}" vars={{ series }} />, value: formatSI(r.r2, 'Ω') },
          {
            label: 'Actual Vout',
            value: formatSI(r.vout, 'V'),
            note: <T k="{voutError}% off target" vars={{ voutError: (r.voutError * 100).toFixed(2) }} />,
            warn: Math.abs(r.voutError) > 0.05,
          },
          { label: 'Divider current', value: formatSI(r.dividerCurrent, 'A') },
          { label: 'Duty', value: `${(r.op.duty * 100).toFixed(1)}%`, note: <T k="ideal {dutyIdeal}%" vars={{ dutyIdeal: (r.op.dutyIdeal * 100).toFixed(1) }} /> },
          { label: 'Inductor ripple', value: formatSI(r.op.ripple, 'A') },
          { label: 'Peak current', value: formatSI(r.op.ipk, 'A'), warn: r.overLimit },
          { label: 'Output ripple', value: formatSI(r.vripple, 'V'), note: <T k="esr {vrippleEsr} + cap {vrippleCap}" vars={{ vrippleEsr: formatSI(r.vrippleEsr, 'V'), vrippleCap: formatSI(r.vrippleCap, 'V') }} /> },
          { label: 'Input current', value: formatSI(r.iin, 'A') },
          { label: 'Output power', value: formatSI(r.pOut, 'W') },
          { label: 'Total loss', value: formatSI(r.pLoss, 'W') },
          { label: 'Efficiency', value: `${(r.efficiency * 100).toFixed(1)}%` },
          { label: 'Loss in the IC', value: formatSI(r.pIc, 'W'), note: 'sets its temperature' },
          { label: 'Diode loss', value: formatSI(r.pDiode, 'W') },
          {
            label: 'Junction temp',
            value: `${r.tj.toFixed(0)} °C`,
            note: <T k="max {TJ_MAX} °C" vars={{ TJ_MAX }} />,
            warn: r.overTemp,
          },
          {
            label: 'Minimum Vin',
            value: formatSI(r.vinMinimum, 'V'),
            note: <T k="headroom {headroom}" vars={{ headroom: formatSI(r.headroom, 'V') }} />,
            warn: r.dropout,
          },
          { label: 'Conduction', value: r.dcm ? 'DCM' : 'CCM', warn: r.dcm },
          { label: 'Switching freq', value: formatSI(FSW, 'Hz'), note: 'fixed' },
        ]}
      />

      {r.dropout && (
        <Warning
          text="Input is below the {vinMinimum} needed to hold this output at this load. The regulator runs at maximum duty and the output simply follows the input down, minus the switch drop."
          vars={{ vinMinimum: formatSI(r.vinMinimum, 'V') }}
        />
      )}
      {r.vinLow && (
        <Warning
          text="Below the {VIN_MIN} V datasheet minimum. The internal reference is not guaranteed here."
          vars={{ VIN_MIN }}
        />
      )}
      {r.vinHigh && (
        <Warning
          text="Above the {VIN_MAX} V absolute maximum. This destroys the part."
          vars={{ VIN_MAX }}
        />
      )}
      {r.overCurrent && (
        <Warning
          text="Past the {IOUT_MAX} A rating. These modules are commonly sold claiming 3 A but with a heatsink barely adequate above 1.5 A."
          vars={{ IOUT_MAX }}
        />
      )}
      {r.overLimit && (
        <Warning
          text="Peak inductor current is above the guaranteed current limit, so the part will trip into cycle-by-cycle limiting before reaching this load. Use a larger inductor."
        />
      )}
      {r.overTemp && (
        <Warning
          text="Junction at {tj} °C, past the {TJ_MAX} °C limit. It will shut down thermally. Improve airflow, add a heatsink, or reduce the load."
          vars={{ tj: r.tj.toFixed(0), TJ_MAX }}
        />
      )}
      {r.voutBelowRef && (
        <Warning
          text="The target is below the {VREF} V feedback reference, which this topology cannot produce at all."
          vars={{ VREF }}
        />
      )}

      <Theory
        text={[
          "Output is set by the feedback divider: `Vout = Vref·(1 + R2/R1)` with `Vref = {VREF} V`. Keep R1 in the 1k to 5k range the datasheet suggests: too high and the FB pin's own bias current shifts the output, too low and the divider wastes current continuously.",
          "The switching frequency is fixed at 150 kHz internally, which is the module's main limitation. Low frequency means a physically large inductor and capacitor for a given ripple, since `dIL = Vout·(1-D)/(fsw·L)` and `dV = dIL/(8·fsw·C)` both scale inversely with fsw.",
          "Efficiency is dominated by two terms: the internal switch dropping about 1.16 V at 3 A, and the catch diode burning `Vf·Idiode` for the whole off-time. At low output voltages the diode conducts most of the period, which is why a 12 V to 3.3 V conversion is markedly less efficient than 12 V to 5 V.",
          "The thermal check is usually the real limit, not the current rating. Only the loss inside the IC heats the junction, so `Tj = Tamb + Pic·ThetaJA`. On a bare module with no airflow ThetaJA is poor, and 1 to 2 W of internal loss is enough to reach thermal shutdown.",
        ]} vars={{ VREF }}
      />
    </SimPage>
  )
}
