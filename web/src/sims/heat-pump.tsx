import { useMemo, useState } from 'react'
import { J_PER_KWH, analyse } from '../engine/heatPump'
import { formatSI } from '../engine/units'
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
      lede="A heat pump moves heat rather than making it, so it can deliver several kilowatts of heat per kilowatt of electricity. The ceiling is Carnot, set purely by the temperature lift."
      controls={
        <>
          <Group label="Temperatures">
            <Param label="Flow (hot side)" unit="°C" value={flowC} onChange={setFlowC} min={20} max={80} log={false} step={1} />
            <Param label="Outdoor (cold side)" unit="°C" value={outdoorC} onChange={setOutdoorC} min={-25} max={25} log={false} step={1} />
            <Param label="Design outdoor" unit="°C" value={designOutdoorC} onChange={setDesignOutdoorC} min={-25} max={10} log={false} step={1} />
          </Group>

          <Group label="Machine">
            <Param label="Second-law efficiency" value={eta} onChange={setEta} min={0.2} max={0.8} log={false} step={0.01} />
            <Param label="Electrical input" unit="W" value={electricalW} onChange={setElectricalW} min={100} max={20000} />
          </Group>

          <Group label="Running cost">
            <Param label="Tariff per kWh" value={tariff} onChange={setTariff} min={0.01} max={1} log={false} step={0.01} />
            <Param label="Season heat demand" unit="kWh" value={seasonKwh} onChange={setSeasonKwh} min={500} max={40000} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'Temperature lift', value: `${r.liftK.toFixed(1)} K` },
          { label: 'Carnot ceiling', value: r.carnot.toFixed(2), note: 'Th/(Th-Tc)' },
          { label: 'Real COP', value: r.cop.toFixed(2), note: `${(eta * 100).toFixed(0)}% of Carnot` },
          { label: 'Heat delivered', value: formatSI(r.heatW, 'W') },
          { label: 'Lifted from outside', value: formatSI(r.absorbedW, 'W'), note: 'the free part' },
          { label: 'Cost per kWh heat', value: money(r.heatCostPerKwh) },
          { label: 'Resistive equivalent', value: money(r.resistiveCostPerKwh), note: 'the tariff itself' },
          { label: 'Saving at this point', value: `${(r.savingFraction * 100).toFixed(0)}%` },
          { label: 'Seasonal COP', value: r.scop.toFixed(2) },
          { label: 'Seasonal electricity', value: `${(r.seasonalElectricityJ / J_PER_KWH).toFixed(0)} kWh` },
          { label: 'Seasonal cost', value: money(r.seasonalCost) },
          { label: 'Resistive season', value: money(r.resistiveSeasonalCost) },
          { label: 'Seasonal saving', value: money(r.seasonalSaving), note: `${(r.seasonalSavingFraction * 100).toFixed(0)}%` },
          { label: 'Runtime to cover season', value: `${(r.runtimeS / 3600).toFixed(0)} h` },
        ]}
      />

      {r.noLift && (
        <Warning>
          The cold side is at or above the hot side, so there is no lift to perform and the
          COP is undefined. Raise the flow temperature or lower the outdoor temperature.
        </Warning>
      )}
      {r.liftK > 55 && !r.noLift && (
        <Warning>
          A lift over about 55 K is outside what most domestic refrigerants manage. Real
          machines cut out or fall back to a resistive heater here, so treat this COP as
          optimistic.
        </Warning>
      )}

      <Theory>
        <p>
          The Carnot ceiling for heating is <code>COP = Th / (Th - Tc)</code>, with both
          temperatures in kelvin. Only the difference matters, which is why a heat pump
          feeding underfloor pipes at 35 °C thrashes one feeding radiators at 65 °C: the
          lift is smaller, so the ceiling is higher.
        </p>
        <p>
          Real machines reach a fraction of Carnot, here the second-law efficiency, typically
          0.4 to 0.6 for domestic units. So <code>COP = eta · Th/(Th - Tc)</code> and the heat
          delivered is <code>Qh = COP · W</code>.
        </p>
        <p>
          A COP of 3 means a kWh of heat costs a third of the tariff, so the saving against a
          resistive heater is <code>1 - 1/COP</code>. That is the number that decides whether
          the machine pays back, and it collapses on the coldest days precisely when demand
          peaks, which is why the seasonal figure matters more than the headline one.
        </p>
      </Theory>
    </SimPage>
  )
}
