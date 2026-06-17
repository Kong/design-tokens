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
- [ ] select
- [ ] dropdown
- [ ] checkbox
- [x] **alert** (day + night) — appearances render via the semantic ramps (already correct); designed night `color-text-decorative-hover` = `purple.20` (prototype's `#5200f5` is too dark on a dark surface). Verified both themes.
- [ ] tooltip
- [x] **label** (day + night) — already correct in both (text=`color-text`, Funnel Sans, weight 600); the required-indicator dot uses the semantic `color-background-danger` directly (no label component token). Verified.

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
