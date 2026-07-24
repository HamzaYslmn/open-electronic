import type { ReactNode } from 'react'
import { Prose, useMaybeKey, useT } from '../i18n'
import type { Key, Vars } from '../i18n'

export type ReadoutItem = {
  /** A key, or <T> when the label interpolates a value. */
  label: ReactNode
  /** A key, a formatted number, or a node. Only a key is translated. */
  value: ReactNode
  /** Small trailing note, e.g. a unit conversion or a plain-English reading. */
  note?: ReactNode
  /** Highlights the tile when the design is outside a safe region. */
  warn?: boolean
}

/** The grid of derived values shown under every scope. */
export function ReadoutGrid({ items }: { items: ReadoutItem[] }) {
  const tx = useMaybeKey()

  return (
    <dl className="readout">
      {items.map((it, i) => (
        <div key={i} className={it.warn ? 'warn' : undefined}>
          <dt>{tx(it.label) as ReactNode}</dt>
          <dd>
            {tx(it.value) as ReactNode}
            {it.note != null && <small> {tx(it.note) as ReactNode}</small>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export type WarnMsg = { text: Key; vars?: Vars }

/**
 * Inline caution for when the user leaves the region where the model holds:
 * a transistor out of saturation, a converter in DCM, a GPIO over its current
 * limit. Prefer this over silently returning a number that is not physical.
 *
 * The text is a key rather than markup so it can be translated. Wrap formulas
 * in `backticks` and interpolate live values with {name} plus a vars entry.
 */
export function Warning({ text, vars }: WarnMsg) {
  return (
    <p className="warn-note">
      <Prose text={text} vars={vars} />
    </p>
  )
}

/** Collapsible explanation of the formulas a page implements, one key per paragraph. */
export function Theory({ text, vars }: { text: Key[]; vars?: Vars }) {
  const t = useT()
  return (
    <details className="theory">
      <summary>{t('ui.theMathsBehindThis')}</summary>
      {text.map((para, i) => (
        <p key={i}>
          <Prose text={para} vars={vars} />
        </p>
      ))}
    </details>
  )
}
