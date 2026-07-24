import { useMemo, useState } from 'react'
import { VCC_5V } from '../engine/constants'
import { analyseStrip } from '../engine/powerBudget'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

export default function Ws2812Power() {
  const [ledCount, setLedCount] = useState(150)
  const [brightness, setBrightness] = useState(1)
  const [channels, setChannels] = useState<'1' | '2' | '3'>('3')
  const [ledsPerMetre, setLedsPerMetre] = useState(60)
  const [awg, setAwg] = useState(20)

  const r = useMemo(
    () => analyseStrip(ledCount, brightness, Number(channels), ledsPerMetre, awg, VCC_5V),
    [ledCount, brightness, channels, ledsPerMetre, awg],
  )

  const length = ledsPerMetre > 0 ? ledCount / ledsPerMetre : 0

  return (
    <SimPage
      id="ws2812-power"
      lede="ws2812-power.lede"
      controls={
        <>
          <Group label="ws2812-power.strip">
            <Param label="ws2812-power.ledCount" value={ledCount} onChange={(v) => setLedCount(Math.round(v))} min={1} max={2000} />
            <Param label="ws2812-power.ledsPerMetre" value={ledsPerMetre} onChange={(v) => setLedsPerMetre(Math.round(v))} min={30} max={144} log={false} step={1} />
          </Group>
          <Group label="ws2812-power.content">
            <Param label="ws2812-power.brightness" value={brightness} onChange={setBrightness} min={0.01} max={1} log={false} step={0.01} />
            <Segmented
              label="ws2812-power.channelsLit"
              value={channels}
              onChange={setChannels}
              options={[
                { value: '1', label: 'ws2812-power.single' },
                { value: '2', label: 'ws2812-power.two' },
                { value: '3', label: 'common.white' },
              ]}
            />
          </Group>
          <Group label="ws2812-power.supplyWiring">
            <Param label="ws2812-power.feedWireGauge" unit="AWG" value={awg} onChange={(v) => setAwg(Math.round(v))} min={10} max={30} log={false} step={1} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'common.peakCurrent', value: formatSI(r.peakCurrent, 'A'), note: 'ws2812-power.allWhiteFullBrightness' },
          { label: 'ws2812-power.currentNow', value: formatSI(r.actualCurrent, 'A') },
          { label: 'ws2812-power.peakPower', value: formatSI(r.peakPower, 'W') },
          { label: 'ws2812-power.powerNow', value: formatSI(r.actualPower, 'W') },
          { label: 'ws2812-power.recommendedSupply', value: formatSI(r.recommendedSupplyA, 'A'), note: 'ws2812-power.25Headroom' },
          { label: 'ws2812-power.stripLength', value: `${length.toFixed(2)} m` },
          { label: 'ws2812-power.feedResistance', value: formatSI(r.feedResistance, 'Ω'), note: 'ws2812-power.bothConductors' },
          { label: 'ws2812-power.dropAtFarEnd', value: formatSI(r.endDrop, 'V'), warn: r.browningOut },
          { label: 'ws2812-power.voltageAtFarEnd', value: formatSI(r.endVoltage, 'V'), warn: r.browningOut },
          {
            label: 'ws2812-power.injectionPoints',
            value: `${r.injectionPoints}`,
            note: r.injectionPoints > 1 ? 'ws2812-power.feedPowerAtIntervals' : 'ws2812-power.singleFeedIsFine',
            warn: r.injectionPoints > 1,
          },
        ]}
      />

      {r.browningOut && (
        <Warning
          text="ws2812-power.warn1"
          vars={{ endVoltage: formatSI(r.endVoltage, 'V'), injectionPoints: r.injectionPoints }}
        />
      )}
      <Warning
        text="ws2812-power.warn2"
      />

      <Theory
        text={[
          'ws2812-power.theory1',
          'ws2812-power.atFullWhiteLeds',
          'ws2812-power.theSubtlerProblemIs',
          'ws2812-power.sizeTheSupplyFor',
        ]} vars={{ ledCount, peakCurrent: formatSI(r.peakCurrent, 'A') }}
      />
    </SimPage>
  )
}
