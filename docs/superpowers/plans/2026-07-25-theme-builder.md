# Theme Builder Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a designer-oriented "Theme Builder" mode to the design-tokens sandbox that edits a theme's source file pair (`*.theme.json` + `*.alias.color.json`) with a two-layer reactive model and exports the edited files.

**Architecture:** A fully independent Vue route (`/#/theme-builder`) with its own composable and components under `sandbox/components/builder/`. Pure alias-resolution and CSS-derivation functions live in a separately unit-tested `themeBuilderUtils.ts`. Live preview reuses the existing bookmarklet `kui-token-override` postMessage contract unchanged. Mode 1 (`/#/customize`) is not modified until the final bookmarklet-entry task.

**Tech Stack:** Vue 3 (`<script setup>`), TypeScript, Vite, Vitest (node env, `**/*.spec.mjs` glob — vitest transpiles the imported `.ts` on the fly), SCSS.

## Global Constraints

- Run all commands from `packages/design-tokens/`.
- Token naming prefix is `kui`; CSS custom properties look like `--kui-color-background`.
- Color tokens in Theme Builder MUST reference an alias (`{color.alias.family.step}`) — no freeform hex. Non-color tokens accept freeform text.
- Alias step names are the standardized set: `05, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100` plus singletons `black`, `white`, `transparent`.
- Embedded postMessage shape is exactly `{ type: 'kui-token-override', css, src }` posted to `window.parent`.
- TSDoc: single-line `/** … */` for short comments; multi-line for functions/interfaces/types. Avoid `any`.
- Do NOT run git write commands — propose them for the user to run.
- Commit style: conventional commits. The user runs commits; propose the message.
- Tests are `.spec.mjs` files placed next to the code, importing the `.ts` under test.

---

### Task 1: Add placeholder route

**Files:**
- Create: `packages/design-tokens/sandbox/pages/ThemeBuilderView.vue`
- Modify: `packages/design-tokens/sandbox/router.ts`

**Interfaces:**
- Produces: route `theme-builder` at path `/theme-builder`; component `ThemeBuilderView`.

- [ ] **Step 1: Create the placeholder view**

`sandbox/pages/ThemeBuilderView.vue`:
```vue
<template>
  <div style="padding: 40px; font-family: system-ui;">
    Theme Builder — coming soon
  </div>
</template>

<script setup lang="ts">
</script>
```

- [ ] **Step 2: Register the route**

In `sandbox/router.ts`, import the view and add a route object after the `customize` route:
```ts
import ThemeBuilderView from './pages/ThemeBuilderView.vue'
```
```ts
  {
    path: '/theme-builder',
    name: 'theme-builder',
    component: ThemeBuilderView,
    meta: { title: 'Theme Builder' },
  },
```

- [ ] **Step 3: Verify it loads**

Run: `pnpm sandbox:open` and navigate to `http://localhost:5173/#/theme-builder`
Expected: "Theme Builder — coming soon" renders; `/#/customize` still works unchanged.

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 5: Commit**

Propose:
```bash
git add sandbox/pages/ThemeBuilderView.vue sandbox/router.ts
git commit -m "feat(sandbox): add theme-builder route placeholder"
```

---

### Task 2: Pure utility — `resolveValue`

**Files:**
- Create: `packages/design-tokens/sandbox/lib/themeBuilderUtils.ts`
- Test: `packages/design-tokens/sandbox/lib/themeBuilderUtils.spec.mjs`

**Interfaces:**
- Produces:
  - `interface AliasJson { color: { $type?: string; alias: Record<string, AliasEntry> } }`
  - `type AliasEntry = { $value: string; $description?: string } | Record<string, { $value: string; $description?: string }>`
  - `resolveValue(raw: string, aliasJson: AliasJson, aliasOverrides: Record<string, string>): string`
  - `parseAliasRef(raw: string): { family: string; step: string | null } | null`

- [ ] **Step 1: Write the failing test**

`sandbox/lib/themeBuilderUtils.spec.mjs`:
```js
import { describe, it, expect } from 'vitest'
import { resolveValue, parseAliasRef } from './themeBuilderUtils.ts'

const aliasJson = {
  color: {
    alias: {
      blue: { '50': { $value: '#3094FF' } },
      black: { $value: '#000000' },
    },
  },
}

describe('parseAliasRef', () => {
  it('parses a stepped ref', () => {
    expect(parseAliasRef('{color.alias.blue.50}')).toEqual({ family: 'blue', step: '50' })
  })
  it('parses a singleton ref', () => {
    expect(parseAliasRef('{color.alias.black}')).toEqual({ family: 'black', step: null })
  })
  it('returns null for a non-ref', () => {
    expect(parseAliasRef('6px')).toBeNull()
  })
})

describe('resolveValue', () => {
  it('resolves a stepped ref from base', () => {
    expect(resolveValue('{color.alias.blue.50}', aliasJson, {})).toBe('#3094FF')
  })
  it('resolves a singleton ref from base', () => {
    expect(resolveValue('{color.alias.black}', aliasJson, {})).toBe('#000000')
  })
  it('prefers an alias override over base', () => {
    expect(resolveValue('{color.alias.blue.50}', aliasJson, { 'blue.50': '#00BFFF' })).toBe('#00BFFF')
  })
  it('returns literals as-is', () => {
    expect(resolveValue('6px', aliasJson, {})).toBe('6px')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run sandbox/lib/themeBuilderUtils.spec.mjs`
Expected: FAIL — module/exports not found.

- [ ] **Step 3: Implement**

