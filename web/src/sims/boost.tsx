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
    <svg className="schematic" viewBox="0 0 260 116" aria-label={t('boost.boostConverterPowerStage')}>
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
        { label: 'common.il', color: TRACE_COLORS[0], samples: il },
        { label: 'boost.iSwitch', color: TRACE_COLORS[2], samples: isw },
        { label: 'boost.iDiode', color: TRACE_COLORS[3], samples: idiode },
      ],
    }
  }, [vin, vout, iout, l, isat, fsw, cout, esr, vd, ron, dcr, cycles])

  return (
    <SimPage
      id="boost"
      lede="boost.lede"
      controls={
        <>
          <Schematic />

          <Group label="common.rails">
            <Param
              label="common.inputVin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={0.5}
              max={24}
              log={false}
              step={0.05}
              hint="common.33VIs"
            />
            <Param
              label="common.outputVout"
              unit="V"
              value={vout}
              onChange={setVout}
              min={1}
              max={60}
              log={false}
              step={0.1}
            />
            <Param
              label="boost.loadIout"
              unit="A"
              value={iout}
              onChange={setIout}
              min={1e-3}
              max={5}
            />
          </Group>

          <Group label="common.powerStage">
            <Param
              label="boost.inductorL"
              unit="H"
              value={l}
              onChange={setL}
              min={1e-7}
              max={1e-3}
            />
            <Param
              label="boost.inductorIsat"
              unit="A"
              value={isat}
              onChange={setIsat}
              min={0.05}
              max={20}
              hint="boost.datasheetSaturationCurrentNot"
            />
            <Param
              label="boost.switchingFsw"
              unit="Hz"
              value={fsw}
              onChange={setFsw}
              min={10e3}
              max={5e6}
            />
            <Param
              label="boost.outputCout"
              unit="F"
              value={cout}
              onChange={setCout}
              min={1e-6}
              max={2e-3}
            />
            <Param
              label="boost.coutEsr"
              unit="Ω"
              value={esr}
              onChange={setEsr}
              min={1e-3}
              max={2}
            />
          </Group>

          <Group label="boost.realParts">
            <Param
              label="boost.diodeDropVd"
              unit="V"
              value={vd}
              onChange={setVd}
              min={0}
              max={1.2}
              log={false}
              step={0.01}
              hint="boost.schottky03To"
            />
            <Param
              label="boost.switchRdsOn"
              unit="Ω"
              value={ron}
              onChange={setRon}
              min={1e-3}
              max={2}
            />
            <Param
              label="common.inductorDcr"
              unit="Ω"
              value={dcr}
              onChange={setDcr}
              min={1e-3}
              max={2}
            />
          </Group>

          <Group label="boost.scope">
            <Param
              label="boost.switchingPeriodsShown"
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
            label: 'boost.dutyD',
            value: pct(r.duty),
            note: <T k="boost.ideal1VinVout" vars={{ dutyIdeal: pct(r.dutyIdeal) }} />,
            warn: r.extremeDuty || !r.achievable,
          },
          {
            label: 'common.conductionMode',
            value: r.achievable ? r.mode : 'common.none',
            note: r.achievable
              ? <T k="boost.dcmBelowOfLoad" vars={{ ioutBoundary: formatSI(r.ioutBoundary, 'A') }} />
              : 'boost.noSteadyState',
            warn: r.mode === 'DCM' || !r.achievable,
          },
          {
            label: 'common.onTime',
            value: formatSI(r.ton, 's'),
            note: <T k="boost.off" vars={{ toff: formatSI(r.toff, 's') }} />,
          },
          {
            label: 'boost.inputCurrentIin',
            value: formatSI(r.iin, 'A'),
            note: <T k="boost.theLoadAvgInductor" vars={{ iout: times(r.iin / iout) }} />,
          },
          {
            label: 'common.inductorRipple',
            value: formatSI(r.ripple, 'A'),
            note: <T k="boost.ofIinAimFor" vars={{ rippleRatio: pct(r.rippleRatio), RIPPLE_TARGET: pct(RIPPLE_TARGET) }} />,
            warn: r.highRipple,
          },
          {
            label: 'common.peakInductorCurrent',
            value: formatSI(r.ipeak, 'A'),
            note: <T k="boost.valleyIsat" vars={{ ivalley: formatSI(r.ivalley, 'A'), isat: formatSI(isat, 'A') }} />,
            warn: r.saturating,
          },
          {
            label: 'common.inductorRms',
            value: formatSI(r.ilRms, 'A'),
            note: <T k="boost.switchRmsDiodeAvg" vars={{ iswRms: formatSI(r.iswRms, 'A'), iout: formatSI(iout, 'A') }} />,
          },
          {
            label: 'common.outputRipple',
            value: formatSI(r.vRipple, 'V'),
            note: <T k="boost.fromCFromEsr" vars={{ vRippleCap: formatSI(r.vRippleCap, 'V'), vRippleEsr: formatSI(r.vRippleEsr, 'V') }} />,
          },
          {
            label: 'boost.switchVoltageStress',
            value: formatSI(r.vSwitchStress, 'V'),
            note: <T k="boost.voutVdSoRate" vars={{ vSwitchStress: formatSI(DERATE * r.vSwitchStress, 'V') }} />,
          },
          {
            label: 'boost.diodeReverseStress',
            value: formatSI(r.vDiodeStress, 'V'),
            note: <T k="boost.rateItFor" vars={{ vDiodeStress: formatSI(DERATE * r.vDiodeStress, 'V') }} />,
          },
          {
            label: 'common.efficiency',
            value: pct(r.efficiency),
            note: <T k="boost.outConductionLoss" vars={{ pout: formatSI(r.pout, 'W'), ploss: formatSI(r.ploss, 'W') }} />,
          },
          {
            label: 'boost.highestVoutReachable',
            value: formatSI(r.voutMax, 'V'),
            note: <T k="boost.atThisLoadWith" vars={{ ron: formatSI(dcr + ron, 'Ω') }} />,
            warn: !r.achievable && r.stepUp,
          },
          {
            label: 'boost.lNeededForCcm',
            value: formatSI(r.lBoundary, 'H'),
            note: <T k="boost.youHave" vars={{ l: formatSI(l, 'H') }} />,
            warn: r.mode === 'DCM',
          },
        ]}
      />

      {!r.stepUp && (
        <Warning
          text="boost.warn1"
          vars={{ vout: formatSI(vout, 'V'), vin: formatSI(vin, 'V') }}
        />
      )}

      {r.stepUp && !r.achievable && (
        <Warning
          text="boost.warn2"
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
          text="boost.warn3"
          vars={{
            duty: pct(r.duty),
            MAX_PRACTICAL_DUTY: pct(MAX_PRACTICAL_DUTY),
            toff: formatSI(r.toff, 's'),
          }}
        />
      )}

      {r.saturating && (
        <Warning
          text="boost.warn4"
          vars={{ ipeak: formatSI(r.ipeak, 'A'), isat: formatSI(isat, 'A') }}
        />
      )}

      {r.mode === 'DCM' && (
        <Warning
          text="boost.warn5"
          vars={{
            ioutBoundary: formatSI(r.ioutBoundary, 'A'),
            lBoundary: formatSI(r.lBoundary, 'H'),
          }}
        />
      )}

      {r.highRipple && r.mode === 'CCM' && (
        <Warning
          text="boost.warn6"
          vars={{ rippleRatio: pct(r.rippleRatio) }}
        />
      )}

      <Theory
        text={[
          'boost.theory1',
          'boost.rippleIsJustThe',
          'boost.onceTheValleyCurrent',
          'boost.theDropsAreFolded',
          'boost.theTraceIsNot',
        ]}
      />
    </SimPage>
  )
}
