import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import {
  R_MAX,
  R_MIN,
  SERIES_NAMES,
  analyse,
  decade,
  seriesValues,
} from '../engine/eseries'
import type { Combo, SeriesName } from '../engine/eseries'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/**
 * Default target: the top leg of a 12 V battery sense divider into the ESP32
 * ADC, with a 10k bottom leg. R1 = R2·(Vin/VCC - 1) = 26.36k, which is exactly
 * the kind of number nobody sells.
 */
const DEFAULT_TARGET = 10_000 * (12 / VCC - 1)

/** Signed percentage for errors, e.g. "+2.42 %". */
function pct(x: number, digits = 2): string {
  if (!Number.isFinite(x)) return 'n/a'
  if (x === 0) return '0 %'
  return `${x > 0 ? '+' : ''}${(x * 100).toFixed(digits)} %`
}

/** Unsigned percentage for tolerances and spans, e.g. "5 %". */
function span(x: number, digits = 0): string {
  return Number.isFinite(x) ? `${(x * 100).toFixed(digits)} %` : 'n/a'
}

function comboValue(c: Combo | null, join: string): string {
  return c ? `${formatSI(c.a, 'Ω')} ${join} ${formatSI(c.b, 'Ω')}` : 'none in range'
}

function comboNote(c: Combo | null): string {
  return c ? `= ${formatSI(c.value, 'Ω')}, ${pct(c.error)}` : ''
}

export default function ESeries() {
  const [target, setTarget] = useState(DEFAULT_TARGET)
  const [series, setSeries] = useState<SeriesName>('E24')

  const { r, mantissas, stocked } = useMemo(
    () => ({
      r: analyse(target, series),
      mantissas: decade(series),
      stocked: seriesValues(series).length,
    }),
    [target, series],
  )

  const best = [r.seriesPair, r.parallelPair]
    .filter((c): c is Combo => c !== null)
    .sort((a, b) => Math.abs(a.error) - Math.abs(b.error))[0]

  return (
    <SimPage
      id="e-series"
      lede="Calculators hand you numbers like 26.36 kΩ. Stock does not. This picks the closest preferred value and the two-resistor pairs that get closer."
      controls={
        <>
          <Group label="Target">
            <Param
              label="Resistance"
              unit="Ω"
              value={target}
              onChange={setTarget}
              min={R_MIN}
              // Past R_MAX on purpose: the search pool stops at 10 MOhm, and
              // asking for more should say so rather than silently clamp.
              max={100 * R_MAX}
              hint="Type the raw number your divider or current limit asked for."
            />
          </Group>

          <Group label="Preferred series">
            <Segmented
              label="E series"
              value={series}
              onChange={setSeries}
              options={SERIES_NAMES.map((s) => ({ value: s, label: s }))}
            />
            <p className="param-hint">
              {r.steps} values per decade at {span(r.tolerance)}{' '}
              tolerance, {stocked} between 1 Ω and 10 MΩ.
            </p>
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'Nearest standard value',
            value: formatSI(r.single, 'Ω'),
            note: pct(r.singleError),
            warn: !r.inBand,
          },
          {
            label: 'Neighbours',
            value: `${formatSI(r.below, 'Ω')} / ${formatSI(r.above, 'Ω')}`,
            note: `(${pct(r.below / target - 1, 1)} / ${pct(r.above / target - 1, 1)})`,
          },
          {
            label: `Tolerance band at ${span(r.tolerance)}`,
            value: `${formatSI(r.bandLow, 'Ω')} to ${formatSI(r.bandHigh, 'Ω')}`,
            note: r.inBand ? '(target covered)' : '(target outside)',
          },
          {
            label: 'Two in series',
            value: comboValue(r.seriesPair, '+'),
            note: comboNote(r.seriesPair),
            warn: r.seriesPair === null,
          },
          {
            label: 'Two in parallel',
            value: comboValue(r.parallelPair, '||'),
            note: comboNote(r.parallelPair),
            warn: r.parallelPair === null,
          },
          {
            label: 'Best of the three',
            value: best && Math.abs(best.error) < Math.abs(r.singleError) ? 'pair' : 'single part',
            note:
              best && Math.abs(best.error) < Math.abs(r.singleError)
                ? `${pct(best.error)} against ${pct(r.singleError)}`
                : 'no pair beats the single value',
          },
          {
            label: `Worst case for ${series}`,
            value: span(r.worstCase, 1),
            note:
              r.worstCase > r.tolerance
                ? `(widest gap, past the ${span(r.tolerance)} grade)`
                : `(widest gap, inside the ${span(r.tolerance)} grade)`,
          },
          {
            label: 'Step ratio',
            value: `${(10 ** (1 / r.steps)).toFixed(4)}x`,
            note: `(10^(1/${r.steps}), half step ${span(r.halfStep, 2)})`,
          },
        ]}
      />

      {r.outOfRange && (
        <Warning>
          {formatSI(target, 'Ω')} is outside the 1 Ω to 10 MΩ range searched here, so the
          answers above are clamped to the end of the table rather than extrapolated.
          Real stock does go further, but not in a form you would put in a divider.
        </Warning>
      )}

      {!r.inBand && !r.outOfRange && (
        <Warning>
          No {series} part covers {formatSI(target, 'Ω')}: even at its {span(r.tolerance)} grade,{' '}
          {formatSI(r.single, 'Ω')} only reaches {formatSI(r.bandLow, 'Ω')} to{' '}
          {formatSI(r.bandHigh, 'Ω')}. Use a pair, move to a finer series, or redesign
          around a value the series actually has.
        </Warning>
      )}

      <Theory>
        <p>
          A preferred series splits each decade into N logarithmic steps, so
          <code> value = 10^(k/N)</code> for <code>k = 0..N-1</code>, rounded to two
          significant figures for E6, E12 and E24 and three for E48 and E96. Each step is
          a fixed ratio of <code>10^(1/N)</code>, which is why the same mantissas repeat
          from ohms to megohms. Error against a target is
          <code> (Rstd - Rtarget) / Rtarget</code>.
        </p>
        <p>
          E48 and E96 are exactly that rounding. E6, E12 and E24 are not: IEC 60063 keeps
          the historical 27, 33, 39, 47 and 82 where the arithmetic gives 26.1, 31.6,
          38.3, 46.4 and 82.5. That is why E24 has a 13 to 15 gap worth 7.1% while its
          grade is only 5%.
        </p>
        <p>
          The tolerance grades exist to close those gaps. The worst target sits at the
          midpoint of a gap <code>[a, b]</code>, an error of <code>(b - a) / (b + a)</code>
          away from either neighbour: exactly 20% for E6, so a 20% part always covers it.
          Every finer grade leaves a sliver open, E24 worst at 7.1% against a 5% part, so
          some targets sit between two parts whichever one you buy. That is what the
          tolerance band readout is checking.
        </p>
        <p>
          Pairs are searched over the whole 1 Ω to 10 MΩ table. Both{' '}
          <code>a + b</code> and <code>a·b / (a + b)</code> rise monotonically with b, so
          for each a the best partner is the table entry nearest the exact one, which
          makes the search a binary search per candidate rather than every pair. Parts are
          kept within {r.maxRatio}x of each other: past that the smaller one trims the
          result by less than the larger one's own tolerance, so the pair is a fiction.
        </p>
        <p>
          {series} mantissas: <code>{mantissas.map((m) => m.toFixed(2)).join(', ')}</code>
        </p>
      </Theory>
    </SimPage>
  )
}
