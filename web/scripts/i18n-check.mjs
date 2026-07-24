// Translation status. Run with: pnpm i18n
//
// TypeScript already guarantees the important half: tr.ts is Record<Key, string>,
// so a missing key cannot compile. This reports the things types cannot see.
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

/** Reads a dictionary without running it, so this needs no build step. */
function dict(file) {
  const src = readFileSync(join(SRC, 'i18n', file), 'utf8')
  const out = new Map()
  // A value is single quoted, or double quoted when it contains an apostrophe.
  const entry = /^ {2}'((?:[^'\\]|\\.)*)':\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"),$/gm
  for (const m of src.matchAll(entry)) {
    const value = m[2] ?? m[3] ?? ''
    out.set(m[1].replace(/\\'/g, "'"), value.replace(/\\(['"\\])/g, '$1'))
  }
  return out
}

const en = dict('en.ts')
const languages = readdirSync(join(SRC, 'i18n'))
  .filter((f) => f.endsWith('.ts') && f !== 'en.ts')
  .map((f) => [f.replace('.ts', ''), dict(f)])

/** Every source file, to spot keys nothing asks for. */
let code = ''
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path)
    else if (/\.tsx?$/.test(entry.name) && !path.includes(`i18n${'\\'}`) && !path.includes('i18n/'))
      code += readFileSync(path, 'utf8')
  }
}
walk(SRC)

const holders = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join(',')
let problems = 0
const report = (title, list, hint) => {
  if (list.length === 0) return
  problems += list.length
  console.log(`\n${title}: ${list.length}${hint ? `  (${hint})` : ''}`)
  for (const line of list.slice(0, 12)) console.log(`  ${line}`)
  if (list.length > 12) console.log(`  ... and ${list.length - 12} more`)
}

console.log(`en.ts: ${en.size} strings`)

for (const [lang, words] of languages) {
  const missing = [...en.keys()].filter((k) => !words.has(k))
  const extra = [...words.keys()].filter((k) => !en.has(k))
  const untouched = [...en].filter(([k, v]) => words.get(k) === v && /[a-z]{4,}\s/.test(v))
  const mismatched = [...en].filter(
    ([k, v]) => words.has(k) && holders(v) !== holders(words.get(k)),
  )

  console.log(
    `\n${lang}.ts: ${words.size} strings, ${en.size - missing.length}/${en.size} translated`,
  )
  report(`  ${lang}: missing`, missing)
  report(`  ${lang}: not in en.ts`, extra)
  report(
    `  ${lang}: identical to English`,
    untouched.map(([k, v]) => `${k}  ${v.slice(0, 60)}`),
    'may be deliberate for a symbol or a part number',
  )
  report(
    `  ${lang}: placeholders differ from the English`,
    mismatched.map(([k, v]) => `${k}  en:${holders(v)}  ${lang}:${holders(words.get(k))}`),
    'a dropped {name} renders as literal braces',
  )
}

// `<id>.use` is looked up from the catalog id, so it never appears literally.
const unused = [...en.keys()].filter(
  (k) => !k.endsWith('.use') && !code.includes(`'${k}'`) && !code.includes(`"${k}"`),
)
report('unused keys', unused, 'nothing in src/ refers to these')

console.log(problems === 0 ? '\nAll good.' : `\n${problems} thing(s) to look at.`)
