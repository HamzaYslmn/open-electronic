import { useMemo, useState } from 'react'
import { ADC_FULL_SCALE, VCC } from '../engine/constants'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
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
    <svg className="schematic" viewBox="0 0 260 134" aria-label={t('Wheatstone bridge')}>
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
        { label: 'Vout', color: TRACE_COLORS[1], samples: s.vout },
        { label: 'Tangent', color: TRACE_COLORS[3], samples: s.tangent, quiet: true },
      ],
      readout: analyse(bridge, arm),
    }
  }, [vin, r1, r2, r3, r4, arm, spanPct])

  const trim = readout.balanceR - rArm

  return (
    <SimPage
      id="wheatstone"
      lede={t(
        "Two dividers across one supply, read as a difference. The trace is a sweep, not a waveform: the horizontal axis is {arm}, the sensor arm, so read the scope's per-division figure as ohms.",
        { arm },
      )}
      controls={
        <>
          <Segmented label="Sensor arm" value={arm} onChange={setArm} options={ARMS} />
          <Schematic arm={arm} />

          <Group label="Excitation">
            <Param
              label="Vin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={0.1}
              max={24}
              log={false}
              step={0.05}
            />
          </Group>

          <Group label="Arms">
            <Param label="R1" unit="Ω" value={r1} onChange={setR1} min={1} max={10e6} />
            <Param label="R2" unit="Ω" value={r2} onChange={setR2} min={1} max={10e6} />
            <Param label="R3" unit="Ω" value={r3} onChange={setR3} min={1} max={10e6} />
            <Param label="R4" unit="Ω" value={r4} onChange={setR4} min={1} max={10e6} />
          </Group>

          <Group label="Sweep">
            <Param
              label="Span about nominal"
              unit="%"
              value={spanPct}
              onChange={setSpanPct}
              min={1}
              max={95}
              log={false}
              step={1}
              hint={<T k="{from} to {to}" vars={{ from: formatSI(from, 'Ω'), to: formatSI(to, 'Ω') }} />}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={step} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'Bridge output',
            value: formatSI(readout.vout, 'V'),
            note: <T k="({counts} ADC counts)" vars={{ counts: readout.counts.toFixed(1) }} />,
            warn: readout.belowLsb,
          },
          {
            label: 'Tap A / tap B',
            value: `${formatSI(readout.va, 'V')} / ${formatSI(readout.vb, 'V')}`,
            note: '(both referred to bridge ground)',
            warn: readout.nodeOverRange,
          },
          {
            label: 'Balance',
            value: readout.balanced ? 'nulled' : 'off null',
            note: `(R1/R2 = ${readout.ratioLeft.toFixed(4)}, R3/R4 = ${readout.ratioRight.toFixed(4)})`,
          },
          {
            label: <T k="{arm} for null" vars={{ arm }} />,
            value: formatSI(readout.balanceR, 'Ω'),
            note: Number.isFinite(trim)
              ? <T k="({trim}{trim2} from now)" vars={{ trim: trim >= 0 ? '+' : '-', trim2: formatSI(Math.abs(trim), 'Ω') }} />
              : undefined,
          },
          {
            label: 'Sensitivity',
            value: formatSI(readout.sens, 'V/Ω'),
            note: <T k="(at {arm} = {rArm})" vars={{ arm, rArm: formatSI(rArm, 'Ω') }} />,
          },
          {
            label: <T k="Per 1% of {arm}" vars={{ arm }} />,
            value: formatSI(readout.sensFractional / 100, 'V'),
            note: '(Vin/4 per unit ΔR/R at balance)',
          },
          {
            label: 'Thevenin Rout',
            value: formatSI(readout.rth, 'Ω'),
            note: <T k="(ADC wants under {ADC_MAX_SOURCE_OHMS})" vars={{ ADC_MAX_SOURCE_OHMS: formatSI(ADC_MAX_SOURCE_OHMS, 'Ω') }} />,
            warn: readout.overRth,
          },
          { label: 'Excitation current', value: formatSI(readout.current, 'A') },
          {
            label: 'Total dissipation',
            value: formatSI(readout.power, 'W'),
            note: <T k="(worst arm {maxArmPower})" vars={{ maxArmPower: formatSI(readout.maxArmPower, 'W') }} />,
            warn: readout.overPower,
          },
        ]}
      />

      {readout.belowLsb && (
        <Warning
          text="Output is under one ADC count ({ADC_LSB} at {ADC_FULL_SCALE} full scale, 12 bit). Put an instrumentation amp in front of it, i.e. INA333 or INA826, or the reading is all noise."
          vars={{
            ADC_LSB: formatSI(ADC_LSB, 'V'),
            ADC_FULL_SCALE: formatSI(ADC_FULL_SCALE, 'V'),
          }}
        />
      )}
      {readout.nodeOverRange && (
        <Warning
          text="A tap sits outside 0 to {ADC_FULL_SCALE}, the ESP32 ADC input range. Lower the excitation or divide the taps down before the pin."
          vars={{ ADC_FULL_SCALE: formatSI(ADC_FULL_SCALE, 'V') }}
        />
      )}
      {readout.overRth && (
        <Warning
          text="Source impedance is above {ADC_MAX_SOURCE_OHMS}, so the ADC sample and hold will not settle inside its window. Use lower arm values or buffer the taps with an op amp."
          vars={{ ADC_MAX_SOURCE_OHMS: formatSI(ADC_MAX_SOURCE_OHMS, 'Ω') }}
        />
      )}
      {readout.overPower && (
        <Warning
          text="Worst arm dissipates {maxArmPower}, past the {RESISTOR_POWER_W} a common 1/4 W part is rated for. Self-heating drifts the arm and shows up as output offset."
          vars={{
            maxArmPower: formatSI(readout.maxArmPower, 'W'),
            RESISTOR_POWER_W: formatSI(RESISTOR_POWER_W, 'W'),
          }}
        />
      )}

      <Theory
        text={[
          "Each half is a plain voltage divider, so the taps sit at `Vin·R2/(R1+R2)` and `Vin·R4/(R3+R4)`. The bridge output is their difference, `Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))`, which is zero when `R1/R2 = R3/R4`, i.e. `R1·R4 = R2·R3`. Balance depends on ratios only, so it is immune to supply drift.",
          "Sensitivity is the derivative at the operating point, for example `dVout/dR4 = -Vin·R3/(R3+R4)²`. With four equal arms that collapses to `Vin/4` per unit `ΔR/R`, the number every strain gauge datasheet quotes. The exact single-arm response is `Vout = -(Vin/4)·x/(1 + x/2)` for `x = ΔR/R`, so the amber tangent trace and the violet true curve pull apart as the sweep leaves the operating point. That gap is the bridge nonlinearity, about 0.05% at 1000 microstrain and several percent for a thermistor.",
          "Looking back into the output with the supply shorted, each pair is in parallel: `Rth = R1||R2 + R3||R4`. That is what a load sees, so a real load pulls the output down by `Rl/(Rth+Rl)`. Neither tap is at ground, so a single-ended ADC pin cannot read Vout directly, it needs a differential amplifier.",
        ]}
      />
    </SimPage>
  )
}
