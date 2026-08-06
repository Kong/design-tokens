# Theme Builder: Default Tab + Built-In Theme Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Theme Builder the default tool in the bookmarklet sidebar (instead of Customizer), and let users load one of the 6 built-in repo themes into the Theme Builder from a dropdown instead of only via file upload.

**Architecture:** Two independent, small changes to `packages/design-tokens/sandbox/`. (1) Reorder/re-default the existing `SandboxUnifiedEmbed.vue` mode switch and the Token Browser's two tool links — pure config/order changes to code that already exists. (2) A new `useBuiltInThemes.ts` composable bundles the 6 themes' raw `*.theme.json`/`*.alias.color.json` source files at build time via Vite's `import.meta.glob(..., { query: '?raw' })`, paired with the existing `THEMES` id/label list from `useTokens.ts`; `FileLoader.vue` gets a new `<select>` that emits the exact same `load` event the file-upload path already emits, so `ThemeBuilder.vue`/`useThemeBuilder.ts` need no changes at all.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vite 8 (`import.meta.glob`), Vitest + `@vue/test-utils`.

## Global Constraints

- Read `.claude/references/design-tokens-sandbox-and-theme-builder.md` before touching any of these files if you haven't already — it documents the module-scoped-state and `v-show`-not-`v-if` gotchas relevant here.
- Tests run via `pnpm test` from `packages/design-tokens/` (runs `pretest` → `pnpm build:tokens` first). Individual spec files: `pnpm exec vitest run --config vitest.config.mjs <path>`.
- Spec files that mount Vue components or touch the DOM need `// @vitest-environment jsdom` as the first line (default environment is `node`).
- Follow the existing code style: relative imports within `composables/`, `@/...` alias imports from components, native `<select>` + `@change` (not `v-model`) for theme pickers, matching `TokenCustomizer.vue`'s existing pattern.
- Do not run `git add`/`git commit` — propose the exact commands for the user to run instead (per user's global git rules). Every "Commit" step below is something to hand to the user, not to execute yourself, unless explicitly told otherwise for this session.

---

### Task 1: Make Theme Builder the default in the bookmarklet sidebar switch

**Files:**
- Modify: `packages/design-tokens/sandbox/components/shared/SandboxUnifiedEmbed.vue:79-134`
- Test: `packages/design-tokens/sandbox/components/shared/SandboxUnifiedEmbed.spec.ts`

**Interfaces:**
- Consumes: `SandboxTool` type and `isSandboxTool` guard from `@/composables/useSandboxMode` (unchanged).
- Produces: no new exports — this task only changes ordering/defaults of existing local state.

- [ ] **Step 1: Update the failing test expectations first**

In `SandboxUnifiedEmbed.spec.ts`, make these edits (all in the existing `describe` block):

Replace the options-order test:
```ts
it('renders exactly two tool options via SandboxModeSwitch — no third "Off" option', () => {
  wrapper = mount(SandboxUnifiedEmbed)
  const options = wrapper.findComponent(SandboxModeSwitch).props('options')
  expect(options.map((o: { id: string, label: string }) => ({ id: o.id, label: o.label }))).toEqual([
    { id: 'theme-builder', label: 'Theme Builder' },
    { id: 'customizer', label: 'Customizer' },
  ])
})
```

Replace the modified-dot test (index shifts from `[1]` to `[0]`, and the default tool is now Theme Builder):
```ts
it('marks the Theme Builder option as modified once it has unsaved overrides, even while inactive', async () => {
  wrapper = mount(SandboxUnifiedEmbed)
  expect(wrapper.findComponent(SandboxModeSwitch).props('options')[0].modified).toBe(false)

  useThemeBuilder().setTokenOverride('kui-space-40', '24px')
  await wrapper.vm.$nextTick()

  // Still on Theme Builder — the new default — the dot must be visible without switching.
  expect(wrapper.findComponent(SandboxModeSwitch).props('modelValue')).toBe('theme-builder')
  expect(wrapper.findComponent(SandboxModeSwitch).props('options')[0].modified).toBe(true)
  expect(wrapper.find('.sms-dot-wrap').exists()).toBe(true)
})
```

Replace the default-tool test:
```ts
it('defaults to theme-builder when ?tool= is absent from the hash', () => {
  wrapper = mount(SandboxUnifiedEmbed)
  expect(wrapper.findComponent(SandboxModeSwitch).props('modelValue')).toBe('theme-builder')
  expect(wrapper.findComponent(ThemeBuilder).isVisible()).toBe(true)
})
```

Add a new test right after the existing `?tool=theme-builder` restore test, covering the now-non-default value:
```ts
it('restores the selected tool from ?tool=customizer in the hash on mount', () => {
  setHash('#/embedded?embedded=1&tool=customizer')
  wrapper = mount(SandboxUnifiedEmbed)
  expect(wrapper.findComponent(SandboxModeSwitch).props('modelValue')).toBe('customizer')
})
```

Replace the hash-writing test (both values are now written explicitly — no more "omitted default"):
```ts
it('switching options updates ?tool= in the hash, writing both values explicitly', async () => {
  wrapper = mount(SandboxUnifiedEmbed)
  await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'theme-builder')
  await wrapper.vm.$nextTick()
  expect(getHashParam('tool')).toBe('theme-builder')

  await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'customizer')
  await wrapper.vm.$nextTick()
  // Both values are written explicitly now — there is no implicit "default omitted from
  // the hash" convention for this param (unlike the Customizer's own `startTheme=`).
  expect(getHashParam('tool')).toBe('customizer')
})
```

Inside the `describe('global preview toggle ...')` block, replace the compact-label test's default expectations:
```ts
it('renders in compact mode, bold-labeled with the selected tool, with an info tooltip', () => {
  wrapper = mount(SandboxUnifiedEmbed)
  const toggle = wrapper.findComponent(SandboxPreviewToggle)
  expect(toggle.props('compact')).toBe(true)
  expect(toggle.props('toolLabel')).toBe('Theme Builder')
  expect(toggle.props('infoTooltip')).toContain('Theme Builder')
})
```

- [ ] **Step 2: Run the suite to confirm the edited tests fail against current code**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/components/shared/SandboxUnifiedEmbed.spec.ts` (from `packages/design-tokens/`)
Expected: FAIL — several assertions above don't match the current default (`customizer`) or current option order.

- [ ] **Step 3: Implement the change in `SandboxUnifiedEmbed.vue`**

Replace the `toolOptions` computed (swap array order, Theme Builder first):
```ts
const toolOptions = computed<Array<{ id: SandboxTool, label: string, modified?: boolean, modifiedTooltip?: string }>>(() => [
  {
    id: 'theme-builder',
    label: 'Theme Builder',
    modified: themeBuilderHasOverrides.value,
    modifiedTooltip: 'Theme Builder has unsaved modifications from the uploaded files.',
  },
  { id: 'customizer', label: 'Customizer' },
])
```

Replace the `initialTool`/`selectedTool` declaration and its comment:
```ts
// Only relevant on a domain's very first-ever bookmarklet click — after that, the bookmarklet's
// own restore mechanism persists the full `src` (tool included) per hostname, so re-clicking
// naturally reopens whichever tool was last selected there (see utils/preview-bookmarklet.ts).
// Theme Builder is the default when no `?tool=` is present.
const initialTool = getHashParam('tool')
const selectedTool = ref<SandboxTool>(isSandboxTool(initialTool) ? initialTool : 'theme-builder')
```

Replace the `watch(selectedTool, ...)` block — write `tool=` explicitly for every value, dropping the previous "omit the default" convention for this param:
```ts
watch(selectedTool, (t) => {
  // `tool=` is always written explicitly (unlike the Customizer's own `startTheme=`, which
  // still omits its default) — write it *before* posting, so `activeBuildSrc`'s delegation
  // into a child's own hash-writing `buildSrc` (which preserves unrelated params) always sees it.
  setHashParams({ tool: t })
  post()
})
```

- [ ] **Step 4: Run the suite to confirm it passes**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/components/shared/SandboxUnifiedEmbed.spec.ts` (from `packages/design-tokens/`)
Expected: PASS, all tests green.

- [ ] **Step 5: Propose the commit**

```bash
git add packages/design-tokens/sandbox/components/shared/SandboxUnifiedEmbed.vue packages/design-tokens/sandbox/components/shared/SandboxUnifiedEmbed.spec.ts
pnpm commit
```
(Conventional-commit type: `feat`, scope `sandbox` or `theme-builder` — e.g. "make Theme Builder the default tab in the bookmarklet sidebar")

---

### Task 2: Reorder the Token Browser's tool links

**Files:**
- Modify: `packages/design-tokens/sandbox/components/browser/TokenBrowser.vue:112-141`
- Modify: `packages/design-tokens/sandbox/components/browser/BookmarkletModal.vue:50`
- Test: `packages/design-tokens/sandbox/components/browser/TokenBrowser.spec.ts:230-252`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — pure template reordering + one copy-text tweak.

- [ ] **Step 1: Update the failing test expectations first**

In `TokenBrowser.spec.ts`, update both order assertions:
```ts
expect(links.map((l) => l.text())).toEqual(['Theme Builder →', 'Customize →'])
```
```ts
expect(navButtons.map((b) => b.text())).toEqual(['Theme Builder →', 'Customize →'])
```
(Leave the surrounding test bodies — `wrapper.find('button.nav-link--btn').exists()` etc. — unchanged.)

- [ ] **Step 2: Run the suite to confirm it fails**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/components/browser/TokenBrowser.spec.ts` (from `packages/design-tokens/`)
Expected: FAIL — the two order assertions above don't match the current DOM order.

- [ ] **Step 3: Reorder the template blocks in `TokenBrowser.vue`**

The file currently has (lines 112–141) the Customize `router-link`/`button` pair, then the Theme Builder pair. Swap them so Theme Builder comes first:
```html
<router-link
  v-if="isDevMode"
  class="nav-link"
  to="/theme-builder"
>
  Theme Builder →
</router-link>
<button
  v-else
  class="nav-link nav-link--btn"
  type="button"
  @click="showBookmarkletModal = true"
>
  Theme Builder →
</button>
<router-link
  v-if="isDevMode"
  class="nav-link"
  to="/customize"
>
  Customize →
</router-link>
<button
  v-else
  class="nav-link nav-link--btn"
  type="button"
  @click="showBookmarkletModal = true"
>
  Customize →
</button>
```

- [ ] **Step 4: Update the bookmarklet instructions copy in `BookmarkletModal.vue`**

Change the step-list line to match the new tab order (no test covers this exact string, but it should stay consistent with the actual UI):
```html
<li>Switch between Theme Builder and Customizer from the tabs inside the panel; edit tokens and changes apply live</li>
```

- [ ] **Step 5: Run the suite to confirm it passes**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/components/browser/TokenBrowser.spec.ts` (from `packages/design-tokens/`)
Expected: PASS.

- [ ] **Step 6: Propose the commit**

```bash
git add packages/design-tokens/sandbox/components/browser/TokenBrowser.vue packages/design-tokens/sandbox/components/browser/TokenBrowser.spec.ts packages/design-tokens/sandbox/components/browser/BookmarkletModal.vue
pnpm commit
```
(Conventional-commit type: `feat`, scope `sandbox` — e.g. "reorder Token Browser links to match the new Theme Builder default")

---

### Task 3: Bundle built-in theme source files (`useBuiltInThemes.ts`)

**Files:**
- Create: `packages/design-tokens/sandbox/composables/useBuiltInThemes.ts`
- Test: `packages/design-tokens/sandbox/composables/useBuiltInThemes.spec.ts`

**Interfaces:**
- Consumes: `THEMES` (`Array<{ id: string, label: string, tokens: Readonly<Record<string, string>> }>`) from `./useTokens`; `isValidThemeJson` from `../utils/themeBuilderUtils` (test only).
- Produces: `export interface BuiltInTheme { id: string, label: string, themeText: string, aliasText: string, themeFileName: string, aliasFileName: string }` and `export const BUILT_IN_THEMES: BuiltInTheme[]` — consumed by Task 4's `FileLoader.vue`.

- [ ] **Step 1: Write the failing test**

Create `packages/design-tokens/sandbox/composables/useBuiltInThemes.spec.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { BUILT_IN_THEMES } from './useBuiltInThemes'
import { THEMES } from './useTokens'
import { isValidThemeJson } from '../utils/themeBuilderUtils'

describe('useBuiltInThemes', () => {
  it('exposes exactly the repo themes, in the same order and labels as THEMES', () => {
    expect(BUILT_IN_THEMES.map((t) => ({ id: t.id, label: t.label }))).toEqual(
      THEMES.map((t) => ({ id: t.id, label: t.label })),
    )
  })

  it('derives file names from each theme id', () => {
    for (const theme of BUILT_IN_THEMES) {
      expect(theme.themeFileName).toBe(`${theme.id}.theme.json`)
      expect(theme.aliasFileName).toBe(`${theme.id}.alias.color.json`)
    }
  })

  it('each entry\'s themeText parses to a valid theme.json shape', () => {
    for (const theme of BUILT_IN_THEMES) {
      const parsed = JSON.parse(theme.themeText)
      expect(isValidThemeJson(parsed)).toBe(true)
      // Sanity check it's non-trivial, not an accidentally-empty file.
      expect(Object.keys(parsed).length).toBeGreaterThan(0)
    }
  })

  it('each entry\'s aliasText parses to a color.alias palette', () => {
    for (const theme of BUILT_IN_THEMES) {
      const parsed = JSON.parse(theme.aliasText)
      expect(typeof parsed.color?.alias).toBe('object')
      expect(Object.keys(parsed.color.alias).length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/composables/useBuiltInThemes.spec.ts` (from `packages/design-tokens/`)
Expected: FAIL with a module-not-found error for `./useBuiltInThemes` (the file doesn't exist yet).

- [ ] **Step 3: Implement `useBuiltInThemes.ts`**

Create `packages/design-tokens/sandbox/composables/useBuiltInThemes.ts`:
```ts
import { THEMES } from './useTokens'

/**
 * Raw source text of every `themes/<id>/<id>.theme.json` file, bundled at build time via
 * Vite's raw-import glob. Resolved relative to this file's own location, so it works
 * identically in dev (`pnpm sandbox:open`) and the static `BUILD_SANDBOX=true` GitHub Pages
 * build — no runtime fetch, no new copy step, no base-path/CORS concerns.
 */
const themeModules = import.meta.glob('../../themes/*/*.theme.json', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/** Raw source text of every `themes/<id>/<id>.alias.color.json` file — see {@link themeModules}. */
const aliasModules = import.meta.glob('../../themes/*/*.alias.color.json', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/** Extracts the theme id (the `themes/<id>/` directory segment) from a glob-resolved path. */
function idFromPath(path: string): string {
  const match = path.match(/\/themes\/([^/]+)\//)
  if (!match) throw new Error(`Could not derive a theme id from glob path "${path}"`)
  return match[1]
}

const themeTextById = new Map<string, string>()
for (const [path, text] of Object.entries(themeModules)) themeTextById.set(idFromPath(path), text)

const aliasTextById = new Map<string, string>()
for (const [path, text] of Object.entries(aliasModules)) aliasTextById.set(idFromPath(path), text)

/**
 * A built-in theme's raw source files, ready to feed straight into
 * `useThemeBuilder().loadFiles()` — the exact same shape the file-upload path already produces.
 */
export interface BuiltInTheme {
  /** Kebab-case theme id, matching `useTokens.ts`'s `THEMES`. */
  id: string
  /** Human-readable label, matching `useTokens.ts`'s `THEMES`. */
  label: string
  /** Raw contents of `themes/<id>/<id>.theme.json`. */
  themeText: string
  /** Raw contents of `themes/<id>/<id>.alias.color.json`. */
  aliasText: string
  /** Source theme.json filename, for display and the exported download name. */
  themeFileName: string
  /** Source alias.color.json filename, for display and the exported download name. */
  aliasFileName: string
}

/**
 * Every built-in theme's raw source files, in the same order/labels as `useTokens.ts`'s
 * `THEMES` — lets the Theme Builder load a real repo theme without a file upload.
 */
export const BUILT_IN_THEMES: BuiltInTheme[] = THEMES.map((theme) => {
  const themeText = themeTextById.get(theme.id)
  const aliasText = aliasTextById.get(theme.id)
  if (!themeText || !aliasText) {
    throw new Error(`Missing bundled theme source files for "${theme.id}"`)
  }
  return {
    id: theme.id,
    label: theme.label,
    themeText,
    aliasText,
    themeFileName: `${theme.id}.theme.json`,
    aliasFileName: `${theme.id}.alias.color.json`,
  }
})
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/composables/useBuiltInThemes.spec.ts` (from `packages/design-tokens/`)
Expected: PASS, all 4 tests green.

- [ ] **Step 5: Propose the commit**

```bash
git add packages/design-tokens/sandbox/composables/useBuiltInThemes.ts packages/design-tokens/sandbox/composables/useBuiltInThemes.spec.ts
pnpm commit
```
(Conventional-commit type: `feat`, scope `sandbox` — e.g. "bundle built-in theme source files for the Theme Builder")

---

### Task 4: Add the built-in theme dropdown to `FileLoader.vue`, and point its scaffold hint at Instructions

**Files:**
- Modify: `packages/design-tokens/sandbox/components/builder/FileLoader.vue`
- Modify: `packages/design-tokens/sandbox/components/builder/ThemeBuilder.vue` (wire the new `go-to-instructions` emit)
- Modify: `packages/design-tokens/sandbox/components/builder/ThemeBuilder.spec.ts` (one new test)
- Test: `packages/design-tokens/sandbox/components/builder/FileLoader.spec.ts` (new file)

**Interfaces:**
- Consumes: `BUILT_IN_THEMES` from `@/composables/useBuiltInThemes` (Task 3).
- Produces: `FileLoader.vue` gains a second emit, `'go-to-instructions': []`, alongside its
  existing `load` event. `FileLoader.vue`'s existing `load` event contract
  (`{ themeText: string, aliasText: string, themeName: string, aliasName: string }`) is
  reused unchanged for the new dropdown — `ThemeBuilder.vue`'s `onLoad` handler needs no changes
  for that part.

**Why the hint-text change:** `FileLoader.vue`'s hint paragraph currently reads "Scaffold a new
theme first with `node scripts/theme-scaffold.mjs <name>`, then load its two source files here" —
a condensed, less-complete duplicate of what `InstructionsPanel.vue`'s "Starting a new theme"
section already covers in full (which directory to run the command from, what it seeds, the
follow-up step). Now that this same tab also offers a built-in-theme dropdown, that hint needs to
cover three paths (built-in dropdown / upload existing files / scaffold new) without turning into
a wall of text. Fix: shorten the hint to just the immediate instruction, and link to the
Instructions tab (already one tab over) for the scaffold command and its full context — mirroring
the link `InstructionsPanel.vue` already has in the other direction (`@click.prevent="emit('go-to-theme')"`,
`ThemeBuilder.vue`'s existing `@go-to-theme="activeTab = 'theme'"` wiring).

- [ ] **Step 1: Write the failing test**

Create `packages/design-tokens/sandbox/components/builder/FileLoader.spec.ts`:
```ts
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FileLoader from './FileLoader.vue'
import { BUILT_IN_THEMES } from '@/composables/useBuiltInThemes'

describe('FileLoader', () => {
  it('lists a disabled placeholder followed by every built-in theme, in order', () => {
    const wrapper = mount(FileLoader)
    const options = wrapper.findAll('#fl-builtin-select option')
    expect(options[0].attributes('disabled')).toBeDefined()
    expect(options.slice(1).map((o) => o.text())).toEqual(BUILT_IN_THEMES.map((t) => t.label))
  })

  it('emits load with the built-in theme\'s bundled source text when one is selected', async () => {
    const wrapper = mount(FileLoader)
    const select = wrapper.find('#fl-builtin-select')
    const target = BUILT_IN_THEMES[0]
    await select.setValue(target.id)

    const emitted = wrapper.emitted('load')
    expect(emitted).toHaveLength(1)
    expect(emitted![0][0]).toEqual({
      themeText: target.themeText,
      aliasText: target.aliasText,
      themeName: target.themeFileName,
      aliasName: target.aliasFileName,
    })
  })

  it('still emits load from the existing upload path, unaffected by the new dropdown', async () => {
    const wrapper = mount(FileLoader)
    const themeFile = new File(['{"kui-space-10":{"$value":"4px"}}'], 'my.theme.json', { type: 'application/json' })
    const aliasFile = new File(['{"color":{"alias":{}}}'], 'my.alias.color.json', { type: 'application/json' })
    const inputs = wrapper.findAll('input[type="file"]')

    Object.defineProperty(inputs[0].element, 'files', { value: [aliasFile], configurable: true })
    await inputs[0].trigger('change')
    Object.defineProperty(inputs[1].element, 'files', { value: [themeFile], configurable: true })
    await inputs[1].trigger('change')
    await flushPromises()

    await wrapper.find('.fl-btn').trigger('click')

    const emitted = wrapper.emitted('load')
    expect(emitted).toHaveLength(1)
    expect(emitted![0][0]).toMatchObject({ themeName: 'my.theme.json', aliasName: 'my.alias.color.json' })
  })

  it('emits go-to-instructions when the hint link is clicked', async () => {
    const wrapper = mount(FileLoader)
    await wrapper.find('.fl-link').trigger('click')
    expect(wrapper.emitted('go-to-instructions')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/components/builder/FileLoader.spec.ts` (from `packages/design-tokens/`)
Expected: FAIL — `#fl-builtin-select` and `.fl-link` don't exist yet in `FileLoader.vue`, so the first two and the last test fail (the third, upload-only test should already pass against the unmodified component — confirming it isn't broken by this change later).

- [ ] **Step 3: Add the dropdown to `FileLoader.vue`, and replace the scaffold hint with a link to Instructions**

Replace the existing `.fl-hint` paragraph (currently "Scaffold a new theme first with `node scripts/theme-scaffold.mjs <name>`, then load its two source files here") with a shorter hint plus a link to the Instructions tab, then insert the new dropdown block right after it:
```html
<p class="fl-hint">
  New themes are scaffolded from the command line — see the
  <a
    class="fl-link"
    href="#"
    @click.prevent="emit('go-to-instructions')"
  >Instructions tab</a> for how. Once you have a theme's two source files, load them below.
</p>

<label
  class="fl-label"
  for="fl-builtin-select"
>Load an existing theme</label>
<select
  id="fl-builtin-select"
  class="fl-select"
  @change="onSelectBuiltIn"
>
  <option
    disabled
    selected
    value=""
  >
    Choose a theme…
  </option>
  <option
    v-for="theme in BUILT_IN_THEMES"
    :key="theme.id"
    :value="theme.id"
  >
    {{ theme.label }}
  </option>
</select>

<p class="fl-or">or upload your own files</p>
```

In the `<script setup>` block, add the import (near the top, after the existing `import { computed, ref } from 'vue'`):
```ts
import { BUILT_IN_THEMES } from '@/composables/useBuiltInThemes'
```

Add `'go-to-instructions'` to the existing `defineEmits` call:
```ts
const emit = defineEmits<{
  load: [{ themeText: string, aliasText: string, themeName: string, aliasName: string }]
  'go-to-instructions': []
}>()
```

Add the handler function next to `emitLoad` (same `load` emit contract as an upload, so `ThemeBuilder.vue`'s `onLoad` needs no changes for the dropdown path):
```ts
/** Loads the chosen built-in theme's bundled source files — same emit contract as an upload. */
function onSelectBuiltIn(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  const theme = BUILT_IN_THEMES.find((t) => t.id === id)
  if (!theme) return
  emit('load', {
    themeText: theme.themeText,
    aliasText: theme.aliasText,
    themeName: theme.themeFileName,
    aliasName: theme.aliasFileName,
  })
}
```

In the `<style lang="scss" scoped>` block, add (near the existing `.fl-hint` rule, following the same variable conventions — `.fl-link` mirrors `InstructionsPanel.vue`'s existing `.ip-link`):
```scss
.fl-link { color: $tb-accent; text-decoration: none;

  &:hover { text-decoration: underline; } }

.fl-label { color: $tb-text-dim; display: block; font-size: 12px; font-weight: 600; margin: 0 0 6px; text-transform: uppercase; }

.fl-select { background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 6px; color: $tb-text; font-size: 13px; margin-bottom: 16px; padding: 10px; width: 100%;

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; } }

.fl-or { color: $tb-text-dim; font-size: 12px; margin: 0 0 16px; text-align: center; }
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/components/builder/FileLoader.spec.ts` (from `packages/design-tokens/`)
Expected: PASS, all 4 tests green.

- [ ] **Step 5: Wire `go-to-instructions` in `ThemeBuilder.vue`, with a test**

`ThemeBuilder.vue` already has `@go-to-theme="activeTab = 'theme'"` wired to `InstructionsPanel`'s matching emit — add the mirror-direction wiring to its `FileLoader` usage:
```html
<FileLoader
  v-if="!isLoaded"
  :error="loadError"
  @go-to-instructions="activeTab = 'instructions'"
  @load="onLoad"
/>
```

In `ThemeBuilder.spec.ts`, add a new test right after the existing `'switches to the Theme tab when InstructionsPanel emits "go-to-theme"'` test, mirroring its structure:
```ts
it('switches to the Instructions tab when FileLoader emits "go-to-instructions"', async () => {
  wrapper = mount(ThemeBuilder)
  await switchTab(wrapper, 'theme')
  await wrapper.findComponent(FileLoader).vm.$emit('go-to-instructions')
  await wrapper.vm.$nextTick()

  expect(wrapper.findComponent(InstructionsPanel).isVisible()).toBe(true)
  expect(wrapper.findComponent(FileLoader).isVisible()).toBe(false)
})
```

Run: `pnpm exec vitest run --config vitest.config.mjs sandbox/components/builder/ThemeBuilder.spec.ts` (from `packages/design-tokens/`)
Expected: PASS — the new test passes, and all pre-existing tests (which drive `FileLoader` via its emitted `load` event, not real DOM interaction) are unaffected by the template/emit changes.

- [ ] **Step 6: Propose the commit**

```bash
git add packages/design-tokens/sandbox/components/builder/FileLoader.vue packages/design-tokens/sandbox/components/builder/FileLoader.spec.ts packages/design-tokens/sandbox/components/builder/ThemeBuilder.vue packages/design-tokens/sandbox/components/builder/ThemeBuilder.spec.ts
pnpm commit
```
(Conventional-commit type: `feat`, scope `theme-builder` — e.g. "let Theme Builder load a built-in theme from a dropdown, and link its scaffold hint to Instructions")

---

### Task 5: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Full token build + test suite**

Run from `packages/design-tokens/`:
```bash
pnpm test
```
Expected: PASS — this runs `pretest` (`pnpm build:tokens`) first, then the full Vitest suite including all specs touched above.

- [ ] **Step 2: Lint**

Run from `packages/design-tokens/` (or repo root):
```bash
pnpm lint
```
Expected: no errors on the touched files (`SandboxUnifiedEmbed.vue`, `SandboxUnifiedEmbed.spec.ts`, `TokenBrowser.vue`, `TokenBrowser.spec.ts`, `BookmarkletModal.vue`, `useBuiltInThemes.ts`, `useBuiltInThemes.spec.ts`, `FileLoader.vue`, `FileLoader.spec.ts`). If it reports fixable issues, run `pnpm lint:fix` if that script exists, or address manually.

- [ ] **Step 3: Typecheck**

Run from `packages/design-tokens/`:
```bash
pnpm typecheck
```
Expected: no new errors on the touched files. Pre-existing strict-null errors in unrelated older spec files are out of scope.

- [ ] **Step 4: Manual check in a real browser**

Per the sandbox reference doc's verification checklist (reactivity bugs like this app's past `CustTokenRow`/`defineExpose` issues only show up visually, not in unit tests):
```bash
pnpm sandbox:open
```
From `packages/design-tokens/`. Then:
1. Open the Token Browser (`/`) — confirm the "Theme Builder →" link now appears before "Customize →".
2. Navigate to `/#/embedded?embedded=1` directly (or drag the bookmarklet from the Token Browser and click it on any page) — confirm the sidebar opens with **Theme Builder** selected by default, not Customizer.
3. In the Theme Builder's Theme tab, confirm the new "Load an existing theme" dropdown lists all 6 themes (Classic Day, Classic Night, Electric Lime Day, Electric Lime Day High Contrast, Electric Lime Night, Electric Lime Night High Contrast).
4. Pick one (e.g. Electric Lime Day) — confirm it advances to the Color Aliases tab with real palette swatches populated (not empty), and the Theme tab's "loaded" summary shows `electric-lime-day.theme.json` / `electric-lime-day.alias.color.json`.
5. Confirm the existing upload/drag-drop flow still works by loading a different theme's files manually afterward (click "↻ Load different theme" first).
6. On the (now-unloaded) Theme tab, click the hint's "Instructions tab" link — confirm it switches to the Instructions tab.
7. Toggle between the Customizer and Theme Builder tabs — confirm both still work and the sidebar's `?tool=` hash param updates in the address bar for both directions.

- [ ] **Step 5: Report results to the user**

Summarize pass/fail for each of steps 1–4 above before considering the feature done. If step 4 (manual browser check) can't be performed in this environment, say so explicitly rather than claiming full verification.