`sandbox/lib/themeBuilderUtils.ts`:
```ts
/** A single alias leaf value with optional description. */
interface AliasLeaf {
  /** The resolved value, e.g. a hex string. */
  $value: string
  /** Optional human-readable description. */
  $description?: string
}

/** An alias family: either a singleton leaf or a map of step name → leaf. */
export type AliasEntry = AliasLeaf | Record<string, AliasLeaf>

/** Parsed `*.alias.color.json` shape. */
export interface AliasJson {
  /** The `color` group containing the alias tree. */
  color: {
    /** Style Dictionary type marker (unused at runtime). */
    $type?: string
    /** Map of family name → alias entry. */
    alias: Record<string, AliasEntry>
  }
}

/** Matches a one-level alias reference `{color.alias.family[.step]}`. */
const ALIAS_REF = /^\{color\.alias\.([a-z_]+)(?:\.([0-9]+))?\}$/i

/**
 * Parses an alias reference string into its family and optional step.
 * @param raw - A candidate value such as `{color.alias.blue.50}`.
 * @returns `{ family, step }` (step is null for singletons), or null if not a ref.
 */
export function parseAliasRef(raw: string): { family: string; step: string | null } | null {
  const m = ALIAS_REF.exec(raw.trim())
  if (!m) return null
  return { family: m[1], step: m[2] ?? null }
}

/**
 * Resolves a token value one level: alias refs become their hex value
 * (honoring `aliasOverrides` first), everything else is returned unchanged.
 * @param raw - The raw token value (may be an alias ref or a literal).
 * @param aliasJson - The loaded alias palette.
 * @param aliasOverrides - Layer 1 overrides keyed by `family.step` or `family`.
 */
export function resolveValue(
  raw: string,
  aliasJson: AliasJson,
  aliasOverrides: Record<string, string>,
): string {
  const ref = parseAliasRef(raw)
  if (!ref) return raw
  const key = ref.step ? `${ref.family}.${ref.step}` : ref.family
  if (aliasOverrides[key]) return aliasOverrides[key]
  const entry = aliasJson.color.alias[ref.family]
  if (!entry) return raw
  if (ref.step) {
    const leaf = (entry as Record<string, AliasLeaf>)[ref.step]
    return leaf?.$value ?? raw
  }
  return (entry as AliasLeaf).$value ?? raw
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec vitest run sandbox/lib/themeBuilderUtils.spec.mjs`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

Propose:
```bash
git add sandbox/lib/themeBuilderUtils.ts sandbox/lib/themeBuilderUtils.spec.mjs
git commit -m "feat(sandbox): add alias-ref resolution utils for theme builder"
```

---

### Task 3: Pure utility — `deriveEffectiveCss`

**Files:**
- Modify: `packages/design-tokens/sandbox/lib/themeBuilderUtils.ts`
- Test: `packages/design-tokens/sandbox/lib/themeBuilderUtils.spec.mjs`

**Interfaces:**
- Consumes: `resolveValue`, `AliasJson`.
- Produces:
  - `type ThemeJson = Record<string, { $value: string; $description?: string }>`
  - `deriveEffectiveCss(themeJson: ThemeJson, aliasJson: AliasJson, aliasOverrides: Record<string, string>, tokenOverrides: Record<string, string>): string`
  - Token key → CSS var: `kui-button-color-background-primary` → `--kui-button-color-background-primary`.

- [ ] **Step 1: Write the failing test**

Append to `themeBuilderUtils.spec.mjs`:
```js
import { deriveEffectiveCss } from './themeBuilderUtils.ts'

describe('deriveEffectiveCss', () => {
  const aliasJson = { color: { alias: { blue: { '50': { $value: '#3094FF' } } } } }
  const themeJson = {
    'kui-button-color-background-primary': { $value: '{color.alias.blue.50}' },
    'kui-alert-border-radius': { $value: '6px' },
    'kui-empty-slot': { $value: '' },
  }

  it('emits a :root block with resolved values', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {})
    expect(css).toContain('--kui-button-color-background-primary: #3094FF;')
    expect(css).toContain('--kui-alert-border-radius: 6px;')
  })
  it('skips empty-value tokens', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {})
    expect(css).not.toContain('--kui-empty-slot')
  })
  it('applies token overrides over the base value', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {
      'kui-button-color-background-primary': '{color.alias.blue.50}',
    })
    expect(css).toContain('--kui-button-color-background-primary: #3094FF;')
  })
  it('applies alias overrides through the cascade', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, { 'blue.50': '#00BFFF' }, {})
    expect(css).toContain('--kui-button-color-background-primary: #00BFFF;')
  })
  it('returns empty string when nothing resolves', () => {
    expect(deriveEffectiveCss({ 'kui-empty-slot': { $value: '' } }, aliasJson, {}, {})).toBe('')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run sandbox/lib/themeBuilderUtils.spec.mjs`
Expected: FAIL — `deriveEffectiveCss` not exported.

- [ ] **Step 3: Implement**

Append to `themeBuilderUtils.ts`:
```ts
/** Parsed `*.theme.json` shape: token key → value record. */
export type ThemeJson = Record<string, { $value: string; $description?: string }>

/** Converts a theme.json token key to its CSS custom property name. */
function toCssVar(key: string): string {
  return `--${key}`
}

/**
 * Builds a `:root { … }` block from the theme, resolving alias refs and applying
 * both override layers. Layer 2 (`tokenOverrides`) wins over the theme base value;
 * the winner is then resolved through Layer 1 (`aliasOverrides`). Empty values are
 * skipped so the semantic fallback chain still resolves at runtime.
 * @param themeJson - The loaded theme token map.
 * @param aliasJson - The loaded alias palette.
 * @param aliasOverrides - Layer 1 overrides keyed by `family.step` or `family`.
 * @param tokenOverrides - Layer 2 overrides keyed by token key (no `--` prefix).
 * @returns A `:root { … }` string, or `''` when no token resolves to a value.
 */
export function deriveEffectiveCss(
  themeJson: ThemeJson,
  aliasJson: AliasJson,
  aliasOverrides: Record<string, string>,
  tokenOverrides: Record<string, string>,
): string {
  const lines: string[] = []
  for (const [key, entry] of Object.entries(themeJson)) {
    const raw = tokenOverrides[key] ?? entry.$value
    if (!raw) continue
    const resolved = resolveValue(raw, aliasJson, aliasOverrides)
    if (!resolved) continue
    lines.push(`  ${toCssVar(key)}: ${resolved};`)
  }
  if (!lines.length) return ''
  return `:root {\n${lines.join('\n')}\n}`
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec vitest run sandbox/lib/themeBuilderUtils.spec.mjs`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

Propose:
```bash
git add sandbox/lib/themeBuilderUtils.ts sandbox/lib/themeBuilderUtils.spec.mjs
git commit -m "feat(sandbox): add deriveEffectiveCss for theme builder"
```

---

### Task 4: Pure utility — JSON exporters + flatteners

**Files:**
- Modify: `packages/design-tokens/sandbox/lib/themeBuilderUtils.ts`
- Test: `packages/design-tokens/sandbox/lib/themeBuilderUtils.spec.mjs`

**Interfaces:**
- Consumes: `AliasJson`, `ThemeJson`, `parseAliasRef`.
- Produces:
  - `exportThemeJson(themeJson: ThemeJson, tokenOverrides: Record<string, string>): string`
  - `exportAliasJson(aliasJson: AliasJson, aliasOverrides: Record<string, string>): string`
  - `interface AliasFlatEntry { family: string; step: string | null; key: string; baseHex: string }`
  - `flattenAliases(aliasJson: AliasJson): AliasFlatEntry[]`
  - `isColorToken(rawValue: string): boolean`

