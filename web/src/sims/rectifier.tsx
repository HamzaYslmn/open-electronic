import { useMemo, useState } from 'react'
import {
  DIODES,
  TOPOLOGIES,
  analyse,
  diodeCount,
  seriesDiodes,
  simulate,
} from '../engine/rectifier'
import type { Topology } from '../engine/rectifier'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Segmented, Select } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'
import SourceControls, { useSource } from '../ui/SourceControls'

/** Samples per sweep. Enough to resolve a conduction spike a few degrees wide. */
const N = 8192

/** Diode symbol along a segment, arrow pointing at (x2, y2). */
function Diode({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const px = -uy
  const py = ux
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const a = 7
  const b = 5.5
  const p = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`
  const tip = p(mx + ux * a, my + uy * a)
  return (
    <>
      <path
        fill="currentColor"
        d={`M${p(mx - ux * a + px * b, my - uy * a + py * b)}L${p(
          mx - ux * a - px * b,
          my - uy * a - py * b,
        )}L${tip}Z`}
      />
      <path
        d={`M${p(mx + ux * a + px * b, my + uy * a + py * b)}L${p(
          mx + ux * a - px * b,
          my + uy * a - py * b,
        )}`}
      />
    </>
  )
}

/** Winding drawn as a source, same idiom as the other pages. */
function Winding({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle cx={x} cy={y} r="10" />
      <path d={`M${x - 6} ${y}a6 6 0 0 1 12 0`} />
    </>
  )
}

/** Junction dot, for a T where three wires meet. */
function Node({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="2.5" fill="currentColor" />
}

/** Reservoir cap and load, hung between a rail at yTop and one at yBot. */
function Output({ yTop, yBot }: { yTop: number; yBot: number }) {
  const mid = (yTop + yBot) / 2
  return (
    <>
      <path
        d={`M205 ${yTop}V${mid - 5}M191 ${mid - 5}h28M191 ${mid + 5}h28M205 ${mid + 5}V${yBot}`}
      />
      <path d={`M245 ${yTop}V${mid - 18}M245 ${mid + 18}V${yBot}`} />
      <rect x="237" y={mid - 18} width="16" height="36" />
      <Node x={205} y={yTop} />
      <Node x={205} y={yBot} />
    </>
  )
}

function Schematic({ topology }: { topology: Topology }) {
  const centre = topology === 'centre'
  const yTop = centre ? 80 : 30
  const yBot = centre ? 165 : 140
  const mid = (yTop + yBot) / 2

  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 275 178" aria-label={t('rectifier.rectifier')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {topology === 'half' && (
          <>
            <Winding x={40} y={85} />
            <path d="M40 75V30h205M40 95v45h205" />
            <Diode x1={80} y1={30} x2={104} y2={30} />
          </>
        )}

        {topology === 'bridge' && (
          <>
            <Winding x={40} y={85} />
            {/* Diamond: AC at the sides, plus at the top, minus at the bottom. */}
            <path d="M95 85L130 50M165 85L130 50M130 120L95 85M130 120L165 85" />
            <Diode x1={95} y1={85} x2={130} y2={50} />
            <Diode x1={165} y1={85} x2={130} y2={50} />
            <Diode x1={130} y1={120} x2={95} y2={85} />
            <Diode x1={130} y1={120} x2={165} y2={85} />
            <path d="M40 75V65h55v20M40 95v57h140V85h-15" />
            <path d="M130 50V30h115" />
            {/* The minus rail hops the return lead. A hop is a crossing, not a joint. */}
            <path d="M130 120v20h44M174 140a6 6 0 0 1 12 0M186 140h59" />
          </>
        )}

        {topology === 'centre' && (
          <>
            <Winding x={40} y={55} />
            <Winding x={40} y={105} />
            {/* Both halves feed the same node, so both diodes point the same way. */}
            <path d="M40 65v30M40 45V25h110v110M40 115v20h110M150 80h95" />
            <Diode x1={80} y1={25} x2={104} y2={25} />
            <Diode x1={80} y1={135} x2={104} y2={135} />
            <path d="M40 80H20v85h225" />
            <Node x={40} y={80} />
            <Node x={150} y={80} />
          </>
        )}

        <Output yTop={yTop} yBot={yBot} />
      </g>
      <g fill="currentColor" fontSize="10">
        <text x={centre ? 2 : 4} y={centre ? 40 : 88}>
          Vsec
        </text>
        <text x="212" y={yTop - 5}>
          Vout
        </text>
        <text x="210" y={(yTop + mid) / 2 + 3}>
          C
        </text>
        <text x="256" y={mid + 3}>
          RL
        </text>
      </g>
    </svg>
  )
}

export default function Rectifier() {
  const [topology, setTopology] = useState<Topology>('bridge')
  const [diodeId, setDiodeId] = useState('1N4007')
  const [c, setC] = useState(1000e-6)
  const [rload, setRload] = useState(100)
  const [rs, setRs] = useState(1)
  // 12 V RMS secondary at 50 Hz. Rectifiers live on transformer and mains
  // voltages, so this page overrides the house 3.3 V default on purpose.
  const [source, patchSource] = useSource({
    amplitude: 12 * Math.SQRT2,
    offset: 0,
    frequency: 50,
    cycles: 4,
  })

  const diode = DIODES.find((d) => d.id === diodeId) ?? DIODES[1]

  const { dt, traces, r } = useMemo(() => {
    const spec = { topology, vf: diode.vf, rs, c, rload }
    // A DC input has no period, so window it on the charging time constant.
    const { dt, samples } = sweep(source, N, source.cycles, Math.max(5 * rload * c, 5e-3))
    const trace = simulate(samples, dt, spec)
    return {
      dt,
      traces: [
        { label: 'rectifier.vsec', color: TRACE_COLORS[0], samples },
        { label: 'common.vout', color: TRACE_COLORS[1], samples: trace.vout },
        { label: 'rectifier.noCap', color: TRACE_COLORS[3], samples: trace.vraw, quiet: true },
      ],
      // A DC source never stops conducting, so it has no ripple frequency.
      r: analyse(spec, samples, trace, source.kind === 'dc' ? 0 : source.frequency, diode),
    }
  }, [topology, diode, rs, c, rload, source])

  const loose = r.rippleFactor > 0.1

  return (
    <SimPage
      id="rectifier"
      lede="rectifier.lede"
      controls={
        <>
          <Segmented
            label="common.topology"
            value={topology}
            onChange={setTopology}
            options={TOPOLOGIES}
          />
          <Schematic topology={topology} />

          <Group label="rectifier.rectifier2">
            <Select
              label="rectifier.diode"
              value={diode.id}
              onChange={setDiodeId}
              options={DIODES.map((d) => ({ value: d.id, label: d.label }))}
            />
            <Param
              label="rectifier.reservoirCap"
              unit="F"
              value={c}
              onChange={setC}
              min={1e-9}
              max={47e-3}
              hint="rectifier.1NfIsEffectively"
            />
            <Param
              label="common.load"
              unit="Ω"
              value={rload}
              onChange={setRload}
              min={1}
              max={100e3}
            />
            <Param
              label="rectifier.sourceResistance"
              unit="Ω"
              value={rs}
              onChange={setRs}
              min={0.01}
              max={100}
              hint="rectifier.windingPlusDiodeBulk"
            />
          </Group>

          <SourceControls value={source} onChange={patchSource} maxAmplitude={400} label="rectifier.secondary" />
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      {r.deadOutput && (
        <Warning
          text="rectifier.warn1"
          vars={{
            vPeakIn: formatSI(r.vPeakIn, 'V'),
            vf: formatSI(seriesDiodes(topology) * diode.vf, 'V'),
          }}
        />
      )}
      {r.overPiv && (
        <Warning
          text="rectifier.warn2"
          vars={{ piv: formatSI(r.piv, 'V'), id: diode.id, vrrm: formatSI(diode.vrrm, 'V') }}
        />
      )}
      {r.overCurrent && (
        <Warning
          text="rectifier.warn3"
          vars={{
            iAvgPerDiode: formatSI(r.iAvgPerDiode, 'A'),
            id: diode.id,
            io: formatSI(diode.io, 'A'),
          }}
        />
      )}
      {r.overSurge && (
        <Warning
          text="rectifier.warn4"
          vars={{
            iPeak: formatSI(r.iPeak, 'A'),
            id: diode.id,
            isurge: formatSI(diode.isurge, 'A'),
          }}
        />
      )}
      {topology === 'half' && (
        <Warning
          text="rectifier.warn5"
        />
      )}
      {loose && (
        <Warning
          text="rectifier.warn6"
          vars={{ rippleFactor: (r.rippleFactor * 100).toFixed(0) }}
        />
      )}

      <ReadoutGrid
        items={[
          {
            label: 'rectifier.secondary',
            value: formatSI(r.vRmsIn, 'V'),
            note: <T k="rectifier.rmsPeak" vars={{ vPeakIn: formatSI(r.vPeakIn, 'V') }} />,
          },
          {
            label: 'rectifier.dcOutput',
            value: formatSI(r.vdc, 'V'),
            note: <T k="rectifier.textbook" vars={{ vdc: formatSI(r.ideal.vdc, 'V') }} />,
          },
          {
            label: 'common.ripple',
            value: formatSI(r.vRipplePP, 'V'),
            note: <T k="rectifier.ppFormula" vars={{ vripple: formatSI(r.ideal.vripple, 'V') }} />,
            warn: loose,
          },
          {
            label: 'rectifier.rippleFactor',
            value: `${(r.rippleFactor * 100).toFixed(1)} %`,
            note: <T k="rectifier.at" vars={{ fRipple: formatSI(r.fRipple, 'Hz') }} />,
            warn: loose,
          },
          {
            label: 'common.loadCurrent',
            value: formatSI(r.idc, 'A'),
            note: formatSI(r.pLoad, 'W'),
          },
          {
            label: 'rectifier.peakDiodeCurrent',
            value: formatSI(r.iPeak, 'A'),
            note: <T k="rectifier.xIdc" vars={{ crestFactor: r.crestFactor.toFixed(0) }} />,
            warn: r.overSurge,
          },
          {
            label: 'rectifier.averagePerDiode',
            value: formatSI(r.iAvgPerDiode, 'A'),
            note: <T k="rectifier.io" vars={{ id: diode.id, io: formatSI(diode.io, 'A') }} />,
            warn: r.overCurrent,
          },
          {
            label: 'rectifier.rmsPerDiode',
            value: formatSI(r.iRmsPerDiode, 'A'),
            note: <T k="rectifier.conduction" vars={{ conductionAngle: r.conductionAngle.toFixed(0) }} />,
          },
          {
            label: 'rectifier.pivPerDiode',
            value: formatSI(r.piv, 'V'),
            note: <T k="rectifier.vrrm" vars={{ id: diode.id, vrrm: formatSI(diode.vrrm, 'V') }} />,
            warn: r.overPiv,
          },
          {
            label: 'rectifier.diodeDissipation',
            value: formatSI(r.pDiodeTotal, 'W'),
            note: <T k="rectifier.eachDiodes" vars={{ pDiodePer: formatSI(r.pDiodePer, 'W'), topology: diodeCount(topology) }} />,
          },
        ]}
      />

      <Theory
        text={[
          'rectifier.theCapChargesTo',
          'rectifier.peakInverseVoltageIs',
          'rectifier.everyCoulombDeliveredTo',
          'rectifier.theTraceIsNot',
        ]}
      />
    </SimPage>
  )
}
