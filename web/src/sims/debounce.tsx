import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { VIH_FRAC, VIL_FRAC, analyseDebounce, voltageAt } from '../engine/logic'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 4096

/**
 * A contact bounce burst: the switch slams closed, chatters for `bounce`
 * seconds with progressively shorter open intervals, then settles. Real bounce
 * is chaotic; this is a deterministic stand-in with the same character.
 */
function bounceBurst(t: number, bounce: number): boolean {
  if (t < 0) return false
  if (t >= bounce) return true
  // Intervals shrink geometrically, which is what a real contact does as its
  // kinetic energy is dissipated.
  const phase = 1 - t / bounce
  const period = bounce * 0.18 * phase * phase + 1e-9
  return Math.floor(t / period) % 2 === 1
}

export default function Debounce() {
  const [r, setR] = useState(10_000)
  const [c, setC] = useState(1e-6)
  const [bounceMs, setBounceMs] = useState(5)
  const [pressRate, setPressRate] = useState(5)
  const [vcc, setVcc] = useState(VCC)

  const { readout, traces, dt } = useMemo(() => {
    const bounce = bounceMs / 1000
    const readout = analyseDebounce(r, c, bounce, pressRate, vcc)
    // Frame the whole event: the bounce burst plus enough settling to see the
    // filtered node cross the threshold.
    const span = Math.max(bounce * 4, readout.tRise * 3, 1e-4)
    const dt = span / N
    const raw = new Float64Array(N)
    const filtered = new Float64Array(N)
    const threshold = new Float64Array(N)

    // Pull-up to Vcc, switch to ground: closed contact means the node is low.
    let v = vcc
    for (let i = 0; i < N; i++) {
      const t = i * dt
      const closed = bounceBurst(t, bounce)
      raw[i] = closed ? 0 : vcc
      // Exact zero-order hold toward whichever rail the contact selects. A
      // closed contact discharges C through nothing but its own resistance, so
      // it collapses fast; open lets the pull-up charge it through R.
      v = closed ? voltageAt(dt, 1, c, 0, v) : voltageAt(dt, r, c, vcc, v)
      filtered[i] = v
      threshold[i] = VIH_FRAC * vcc
    }
    return {
      readout,
      dt,
      traces: [
        { label: 'debounce.raw', color: TRACE_COLORS[4], samples: raw },
        { label: 'debounce.filtered', color: TRACE_COLORS[0], samples: filtered },
        { label: 'common.vih', color: TRACE_COLORS[3], samples: threshold, quiet: true },
      ],
    }
  }, [r, c, bounceMs, pressRate, vcc])

  return (
    <SimPage
      id="debounce"
      lede="debounce.lede"
      controls={
        <>
          <Group label="common.filter">
            <Param label="common.resistor" unit="Ω" value={r} onChange={setR} min={100} max={1e6} />
            <Param label="common.capacitor" unit="F" value={c} onChange={setC} min={1e-9} max={1e-4} />
          </Group>
          <Group label="debounce.switchAndInput">
            <Param label="debounce.bounceDuration" unit="ms" value={bounceMs} onChange={setBounceMs} min={0.1} max={50} />
            <Param label="debounce.pressesPerSecond" value={pressRate} onChange={setPressRate} min={0.5} max={50} log={false} step={0.5} />
            <Param label="debounce.logicSupply" unit="V" value={vcc} onChange={setVcc} min={1.8} max={5.5} log={false} step={0.1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'common.timeConstant', value: formatSI(readout.tau, 's') },
          {
            label: 'debounce.riseToVih',
            value: formatSI(readout.tRise, 's'),
            note: <T k="debounce.ofVcc" vars={{ VIH_FRAC: (VIH_FRAC * 100).toFixed(0) }} />,
            warn: readout.tooFast,
          },
          { label: 'debounce.fallToVil', value: formatSI(readout.tFall, 's'), note: <T k="debounce.ofVcc2" vars={{ VIL_FRAC: (VIL_FRAC * 100).toFixed(0) }} /> },
          {
            label: 'debounce.glitchesRejectedUpTo',
            value: formatSI(readout.rejected, 's'),
            note: <T k="debounce.bounceIs" vars={{ bounceMs: formatSI(bounceMs / 1000, 's') }} />,
            warn: readout.tooFast,
          },
          {
            label: 'debounce.maximumPressRate',
            value: formatSI(readout.maxRate, 'Hz'),
            note: <T k="debounce.youWantHz" vars={{ pressRate }} />,
            warn: readout.tooSlow,
          },
          { label: 'debounce.contactCurrent', value: formatSI(readout.contactCurrent, 'A'), note: 'debounce.wetsTheContact' },
        ]}
      />

      {readout.tooFast && (
        <Warning
          text="debounce.warn1"
          vars={{
            tRise: formatSI(readout.tRise, 's'),
            bounceMs: formatSI(bounceMs / 1000, 's'),
          }}
        />
      )}
      {readout.tooSlow && (
        <Warning
          text="debounce.warn2"
          vars={{ maxRate: formatSI(readout.maxRate, 'Hz'), pressRate }}
        />
      )}
      {readout.contactCurrent < 1e-4 && (
        <Warning
          text="debounce.warn3"
          vars={{ contactCurrent: formatSI(readout.contactCurrent, 'A') }}
        />
      )}

      <Theory
        text={[
          'debounce.theory1',
          'debounce.theRcFilterTurns',
          'debounce.theDesignHasTwo',
          'debounce.noteTheAsymmetryOn',
        ]} vars={{ VIH_FRAC: (VIH_FRAC * 100).toFixed(0) }}
      />
    </SimPage>
  )
}
