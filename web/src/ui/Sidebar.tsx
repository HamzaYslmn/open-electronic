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
          (q === '' ||
            s.title.toLowerCase().includes(q) ||
            s.blurb.toLowerCase().includes(q) ||
            s.formula.toLowerCase().includes(q)),
      ),
    })).filter((g) => g.sims.length > 0)
  }, [filter])

  return (
    <nav className={open ? 'sidebar open' : 'sidebar'} aria-label={t('All simulators')}>
      <input
        className="sidebar-filter"
        type="search"
        placeholder={t('Filter simulators')}
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
                    {sim.title}
                  </NavLink>
                </li>
              ) : (
                <li key={sim.id} className="soon" title="Not built yet">
                  {sim.title}
                </li>
              ),
            )}
          </ul>
        </section>
      ))}

      {groups.length === 0 && <p className="sidebar-empty">{t('No match.')}</p>}
    </nav>
  )
}
