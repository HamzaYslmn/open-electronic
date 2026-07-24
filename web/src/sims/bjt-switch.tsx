import { useMemo, useState } from 'react'
import { GPIO_MAX_MA, VCC, VCC_5V } from '../engine/constants'
import { ODF_TARGET, ampTrace, analyseAmp, analyseSwitch, switchTrace } from '../engine/bjt'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Dot, Group, Oscilloscope, Param, ReadoutGrid, Schematic, Segmented, SimPage, SourceControls, Theory, Toggle, useSource, Warning } from '../ui'

/** Samples per sweep, same as every other time-domain page. */
const N = 8192

/** Both solvers are memoryless, so a DC step needs a window only to have an
 *  axis. 1 ms shows the step without pretending there is a rise time. */
const DC_SPAN = 1e-3

type Mode = 'switch' | 'amp'

function Diagram({ mode }: { mode: Mode }) {
  const isSwitch = mode === 'switch'
  return (
    <Schematic
      viewBox="0 0 260 168"
      label={isSwitch ? 'bjt-switch.npnLowSideSwitch' : 'bjt-switch.commonEmitterAmplifier'}
    >
      {/* transistor */}
      <circle cx="128" cy="78" r="32" />
      <path d="M110 58V98M110 64L140 46M110 92L140 110" />
      {/* collector leg, broken for the load resistor */}
      <path d="M140 46V40M140 18V12" />
      <rect x="132" y="18" width="16" height="22" />
      <path d={isSwitch ? 'M120 12H200' : 'M40 12H200'} />
      {/* output tap; three wires meet at the collector, so it takes a dot */}
      <path d="M140 46H196" />
      <Dot x={140} y={46} />
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
          {/* Coupling cap, both divider legs and the base all land here. */}
          <Dot x={60} y={78} />
          <path d="M140 110V116M140 138V142" />
          <rect x="132" y="116" width="16" height="22" />
          <path d="M60 142H140M100 142V146M88 146H112M92 151H108M96 156H104" />
        </>
      )}
      {/* emitter arrow, NPN points out */}
      <polygon className="dot" points="137,108 128,106 131,101" />
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
    </Schematic>
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
          { label: 'bjt-switch.vdrive', samples },
          { label: 'bjt-switch.vce', samples: vce },
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
        { label: 'bjt-switch.vb', samples: base },
        { label: 'common.vc', samples: collector },
      ],
      sw: null,
      amp: analyseAmp(stage),
    }
  }, [mode, source, driveHigh, rb, vLoad, rLoad, hfe, vcc, r1, r2, rc, re, bypassed])

  const modeSwitch = (
    <Segmented
      label="bjt-switch.operatingMode"
      value={mode}
      onChange={setMode}
      options={[
        { value: 'switch', label: 'bjt-switch.switch2' },
        { value: 'amp', label: 'bjt-switch.amplifier' },
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
        lede="bjt-switch.lede"
        controls={
          <>
            {modeSwitch}
            <Diagram mode="switch" />

            <Group label="bjt-switch.baseDrive">
              <Param label="bjt-switch.baseResistorRb" unit="Ω" value={rb} onChange={setRb} min={10} max={1e6} />
              <Param
                label="bjt-switch.currentGainHfe"
                value={hfe}
                onChange={setHfe}
                min={10}
                max={800}
                log={false}
                step={5}
                hint="bjt-switch.datasheetMinimumNotTypical"
              />
            </Group>

            <Group label="common.load">
              <Param
                label="bjt-switch.loadRail"
                unit="V"
                value={vLoad}
                onChange={setVLoad}
                min={1}
                max={48}
                log={false}
                step={0.1}
              />
              <Param label="common.loadResistance" unit="Ω" value={rLoad} onChange={setRLoad} min={1} max={1e5} />
            </Group>

            <SourceControls value={drive} onChange={patchDrive} maxAmplitude={12} label="bjt-switch.driveWaveform" />
          </>
        }
      >
        <Oscilloscope traces={traces} dt={dt} unit="V" />

        <Warning when={sw.state !== 'saturated'}
          text="bjt-switch.warn1"
          vars={{
            driveHigh: formatSI(driveHigh, 'V'),
            icAvailable: formatSI(sw.icAvailable, 'A'),
            icSat: formatSI(sw.icSat, 'A'),
            vce: formatSI(sw.vce, 'V'),
            pCollector: formatSI(sw.pCollector, 'W'),
            rbForTarget: formatSI(sw.rbForTarget, 'Ω'),
          }}
        />
        <Warning when={sw.overGpio}
          text="bjt-switch.warn2"
          vars={{ ib: formatSI(sw.ib, 'A'), GPIO_MAX_MA }}
        />

        <ReadoutGrid
          items={[
            {
              label: 'bjt-switch.baseCurrentIb',
              value: formatSI(sw.ib, 'A'),
              note: <T k="bjt-switch.min" vars={{ ibMin: formatSI(sw.ibMin, 'A') }} />,
              warn: sw.overGpio,
            },
            {
              label: 'bjt-switch.overdriveFactor',
              value: `${sw.odf.toFixed(2)}x`,
              note: stateNote,
              warn: sw.odf < 1,
            },
            { label: 'bjt-switch.collectorCurrent', value: formatSI(sw.ic, 'A') },
            { label: 'bjt-switch.vce2', value: formatSI(sw.vce, 'V'), warn: sw.state !== 'saturated' },
            {
              label: 'bjt-switch.transistorDissipation',
              value: formatSI(sw.pTransistor, 'W'),
              note: <T k="bjt-switch.collector" vars={{ pCollector: formatSI(sw.pCollector, 'W') }} />,
            },
            { label: 'bjt-switch.loadPower', value: formatSI(sw.pLoad, 'W') },
            {
              label: <T k="bjt-switch.rbForOdf" vars={{ ODF_TARGET }} />,
              value: formatSI(sw.rbForTarget, 'Ω'),
              note: <T k="bjt-switch.now" vars={{ rb: formatSI(rb, 'Ω') }} />,
            },
            { label: 'bjt-switch.rbDissipation', value: formatSI(sw.pBaseResistor, 'W') },
          ]}
        />

        <Theory
          text={[
            'bjt-switch.theBaseResistorSets',
            'bjt-switch.theOverdriveFactorIs',
            'bjt-switch.saturatedDissipationIsP',
            'bjt-switch.theTraceIsA',
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
      lede="bjt-switch.lede2"
      controls={
        <>
          {modeSwitch}
          <Diagram mode="amp" />

          <Group label="bjt-switch.supplyAndBias">
            <Param
              label="bjt-switch.supplyVcc"
              unit="V"
              value={vcc}
              onChange={setVcc}
              min={1.5}
              max={24}
              log={false}
              step={0.1}
            />
            <Param label="bjt-switch.r1RailToBase" unit="Ω" value={r1} onChange={setR1} min={1e3} max={1e6} />
            <Param label="bjt-switch.r2BaseToGnd" unit="Ω" value={r2} onChange={setR2} min={1e3} max={1e6} />
          </Group>

          <Group label="bjt-switch.stage">
            <Param label="bjt-switch.collectorRc" unit="Ω" value={rc} onChange={setRc} min={100} max={1e5} />
            <Param label="bjt-switch.emitterRe" unit="Ω" value={re} onChange={setRe} min={10} max={1e4} />
            <Param
              label="bjt-switch.currentGainHfe"
              value={hfe}
              onChange={setHfe}
              min={10}
              max={800}
              log={false}
              step={5}
            />
            <Toggle label="bjt-switch.bypassReWithA" value={bypassed} onChange={setBypassed} />
          </Group>

          <SourceControls value={ac} onChange={patchAc} maxAmplitude={2} label="bjt-switch.inputSignal" />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <Warning when={q.region === 'saturated'}
        text="bjt-switch.warn3"
        vars={{ vce: formatSI(q.vce, 'V') }}
      />
      <Warning when={q.region === 'cutoff'}
        text="bjt-switch.warn4"
        vars={{ vth: formatSI(q.vth, 'V') }}
      />
      <Warning when={q.region === 'active' && !q.stiff}
        text="bjt-switch.warn5"
        vars={{ stiffness: q.stiffness.toFixed(1) }}
      />
      <Warning when={q.region === 'active' && clipping}
        text="bjt-switch.warn6"
        vars={{ amplitude: formatSI(ac.amplitude, 'V'), maxInput: formatSI(q.maxInput, 'V') }}
      />

      <ReadoutGrid
        items={[
          {
            label: 'bjt-switch.quiescentIc',
            value: formatSI(q.ic, 'A'),
            note: <T k="bjt-switch.ib" vars={{ ib: formatSI(q.ib, 'A') }} />,
          },
          {
            label: 'bjt-switch.vce2',
            value: formatSI(q.vce, 'V'),
            note: regionNote,
            warn: q.region !== 'active',
          },
          {
            label: 'bjt-switch.vbVeVc',
            value: `${q.vb.toFixed(2)} / ${q.ve.toFixed(2)} / ${q.vc.toFixed(2)} V`,
          },
          {
            label: 'bjt-switch.voltageGainAv',
            value: `${q.av.toFixed(1)}x`,
            note: Number.isFinite(q.avDb) ? <T k="bjt-switch.dbInverting" vars={{ avDb: q.avDb.toFixed(1) }} /> : 'bjt-switch.noGain',
          },
          { label: 'bjt-switch.emitterRe2', value: formatSI(q.reSmall, 'Ω'), note: 'bjt-switch.vtIe' },
          { label: 'common.inputImpedance', value: formatSI(q.zin, 'Ω') },
          { label: 'common.outputImpedance', value: formatSI(q.zout, 'Ω'), note: 'bjt-switch.rcRoIgnored' },
          {
            label: 'bjt-switch.maxInputPeak',
            value: formatSI(q.maxInput, 'V'),
            note: <T k="bjt-switch.swing" vars={{ swing: formatSI(q.swing, 'V') }} />,
            warn: clipping,
          },
          {
            label: 'bjt-switch.dividerStiffness',
            value: Number.isFinite(q.stiffness) ? `${q.stiffness.toFixed(0)}x IB` : 'n/a',
            note: <T k="bjt-switch.bleed" vars={{ dividerCurrent: formatSI(q.dividerCurrent, 'A') }} />,
            warn: !q.stiff,
          },
        ]}
      />

      <Theory
        text={[
          'bjt-switch.theDividerIsSolved',
          'bjt-switch.fromThereIcHfe',
          'bjt-switch.midbandGainIsAv',
          'bjt-switch.outputSwingIsLimited',
        ]}
      />
    </SimPage>
  )
}
