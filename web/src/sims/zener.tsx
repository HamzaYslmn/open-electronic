import { useMemo, useState } from 'react'
import { VCC, VCC_5V } from '../engine/constants'
import { POWER_DERATING, analyse } from '../engine/zener'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 120" aria-label={t('Zener shunt regulator')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* input node, series resistor, output rail */}
        <circle cx="20" cy="30" r="3" />
        <path d="M23 30h37M20 33v57h216" />
        <rect x="60" y="22" width="44" height="16" />
        <path d="M104 30h116" />
        {/* zener: diode with the bent cathode bar */}
        <path d="M150 30v14M136 62h28M138 56l12-12 12 12zM136 62l-6 6M164 62l6-6M150 62v28" />
        {/* load */}
        <rect x="204" y="46" width="16" height="30" />
        <path d="M212 30v16M212 76v14" />
        <circle cx="248" cy="30" r="3" />
        <path d="M220 30h25" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="74" y="16">
          Rs
        </text>
        <text x="112" y="58">
          Dz
        </text>
        <text x="226" y="64">
          load
        </text>
        <text x="10" y="22">
          Vin
        </text>
        <text x="234" y="22">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function Zener() {
  // A shunt regulator needs headroom above its output, so the input here is the
  // 5 V USB rail feeding a 3.3 V (VCC) output. Defaults are a 1N4728A: 3.3 V,
  // 1 W, Zzt 10 ohm at the 76 mA test current.
  const [vinMin, setVinMin] = useState(VCC_5V * 0.95)
  const [vinMax, setVinMax] = useState(VCC_5V * 1.05)
  const [vz, setVz] = useState(VCC)
  const [rz, setRz] = useState(10)
  const [pzMax, setPzMax] = useState(1)
  const [izMin, setIzMin] = useState(5e-3)
  const [ilMin, setIlMin] = useState(0)
  const [ilMax, setIlMax] = useState(20e-3)
  const [rs, setRs] = useState(56)

  const r = useMemo(
    () => analyse({ vinMin, vinMax, vz, rz, pzMax, izMin, ilMin, ilMax, rs }),
    [vinMin, vinMax, vz, rz, pzMax, izMin, ilMin, ilMax, rs],
  )

  const noHeadroom = vinMin <= vz
  const suggestion = Number.isFinite(r.rsSuggested) ? r.rsSuggested : null

  return (
    <SimPage
      id="zener"
      lede="Size the series resistor so the zener still regulates at the lowest input with the heaviest load, and still survives the highest input with no load at all. Every figure is a worst case, not a nominal."
      controls={
        <>
          <Schematic />

          <Group label="Input range">
            <Param
              label="Vin min"
              unit="V"
              value={vinMin}
              onChange={setVinMin}
              min={0.5}
              max={60}
              log={false}
              step={0.05}
            />
            <Param
              label="Vin max"
              unit="V"
              value={vinMax}
              onChange={setVinMax}
              min={0.5}
              max={60}
              log={false}
              step={0.05}
              hint="Include supply tolerance and ripple peaks."
            />
          </Group>

          <Group label="Zener">
            <Param
              label="Vz"
              unit="V"
              value={vz}
              onChange={setVz}
              min={1.8}
              max={50}
              log={false}
              step={0.1}
            />
            <Param
              label="Zzt (dynamic)"
              unit="Ω"
              value={rz}
              onChange={setRz}
              min={0.1}
              max={1000}
              hint="Datasheet impedance at the test current. 1N4728A is 10 Ω."
            />
            <Param
              label="Power rating"
              unit="W"
              value={pzMax}
              onChange={setPzMax}
              min={0.25}
              max={5}
            />
            <Param
              label="Iz min (knee)"
              unit="A"
              value={izMin}
              onChange={setIzMin}
              min={1e-4}
              max={0.1}
              hint="Datasheet Izk is 1 mA. Use 5 to 10 mA for a stiff output."
            />
          </Group>

          <Group label="Load">
            <Param
              label="IL min"
              unit="A"
              value={ilMin}
              onChange={setIlMin}
              min={0}
              max={0.5}
              log={false}
              step={0.0005}
              hint="Worst case for the zener. Assume zero unless the load is always on."
            />
            <Param
              label="IL max"
              unit="A"
              value={ilMax}
              onChange={setIlMax}
              min={1e-4}
              max={0.5}
            />
          </Group>

          <Group label="Series resistor">
            <Param label="Rs" unit="Ω" value={rs} onChange={setRs} min={1} max={100e3} />
            {suggestion !== null && (
              <div className="seg">
                <button onClick={() => setRs(suggestion)}>
                  <T k="Use {value} (E24)" vars={{ value: formatSI(suggestion, 'Ω') }} />
                </button>
              </div>
            )}
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'Rs window',
            value: r.windowValid
              ? `${formatSI(r.rsMin, 'Ω')} to ${formatSI(r.rsMax, 'Ω')}`
              : 'none',
            note: r.windowValid ? '(power limit to regulation limit)' : '(no part fits)',
            warn: !r.windowValid,
          },
          {
            label: 'Rs fitted',
            value: formatSI(rs, 'Ω'),
            note: suggestion !== null ? <T k="(E24 pick {suggestion})" vars={{ suggestion: formatSI(suggestion, 'Ω') }} /> : undefined,
            warn: r.windowValid && (rs < r.rsMin || rs > r.rsMax),
          },
          {
            label: 'Iz worst case max',
            value: formatSI(r.hot.iz, 'A'),
            note: <T k="(Vin max, IL min; budget {izMaxAllowed})" vars={{ izMaxAllowed: formatSI(r.izMaxAllowed, 'A') }} />,
            warn: r.hot.iz > r.izMaxAllowed,
          },
          {
            label: 'Iz worst case min',
            value: formatSI(r.cold.iz, 'A'),
            note: <T k="(Vin min, IL max; knee {izMin})" vars={{ izMin: formatSI(izMin, 'A') }} />,
            warn: r.dropout,
          },
          {
            label: 'Zener dissipation',
            value: formatSI(r.hot.pz, 'W'),
            note: <T k="({pzFraction}% of rating)" vars={{ pzFraction: (100 * r.pzFraction).toFixed(0) }} />,
            warn: r.overPower || r.overDerated,
          },
          {
            label: 'Rs dissipation',
            value: formatSI(r.hot.prs, 'W'),
            note: <T k="(fit a {rsWattage} part)" vars={{ rsWattage: formatSI(r.rsWattage, 'W') }} />,
          },
          {
            label: 'Regulating input range',
            value: `${formatSI(r.vinDropout, 'V')} to ${formatSI(r.vinPowerLimit, 'V')}`,
            note: '(dropout at full load, to derated power at no load)',
            warn: r.vinDropout > r.vinPowerLimit,
          },
          {
            label: 'Vout at worst case',
            value: formatSI(r.cold.vout, 'V'),
            note: r.cold.regulating ? '(in regulation)' : '(dropped out)',
            warn: !r.cold.regulating,
          },
          {
            label: 'Output impedance',
            value: formatSI(r.zout, 'Ω'),
            note: <T k="(load swing {loadSwing})" vars={{ loadSwing: formatSI(r.loadSwing, 'V') }} />,
          },
          {
            label: 'Ripple rejection',
            value: `${r.rippleDb.toFixed(1)} dB`,
            note: <T k="(line swing {lineSwing})" vars={{ lineSwing: formatSI(r.lineSwing, 'V') }} />,
          },
          {
            label: 'Supply current',
            value: formatSI(r.supplyMax, 'A'),
            note: <T k="(constant, total loss {pTotal})" vars={{ pTotal: formatSI(r.pTotal, 'W') }} />,
          },
          {
            label: 'Efficiency at full load',
            value: `${(100 * r.efficiency).toFixed(1)}%`,
            note: '(mid input)',
            warn: r.efficiency < 0.25,
          },
        ]}
      />

      {noHeadroom && (
        <Warning
          text="Vin min ({vinMin}) is not above Vz ({vz}). A shunt regulator can only drop voltage, so there is no resistor that works. Lower Vz or raise the input."
          vars={{ vinMin: formatSI(vinMin, 'V'), vz: formatSI(vz, 'V') }}
        />
      )}

      {!noHeadroom && !r.windowValid && (
        <Warning
          text="No single resistor satisfies both extremes: Rs must be at least {rsMin} to keep the zener inside its power budget at {vinMax} with no load, but at most {rsMax} to hold the knee at {vinMin} with {ilMax}. Use a higher-wattage zener, narrow the input range, or move to a series pass regulator."
          vars={{
            rsMin: formatSI(r.rsMin, 'Ω'),
            vinMax: formatSI(vinMax, 'V'),
            rsMax: formatSI(r.rsMax, 'Ω'),
            vinMin: formatSI(vinMin, 'V'),
            ilMax: formatSI(ilMax, 'A'),
          }}
        />
      )}

      {r.dropout && (
        <Warning
          text="Out of regulation at the low corner: Rs only delivers {irs} at {vinMin}, so the zener is left with {iz}, under the {izMin} knee. Output sags to {vout} and tracks the load. Reduce Rs below {rsMax}."
          vars={{
            irs: formatSI(r.cold.irs, 'A'),
            vinMin: formatSI(vinMin, 'V'),
            iz: formatSI(r.cold.iz, 'A'),
            izMin: formatSI(izMin, 'A'),
            vout: formatSI(r.cold.vout, 'V'),
            rsMax: formatSI(r.rsMax, 'Ω'),
          }}
        />
      )}

      {r.overPower && (
        <Warning
          text="Zener over its rating: {pz} in a {pzMax} part at {vinMax} with the load disconnected. It will fail, usually shorted, which then dumps {irs} into Rs. Raise Rs above {rsMin}."
          vars={{
            pz: formatSI(r.hot.pz, 'W'),
            pzMax: formatSI(pzMax, 'W'),
            vinMax: formatSI(vinMax, 'V'),
            irs: formatSI(r.hot.irs, 'A'),
            rsMin: formatSI(r.rsMin, 'Ω'),
          }}
        />
      )}

      {!r.overPower && r.overDerated && (
        <Warning
          text="Zener at {pzFraction}% of its rating. Inside the absolute limit but past the {POWER_DERATING}% budget this page uses: ratings are quoted at 25 C and the part will run hot in still air."
          vars={{
            pzFraction: (100 * r.pzFraction).toFixed(0),
            POWER_DERATING: (100 * POWER_DERATING).toFixed(0),
          }}
        />
      )}

      <Theory
        text={[
          "The zener is a shunt: it takes whatever current the load does not. `Rs = (Vin - Vz) / (Iz + IL)` is the whole design, evaluated at the two corners that bite. Lowest input with the heaviest load leaves the least current for the zener, which sets the largest usable Rs. Highest input with the lightest load pushes everything through the zener, which sets the smallest.",
          "Power follows directly: `Pz = Vz·Iz` at the hot corner and `Prs = Irs²·Rs`. The current budget is `Iz_max = {POWER_DERATING} · Pz_max / Vz`, half the rating because datasheet numbers assume 25 C.",
          "Regulation quality comes from the dynamic impedance Zz, not the DC clamp. Rs and Zz form a divider for anything riding on the input, so `dVout/dVin = Zz / (Rs + Zz)`, and the output impedance seen by the load is `Rs ∥ Zz`. Note the trade: a large Rs is efficient but a poor regulator.",
          "The DC model treats the zener as an ideal Vz clamp above the knee and as an open circuit below it, which is why the low corner reports a plain series drop instead of a regulated output. Extrapolating the Zz tangent line down to zero current would look more sophisticated and be badly wrong: a 1N4728A is 10 Ω at 76 mA but 400 Ω at 1 mA.",
        ]} vars={{ POWER_DERATING }}
      />
    </SimPage>
  )
}