- [ ] **Step 1: Write the failing test**

Append to `themeBuilderUtils.spec.mjs`:
```js
import { exportThemeJson, exportAliasJson, flattenAliases, isColorToken } from './themeBuilderUtils.ts'

describe('flattenAliases', () => {
  const aliasJson = {
    color: { alias: {
      blue: { '50': { $value: '#3094FF' }, '60': { $value: '#0076F4' } },
      black: { $value: '#000000' },
    } },
  }
  it('flattens stepped and singleton families', () => {
    const flat = flattenAliases(aliasJson)
    expect(flat).toContainEqual({ family: 'blue', step: '50', key: 'blue.50', baseHex: '#3094FF' })
    expect(flat).toContainEqual({ family: 'black', step: null, key: 'black', baseHex: '#000000' })
  })
})

describe('isColorToken', () => {
  it('is true for alias refs', () => {
    expect(isColorToken('{color.alias.blue.50}')).toBe(true)
  })
  it('is false for literals and empties', () => {
    expect(isColorToken('6px')).toBe(false)
    expect(isColorToken('')).toBe(false)
  })
})

describe('exportThemeJson', () => {
  const themeJson = { 'kui-a': { $value: '{color.alias.blue.50}', $description: 'A' } }
  it('applies token overrides as refs and preserves structure', () => {
    const out = JSON.parse(exportThemeJson(themeJson, { 'kui-a': '{color.alias.blue.60}' }))
    expect(out['kui-a'].$value).toBe('{color.alias.blue.60}')
    expect(out['kui-a'].$description).toBe('A')
  })
})

describe('exportAliasJson', () => {
  const aliasJson = { color: { alias: { blue: { '50': { $value: '#3094FF' } }, black: { $value: '#000000' } } } }
  it('patches overridden step values', () => {
    const out = JSON.parse(exportAliasJson(aliasJson, { 'blue.50': '#00BFFF', black: '#111111' }))
    expect(out.color.alias.blue['50'].$value).toBe('#00BFFF')
    expect(out.color.alias.black.$value).toBe('#111111')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run sandbox/lib/themeBuilderUtils.spec.mjs`
Expected: FAIL — new exports not found.

- [ ] **Step 3: Implement**

Append to `themeBuilderUtils.ts`:
```ts
/** A flattened alias entry for palette-panel rendering. */
export interface AliasFlatEntry {
  /** Family name, e.g. `blue`. */
  family: string
  /** Step name, or null for singletons. */
  step: string | null
  /** Override/lookup key: `family.step` or `family`. */
  key: string
  /** The base hex value from the loaded palette. */
  baseHex: string
}

/** True when a raw token value is an alias reference (i.e. a color token). */
export function isColorToken(rawValue: string): boolean {
  return parseAliasRef(rawValue) !== null
}

/**
 * Flattens the alias tree into a list of entries for UI rendering.
 * @param aliasJson - The loaded alias palette.
 */
export function flattenAliases(aliasJson: AliasJson): AliasFlatEntry[] {
  const out: AliasFlatEntry[] = []
  for (const [family, entry] of Object.entries(aliasJson.color.alias)) {
    if (typeof (entry as AliasLeaf).$value === 'string') {
      out.push({ family, step: null, key: family, baseHex: (entry as AliasLeaf).$value })
    } else {
      for (const [step, leaf] of Object.entries(entry as Record<string, AliasLeaf>)) {
        out.push({ family, step, key: `${family}.${step}`, baseHex: leaf.$value })
      }
    }
  }
  return out
}

/**
 * Serializes the theme with Layer 2 overrides applied. Overridden tokens keep
 * their `$description`; only `$value` changes. Output is pretty-printed 2-space JSON.
 * @param themeJson - The loaded theme token map.
 * @param tokenOverrides - Layer 2 overrides keyed by token key.
 */
export function exportThemeJson(themeJson: ThemeJson, tokenOverrides: Record<string, string>): string {
  const clone: ThemeJson = JSON.parse(JSON.stringify(themeJson))
  for (const [key, value] of Object.entries(tokenOverrides)) {
    if (clone[key]) clone[key].$value = value
  }
  return JSON.stringify(clone, null, 2)
}

/**
 * Serializes the alias palette with Layer 1 overrides applied.
 * Output is pretty-printed 2-space JSON.
 * @param aliasJson - The loaded alias palette.
 * @param aliasOverrides - Layer 1 overrides keyed by `family.step` or `family`.
 */
export function exportAliasJson(aliasJson: AliasJson, aliasOverrides: Record<string, string>): string {
  const clone: AliasJson = JSON.parse(JSON.stringify(aliasJson))
  for (const [key, hex] of Object.entries(aliasOverrides)) {
    const [family, step] = key.split('.')
    const entry = clone.color.alias[family]
    if (!entry) continue
    if (step) {
      const leaf = (entry as Record<string, AliasLeaf>)[step]
      if (leaf) leaf.$value = hex
    } else {
      (entry as AliasLeaf).$value = hex
    }
  }
  return JSON.stringify(clone, null, 2)
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec vitest run sandbox/lib/themeBuilderUtils.spec.mjs`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

Propose:
```bash
git add sandbox/lib/themeBuilderUtils.ts sandbox/lib/themeBuilderUtils.spec.mjs
git commit -m "feat(sandbox): add theme/alias exporters and flatteners"
```

---

### Task 5: `useThemeBuilder` composable

**Files:**
- Create: `packages/design-tokens/sandbox/composables/useThemeBuilder.ts`

**Interfaces:**
- Consumes: all of `themeBuilderUtils.ts`.
- Produces a composable returning:
  - `themeJson: Ref<ThemeJson | null>`, `aliasJson: Ref<AliasJson | null>`
  - `aliasOverrides: Record<string, string>`, `tokenOverrides: Record<string, string>`
  - `isLoaded: ComputedRef<boolean>`
  - `loadFiles(themeText: string, aliasText: string): { ok: boolean; error?: string }`
  - `aliasFlat: ComputedRef<AliasFlatEntry[]>`
  - `builderTokens: ComputedRef<BuilderToken[]>` where `interface BuilderToken { key: string; cssVar: string; rawValue: string; isColor: boolean; derivedValue: string; source: 'inherited' | 'overridden' | 'empty' }`
  - `effectiveCss: ComputedRef<string>`
  - `setAliasOverride(key, hex)`, `setTokenOverride(key, value)`, `resetTokenOverride(key)`, `resetAll()`
  - `themeJsonOut: ComputedRef<string>`, `aliasJsonOut: ComputedRef<string>`

- [ ] **Step 1: Implement the composable**

