import { useMemo, useState } from 'react'
import { BANDS, VELOCITY_FACTORS, analyseAntenna } from '../engine/rf'
import { formatSI } from '../engine/units'
import { Group, Param, ReadoutGrid, Select, SimPage, Theory, Warning } from '../ui'

const VF_OPTIONS = VELOCITY_FACTORS.map((v) => ({ value: v.value, label: v.label }))
const BAND_OPTIONS = BANDS.map((b, i) => ({ value: String(i), label: b.label }))

const mm = (m: number) => `${(m * 1000).toFixed(1)} mm`

export default function AntennaLength() {
  const [frequency, setFrequency] = useState(868e6)
  const [vfKey, setVfKey] = useState<string>('wire')

  const vf = VELOCITY_FACTORS.find((v) => v.value === vfKey)?.vf ?? 0.95
  const r = useMemo(() => analyseAntenna(frequency, vf), [frequency, vf])

  return (
    <SimPage
      id="antenna-length"
      lede="antenna-length.lede"
      controls={
        <>
          <Group label="common.frequency">
            <Select
              label="antenna-length.bandPreset"
              value={String(BANDS.findIndex((b) => b.frequency === frequency))}
              onChange={(i) => setFrequency(BANDS[Number(i)]?.frequency ?? frequency)}
              options={BAND_OPTIONS}
            />
            <Param label="common.frequency" unit="Hz" value={frequency} onChange={setFrequency} min={1e6} max={10e9} />
          </Group>
          <Group label="antenna-length.conductor">
            <Select label="antenna-length.velocityFactor" value={vfKey} onChange={setVfKey} options={VF_OPTIONS} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'antenna-length.wavelength', value: mm(r.lambda), note: formatSI(r.lambda, 'm') },
          { label: 'antenna-length.quarterWave', value: mm(r.quarterWave), note: 'antenna-length.theUsualWhip' },
          { label: 'common.halfWave', value: mm(r.halfWave), note: 'antenna-length.dipoleEachLegIs' },
          { label: 'antenna-length.58Wave', value: mm(r.fiveEighths), note: 'antenna-length.slightlyMoreGain' },
          { label: 'antenna-length.fullWave', value: mm(r.fullWave) },
          { label: 'antenna-length.groundRadial', value: mm(r.groundRadial), note: 'antenna-length.each4OrMore' },
          { label: 'antenna-length.quarterWaveInFree', value: mm(r.freeSpaceQuarter), note: 'antenna-length.beforeShortening' },
          { label: 'antenna-length.velocityFactor', value: vf.toFixed(2) },
        ]}
      />

      <Warning
        text="antenna-length.warn1"
      />

      <Theory
        text={[
          'antenna-length.theory1',
          'antenna-length.thePhysicalLengthIs',
          'antenna-length.at24Ghz',
          'antenna-length.keepTheElementClear',
        ]}
      />
    </SimPage>
  )
}
