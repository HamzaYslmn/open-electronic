import { useMemo, useState } from 'react'
import { ADC_FULL_SCALE, VCC } from '../engine/constants'
import { formatSI } from '../engine/units'
import { T, sym, useT } from '../i18n'
import {
  ADC_LSB,
  ADC_MAX_SOURCE_OHMS,
  ARMS,
  RESISTOR_POWER_W,
  analyse,
  armValue,
  sweepArm,
} from '../engine/wheatstone'
import type { Arm, Bridge } from '../engine/wheatstone'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples across the swept resistance range. Same budget as the time-domain pages. */
const N = 8192

function ArmBox({ x, y, on }: { x: number; y: number; on: boolean }) {
  return <rect x={x} y={y} width={18} height={26} strokeWidth={on ? 3 : 1.5} />
}

function Schematic({ arm }: { arm: Arm }) {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 134" aria-label={t('wheatstone.wheatstoneBridge')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="20" r="3" />
        <path d="M24 20h146M70 20v12M70 58v24M70 108v8M170 20v12M170 58v24M170 108v8" />
        <path d="M70 116h100M120 116v6M108 122h24M112 126h16M116 130h8" />
        <ArmBox x={61} y={32} on={arm === 'R1'} />
        <ArmBox x={61} y={82} on={arm === 'R2'} />
        <ArmBox x={161} y={32} on={arm === 'R3'} />
        <ArmBox x={161} y={82} on={arm === 'R4'} />
        <path d="M70 70h30M170 70h-30" />
        <circle cx="103" cy="70" r="3" />
        <circle cx="137" cy="70" r="3" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="4" y="16">
          Vin
        </text>
        <text x="40" y="49">
          R1
        </text>
        <text x="40" y="99">
          R2
        </text>
        <text x="182" y="49">
          R3
        </text>
        <text x="182" y="99">
          R4
        </text>
        <text x="56" y="66">
          A
        </text>
        <text x="174" y="66">
          B
        </text>
        <text x="106" y="62">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function Wheatstone() {
  const t = useT()
  // 3.3 V excitation: the bridge is driven straight off the ESP32 rail, so the
  // taps land inside the ADC input range without extra scaling.
  const [vin, setVin] = useState(VCC)
  const [r1, setR1] = useState(1_000)
  const [r2, setR2] = useState(1_000)
  const [r3, setR3] = useState(1_000)
  const [r4, setR4] = useState(1_100)
  const [arm, setArm] = useState<Arm>('R4')
  const [spanPct, setSpanPct] = useState(50)

  const { step, traces, readout, rArm, from, to } = useMemo(() => {
    const bridge: Bridge = { vin, r1, r2, r3, r4 }
    const rArm = armValue(bridge, arm)
    const span = spanPct / 100
    const from = Math.max(rArm * (1 - span), 1e-3)
    const to = rArm * (1 + span)
    const s = sweepArm(bridge, arm, from, to, N)
    return {
      step: s.step,
      from,
      to,
      rArm,
      traces: [
        { label: 'common.vout', color: TRACE_COLORS[1], samples: s.vout },
        { label: 'wheatstone.tangent', color: TRACE_COLORS[3], samples: s.tangent, quiet: true },
      ],
      readout: analyse(bridge, arm),
    }
  }, [vin, r1, r2, r3, r4, arm, spanPct])

  const trim = readout.balanceR - rArm

  return (
    <SimPage
      id="wheatstone"
      lede={t(
        'wheatstone.twoDividersAcrossOne',
        { arm },
      )}
      controls={
        <>
          <Segmented label="wheatstone.sensorArm" value={arm} onChange={setArm} options={ARMS} />
          <Schematic arm={arm} />

          <Group label="wheatstone.excitation">
            <Param
              label="common.vin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={0.1}
              max={24}
              log={false}
              step={0.05}
            />
          </Group>

          <Group label="wheatstone.arms">
            <Param label={sym('R1')} unit="Ω" value={r1} onChange={setR1} min={1} max={10e6} />
            <Param label={sym('R2')} unit="Ω" value={r2} onChange={setR2} min={1} max={10e6} />
            <Param label={sym('R3')} unit="Ω" value={r3} onChange={setR3} min={1} max={10e6} />
            <Param label={sym('R4')} unit="Ω" value={r4} onChange={setR4} min={1} max={10e6} />
          </Group>

          <Group label="common.sweep">
            <Param
              label="wheatstone.spanAboutNominal"
              unit="%"
              value={spanPct}
              onChange={setSpanPct}
              min={1}
              max={95}
              log={false}
              step={1}
              hint={<T k="wheatstone.to" vars={{ from: formatSI(from, 'Ω'), to: formatSI(to, 'Ω') }} />}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={step} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'wheatstone.bridgeOutput',
            value: formatSI(readout.vout, 'V'),
            note: <T k="wheatstone.adcCounts" vars={{ counts: readout.counts.toFixed(1) }} />,
            warn: readout.belowLsb,
          },
          {
            label: 'wheatstone.tapATapB',
            value: `${formatSI(readout.va, 'V')} / ${formatSI(readout.vb, 'V')}`,
            note: 'wheatstone.bothReferredToBridge',
            warn: readout.nodeOverRange,
          },
          {
            label: 'wheatstone.balance',
            value: readout.balanced ? 'wheatstone.nulled' : 'wheatstone.offNull',
            note: `(R1/R2 = ${readout.ratioLeft.toFixed(4)}, R3/R4 = ${readout.ratioRight.toFixed(4)})`,
          },
          {
            label: <T k="wheatstone.forNull" vars={{ arm }} />,
            value: formatSI(readout.balanceR, 'Ω'),
            note: Number.isFinite(trim)
              ? <T k="wheatstone.fromNow" vars={{ trim: trim >= 0 ? '+' : '-', trim2: formatSI(Math.abs(trim), 'Ω') }} />
              : undefined,
          },
          {
            label: 'common.sensitivity',
            value: formatSI(readout.sens, 'V/Ω'),
            note: <T k="wheatstone.at" vars={{ arm, rArm: formatSI(rArm, 'Ω') }} />,
          },
          {
            label: <T k="wheatstone.per1Of" vars={{ arm }} />,
            value: formatSI(readout.sensFractional / 100, 'V'),
            note: 'wheatstone.vin4PerUnit',
          },
          {
            label: 'wheatstone.theveninRout',
            value: formatSI(readout.rth, 'Ω'),
            note: <T k="wheatstone.adcWantsUnder" vars={{ ADC_MAX_SOURCE_OHMS: formatSI(ADC_MAX_SOURCE_OHMS, 'Ω') }} />,
            warn: readout.overRth,
          },
          { label: 'wheatstone.excitationCurrent', value: formatSI(readout.current, 'A') },
          {
            label: 'wheatstone.totalDissipation',
            value: formatSI(readout.power, 'W'),
            note: <T k="wheatstone.worstArm" vars={{ maxArmPower: formatSI(readout.maxArmPower, 'W') }} />,
            warn: readout.overPower,
          },
        ]}
      />

      {readout.belowLsb && (
        <Warning
          text="wheatstone.warn1"
          vars={{
            ADC_LSB: formatSI(ADC_LSB, 'V'),
            ADC_FULL_SCALE: formatSI(ADC_FULL_SCALE, 'V'),
          }}
        />
      )}
      {readout.nodeOverRange && (
        <Warning
          text="wheatstone.warn2"
          vars={{ ADC_FULL_SCALE: formatSI(ADC_FULL_SCALE, 'V') }}
        />
      )}
      {readout.overRth && (
        <Warning
          text="wheatstone.warn3"
          vars={{ ADC_MAX_SOURCE_OHMS: formatSI(ADC_MAX_SOURCE_OHMS, 'Ω') }}
        />
      )}
      {readout.overPower && (
        <Warning
          text="wheatstone.warn4"
          vars={{
            maxArmPower: formatSI(readout.maxArmPower, 'W'),
            RESISTOR_POWER_W: formatSI(RESISTOR_POWER_W, 'W'),
          }}
        />
      )}

      <Theory
        text={[
          'wheatstone.theory1',
          'wheatstone.sensitivityIsTheDerivative',
          'wheatstone.lookingBackIntoThe',
        ]}
      />
    </SimPage>
  )
}
