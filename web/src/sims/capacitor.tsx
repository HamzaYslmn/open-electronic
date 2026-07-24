import { useMemo, useState } from 'react'
import { analyse, curve, memberVoltages } from '../engine/capacitor'
import type { CapMode, CurveMode } from '../engine/capacitor'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { formatSI } from '../engine/units'
import { T, sym } from '../i18n'
import { Dot, Group, Oscilloscope, Param, ReadoutGrid, Schematic, Segmented, SimPage, Theory, Toggle, TRACE_COLORS, Warning } from '../ui'

/** Samples per curve, matching the other time-domain pages. */
const N = 8192

function Diagram({ mode }: { mode: CapMode }) {
  return (
    <Schematic viewBox="0 0 260 110" label="capacitor.capacitorsIn">
      <circle cx="24" cy="34" r="10" />
      <path d="M18 34a6 6 0 0 1 12 0M24 44v36h212M34 34h36" />
      <rect x="70" y="26" width="44" height="16" />
      <path d="M114 34h46" />
      {mode === 'series' ? (
        <path d="M160 34v6M146 40h28M146 50h28M160 50v10M146 60h28M146 70h28M160 70v10" />
      ) : (
        <>
          <path d="M160 34h48M160 34v10M146 44h28M146 54h28M160 54v26M208 34v10M194 44h28M194 54h28M208 54v26" />
          <Dot x={160} y={34} />
        </>
      )}
      <text x="86" y="18">
        R
      </text>
      <text x="178" y="46">
        C1
      </text>
      <text x={mode === 'series' ? 178 : 226} y={mode === 'series' ? 76 : 46}>
        C2
      </text>
      <text x="4" y="60">
        V
      </text>
    </Schematic>
  )
}

