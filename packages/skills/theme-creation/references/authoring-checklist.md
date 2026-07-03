# Authoring checklist & gotchas

A linear checklist to run through once you know the theme name and which path (in-repo or
standalone) you're taking. Pair with `token-model.md` for the "why" behind each rule.

**Scope reminder:** this checklist only ever touches two new files
(`themes/<new>.theme.json`, `tokens/alias/color/<new>.alias.json`) plus a single added/removed
line in `themes.spec.mjs`. Never edit an existing theme, an existing palette, or any other repo
file — see the "Scope guardrail" section at the top of `SKILL.md` for the full rule and why.

## Before you touch a file

- [ ] Design brief gathered (SKILL.md Step 2.5): light/dark + full-theme-vs-override scope,
      brand/accent colors or a visual reference (screenshot/mockup/URL), or explicit verbal
      guidance — see `design-inputs.md` for how to work from whatever the user provided. Don't
      skip straight to copying a template on a guess.
- [ ] Theme name is **kebab-case** (lowercase, hyphen-separated — e.g. `acme-day`, not
      `AcmeDay` or `acme_day`).
- [ ] Theme name is **unique** — not already a file in
      `packages/design-tokens/themes/*.theme.json`. Check with a directory listing, not memory.
- [ ] You've picked a **template theme of the matching class** to copy:
      - Want every component individually overridable? → exhaustive → copy `konnect-day` or
        `konnect-night`.
      - Want components to fall through to semantic defaults? → semantic-only → copy
        `classic-day` or `classic-night`.
      - Building a day/night pair? Copy both of the matching class and treat the night variant
        as a re-point of a handful of text/border/background/shadow tokens to darker alias
        steps — not a wholly new palette (mirrors how `classic-night` relates to `classic-day`;
        verified in the real repo, the day/night `.alias.json` pair in each class is
        byte-identical — leave the night variant's palette hex values untouched and do 100% of
        the darkening via `.theme.json` re-points).
      - Only need a handful of tokens overridden, not a full color system or component set?
        Don't use this checklist at all — see the skill's "Minimal/partial overrides" section
        (`SKILL.md` Step 6B) for a lighter-weight approach that skips the guarded pipeline
        entirely.

## Authoring

- [ ] `cp themes/<from>.theme.json themes/<new>.theme.json`
- [ ] `cp tokens/alias/color/<from>.alias.json tokens/alias/color/<new>.alias.json` — required
      for any theme that references `{color.alias.*}` (virtually all of them). Skipping this is
      a hard build error, not a warning.
