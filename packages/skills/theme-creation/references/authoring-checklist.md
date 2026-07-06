# Authoring checklist & gotchas

A linear checkbox form of `SKILL.md`'s flow. Pair with `token-model.md` (the "why") and
`component-tokens.md` (visual-identity taste). The scripts (`theme:scaffold`, `themes:unfilled`,
`preview.mjs`) do the mechanical steps; this checklist is mostly the judgment work in between.

**Scope:** only ever the theme's two co-located files — `themes/<new>/<new>.theme.json` and
`themes/<new>/<new>.alias.color.json`. No `themes.spec.mjs` edit (the guards classify every theme
as exhaustive by default). Never edit an existing theme or palette, or any other repo file — see
`SKILL.md`'s Scope guardrail.

## Before scaffolding
- [ ] Path chosen: in-repo (committed) vs. standalone (extract + tear down). Asked if unclear.
- [ ] Name is kebab-case and not already in `themes/`.
- [ ] Design brief gathered (SKILL.md Step 2.5): light/dark/pair/standalone (independent themes —
      no structural coupling) + full-theme-vs-narrow-override; the source of the look (brand colors
      / screenshot / URL / theme to port / verbal). For anything beyond an exact hex, worked from
      `design-inputs.md`. Narrow override → use `minimal-overrides.md`, not this checklist.

## Scaffold (deterministic — one command)
- [ ] `pnpm theme:scaffold <name>` — generates the theme directly from the canonical token tree: every
      semantic token seeded with its real default value, every component token an empty slot, the
      palette seeded from `classic-day`'s real colors. No donor theme, no placeholder color. Prints
      the component-grouped token inventory (re-print anytime with `pnpm theme:scaffold <name>
      --inventory`). Read the inventory. (No spec edit — the theme is exhaustive by construction.)

