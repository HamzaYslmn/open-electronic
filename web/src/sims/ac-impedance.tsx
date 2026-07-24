import { useMemo, useState } from 'react'
import { analyseImpedance } from '../engine/ac'
import type { Topology } from '../engine/ac'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory } from '../ui/Readout'
import SimPage from '../ui/SimPage'

const N = 1024

export default function AcImpedance() {
  const [topology, setTopology] = useState<Topology>('series')
  const [r, setR] = useState(10)
  const [l, setL] = useState(1e-3)
  const [c, setC] = useState(1e-6)
  const [frequency, setFrequency] = useState(5000)
  const [decades, setDecades] = useState(4)

  const { readout, traces, dt } = useMemo(() => {
    const readout = analyseImpedance(topology, r, l, c, frequency)
    // Sweep logarithmically around the operating frequency, but plot against a
    // linear sample index. Each sample is one step in log-frequency.
    const fStart = frequency / Math.pow(10, decades / 2)
    const perSample = decades / (N - 1)
    const mag = new Float64Array(N)
    const phase = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      const f = fStart * Math.pow(10, i * perSample)
      const p = analyseImpedance(topology, r, l, c, f)
      mag[i] = p.magnitude
      phase[i] = p.phaseDeg
    }
    return {
      readout,
      dt: perSample,
      traces: [
        { label: '|Z|', color: TRACE_COLORS[0], samples: mag },
        { label: 'phase', color: TRACE_COLORS[3], samples: phase },
      ],
    }
  }, [topology, r, l, c, frequency, decades])

  return (
    <SimPage
      id="ac-impedance"
      lede="Impedance against frequency for an R, L and C together. The scope sweeps FREQUENCY logarithmically, not time: each horizontal division is a fixed fraction of a decade, centred on the frequency you set. Magnitude is in ohms, phase in degrees."
      controls={
        <>
          <Segmented
            label="Topology"
            value={topology}
            onChange={setTopology}
            options={[
              { value: 'series', label: 'Series' },
              { value: 'parallel', label: 'Parallel' },
            ]}
          />
          <Group label="Components">
            <Param label="Resistance" unit="Ω" value={r} onChange={setR} min={0.01} max={1e6} />
            <Param label="Inductance" unit="H" value={l} onChange={setL} min={1e-9} max={10} />
            <Param label="Capacitance" unit="F" value={c} onChange={setC} min={1e-12} max={1e-2} />
          </Group>
          <Group label="Sweep">
            <Param label="Centre frequency" unit="Hz" value={frequency} onChange={setFrequency} min={1} max={1e9} />
            <Param label="Decades shown" value={decades} onChange={(v) => setDecades(Math.round(v))} min={1} max={8} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="Ω" />

      <ReadoutGrid
        items={[
          { label: '|Z| at frequency', value: formatSI(readout.magnitude, 'Ω') },
          { label: 'Phase', value: `${readout.phaseDeg.toFixed(1)}°`, note: readout.character },
          { label: 'Resistance', value: formatSI(readout.resistance, 'Ω'), note: 'real part' },
          { label: 'Reactance', value: formatSI(readout.reactance, 'Ω'), note: 'imaginary part' },
          { label: 'XL', value: formatSI(readout.xl, 'Ω') },
          { label: 'XC', value: formatSI(readout.xc, 'Ω') },
          { label: 'Resonance f0', value: formatSI(readout.resonance, 'Hz'), warn: readout.atResonance },
          { label: 'Q factor', value: readout.q.toFixed(2) },
          { label: 'Bandwidth', value: formatSI(readout.bandwidth, 'Hz'), note: '-3 dB' },
          { label: 'Current from 1 V', value: formatSI(readout.admittance, 'A') },
        ]}
      />

      <Theory>
        <p>
          Reactance is frequency dependent: <code>XL = 2·pi·f·L</code> rises with frequency and{' '}
          <code>XC = 1/(2·pi·f·C)</code> falls. Written as complex impedances they are{' '}
          <code>+jXL</code> and <code>-jXC</code>, so they subtract rather than add, and at one
          particular frequency they cancel entirely.
        </p>
        <p>
          That is resonance, <code>f0 = 1/(2·pi·sqrt(LC))</code>. In series the cancellation
          leaves only R, so impedance hits a minimum and current peaks. In parallel it is the
          admittances that cancel, so impedance hits a maximum and the network becomes a tank
          that draws almost nothing from the source while circulating a large current
          internally.
        </p>
        <p>
          Q measures how sharp that is: <code>Q = (1/R)·sqrt(L/C)</code> for series. Bandwidth
          follows as <code>f0/Q</code>. High Q means a narrow, selective peak and a large
          circulating current; low Q means a broad gentle one.
        </p>
        <p>
          The phase trace tells you which element is winning. Below series resonance the
          capacitor dominates and current leads voltage, giving negative phase. Above it the
          inductor dominates and current lags. Exactly at f0 the network looks purely resistive,
          which is what makes it useful for matching and filtering.
        </p>
      </Theory>
    </SimPage>
  )
}
