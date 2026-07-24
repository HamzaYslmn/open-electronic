import { useMemo, useState } from 'react'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { DEFAULTS, analyse, toCelsius, waveform } from '../engine/mosfet'
import type { MosfetParams } from '../engine/mosfet'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
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
    <svg className="schematic" viewBox="0 0 260 132" aria-label={t('Low side N-channel MOSFET switch')}>
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
        { label: 'Vgs', color: TRACE_COLORS[0], samples: w.vgs },
        { label: 'Vds', color: TRACE_COLORS[1], samples: w.vds },
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
      lede="A logic level N-channel MOSFET switching a load from an ESP32 GPIO. The scope shows gate and drain voltage over one or more PWM cycles, horizontal axis is time. Readouts below are the operating point, the loss split and the junction temperature."
      controls={
        <>
          <Segmented
            label="Part"
            value={part}
            onChange={(key: PartKey) => key !== 'custom' && patch(PARTS[key])}
            options={[
              { value: 'irlz44n', label: 'IRLZ44N' },
              { value: 'irf540n', label: 'IRF540N' },
            ]}
          />
          <Schematic />

          <Group label="Gate drive">
            <Param
              label="Gate drive VGS"
              unit="V"
              value={p.vgsDrive}
              onChange={(vgsDrive) => patch({ vgsDrive })}
              min={0.5}
              max={15}
              log={false}
              step={0.1}
              hint={<T k="ESP32 GPIO is {VCC} V" vars={{ VCC }} />}
            />
            <Param
              label="Gate resistor Rg"
              unit="Ω"
              value={p.rg}
              onChange={(rg) => patch({ rg })}
              min={1}
              max={10_000}
            />
            <Param
              label="Gate charge Qg"
              unit="C"
              value={p.qg}
              onChange={(qg) => patch({ qg })}
              min={1e-9}
              max={500e-9}
            />
          </Group>

          <Group label="MOSFET">
            <Param
              label="Threshold Vth"
              unit="V"
              value={p.vth}
              onChange={(vth) => patch({ vth })}
              min={0.4}
              max={6}
              log={false}
              step={0.1}
            />
            <Param
              label="RDS(on) quoted"
              unit="Ω"
              value={p.rdsOnSpec}
              onChange={(rdsOnSpec) => patch({ rdsOnSpec })}
              min={1e-3}
              max={2}
            />
            <Param
              label="quoted at VGS"
              unit="V"
              value={p.vgsSpec}
              onChange={(vgsSpec) => patch({ vgsSpec })}
              min={2.5}
              max={15}
              log={false}
              step={0.5}
            />
          </Group>

          <Group label="Load">
            <Param
              label="Supply VS"
              unit="V"
              value={p.vSupply}
              onChange={(vSupply) => patch({ vSupply })}
              min={1}
              max={60}
              log={false}
              step={0.1}
            />
            <Param
              label="Load resistance"
              unit="Ω"
              value={p.rLoad}
              onChange={(rLoad) => patch({ rLoad })}
              min={0.1}
              max={1_000}
            />
          </Group>

          <Group label="Switching">
            <Param
              label="Frequency"
              unit="Hz"
              value={p.fsw}
              onChange={(fsw) => patch({ fsw })}
              min={1}
              max={1e6}
            />
            <Param
              label="Duty"
              value={p.duty}
              onChange={(duty) => patch({ duty })}
              min={0.01}
              max={0.99}
              log={false}
              step={0.01}
            />
            <Param
              label="Rise time tr"
              unit="s"
              value={p.tr}
              onChange={(tr) => patch({ tr })}
              min={1e-9}
              max={10e-6}
            />
            <Param
              label="Fall time tf"
              unit="s"
              value={p.tf}
              onChange={(tf) => patch({ tf })}
              min={1e-9}
              max={10e-6}
            />
            <Param
              label="Cycles shown"
              value={cycles}
              onChange={(v) => setCycles(Math.round(v))}
              min={1}
              max={8}
              log={false}
              step={1}
            />
          </Group>

          <Group label="Thermal">
            <Param
              label="Rth junction to ambient"
              unit="K/W"
              value={p.rthJA}
              onChange={(rthJA) => patch({ rthJA })}
              min={0.5}
              max={200}
            />
            <Param
              label="Ambient"
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
          text="VGS of {vgsDrive} is at or below the {vth} threshold, so no channel forms and the load never sees current. This is the classic failure of hanging a standard MOSFET off a 3.3 V pin: pick a logic level part, or add a gate driver or a small BJT level shifter to swing the gate to 10 V."
          vars={{ vgsDrive: formatSI(p.vgsDrive, 'V'), vth: formatSI(p.vth, 'V') }}
        />
      )}
      {a.region === 'saturation' && (
        <Warning
          text="The FET is sitting in saturation, i.e. behaving as a constant current source at {id} with {vds} across it. That is a linear regulator, not a switch, and it dissipates {pCond}. Raise VGS or raise the load resistance."
          vars={{
            id: formatSI(a.id, 'A'),
            vds: formatSI(a.vds, 'V'),
            pCond: formatSI(a.pCond, 'W'),
          }}
        />
      )}
      {a.gateOverCurrent && (
        <Warning
          text="Peak gate current is {igPeak}, over the {GPIO_MAX_MA} mA an ESP32 GPIO is rated for. Raise Rg or use a gate driver."
          vars={{ igPeak: formatSI(a.igPeak, 'A'), GPIO_MAX_MA }}
        />
      )}
      {a.transitionBound && (
        <Warning
          text="The edges take {tfEff} out of a {fsw} period. The FET spends most of the cycle in transition, so the hard switching loss model no longer applies and the real device will be hotter than shown."
          vars={{ tfEff: formatSI(a.trEff + a.tfEff, 's'), fsw: formatSI(1 / p.fsw, 's') }}
        />
      )}
      {a.overTemp && (
        <Warning
          text="Junction is at {tj} °C, past the 150 °C rating. Add a heatsink (lower Rth), lower the current, or improve the gate drive."
          vars={{ tj: toCelsius(a.tj).toFixed(0) }}
        />
      )}

      <ReadoutGrid
        items={[
          {
            label: 'Operating region',
            value: region,
            warn: a.region !== 'triode',
          },
          {
            label: 'Gate overdrive',
            value: formatSI(a.vov, 'V'),
            note: <T k="(VGS {vgsDrive} - Vth {vth})" vars={{ vgsDrive: formatSI(p.vgsDrive, 'V'), vth: formatSI(p.vth, 'V') }} />,
            warn: a.belowThreshold,
          },
          {
            label: 'RDS(on) at this VGS',
            value: formatSI(a.rdsOn, 'Ω'),
            note: <T k="(datasheet {rdsOnSpec} at {vgsSpec})" vars={{ rdsOnSpec: formatSI(p.rdsOnSpec, 'Ω'), vgsSpec: formatSI(p.vgsSpec, 'V') }} />,
            warn: a.underDriven,
          },
          {
            label: 'Drain current',
            value: formatSI(a.id, 'A'),
            note: <T k="(ideal switch {idIdeal})" vars={{ idIdeal: formatSI(a.idIdeal, 'A') }} />,
          },
          { label: 'VDS on state', value: formatSI(a.vds, 'V') },
          { label: 'Miller plateau', value: formatSI(a.vPlateau, 'V') },
          {
            label: 'Conduction loss',
            value: formatSI(a.pCond, 'W'),
            note: <T k="(D·Id²·RDS at {duty}% duty)" vars={{ duty: (p.duty * 100).toFixed(0) }} />,
          },
          {
            label: 'Switching loss',
            value: formatSI(a.pSw, 'W'),
            note: <T k="(edges {trEff} / {tfEff})" vars={{ trEff: formatSI(a.trEff, 's'), tfEff: formatSI(a.tfEff, 's') }} />,
            warn: a.transitionBound,
          },
          {
            label: 'Gate charge time',
            value: formatSI(a.tGate, 's'),
            note: a.tGate > p.tr ? '(drive limited, not die limited)' : '(die limited)',
          },
          {
            label: 'Peak gate current',
            value: formatSI(a.igPeak, 'A'),
            note: <T k="(GPIO limit {GPIO_MAX_MA} mA)" vars={{ GPIO_MAX_MA }} />,
            warn: a.gateOverCurrent,
          },
          {
            label: 'Gate drive power',
            value: formatSI(a.pGate, 'W'),
            note: '(burned in Rg and the pin, not the FET)',
          },
          {
            label: 'Channel dissipation',
            value: formatSI(a.pTotal, 'W'),
            note: '(conduction + switching)',
          },
          {
            label: 'Junction temperature',
            value: `${toCelsius(a.tj).toFixed(1)} °C`,
            note: <T k="(rise {ta} K over {ta2} °C)" vars={{ ta: (a.tj - p.ta).toFixed(1), ta2: toCelsius(p.ta).toFixed(0) }} />,
            warn: a.overTemp,
          },
          {
            label: 'Power to load',
            value: formatSI(a.pLoad, 'W'),
            note: <T k="({efficiency}% of what the switch passes)" vars={{ efficiency: (a.efficiency * 100).toFixed(1) }} />,
          },
        ]}
      />

      <Theory
        text={[
          "The channel follows the square law. Below threshold there is no channel at all. Above it, with `Vov = VGS - Vth`, the drain current is `Id = k·(Vov·VDS - VDS²/2)` in triode and saturates at `Id = 0.5·k·Vov²` once `VDS &gt; Vov`. The operating point is the intersection of that curve with the load line `VDS = VS - Id·Rload`, solved in closed form rather than iterated.",
          "RDS(on) is not a constant. Deep in triode the channel is `rds = 1 / (k·Vov)`, so a datasheet quote pins down k: `k = 1 / (RDS(on)spec · (VGSspec - Vth))`, and at any other gate voltage `RDS(on) = RDS(on)spec · (VGSspec - Vth) / (VGS - Vth)`. That is why a part advertised at 22 mΩ is nearer 51 mΩ on 3.3 V, and why a part quoted at 10 V is simply off.",
          "Losses split three ways. Conduction is `Pcond = D·Id²·RDS(on)`. Crossover is `Psw = 0.5·VDS·Id·(tr + tf)·fsw`, taking each edge as a current rise at full voltage followed by a voltage fall at full current, which is the conservative clamped inductive case. Gate charge costs `Pgate = Qg·VGS·fsw`, dissipated in the gate resistor and the driving pin rather than in the FET. Only the first two heat the die, so `Tj = Ta + (Pcond + Psw)·Rth(j-a)`.",
          "The edge times used are `max(tr, Qg·Rg/VGS)`. A gate cannot move faster than the drive can shift its charge, so a large gate resistor on a GPIO, not the die, usually sets the switching speed and therefore the switching loss.",
          "The scope trace is built from that piecewise description evaluated directly at each sample time, so it is exact at any time base and integrating `VDS·Id` over it returns the same numbers as the closed forms above.",
        ]}
      />
    </SimPage>
  )
}
