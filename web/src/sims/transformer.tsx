import { useMemo, useState } from 'react'
import { analyseTransformer } from '../engine/ac'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

export default function Transformer() {
  // Mains input, so this page legitimately does not default to the 3.3 V rail.
  const [vPrimary, setVPrimary] = useState(230)
  const [np, setNp] = useState(1000)
  const [ns, setNs] = useState(50)
  const [load, setLoad] = useState(10)
  const [rPrimary, setRPrimary] = useState(20)
  const [rSecondary, setRSecondary] = useState(0.5)
  const [vaRating, setVaRating] = useState(30)

  const t = useMemo(
    () => analyseTransformer(vPrimary, np, ns, load, rPrimary, rSecondary, vaRating),
    [vPrimary, np, ns, load, rPrimary, rSecondary, vaRating],
  )

  return (
    <SimPage
      id="transformer"
      lede="transformer.lede"
      controls={
        <>
          <Group label="transformer.windings">
            <Param label="transformer.primaryVoltage" unit="V" value={vPrimary} onChange={setVPrimary} min={1} max={1000} />
            <Param label="transformer.primaryTurns" value={np} onChange={(v) => setNp(Math.round(v))} min={1} max={100_000} />
            <Param label="transformer.secondaryTurns" value={ns} onChange={(v) => setNs(Math.round(v))} min={1} max={100_000} />
          </Group>
          <Group label="transformer.lossesAndRating">
            <Param label="transformer.primaryResistance" unit="Ω" value={rPrimary} onChange={setRPrimary} min={0} max={2000} log={false} step={1} />
            <Param label="transformer.secondaryResistance" unit="Ω" value={rSecondary} onChange={setRSecondary} min={0} max={100} log={false} step={0.1} />
            <Param label="transformer.vaRating" unit="VA" value={vaRating} onChange={setVaRating} min={1} max={5000} />
          </Group>
          <Group label="common.load">
            <Param label="common.loadResistance" unit="Ω" value={load} onChange={setLoad} min={0.1} max={100_000} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'transformer.turnsRatio', value: `${t.ratio.toFixed(2)} : 1` },
          { label: 'transformer.secondaryNoLoad', value: formatSI(t.vSecondaryNoLoad, 'V') },
          { label: 'transformer.secondaryLoaded', value: formatSI(t.vSecondaryLoaded, 'V') },
          { label: 'transformer.secondaryCurrent', value: formatSI(t.iSecondary, 'A') },
          { label: 'transformer.primaryCurrent', value: formatSI(t.iPrimary, 'A') },
          { label: 'transformer.reflectedImpedance', value: formatSI(t.reflected, 'Ω'), note: 'transformer.seenByThePrimary' },
          { label: 'transformer.apparentPower', value: formatSI(t.va, 'VA'), note: <T k="transformer.ratedVa" vars={{ vaRating }} />, warn: t.overRated },
          { label: 'transformer.primaryCopperLoss', value: formatSI(t.lossPrimary, 'W') },
          { label: 'transformer.secondaryCopperLoss', value: formatSI(t.lossSecondary, 'W') },
          { label: 'common.efficiency', value: `${(t.efficiency * 100).toFixed(1)}%`, note: 'transformer.copperLossOnly' },
          {
            label: 'transformer.regulation',
            value: `${(t.regulation * 100).toFixed(1)}%`,
            warn: t.poorRegulation,
          },
        ]}
      />

      {t.overRated && (
        <Warning
          text="transformer.warn1"
          vars={{ VA: formatSI(t.va, 'VA'), vaRating }}
        />
      )}
      {t.poorRegulation && (
        <Warning
          text="transformer.warn2"
          vars={{ regulation: (t.regulation * 100).toFixed(0) }}
        />
      )}

      <Theory
        text={[
          'transformer.theory1',
          'transformer.theConsequencePeopleForget',
          'transformer.regulationIsWhatWinding',
          'transformer.thisModelCoversCopper',
        ]}
      />
    </SimPage>
  )
}
