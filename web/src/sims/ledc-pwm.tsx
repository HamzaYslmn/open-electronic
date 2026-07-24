import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { APB_CLOCK, BITS_MAX, analyseLedc, maxFrequency } from '../engine/ledc'
import { generate } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
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
        { label: 'ledc-pwm.pin', color: TRACE_COLORS[0], samples },
        { label: 'common.mean', color: TRACE_COLORS[2], samples: mean, quiet: true },
      ],
    }
  }, [frequency, requestedBits, duty, cycles])

  return (
    <SimPage
      id="ledc-pwm"
      lede="ledc-pwm.lede"
      controls={
        <>
          <Group label="ledc-pwm.timer">
            <Param label="common.frequency" unit="Hz" value={frequency} onChange={setFrequency} min={1} max={10e6} />
            <Param
              label="ledc-pwm.requestedBits"
              value={requestedBits}
              onChange={(v) => setRequestedBits(Math.round(v))}
              min={1}
              max={BITS_MAX}
              log={false}
              step={1}
            />
          </Group>
          <Group label="common.output">
            <Param label="common.duty" value={duty} onChange={setDuty} min={0} max={1} log={false} step={0.001} />
            <Param label="common.cyclesShown" value={cycles} onChange={(v) => setCycles(Math.round(v))} min={1} max={10} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          {
            label: 'common.usableResolution',
            value: `${r.bits} bits`,
            note: r.clamped ? <T k="ledc-pwm.clampedFrom" vars={{ requestedBits }} /> : 'ledc-pwm.asRequested',
            warn: r.clamped,
          },
          { label: 'ledc-pwm.dutySteps', value: r.stepCount.toLocaleString() },
          { label: 'ledc-pwm.maxFreqAtThis', value: formatSI(r.fMax, 'Hz') },
          { label: 'common.dutyRegister', value: `${r.count} / ${r.stepCount}` },
          { label: 'ledc-pwm.actualDuty', value: `${(r.actualDuty * 100).toFixed(3)}%`, note: <T k="ledc-pwm.asked" vars={{ duty: (duty * 100).toFixed(3) }} /> },
          { label: 'ledc-pwm.quantisationError', value: `${(r.dutyError * 100).toFixed(4)}%` },
          { label: 'ledc-pwm.stepSize', value: `${(r.stepFraction * 100).toFixed(4)}%`, note: formatSI(r.stepVolts, 'V') },
          { label: 'common.period', value: formatSI(r.period, 's') },
          { label: 'common.onTime', value: formatSI(r.onTime, 's') },
        ]}
      />

      {r.unreachable && (
        <Warning
          text="ledc-pwm.warn1"
          vars={{ frequency: formatSI(frequency, 'Hz'), APB_CLOCK: formatSI(APB_CLOCK, 'Hz') }}
        />
      )}
      {r.clamped && !r.unreachable && (
        <Warning
          text="ledc-pwm.warn2"
          vars={{
            requestedBits,
            frequency: formatSI(frequency, 'Hz'),
            bits: r.bits,
            stepCount: r.stepCount,
            requestedBits2: Math.pow(2, requestedBits).toLocaleString(),
          }}
        />
      )}
      {r.bits > 0 && r.bits < 8 && !r.unreachable && (
        <Warning
          text="ledc-pwm.warn3"
        />
      )}

      <Theory
        text={[
          'ledc-pwm.theory1',
          'ledc-pwm.thatIsAHard',
          'ledc-pwm.theDutyRegisterIs',
          'ledc-pwm.forLedsPickFrequency',
        ]} vars={{ maxFrequency: formatSI(maxFrequency(13), 'Hz') }}
      />
    </SimPage>
  )
}
