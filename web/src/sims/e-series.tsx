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
import { T, sym } from '../i18n'
import { Group, Param, ReadoutGrid, Segmented, SimPage, Theory, Warning } from '../ui'

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
      lede="e-series.lede"
      controls={
        <>
          <Group label="common.target">
            <Param
              label="common.resistance"
              unit="Ω"
              value={target}
              onChange={setTarget}
              min={R_MIN}
              // Past R_MAX on purpose: the search pool stops at 10 MOhm, and
              // asking for more should say so rather than silently clamp.
              max={100 * R_MAX}
              hint="e-series.typeTheRawNumber"
            />
          </Group>

          <Group label="e-series.preferredSeries">
            <Segmented
              label="e-series.eSeries"
              value={series}
              onChange={setSeries}
              options={SERIES_NAMES.map((s) => ({ value: s, label: sym(s) }))}
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
            label: 'e-series.nearestStandardValue',
            value: formatSI(r.single, 'Ω'),
            note: pct(r.singleError),
            warn: !r.inBand,
          },
          {
            label: 'e-series.neighbours',
            value: `${formatSI(r.below, 'Ω')} / ${formatSI(r.above, 'Ω')}`,
            note: `(${pct(r.below / target - 1, 1)} / ${pct(r.above / target - 1, 1)})`,
          },
          {
            label: <T k="e-series.toleranceBandAt" vars={{ tolerance: span(r.tolerance) }} />,
            value: `${formatSI(r.bandLow, 'Ω')} to ${formatSI(r.bandHigh, 'Ω')}`,
            note: r.inBand ? 'e-series.targetCovered' : 'e-series.targetOutside',
          },
          {
            label: 'e-series.twoInSeries',
            value: comboValue(r.seriesPair, '+'),
            note: comboNote(r.seriesPair),
            warn: r.seriesPair === null,
          },
          {
            label: 'e-series.twoInParallel',
            value: comboValue(r.parallelPair, '||'),
            note: comboNote(r.parallelPair),
            warn: r.parallelPair === null,
          },
          {
            label: 'e-series.bestOfTheThree',
            value: best && Math.abs(best.error) < Math.abs(r.singleError) ? 'e-series.pair' : 'e-series.singlePart',
            note:
              best && Math.abs(best.error) < Math.abs(r.singleError)
                ? <T k="e-series.against" vars={{ error: pct(best.error), singleError: pct(r.singleError) }} />
                : 'e-series.noPairBeatsThe',
          },
          {
            label: <T k="e-series.worstCaseFor" vars={{ series }} />,
            value: span(r.worstCase, 1),
            note:
              r.worstCase > r.tolerance
                ? <T k="e-series.widestGapPastThe" vars={{ tolerance: span(r.tolerance) }} />
                : <T k="e-series.widestGapInsideThe" vars={{ tolerance: span(r.tolerance) }} />,
          },
          {
            label: 'e-series.stepRatio',
            value: `${(10 ** (1 / r.steps)).toFixed(4)}x`,
            note: <T k="e-series.101HalfStep" vars={{ steps: r.steps, halfStep: span(r.halfStep, 2) }} />,
          },
        ]}
      />

      <Warning when={r.outOfRange}
        text="e-series.warn1"
        vars={{ target: formatSI(target, 'Ω') }}
      />

      <Warning when={!r.inBand && !r.outOfRange}
        text="e-series.warn2"
        vars={{
          series,
          target: formatSI(target, 'Ω'),
          tolerance: span(r.tolerance),
          single: formatSI(r.single, 'Ω'),
          bandLow: formatSI(r.bandLow, 'Ω'),
          bandHigh: formatSI(r.bandHigh, 'Ω'),
        }}
      />

      <Theory
        text={[
          'e-series.theory1',
          'e-series.e48AndE96Are',
          'e-series.theToleranceGradesExist',
          'e-series.pairsAreSearchedOver',
          'e-series.mantissas',
        ]}
        vars={{
          maxRatio: r.maxRatio,
          series,
          mantissas: mantissas.map((m) => m.toFixed(2)).join(', '),
        }}
      />
    </SimPage>
  )
}
