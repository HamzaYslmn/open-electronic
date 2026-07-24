import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SIMULATORS } from '../catalog'
import { useT } from '../i18n'
import { USE_CASES } from '../useCases'

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
 * The "Where is it used?" card is rendered here from USE_CASES rather than
 * written into each sim, so every page gets one and adding a simulator means
 * adding one string.
 */
export default function SimPage({ id, lede, controls, children }: SimPageProps) {
  const t = useT()
  const sim = SIMULATORS.find((s) => s.id === id)
  const useCase = USE_CASES[id]

  return (
    <div className="sim">
      <nav className="crumbs">
        <Link to="/">{t('Catalogue')}</Link> / {t(sim?.category ?? '')} / {sim?.title}
      </nav>
      <h1>{sim?.title ?? id}</h1>
      <p className="lede">{lede ?? sim?.blurb}</p>

      {useCase && (
        <details className="usecase" open>
          <summary>{t('Where is it used?')}</summary>
          <p>{useCase}</p>
        </details>
      )}

      <div className="sim-body">
        <section className="stage">{children}</section>
        <aside className="controls">{controls}</aside>
      </div>
    </div>
  )
}
