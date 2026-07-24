import { useId } from 'react'
import type { ReactNode } from 'react'
import { useT } from '../i18n'
import type { Key } from '../i18n'

/**
 * Labels are dictionary keys, translated here rather than at the call site, so
 * a page cannot forget and a typo is a compile error.
 */

/**
 * Section of the controls column. Foldable, because a page like the MOSFET
 * switch carries twenty sliders and you are usually only touching one section.
 */
export function Group({ label, children }: { label: Key; children: ReactNode }) {
  const t = useT()
  return (
    <details className="group" open>
      <summary>{t(label)}</summary>
      {children}
    </details>
  )
}

export type SegmentedProps<T extends string> = {
  value: T
  onChange: (next: T) => void
  options: ReadonlyArray<{ value: T; label: Key }>
  label?: Key
}

/** Mutually exclusive mode switch, e.g. low pass against high pass. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: SegmentedProps<T>) {
  const t = useT()
  return (
    <div className="seg" role="group" aria-label={label && t(label)}>
      {options.map((o) => (
        <button
          key={o.value}
          className={value === o.value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {t(o.label)}
        </button>
      ))}
    </div>
  )
}

export type SelectProps<T extends string> = {
  label: Key
  value: T
  onChange: (next: T) => void
  options: ReadonlyArray<{ value: T; label: Key }>
}

/** Labelled dropdown, for lists too long to be a Segmented. */
export function Select<T extends string>({ label, value, onChange, options }: SelectProps<T>) {
  const id = useId()
  const t = useT()
  return (
    <div className="field">
      <label htmlFor={id}>{t(label)}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.label)}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Labelled on/off switch. */
export function Toggle({
  label,
  value,
  onChange,
}: {
  label: Key
  value: boolean
  onChange: (next: boolean) => void
}) {
  const t = useT()
  return (
    <label className="toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span>{t(label)}</span>
    </label>
  )
}
