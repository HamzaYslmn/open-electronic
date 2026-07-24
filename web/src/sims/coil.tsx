import { useMemo, useState } from 'react'
import { PROTECTION_OPTIONS, analyse, simulate } from '../engine/coil'
import type { CoilParams, Protection } from '../engine/coil'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import type { Trace } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per sweep, same budget as every other time-domain page here. */
const N = 8192

function Schematic({ protection }: { protection: Protection }) {
  return (
    <svg className="schematic" viewBox="0 0 260 130" aria-label="Low side switched coil">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* supply rail */}
        <path d="M40 16h180M150 16v14" />
        {/* the winding */}
        <path d="M150 30a7 7 0 0 1 0 8a7 7 0 0 1 0 8a7 7 0 0 1 0 8a7 7 0 0 1 0 8" />
        <path d="M150 62v12" />
        {/* switch */}
        <rect x="132" y="74" width="36" height="24" />
        <path d="M132 86H96M150 98v14M132 112h36M138 118h24M144 124h12" />
        {/* flyback diode */}
        {protection !== 'none' && (
          <>
            <path d="M204 16v24M196 40h16M204 52l-8-12h16zM204 52v18h-54" />
          </>
        )}
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="20" y="20">
          +V
        </text>
        <text x="160" y="50">
          L
        </text>
        <text x="139" y="90">
          Q1
        </text>
        <text x="60" y="83">
          GPIO
        </text>
        {protection !== 'none' && (
          <text x="214" y="46">
            D1
          </text>
        )}
      </g>
    </svg>
  )
}

