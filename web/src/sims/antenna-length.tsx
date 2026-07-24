import { useMemo, useState } from 'react'
import { BANDS, VELOCITY_FACTORS, analyseAntenna } from '../engine/rf'
import { formatSI } from '../engine/units'
import { Group, Select } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

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
      lede="Cut a wire whip to the right length. The physical element is always shorter than the free-space figure because the wave travels slower in and around the conductor."
      controls={
        <>
          <Group label="Frequency">
            <Select
              label="Band preset"
              value={String(BANDS.findIndex((b) => b.frequency === frequency))}
              onChange={(i) => setFrequency(BANDS[Number(i)]?.frequency ?? frequency)}
              options={BAND_OPTIONS}
            />
            <Param label="Frequency" unit="Hz" value={frequency} onChange={setFrequency} min={1e6} max={10e9} />
          </Group>
          <Group label="Conductor">
            <Select label="Velocity factor" value={vfKey} onChange={setVfKey} options={VF_OPTIONS} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'Wavelength', value: mm(r.lambda), note: formatSI(r.lambda, 'm') },
          { label: 'Quarter wave', value: mm(r.quarterWave), note: 'the usual whip' },
          { label: 'Half wave', value: mm(r.halfWave), note: 'dipole, each leg is a quarter' },
          { label: '5/8 wave', value: mm(r.fiveEighths), note: 'slightly more gain' },
          { label: 'Full wave', value: mm(r.fullWave) },
          { label: 'Ground radial', value: mm(r.groundRadial), note: 'each, 4 or more' },
          { label: 'Quarter wave in free space', value: mm(r.freeSpaceQuarter), note: 'before shortening' },
          { label: 'Velocity factor', value: vf.toFixed(2) },
        ]}
      />

      <Warning
        text="A quarter-wave whip is only half an antenna. The other half is the ground plane, and without one the coax braid radiates instead, which detunes everything and makes performance depend on how you hold the board. Either give it radials, use a proper ground pour, or fit a half-wave dipole which needs no ground plane."
      />

      <Theory
        text={[
          "Wavelength is `lambda = c/f`. A quarter-wave element is resonant because the reflection from its open end arrives back at the feed in phase, presenting a real impedance of roughly 37 Ω over a perfect ground plane, which is a reasonable match to 50 Ω coax.",
          "The physical length is always shorter than `lambda/4` in vacuum. The wave travels partly in the conductor and its surroundings, so the velocity factor applies: about 0.95 for a bare wire, 0.66 for typical coax dielectric, and nearer 0.55 for a microstrip trace where half the field sits in FR-4.",
          "At 2.4 GHz a quarter wave is about 31 mm, which is why chip and meander antennas are practical there and why an 868 MHz node needs a visibly long whip at about 86 mm. Getting the length wrong by 10% shifts resonance well outside a narrow band and can easily cost 10 dB, which is a factor of three in range.",
          "Keep the element clear of ground, metal and your hand. Detuning by proximity is the most common reason a bench-tested link fails once the board is in a case.",
        ]}
      />
    </SimPage>
  )
}
