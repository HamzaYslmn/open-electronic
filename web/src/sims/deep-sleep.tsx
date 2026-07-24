import { useMemo, useState } from 'react'
import { DEFAULT_DERATING, analyseDeepSleep } from '../engine/powerBudget'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Segmented, SimPage, Theory, TRACE_COLORS, Warning } from '../ui'

const N = 4096

/** Common wake cadences, from a BLE beacon every second up to a daily report.
 *  The log slider from 1 s to a day cannot land on a round value by drag, so a
 *  tap sets it exactly. */
const PRESETS = [1, 3, 10, 30, 60, 300, 3600, 21600, 86400]

/** Seconds in human units rather than SI, so an hourly wake reads "1 h" and not
 *  "3.6 ks". Trailing zeros stripped: 1.5 h stays, 1.0 h becomes 1 h. */
function humanTime(s: number): string {
  const round = (x: number) => +x.toFixed(2)
  if (s < 60) return `${round(s)} s`
  if (s < 3600) return `${round(s / 60)} min`
  if (s < 86400) return `${round(s / 3600)} h`
  return `${round(s / 86400)} d`
}

export default function DeepSleep() {
  const t = useT()
  const [activeCurrent, setActiveCurrent] = useState(0.08)
  const [activeTime, setActiveTime] = useState(0.3)
  const [sleepCurrent, setSleepCurrent] = useState(10e-6)
  const [sleepTime, setSleepTime] = useState(2.7)
  const [capacityAh, setCapacityAh] = useState(2)
  const [packVoltage, setPackVoltage] = useState(3.7)
  const [derating, setDerating] = useState(DEFAULT_DERATING)
  // How the timing is entered. "interval" is the wake period the way people
  // think about it ("wake every 3 s"); sleep time is then whatever is left.
  const [timeMode, setTimeMode] = useState<'interval' | 'sleep'>('interval')

  const period = activeTime + sleepTime

  // In interval mode the wake period is held constant, so changing the active
  // time steals from or gives back to sleep rather than stretching the cycle.
  const setActive = (nextActive: number) => {
    if (timeMode === 'interval') setSleepTime(Math.max(0, period - nextActive))
    setActiveTime(nextActive)
  }
  const setInterval = (nextPeriod: number) => setSleepTime(Math.max(0, nextPeriod - activeTime))
  const setTime = (v: number) => (timeMode === 'interval' ? setInterval(v) : setSleepTime(v))
  const timeValue = timeMode === 'interval' ? period : sleepTime

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

  const neverSleeps = sleepTime <= 0

  return (
    <SimPage
      id="deep-sleep"
      lede="deep-sleep.lede"
      controls={
        <>
          <Group label="deep-sleep.awake">
            <Param label="common.activeCurrent" unit="A" value={activeCurrent} onChange={setActiveCurrent} min={1e-3} max={1} />
            <Param label="common.activeTime" unit="s" value={activeTime} onChange={setActive} min={0.01} max={600} />
          </Group>
          <Group label="deep-sleep.asleep">
            <Param label="common.sleepCurrent" unit="A" value={sleepCurrent} onChange={setSleepCurrent} min={1e-7} max={1e-2} />
            <Segmented
              label="deep-sleep.timingBasis"
              value={timeMode}
              onChange={setTimeMode}
              options={[
                { value: 'interval', label: 'deep-sleep.wakeInterval' },
                { value: 'sleep', label: 'deep-sleep.sleepDuration' },
              ]}
            />
            <Param
              label={timeMode === 'interval' ? 'deep-sleep.wakeInterval' : 'common.sleepTime'}
              unit="s"
              value={timeValue}
              onChange={setTime}
              min={1}
              max={86400}
            />
            <div className="seg wrap" role="group" aria-label={t('deep-sleep.quickPick')}>
              {PRESETS.map((s) => (
                <button
                  key={s}
                  className={Math.abs(timeValue - s) < 1e-6 ? 'on' : ''}
                  onClick={() => setTime(s)}
                >
                  {humanTime(s)}
                </button>
              ))}
            </div>
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
          { label: 'deep-sleep.cyclePeriod', value: humanTime(r.period) },
          {
            label: 'deep-sleep.wakesPerDay',
            value: r.wakesPerDay >= 10 ? Math.round(r.wakesPerDay).toLocaleString() : r.wakesPerDay.toFixed(2),
          },
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

      <Warning when={neverSleeps}
        text="deep-sleep.warn3"
        vars={{ activeTime: humanTime(activeTime) }}
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
