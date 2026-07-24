import { useEffect, useId, useState } from 'react'
import { clamp, formatSI, parseSI } from '../engine/units'

export type ParamProps = {
  label: string
  unit?: string
  value: number
  onChange: (next: number) => void
  min: number
  max: number
  /** Log slider travel. Correct default for R, C, L and frequency. */
  log?: boolean
  /** Linear step. Ignored when log is set. */
  step?: number
  hint?: string
}

const TICKS = 1000

/**
 * Slider plus a text box that understands engineering notation, so "4k7",
 * "100n" and "2.2 uF" all work. The slider is logarithmic by default because
 * component values span decades and a linear slider spends 90% of its travel
 * in the top decade.
 */
export default function Param({
  label,
  unit = '',
  value,
  onChange,
  min,
  max,
  log = true,
  step,
  hint,
}: ParamProps) {
  const id = useId()
  const [text, setText] = useState(() => formatSI(value, unit))
  const [invalid, setInvalid] = useState(false)

  // Re-sync the box when the value changes from outside (slider, preset button).
  useEffect(() => {
    setText(formatSI(value, unit))
    setInvalid(false)
  }, [value, unit])

  const usableLog = log && min > 0
  const toSlider = (v: number) =>
    usableLog
      ? ((Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))) * TICKS
      : ((v - min) / (max - min)) * TICKS
  const fromSlider = (s: number) => {
    if (!usableLog) return min + (s / TICKS) * (max - min)
    const lo = Math.log10(min)
    return Math.pow(10, lo + (s / TICKS) * (Math.log10(max) - lo))
  }

  const commit = (raw: string) => {
    const parsed = parseSI(raw)
    if (Number.isNaN(parsed)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    onChange(clamp(parsed, min, max))
  }

  return (
    <div className="param">
      <label htmlFor={id}>
        <span>{label}</span>
        <input
          id={id}
          className={invalid ? 'param-text invalid' : 'param-text'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit((e.target as HTMLInputElement).value)
          }}
          spellCheck={false}
          aria-invalid={invalid}
        />
      </label>
      <input
        type="range"
        min={0}
        max={TICKS}
        step={usableLog ? 1 : ((step ?? (max - min) / TICKS) / (max - min)) * TICKS}
        value={clamp(toSlider(value), 0, TICKS)}
        onChange={(e) => onChange(clamp(fromSlider(Number(e.target.value)), min, max))}
        aria-label={label}
      />
      {hint && <small className="param-hint">{hint}</small>}
    </div>
  )
}
