import { useId } from 'react'
import type { ReactNode } from 'react'
import { useT } from '../i18n'

/**
 * Every label in this file goes through the dictionary here rather than at the
 * call site, so a simulator page passes plain English and gets translation for
 * free. Symbols and part numbers (R1, Vin, 1N4148) simply have no entry and
 * fall through unchanged.
 */

/** Section heading inside the controls column. */
export function Group({ label, children }: { label: string; children: ReactNode }) {
  const t = useT()
  return (
    <>
      <h2>{t(label)}</h2>
      {children}
    </>
  )
}

export type SegmentedProps<T extends string> = {
  value: T
  onChange: (next: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
  label?: string
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
  label: string
  value: T
  onChange: (next: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
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
  label: string
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
