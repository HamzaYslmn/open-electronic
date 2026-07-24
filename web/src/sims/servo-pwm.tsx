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
    return { r, dt, traces: [{ label: 'signal', color: TRACE_COLORS[0], samples }] }
  }, [spec, angle, bits, frameHz, frames])

  return (
    <SimPage
      id="servo-pwm"
      lede="A hobby servo reads the width of a pulse, not its duty, and ignores the rest of the 20 ms frame. That makes duty resolution the limiting factor: only 5 to 10% of the register range does anything at all. The scope shows the signal pin over a couple of frames."
      controls={
        <>
          <Group label="Servo">
            <Select label="Pulse range" value={type} onChange={setType} options={SERVO_OPTIONS} />
            <Param label="Angle" unit="°" value={angle} onChange={setAngle} min={0} max={spec.travel} log={false} step={1} />
            <Param label="Frame rate" unit="Hz" value={frameHz} onChange={setFrameHz} min={40} max={400} log={false} step={5} />
          </Group>
          <Group label="LEDC timer">
            <Param label="Resolution" value={bits} onChange={(v) => setBits(Math.round(v))} min={8} max={BITS_MAX} log={false} step={1} />
            <Param label="Frames shown" value={frames} onChange={(v) => setFrames(Math.round(v))} min={1} max={5} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'Pulse width', value: formatSI(r.pulse, 's') },
          { label: 'Duty', value: `${(r.duty * 100).toFixed(3)}%`, note: 'of the frame' },
          { label: 'Duty register', value: `${r.count}` },
          { label: 'Actual pulse', value: formatSI(r.actualPulse, 's') },
          { label: 'Actual angle', value: `${r.actualAngle.toFixed(2)}°`, note: <T k="asked {angle}°" vars={{ angle }} /> },
          {
            label: 'Angular resolution',
            value: <T k="{degreesPerStep}°/step" vars={{ degreesPerStep: r.degreesPerStep.toFixed(3) }} />,
            warn: r.coarse,
          },
          {
            label: 'Counts over travel',
            value: r.countsOverTravel.toFixed(0),
            note: <T k="of {bits} total" vars={{ bits: Math.pow(2, bits).toLocaleString() }} />,
          },
          { label: 'Max resolution at frame rate', value: `${r.maxBits} bits` },
        ]}
      />

      {r.coarse && (
        <Warning
          text="{degreesPerStep}° per step is coarser than the servo itself can resolve, so the controller is the limit, not the machine. Raise the LEDC resolution: at 50 Hz you can use up to {maxBits} bits at no cost."
          vars={{ degreesPerStep: r.degreesPerStep.toFixed(2), maxBits: r.maxBits }}
        />
      )}
      {frameHz > 60 && (
        <Warning
          text="Above about 60 Hz you are outside what an analogue servo expects. Many digital servos accept 200 to 333 Hz and respond faster, but an analogue one may buzz, overheat or simply ignore the extra frames. Check the specification before pushing the frame rate."
        />
      )}

      <Theory
        text={[
          "Servo position is encoded purely in pulse width: {minPulse} at one end of travel, {maxPulse} at the other, repeated every 20 ms. The gap between pulses carries no information, it just refreshes the command.",
          "That is what makes resolution awkward. The whole useful range is {minPulse2} out of a 20 ms frame, so only about {frameHz}% of the duty register does anything. At 8 bits that leaves roughly 13 counts for the entire travel, about 14° per step, which is why naive Arduino code with a low LEDC resolution produces jerky servos.",
          "At 50 Hz the LEDC timer allows up to 20 bits, so there is no reason to be stingy: use 16 bits and you get thousands of counts over the travel, well past what the servo's own potentiometer and gearbox can resolve.",
          "One wiring note: the signal pin is happy at 3.3 V because servos read it as logic, but the motor itself wants 5 V or more and draws amps when stalled. Never power a servo from the ESP32 board's regulator, and keep the grounds common.",
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
