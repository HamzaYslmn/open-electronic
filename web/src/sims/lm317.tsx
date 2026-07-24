import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import {
  DROPOUT_V,
  I_LOAD_MIN,
  I_OUT_MAX,
  PACKAGES,
  TJ_MAX_K,
  V_IO_MAX,
  V_REF,
  V_REF_MAX,
  V_REF_MIN,
  ZERO_C_K,
  analyse,
  suggest,
  thermalCurve,
} from '../engine/lm317'
import type { PackageId } from '../engine/lm317'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Select, Toggle } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Points along the load-current axis. The curve is a straight line, so this is plenty. */
const N = 2048

/** Kelvin is what the engine stores; datasheets and enclosures are quoted in C. */
const degC = (k: number) => `${(k - ZERO_C_K).toFixed(1)} °C`

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 120" aria-label={t('LM317 adjustable regulator')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* input node and ground return */}
        <circle cx="16" cy="32" r="3" />
        <path d="M19 32h41M16 35v73h180" />
        {/* the regulator */}
        <rect x="60" y="14" width="70" height="36" />
        {/* output rail */}
        <path d="M130 32h100" />
        <circle cx="233" cy="32" r="3" />
        {/* ADJ pin down to the divider tap */}
        <path d="M95 50v14M95 64h55" />
        {/* R1, OUT to ADJ */}
        <rect x="142" y="40" width="16" height="24" />
        <path d="M150 32v8" />
        {/* R2, ADJ to ground */}
        <rect x="87" y="74" width="16" height="24" />
        <path d="M95 64v10M95 98v10" />
        {/* load */}
        <rect x="188" y="60" width="16" height="28" />
        <path d="M196 32v28M196 88v20" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="70" y="36">
          LM317
        </text>
        <text x="163" y="56">
          R1
        </text>
        <text x="70" y="92">
          R2
        </text>
        <text x="208" y="80">
          load
        </text>
        <text x="99" y="61">
          ADJ
        </text>
        <text x="4" y="24">
          Vin
        </text>
        <text x="212" y="24">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function LM317() {
  const t = useT()
  // Defaults: a 9 V wall wart down to the 3.3 V ESP32 rail with the classic
  // 240/390 divider, on a TO-220 with a small clip-on sink.
  const [vin, setVin] = useState(9)
  const [target, setTarget] = useState(VCC)
  const [r1, setR1] = useState(240)
  const [r2, setR2] = useState(390)
  const [iout, setIout] = useState(0.4)
  const [pkg, setPkg] = useState<PackageId>('to220')
  const [ambientK, setAmbientK] = useState(25 + ZERO_C_K)
  const [heatsink, setHeatsink] = useState(true)
  const [rthCS, setRthCS] = useState(0.5)
  const [rthSA, setRthSA] = useState(10)

  const thermal = PACKAGES.find((p) => p.value === pkg) ?? PACKAGES[0]

  const { r, tip, dt, traces } = useMemo(() => {
    const design = {
      vin,
      r1,
      r2,
      iout,
      ambientK,
      rthJC: thermal.rthJC,
      rthCS,
      rthSA,
      rthJA: thermal.rthJA,
      heatsink,
    }
    const { di, tjK, tjFreeAirK } = thermalCurve(design, N)
    return {
      r: analyse(design),
      tip: suggest(target, r1),
      dt: di,
      traces: [
        { label: 'Tj fitted', color: TRACE_COLORS[1], samples: tjK },
        { label: 'Tj free air', color: TRACE_COLORS[3], samples: tjFreeAirK },
        {
          label: 'Tj max',
          color: TRACE_COLORS[4],
          samples: new Float64Array(N).fill(TJ_MAX_K),
          quiet: true,
        },
      ],
    }
  }, [vin, r1, r2, iout, ambientK, thermal, rthCS, rthSA, heatsink, target])

  const targetErr = r.vout - target

  return (
    <SimPage
      id="lm317"
      lede={t(
        'Pick R1 and R2 for the rail you want, then check the part survives it. The scope is not a waveform: the horizontal axis is load current from 0 to {max} A, so read the per-division figure in milliamps, and the vertical axis is junction temperature in kelvin against the 398 K (125 C) limit.',
        { max: I_OUT_MAX },
      )}
      controls={
        <>
          <Schematic />

          <Group label="Supply and load">
            <Param
              label="Vin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={2}
              max={45}
              log={false}
              step={0.1}
              hint="Unregulated input, at its lowest. Include ripple troughs."
            />
            <Param
              label="Load current"
              unit="A"
              value={iout}
              onChange={setIout}
              min={1e-3}
              max={I_OUT_MAX}
              hint="Worst case, not average. An ESP32 peaks near 0.5 A on transmit."
            />
          </Group>

          <Group label="Divider">
            <Param
              label="Target Vout"
              unit="V"
              value={target}
              onChange={setTarget}
              min={V_REF}
              max={37}
              log={false}
              step={0.05}
            />
            <Param
              label="R1 (OUT to ADJ)"
              unit="Ω"
              value={r1}
              onChange={setR1}
              min={100}
              max={2000}
              hint={<T k="240 Ω is standard: {V_REF} keeps the part in regulation unloaded." vars={{ V_REF: formatSI(V_REF / 240, 'A') }} />}
            />
            <Param
              label="R2 (ADJ to GND)"
              unit="Ω"
              value={r2}
              onChange={setR2}
              min={1}
              max={100e3}
            />
            {Number.isFinite(tip.r2E24) && (
              <div className="seg">
                <button onClick={() => setR2(tip.r2E24)}>
                  <T k="Use {value} (E24)" vars={{ value: formatSI(tip.r2E24, 'Ω') }} />
                </button>
              </div>
            )}
          </Group>

          <Group label="Thermal">
            <Select
              label="Package"
              value={pkg}
              onChange={setPkg}
              options={PACKAGES}
            />
            <Param
              label="Ambient"
              unit="K"
              value={ambientK}
              onChange={setAmbientK}
              min={233.15}
              max={358.15}
              log={false}
              step={0.5}
              hint="298 K is 25 C. Still air inside a sealed box runs 10 to 20 K hotter."
            />
            <Toggle label="Heatsink fitted" value={heatsink} onChange={setHeatsink} />
            {heatsink && (
              <>
                <Param
                  label="Interface Rth"
                  unit="K/W"
                  value={rthCS}
                  onChange={setRthCS}
                  min={0.1}
                  max={5}
                  log={false}
                  step={0.1}
                  hint="Grease alone 0.5, silicone pad 2, mica plus grease 1.4."
                />
                <Param
                  label="Heatsink Rth"
                  unit="K/W"
                  value={rthSA}
                  onChange={setRthSA}
                  min={0.5}
                  max={60}
                  hint="Clip-on TO-220 fin 20 to 30, 25 mm extrusion 10, 50 mm block 4."
                />
              </>
            )}
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="K" />

      <ReadoutGrid
        items={[
          {
            label: 'Vout',
            value: formatSI(r.vout, 'V'),
            note: <T k="({targetErr}{targetErr2} against target)" vars={{ targetErr: targetErr >= 0 ? '+' : '', targetErr2: formatSI(targetErr, 'V') }} />,
            warn: r.dropout,
          },
          {
            label: 'R2 for target',
            value: formatSI(tip.r2Exact, 'Ω'),
            note: <T k="(E24 {r2E24} gives {voutE24})" vars={{ r2E24: formatSI(tip.r2E24, 'Ω'), voutE24: formatSI(tip.voutE24, 'V') }} />,
          },
          {
            label: 'Vout worst case',
            value: `${formatSI(r.voutMin, 'V')} to ${formatSI(r.voutMax, 'V')}`,
            note: <T k="(Vref spread {V_REF_MIN} to {V_REF_MAX} V, resistors exact)" vars={{ V_REF_MIN, V_REF_MAX }} />,
          },
          {
            label: 'Adjust pin term',
            value: formatSI(r.iadjTerm, 'V'),
            note: <T k="({vout}% of Vout)" vars={{ vout: ((100 * r.iadjTerm) / r.vout).toFixed(2) }} />,
            warn: r.iadjTerm > 0.02 * r.vout,
          },
          {
            label: 'Program current',
            value: formatSI(r.iProgram, 'A'),
            note: <T k="(min load {I_LOAD_MIN}, so R1 ≤ {r1Max})" vars={{ I_LOAD_MIN: formatSI(I_LOAD_MIN, 'A'), r1Max: formatSI(r.r1Max, 'Ω') }} />,
            warn: !r.minLoadOk,
          },
          {
            label: 'Headroom',
            value: formatSI(r.headroom, 'V'),
            note: <T k="(needs {DROPOUT_V}, so Vin ≥ {vinMin})" vars={{ DROPOUT_V: formatSI(DROPOUT_V, 'V'), vinMin: formatSI(r.vinMin, 'V') }} />,
            warn: r.dropout || r.overDifferential,
          },
          {
            label: 'Dissipation',
            value: formatSI(r.pd, 'W'),
            note: <T k="(load takes {pLoad}, device draws {iDevice})" vars={{ pLoad: formatSI(r.pLoad, 'W'), iDevice: formatSI(r.iDevice, 'A') }} />,
            warn: r.overTemp,
          },
          {
            label: 'Efficiency',
            value: `${(100 * r.efficiency).toFixed(1)}%`,
            note: '(Vout/Vin, a linear regulator burns the rest)',
            warn: r.efficiency < 0.3,
          },
          {
            label: 'Thermal path',
            value: `${r.rthTotal.toFixed(1)} K/W`,
            note: heatsink
              ? `(${thermal.rthJC} JC + ${rthCS} CS + ${rthSA.toFixed(1)} SA)`
              : <T k="({thermal} in free air)" vars={{ thermal: thermal.label }} />,
          },
          {
            label: 'Junction temp',
            value: degC(r.tjK),
            note: <T k="({riseK} K rise, limit {TJ_MAX_K})" vars={{ riseK: r.riseK.toFixed(0), TJ_MAX_K: degC(TJ_MAX_K) }} />,
            warn: r.overTemp,
          },
          {
            label: 'Tj with no heatsink',
            value: degC(r.tjFreeAirK),
            note: r.needsHeatsink ? '(a heatsink is mandatory)' : '(free air is enough)',
            warn: r.needsHeatsink,
          },
          {
            label: 'Heatsink needed',
            value:
              r.rthSinkNeeded > 0 && Number.isFinite(r.rthSinkNeeded)
                ? <T k="{rthSinkNeeded} K/W or better" vars={{ rthSinkNeeded: r.rthSinkNeeded.toFixed(1) }} />
                : r.needsHeatsink
                  ? 'none is enough'
                  : 'none',
            note: <T k="(at {pd} and {ambientK} ambient)" vars={{ pd: formatSI(r.pd, 'W'), ambientK: degC(ambientK) }} />,
            warn: r.heatsinkImpossible,
          },
          {
            label: 'Load current ceiling',
            value: formatSI(r.ioutCeiling, 'A'),
            note:
              r.ioutThermal < I_OUT_MAX
                ? <T k="(thermal, {pdMax} budget)" vars={{ pdMax: formatSI(r.pdMax, 'W') }} />
                : '(the part rating, thermals have room)',
            warn: iout > r.ioutCeiling,
          },
        ]}
      />

      {r.dropout && (
        <Warning
          text="Below dropout: {headroom} of headroom where the LM317 needs {DROPOUT_V}. The pass element is saturated, so the output follows the input down and every figure above is meaningless. Raise Vin above {vinMin} or drop the target."
          vars={{
            headroom: formatSI(r.headroom, 'V'),
            DROPOUT_V: formatSI(DROPOUT_V, 'V'),
            vinMin: formatSI(r.vinMin, 'V'),
          }}
        />
      )}

      {r.overDifferential && (
        <Warning
          text="Input-to-output differential is {headroom}, past the {V_IO_MAX} absolute maximum. The part fails regardless of how cool you keep it."
          vars={{ headroom: formatSI(r.headroom, 'V'), V_IO_MAX: formatSI(V_IO_MAX, 'V') }}
        />
      )}

      {r.shutdown && (
        <Warning
          text="Junction at {tjK}, past the internal thermal shutdown near 175 C. The regulator will fold the output back and oscillate in and out of shutdown rather than sit there. Shed {pdMax} or fit a better sink."
          vars={{ tjK: degC(r.tjK), pdMax: formatSI(r.pd - r.pdMax, 'W') }}
        />
      )}

      {r.overTemp && !r.shutdown && (
        <Warning
          text="Junction at {tjK}, over the {TJ_MAX_K} limit. It may keep regulating but it is out of spec and its life is being spent fast. Needs {topology} , a lower Vin, or under {ioutCeiling} of load."
          vars={{
            tjK: degC(r.tjK),
            TJ_MAX_K: degC(TJ_MAX_K),
            rthSinkNeeded: r.rthSinkNeeded.toFixed(1),
            topology:
              r.rthSinkNeeded > 0 ? 'a {rthSinkNeeded} K/W sink' : 'a different topology',
            ioutCeiling: formatSI(r.ioutCeiling, 'A'),
          }}
        />
      )}

      {r.heatsinkImpossible && (
        <Warning
          text="No heatsink is enough: {pd} through the {rthJC} K/W junction-to-case path alone already exceeds the budget at {ambientK} ambient. Drop Vin closer to Vout, or use a switching regulator and stop converting the difference into heat."
          vars={{
            pd: formatSI(r.pd, 'W'),
            rthJC: thermal.rthJC.toFixed(1),
            ambientK: degC(ambientK),
          }}
        />
      )}

      {r.overCurrent && (
        <Warning
          text="{iout} is past the {I_OUT_MAX} guaranteed output. The internal limiter takes over near 2.2 A typical, but that is a typical, not a promise."
          vars={{ iout: formatSI(iout, 'A'), I_OUT_MAX: formatSI(I_OUT_MAX, 'A') }}
        />
      )}

      {!r.minLoadOk && (
        <Warning
          text="R1 draws only {iProgram}, under the {I_LOAD_MIN} minimum load. With the real load disconnected the output drifts up. Use R1 no larger than {r1Max}, or fit a permanent bleeder."
          vars={{
            iProgram: formatSI(r.iProgram, 'A'),
            I_LOAD_MIN: formatSI(I_LOAD_MIN, 'A'),
            r1Max: formatSI(r.r1Max, 'Ω'),
          }}
        />
      )}

      {r.iadjTerm > 0.02 * r.vout && (
        <Warning
          text="The 50 µA adjust current adds {iadjTerm} through R2, which is {vout}% of the output and drifts with temperature. Scale both resistors down so the program current dominates."
          vars={{
            iadjTerm: formatSI(r.iadjTerm, 'V'),
            vout: ((100 * r.iadjTerm) / r.vout).toFixed(1),
          }}
        />
      )}

      <Theory
        text={[
          "The LM317 is a floating regulator: it does nothing but hold `Vref = {V_REF} V` between OUT and ADJ. R1 sits across that reference, so it carries a fixed `Iprog = Vref/R1` whatever the load does. That current plus the adjust pin current runs to ground through R2, so `Vout = Vref·(1 + R2/R1) + Iadj·R2`.",
          "Iadj is 50 µA typical. With R1 at 240 Ω the program current is 5.2 mA, a hundred times larger, so the Iadj term is a rounding error. Scale the divider into the tens of kilohms to save power and Iadj becomes a first-order term that also drifts with temperature: 10 k over 10 k reads 3.0 V, not the 2.5 V the ratio promises.",
          "R1 has an upper bound the ratio does not show. The part needs {I_LOAD_MIN} of load to regulate, so the divider is normally sized to supply it on its own: `R1 ≤ Vref/Imin = {I_LOAD_MIN2}` . That is where the 240 Ω on every reference schematic comes from.",
          "Everything left over is heat. `Pd = (Vin - Vout)·I` with no switching and nowhere to hide, so efficiency is just Vout/Vin. The junction sits at `Tj = Ta + Pd·Rth` where Rth is the series path from junction to ambient: junction to case, case to heatsink through grease or a pad, then heatsink to air. Invert it to size the sink, `Rsa = (Tj_max - Ta)/Pd - Rjc - Rcs`. A negative answer means the package itself is the bottleneck and no heatsink will save it.",
          "The trace is that equation swept over load current, not a time-domain simulation: Tj is linear in Iout at fixed headroom, offset at zero load by the divider current the regulator still has to pass. Where it crosses the flat 398 K line is the honest current limit of the design, which is usually well below the 1.5 A the datasheet front page advertises.",
        ]}
        vars={{
          V_REF,
          I_LOAD_MIN: formatSI(I_LOAD_MIN, 'A'),
          I_LOAD_MIN2: formatSI(V_REF / I_LOAD_MIN, 'Ω'),
        }}
      />
    </SimPage>
  )
}