export default function Coil() {
  // A small relay coil: roughly 100 mH of winding on 70 ohm of copper.
  const [l, setL] = useState(0.1)
  const [r, setR] = useState(70)
  // Default to the house 3.3 V rail. Most relays and solenoids actually want a
  // 5 V or 12 V coil, so the slider goes there, but nothing here requires it.
  const [supply, setSupply] = useState(VCC)
  const [frequency, setFrequency] = useState(100)
  const [duty, setDuty] = useState(0.5)
  const [cycles, setCycles] = useState(3)
  const [protection, setProtection] = useState<Protection>('silicon')
  // 1 us is a typical small BJT or logic-level MOSFET turn-off.
  const [turnOff, setTurnOff] = useState(1e-6)
  // 2N2222A Vceo, the part most people reach for first.
  const [vBreakdown, setVBreakdown] = useState(40)
  const [iSat, setISat] = useState(0.2)

  const { dt, traces, readout } = useMemo(() => {
    const p: CoilParams = {
      supply,
      l,
      r,
      frequency,
      duty,
      protection,
      turnOff,
      vBreakdown,
      iSat,
    }
    const sim = simulate(p, N, cycles)
    const traces: Trace[] = [
      { label: 'I coil', color: TRACE_COLORS[0], samples: sim.clamped },
    ]
    // With no clamp the two runs are identical, so only draw the comparison
    // when a diode is actually fitted.
    if (protection !== 'none') {
      traces.push({ label: 'I no diode', color: TRACE_COLORS[4], samples: sim.unclamped })
    }
    return { dt: sim.dt, traces, readout: analyse(p, sim.measure) }
  }, [supply, l, r, frequency, duty, cycles, protection, turnOff, vBreakdown, iSat])

  const satPercent = iSat > 0 ? (readout.iPeak / iSat) * 100 : Infinity

  return (
    <SimPage
      id="coil"
      lede="A relay or solenoid coil switched by a low-side transistor. The scope plots coil current against time across the switching cycle. Watch the ramp fill the core, then watch what the coil does to the transistor when the switch opens."
      controls={
        <>
          <Schematic protection={protection} />

          <Group label="Coil">
            <Param label="Inductance" unit="H" value={l} onChange={setL} min={1e-6} max={10} />
            <Param label="Winding DCR" unit="Ω" value={r} onChange={setR} min={0.1} max={10e3} />
            <Param
              label="Saturation current"
              unit="A"
              value={iSat}
              onChange={setISat}
              min={1e-3}
              max={50}
              hint="Where the core gives up and L collapses."
            />
          </Group>

          <Group label="Drive">
            <Param
              label="Supply"
              unit="V"
              value={supply}
              onChange={setSupply}
              min={1}
              max={60}
              log={false}
              step={0.1}
              hint="3V3 by default. Most relay coils are 5 V or 12 V parts."
            />
            <Param
              label="Switching frequency"
              unit="Hz"
              value={frequency}
              onChange={setFrequency}
              min={0.1}
              max={100e3}
            />
            <Param
              label="Duty"
              unit="%"
              value={duty * 100}
              onChange={(v) => setDuty(v / 100)}
              min={1}
              max={99}
              log={false}
              step={1}
            />
            <Param
              label="Cycles shown"
              value={cycles}
              onChange={(v) => setCycles(Math.round(v))}
              min={1}
              max={10}
              log={false}
              step={1}
            />
          </Group>

          <Group label="Switch and clamp">
            <Segmented
              label="Flyback clamp"
              value={protection}
              onChange={setProtection}
              options={PROTECTION_OPTIONS}
            />
            <Param
              label="Turn-off time"
              unit="s"
              value={turnOff}
              onChange={setTurnOff}
              min={1e-9}
              max={1e-3}
              hint="How fast the switch opens. This alone sets di/dt."
            />
            <Param
              label="Switch Vceo rating"
              unit="V"
              value={vBreakdown}
              onChange={setVBreakdown}
              min={5}
              max={1000}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'Time constant L/R', value: formatSI(readout.tau, 's') },
          {
            label: 'Steady current',
            value: formatSI(readout.iSteady, 'A'),
            note: '(V - Vsat) / R',
          },
          {
            label: 'Peak current',
            value: formatSI(readout.iPeak, 'A'),
            note: readout.continuous ? '(never reaches zero)' : '(falls to zero each cycle)',
            warn: readout.overGpio,
          },
          { label: 'Current swing', value: formatSI(readout.ripple, 'A') },
          {
            label: 'Stored energy at peak',
            value: formatSI(readout.energyPeak, 'J'),
            note: '0.5·L·I²',
          },
          {
            label: 'Reactance XL',
            value: formatSI(readout.xl, 'Ω'),
            note: `at ${formatSI(frequency, 'Hz')}`,
          },
          { label: 'Coil impedance |Z|', value: formatSI(readout.z, 'Ω') },
          {
            label: 'Kick, unclamped',
            value: formatSI(readout.kick, 'V'),
            note: `switch sees ${formatSI(readout.vSwitchOpen, 'V')}`,
            warn: !readout.hasClamp && readout.overBreakdown,
          },
          {
            label: 'Clamped to',
            value: readout.hasClamp ? formatSI(readout.vSwitchClamped, 'V') : 'nothing fitted',
            note: readout.hasClamp
              ? `supply + Vf (${formatSI(readout.vf, 'V')})`
              : 'no freewheel path',
            warn: !readout.hasClamp || readout.clampOverBreakdown,
          },
          {
            label: 'Release time',
            value: formatSI(readout.release, 's'),
            note: readout.hasClamp ? 'freewheel to zero' : 'switch turn-off',
          },
          { label: 'Winding dissipation', value: formatSI(readout.coilPower, 'W') },
          {
            label: 'Clamp dissipation',
            value: readout.hasClamp ? formatSI(readout.diodePower, 'W') : 'n/a',
            note: readout.hasClamp ? `peak ${formatSI(readout.iPeak, 'A')}` : undefined,
          },
          {
            label: 'Saturation headroom',
            value: `${satPercent.toFixed(0)}% of Isat`,
            warn: readout.saturating,
          },
        ]}
      />

      {!readout.hasClamp && (
        <Warning>
          No clamp fitted. Interrupting {formatSI(readout.iPeak, 'A')} through{' '}
          {formatSI(l, 'H')} in {formatSI(turnOff, 's')} drives the collector to{' '}
          {formatSI(readout.vSwitchOpen, 'V')}
          {readout.overBreakdown
            ? `, past the ${formatSI(vBreakdown, 'V')} rating of the switch. The transistor
               avalanches and takes the energy as heat, usually once.`
            : '. That is inside the rating here, but only because the coil is small.'}{' '}
          Real boards clamp it anyway: winding capacitance is the only thing holding this
          number finite.
        </Warning>
      )}

      {readout.hasClamp && readout.clampOverBreakdown && (
        <Warning>
          Even clamped, the switch sits at {formatSI(readout.vSwitchClamped, 'V')}, above its{' '}
          {formatSI(vBreakdown, 'V')} rating. The diode is not the problem, the supply is.
        </Warning>
      )}

      {readout.saturating && (
        <Warning>
          Peak current is {satPercent.toFixed(0)}% of the {formatSI(iSat, 'A')} saturation
          point. Past saturation the inductance collapses, the ramp goes near vertical and
          the real current overshoots everything shown here. This model assumes L is
          constant, so treat the trace as optimistic.
        </Warning>
      )}

      {readout.overGpio && (
        <Warning>
          {formatSI(readout.iPeak, 'A')} is well past the {GPIO_MAX_MA} mA an ESP32 pin can
          sink. The transistor in the schematic is not optional, and the pin drives its base
          or gate only.
        </Warning>
      )}

      <Theory>
        <p>
          Closing the switch puts the supply across a series RL. Current cannot step, so it
          ramps: <code>i(t) = (V/R)·(1 - e^(-t·R/L))</code> with time constant{' '}
          <code>tau = L/R</code>. It is 63.2% of the way there after one tau and 99.3% after
          five, exactly like a capacitor charging, with current and voltage swapped.
        </p>
        <p>
          That current is energy in the core, <code>E = 0.5·L·I²</code>. Open the switch and
          the energy has nowhere to go, so the coil produces whatever voltage keeps the
          current flowing: <code>Vkick = L·di/dt</code>. Turn off 44 mA through 100 mH in one
          microsecond and that is over 4 kV. The switch, not the coil, is what fails.
        </p>
        <p>
          A flyback diode across the coil gives the current a loop to run in. The switch node
          is then held at <code>Vsupply + Vf</code>, i.e. under a volt above the rail. The
          current freewheels down against the diode drop,{' '}
          <code>i(t) = (I + Vf/R)·e^(-t·R/L) - Vf/R</code>, reaching zero at{' '}
          <code>t = (L/R)·ln(1 + I·R/Vf)</code>. That is the catch: the clamp is why a
          relay with a plain diode drops out slowly. A Schottky clamps lower, a zener or a
          resistor in series with the diode releases faster at the cost of a higher switch
          voltage.
        </p>
        <p>
          At the drive frequency the winding also presents <code>XL = 2·pi·f·L</code>, so the
          coil impedance is <code>|Z| = sqrt(R² + XL²)</code>. That is what limits current
          once you PWM the coil rather than switching it once.
        </p>
        <p>
          Both phases of the trace step with exact zero-order-hold discretisation,{' '}
          <code>i[n] = I∞ + (i[n-1] - I∞)·e^(-dt/tau)</code>, so the samples sit on the
          analytic curve at any step size instead of ringing or diverging the way forward
          Euler does when dt passes tau.
        </p>
      </Theory>
    </SimPage>
  )
}
