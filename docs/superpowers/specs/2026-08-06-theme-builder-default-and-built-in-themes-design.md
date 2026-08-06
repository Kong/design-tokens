# Theme Builder: default tab + built-in theme picker

## Context

`packages/design-tokens/sandbox/` is the Vue sandbox app documented in
`.claude/references/design-tokens-sandbox-and-theme-builder.md`. Two of its four surfaces are
relevant here:

- The **Customizer**/**Theme Builder** switch inside the bookmarklet sidebar
  (`components/shared/SandboxUnifiedEmbed.vue`), a segmented control (`SandboxModeSwitch.vue`)
  that currently defaults to Customizer.
- The **Theme Builder** itself (`components/builder/`), which edits a theme's actual source
  files (`*.theme.json` + `*.alias.color.json`), loaded today only via file upload/drag-drop
  (`FileLoader.vue`) one theme at a time.

Two changes are requested:

1. Make Theme Builder the default tab instead of Customizer.
2. Let a user pick one of the 6 built-in themes from a dropdown (mirroring the Customizer's
   existing starting-theme picker) instead of only uploading files, and have that load the real
   `themes/<name>/<name>.theme.json` + `<name>.alias.color.json` source files for that theme.

## 1. Tab order

- `SandboxUnifiedEmbed.vue`: reorder `toolOptions` to `[theme-builder, customizer]` and change
  `selectedTool`'s default (used when `?tool=` is absent from the hash) from `'customizer'` to
  `'theme-builder'`.
- The `?tool=` hash param is **always** written explicitly on every tool switch — the existing
  "omit the implicit default" convention is dropped for this param (kept as-is for the
  Customizer's own `startTheme=`, which is unrelated). `setHashParams({ tool: t })` unconditionally,
  for both values.
- `TokenBrowser.vue` / `BookmarkletModal.vue`: reorder the two "Try it" links so Theme Builder
  appears before Customizer.
- The standalone routes (`/customize`, `/theme-builder`) and their order in `router.ts` are
  unaffected — there's no "default" semantics there, just two independent pages.
- Existing `SandboxUnifiedEmbed.spec.ts` assertions that the default tool is `'customizer'` (and
  that switching to `'customizer'` omits `tool=` from the hash) get updated to match the new
  default and the new always-write-`tool=` behavior.
- Expected consequence, not a bug: a bookmarklet already installed on a hostname, whose persisted
  `src` predates this change and has no `tool=` in it, will open Theme Builder next time instead
  of Customizer, since that's now the default.

## 2. Bundling built-in theme source files

The sandbox's existing `@themes` alias (`../dist/themes/`) only exposes **compiled** resolved
token values — fine for the Browser/Customizer's read-only preview overlay, but useless for
Theme Builder, which needs the raw editable JSON shape (`{ "$value": "..." }` leaves, and
`{color.alias.x.y}` references in the alias file) to feed its existing two-layer
override/cascade model unchanged.

New `sandbox/composables/useBuiltInThemes.ts`, using Vite's raw-import globs (resolved at build
time, relative to the composable file's own location — works identically in dev and the static
`BUILD_SANDBOX=true` GitHub Pages build, no runtime fetch, no new copy step, no base-path/CORS
concerns):

```ts
const themeModules = import.meta.glob('../../themes/*/*.theme.json', { eager: true, query: '?raw', import: 'default' })
const aliasModules = import.meta.glob('../../themes/*/*.alias.color.json', { eager: true, query: '?raw', import: 'default' })
```

Each theme's id is derived from its file path (the `themes/<name>/` segment). The composable
pairs each id with the id/label already declared in `useTokens.ts`'s `THEMES` (same 6 themes,
same order, same display labels — no duplicated theme metadata) and exposes:

```ts
export interface BuiltInTheme {
  id: string
  label: string
  themeText: string
  aliasText: string
  themeFileName: string   // e.g. "electric-lime-day.theme.json"
  aliasFileName: string   // e.g. "electric-lime-day.alias.color.json"
}
export const BUILT_IN_THEMES: BuiltInTheme[]
```

Total bundled payload: ~700KB of raw JSON text across the 6 themes' 12 files — acceptable for a
design-tooling sandbox bundle.

## 3. Theme Builder "Theme" tab UI

`FileLoader.vue` gains a `<select>` labeled "Load an existing theme" above the two existing file
drop-zones:

- First option is a disabled placeholder ("Choose a theme…").
- Remaining options are `BUILT_IN_THEMES`, in the same order/labels as the Customizer's theme
  picker (Classic Day, Classic Night, Electric Lime Day, Electric Lime Day High Contrast,
  Electric Lime Night, Electric Lime Night High Contrast).
- Selecting an option immediately emits the component's existing `load` event with
  `{ themeText, aliasText, themeName: themeFileName, aliasName: aliasFileName }` — the exact
  same payload shape the upload path already emits.
- A small "or upload your own files" divider separates the dropdown from the drop-zones; both
  remain available side by side (per the chosen UI direction — not a mode toggle).

No changes needed to `ThemeBuilder.vue`'s `onLoad` handler or `useThemeBuilder.ts`'s
`loadFiles()` — built-in theme JSON already satisfies the existing shape validation
(`isValidThemeJson`, the alias `color.alias` palette check), verified directly against
`themes/classic-day/classic-day.theme.json` and `classic-day.alias.color.json`. Loading a
built-in theme still advances to the Color Aliases tab next, same as an upload.

## 4. Tests

- New `sandbox/composables/useBuiltInThemes.spec.ts`: all 6 themes present, ids match
  `useTokens.ts`'s `THEMES` ids exactly, each entry's `themeText`/`aliasText` parses to valid
  JSON satisfying the same shape checks `useThemeBuilder.loadFiles()` applies.
- New `sandbox/components/builder/FileLoader.spec.ts` (doesn't exist yet): selecting a built-in
  theme from the dropdown emits `load` with the correct payload; the existing upload/drag-drop
  path still works unchanged alongside it.
- Update `SandboxUnifiedEmbed.spec.ts`'s default-tool and `tool=` hash-persistence assertions per
  section 1.

## Out of scope

- No changes to the Customizer's own starting-theme picker or its `startTheme=` hash convention.
- No changes to the standalone `/customize`/`/theme-builder` routes' relative order.
- No new build script to copy theme files into `public/` — the raw-import glob approach replaces
  that need entirely.
