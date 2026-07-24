import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { ADC_LSB, FC_RATIO_GOOD, FC_RATIO_MIN, analyse, simulate } from '../engine/pwmFilter'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Dot, Group, Oscilloscope, Param, ReadoutGrid, Schematic, Segmented, SimPage, Theory, Warning } from '../ui'

/** Samples per sweep, same as every other time-domain page here. */
const N = 8192

/** Below this the PWM edges fall between samples, so the input trace is a lie. */
const MIN_SAMPLES_PER_PERIOD = 8

type View = 'ripple' | 'startup'

function Diagram() {
  return (
    <Schematic viewBox="0 0 260 110" label="pwm-filter.esp32GpioIntoAn">
      <rect x="8" y="20" width="34" height="28" />
      <path d="M42 34h28M25 48v32h199" />
      <rect x="70" y="26" width="44" height="16" />
      <path d="M114 34h106" />
      <path d="M150 34v12M136 46h28M136 56h28M150 56v24" />
      <Dot x={150} y={34} />
      <circle cx="224" cy="34" r="3" />
      <text x="12" y="38" fontSize="9">
        GPIO
      </text>
      <text x="86" y="18">
        R
      </text>
      <text x="168" y="55">
        C
      </text>
      <text x="200" y="24">
        Vout
      </text>
    </Schematic>
  )
}

