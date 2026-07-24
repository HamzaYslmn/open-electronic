import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import {
  I2C_SPEED_OPTIONS,
  I2C_VOL,
  analyseI2c,
  voltageAt,
} from '../engine/logic'
import type { I2cSpeed } from '../engine/logic'
import { formatSI } from '../engine/units'
import { Group, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 2048

export default function I2cPullup() {
  const [speed, setSpeed] = useState<I2cSpeed>('fast')
  const [busC, setBusC] = useState(100e-12)
  const [rPullup, setRPullup] = useState(4700)
  const [vcc, setVcc] = useState(VCC)

  const { r, traces, dt } = useMemo(() => {
    const r = analyseI2c(speed, busC, rPullup, vcc)
    // Show the release edge: the device lets go and the pull-up drags the line
    // up through RC. Window it on the chosen pull-up so the shape stays visible.
    const span = Math.max(r.rise * 4, 1e-9)
    const dt = span / N
    const chosen = new Float64Array(N)
    const recommended = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      chosen[i] = voltageAt(i * dt, rPullup, busC, vcc, I2C_VOL)
      recommended[i] = Number.isFinite(r.rRecommended)
        ? voltageAt(i * dt, r.rRecommended, busC, vcc, I2C_VOL)
        : 0
    }
    return {
      r,
      dt,
      traces: [
        { label: 'SDA', color: TRACE_COLORS[0], samples: chosen },
        ...(Number.isFinite(r.rRecommended)
          ? [{ label: 'ideal R', color: TRACE_COLORS[2], samples: recommended }]
          : []),
      ],
    }
  }, [speed, busC, rPullup, vcc])

  return (
    <SimPage
      id="i2c-pullup"
      lede="I2C is open drain: devices only pull down, so a resistor has to pull back up and the bus capacitance fights it. The scope shows the rising edge after a device releases the line, against the edge an ideally sized pull-up would give."
      controls={
        <>
          <Group label="Bus">
            <Select label="Speed" value={speed} onChange={setSpeed} options={I2C_SPEED_OPTIONS} />
            <Param label="Bus capacitance" unit="F" value={busC} onChange={setBusC} min={10e-12} max={1e-9} />
            <Param label="Supply" unit="V" value={vcc} onChange={setVcc} min={1.8} max={5.5} log={false} step={0.1} />
          </Group>
          <Group label="Pull-up">
            <Param label="Resistor" unit="Ω" value={rPullup} onChange={setRPullup} min={200} max={100_000} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'Minimum R', value: formatSI(r.rMin, 'Ω'), note: 'from the 3 mA sink limit' },
          { label: 'Maximum R', value: formatSI(r.rMax, 'Ω'), note: 'from the rise-time limit' },
          {
            label: 'Recommended',
            value: Number.isFinite(r.rRecommended) ? formatSI(r.rRecommended, 'Ω') : 'none',
            warn: r.windowEmpty,
          },
          {
            label: 'Rise time',
            value: formatSI(r.rise, 's'),
            note: `limit ${formatSI(r.spec.maxRise, 's')}`,
            warn: r.tooSlow,
          },
          {
            label: 'Rise vs bit period',
            value: `${(r.riseFraction * 100).toFixed(1)}%`,
            warn: r.riseFraction > 0.3,
          },
          { label: 'Sink current', value: formatSI(r.sinkCurrent, 'A'), note: 'while held low' },
          { label: 'Power per line', value: formatSI(r.lowPower, 'W'), note: 'static, when low' },
          {
            label: 'Bus capacitance',
            value: formatSI(busC, 'F'),
            note: `limit ${formatSI(r.spec.maxCapacitance, 'F')}`,
            warn: r.overCapacitance,
          },
        ]}
      />

      {r.windowEmpty && (
        <Warning>
          No resistance satisfies both limits here: the value needed to meet the rise time is
          already below the value a device can pull low. Shorten the bus, remove devices, or
          drop to a slower speed. This is the point where you need an active bus buffer.
        </Warning>
      )}
      {!r.windowEmpty && r.outOfWindow && (
        <Warning>
          {formatSI(rPullup, 'Ω')} is outside the {formatSI(r.rMin, 'Ω')} to{' '}
          {formatSI(r.rMax, 'Ω')} window. Too small and devices cannot hold a valid low, too
          large and the edge is too slow for the clock.
        </Warning>
      )}
      {r.overCapacitance && (
        <Warning>
          Bus capacitance is past the {formatSI(r.spec.maxCapacitance, 'F')} the specification
          allows at this speed. Each device contributes roughly 10 pF and wiring adds about
          1 pF per cm, so long ribbon runs add up fast.
        </Warning>
      )}

      <Theory>
        <p>
          Open drain means a device can only pull the line down. Releasing it leaves the bus
          capacitance to be charged through the pull-up, so the rising edge is an RC curve
          while the falling edge is nearly instant. Everything about pull-up sizing follows
          from that asymmetry.
        </p>
        <p>
          The floor comes from the low level: a device must sink enough current to hold the
          line under {I2C_VOL} V, and the specification only guarantees 3 mA. So{' '}
          <code>Rmin = (Vcc - 0.4) / 3mA</code>, about 970 Ω at 3.3 V.
        </p>
        <p>
          The ceiling comes from the edge: <code>Rmax = tr / (0.8473·Cb)</code>. The 0.8473 is{' '}
          <code>ln(0.7/0.3)</code>, from the 30% to 70% points the specification measures
          between.
        </p>
        <p>
          The window spans decades, so the sensible choice is the geometric mean rather than
          the arithmetic one. 4.7 kΩ is the traditional default and it is fine for a short
          100 kHz bus, but at 400 kHz with any real cable length it is often too weak, which
          is the usual cause of an I2C bus that works on the bench and fails with a longer
          lead.
        </p>
      </Theory>
    </SimPage>
  )
}
