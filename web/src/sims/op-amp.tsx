import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import {
  MCP6002,
  analyse,
  drivesInputPin,
  noiseGain,
  simulate,
  usesBias,
} from '../engine/opamp'
import { OPAMP_MODES } from '../engine/opamp'
import type { OpAmp, OpAmpConfig, OpAmpMode } from '../engine/opamp'
import { peakToPeak, sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Segmented, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import type { Trace } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'
import SourceControls, { useSource } from '../ui/SourceControls'

/** Samples per sweep, matching every other time-domain page. */
const N = 8192

/** Rail-to-rail CMOS output stage against a classic bipolar one. */
const RAIL_HEADROOM = MCP6002.headroom
const CLASSIC_HEADROOM = 1.5

function Resistor({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <>
      <rect x={x} y={y - 7} width={34} height={14} />
      <text x={x + 6} y={y - 11} fill="currentColor" stroke="none" fontSize="10">
        {label}
      </text>
    </>
  )
}

/** Modes where the source is injected at the summing node instead of a pin. */
function summingNodeInput(mode: OpAmpMode): boolean {
  return mode === 'inverting' || mode === 'summing' || mode === 'integrator'
}

function Schematic({ mode }: { mode: OpAmpMode }) {
  const inverting = summingNodeInput(mode)
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 130" aria-label={t('op-amp.amplifier')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* the part itself */}
        <path d="M100 30v70l60-35z" />
        <path d="M160 65h75" />
        <circle cx="235" cy="65" r="3" />
        <text x="104" y="52" fill="currentColor" stroke="none" fontSize="11">
          &minus;
        </text>
        <text x="104" y="90" fill="currentColor" stroke="none" fontSize="11">
          +
        </text>
        <text x="196" y="60" fill="currentColor" stroke="none" fontSize="10">
          Vout
        </text>

        {mode === 'comparator' ? (
          <>
            {/* signal straight onto the inverting pin */}
            <path d="M6 47h94" />
            {/* vref through R2 to the non-inverting node */}
            <path d="M6 83h10" />
            <Resistor x={16} y={83} label="R2" />
            <path d="M50 83h50" />
            {/* R1 closes positive feedback from the output */}
            <path d="M60 83v32h50M144 115h51v-50" />
            <Resistor x={110} y={115} label="R1" />
            <circle cx="60" cy="83" r="2.5" fill="currentColor" />
            <text x="2" y="42" fill="currentColor" stroke="none" fontSize="10">
              Vin
            </text>
            <text x="2" y="78" fill="currentColor" stroke="none" fontSize="10">
              Vref
            </text>
          </>
        ) : (
          <>
            {/* feedback around the top, absent on a buffer */}
            {mode === 'buffer' ? (
              <path d="M195 65V16H75v31h25" />
            ) : (
              <>
                <path d="M195 65V16h-43M118 16H75v31h25" />
                {/* the integrator's feedback is Rf in parallel with Cf, i.e. Zf */}
                <Resistor x={118} y={16} label={mode === 'integrator' ? 'Zf' : 'Rf'} />
              </>
            )}
            <circle cx="195" cy="65" r="2.5" fill="currentColor" />

            {inverting ? (
              <>
                {/* source through Rin into the virtual earth */}
                <path d="M6 47h24" />
                <Resistor x={30} y={47} label="Rin" />
                <path d="M64 47h36" />
                {mode === 'summing' && (
                  <>
                    <path d="M6 112h24" />
                    <Resistor x={30} y={112} label="R2" />
                    <path d="M64 112h11V47" />
                    <text x="2" y="107" fill="currentColor" stroke="none" fontSize="10">
                      V2
                    </text>
                  </>
                )}
                <path d="M100 83H70v14M60 97h20M65 103h10" />
                <text x="46" y="118" fill="currentColor" stroke="none" fontSize="10">
                  Vbias
                </text>
              </>
            ) : (
              <>
                {/* source onto the non-inverting pin, Rg from the summing node */}
                <path d="M6 83h94" />
                {mode !== 'buffer' && (
                  <>
                    <path d="M75 47v25" />
                    <rect x="68" y="72" width="14" height="30" />
                    <path d="M75 102v8M65 110h20M69 116h12" />
                    <text x="52" y="92" fill="currentColor" stroke="none" fontSize="10">
                      Rg
                    </text>
                    <text x="12" y="114" fill="currentColor" stroke="none" fontSize="10">
                      Vbias
                    </text>
                  </>
                )}
              </>
            )}
            <text x="2" y={inverting ? 42 : 78} fill="currentColor" stroke="none" fontSize="10">
              Vin
            </text>
          </>
        )}
      </g>
    </svg>
  )
}

