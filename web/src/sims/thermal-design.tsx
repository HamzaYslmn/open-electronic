import { useMemo, useState } from 'react'
import { T_AMBIENT_K, VCC, VCC_5V } from '../engine/constants'
import {
  analyse,
  celsiusToKelvin,
  kelvinToCelsius,
  linearRegulatorPower,
  simulate,
} from '../engine/thermal'
import type { ThermalChain } from '../engine/thermal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Oscilloscope, Param, ReadoutGrid, Segmented, Select, SimPage, Theory, TRACE_COLORS, Warning } from '../ui'

/** Samples per warm-up sweep, same buffer depth as every other page. */
const N = 8192

/** Below this the part is comfortable to touch. Above it, it marks skin. */
const TOUCH_LIMIT_C = 60

/** Junction margin to design for. Datasheet limits are absolute maximums. */
const MARGIN_TARGET_K = 20

/**
 * Typical thermal figures for common packages, not a substitute for the
 * datasheet of the part actually on your board. For an unheatsinked device the
 * "sink" leg is the package's own path to air, i.e. Rsa = Rja - Rjc with no
 * interface, which is how the free-air entries below are built.
 */
const PACKAGES = [
  {
    value: 'sot223',
    label: 'thermal-design.sot223Ams1117On',
    rjc: 15,
    rcs: 0.01,
    rsa: 45,
    cth: 2,
  },
  { value: 'sot23', label: 'thermal-design.sot23SmallSignal', rjc: 75, rcs: 0.01, rsa: 175, cth: 0.3 },
  { value: 'dpak', label: 'thermal-design.dpakOn1Sq', rjc: 3, rcs: 0.01, rsa: 47, cth: 3 },
  { value: 'to220-air', label: 'thermal-design.to220BareFree', rjc: 5, rcs: 0.01, rsa: 60, cth: 2 },
  { value: 'to220-sink', label: 'thermal-design.to220BoltedTo', rjc: 5, rcs: 0.5, rsa: 5, cth: 20 },
  { value: 'to247-sink', label: 'thermal-design.to247OnA', rjc: 0.7, rcs: 0.3, rsa: 1, cth: 200 },
] as const

type PackageId = (typeof PACKAGES)[number]['value']

const degC = (k: number) => `${kelvinToCelsius(k).toFixed(1)} °C`

