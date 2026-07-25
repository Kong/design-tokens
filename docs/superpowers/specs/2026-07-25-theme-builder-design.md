# Theme Builder Mode — Design Spec

**Date:** 2026-07-25
**Status:** Approved

## Overview

Add a second mode to the design-tokens sandbox: **Theme Builder** (Mode 2). Designers load a theme file pair (`*.theme.json` + `*.alias.color.json`) via file picker, edit alias palette colors and token overrides, and see changes injected into a live page via the existing bookmarklet mechanism. Output is the two edited source files, preserving `{color.alias.x.y}` reference syntax.

Mode 1 (Token Customizer, `/#/customize`) is unchanged throughout. Mode 2 is built as a fully independent route first (Option A), then the shared shell is extracted in a follow-up (Option C).

---

## Scope

**In scope:**
- Editing existing themes (scaffolded via `node scripts/theme-scaffold.mjs`)
- File-picker-based loading (both files required)
- Two-layer reactive state (alias palette overrides + explicit token overrides)
- Color token alias picker (swatch chips + alias names; no freeform hex)
- Non-color token text inputs
- Derived CSS injected into live page via bookmarklet postMessage
- Export as two JSON files (alias refs preserved in theme.json)
- Both standalone (`/#/theme-builder`) and embedded (`/#/theme-builder?embedded=1`) modes
- Second bookmarklet entry in the preview panel

**Out of scope (Phase 1):**
- New theme creation in the browser (use CLI: `node scripts/theme-scaffold.mjs`)
- Share URLs (state too large; file export is the handoff format)
- Shared shell refactor (Option C — follow-up task)

---

## Architecture

### New route

`/#/theme-builder` — standalone
`/#/theme-builder?embedded=1` — bookmarklet sidebar

Added to `sandbox/router.ts`. Existing routes unchanged.

### New files

```
sandbox/pages/ThemeBuilderView.vue           — thin page wrapper
sandbox/composables/useThemeBuilder.ts       — all reactive state and logic
sandbox/lib/themeBuilderUtils.ts             — pure functions (unit-testable)
sandbox/components/builder/
  ThemeBuilder.vue                           — main layout shell
  FileLoader.vue                             — file upload UI (pre-load state)
  PalettePanel.vue                           — alias palette editor (Layer 1)
  TokenList.vue                              — token list with inherited/explicit distinction
  TokenRow.vue                               — single token row
  AliasPicker.vue                            — swatch-chip + alias-name popover picker
  OutputPanel.vue                            — download JSON export
```

### Modified files

```
sandbox/router.ts                            — add theme-builder route
sandbox/components/customizer/
  CustPreviewPanel.vue or BookmarkletModal.vue — add second bookmarklet entry
```

---

## Data model

### Loaded (immutable after upload)

```typescript
// Parsed from *.theme.json
type ThemeJson = Record<string, { $value: string; $description?: string }>

// Parsed from *.alias.color.json
interface AliasJson {
  color: {
    $type: string
    alias: Record<string, SteppedFamily | SingletonAlias>
  }
}
interface SteppedFamily { [step: string]: { $value: string; $description?: string } }
interface SingletonAlias { $value: string; $description?: string }
```

### Reactive state in `useThemeBuilder`

```typescript
// Layer 1 — alias palette overrides
// Key: "blue.50" (stepped) | "black" (singleton)
// Value: resolved hex, e.g. "#3094FF"
const aliasOverrides = reactive<Record<string, string>>({})

// Layer 2 — explicit token overrides (wins over Layer 1 cascade)
// Key: "--kui-button-color-background-primary"
// Value: "{color.alias.blue.50}" (color) | "6px" (non-color) | absent = use theme base
const tokenOverrides = reactive<Record<string, string>>({})
```

### Derived (computed)

| Name | Description |
|---|---|
| `aliasFlat` | `{ family, step\|null, key, baseHex, currentHex, isOverridden }[]` — drives PalettePanel |
| `effectiveCss` | Full `:root { … }` block; recomputes reactively on any Layer 1 or Layer 2 change |
| `builderTokens` | `{ cssVar, baseValue, isColor, derivedValue, source }[]` — drives TokenList |

**Token source values:** `'inherited'` (no Layer 2 override; value comes from alias cascade), `'overridden'` (explicit Layer 2 override set), `'empty'` (base `$value` is `""` and no override).

**Color token detection:** a token is a color token if its `$value` in the loaded `theme.json` matches `{color.alias.*}`. All other tokens use plain text input.

---

## Pure utility functions (`sandbox/lib/themeBuilderUtils.ts`)

### `resolveValue(raw, aliasJson, aliasOverrides) → string`

One-level alias lookup:
- `{color.alias.blue.50}` → `aliasOverrides["blue.50"] ?? aliasJson.color.alias.blue["50"].$value`
- `{color.alias.black}` → `aliasOverrides["black"] ?? aliasJson.color.alias.black.$value`
- Anything else → returned as-is (literal value)

### `deriveEffectiveCss(themeJson, aliasJson, aliasOverrides, tokenOverrides) → string`

Iterates `themeJson`. For each entry:
1. Layer 2 tokenOverrides wins if present
2. Falls back to theme.json `$value`
3. Calls `resolveValue` on the winner
4. Skips empty strings (preserves semantic fallback chain)

