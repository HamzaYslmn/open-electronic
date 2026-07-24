import { useMemo, useState } from 'react'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { DEFAULTS, analyse, toCelsius, waveform } from '../engine/mosfet'
import type { MosfetParams } from '../engine/mosfet'
import { formatSI } from '../engine/units'
import { T, sym, useT } from '../i18n'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per sweep, same as every other time-domain page here. */
const N = 8192

/** ESP32 GPIO source/sink rating, converted to amps for the engine. */
const GPIO_MAX_A = GPIO_MAX_MA / 1000

/**
 * Two real TO-220 parts that make the point. The IRLZ44N is logic level and
 * quotes RDS(on) at 5 V; the IRF540N quotes it at 10 V with a threshold that can
 * be 4 V, so a 3.3 V GPIO leaves it switched off. Numbers are datasheet typicals.
 */
const PARTS = {
  irlz44n: { vth: 2.0, rdsOnSpec: 0.022, vgsSpec: 5, qg: 48e-9, tr: 100e-9, tf: 50e-9 },
  irf540n: { vth: 4.0, rdsOnSpec: 0.044, vgsSpec: 10, qg: 71e-9, tr: 35e-9, tf: 35e-9 },
} as const

type PartKey = keyof typeof PARTS | 'custom'

function matchPart(p: MosfetParams): PartKey {
  for (const [key, part] of Object.entries(PARTS)) {
    if (p.vth === part.vth && p.rdsOnSpec === part.rdsOnSpec && p.vgsSpec === part.vgsSpec) {
      return key as PartKey
    }
  }
  return 'custom'
}

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 132" aria-label={t('mosfet-switch.lowSideNChannel')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* gate path: GPIO, series resistor, gate plate */}
        <circle cx="24" cy="75" r="3" />
        <path d="M27 75h33" />
        <rect x="60" y="67" width="36" height="16" />
        <path d="M96 75h42" />
        <path d="M138 56v38" />
        {/* channel, drawn broken for an enhancement mode device */}
        <path d="M146 56v10M146 70v10M146 84v10" />
        {/* drain up to the load, source down to ground */}
        <path d="M146 61h20v-5M166 30v-14M146 89h20v27" />
        <rect x="158" y="30" width="16" height="26" />
        {/* body tie */}
        <path d="M146 75h20M152 71l-6 4 6 4" />
        <path d="M154 116h24M158 120h16M162 124h8" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="2" y="79">
          GPIO
        </text>
        <text x="70" y="62">
          Rg
        </text>
        <text x="180" y="46">
          Load
        </text>
        <text x="176" y="20">
          +VS
        </text>
        <text x="112" y="110">
          Vds
        </text>
      </g>
    </svg>
  )
}

