import { sym, useT } from '../i18n'
import type { Key } from '../i18n'
import { useMemo, useState } from 'react'
import { BAND_COLORS, encodeResistor } from '../engine/parts'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const hexFor = (name: string) =>
  BAND_COLORS.find((c) => c.name === name)?.hex ?? '#1a1a1a'

/** The tolerance band colours, which are a separate set from the digit ones. */
const TOLERANCE_BANDS: Record<string, { label: Key; hex: string }> = {
  '1': { label: 'resistor-code.brown1', hex: '#8b4513' },
  '2': { label: 'resistor-code.red2', hex: '#d02020' },
  '5': { label: 'resistor-code.gold5', hex: '#c8a020' },
  '10': { label: 'resistor-code.silver10', hex: '#b0b0b0' },
}

export default function ResistorCode() {
  const t = useT()
  const [value, setValue] = useState(4700)
  const [bandCount, setBandCount] = useState<'4' | '5'>('4')
  const [tolerance, setTolerance] = useState('5')

  const codes = useMemo(
    () => encodeResistor(value, bandCount === '4' ? 4 : 5),
    [value, bandCount],
  )

  const tol = Number(tolerance) / 100
  const band = TOLERANCE_BANDS[tolerance]

  return (
    <SimPage
      id="resistor-code"
      lede="resistor-code.lede"
      controls={
        <>
          <Group label="common.resistor">
            <Param label="resistor-code.value" unit="Ω" value={value} onChange={setValue} min={0.1} max={100e6} />
            <Segmented
              label="resistor-code.bands"
              value={bandCount}
              onChange={setBandCount}
              options={[
                { value: '4', label: 'resistor-code.4Band' },
                { value: '5', label: 'resistor-code.5Band' },
              ]}
            />
            <Segmented
              label="resistor-code.tolerance"
              value={tolerance}
              onChange={setTolerance}
              options={[
                { value: '1', label: sym('1%') },
                { value: '2', label: sym('2%') },
                { value: '5', label: sym('5%') },
                { value: '10', label: sym('10%') },
              ]}
            />
          </Group>
        </>
      }
    >
      <div className="bands">
        {codes.bands.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="band"
            style={{ background: hexFor(name) }}
            title={t(name)}
          />
        ))}
        <span className="band tol" style={{ background: band.hex }} title={t(band.label)} />
      </div>

      <ReadoutGrid
        items={[
          { label: 'resistor-code.value', value: formatSI(codes.value, 'Ω') },
          { label: 'resistor-code.colourBands', value: codes.bands.map((b) => t(b)).join(', ') },
          { label: 'resistor-code.toleranceBand', value: band.label },
          {
            label: 'resistor-code.range',
            value: `${formatSI(codes.value * (1 - tol), 'Ω')} to ${formatSI(codes.value * (1 + tol), 'Ω')}`,
          },
          { label: 'resistor-code.smd3Digit', value: codes.smd3 },
          { label: 'resistor-code.smd4Digit', value: codes.smd4 },
          { label: 'EIA-96', value: codes.eia96, warn: codes.eia96 === 'not in E96' },
          { label: 'resistor-code.matchingSeries', value: tolerance === '1' ? 'E96' : tolerance === '2' ? 'E48' : tolerance === '5' ? 'E24' : 'E12' },
        ]}
      />

      {codes.eia96 === 'not in E96' && (
        <Warning
          text="resistor-code.warn1"
        />
      )}
      {value < 10 && (
        <Warning
          text="resistor-code.warn2"
        />
      )}

      <Theory
        text={[
          'resistor-code.theory1',
          'resistor-code.smdCodesWorkThe',
          'resistor-code.eia96IsThe',
          'resistor-code.toleranceAndSeriesAlways',
        ]}
      />
    </SimPage>
  )
}