export default function ThermalDesign() {
  const [mode, setMode] = useState<'ldo' | 'watts'>('ldo')
  const [watts, setWatts] = useState(2)
  // 5 V is genuine here: a USB rail feeding a 3.3 V regulator is the standard
  // ESP32 board topology, and the drop across it is the whole point.
  const [vin, setVin] = useState(VCC_5V)
  const [vout, setVout] = useState(VCC)
  const [iout, setIout] = useState(0.5)

  const [pkg, setPkg] = useState<PackageId>('sot223')
  const [rjc, setRjc] = useState(15)
  const [rcs, setRcs] = useState(0.01)
  const [rsa, setRsa] = useState(45)
  const [cth, setCth] = useState(2)

  const [ambientC, setAmbientC] = useState(kelvinToCelsius(T_AMBIENT_K))
  const [tjMaxC, setTjMaxC] = useState(125)

  const loadPackage = (id: PackageId) => {
    setPkg(id)
    const p = PACKAGES.find((x) => x.value === id)
    if (!p) return
    setRjc(p.rjc)
    setRcs(p.rcs)
    setRsa(p.rsa)
    setCth(p.cth)
  }

  const { dt, traces, r, power, efficiency } = useMemo(() => {
    const power = mode === 'ldo' ? linearRegulatorPower(vin, vout, iout) : watts
    const chain: ThermalChain = {
      power,
      ambient: celsiusToKelvin(ambientC),
      rjc,
      rcs,
      rsa,
      tjMax: celsiusToKelvin(tjMaxC),
    }
    const r = analyse(chain, cth)

    // Window on five thermal time constants, 99.3% of the way to steady state.
    const span = Math.max(5 * r.tau, 1)
    const dt = span / N
    const t = simulate(chain, cth, N, dt)
    const limit = new Float64Array(N).fill(tjMaxC)
    const pOut = vout * iout

    return {
      dt,
      power,
      r,
      efficiency: pOut > 0 ? pOut / (pOut + power) : 0,
      traces: [
        { label: 'thermal-design.tj', color: TRACE_COLORS[1], samples: t.tj.map(kelvinToCelsius), quiet: true },
        { label: 'thermal-design.tcase', color: TRACE_COLORS[0], samples: t.tc.map(kelvinToCelsius), quiet: true },
        { label: 'thermal-design.tsink', color: TRACE_COLORS[2], samples: t.ts.map(kelvinToCelsius), quiet: true },
        { label: 'common.tjMax', color: TRACE_COLORS[4], samples: limit, quiet: true },
      ],
    }
  }, [mode, watts, vin, vout, iout, rjc, rcs, rsa, cth, ambientC, tjMaxC])

  return (
    <SimPage
      id="thermal-design"
      lede="thermal-design.lede"
      controls={
        <>
          <Segmented
            label="thermal-design.whereTheHeatComes"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'ldo', label: 'thermal-design.linearRegulator' },
              { value: 'watts', label: 'thermal-design.directWatts' },
            ]}
          />

          {mode === 'ldo' ? (
            <Group label="thermal-design.regulator">
              <Param
                label="thermal-design.input"
                unit="V"
                value={vin}
                onChange={setVin}
                min={1}
                max={40}
                log={false}
                step={0.1}
              />
              <Param
                label="common.output"
                unit="V"
                value={vout}
                onChange={setVout}
                min={0.8}
                max={24}
                log={false}
                step={0.1}
              />
              <Param
                label="common.loadCurrent"
                unit="A"
                value={iout}
                onChange={setIout}
                min={1e-3}
                max={5}
                hint="thermal-design.esp32PeaksNear500"
              />
            </Group>
          ) : (
            <Group label="common.load">
              <Param label="common.dissipation" unit="W" value={watts} onChange={setWatts} min={0.01} max={500} />
            </Group>
          )}

          <Group label="common.thermalPath">
            <Select
              label="thermal-design.loadTypicalPackage"
              value={pkg}
              onChange={loadPackage}
              options={PACKAGES}
            />
            <Param
              label="thermal-design.rjcJunctionToCase"
              unit="K/W"
              value={rjc}
              onChange={setRjc}
              min={0.05}
              max={200}
            />
            <Param
              label="thermal-design.rcsInterface"
              unit="K/W"
              value={rcs}
              onChange={setRcs}
              min={0.01}
              max={10}
              hint="thermal-design.grease02Pad"
            />
            <Param
              label="thermal-design.rsaSinkToAir"
              unit="K/W"
              value={rsa}
              onChange={setRsa}
              min={0.1}
              max={500}
            />
            <Param
              label="thermal-design.sinkHeatCapacity"
              unit="J/K"
              value={cth}
              onChange={setCth}
              min={0.1}
              max={10000}
              hint="thermal-design.massTimesSpecificHeat"
            />
          </Group>

          <Group label="thermal-design.limits">
            <Param
              label="common.ambient"
              unit="°C"
              value={ambientC}
              onChange={setAmbientC}
              min={-40}
              max={85}
              log={false}
              step={1}
              hint="thermal-design.insideASealedEnclosure"
            />
            <Param
              label="common.tjMax"
              unit="°C"
              value={tjMaxC}
              onChange={setTjMaxC}
              min={85}
              max={200}
              log={false}
              step={5}
              hint="thermal-design.125CForMost"
            />
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="°C" />

      <ReadoutGrid
        items={[
          {
            label: 'thermal-design.junctionTj',
            value: degC(r.tj),
            note: <T k="thermal-design.kOverAmbient" vars={{ rise: r.rise.toFixed(1) }} />,
            warn: r.overTemp,
          },
          { label: 'thermal-design.caseTc', value: degC(r.tc) },
          {
            label: 'thermal-design.sinkTs',
            value: degC(r.ts),
            note:
              kelvinToCelsius(r.ts) > TOUCH_LIMIT_C ? 'thermal-design.willBurnOnContact' : 'thermal-design.safeToTouch',
          },
          {
            label: 'common.dissipation',
            value: formatSI(power, 'W'),
            note: mode === 'ldo' ? <T k="thermal-design.efficient" vars={{ efficiency: (efficiency * 100).toFixed(0) }} /> : undefined,
          },
          { label: 'thermal-design.rthJunctionToAir', value: formatSI(r.rTotal, 'K/W') },
          {
            label: 'thermal-design.marginToTjMax',
            value: `${r.margin.toFixed(1)} K`,
            note: r.margin >= MARGIN_TARGET_K ? undefined : <T k="thermal-design.aimForK" vars={{ MARGIN_TARGET_K }} />,
            warn: r.margin < MARGIN_TARGET_K,
          },
          {
            label: 'thermal-design.rsaRequired',
            value: r.sinkImpossible ? 'thermal-design.noneExists' : formatSI(r.requiredRsa, 'K/W'),
            note: <T k="thermal-design.toSitOnC" vars={{ tjMaxC: tjMaxC.toFixed(0) }} />,
            warn: r.sinkImpossible,
          },
          {
            label: 'thermal-design.powerCeiling',
            value: formatSI(r.maxPower, 'W'),
            note: <T k="thermal-design.atCAmbient" vars={{ ambientC: ambientC.toFixed(0) }} />,
          },
          {
            label: 'thermal-design.budgetUsed',
            value: `${(r.utilisation * 100).toFixed(0)}%`,
            note: 'thermal-design.ofTheAmbientTo',
            warn: r.utilisation > 1,
          },
          {
            label: 'thermal-design.sinkTimeConstant',
            value: formatSI(r.tau, 's'),
            note: 'thermal-design.63OfTheRise',
          },
        ]}
      />

      <Warning when={r.overTemp && r.sinkImpossible}
        text="thermal-design.warn1"
        vars={{
          tj: degC(r.tj),
          tjMaxC: tjMaxC.toFixed(0),
          power: formatSI(power, 'W'),
          maxPower: formatSI(r.maxPower, 'W'),
        }}
      />
      <Warning when={r.overTemp && !r.sinkImpossible}
        text="thermal-design.warn2"
        vars={{
          tj: degC(r.tj),
          tjMaxC: tjMaxC.toFixed(0),
          requiredRsa: formatSI(r.requiredRsa, 'K/W'),
          e: formatSI(Math.max(0, r.requiredRsa - MARGIN_TARGET_K / Math.max(power, 1e-9)), 'K/W'),
          MARGIN_TARGET_K,
          maxPower: formatSI(r.maxPower, 'W'),
        }}
      />
      {!r.overTemp && r.margin < MARGIN_TARGET_K && (
        <Warning
          text="thermal-design.warn3"
          vars={{ margin: r.margin.toFixed(1), MARGIN_TARGET_K }}
        />
      )}
      <Warning when={mode === 'ldo' && vout > vin}
        text="thermal-design.warn4"
      />

      <Theory
        text={[
          'thermal-design.theory1',
          'thermal-design.turnItRoundTo',
          'thermal-design.aKelvinAndA',
          'thermal-design.theTraceIsA',
          'thermal-design.aLinearRegulatorThrows',
        ]}
      />
    </SimPage>
  )
}
