import { useMemo, useState } from 'react'
import { DEFAULT_DERATING, analyseDeepSleep } from '../engine/powerBudget'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, SimPage, Theory, TRACE_COLORS, Warning } from '../ui'

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
        { label: 'common.mean', color: TRACE_COLORS[2], samples: average, quiet: true },
      ],
    }
  }, [activeCurrent, activeTime, sleepCurrent, sleepTime, capacityAh, packVoltage, derating])

  return (
    <SimPage
      id="deep-sleep"
      lede="deep-sleep.lede"
      controls={
        <>
          <Group label="deep-sleep.awake">
            <Param label="common.activeCurrent" unit="A" value={activeCurrent} onChange={setActiveCurrent} min={1e-3} max={1} />
            <Param label="common.activeTime" unit="s" value={activeTime} onChange={setActiveTime} min={0.01} max={600} />
          </Group>
          <Group label="deep-sleep.asleep">
            <Param label="common.sleepCurrent" unit="A" value={sleepCurrent} onChange={setSleepCurrent} min={1e-7} max={1e-2} />
            <Param label="common.sleepTime" unit="s" value={sleepTime} onChange={setSleepTime} min={1} max={86400} />
          </Group>
          <Group label="common.battery">
            <Param label="common.capacity" unit="Ah" value={capacityAh} onChange={setCapacityAh} min={0.02} max={100} />
            <Param label="common.packVoltage" unit="V" value={packVoltage} onChange={setPackVoltage} min={1} max={24} log={false} step={0.1} />
            <Param label="deep-sleep.usableFraction" value={derating} onChange={setDerating} min={0.3} max={1} log={false} step={0.05} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          { label: 'common.averageCurrent', value: formatSI(r.averageCurrent, 'A') },
          { label: 'common.dutyCycle', value: `${(r.duty * 100).toFixed(3)}%` },
          { label: 'deep-sleep.cyclePeriod', value: formatSI(r.period, 's') },
          { label: 'deep-sleep.chargePerWake', value: `${(r.chargePerCycle * 1000).toFixed(2)} mAs` },
          { label: 'deep-sleep.energyPerWake', value: formatSI(r.energyPerCycle, 'J') },
          {
            label: 'common.runtime',
            value: <T k="deep-sleep.days" vars={{ runtimeDays: r.runtimeDays.toFixed(0) }} />,
            note: <T k="deep-sleep.years" vars={{ runtimeDays: (r.runtimeDays / 365).toFixed(2) }} />,
          },
          { label: 'deep-sleep.wakeCycles', value: Math.floor(r.cycles).toLocaleString() },
          {
            label: 'deep-sleep.sleepShareOfBudget',
            value: `${(r.sleepShare * 100).toFixed(1)}%`,
            warn: r.sleepDominated,
          },
          { label: 'deep-sleep.consumption', value: <T k="deep-sleep.whDay" vars={{ whPerDay: r.whPerDay.toFixed(3) }} /> },
        ]}
      />

      <Warning when={r.sleepDominated}
        text="deep-sleep.warn1"
        vars={{ sleepShare: (r.sleepShare * 100).toFixed(0) }}
      />
      <Warning when={activeCurrent > 0.15}
        text="deep-sleep.warn2"
      />

      <Theory
        text={[
          'deep-sleep.theory1',
          'deep-sleep.theConsequenceIsUnintuitive',
          'deep-sleep.whichTermDominatesDecides',
          'deep-sleep.theUsableFractionIs',
        ]}
      />
    </SimPage>
  )
}
