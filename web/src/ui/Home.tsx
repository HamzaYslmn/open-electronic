import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, CATEGORY_COLOR, SIMULATORS, simPath } from '../catalog'
import { useT } from '../i18n'

export default function Home() {
  const t = useT()
  const ready = SIMULATORS.filter((s) => s.status === 'ready').length

  return (
    <div className="home">
      <p className="intro">
        {t(
          'ui.ofSimulatorsBuiltEvery',
          { ready, total: SIMULATORS.length },
        )}
      </p>

      {CATEGORIES.map((category) => {
        const sims = SIMULATORS.filter((s) => s.category === category)
        if (sims.length === 0) return null
        // --cat cascades to the heading and every card in the section.
        const tint = { '--cat': CATEGORY_COLOR[category] } as CSSProperties
        return (
          <section key={category} style={tint}>
            <h2>{t(category)}</h2>
            <div className="grid">
              {sims.map((sim) =>
                sim.status === 'ready' ? (
                  <Link key={sim.id} to={simPath(sim)} className="card ready">
                    <h3>{t(sim.title)}</h3>
                    <p>{t(sim.blurb)}</p>
                    <code>{sim.formula}</code>
                  </Link>
                ) : (
                  <div key={sim.id} className="card planned" aria-disabled="true">
                    <h3>
                      {t(sim.title)} <span className="badge">{t('ui.planned')}</span>
                    </h3>
                    <p>{t(sim.blurb)}</p>
                    <code>{sim.formula}</code>
                  </div>
                ),
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
