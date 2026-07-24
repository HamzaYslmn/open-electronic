import { useMemo, useState } from 'react'
import { analyse, inductorWaveform, operatingPoint } from '../engine/buck'
import type { BuckSpec, Rectifier } from '../engine/buck'
import { VCC, VCC_5V } from '../engine/constants'
import { formatSI } from '../engine/units'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples across the whole scope window. */
const N = 8192

/** Ripple this far above the load current means L or fsw is too low. */
const RIPPLE_LIMIT = 0.6

/** Output ripple above this fraction of Vout is worth flagging. */
const VOUT_RIPPLE_LIMIT = 0.01

function Schematic({ rectifier }: { rectifier: Rectifier }) {
  return (
    <svg
      className="schematic"
      viewBox="0 0 260 110"
      aria-label={`buck converter with a ${rectifier === 'sync' ? 'synchronous FET' : 'catch diode'}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="18" cy="30" r="8" />
        <path d="M18 22V12M18 38v52h214M26 30h20" />
        <rect x="46" y="22" width="28" height="16" />
        <path d="M74 30h38" />
        <path d="M104 30v22M104 68v22" />
        {rectifier === 'sync' ? (
          <rect x="90" y="52" width="28" height="16" />
        ) : (
          <path d="M94 68h20l-10-16zM94 52h20" />
        )}
        <rect x="112" y="22" width="40" height="16" />
        <path d="M152 30h78" />
        <path d="M190 30v22M178 52h24M178 62h24M190 62v28" />
        <circle cx="232" cy="30" r="3" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="2" y="64">
          Vin
        </text>
        <text x="50" y="18">
          SW
        </text>
        <text x="126" y="18">
          L
        </text>
        <text x="122" y="64">
          {rectifier === 'sync' ? 'SW2' : 'D'}
        </text>
        <text x="206" y="62">
          C
        </text>
        <text x="200" y="22">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function Buck() {
  // A buck steps down, so the input rail has to sit above the 3.3 V target.
  // 5 V in and 3.3 V out is the standard ESP32 case: USB or a 2S pack feeding
  // the logic rail.
  const [vin, setVin] = useState(VCC_5V)
  const [vout, setVout] = useState(VCC)
  const [iout, setIout] = useState(0.5)
  const [l, setL] = useState(10e-6)
  const [c, setC] = useState(22e-6)
  const [esr, setEsr] = useState(5e-3)
  const [fsw, setFsw] = useState(500e3)
  const [rdsOn, setRdsOn] = useState(50e-3)
  const [dcr, setDcr] = useState(40e-3)
  const [rectifier, setRectifier] = useState<Rectifier>('sync')
  const [periods, setPeriods] = useState(2)

  const { dt, traces, op, ripple, loss, efficiency, pout, pin, iin } = useMemo(() => {
    const spec: BuckSpec = { vin, vout, iout, l, c, esr, fsw, rdsOn, dcr, rectifier }
    const point = operatingPoint(spec)
    const { dt, samples } = inductorWaveform(spec, point, N, periods)
    // The capacitor takes whatever the inductor delivers beyond the load.
    const icap = Float64Array.from(samples, (v) => v - iout)
    const level = new Float64Array(N).fill(iout)
    return {
      dt,
      traces: [
        { label: 'IL', color: TRACE_COLORS[0], samples },
        { label: 'Iout', color: TRACE_COLORS[1], samples: level, quiet: true },
        { label: 'Icap', color: TRACE_COLORS[2], samples: icap },
      ],
      ...analyse(spec),
    }
  }, [vin, vout, iout, l, c, esr, fsw, rdsOn, dcr, rectifier, periods])

  const rippleRatio = iout > 0 ? op.ripple / iout : Infinity
  const voutRatio = vout > 0 ? ripple.total / vout : Infinity

  return (
    <SimPage
      id="buck"
      lede="Inductor current through one switching period. The horizontal axis is time inside the switching cycle, not the output waveform, so a full trace is a few microseconds wide."
      controls={
        <>
          <Segmented
            label="Low side device"
            value={rectifier}
            onChange={setRectifier}
            options={[
              { value: 'sync', label: 'Synchronous' },
              { value: 'diode', label: 'Schottky' },
            ]}
          />
          <Schematic rectifier={rectifier} />

          <Group label="Operating point">
            <Param label="Input Vin" unit="V" value={vin} onChange={setVin} min={1} max={60} />
            <Param label="Output Vout" unit="V" value={vout} onChange={setVout} min={0.5} max={30} />
            <Param
              label="Load current"
              unit="A"
              value={iout}
              onChange={setIout}
              min={1e-3}
              max={10}
            />
            <Param
              label="Switching frequency"
              unit="Hz"
              value={fsw}
              onChange={setFsw}
              min={10e3}
              max={3e6}
            />
          </Group>

          <Group label="Power stage">
            <Param label="Inductor" unit="H" value={l} onChange={setL} min={100e-9} max={1e-3} />
            <Param label="Output cap" unit="F" value={c} onChange={setC} min={1e-6} max={2e-3} />
            <Param label="Cap ESR" unit="Ω" value={esr} onChange={setEsr} min={1e-4} max={1} />
          </Group>

          <Group label="Parasitics">
            <Param
              label="FET Rds(on)"
              unit="Ω"
              value={rdsOn}
              onChange={setRdsOn}
              min={1e-3}
              max={1}
            />
            <Param
              label="Inductor DCR"
              unit="Ω"
              value={dcr}
              onChange={setDcr}
              min={1e-3}
              max={2}
              hint="Copper resistance of the winding, from the inductor datasheet."
            />
            <Param
              label="Periods shown"
              value={periods}
              onChange={(v) => setPeriods(Math.round(v))}
              min={1}
              max={8}
              log={false}
              step={1}
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="A" />

      <ReadoutGrid
        items={[
          {
            label: 'Duty cycle D',
            value: `${(op.duty * 100).toFixed(1)} %`,
            note: `(ideal Vout/Vin ${(op.dutyIdeal * 100).toFixed(1)} %)`,
            warn: op.dropout,
          },
          {
            label: 'Conduction mode',
            value: op.mode === 'ccm' ? 'CCM' : 'DCM',
            note: `(boundary at ${formatSI(op.boundary, 'A')})`,
            warn: op.mode === 'dcm',
          },
          {
            label: 'Inductor ripple ΔIL',
            value: formatSI(op.ripple, 'A'),
            note: `(${(rippleRatio * 100).toFixed(0)}% of load)`,
            warn: op.mode === 'ccm' && rippleRatio > RIPPLE_LIMIT,
          },
          {
            label: 'Peak inductor current',
            value: formatSI(op.peak, 'A'),
            note: '(keep Isat above this)',
          },
          { label: 'Valley current', value: formatSI(op.valley, 'A') },
          {
            label: 'Output ripple ΔVout',
            value: formatSI(ripple.total, 'V'),
            note: `(${(voutRatio * 100).toFixed(2)}% of Vout)`,
            warn: voutRatio > VOUT_RIPPLE_LIMIT,
          },
          {
            label: 'Ripple split C / ESR',
            value: `${formatSI(ripple.cap, 'V')} + ${formatSI(ripple.esr, 'V')}`,
          },
          {
            label: 'Efficiency',
            value: `${(efficiency * 100).toFixed(1)} %`,
            note: `(${formatSI(loss.total, 'W')} lost)`,
            warn: efficiency < 0.8,
          },
          {
            label: 'Input current',
            value: formatSI(iin, 'A'),
            note: `(${formatSI(pin, 'W')} in, ${formatSI(pout, 'W')} out)`,
          },
          {
            label: 'On time',
            value: formatSI(op.duty / fsw, 's'),
            note: `(period ${formatSI(1 / fsw, 's')})`,
          },
          { label: 'Loss: inductor DCR', value: formatSI(loss.inductor, 'W') },
          { label: 'Loss: high side FET', value: formatSI(loss.switchCond, 'W') },
          {
            label: rectifier === 'sync' ? 'Loss: low side FET' : 'Loss: catch diode',
            value: formatSI(loss.rectifier, 'W'),
          },
          {
            label: 'Loss: switching',
            value: formatSI(loss.switching, 'W'),
            note: '(scales with fsw)',
          },
        ]}
      />

      {op.dropout && (
        <Warning>
          Dropout: Vin is at or below Vout plus the switch and winding drops. The high side
          switch sits at 100% duty, there is no switching left to model, and the output just
          follows the input.
        </Warning>
      )}

      {op.mode === 'dcm' && !op.dropout && (
        <Warning>
          Discontinuous conduction: the load is below {formatSI(op.boundary, 'A')}, so the
          inductor current hits zero every cycle. Duty no longer tracks Vout/Vin, the loop gain
          changes, and a diode version will ring on the switch node once the current stops.
          Raise L or fsw to push the boundary down.
        </Warning>
      )}

      {op.mode === 'ccm' && rippleRatio > RIPPLE_LIMIT && (
        <Warning>
          Ripple is {(rippleRatio * 100).toFixed(0)}% of the load current. The usual design
          target is 20 to 40%: more than that wastes inductor headroom and pushes the peak
          toward saturation.
        </Warning>
      )}

      <Theory>
        <p>
          Volt-second balance says the inductor must gain as much current in the on time as it
          loses in the off time, so <code>Von·D = Voff·(1-D)</code> and{' '}
          <code>D = Voff / (Von + Voff)</code>. With no losses that is the familiar{' '}
          <code>D = Vout / Vin</code>. This page keeps the switch, diode and winding drops
          inside Von and Voff, which is why the reported duty sits slightly above the ideal
          ratio.
        </p>
        <p>
          The ramp gives the ripple directly: <code>ΔIL = Voff·(1-D) / (fsw·L)</code>, i.e.{' '}
          <code>Vout·(1-D)/(fsw·L)</code> in the ideal case. The capacitor swallows the
          triangular part of that current, and integrating half a triangle of charge gives{' '}
          <code>ΔVout = ΔIL / (8·fsw·C)</code>. Real ESR adds <code>ΔIL·ESR</code> on top,
          which on an electrolytic is usually the larger of the two.
        </p>
        <p>
          The valley current is <code>Iout - ΔIL/2</code>, so at{' '}
          <code>Iout = ΔIL/2</code> the current just touches zero. Below that boundary the
          converter is discontinuous and the duty collapses to{' '}
          <code>D = sqrt(2·L·fsw·Iout·Voff / (Von·(Von+Voff)))</code>.
        </p>
        <p>
          Efficiency is a first-order budget, not a simulation: <code>Irms²·DCR</code> in the
          winding, <code>Irms²·Rds(on)</code> in each FET weighted by its conduction time or{' '}
          <code>Vf·Iout·(1-D)</code> for a catch diode, plus hard switching loss{' '}
          <code>0.5·Vin·I·(tr+tf)·fsw</code> and the controller quiescent draw. Gate charge,
          core loss, dead time and layout parasitics are not modelled, so expect the real board
          to land a couple of points lower.
        </p>
        <p>
          The trace is the closed-form piecewise-linear solution of{' '}
          <code>di/dt = v/L</code> evaluated per sample, so it stays exact and periodic at any
          switching frequency the sliders reach.
        </p>
      </Theory>
    </SimPage>
  )
}
