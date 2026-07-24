import { useMemo, useState } from 'react'
import { GPIO_MAX_MA, VCC } from '../engine/constants'
import { LED_TYPES, VF_SPREAD_V, analyse } from '../engine/led'
import { formatSI } from '../engine/units'
import { T, sym, useT } from '../i18n'
import type { Key } from '../i18n'
import { Group, Select, Toggle } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Standard resistor package ratings. Values are watts, stored as strings for
 *  the select and converted at the edge. */
const RATINGS: ReadonlyArray<{ value: string; label: Key }> = [
  { value: '0.0625', label: sym('1/16 W (0402)') },
  { value: '0.1', label: sym('1/10 W (0603)') },
  { value: '0.125', label: sym('1/8 W (0805)') },
  { value: '0.25', label: 'led-resistor.14W1206' },
  { value: '0.5', label: sym('1/2 W') },
  { value: '1', label: sym('1 W') },
]

const CUSTOM = 'custom'

const pct = (x: number) => `${(x * 100).toFixed(1)}%`
const signedPct = (x: number) => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(1)}%`

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 112" aria-label={t('led-resistor.ledWithSeriesResistor')}>
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
  const t = useT()
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
      lede="led-resistor.lede"
      controls={
        <>
          <Schematic />

          <Group label="common.supply">
            <Param
              label="led-resistor.railVs"
              unit="V"
              value={supply}
              onChange={setSupply}
              min={1}
              max={24}
              log={false}
              step={0.1}
              hint="common.33VIs"
            />
            <Toggle label="led-resistor.drivenStraightFromA" value={fromGpio} onChange={setFromGpio} />
          </Group>

          <Group label="led-resistor.led">
            <Select
              label="led-resistor.type"
              value={kind}
              onChange={pickKind}
              options={[
                ...LED_TYPES.map((led) => ({ value: led.id, label: sym(`${t(led.label)}, ${led.vf} V`) })),
                { value: CUSTOM, label: 'led-resistor.custom' },
              ]}
            />
            <Param
              label="led-resistor.forwardVoltageVf"
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
              label="led-resistor.targetCurrentIf"
              unit="A"
              value={target}
              onChange={setTarget}
              min={1e-4}
              max={0.1}
            />
            <Param
              label="led-resistor.absoluteMaxIf"
              unit="A"
              value={maxCurrent}
              onChange={setMaxCurrent}
              min={1e-3}
              max={0.2}
              hint="led-resistor.datasheetLimit20Ma"
            />
          </Group>

          <Group label="common.resistor">
            <Select label="led-resistor.packageRating" value={rating} onChange={setRating} options={RATINGS} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'led-resistor.idealResistor',
            value: formatSI(r.idealR, 'Ω'),
            note: 'led-resistor.vsVfIf',
          },
          {
            label: 'led-resistor.nearestE24',
            value: formatSI(r.r, 'Ω'),
            note: !Number.isFinite(r.r)
              ? 'led-resistor.noValueWorks'
              : r.rUp > r.r
                ? <T k="led-resistor.nextStepUp" vars={{ rUp: formatSI(r.rUp, 'Ω') }} />
                : 'led-resistor.exactE24Hit',
          },
          {
            label: 'common.actualCurrent',
            value: formatSI(r.current, 'A'),
            note: <T k="led-resistor.onTarget" vars={{ currentError: signedPct(r.currentError) }} />,
            warn: r.overGpio || r.overLedMax,
          },
          {
            label: 'led-resistor.resistorPower',
            value: formatSI(r.rPower, 'W'),
            note: <T k="led-resistor.iRPart" vars={{ ratingLabel }} />,
            warn: r.overRating,
          },
          { label: 'led-resistor.ledPower', value: formatSI(r.ledPower, 'W'), note: 'led-resistor.vfI' },
          {
            label: 'led-resistor.supplyDraw',
            value: formatSI(r.totalPower, 'W'),
            note: <T k="led-resistor.ofItReachesThe" vars={{ efficiency: pct(r.efficiency) }} />,
          },
          {
            label: 'led-resistor.resistorHeadroom',
            value: formatSI(r.headroom, 'V'),
            note: 'led-resistor.vsVf',
            warn: r.lowHeadroom || r.noConduction,
          },
          {
            label: <T k="led-resistor.currentShiftPerOf" vars={{ spread }} />,
            value: formatSI(r.vfSensitivity, 'A'),
            note: r.current > 0 ? `(${pct(r.vfSensitivity / r.current)} of If)` : undefined,
            warn: r.lowHeadroom,
          },
        ]}
      />

      {r.noConduction && (
        <Warning
          text="led-resistor.warn1"
          vars={{ vf: formatSI(vf, 'V'), supply: formatSI(supply, 'V') }}
        />
      )}

      {r.lowHeadroom && (
        <Warning
          text="led-resistor.warn2"
          vars={{
            headroom: formatSI(r.headroom, 'V'),
            spread,
            current: pct(r.vfSensitivity / r.current),
          }}
        />
      )}

      {r.overGpio && (
        <Warning
          text="led-resistor.warn3"
          vars={{ current: formatSI(r.current, 'A'), GPIO_MAX_MA }}
        />
      )}

      {r.overLedMax && (
        <Warning
          text="led-resistor.warn4"
          vars={{ current: formatSI(r.current, 'A'), maxCurrent: formatSI(maxCurrent, 'A') }}
        />
      )}

      {r.overRating && (
        <Warning
          text="led-resistor.warn5"
          vars={{ rPower: formatSI(r.rPower, 'W'), ratingLabel }}
        />
      )}

      <Theory
        text={[
          'led-resistor.theory1',
          'led-resistor.dissipationSplitsBetweenThe',
          'led-resistor.e24IsTheIec',
          'led-resistor.headroomIsTheWhole',
        ]} vars={{ spread }}
      />
    </SimPage>
  )
}
