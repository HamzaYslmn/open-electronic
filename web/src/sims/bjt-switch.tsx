import { useMemo, useState } from 'react'
import { GPIO_MAX_MA, VCC, VCC_5V } from '../engine/constants'
import { ODF_TARGET, ampTrace, analyseAmp, analyseSwitch, switchTrace } from '../engine/bjt'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Segmented, Toggle } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'
import SourceControls, { useSource } from '../ui/SourceControls'

/** Samples per sweep, same as every other time-domain page. */
const N = 8192

/** Both solvers are memoryless, so a DC step needs a window only to have an
 *  axis. 1 ms shows the step without pretending there is a rise time. */
const DC_SPAN = 1e-3

type Mode = 'switch' | 'amp'

function Schematic({ mode }: { mode: Mode }) {
  const isSwitch = mode === 'switch'
  return (
    <svg
      className="schematic"
      viewBox="0 0 260 168"
      aria-label={isSwitch ? 'NPN low side switch' : 'common emitter amplifier'}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* transistor */}
        <circle cx="128" cy="78" r="32" />
        <path d="M110 58V98M110 64L140 46M110 92L140 110" />
        {/* collector leg, broken for the load resistor */}
        <path d="M140 46V40M140 18V12" />
        <rect x="132" y="18" width="16" height="22" />
        <path d={isSwitch ? 'M120 12H200' : 'M40 12H200'} />
        {/* output tap */}
        <path d="M140 46H196" />
        <circle cx="200" cy="46" r="3" />

        {isSwitch ? (
          <>
            <circle cx="22" cy="78" r="3" />
            <path d="M25 78H40M80 78H110" />
            <rect x="40" y="70" width="40" height="16" />
            <path d="M140 110V142M128 142H152M132 147H148M136 152H144" />
          </>
        ) : (
          <>
            <circle cx="18" cy="78" r="3" />
            <path d="M21 78H32M32 70V86M38 70V86M38 78H60" />
            <rect x="52" y="28" width="16" height="24" />
            <rect x="52" y="90" width="16" height="24" />
            <path d="M60 12V28M60 52V90M60 114V142M60 78H110" />
            <path d="M140 110V116M140 138V142" />
            <rect x="132" y="116" width="16" height="22" />
            <path d="M60 142H140M100 142V146M88 146H112M92 151H108M96 156H104" />
          </>
        )}
      </g>
      <g fill="currentColor" stroke="none">
        {/* emitter arrow, NPN points out */}
        <polygon points="137,108 128,106 131,101" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="204" y="16">
          {isSwitch ? 'Vload' : 'VCC'}
        </text>
        <text x="154" y="34">
          {isSwitch ? 'RL' : 'RC'}
        </text>
        <text x="184" y="38">
          Vout
        </text>
        {isSwitch ? (
          <>
            <text x="8" y="68">
              Vin
            </text>
            <text x="52" y="64">
              RB
            </text>
          </>
        ) : (
          <>
            <text x="6" y="68">
              Vin
            </text>
            <text x="26" y="64">
              Cin
            </text>
            <text x="72" y="44">
              R1
            </text>
            <text x="72" y="108">
              R2
            </text>
            <text x="154" y="132">
              RE
            </text>
          </>
        )}
      </g>
    </svg>
  )
}

