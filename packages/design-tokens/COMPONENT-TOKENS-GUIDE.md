# 🧭 Reusable guide: instrument a Kongponent + reconcile its theme tokens

A complete, self-contained methodology for adding `--kui-<component>-*` component tokens to a Kongponent and reconciling the branded (`konnect-day`/`konnect-night`) themes to the prototype. Follow it end-to-end for any new component or a future "wave." It **supersedes** the older "Per-component process" approach (set every token explicitly to its prototype value, used for the first 10 components); the method here — baseline-fill + reconcile only divergences — is what Wave 2 settled on. The per-component reconciliation **log** (decisions + worked examples) lives in [`PROTOTYPE-RECONCILIATION.md`](./PROTOTYPE-RECONCILIATION.md).

## 0. The model (read first)

**Three token tiers** in `@kong/design-tokens`:
1. **primitive alias palette** (`tokens/alias/**`) — never exported as `--kui-*`; resolved to literal hex at build.
2. **semantic tokens** (`--kui-color-text-primary`, `--kui-shadow-focus`, …) — valued, emitted as CSS.
3. **component tokens** (`--kui-<component>-*`) — **value-less, names-only**, declared in `tokens/components/<comp>.json`. They carry a value ONLY inside an exhaustive theme; everywhere else (SCSS/JS/CSS) they are undeclared.

**The fallback chain** — every instrumented declaration in Kongponents becomes:
```scss
property: var(--kui-<comp>-<name>, var(--kui-<semantic>, $kui-<semantic>));
//            ① component (value-less)    ② EXACT current semantic    ③ SCSS literal
```
- ① the new component token — **never given a value in source** (a theme fills it).
- ② **the exact semantic the source already used** — this is what guarantees a byte-identical default render.
- ③ the existing SCSS literal.
An undeclared custom property is the guaranteed-invalid value by spec, so `var()` falls through to ② with byte-identical rendering. **Instrumentation must NEVER change the rendered value — only wrap it.**

**Two theme modes** (guard-enforced in `themes.spec.mjs`):
- **EXHAUSTIVE** (`konnect-day`, `konnect-night`) — contain EVERY token in `KUI_THEMEABLE_TOKENS` (semantic + component), each as a frozen value (1:1 with the Figma export).
- **SEMANTIC-ONLY** (`classic-day` — the default — and its dark counterpart `classic-night`) — all semantic tokens, **zero** component tokens; components fall through to their semantics live. Component-free *by omission*. **Reconciliation never touches the classic-* themes** — they keep the Kongponents default look (classic-night only re-points ~20 text/border/background semantics to darker steps).

**Sources of truth & tools:**
- **Prototype = source of truth** for konnect: `http://localhost:5177/components/themed/<comp>` (switch Day / Night v2 buttons).
- **Docs site** `http://localhost:5173` = the live/interactive component (default theme) — best for *examining states*, but it **caches design-tokens** (restart / clear `docs/.vitepress/cache` after a rebuild). Verify values against the 5177 prototype, not the stale docs.
- Use the Playwright MCP to read `getComputedStyle` and `document.styleSheets` (component CSS semantics) — see Phase F.

## Phase A — Decide WHAT to tokenize

**A.1 Is it in scope?** Every `src/components/K*` is one of:
- **Instrument** — has a brandable themeable surface (most components).
- **Skip (no themeable surface, logic/structure only):** KComponent, KDropdownMenu, KTableData, KToggle, KClipboardProvider, KThemeProvider.
- **Delegate** (renders + inherits another component): KPrompt→KModal, KModalFullscreen→KButton, KCatalog→KEmptyState.
- **Deprecated:** KTable.
- **Inherits a shared mixin's tokens — 0 own tokens by design:** KTextArea→`--kui-input-*`, KTableView→`--kui-table-*`. (A completeness scan will "⚠️" these; they're covered, not gaps.)

**A.2 Examine the component in EVERY state.** Open it live on 5173 and force its states; for triggered/overlay/3rd-party components (calendars, dropdowns, popovers) OPEN them and inspect the real DOM state classes (e.g. v-calendar `is-today` / `vc-highlight-content-solid` / `vc-disabled`). Don't trust a static states table — read the actual `:hover`/`:focus`/`:active`/`:disabled`/selected/checked rules.

**A.3 Choose the surface (per-component judgment).** Tokenize the "typical theming surface": colors (background/text/border per state), `border-radius`, `border-width`, `padding` (only single, non-breakpoint values), `font-family`/`font-weight`, and the focus-ring shadow. Mirror what KButton/KAlert/KBadge/KSegmentedControl exposed.

