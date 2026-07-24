import { useMemo, useState } from 'react'
import { analyse, curve, memberVoltages } from '../engine/capacitor'
import type { CapMode, CurveMode } from '../engine/capacitor'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Segmented, Toggle } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per curve, matching the other time-domain pages. */
const N = 8192

function Schematic({ mode }: { mode: CapMode }) {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 110" aria-label={t('capacitors in {mode}', { mode })}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="34" r="10" />
        <path d="M18 34a6 6 0 0 1 12 0M24 24V14M24 44v36h212M34 34h36" />
        <rect x="70" y="26" width="44" height="16" />
        <path d="M114 34h46" />
        {mode === 'series' ? (
          <path d="M160 34v6M146 40h28M146 50h28M160 50v10M146 60h28M146 70h28M160 70v10" />
        ) : (
          <path d="M160 34h48M160 34v10M146 44h28M146 54h28M160 54v26M208 34v10M194 44h28M194 54h28M208 54v26" />
        )}
      </g>
      <g fill="currentColor" fontSize="11">
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
      </g>
    </svg>
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
        { label: 'Vc', color: TRACE_COLORS[0], samples: vc },
        { label: 'V across R', color: TRACE_COLORS[1], samples: vr },
        { label: 'Target', color: TRACE_COLORS[3], samples: new Float64Array(N).fill(target) },
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
      lede="Combine a bank, read its stored energy, and watch it charge or discharge through a resistor. The scope axis is time from the switch closing."
      controls={
        <>
          <Segmented
            label="Bank topology"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'parallel', label: 'Parallel' },
              { value: 'series', label: 'Series' },
            ]}
          />
          <Schematic mode={mode} />

          <Group label="Bank">
            <Param label="C1" unit="F" value={c1} onChange={setC1} min={1e-12} max={1e-1} />
            <Param label="C2" unit="F" value={c2} onChange={setC2} min={1e-12} max={1e-1} />
            <Toggle label="Third capacitor" value={useThird} onChange={setUseThird} />
            {useThird && (
              <Param label="C3" unit="F" value={c3} onChange={setC3} min={1e-12} max={1e-1} />
            )}
          </Group>

          <Group label="Circuit">
            <Param label="Series resistor" unit="Ω" value={r} onChange={setR} min={1} max={10e6} />
            <Param
              label={curveMode === 'charge' ? 'Supply' : 'Starting voltage'}
              unit="V"
              value={supply}
              onChange={setSupply}
              min={0.1}
              max={50}
              log={false}
              step={0.1}
            />
          </Group>

          <Group label="Curve">
            <Segmented
              label="Direction"
              value={curveMode}
              onChange={setCurveMode}
              options={[
                { value: 'charge', label: 'Charge' },
                { value: 'discharge', label: 'Discharge' },
              ]}
            />
            <Param
              label="Target voltage"
              unit="V"
              value={target}
              onChange={setTarget}
              min={0.01}
              max={50}
              log={false}
              step={0.01}
              hint="ESP32 input-high threshold is about 2.48 V on a 3V3 rail."
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'Bank capacitance',
            value: formatSI(readout.total, 'F'),
            note: <T k="({values} in {mode})" vars={{ values: values.length, mode }} />,
          },
          { label: 'Time constant', value: formatSI(readout.tau, 's'), note: '(R·C)' },
          {
            label: curveMode === 'charge' ? 'Time to reach target' : 'Time to fall to target',
            value: formatSI(readout.tTarget, 's'),
            note: readout.reachable ? undefined : '(never, target is past the asymptote)',
            warn: !readout.reachable,
          },
          { label: '10-90% transition', value: formatSI(readout.tRise, 's'), note: '(2.197·tau)' },
          { label: 'Settled (5 tau)', value: formatSI(readout.tSettle, 's'), note: '(99.3%)' },
          {
            label: 'Stored energy',
            value: formatSI(readout.e, 'J'),
            note: <T k="at {supply}" vars={{ supply: formatSI(supply, 'V') }} />,
          },
          {
            label: 'Energy at target',
            value: formatSI(readout.eTarget, 'J'),
            note: <T k="({e}% of full)" vars={{ e: ((readout.eTarget / readout.e) * 100 || 0).toFixed(1) }} />,
          },
          { label: 'Stored charge', value: formatSI(readout.q, 'C') },
          {
            label: 'Peak current',
            value: formatSI(readout.peakCurrent, 'A'),
            note: '(at t = 0, V/R)',
            warn: gpioOver,
          },
          {
            label: 'Loss in R per charge',
            value: formatSI(readout.eResistor, 'J'),
            note: '(equals the stored energy, whatever R is)',
          },
          {
            label: 'Highest member voltage',
            value: formatSI(readout.maxMemberVoltage, 'V'),
            note:
              mode === 'series'
                ? `(${members.map((v) => formatSI(v, 'V')).join(' / ')})`
                : '(full rail on every member)',
            warn: unevenSplit,
          },
        ]}
      />

      {gpioOver && (
        <Warning
          text="Inrush is {peakCurrent}, over the {GPIO_MAX_MA} mA an ESP32 GPIO is rated for. An uncharged capacitor is a short circuit at t = 0, so drive it through a bigger resistor or a transistor."
          vars={{ peakCurrent: formatSI(readout.peakCurrent, 'A'), GPIO_MAX_MA }}
        />
      )}

      {overRail && curveMode === 'charge' && (
        <Warning
          text="The target is above the supply, so the curve never reaches it. Nothing above the rail is reachable through a passive RC."
        />
      )}

      {unevenSplit && (
        <Warning
          text="The string is unbalanced. Series capacitors share charge, not voltage, so the smallest member sits at {maxMemberVoltage} of the applied {supply} instead of an even {values}. Check it against its voltage rating, or add balancing resistors across each cap."
          vars={{
            maxMemberVoltage: formatSI(readout.maxMemberVoltage, 'V'),
            supply: formatSI(supply, 'V'),
            values: formatSI(supply / values.length, 'V'),
          }}
        />
      )}

      <Theory
        text={[
          "Parallel capacitors add plate area, so `C = C1 + C2 + ...`. In series every capacitor carries the same charge and the voltages add, so `1/C = 1/C1 + 1/C2 + ...` and the total is smaller than the smallest member.",
          "Stored energy is `E = 0.5·C·V²` and stored charge is `Q = C·V`. Energy is quadratic in voltage, so half the rail holds a quarter of the energy.",
          "Charging through R follows `v(t) = V·(1 - e^(-t/RC))` and discharging follows `v(t) = V0·e^(-t/RC)`. Inverting the first gives `t = -R·C·ln(1 - v/V)`, which is where the time-to-target figure comes from. One tau is 63.2%, two is 86.5%, five is 99.3%, and the rail itself is an asymptote the curve never actually touches.",
          "The scope samples those closed forms directly rather than integrating, so the trace is exact at any zoom and cannot go unstable when dt exceeds tau.",
          "Charging a capacitor through a resistor always dissipates `0.5·C·V²` in that resistor, exactly as much as ends up stored, no matter how large or small R is. That is why linear charging tops out at 50% efficient and why switchers exist.",
          "In a series string the voltage divides inversely with capacitance, `Vi = V·Ctotal/Ci`, so the smallest capacitor takes the most volts. That is the usual failure mode when caps are stacked for a higher working voltage.",
        ]}
      />
    </SimPage>
  )
}
