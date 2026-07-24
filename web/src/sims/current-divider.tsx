import { useMemo, useState } from 'react'
import { VCC, GPIO_MAX_MA } from '../engine/constants'
import { QUARTER_WATT, analyse } from '../engine/currentDivider'
import type { BranchResult, Drive } from '../engine/currentDivider'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

type DriveKind = 'voltage' | 'current'

/** Slider defaults: a common E12 spread so the split is visibly uneven. */
const DEFAULT_R = [1000, 2200, 4700, 10_000]

function Schematic({ count, kind }: { count: number; kind: DriveKind }) {
  // Branches sit evenly between x=90 and x=232 on a 260-wide canvas.
  const xs = Array.from({ length: count }, (_, i) =>
    count === 1 ? 160 : 90 + (i * 142) / (count - 1),
  )
  return (
    <svg className="schematic" viewBox="0 0 260 120" aria-label="Parallel branch network">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {kind === 'voltage' ? (
          <>
            <path d="M22 46h16M26 52h8M30 20v26M30 52v48" />
            <rect x="48" y="13" width="28" height="14" />
            <path d="M30 20h18M76 20h156" />
          </>
        ) : (
          <>
            <circle cx="30" cy="60" r="12" />
            <path d="M30 70v-20M26 55l4-5 4 5" />
            <path d="M30 20v28M30 72v28M30 20h202" />
          </>
        )}
        <path d="M30 100h202" />
        {xs.map((x) => (
          <g key={x}>
            <rect x={x - 7} y="46" width="14" height="28" />
            <path d={`M${x} 20v26M${x} 74v26`} />
          </g>
        ))}
      </g>
      <g fill="currentColor" fontSize="10" textAnchor="middle">
        {kind === 'voltage' && (
          <>
            <text x="62" y="11">
              Rs
            </text>
            <text x="10" y="52">
              Vs
            </text>
          </>
        )}
        {kind === 'current' && (
          <text x="8" y="64" textAnchor="start">
            I
          </text>
        )}
        {xs.map((x, i) => (
          <text key={x} x={x} y="42">
            R{i + 1}
          </text>
        ))}
      </g>
    </svg>
  )
}