export default function OpAmp() {
  const [mode, setMode] = useState<OpAmpMode>('inverting')
  const [rf, setRf] = useState(22e3)
  const [rin, setRin] = useState(10e3)
  const [rin2, setRin2] = useState(10e3)
  const [cf, setCf] = useState(100e-9)
  const [v2, setV2] = useState(VCC / 2)
  const [vbias, setVbias] = useState(VCC / 2)
  const [vref, setVref] = useState(VCC / 2)
  const [r1, setR1] = useState(10e3)
  const [r2, setR2] = useState(100e3)
  const [vpos, setVpos] = useState(VCC)
  const [vneg, setVneg] = useState(0)
  const [gbw, setGbw] = useState(MCP6002.gbw)
  const [slewRate, setSlewRate] = useState(MCP6002.slewRate)
  const [railToRail, setRailToRail] = useState(true)
  // Half a volt of swing sitting on mid rail: the signal a single-supply stage
  // in front of an ESP32 ADC actually sees.
  const [source, patchSource] = useSource({
    amplitude: 0.5,
    offset: VCC / 2,
    frequency: 1e3,
  })

  const { dt, traces, readout, stats, amp } = useMemo(() => {
    const amp: OpAmp = {
      gbw,
      slewRate,
      vpos,
      vneg,
      headroom: railToRail ? RAIL_HEADROOM : CLASSIC_HEADROOM,
    }
    const cfg: OpAmpConfig = { mode, rf, rin, rin2, cf, v2, vbias, vref, r1, r2 }

    // A DC step has no period, so window it on the slowest thing in the loop:
    // the closed-loop pole, the time a full rail-to-rail slew takes, and the
    // integrator's own RC.
    const dcSpan = Math.max(
      (20 * noiseGain(cfg)) / (2 * Math.PI * gbw),
      (8 * Math.abs(vpos - vneg)) / slewRate,
      mode === 'integrator' ? 4 * rf * cf : 0,
      1e-6,
    )
    const { dt, samples: input } = sweep(source, N, source.cycles, dcSpan)
    // Skip the warm-up pass for a step so the transient stays visible.
    const r = simulate(input, dt, cfg, amp, source.kind !== 'dc')

    let vmin = r.output[0]
    let vmax = r.output[0]
    let inMin = input[0]
    let inMax = input[0]
    for (let i = 1; i < input.length; i++) {
      if (r.output[i] < vmin) vmin = r.output[i]
      if (r.output[i] > vmax) vmax = r.output[i]
      if (input[i] < inMin) inMin = input[i]
      if (input[i] > inMax) inMax = input[i]
    }

    const traces: Trace[] = [
      { label: 'common.vin', color: TRACE_COLORS[0], samples: input },
      { label: 'common.vout', color: TRACE_COLORS[1], samples: r.output },
    ]
    // The moving trip point is the whole story of a Schmitt trigger, so plot it.
    if (r.threshold)
      traces.push({ label: 'op-amp.vth', color: TRACE_COLORS[3], samples: r.threshold, quiet: true })

    return {
      dt,
      traces,
      amp,
      readout: analyse(cfg, amp, source.frequency, peakToPeak(input) / 2),
      stats: {
        vmin,
        vmax,
        vpp: vmax - vmin,
        inMin,
        inMax,
        clipped: r.clipped / input.length,
        slewed: r.slewed / input.length,
        transitions: r.transitions,
      },
    }
  }, [
    mode, rf, rin, rin2, cf, v2, vbias, vref, r1, r2,
    vpos, vneg, gbw, slewRate, railToRail, source,
  ])

  const isComparator = mode === 'comparator'
  const commonMode =
    drivesInputPin(mode) && (stats.inMin < vneg - 1e-9 || stats.inMax > vpos + 1e-9)
  const biasOffRail =
    usesBias(mode) && (vbias < readout.lo || vbias > readout.hi)
  const integratorTooFast = mode === 'integrator' && readout.integratorUnity > gbw / 10
  const comparatorStuck = isComparator && stats.transitions === 0 && source.kind !== 'dc'

  const items = [
    ...(isComparator
      ? [
          { label: 'op-amp.upperThreshold', value: formatSI(readout.upper, 'V') },
          { label: 'op-amp.lowerThreshold', value: formatSI(readout.lower, 'V') },
          {
            label: 'op-amp.hysteresisBand',
            value: formatSI(readout.hysteresis, 'V'),
            note: `(R1/(R1+R2) = ${(r1 / (r1 + r2)).toFixed(4)})`,
          },
          {
            label: 'op-amp.edgesInWindow',
            value: String(stats.transitions),
            note: comparatorStuck ? 'op-amp.neverTrips' : 'op-amp.2PerInputCycle',
            warn: comparatorStuck,
          },
        ]
      : [
          {
            label: 'op-amp.closedLoopGain',
            value: `${readout.gain.toFixed(3)} V/V`,
            note: <T k="op-amp.db" vars={{ gainDb: readout.gainDb.toFixed(2), inverted: readout.gain < 0 ? 'op-amp.inverted' : '' }} />,
          },
          {
            label: 'op-amp.noiseGain',
            value: readout.noiseGain.toFixed(3),
            note: 'op-amp.1RfRgSets',
          },
          {
            label: 'common.bandwidth',
            value: formatSI(readout.bandwidth, 'Hz'),
            note: <T k="op-amp.gbw" vars={{ noiseGain: readout.noiseGain.toFixed(2) }} />,
          },
          {
            label: <T k="op-amp.responseAt" vars={{ frequency: formatSI(source.frequency, 'Hz') }} />,
            value: `${(20 * Math.log10(readout.gainError)).toFixed(2)} dB`,
            note: <T k="op-amp.ofTheDcGain" vars={{ gainError: (readout.gainError * 100).toFixed(2) }} />,
            warn: readout.gainError < 0.9,
          },
        ]),
    {
      label: 'op-amp.slewDemanded',
      value: formatSI(readout.slewNeeded, 'V/s'),
      note: <T k="op-amp.partDoesIE" vars={{ slewRate: formatSI(slewRate, 'V/s'), e6: (slewRate / 1e6).toFixed(2) }} />,
      warn: readout.slewLimited || stats.slewed > 0,
    },
    {
      label: 'op-amp.fullPowerBandwidth',
      value: formatSI(readout.fullPowerBw, 'Hz'),
      note: 'op-amp.sr2PiVpk',
      warn: source.frequency > readout.fullPowerBw,
    },
    {
      label: 'common.outputSwing',
      value: formatSI(stats.vpp, 'V') + ' pp',
      note: <T k="op-amp.to" vars={{ vmin: formatSI(stats.vmin, 'V'), vmax: formatSI(stats.vmax, 'V') }} />,
    },
    {
      label: 'op-amp.timeOnARail',
      value: `${(stats.clipped * 100).toFixed(1)} %`,
      note: <T k="op-amp.railsClipAt" vars={{ lo: formatSI(readout.lo, 'V'), hi: formatSI(readout.hi, 'V') }} />,
      warn: stats.clipped > 0,
    },
    ...(mode === 'integrator'
      ? [
          {
            label: 'op-amp.integratorUnityGain',
            value: formatSI(readout.integratorUnity, 'Hz'),
            note: 'op-amp.12PiRin',
            warn: integratorTooFast,
          },
          {
            label: 'op-amp.dcBleedCorner',
            value: formatSI(readout.integratorCorner, 'Hz'),
            note: <T k="op-amp.belowThisItIs" vars={{ gain: Math.abs(readout.gain).toFixed(1) }} />,
          },
        ]
      : [
          {
            label: 'common.inputImpedance',
            value: formatSI(readout.inputZ, 'Ω'),
            note: drivesInputPin(mode) ? 'op-amp.straightOntoThePin' : 'op-amp.rinIntoAVirtual',
          },
        ]),
  ]

  return (
    <SimPage
      id="op-amp"
      lede="op-amp.lede"
      controls={
        <>
          <Select
            label="op-amp.configuration"
            value={mode}
            onChange={setMode}
            options={OPAMP_MODES}
          />
          <Schematic mode={mode} />

          <Group label="op-amp.network">
            {mode !== 'buffer' && !isComparator && (
              <Param label="op-amp.feedbackRf" unit="Ω" value={rf} onChange={setRf} min={100} max={10e6} />
            )}
            {mode !== 'buffer' && !isComparator && (
              <Param
                label={mode === 'noninverting' ? 'op-amp.groundLegRg' : 'op-amp.inputRin'}
                unit="Ω"
                value={rin}
                onChange={setRin}
                min={100}
                max={10e6}
              />
            )}
            {mode === 'integrator' && (
              <Param label="op-amp.feedbackCf" unit="F" value={cf} onChange={setCf} min={1e-12} max={1e-4} />
            )}
            {mode === 'summing' && (
              <Param label="op-amp.inputBR2" unit="Ω" value={rin2} onChange={setRin2} min={100} max={10e6} />
            )}
            {(mode === 'summing' || mode === 'difference') && (
              <Param
                label={mode === 'summing' ? 'op-amp.inputBLevel' : 'op-amp.subtractedLevel'}
                unit="V"
                value={v2}
                onChange={setV2}
                min={vneg}
                max={vpos}
                log={false}
                step={0.05}
              />
            )}
            {usesBias(mode) && (
              <Param
                label="op-amp.referenceVbias"
                unit="V"
                value={vbias}
                onChange={setVbias}
                min={vneg}
                max={vpos}
                log={false}
                step={0.05}
                hint="op-amp.midRailOnA"
              />
            )}
            {isComparator && (
              <>
                <Param
                  label="op-amp.referenceVref"
                  unit="V"
                  value={vref}
                  onChange={setVref}
                  min={vneg}
                  max={vpos}
                  log={false}
                  step={0.05}
                />
                <Param
                  label="op-amp.feedbackR1"
                  unit="Ω"
                  value={r1}
                  onChange={setR1}
                  min={100}
                  max={10e6}
                  hint="op-amp.smallerR1MeansA"
                />
                <Param label="op-amp.referenceR2" unit="Ω" value={r2} onChange={setR2} min={100} max={10e6} />
              </>
            )}
          </Group>

          <Group label="op-amp.partAndSupply">
            <Param
              label="op-amp.gainBandwidth"
              unit="Hz"
              value={gbw}
              onChange={setGbw}
              min={1e4}
              max={1e9}
              hint="op-amp.mcp6002Is1Mhz"
            />
            <Param
              label="op-amp.slewRate"
              unit="V/s"
              value={slewRate}
              onChange={setSlewRate}
              min={1e4}
              max={1e9}
              hint={`${(slewRate / 1e6).toFixed(2)} V/µs`}
            />
            <Segmented
              label="op-amp.outputStage"
              value={railToRail ? 'op-amp.rrl' : 'op-amp.classic'}
              onChange={(v) => setRailToRail(v === 'rrl')}
              options={[
                { value: 'rrl', label: 'op-amp.railToRail' },
                { value: 'classic', label: 'op-amp.classic2' },
              ]}
            />
            <Param
              label="op-amp.positiveRail"
              unit="V"
              value={vpos}
              onChange={setVpos}
              min={1.8}
              max={36}
              log={false}
              step={0.1}
            />
            <Param
              label="op-amp.negativeRail"
              unit="V"
              value={vneg}
              onChange={setVneg}
              min={-18}
              max={0}
              log={false}
              step={0.1}
              hint="op-amp.0VForSingle"
            />
          </Group>

          <SourceControls value={source} onChange={patchSource} maxAmplitude={18} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      {stats.clipped > 0 && (
        <Warning
          text="op-amp.warn1"
          vars={{ clipped: (stats.clipped * 100).toFixed(1) }}
        />
      )}
      {(readout.slewLimited || stats.slewed > 0) && (
        <Warning
          text="op-amp.warn2"
          vars={{
            slewNeeded: formatSI(readout.slewNeeded, 'V/s'),
            slewRate: formatSI(amp.slewRate, 'V/s'),
          }}
        />
      )}
      {commonMode && (
        <Warning
          text="op-amp.warn3"
          vars={{
            inMin: formatSI(stats.inMin, 'V'),
            inMax: formatSI(stats.inMax, 'V'),
            vneg: formatSI(vneg, 'V'),
            vpos: formatSI(vpos, 'V'),
          }}
        />
      )}
      {biasOffRail && (
        <Warning
          text="op-amp.warn4"
          vars={{ vpos: formatSI(vpos / 2, 'V') }}
        />
      )}
      {integratorTooFast && (
        <Warning
          text="op-amp.warn5"
          vars={{
            integratorUnity: formatSI(readout.integratorUnity, 'Hz'),
            gbw: formatSI(gbw, 'Hz'),
          }}
        />
      )}

      <ReadoutGrid items={items} />

      <Theory
        text={[
          'op-amp.theory1',
          'op-amp.everythingHereSwingsAbout',
          'op-amp.aCompensatedOpAmp',
          'op-amp.bandwidthIsASmall',
          'op-amp.theComparatorIsThe',
          'op-amp.theScopeTraceIs',
        ]}
      />
    </SimPage>
  )
}
