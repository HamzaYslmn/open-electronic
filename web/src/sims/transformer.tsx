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
      lede="Turns ratio sets voltage, and its square sets impedance. Winding resistance is what turns a textbook ideal transformer into one whose output sags the moment you load it."
      controls={
        <>
          <Group label="Windings">
            <Param label="Primary voltage" unit="V" value={vPrimary} onChange={setVPrimary} min={1} max={1000} />
            <Param label="Primary turns" value={np} onChange={(v) => setNp(Math.round(v))} min={1} max={100_000} />
            <Param label="Secondary turns" value={ns} onChange={(v) => setNs(Math.round(v))} min={1} max={100_000} />
          </Group>
          <Group label="Losses and rating">
            <Param label="Primary resistance" unit="Ω" value={rPrimary} onChange={setRPrimary} min={0} max={2000} log={false} step={1} />
            <Param label="Secondary resistance" unit="Ω" value={rSecondary} onChange={setRSecondary} min={0} max={100} log={false} step={0.1} />
            <Param label="VA rating" unit="VA" value={vaRating} onChange={setVaRating} min={1} max={5000} />
          </Group>
          <Group label="Load">
            <Param label="Load resistance" unit="Ω" value={load} onChange={setLoad} min={0.1} max={100_000} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'Turns ratio', value: `${t.ratio.toFixed(2)} : 1` },
          { label: 'Secondary, no load', value: formatSI(t.vSecondaryNoLoad, 'V') },
          { label: 'Secondary, loaded', value: formatSI(t.vSecondaryLoaded, 'V') },
          { label: 'Secondary current', value: formatSI(t.iSecondary, 'A') },
          { label: 'Primary current', value: formatSI(t.iPrimary, 'A') },
          { label: 'Reflected impedance', value: formatSI(t.reflected, 'Ω'), note: 'seen by the primary' },
          { label: 'Apparent power', value: formatSI(t.va, 'VA'), note: <T k="rated {vaRating} VA" vars={{ vaRating }} />, warn: t.overRated },
          { label: 'Primary copper loss', value: formatSI(t.lossPrimary, 'W') },
          { label: 'Secondary copper loss', value: formatSI(t.lossSecondary, 'W') },
          { label: 'Efficiency', value: `${(t.efficiency * 100).toFixed(1)}%`, note: 'copper loss only' },
          {
            label: 'Regulation',
            value: `${(t.regulation * 100).toFixed(1)}%`,
            warn: t.poorRegulation,
          },
        ]}
      />

      {t.overRated && (
        <Warning
          text="{VA} exceeds the {vaRating} VA rating. The windings will overheat, and since the rating is thermal rather than magnetic it may run for a while before failing, which is what makes it dangerous."
          vars={{ VA: formatSI(t.va, 'VA'), vaRating }}
        />
      )}
      {t.poorRegulation && (
        <Warning
          text="{regulation}% regulation means the output sags badly under load. Small transformers are much worse than large ones here, which is why a 5 VA part marked 12 V often measures 15 V unloaded."
          vars={{ regulation: (t.regulation * 100).toFixed(0) }}
        />
      )}

      <Theory
        text={[
          "The defining relations are `Vs = Vp·Ns/Np` and `Is = Ip·Np/Ns`. Voltage steps down while current steps up, so apparent power is conserved: a transformer moves energy, it does not make it.",
          "The consequence people forget is impedance. A load Zs on the secondary appears to the primary as `(Np/Ns)²·Zs`. That square is why transformers match impedances as well as voltages, and it is the entire basis of valve amplifier output stages and RF matching networks.",
          "Regulation is what winding resistance costs you. Current through the secondary resistance, plus the primary resistance reflected across the same ratio, drops voltage in proportion to load. So the no-load voltage is always higher than the nameplate, and a small transformer can read 25% high when unloaded.",
          "This model covers copper loss only. Real transformers also have core loss from hysteresis and eddy currents, which is roughly constant with load and dominates at light load, plus leakage inductance that worsens regulation further at higher frequencies. The VA rating is a thermal limit covering all of it together.",
        ]}
      />
    </SimPage>
  )
}
