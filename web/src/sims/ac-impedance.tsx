import { useMemo, useState } from 'react'
import { analyseImpedance } from '../engine/ac'
import type { Topology } from '../engine/ac'
import { formatSI } from '../engine/units'
import { Group, Oscilloscope, Param, ReadoutGrid, Segmented, SimPage, Theory, TRACE_COLORS } from '../ui'

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
        { label: 'ac-impedance.phase', color: TRACE_COLORS[3], samples: phase },
      ],
    }
  }, [topology, r, l, c, frequency, decades])

  return (
    <SimPage
      id="ac-impedance"
      lede="ac-impedance.lede"
      controls={
        <>
          <Segmented
            label="common.topology"
            value={topology}
            onChange={setTopology}
            options={[
              { value: 'series', label: 'common.series' },
              { value: 'parallel', label: 'common.parallel' },
            ]}
          />
          <Group label="common.components">
            <Param label="common.resistance" unit="Ω" value={r} onChange={setR} min={0.01} max={1e6} />
            <Param label="common.inductance" unit="H" value={l} onChange={setL} min={1e-9} max={10} />
            <Param label="common.capacitance" unit="F" value={c} onChange={setC} min={1e-12} max={1e-2} />
          </Group>
          <Group label="common.sweep">
            <Param label="ac-impedance.centreFrequency" unit="Hz" value={frequency} onChange={setFrequency} min={1} max={1e9} />
            <Param label="ac-impedance.decadesShown" value={decades} onChange={setDecades} int min={1} max={8} log={false} step={1} />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="Ω" />

      <ReadoutGrid
        items={[
          { label: 'ac-impedance.zAtFrequency', value: formatSI(readout.magnitude, 'Ω') },
          { label: 'ac-impedance.phase2', value: `${readout.phaseDeg.toFixed(1)}°`, note: readout.character },
          { label: 'common.resistance', value: formatSI(readout.resistance, 'Ω'), note: 'ac-impedance.realPart' },
          { label: 'ac-impedance.reactance', value: formatSI(readout.reactance, 'Ω'), note: 'ac-impedance.imaginaryPart' },
          { label: 'ac-impedance.xl', value: formatSI(readout.xl, 'Ω') },
          { label: 'ac-impedance.xc', value: formatSI(readout.xc, 'Ω') },
          { label: 'common.resonanceF0', value: formatSI(readout.resonance, 'Hz'), warn: readout.atResonance },
          { label: 'common.qFactor', value: readout.q.toFixed(2) },
          { label: 'common.bandwidth', value: formatSI(readout.bandwidth, 'Hz'), note: 'ac-impedance.3Db' },
          { label: 'ac-impedance.currentFrom1V', value: formatSI(readout.admittance, 'A') },
        ]}
      />

      <Theory
        text={[
          'ac-impedance.reactanceIsFrequencyDependent',
          'ac-impedance.thatIsResonanceF0',
          'ac-impedance.qMeasuresHowSharp',
          'ac-impedance.thePhaseTraceTells',
        ]}
      />
    </SimPage>
  )
}
