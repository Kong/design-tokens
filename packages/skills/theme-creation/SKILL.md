---
name: theme-creation
description: Use this skill whenever the user wants to create, add, author, or scaffold a new theme for the @kong/design-tokens package — including phrases like "add a new theme", "create a theme like konnect-day", "make a dark/light variant", "I need a brand theme for a customer", "a new data-kui-theme", "I need a standalone theme CSS file for another app", "match this screenshot/mockup", "make our theme look like this site/URL", "here are our brand colors", "port/emulate an existing theme", "make a theme like One Dark Pro", or "match this VS Code/editor/terminal theme". Also use it if the user wants to modify how an existing theme relates to tokens (semantic vs component tokens, color aliases/palettes) as part of building a new one, or supplies a screenshot, mockup, reference URL, brand guideline, or the name of an existing published theme (editor, terminal, or otherwise) as the basis for a theme's look. Make sure to trigger this even if the user doesn't say "design-tokens", "Style Dictionary", or "theme" explicitly — a request to reskin, rebrand, or restyle the product to match some visual reference, in the context of Kong's design-tokens theming system, should trigger this skill too.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch
---

# Theme Creation

Authors a new theme for `@kong/design-tokens` (a Style Dictionary package: primitive color
palette → semantic tokens → component tokens, guarded by `themes.spec.mjs`). The hard part isn't
the mechanics — bundled scripts handle those deterministically — it's **faithfully matching a
visual identity**: not just colors, but component character (button padding/radius/states, card
elevation, input shape, typography). That judgment work is where your attention goes.

The work splits cleanly, and this skill is built around the split:
- **Mechanical, done by scripts** — scaffolding the two files complete-and-empty, classifying,
  listing the live token set, rendering a real-component preview, tearing down. You don't hand-do
  these, so they can't be forgotten or done half-way.
- **Judgment, done by you (with the `frontend-design` skill)** — perceiving the source, deriving a
  cohesive palette + component treatments with taste, and confirming the *rendered* result matches.

All paths assume the working directory is `packages/design-tokens/` unless noted. Script paths
below are relative to this skill (`../skills/theme-creation/scripts/...` from the package dir).

## Scope guardrail

This skill creates exactly **one new theme** and touches only:
- `themes/<new>.theme.json` and `tokens/alias/color/<new>.alias.json` (the theme's two files), and
- one added line in `themes.spec.mjs`'s `EXHAUSTIVE_THEMES` array.

`scaffold.mjs` makes and reverts exactly these changes; you don't edit `themes.spec.mjs` by hand.
Every existing theme/palette file is a read-only reference. Nothing else is in scope — not
`README.md`, `docs/**`, `config.mjs`, `_manifest.json`, other packages — even if it looks helpful;
flag it, don't fix it. Generated `dist/themes/<new>.*` output is expected, not a violation. Before
finishing, `git status` in the repo root: the only source changes should be the two theme files +
one `EXHAUSTIVE_THEMES` line (in-repo path), or nothing at all (standalone path, after teardown).

## Step 0 — Read first

Skim these before building a mental model from memory — the guards are the real spec:
- `packages/design-tokens/README.md` §"Token Tiers", §"Themes", §"Creating a new theme"
- `references/token-model.md` — condensed tier model + guard behavior
- `references/component-tokens.md` — **how to theme component visual identity with taste** (read
  this whenever the goal is matching a real look, not just recoloring)
- `references/design-inputs.md` — how to work from a screenshot, URL, ported theme, or verbal brief
- `references/authoring-checklist.md` — linear checklist + known repo-doc discrepancies
- `references/minimal-overrides.md` — read *instead* of Steps 3–6 when the user wants only a
  handful of tokens changed, not a full theme

## Step 1 — Ask: in-repo or standalone?

Don't guess:
1. **In-repo** — the theme's files are committed into `packages/design-tokens/`, shipping as part
   of the package (a new officially-supported theme).
2. **Standalone** — the user just wants a `dist/themes/<name>.css` file for some *other* app;
   nothing survives in this repo (scaffold now, tear down at the end).

If unclear, ask: "Committed into the design-tokens repo, or a standalone CSS file for another app?"

## Step 2 — Validate the name

Kebab-case (`acme-day`, not `AcmeDay`/`acme_day`), and not already present in `themes/`. If either
fails, ask for a different name — don't rename silently or clobber an existing theme.

## Step 2.5 — Gather the design brief

Get concrete design intent before scaffolding — a vague sense produces a "close enough" theme that
misses the request. Establish (from what the user said, or by asking):
- **Light, dark, or a day/night pair**, and **full theme vs. narrow override** (a handful of
  tokens → use `references/minimal-overrides.md` instead of this flow).
- **The source of the look** — exact brand colors, a screenshot/mockup, a URL to emulate, an
  existing published theme to port (VS Code/editor/terminal — fetch its real source, never
  reconstruct from memory), or verbal direction ("dark, moody, high-contrast"). Any of these is
  real direction.

`references/design-inputs.md` covers *how* to work each source (inspecting screenshots, pulling
real `getComputedStyle` values from a URL, porting a VS Code theme, when to lean on the
**frontend-design** skill). Read it now if the brief is anything beyond an exact hex code. Don't
re-ask for what the user already gave — confirm your reading of it.

## Step 3 — Scaffold (deterministic)

Run the scaffold script. It copies `konnect-day`/`konnect-night` (the **exhaustive** structural
template — every component token present; this skill only ever builds exhaustive themes) for
structure, generates a fresh palette file with obvious `#FF00FF` placeholders (so no template
color can silently leak in and an unfinished theme renders screaming magenta), adds the
`EXHAUSTIVE_THEMES` classification, and prints a component-grouped inventory of every themeable
token plus the literal-color tokens you'll need to re-express:

```sh
# from packages/design-tokens/  (add --from konnect-night for a dark theme)
node ../skills/theme-creation/scripts/scaffold.mjs <name> [--from konnect-day|konnect-night]
```

The template is a **structural donor only** — its token key set and re-point *relationships*, not
its values. The palette starts as placeholders precisely so you derive real values rather than
inherit Kong's. (One exception: if the user explicitly asked to *literally reuse* a specific
theme's values — "base the palette on konnect-day but shift to slate" — read that theme's
`.alias.json` as a design input in Step 4. Still scaffold from `konnect-*`; "feels like X" is
verbal direction, not literal reuse — see `design-inputs.md`.)

