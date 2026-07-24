import { useMemo, useState } from 'react'
import { analyseDeepSleep, analyseSolar } from '../engine/powerBudget'
import { formatSI } from '../engine/units'
import { Group } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

export default function SolarSizing() {
  const [activeCurrent, setActiveCurrent] = useState(0.08)
  const [activeTime, setActiveTime] = useState(3)
  const [sleepCurrent, setSleepCurrent] = useState(10e-6)
  const [sleepTime, setSleepTime] = useState(600)
  const [packVoltage, setPackVoltage] = useState(3.7)
  const [peakSunHours, setPeakSunHours] = useState(3)
  const [efficiency, setEfficiency] = useState(0.7)
  const [autonomyDays, setAutonomyDays] = useState(5)
  const [dod, setDod] = useState(0.5)
  const [panelW, setPanelW] = useState(2)

  const { load, solar } = useMemo(() => {
    const load = analyseDeepSleep(
      { activeCurrent, activeTime, sleepCurrent, sleepTime },
      1,
      packVoltage,
    )
    const solar = analyseSolar(
      load.whPerDay,
      peakSunHours,
      efficiency,
      autonomyDays,
      dod,
      packVoltage,
      panelW,
    )
    return { load, solar }
  }, [
    activeCurrent, activeTime, sleepCurrent, sleepTime, packVoltage,
    peakSunHours, efficiency, autonomyDays, dod, panelW,
  ])

  return (
    <SimPage
      id="solar-sizing"
      lede="Size a panel and battery for a solar powered node. The load comes from the same duty-cycle arithmetic as the deep sleep page, then the panel has to replace it on an average day and the battery has to carry the node through the bad ones."
      controls={
        <>
          <Group label="Load profile">
            <Param label="Active current" unit="A" value={activeCurrent} onChange={setActiveCurrent} min={1e-3} max={1} />
            <Param label="Active time" unit="s" value={activeTime} onChange={setActiveTime} min={0.01} max={600} />
            <Param label="Sleep current" unit="A" value={sleepCurrent} onChange={setSleepCurrent} min={1e-7} max={1e-2} />
            <Param label="Sleep time" unit="s" value={sleepTime} onChange={setSleepTime} min={1} max={86400} />
            <Param label="Pack voltage" unit="V" value={packVoltage} onChange={setPackVoltage} min={1} max={24} log={false} step={0.1} />
          </Group>
          <Group label="Site and system">
            <Param label="Peak sun hours" unit="h" value={peakSunHours} onChange={setPeakSunHours} min={0.5} max={8} log={false} step={0.1} />
            <Param label="System efficiency" value={efficiency} onChange={setEfficiency} min={0.3} max={0.95} log={false} step={0.05} />
            <Param label="Panel rating" unit="W" value={panelW} onChange={setPanelW} min={0.1} max={200} />
          </Group>
          <Group label="Battery">
            <Param label="Autonomy" unit="days" value={autonomyDays} onChange={(v) => setAutonomyDays(Math.round(v))} min={1} max={30} log={false} step={1} />
            <Param label="Depth of discharge" value={dod} onChange={setDod} min={0.2} max={1} log={false} step={0.05} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'Average current', value: formatSI(load.averageCurrent, 'A') },
          { label: 'Daily consumption', value: `${load.whPerDay.toFixed(3)} Wh` },
          { label: 'Panel needed', value: `${solar.panelW.toFixed(2)} W`, note: 'to break even' },
          { label: 'Panel fitted', value: `${panelW.toFixed(2)} W`, warn: solar.deficit },
          { label: 'Harvest per day', value: `${solar.harvestWh.toFixed(2)} Wh` },
          {
            label: 'Daily surplus',
            value: `${solar.surplusWh.toFixed(2)} Wh`,
            warn: solar.deficit,
          },
          { label: 'Battery needed', value: `${solar.batteryAh.toFixed(2)} Ah`, note: `${autonomyDays} days at ${(dod * 100).toFixed(0)}% DoD` },
          { label: 'Recharge time', value: `${solar.rechargeHours.toFixed(2)} h`, note: 'of full sun per day used' },
          {
            label: 'Days to refill',
            value: Number.isFinite(solar.daysToRecharge) ? solar.daysToRecharge.toFixed(1) : 'never',
            warn: !Number.isFinite(solar.daysToRecharge),
          },
        ]}
      />

      {solar.deficit && (
        <Warning>
          The panel harvests {solar.harvestWh.toFixed(2)} Wh against a{' '}
          {load.whPerDay.toFixed(2)} Wh load, so the battery only ever drains and the node dies
          once it is empty. You need at least {solar.panelW.toFixed(2)} W just to break even,
          and realistically two to three times that so it can also recover from cloudy spells.
        </Warning>
      )}
      {!solar.deficit && solar.daysToRecharge > autonomyDays && (
        <Warning>
          The surplus is positive but thin: refilling an empty battery takes{' '}
          {solar.daysToRecharge.toFixed(1)} days, longer than the {autonomyDays} days of
          autonomy it provides. After one bad week the node may never catch up. Oversize the
          panel rather than the battery.
        </Warning>
      )}
      {peakSunHours > 4 && (
        <Warning>
          Over 4 peak sun hours is a summer or low-latitude figure. Size on the worst month you
          expect to operate in, not the average: in northern Europe December can be under one
          peak sun hour, a factor of five below midsummer.
        </Warning>
      )}

      <Theory>
        <p>
          Peak sun hours folds a whole day's irradiance curve into an equivalent number of
          hours at the panel's full 1000 W/m² rating. So daily harvest is simply{' '}
          <code>W · PSH · efficiency</code>, and the panel you need is{' '}
          <code>Wh_day / (PSH · efficiency)</code>.
        </p>
        <p>
          The efficiency term is not the cell efficiency, which is already in the watt rating.
          It covers the charge controller, wiring, temperature derating (panels lose about
          0.4% per kelvin above 25 °C), dust and imperfect angle. Seventy percent is a
          reasonable planning figure for a small fixed installation.
        </p>
        <p>
          Battery sizing is the opposite question: not the average day but the worst run of
          bad ones. <code>Cbat = Wh_day · days / DoD</code>. Depth of discharge matters
          enormously for cycle life: taking a lithium cell to 50% rather than 90% can multiply
          its usable cycles several times over, so the bigger battery often outlives the saving.
        </p>
        <p>
          The failure mode worth avoiding is a system that breaks even on paper. It has no
          margin to refill the battery after a cloudy week, so it drifts down to empty and stays
          there. Oversizing the panel is much cheaper than oversizing the battery.
        </p>
      </Theory>
    </SimPage>
  )
}