**A.4 Be conservative — REUSE before minting net-new (evaluate the existing theming first):**
- **Reuse an existing component's tokens when the element IS conceptually that component.** A custom `.label` span → `--kui-label-*`; an input-styled trigger → `--kui-input-*` (incl. `-color-text-placeholder`); a KPop-rendered popover → `--kui-pop-*`; a select-style dropdown row → `--kui-select-item-*`; a badge-wrapped chip → `--kui-badge-*`. Components that **wrap/embed** others reuse the embedded component's tokens and add `--kui-<thiscomp>-*` ONLY for genuinely unique chrome.
- **Don't tokenize shared-mixin chrome that the canonical component leaves on the raw semantic.** KInput leaves its error help-text on `var(--kui-color-text-danger, …)` — so KTextArea/KFileUpload must NOT mint a `*-help-text-color-text-error` token. Match the canonical component's choice.
- **Third-party-wrapping components → tokenize only the high-value/stable surface, NOT the package's internals.** KDateTimePicker wraps v-calendar: tokenized the day-cell identity (selected/today/in-range/hover/disabled), the container border (reused `--kui-pop-*`), and the focus ring; left the nav grid / time selectors / weekday / arrows on the semantic scale (fragile + low brand value). Pared 43 → 10.
- **Don't tokenize breakpoint-varying properties.** A font-size/size/padding that changes by `@media` must stay semantic — an exhaustive theme assigns one value and silently breaks responsive sizing. (Tokenize per-size *prop* variants like button `-small/-medium/-large`, never `@media` variants.)
- **Rarely tokenize `gap`** — internal layout spacing is structural; leave it semantic.
- **Never set a token to a value that just restates the current default** — it would shadow a consumer's semantic-level override (the #3190 hazard). Set a token only to *intentionally diverge*.

## Phase B — Naming (matches the stylelint `use-proper-token` rule)

Grammar: `--kui-<component>[-<sub-element>]-<category>-<property>[-<variant>][-<state>]`
- **Component name** = the component's own (plural if it is: `tabs`, `breadcrumbs`). Multi-word → underscores in the JSON root key (`segmented_control`, `date_time_picker`), hyphens in the emitted name.
- **category BEFORE property:** `color-background`, `color-text`, `color-border` — never `background-color`.
- **Property ↔ token-name match (stylelint enforces it):** a token used in `background-color` MUST contain `color-background`; in `color` → `color-text`; in `border-color` → `color-border`. A *background-rendered* indicator/line/dot/connector MUST be `…-color-background…` (e.g. stepper `connector-color-background`, NOT `color-connector`; a radio dot is a `background-color` pseudo-element, so it can't borrow checkbox's `color-icon`).
- **Sub-elements** (a distinct part: `title`, `icon`, `trigger`, `dropzone`, `day`, `pill`, `connector`, `footer`) slot RIGHT AFTER the component, BEFORE the category: `card-title-color-text`, `date-time-picker-day-color-background-selected`.
- **Variants/scales that mirror a semantic step** (an appearance, a size, `weak`/`strong`, `code`) go AFTER the category — **mirror the semantic the token falls back to**: `font-family-code` (↳ `--kui-font-family-code`), `color-background-primary` (↳ `--kui-color-background-primary`). NEVER `code-font-family`.
- **States:** `-hover`, `-active`, `-selected` (use `-selected` for current/checked/active-item), `-disabled`, `-error` — always last.
- **NEVER create separate `hover`/`focus`/`focus-visible` tokens.** ONE `-hover` token coordinates all three (reused on `:hover`, `:focus`, `:focus-visible`), exactly like buttons; the focus RING (`-shadow-focus`) is the only separate focus token. **Each state's declaration KEEPS its OWN level-② semantic fallback (per-declaration fallbacks) — do NOT flatten them to the `:hover` value.** Canonical example (KButton): `--kui-button-color-background-primary-hover` is reused on `:hover` (↳ `--kui-color-background-primary-strong`) AND `:focus-visible` (↳ `--kui-color-background-primary-stronger`) — the one token coordinates the states *when themed*, but the distinct semantic fallbacks keep the unthemed (`classic`) render byte-identical. The KButton comment states it: `// -hover tokens drive both hover and focus-visible; semantic fallbacks retain distinct defaults.` Flattening every state to the `:hover` fallback silently changes `classic`'s focus look — that was the headline Wave-2-review bug. **Ring-less components** (links/text-triggers that distinguish focus by color only): coordinate the color into one `-hover` token AND **add** a `-shadow-focus` ring.
- **Don't mint a sub-element token that merely restates a more general token's value** (reuse the general one).
- The `--kui-navigation-*`/`--kui-method-*`/`--kui-status-*`/`--kui-icon-*` families are *valued semantic* tokens (each in its own `tokens/source/<name>/` folder), NOT component tokens — never touch them.

## Phase C — Instrument the Kongponents source (`.vue` / mixin)

