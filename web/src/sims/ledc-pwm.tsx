import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { APB_CLOCK, BITS_MAX, analyseLedc, maxFrequency } from '../engine/ledc'
import { generate } from '../engine/signal'
import { formatSI } from '../engine/units'
import { Group } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 8192

export default function LedcPwm() {
  const [frequency, setFrequency] = useState(5000)
  const [requestedBits, setRequestedBits] = useState(13)
  const [duty, setDuty] = useState(0.5)
  const [cycles, setCycles] = useState(3)

  const { r, traces, dt } = useMemo(() => {
    const r = analyseLedc(frequency, requestedBits, duty, VCC)
    const span = frequency > 0 ? cycles / frequency : 1e-3
    const dt = span / N
    // The pin swings 0 to Vcc, so amplitude and offset are both half the rail.
    const samples = generate(
      {
        kind: 'pwm',
        amplitude: VCC / 2,
        offset: VCC / 2,
        frequency,
        duty: r.actualDuty,
      },
      N,
      dt,
    )
    const mean = new Float64Array(N).fill(r.actualDuty * VCC)
    return {
      r,
      dt,
      traces: [
        { label: 'pin', color: TRACE_COLORS[0], samples },
        { label: 'mean', color: TRACE_COLORS[2], samples: mean, quiet: true },
      ],
    }
  }, [frequency, requestedBits, duty, cycles])

  return (
    <SimPage
      id="ledc-pwm"
      lede="On the ESP32 the LEDC timer divides an 80 MHz clock into 2^bits steps per period, so frequency and duty resolution trade directly against each other. Push the frequency up and the resolution collapses. The scope shows the pin waveform and its average."
      controls={
        <>
          <Group label="Timer">
            <Param label="Frequency" unit="Hz" value={frequency} onChange={setFrequency} min={1} max={10e6} />
            <Param
              label="Requested bits"
              value={requestedBits}
              onChange={(v) => setRequestedBits(Math.round(v))}
              min={1}
              max={BITS_MAX}
              log={false}
              step={1}
            />
          </Group>
          <Group label="Output">
            <Param label="Duty" value={duty} onChange={setDuty} min={0} max={1} log={false} step={0.001} />
            <Param label="Cycles shown" value={cycles} onChange={(v) => setCycles(Math.round(v))} min={1} max={10} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'Usable resolution',
            value: `${r.bits} bits`,
            note: r.clamped ? `clamped from ${requestedBits}` : 'as requested',
            warn: r.clamped,
          },
          { label: 'Duty steps', value: r.stepCount.toLocaleString() },
          { label: 'Max freq at this res', value: formatSI(r.fMax, 'Hz') },
          { label: 'Duty register', value: `${r.count} / ${r.stepCount}` },
          { label: 'Actual duty', value: `${(r.actualDuty * 100).toFixed(3)}%`, note: `asked ${(duty * 100).toFixed(3)}%` },
          { label: 'Quantisation error', value: `${(r.dutyError * 100).toFixed(4)}%` },
          { label: 'Step size', value: `${(r.stepFraction * 100).toFixed(4)}%`, note: formatSI(r.stepVolts, 'V') },
          { label: 'Period', value: formatSI(r.period, 's') },
          { label: 'On time', value: formatSI(r.onTime, 's') },
        ]}
      />

      {r.unreachable && (
        <Warning>
          {formatSI(frequency, 'Hz')} is not reachable at any resolution: even 1 bit needs the
          clock to be at least twice the output frequency, and the LEDC source is{' '}
          {formatSI(APB_CLOCK, 'Hz')}.
        </Warning>
      )}
      {r.clamped && !r.unreachable && (
        <Warning>
          {requestedBits} bits is impossible at {formatSI(frequency, 'Hz')}. The timer silently
          uses {r.bits} bits, which is {r.stepCount} steps rather than the{' '}
          {Math.pow(2, requestedBits).toLocaleString()} you asked for. Calling
          ledcSetup with an unsupported pair does not error, it just gives you less than you
          expect, which is a common source of banding on dimmed LEDs.
        </Warning>
      )}
      {r.bits > 0 && r.bits < 8 && !r.unreachable && (
        <Warning>
          Under 8 bits the steps are visible on an LED. For smooth dimming keep the frequency
          low enough for 10 bits or more, and remember perceived brightness is roughly the
          square of duty, so the low end needs the finest steps.
        </Warning>
      )}

      <Theory>
        <p>
          The LEDC timer counts to <code>2^bits</code> once per PWM period from an 80 MHz
          source, so the fastest it can run at a given resolution is{' '}
          <code>f_max = 80 MHz / 2^bits</code>. Rearranged, the best resolution at a given
          frequency is <code>floor(log2(80e6 / f))</code>.
        </p>
        <p>
          That is a hard trade. 13 bits, the Arduino default, caps out at{' '}
          {formatSI(maxFrequency(13), 'Hz')}. Wanting 100 kHz for a buck converter leaves only
          9 bits. Wanting 1 MHz leaves 6, which is 64 steps and useless for anything analogue.
        </p>
        <p>
          The duty register is an integer, so the achievable duty is quantised to{' '}
          <code>1/2^bits</code>. Filtered into an analogue voltage that step is{' '}
          <code>Vcc/2^bits</code>, which is the real resolution of a PWM DAC: at 3.3 V and 10
          bits it is about 3.2 mV, and no amount of filtering recovers anything finer.
        </p>
        <p>
          For LEDs pick frequency above about 200 Hz to avoid visible flicker, and well above
          that if the light will ever be filmed. For motors, above 20 kHz puts the switching
          whine out of hearing, but check the resolution you have left at that frequency.
        </p>
      </Theory>
    </SimPage>
  )
}
