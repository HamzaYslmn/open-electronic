import type { ReactNode } from 'react'
import { Prose, useT } from '../i18n'
import type { Vars } from '../i18n'

export type ReadoutItem = {
  /** A plain string is translated here; use <T> when the text interpolates a value. */
  label: ReactNode
  value: ReactNode
  /** Small trailing note, e.g. a unit conversion or a plain-English reading. */
  note?: ReactNode
  /** Highlights the tile when the design is outside a safe region. */
  warn?: boolean
}

/**
 * The grid of derived values shown under every scope. Translation happens here
 * rather than at the call site, so a page cannot forget to do it.
 */
export function ReadoutGrid({ items }: { items: ReadoutItem[] }) {
  const t = useT()
  const tx = (node: ReactNode) => (typeof node === 'string' ? t(node) : node)

  return (
    <dl className="readout">
      {items.map((it, i) => (
        <div key={i} className={it.warn ? 'warn' : undefined}>
          <dt>{tx(it.label)}</dt>
          <dd>
            {tx(it.value)}
            {it.note && <small> {tx(it.note)}</small>}
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
 *
 * The text is a string rather than markup so it can be translated. Wrap formulas
 * in `backticks` and interpolate live values with {name} plus a vars entry.
 */
export type WarnMsg = { text: string; vars?: Vars }

export function Warning({ text, vars }: WarnMsg) {
  return (
    <p className="warn-note">
      <Prose text={text} vars={vars} />
    </p>
  )
}

/** Collapsible explanation of the formulas a page implements, one string per paragraph. */
export function Theory({ text, vars }: { text: string[]; vars?: Vars }) {
  const t = useT()
  return (
    <details className="theory">
      <summary>{t('The maths behind this page')}</summary>
      {text.map((para, i) => (
        <p key={i}>
          <Prose text={para} vars={vars} />
        </p>
      ))}
    </details>
  )
}
