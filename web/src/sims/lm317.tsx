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
import { Dot, Group, Oscilloscope, Param, ReadoutGrid, Schematic, Select, SimPage, Theory, Toggle, TRACE_COLORS, Warning } from '../ui'

/** Points along the load-current axis. The curve is a straight line, so this is plenty. */
const N = 2048

/** Kelvin is what the engine stores; datasheets and enclosures are quoted in C. */
const degC = (k: number) => `${(k - ZERO_C_K).toFixed(1)} °C`

function Diagram() {
  return (
    <Schematic viewBox="0 0 260 120" label="lm317.lm317AdjustableRegulator">
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
      <Dot x={150} y={32} />
      {/* R2, ADJ to ground */}
      <rect x="87" y="74" width="16" height="24" />
      <path d="M95 64v10M95 98v10" />
      {/* load */}
      <rect x="188" y="60" width="16" height="28" />
      <path d="M196 32v28M196 88v20" />
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
    </Schematic>
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
        { label: 'lm317.tjFitted', color: TRACE_COLORS[1], samples: tjK },
        { label: 'lm317.tjFreeAir', color: TRACE_COLORS[3], samples: tjFreeAirK },
        {
          label: 'common.tjMax',
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
        'lm317.pickR1AndR2',
        { max: I_OUT_MAX },
      )}
      controls={
        <>
          <Diagram />

          <Group label="lm317.supplyAndLoad">
            <Param
              label="common.vin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={2}
              max={45}
              log={false}
              step={0.1}
              hint="lm317.unregulatedInputAtIts"
            />
            <Param
              label="common.loadCurrent"
              unit="A"
              value={iout}
              onChange={setIout}
              min={1e-3}
              max={I_OUT_MAX}
              hint="lm317.worstCaseNotAverage"
            />
          </Group>

          <Group label="common.divider">
            <Param
              label="lm317.targetVout"
              unit="V"
              value={target}
              onChange={setTarget}
              min={V_REF}
              max={37}
              log={false}
              step={0.05}
            />
            <Param
              label="lm317.r1OutToAdj"
              unit="Ω"
              value={r1}
              onChange={setR1}
              min={100}
              max={2000}
              hint={<T k="lm317.240IsStandardKeeps" vars={{ V_REF: formatSI(V_REF / 240, 'A') }} />}
            />
            <Param
              label="lm317.r2AdjToGnd"
              unit="Ω"
              value={r2}
              onChange={setR2}
              min={1}
              max={100e3}
            />
            {Number.isFinite(tip.r2E24) && (
              <div className="seg">
                <button onClick={() => setR2(tip.r2E24)}>
                  <T k="common.useE24" vars={{ value: formatSI(tip.r2E24, 'Ω') }} />
                </button>
              </div>
            )}
          </Group>

          <Group label="common.thermal">
            <Select
              label="lm317.package"
              value={pkg}
              onChange={setPkg}
              options={PACKAGES}
            />
            <Param
              label="common.ambient"
              unit="K"
              value={ambientK}
              onChange={setAmbientK}
              min={233.15}
              max={358.15}
              log={false}
              step={0.5}
              hint="lm317.298KIs25"
            />
            <Toggle label="lm317.heatsinkFitted" value={heatsink} onChange={setHeatsink} />
            {heatsink && (
              <>
                <Param
                  label="lm317.interfaceRth"
                  unit="K/W"
                  value={rthCS}
                  onChange={setRthCS}
                  min={0.1}
                  max={5}
                  log={false}
                  step={0.1}
                  hint="lm317.greaseAlone05"
                />
                <Param
                  label="lm317.heatsinkRth"
                  unit="K/W"
                  value={rthSA}
                  onChange={setRthSA}
                  min={0.5}
                  max={60}
                  hint="lm317.clipOnTo220"
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
            label: 'common.vout',
            value: formatSI(r.vout, 'V'),
            note: <T k="lm317.againstTarget" vars={{ targetErr: targetErr >= 0 ? '+' : '', targetErr2: formatSI(targetErr, 'V') }} />,
            warn: r.dropout,
          },
          {
            label: 'lm317.r2ForTarget',
            value: formatSI(tip.r2Exact, 'Ω'),
            note: <T k="lm317.e24Gives" vars={{ r2E24: formatSI(tip.r2E24, 'Ω'), voutE24: formatSI(tip.voutE24, 'V') }} />,
          },
          {
            label: 'lm317.voutWorstCase',
            value: `${formatSI(r.voutMin, 'V')} to ${formatSI(r.voutMax, 'V')}`,
            note: <T k="lm317.vrefSpreadToV" vars={{ V_REF_MIN, V_REF_MAX }} />,
          },
          {
            label: 'lm317.adjustPinTerm',
            value: formatSI(r.iadjTerm, 'V'),
            note: <T k="lm317.ofVout" vars={{ vout: ((100 * r.iadjTerm) / r.vout).toFixed(2) }} />,
            warn: r.iadjTerm > 0.02 * r.vout,
          },
          {
            label: 'lm317.programCurrent',
            value: formatSI(r.iProgram, 'A'),
            note: <T k="lm317.minLoadSoR1" vars={{ I_LOAD_MIN: formatSI(I_LOAD_MIN, 'A'), r1Max: formatSI(r.r1Max, 'Ω') }} />,
            warn: !r.minLoadOk,
          },
          {
            label: 'lm317.headroom',
            value: formatSI(r.headroom, 'V'),
            note: <T k="lm317.needsSoVin" vars={{ DROPOUT_V: formatSI(DROPOUT_V, 'V'), vinMin: formatSI(r.vinMin, 'V') }} />,
            warn: r.dropout || r.overDifferential,
          },
          {
            label: 'common.dissipation',
            value: formatSI(r.pd, 'W'),
            note: <T k="lm317.loadTakesDeviceDraws" vars={{ pLoad: formatSI(r.pLoad, 'W'), iDevice: formatSI(r.iDevice, 'A') }} />,
            warn: r.overTemp,
          },
          {
            label: 'common.efficiency',
            value: `${(100 * r.efficiency).toFixed(1)}%`,
            note: 'lm317.voutVinALinear',
            warn: r.efficiency < 0.3,
          },
          {
            label: 'common.thermalPath',
            value: `${r.rthTotal.toFixed(1)} K/W`,
            note: heatsink
              ? `(${thermal.rthJC} JC + ${rthCS} CS + ${rthSA.toFixed(1)} SA)`
              : <T k="lm317.inFreeAir" vars={{ thermal: thermal.label }} />,
          },
          {
            label: 'common.junctionTemp',
            value: degC(r.tjK),
            note: <T k="lm317.kRiseLimit" vars={{ riseK: r.riseK.toFixed(0), TJ_MAX_K: degC(TJ_MAX_K) }} />,
            warn: r.overTemp,
          },
          {
            label: 'lm317.tjWithNoHeatsink',
            value: degC(r.tjFreeAirK),
            note: r.needsHeatsink ? 'lm317.aHeatsinkIsMandatory' : 'lm317.freeAirIsEnough',
            warn: r.needsHeatsink,
          },
          {
            label: 'lm317.heatsinkNeeded',
            value:
              r.rthSinkNeeded > 0 && Number.isFinite(r.rthSinkNeeded)
                ? <T k="lm317.kWOrBetter" vars={{ rthSinkNeeded: r.rthSinkNeeded.toFixed(1) }} />
                : r.needsHeatsink
                  ? 'lm317.noneIsEnough'
                  : 'common.none',
            note: <T k="lm317.atAndAmbient" vars={{ pd: formatSI(r.pd, 'W'), ambientK: degC(ambientK) }} />,
            warn: r.heatsinkImpossible,
          },
          {
            label: 'lm317.loadCurrentCeiling',
            value: formatSI(r.ioutCeiling, 'A'),
            note:
              r.ioutThermal < I_OUT_MAX
                ? <T k="lm317.thermalBudget" vars={{ pdMax: formatSI(r.pdMax, 'W') }} />
                : 'lm317.thePartRatingThermals',
            warn: iout > r.ioutCeiling,
          },
        ]}
      />

      <Warning when={r.dropout}
        text="lm317.warn1"
        vars={{
          headroom: formatSI(r.headroom, 'V'),
          DROPOUT_V: formatSI(DROPOUT_V, 'V'),
          vinMin: formatSI(r.vinMin, 'V'),
        }}
      />

      <Warning when={r.overDifferential}
        text="lm317.warn2"
        vars={{ headroom: formatSI(r.headroom, 'V'), V_IO_MAX: formatSI(V_IO_MAX, 'V') }}
      />

      <Warning when={r.shutdown}
        text="lm317.warn3"
        vars={{ tjK: degC(r.tjK), pdMax: formatSI(r.pd - r.pdMax, 'W') }}
      />

      <Warning when={r.overTemp && !r.shutdown}
        text="lm317.warn4"
        vars={{
          tjK: degC(r.tjK),
          TJ_MAX_K: degC(TJ_MAX_K),
          rthSinkNeeded: r.rthSinkNeeded.toFixed(1),
          topology:
            r.rthSinkNeeded > 0 ? 'lm317.aKWSink' : 'lm317.aDifferentTopology',
          ioutCeiling: formatSI(r.ioutCeiling, 'A'),
        }}
      />

      <Warning when={r.heatsinkImpossible}
        text="lm317.warn5"
        vars={{
          pd: formatSI(r.pd, 'W'),
          rthJC: thermal.rthJC.toFixed(1),
          ambientK: degC(ambientK),
        }}
      />

      <Warning when={r.overCurrent}
        text="lm317.warn6"
        vars={{ iout: formatSI(iout, 'A'), I_OUT_MAX: formatSI(I_OUT_MAX, 'A') }}
      />

      <Warning when={!r.minLoadOk}
        text="lm317.warn7"
        vars={{
          iProgram: formatSI(r.iProgram, 'A'),
          I_LOAD_MIN: formatSI(I_LOAD_MIN, 'A'),
          r1Max: formatSI(r.r1Max, 'Ω'),
        }}
      />

      <Warning when={r.iadjTerm > 0.02 * r.vout}
        text="lm317.warn8"
        vars={{
          iadjTerm: formatSI(r.iadjTerm, 'V'),
          vout: ((100 * r.iadjTerm) / r.vout).toFixed(1),
        }}
      />

      <Theory
        text={[
          'lm317.theory1',
          'lm317.iadjIs50A',
          'lm317.r1HasAnUpper',
          'lm317.everythingLeftOverIs',
          'lm317.theTraceIsThat',
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
