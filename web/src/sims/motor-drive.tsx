import { useMemo, useState } from 'react'
import { MOTORS, RPM_PER_RAD_S, analyse, simulate } from '../engine/motor'
import type { Motor } from '../engine/motor'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Schematic, Select, SimPage, Theory, Warning } from '../ui'

/** Samples per run, same budget as the other time-domain pages. */
const N = 4096

/** Below this the chopping is audible as a whine from the windings. */
const AUDIBLE_HZ = 20_000

function Diagram() {
  return (
    <Schematic viewBox="0 0 260 150" label="motor-drive.hBridgeSchematic">
      {/* supply rail across the top of the bridge */}
      <circle cx="56" cy="16" r="3" />
      <path d="M59 16h141M80 16v10M180 16v10" />
      {/* high side pair */}
      <rect x="72" y="26" width="16" height="20" />
      <rect x="172" y="26" width="16" height="20" />
      <path d="M80 46v24M180 46v24" />
      {/* the motor sits across the middle */}
      <circle cx="130" cy="70" r="16" />
      <path d="M80 70h34M180 70h-34" />
      {/* low side pair down to the return rail */}
      <path d="M80 70v24M180 70v24" />
      <rect x="72" y="94" width="16" height="20" />
      <rect x="172" y="94" width="16" height="20" />
      <path d="M80 114v10M180 114v10M80 124h100" />
      {/* ground */}
      <path d="M130 124v6M118 130h24M122 135h16M126 140h8" />
    {/* both half-bridge nodes are three-way joints */}
      <circle className="dot" cx="80" cy="70" r="2.5" />
      <circle className="dot" cx="180" cy="70" r="2.5" />
      <text x="34" y="12">
        +V
      </text>
      <text x="125" y="75">
        M
      </text>
      <text x="52" y="40">
        Q1
      </text>
      <text x="192" y="40">
        Q3
      </text>
      <text x="52" y="108">
        Q2
      </text>
      <text x="192" y="108">
        Q4
      </text>
    </Schematic>
  )
}