For a **day/night pair**: scaffold the day theme, author it fully, then scaffold the night
variant and copy *the new day theme's* finished palette into it (not the template's) — the
day/night difference is 100% token re-points to darker steps, per `token-model.md`.

## Step 3.5 — Write the design spec, and confirm it

Turn the brief + the scaffold's grouped inventory into a short structured spec, **presented in
chat (never written to a repo file)**. This is the artifact Step 4 executes against; writing a
section per dimension forces an explicit decision — including "unchanged" — instead of relying on
remembering what matters this time. Use `references/component-tokens.md` as the mental model.

- **Colors** — always an actively-derived section: background/surface hierarchy, borders,
  supporting hues, status colors, *not* just the one named brand color. A single hex is a
  starting point for a cohesive palette, never a ceiling. (This is the "one button recolored"
  failure mode — a color-only theme reads as the same UI tinted.)
- **Component match** — the part that most decides whether it *looks like* the source, and the
  one that's most often gotten wrong. For each key component the source shows (primary button,
  secondary button, card, input, badge/alert), write a row: *what the source's element looks like*
  (fill, text color, border, radius, padding, states) → *which Kong component + tokens reproduce
  it*. **Map by visual equivalence, not by role name**: the source's most prominent call-to-action
  becomes Kong's `primary` button and must reproduce that button's exact treatment — even if its
  color is a bright "accent-looking" one. (The real miss to avoid: a site whose signature CTA is a
  gold pill routed to navy because "navy is the brand color," producing buttons that look nothing
  like the site. See `component-tokens.md` — "Match the source's components, don't recolor by role
  name.") Set both the component token and its semantic fallback so it renders on whatever
  Kongponents version the user runs (also in `component-tokens.md`).
- **Typography, radius, shadow, spacing** — a section where the source shows a direction; mark
  "unchanged from the template" explicitly where it doesn't. Inventing a type scale or radius from
  nothing isn't breadth, it's fabrication — but leaving a distinctive one unmatched is the miss.
- If something the user described **can't** be expressed as a token value (a typewriter animation,
  ASCII art — that's component code, out of scope), say so; don't fabricate a token or drop it.

**Confirm the spec with the user before Step 4.** A build cycle is cheap to repeat; redoing a
wrong direction across dozens of tokens is not. Lean on **frontend-design** for the aesthetic
calls (deriving a palette from one hex, matching a "vibe," state derivation, contrast).

## Step 4 — Fill in the values

The files already exist and are complete; now set values per the confirmed spec.

1. **`tokens/alias/color/<new>.alias.json`** — replace every `#FF00FF` placeholder with the real
   palette value. Nothing should stay magenta. Keep the exact key set; set each changed
   `$description` to `"Alias for <VALUE>."` exactly (this one *is* guard-checked). (Skip for a
   night variant — use the day theme's finished palette per Step 3.)
2. **`themes/<new>.theme.json`** — set values across every dimension the spec addressed:
   - *Color tokens* (`{color.alias.*}` refs): point each at the step whose role/contrast fits
     *this* palette; don't just keep the template's choices.
   - *Component match*: for each component-match row in the spec, set the component tokens **and**
     the semantic tokens they fall back to (per `component-tokens.md`) so the treatment renders on
     whatever Kongponents version the user runs — the primary button's fill/text/border/radius/
     padding must reproduce the source's primary CTA. The scaffold inventory grouped these by
     component so you can do one component at a time.
   - *Literal tokens* (radius, shadow, padding, font-family, etc.): set the ones the spec called
     for. Typeface change = global find/replace of the one font-stack string across all
     `-font-family` tokens.
   - *Literal-color tokens* the scaffold flagged (focus rings, overlays, `color-mix` shadows):
     re-express against the new palette (exact palette channels — see `component-tokens.md`), or
     the off-source-color guard rejects the build.
   - Follow the `$description` rules in `token-model.md` (nothing guards theme-token descriptions,
     so get them right up front).

## Step 5 — Build

```sh
pnpm --filter @kong/design-tokens test    # pretest runs build:tokens; runs the guards
pnpm --filter @kong/design-tokens lint
```

A failing guard names the exact problem (missing/extra token, stale `$description`, off-source
color) — fix that specific thing. Note: the package sandbox (`pnpm sandbox`) does **not** render
themes; use Step 5.5's preview instead.

## Step 5.5 — Preview and verify against the source

Structural pass (guards green) ≠ *looks right*. Close the gap with two checks:

1. **Grep the compiled values** for what mattered most in the spec — color *and* non-color:
   ```sh
   grep -in -- "--kui-color-background-primary:" dist/themes/<new>.css
   grep -in -- "--kui-button-border-radius-medium:" dist/themes/<new>.css   # etc. per spec
   ```
   Catches a token pointed at the wrong on-palette step, or a spec'd category left at the default.

2. **Render real components under the theme and compare.** This is the check that actually proves
   fidelity, and it now works reliably:
   ```sh
   node ../skills/theme-creation/scripts/preview.mjs <name> [--port 8747] [--kongponents <ver>]
   ```
   It serves a side-by-side **default vs. themed** gallery of real `@kong/kongponents` components
   (buttons in every state, cards, inputs, select, tabs, table, alerts) loaded from a CDN — no
   install. Navigate a browser tool to the printed `http://localhost:<port>/index.html`, screenshot
   it **to an absolute path outside the repo** (e.g. the skill workspace — a screenshot written to
   the repo root is a scope leak), and view it next to the source.

   **Preview against the Kongponents version the user actually runs.** A version only consumes the
   tokens *it* was built to read — a published version may read only the semantic fallback, so
   component tokens (button radius/padding, etc.) won't show and a correct theme looks
   under-changed. Set both tiers (Step 3.5) so it renders either way, and pass
   `--kongponents <version|tag>` (or `--kongponents-css`/`--kongponents-esm` for a PR/canary build)
   to match the target. If the source's component character isn't showing, first rule out version
   skew — don't "fix" a theme that's already right — but don't hide behind it either: if the target
   version consumes the tokens and it still doesn't match, the theme is wrong.

   **Acceptance bar — this is the check the whole skill exists for.** Put the themed panel next to
   the source and compare the key components directly, component by component: does the themed
   **primary button** match the source's primary CTA in fill, text color, border, radius, and
   padding? Secondary/tertiary/danger buttons? Card surface and elevation? Inputs? A "close enough"
   that leaves the most visible component (usually the primary button) visibly unlike the
   source — wrong color, wrong shape — is **not done**, not a rendering caveat. Name each mismatch
   and go back to Step 3.5/4 to fix it (re-map the role, set the missing tier, correct the value).

**Get the user's sign-off on the rendered result** (the screenshots + grep), not just the planned
spec, before calling it done. If no browser tool is available, restate the confirmed values —
color *and* component/typography, component by component against the source — and have the user
preview the CSS themselves; don't declare victory on guards alone.

## Step 6A — In-repo: done

`git status` should show exactly the two new files + one `EXHAUSTIVE_THEMES` line — commit those.
`dist/themes/<new>.*` regenerates on build; nothing to extract. Flag to the user: if the theme
changes `primary`/`accent` colors, the `kong-konnect/portal` customization plugin may need a
matching override (outside this skill's scope, but worth knowing).

## Step 6B — Standalone: extract, then tear down

1. **Iterate** on Steps 4–5.5 with the user until the preview looks right.
2. **Extract** the deliverable: `dist/themes/<new>.css` (a self-contained
   `@layer kui.theme { [data-kui-theme="<new>"] {…} }` block; also `.mjs`/`.cjs`/`.d.ts` if they
   want the JS object). Ask where to copy it. Verify it's fully resolved — no `{color.alias…}`,
   no `var(--kui-color-alias…)`, no `: undefined;`; if any appear, rebuild before handing off.
3. **Tear down** — leave the repo exactly as it started:
   ```sh
   node ../skills/theme-creation/scripts/scaffold.mjs <name> --teardown
   pnpm --filter @kong/design-tokens test   # confirm green
   ```
   Then `git status` — no lingering diff in `packages/design-tokens/`.