`sandbox/composables/useThemeBuilder.ts`:
```ts
import { computed, reactive, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import {
  deriveEffectiveCss,
  exportAliasJson,
  exportThemeJson,
  flattenAliases,
  isColorToken,
  resolveValue,
} from '../lib/themeBuilderUtils'
import type { AliasFlatEntry, AliasJson, ThemeJson } from '../lib/themeBuilderUtils'

/** A token row prepared for the builder token list. */
export interface BuilderToken {
  /** Token key without `--`, e.g. `kui-button-color-background-primary`. */
  key: string
  /** CSS custom property name, e.g. `--kui-button-color-background-primary`. */
  cssVar: string
  /** The current raw value (Layer 2 override if set, else theme base). */
  rawValue: string
  /** True when the token is alias-referenced (color token). */
  isColor: boolean
  /** The resolved value after alias lookup. */
  derivedValue: string
  /** Where the current value comes from. */
  source: 'inherited' | 'overridden' | 'empty'
}

/** Module-scoped state so it survives route re-mounts within a session. */
const themeJson = ref<ThemeJson | null>(null)
const aliasJson = ref<AliasJson | null>(null)
const aliasOverrides = reactive<Record<string, string>>({})
const tokenOverrides = reactive<Record<string, string>>({})

/**
 * Composable backing the Theme Builder. Holds the loaded file pair and the two
 * override layers, and derives the effective CSS plus export strings.
 */
export function useThemeBuilder() {
  const isLoaded = computed(() => themeJson.value !== null && aliasJson.value !== null)

  /**
   * Parses and validates the two uploaded file texts.
   * @returns `{ ok: true }` on success, or `{ ok: false, error }` on parse/shape failure.
   */
  function loadFiles(themeText: string, aliasText: string): { ok: boolean; error?: string } {
    let theme: unknown
    let alias: unknown
    try {
      theme = JSON.parse(themeText)
    } catch {
      return { ok: false, error: 'Theme file is not valid JSON.' }
    }
    try {
      alias = JSON.parse(aliasText)
    } catch {
      return { ok: false, error: 'Alias file is not valid JSON.' }
    }
    if (typeof theme !== 'object' || theme === null) {
      return { ok: false, error: 'Theme file has an unexpected shape.' }
    }
    if (
      typeof alias !== 'object' || alias === null ||
      typeof (alias as AliasJson).color?.alias !== 'object'
    ) {
      return { ok: false, error: 'Alias file must contain a color.alias tree.' }
    }
    for (const k in aliasOverrides) delete aliasOverrides[k]
    for (const k in tokenOverrides) delete tokenOverrides[k]
    themeJson.value = theme as ThemeJson
    aliasJson.value = alias as AliasJson
    return { ok: true }
  }

  const aliasFlat: ComputedRef<AliasFlatEntry[]> = computed(() =>
    aliasJson.value ? flattenAliases(aliasJson.value) : [],
  )

  const builderTokens: ComputedRef<BuilderToken[]> = computed(() => {
    if (!themeJson.value || !aliasJson.value) return []
    const aj = aliasJson.value
    return Object.entries(themeJson.value).map(([key, entry]) => {
      const overridden = key in tokenOverrides
      const rawValue = overridden ? tokenOverrides[key] : entry.$value
      const source: BuilderToken['source'] = overridden
        ? 'overridden'
        : (entry.$value ? 'inherited' : 'empty')
      return {
        key,
        cssVar: `--${key}`,
        rawValue,
        isColor: isColorToken(entry.$value) || isColorToken(rawValue),
        derivedValue: rawValue ? resolveValue(rawValue, aj, aliasOverrides) : '',
        source,
      }
    })
  })

  const effectiveCss = computed(() =>
    themeJson.value && aliasJson.value
      ? deriveEffectiveCss(themeJson.value, aliasJson.value, aliasOverrides, tokenOverrides)
      : '',
  )

  const themeJsonOut = computed(() =>
    themeJson.value ? exportThemeJson(themeJson.value, tokenOverrides) : '',
  )
  const aliasJsonOut = computed(() =>
    aliasJson.value ? exportAliasJson(aliasJson.value, aliasOverrides) : '',
  )

  /** Sets a Layer 1 alias override (hex). Empty value clears it. */
  function setAliasOverride(key: string, hex: string) {
    if (!hex.trim()) delete aliasOverrides[key]
    else aliasOverrides[key] = hex.trim()
  }

  /** Sets a Layer 2 token override. Empty value clears it. */
  function setTokenOverride(key: string, value: string) {
    if (!value.trim()) delete tokenOverrides[key]
    else tokenOverrides[key] = value.trim()
  }

  /** Clears a single Layer 2 token override. */
  function resetTokenOverride(key: string) {
    delete tokenOverrides[key]
  }

  /** Clears all overrides in both layers. */
  function resetAll() {
    for (const k in aliasOverrides) delete aliasOverrides[k]
    for (const k in tokenOverrides) delete tokenOverrides[k]
  }

  return {
    themeJson: themeJson as Ref<ThemeJson | null>,
    aliasJson: aliasJson as Ref<AliasJson | null>,
    aliasOverrides,
    tokenOverrides,
    isLoaded,
    loadFiles,
    aliasFlat,
    builderTokens,
    effectiveCss,
    themeJsonOut,
    aliasJsonOut,
    setAliasOverride,
    setTokenOverride,
    resetTokenOverride,
    resetAll,
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 3: Commit**

Propose:
```bash
git add sandbox/composables/useThemeBuilder.ts
git commit -m "feat(sandbox): add useThemeBuilder composable"
```

---

### Task 6: `FileLoader.vue`

**Files:**
- Create: `packages/design-tokens/sandbox/components/builder/FileLoader.vue`

**Interfaces:**
- Emits: `load` with `{ themeText: string, aliasText: string }`.
- Props: `error?: string` (validation message from parent).

- [ ] **Step 1: Implement**

`sandbox/components/builder/FileLoader.vue`:
```vue
<template>
  <div class="file-loader">
    <h2 class="fl-title">Load a theme to edit</h2>
    <p class="fl-hint">
      Scaffold a new theme first with <code>node scripts/theme-scaffold.mjs &lt;name&gt;</code>,
      then load its two source files here.
    </p>

    <label class="fl-drop">
      <input type="file" accept=".json,application/json" @change="onTheme">
      <span>{{ themeName || 'Choose *.theme.json' }}</span>
      <span v-if="themeName" class="fl-check">✓</span>
    </label>

    <label class="fl-drop">
      <input type="file" accept=".json,application/json" @change="onAlias">
      <span>{{ aliasName || 'Choose *.alias.color.json' }}</span>
      <span v-if="aliasName" class="fl-check">✓</span>
    </label>

    <p v-if="error" class="fl-error">{{ error }}</p>

    <button class="fl-btn" :disabled="!canLoad" @click="emitLoad">
      Load Theme
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineProps<{ error?: string }>()
const emit = defineEmits<{ load: [{ themeText: string; aliasText: string }] }>()

