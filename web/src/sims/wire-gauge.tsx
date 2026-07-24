import { useMemo, useState } from 'react'
import { VCC_5V } from '../engine/constants'
import { analyseWire } from '../engine/conductor'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Param, ReadoutGrid, SimPage, Theory, Toggle, Warning } from '../ui'

export default function WireGauge() {
  const [awg, setAwg] = useState(22)
  const [length, setLength] = useState(2)
  const [current, setCurrent] = useState(1)
  // A wire run is usually carrying a supply rail, not logic, so 5 V is the more
  // representative default here than the 3.3 V logic rail.
  const [supply, setSupply] = useState(VCC_5V)
  const [tempC, setTempC] = useState(20)
  const [roundTrip, setRoundTrip] = useState(true)

  const r = useMemo(
    () => analyseWire(awg, length, current, supply, tempC, roundTrip),
    [awg, length, current, supply, tempC, roundTrip],
  )

  return (
    <SimPage
      id="wire-gauge"
      lede="wire-gauge.lede"
      controls={
        <>
          <Group label="wire-gauge.wire">
            <Param label="common.gauge" unit="AWG" value={awg} onChange={setAwg} int min={0} max={40} log={false} step={1} />
            <Param label="wire-gauge.runLength" unit="m" value={length} onChange={setLength} min={0.01} max={200} />
            <Toggle label="wire-gauge.countReturnConductor" value={roundTrip} onChange={setRoundTrip} />
          </Group>
          <Group label="common.load">
            <Param label="common.current" unit="A" value={current} onChange={setCurrent} min={0.001} max={200} />
            <Param label="common.supply" unit="V" value={supply} onChange={setSupply} min={1} max={400} />
            <Param label="wire-gauge.conductorTemp" unit="°C" value={tempC} onChange={setTempC} min={-20} max={150} log={false} step={5} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'common.diameter', value: `${(r.diameter * 1000).toFixed(3)} mm` },
          { label: 'common.crossSection', value: `${(r.area * 1e6).toFixed(4)} mm²` },
          { label: 'wire-gauge.resistancePerMetre', value: formatSI(r.ohmsPerMetre, 'Ω/m') },
          {
            label: roundTrip ? 'wire-gauge.loopResistance' : 'wire-gauge.runResistance',
            value: formatSI(r.loopResistance, 'Ω'),
          },
          {
            label: 'common.voltageDrop',
            value: formatSI(r.vDrop, 'V'),
            note: <T k="wire-gauge.ofSupply" vars={{ dropFraction: (r.dropFraction * 100).toFixed(2) }} />,
            warn: r.excessiveDrop,
          },
          { label: 'wire-gauge.voltageAtLoad', value: formatSI(r.vLoad, 'V') },
          { label: 'wire-gauge.powerLostAsHeat', value: formatSI(r.lossW, 'W') },
          { label: 'common.currentDensity', value: `${r.currentDensity.toFixed(2)} A/mm²` },
          {
            label: 'wire-gauge.ampacityBundled',
            value: formatSI(r.ampacityBundled, 'A'),
            warn: r.overAmpacity,
          },
          { label: 'wire-gauge.ampacityChassis', value: formatSI(r.ampacityChassis, 'A'), note: 'wire-gauge.freeAirSingleRun' },
        ]}
      />

      <Warning when={r.overAmpacity}
        text="wire-gauge.warn1"
        vars={{
          current: formatSI(current, 'A'),
          awg,
          ampacityBundled: formatSI(r.ampacityBundled, 'A'),
        }}
      />
      <Warning when={r.excessiveDrop}
        text="wire-gauge.warn2"
        vars={{
          vDrop: formatSI(r.vDrop, 'V'),
          dropFraction: (r.dropFraction * 100).toFixed(1),
        }}
      />

      <Theory
        text={[
          'wire-gauge.theory1',
          'wire-gauge.resistanceIsRRho',
          'wire-gauge.copperGainsAbout0',
          'wire-gauge.ampacityHereIsRule',
        ]}
      />
    </SimPage>
  )
}
