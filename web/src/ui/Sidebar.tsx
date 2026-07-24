import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'
import { CATEGORIES, CATEGORY_COLOR, SIMULATORS, simPath } from '../catalog'
import { useT } from '../i18n'

export type SidebarProps = {
  open: boolean
  onNavigate: () => void
}

/**
 * Always-present list of every simulator. On desktop it is a sticky column; on
 * mobile the same markup slides in as a drawer, so there is one implementation
 * rather than two.
 */
export default function Sidebar({ open, onNavigate }: SidebarProps) {
  const [filter, setFilter] = useState('')
  const t = useT()

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return CATEGORIES.map((category) => ({
      category,
      sims: SIMULATORS.filter(
        (s) =>
          s.category === category &&
          // Match the translated text as well as the English, so filtering
          // works whichever language the list is currently showing.
          (q === '' ||
            [s.formula, t(s.title), t(s.blurb)].some((f) =>
              f.toLowerCase().includes(q),
            )),
      ),
    })).filter((g) => g.sims.length > 0)
  }, [filter, t])

  return (
    <nav className={open ? 'sidebar open' : 'sidebar'} aria-label={t('ui.allSimulators')}>
      <input
        className="sidebar-filter"
        type="search"
        placeholder={t('ui.filterSimulators')}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        spellCheck={false}
      />

      {groups.map(({ category, sims }) => (
        <section key={category} style={{ '--cat': CATEGORY_COLOR[category] } as CSSProperties}>
          <h3>{t(category)}</h3>
          <ul>
            {sims.map((sim) =>
              sim.status === 'ready' ? (
                <li key={sim.id}>
                  <NavLink
                    to={simPath(sim)}
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                    onClick={onNavigate}
                  >
                    {t(sim.title)}
                  </NavLink>
                </li>
              ) : (
                <li key={sim.id} className="soon" title={t('common.notBuiltYet')}>
                  {t(sim.title)}
                </li>
              ),
            )}
          </ul>
        </section>
      ))}

      {groups.length === 0 && <p className="sidebar-empty">{t('ui.noMatch')}</p>}
    </nav>
  )
}
