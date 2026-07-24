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
        { label: 'raw', color: TRACE_COLORS[4], samples: raw },
        { label: 'filtered', color: TRACE_COLORS[0], samples: filtered },
        { label: 'VIH', color: TRACE_COLORS[3], samples: threshold, quiet: true },
      ],
    }
  }, [r, c, bounceMs, pressRate, vcc])

  return (
    <SimPage
      id="debounce"
      lede="A mechanical contact does not close once, it chatters for a few milliseconds. The scope shows the raw contact against the RC-filtered node and the input's logic-high threshold: the filter must ride over the whole burst without crossing back."
      controls={
        <>
          <Group label="Filter">
            <Param label="Resistor" unit="Ω" value={r} onChange={setR} min={100} max={1e6} />
            <Param label="Capacitor" unit="F" value={c} onChange={setC} min={1e-9} max={1e-4} />
          </Group>
          <Group label="Switch and input">
            <Param label="Bounce duration" unit="ms" value={bounceMs} onChange={setBounceMs} min={0.1} max={50} />
            <Param label="Presses per second" value={pressRate} onChange={setPressRate} min={0.5} max={50} log={false} step={0.5} />
            <Param label="Logic supply" unit="V" value={vcc} onChange={setVcc} min={1.8} max={5.5} log={false} step={0.1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'Time constant', value: formatSI(readout.tau, 's') },
          {
            label: 'Rise to VIH',
            value: formatSI(readout.tRise, 's'),
            note: <T k="{VIH_FRAC}% of Vcc" vars={{ VIH_FRAC: (VIH_FRAC * 100).toFixed(0) }} />,
            warn: readout.tooFast,
          },
          { label: 'Fall to VIL', value: formatSI(readout.tFall, 's'), note: <T k="{VIL_FRAC}% of Vcc" vars={{ VIL_FRAC: (VIL_FRAC * 100).toFixed(0) }} /> },
          {
            label: 'Glitches rejected up to',
            value: formatSI(readout.rejected, 's'),
            note: <T k="bounce is {bounceMs}" vars={{ bounceMs: formatSI(bounceMs / 1000, 's') }} />,
            warn: readout.tooFast,
          },
          {
            label: 'Maximum press rate',
            value: formatSI(readout.maxRate, 'Hz'),
            note: <T k="you want {pressRate} Hz" vars={{ pressRate }} />,
            warn: readout.tooSlow,
          },
          { label: 'Contact current', value: formatSI(readout.contactCurrent, 'A'), note: 'wets the contact' },
        ]}
      />

      {readout.tooFast && (
        <Warning
          text="The filter settles in {tRise}, faster than the {bounceMs} of bounce, so chatter still reaches the pin. Raise R or C until the rise time comfortably exceeds the bounce duration."
          vars={{
            tRise: formatSI(readout.tRise, 's'),
            bounceMs: formatSI(bounceMs / 1000, 's'),
          }}
        />
      )}
      {readout.tooSlow && (
        <Warning
          text="At {maxRate} the filter cannot follow {pressRate} presses per second. Real presses will be merged or missed entirely."
          vars={{ maxRate: formatSI(readout.maxRate, 'Hz'), pressRate }}
        />
      )}
      {readout.contactCurrent < 1e-4 && (
        <Warning
          text="Only {contactCurrent} flows through the contact. Dry switching below about 100 µA lets oxide build up on the contact faces, which eventually stops the switch working at all. Lower R if the switch is a mechanical one."
          vars={{ contactCurrent: formatSI(readout.contactCurrent, 'A') }}
        />
      )}

      <Theory
        text={[
          "Contacts bounce because they are springs. The moving contact strikes the fixed one and rebounds, making and breaking several times over roughly 1 to 10 ms for a typical tactile switch, longer for larger levers and relays.",
          "The RC filter turns each brief opening into a small exponential wobble instead of a full rail-to-rail transition. The node only registers as high once it crosses VIH, which for an ESP32 is about {VIH_FRAC}% of the supply, and that takes `t = -R·C·ln(1 - VIH/Vcc)`, i.e. 1.386 time constants.",
          "The design has two sides. Too fast and the chatter gets through. Too slow and you cannot press the button quickly, and the slow edge spends a long time in the forbidden zone between VIL and VIH, where an input without a Schmitt trigger can oscillate. This is exactly why you want a Schmitt input here, and the ESP32 GPIOs have one.",
          "Note the asymmetry on the trace: closing the switch shorts the capacitor straight to ground so the fall is almost instant, while opening it has to charge C through R. Only the rising edge is actually filtered, which is why a debounce that looks fine on press can still bounce on release.",
        ]} vars={{ VIH_FRAC: (VIH_FRAC * 100).toFixed(0) }}
      />
    </SimPage>
  )
}
