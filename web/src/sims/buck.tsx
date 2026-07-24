import { useMemo, useState } from 'react'
import { analyse, inductorWaveform, operatingPoint } from '../engine/buck'
import type { BuckSpec, Rectifier } from '../engine/buck'
import { VCC, VCC_5V } from '../engine/constants'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Dot, Group, Oscilloscope, Param, ReadoutGrid, Schematic, Segmented, SimPage, Theory, Warning } from '../ui'

/** Samples across the whole scope window. */
const N = 8192

/** Ripple this far above the load current means L or fsw is too low. */
const RIPPLE_LIMIT = 0.6

/** Output ripple above this fraction of Vout is worth flagging. */
const VOUT_RIPPLE_LIMIT = 0.01

function Diagram({ rectifier }: { rectifier: Rectifier }) {
  return (
    <Schematic
      viewBox="0 0 260 110"
      label="buck.buckConverterWithA"
      vars={{ rectifier: rectifier === 'sync' ? 'buck.synchronousFet' : 'buck.catchDiode' }}
    >
      <circle cx="18" cy="30" r="8" />
      <path d="M18 38v52h214M26 30h20" />
      <rect x="46" y="22" width="28" height="16" />
      <path d="M74 30h38" />
      <path d="M104 30v22M104 68v22" />
      {rectifier === 'sync' ? (
        <rect x="90" y="52" width="28" height="16" />
      ) : (
        <path d="M94 68h20l-10-16zM94 52h20" />
      )}
      <rect x="112" y="22" width="40" height="16" />
      <path d="M152 30h78" />
      <path d="M190 30v22M178 52h24M178 62h24M190 62v28" />
      <Dot x={104} y={30} />
      <Dot x={190} y={30} />
      <circle cx="232" cy="30" r="3" />
      <text x="2" y="64">
        Vin
      </text>
      <text x="50" y="18">
        SW
      </text>
      <text x="126" y="18">
        L
      </text>
      <text x="122" y="64">
        {rectifier === 'sync' ? 'SW2' : 'D'}
      </text>
      <text x="206" y="62">
        C
      </text>
      <text x="200" y="22">
        Vout
      </text>
    </Schematic>
  )
}

