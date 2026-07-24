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
    <svg className="schematic" viewBox="0 0 260 130" aria-label={t('{mode} amplifier', { mode })}>
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
      { label: 'Vin', color: TRACE_COLORS[0], samples: input },
      { label: 'Vout', color: TRACE_COLORS[1], samples: r.output },
    ]
    // The moving trip point is the whole story of a Schmitt trigger, so plot it.
    if (r.threshold)
      traces.push({ label: 'Vth', color: TRACE_COLORS[3], samples: r.threshold, quiet: true })

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
          { label: 'Upper threshold', value: formatSI(readout.upper, 'V') },
          { label: 'Lower threshold', value: formatSI(readout.lower, 'V') },
          {
            label: 'Hysteresis band',
            value: formatSI(readout.hysteresis, 'V'),
            note: `(R1/(R1+R2) = ${(r1 / (r1 + r2)).toFixed(4)})`,
          },
          {
            label: 'Edges in window',
            value: String(stats.transitions),
            note: comparatorStuck ? '(never trips)' : '(2 per input cycle when tripping)',
            warn: comparatorStuck,
          },
        ]
      : [
          {
            label: 'Closed-loop gain',
            value: `${readout.gain.toFixed(3)} V/V`,
            note: <T k="({gainDb} dB{inverted})" vars={{ gainDb: readout.gainDb.toFixed(2), inverted: readout.gain < 0 ? ', inverted' : '' }} />,
          },
          {
            label: 'Noise gain',
            value: readout.noiseGain.toFixed(3),
            note: '(1 + Rf/Rg, sets the bandwidth)',
          },
          {
            label: 'Bandwidth',
            value: formatSI(readout.bandwidth, 'Hz'),
            note: <T k="(GBW / {noiseGain})" vars={{ noiseGain: readout.noiseGain.toFixed(2) }} />,
          },
          {
            label: <T k="Response at {frequency}" vars={{ frequency: formatSI(source.frequency, 'Hz') }} />,
            value: `${(20 * Math.log10(readout.gainError)).toFixed(2)} dB`,
            note: <T k="({gainError}% of the DC gain)" vars={{ gainError: (readout.gainError * 100).toFixed(2) }} />,
            warn: readout.gainError < 0.9,
          },
        ]),
    {
      label: 'Slew demanded',
      value: formatSI(readout.slewNeeded, 'V/s'),
      note: <T k="(part does {slewRate}, i.e. {e6} V/µs)" vars={{ slewRate: formatSI(slewRate, 'V/s'), e6: (slewRate / 1e6).toFixed(2) }} />,
      warn: readout.slewLimited || stats.slewed > 0,
    },
    {
      label: 'Full power bandwidth',
      value: formatSI(readout.fullPowerBw, 'Hz'),
      note: '(SR / 2·pi·Vpk)',
      warn: source.frequency > readout.fullPowerBw,
    },
    {
      label: 'Output swing',
      value: formatSI(stats.vpp, 'V') + ' pp',
      note: <T k="({vmin} to {vmax})" vars={{ vmin: formatSI(stats.vmin, 'V'), vmax: formatSI(stats.vmax, 'V') }} />,
    },
    {
      label: 'Time on a rail',
      value: `${(stats.clipped * 100).toFixed(1)} %`,
      note: <T k="(rails clip at {lo} / {hi})" vars={{ lo: formatSI(readout.lo, 'V'), hi: formatSI(readout.hi, 'V') }} />,
      warn: stats.clipped > 0,
    },
    ...(mode === 'integrator'
      ? [
          {
            label: 'Integrator unity gain',
            value: formatSI(readout.integratorUnity, 'Hz'),
            note: '(1 / 2·pi·Rin·Cf)',
            warn: integratorTooFast,
          },
          {
            label: 'DC bleed corner',
            value: formatSI(readout.integratorCorner, 'Hz'),
            note: <T k="(below this it is just a {gain}x inverter)" vars={{ gain: Math.abs(readout.gain).toFixed(1) }} />,
          },
        ]
      : [
          {
            label: 'Input impedance',
            value: formatSI(readout.inputZ, 'Ω'),
            note: drivesInputPin(mode) ? '(straight onto the pin)' : '(Rin into a virtual earth)',
          },
        ]),
  ]

  return (
    <SimPage
      id="op-amp"
      lede="Ideal closed-loop gain with the three limits that actually bite: gain bandwidth product, slew rate and output swing. The scope shows Vin against Vout in real time."
      controls={
        <>
          <Select
            label="Configuration"
            value={mode}
            onChange={setMode}
            options={OPAMP_MODES}
          />
          <Schematic mode={mode} />

          <Group label="Network">
            {mode !== 'buffer' && !isComparator && (
              <Param label="Feedback Rf" unit="Ω" value={rf} onChange={setRf} min={100} max={10e6} />
            )}
            {mode !== 'buffer' && !isComparator && (
              <Param
                label={mode === 'noninverting' ? 'Ground leg Rg' : 'Input Rin'}
                unit="Ω"
                value={rin}
                onChange={setRin}
                min={100}
                max={10e6}
              />
            )}
            {mode === 'integrator' && (
              <Param label="Feedback Cf" unit="F" value={cf} onChange={setCf} min={1e-12} max={1e-4} />
            )}
            {mode === 'summing' && (
              <Param label="Input B R2" unit="Ω" value={rin2} onChange={setRin2} min={100} max={10e6} />
            )}
            {(mode === 'summing' || mode === 'difference') && (
              <Param
                label={mode === 'summing' ? 'Input B level' : 'Subtracted level'}
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
                label="Reference Vbias"
                unit="V"
                value={vbias}
                onChange={setVbias}
                min={vneg}
                max={vpos}
                log={false}
                step={0.05}
                hint="Mid rail on a single supply, 0 V on a split supply."
              />
            )}
            {isComparator && (
              <>
                <Param
                  label="Reference Vref"
                  unit="V"
                  value={vref}
                  onChange={setVref}
                  min={vneg}
                  max={vpos}
                  log={false}
                  step={0.05}
                />
                <Param
                  label="Feedback R1"
                  unit="Ω"
                  value={r1}
                  onChange={setR1}
                  min={100}
                  max={10e6}
                  hint="Smaller R1 means a wider hysteresis band."
                />
                <Param label="Reference R2" unit="Ω" value={r2} onChange={setR2} min={100} max={10e6} />
              </>
            )}
          </Group>

          <Group label="Part and supply">
            <Param
              label="Gain bandwidth"
              unit="Hz"
              value={gbw}
              onChange={setGbw}
              min={1e4}
              max={1e9}
              hint="MCP6002 is 1 MHz. OPA2340 is 5.5 MHz."
            />
            <Param
              label="Slew rate"
              unit="V/s"
              value={slewRate}
              onChange={setSlewRate}
              min={1e4}
              max={1e9}
              hint={`${(slewRate / 1e6).toFixed(2)} V/µs`}
            />
            <Segmented
              label="Output stage"
              value={railToRail ? 'rrl' : 'classic'}
              onChange={(v) => setRailToRail(v === 'rrl')}
              options={[
                { value: 'rrl', label: 'Rail to rail' },
                { value: 'classic', label: 'Classic' },
              ]}
            />
            <Param
              label="Positive rail"
              unit="V"
              value={vpos}
              onChange={setVpos}
              min={1.8}
              max={36}
              log={false}
              step={0.1}
            />
            <Param
              label="Negative rail"
              unit="V"
              value={vneg}
              onChange={setVneg}
              min={-18}
              max={0}
              log={false}
              step={0.1}
              hint="0 V for single supply ESP32 work."
            />
          </Group>

          <SourceControls value={source} onChange={patchSource} maxAmplitude={18} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      {stats.clipped > 0 && (
        <Warning
          text="The output is on a rail for {clipped}% of the window. Beyond that point the gain formula no longer describes the circuit: reduce the gain, reduce the input, or widen the supply."
          vars={{ clipped: (stats.clipped * 100).toFixed(1) }}
        />
      )}
      {(readout.slewLimited || stats.slewed > 0) && (
        <Warning
          text="Slew limited. The output needs {slewNeeded} but the part only does {slewRate}, so sine waves come out as triangles and the small-signal bandwidth figure no longer applies."
          vars={{
            slewNeeded: formatSI(readout.slewNeeded, 'V/s'),
            slewRate: formatSI(amp.slewRate, 'V/s'),
          }}
        />
      )}
      {commonMode && (
        <Warning
          text="The input pin leaves the supply range ({inMin} to {inMax} against rails of {vneg} to {vpos}). Real input stages stop working there and some parts phase invert, so this trace is fiction outside the rails."
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
          text="Vbias sits outside the usable output range, so the stage has nowhere to swing. On a single supply set it to half the positive rail, i.e. {vpos}."
          vars={{ vpos: formatSI(vpos / 2, 'V') }}
        />
      )}
      {integratorTooFast && (
        <Warning
          text="The integrator's unity gain frequency ({integratorUnity}) is within a decade of the op-amp's GBW ({gbw}). The op-amp runs out of open-loop gain before the capacitor takes over, so the integration stops being clean. Raise Rin or Cf, or pick a faster part."
          vars={{
            integratorUnity: formatSI(readout.integratorUnity, 'Hz'),
            gbw: formatSI(gbw, 'Hz'),
          }}
        />
      )}

      <ReadoutGrid items={items} />

      <Theory
        text={[
          "With enough open-loop gain the inverting pin tracks the non-inverting pin, so the resistor network alone sets the gain: `Av = -Rf/Rin` inverting, `Av = 1 + Rf/Rg` non-inverting, `Av = 1` for a buffer. The summing amp is superposition on one virtual earth, `Vout = -Rf·(V1/R1 + V2/R2)`, and the difference amp is `Vout = Vref + (Rf/Rin)·(V+ - V-)` with matched ratios on both branches.",
          "Everything here swings about Vbias rather than about 0 V, because on a single 3.3 V supply there is no negative rail to swing into. That means the non-inverting pin of an inverting stage and the Rg leg of a non-inverting stage both return to mid rail, not to ground. Set Vbias to 0 and a split supply and the formulas collapse back to the textbook ones.",
          "A compensated op-amp holds gain times bandwidth constant, so the closed-loop corner is `BW = GBW / noise gain`. Noise gain is `1 + Rf/Rg` for both topologies, which is why an inverting stage of -10 and a non-inverting stage of +11 have exactly the same bandwidth even though their signal gains differ.",
          "Bandwidth is a small-signal figure. Large signals hit the slew rate instead: a sine of peak Vp needs `2·pi·f·Vp` volts per second, so the largest undistorted sine is the full power bandwidth `SR / (2·pi·Vp)`. Past it the output turns into a triangle no matter what the gain plot says.",
          "The comparator is the same part with positive feedback instead of negative. The non-inverting node sits on a divider between Vref through R2 and the output through R1, so `Vth = (Vref·R2 + Vout·R1)/(R1 + R2)`. With R2 much larger than R1 that is the familiar `Vth = Vref ± Vout·R1/(R1+R2)`, and the band is exactly `(Vhigh - Vlow)·R1/(R1+R2)`. Anything smaller than that band cannot make the output chatter.",
          "The scope trace is a sample-by-sample simulation. Every pole uses exact zero-order-hold discretisation, `y[n] = target + (y[n-1] - target)·e^(-dt/tau)`, so it stays stable at any time base; slew limiting and rail clipping are then applied per sample, which is what puts the flat tops and straight edges on the trace. The integrator is modelled as the practical one, Rf across Cf, so it has a finite DC gain instead of drifting into a rail.",
        ]}
      />
    </SimPage>
  )
}
