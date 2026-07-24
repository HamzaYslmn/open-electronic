import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { BITS_MAX, SERVO_OPTIONS, SERVO_TYPES, analyseServo } from '../engine/ledc'
import { generate } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 8192

export default function ServoPwm() {
  const [type, setType] = useState('standard')
  const [angle, setAngle] = useState(90)
  const [bits, setBits] = useState(16)
  const [frameHz, setFrameHz] = useState(50)
  const [frames, setFrames] = useState(2)

  const spec = SERVO_TYPES[type]

  const { r, traces, dt } = useMemo(() => {
    const r = analyseServo(spec, angle, bits, frameHz)
    const span = frames / frameHz
    const dt = span / N
    // The signal pin is 3.3 V logic even though the servo motor runs from 5 V.
    const samples = generate(
      { kind: 'pwm', amplitude: VCC / 2, offset: VCC / 2, frequency: frameHz, duty: r.duty },
      N,
      dt,
    )
    return { r, dt, traces: [{ label: 'servo-pwm.signal', color: TRACE_COLORS[0], samples }] }
  }, [spec, angle, bits, frameHz, frames])

  return (
    <SimPage
      id="servo-pwm"
      lede="servo-pwm.lede"
      controls={
        <>
          <Group label="servo-pwm.servo">
            <Select label="servo-pwm.pulseRange" value={type} onChange={setType} options={SERVO_OPTIONS} />
            <Param label="servo-pwm.angle" unit="°" value={angle} onChange={setAngle} min={0} max={spec.travel} log={false} step={1} />
            <Param label="servo-pwm.frameRate" unit="Hz" value={frameHz} onChange={setFrameHz} min={40} max={400} log={false} step={5} />
          </Group>
          <Group label="servo-pwm.ledcTimer">
            <Param label="common.resolution" value={bits} onChange={(v) => setBits(Math.round(v))} min={8} max={BITS_MAX} log={false} step={1} />
            <Param label="servo-pwm.framesShown" value={frames} onChange={(v) => setFrames(Math.round(v))} min={1} max={5} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'common.pulseWidth', value: formatSI(r.pulse, 's') },
          { label: 'common.duty', value: `${(r.duty * 100).toFixed(3)}%`, note: 'servo-pwm.ofTheFrame' },
          { label: 'common.dutyRegister', value: `${r.count}` },
          { label: 'servo-pwm.actualPulse', value: formatSI(r.actualPulse, 's') },
          { label: 'servo-pwm.actualAngle', value: `${r.actualAngle.toFixed(2)}°`, note: <T k="servo-pwm.asked" vars={{ angle }} /> },
          {
            label: 'servo-pwm.angularResolution',
            value: <T k="servo-pwm.step" vars={{ degreesPerStep: r.degreesPerStep.toFixed(3) }} />,
            warn: r.coarse,
          },
          {
            label: 'servo-pwm.countsOverTravel',
            value: r.countsOverTravel.toFixed(0),
            note: <T k="servo-pwm.ofTotal" vars={{ bits: Math.pow(2, bits).toLocaleString() }} />,
          },
          { label: 'servo-pwm.maxResolutionAtFrame', value: `${r.maxBits} bits` },
        ]}
      />

      {r.coarse && (
        <Warning
          text="servo-pwm.warn1"
          vars={{ degreesPerStep: r.degreesPerStep.toFixed(2), maxBits: r.maxBits }}
        />
      )}
      {frameHz > 60 && (
        <Warning
          text="servo-pwm.warn2"
        />
      )}

      <Theory
        text={[
          'servo-pwm.theory1',
          'servo-pwm.thatIsWhatMakes',
          'servo-pwm.at50HzThe',
          'servo-pwm.oneWiringNoteThe',
        ]}
        vars={{
          minPulse: formatSI(spec.minPulse, 's'),
          maxPulse: formatSI(spec.maxPulse, 's'),
          minPulse2: formatSI(spec.maxPulse - spec.minPulse, 's'),
          frameHz: (((spec.maxPulse - spec.minPulse) / (1 / frameHz)) * 100).toFixed(0),
        }}
      />
    </SimPage>
  )
}
