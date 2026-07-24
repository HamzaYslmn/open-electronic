# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`open-electronic`: browser-based electronics simulators and calculators for engineers. The app lives in `web/`.
Every simulator runs real formulas client-side and drives the same live oscilloscope component.

All 51 simulators are built. `web/src/catalog.ts` is the full list, with the headline formula on each entry.

## Commands

All commands run from `web/`.

```bash
pnpm install     # first time; esbuild's postinstall is allowlisted in pnpm-workspace.yaml
pnpm dev         # vite dev server on :5173
pnpm build       # tsc -b (strict) then vite build; both must pass
pnpm test        # vitest run, engine tests only
pnpm test:watch  # vitest watch
pnpm i18n        # translation status: untranslated, mismatched placeholders, unused keys
pnpm vitest run src/engine/rc.test.ts   # single test file
pnpm vitest run -t "reaches 63.2%"      # single test by name
```

## Architecture

```
web/src/
  engine/      pure TypeScript maths, NO React imports, one module per domain + <name>.test.ts
  ui/          generic primitives with no domain knowledge (see below)
  sims/        ONE file per simulator, named after its catalog id: rc-filter.tsx
  i18n/        en.ts and tr.ts, every string in the app, plus the useT hook
  catalog.ts   the registry: routes, home grid, sidebar and category colours derive from it
```

Related simulators share one engine module rather than each getting their own: `logic.ts` covers the I2C
pull-up, level shifter and debounce pages because all three are RC edges on a digital net; `conductor.ts`
covers trace width and wire gauge; `sensing.ts` covers the ADC, thermistor and current shunt. Prefer
extending one of these to adding a near-duplicate module.

There is no `pages/` or `components/` directory. A simulator is a single file in `sims/`; anything reusable
belongs in `ui/`. Three layers only, and the dependency arrow points one way: `sims/` imports from `ui/` and
`engine/`, `ui/` imports from `engine/`, `engine/` imports nothing local except other engine modules.

The `ui/` primitives exist so a simulator is mostly declaration. Use them rather than hand-rolling markup.
A sim imports the lot from one barrel, `import { SimPage, Param, Group, ReadoutGrid, Warning, ... } from '../ui'`,
never the individual files.

| Primitive | Purpose |
| --- | --- |
| `SimPage` | Page layout. Reads title/blurb from the catalog by `id`, so a sim never renders its own `<h1>`. |
| `Oscilloscope` | The scope. Pages pass data only; it owns its front panel. Trace `color` is optional and defaults to `TRACE_COLORS` in array order, so pass one only to pin a channel's hue across a mode switch. |
| `Param` | Log slider + SI text box that parses `4k7`, `100n`, `2.2 uF`. `int` rounds the emitted value for counts (turns, bits), so no `(v) => set(Math.round(v))` wrapper. |
| `Schematic` / `Dot` | The circuit-diagram frame and a junction dot. Stroke, fill and text defaults live in `.schematic` CSS, so a page's SVG is geometry only: bare `<path>`/`<rect>`/`<text>` with no styling attributes. Never re-wrap children in `<g fill=... stroke=...>`. |
| `ReadoutGrid` / `Warning` / `Theory` | Derived-value tiles, out-of-range caution, collapsible maths. `Warning` gates itself: `<Warning when={op.dcm} .../>`, no `{cond && (...)}` wrapper. Prose is passed as `text` strings, never as markup, so it can be translated: wrap formulas in `` `backticks` `` and emphasis in `*stars*`, and interpolate live values with `{name}` plus a `vars` entry. |
| `Group` / `Segmented` / `Select` / `Toggle` | Controls-column building blocks. `Group` is a collapsible `<details>` section; the column is sticky and scrolls inside itself on desktop, so a page with many sliders never forces a long page scroll. |
| `useSource` + `SourceControls` | The shared stimulus (waveform, frequency, amplitude, offset, duty, cycles). |

`SimPage` puts `.stage` (scope + readouts) first in the DOM and `.controls` second. Keep that order: it stacks
the scope above the fold on a phone while still rendering controls on the right at desktop width.

The shell in `App.tsx` is a CSS grid: topbar across the top, `Sidebar` (every simulator, always visible) in the
left column, routed page in the right. Under 800px the sidebar becomes an off-canvas drawer, same markup.

**Adding a simulator is four steps:** write `engine/<domain>.ts` plus its test, add the page's strings to
`i18n/en.ts` and `i18n/tr.ts` under `<id>.*` (including `<id>.title`, `<id>.blurb` and `<id>.use`), write
`sims/<id>.tsx` referring to those keys, then flip the catalog entry to `status: 'ready'` and attach
`Component: lazy(() => import('./sims/<id>'))`. Routes, the home grid, the sidebar and the
"Where is it used?" card all pick it up automatically. Do not add a route by hand.