const themeName = ref('')
const aliasName = ref('')
const themeText = ref('')
const aliasText = ref('')

const canLoad = computed(() => !!themeText.value && !!aliasText.value)

/** Reads a selected file into text and stores it with its name. */
async function readInto(e: Event, nameRef: typeof themeName, textRef: typeof themeText) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  nameRef.value = file.name
  textRef.value = await file.text()
}

const onTheme = (e: Event) => readInto(e, themeName, themeText)
const onAlias = (e: Event) => readInto(e, aliasName, aliasText)

function emitLoad() {
  if (!canLoad.value) return
  emit('load', { themeText: themeText.value, aliasText: aliasText.value })
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.file-loader { max-width: 460px; margin: 60px auto; padding: 0 20px; font-family: 'Inter', system-ui, sans-serif; color: $tb-text; }
.fl-title { font-size: 20px; font-weight: 600; margin: 0 0 8px; }
.fl-hint { font-size: 13px; color: $tb-text-dim; margin: 0 0 24px; line-height: 1.5; code { font-family: $tb-mono; font-size: 12px; background: $tb-surface-2; padding: 1px 5px; border-radius: 3px; } }
.fl-drop { display: flex; align-items: center; gap: 10px; border: 1px dashed $tb-border-active; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; cursor: pointer; font-size: 13px; color: $tb-text-dim; input { display: none; } &:hover { border-color: $tb-accent; } }
.fl-check { margin-left: auto; color: $tb-accent; font-weight: 700; }
.fl-error { color: #ef4444; font-size: 13px; margin: 4px 0 12px; }
.fl-btn { width: 100%; background: $tb-accent; color: #fff; border: none; border-radius: 6px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer; &:disabled { opacity: 0.4; cursor: default; } }
</style>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 3: Commit**

Propose:
```bash
git add sandbox/components/builder/FileLoader.vue
git commit -m "feat(sandbox): add theme-builder file loader"
```

---

### Task 7: `PalettePanel.vue` (Layer 1)

**Files:**
- Create: `packages/design-tokens/sandbox/components/builder/PalettePanel.vue`

**Interfaces:**
- Props: `aliasFlat: AliasFlatEntry[]`, `aliasOverrides: Record<string, string>`.
- Emits: `change` with `(key: string, hex: string)`.

- [ ] **Step 1: Implement**

`sandbox/components/builder/PalettePanel.vue`:
```vue
<template>
  <div class="palette-panel">
    <h3 class="pp-heading">Color Palette</h3>
    <div v-for="family in families" :key="family.name" class="pp-family">
      <div class="pp-family-name">{{ family.name }}</div>
      <div class="pp-chips">
        <label
          v-for="entry in family.entries"
          :key="entry.key"
          class="pp-chip"
          :title="entry.key"
        >
          <span
            class="pp-swatch"
            :class="{ 'pp-swatch--modified': entry.key in aliasOverrides }"
            :style="{ background: aliasOverrides[entry.key] || entry.baseHex }"
          />
          <input
            type="color"
            class="pp-color-input"
            :value="aliasOverrides[entry.key] || entry.baseHex"
            @input="onInput(entry.key, $event)"
          >
          <span class="pp-step">{{ entry.step ?? entry.family }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AliasFlatEntry } from '@/lib/themeBuilderUtils'

const props = defineProps<{
  aliasFlat: AliasFlatEntry[]
  aliasOverrides: Record<string, string>
}>()
const emit = defineEmits<{ change: [key: string, hex: string] }>()

/** Groups the flat alias list back into families for sectioned rendering. */
const families = computed(() => {
  const map = new Map<string, AliasFlatEntry[]>()
  for (const e of props.aliasFlat) {
    if (!map.has(e.family)) map.set(e.family, [])
    map.get(e.family)!.push(e)
  }
  return [...map.entries()].map(([name, entries]) => ({ name, entries }))
})

function onInput(key: string, e: Event) {
  emit('change', key, (e.target as HTMLInputElement).value.toUpperCase())
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.palette-panel { padding: 12px 16px; }
.pp-heading { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $tb-text-muted; margin: 0 0 12px; }
.pp-family { margin-bottom: 14px; }
.pp-family-name { font-size: 12px; font-weight: 600; color: $tb-text-dim; text-transform: capitalize; margin-bottom: 6px; }
.pp-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pp-chip { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; }
.pp-swatch { width: 26px; height: 26px; border-radius: 5px; border: 1px solid rgba(0, 0, 0, 0.15); display: block; &--modified { box-shadow: 0 0 0 2px $tb-accent; } }
.pp-color-input { position: absolute; top: 0; left: 0; width: 26px; height: 26px; opacity: 0; cursor: pointer; }
.pp-step { font-size: 9px; color: $tb-text-muted; font-family: $tb-mono; }
</style>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 3: Commit**

Propose:
```bash
git add sandbox/components/builder/PalettePanel.vue
git commit -m "feat(sandbox): add theme-builder palette panel"
```

---

### Task 8: `AliasPicker.vue`

**Files:**
- Create: `packages/design-tokens/sandbox/components/builder/AliasPicker.vue`

**Interfaces:**
- Props: `aliasFlat: AliasFlatEntry[]`, `selectedKey?: string | null` (the currently referenced `family.step`).
- Emits: `select` with `(ref: string)` where ref is `{color.alias.family.step}`; `reset` (clears the override).

- [ ] **Step 1: Implement**

`sandbox/components/builder/AliasPicker.vue`:
```vue
<template>
  <div class="alias-picker">
    <input
      v-model="query"
      class="ap-search"
      placeholder="Search aliases…"
      spellcheck="false"
    >
    <div class="ap-grid">
      <button
        v-for="entry in filtered"
        :key="entry.key"
        class="ap-item"
        :class="{ 'ap-item--selected': entry.key === selectedKey }"
        :title="entry.key"
        @click="pick(entry)"
      >
        <span class="ap-swatch" :style="{ background: entry.baseHex }" />
        <span class="ap-label">{{ entry.key }}</span>
      </button>
    </div>
    <button class="ap-reset" @click="emit('reset')">Reset to theme default</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AliasFlatEntry } from '@/lib/themeBuilderUtils'

const props = defineProps<{
  aliasFlat: AliasFlatEntry[]
  selectedKey?: string | null
}>()
const emit = defineEmits<{ select: [ref: string]; reset: [] }>()

const query = ref('')

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return props.aliasFlat
  return props.aliasFlat.filter(
    (e) => e.key.toLowerCase().includes(q) || e.baseHex.toLowerCase().includes(q),
  )
})

