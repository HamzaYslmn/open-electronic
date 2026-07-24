import { useMemo, useState } from 'react'
import { VCC, VCC_5V } from '../engine/constants'
import { POWER_DERATING, analyse } from '../engine/zener'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 120" aria-label={t('zener.zenerShuntRegulator')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* input node, series resistor, output rail */}
        <circle cx="20" cy="30" r="3" />
        <path d="M23 30h37M20 33v57h216" />
        <rect x="60" y="22" width="44" height="16" />
        <path d="M104 30h116" />
        {/* zener: diode with the bent cathode bar */}
        <path d="M150 30v14M136 62h28M138 56l12-12 12 12zM136 62l-6 6M164 62l6-6M150 62v28" />
        {/* load */}
        <rect x="204" y="46" width="16" height="30" />
        <path d="M212 30v16M212 76v14" />
        <circle cx="248" cy="30" r="3" />
        <path d="M220 30h25" />
      </g>
      <g fill="currentColor" fontSize="11">
        <text x="74" y="16">
          Rs
        </text>
        <text x="112" y="58">
          Dz
        </text>
        <text x="226" y="64">
          load
        </text>
        <text x="10" y="22">
          Vin
        </text>
        <text x="234" y="22">
          Vout
        </text>
      </g>
    </svg>
  )
}

