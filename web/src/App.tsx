import { Suspense, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './ui/Sidebar'
import { READY, simPath } from './catalog'
import Home from './ui/Home'
import { LANGS, LangContext, STORAGE_KEY, loadLang, translate } from './i18n'
import type { Lang } from './i18n'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem(STORAGE_KEY) as Lang) || 'en',
  )
  // Bumped once the language pack has arrived, purely to hand consumers a fresh
  // context object so they re-render against the newly loaded dictionary.
  const [loaded, setLoaded] = useState(0)
  const { pathname } = useLocation()

  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    loadLang(lang).then(() => setLoaded((n) => n + 1))
  }, [lang])

  const ctx = useMemo(() => ({ lang, setLang }), [lang, loaded])
  const t = (key: string) => translate(lang, key)

  return (
    <LangContext.Provider value={ctx}>
      <div className={menuOpen ? 'app menu-open' : 'app'}>
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t('Toggle simulator list')}
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
          <Link to="/" className="brand">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M18 2 L6 18 h7 l-3 12 L26 13 h-8 z" />
            </svg>
            Open Electronic
          </Link>
          <span className="tagline">
            {t('Simulators and calculators for electronics engineers')}
          </span>
          <div className="lang" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l.value}
                className={lang === l.value ? 'on' : ''}
                onClick={() => setLang(l.value)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </header>

        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden={!menuOpen} />

        <main>
          <Suspense fallback={<p className="notice">{t('Loading simulator...')}</p>}>
            <Routes>
              <Route path="/" element={<Home />} />
              {READY.map((sim) =>
                sim.Component ? (
                  <Route key={sim.id} path={simPath(sim)} element={<sim.Component />} />
                ) : null,
              )}
              <Route
                path="*"
                element={
                  <p className="notice">
                    {t('Not built yet.')} <Link to="/">{t('Back to the catalogue')}</Link>
                  </p>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </LangContext.Provider>
  )
}