/** Emits the alias ref string for the chosen entry. */
function pick(entry: AliasFlatEntry) {
  const ref = entry.step
    ? `{color.alias.${entry.family}.${entry.step}}`
    : `{color.alias.${entry.family}}`
  emit('select', ref)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.alias-picker { width: 280px; background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 8px; padding: 10px; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18); }
.ap-search { width: 100%; box-sizing: border-box; background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; padding: 6px 8px; font-size: 12px; color: $tb-text; margin-bottom: 8px; &:focus-visible { border-color: $tb-accent; outline: none; } }
.ap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; max-height: 260px; overflow-y: auto; }
.ap-item { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid transparent; border-radius: 5px; padding: 4px 6px; cursor: pointer; text-align: left; &:hover { background: $tb-surface-2; } &--selected { border-color: $tb-accent; background: $tb-accent-subtle; } }
.ap-swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(0, 0, 0, 0.15); flex-shrink: 0; }
.ap-label { font-family: $tb-mono; font-size: 10px; color: $tb-text-dim; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ap-reset { width: 100%; margin-top: 8px; background: none; border: 1px solid $tb-border; border-radius: 5px; padding: 5px; font-size: 11px; color: $tb-text-muted; cursor: pointer; &:hover { color: $tb-text; border-color: $tb-border-active; } }
</style>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 3: Commit**

Propose:
```bash
git add sandbox/components/builder/AliasPicker.vue
git commit -m "feat(sandbox): add theme-builder alias picker"
```

---

### Task 9: `TokenRow.vue` + `TokenList.vue` (Layer 2)

**Files:**
- Create: `packages/design-tokens/sandbox/components/builder/TokenRow.vue`
- Create: `packages/design-tokens/sandbox/components/builder/TokenList.vue`

**Interfaces:**
- `TokenRow` props: `token: BuilderToken`, `aliasFlat: AliasFlatEntry[]`. Emits: `set` `(key, value)`, `reset` `(key)`.
- `TokenList` props: `tokens: BuilderToken[]`, `aliasFlat: AliasFlatEntry[]`. Emits: `set` `(key, value)`, `reset` `(key)`.

- [ ] **Step 1: Implement `TokenRow.vue`**

`sandbox/components/builder/TokenRow.vue`:
```vue
<template>
  <div class="token-row">
    <div class="tr-main">
      <code class="tr-name">{{ token.cssVar }}</code>
      <span class="tr-badge" :class="`tr-badge--${token.source}`">
        <template v-if="token.source === 'overridden'">override</template>
        <template v-else-if="token.source === 'empty'">—</template>
        <template v-else>{{ aliasLabel }}</template>
      </span>
    </div>

    <div class="tr-control">
      <template v-if="token.isColor">
        <button class="tr-color-btn" @click="open = !open">
          <span class="tr-swatch" :style="{ background: token.derivedValue || 'transparent' }" />
          <span class="tr-color-text">{{ currentRef || 'pick alias' }}</span>
        </button>
        <div v-if="open" class="tr-popover">
          <AliasPicker
            :alias-flat="aliasFlat"
            :selected-key="selectedKey"
            @select="onSelect"
            @reset="onReset"
          />
        </div>
      </template>
      <template v-else>
        <input
          class="tr-text"
          :value="token.rawValue"
          :placeholder="token.source === 'empty' ? 'unset' : ''"
          spellcheck="false"
          @change="onText"
        >
        <button v-if="token.source === 'overridden'" class="tr-reset" @click="emit('reset', token.key)">↺</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AliasPicker from './AliasPicker.vue'
import { parseAliasRef } from '@/lib/themeBuilderUtils'
import type { AliasFlatEntry, BuilderToken } from '@/lib/themeBuilderUtils'
import type { BuilderToken as _BT } from '@/composables/useThemeBuilder'

const props = defineProps<{ token: BuilderToken; aliasFlat: AliasFlatEntry[] }>()
const emit = defineEmits<{ set: [key: string, value: string]; reset: [key: string] }>()

const open = ref(false)

/** The current alias ref string, if the raw value is one. */
const currentRef = computed(() => {
  const ref = parseAliasRef(props.token.rawValue)
  return ref ? props.token.rawValue : ''
})

/** The `family.step` key of the current ref, for highlighting in the picker. */
const selectedKey = computed(() => {
  const ref = parseAliasRef(props.token.rawValue)
  if (!ref) return null
  return ref.step ? `${ref.family}.${ref.step}` : ref.family
})

/** Human label for an inherited alias-referenced value. */
const aliasLabel = computed(() => {
  const ref = parseAliasRef(props.token.rawValue)
  if (!ref) return 'inherited'
  return `alias: ${ref.step ? `${ref.family}.${ref.step}` : ref.family}`
})

function onSelect(refStr: string) {
  emit('set', props.token.key, refStr)
  open.value = false
}
function onReset() {
  emit('reset', props.token.key)
  open.value = false
}
function onText(e: Event) {
  emit('set', props.token.key, (e.target as HTMLInputElement).value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 12px; border-bottom: 1px solid $tb-border; }
.tr-main { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.tr-name { font-family: $tb-mono; font-size: 11px; color: $tb-text; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tr-badge { font-size: 10px; font-family: $tb-mono; &--inherited { color: $tb-text-muted; } &--overridden { color: $tb-accent; font-weight: 600; } &--empty { color: $tb-text-muted; } }
.tr-control { position: relative; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
.tr-color-btn { display: flex; align-items: center; gap: 6px; background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; padding: 3px 8px; cursor: pointer; }
.tr-swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(0, 0, 0, 0.15); }
.tr-color-text { font-family: $tb-mono; font-size: 10px; color: $tb-text-dim; }
.tr-popover { position: absolute; top: calc(100% + 4px); right: 0; z-index: 50; }
.tr-text { width: 120px; background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; padding: 3px 8px; font-family: $tb-mono; font-size: 11px; color: $tb-text; &:focus-visible { border-color: $tb-accent; outline: none; } }
.tr-reset { background: none; border: 1px solid $tb-border; border-radius: 5px; padding: 2px 6px; cursor: pointer; color: $tb-text-muted; &:hover { color: $tb-text; } }
</style>
```

- [ ] **Step 2: Implement `TokenList.vue`**

`sandbox/components/builder/TokenList.vue`:
```vue
<template>
  <div class="token-list">
    <div class="tl-search-wrap">
      <input
        v-model="filter"
        class="tl-search"
        placeholder="Filter tokens…"
        type="search"
      >
    </div>
    <TokenRow
      v-for="token in visible"
      :key="token.key"
      :token="token"
      :alias-flat="aliasFlat"
      @set="(k, v) => emit('set', k, v)"
      @reset="(k) => emit('reset', k)"
    />
    <div v-if="visible.length === 0" class="tl-empty">No tokens match "{{ filter }}"</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TokenRow from './TokenRow.vue'
import type { AliasFlatEntry, BuilderToken } from '@/lib/themeBuilderUtils'

const props = defineProps<{ tokens: BuilderToken[]; aliasFlat: AliasFlatEntry[] }>()
const emit = defineEmits<{ set: [key: string, value: string]; reset: [key: string] }>()

const filter = ref('')

const visible = computed(() => {
  const q = filter.value.toLowerCase().trim().replace(/[-_\s]+/g, '')
  if (!q) return props.tokens
  return props.tokens.filter((t) => t.cssVar.toLowerCase().replace(/[-_\s]+/g, '').includes(q))
})
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-list { display: flex; flex-direction: column; }
.tl-search-wrap { position: sticky; top: 0; background: $tb-surface; padding: 10px 12px; border-bottom: 1px solid $tb-border; z-index: 5; }
.tl-search { width: 100%; box-sizing: border-box; background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; padding: 6px 10px; font-size: 13px; color: $tb-text; &:focus-visible { border-color: $tb-accent; outline: none; } }
.tl-empty { padding: 40px 20px; text-align: center; color: $tb-text-muted; font-size: 14px; }
</style>
```

**Note:** `BuilderToken` is exported from BOTH `useThemeBuilder.ts` and re-exported for component imports. To keep one source of truth, move the `BuilderToken` interface into `themeBuilderUtils.ts` if a duplicate-definition typecheck error appears; import it from there in `useThemeBuilder.ts`. Components import `BuilderToken` from `@/lib/themeBuilderUtils`.

- [ ] **Step 3: Reconcile `BuilderToken` location**

Move the `BuilderToken` interface from `useThemeBuilder.ts` into `themeBuilderUtils.ts` (append it), export it there, and in `useThemeBuilder.ts` replace its local definition with:
```ts
import type { AliasFlatEntry, AliasJson, BuilderToken, ThemeJson } from '../lib/themeBuilderUtils'
```
Also re-export for convenience:
```ts
export type { BuilderToken } from '../lib/themeBuilderUtils'
```
Then in `TokenRow.vue` delete the unused line `import type { BuilderToken as _BT } from '@/composables/useThemeBuilder'`.

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 5: Commit**

Propose:
```bash
git add sandbox/components/builder/TokenRow.vue sandbox/components/builder/TokenList.vue sandbox/lib/themeBuilderUtils.ts sandbox/composables/useThemeBuilder.ts
git commit -m "feat(sandbox): add theme-builder token list and rows"
```

---

### Task 10: `OutputPanel.vue`

**Files:**
- Create: `packages/design-tokens/sandbox/components/builder/OutputPanel.vue`

**Interfaces:**
- Props: `themeJsonOut: string`, `aliasJsonOut: string`, `themeFileName: string`, `aliasFileName: string`.

- [ ] **Step 1: Implement**

`sandbox/components/builder/OutputPanel.vue`:
```vue
<template>
  <div class="output-panel">
    <h3 class="op-heading">Export</h3>
    <button class="op-btn" @click="download(themeFileName, themeJsonOut)">
      Download {{ themeFileName }}
    </button>
    <button class="op-btn" @click="download(aliasFileName, aliasJsonOut)">
      Download {{ aliasFileName }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  themeJsonOut: string
  aliasJsonOut: string
  themeFileName: string
  aliasFileName: string
}>()

/** Triggers a browser download of the given JSON text under the given filename. */
function download(name: string, text: string) {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.output-panel { padding: 16px; }
.op-heading { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $tb-text-muted; margin: 0 0 12px; }
.op-btn { display: block; width: 100%; margin-bottom: 10px; background: $tb-accent; color: #fff; border: none; border-radius: 6px; padding: 9px; font-size: 13px; font-weight: 600; cursor: pointer; &:hover { opacity: 0.9; } }
</style>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 3: Commit**

Propose:
```bash
git add sandbox/components/builder/OutputPanel.vue
git commit -m "feat(sandbox): add theme-builder output panel"
```

---

### Task 11: `ThemeBuilder.vue` shell + wire embedded postMessage

**Files:**
- Create: `packages/design-tokens/sandbox/components/builder/ThemeBuilder.vue`
- Modify: `packages/design-tokens/sandbox/pages/ThemeBuilderView.vue`

**Interfaces:**
- Consumes: `useThemeBuilder`, all builder components, `getHashParam`.

- [ ] **Step 1: Implement `ThemeBuilder.vue`**

`sandbox/components/builder/ThemeBuilder.vue`:
```vue
<template>
  <div class="theme-builder">
    <header class="tb-header">
      <div class="tb-header-left">
        <router-link v-if="!isEmbedded" class="tb-back" to="/">← Browse</router-link>
        <h1 class="tb-title">Theme Builder</h1>
      </div>
      <button v-if="isEmbedded" class="tb-close" title="Close" @click="closeEmbedded">✕</button>
    </header>

    <FileLoader v-if="!isLoaded" :error="loadError" @load="onLoad" />

    <div v-else :class="['tb-layout', { 'tb-layout--embedded': isEmbedded }]">
      <div class="tb-palette-col">
        <PalettePanel :alias-flat="aliasFlat" :alias-overrides="aliasOverrides" @change="setAliasOverride" />
      </div>
      <div class="tb-tokens-col">
        <TokenList :tokens="builderTokens" :alias-flat="aliasFlat" @set="setTokenOverride" @reset="resetTokenOverride" />
      </div>
      <aside class="tb-output-col">
        <OutputPanel
          :theme-json-out="themeJsonOut"
          :alias-json-out="aliasJsonOut"
          :theme-file-name="themeFileName"
          :alias-file-name="aliasFileName"
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useThemeBuilder } from '@/composables/useThemeBuilder'
import { getHashParam } from '@/lib/hashRouteQuery'
import FileLoader from './FileLoader.vue'
import PalettePanel from './PalettePanel.vue'
import TokenList from './TokenList.vue'
import OutputPanel from './OutputPanel.vue'