For each themeable declaration: 1) wrap with the fallback chain (② = the EXACT current semantic — byte-identical); 2) **split shorthands** before tokenizing one longhand (`border: X solid Y` → `border-width`/`border-style`/`border-color`; tokenize width + color, keep `border-style`); 3) **wrap multi-part values atomically** in ONE token (box-shadow, borders-via-box-shadow [KInput/KCheckbox], `linear-gradient`, transition) — never fragment; 4) **preserve `!important`** OUTSIDE the `var()` chain; 5) leave `@include <mixin>` lines + embedded `<KButton>`/`<KIcon>` alone (they carry their own tokens). If a value has no `--kui-` semantic today (a raw hex / local SCSS var), keep it exactly as the fallback and REPORT it (it won't be in the fallback map → fill it explicitly in Phase E).

**Pipeline tip:** instrument 2–3 components in parallel via sub-agents (each confined to its own files + registry JSON), then do integration/reconciliation serially. Give each agent the conventions above + the canonical examples; **always re-run stylelint on the agent's output** — agents reliably introduce property↔name + property-order issues.

## Phase D — Registry + integrate

**D.1** Create `tokens/components/<kebab>.json`: root key = component (underscored), `"$type": "component"`; nest by category; each LEAF `{ "$description": "<clear sentence>", "$value": "" }` (value-less); `_` key for a default-with-siblings; multi-word leaf names underscored (`line_height`); sub-elements as top-level keys; **alpha-sort every level**.

**D.2** Regenerate the component→semantic fallback map (in the **Kongponents** repo):
```bash
grep -rhoE 'var\(--kui-[a-z0-9-]+,[[:space:]]*var\(--kui-[a-z0-9-]+' src --include='*.vue' --include='*.scss' \
  | sed -E 's/var\(--(kui-[a-z0-9-]+),[[:space:]]*var\(--(kui-[a-z0-9-]+)/\1 => \2/' | sort -u > /tmp/fallback-pairs.txt
```
Only captures chains whose fallback starts with `var(--kui-`; raw/`$scss`/`calc()`/multi-value fallbacks are NOT captured → fill them explicitly. **⚠️ This grep is SINGLE-LINE — it MISSES multi-line `var(` declarations** (a `box-shadow:`/`border-color:` whose inner `var(` opens on the next line, e.g. the `_input-text.scss` hover/error mixins). A token used only in a multi-line declaration will look unmapped/"dead" — READ the source to confirm before treating a registry token as missing or unused, and fill its baseline explicitly.
**Coordinated `-hover` resolving to >1 semantic is EXPECTED, not a bug:** `grep '^kui-<comp>' /tmp/fallback-pairs.txt | sed 's/ =>.*//' | sort | uniq -d` lists every coordinated `-hover` token — it legitimately maps to a *different* level-② fallback per state (`:hover` vs `:focus`/`:focus-visible`), the byte-identical per-declaration pattern (see Phase B). **Do NOT flatten these to one value.** Only treat a duplicate as a bug if a SINGLE-state token was wrapped with two different fallbacks by mistake.

**D.3** `pnpm build:tokens` (design-tokens) — regenerates `dist/themeable-tokens.mjs` (`KUI_THEMEABLE_TOKENS`) + `dist/themes/*.css`.

## Phase E — Baseline-fill the exhaustive themes (PER-THEME)

Each exhaustive theme must contain every new token. Fill each at **that theme's OWN semantic value** (the non-divergent baseline):
- **Do it MANUALLY** (a node script): for each new pair `kui-X => kui-Y`, set `konnect-day[X] = clone(konnect-day[Y])` and `konnect-night[X] = clone(konnect-night[Y])`, attaching the component token's `$description` from the registry.
- **The completeness check is the drift-guard test** (`pnpm test` → `themes.spec.mjs`): it names exactly which tokens are missing/extra in each exhaustive theme and fails CI. Use it to see what still needs filling; the per-theme **value** is always authored by hand (a component token's value is a design choice — there is no default to infer it from).
- Composite / raw-fallback tokens → set explicitly per theme.
- Verify: each exhaustive theme key-count === `KUI_THEMEABLE_TOKENS` (drift guard green), 0 empty `$value`, classic-day/classic-night unchanged.

## Phase F — Reconcile divergences vs the prototype (BOTH themes)

A token is **divergent** only when the source uses a *primary/brand* semantic the prototype renders as *neutral*, or the prototype hard-codes off-scale. Tokens that already inherit base/neutral semantics need nothing (verify the inherited-semantic set matches the prototype, both themes — don't re-check every element).

**F.1** Read the prototype's component CSS semantics via `document.styleSheets` (works WITHOUT triggering the component): for each state, which `--kui-*` does the prototype reference? Compare to the source's level-② semantic.
**F.2 The recurring divergence:** interactive states (selected/hover/active/checked, fills, connectors, links) use `color-*-primary*` in the Kongponents source, but the konnect design uses `color-*-neutral*`. Override the konnect tokens to the prototype's neutral semantic; **the classic-* themes keep the source's primary** (the default look). This stems from the locked decision: **konnect's whole `color-*-primary*` family is neutral gray; electric-lime lives ONLY on `--kui-button-color-*` → "lime buttons, gray selections."**
**F.3 The primary→neutral semantic remap is necessary but NOT sufficient:** the prototype's neutral *steps* don't always equal the primary steps (segmented selected-bg = `neutral-weakest` ≠ `primary-weakest`), and a primary step can equal its neutral counterpart in ONE theme but not the other (slider matched in night, diverged in day). So reconcile **per-component, per-state, in BOTH themes** — read the actual prototype value (the CSS semantic, and/or open the component and read the rendered `getComputedStyle`) and override to that exact neutral.
**F.4 Families:** when a component mirrors a reconciled sibling (radio↔checkbox), align its konnect values to the sibling's already-reconciled values.
**F.5** Verify against the built CSS (`dist/themes/<theme>.css`) and/or the rendered prototype.

## Phase G — Verify + finish (EVERY wave)
```bash
# design-tokens
pnpm build:tokens
npx vitest run themes.spec.mjs       # guard: exhaustive themes === KUI_THEMEABLE_TOKENS; classic-day/classic-night = semantic-only
node -e 'console.log(Object.keys(require("./themes/classic-day.json")).length)'  # classic-day UNCHANGED (currently 332)
# kongponents
node_modules/.bin/stylelint "src/components/K<Comp>/**/*.vue"   # property↔name + property order — MUST pass
rm -rf docs/.vitepress/cache         # so 5173 reflects the rebuild
```
Also grep the source for dangling refs to any token you renamed/removed, and confirm the byte-identical reuse (reused tokens resolve to the same value).

## Pitfalls (consolidated)
- **Theme tokens are authored by hand** (Phase E) — component values are design choices that can't be auto-resolved. The drift-guard test (`pnpm test`) is the completeness check: it names the missing/extra tokens and fails CI.
- **Docs (5173) caches design-tokens** — restart / clear `docs/.vitepress/cache`; trust the 5177 prototype.
- **Coordinated `-hover` keeps PER-DECLARATION fallbacks** (NOT one flattened value): one `-hover` token on `:hover`/`:focus`/`:focus-visible`, but each declaration retains its OWN level-② semantic so the default render is byte-identical (the KButton pattern). Flattening every state to the `:hover` fallback silently changes `classic-day`'s focus look — the headline bug caught in the Wave-2 review (input/segmented/file-upload focus). The D.2 `uniq -d` listing a coordinated `-hover` under multiple semantics is expected, not an error.
- **The D.2 fallback-map grep is single-line** — it misses multi-line `var(` declarations (e.g. `_input-text.scss` hover/error mixins), so a token used only there looks unmapped/"dead." Read the source to confirm before treating a registry token as unused or a baseline as missing.
- **Naming misorder** (variant before category; a bg-rendered token missing `color-background`) — stylelint catches it; run it on every file.
- **Snapshot drift:** changing a *semantic* value does NOT auto-update the frozen component-token snapshots that inherited it — re-snapshot the non-overridden inheriting ones; periodically diff the *whole* semantic layer vs the prototype (composite/primary families can be unreconciled from the initial build — that's how the lime-primary + `shadow-border` families were caught).
- **Pre-existing leftover overrides** (early konnect-light/dark) don't match the prototype — reset to the prototype value, don't just fill the missing tokens.
- **Over-tokenization** — reuse existing tokens, don't tokenize KInput-semantic chrome, be conservative with 3rd-party packages (Phase A.4); the user repeatedly trimmed agent over-tokenization.
- **Verify load-bearing assumptions** with source/spec proof, not assertion.

## Decisions (locked — see `PROTOTYPE-RECONCILIATION.md` → "Resolved decisions" + "Theme completeness" for detail)
- Prototype = source of truth for konnect; the `classic-*` themes (`classic-day` default + `classic-night` dark) = the Kongponents default, never reconciled.
- **konnect `color-*-primary*` = neutral gray**; lime lives only on `--kui-button-color-*`.
- Primary-driven selected/checked/active states → neutral in konnect (route through `color-background-primary` only if the design later wants brand selections).
- Branded themes kept EXHAUSTIVE on purpose (1:1 Figma; the repo can't distinguish a *divergent* token from a *snapshot* one — the fallback map lives in Kongponents).
- Designed night exceptions where the prototype's literal is broken on a dark surface (checkbox border `#292b26`; decorative-text-hover `purple.20`).
