import { createContext, useContext } from 'react'

/**
 * Deliberately minimal i18n.
 *
 * The English source string is the lookup key. That keeps call sites readable
 * (`t('Frequency')`, not `t('param.freq')`), removes any chance of a key naming
 * scheme drifting from the text it names, and makes the fallback automatic:
 * an untranslated string renders as English rather than as a raw key.
 *
 * en.ts is the generated inventory of those keys: the checklist a translator
 * works from, and what coverage.test.ts diffs tr.ts against. Nothing imports it
 * at runtime, because the key already is the English text, so shipping it would
 * cost 68 kB gzipped to say nothing.
 *
 * Adding a language means adding one map next to tr.ts and one line in LOADERS.
 */

export type Lang = 'en' | 'tr'

export type Vars = Record<string, string | number>

export const LANGS: ReadonlyArray<{ value: Lang; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'tr', label: 'TR' },
]

/** English needs no map: the key is already the English text. */
const DICTS: Record<Lang, Record<string, string>> = { en: {}, tr: {} }

/**
 * A language pack is a third of a megabyte of prose, so it is fetched only when
 * someone actually selects that language. English visitors download none of it.
 */
const LOADERS: Record<Lang, (() => Promise<Record<string, string>>) | null> = {
  en: null,
  tr: () => import('./tr').then((m) => m.tr),
}

export async function loadLang(lang: Lang): Promise<void> {
  const load = LOADERS[lang]
  if (!load || Object.keys(DICTS[lang]).length > 0) return
  DICTS[lang] = await load()
}

/**
 * Translate, falling back to English, which is the key itself.
 * `{name}` placeholders are filled from `vars`, so a translated sentence can
 * reorder them freely, which Turkish word order frequently needs.
 */
export function translate(lang: Lang, key: string, vars?: Vars): string {
  // A JSX string attribute keeps the newlines and indentation it was written
  // with, so collapse whitespace before looking up. Without this, any prose
  // wrapped across lines in source would silently miss its entry.
  const lookup = key.replace(/\s+/g, ' ').trim()
  const text = DICTS[lang][lookup] ?? key
  if (!vars) return text

  const fill = (s: string) =>
    s.replace(/\{(\w+)\}/g, (whole, name: string) => {
      if (!(name in vars)) return whole
      const value = vars[name]
      // A string placeholder is usually a phrase chosen by the page ("below 0 V"),
      // so it gets translated too. A formatted number has no entry and passes
      // through unchanged.
      if (typeof value !== 'string') return String(value)
      return DICTS[lang][value.replace(/\s+/g, ' ').trim()] ?? value
    })

  // Twice, because a phrase supplied as a placeholder may carry placeholders of
  // its own. Two passes is enough for that and cannot loop.
  return fill(fill(text))
}

export const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: 'en', setLang: () => {} })

/** `const t = useT()` then `t('Catalogue')` or `t('{n} built', { n: 3 })`. */
export function useT(): (key: string, vars?: Vars) => string {
  const { lang } = useContext(LangContext)
  return (key: string, vars?: Vars) => translate(lang, key, vars)
}

export function useLang() {
  return useContext(LangContext)
}

/**
 * Translated text for a slot that takes a node rather than a string, which is
 * how a readout note or a Param hint interpolates a live value without the
 * calling page needing the hook.
 */
export function T({ k, vars }: { k: string; vars?: Vars }) {
  return <>{useT()(k, vars)}</>
}

/** `code` spans and *emphasis* inside translatable prose. */
const RICH = /(`[^`]+`|\*[^*]+\*)/g

/** Prose with inline formulas, used by Warning and Theory. */
export function Prose({ text, vars }: { text: string; vars?: Vars }) {
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

export const STORAGE_KEY = 'open-electronic-lang'
