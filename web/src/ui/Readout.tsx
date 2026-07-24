import type { ReactNode } from 'react'
import { useT } from '../i18n'

export type ReadoutItem = {
  label: string
  value: ReactNode
  /** Small trailing note, e.g. a unit conversion or a plain-English reading. */
  note?: ReactNode
  /** Highlights the tile when the design is outside a safe region. */
  warn?: boolean
}

/** The grid of derived values shown under every scope. */
export function ReadoutGrid({ items }: { items: ReadoutItem[] }) {
  return (
    <dl className="readout">
      {items.map((it) => (
        <div key={it.label} className={it.warn ? 'warn' : undefined}>
          <dt>{it.label}</dt>
          <dd>
            {it.value}
            {it.note && <small> {it.note}</small>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Inline caution for when the user leaves the region where the model holds:
 * a transistor out of saturation, a converter in DCM, a GPIO over its current
 * limit. Prefer this over silently returning a number that is not physical.
 */
export function Warning({ children }: { children: ReactNode }) {
  return <p className="warn-note">{children}</p>
}

/** Collapsible explanation of the formulas a page implements. */
export function Theory({ children }: { children: ReactNode }) {
  const t = useT()
  return (
    <details className="theory">
      <summary>{t('The maths behind this page')}</summary>
      {children}
    </details>
  )
}