Returns `:root { … }` block, or `""` if nothing resolved.

### `exportThemeJson(themeJson, tokenOverrides) → string`

Clones `themeJson`, applies Layer 2 overrides (alias refs written as `{color.alias.X.Y}`). Returns formatted JSON string.

### `exportAliasJson(aliasJson, aliasOverrides) → string`

Clones `aliasJson`, patches `$value` fields for all overridden alias steps. Returns formatted JSON string.

---

## Component design

### Before load: `FileLoader.vue`

Full-area centered upload UI. Two distinct file pickers: one for `*.theme.json`, one for `*.alias.color.json`. Each shows a filename badge with checkmark once selected. "Load Theme" button enables only when both files are chosen. Drag-and-drop supported on both targets. Validation: warns if a file parses unexpectedly (wrong shape).

### After load: `ThemeBuilder.vue` layout

**Standalone mode** — three columns:
- Left: `PalettePanel.vue` (collapsible sidebar)
- Center: `TokenList.vue` (scrollable, fills remaining space)
- Right aside: `OutputPanel.vue`

No live preview column — the bookmarklet window is the live preview.

**Embedded mode** — single column (palette + token list stacked), output aside with two download buttons. Header shows close button and posts `kui-token-override` on every `effectiveCss` change (same postMessage shape as Mode 1).

### `PalettePanel.vue`

Palette families rendered as collapsible sections (e.g. "Blue", "Electric Lime"). Each step is a square color swatch chip with its label beneath (`blue.50`). Clicking a chip opens a native `<input type="color">` inline below. Modified steps show a dot badge on the chip. A "Reset palette" action clears all Layer 1 overrides.

### `TokenList.vue` + `TokenRow.vue`

Tokens grouped by category (derived from theme.json keys), with a filter input. Each row shows:
- CSS var name (e.g. `--kui-button-color-background-primary`)
- Color swatch or value preview
- **Source badge:** `alias: blue.50` (inherited, muted style) | `override` (explicit, accented) | `—` (empty slot)

Color token rows open `AliasPicker.vue` on click. Non-color token rows show an inline text input accepting any string value (no validation — a designer editing `border-radius` or `font-weight` tokens types freely). Every row with an active Layer 2 override has a "Reset" button.

### `AliasPicker.vue`

Popover anchored to the token row. Contents:
- Search input (filters by alias name or approximate hex match)
- Swatch chip grid: each entry shows the color square + `family.step` label beneath
- Currently selected alias highlighted with a ring
- "Reset to theme default" link clears the Layer 2 override

### `OutputPanel.vue`

Two download buttons: **Export theme.json** and **Export alias.color.json**. Each triggers a file download with the filename derived from the loaded file's name. A collapsible preview section shows the first N lines of each output for quick sanity-checking.

---

## Bookmarklet update

`CustPreviewPanel.vue` (or `BookmarkletModal.vue`) currently shows one bookmarklet. Update to show two entries side by side:

| Bookmarklet | URL |
|---|---|
| Token Customizer (existing) | `/#/customize?embedded=1` |
| Theme Builder (new) | `/#/theme-builder?embedded=1` |

The existing bookmarklet's JavaScript template and `__CUSTOMIZER_URL__` replacement are untouched. The Theme Builder entry is a new independent bookmarklet using the same template, with the new URL substituted.

---

## Embedded postMessage contract

Mode 2 uses the **identical** postMessage shape as Mode 1:

```typescript
// Outbound (embedded → parent page)
window.parent.postMessage({
  type: 'kui-token-override',
  css: effectiveCss,           // full :root { … } block from deriveEffectiveCss
  src: currentUrl,             // current hash URL (no encoded overrides — state is file-based)
}, '*')
```

The existing bookmarklet listens for `kui-token-override` and applies the CSS — no bookmarklet code change needed for the injection itself.

**Note on localStorage restoration:** Mode 1 encodes its full override state into the `src` URL, which the bookmarklet stores in `localStorage` for the current hostname, allowing state to survive navigation. Mode 2 cannot do this — theme file content is too large for URL encoding. If a designer closes and re-opens the sidebar, they will need to re-upload their files. The `src` URL sent in Mode 2's postMessage carries no meaningful override payload beyond the base route.

---

## Non-breaking rollout order

1. Add `/#/theme-builder` route with a placeholder view → existing routes unaffected
2. Write and test `themeBuilderUtils.ts` pure functions
3. Build `useThemeBuilder.ts` composable
4. Build `FileLoader.vue`, wire up file parsing
5. Build `PalettePanel.vue`, verify Layer 1 cascade
6. Build `TokenList.vue` + `TokenRow.vue` + `AliasPicker.vue`, verify Layer 2
7. Build `OutputPanel.vue` + export functions
8. Wire embedded postMessage path, test bookmarklet end-to-end
9. Add second bookmarklet entry in preview panel

Each step is independently shippable. Mode 1 is not touched until step 9.

---

## Follow-up (Option C)

Extract a shared `SandboxShell.vue` (header, embedded detection, close button, postMessage bridge) used by both `TokenCustomizer.vue` and `ThemeBuilder.vue`. Deferred until Mode 2 is validated.
