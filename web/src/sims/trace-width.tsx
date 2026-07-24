import { useMemo, useState } from 'react'
import { FAB_MIN_WIDTH, analyseTrace } from '../engine/conductor'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Segmented } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

export default function TraceWidth() {
  const [current, setCurrent] = useState(1)
  const [riseK, setRiseK] = useState(10)
  const [layer, setLayer] = useState<'external' | 'internal'>('external')
  const [ozCopper, setOzCopper] = useState(1)
  const [length, setLength] = useState(0.05)
  const [tempC, setTempC] = useState(20)

  const external = layer === 'external'
  const r = useMemo(
    () => analyseTrace(current, riseK, external, ozCopper, length, tempC),
    [current, riseK, external, ozCopper, length, tempC],
  )

  return (
    <SimPage
      id="trace-width"
      lede="trace-width.lede"
      controls={
        <>
          <Group label="trace-width.requirement">
            <Param label="common.current" unit="A" value={current} onChange={setCurrent} min={0.01} max={50} />
            <Param label="trace-width.allowedTempRise" unit="K" value={riseK} onChange={setRiseK} min={1} max={100} log={false} step={1} />
            <Segmented
              label="trace-width.layer"
              value={layer}
              onChange={setLayer}
              options={[
                { value: 'external', label: 'trace-width.external' },
                { value: 'internal', label: 'trace-width.internal' },
              ]}
            />
          </Group>
          <Group label="trace-width.stackupAndGeometry">
            <Param label="trace-width.copperWeight" unit="oz" value={ozCopper} onChange={setOzCopper} min={0.5} max={6} log={false} step={0.5} />
            <Param label="trace-width.traceLength" unit="m" value={length} onChange={setLength} min={0.001} max={2} />
            <Param label="trace-width.boardTemp" unit="°C" value={tempC} onChange={setTempC} min={-20} max={125} log={false} step={5} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'trace-width.requiredWidth',
            value: `${(r.width * 1000).toFixed(3)} mm`,
            note: <T k="trace-width.mil" vars={{ widthMils: r.widthMils.toFixed(1) }} />,
            warn: r.belowFabLimit,
          },
          { label: 'common.crossSection', value: `${(r.area * 1e6).toFixed(4)} mm²` },
          { label: 'trace-width.copperThickness', value: `${(r.thickness * 1e6).toFixed(1)} µm`, note: <T k="trace-width.oz" vars={{ ozCopper }} /> },
          { label: 'trace-width.traceResistance', value: formatSI(r.resistanceOhms, 'Ω') },
          { label: 'common.voltageDrop', value: formatSI(r.vDrop, 'V') },
          { label: 'trace-width.powerDissipated', value: formatSI(r.lossW, 'W') },
          { label: 'common.currentDensity', value: `${r.currentDensity.toFixed(1)} A/mm²` },
          { label: 'trace-width.layer', value: external ? 'trace-width.external' : 'trace-width.internal', note: external ? 'k = 0.048' : 'k = 0.024' },
        ]}
      />

      {r.belowFabLimit && (
        <Warning
          text="trace-width.warn1"
          vars={{
            width: (r.width * 1000).toFixed(3),
            FAB_MIN_WIDTH: (FAB_MIN_WIDTH * 1000).toFixed(2),
          }}
        />
      )}
      {!external && (
        <Warning
          text="trace-width.warn2"
        />
      )}
      {riseK > 40 && (
        <Warning
          text="trace-width.warn3"
          vars={{ riseK }}
        />
      )}

      <Theory
        text={[
          'trace-width.theory1',
          'trace-width.widthFollowsFromCross',
          'trace-width.theExponentOnCurrent',
          'trace-width.twoThingsThisDoes',
        ]}
      />
    </SimPage>
  )
}