## Design spec (SKILL.md Step 3.5 — judgment)
- [ ] Wrote a structured spec **in chat, not to a file**: colors always actively derived
      (backgrounds/surfaces/borders/status, not just the named color); a **component-match row**
      per key component (source's element → Kong component + tokens), mapping by visual
      equivalence not role name — the source's dominant CTA becomes Kong's `primary` button and
      reproduces its exact treatment. Each row carries **both** color (fill/text/border + states)
      **and geometry** (`border-radius`, `border-width`, `padding-x`/`padding-y`, `font-size`,
      `font-weight`, `line-height`) — geometry set to the measured value or explicit "unchanged",
      never left blank (wrong-density buttons are the miss). See `component-tokens.md`.
- [ ] Wrote the **System propagation** section: went family by family through the scaffold
      inventory groups the source did NOT show (form controls, surfaces, feedback, structure) and
      gave each a treatment DERIVED from the established brand character (brand hue for
      checked/selected/active fills, matching roundedness, shared focus-ring shape, matching
      density) — or an explicit "neutral — unchanged". No family left un-considered by default
      (see `component-tokens.md` "Propagate the brand across the whole component system").
- [ ] Typography/radius/shadow/spacing where the source shows a direction, else "unchanged";
      anything not token-expressible flagged rather than fabricated.
- [ ] Confirmed the spec with the user before touching values.

## Fill in values (SKILL.md Step 4)
- [ ] `<new>.alias.color.json`: seeded classic-day values replaced with the theme's real palette;
      key set unchanged; each changed `$description` = `"Alias for <VALUE>."` exactly. Ran
      `pnpm themes:unfilled <name>` — no family left unintentionally identical to the seed. (Night
      variant: use the finished day-theme palette instead — see SKILL.md Step 3.)
- [ ] `<new>.theme.json`: color tokens pointed at the right step for *this* palette; for each
      component-match row, set the component token **and** its semantic fallback so it renders on
      whatever Kongponents version the user runs, including the **geometry** tokens
      (`--kui-button-padding-x/y-*`, `-border-radius-*`, `-font-weight`, `-font-size-*`,
      `-line-height-*`, etc.), not just color; the propagated families' checked/selected/active
      fills, focus rings, radii and densities set to the derived brand values; literal tokens
      (radius/shadow/padding/font/etc.) set per spec; any literal-color tokens you compose (focus
      rings, overlays, color-mix shadows) built from exact palette channels; theme-token
      `$description`s follow `token-model.md`. Ran `pnpm themes:unfilled <name>` — zero component
      slots left empty (or each remaining one accounted for as a deliberate "neutral — unchanged").

## Build + verify (SKILL.md Steps 5, 5.5)
- [ ] `pnpm --filter @kong/design-tokens test` (runs build + guards) and `lint` both green. A
      failing guard names the exact token/description/off-source problem.
- [ ] Grepped compiled `dist/themes/<new>.css` for the key spec values — color AND non-color.
- [ ] `node ../skills/theme-creation/scripts/preview.mjs <name> --kongponents <version the user runs>`
      — screenshotted the real-component default-vs-themed gallery (to an absolute path OUTSIDE the
      repo) and compared against the source **component by component**. Acceptance bar: the themed
      primary button matches the source's primary CTA in fill, text, border **and geometry**
      (radius, padding, font-weight, font-size) — confirmed px-for-px via `getComputedStyle`, not
      just eyeball — and likewise secondary/danger/card/input; AND the **propagated** components
      (checkbox/radio/switch checked, input focus, selected tabs/rows) carry the brand, not
      Kong-gray. A visible mismatch on the most prominent component, or whole families left
      un-branded, is NOT done. Note: published `latest` consumes NO `--kui-button-*` component
      tokens (geometry or per-appearance color), so button appearance/geometry can only be verified
      against a **consuming build** — ruled out version skew (`--kongponents <consuming build>`)
      before treating a miss as a bug, but didn't hide behind it if that build does consume the
      tokens.
- [ ] Got the user's sign-off on the rendered result, not just the planned spec.

## Finish
- [ ] `pnpm themes:unfilled <name>` reports clean (0 empty component slots, or each remaining one
      accounted for in the spec as deliberate). **A good-looking preview does NOT prove this**: an
      unfilled component token is OMITTED from compiled CSS/JS entirely (never emitted as `--x: ;`
      or `--x: initial;` — both would break the fallback chain or actively reset an inherited value;
      see `token-model.md`), so it renders via a graceful semantic-default fallthrough — visually
      indistinguishable from "deliberately left at the semantic default." The preview can catch a
      *wrong* value; only `themes:unfilled` catches a *missing* one.
- **In-repo:** `git status` shows exactly the new `themes/<new>/` directory (its two files); no
  `themes.spec.mjs` change. (No `kong-konnect/portal` override is needed for a new theme — that
  note applies only to `classic-day`/`classic-night` changes, which this skill never makes; see
  SKILL.md Step 6A.)
- **Standalone:** extracted `dist/themes/<new>.css` (verified fully resolved — no `{color.alias…}`,
  no `var(--kui-color-alias…)`, no `: undefined;`), then `pnpm theme:scaffold <name> --teardown`,
  re-ran tests green, and confirmed `git status` shows no diff in `packages/design-tokens/`.

## Known documentation discrepancies (don't chase these)
- Some generated headers/comments mention a `pnpm build:themes` script that **doesn't exist** —
  theme building is part of `build:tokens` (and `pnpm test`'s pretest).
- Docs outside this skill (READMEs, other packages) may still describe the pre-refactor
  layout (`themes/<name>.theme.json` + `tokens/alias/color/<name>.alias.json`, a `konnect-*`
  scaffold donor, a `#FF00FF` placeholder palette). The current layout is co-located
  (`themes/<name>/<name>.theme.json` + `themes/<name>/<name>.alias.color.json`), generated from
  the source token tree, seeded from `classic-day` — see `token-model.md`. Fix the doc if you're
  already there for another reason; don't go chase it otherwise (see `SKILL.md`'s Scope guardrail).
