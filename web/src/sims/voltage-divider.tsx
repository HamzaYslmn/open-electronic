import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { analyse, ADC_MAX_SOURCE_OHMS, STIFF_LOAD_RATIO } from '../engine/divider'
import { formatSI } from '../engine/units'
import { T, sym } from '../i18n'
import type { Key } from '../i18n'
import { Group, Param, ReadoutGrid, Schematic, Select, SimPage, Theory, Toggle, Warning } from '../ui'

/** Package power ratings, the number the fab actually sells you. */
const PACKAGES: ReadonlyArray<{ value: string; label: Key }> = [
  { value: '0.0625', label: sym('0402 (1/16 W)') },
  { value: '0.1', label: sym('0603 (1/10 W)') },
  { value: '0.125', label: sym('0805 (1/8 W)') },
  { value: '0.25', label: 'voltage-divider.1206OrAxial1' },
  { value: '0.5', label: 'voltage-divider.axial12W' },
]

function Diagram({ loaded }: { loaded: boolean }) {
  return (
    <Schematic viewBox="0 0 260 145" label="voltage-divider.resistiveVoltageDivider">

      <circle cx="100" cy="12" r="4" />
      <path d="M100 16v18" />
      <rect x="86" y="34" width="28" height="28" />
      <path d="M100 62v22" />
      <rect x="86" y="84" width="28" height="28" />
      <path d="M100 112v10M100 76h120" />
      <circle cx="224" cy="76" r="3" />
      {loaded && (
        <>
          <path d="M172 76v12" />
          <rect x="158" y="88" width="28" height="28" />
          <path d="M172 116v6M172 122h-72" />
        </>
      )}
      <path d="M88 122h24M92 127h16M96 132h8" />

      <circle className="dot" cx="100" cy="76" r="2.5" />
      {loaded && <circle className="dot" cx="172" cy="76" r="2.5" />}

      <text x="64" y="16">
        Vin
      </text>
      <text x="120" y="52">
        R1
      </text>
      <text x="120" y="102">
        R2
      </text>
      {loaded && (
        <text x="192" y="106">
          RL
        </text>
      )}
      <text x="196" y="68">
        Vout
      </text>

    </Schematic>
  )
}

export default function VoltageDivider() {
  const [vin, setVin] = useState(VCC)
  const [r1, setR1] = useState(10_000)
  const [r2, setR2] = useState(10_000)
  const [rl, setRl] = useState(10_000)
  const [loaded, setLoaded] = useState(true)
  const [rating, setRating] = useState<string>('0.1')

  const r = useMemo(
    () => analyse(vin, r1, r2, loaded ? rl : Infinity, Number(rating)),
    [vin, r1, r2, rl, loaded, rating],
  )

  const stiff = r.stiffness >= STIFF_LOAD_RATIO
  const errorText = `${r.errorPct > -0.005 && r.errorPct < 0.005 ? '0.00' : r.errorPct.toFixed(2)} %`

  return (
    <SimPage
      id="voltage-divider"
      lede="voltage-divider.lede"
      controls={
        <>
          <Diagram loaded={loaded} />

          <Group label="common.supply">
            <Param
              label="common.vin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={0.1}
              max={60}
              log={false}
              step={0.05}
              hint="voltage-divider.defaultsToThe3v3"
            />
          </Group>

          <Group label="common.divider">
            <Param label="common.r1Top" unit="Ω" value={r1} onChange={setR1} min={1} max={10e6} />
            <Param
              label="common.r2Bottom"
              unit="Ω"
              value={r2}
              onChange={setR2}
              min={1}
              max={10e6}
            />
            <Select
              label="voltage-divider.resistorPackage"
              value={rating}
              onChange={setRating}
              options={PACKAGES}
            />
          </Group>

          <Group label="common.load">
            <Toggle label="voltage-divider.loadConnected" value={loaded} onChange={setLoaded} />
            <Param
              label="voltage-divider.rl"
              unit="Ω"
              value={rl}
              onChange={setRl}
              min={1}
              max={100e6}
              hint="voltage-divider.inputResistanceOfWhatever"
            />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'voltage-divider.voutUnloaded',
            value: formatSI(r.vout, 'V'),
            note: <T k="voltage-divider.ratio" vars={{ ratio: r.ratio.toFixed(4) }} />,
          },
          {
            label: 'voltage-divider.voutLoaded',
            value: formatSI(r.voutLoaded, 'V'),
            note: loaded ? `(R2||RL = ${formatSI(r.r2Effective, 'Ω')})` : 'voltage-divider.noLoad',
            warn: r.errorPct < -5,
          },
          {
            label: 'voltage-divider.loadError',
            value: errorText,
            note: `(${formatSI(r.errorV, 'V')})`,
            warn: r.errorPct < -5,
          },
          {
            label: 'common.outputImpedance',
            value: formatSI(r.zout, 'Ω'),
            note: sym('(R1||R2)'),
            warn: r.adcUnfriendly,
          },
          {
            label: 'voltage-divider.rlZout',
            value: !Number.isFinite(r.stiffness)
              ? '∞'
              : r.stiffness < 100
                ? r.stiffness.toFixed(2)
                : r.stiffness.toExponential(1),
            note: !loaded ? 'voltage-divider.noLoad' : stiff ? 'voltage-divider.stiffEnough' : 'voltage-divider.loadDominates',
            warn: loaded && !stiff,
          },
          {
            label: 'voltage-divider.quiescentCurrent',
            value: formatSI(r.iQuiescent, 'A'),
            note: 'voltage-divider.stringAlone',
          },
          { label: 'common.supplyCurrent', value: formatSI(r.iSupply, 'A') },
          { label: 'common.loadCurrent', value: formatSI(r.iLoad, 'A') },
          {
            label: 'voltage-divider.powerInR1',
            value: formatSI(r.pR1, 'W'),
            note: <T k="voltage-divider.ofRating" vars={{ rating: ((100 * r.pR1) / Number(rating)).toFixed(1) }} />,
            warn: r.pR1 > Number(rating),
          },
          {
            label: 'voltage-divider.powerInR2',
            value: formatSI(r.pR2, 'W'),
            note: <T k="voltage-divider.ofRating" vars={{ rating: ((100 * r.pR2) / Number(rating)).toFixed(1) }} />,
            warn: r.pR2 > Number(rating),
          },
          { label: 'voltage-divider.powerInLoad', value: formatSI(r.pLoad, 'W') },
          {
            label: 'voltage-divider.totalFromSupply',
            value: formatSI(r.pTotal, 'W'),
            note: <T k="voltage-divider.perHour" vars={{ pTotal: formatSI(r.pTotal * 3600, 'J') }} />,
          },
        ]}
      />

      <Warning when={r.overPower}
        text="voltage-divider.warn1"
        vars={{ rating: formatSI(Number(rating), 'W') }}
      />

      <Warning when={r.adcUnfriendly}
        text="voltage-divider.warn2"
        vars={{
          zout: formatSI(r.zout, 'Ω'),
          ADC_MAX_SOURCE_OHMS: formatSI(ADC_MAX_SOURCE_OHMS, 'Ω'),
        }}
      />

      <Warning when={!stiff && loaded}
        text="voltage-divider.warn3"
        vars={{ stiffness: r.stiffness.toFixed(1) }}
      />

      <Theory
        text={[
          'voltage-divider.theory1',
          'voltage-divider.lookingBackIntoThe',
          'voltage-divider.hangRlOnIt',
          'voltage-divider.powerIsIR',
        ]}
      />
    </SimPage>
  )
}
