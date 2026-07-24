import { useMemo, useState } from 'react'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { LED_TYPES, VF_SPREAD_V, analyse } from '../engine/led'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Select, Toggle } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Standard resistor package ratings. Values are watts, stored as strings for
 *  the select and converted at the edge. */
const RATINGS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '0.0625', label: '1/16 W (0402)' },
  { value: '0.1', label: '1/10 W (0603)' },
  { value: '0.125', label: '1/8 W (0805)' },
  { value: '0.25', label: '1/4 W (1206, axial)' },
  { value: '0.5', label: '1/2 W' },
  { value: '1', label: '1 W' },
]

const CUSTOM = 'custom'

const pct = (x: number) => `${(x * 100).toFixed(1)}%`
const signedPct = (x: number) => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(1)}%`

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 112" aria-label={t('LED with series resistor')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* battery on the left branch, long plate positive */}
        <path d="M24 30V52M12 52H36M17 60H31M24 60V90" />
        {/* top rail through the resistor and the LED */}
        <path d="M24 30V20H70" />
        <rect x="70" y="12" width="44" height="16" />
        <path d="M114 20H150" />
        <path d="M150 10V30L172 20Z" />
        <path d="M172 10V30" />
        {/* emitted light */}
        <path d="M156 9L164 2M160 2H164M164 2V6M164 9L172 2M168 2H172M172 2V6" />
        <path d="M172 20H220V90" />
        {/* return rail and ground */}
        <path d="M24 90H220" />
        <path d="M120 90V98M110 98H130M114 103H126M118 108H122" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="40" y="48">
          Vs
        </text>
        <text x="88" y="8">
          R
        </text>
        <text x="180" y="42">
          LED
        </text>
        <text x="126" y="16">
          If
        </text>
      </g>
    </svg>
  )
}

export default function LedResistor() {
  const [supply, setSupply] = useState(VCC)
  const [kind, setKind] = useState('red')
  const [vf, setVf] = useState(2.0)
  const [target, setTarget] = useState(0.01)
  const [maxCurrent, setMaxCurrent] = useState(0.02)
  const [rating, setRating] = useState('0.25')
  const [fromGpio, setFromGpio] = useState(true)

  const r = useMemo(
    () =>
      analyse({ supply, vf, target, maxCurrent, rating: Number(rating), fromGpio }),
    [supply, vf, target, maxCurrent, rating, fromGpio],
  )

  const pickKind = (next: string) => {
    setKind(next)
    const found = LED_TYPES.find((t) => t.id === next)
    if (found) setVf(found.vf)
  }

  const ratingLabel = RATINGS.find((p) => p.value === rating)?.label ?? `${rating} W`
  const spread = formatSI(VF_SPREAD_V, 'V')

  return (
    <SimPage
      id="led-resistor"
      lede="Pick the series resistor, then see what the nearest stock value actually does to the current, the dissipation and the GPIO driving it. No waveform here, the whole circuit is DC."
      controls={
        <>
          <Schematic />

          <Group label="Supply">
            <Param
              label="Rail Vs"
              unit="V"
              value={supply}
              onChange={setSupply}
              min={1}
              max={24}
              log={false}
              step={0.1}
              hint="3.3 V is the ESP32 rail."
            />
            <Toggle label="Driven straight from a GPIO" value={fromGpio} onChange={setFromGpio} />
          </Group>

          <Group label="LED">
            <Select
              label="Type"
              value={kind}
              onChange={pickKind}
              options={[
                ...LED_TYPES.map((t) => ({ value: t.id, label: `${t.label}, ${t.vf} V` })),
                { value: CUSTOM, label: 'Custom' },
              ]}
            />
            <Param
              label="Forward voltage Vf"
              unit="V"
              value={vf}
              onChange={(v) => {
                setVf(v)
                setKind(CUSTOM)
              }}
              min={0.5}
              max={5}
              log={false}
              step={0.05}
            />
            <Param
              label="Target current If"
              unit="A"
              value={target}
              onChange={setTarget}
              min={1e-4}
              max={0.1}
            />
            <Param
              label="Absolute max If"
              unit="A"
              value={maxCurrent}
              onChange={setMaxCurrent}
              min={1e-3}
              max={0.2}
              hint="Datasheet limit, 20 mA for most 5 mm parts."
            />
          </Group>

          <Group label="Resistor">
            <Select label="Package rating" value={rating} onChange={setRating} options={RATINGS} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'Ideal resistor',
            value: formatSI(r.idealR, 'Ω'),
            note: '(Vs - Vf) / If',
          },
          {
            label: 'Nearest E24',
            value: formatSI(r.r, 'Ω'),
            note: !Number.isFinite(r.r)
              ? 'no value works'
              : r.rUp > r.r
                ? <T k="next step up {rUp}" vars={{ rUp: formatSI(r.rUp, 'Ω') }} />
                : 'exact E24 hit',
          },
          {
            label: 'Actual current',
            value: formatSI(r.current, 'A'),
            note: <T k="({currentError} on target)" vars={{ currentError: signedPct(r.currentError) }} />,
            warn: r.overGpio || r.overLedMax,
          },
          {
            label: 'Resistor power',
            value: formatSI(r.rPower, 'W'),
            note: <T k="I²R, {ratingLabel} part" vars={{ ratingLabel }} />,
            warn: r.overRating,
          },
          { label: 'LED power', value: formatSI(r.ledPower, 'W'), note: 'Vf · I' },
          {
            label: 'Supply draw',
            value: formatSI(r.totalPower, 'W'),
            note: <T k="{efficiency} of it reaches the die" vars={{ efficiency: pct(r.efficiency) }} />,
          },
          {
            label: 'Resistor headroom',
            value: formatSI(r.headroom, 'V'),
            note: 'Vs - Vf',
            warn: r.lowHeadroom || r.noConduction,
          },
          {
            label: <T k="Current shift per {spread} of Vf" vars={{ spread }} />,
            value: formatSI(r.vfSensitivity, 'A'),
            note: r.current > 0 ? `(${pct(r.vfSensitivity / r.current)} of If)` : undefined,
            warn: r.lowHeadroom,
          },
        ]}
      />

      {r.noConduction && (
        <Warning
          text="Vf of {vf} is at or above the {supply} rail, so the LED never turns on and no resistor value helps. Use a lower Vf part, or boost the rail with a charge pump or a step-up converter."
          vars={{ vf: formatSI(vf, 'V'), supply: formatSI(supply, 'V') }}
        />
      )}

      {r.lowHeadroom && (
        <Warning
          text="Only {headroom} across the resistor. Normal part to part Vf spread of {spread} then moves the current by {current}, so the resistor is barely in control. Raise the rail or use a constant current driver."
          vars={{
            headroom: formatSI(r.headroom, 'V'),
            spread,
            current: pct(r.vfSensitivity / r.current),
          }}
        />
      )}

      {r.overGpio && (
        <Warning
          text="{current} is past the {GPIO_MAX_MA} mA an ESP32 pin should source or sink. Drive the LED through a transistor, or raise the resistor. Real pin current also comes in lower than this, because the output stage drops its own voltage under load, which this ideal-source model does not include."
          vars={{ current: formatSI(r.current, 'A'), GPIO_MAX_MA }}
        />
      )}

      {r.overLedMax && (
        <Warning
          text="{current} is over the {maxCurrent} absolute maximum set for this LED. Continuous operation there shortens life or kills the die."
          vars={{ current: formatSI(r.current, 'A'), maxCurrent: formatSI(maxCurrent, 'A') }}
        />
      )}

      {r.overRating && (
        <Warning
          text="{rPower} in a {ratingLabel} resistor. Pick a bigger package, or split the drop across two resistors in series."
          vars={{ rPower: formatSI(r.rPower, 'W'), ratingLabel }}
        />
      )}

      <Theory
        text={[
          "One loop, so Kirchhoff gives `Vs = Vf + I·R` and the resistor follows from Ohm's law: `R = (Vs - Vf) / If`. The LED is modelled as a fixed forward drop, the standard piecewise-linear diode approximation. Above the knee its I-V curve is steep enough that Vf barely moves, so the resistor, not the diode, sets the current.",
          "Dissipation splits between the two parts: `P_R = I²R = (Vs - Vf)²/R` in the resistor and `P_LED = Vf·I` in the die. The fraction that reaches the LED is just `Vf / Vs`, which is why a 2 V red LED on a 12 V rail wastes five sixths of its power as heat in a resistor.",
          "E24 is the IEC 60063 preferred series, 24 values per decade for 5% parts, nominally `10^(n/24)` rounded to two figures. The nearest value is picked on log distance rather than on ohms, because tolerance is a ratio: 62 Ω is as far from 65 Ω as 68 Ω is, in percent.",
          "Headroom is the whole design question. Differentiating the loop equation gives `dI/dVf = -1/R`, so a {spread} bin-to-bin Vf shift changes the current by `0.1 / R` amps, i.e. by `0.1 / (Vs - Vf)` as a fraction. With a 3.2 V white LED on 3.3 V that is 100% of the current, which is exactly why white and blue parts want a driver rather than a resistor from 3.3 V.",
        ]} vars={{ spread }}
      />
    </SimPage>
  )
}
