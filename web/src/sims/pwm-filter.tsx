import { useMemo, useState } from 'react'
import { VCC } from '../engine/constants'
import { ADC_LSB, FC_RATIO_GOOD, FC_RATIO_MIN, analyse, simulate } from '../engine/pwmFilter'
import { sweep } from '../engine/signal'
import { formatSI } from '../engine/units'
import { T, useT } from '../i18n'
import { Group, Segmented } from '../ui/Controls'
import Oscilloscope, { TRACE_COLORS } from '../ui/Oscilloscope'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

/** Samples per sweep, same as every other time-domain page here. */
const N = 8192

/** Below this the PWM edges fall between samples, so the input trace is a lie. */
const MIN_SAMPLES_PER_PERIOD = 8

type View = 'ripple' | 'startup'

function Schematic() {
  const t = useT()
  return (
    <svg className="schematic" viewBox="0 0 260 110" aria-label={t('ESP32 GPIO into an RC low pass')}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="20" width="34" height="28" />
        <path d="M42 34h28M25 48v32h199" />
        <rect x="70" y="26" width="44" height="16" />
        <path d="M114 34h106" />
        <path d="M150 34v12M136 46h28M136 56h28M150 56v24" />
        <circle cx="224" cy="34" r="3" />
      </g>
      <g fill="currentColor" fontSize="11">
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
      </g>
    </svg>
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
          ? [{ label: 'Vpwm', color: TRACE_COLORS[0], samples: input }]
          : []),
        { label: 'Vout', color: TRACE_COLORS[1], samples: out },
        { label: 'Target', color: TRACE_COLORS[2], samples: target },
      ],
    }
  }, [vs, r, c, f, dutyPct, bits, view, cycles])

  // Parenthesised here rather than in the note, so the whole phrase is one
  // dictionary key instead of a fragment glued to punctuation.
  const band =
    readout.smoothing === 'good'
      ? '(clean DC)'
      : readout.smoothing === 'marginal'
        ? '(visible ripple)'
        : '(barely filtered)'

  return (
    <SimPage
      id="pwm-filter"
      lede="An ESP32 GPIO toggling into an RC network, i.e. a one-bit DAC. Horizontal axis is time: the ripple view frames a few switching periods, the startup view frames the full 5 tau charging curve. Hide Vpwm on the scope to see the ripple at its own scale."
      controls={
        <>
          <Segmented
            label="Scope window"
            value={view}
            onChange={setView}
            options={[
              { value: 'ripple', label: 'Ripple' },
              { value: 'startup', label: 'Startup' },
            ]}
          />
          <Schematic />

          <Group label="Filter">
            <Param label="Resistor" unit="Ω" value={r} onChange={setR} min={100} max={1e6} />
            <Param label="Capacitor" unit="F" value={c} onChange={setC} min={1e-9} max={1e-3} />
          </Group>

          <Group label="PWM">
            <Param
              label="Frequency"
              unit="Hz"
              value={f}
              onChange={setF}
              min={100}
              max={200e3}
            />
            <Param
              label="Duty"
              unit="%"
              value={dutyPct}
              onChange={setDutyPct}
              min={0}
              max={100}
              log={false}
              step={0.1}
            />
            <Param
              label="Duty resolution"
              unit="bit"
              value={bits}
              onChange={(v) => setBits(Math.round(v))}
              min={4}
              max={16}
              log={false}
              step={1}
            />
            <Param
              label="Supply"
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
                label="Cycles shown"
                value={cycles}
                onChange={(v) => setCycles(Math.round(v))}
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

      {readout.smoothing !== 'good' && (
        <Warning
          text="fc sits only {ratio}x below f_pwm. Aim for {FC_RATIO_GOOD}x (40 dB on the switching fundamental); under {FC_RATIO_MIN}x the RC is not smoothing, it is just rounding the edges. Raise f_pwm or raise R·C."
          vars={{ ratio: readout.ratio.toFixed(1), FC_RATIO_GOOD, FC_RATIO_MIN }}
        />
      )}
      {!readout.bitsOk && (
        <Warning
          text="The LEDC timer cannot do {bits} bits at {f}. 2^bits · f must stay under the 80 MHz APB clock, so {maxBits} bits is the ceiling here. The driver will reject the config."
          vars={{ bits, f: formatSI(f, 'Hz'), maxBits: readout.maxBits }}
        />
      )}
      {!readout.gpioOk && (
        <Warning
          text="Peak pin current is {gpioPeakA} at power-on, when the capacitor is still empty. That is past the 12 mA an ESP32 GPIO is rated for. Raise R."
          vars={{ gpioPeakA: formatSI(readout.gpioPeakA, 'A') }}
        />
      )}
      {!showInput && (
        <Warning
          text="One PWM period is shorter than a scope sample at this time base, so the Vpwm trace is omitted rather than drawn aliased. Vout is a closed-form solution, so it stays exact."
        />
      )}

      <ReadoutGrid
        items={[
          {
            label: 'Mean output',
            value: formatSI(readout.vavg, 'V'),
            note: `(D = ${(readout.dutyEff * 100).toFixed(2)}%)`,
          },
          {
            label: 'Ripple Vpp',
            value: formatSI(readout.vpp, 'V'),
            note: <T k="({ripplePercent}% of Vout)" vars={{ ripplePercent: readout.ripplePercent.toFixed(2) }} />,
            warn: readout.smoothing === 'poor',
          },
          {
            label: 'Ripple on the ADC',
            value: `${readout.rippleLsb >= 10 ? Math.round(readout.rippleLsb) : readout.rippleLsb.toFixed(2)} LSB`,
            note: <T k="(12-bit step {ADC_LSB})" vars={{ ADC_LSB: formatSI(ADC_LSB, 'V') }} />,
            warn: readout.rippleLsb > 4,
          },
          {
            label: 'Usable resolution',
            value: `${readout.effectiveBits > 24 ? '>24' : readout.effectiveBits.toFixed(1)} bit`,
            note: '(ripple limited)',
          },
          {
            label: 'Settling to 1%',
            value: formatSI(readout.settle1pc, 's'),
            note: <T k="(5·tau = {settle5tau})" vars={{ settle5tau: formatSI(readout.settle5tau, 's') }} />,
          },
          {
            label: 'Cutoff fc',
            value: formatSI(readout.fc, 'Hz'),
            note: <T k="(tau = {tau})" vars={{ tau: formatSI(readout.tau, 's') }} />,
          },
          {
            label: 'f_pwm / fc',
            value: `${readout.ratio < 10 ? readout.ratio.toFixed(2) : Math.round(readout.ratio)}x`,
            note: band,
            warn: readout.smoothing === 'poor',
          },
          {
            label: 'Attenuation at f_pwm',
            value: `${readout.attenDb.toFixed(1)} dB`,
          },
          {
            label: 'Duty step',
            value: formatSI(readout.dutyStepV, 'V'),
            note: <T k="({bits} bit, max {maxBits} at this f)" vars={{ bits, maxBits: readout.maxBits }} />,
            warn: !readout.bitsOk,
          },
          {
            label: 'Peak pin current',
            value: formatSI(readout.gpioPeakA, 'A'),
            note: '(power-on, cap empty)',
            warn: !readout.gpioOk,
          },
        ]}
      />

      <Theory
        text={[
          "An RC low pass has unity gain at DC and the rectangle's average is `D·Vs`, so the settled output is `Vout = D·Vs` no matter what R and C are. R and C only decide how much of the switching gets through.",
          "Ripple is usually quoted as `Vpp ≈ Vs·D·(1-D) / (f·R·C)`, which is the small-ripple limit. This page solves it exactly: with `a = e^(-D·T/tau)` and `b = e^(-(1-D)·T/tau)`, matching charge against discharge over one period gives `Vpp = Vs·(1-a)(1-b) / (1-a·b)`. The two agree to a fraction of a percent once tau is more than about ten switching periods, and the approximation reads high below that. Worst-case ripple is always at 50% duty.",
          "The trace is the closed-form response, `y(t) = y_ss(t) + (y0 - y_ss(0))·e^(-t/tau)`, i.e. the periodic steady state plus one decaying exponential. That is exact for a linear time-invariant filter, so it cannot go unstable at any time base.",
          "The tradeoff is the whole point: ripple falls as `1/(R·C)` and settling rises as `5·R·C`, so trading one for the other buys nothing. Raising f_pwm is the only free win, up to the point where the LEDC timer runs out of duty resolution, since `2^bits · f` must stay under the 80 MHz APB clock.",
        ]}
      />
    </SimPage>
  )
}