export default function Zener() {
  // A shunt regulator needs headroom above its output, so the input here is the
  // 5 V USB rail feeding a 3.3 V (VCC) output. Defaults are a 1N4728A: 3.3 V,
  // 1 W, Zzt 10 ohm at the 76 mA test current.
  const [vinMin, setVinMin] = useState(VCC_5V * 0.95)
  const [vinMax, setVinMax] = useState(VCC_5V * 1.05)
  const [vz, setVz] = useState(VCC)
  const [rz, setRz] = useState(10)
  const [pzMax, setPzMax] = useState(1)
  const [izMin, setIzMin] = useState(5e-3)
  const [ilMin, setIlMin] = useState(0)
  const [ilMax, setIlMax] = useState(20e-3)
  const [rs, setRs] = useState(56)

  const r = useMemo(
    () => analyse({ vinMin, vinMax, vz, rz, pzMax, izMin, ilMin, ilMax, rs }),
    [vinMin, vinMax, vz, rz, pzMax, izMin, ilMin, ilMax, rs],
  )

  const noHeadroom = vinMin <= vz
  const suggestion = Number.isFinite(r.rsSuggested) ? r.rsSuggested : null

  return (
    <SimPage
      id="zener"
      lede="zener.lede"
      controls={
        <>
          <Schematic />

          <Group label="zener.inputRange">
            <Param
              label="zener.vinMin"
              unit="V"
              value={vinMin}
              onChange={setVinMin}
              min={0.5}
              max={60}
              log={false}
              step={0.05}
            />
            <Param
              label="zener.vinMax"
              unit="V"
              value={vinMax}
              onChange={setVinMax}
              min={0.5}
              max={60}
              log={false}
              step={0.05}
              hint="zener.includeSupplyToleranceAnd"
            />
          </Group>

          <Group label="zener.zener">
            <Param
              label="zener.vz"
              unit="V"
              value={vz}
              onChange={setVz}
              min={1.8}
              max={50}
              log={false}
              step={0.1}
            />
            <Param
              label="zener.zztDynamic"
              unit="Ω"
              value={rz}
              onChange={setRz}
              min={0.1}
              max={1000}
              hint="zener.datasheetImpedanceAtThe"
            />
            <Param
              label="zener.powerRating"
              unit="W"
              value={pzMax}
              onChange={setPzMax}
              min={0.25}
              max={5}
            />
            <Param
              label="zener.izMinKnee"
              unit="A"
              value={izMin}
              onChange={setIzMin}
              min={1e-4}
              max={0.1}
              hint="zener.datasheetIzkIs1"
            />
          </Group>

          <Group label="common.load">
            <Param
              label="zener.ilMin"
              unit="A"
              value={ilMin}
              onChange={setIlMin}
              min={0}
              max={0.5}
              log={false}
              step={0.0005}
              hint="zener.worstCaseForThe"
            />
            <Param
              label="zener.ilMax"
              unit="A"
              value={ilMax}
              onChange={setIlMax}
              min={1e-4}
              max={0.5}
            />
          </Group>

          <Group label="common.seriesResistor">
            <Param label="zener.rs" unit="Ω" value={rs} onChange={setRs} min={1} max={100e3} />
            {suggestion !== null && (
              <div className="seg">
                <button onClick={() => setRs(suggestion)}>
                  <T k="common.useE24" vars={{ value: formatSI(suggestion, 'Ω') }} />
                </button>
              </div>
            )}
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          {
            label: 'zener.rsWindow',
            value: r.windowValid
              ? `${formatSI(r.rsMin, 'Ω')} to ${formatSI(r.rsMax, 'Ω')}`
              : 'common.none',
            note: r.windowValid ? 'zener.powerLimitToRegulation' : 'zener.noPartFits',
            warn: !r.windowValid,
          },
          {
            label: 'zener.rsFitted',
            value: formatSI(rs, 'Ω'),
            note: suggestion !== null ? <T k="zener.e24Pick" vars={{ suggestion: formatSI(suggestion, 'Ω') }} /> : undefined,
            warn: r.windowValid && (rs < r.rsMin || rs > r.rsMax),
          },
          {
            label: 'zener.izWorstCaseMax',
            value: formatSI(r.hot.iz, 'A'),
            note: <T k="zener.vinMaxIlMin" vars={{ izMaxAllowed: formatSI(r.izMaxAllowed, 'A') }} />,
            warn: r.hot.iz > r.izMaxAllowed,
          },
          {
            label: 'zener.izWorstCaseMin',
            value: formatSI(r.cold.iz, 'A'),
            note: <T k="zener.vinMinIlMax" vars={{ izMin: formatSI(izMin, 'A') }} />,
            warn: r.dropout,
          },
          {
            label: 'zener.zenerDissipation',
            value: formatSI(r.hot.pz, 'W'),
            note: <T k="zener.ofRating" vars={{ pzFraction: (100 * r.pzFraction).toFixed(0) }} />,
            warn: r.overPower || r.overDerated,
          },
          {
            label: 'zener.rsDissipation',
            value: formatSI(r.hot.prs, 'W'),
            note: <T k="zener.fitAPart" vars={{ rsWattage: formatSI(r.rsWattage, 'W') }} />,
          },
          {
            label: 'zener.regulatingInputRange',
            value: `${formatSI(r.vinDropout, 'V')} to ${formatSI(r.vinPowerLimit, 'V')}`,
            note: 'zener.dropoutAtFullLoad',
            warn: r.vinDropout > r.vinPowerLimit,
          },
          {
            label: 'zener.voutAtWorstCase',
            value: formatSI(r.cold.vout, 'V'),
            note: r.cold.regulating ? 'zener.inRegulation' : 'zener.droppedOut',
            warn: !r.cold.regulating,
          },
          {
            label: 'common.outputImpedance',
            value: formatSI(r.zout, 'Ω'),
            note: <T k="zener.loadSwing" vars={{ loadSwing: formatSI(r.loadSwing, 'V') }} />,
          },
          {
            label: 'zener.rippleRejection',
            value: `${r.rippleDb.toFixed(1)} dB`,
            note: <T k="zener.lineSwing" vars={{ lineSwing: formatSI(r.lineSwing, 'V') }} />,
          },
          {
            label: 'common.supplyCurrent',
            value: formatSI(r.supplyMax, 'A'),
            note: <T k="zener.constantTotalLoss" vars={{ pTotal: formatSI(r.pTotal, 'W') }} />,
          },
          {
            label: 'zener.efficiencyAtFullLoad',
            value: `${(100 * r.efficiency).toFixed(1)}%`,
            note: 'zener.midInput',
            warn: r.efficiency < 0.25,
          },
        ]}
      />

      {noHeadroom && (
        <Warning
          text="zener.warn1"
          vars={{ vinMin: formatSI(vinMin, 'V'), vz: formatSI(vz, 'V') }}
        />
      )}

      {!noHeadroom && !r.windowValid && (
        <Warning
          text="zener.warn2"
          vars={{
            rsMin: formatSI(r.rsMin, 'Ω'),
            vinMax: formatSI(vinMax, 'V'),
            rsMax: formatSI(r.rsMax, 'Ω'),
            vinMin: formatSI(vinMin, 'V'),
            ilMax: formatSI(ilMax, 'A'),
          }}
        />
      )}

      {r.dropout && (
        <Warning
          text="zener.warn3"
          vars={{
            irs: formatSI(r.cold.irs, 'A'),
            vinMin: formatSI(vinMin, 'V'),
            iz: formatSI(r.cold.iz, 'A'),
            izMin: formatSI(izMin, 'A'),
            vout: formatSI(r.cold.vout, 'V'),
            rsMax: formatSI(r.rsMax, 'Ω'),
          }}
        />
      )}

      {r.overPower && (
        <Warning
          text="zener.warn4"
          vars={{
            pz: formatSI(r.hot.pz, 'W'),
            pzMax: formatSI(pzMax, 'W'),
            vinMax: formatSI(vinMax, 'V'),
            irs: formatSI(r.hot.irs, 'A'),
            rsMin: formatSI(r.rsMin, 'Ω'),
          }}
        />
      )}

      {!r.overPower && r.overDerated && (
        <Warning
          text="zener.warn5"
          vars={{
            pzFraction: (100 * r.pzFraction).toFixed(0),
            POWER_DERATING: (100 * POWER_DERATING).toFixed(0),
          }}
        />
      )}

      <Theory
        text={[
          'zener.theory1',
          'zener.powerFollowsDirectlyPz',
          'zener.regulationQualityComesFrom',
          'zener.theDcModelTreats',
        ]} vars={{ POWER_DERATING }}
      />
    </SimPage>
  )
}
