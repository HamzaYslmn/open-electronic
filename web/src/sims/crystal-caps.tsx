import { useMemo, useState } from 'react'
import { analyseCrystal } from '../engine/parts'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Param, ReadoutGrid, SimPage, Theory, Warning } from '../ui'

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
      lede="crystal-caps.lede"
      controls={
        <>
          <Group label="crystal-caps.crystal">
            <Param label="common.frequency" unit="Hz" value={frequency} onChange={setFrequency} min={32768} max={50e6} />
            <Param label="crystal-caps.specifiedCl" unit="F" value={clSpec} onChange={setClSpec} min={4e-12} max={40e-12} />
            <Param label="crystal-caps.motionalCm" unit="F" value={cMotional} onChange={setCMotional} min={1e-16} max={5e-14} />
            <Param label="crystal-caps.shuntC0" unit="F" value={cShunt} onChange={setCShunt} min={5e-13} max={1e-11} />
          </Group>
          <Group label="crystal-caps.board">
            <Param label="crystal-caps.strayPerPin" unit="F" value={cStray} onChange={setCStray} min={0.5e-12} max={15e-12} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'crystal-caps.c1C2Ideal', value: formatSI(r.cLoad, 'F'), warn: r.strayTooHigh },
          { label: 'crystal-caps.nearestStandard', value: formatSI(r.cStandard, 'F') },
          { label: 'crystal-caps.loadActuallySeen', value: formatSI(r.actualCL, 'F'), note: <T k="crystal-caps.spec" vars={{ clSpec: formatSI(clSpec, 'F') }} /> },
          {
            label: 'crystal-caps.frequencyError',
            value: `${r.errorPpm.toFixed(2)} ppm`,
            warn: r.outOfSpec,
          },
          { label: 'crystal-caps.absoluteError', value: formatSI(r.errorHz, 'Hz') },
          {
            label: 'crystal-caps.clockDrift',
            value: <T k="crystal-caps.sDay" vars={{ secondsPerDay: secondsPerDay.toFixed(2) }} />,
            note: <T k="crystal-caps.sYear" vars={{ secondsPerDay: (secondsPerDay * 365).toFixed(0) }} />,
          },
        ]}
      />

      <Warning when={r.strayTooHigh}
        text="crystal-caps.warn1"
      />
      <Warning when={r.outOfSpec && !r.strayTooHigh}
        text="crystal-caps.warn2"
        vars={{
          errorPpm: r.errorPpm.toFixed(1),
          secondsPerDay: Math.abs(secondsPerDay).toFixed(1),
        }}
      />

      <Theory
        text={[
          'crystal-caps.theory1',
          'crystal-caps.strayCapacitanceIsNot',
          'crystal-caps.thePullFollowsFrom',
          'crystal-caps.forA32768',
        ]}
      />
    </SimPage>
  )
}
