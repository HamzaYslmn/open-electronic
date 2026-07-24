import { useMemo, useState } from 'react'
import { VCC, VCC_5V } from '../engine/constants'
import { BSS138_VGS_TH, analyseShifter } from '../engine/parts'
import type { ShifterKind } from '../engine/parts'
import { voltageAt } from '../engine/logic'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
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
        { label: 'level-shifter.edge', color: TRACE_COLORS[0], samples: edge },
        { label: 'common.vih', color: TRACE_COLORS[4], samples: threshold, quiet: true },
      ],
    }
  }, [kind, vLow, vHigh, rPullup, capacitance, bitRate, r1, r2])

  return (
    <SimPage
      id="level-shifter"
      lede="level-shifter.lede"
      controls={
        <>
          <Segmented
            label="common.method"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'bss138', label: 'level-shifter.bss138Fet' },
              { value: 'divider', label: 'common.divider' },
            ]}
          />
          <Group label="common.rails">
            <Param label="level-shifter.lowSide" unit="V" value={vLow} onChange={setVLow} min={1.2} max={5} log={false} step={0.1} />
            <Param label="level-shifter.highSide" unit="V" value={vHigh} onChange={setVHigh} min={1.2} max={12} log={false} step={0.1} />
          </Group>
          {kind === 'bss138' ? (
            <Group label="level-shifter.pullUps">
              <Param label="common.pullUp" unit="Ω" value={rPullup} onChange={setRPullup} min={500} max={100_000} />
            </Group>
          ) : (
            <Group label="common.divider">
              <Param label="level-shifter.r1Series" unit="Ω" value={r1} onChange={setR1} min={100} max={100_000} />
              <Param label="level-shifter.r2ToGround" unit="Ω" value={r2} onChange={setR2} min={100} max={100_000} />
            </Group>
          )}
          <Group label="common.bus">
            <Param label="common.capacitance" unit="F" value={capacitance} onChange={setCapacitance} min={5e-12} max={1e-9} />
            <Param label="level-shifter.bitRate" unit="Hz" value={bitRate} onChange={setBitRate} min={1e3} max={20e6} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={
          kind === 'bss138'
            ? [
                { label: 'common.gateDriveVgs', value: formatSI(r.vgs, 'V') },
                {
                  label: 'level-shifter.marginOverVth',
                  value: formatSI(r.vgsMargin, 'V'),
                  note: <T k="level-shifter.vthV" vars={{ BSS138_VGS_TH }} />,
                  warn: r.insufficientDrive,
                },
                { label: 'common.riseTime', value: formatSI(r.worstRise, 's') },
                { label: 'level-shifter.maxBitRate', value: formatSI(r.maxBitRate, 'Hz'), warn: r.tooSlow },
                { label: 'level-shifter.pullUpCurrent', value: formatSI(vLow / rPullup, 'A'), note: 'level-shifter.perLineWhenLow' },
              ]
            : [
                { label: 'common.dividerOutput', value: formatSI(r.dividerOut, 'V'), warn: r.dividerTooLow },
                { label: 'level-shifter.needsAtLeast', value: formatSI(0.7 * vLow, 'V'), note: 'level-shifter.07XLow' },
                { label: 'common.riseTime', value: formatSI(r.worstRise, 's') },
                { label: 'level-shifter.maxBitRate', value: formatSI(r.maxBitRate, 'Hz'), warn: r.tooSlow },
                { label: 'common.dividerCurrent', value: formatSI(vHigh / (r1 + r2), 'A'), note: 'common.continuous' },
              ]
        }
      />

      {r.insufficientDrive && (
        <Warning
          text="level-shifter.warn1"
          vars={{ vgsMargin: formatSI(r.vgsMargin, 'V') }}
        />
      )}
      {r.tooSlow && (
        <Warning
          text="level-shifter.warn2"
          vars={{
            worstRise: formatSI(r.worstRise, 's'),
            maxBitRate: formatSI(r.maxBitRate, 'Hz'),
            bitRate: formatSI(bitRate, 'Hz'),
          }}
        />
      )}
      {kind === 'divider' && (
        <Warning
          text="level-shifter.warn3"
        />
      )}

      <Theory
        text={[
          'level-shifter.theory1',
          'level-shifter.theConsequenceIsThat',
          'level-shifter.gateDriveMattersWith',
          'level-shifter.aResistorDividerIs',
        ]}
      />
    </SimPage>
  )
}
