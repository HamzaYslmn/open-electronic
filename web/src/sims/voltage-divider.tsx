import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { analyse, ADC_MAX_SOURCE_OHMS, STIFF_LOAD_RATIO } from '../engine/divider'
import { formatSI } from '../engine/units'
import { Group, Select, Toggle } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Package power ratings, the number the fab actually sells you. */
const PACKAGES = [
  { value: '0.0625', label: '0402 (1/16 W)' },
  { value: '0.1', label: '0603 (1/10 W)' },
  { value: '0.125', label: '0805 (1/8 W)' },
  { value: '0.25', label: '1206 or axial (1/4 W)' },
  { value: '0.5', label: 'Axial (1/2 W)' },
]

function Schematic({ loaded }: { loaded: boolean }) {
  return (
    <svg className="schematic" viewBox="0 0 260 145" aria-label="Resistive voltage divider">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
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
      </g>
      <g fill="currentColor">
        <circle cx="100" cy="76" r="2.5" />
        {loaded && <circle cx="172" cy="76" r="2.5" />}
      </g>
      <g fill="currentColor" fontSize="11">
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
      </g>
    </svg>
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
      lede="Two resistors and a tap. The unloaded answer is the easy part: what matters is the output impedance, and how much the thing you hang on the tap drags it down."
      controls={
        <>
          <Schematic loaded={loaded} />

          <Group label="Supply">
            <Param
              label="Vin"
              unit="V"
              value={vin}
              onChange={setVin}
              min={0.1}
              max={60}
              log={false}
              step={0.05}
              hint="Defaults to the 3V3 ESP32 rail."
            />
          </Group>

          <Group label="Divider">
            <Param label="R1 (top)" unit="Ω" value={r1} onChange={setR1} min={1} max={10e6} />
            <Param
              label="R2 (bottom)"
              unit="Ω"
              value={r2}
              onChange={setR2}
              min={1}
              max={10e6}
            />
            <Select
              label="Resistor package"
              value={rating}
              onChange={setRating}
              options={PACKAGES}
            />
          </Group>

          <Group label="Load">
            <Toggle label="Load connected" value={loaded} onChange={setLoaded} />
            <Param
              label="RL"
              unit="Ω"
              value={rl}
              onChange={setRl}
              min={1}
              max={100e6}
              hint="Input resistance of whatever the tap drives."
            />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'Vout unloaded',
            value: formatSI(r.vout, 'V'),
            note: `(ratio ${r.ratio.toFixed(4)})`,
          },
          {
            label: 'Vout loaded',
            value: formatSI(r.voutLoaded, 'V'),
            note: loaded ? `(R2||RL = ${formatSI(r.r2Effective, 'Ω')})` : '(no load)',
            warn: r.errorPct < -5,
          },
          {
            label: 'Load error',
            value: errorText,
            note: `(${formatSI(r.errorV, 'V')})`,
            warn: r.errorPct < -5,
          },
          {
            label: 'Output impedance',
            value: formatSI(r.zout, 'Ω'),
            note: '(R1||R2)',
            warn: r.adcUnfriendly,
          },
          {
            label: 'RL / Zout',
            value: !Number.isFinite(r.stiffness)
              ? '∞'
              : r.stiffness < 100
                ? r.stiffness.toFixed(2)
                : r.stiffness.toExponential(1),
            note: !loaded ? '(no load)' : stiff ? '(stiff enough)' : '(load dominates)',
            warn: loaded && !stiff,
          },
          {
            label: 'Quiescent current',
            value: formatSI(r.iQuiescent, 'A'),
            note: '(string alone)',
          },
          { label: 'Supply current', value: formatSI(r.iSupply, 'A') },
          { label: 'Load current', value: formatSI(r.iLoad, 'A') },
          {
            label: 'Power in R1',
            value: formatSI(r.pR1, 'W'),
            note: `(${((100 * r.pR1) / Number(rating)).toFixed(1)}% of rating)`,
            warn: r.pR1 > Number(rating),
          },
          {
            label: 'Power in R2',
            value: formatSI(r.pR2, 'W'),
            note: `(${((100 * r.pR2) / Number(rating)).toFixed(1)}% of rating)`,
            warn: r.pR2 > Number(rating),
          },
          { label: 'Power in load', value: formatSI(r.pLoad, 'W') },
          {
            label: 'Total from supply',
            value: formatSI(r.pTotal, 'W'),
            note: `(${formatSI(r.pTotal * 3600, 'J')} per hour)`,
          },
        ]}
      />

      {r.overPower && (
        <Warning>
          One of the resistors is over its {formatSI(Number(rating), 'W')} rating. Raise
          both values or move to a bigger package: the model is still linear, the part is
          not.
        </Warning>
      )}

      {r.adcUnfriendly && (
        <Warning>
          Zout is {formatSI(r.zout, 'Ω')}, above the {formatSI(ADC_MAX_SOURCE_OHMS, 'Ω')}{' '}
          the ESP32 ADC wants. The sample-and-hold cap will not settle inside the sampling
          window, so readings come out low. Lower both resistors or buffer the tap with an
          op-amp follower.
        </Warning>
      )}

      {!stiff && loaded && (
        <Warning>
          RL is only {r.stiffness.toFixed(1)}x Zout, so this is not a voltage source, it is
          a resistor network. Design around the loaded number or drop both divider values.
        </Warning>
      )}

      <Theory>
        <p>
          With nothing on the tap the current is the same in both legs, so
          <code> Vout = Vin·R2/(R1+R2)</code>. Only the ratio sets the voltage: 1k/1k and
          1M/1M both give half the rail, but one wastes 1000x the current.
        </p>
        <p>
          Looking back into the tap with the supply shorted, R1 and R2 appear in parallel,
          so the Thevenin source impedance is <code>Zout = R1·R2/(R1+R2)</code>. That is
          the whole reason a divider is not a regulator.
        </p>
        <p>
          Hang RL on it and the lower leg becomes <code>R2||RL</code>, giving
          <code> Vout = Vin·(R2||RL)/(R1 + R2||RL)</code>. Equivalently the source divides
          against its own impedance: <code>Vout·RL/(RL + Zout)</code>. The error is
          therefore <code>-Zout/(Zout + RL)</code>, which is -50% at RL = Zout, -9.1% at
          10x and -1% at 100x.
        </p>
        <p>
          Power is <code>I²R</code> in R1 and <code>V²/R</code> in the shunt legs, and the
          three add up to <code>Vin·I</code>. The design tension is fixed: low resistances
          give a stiff output and burn current forever, high resistances sip current and
          collapse under any real load.
        </p>
      </Theory>
    </SimPage>
  )
}