export default function MosfetSwitch() {
  const [p, setP] = useState<MosfetParams>(DEFAULTS)
  const [cycles, setCycles] = useState(2)
  const patch = (next: Partial<MosfetParams>) => setP((prev) => ({ ...prev, ...next }))

  const { dt, traces, a } = useMemo(() => {
    const a = analyse(p, GPIO_MAX_A)
    const w = waveform(p, a, N, Math.round(cycles))
    return {
      dt: w.dt,
      a,
      traces: [
        { label: 'mosfet-switch.vgs', color: TRACE_COLORS[0], samples: w.vgs },
        { label: 'mosfet-switch.vds', color: TRACE_COLORS[1], samples: w.vds },
      ],
    }
  }, [p, cycles])

  const part = matchPart(p)
  const region =
    a.region === 'cutoff'
      ? 'Cutoff (off)'
      : a.region === 'triode'
        ? 'Triode (ohmic, fully on)'
        : 'Saturation (constant current)'

  return (
    <SimPage
      id="mosfet-switch"
      lede="mosfet-switch.lede"
      controls={
        <>
          <Segmented
            label="mosfet-switch.part"
            value={part}
            onChange={(key: PartKey) => key !== 'custom' && patch(PARTS[key])}
            options={[
              { value: 'irlz44n', label: sym('IRLZ44N') },
              { value: 'irf540n', label: sym('IRF540N') },
            ]}
          />
          <Schematic />

          <Group label="mosfet-switch.gateDrive">
            <Param
              label="common.gateDriveVgs"
              unit="V"
              value={p.vgsDrive}
              onChange={(vgsDrive) => patch({ vgsDrive })}
              min={0.5}
              max={15}
              log={false}
              step={0.1}
              hint={<T k="mosfet-switch.esp32GpioIsV" vars={{ VCC }} />}
            />
            <Param
              label="mosfet-switch.gateResistorRg"
              unit="Ω"
              value={p.rg}
              onChange={(rg) => patch({ rg })}
              min={1}
              max={10_000}
            />
            <Param
              label="mosfet-switch.gateChargeQg"
              unit="C"
              value={p.qg}
              onChange={(qg) => patch({ qg })}
              min={1e-9}
              max={500e-9}
            />
          </Group>

          <Group label="mosfet-switch.mosfet">
            <Param
              label="mosfet-switch.thresholdVth"
              unit="V"
              value={p.vth}
              onChange={(vth) => patch({ vth })}
              min={0.4}
              max={6}
              log={false}
              step={0.1}
            />
            <Param
              label="mosfet-switch.rdsOnQuoted"
              unit="Ω"
              value={p.rdsOnSpec}
              onChange={(rdsOnSpec) => patch({ rdsOnSpec })}
              min={1e-3}
              max={2}
            />
            <Param
              label="mosfet-switch.quotedAtVgs"
              unit="V"
              value={p.vgsSpec}
              onChange={(vgsSpec) => patch({ vgsSpec })}
              min={2.5}
              max={15}
              log={false}
              step={0.5}
            />
          </Group>

          <Group label="common.load">
            <Param
              label="mosfet-switch.supplyVs"
              unit="V"
              value={p.vSupply}
              onChange={(vSupply) => patch({ vSupply })}
              min={1}
              max={60}
              log={false}
              step={0.1}
            />
            <Param
              label="common.loadResistance"
              unit="Ω"
              value={p.rLoad}
              onChange={(rLoad) => patch({ rLoad })}
              min={0.1}
              max={1_000}
            />
          </Group>

          <Group label="mosfet-switch.switching">
            <Param
              label="common.frequency"
              unit="Hz"
              value={p.fsw}
              onChange={(fsw) => patch({ fsw })}
              min={1}
              max={1e6}
            />
            <Param
              label="common.duty"
              value={p.duty}
              onChange={(duty) => patch({ duty })}
              min={0.01}
              max={0.99}
              log={false}
              step={0.01}
            />
            <Param
              label="mosfet-switch.riseTimeTr"
              unit="s"
              value={p.tr}
              onChange={(tr) => patch({ tr })}
              min={1e-9}
              max={10e-6}
            />
            <Param
              label="mosfet-switch.fallTimeTf"
              unit="s"
              value={p.tf}
              onChange={(tf) => patch({ tf })}
              min={1e-9}
              max={10e-6}
            />
            <Param
              label="common.cyclesShown"
              value={cycles}
              onChange={(v) => setCycles(Math.round(v))}
              min={1}
              max={8}
              log={false}
              step={1}
            />
          </Group>

          <Group label="common.thermal">
            <Param
              label="mosfet-switch.rthJunctionToAmbient"
              unit="K/W"
              value={p.rthJA}
              onChange={(rthJA) => patch({ rthJA })}
              min={0.5}
              max={200}
            />
            <Param
              label="common.ambient"
              unit="K"
              value={p.ta}
              onChange={(ta) => patch({ ta })}
              min={233.15}
              max={398.15}
              log={false}
              step={1}
              hint={`${toCelsius(p.ta).toFixed(0)} °C`}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      {a.belowThreshold && (
        <Warning
          text="mosfet-switch.warn1"
          vars={{ vgsDrive: formatSI(p.vgsDrive, 'V'), vth: formatSI(p.vth, 'V') }}
        />
      )}
      {a.region === 'saturation' && (
        <Warning
          text="mosfet-switch.warn2"
          vars={{
            id: formatSI(a.id, 'A'),
            vds: formatSI(a.vds, 'V'),
            pCond: formatSI(a.pCond, 'W'),
          }}
        />
      )}
      {a.gateOverCurrent && (
        <Warning
          text="mosfet-switch.warn3"
          vars={{ igPeak: formatSI(a.igPeak, 'A'), GPIO_MAX_MA }}
        />
      )}
      {a.transitionBound && (
        <Warning
          text="mosfet-switch.warn4"
          vars={{ tfEff: formatSI(a.trEff + a.tfEff, 's'), fsw: formatSI(1 / p.fsw, 's') }}
        />
      )}
      {a.overTemp && (
        <Warning
          text="mosfet-switch.warn5"
          vars={{ tj: toCelsius(a.tj).toFixed(0) }}
        />
      )}

      <ReadoutGrid
        items={[
          {
            label: 'mosfet-switch.operatingRegion',
            value: region,
            warn: a.region !== 'triode',
          },
          {
            label: 'mosfet-switch.gateOverdrive',
            value: formatSI(a.vov, 'V'),
            note: <T k="mosfet-switch.vgsVth" vars={{ vgsDrive: formatSI(p.vgsDrive, 'V'), vth: formatSI(p.vth, 'V') }} />,
            warn: a.belowThreshold,
          },
          {
            label: 'mosfet-switch.rdsOnAtThis',
            value: formatSI(a.rdsOn, 'Ω'),
            note: <T k="mosfet-switch.datasheetAt" vars={{ rdsOnSpec: formatSI(p.rdsOnSpec, 'Ω'), vgsSpec: formatSI(p.vgsSpec, 'V') }} />,
            warn: a.underDriven,
          },
          {
            label: 'mosfet-switch.drainCurrent',
            value: formatSI(a.id, 'A'),
            note: <T k="mosfet-switch.idealSwitch" vars={{ idIdeal: formatSI(a.idIdeal, 'A') }} />,
          },
          { label: 'mosfet-switch.vdsOnState', value: formatSI(a.vds, 'V') },
          { label: 'mosfet-switch.millerPlateau', value: formatSI(a.vPlateau, 'V') },
          {
            label: 'mosfet-switch.conductionLoss',
            value: formatSI(a.pCond, 'W'),
            note: <T k="mosfet-switch.dIdRdsAt" vars={{ duty: (p.duty * 100).toFixed(0) }} />,
          },
          {
            label: 'mosfet-switch.switchingLoss',
            value: formatSI(a.pSw, 'W'),
            note: <T k="mosfet-switch.edges" vars={{ trEff: formatSI(a.trEff, 's'), tfEff: formatSI(a.tfEff, 's') }} />,
            warn: a.transitionBound,
          },
          {
            label: 'mosfet-switch.gateChargeTime',
            value: formatSI(a.tGate, 's'),
            note: a.tGate > p.tr ? 'mosfet-switch.driveLimitedNotDie' : 'mosfet-switch.dieLimited',
          },
          {
            label: 'mosfet-switch.peakGateCurrent',
            value: formatSI(a.igPeak, 'A'),
            note: <T k="mosfet-switch.gpioLimitMa" vars={{ GPIO_MAX_MA }} />,
            warn: a.gateOverCurrent,
          },
          {
            label: 'mosfet-switch.gateDrivePower',
            value: formatSI(a.pGate, 'W'),
            note: 'mosfet-switch.burnedInRgAnd',
          },
          {
            label: 'mosfet-switch.channelDissipation',
            value: formatSI(a.pTotal, 'W'),
            note: 'mosfet-switch.conductionSwitching',
          },
          {
            label: 'mosfet-switch.junctionTemperature',
            value: `${toCelsius(a.tj).toFixed(1)} °C`,
            note: <T k="mosfet-switch.riseKOverC" vars={{ ta: (a.tj - p.ta).toFixed(1), ta2: toCelsius(p.ta).toFixed(0) }} />,
            warn: a.overTemp,
          },
          {
            label: 'mosfet-switch.powerToLoad',
            value: formatSI(a.pLoad, 'W'),
            note: <T k="mosfet-switch.ofWhatTheSwitch" vars={{ efficiency: (a.efficiency * 100).toFixed(1) }} />,
          },
        ]}
      />

      <Theory
        text={[
          'mosfet-switch.theChannelFollowsThe',
          'mosfet-switch.rdsOnIsNot',
          'mosfet-switch.lossesSplitThreeWays',
          'mosfet-switch.theEdgeTimesUsed',
          'mosfet-switch.theScopeTraceIs',
        ]}
      />
    </SimPage>
  )
}
