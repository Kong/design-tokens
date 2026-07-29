# Design Tokens Sandbox & Theme Builder — Agent Reference

Load this file before modifying anything under `packages/design-tokens/sandbox/`. It covers
the sandbox's three surfaces, the shared infrastructure they depend on, and the reactivity /
testing pitfalls that have actually caused bugs in this codebase.

## What lives here

`packages/design-tokens/sandbox/` is a Vue 3 + `<script setup>` + Vite dev app (hash-routed,
`vue-router` with `createWebHashHistory` — required for GitHub Pages static hosting). It is
**not** Nuxt, has no SSR, and is not published — it only exists to let designers explore and
customize the token set. Run it with `pnpm sandbox:design-tokens` (builds tokens first, then
`vite sandbox`), or `pnpm sandbox:open` from `packages/design-tokens/` for the dev server alone.

Three independent routes (`router.ts`), each with a standalone view and an `?embedded=1`
bookmarklet-sidebar variant of the same component:

| Route | Component | Purpose |
|---|---|---|
| `/` | `pages/HomeView.vue` → `components/browser/TokenBrowser.vue` | Browse all tokens, preview under any repo theme |
| `/customize` | `pages/CustomizerView.vue` → `components/customizer/TokenCustomizer.vue` | Freeform editing of individual CSS custom properties, live-injected into a real page |
| `/theme-builder` | `pages/ThemeBuilderView.vue` → `components/builder/ThemeBuilder.vue` | Edit a theme's actual source files (`*.theme.json` + `*.alias.color.json`) |

## Surface 1 — Token Browser (`components/browser/`)

Read-only exploration tool. `composables/useTokens.ts` is the source of truth:

- `ALL_ENTRIES` — every customizable token (semantic/scale from `@tokens/js` + component from
  `KUI_THEMEABLE_TOKENS`), sorted with natural numeric ordering. **This is the canonical list**
  other composables (Customizer) iterate — never re-derive it.
