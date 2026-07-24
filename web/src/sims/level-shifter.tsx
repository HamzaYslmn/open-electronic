import { useMemo, useState } from 'react'
import { VCC, VCC_5V } from '../engine/constants'
import { BSS138_VGS_TH, analyseShifter } from '../engine/parts'
import type { ShifterKind } from '../engine/parts'
import { voltageAt } from '../engine/logic'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 2048

export default function LevelShifter() {
  const [kind, setKind] = useState<ShifterKind>('bss138')
  const [vLow, setVLow] = useState(VCC)
  const [vHigh, setVHigh] = useState(VCC_5V)
  const [rPullup, setRPullup] = useState(10_000)
  const [capacitance, setCapacitance] = useState(50e-12)
  const [bitRate, setBitRate] = useState(400e3)
  const [r1, setR1] = useState(10_000)
  const [r2, setR2] = useState(20_000)

  const { r, traces, dt } = useMemo(() => {
    const r = analyseShifter(kind, vLow, vHigh, rPullup, capacitance, bitRate, r1, r2)
    const span = Math.max(r.worstRise * 4, 1e-9)
    const dt = span / N
    const rEff = kind === 'divider' ? (r1 * r2) / (r1 + r2) : rPullup
    const target = kind === 'divider' ? r.dividerOut : vLow
    const edge = new Float64Array(N)
    const threshold = new Float64Array(N).fill(0.7 * vLow)
    for (let i = 0; i < N; i++) edge[i] = voltageAt(i * dt, rEff, capacitance, target, 0)
    return {
      r,
      dt,
      traces: [
        { label: 'edge', color: TRACE_COLORS[0], samples: edge },
        { label: 'VIH', color: TRACE_COLORS[4], samples: threshold, quiet: true },
      ],
    }
  }, [kind, vLow, vHigh, rPullup, capacitance, bitRate, r1, r2])

  return (
    <SimPage
      id="level-shifter"
      lede="Getting 3.3 V and 5 V parts to talk. The scope shows the rising edge at the low-side receiver against its logic-high threshold: if the curve does not clear the line quickly, the link is unreliable however correct the DC levels look."
      controls={
        <>
          <Segmented
            label="Method"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'bss138', label: 'BSS138 FET' },
              { value: 'divider', label: 'Divider' },
            ]}
          />
          <Group label="Rails">
            <Param label="Low side" unit="V" value={vLow} onChange={setVLow} min={1.2} max={5} log={false} step={0.1} />
            <Param label="High side" unit="V" value={vHigh} onChange={setVHigh} min={1.2} max={12} log={false} step={0.1} />
          </Group>
          {kind === 'bss138' ? (
            <Group label="Pull-ups">
              <Param label="Pull-up" unit="Ω" value={rPullup} onChange={setRPullup} min={500} max={100_000} />
            </Group>
          ) : (
            <Group label="Divider">
              <Param label="R1 (series)" unit="Ω" value={r1} onChange={setR1} min={100} max={100_000} />
              <Param label="R2 (to ground)" unit="Ω" value={r2} onChange={setR2} min={100} max={100_000} />
            </Group>
          )}
          <Group label="Bus">
            <Param label="Capacitance" unit="F" value={capacitance} onChange={setCapacitance} min={5e-12} max={1e-9} />
            <Param label="Bit rate" unit="Hz" value={bitRate} onChange={setBitRate} min={1e3} max={20e6} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={
          kind === 'bss138'
            ? [
                { label: 'Gate drive VGS', value: formatSI(r.vgs, 'V') },
                {
                  label: 'Margin over Vth',
                  value: formatSI(r.vgsMargin, 'V'),
                  note: `Vth ${BSS138_VGS_TH} V`,
                  warn: r.insufficientDrive,
                },
                { label: 'Rise time', value: formatSI(r.worstRise, 's') },
                { label: 'Max bit rate', value: formatSI(r.maxBitRate, 'Hz'), warn: r.tooSlow },
                { label: 'Pull-up current', value: formatSI(vLow / rPullup, 'A'), note: 'per line, when low' },
              ]
            : [
                { label: 'Divider output', value: formatSI(r.dividerOut, 'V'), warn: r.dividerTooLow },
                { label: 'Needs at least', value: formatSI(0.7 * vLow, 'V'), note: '0.7 x low rail' },
                { label: 'Rise time', value: formatSI(r.worstRise, 's') },
                { label: 'Max bit rate', value: formatSI(r.maxBitRate, 'Hz'), warn: r.tooSlow },
                { label: 'Divider current', value: formatSI(vHigh / (r1 + r2), 'A'), note: 'continuous' },
              ]
        }
      />

      {r.insufficientDrive && (
        <Warning>
          Only {formatSI(r.vgsMargin, 'V')} of gate drive over the threshold. The FET turns on
          weakly and slowly, so edges degrade and the shifter becomes unreliable at temperature
          extremes where Vth shifts. Below about 1.8 V on the low side, use a dedicated shifter
          IC instead.
        </Warning>
      )}
      {r.tooSlow && (
        <Warning>
          The edge takes {formatSI(r.worstRise, 's')}, which caps the usable rate at about{' '}
          {formatSI(r.maxBitRate, 'Hz')}. At {formatSI(bitRate, 'Hz')} the signal never reaches
          a valid level before it is asked to change again. Use a stronger pull-up or reduce
          bus capacitance.
        </Warning>
      )}
      {kind === 'divider' && (
        <Warning>
          A divider only shifts high to low. It cannot drive the high side from the low side, so
          it is useless for anything bidirectional such as I2C, and it wastes current
          continuously whenever the line is high.
        </Warning>
      )}

      <Theory>
        <p>
          The BSS138 circuit is deceptively clever. The FET's gate sits at the low-side rail and
          its source faces the low side. Pull the low side down and VGS becomes the full low
          rail, turning the FET on and dragging the high side down with it. Drive the high side
          low and the body diode conducts first, pulling the source down, which then turns the
          FET on properly. That is what makes one FET bidirectional.
        </p>
        <p>
          The consequence is that it is an open-drain circuit: it can only pull down, and both
          sides need pull-ups. Speed is therefore set entirely by the RC of the pull-up against
          bus capacitance, exactly as with I2C. These boards top out around a few hundred kHz
          with typical 10 kΩ pull-ups.
        </p>
        <p>
          Gate drive matters. With a 1.3 V threshold, a 3.3 V low rail gives 2 V of overdrive
          and works well. A 1.8 V rail leaves only 0.5 V, which is marginal and drifts with
          temperature.
        </p>
        <p>
          A resistor divider is fine for one-way signals into a 3.3 V input, and nothing else.
          It is unidirectional, it loads the driver continuously, and its own RC is set by the
          parallel combination of the two resistors, so making it low-current makes it slow.
        </p>
      </Theory>
    </SimPage>
  )
}