export default function Capacitor() {
  const [mode, setMode] = useState<CapMode>('parallel')
  const [curveMode, setCurveMode] = useState<CurveMode>('charge')
  const [c1, setC1] = useState(100e-9)
  const [c2, setC2] = useState(100e-9)
  const [c3, setC3] = useState(1e-6)
  const [useThird, setUseThird] = useState(false)
  const [r, setR] = useState(10_000)
  // ESP32 rail. A capacitor does not care about the voltage, but every other
  // page here drives from 3V3 so the numbers stay comparable.
  const [supply, setSupply] = useState(VCC)
  const [target, setTarget] = useState(2)

  const values = useMemo(
    () => (useThird ? [c1, c2, c3] : [c1, c2]),
    [c1, c2, c3, useThird],
  )

  const { dt, traces, readout, members } = useMemo(() => {
    const readout = analyse({ values, mode, r, supply, target, curveMode })
    // Frame 5 tau (99.3% settled) but stretch to keep the target crossing on
    // screen, capped at 10 tau so a near-rail target cannot squash the curve.
    const wanted = Number.isFinite(readout.tTarget) ? readout.tTarget * 1.15 : 0
    const span = Math.max(
      Math.max(5 * readout.tau, Math.min(wanted, 10 * readout.tau)),
      1e-9,
    )
    const dt = span / N
    const { vc, vr } = curve(N, dt, supply, readout.tau, curveMode)
    return {
      dt,
      traces: [
        { label: 'common.vc', color: TRACE_COLORS[0], samples: vc },
        { label: 'capacitor.vAcrossR', color: TRACE_COLORS[1], samples: vr },
        { label: 'common.target', color: TRACE_COLORS[3], samples: new Float64Array(N).fill(target) },
      ],
      readout,
      members: memberVoltages(values, mode, supply),
    }
  }, [values, mode, r, supply, target, curveMode])

  const gpioOver = readout.peakCurrent * 1000 > GPIO_MAX_MA
  const overRail = target > supply
  // A series string divides voltage inversely with C, so a mismatched bank
  // dumps most of the rail on the smallest member. Flag anything more than
  // 20% over an even share.
  const unevenSplit =
    mode === 'series' && readout.maxMemberVoltage > (1.2 * supply) / values.length

  return (
    <SimPage
      id="capacitor"
      lede="capacitor.lede"
      controls={
        <>
          <Segmented
            label="capacitor.bankTopology"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'parallel', label: 'common.parallel' },
              { value: 'series', label: 'common.series' },
            ]}
          />
          <Diagram mode={mode} />

          <Group label="capacitor.bank">
            <Param label={sym('C1')} unit="F" value={c1} onChange={setC1} min={1e-12} max={1e-1} />
            <Param label={sym('C2')} unit="F" value={c2} onChange={setC2} min={1e-12} max={1e-1} />
            <Toggle label="capacitor.thirdCapacitor" value={useThird} onChange={setUseThird} />
            {useThird && (
              <Param label={sym('C3')} unit="F" value={c3} onChange={setC3} min={1e-12} max={1e-1} />
            )}
          </Group>

          <Group label="common.circuit">
            <Param label="common.seriesResistor" unit="Ω" value={r} onChange={setR} min={1} max={10e6} />
            <Param
              label={curveMode === 'charge' ? 'common.supply' : 'capacitor.startingVoltage'}
              unit="V"
              value={supply}
              onChange={setSupply}
              min={0.1}
              max={50}
              log={false}
              step={0.1}
            />
          </Group>

          <Group label="capacitor.curve">
            <Segmented
              label="capacitor.direction"
              value={curveMode}
              onChange={setCurveMode}
              options={[
                { value: 'charge', label: 'capacitor.charge' },
                { value: 'discharge', label: 'capacitor.discharge' },
              ]}
            />
            <Param
              label="capacitor.targetVoltage"
              unit="V"
              value={target}
              onChange={setTarget}
              min={0.01}
              max={50}
              log={false}
              step={0.01}
              hint="capacitor.esp32InputHighThreshold"
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'capacitor.bankCapacitance',
            value: formatSI(readout.total, 'F'),
            note: <T k="capacitor.in" vars={{ values: values.length, mode }} />,
          },
          { label: 'common.timeConstant', value: formatSI(readout.tau, 's'), note: sym('(R·C)') },
          {
            label: curveMode === 'charge' ? 'capacitor.timeToReachTarget' : 'capacitor.timeToFallTo',
            value: formatSI(readout.tTarget, 's'),
            note: readout.reachable ? undefined : 'capacitor.neverTargetIsPast',
            warn: !readout.reachable,
          },
          { label: 'capacitor.1090Transition', value: formatSI(readout.tRise, 's'), note: 'capacitor.2197Tau' },
          { label: 'capacitor.settled5Tau', value: formatSI(readout.tSettle, 's'), note: '(99.3%)' },
          {
            label: 'capacitor.storedEnergy',
            value: formatSI(readout.e, 'J'),
            note: <T k="capacitor.at" vars={{ supply: formatSI(supply, 'V') }} />,
          },
          {
            label: 'capacitor.energyAtTarget',
            value: formatSI(readout.eTarget, 'J'),
            note: <T k="capacitor.ofFull" vars={{ e: ((readout.eTarget / readout.e) * 100 || 0).toFixed(1) }} />,
          },
          { label: 'capacitor.storedCharge', value: formatSI(readout.q, 'C') },
          {
            label: 'common.peakCurrent',
            value: formatSI(readout.peakCurrent, 'A'),
            note: 'capacitor.atT0V',
            warn: gpioOver,
          },
          {
            label: 'capacitor.lossInRPer',
            value: formatSI(readout.eResistor, 'J'),
            note: 'capacitor.equalsTheStoredEnergy',
          },
          {
            label: 'capacitor.highestMemberVoltage',
            value: formatSI(readout.maxMemberVoltage, 'V'),
            note:
              mode === 'series'
                ? `(${members.map((v) => formatSI(v, 'V')).join(' / ')})`
                : 'capacitor.fullRailOnEvery',
            warn: unevenSplit,
          },
        ]}
      />

      <Warning when={gpioOver}
        text="capacitor.warn1"
        vars={{ peakCurrent: formatSI(readout.peakCurrent, 'A'), GPIO_MAX_MA }}
      />

      <Warning when={overRail && curveMode === 'charge'}
        text="capacitor.warn2"
      />

      <Warning when={unevenSplit}
        text="capacitor.warn3"
        vars={{
          maxMemberVoltage: formatSI(readout.maxMemberVoltage, 'V'),
          supply: formatSI(supply, 'V'),
          values: formatSI(supply / values.length, 'V'),
        }}
      />

      <Theory
        text={[
          'capacitor.theory1',
          'capacitor.storedEnergyIsE',
          'capacitor.chargingThroughRFollows',
          'capacitor.theScopeSamplesThose',
          'capacitor.chargingACapacitorThrough',
          'capacitor.inASeriesString',
        ]}
      />
    </SimPage>
  )
}
