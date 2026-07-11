# theme-creation skill — maintenance notes

This file is scoped to `packages/skills/theme-creation/`. It's about **keeping the preview gallery
working**, not about authoring themes — see `SKILL.md` and `references/` for that.

## What `assets/gallery.html` is

`scripts/preview.mjs` substitutes four placeholders into `assets/gallery.html` and serves it: the
Kongponents CSS/ESM CDN URLs (version set by `--kongponents`, default `latest`), a theme
`<link>` slot, and a `data-kui-theme` body-attribute slot. The result is a real, running
`@kong/kongponents` app (Vue 3, loaded from `esm.sh`/`unpkg` — no local install or build) so a
theme's compiled CSS can be checked against ground truth. See `SKILL.md` Step 5.5 for how agents
use it and for the version-skew caveat (a Kongponents build only consumes the tokens it was built
to read).

`gallery.html` itself only ever renders **one** theme at a time — its four placeholders don't
change when previewing multiple themes together. `preview.mjs` accepts one or more theme names and
composes the multi-theme view one level up: it renders `gallery.html` once per name into its own
`themed-<name>.html` (plus an always-present unthemed `default.html`), then generates an
`index.html` that lays those out as `Original | <name> | <name> | ...` iframe columns on one page.
If you're editing the render contract below, you're editing what shows up in *every* column, not
per-column composition.

## Render contract — read before editing

- **No build step.** Components are authored with Vue's `h()` render function only — never SFC
  `<template>` syntax. Kongponents components are accessed as named exports off `K`
  (`K.KButton`, `K.KTableView`, …), imported at runtime via `await import('__KONGPONENTS_ESM__')`.
- **Every example group is wrapped in the `group(title, fn)` helper.** It try/catches `fn` and
  renders `skipped: <error message>` instead of the group's content on failure, so one broken
  component can't blank the whole page. **Any new or edited example must go through `group()`.**
- **Reactive state lives at the top of `setup()`**, not inside a `group()` callback — `ref`/
  `computed` values created inside a `group()` fn get recreated on every re-render (e.g. whenever
  pagination or an overlay's visibility changes elsewhere on the page), silently resetting their
  state. Declare `ref`s once in `setup()` and reference `.value` from the render function.
- **v-model** is passed as `modelValue` + `'onUpdate:modelValue'` (event names in `h()` props are
  `onCamelCase`, e.g. a `page-change` event becomes `onPageChange`).
- **Slots** are the third argument to `h()`, as an object of functions (e.g.
  `h(K.KTabs, props, { a: () => h('p', 'content') })`), not passed as children unless the
  component takes only a default slot (then a single function works, e.g.
  `h(K.KButton, props, () => 'Label')`).
- **Supply every required prop.** `KFilterGroup` (`filters`, `modelValue`), `KMultiselect`
  (`items`), and `KTableView` (`headers`, `data`, `rowKey` strongly recommended) will otherwise
  throw and the group silently shows `skipped:` — that's working as intended, but it means a
  missing prop reads the same as a version-incompatible one; check both when a group is skipped.
- **Overlays and tooltips are trigger-gated, not open-by-default** — `KModal`/`KPrompt`/
  `KSlideout` are stacked, full-backdrop components; rendering several open at once would cover
  the gallery. Each is wired to a `ref` flipped by a `KButton`'s `onClick`, and closed via the
  component's own `onProceed`/`onCancel`/`onClose`. Keep this pattern for any new overlay example.
- **Don't size input-like components via a `style`/`class` prop passed directly to the
  component.** Kongponents forwards those fallthrough attrs onto the component's inner `<input>`
  element, not its outer wrapper — so `h(K.KSelect, {style: 'max-width:200px'})` constrains only
  the text field while the outer flex wrapper (which also lays out the trailing chevron/icon)
  stays full-width, visibly detaching the icon from the field (confirmed via `getComputedStyle`/
  `getBoundingClientRect` on `.k-select` vs. the inner `.input`). Wrap the component in a sizing
  `<div>` instead — `h('div', {style: 'max-width:200px'}, [h(K.KSelect, {...})])` — as done for
  `KInput`/`KSelect` in the Inputs & selection group. Check any new input-like component
  (multiselect, date picker, etc.) the same way if it looks misaligned.

## Kongponents version-change checklist

Run this whenever the Kongponents version the team targets changes — especially a **major**
version, where prop names, event names, exports, or entire components can change or be removed.

1. Run the preview against the new version and open it in a browser:
   ```sh
   node scripts/preview.mjs <any-existing-theme-name> --kongponents <new-version-or-tag>
   ```
2. **Any group rendering `skipped: <message>` has a broken prop, event, or export for that
   version.** The message is the thrown error — start there.
3. For each broken component, check the current docs (`kongponents.konghq.com/components/`) and
   source (`github.com/Kong/kongponents`, `src/components/<Name>/`, `src/types/`) for the new
   prop/event/export names, then update the corresponding `h()` call in `gallery.html`.
4. Watch specifically for **deprecations and removals**, not just renames — e.g. `KTable` was
   deprecated in favor of `KTableData` (fetcher-driven) / `KTableView` (fully controlled, used in
   this gallery). Swap to the replacement; don't leave a deprecated component in the gallery.
5. Re-run the preview, check the browser console for errors (`app.config.errorHandler` logs
   them), and confirm every group renders real content — no `skipped:` notes remain.
6. If a new major version adds theming-relevant components or props worth verifying (e.g. a new
   appearance, a new component family), consider adding an example for it following the patterns
   above, so the gallery keeps covering what themes can actually affect.

## Screenshot rule (same as SKILL.md)

Screenshot the preview to a path **outside the repo** (e.g. your scratch/tmp directory) — never
into the repo tree, even a gitignored location.
