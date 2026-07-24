import { useMemo, useState } from 'react'
import { J_PER_KWH, analyse } from '../engine/heatPump'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** A typical UK house heating season, used as the default seasonal demand. */
const DEFAULT_SEASON_KWH = 8000

export default function HeatPump() {
  const [flowC, setFlowC] = useState(45)
  const [outdoorC, setOutdoorC] = useState(7)
  const [eta, setEta] = useState(0.5)
  const [electricalW, setElectricalW] = useState(1000)
  const [tariff, setTariff] = useState(0.25)
  const [designOutdoorC, setDesignOutdoorC] = useState(-3)
  const [seasonKwh, setSeasonKwh] = useState(DEFAULT_SEASON_KWH)

  const r = useMemo(
    () =>
      analyse({
        flowC,
        outdoorC,
        eta,
        electricalW,
        tariffPerKwh: tariff,
        designOutdoorC,
        seasonalHeatJ: seasonKwh * J_PER_KWH,
      }),
    [flowC, outdoorC, eta, electricalW, tariff, designOutdoorC, seasonKwh],
  )

  const money = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : 'n/a')

  return (
    <SimPage
      id="heat-pump"
      lede="heat-pump.lede"
      controls={
        <>
          <Group label="heat-pump.temperatures">
            <Param label="heat-pump.flowHotSide" unit="°C" value={flowC} onChange={setFlowC} min={20} max={80} log={false} step={1} />
            <Param label="heat-pump.outdoorColdSide" unit="°C" value={outdoorC} onChange={setOutdoorC} min={-25} max={25} log={false} step={1} />
            <Param label="heat-pump.designOutdoor" unit="°C" value={designOutdoorC} onChange={setDesignOutdoorC} min={-25} max={10} log={false} step={1} />
          </Group>

          <Group label="heat-pump.machine">
            <Param label="heat-pump.secondLawEfficiency" value={eta} onChange={setEta} min={0.2} max={0.8} log={false} step={0.01} />
            <Param label="heat-pump.electricalInput" unit="W" value={electricalW} onChange={setElectricalW} min={100} max={20000} />
          </Group>

          <Group label="heat-pump.runningCost">
            <Param label="heat-pump.tariffPerKwh" value={tariff} onChange={setTariff} min={0.01} max={1} log={false} step={0.01} />
            <Param label="heat-pump.seasonHeatDemand" unit="kWh" value={seasonKwh} onChange={setSeasonKwh} min={500} max={40000} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'heat-pump.temperatureLift', value: `${r.liftK.toFixed(1)} K` },
          { label: 'heat-pump.carnotCeiling', value: r.carnot.toFixed(2), note: 'heat-pump.thThTc' },
          { label: 'heat-pump.realCop', value: r.cop.toFixed(2), note: <T k="heat-pump.ofCarnot" vars={{ eta: (eta * 100).toFixed(0) }} /> },
          { label: 'heat-pump.heatDelivered', value: formatSI(r.heatW, 'W') },
          { label: 'heat-pump.liftedFromOutside', value: formatSI(r.absorbedW, 'W'), note: 'heat-pump.theFreePart' },
          { label: 'heat-pump.costPerKwhHeat', value: money(r.heatCostPerKwh) },
          { label: 'heat-pump.resistiveEquivalent', value: money(r.resistiveCostPerKwh), note: 'heat-pump.theTariffItself' },
          { label: 'heat-pump.savingAtThisPoint', value: `${(r.savingFraction * 100).toFixed(0)}%` },
          { label: 'heat-pump.seasonalCop', value: r.scop.toFixed(2) },
          { label: 'heat-pump.seasonalElectricity', value: `${(r.seasonalElectricityJ / J_PER_KWH).toFixed(0)} kWh` },
          { label: 'heat-pump.seasonalCost', value: money(r.seasonalCost) },
          { label: 'heat-pump.resistiveSeason', value: money(r.resistiveSeasonalCost) },
          { label: 'heat-pump.seasonalSaving', value: money(r.seasonalSaving), note: `${(r.seasonalSavingFraction * 100).toFixed(0)}%` },
          { label: 'heat-pump.runtimeToCoverSeason', value: `${(r.runtimeS / 3600).toFixed(0)} h` },
        ]}
      />

      {r.noLift && (
        <Warning
          text="heat-pump.warn1"
        />
      )}
      {r.liftK > 55 && !r.noLift && (
        <Warning
          text="heat-pump.warn2"
        />
      )}

      <Theory
        text={[
          'heat-pump.theory1',
          'heat-pump.realMachinesReachA',
          'heat-pump.aCopOf3',
        ]}
      />
    </SimPage>
  )
}