const isEmbedded = getHashParam('embedded') === '1'
const loadError = ref('')
const themeFileName = ref('theme.json')
const aliasFileName = ref('alias.color.json')

const {
  isLoaded, loadFiles, aliasFlat, aliasOverrides, builderTokens,
  effectiveCss, themeJsonOut, aliasJsonOut,
  setAliasOverride, setTokenOverride, resetTokenOverride,
} = useThemeBuilder()

function onLoad(payload: { themeText: string; aliasText: string }) {
  const result = loadFiles(payload.themeText, payload.aliasText)
  loadError.value = result.ok ? '' : (result.error ?? 'Failed to load files.')
}

/** Posts the current derived CSS to the parent page (embedded/bookmarklet mode). */
function postEmbeddedCss() {
  if (!isEmbedded) return
  window.parent.postMessage({
    type: 'kui-token-override',
    css: effectiveCss.value,
    src: window.location.href,
  }, '*')
}

/** Tells the bookmarklet to remove the sidebar iframe. */
function closeEmbedded() {
  window.parent.postMessage({ type: 'kui-close' }, '*')
}

if (isEmbedded) {
  onMounted(postEmbeddedCss)
  watch(effectiveCss, postEmbeddedCss)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.theme-builder { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: $tb-bg; color: $tb-text; font-family: 'Inter', system-ui, sans-serif; }
.tb-header { flex-shrink: 0; background: $tb-surface; border-bottom: 1px solid $tb-border; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; }
.tb-header-left { display: flex; align-items: center; gap: 12px; }
.tb-back { font-size: 13px; color: $tb-accent; text-decoration: none; &:hover { text-decoration: underline; } }
.tb-title { font-size: 16px; font-weight: 600; margin: 0; }
.tb-close { background: $tb-surface; color: $tb-text-muted; border: 1px solid $tb-border-active; border-radius: 5px; padding: 5px 9px; cursor: pointer; }
.tb-layout { flex: 1; display: grid; grid-template-columns: minmax(220px, 260px) 1fr minmax(220px, 240px); min-height: 0; > * { height: 100%; min-height: 0; overflow-y: auto; } }
.tb-palette-col { border-right: 1px solid $tb-border; }
.tb-tokens-col { min-width: 0; }
.tb-output-col { border-left: 1px solid $tb-border; }
.tb-layout--embedded { grid-template-columns: 1fr; grid-auto-rows: min-content; > * { height: auto; overflow-y: visible; } }
</style>
```

- [ ] **Step 2: Wire the page**

Replace `sandbox/pages/ThemeBuilderView.vue`:
```vue
<template>
  <ThemeBuilder />
</template>

<script setup lang="ts">
import ThemeBuilder from '@/components/builder/ThemeBuilder.vue'
</script>
```

- [ ] **Step 3: Manual end-to-end test (standalone)**

Run: `pnpm sandbox:open`, go to `/#/theme-builder`. Load `themes/electric-lime-day/electric-lime-day.theme.json` + `electric-lime-day.alias.color.json`.
Expected: palette chips render; editing a chip recolors dependent color-token swatches; picking an alias on a color token flips its badge to "override"; a non-color token accepts text; Download buttons produce valid JSON.

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 5: Commit**

Propose:
```bash
git add sandbox/components/builder/ThemeBuilder.vue sandbox/pages/ThemeBuilderView.vue
git commit -m "feat(sandbox): assemble theme-builder shell with embedded bridge"
```

---

### Task 12: Second bookmarklet entry (touches Mode 1 UI)

**Files:**
- Modify: `packages/design-tokens/sandbox/components/customizer/CustPreviewPanel.vue` OR `packages/design-tokens/sandbox/components/browser/BookmarkletModal.vue` (whichever currently renders the bookmarklet — inspect first)

**Interfaces:**
- Consumes: `BOOKMARKLET_TEMPLATE`, existing `__CUSTOMIZER_URL__` replacement logic.

- [ ] **Step 1: Locate the bookmarklet render**

Run: `grep -rn "BOOKMARKLET_TEMPLATE\|__CUSTOMIZER_URL__" sandbox/components`
Read the matching component to see how the single bookmarklet `href`/text is produced.

- [ ] **Step 2: Add a second bookmarklet**

Duplicate the existing bookmarklet-building logic to produce a second draggable link whose embedded URL substitutes `/#/theme-builder?embedded=1` in place of `/#/customize?embedded=1`. Label the two links "Token Customizer" and "Theme Builder". Do not alter the existing link's URL or template. Match the existing markup/style patterns in that component exactly (repeat its structure for the new link rather than abstracting, unless the component already maps over a list — then add a second list entry).

- [ ] **Step 3: Manual test**

Run: `pnpm sandbox:open`. Confirm both bookmarklets appear and the original still points at `/#/customize?embedded=1`. Drag the Theme Builder bookmarklet to a target page and click it — the sidebar should load the theme builder in embedded mode.

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck:sandbox`
Expected: PASS

- [ ] **Step 5: Commit**

Propose:
```bash
git add sandbox/components
git commit -m "feat(sandbox): add theme-builder bookmarklet entry"
```

---

## Self-Review

**1. Spec coverage:**
- Two-layer reactive state → Tasks 3, 5 ✓
- Color Palette panel with pickers → Task 7 ✓
- Token list inherited/explicit distinction → Task 9 (`source` badge) ✓
- Derived CSS reactive → Tasks 3, 5, 11 ✓
- File input (1 theme at a time) → Task 6 ✓
- Export theme.json preserving refs → Task 4 (`exportThemeJson`) ✓
- Export alias.color.json with updated values → Task 4 (`exportAliasJson`) ✓
- One-level alias lookup in JS, no Style Dictionary → Task 2 ✓
- Color tokens must use aliases (no freeform hex) → Task 9 (`isColor` → AliasPicker) ✓
- Standalone + embedded modes → Task 11 ✓
- Second bookmarklet → Task 12 ✓
- localStorage limitation note → documented in spec; embedded `src` is just the route (Task 11) ✓

**2. Placeholder scan:** No TBDs; all code blocks are concrete.

**3. Type consistency:** `BuilderToken` single source resolved in Task 9 Step 3 (moved to `themeBuilderUtils.ts`). `AliasFlatEntry`, `AliasJson`, `ThemeJson` defined in Tasks 2/3/4 and imported consistently. `resolveValue`/`deriveEffectiveCss`/`export*` signatures match between definition and use.

**Note on `themeFileName`/`aliasFileName`:** Task 11 defaults these to generic names. Enhancement (optional, not required): capture the uploaded filenames in `FileLoader` and emit them with the `load` event so exports reuse the original names. Left as generic defaults to keep Task 6's interface minimal.
