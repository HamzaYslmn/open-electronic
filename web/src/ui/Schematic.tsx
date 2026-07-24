import type { ReactNode } from 'react'
import { useT } from '../i18n'
import type { Key, Vars } from '../i18n'

/**
 * The frame every circuit diagram shares. Stroke, fill and text defaults live
 * in CSS (`.schematic` in index.css), so a page's SVG is geometry only: bare
 * `<path>`, `<rect>`, `<circle>` and `<text>` with no styling attributes, plus
 * the two symbols below. That is the whole reason a schematic reads as a short
 * list of shapes rather than a wall of repeated `fill="none" stroke=...`.
 */
export function Schematic({
  label,
  vars,
  viewBox,
  children,
}: {
  label: Key
  /** Only when the aria-label interpolates a value, e.g. the buck rectifier. */
  vars?: Vars
  viewBox: string
  children: ReactNode
}) {
  const t = useT()
  return (
    <svg className="schematic" viewBox={viewBox} aria-label={t(label, vars)}>
      {children}
    </svg>
  )
}

/** A filled junction dot, so a three-way node reads as a join not a crossing. */
export function Dot({ x, y, r = 2.5 }: { x: number; y: number; r?: number }) {
  return <circle className="dot" cx={x} cy={y} r={r} />
}