- `THEMES` / `DEFAULT_THEME_ID` / `isThemeId` — the 4 repo themes (`classic-day`, `classic-night`,
  `electric-lime-day`, `electric-lime-night`) available for live preview, `classic-day` first
  and default (its values equal `ALL_ENTRIES`'s base values exactly).
- `resolveThemedEntries(entries, themeId)` — **pure function**, the single place that overlays a
  theme's declared token values onto a base entry list. A theme only declares what it actually
  overrides (`classic-day`/`classic-night` are semantic-only — zero component tokens; the
  `electric-lime-*` themes are exhaustive — every `KUI_THEMEABLE_TOKENS` entry). Any token a
  theme doesn't mention keeps its base value — this mirrors the real `var(--x, var(--fallback))`
  CSS behavior for an undeclared custom property. **Reused by both the Browser's theme picker
  and the Customizer's starting-theme picker** — do not duplicate this logic a third time.
- `fuzzyMatchTokens(query, ...targets)` — shared multi-term, separator-agnostic filter used by
  both the Browser and the Customizer's search boxes.
- `useTokens()` composable returns per-composable-instance reactive state (`search`,
  `activeCategory`, `activeTheme`, `byCategory`, etc.) — safe to call multiple times, no shared
  module state here (contrast with the Customizer, below).

## Surface 2 — Token Customizer (`components/customizer/`, `composables/useTokenCustomizer.ts`)

Freeform CSS-variable editor with a **live preview** injected into a real page (dev: same-origin
iframe via the Vite proxy; hosted: a bookmarklet sidebar on the target page).

**State is module-scoped, not composable-instance-scoped.** `overrides`, `customProps`, and
`startingThemeId` in `useTokenCustomizer.ts` are declared at module level (`const overrides =
reactive({})`, outside `useTokenCustomizer()`) specifically so they **persist across route
navigation** (e.g. leaving and re-entering `/customize`). This is intentional, but it means:
- Every call to `useTokenCustomizer()` anywhere in the app shares the *same* state — there is
  no per-instance isolation.
- Tests must explicitly reset this state between cases (see Testing section below) — nothing
  does it for you.

Key pieces:
- **Starting theme.** `startingThemeId` (module ref, default `DEFAULT_THEME_ID`) is the
  *baseline* the freeform editor starts from — pick Electric Lime Night and tweak individual
  tokens from there instead of re-entering every value by hand. `setStartingTheme(id)` validates
  against `isThemeId` and returns a boolean. Overrides/custom-props are **absolute values layered
  on top of whichever baseline is selected** — switching the starting theme must never clear or
  mutate them (`themedBaseEntries = computed(() => resolveThemedEntries(ALL_ENTRIES,
  startingThemeId.value))` feeds `visibleGroups` and `fullExportCss`; `overrides`/`customProps`
  are separate reactive maps applied on top, untouched by the theme switch).
- **No "overrides only" mode.** There used to be an "Overrides only / All tokens" inject-mode
  toggle; it was removed. The Customizer now **always** injects/previews/exports the full token
  set with overrides applied (`fullExportCss`). Don't reintroduce a partial-injection mode
  without checking why it was removed — it silently failed to reflect starting-theme switches
  when in "overrides only" mode, which is confusing UX for no real benefit.
- **Share links.** State round-trips through the URL hash (`?o=` for the compressed
  overrides+customProps payload, `?theme=` for a non-default starting theme, `?selector=` for a
  custom injection selector). `encodeOverrides`/`decodeOverrides` handle the `c1:`-prefixed
  deflate-compressed format (falls back to plain base64 without `CompressionStream`).
  `importFromCode(raw)` accepts a full URL, a hash fragment, or a bare `o=` code, and applies
  both `theme=` and `o=` if present — it returns `true` if *either* was successfully applied, not
  only when overrides decode. `importFromCss(css)` is separate: parses raw `:root { ... }` text
  and populates `overrides`/`customProps` only — it never touches `startingThemeId`.
- **Async watcher race guard.** The share-URL watcher awaits `encodeOverrides` (variable-latency
  compression) — overlapping runs from rapid edits are guarded with a generation counter
  (`shareUrlGeneration`) so a slow, stale run can't clobber a faster, newer one. The same pattern
  exists in `useEmbeddedBridge.ts`'s `post()` — copy it, don't invent a new one, if you add
  another async-then-write-shared-state watcher.
- **Embedded bridge.** `useEmbeddedBridge({ isEmbedded, css, buildSrc })` posts
  `kui-token-override` messages to the parent (bookmarklet host page) whenever `css` changes, via
  `watch(opts.css, post)`. Because `css` (`embeddedEffectiveCss` → `fullExportCss` →
  `themedBaseEntries` → `startingThemeId`) already depends on the starting theme, this watcher
  alone is sufficient — there is no need for a separate `watch(startingThemeId, ...)` to force a
  post (one existed and was removed as dead code once the "overrides only" mode was dropped).

Component contract gotcha (**bit us once, watch for the shape again**): `CustTokenRow.vue`
snapshots its displayed value into a local `ref` (`localValue`) on mount and only re-syncs it via
a `watch`. The row is keyed by `entry.cssVar` in `CustTokenGroup.vue`, so **the component
instance persists across a starting-theme switch** — it is never remounted. If the watch source
only tracks `props.overriddenValue` (the active override) and not `props.entry.value` (the
token's default, which *does* change when the starting theme changes), un-overridden rows go
stale and silently keep showing the old theme's values. The fix is to watch both:
`watch(() => [props.overriddenValue, props.entry.value] as const, ...)`. **Any prop that can
change without going through `overriddenValue` needs to be in that watch source** — this is the
general lesson, not just a one-off fix.

## Surface 3 — Theme Builder (`components/builder/`, `composables/useThemeBuilder.ts`, `lib/themeBuilderUtils.ts`)

Designer-oriented editor for a theme's **actual source files** (`*.theme.json` +
`*.alias.color.json`), loaded via file picker/drag-drop, one theme at a time. This is a
different tool from the Customizer — don't conflate them. Two-layer reactive state: alias
palette overrides (cascade) beat theme-file values; explicit token overrides beat the alias
cascade. Color tokens are alias-only (no freeform hex — picked via `AliasPicker.vue`);
non-color tokens are freeform text.

- `lib/themeBuilderUtils.ts` — **pure, Style-Dictionary-free** functions, unit-tested directly
  in `themeBuilderUtils.spec.ts`: `resolveValue`/`parseAliasRef` (one-level `{color.alias.x.y}`
  lookup), `deriveEffectiveCss`, `flattenAliases`, `isColorToken`, `exportThemeJson`/
  `exportAliasJson`, plus the `BuilderToken` type (single source of truth). Keep new pure logic
  here, not inline in components, so it stays testable without mounting Vue.
- `useThemeBuilder.ts` — module-scoped two-layer state (same module-scope-persists-across-nav
  pattern as the Customizer); `effectiveCss`; `initPersistence(host)` restores + debounced-
  persists the full state (theme+alias+overrides+filenames) to
  `localStorage['kui-theme-builder-state:<host|standalone>']`.
- Embedded mode reuses the Customizer's `kui-token-override` postMessage contract — no
  bookmarklet-script change needed to support it.

## Shared infrastructure

- **`lib/hashRouteQuery.ts`** — `getHashParam(key)` / `setHashParams(updates)` read/write query
  params *inside* the hash fragment (`/#/customize?o=abc`), because hash routing means
  `window.location.search` is always empty. `setHashParams` preserves unrelated params and
  calls `history.replaceState` — always go through this, never hand-roll `window.location.hash`
  parsing.
- **`lib/preview-bookmarklet.ts`** — one shared template (`BOOKMARKLET_TEMPLATE`) rendered on a
  target page when the designer clicks the bookmarklet: injects a shared override `<style
  id="kong-design-token-overrides">`, then a sidebar `<iframe>` pointing at the embedded route
  (`?embedded=1`). Two placeholders make one template serve both tools: `__CUSTOMIZER_URL__` (the
  embedded route to open) and `__STORAGE_NS__` (`'customizer'` vs `'theme-builder'`). The
  namespace isn't just cosmetic — it's what lets *both* bookmarklets be active on the same target
  page at once without colliding: it's baked into the DOM element IDs (`kong-<ns>-sidebar`, etc.),
  the `window['__kongListener_<ns>']` re-click guard, and the localStorage restore key
  (`kong-<ns>-url:<hostname>`). `STYLE_ID` is deliberately the *one* exception left unnamespaced
  — only one sidebar's CSS should ever be live on the page at a time. The template appends
  `&host=<target-hostname>` to the iframe src so the embedded app can key its own per-host
  persistence (it can't read the cross-origin parent's hostname otherwise). **Security-relevant:**
  the injected `message` listener validates `e.origin` against the sidebar iframe's own origin
  before applying `e.data.css` — keep that check if you ever touch the listener, or any page/tab
  can post a fake `kui-token-override` into the target site.
- **`vite-preview-proxy.ts`** — Vite dev-only middleware, `/preview-proxy?url=<encoded>`. Strips
  CSP/X-Frame-Options so arbitrary target pages render in the Customizer's dev iframe; injects a
  `networkOverrideScript` that intercepts `fetch`/`XHR`/`history.*`/`location.*`/`<script src>`/
  `<link href>` so the proxied page's own sub-resource requests and SPA router stay inside the
  proxy origin; injects a `headScript` that posts `kui-frame-ready` on load and listens for
  `kui-inject-css`. Preserves the original URL's hash fragment (Node `fetch()` strips it before
  forwarding otherwise).
