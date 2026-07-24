import { useMemo, useState } from 'react'
import { HIGH_Q, analyse, simulate } from '../engine/sallenKey'
import type { FilterMode, SallenKey } from '../engine/sallenKey'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Schematic, Segmented, SimPage, SourceControls, Theory, useSource, Warning } from '../ui'

const N = 8192

/** A resistor is a box, a capacitor is a pair of plates. Which one each */
/** position holds is the only thing that changes between the two modes. */
function Horizontal({ x, y, kind }: { x: number; y: number; kind: 'r' | 'c' }) {
  return kind === 'r' ? (
    <rect x={x} y={y - 8} width={32} height={16} />
  ) : (
    <path d={`M${x} ${y}h13M${x + 13} ${y - 10}v20M${x + 19} ${y - 10}v20M${x + 19} ${y}h13`} />
  )
}

function Vertical({ x, y, kind }: { x: number; y: number; kind: 'r' | 'c' }) {
  return kind === 'r' ? (
    <rect x={x - 8} y={y} width={16} height={32} />
  ) : (
    <path d={`M${x} ${y}v13M${x - 10} ${y + 13}h20M${x - 10} ${y + 19}h20M${x} ${y + 19}v13`} />
  )
}

function Diagram({ mode }: { mode: FilterMode }) {
  const low = mode === 'lowpass'
  // Low pass: two series resistors, a shunt capacitor, a capacitor to the
  // output. High pass is the same network with R and C exchanged.
  const series: 'r' | 'c' = low ? 'r' : 'c'
  const shunt: 'r' | 'c' = low ? 'c' : 'r'

  return (
    <Schematic viewBox="0 -8 260 153" label="sallen-key.schematic">
      <circle cx="8" cy="72" r="3" />
      <path d="M11 72h9" />
      <Horizontal x={20} y={72} kind={series} />
      <path d="M52 72h24" />
      <Horizontal x={76} y={72} kind={series} />
      <path d="M108 72h42" />

      {/* shunt leg to ground */}
      <path d="M124 72v16" />
      <Vertical x={124} y={88} kind={shunt} />
      <path d="M124 120v10M112 130h24M116 135h16M120 140h8" />

      {/* the buffer */}
      <path d="M150 30v56l46-28z" />
      <path d="M196 58h44" />
      <circle cx="244" cy="58" r="3" />

      {/* unity gain: the output is tied straight back to the inverting pin */}
      <path d="M206 58v-32h-66v18h10" />

      {/* the element that closes the loop from the mid node to the output */}
      <path d="M64 72V12h66" />
      <Horizontal x={130} y={12} kind={shunt === 'r' ? 'c' : 'r'} />
      <path d="M162 12h70v46" />
      <circle className="dot" cx="64" cy="72" r="2.5" />
      <circle className="dot" cx="124" cy="72" r="2.5" />
      <circle className="dot" cx="206" cy="58" r="2.5" />
      <circle className="dot" cx="232" cy="58" r="2.5" />
      <text x="26" y="62">
        {low ? 'R1' : 'C1'}
      </text>
      <text x="82" y="62">
        {low ? 'R2' : 'C2'}
      </text>
      <text x="136" y="112">
        {low ? 'C2' : 'R2'}
      </text>
      <text x="136" y="8">
        {low ? 'C1' : 'R1'}
      </text>
      <text x="2" y="66">
        Vin
      </text>
      <text x="212" y="50">
        Vout
      </text>
      <text x="154" y="48" fontSize="10">
        &minus;
      </text>
      <text x="154" y="78" fontSize="10">
        +
      </text>
    </Schematic>
  )
}

