# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`open-electronic`: browser-based electronics simulators and calculators for engineers. The app lives in `web/`.
Every simulator runs real formulas client-side and drives the same live oscilloscope component.

All 49 simulators are built. `web/src/catalog.ts` is the full list, with the headline formula on each entry.

## Commands

All commands run from `web/`.

```bash
pnpm install     # first time; esbuild's postinstall is allowlisted in pnpm-workspace.yaml
pnpm dev         # vite dev server on :5173
pnpm build       # tsc -b (strict) then vite build; both must pass
pnpm test        # vitest run, engine tests only
pnpm test:watch  # vitest watch
pnpm vitest run src/engine/rc.test.ts   # single test file
pnpm vitest run -t "reaches 63.2%"      # single test by name
```

## Architecture

```
web/src/
  engine/      pure TypeScript maths, NO React imports, one module per domain + <name>.test.ts
  ui/          generic primitives with no domain knowledge (see below)
  sims/        ONE file per simulator, named after its catalog id: rc-filter.tsx
  i18n/        translation map and the useT hook
  catalog.ts   the registry: routes, home grid, sidebar and category colours derive from it
  useCases.ts  the "Where is it used?" text, keyed by catalog id
```

Related simulators share one engine module rather than each getting their own: `logic.ts` covers the I2C
pull-up, level shifter and debounce pages because all three are RC edges on a digital net; `conductor.ts`
covers trace width and wire gauge; `sensing.ts` covers the ADC, thermistor and current shunt. Prefer
extending one of these to adding a near-duplicate module.

There is no `pages/` or `components/` directory. A simulator is a single file in `sims/`; anything reusable
belongs in `ui/`. Three layers only, and the dependency arrow points one way: `sims/` imports from `ui/` and
`engine/`, `ui/` imports from `engine/`, `engine/` imports nothing local except other engine modules.

The `ui/` primitives exist so a simulator is mostly declaration. Use them rather than hand-rolling markup:

| Primitive | Purpose |
| --- | --- |
| `SimPage` | Page layout. Reads title/blurb from the catalog by `id`, so a sim never renders its own `<h1>`. |
| `Oscilloscope` | The scope. Pages pass data only; it owns its front panel. Colours from `TRACE_COLORS`. |
| `Param` | Log slider + SI text box that parses `4k7`, `100n`, `2.2 uF`. |
| `ReadoutGrid` / `Warning` / `Theory` | Derived-value tiles, out-of-range caution, collapsible maths. Prose is passed as `text` strings, never as markup, so it can be translated: wrap formulas in `` `backticks` `` and emphasis in `*stars*`, and interpolate live values with `{name}` plus a `vars` entry. |
| `Group` / `Segmented` / `Select` / `Toggle` | Controls-column building blocks. |
| `useSource` + `SourceControls` | The shared stimulus (waveform, frequency, amplitude, offset, duty, cycles). |

`SimPage` puts `.stage` (scope + readouts) first in the DOM and `.controls` second. Keep that order: it stacks
the scope above the fold on a phone while still rendering controls on the right at desktop width.

The shell in `App.tsx` is a CSS grid: topbar across the top, `Sidebar` (every simulator, always visible) in the
left column, routed page in the right. Under 800px the sidebar becomes an off-canvas drawer, same markup.

**Adding a simulator is five steps:** write `engine/<domain>.ts` plus its test, write `sims/<id>.tsx`,
add a `useCases.ts` entry for the same id, flip the catalog entry to `status: 'ready'` and attach
`Component: lazy(() => import('./sims/<id>'))`, then run `pnpm test` and add the strings it lists to
`i18n/en.ts` and `i18n/tr.ts`. Routes, the home grid, the sidebar and the "Where is it used?" card all pick
it up automatically. Do not add a route by hand.

### Internationalisation

`i18n/index.tsx` uses the **English source string as the lookup key**, so English needs no map, any string
without a Turkish entry falls back to English by itself, and there is no key-naming scheme to keep in sync
with the text it names. `{name}` placeholders are filled from a `vars` object, which lets a translation
reorder them; a placeholder holding a string is itself translated, so a page can pick between whole phrases
rather than gluing fragments together.

**Pages almost never call `t()`.** The `ui/` primitives translate their own `label`, `note`, `value` and
`hint` when given a plain string, so a simulator passes English and gets translation for free and cannot
forget. Reach for `<T k="..." vars={{ ... }} />` only where the text interpolates a live value into a slot
that takes a node, and for `useT()` only in a component that needs a bare string, such as an `aria-label`.

- `en.ts` is the **generated inventory** of every displayable string, not a runtime lookup. It is the
  checklist a translator works from and what `coverage.test.ts` diffs `tr.ts` against. Nothing imports it in
  the app: since the key already is the English text, shipping it would add 68 kB gzipped of identity map.
- `tr.ts` is fetched **on demand**, only when Turkish is selected (`LOADERS` in `i18n/index.tsx`). It is
  120 kB gzipped, more than the rest of the app, so an English visitor must not pay for it.
- `coverage.test.ts` scans the source and fails if a displayable string is missing from `en.ts`, if `tr.ts`
  is missing a key, or if a translation's placeholders do not match its key. Adding a page fails this test
  until its strings are in both maps, which is the only thing stopping a string from silently staying English.

Add a language by adding one map next to `tr.ts` and one line in `LOADERS`.

### Rules that matter

- **The engine never imports React.** It is plain functions over numbers so it stays unit-testable headlessly.
  Components own state and rendering; they never contain circuit maths.
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

`<Oscilloscope traces={[{label, color, samples}]} dt={secondsPerSample} unit="V" />`. Pages supply data only;
the scope owns its own front panel (timebase zoom, volts/div, trace thickness, channel on/off, reset).
Take trace colours from the exported `TRACE_COLORS` rather than hardcoding hex.

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
