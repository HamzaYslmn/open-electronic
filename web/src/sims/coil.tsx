import { useMemo, useState } from 'react'
import { PROTECTION_OPTIONS, analyse, simulate } from '../engine/coil'
import type { CoilParams, Protection } from '../engine/coil'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import type { Trace } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per sweep, same budget as every other time-domain page here. */
const N = 8192

function Schematic({ protection }: { protection: Protection }) {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 130" aria-label={t('coil.lowSideSwitchedCoil')}>
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
      { label: 'coil.iCoil', color: TRACE_COLORS[0], samples: sim.clamped },
    ]
    // With no clamp the two runs are identical, so only draw the comparison
    // when a diode is actually fitted.
    if (protection !== 'none') {
      traces.push({ label: 'coil.iNoDiode', color: TRACE_COLORS[4], samples: sim.unclamped })
    }
    return { dt: sim.dt, traces, readout: analyse(p, sim.measure) }
  }, [supply, l, r, frequency, duty, cycles, protection, turnOff, vBreakdown, iSat])

  const satPercent = iSat > 0 ? (readout.iPeak / iSat) * 100 : Infinity

  return (
    <SimPage
      id="coil"
      lede="coil.lede"
      controls={
        <>
          <Schematic protection={protection} />

          <Group label="coil.coil">
            <Param label="common.inductance" unit="H" value={l} onChange={setL} min={1e-6} max={10} />
            <Param label="coil.windingDcr" unit="Ω" value={r} onChange={setR} min={0.1} max={10e3} />
            <Param
              label="common.saturationCurrent"
              unit="A"
              value={iSat}
              onChange={setISat}
              min={1e-3}
              max={50}
              hint="coil.whereTheCoreGives"
            />
          </Group>

          <Group label="common.drive">
            <Param
              label="common.supply"
              unit="V"
              value={supply}
              onChange={setSupply}
              min={1}
              max={60}
              log={false}
              step={0.1}
              hint="coil.3v3ByDefaultMost"
            />
            <Param
              label="common.switchingFrequency"
              unit="Hz"
              value={frequency}
              onChange={setFrequency}
              min={0.1}
              max={100e3}
            />
            <Param
              label="common.duty"
              unit="%"
              value={duty * 100}
              onChange={(v) => setDuty(v / 100)}
              min={1}
              max={99}
              log={false}
              step={1}
            />
            <Param
              label="common.cyclesShown"
              value={cycles}
              onChange={(v) => setCycles(Math.round(v))}
              min={1}
              max={10}
              log={false}
              step={1}
            />
          </Group>

          <Group label="coil.switchAndClamp">
            <Segmented
              label="coil.flybackClamp"
              value={protection}
              onChange={setProtection}
              options={PROTECTION_OPTIONS}
            />
            <Param
              label="coil.turnOffTime"
              unit="s"
              value={turnOff}
              onChange={setTurnOff}
              min={1e-9}
              max={1e-3}
              hint="coil.howFastTheSwitch"
            />
            <Param
              label="coil.switchVceoRating"
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
          { label: 'coil.timeConstantLR', value: formatSI(readout.tau, 's') },
          {
            label: 'coil.steadyCurrent',
            value: formatSI(readout.iSteady, 'A'),
            note: 'coil.vVsatR',
          },
          {
            label: 'common.peakCurrent',
            value: formatSI(readout.iPeak, 'A'),
            note: readout.continuous ? 'coil.neverReachesZero' : 'coil.fallsToZeroEach',
            warn: readout.overGpio,
          },
          { label: 'coil.currentSwing', value: formatSI(readout.ripple, 'A') },
          {
            label: 'coil.storedEnergyAtPeak',
            value: formatSI(readout.energyPeak, 'J'),
            note: '0.5·L·I²',
          },
          {
            label: 'common.reactanceXl',
            value: formatSI(readout.xl, 'Ω'),
            note: <T k="coil.at" vars={{ frequency: formatSI(frequency, 'Hz') }} />,
          },
          { label: 'coil.coilImpedanceZ', value: formatSI(readout.z, 'Ω') },
          {
            label: 'coil.kickUnclamped',
            value: formatSI(readout.kick, 'V'),
            note: <T k="coil.switchSees" vars={{ vSwitchOpen: formatSI(readout.vSwitchOpen, 'V') }} />,
            warn: !readout.hasClamp && readout.overBreakdown,
          },
          {
            label: 'coil.clampedTo',
            value: readout.hasClamp ? formatSI(readout.vSwitchClamped, 'V') : 'coil.nothingFitted',
            note: readout.hasClamp
              ? <T k="coil.supplyVf" vars={{ vf: formatSI(readout.vf, 'V') }} />
              : 'coil.noFreewheelPath',
            warn: !readout.hasClamp || readout.clampOverBreakdown,
          },
          {
            label: 'coil.releaseTime',
            value: formatSI(readout.release, 's'),
            note: readout.hasClamp ? 'coil.freewheelToZero' : 'coil.switchTurnOff',
          },
          { label: 'coil.windingDissipation', value: formatSI(readout.coilPower, 'W') },
          {
            label: 'coil.clampDissipation',
            value: readout.hasClamp ? formatSI(readout.diodePower, 'W') : 'n/a',
            note: readout.hasClamp ? <T k="coil.peak" vars={{ iPeak: formatSI(readout.iPeak, 'A') }} /> : undefined,
          },
          {
            label: 'coil.saturationHeadroom',
            value: <T k="coil.ofIsat" vars={{ satPercent: satPercent.toFixed(0) }} />,
            warn: readout.saturating,
          },
        ]}
      />

      {!readout.hasClamp && (
        <Warning
          text="coil.warn1"
          vars={{
            iPeak: formatSI(readout.iPeak, 'A'),
            l: formatSI(l, 'H'),
            turnOff: formatSI(turnOff, 's'),
            vSwitchOpen: formatSI(readout.vSwitchOpen, 'V'),
            vBreakdown: formatSI(vBreakdown, 'V'),
            small: readout.overBreakdown
              ? 'coil.pastTheRatingOf'
              : 'coil.thatIsInsideThe',
          }}
        />
      )}

      {readout.hasClamp && readout.clampOverBreakdown && (
        <Warning
          text="coil.warn2"
          vars={{
            vSwitchClamped: formatSI(readout.vSwitchClamped, 'V'),
            vBreakdown: formatSI(vBreakdown, 'V'),
          }}
        />
      )}

      {readout.saturating && (
        <Warning
          text="coil.warn3"
          vars={{ satPercent: satPercent.toFixed(0), iSat: formatSI(iSat, 'A') }}
        />
      )}

      {readout.overGpio && (
        <Warning
          text="coil.warn4"
          vars={{ iPeak: formatSI(readout.iPeak, 'A'), GPIO_MAX_MA }}
        />
      )}

      <Theory
        text={[
          'coil.theory1',
          'coil.thatCurrentIsEnergy',
          'coil.aFlybackDiodeAcross',
          'coil.atTheDriveFrequency',
          'coil.bothPhasesOfThe',
        ]}
      />
    </SimPage>
  )
}