- [ ] Edit palette hex values in `tokens/alias/color/<new>.alias.json` — **skip this step
      entirely if `<new>` is a night/dark variant of a day theme** (leave it byte-identical to
      the day palette; see above):
      - `$value` uppercase hex or `transparent`.
      - `$description` = `"Alias for <VALUE>."` exactly, updated to match the new value. This
        one is guard-checked (`themes.spec.mjs`'s `$description` guard covers `.alias.json`).
      - Don't add or remove keys — the set must match `_manifest.json` exactly.
- [ ] Edit token `$value`s in `themes/<new>.theme.json` as needed — change which alias step a
      token points to wherever this theme should diverge from its template. For a night variant,
      this is where 100% of the work happens (re-point to already-darker steps in the unchanged
      palette), not in the alias file above.
- [ ] Apply the `$description` rules (see `token-model.md`) to any token you touch — judge
      "pure scale token" by tier, not by whether the name contains a scale-sounding word
      (`kui-border-radius-30` omits it; `kui-button-border-radius-large` keeps one). **This is
      convention only — no guard checks a theme token's `$description`**, so get it right up
      front.
- [ ] Classify `<new>` in `themes.spec.mjs` — add it to `EXHAUSTIVE_THEMES` or
      `SEMANTIC_ONLY_THEMES` (whichever matches the template you copied). There is no third
      "unchecked" bucket in the code — every theme file on disk must be classified into one of
      these two arrays or the classification guard fails, and **both arrays require every token
      in their tier to be present** — you're editing values in a complete file, not adding a
      sparse one. This is a **single added array entry and nothing else** — don't touch any other
      line in `themes.spec.mjs` (not the other array, not an existing theme's entry, not a test).
- [ ] Before moving on, confirm with `git status`/`git diff` that the only changes so far are the
      two new theme files and this one added line — if anything else changed, you've gone out of
      scope; undo it.

## Build + verify

Run these from the repo root, filtered to the package (or `cd packages/design-tokens` and drop
the `--filter` flag):

```sh
pnpm --filter @kong/design-tokens test    # runs `pretest` (build:tokens) then vitest
pnpm --filter @kong/design-tokens lint
```

`pnpm test`'s `pretest` hook already runs `build:tokens` for you — you don't need to build
separately first.

If tests fail, read the assertion message — the guards in `themes.spec.mjs` name the exact
missing/extra tokens, mismatched descriptions, or off-source colors, so you rarely need to
guess.

**The sandbox does not preview a new theme.** `pnpm --filter @kong/design-tokens sandbox` only
shows the package's base/default token swatches — no theme selector, no per-theme rendering,
regardless of what's in `themes/`. Don't use it (or suggest it) to visually check this theme;
see `SKILL.md` Step 5.5 for the actual verification approach (grepping resolved values in
`dist/themes/<new>.css`, and a real screenshot comparison via a throwaway HTML file if a visual
reference was provided).

- [ ] **Verify the build matches the design brief** (`SKILL.md` Step 5.5) — passing tests/lint
      only proves structural compliance, not that the theme looks like what was asked for. Grep
      the compiled CSS for the key confirmed values, do a screenshot comparison if a visual
      reference exists, and get the user's sign-off on the rendered result before Step 6A/6B.

## Known documentation discrepancies (don't let these confuse you)

- `docs/ALIAS-COLOR-MAPPING-GUIDE.md` links to a companion `COMPONENT-TOKENS-GUIDE.md` — **that
  file does not exist** in the repo. Don't go looking for it; the guide + `README.md` cover what
  you need.
- Some generated file headers and test comments reference a `pnpm build:themes` command —
  **there is no such script**. Theme building happens automatically as part of
  `pnpm build:tokens` (and thus as part of `pnpm test`'s `pretest` hook).
- `README.md` and `docs/ALIAS-COLOR-MAPPING-GUIDE.md` both instruct classifying a new theme into
  "`EXHAUSTIVE_THEMES` / `SEMANTIC_ONLY_THEMES` / `UNCHECKED_THEMES`" — **`UNCHECKED_THEMES`
  does not exist anywhere in `themes.spec.mjs`**, only the first two arrays do (confirmed by
  reading the file). Don't go looking for a third bucket or a way to mark a theme as a
  work-in-progress/draft — classify into one of the two real arrays, or don't classify it at all
  (standalone scaffolds still must be classified during iteration to get real guard feedback,
  but are un-classified again at tear-down).

## Tear-down (standalone / Path B only)

Once you've extracted the final CSS (and optionally JS) output and the user confirms the theme
is finalized, remove every trace of the scaffold so the repo returns to a clean state:

- [ ] Delete `themes/<new>.theme.json`
- [ ] Delete `tokens/alias/color/<new>.alias.json`
- [ ] Remove `<new>` from whichever classification array you added it to in `themes.spec.mjs`
- [ ] Delete the generated `dist/themes/<new>.*` files (css/mjs/cjs/d.ts/d.cts) yourself —
      **verified this does NOT happen automatically**: `build:tokens` only builds
      currently-discovered themes, it never removes stale output for a theme you've since
      deleted from `themes/` (only a full `pnpm build`, which runs `build:clean`/`rimraf` first,
      clears it). `dist/` is gitignored so this won't show up in `git status` either way, but
      leaving it is still stale, invisible residue — delete it explicitly. `dist/themes/index.*`
      (the barrel re-exporting every theme) does self-correct on the next `build:tokens`, since
      it's regenerated from a fresh directory scan each time.
- [ ] If you classified `<new>` under `SEMANTIC_ONLY_THEMES`, also delete
      `__snapshots__/themes/<new>.css` — the golden-snapshot test loops over that array and
      auto-writes a snapshot file for every theme in it (not just `classic-day`/`classic-night`),
      so a scaffold theme leaves one behind too.
- [ ] Re-run `pnpm --filter @kong/design-tokens test` and confirm it's green with no reference
      to `<new>` anywhere (`git status` should show no diff in `packages/design-tokens/`)
