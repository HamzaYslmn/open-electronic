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
      lede="IPC-2221 trace sizing. Note this is a thermal limit, not a damage limit: the width is whatever keeps the copper's temperature rise under the figure you allow. Check the voltage drop separately, it often matters more."
      controls={
        <>
          <Group label="Requirement">
            <Param label="Current" unit="A" value={current} onChange={setCurrent} min={0.01} max={50} />
            <Param label="Allowed temp rise" unit="K" value={riseK} onChange={setRiseK} min={1} max={100} log={false} step={1} />
            <Segmented
              label="Layer"
              value={layer}
              onChange={setLayer}
              options={[
                { value: 'external', label: 'External' },
                { value: 'internal', label: 'Internal' },
              ]}
            />
          </Group>
          <Group label="Stackup and geometry">
            <Param label="Copper weight" unit="oz" value={ozCopper} onChange={setOzCopper} min={0.5} max={6} log={false} step={0.5} />
            <Param label="Trace length" unit="m" value={length} onChange={setLength} min={0.001} max={2} />
            <Param label="Board temp" unit="°C" value={tempC} onChange={setTempC} min={-20} max={125} log={false} step={5} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'Required width',
            value: `${(r.width * 1000).toFixed(3)} mm`,
            note: <T k="{widthMils} mil" vars={{ widthMils: r.widthMils.toFixed(1) }} />,
            warn: r.belowFabLimit,
          },
          { label: 'Cross-section', value: `${(r.area * 1e6).toFixed(4)} mm²` },
          { label: 'Copper thickness', value: `${(r.thickness * 1e6).toFixed(1)} µm`, note: <T k="{ozCopper} oz" vars={{ ozCopper }} /> },
          { label: 'Trace resistance', value: formatSI(r.resistanceOhms, 'Ω') },
          { label: 'Voltage drop', value: formatSI(r.vDrop, 'V') },
          { label: 'Power dissipated', value: formatSI(r.lossW, 'W') },
          { label: 'Current density', value: `${r.currentDensity.toFixed(1)} A/mm²` },
          { label: 'Layer', value: external ? 'External' : 'Internal', note: external ? 'k = 0.048' : 'k = 0.024' },
        ]}
      />

      {r.belowFabLimit && (
        <Warning
          text="{width} mm is below the {FAB_MIN_WIDTH} mm that low-cost fabricators reliably etch. Use their minimum instead: it costs nothing and the trace will simply run cooler than required."
          vars={{
            width: (r.width * 1000).toFixed(3),
            FAB_MIN_WIDTH: (FAB_MIN_WIDTH * 1000).toFixed(2),
          }}
        />
      )}
      {!external && (
        <Warning
          text="Internal layers have no air on either side, so IPC halves the constant and the trace needs about 2.7 times the cross-section for the same rise. Route high-current nets on outer layers where you can."
        />
      )}
      {riseK > 40 && (
        <Warning
          text="A {riseK} K rise is aggressive. FR-4 is fine thermally but the trace is heating everything near it, including components whose ratings assume ambient. Most designs allow 10 to 20 K."
          vars={{ riseK }}
        />
      )}

      <Theory
        text={[
          "IPC-2221 is a curve fit to measured data, not a derivation: `I = k · dT^0.44 · A^0.725` with A in square mils. Inverted, the cross-section you need is `A = (I / (k·dT^0.44))^(1/0.725)`. The constant k is 0.048 for external traces and 0.024 for internal ones, because an inner layer is buried in laminate and can only shed heat sideways.",
          "Width follows from cross-section and copper weight: `w = A / thickness`, where 1 oz copper is about 35 µm. So doubling to 2 oz halves the width you need, which is often cheaper than widening a congested board.",
          "The exponent on current, 1/0.725 ≈ 1.38, means width grows faster than current. Doubling the current needs about 2.6 times the copper, not twice. This is why high-current nets get out of hand quickly and end up as pours rather than traces.",
          "Two things this does not tell you. It is a steady-state thermal limit, so a brief surge can far exceed it safely. And it says nothing about voltage drop, which for long thin traces in low-voltage rails is usually the binding constraint: a trace can be thermally fine while dropping enough to upset a 3.3 V regulator's feedback.",
        ]}
      />
    </SimPage>
  )
}
