import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SIMULATORS } from '../catalog'
import { hasKey, useMaybeKey, useT } from '../i18n'

export type SimPageProps = {
  /** Catalog id. Title and blurb are read from the catalog so they exist once. */
  id: string
  /** Optional longer intro; falls back to the catalog blurb. */
  lede?: ReactNode
  /** Right-hand column: parameter inputs. */
  controls: ReactNode
  /** Main column: scope, readouts, theory. */
  children: ReactNode
}

/**
 * Standard simulator layout. Children (the stage) come first in the DOM so the
 * scope is above the fold on a phone, while the grid still places controls on
 * the right at desktop width.
 *
 * The "Where is it used?" card comes straight from the dictionary under
 * `<id>.use`, so every page gets one and adding a simulator means adding one
 * string rather than an entry in a separate table.
 */
export default function SimPage({ id, lede, controls, children }: SimPageProps) {
  const t = useT()
  const tx = useMaybeKey()
  const sim = SIMULATORS.find((s) => s.id === id)
  const useCase = `${id}.use`

  if (!sim) return null

  return (
    <div className="sim">
      <nav className="crumbs">
        <Link to="/">{t('ui.catalogue')}</Link> / {t(sim.category)} / {t(sim.title)}
      </nav>
      <h1>{t(sim.title)}</h1>
      <p className="lede">{(tx(lede) as ReactNode) ?? t(sim.blurb)}</p>

      {hasKey(useCase) && (
        <details className="usecase" open>
          <summary>{t('ui.whereIsItUsed')}</summary>
          <p>{t(useCase)}</p>
        </details>
      )}

      <div className="sim-body">
        <section className="stage">{children}</section>
        <aside className="controls">{controls}</aside>
      </div>
    </div>
  )
}
