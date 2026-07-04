# Authoring checklist & gotchas

A linear checkbox form of `SKILL.md`'s flow. Pair with `token-model.md` (the "why") and
`component-tokens.md` (visual-identity taste). The scripts (`scaffold.mjs`, `preview.mjs`) do the
mechanical steps; this checklist is mostly the judgment work in between.

**Scope:** only ever `themes/<new>.theme.json`, `tokens/alias/color/<new>.alias.json`, and one
`EXHAUSTIVE_THEMES` line (which `scaffold.mjs` adds/removes for you). Never edit an existing theme
or palette, or any other repo file — see `SKILL.md`'s Scope guardrail.

## Before scaffolding
- [ ] Path chosen: in-repo (committed) vs. standalone (extract + tear down). Asked if unclear.
- [ ] Name is kebab-case and not already in `themes/`.
- [ ] Design brief gathered (SKILL.md Step 2.5): light/dark + full-theme-vs-narrow-override; the
      source of the look (brand colors / screenshot / URL / theme to port / verbal). For anything
      beyond an exact hex, worked from `design-inputs.md`. Narrow override → use
      `minimal-overrides.md`, not this checklist.

## Scaffold (deterministic — one command)
- [ ] `node ../skills/theme-creation/scripts/scaffold.mjs <name> [--from konnect-day|konnect-night]`
      — copies the exhaustive structural template, writes a placeholder (`#FF00FF`) palette,
      classifies under `EXHAUSTIVE_THEMES`, and prints the component-grouped token inventory +
      the literal-color tokens to re-express. Read the inventory.

## Design spec (SKILL.md Step 3.5 — judgment)
- [ ] Wrote a structured spec **in chat, not to a file**: colors always actively derived
      (backgrounds/surfaces/borders/status, not just the named color); a **component-match row**
      per key component (source's element → Kong component + tokens), mapping by visual
      equivalence not role name — the source's dominant CTA becomes Kong's `primary` button and
      reproduces its exact fill/text/border/radius/padding (see `component-tokens.md`); typography/
      radius/shadow/spacing where the source shows a direction, else "unchanged"; anything not
      token-expressible flagged rather than fabricated.
- [ ] Confirmed the spec with the user before touching values.

## Fill in values (SKILL.md Step 4)
- [ ] `<new>.alias.json`: every `#FF00FF` placeholder replaced with a real value (nothing left
      magenta); key set unchanged; each changed `$description` = `"Alias for <VALUE>."` exactly.
      (Night variant: use the finished day-theme palette instead — see SKILL.md Step 3.)
- [ ] `<new>.theme.json`: color tokens pointed at the right step for *this* palette; for each
      component-match row, set the component token **and** its semantic fallback so it renders on
      whatever Kongponents version the user runs; literal tokens (radius/shadow/padding/font/etc.)
      set per spec; scaffold-flagged literal-color tokens (focus rings, overlays, color-mix
      shadows) re-expressed with exact palette channels; theme-token `$description`s follow
      `token-model.md`.

## Build + verify (SKILL.md Steps 5, 5.5)
- [ ] `pnpm --filter @kong/design-tokens test` (runs build + guards) and `lint` both green. A
      failing guard names the exact token/description/off-source problem.
- [ ] Grepped compiled `dist/themes/<new>.css` for the key spec values — color AND non-color.
- [ ] `node ../skills/theme-creation/scripts/preview.mjs <name> --kongponents <version the user runs>`
      — screenshotted the real-component default-vs-themed gallery (to an absolute path OUTSIDE the
      repo) and compared against the source **component by component**. Acceptance bar: the themed
      primary button matches the source's primary CTA (fill, text, border, radius, padding), and
      likewise secondary/danger/card/input — a visible mismatch on the most prominent component is
      NOT done. Ruled out version skew (`--kongponents`) as the cause before treating it as a bug,
      but didn't hide behind it if the target version does consume the tokens.
- [ ] Got the user's sign-off on the rendered result, not just the planned spec.

## Finish
- **In-repo:** `git status` shows exactly the two new files + one `EXHAUSTIVE_THEMES` line. Flag
  the `kong-konnect/portal` note if primary/accent changed (SKILL.md Step 6A).
- **Standalone:** extracted `dist/themes/<new>.css` (verified fully resolved — no `{color.alias…}`,
  no `var(--kui-color-alias…)`, no `: undefined;`), then
  `node ../skills/theme-creation/scripts/scaffold.mjs <name> --teardown`, re-ran tests green, and
  confirmed `git status` shows no diff in `packages/design-tokens/`.

## Known documentation discrepancies (don't chase these)
- `docs/ALIAS-COLOR-MAPPING-GUIDE.md` links a `COMPONENT-TOKENS-GUIDE.md` that **doesn't exist**.
- Some generated headers/comments mention a `pnpm build:themes` script that **doesn't exist** —
  theme building is part of `build:tokens` (and `pnpm test`'s pretest).
- `README.md`/`docs` mention an `UNCHECKED_THEMES` array that **doesn't exist** in
  `themes.spec.mjs` — only `EXHAUSTIVE_THEMES` and `SEMANTIC_ONLY_THEMES` are real, and this skill
  only ever uses `EXHAUSTIVE_THEMES`.
