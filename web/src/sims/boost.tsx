import { useMemo, useState } from 'react'
import {
  MAX_PRACTICAL_DUTY,
  RIPPLE_TARGET,
  SCHOTTKY_VF,
  analyse,
  waveform,
} from '../engine/boost'
import { VCC, VCC_5V } from '../engine/constants'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per sweep, matched to the rest of the scope pages. */
const N = 8192

/** Usual voltage derating on the switch and the rectifier, for the ringing. */
const DERATE = 1.5

const pct = (x: number) => (Number.isFinite(x) ? `${(x * 100).toFixed(1)}%` : 'n/a')
const times = (x: number) => (Number.isFinite(x) ? `${x.toFixed(2)}x` : 'n/a')

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 116" aria-label={t('Boost converter power stage')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* input source */}
        <circle cx="24" cy="34" r="10" />
        <path d="M18 34a6 6 0 0 1 12 0M24 44v52h176M34 34h26" />
        {/* inductor */}
        <path d="M60 34a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0" />
        <path d="M108 34h42" />
        {/* switch to ground */}
        <path d="M130 34v14M130 72v24M130 70l11-16" />
        {/* diode */}
        <path d="M150 26v16l16-8Z" />
        <path d="M166 26v16M166 34h34" />
        {/* output capacitor */}
        <path d="M200 34v20M188 54h24M188 62h24M200 62v34" />
        <path d="M200 34h32" />
      </g>
      <g fill="currentColor">
        <circle cx="130" cy="34" r="2.5" />
        <circle cx="130" cy="50" r="2" />
        <circle cx="130" cy="70" r="2" />
        <circle cx="200" cy="34" r="2.5" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="78" y="20">
          L
        </text>
        <text x="144" y="66">
          SW
        </text>
        <text x="152" y="20">
          D
        </text>
        <text x="216" y="60">
          Cout
        </text>
        <text x="4" y="60">
          Vin
        </text>
        <text x="206" y="24">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function Boost() {
  const [vin, setVin] = useState(VCC)
  // 5 V default output: the reason to boost off an ESP32 board is almost always
  // a WS2812 strip or a USB peripheral, and both genuinely need the 5 V rail.
  const [vout, setVout] = useState(VCC_5V)
  const [iout, setIout] = useState(0.5)
  const [l, setL] = useState(6.8e-6)
  const [isat, setIsat] = useState(2)
  const [fsw, setFsw] = useState(500e3)
  const [cout, setCout] = useState(22e-6)
  const [esr, setEsr] = useState(0.02)
  const [vd, setVd] = useState(SCHOTTKY_VF)
  const [ron, setRon] = useState(0.1)
  const [dcr, setDcr] = useState(0.05)
  const [cycles, setCycles] = useState(3)

  const { r, dt, traces } = useMemo(() => {
    const r = analyse({ vin, vout, iout, l, isat, fsw, cout, esr, vd, ron, dcr })
    const { dt, il, isw, idiode } = waveform(r, N, cycles)
    return {
      r,
      dt,
      traces: [
        { label: 'IL', color: TRACE_COLORS[0], samples: il },
        { label: 'I switch', color: TRACE_COLORS[2], samples: isw },
        { label: 'I diode', color: TRACE_COLORS[3], samples: idiode },
      ],
    }
  }, [vin, vout, iout, l, isat, fsw, cout, esr, vd, ron, dcr, cycles])

  return (
    <SimPage
      id="boost"
      lede="Steady-state inductor current in a step-up converter. The horizontal axis is time, a few switching periods wide. Sky is the inductor, green is what the switch pulls to ground, amber is what the diode hands to the output cap: the gap between those two is why the input current runs higher than the output current."
      controls={
        <>
          <Schematic />

          <Group label="Rails">
            <Param
              label="Input Vin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={0.5}
              max={24}
              log={false}
              step={0.05}
              hint="3.3 V is the ESP32 rail."
            />
            <Param
              label="Output Vout"
              unit="V"
              value={vout}
              onChange={setVout}
              min={1}
              max={60}
              log={false}
              step={0.1}
            />
            <Param
              label="Load Iout"
              unit="A"
              value={iout}
              onChange={setIout}
              min={1e-3}
              max={5}
            />
          </Group>

          <Group label="Power stage">
            <Param
              label="Inductor L"
              unit="H"
              value={l}
              onChange={setL}
              min={1e-7}
              max={1e-3}
            />
            <Param
              label="Inductor Isat"
              unit="A"
              value={isat}
              onChange={setIsat}
              min={0.05}
              max={20}
              hint="Datasheet saturation current, not the RMS rating."
            />
            <Param
              label="Switching fsw"
              unit="Hz"
              value={fsw}
              onChange={setFsw}
              min={10e3}
              max={5e6}
            />
            <Param
              label="Output Cout"
              unit="F"
              value={cout}
              onChange={setCout}
              min={1e-6}
              max={2e-3}
            />
            <Param
              label="Cout ESR"
              unit="Ω"
              value={esr}
              onChange={setEsr}
              min={1e-3}
              max={2}
            />
          </Group>

          <Group label="Real parts">
            <Param
              label="Diode drop Vd"
              unit="V"
              value={vd}
              onChange={setVd}
              min={0}
              max={1.2}
              log={false}
              step={0.01}
              hint="Schottky 0.3 to 0.5 V, silicon 0.7 V, sync rectifier near 0."
            />
            <Param
              label="Switch Rds(on)"
              unit="Ω"
              value={ron}
              onChange={setRon}
              min={1e-3}
              max={2}
            />
            <Param
              label="Inductor DCR"
              unit="Ω"
              value={dcr}
              onChange={setDcr}
              min={1e-3}
              max={2}
            />
          </Group>

          <Group label="Scope">
            <Param
              label="Switching periods shown"
              value={cycles}
              onChange={(v) => setCycles(Math.round(v))}
              min={1}
              max={10}
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
            label: 'Duty D',
            value: pct(r.duty),
            note: <T k="ideal 1 - Vin/Vout = {dutyIdeal}" vars={{ dutyIdeal: pct(r.dutyIdeal) }} />,
            warn: r.extremeDuty || !r.achievable,
          },
          {
            label: 'Conduction mode',
            value: r.achievable ? r.mode : 'none',
            note: r.achievable
              ? <T k="DCM below {ioutBoundary} of load" vars={{ ioutBoundary: formatSI(r.ioutBoundary, 'A') }} />
              : 'no steady state',
            warn: r.mode === 'DCM' || !r.achievable,
          },
          {
            label: 'On time',
            value: formatSI(r.ton, 's'),
            note: <T k="off {toff}" vars={{ toff: formatSI(r.toff, 's') }} />,
          },
          {
            label: 'Input current Iin',
            value: formatSI(r.iin, 'A'),
            note: <T k="{iout} the load, avg inductor current" vars={{ iout: times(r.iin / iout) }} />,
          },
          {
            label: 'Inductor ripple',
            value: formatSI(r.ripple, 'A'),
            note: <T k="{rippleRatio} of Iin, aim for {RIPPLE_TARGET}" vars={{ rippleRatio: pct(r.rippleRatio), RIPPLE_TARGET: pct(RIPPLE_TARGET) }} />,
            warn: r.highRipple,
          },
          {
            label: 'Peak inductor current',
            value: formatSI(r.ipeak, 'A'),
            note: <T k="valley {ivalley}, Isat {isat}" vars={{ ivalley: formatSI(r.ivalley, 'A'), isat: formatSI(isat, 'A') }} />,
            warn: r.saturating,
          },
          {
            label: 'Inductor RMS',
            value: formatSI(r.ilRms, 'A'),
            note: <T k="switch {iswRms} rms, diode {iout} avg" vars={{ iswRms: formatSI(r.iswRms, 'A'), iout: formatSI(iout, 'A') }} />,
          },
          {
            label: 'Output ripple',
            value: formatSI(r.vRipple, 'V'),
            note: <T k="{vRippleCap} from C, {vRippleEsr} from ESR" vars={{ vRippleCap: formatSI(r.vRippleCap, 'V'), vRippleEsr: formatSI(r.vRippleEsr, 'V') }} />,
          },
          {
            label: 'Switch voltage stress',
            value: formatSI(r.vSwitchStress, 'V'),
            note: <T k="Vout + Vd, so rate it for {vSwitchStress}" vars={{ vSwitchStress: formatSI(DERATE * r.vSwitchStress, 'V') }} />,
          },
          {
            label: 'Diode reverse stress',
            value: formatSI(r.vDiodeStress, 'V'),
            note: <T k="rate it for {vDiodeStress}" vars={{ vDiodeStress: formatSI(DERATE * r.vDiodeStress, 'V') }} />,
          },
          {
            label: 'Efficiency',
            value: pct(r.efficiency),
            note: <T k="{pout} out, {ploss} conduction loss" vars={{ pout: formatSI(r.pout, 'W'), ploss: formatSI(r.ploss, 'W') }} />,
          },
          {
            label: 'Highest Vout reachable',
            value: formatSI(r.voutMax, 'V'),
            note: <T k="at this load, with {ron} in series" vars={{ ron: formatSI(dcr + ron, 'Ω') }} />,
            warn: !r.achievable && r.stepUp,
          },
          {
            label: 'L needed for CCM',
            value: formatSI(r.lBoundary, 'H'),
            note: <T k="you have {l}" vars={{ l: formatSI(l, 'H') }} />,
            warn: r.mode === 'DCM',
          },
        ]}
      />

      {!r.stepUp && (
        <Warning
          text="Vout of {vout} is not above the {vin} input, so there is nothing for a boost to do. With the switch off the inductor and diode are just a lossy wire and the output sits at Vin minus a diode drop. Use a buck stage below the input, or a buck-boost if the input crosses the output."
          vars={{ vout: formatSI(vout, 'V'), vin: formatSI(vin, 'V') }}
        />
      )}

      {r.stepUp && !r.achievable && (
        <Warning
          text="{ron} of series resistance caps this stage at {voutMax} into a {iout} load, so {vout} is unreachable at any duty. Past the peak, more duty means less output: the inductor spends so long disconnected from the load that the extra I²R loss beats the extra energy stored. Lower the load, use a lower DCR inductor or a better switch."
          vars={{
            ron: formatSI(dcr + ron, 'Ω'),
            voutMax: formatSI(r.voutMax, 'V'),
            iout: formatSI(iout, 'A'),
            vout: formatSI(vout, 'V'),
          }}
        />
      )}

      {r.extremeDuty && (
        <Warning
          text="D = {duty} is past the {MAX_PRACTICAL_DUTY} where this model is worth trusting. The diode only conducts for {toff} per cycle, so the peak currents and the I²R losses climb fast, the right-half-plane zero drops to where the loop is hard to compensate, and most controllers clamp the duty here anyway. Raise Vin, or use a two-stage or transformer-coupled topology."
          vars={{
            duty: pct(r.duty),
            MAX_PRACTICAL_DUTY: pct(MAX_PRACTICAL_DUTY),
            toff: formatSI(r.toff, 's'),
          }}
        />
      )}

      {r.saturating && (
        <Warning
          text="Peak current {ipeak} is over the {isat} saturation rating. A saturated core loses inductance, so the current ramp goes near vertical and the switch sees a spike this linear model does not predict. Every number above is optimistic. Use a bigger inductor, raise fsw or pick a higher Isat part."
          vars={{ ipeak: formatSI(r.ipeak, 'A'), isat: formatSI(isat, 'A') }}
        />
      )}

      {r.mode === 'DCM' && (
        <Warning
          text="The inductor empties every cycle, so this is discontinuous conduction and D = 1 - Vin/Vout no longer applies. The duty above is the DCM solution instead. Output ripple and the peak current are both worse than the CCM formulas suggest, and the loop gain changes shape. Above {ioutBoundary} of load, or above {lBoundary} of inductance, it goes back to CCM."
          vars={{
            ioutBoundary: formatSI(r.ioutBoundary, 'A'),
            lBoundary: formatSI(r.lBoundary, 'H'),
          }}
        />
      )}

      {r.highRipple && r.mode === 'CCM' && (
        <Warning
          text="Ripple is {rippleRatio} of the average input current. The usual target is 30 to 40%: past that the peak current, the core loss and the output ripple all grow for no benefit. Raise L or fsw."
          vars={{ rippleRatio: pct(r.rippleRatio) }}
        />
      )}

      <Theory
        text={[
          "In steady state the inductor has to reset every cycle, so the volt-seconds put in must come back out: `Vin·D·T = (Vout - Vin)·(1-D)·T`, which rearranges to `D = 1 - Vin/Vout`. The output cap has the matching constraint on charge: the diode only conducts for `(1-D)` of the period, so the average inductor current is `Iin = Iout/(1-D)`. Power in equals power out, so stepping the voltage up steps the input current up by the same ratio. That current runs through the inductor, the switch and the diode, which is why a boost stresses its parts far harder than its output rating suggests.",
          "Ripple is just the ramp: with `Vin` across the inductor for `ton = D/fsw`, `dIL = Vin·D/(fsw·L)` peak to peak, sitting on top of `Iin`. What matters for the inductor is the peak, `Iin + dIL/2`, because that is what saturates the core. Output ripple is `Iout·D/(fsw·Cout)` from the charge the cap gives up while the diode is off, plus `Ipeak·ESR` from the current step, which in a real design is usually the bigger of the two.",
          "Once the valley current would go negative the diode has already turned off and the converter is in discontinuous conduction. The duty then follows from `Iout = Vin²·D²/(2·L·fsw·(Vout - Vin))`, i.e. `D = sqrt(2·L·fsw·Iout·(Vout - Vin))/Vin`. The boundary sits at `Iout = Vin·D(1-D)/(2·fsw·L)`.",
          "The drops are folded in rather than bolted on. Volt-second balance with the diode drop Vd, the switch drop Iin·Rds(on) and the winding drop Iin·DCR, substituting Iin = Iout/(1-D), is a quadratic in `x = 1-D`: `x²(Vout+Vd) - x(Vin + Iout·Ron) + Iout(DCR+Ron) = 0`. The larger root is the real operating point. When the discriminant goes negative there is no solution at all: that is the ceiling `Vout_max = (Vin + Iout·Ron)²/(4·Iout·(DCR+Ron)) - Vd`, which with no switch drop is Erickson's `M_max = 0.5·sqrt(R/R_L)`. A boost cannot give infinite gain, and real parts stop it long before D reaches 1.",
          "The trace is not integrated. Inside a switching period the inductor current is exactly two straight lines, so it is evaluated from the closed-form corner points at whatever sample spacing the scope needs. Dragging fsw or L across decades changes the detail on screen but nothing can accumulate or diverge.",
        ]}
      />
    </SimPage>
  )
}
