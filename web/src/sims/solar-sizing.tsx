import { useMemo, useState } from 'react'
import { analyseDeepSleep, analyseSolar } from '../engine/powerBudget'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
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
      lede="solar-sizing.lede"
      controls={
        <>
          <Group label="solar-sizing.loadProfile">
            <Param label="common.activeCurrent" unit="A" value={activeCurrent} onChange={setActiveCurrent} min={1e-3} max={1} />
            <Param label="common.activeTime" unit="s" value={activeTime} onChange={setActiveTime} min={0.01} max={600} />
            <Param label="common.sleepCurrent" unit="A" value={sleepCurrent} onChange={setSleepCurrent} min={1e-7} max={1e-2} />
            <Param label="common.sleepTime" unit="s" value={sleepTime} onChange={setSleepTime} min={1} max={86400} />
            <Param label="common.packVoltage" unit="V" value={packVoltage} onChange={setPackVoltage} min={1} max={24} log={false} step={0.1} />
          </Group>
          <Group label="solar-sizing.siteAndSystem">
            <Param label="solar-sizing.peakSunHours" unit="h" value={peakSunHours} onChange={setPeakSunHours} min={0.5} max={8} log={false} step={0.1} />
            <Param label="solar-sizing.systemEfficiency" value={efficiency} onChange={setEfficiency} min={0.3} max={0.95} log={false} step={0.05} />
            <Param label="solar-sizing.panelRating" unit="W" value={panelW} onChange={setPanelW} min={0.1} max={200} />
          </Group>
          <Group label="common.battery">
            <Param label="solar-sizing.autonomy" unit="days" value={autonomyDays} onChange={(v) => setAutonomyDays(Math.round(v))} min={1} max={30} log={false} step={1} />
            <Param label="solar-sizing.depthOfDischarge" value={dod} onChange={setDod} min={0.2} max={1} log={false} step={0.05} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'common.averageCurrent', value: formatSI(load.averageCurrent, 'A') },
          { label: 'solar-sizing.dailyConsumption', value: `${load.whPerDay.toFixed(3)} Wh` },
          { label: 'solar-sizing.panelNeeded', value: `${solar.panelW.toFixed(2)} W`, note: 'solar-sizing.toBreakEven' },
          { label: 'solar-sizing.panelFitted', value: `${panelW.toFixed(2)} W`, warn: solar.deficit },
          { label: 'solar-sizing.harvestPerDay', value: `${solar.harvestWh.toFixed(2)} Wh` },
          {
            label: 'solar-sizing.dailySurplus',
            value: `${solar.surplusWh.toFixed(2)} Wh`,
            warn: solar.deficit,
          },
          { label: 'solar-sizing.batteryNeeded', value: `${solar.batteryAh.toFixed(2)} Ah`, note: <T k="solar-sizing.daysAtDod" vars={{ autonomyDays, dod: (dod * 100).toFixed(0) }} /> },
          { label: 'solar-sizing.rechargeTime', value: `${solar.rechargeHours.toFixed(2)} h`, note: 'solar-sizing.ofFullSunPer' },
          {
            label: 'solar-sizing.daysToRefill',
            value: Number.isFinite(solar.daysToRecharge) ? solar.daysToRecharge.toFixed(1) : 'common.never',
            warn: !Number.isFinite(solar.daysToRecharge),
          },
        ]}
      />

      {solar.deficit && (
        <Warning
          text="solar-sizing.warn1"
          vars={{
            harvestWh: solar.harvestWh.toFixed(2),
            whPerDay: load.whPerDay.toFixed(2),
            panelW: solar.panelW.toFixed(2),
          }}
        />
      )}
      {!solar.deficit && solar.daysToRecharge > autonomyDays && (
        <Warning
          text="solar-sizing.warn2"
          vars={{ daysToRecharge: solar.daysToRecharge.toFixed(1), autonomyDays }}
        />
      )}
      {peakSunHours > 4 && (
        <Warning
          text="solar-sizing.warn3"
        />
      )}

      <Theory
        text={[
          'solar-sizing.theory1',
          'solar-sizing.theEfficiencyTermIs',
          'solar-sizing.batterySizingIsThe',
          'solar-sizing.theFailureModeWorth',
        ]}
      />
    </SimPage>
  )
}
