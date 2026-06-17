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
- [ ] input
- [ ] badge
- [ ] select
- [ ] dropdown
- [ ] checkbox
- [ ] alert
- [ ] tooltip
- [ ] label

## Per-component process (do for BOTH themes)
1. **Inspect prototype** at `/components/themed/<comp>`, theme = Day then Night v2. Capture computed
   styles for every variant × state in `.docs-content`: bg, text, border (color/width/style),
   radius, padding, font (size/line-height/weight), gap, box-shadow.
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