### Internationalisation

No display text lives in a component. `i18n/en.ts` holds the English under short stable keys, `i18n/tr.ts`
holds the Turkish under the same keys, and the source refers to keys only:

```tsx
<Param label="buck.inductorL" unit="H" ... />
<Warning text="buck.dcm" vars={{ boundary: formatSI(op.boundary, 'A') }} />
```

Keys are `<sim-id>.<what>`, or `common.<what>` when more than one page uses the string. Roles are
predictable: `<id>.title`, `<id>.blurb`, `<id>.lede`, `<id>.use`, `<id>.theory1..n`, `<id>.warn1..n`.
The "Where is it used?" card is looked up as `<id>.use`, so there is no separate table of them.

**The compiler is the only checker, and it is enough.** `t()` takes a `Key`, and `tr.ts` is typed
`Record<Key, string>`, so a typo, a missing translation and a stale key are all build errors. Nothing scans
the source, and rewording an English sentence cannot break its translation, because the key does not move.

- `pnpm i18n` reports what types cannot see: entries identical to the English, placeholders that differ
  between a key and its translation, and keys nothing refers to.
- `sym('R1')` is the escape hatch for a label that is a symbol rather than prose, so it is obvious in review
  that nothing was forgotten. Use it for part numbers, pin names and units, nothing else.
- `tr.ts` is fetched **on demand**, only when Turkish is selected (`LOADERS` in `i18n/index.tsx`), so an
  English visitor never downloads it.
- `{name}` placeholders come from `vars` and may be reordered by a translation. A placeholder holding a key
  is itself translated, which lets a page choose between whole phrases instead of gluing fragments together.
  Never interpolate a raw state id into a sentence: it will not be translated.

**Pages almost never call `t()`.** The `ui/` primitives translate their own labels, so a page passes a key
and cannot forget. Use `<T k="..." vars={{ ... }} />` where a live value goes into a slot that takes a node,
and `useT()` only where a bare string is needed, such as an `aria-label`.

Add a language by adding one map next to `tr.ts` and one line in `LOADERS`.

### Rules that matter

- **The engine never imports React.** It is plain functions over numbers so it stays unit-testable headlessly.
  Components own state and rendering; they never contain circuit maths. The one thing it may import is
  `type { Key }`, for the option tables it exports; a type-only import is erased at build and costs it nothing.
- **Base SI units everywhere internally** (V, A, Ω, F, H, s, Hz, W). Prefixes exist only at the display and
  input edge via `formatSI` / `parseSI` in `engine/units.ts`. Never store `"4.7k"` or `4.7` meaning kilohms in state.
- **Time-domain simulation uses exact zero-order-hold discretisation**, not forward Euler. See `engine/rc.ts`:
  `y[n] = x[n] + (y[n-1] - x[n]) * exp(-dt/tau)`. Euler diverges once `dt > 2*tau`, which a user hits instantly by
  dragging a frequency slider. Any new time-domain solver must be unconditionally stable in the same way.
- **Derive traces in a `useMemo`** keyed on every parameter. That is what makes the scope feel live; there is no
  animation loop and none is needed.
- Real parts have tolerances and formulas have valid ranges. Keep datasheet constants named, and surface a warning
  when the user leaves the region where the model holds (saturation, DCM, GPIO current limits) rather than
  silently returning a number.

### Oscilloscope contract

`<Oscilloscope traces={[{label, samples}]} dt={secondsPerSample} unit="V" />`. Pages supply data only;
the scope owns its own front panel (timebase zoom, volts/div, trace thickness, channel on/off, reset).
`color` is optional and falls back to `TRACE_COLORS` in array order; pass an explicit one only to hold a
channel's hue when the trace list changes between modes. Never hardcode hex.

Performance rules, because these are what keep it smooth and are easy to break:

- **Pan/zoom state lives in a ref, never in React state.** A drag mutates `view.current` and schedules one
  `requestAnimationFrame` redraw. Putting the view in `useState` would re-render the tree on every pointer move.
- **Draw cost is bounded by pixel width, not buffer length.** When the visible window holds more samples than
  pixel columns, each column collapses to a min/max pair. Zooming in narrows the window, so cost falls.
  A 1M-sample buffer costs the same as a 2k one.
- **The min/max path stays open across columns.** Starting a new subpath per column leaves gaps that render as
  a dashed line. Each column is entered from the end nearest the previous one so edges do not zigzag.
- The canvas needs `touch-action: none` or mobile pinch/pan scrolls the page instead.

Do not swap in a charting library; none of the above survives it.

## Style

- No em dashes in code, comments, docs or commit messages.
- No AI attribution in commits.