export default function MotorDrive() {
  const [preset, setPreset] = useState(MOTORS[1].value)
  const [supply, setSupply] = useState(MOTORS[1].supply)
  const [duty, setDuty] = useState(0.8)
  const [kv, setKv] = useState(MOTORS[1].kv)
  const [resistance, setResistance] = useState(MOTORS[1].resistance)
  const [inductance, setInductance] = useState(MOTORS[1].inductance)
  const [inertia, setInertia] = useState(MOTORS[1].inertia)
  const [friction, setFriction] = useState(MOTORS[1].friction)
  const [loadTorque, setLoadTorque] = useState(2e-3)
  const [fpwm, setFpwm] = useState(20_000)
  const [driverLimit, setDriverLimit] = useState(1.5)

  const pickPreset = (next: string) => {
    setPreset(next)
    const m = MOTORS.find((p) => p.value === next)
    if (!m) return
    setSupply(m.supply)
    setKv(m.kv)
    setResistance(m.resistance)
    setInductance(m.inductance)
    setInertia(m.inertia)
    setFriction(m.friction)
  }

  const motor: Motor = {
    supply,
    duty,
    kv,
    resistance,
    inductance,
    inertia,
    friction,
    loadTorque,
    fpwm,
  }

  const { r, dt, traces } = useMemo(() => {
    const r = analyse(motor)
    // Six mechanical time constants is the whole startup with room to spare.
    const span = Math.max(6 * r.mechanicalTau, 20 * r.electricalTau, 1e-3)
    const run = simulate(motor, N, span)
    return {
      r,
      dt: run.dt,
      traces: [
        { label: 'motor-drive.current', samples: run.current },
        {
          // Speed shares the current axis, divided so the two fit one scale.
          label: 'motor-drive.speedKrpm',
          samples: Float64Array.from(run.speedRpm, (v) => v / 1000),
        },
      ],
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supply, duty, kv, resistance, inductance, inertia, friction, loadTorque, fpwm])

  const overDriver = r.stallCurrent > driverLimit
  const rippleShare = r.current > 0 ? r.ripple / r.current : 0

  return (
    <SimPage
      id="motor-drive"
      lede="motor-drive.lede"
      controls={
        <>
          <Diagram />

          <Group label="motor-drive.drive">
            <Select
              label="motor-drive.preset"
              value={preset}
              onChange={pickPreset}
              options={MOTORS}
            />
            <Param
              label="common.supply"
              unit="V"
              value={supply}
              onChange={setSupply}
              min={1}
              max={48}
              log={false}
              step={0.1}
            />
            <Param
              label="common.dutyCycle"
              value={duty}
              onChange={setDuty}
              min={0.01}
              max={1}
              log={false}
              step={0.01}
              hint={<T k="motor-drive.appliedAverage" vars={{ v: formatSI(r.applied, 'V') }} />}
            />
            <Param
              label="common.switchingFrequency"
              unit="Hz"
              value={fpwm}
              onChange={setFpwm}
              min={100}
              max={100e3}
            />
            <Param
              label="motor-drive.driverCurrentLimit"
              unit="A"
              value={driverLimit}
              onChange={setDriverLimit}
              min={0.1}
              max={30}
              hint="motor-drive.driverHint"
            />
          </Group>

          <Group label="motor-drive.motor">
            <Param
              label="motor-drive.speedConstantKv"
              unit="rpm/V"
              value={kv}
              onChange={setKv}
              min={10}
              max={5000}
            />
            <Param
              label="motor-drive.windingResistance"
              unit="Ω"
              value={resistance}
              onChange={setResistance}
              min={0.05}
              max={100}
            />
            <Param
              label="motor-drive.windingInductance"
              unit="H"
              value={inductance}
              onChange={setInductance}
              min={1e-5}
              max={1e-1}
            />
          </Group>

          <Group label="motor-drive.mechanics">
            <Param
              label="motor-drive.rotorInertia"
              unit="kg·m²"
              value={inertia}
              onChange={setInertia}
              min={1e-8}
              max={1e-2}
            />
            <Param
              label="motor-drive.viscousFriction"
              unit="N·m·s"
              value={friction}
              onChange={setFriction}
              min={1e-9}
              max={1e-3}
            />
            <Param
              label="motor-drive.loadTorque"
              unit="N·m"
              value={loadTorque}
              onChange={setLoadTorque}
              min={0}
              max={0.5}
              log={false}
              step={1e-4}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          {
            label: 'motor-drive.shaftSpeed',
            value: `${r.speedRpm.toFixed(0)} rpm`,
            note: <T k="motor-drive.noLoadWouldBe" vars={{ rpm: r.noLoadRpm.toFixed(0) }} />,
            warn: r.stalled,
          },
          {
            label: 'motor-drive.runningCurrent',
            value: formatSI(r.current, 'A'),
            note: <T k="motor-drive.ofStall" vars={{ pct: ((r.current / r.stallCurrent) * 100).toFixed(0) }} />,
          },
          {
            label: 'motor-drive.stallCurrent',
            value: formatSI(r.stallCurrent, 'A'),
            note: 'motor-drive.atStandstill',
            warn: overDriver,
          },
          { label: 'motor-drive.shaftTorque', value: formatSI(r.torque, 'N·m') },
          {
            label: 'motor-drive.stallTorque',
            value: formatSI(r.stallTorque, 'N·m'),
            note: 'motor-drive.mostItCanPush',
          },
          {
            label: 'motor-drive.backEmf',
            value: formatSI(r.backEmf, 'V'),
            note: <T k="motor-drive.ofApplied" vars={{ pct: r.applied > 0 ? ((r.backEmf / r.applied) * 100).toFixed(0) : '0' }} />,
          },
          {
            label: 'motor-drive.currentRipple',
            value: formatSI(r.ripple, 'A'),
            note: <T k="motor-drive.ofRunningCurrent" vars={{ pct: (rippleShare * 100).toFixed(0) }} />,
          },
          {
            label: 'motor-drive.electricalTime',
            value: formatSI(r.electricalTau, 's'),
            note: 'motor-drive.windingLOverR',
          },
          {
            label: 'motor-drive.mechanicalTime',
            value: formatSI(r.mechanicalTau, 's'),
            note: 'motor-drive.whatSetsTheRamp',
          },
          { label: 'motor-drive.mechanicalPower', value: formatSI(r.pMechanical, 'W') },
          {
            label: 'common.efficiency',
            value: `${(r.efficiency * 100).toFixed(1)} %`,
            note: <T k="motor-drive.copperLoss" vars={{ w: formatSI(r.pCopper, 'W') }} />,
          },
        ]}
      />

      <Warning when={r.stalled}
        text="motor-drive.warnStalled"
        vars={{ load: formatSI(loadTorque, 'N·m'), stall: formatSI(r.stallTorque, 'N·m') }}
      />
      <Warning when={overDriver}
        text="motor-drive.warnDriver"
        vars={{ stall: formatSI(r.stallCurrent, 'A'), limit: formatSI(driverLimit, 'A') }}
      />
      {fpwm < AUDIBLE_HZ && (
        <Warning text="motor-drive.warnAudible" vars={{ f: formatSI(fpwm, 'Hz') }} />
      )}
      <Warning when={rippleShare > 0.5 && !r.stalled} text="motor-drive.warnRipple" vars={{ pct: (rippleShare * 100).toFixed(0) }} />

      <Theory
        text={[
          'motor-drive.theory1',
          'motor-drive.theory2',
          'motor-drive.theory3',
          'motor-drive.theory4',
        ]}
        vars={{ rpmPerRad: RPM_PER_RAD_S.toFixed(4) }}
      />
    </SimPage>
  )
}
