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
      lede="Addressable strips draw far more than people expect and the far end browns out long before the supply gives up. WS2812s are 5 V parts, which also puts their data line at odds with a 3.3 V ESP32."
      controls={
        <>
          <Group label="Strip">
            <Param label="LED count" value={ledCount} onChange={(v) => setLedCount(Math.round(v))} min={1} max={2000} />
            <Param label="LEDs per metre" value={ledsPerMetre} onChange={(v) => setLedsPerMetre(Math.round(v))} min={30} max={144} log={false} step={1} />
          </Group>
          <Group label="Content">
            <Param label="Brightness" value={brightness} onChange={setBrightness} min={0.01} max={1} log={false} step={0.01} />
            <Segmented
              label="Channels lit"
              value={channels}
              onChange={setChannels}
              options={[
                { value: '1', label: 'Single' },
                { value: '2', label: 'Two' },
                { value: '3', label: 'White' },
              ]}
            />
          </Group>
          <Group label="Supply wiring">
            <Param label="Feed wire gauge" unit="AWG" value={awg} onChange={(v) => setAwg(Math.round(v))} min={10} max={30} log={false} step={1} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'Peak current', value: formatSI(r.peakCurrent, 'A'), note: 'all white, full brightness' },
          { label: 'Current now', value: formatSI(r.actualCurrent, 'A') },
          { label: 'Peak power', value: formatSI(r.peakPower, 'W') },
          { label: 'Power now', value: formatSI(r.actualPower, 'W') },
          { label: 'Recommended supply', value: formatSI(r.recommendedSupplyA, 'A'), note: '25% headroom' },
          { label: 'Strip length', value: `${length.toFixed(2)} m` },
          { label: 'Feed resistance', value: formatSI(r.feedResistance, 'Ω'), note: 'both conductors' },
          { label: 'Drop at far end', value: formatSI(r.endDrop, 'V'), warn: r.browningOut },
          { label: 'Voltage at far end', value: formatSI(r.endVoltage, 'V'), warn: r.browningOut },
          {
            label: 'Injection points',
            value: `${r.injectionPoints}`,
            note: r.injectionPoints > 1 ? 'feed power at intervals' : 'single feed is fine',
            warn: r.injectionPoints > 1,
          },
        ]}
      />

      {r.browningOut && (
        <Warning
          text="The far end sees only {endVoltage}. WS2812s dim and shift colour as the supply sags, typically toward red because the blue die has the highest forward voltage and starves first. Inject power at {injectionPoints} points along the run, or use heavier feed wire."
          vars={{ endVoltage: formatSI(r.endVoltage, 'V'), injectionPoints: r.injectionPoints }}
        />
      )}
      <Warning
        text="WS2812 is a 5 V part and its data input wants at least 0.7·VDD, i.e. about 3.5 V. A 3.3 V ESP32 pin is marginally below that. It often works, and then stops working when the strip warms up or the wire gets longer. Use a level shifter, or power the first LED from 3.9 V through a diode so its logic threshold drops to meet the ESP32."
      />

      <Theory
        text={[
          "Each WS2812 contains three LEDs at roughly 20 mA per channel, so a fully lit white pixel draws about 60 mA. The controller inside also draws about 1 mA even when the LED is dark, which is easy to forget on a long strip: 300 pixels idle still costs around 300 mA.",
          "At full white, {ledCount} LEDs need {peakCurrent}. This is why a 5 metre 60/m strip is a genuinely serious load, around 18 A, and why almost nobody actually runs one at full white. Brightness scales the current linearly, so a strip limited to 25% is a far more practical proposition.",
          "The subtler problem is the copper. Current enters at one end and is consumed along the way, so the conductor carries the full load at the start and nothing at the end. The average is about half, so the end-to-end drop is roughly `I·R/2` rather than `I·R`. It still adds up fast on the thin traces built into the strip itself, which is why long runs need power injected at intervals rather than just fatter feed wire.",
          "Size the supply for the peak you could command, not the average you intend. Software that accidentally sets every pixel white will pull the full current, and a supply sized for the artistic intent will either shut down or sag until the data signal fails.",
        ]} vars={{ ledCount, peakCurrent: formatSI(r.peakCurrent, 'A') }}
      />
    </SimPage>
  )
}