- **`composables/usePreviewBridge.ts`** — mode-aware (`iframe-proxy` in dev, `bookmarklet-popup`
  in production, `?preview=bookmarklet` forces the latter locally) bridge from a reactive `css`
  ref to the external page. iframe-proxy pushes via both `postMessage` (`sendCssToFrame`, works
  across navigation) and direct `contentDocument` injection (`injectIntoIframe`, belt-and-
  suspenders, same-origin only via the proxy). Its param is a generic `css: Ref<string>` — don't
  assume it's specifically "overrides"; it receives whatever the caller wants injected (currently
  always the full token set).
- **`composables/useEmbeddedBridge.ts`** — the bookmarklet-sidebar-side counterpart:
  `post()`/`close()`, posts `kui-token-override`/`kui-close` to `window.parent`. Has the
  generation-counter async-race guard mentioned above — reuse this pattern, don't reinvent it.
- **`lib/cssUtils.ts`** (`applySelector`) — rewrites a `:root { ... }` block to a different
  selector for custom-scoped injection (e.g. `[data-theme="dark"]`).

## State-management patterns & gotchas

1. **Module-scoped composable state persists across the whole app lifetime**, not just one
   component's mount. Both `useTokenCustomizer.ts` and `useThemeBuilder.ts` do this deliberately
   (survive route nav). If you add new module-level state, decide explicitly whether it should
   behave this way — and if it shouldn't, put it inside the composable function body instead.