export default function BjtSwitch() {
  const [mode, setMode] = useState<Mode>('switch')
  const [hfe, setHfe] = useState(100)

  // Switch side. The load rail defaults to 5 V because the job a BJT switch
  // actually does on an ESP32 board is driving a relay coil, a fan or a strip
  // that the 3V3 pin cannot supply. The base drive stays on VCC.
  const [rb, setRb] = useState(1_000)
  const [vLoad, setVLoad] = useState(VCC_5V)
  const [rLoad, setRLoad] = useState(100)

  // Amplifier side, all on the 3V3 rail.
  const [vcc, setVcc] = useState(VCC)
  const [r1, setR1] = useState(22_000)
  const [r2, setR2] = useState(10_000)
  const [rc, setRc] = useState(3_300)
  const [re, setRe] = useState(680)
  const [bypassed, setBypassed] = useState(false)

  // The 0 to 3V3 default is exactly what a GPIO puts out.
  const [drive, patchDrive] = useSource({ kind: 'pwm', frequency: 1_000 })
  // A small AC signal riding on the bias point, as through a coupling cap.
  const [ac, patchAc] = useSource({ amplitude: 0.1, offset: 0, frequency: 1_000 })

  const source = mode === 'switch' ? drive : ac
  /** Logic high of the drive waveform, i.e. the voltage that turns the base on. */
  const driveHigh = drive.offset + drive.amplitude

  const { dt, traces, sw, amp } = useMemo(() => {
    const { dt, samples } = sweep(source, N, source.cycles, DC_SPAN)
    if (mode === 'switch') {
      const stage = { rb, vLoad, rLoad, hfe }
      const { vce } = switchTrace(samples, stage)
      return {
        dt,
        traces: [
          { label: 'Vdrive', color: TRACE_COLORS[0], samples },
          { label: 'Vce', color: TRACE_COLORS[1], samples: vce },
        ],
        sw: analyseSwitch({ ...stage, vDrive: driveHigh }),
        amp: null,
      }
    }
    const stage = { vcc, r1, r2, rc, re, hfe, bypassed }
    const { base, collector } = ampTrace(samples, stage)
    return {
      dt,
      traces: [
        { label: 'Vb', color: TRACE_COLORS[0], samples: base },
        { label: 'Vc', color: TRACE_COLORS[1], samples: collector },
      ],
      sw: null,
      amp: analyseAmp(stage),
    }
  }, [mode, source, driveHigh, rb, vLoad, rLoad, hfe, vcc, r1, r2, rc, re, bypassed])

  const modeSwitch = (
    <Segmented
      label="Operating mode"
      value={mode}
      onChange={setMode}
      options={[
        { value: 'switch', label: 'Switch' },
        { value: 'amp', label: 'Amplifier' },
      ]}
    />
  )

  if (sw) {
    const stateNote =
      sw.state === 'saturated'
        ? sw.odf >= ODF_TARGET
          ? 'hard on'
          : 'saturated, thin margin'
        : sw.state === 'active'
          ? 'active region'
          : 'off'

    return (
      <SimPage
        id="bjt-switch"
        lede="NPN low side switch driven from a 3V3 GPIO through RB. The scope shows the drive waveform and the collector voltage against time."
        controls={
          <>
            {modeSwitch}
            <Schematic mode="switch" />

            <Group label="Base drive">
              <Param label="Base resistor RB" unit="Ω" value={rb} onChange={setRb} min={10} max={1e6} />
              <Param
                label="Current gain hFE"
                value={hfe}
                onChange={setHfe}
                min={10}
                max={800}
                log={false}
                step={5}
                hint="Datasheet minimum, not typical. Saturation depends on the worst case."
              />
            </Group>

            <Group label="Load">
              <Param
                label="Load rail"
                unit="V"
                value={vLoad}
                onChange={setVLoad}
                min={1}
                max={48}
                log={false}
                step={0.1}
              />
              <Param label="Load resistance" unit="Ω" value={rLoad} onChange={setRLoad} min={1} max={1e5} />
            </Group>

            <SourceControls value={drive} onChange={patchDrive} maxAmplitude={12} label="Drive waveform" />
          </>
        }
      >
        <Oscilloscope traces={traces} dt={dt} unit="V" />

        {sw.state !== 'saturated' && (
          <Warning
            text="Not saturated at {driveHigh} of drive: hFE·IB gives only {icAvailable} against the {icSat} the load wants, so the device sits in the active region at {vce} and burns {pCollector}. Drop RB to {rbForTarget} or below."
            vars={{
              driveHigh: formatSI(driveHigh, 'V'),
              icAvailable: formatSI(sw.icAvailable, 'A'),
              icSat: formatSI(sw.icSat, 'A'),
              vce: formatSI(sw.vce, 'V'),
              pCollector: formatSI(sw.pCollector, 'W'),
              rbForTarget: formatSI(sw.rbForTarget, 'Ω'),
            }}
          />
        )}
        {sw.overGpio && (
          <Warning
            text="Base current is {ib}, past the {GPIO_MAX_MA} mA an ESP32 pin will source. Raise RB or drive the base from a buffer."
            vars={{ ib: formatSI(sw.ib, 'A'), GPIO_MAX_MA }}
          />
        )}

        <ReadoutGrid
          items={[
            {
              label: 'Base current IB',
              value: formatSI(sw.ib, 'A'),
              note: <T k="min {ibMin}" vars={{ ibMin: formatSI(sw.ibMin, 'A') }} />,
              warn: sw.overGpio,
            },
            {
              label: 'Overdrive factor',
              value: `${sw.odf.toFixed(2)}x`,
              note: stateNote,
              warn: sw.odf < 1,
            },
            { label: 'Collector current', value: formatSI(sw.ic, 'A') },
            { label: 'VCE', value: formatSI(sw.vce, 'V'), warn: sw.state !== 'saturated' },
            {
              label: 'Transistor dissipation',
              value: formatSI(sw.pTransistor, 'W'),
              note: <T k="{pCollector} collector" vars={{ pCollector: formatSI(sw.pCollector, 'W') }} />,
            },
            { label: 'Load power', value: formatSI(sw.pLoad, 'W') },
            {
              label: <T k="RB for ODF {ODF_TARGET}" vars={{ ODF_TARGET }} />,
              value: formatSI(sw.rbForTarget, 'Ω'),
              note: <T k="now {rb}" vars={{ rb: formatSI(rb, 'Ω') }} />,
            },
            { label: 'RB dissipation', value: formatSI(sw.pBaseResistor, 'W') },
          ]}
        />

        <Theory
          text={[
            "The base resistor sets everything: `IB = (Vin - VBE) / RB` with VBE taken as 0.7 V. The transistor can then deliver `IC = hFE·IB`, but the load only asks for `IC(sat) = (Vload - VCEsat) / RL`. Whichever is smaller wins.",
            "The overdrive factor is the ratio, `ODF = IB·hFE / IC(load)`. Below 1 the transistor never saturates and sits in the active region dropping volts across itself. Design for ODF of about {ODF_TARGET} so worst case hFE, cold silicon and a heavier load still leave it hard on.",
            "Saturated dissipation is `P = VCEsat·IC + VBE·IB`, a few milliwatts here. In the active region VCE is volts rather than 0.2 V and the same current turns into heat, which is how switching transistors die.",
            "The trace is a per-sample algebraic solve. There is no storage element in this model, so edges are instant: a real device adds a turn-off storage time of hundreds of nanoseconds, which is exactly what heavy overdrive makes worse.",
          ]} vars={{ ODF_TARGET }}
        />
      </SimPage>
    )
  }

  const q = amp!
  const clipping = ac.amplitude > q.maxInput
  const regionNote =
    q.region === 'active' ? 'forward active' : q.region === 'saturated' ? 'saturated' : 'cut off'

  return (
    <SimPage
      id="bjt-switch"
      lede="Voltage divider biased common emitter on the 3V3 rail. The scope shows the base voltage and the inverted collector output against time."
      controls={
        <>
          {modeSwitch}
          <Schematic mode="amp" />

          <Group label="Supply and bias">
            <Param
              label="Supply VCC"
              unit="V"
              value={vcc}
              onChange={setVcc}
              min={1.5}
              max={24}
              log={false}
              step={0.1}
            />
            <Param label="R1 (rail to base)" unit="Ω" value={r1} onChange={setR1} min={1e3} max={1e6} />
            <Param label="R2 (base to gnd)" unit="Ω" value={r2} onChange={setR2} min={1e3} max={1e6} />
          </Group>

          <Group label="Stage">
            <Param label="Collector RC" unit="Ω" value={rc} onChange={setRc} min={100} max={1e5} />
            <Param label="Emitter RE" unit="Ω" value={re} onChange={setRe} min={10} max={1e4} />
            <Param
              label="Current gain hFE"
              value={hfe}
              onChange={setHfe}
              min={10}
              max={800}
              log={false}
              step={5}
            />
            <Toggle label="Bypass RE with a capacitor" value={bypassed} onChange={setBypassed} />
          </Group>

          <SourceControls value={ac} onChange={patchAc} maxAmplitude={2} label="Input signal" />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      {q.region === 'saturated' && (
        <Warning
          text="Biased into saturation: VCE is pinned at {vce} and there is no headroom left to swing. Lower RC or R2, or raise RE."
          vars={{ vce: formatSI(q.vce, 'V') }}
        />
      )}
      {q.region === 'cutoff' && (
        <Warning
          text="Cut off: the divider only puts {vth} on the base, under the 0.7 V the junction needs. Raise R2 or lower R1."
          vars={{ vth: formatSI(q.vth, 'V') }}
        />
      )}
      {q.region === 'active' && !q.stiff && (
        <Warning
          text="Divider is not stiff: it bleeds only {stiffness}x IB, so the bias point moves with hFE and temperature. Aim for 10x, i.e. lower R1 and R2 together."
          vars={{ stiffness: q.stiffness.toFixed(1) }}
        />
      )}
      {q.region === 'active' && clipping && (
        <Warning
          text="Input of {amplitude} peak exceeds the {maxInput} this Q point can amplify without clipping, which is the flat top on the trace."
          vars={{ amplitude: formatSI(ac.amplitude, 'V'), maxInput: formatSI(q.maxInput, 'V') }}
        />
      )}

      <ReadoutGrid
        items={[
          {
            label: 'Quiescent IC',
            value: formatSI(q.ic, 'A'),
            note: <T k="IB {ib}" vars={{ ib: formatSI(q.ib, 'A') }} />,
          },
          {
            label: 'VCE',
            value: formatSI(q.vce, 'V'),
            note: regionNote,
            warn: q.region !== 'active',
          },
          {
            label: 'VB / VE / VC',
            value: `${q.vb.toFixed(2)} / ${q.ve.toFixed(2)} / ${q.vc.toFixed(2)} V`,
          },
          {
            label: 'Voltage gain Av',
            value: `${q.av.toFixed(1)}x`,
            note: Number.isFinite(q.avDb) ? <T k="{avDb} dB, inverting" vars={{ avDb: q.avDb.toFixed(1) }} /> : 'no gain',
          },
          { label: 'Emitter re', value: formatSI(q.reSmall, 'Ω'), note: 'VT / IE' },
          { label: 'Input impedance', value: formatSI(q.zin, 'Ω') },
          { label: 'Output impedance', value: formatSI(q.zout, 'Ω'), note: 'RC, ro ignored' },
          {
            label: 'Max input (peak)',
            value: formatSI(q.maxInput, 'V'),
            note: <T k="swing {swing}" vars={{ swing: formatSI(q.swing, 'V') }} />,
            warn: clipping,
          },
          {
            label: 'Divider stiffness',
            value: Number.isFinite(q.stiffness) ? `${q.stiffness.toFixed(0)}x IB` : 'n/a',
            note: <T k="{dividerCurrent} bleed" vars={{ dividerCurrent: formatSI(q.dividerCurrent, 'A') }} />,
            warn: !q.stiff,
          },
        ]}
      />

      <Theory
        text={[
          "The divider is solved as its Thevenin equivalent, `VTH = VCC·R2/(R1+R2)` and `RTH = R1||R2`, so the base loop gives `IB = (VTH - VBE) / (RTH + (hFE+1)·RE)`. That is the exact answer, not the \"assume IB is negligible\" shortcut, which is why a floppy divider shows up here as a shifted Q point instead of reading correct.",
          "From there `IC = hFE·IB`, `IE = (hFE+1)·IB` and `VCE = VCC - IC·RC - IE·RE`. Put VCE somewhere near the middle of the rail so the output can swing both ways.",
          "Midband gain is `Av = -RC / (RE + re)` where `re = VT/IE` is the intrinsic emitter resistance, about 26 mV over the emitter current. With RE much larger than re this is the familiar `-RC/RE`, set by resistors and therefore stable. Bypassing RE shorts it at signal frequencies, leaving `-RC/re`: much more gain, but now it moves with bias current and temperature.",
          "Output swing is limited by whichever end runs out first, the rail at `IC·RC` above the Q point or saturation at `VCE - VCEsat` below it. The trace applies the midband gain sample by sample and clips there, so it shows the headroom honestly, though a real stage clips softly at cutoff and the coupling capacitor rolls off the low end.",
        ]}
      />
    </SimPage>
  )
}