/** Proportional bar: how the total splits across the branches. */
function SplitBar({ branches }: { branches: BranchResult[] }) {
  return (
    <div style={{ margin: '0 0 1.2rem' }}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '1.5rem',
          borderRadius: '5px',
          overflow: 'hidden',
        }}
      >
        {branches.map((b, i) => (
          <div
            key={i}
            style={{
              width: `${Math.max(0, Math.min(1, b.share)) * 100}%`,
              background: TRACE_COLORS[i % TRACE_COLORS.length],
            }}
            title={`R${i + 1}: ${formatSI(b.current, 'A')}`}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem 1rem',
          marginTop: '0.5rem',
          fontSize: '0.78rem',
        }}
      >
        {branches.map((b, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                width: '0.6rem',
                height: '0.6rem',
                borderRadius: '2px',
                background: TRACE_COLORS[i % TRACE_COLORS.length],
              }}
            />
            R{i + 1} {formatSI(b.r, 'Ω')}: {(b.share * 100).toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  )
}

export default function CurrentDivider() {
  const [count, setCount] = useState(3)
  const [kind, setKind] = useState<DriveKind>('voltage')
  const [supply, setSupply] = useState(VCC)
  const [series, setSeries] = useState(100)
  const [current, setCurrent] = useState(10e-3)
  const [rating, setRating] = useState(QUARTER_WATT)
  const [resistors, setResistors] = useState(DEFAULT_R)

  const setR = (i: number, v: number) =>
    setResistors((rs) => rs.map((r, j) => (j === i ? v : r)))

  const readout = useMemo(() => {
    const drive: Drive =
      kind === 'current' ? { kind: 'current', current } : { kind: 'voltage', supply, series }
    return analyse(resistors.slice(0, count), drive, rating)
  }, [count, kind, supply, series, current, rating, resistors])

  const hot = readout.branches
    .map((b, i) => (b.overPower ? `R${i + 1}` : ''))
    .filter(Boolean)
    .join(', ')

  return (
    <SimPage
      id="current-divider"
      lede="Parallel branches share a node voltage, so the current splits by conductance, not by resistance. The bar shows each branch's share of the total."
      controls={
        <>
          <Segmented
            label="Branch count"
            value={String(count)}
            onChange={(v) => setCount(Number(v))}
            options={[
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <Segmented
            label="Drive"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'voltage', label: 'Rail + Rs' },
              { value: 'current', label: 'Current source' },
            ]}
          />
          <Schematic count={count} kind={kind} />

          <Group label="Source">
            {kind === 'voltage' ? (
              <>
                <Param
                  label="Supply Vs"
                  unit="V"
                  value={supply}
                  onChange={setSupply}
                  min={0.1}
                  max={24}
                  log={false}
                  step={0.1}
                  hint="3.3 V is the ESP32 rail."
                />
                <Param
                  label="Series Rs"
                  unit="Ω"
                  value={series}
                  onChange={setSeries}
                  min={0.1}
                  max={100e3}
                />
              </>
            ) : (
              <Param
                label="Total current"
                unit="A"
                value={current}
                onChange={setCurrent}
                min={1e-6}
                max={1}
              />
            )}
          </Group>

          <Group label="Branches">
            {resistors.slice(0, count).map((r, i) => (
              <Param
                key={i}
                label={`R${i + 1}`}
                unit="Ω"
                value={r}
                onChange={(v) => setR(i, v)}
                min={1}
                max={10e6}
              />
            ))}
            <Param
              label="Resistor rating"
              unit="W"
              value={rating}
              onChange={setRating}
              min={0.031}
              max={5}
              hint="0.25 W axial, 0.125 W for 0805."
            />
          </Group>
        </>
      }
    >
      <SplitBar branches={readout.branches} />

      <ReadoutGrid
        items={[
          { label: 'Equivalent R', value: formatSI(readout.req, 'Ω') },
          {
            label: 'Node voltage',
            value: formatSI(readout.voltage, 'V'),
            note: kind === 'voltage' ? `(${formatSI(supply - readout.voltage, 'V')} across Rs)` : undefined,
          },
          {
            label: 'Total current',
            value: formatSI(readout.total, 'A'),
            note: readout.overGpio ? '(over one GPIO)' : undefined,
            warn: readout.overGpio,
          },
          { label: 'Total power', value: formatSI(readout.totalPower, 'W') },
          ...readout.branches.map((b, i) => ({
            label: `R${i + 1} current`,
            value: formatSI(b.current, 'A'),
            note: `(${(b.share * 100).toFixed(1)}%, ${formatSI(b.power, 'W')})`,
            warn: b.overPower,
          })),
        ]}
      />

      {readout.overGpio && (
        <Warning>
          Total draw is {formatSI(readout.total, 'A')}, past the {GPIO_MAX_MA} mA an ESP32 pin
          may source or sink. Feed the bank from the rail through a MOSFET or a driver, not
          straight off a GPIO.
        </Warning>
      )}
      {readout.anyOverPower && (
        <Warning>
          {hot} over the {formatSI(rating, 'W')} rating. Pick a larger part or raise the branch
          resistance.
        </Warning>
      )}
      {kind === 'current' && readout.voltage > supply && (
        <Warning>
          An ideal current source holds {formatSI(readout.total, 'A')} into any load, so the node
          sits at {formatSI(readout.voltage, 'V')}. A real 3V3 supply cannot go there: switch to
          rail plus Rs to see what the circuit actually does.
        </Warning>
      )}

      <Theory>
        <p>
          Parallel branches share one node pair, so they all see the same voltage. Conductance
          adds: <code>G = 1/R</code>, <code>Req = 1 / sum(G)</code>. Req is always smaller than
          the smallest branch, i.e. adding a path can only make the load heavier.
        </p>
        <p>
          The node sits at <code>V = Itotal·Req</code>, so each branch carries
          <code> Ix = V/Rx = Itotal·Gx / sum(G)</code>. The low-resistance branch takes the most
          current, which is the opposite of the voltage divider intuition. For two branches this
          collapses to <code>I1 = Itotal·R2 / (R1 + R2)</code>, the other resistor on top.
        </p>
        <p>
          Dissipation is <code>Px = Ix²·Rx</code>, and the branch powers sum to
          <code> V·Itotal</code>. In rail mode the source sees <code>Rs + Req</code>, so
          <code> Itotal = Vs / (Rs + Req)</code> and Rs takes the rest of the supply.
        </p>
      </Theory>
    </SimPage>
  )
}