2. **Any `ref`/state that snapshots a prop on mount must watch every prop that can independently
   change its resolved value** — not just the "obvious" one. `CustTokenRow.vue`'s bug (above) is
   the concrete example: watching `overriddenValue` alone missed `entry.value` changing via a
   starting-theme switch. When adding a new prop that affects a locally-cached value, ask "what
   makes this prop's *effective* value change without the prop itself notionally changing" and
   put all of those triggers in the watch source.
3. **Async watchers writing shared/exported state need a race guard** if the async work has
   variable latency and can be re-triggered before it resolves (e.g. compression, network). Use
   the generation-counter pattern from `useEmbeddedBridge.ts`'s `post()` / the customizer's
   `shareUrlGeneration`.
4. **Non-destructive layering is a hard invariant for the Customizer**: switching the starting
   theme, importing a theme-only link, etc. must never clear `overrides`/`customProps`. Any new
   feature that changes the "baseline" must go through `themedBaseEntries`/`resolveThemedEntries`
   and leave the override maps untouched.

## Testing conventions

- Spec files touching `window`/`document`/mounting Vue need `// @vitest-environment jsdom` as
  the first line (default is `node`).
- `useTokenCustomizer`/`useEmbeddedBridge` register hooks inside `onMounted`, so call them
  inside a real mounted component (`mount(defineComponent({ setup() { ... } }))`), not bare —
  `onMounted` no-ops outside an active instance.
- `useTokenCustomizer`'s state is module-scoped: reset it in `beforeEach` (`resetAll()` +
  `setStartingTheme(DEFAULT_THEME_ID)` + reset the URL hash), and **unmount every mounted
  wrapper in `afterEach`** — otherwise its `watch`/`onMounted` hooks keep running and racing
  against later tests' state.
- Prefer `flushPromises()` (`@vue/test-utils`) over `await new Promise(r => setTimeout(r, 0))`
  when waiting on an async watcher.
- `electric-lime-day`/`-night` are exhaustive (declare every token) — searching them for a
  token some theme "doesn't declare" finds nothing. Use `classic-day`/`-night` (semantic-only)
  for that, and assert the precondition directly rather than silently skipping via `if (found)`.

## Verification checklist before calling sandbox work done

1. `pnpm build:tokens` (or let `pretest` do it) then `pnpm test` from `packages/design-tokens/`
   — full suite must pass.
2. `pnpm lint` (or `pnpm lint:fix`) on touched files.
3. `pnpm typecheck` — check only the
   errors on lines you touched; this sandbox has some pre-existing strict-null errors in older
   spec files that are out of scope for unrelated changes.
4. For anything touching live preview/injection behavior, **run the dev server and check it in
   a real browser** — reactivity bugs like the `CustTokenRow` one above pass every unit test
   (they're about *component* wiring, not composable logic) and only show up visually. Use
   `pnpm sandbox:open` from `packages/design-tokens/`, and if a port conflict, note the actual
   port Vite picks (it auto-increments past 5173/5174/...).
