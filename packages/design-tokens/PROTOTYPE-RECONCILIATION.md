# Prototype → Theme Reconciliation Checklist

Match the `konnect-day` / `konnect-night` themes to the design team's component
prototype so Kongponents renders identically. **The prototype is the source of truth.**

- Prototype: `http://localhost:5177/components/themed/<component>` — inspect inside `.docs-content`.
  Theme set via `html[data-theme="day|night-v2|classic"]`; states force-rendered via classes
  `force-hover` / `force-focus` / `force-active` + `disabled` attr.
- Themes: `themes/konnect-day.json` (Day), `themes/konnect-night.json` (Night v2). Rebuild: `pnpm build:tokens`.
- Component-token → semantic fallback map (one-time): `/tmp/fallback-pairs.txt`
  (`grep -rhoE 'var\(--kui-[a-z0-9-]+,\s*var\(--kui-[a-z0-9-]+' src/` in the Kongponents repo).

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

## Resolved decisions
- **Primary-driven "selected/checked" states → NEUTRAL (match prototype).** RESOLVED: keep the prototype's
  gray for checkbox-checked + dropdown/select-selected. Lime is reserved as a button accent → **lime buttons,
  gray selections.** Rationale: the prototype is the source of truth (same call as reversing the brand-ramp
  buttons). If the design team later wants brand-lime selections, route these through `color-background-primary`.
- **Night checkbox default border → `#292b26`** (designed; the prototype's literal `#e3e8e3` is a bright
  border on the dark box — broken).
- **Night decorative-text-hover (badge + alert) → `purple.20`** (designed; prototype's `#5200f5` too dark on dark).

## Theme completeness (two modes, both guard-enforced in `themes.spec.mjs`)
- **konnect-day / konnect-night — EXHAUSTIVE** (`EXHAUSTIVE_THEMES`): every themeable token, 548 = 332
  semantic + 216 component. They legitimately carry component tokens because they genuinely **diverge**
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

## Per-component process (do for BOTH themes)
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
removed from the design system but left in the themes) — now pruned; both themes are exactly 548 = the set.
**Solution (recommended, agreed):**
- **Guard test** — `themes.spec.mjs`: for each *exhaustive* theme (konnect-day, konnect-night) assert its
  `$value` key set === `KUI_THEMEABLE_TOKENS` exactly — fail on BOTH missing tokens and stale extras.
  (classic / brand-a / brand-b are intentionally non-exhaustive → exclude.) Reuse `getThemeableTokens()`.
- **Fill script** — `scripts/fill-themes.mjs`: add any MISSING themeable token to each exhaustive theme at
  its resolved fallback value (colors → `{color.alias.*}`; non-colors → the **resolved concrete value** from
  `dist/tokens/js/tokens.json`, NOT a `{…}` ref, which won't resolve in the per-theme build). Report extras
  (opt-in `--prune`). NEVER overwrite an existing value (intentional divergences must survive). Flag
  ambiguous fallbacks (a token appearing in multiple `var()` chains, e.g. focus-visible reusing hover) for
  manual decision. Workflow: add component tokens → `pnpm fill-themes` → reconcile the new tokens to the prototype → guard test passes.
- Do NOT bake the fill into `platforms/themes.mjs` (it would mutate source during build + hit the unresolved-ref problem).
