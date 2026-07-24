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
const TOLERANCE_BANDS: Record<string, { label: string; hex: string }> = {
  '1': { label: 'brown, 1%', hex: '#8b4513' },
  '2': { label: 'red, 2%', hex: '#d02020' },
  '5': { label: 'gold, 5%', hex: '#c8a020' },
  '10': { label: 'silver, 10%', hex: '#b0b0b0' },
}

export default function ResistorCode() {
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
      lede="Colour bands and SMD codes both encode the same thing: a mantissa and a power of ten. Enter a value and read it back in every notation."
      controls={
        <>
          <Group label="Resistor">
            <Param label="Value" unit="Ω" value={value} onChange={setValue} min={0.1} max={100e6} />
            <Segmented
              label="Bands"
              value={bandCount}
              onChange={setBandCount}
              options={[
                { value: '4', label: '4 band' },
                { value: '5', label: '5 band' },
              ]}
            />
            <Segmented
              label="Tolerance"
              value={tolerance}
              onChange={setTolerance}
              options={[
                { value: '1', label: '1%' },
                { value: '2', label: '2%' },
                { value: '5', label: '5%' },
                { value: '10', label: '10%' },
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
            title={name}
          />
        ))}
        <span className="band tol" style={{ background: band.hex }} title={band.label} />
      </div>

      <ReadoutGrid
        items={[
          { label: 'Value', value: formatSI(codes.value, 'Ω') },
          { label: 'Colour bands', value: codes.bands.join(', ') },
          { label: 'Tolerance band', value: band.label },
          {
            label: 'Range',
            value: `${formatSI(codes.value * (1 - tol), 'Ω')} to ${formatSI(codes.value * (1 + tol), 'Ω')}`,
          },
          { label: 'SMD 3 digit', value: codes.smd3 },
          { label: 'SMD 4 digit', value: codes.smd4 },
          { label: 'EIA-96', value: codes.eia96, warn: codes.eia96 === 'not in E96' },
          { label: 'Matching series', value: tolerance === '1' ? 'E96' : tolerance === '2' ? 'E48' : tolerance === '5' ? 'E24' : 'E12' },
        ]}
      />

      {codes.eia96 === 'not in E96' && (
        <Warning
          text="This value is not a member of the E96 series, so it has no EIA-96 code. EIA-96 marking only exists for 1% parts, which are drawn from E96 by definition. A 4.7 kΩ 5% part is an E24 value and would be marked 472 or 4701 instead."
        />
      )}
      {value < 10 && (
        <Warning
          text="Values under 10 Ω use the R notation on SMD parts, where R marks the decimal point: 4R7 is 4.7 Ω, R22 is 0.22 Ω. The plain digit codes cannot express a fraction."
        />
      )}

      <Theory
        text={[
          "Every marking scheme encodes a mantissa and a multiplier. Four bands give two significant figures and are used for 5% and 10% parts drawn from E24 and E12. Five bands give three figures for 1% and 2% parts from E96 and E48. The extra digit exists because a tighter tolerance needs a finer grid of values to be worth anything.",
          "SMD codes work the same way. Three digits is two figures plus an exponent, so 472 is 47 × 10², i.e. 4.7 kΩ. Four digits is three figures plus an exponent, so 4701 is 470 × 10¹, also 4.7 kΩ. Note the last digit is never a zero of the value itself, which catches people out constantly.",
          "EIA-96 is the compact scheme for tiny 1% parts: two digits index into the 96 values of the E96 series, and a letter gives the multiplier. So 68C is the 68th E96 value, 499, times 100, i.e. 49.9 kΩ. It is dense but requires the table.",
          "Tolerance and series always match, and that is not a coincidence. The gaps in each series are sized so neighbouring values just touch at their tolerance limits: E24 has about 5% gaps and E96 about 1%. Buying a 1% part on an E12 nominal is pointless, since a nearer E96 value exists for whatever you actually wanted.",
        ]}
      />
    </SimPage>
  )
}