export default function PwmFilter() {
  // 3.3 V rail: this is an ESP32 GPIO driving the network directly.
  const [vs, setVs] = useState(VCC)
  const [f, setF] = useState(5_000)
  const [dutyPct, setDutyPct] = useState(50)
  const [bits, setBits] = useState(10)
  const [r, setR] = useState(10_000)
  const [c, setC] = useState(1e-6)
  const [view, setView] = useState<View>('ripple')
  const [cycles, setCycles] = useState(4)

  const { dt, traces, readout, showInput } = useMemo(() => {
    const readout = analyse({ vs, r, c, f, duty: dutyPct / 100, bits })
    // Ripple view frames a few switching periods; startup view frames 5 tau,
    // which is the whole charging curve.
    const periods =
      view === 'ripple' ? cycles : Math.max(2, Math.ceil(readout.settle5tau * f))
    const span = periods / f

    const { dt, samples: input } = sweep(
      {
        kind: 'pwm',
        amplitude: vs / 2,
        offset: vs / 2, // swings 0 to vs, which is what a GPIO actually does
        frequency: f,
        duty: readout.dutyEff,
      },
      N,
      periods,
      span,
    )
    const out = simulate({
      vs,
      duty: readout.dutyEff,
      f,
      tau: readout.tau,
      n: N,
      dt,
      y0: view === 'startup' ? 0 : undefined,
    })
    const target = new Float64Array(N).fill(readout.vavg)
    const showInput = N / periods >= MIN_SAMPLES_PER_PERIOD

    return {
      dt,
      readout,
      showInput,
      traces: [
        ...(showInput
          ? [{ label: 'pwm-filter.vpwm', samples: input }]
          : []),
        { label: 'common.vout', samples: out },
        { label: 'common.target', samples: target },
      ],
    }
  }, [vs, r, c, f, dutyPct, bits, view, cycles])

  // A key per phrase, not a fragment glued to punctuation, so it translates.
  const band = (
    { good: 'pwm-filter.cleanDc', marginal: 'pwm-filter.visibleRipple', poor: 'pwm-filter.barelyFiltered' } as const
  )[readout.smoothing]

  return (
    <SimPage
      id="pwm-filter"
      lede="pwm-filter.lede"
      controls={
        <>
          <Segmented
            label="pwm-filter.scopeWindow"
            value={view}
            onChange={setView}
            options={[
              { value: 'ripple', label: 'common.ripple' },
              { value: 'startup', label: 'pwm-filter.startup' },
            ]}
          />
          <Diagram />

          <Group label="common.filter">
            <Param label="common.resistor" unit="Ω" value={r} onChange={setR} min={100} max={1e6} />
            <Param label="common.capacitor" unit="F" value={c} onChange={setC} min={1e-9} max={1e-3} />
          </Group>

          <Group label="common.pwm2">
            <Param
              label="common.frequency"
              unit="Hz"
              value={f}
              onChange={setF}
              min={100}
              max={200e3}
            />
            <Param
              label="common.duty"
              unit="%"
              value={dutyPct}
              onChange={setDutyPct}
              min={0}
              max={100}
              log={false}
              step={0.1}
            />
            <Param
              label="pwm-filter.dutyResolution"
              unit="bit"
              value={bits}
              onChange={setBits} int
              min={4}
              max={16}
              log={false}
              step={1}
            />
            <Param
              label="common.supply"
              unit="V"
              value={vs}
              onChange={setVs}
              min={1.8}
              max={5}
              log={false}
              step={0.1}
            />
            {view === 'ripple' && (
              <Param
                label="common.cyclesShown"
                value={cycles}
                onChange={setCycles} int
                min={1}
                max={20}
                log={false}
                step={1}
              />
            )}
          </Group>
        </>
      }
    >
      <Oscilloscope traces={traces} dt={dt} unit="V" />

      <Warning when={readout.smoothing !== 'good'}
        text="pwm-filter.warn1"
        vars={{ ratio: readout.ratio.toFixed(1), FC_RATIO_GOOD, FC_RATIO_MIN }}
      />
      <Warning when={!readout.bitsOk}
        text="pwm-filter.warn2"
        vars={{ bits, f: formatSI(f, 'Hz'), maxBits: readout.maxBits }}
      />
      <Warning when={!readout.gpioOk}
        text="pwm-filter.warn3"
        vars={{ gpioPeakA: formatSI(readout.gpioPeakA, 'A') }}
      />
      <Warning when={!showInput}
        text="pwm-filter.warn4"
      />

      <ReadoutGrid
        items={[
          {
            label: 'pwm-filter.meanOutput',
            value: formatSI(readout.vavg, 'V'),
            note: `(D = ${(readout.dutyEff * 100).toFixed(2)}%)`,
          },
          {
            label: 'pwm-filter.rippleVpp',
            value: formatSI(readout.vpp, 'V'),
            note: <T k="pwm-filter.ofVout" vars={{ ripplePercent: readout.ripplePercent.toFixed(2) }} />,
            warn: readout.smoothing === 'poor',
          },
          {
            label: 'pwm-filter.rippleOnTheAdc',
            value: `${readout.rippleLsb >= 10 ? Math.round(readout.rippleLsb) : readout.rippleLsb.toFixed(2)} LSB`,
            note: <T k="pwm-filter.12BitStep" vars={{ ADC_LSB: formatSI(ADC_LSB, 'V') }} />,
            warn: readout.rippleLsb > 4,
          },
          {
            label: 'common.usableResolution',
            value: `${readout.effectiveBits > 24 ? '>24' : readout.effectiveBits.toFixed(1)} bit`,
            note: 'pwm-filter.rippleLimited',
          },
          {
            label: 'common.settlingTo1',
            value: formatSI(readout.settle1pc, 's'),
            note: <T k="pwm-filter.5Tau" vars={{ settle5tau: formatSI(readout.settle5tau, 's') }} />,
          },
          {
            label: 'common.cutoffFc',
            value: formatSI(readout.fc, 'Hz'),
            note: <T k="pwm-filter.tau" vars={{ tau: formatSI(readout.tau, 's') }} />,
          },
          {
            label: 'pwm-filter.fPwmFc',
            value: `${readout.ratio < 10 ? readout.ratio.toFixed(2) : Math.round(readout.ratio)}x`,
            note: band,
            warn: readout.smoothing === 'poor',
          },
          {
            label: 'pwm-filter.attenuationAtFPwm',
            value: `${readout.attenDb.toFixed(1)} dB`,
          },
          {
            label: 'pwm-filter.dutyStep',
            value: formatSI(readout.dutyStepV, 'V'),
            note: <T k="pwm-filter.bitMaxAtThis" vars={{ bits, maxBits: readout.maxBits }} />,
            warn: !readout.bitsOk,
          },
          {
            label: 'pwm-filter.peakPinCurrent',
            value: formatSI(readout.gpioPeakA, 'A'),
            note: 'pwm-filter.powerOnCapEmpty',
            warn: !readout.gpioOk,
          },
        ]}
      />

      <Theory
        text={[
          'pwm-filter.anRcLowPass',
          'pwm-filter.rippleIsUsuallyQuoted',
          'pwm-filter.theTraceIsThe',
          'pwm-filter.theTradeoffIsThe',
        ]}
      />
    </SimPage>
  )
}
