import { describe, expect, it } from 'vitest'
import { en } from './en'
import { tr } from './tr'

/**
 * Keeps the dictionaries honest against the source.
 *
 * A string that never reaches en.ts is a string no language can ever translate,
 * and nothing about the running app would look wrong: it just renders in
 * English forever. That is the failure this file exists to catch, so adding a
 * simulator fails here until its strings are in both maps.
 */

// Vite reads these at build time, so the test needs no filesystem access.
const SOURCES = import.meta.glob('../**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Everything but this directory, whose own strings are the dictionary, and the
// engine tests, which are not user facing.
const SCANNED = Object.entries(SOURCES).filter(
  ([path]) => path.startsWith('../') && !path.endsWith('.test.ts'),
)

const STR = String.raw`'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"`
const KEYS = String.raw`k|text|lede|hint|label|placeholder|title|summary|aria-label|note|value|blurb|name`

const pick = (m: RegExpMatchArray) => m[1] ?? m[2] ?? m[3] ?? m[4]
const norm = (s: string) =>
  s.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim()

/** Symbols, part numbers and bare units read the same in every language. */
const translatable = (text: string) =>
  /[A-Za-z]{2,}/.test(text) &&
  !/^[A-Z0-9][A-Z0-9-]*\d[A-Z0-9-]*( [\d.]+ ?[A-Za-zΩ%]{1,3})*$/.test(text)

/**
 * The value of `key={...}`, `key: ...` or `const name = ...`, so a phrase picked
 * by a ternary counts whether it is used on the spot or parked in a local first.
 */
function* valueExpressions(src: string) {
  const HEADS = String.raw`\b(?:${KEYS})\s*(=\{|:\s)|\bconst \w+ (=)\s`
  for (const m of src.matchAll(new RegExp(HEADS, 'g'))) {
    let i = (m.index ?? 0) + m[0].length
    const start = i
    let depth = m[1] === '={' ? 1 : 0
    for (; i < src.length; i++) {
      const c = src[i]
      if (c === "'" || c === '"' || c === '`') {
        const quote = c
        for (i++; i < src.length && src[i] !== quote; i++) if (src[i] === '\\') i++
        continue
      }
      if ('([{'.includes(c)) depth++
      else if (')]}'.includes(c)) {
        if (depth === 0) break
        if (--depth === 0 && m[1] === '={') break
      } else if (m[1] !== '={' && depth === 0) {
        if (c === ',') break
        // A ternary is usually wrapped with ? and : starting the next lines, so
        // a newline only ends the value when what follows is not one of them.
        if (c === '\n' && !/^\s*[?:]/.test(src.slice(i + 1, i + 40))) break
      }
    }
    const expr = src.slice(start, i)
    // A const can hold anything: a lookup table, a filtered list, a style
    // object. Only a plain ternary over string literals is display copy, judged
    // with the literals removed so punctuation inside them does not count.
    const skeleton = expr.replace(new RegExp(STR, 'g'), '')
    if (m[2] && !(skeleton.includes('?') && !/[{([]/.test(skeleton))) continue
    yield expr
  }
}

function keysIn(src: string): string[] {
  const out: string[] = []
  const take = (raw: string | undefined) => {
    if (raw == null) return
    const text = norm(raw)
    if (text && translatable(text)) out.push(text)
  }

  for (const m of src.matchAll(new RegExp(String.raw`\bt\(\s*(?:${STR})`, 'g'))) take(pick(m))
  for (const m of src.matchAll(new RegExp(String.raw`\b(?:${KEYS})=(?:\{\s*)?(?:${STR})`, 'g')))
    take(pick(m))
  for (const block of src.matchAll(/text=\{\[([\s\S]*?)\]\}/g))
    for (const m of block[1].matchAll(new RegExp(STR, 'g'))) take(pick(m))
  for (const expr of valueExpressions(src))
    if (expr.includes('?')) for (const m of expr.matchAll(new RegExp(STR, 'g'))) take(pick(m))
  for (const m of src.matchAll(new RegExp(String.raw`\b(?:${KEYS})\s*:\s*(?:${STR})`, 'g')))
    take(pick(m))
  // A vars object carries phrases the page picks between, not just numbers.
  for (const block of src.matchAll(/vars=\{\{([\s\S]*?)\n\s*\}\}/g))
    for (const m of block[1].matchAll(new RegExp(STR, 'g'))) take(pick(m))

  return out
}

describe('i18n coverage', () => {
  it('has every displayable string in en.ts', () => {
    const missing = new Map<string, string>()
    for (const [path, src] of SCANNED)
      for (const key of keysIn(src)) if (!(key in en)) missing.set(key, path)

    expect(
      [...missing].map(([key, path]) => `${path.replace('../', 'src/')}: ${key}`),
    ).toEqual([])
  })

  it('translates every en.ts key into Turkish', () => {
    expect(Object.keys(en).filter((k) => !(k in tr))).toEqual([])
  })

  it('has no Turkish entry the app can never ask for', () => {
    expect(Object.keys(tr).filter((k) => !(k in en))).toEqual([])
  })

  it('keeps the placeholders of a translation matching its key', () => {
    const holders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',')
    const broken = Object.entries(tr).filter(([k, v]) => holders(k) !== holders(v))
    expect(broken.map(([k]) => k)).toEqual([])
  })
})