export default function SallenKeyFilter() {
  const [mode, setMode] = useState<FilterMode>('lowpass')
  const [r1, setR1] = useState(10e3)
  const [r2, setR2] = useState(10e3)
  const [c1, setC1] = useState(22e-9)
  const [c2, setC2] = useState(10e-9)
  const [gbw, setGbw] = useState(1e6)
  const [source, patchSource] = useSource({ frequency: 1000 })

  const filter: SallenKey = { mode, r1, r2, c1, c2, gbw }
  const r = analyse(filter, source.frequency)

  const { dt, traces } = useMemo(() => {
    // A step has no period, so frame it on how long the poles take to settle.
    const settle = r.f0 > 0 ? 8 / (2 * Math.PI * r.f0 * Math.max(r.zeta, 0.1)) : 1e-3
    const { dt, samples: input } = sweep(source, N, source.cycles, Math.max(settle, 1e-6))
    const output = simulate(filter, input, dt, source.kind !== 'dc')
    return {
      dt,
      traces: [
        { label: 'common.vin', samples: input },
        { label: 'common.vout', samples: output },
      ],
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, r1, r2, c1, c2, source])

  return (
    <SimPage
      id="sallen-key"
      lede="sallen-key.lede"
      controls={
        <>
          <Segmented
            label="common.filterTopology"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'lowpass', label: 'common.lowPass' },
              { value: 'highpass', label: 'common.highPass' },
            ]}
          />
          <Diagram mode={mode} />

          <Group label="common.components">
            <Param label="sallen-key.r1" unit="Ω" value={r1} onChange={setR1} min={100} max={1e6} />
            <Param label="sallen-key.r2" unit="Ω" value={r2} onChange={setR2} min={100} max={1e6} />
            <Param
              label="sallen-key.c1"
              unit="F"
              value={c1}
              onChange={setC1}
              min={1e-12}
              max={1e-4}
            />
            <Param
              label="sallen-key.c2"
              unit="F"
              value={c2}
              onChange={setC2}
              min={1e-12}
              max={1e-4}
            />
          </Group>

          <Group label="sallen-key.opAmp">
            <Param
              label="common.gainBandwidth"
              unit="Hz"
              value={gbw}
              onChange={setGbw}
              min={10e3}
              max={100e6}
              hint="sallen-key.gbwHint"
            />
          </Group>

          <SourceControls value={source} onChange={patchSource} />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <ReadoutGrid
        items={[
          { label: 'sallen-key.poleFrequency', value: formatSI(r.f0, 'Hz') },
          {
            label: 'sallen-key.cutoff',
            value: formatSI(r.cutoff, 'Hz'),
            note: 'sallen-key.whereItIs3Db',
          },
          {
            label: 'common.qFactor',
            value: r.q.toFixed(3),
            note: <T k="sallen-key.dampingZeta" vars={{ zeta: r.zeta.toFixed(3) }} />,
            warn: r.peaky,
          },
          {
            label: 'sallen-key.peaking',
            value: r.peakingDb > 0 ? `${r.peakingDb.toFixed(2)} dB` : 'sallen-key.none',
            note:
              r.peakingDb > 0 ? (
                <T k="sallen-key.atFrequency" vars={{ f: formatSI(r.peakFrequency, 'Hz') }} />
              ) : (
                'sallen-key.maximallyFlat'
              ),
          },
          {
            label: 'sallen-key.stepOvershoot',
            value: `${(r.overshoot * 100).toFixed(1)} %`,
          },
          {
            label: <T k="common.gainAt" vars={{ frequency: formatSI(source.frequency, 'Hz') }} />,
            value: `${r.gainDb.toFixed(2)} dB`,
            note: <T k="sallen-key.linearGain" vars={{ gain: r.gain.toFixed(4) }} />,
          },
          { label: 'common.phaseShift', value: `${r.phase.toFixed(1)}°` },
          {
            label: 'sallen-key.rollOff',
            value: '40 dB/dec',
            note: 'sallen-key.twiceASingleRc',
          },
          {
            label: 'sallen-key.opAmpLimit',
            value: formatSI(r.usableLimit, 'Hz'),
            note: 'sallen-key.gbwOverQ',
            warn: r.outOfBandwidth,
          },
        ]}
      />

      <Warning when={r.peaky} text="sallen-key.warnPeaky" vars={{ q: r.q.toFixed(1), limit: HIGH_Q }} />
      <Warning when={r.outOfBandwidth}
        text="sallen-key.warnBandwidth"
        vars={{ f0: formatSI(r.f0, 'Hz'), gbw: formatSI(gbw, 'Hz') }}
      />

      <Theory
        text={[
          'sallen-key.theory1',
          'sallen-key.theory2',
          'sallen-key.theory3',
          'sallen-key.theory4',
        ]}
      />
    </SimPage>
  )
}
