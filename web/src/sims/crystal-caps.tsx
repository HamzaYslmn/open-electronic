import { useMemo, useState } from 'react'
import { analyseCrystal } from '../engine/parts'
import { formatSI } from '../engine/units'
import { Group } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

export default function CrystalCaps() {
  const [frequency, setFrequency] = useState(32768)
  const [clSpec, setClSpec] = useState(12.5e-12)
  const [cStray, setCStray] = useState(3e-12)
  const [cMotional, setCMotional] = useState(3e-15)
  const [cShunt, setCShunt] = useState(1.5e-12)

  const r = useMemo(
    () => analyseCrystal(frequency, clSpec, cStray, cMotional, cShunt),
    [frequency, clSpec, cStray, cMotional, cShunt],
  )

  const secondsPerDay = (r.errorPpm * 86400) / 1e6

  return (
    <SimPage
      id="crystal-caps"
      lede="A crystal is cut to hit its marked frequency only when it sees a specific capacitance. Get the load capacitors wrong and it still oscillates, just at the wrong frequency, which is why a clock that drifts is usually a capacitor problem rather than a crystal fault."
      controls={
        <>
          <Group label="Crystal">
            <Param label="Frequency" unit="Hz" value={frequency} onChange={setFrequency} min={32768} max={50e6} />
            <Param label="Specified CL" unit="F" value={clSpec} onChange={setClSpec} min={4e-12} max={40e-12} />
            <Param label="Motional Cm" unit="F" value={cMotional} onChange={setCMotional} min={1e-16} max={5e-14} />
            <Param label="Shunt C0" unit="F" value={cShunt} onChange={setCShunt} min={5e-13} max={1e-11} />
          </Group>
          <Group label="Board">
            <Param label="Stray per pin" unit="F" value={cStray} onChange={setCStray} min={0.5e-12} max={15e-12} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'C1 = C2 ideal', value: formatSI(r.cLoad, 'F'), warn: r.strayTooHigh },
          { label: 'Nearest standard', value: formatSI(r.cStandard, 'F') },
          { label: 'Load actually seen', value: formatSI(r.actualCL, 'F'), note: `spec ${formatSI(clSpec, 'F')}` },
          {
            label: 'Frequency error',
            value: `${r.errorPpm.toFixed(2)} ppm`,
            warn: r.outOfSpec,
          },
          { label: 'Absolute error', value: formatSI(r.errorHz, 'Hz') },
          {
            label: 'Clock drift',
            value: `${secondsPerDay.toFixed(2)} s/day`,
            note: `${(secondsPerDay * 365).toFixed(0)} s/year`,
          },
        ]}
      />

      {r.strayTooHigh && (
        <Warning>
          Stray capacitance alone already exceeds the specified load, so no external capacitors
          can bring it down: the crystal will always run slow. Shorten the tracks, remove ground
          pour from under them, or choose a crystal specified for a higher CL.
        </Warning>
      )}
      {r.outOfSpec && !r.strayTooHigh && (
        <Warning>
          {r.errorPpm.toFixed(1)} ppm is a drift of {Math.abs(secondsPerDay).toFixed(1)} seconds
          a day. For a real-time clock that is far too much. Pick capacitors closer to the ideal
          value, or trim one of them.
        </Warning>
      )}

      <Theory>
        <p>
          The oscillator sees the two load capacitors in series, plus whatever the pins and
          tracks contribute: <code>CL = C1·C2/(C1+C2) + Cstray</code>. With C1 = C2 that
          simplifies to <code>C1/2 + Cstray</code>, so{' '}
          <code>C1 = C2 = 2·(CL - Cstray)</code>.
        </p>
        <p>
          Stray capacitance is not a rounding error here. Two or three picofarads per pin is
          typical for a small package with short tracks, and against a 12.5 pF specified load
          that is a quarter of the budget. Ignoring it is the single most common reason a design
          runs fast or slow by tens of ppm.
        </p>
        <p>
          The pull follows from the crystal's motional capacitance:{' '}
          <code>df/f = Cm/2 · (1/(C0+CL_actual) - 1/(C0+CL_spec))</code>. Too much load pulls
          the frequency down, too little pulls it up. Cm is tiny, femtofarads, which is exactly
          why a crystal is stable at all: the load has only a weak grip on it.
        </p>
        <p>
          For a 32.768 kHz timekeeping crystal, 20 ppm is about 1.7 seconds a day, or ten
          minutes a year. If that matters, either trim the capacitors or use a temperature
          compensated module: temperature drift will typically dwarf the load error anyway,
          since a watch crystal has a parabolic tempco of about -0.035 ppm per °C squared.
        </p>
      </Theory>
    </SimPage>
  )
}