export default function Buck() {
  // A buck steps down, so the input rail has to sit above the 3.3 V target.
  // 5 V in and 3.3 V out is the standard ESP32 case: USB or a 2S pack feeding
  // the logic rail.
  const [vin, setVin] = useState(VCC_5V)
  const [vout, setVout] = useState(VCC)
  const [iout, setIout] = useState(0.5)
  const [l, setL] = useState(10e-6)
  const [c, setC] = useState(22e-6)
  const [esr, setEsr] = useState(5e-3)
  const [fsw, setFsw] = useState(500e3)
  const [rdsOn, setRdsOn] = useState(50e-3)
  const [dcr, setDcr] = useState(40e-3)
  const [rectifier, setRectifier] = useState<Rectifier>('sync')
  const [periods, setPeriods] = useState(2)

  const { dt, traces, op, ripple, loss, efficiency, pout, pin, iin } = useMemo(() => {
    const spec: BuckSpec = { vin, vout, iout, l, c, esr, fsw, rdsOn, dcr, rectifier }
    const point = operatingPoint(spec)
    const { dt, samples } = inductorWaveform(spec, point, N, periods)
    // The capacitor takes whatever the inductor delivers beyond the load.
    const icap = Float64Array.from(samples, (v) => v - iout)
    const level = new Float64Array(N).fill(iout)
    return {
      dt,
      traces: [
        { label: 'common.il', samples },
        { label: 'buck.iout', samples: level, quiet: true },
        { label: 'buck.icap', samples: icap },
      ],
      ...analyse(spec),
    }
  }, [vin, vout, iout, l, c, esr, fsw, rdsOn, dcr, rectifier, periods])

  const rippleRatio = iout > 0 ? op.ripple / iout : Infinity
  const voutRatio = vout > 0 ? ripple.total / vout : Infinity

  return (
    <SimPage
      id="buck"
      lede="buck.lede"
      controls={
        <>
          <Segmented
            label="buck.lowSideDevice"
            value={rectifier}
            onChange={setRectifier}
            options={[
              { value: 'sync', label: 'buck.synchronous' },
              { value: 'diode', label: 'buck.schottky' },
            ]}
          />
          <Diagram rectifier={rectifier} />

          <Group label="common.operatingPoint">
            <Param label="common.inputVin" unit="V" value={vin} onChange={setVin} min={1} max={60} />
            <Param label="common.outputVout" unit="V" value={vout} onChange={setVout} min={0.5} max={30} />
            <Param
              label="common.loadCurrent"
              unit="A"
              value={iout}
              onChange={setIout}
              min={1e-3}
              max={10}
            />
            <Param
              label="common.switchingFrequency"
              unit="Hz"
              value={fsw}
              onChange={setFsw}
              min={10e3}
              max={3e6}
            />
          </Group>

          <Group label="common.powerStage">
            <Param label="common.inductor" unit="H" value={l} onChange={setL} min={100e-9} max={1e-3} />
            <Param label="common.outputCap" unit="F" value={c} onChange={setC} min={1e-6} max={2e-3} />
            <Param label="common.capEsr" unit="Ω" value={esr} onChange={setEsr} min={1e-4} max={1} />
          </Group>

          <Group label="buck.parasitics">
            <Param
              label="common.fetRdsOn"
              unit="Ω"
              value={rdsOn}
              onChange={setRdsOn}
              min={1e-3}
              max={1}
            />
            <Param
              label="common.inductorDcr"
              unit="Ω"
              value={dcr}
              onChange={setDcr}
              min={1e-3}
              max={2}
              hint="buck.copperResistanceOfThe"
            />
            <Param
              label="common.periodsShown"
              value={periods}
              onChange={setPeriods} int
              min={1}
              max={8}
              log={false}
              step={1}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          {
            label: 'buck.dutyCycleD',
            value: `${(op.duty * 100).toFixed(1)} %`,
            note: <T k="buck.idealVoutVin" vars={{ dutyIdeal: (op.dutyIdeal * 100).toFixed(1) }} />,
            warn: op.dropout,
          },
          {
            label: 'common.conductionMode',
            value: op.mode === 'ccm' ? 'common.ccm' : 'common.dcm',
            note: <T k="buck.boundaryAt" vars={{ boundary: formatSI(op.boundary, 'A') }} />,
            warn: op.mode === 'dcm',
          },
          {
            label: 'buck.inductorRippleIl',
            value: formatSI(op.ripple, 'A'),
            note: <T k="buck.ofLoad" vars={{ rippleRatio: (rippleRatio * 100).toFixed(0) }} />,
            warn: op.mode === 'ccm' && rippleRatio > RIPPLE_LIMIT,
          },
          {
            label: 'common.peakInductorCurrent',
            value: formatSI(op.peak, 'A'),
            note: 'buck.keepIsatAboveThis',
          },
          { label: 'buck.valleyCurrent', value: formatSI(op.valley, 'A') },
          {
            label: 'buck.outputRippleVout',
            value: formatSI(ripple.total, 'V'),
            note: <T k="buck.ofVout" vars={{ voutRatio: (voutRatio * 100).toFixed(2) }} />,
            warn: voutRatio > VOUT_RIPPLE_LIMIT,
          },
          {
            label: 'buck.rippleSplitCEsr',
            value: `${formatSI(ripple.cap, 'V')} + ${formatSI(ripple.esr, 'V')}`,
          },
          {
            label: 'common.efficiency',
            value: `${(efficiency * 100).toFixed(1)} %`,
            note: <T k="buck.lost" vars={{ total: formatSI(loss.total, 'W') }} />,
            warn: efficiency < 0.8,
          },
          {
            label: 'common.inputCurrent',
            value: formatSI(iin, 'A'),
            note: <T k="buck.inOut" vars={{ pin: formatSI(pin, 'W'), pout: formatSI(pout, 'W') }} />,
          },
          {
            label: 'common.onTime',
            value: formatSI(op.duty / fsw, 's'),
            note: <T k="buck.period" vars={{ fsw: formatSI(1 / fsw, 's') }} />,
          },
          { label: 'buck.lossInductorDcr', value: formatSI(loss.inductor, 'W') },
          { label: 'buck.lossHighSideFet', value: formatSI(loss.switchCond, 'W') },
          {
            label: rectifier === 'sync' ? 'buck.lossLowSideFet' : 'buck.lossCatchDiode',
            value: formatSI(loss.rectifier, 'W'),
          },
          {
            label: 'buck.lossSwitching',
            value: formatSI(loss.switching, 'W'),
            note: 'buck.scalesWithFsw',
          },
        ]}
      />

      <Warning when={op.dropout}
        text="buck.warn1"
      />

      <Warning when={op.mode === 'dcm' && !op.dropout}
        text="buck.warn2"
        vars={{ boundary: formatSI(op.boundary, 'A') }}
      />

      <Warning when={op.mode === 'ccm' && rippleRatio > RIPPLE_LIMIT}
        text="buck.warn3"
        vars={{ rippleRatio: (rippleRatio * 100).toFixed(0) }}
      />

      <Theory
        text={[
          'buck.theory1',
          'buck.theRampGivesThe',
          'buck.theValleyCurrentIs',
          'buck.efficiencyIsAFirst',
          'buck.theTraceIsThe',
        ]}
      />
    </SimPage>
  )
}
