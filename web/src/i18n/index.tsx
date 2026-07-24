import { createContext, useContext } from 'react'
import { en } from './en'
import type { Key } from './en'

/**
 * Deliberately small i18n.
 *
 * `en.ts` holds the English text under short stable keys, `tr.ts` holds the
 * Turkish under the same keys. Rewording a sentence is an edit to one value; it
 * cannot break the link to its translation, because the key does not change.
 *
 * `tr.ts` is typed `Record<Key, string>`, so a missing or misspelt translation
 * is a compile error. `t()` takes a `Key`, so a typo at a call site is too.
 * That is the whole safety net: there is nothing to scan and nothing to keep in
 * sync by hand.
 *
 * Adding a language means one file next to tr.ts and one line in LOADERS.
 */

export type { Key }

export type Lang = 'en' | 'tr'

export type Vars = Record<string, string | number>

export const LANGS: ReadonlyArray<{ value: Lang; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'tr', label: 'TR' },
]

/**
 * A language pack is a third of a megabyte of prose, so it is fetched only when
 * someone selects that language. English ships with the app as en.ts.
 */
const packs: Partial<Record<Lang, Record<string, string>>> = {}

const LOADERS: Record<Lang, (() => Promise<Record<string, string>>) | null> = {
  en: null,
  tr: () => import('./tr').then((m) => m.tr),
}

export async function loadLang(lang: Lang): Promise<void> {
  const load = LOADERS[lang]
  if (!load || packs[lang]) return
  packs[lang] = await load()
}

/** The translated text, falling back to English until the pack has loaded. */
const lookup = (lang: Lang, key: string): string | undefined =>
  packs[lang]?.[key] ?? (en as Record<string, string>)[key]

/**
 * `{name}` placeholders are filled from `vars`, so a translation can reorder
 * them, which Turkish word order frequently needs. A placeholder holding a key
 * is itself translated, which lets a page choose between whole phrases instead
 * of gluing fragments together.
 */
export function translate(lang: Lang, key: Key, vars?: Vars): string {
  const text = lookup(lang, key) ?? key
  if (!vars) return text

  const fill = (s: string) =>
    s.replace(/\{(\w+)\}/g, (whole, name: string) => {
      if (!(name in vars)) return whole
      const value = vars[name]
      if (typeof value !== 'string') return String(value)
      return lookup(lang, value) ?? value
    })

  // Twice, because a phrase supplied as a placeholder may carry placeholders of
  // its own. Two passes is enough for that and cannot loop.
  return fill(fill(text))
}

export const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: 'en', setLang: () => {} })

/** `const t = useT()` then `t('common.frequency')` or `t('home.built', { n: 3 })`. */
export function useT(): (key: Key, vars?: Vars) => string {
  const { lang } = useContext(LangContext)
  return (key: Key, vars?: Vars) => translate(lang, key, vars)
}

export function useLang() {
  return useContext(LangContext)
}

/**
 * Translation for a slot that takes a node rather than a string, which is how a
 * readout note interpolates a live value without the page needing the hook.
 */
export function T({ k, vars }: { k: Key; vars?: Vars }) {
  return <>{useT()(k, vars)}</>
}

/** `code` spans and *emphasis* inside translatable prose. */
const RICH = /(`[^`]+`|\*[^*]+\*)/g

/** Prose with inline formulas, used by Warning and Theory. */
export function Prose({ text, vars }: { text: Key; vars?: Vars }) {
  const parts = useT()(text, vars).split(RICH)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : part.startsWith('*') ? (
          <em key={i}>{part.slice(1, -1)}</em>
        ) : (
          part
        ),
      )}
    </>
  )
}

/**
 * A label that is a symbol rather than prose: R1, C2, 10%, IRLZ44N. It reads
 * the same in every language, so it needs no entry. Explicit, so that a real
 * sentence cannot reach the screen untranslated by accident.
 */
export const sym = (text: string) => text as Key

/** Narrows a computed key, e.g. the `<id>.use` a simulator page looks for. */
export const hasKey = (key: string): key is Key => key in en

/**
 * A slot that may hold a key, a formatted number or an element. Only a known
 * key is translated; anything else is already display-ready.
 */
export function useMaybeKey() {
  const t = useT()
  return (value: unknown) =>
    typeof value === 'string' && value in en ? t(value as Key) : value
}

export const STORAGE_KEY = 'open-electronic-lang'
