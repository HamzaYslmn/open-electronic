import { useMemo, useState } from 'react'
import { DEFAULT_DERATING, analyseDeepSleep } from '../engine/powerBudget'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 4096

export default function DeepSleep() {
  const [activeCurrent, setActiveCurrent] = useState(0.08)
  const [activeTime, setActiveTime] = useState(3)
  const [sleepCurrent, setSleepCurrent] = useState(10e-6)
  const [sleepTime, setSleepTime] = useState(3600)
  const [capacityAh, setCapacityAh] = useState(2)
  const [packVoltage, setPackVoltage] = useState(3.7)
  const [derating, setDerating] = useState(DEFAULT_DERATING)

  const { r, traces, dt } = useMemo(() => {
    const profile = { activeCurrent, activeTime, sleepCurrent, sleepTime }
    const r = analyseDeepSleep(profile, capacityAh, packVoltage, derating)
    // One and a bit cycles, so both the wake pulse and the sleep floor are on
    // screen. The pulse is usually a sliver, which is exactly the point.
    const span = r.period * 1.5
    const dt = span / N
    const current = new Float64Array(N)
    const average = new Float64Array(N).fill(r.averageCurrent)
    for (let i = 0; i < N; i++) {
      const t = (i * dt) % r.period
      current[i] = t < activeTime ? activeCurrent : sleepCurrent
    }
    return {
      r,
      dt,
      traces: [
        { label: 'I', color: TRACE_COLORS[0], samples: current },
        { label: 'mean', color: TRACE_COLORS[2], samples: average, quiet: true },
      ],
    }
  }, [activeCurrent, activeTime, sleepCurrent, sleepTime, capacityAh, packVoltage, derating])

  return (
    <SimPage
      id="deep-sleep"
      lede="A battery node lives or dies on its average current, not its peak. The scope shows the current profile over one wake/sleep cycle against the resulting average, on a linear time axis."
      controls={
        <>
          <Group label="Awake">
            <Param label="Active current" unit="A" value={activeCurrent} onChange={setActiveCurrent} min={1e-3} max={1} />
            <Param label="Active time" unit="s" value={activeTime} onChange={setActiveTime} min={0.01} max={600} />
          </Group>
          <Group label="Asleep">
            <Param label="Sleep current" unit="A" value={sleepCurrent} onChange={setSleepCurrent} min={1e-7} max={1e-2} />
            <Param label="Sleep time" unit="s" value={sleepTime} onChange={setSleepTime} min={1} max={86400} />
          </Group>
          <Group label="Battery">
            <Param label="Capacity" unit="Ah" value={capacityAh} onChange={setCapacityAh} min={0.02} max={100} />
            <Param label="Pack voltage" unit="V" value={packVoltage} onChange={setPackVoltage} min={1} max={24} log={false} step={0.1} />
            <Param label="Usable fraction" value={derating} onChange={setDerating} min={0.3} max={1} log={false} step={0.05} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'Average current', value: formatSI(r.averageCurrent, 'A') },
          { label: 'Duty cycle', value: `${(r.duty * 100).toFixed(3)}%` },
          { label: 'Cycle period', value: formatSI(r.period, 's') },
          { label: 'Charge per wake', value: `${(r.chargePerCycle * 1000).toFixed(2)} mAs` },
          { label: 'Energy per wake', value: formatSI(r.energyPerCycle, 'J') },
          {
            label: 'Runtime',
            value: <T k="{runtimeDays} days" vars={{ runtimeDays: r.runtimeDays.toFixed(0) }} />,
            note: <T k="{runtimeDays} years" vars={{ runtimeDays: (r.runtimeDays / 365).toFixed(2) }} />,
          },
          { label: 'Wake cycles', value: Math.floor(r.cycles).toLocaleString() },
          {
            label: 'Sleep share of budget',
            value: `${(r.sleepShare * 100).toFixed(1)}%`,
            warn: r.sleepDominated,
          },
          { label: 'Consumption', value: <T k="{whPerDay} Wh/day" vars={{ whPerDay: r.whPerDay.toFixed(3) }} /> },
        ]}
      />

      {r.sleepDominated && (
        <Warning
          text="Sleep current is {sleepShare}% of the budget, so optimising the wake phase buys you almost nothing. Attack the standby draw instead: a linear regulator's quiescent current, a permanently connected divider, or a peripheral left powered are the usual culprits, and each can dwarf the ESP32's own 10 µA."
          vars={{ sleepShare: (r.sleepShare * 100).toFixed(0) }}
        />
      )}
      {activeCurrent > 0.15 && (
        <Warning
          text="Above about 150 mA you are almost certainly transmitting. WiFi association costs far more energy than the transmission itself, so batching several readings into one wake is usually a bigger win than making each wake shorter."
        />
      )}

      <Theory
        text={[
          "Average current is the time-weighted mean over one cycle, `Iavg = (Ion·ton + Isleep·tsleep) / (ton + tsleep)`. Runtime is then the usable capacity divided by that. Nothing else matters: the peak current only affects whether the supply can deliver it, not how long the pack lasts.",
          "The consequence is unintuitive. An ESP32 drawing 80 mA for 3 seconds every hour averages about 77 µA, so a 2 Ah cell lasts over two years. The same chip left awake would flatten it in a day. Deep sleep is not an optimisation, it is the entire design.",
          "Which term dominates decides where to spend effort. Once the sleep phase carries most of the average, shortening the wake is wasted work, and the target becomes standby leakage: regulator quiescent current, pull-up and divider networks, and sensors that stay powered.",
          "The usable fraction is doing real work here. Nominal capacity assumes a slow discharge to a low cutoff at room temperature, none of which holds in the field. Planning on 80% is normal, and less in the cold.",
        ]}
      />
    </SimPage>
  )
}
