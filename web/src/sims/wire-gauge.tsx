import { useMemo, useState } from 'react'
import { VCC_5V } from '../engine/constants'
import { analyseWire } from '../engine/conductor'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Toggle } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

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
      lede="Pick a wire gauge and see what it actually costs you: resistance, voltage lost on the way to the load, and heat. The default counts both conductors, which is the half that people usually forget."
      controls={
        <>
          <Group label="Wire">
            <Param label="Gauge" unit="AWG" value={awg} onChange={(v) => setAwg(Math.round(v))} min={0} max={40} log={false} step={1} />
            <Param label="Run length" unit="m" value={length} onChange={setLength} min={0.01} max={200} />
            <Toggle label="Count return conductor" value={roundTrip} onChange={setRoundTrip} />
          </Group>
          <Group label="Load">
            <Param label="Current" unit="A" value={current} onChange={setCurrent} min={0.001} max={200} />
            <Param label="Supply" unit="V" value={supply} onChange={setSupply} min={1} max={400} />
            <Param label="Conductor temp" unit="°C" value={tempC} onChange={setTempC} min={-20} max={150} log={false} step={5} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'Diameter', value: `${(r.diameter * 1000).toFixed(3)} mm` },
          { label: 'Cross-section', value: `${(r.area * 1e6).toFixed(4)} mm²` },
          { label: 'Resistance per metre', value: formatSI(r.ohmsPerMetre, 'Ω/m') },
          {
            label: roundTrip ? 'Loop resistance' : 'Run resistance',
            value: formatSI(r.loopResistance, 'Ω'),
          },
          {
            label: 'Voltage drop',
            value: formatSI(r.vDrop, 'V'),
            note: <T k="{dropFraction}% of supply" vars={{ dropFraction: (r.dropFraction * 100).toFixed(2) }} />,
            warn: r.excessiveDrop,
          },
          { label: 'Voltage at load', value: formatSI(r.vLoad, 'V') },
          { label: 'Power lost as heat', value: formatSI(r.lossW, 'W') },
          { label: 'Current density', value: `${r.currentDensity.toFixed(2)} A/mm²` },
          {
            label: 'Ampacity, bundled',
            value: formatSI(r.ampacityBundled, 'A'),
            warn: r.overAmpacity,
          },
          { label: 'Ampacity, chassis', value: formatSI(r.ampacityChassis, 'A'), note: 'free air, single run' },
        ]}
      />

      {r.overAmpacity && (
        <Warning
          text="{current} through {awg} AWG exceeds the bundled-wiring guidance of {ampacityBundled}. In free air on its own it may be acceptable, but inside a loom or a conduit the heat has nowhere to go. Drop three gauges to double the copper."
          vars={{
            current: formatSI(current, 'A'),
            awg,
            ampacityBundled: formatSI(r.ampacityBundled, 'A'),
          }}
        />
      )}
      {r.excessiveDrop && (
        <Warning
          text="Losing {vDrop}, which is {dropFraction}% of the supply. Above about 3% most loads misbehave: regulators drop out, motors lose torque, and LED strips visibly dim toward the far end."
          vars={{
            vDrop: formatSI(r.vDrop, 'V'),
            dropFraction: (r.dropFraction * 100).toFixed(1),
          }}
        />
      )}

      <Theory
        text={[
          "The AWG series is geometric: `d = 0.127 mm · 92^((36-n)/39)`. That ratio is chosen so six gauge steps is almost exactly a factor of four in area, three steps is a factor of two, and ten steps is a factor of ten. Handy for mental arithmetic: going from 22 AWG to 12 AWG gives ten times the copper.",
          "Resistance is `R = rho·L/A` with copper at 1.68e-8 Ω·m. The drop is `V = I·R` over *both* conductors, since the current has to come back. Halving that by only counting one leg is the single most common error in cable sizing.",
          "Copper gains about 0.39% resistance per kelvin, so a wire that is already running warm gets worse: more resistance means more loss means more heat. That feedback is weak enough to be stable in copper, but it is why ampacity figures assume a temperature rise and why bundling wires derates them so heavily.",
          "Ampacity here is rule-of-thumb guidance, roughly 7.5 A/mm² for a single chassis run in free air and 3.5 A/mm² bundled. Real installations are governed by wiring regulations that account for insulation rating, grouping and ambient temperature. Use this to choose a starting point, not to certify an installation.",
        ]}
      />
    </SimPage>
  )
}
