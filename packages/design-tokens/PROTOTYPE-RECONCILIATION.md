# Prototype → Theme Reconciliation Checklist

Match the `konnect-day` / `konnect-night` themes to the design team's component
prototype so Kongponents renders identically. **The prototype is the source of truth.**

- Prototype: `http://localhost:5177/components/themed/<component>` — inspect inside `.docs-content`.
  Theme set via `html[data-theme="day|night-v2|classic"]`; states force-rendered via classes
  `force-hover` / `force-focus` / `force-active` + `disabled` attr.
- Themes: `themes/konnect-day.json` (Day), `themes/konnect-night.json` (Night v2). Rebuild: `pnpm build:tokens`.
- Component-token → semantic fallback map (one-time): `/tmp/fallback-pairs.txt`
  (`grep -rhoE 'var\(--kui-[a-z0-9-]+,\s*var\(--kui-[a-z0-9-]+' src/` in the Kongponents repo).

> 📖 **The reusable methodology is now in [`COMPONENT-TOKENS-GUIDE.md`](./COMPONENT-TOKENS-GUIDE.md)** — read it before instrumenting a new component or starting a wave. This file is the per-component reconciliation **log / record** (decisions + worked examples).

## Eligible components (instrumented in Kongponents + have `tokens/components/<comp>.json`)
- [x] **button** (day + night) — reference implementation
- [x] **card** (day + night) — prototype = pure semantic defaults; cleared leftover konnect-light/dark overrides (radius 8→6px, padding/gap 32→20px, title-weight 600→700, body-color → `color-text`). Verified both themes.
- [x] **input** (day + night) — borders are **neutral, not lime** (reset konnect-light/dark leftovers): default→`color-border`, hover/focus→`color-border-neutral`, disabled→**no border**, error→`color-border-danger`, error-hover→`-danger-strong`; focus ring = `2px color-border-neutral @20%` (input-specific, tighter than button's 4px); radius 6px; placeholder→`color-text-neutral`. Verified both themes. NOTE: hover/focus aren't in the static states-table — read them from the prototype's `:hover`/`:focus` CSS rules (semantic-driven).
- [x] **badge** (day + night) — appearances render via the semantic ramps (already correct from the exhaustive fill); fixed `badge-border-radius` 6→**100px** (pill, `border-radius-round`) + `padding-x` 8→**12px**; night info-badge + decorative text corrected; designed night `color-text-decorative-hover` = `purple.20` (#cfc8ff). Verified both themes.
- [x] **select** (day + night) — selected/hover item states render NEUTRAL in the prototype (not lime): `select-item-color-background-selected/hover` → `color-background-primary-weakest` *as rendered by the prototype* = gray (`#f1f3f1` day / `#292b26` night), `select-item-color-text-selected` → neutral. Reset lime leftovers. ⚠ see "Primary-driven states" below.
- [x] **dropdown** (day + night) — `dropdown-item-color-background-selected` → prototype neutral (`#f1f3f1`/`#292b26`), `-color-text-selected` → neutral; reset lime leftovers. ⚠ see below.
- [x] **checkbox** (day + night) — checked fill + checked/hover borders are NEUTRAL per prototype (reset lime/generic leftovers): checked→`#4e594e`/`#9da99d`, border→`color-border`. Designed: night default border `#292b26` (prototype's literal `#e3e8e3` is a bright border on the dark box). ⚠ see below.
- [x] **alert** (day + night) — appearances render via the semantic ramps (already correct); designed night `color-text-decorative-hover` = `purple.20` (prototype's `#5200f5` is too dark on a dark surface). Verified both themes.
- [x] **tooltip** (day + night) — already correct (renders via semantic fallbacks); no leftover overrides. Verified.
- [x] **label** (day + night) — already correct in both (text=`color-text`, Funnel Sans, weight 600); the required-indicator dot uses the semantic `color-background-danger` directly (no label component token). Verified.

## Wave 2 — newly instrumented from scratch
Process per component: enumerate themeable surface from the Kongponents source → instrument the `.vue`/mixin with `var(--kui-<comp>-*, var(--kui-<semantic>, $literal))` chains (split shorthands, atomic-wrap, preserve `!important`) → create `tokens/components/<comp>.json` (value-less registry) → regenerate `/tmp/fallback-pairs.txt` → fill konnect-day/night at each theme's **own** semantic value (non-divergent baseline) → reconcile divergences vs the prototype.

**Convention — do NOT tokenize breakpoint-varying properties.** A property whose value changes by `@media` breakpoint (e.g. pagination's mobile↔desktop font-size/line-height/button-size) must stay on the semantic/literal scale, NOT become a component token. The exhaustive themes assign every component token a single value, which would override *all* breakpoints at once and silently break responsive sizing. Only tokenize properties that are constant across breakpoints (or vary by an explicit size *prop*, like button's `-small/-medium/-large`).

**Convention — rarely tokenize `gap`.** Internal layout spacing (`gap`) is structural, not a typical theming surface a brand rebrands; leave it on the semantic scale by default (only tokenize a gap with a clear, specific reason). Dropped from pagination, empty-state, and slideout per design review.

**Convention — naming.** (a) A component token for a border **color** must contain `color-border` — `…-color-border[-variant][-state]` (e.g. `tabs-color-border-selected`, `pagination-color-border-hover`); never a bare `…-color-…` or a sub-element like `…-indicator-color-…` for a border. Prefer state-based names (`-selected`) over invented sub-element names (`-indicator`). (b) Component tokens use the **component's own name** — plural if the component is (`tabs`, `breadcrumbs`), matching `KBadge`→`badge`, `KPagination`→`pagination`.

- [x] **pagination** (day + night) — INSTRUMENTED (12 `--kui-pagination-*` tokens on the page-number buttons; arrows + page-size trigger are real `<KButton>`s → inherit `--kui-button-tertiary-*`) + RECONCILED to prototype. Page text and current/hover states **diverge to NEUTRAL gray** (not the lime primary), per the locked primary-states→neutral rule:
  - `color-text` → `gray.73` (day) / `gray.45` (night); `color-background-selected` → `gray.05` / `gray.107`; `color-border-selected` & `color-border-hover` → `gray.73` / `gray.45`.
  - Non-divergent (kept inheriting): `color-background` transparent; default `color-border` = `color-border` (`gray.17`/`gray.83`, already = prototype); radius/width/padding/font-family/font-weight/shadow-focus.
  - Built theme CSS matches the prototype exactly — day `#4E594E`/`#F9FBF9`; night `#9DA99D`/`#070807`. Dropped font-size/line-height/size (breakpoint-varying — see convention above). **Assumption:** hover border = current-border value (prototype styles them together; the static prototype only exposes the current-page state). NOTE: the docs dev server (5173) must be restarted to render the rebuilt design-tokens (it caches the pre-pagination build).
- [x] **empty-state** (24 tokens), **code-block** (11), **slideout** (17) — instrumented in parallel (3 sub-agents) + RECONCILED. (`gap` tokens dropped per convention below.) **Non-divergent**: these display/overlay components inherit only **base/neutral** semantics (`color-background`, `color-text`, `color-text-neutral[-*]`, `color-border[-inverse]`, `color-background-neutral-weakest`, `color-background-inverse`, shadows, scale tokens) — they have NO primary-driven states, so unlike pagination there is nothing to flip to neutral. Verified our konnect semantics === the prototype's for all 12 inherited color semantics in BOTH themes, so the per-theme baseline (each token = the theme's own semantic value) already matches the prototype exactly. No override values applied. Notes: empty-state feature-card tokens trimmed per design review (footer kept); code-block code-typography stays in the shared `_common.scss` mixin (also used by KAlert) so it's not tokenized per-component; slideout backdrop left on the composite-alpha semantic.

> **Reconciliation rule learned:** a component is divergent only when its source uses a *primary/brand* semantic that the prototype renders as *neutral* (pagination), or when the prototype hard-codes a value off the semantic scale. Components that already inherit base/neutral semantics are non-divergent as long as our theme semantics match the prototype — verify the inherited semantic set (12-color diff, both themes) rather than every element. Also confirm the prototype's component CSS references the **same semantics** our source does (read its rules via `document.styleSheets`) — that catches the pagination-style divergence without needing to trigger/render the component.

- [x] **modal** (26 tokens), **toaster** (22), **pop** (19) — instrumented in parallel (3 sub-agents) + RECONCILED. **Design-review refinements applied:** removed modal header/footer border tokens (4); consolidated toaster title+message to one `toaster-font-family`; toaster icon glyph recolored to `toaster-icon-color` (→ `color-background-inverse`, a knockout matching the toaster surface — was `color-text`); and **fixed the `kui-shadow` *semantic*** in konnect-day/night to the prototype's per-theme `color-mix` (was `rgba(0,0,0,…)`, wrong/invisible on the dark night surface) — found via KPop's shadow, but it's a semantic token so it corrects shadows on ALL overlays/cards.
- [x] **table** (21, via shared `_tables` mixin — serves KTableView/KTableData; **KTable itself is deprecated**), **tabs** (22), **breadcrumbs** (9) — instrumented in parallel + RECONCILED non-divergent. tabs/breadcrumbs inherit neutral/decorative semantics that match the prototype (component-CSS verified: same semantics our source uses); table's primary-driven states (active-sort, row-hover) corrected by the primary reconciliation below. Composite paddings + the 2 resize-hover box-shadows set explicitly. **KTableView's unique chrome (search/bulk-actions/column-visibility) is a follow-up pass that reuses `--kui-table-*`.**

> **🔑 Primary semantic reconciliation (2026-06-18) — "primary = electric_lime" REVERSED.** The konnect primary semantic family was electric_lime, but the prototype keeps the whole `color-*-primary*` family **neutral** (lime lives only on `--kui-button-color-*`). A full 125-token color-semantic diff vs the prototype showed **only** the 21 primary tokens were wrong (everything else matched; shadow already fixed). Re-mapped the 21 primary tokens to the prototype's neutral grays in konnect-day/night (**classic untouched**) → **0/125 color-semantic mismatches**. Caught snapshot-drift: 2 frozen-lime component tokens (table active-sort, row-hover) re-snapshotted to neutral; button tokens kept lime. **Method:** changing a semantic requires re-snapshotting the non-overridden component tokens that inherited it (frozen-snapshot model). Also worth periodically diffing the *whole* semantic layer vs the prototype — composite/primary families can be unreconciled from the initial theme build.

- [x] **slider** (14), **input-switch** (17), **segmented-control** (26) — instrumented in parallel + RECONCILED. These interactive controls' source uses the **primary** ramp (fill/thumb/on/selected/state-ramp) but the prototype's component CSS uses the **neutral** ramp → overrode the konnect tokens to the prototype's neutral semantics (slider fill→`neutral-weak`/thumb→`neutral`; switch on→`neutral-strongest`/on-hover→`neutral-strong`; segmented full state ramp → `neutral-{weak..strongest}`, selected-bg→`neutral-weakest`). classic keeps the source's primary default.

- [x] **truncate** (6), **radio** (7) — RECONCILED (final mop-up). themeable now **921**. KTruncate: expand/collapse triggers → text/bg colors (coordinated) + shared focus ring; primary→neutral. KRadio: the shared `radioCheckbox*` mixin is semantic-only (each .vue layers its own tokens) → KRadio had none; mirrored KCheckbox's 8 onto the radio circle as 7 `--kui-radio-*` (no border-radius — always a circle), reconciled by aligning radio's konnect values to KCheckbox (checked `#4e594e`). Conservative: left `.radio-card` appearance on the semantic scale. **✅ WAVE 2 COMPLETE — 910 themeable tokens; completeness scan confirms every component has tokens or is a documented skip/delegate/deprecated/structure-only.**

- [x] **Conservative-reuse cleanup** (uncommitted-token review): KDateTimePicker popover border → reuse `--kui-pop-color-border` (removed `date-time-picker-popover-color-border`); KMultiselect placeholder → reuse `--kui-input-color-text-placeholder` (removed `multiselect-trigger-color-text-placeholder`); removed over-tokenized `*-help-text-color-text-error` from text-area (→ 0 tokens, deleted) + file-upload (KInput leaves it on raw `--kui-color-text-danger`); renamed `radio-dot`→`radio-icon-color-background`, truncate `expand`/`collapse`→`*-trigger`. KFilterGroup pill is fully custom → no reuse. 921→917, byte-identical, guard 17/17.

- [x] **Reuse cleanup round 2**: filter-group group label → reuse `--kui-label-color-text`/`-font-weight`; pill `.base-label`→`--kui-label-font-weight`, `.content-label`→raw `--kui-font-weight-bold` (removed filter-group label/pill-label font-weight tokens); multiselect trigger icons → reuse `--kui-input-color-text-placeholder`/`--kui-input-color-text` (removed `trigger-color-text-icon`); radio indicator token removed (`radio-dot`/`radio-icon` both odd — the dot is a bg pseudo-element, unlike checkbox's checkmark glyph, so falls to `--kui-color-background`). Rule: a custom element that IS a `<KLabel>`/`<KInput>`/`<KPop>` references that component's tokens. 917→910, byte-identical (except filter-group label color now matches KLabel), guard 17/17.

- [x] **text-area** (1), **multiselect** (13), **date-time-picker** (10) — RECONCILED. themeable now **908**. KTextArea: ~all `@include input*` → 1 token (help-text error). KMultiselect: trigger=input mixin, rows reuse `--kui-select-item-*`, chips=`--kui-badge-*` → own tokens only for trigger-icon/footer/search/group (non-divergent). **KDateTimePicker = v-calendar (3rd-party): pared 43→10 conservatively** (day-cell identity + popover border + focus ring; dropped nav-grid/time-selector/weekday/arrow internals → semantic scale). Calendar day states primary→neutral (selected `#4e594e`/text `#fff`, today/in-range `#f1f3f1`, hover `#f9fbf9`). **Rule: for 3rd-party-wrapping components, tokenize only the high-value/stable surface, not the package's internal chrome.**

- [x] **external-link** (5), **filter-group** (20), **table-view** (0) — RECONCILED. themeable now **884**. **KTableView: no own tokens** — unique chrome is pure layout; visual comes from `@include table` (`--kui-table-*`) + embedded components (the flagged "pass" result = nothing to tokenize). **external-link:** ring-less link → coordinate color + ADD a `-shadow-focus` ring (user decision); primary→neutral on text default/hover/active. **filter-group:** pills' hover/selected `primary`→`neutral` (7 overrides; selected border rendered `#4e594e` = `color-border-neutral`); dropped over-specific `clear-shadow-focus` (ring stays themeable via primary inside local `$shadowFocusNarrow`); the prototype's `.proto-filter-pill` is a separate mockup — the real component is `.interactive-pill`.

- [x] **collapse** (13), **file-upload** (13), **copy** (8) — instrumented in parallel + RECONCILED. themeable now **861**. Mixin-sharing nuance held (file-upload→`--kui-input-*`/`--kui-button-*`, copy→`--kui-badge-*`, collapse→`--kui-card-*`; own tokens only for unique surfaces). **collapse trigger** (link-styled toggle) text default/hover/active use `color-text-primary*` in source but prototype uses `color-text-neutral*` → 3 overrides to neutral (classic keeps primary). **file-upload dropzone:hover** border → `color-border-neutral-weak` (konnect primary-weak already == neutral-weak). **copy non-divergent**. Fixed an ambiguous coordinated `-hover` token (KFileUpload dropzone border had `primary-weak` on hover + `primary` on focus → aligned both to `primary-weak` + ring distinguishes focus; a `-hover` token must have ONE level-② fallback).

- [x] **stepper** (15), **tree-list** (16), **skeleton** (15) — instrumented in parallel + RECONCILED. themeable now **827**. **stepper**: active step circle bg + completed connector use `color-background-primary` in source but the prototype uses `color-background-neutral` → overrode both in konnect (classic keeps primary); completed circle (`neutral-weak`), error (`danger`), connector default (`neutral-weaker`), active text (`text-inverse`) all matched. **tree-list + skeleton fully non-divergent** — all prototype CSS semantics matched source (tree-list selected/hover/icon → neutral steps; skeleton progress-bar fill + spinner use `color-*-primary` in BOTH source & prototype = konnect's neutral primary; base/shimmer → neutral). KSkeleton fullscreen surfaces live in shared `_loaders.scss`. **Naming fix:** a background-rendered sub-element must be `…-<subelement>-color-background` — the stepper connector (`::after` via `background-color`) was renamed `color-connector`→`connector-color-background` because stylelint `use-proper-token` rejects a `background-color` token lacking `color-background`. **Run `stylelint` on instrumented .vue/.scss after each wave.**

> **Lesson — the primary→neutral semantic remap does NOT fully reconcile interactive components.** Their source uses `color-*-primary*`; the prototype uses `color-*-neutral*` at steps that don't equal the primary steps (segmented selected-bg = neutral-weakest `#070807` ≠ primary-weakest `#292b26`), and a primary step can equal its neutral counterpart in ONE theme but not the other (slider matched in night, diverged in day). So **each interactive component needs a per-component reconciliation**: read the prototype's component-CSS semantics via `document.styleSheets` and override the konnect tokens to the neutral values — verifying BOTH themes. **Non-divergent** (overlay/feedback). modal + pop are neutral containers (`color-background`/`-text`/`-border`, `-neutral-weakest`/`-stronger`); toaster is a dark inverse surface (`color-background-inverse`/`color-text-inverse`) with per-appearance icon backgrounds (`color-background-{info,success,warning,danger,neutral}-weak`). Verified: (1) all 19 inherited semantics === prototype in BOTH themes; (2) the prototype's own `.modal-container`/`.toaster`/`.popover-container` CSS references the same semantics our agents instrumented (read via `document.styleSheets`; overlays are triggered, not statically rendered). Baseline already matches — no overrides. Notes: composite-alpha backdrop (modal) left on semantic; modal header/footer composite paddings set explicitly; native close buttons (modal/toaster/pop) tokenized as the component's own surface (like slideout); embedded `<KButton>`s inherit `--kui-button-*`; toaster appearance variance is icon-bg only (no per-appearance text, matching source).

## Resolved decisions
- **Primary-driven "selected/checked" states → NEUTRAL (match prototype).** RESOLVED: keep the prototype's
  gray for checkbox-checked + dropdown/select-selected. Lime is reserved as a button accent → **lime buttons,
  gray selections.** Rationale: the prototype is the source of truth (same call as reversing the brand-ramp
  buttons). If the design team later wants brand-lime selections, route these through `color-background-primary`.
- **Night checkbox default border → `#292b26`** (designed; the prototype's literal `#e3e8e3` is a bright
  border on the dark box — broken).
- **Night decorative-text-hover (badge + alert) → `purple.20`** (designed; prototype's `#5200f5` too dark on dark).

## Theme completeness (two modes, both guard-enforced in `themes.spec.mjs`)
- **konnect-day / konnect-night — EXHAUSTIVE** (`EXHAUSTIVE_THEMES`): every themeable token (currently **910** = 332
  semantic + 578 component). They legitimately carry component tokens because they genuinely **diverge**
  from semantics (dark/lime brand buttons, etc.).
- **classic — SEMANTIC-ONLY** (`SEMANTIC_ONLY_THEMES`): all 332 semantic tokens, **zero** component tokens.
  As the default theme it never diverges, so components fall through to its semantics via the Kongponents
  `var()` chain — **live, not a frozen snapshot**. Component-free *by omission* (not filled with snapshots)
  because this repo owns the component-token namespace (`tokens/components/`) but **not** the
  component→semantic fallback map (that lives in Kongponents SCSS) — so "contains no component token" is the
  only fallthrough property the repo can actually verify.
- **brand-a / brand-b** — intentionally partial (not yet filled).

> **Decision (2026-06-17) — branded themes are kept exhaustive on purpose.** The repo cannot distinguish a
> *divergent* component token from a *non-divergent snapshot* (the component→semantic fallback map lives in
> Kongponents, not here), so dropping the snapshot ones would add an external dependency *to delete tokens*
> for zero verifiability gain, and would break the 1:1 Figma export. Branded-theme component tokens are
> verifiable only externally — against the prototype — which we've done.
> **Snapshot caveat:** a later change to a *semantic* value in a branded theme will NOT propagate to the
> component tokens that should track it, and the repo can't catch that drift. Mitigation is procedural — the
> prototype is the source of truth, so **re-run the per-component reconciliation when the design changes**;
> don't hand-edit a semantic and assume components follow. (Repo-verifiable linkage would require recording
> each component token's semantic fallback in `tokens/components/*.json` — flagged as future tooling, not done.)

## Per-component process — EARLY explicit-fill method (⚠️ superseded by the Reusable Guide above)
> This was the approach for the first 10 components (set every token explicitly to its prototype value). Wave 2 evolved to **baseline-fill at each theme's own semantic + reconcile only the divergences** (see the Reusable Guide). Kept here as the first-10 record.
1. **Inspect prototype** at `/components/themed/<comp>`, theme = Day then Night v2. Capture computed
   styles for every variant × state in `.docs-content`: bg, text, border (color/width/style),
   radius, padding, font (size/line-height/weight), gap, box-shadow, hover/focus/active styles.
2. **Build the target map**: component token → prototype computed value (use `tokens/components/<comp>.json`
   for the token list, and the fallback map for the semantic each falls through to).
3. **Set every component token explicitly** (exhaustive, classic representation): colors as
   `{color.alias.*}` (the alias whose resolved hex == the prototype value; `transparent` →
   `{color.alias.transparent}`), non-colors as their value. No `var()` refs, no removals.
4. **Designed states**: where the prototype renders a flat/broken interactive state (cf. button primary
   hover), design a sensible value from the alias ramp + the day↔night relationship (light surface
   *lightens*, dark surface *darkens*; text stays the accent). Document each.
5. **Focus / weight / border conventions**: focus rings → the neutral semantic ring
   (Day `rgba(24,27,24,.15)`, Night `rgba(241,243,241,.15)`, 4px); font-weight & border-width per the
   prototype's *visible* value.
6. **Descriptions**: every component token carries its `$description` (from `tokens/components/<comp>.json`
   via `buildDescriptionMap` in `scripts/create-theme.mjs`).
7. **Rebuild + verify**: `pnpm build:tokens`; resolved values == prototype (designed states excepted),
   0 `var()` refs, 0 unexpected mismatches, build clean.
8. **Visual check** (optional): `pnpm sandbox:dev` → component page → Konnect Day/Night vs prototype.

## Decision rules (locked)
- Source of truth = prototype computed values.
- Exhaustive: all component tokens present, explicit, `{color.alias.*}`/value (no `var()` refs).
- Day↔night: same method, inverse direction.
- **Pre-existing overrides are suspect.** Component tokens from the original Phase-1 build often carry
  konnect-light/dark leftover values that don't match the prototype — reconciliation must *reset* every
  token to its prototype value (which, for non-diverging components like card, equals the semantic
  default), not just fill the missing ones.
- **Fonts:** all `font-family-text` and `font-family-heading` tokens (semantic + component) = `'Funnel Sans', Roboto, Helvetica, sans-serif`
  in both themes, EXCEPT `font-family-code` which stays monospace (`'JetBrains Mono', Consolas, monospace`).
- No Kongponents code changes except additive component tokens `var(--kui-<comp>, var(--kui-<semantic>, $kui-<scss>))`; no `gap` component token for now.

## Exhaustiveness drift guard (themes must stay 1:1 with `KUI_THEMEABLE_TOKENS`)
Adding component tokens (a new `tokens/components/<x>.json`, or new leaves on an existing one) grows the
themeable set — konnect-day/night must be updated in lockstep or the **Figma 1:1 export silently drifts**.
This is an *export-completeness* issue, not rendering (Kongponents still falls through `var(--kui-comp,
var(--kui-semantic, $scss))` at runtime). Proof it's real: 6 stale extras had already accumulated (tokens
removed from the design system but left in the themes) — now pruned; both themes stay exactly 1:1 with the set (currently 910).
**Solution (recommended, agreed):**
- **Guard test** — `themes.spec.mjs`: for each *exhaustive* theme (konnect-day, konnect-night) assert its
  `$value` key set === `KUI_THEMEABLE_TOKENS` exactly — fail on BOTH missing tokens and stale extras.
  (classic / brand-a / brand-b are intentionally non-exhaustive → exclude.) Reuse `getThemeableTokens()`.
- **No fill script.** The guard test above IS the completeness mechanism — it names exactly which tokens
  are missing/extra and fails CI. Add MISSING tokens to each exhaustive theme **by hand** at the per-theme
  value (intentional divergences must survive; component-token values are design choices that can't be
  auto-resolved). Workflow: add component tokens → run `pnpm test`, read the named-missing list → hand-add
  + reconcile each new token to the prototype → drift guard passes. (An earlier `scripts/fill-themes.mjs`
  auto-stubbed these; it was removed since the test already reports what's missing.)
- Do NOT bake any source mutation into `platforms/themes.mjs` (it would rewrite source during build + hit the unresolved-ref problem).
