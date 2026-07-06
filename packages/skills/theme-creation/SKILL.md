---
name: theme-creation
description: Use this skill whenever the user wants to create, add, author, or scaffold a new theme for the @kong/design-tokens package — including phrases like "add a new theme", "create a new theme", "make a dark/light theme", "I need a new theme for Kongponents", "a new data-kui-theme", "match this screenshot/mockup", "make our theme look like this site/URL", "here are our brand colors", "port/emulate an existing theme", "make a theme like One Dark Pro", or "match this VS Code/editor/terminal theme". Also use it if the user wants to modify how an existing theme relates to design tokens (semantic vs component tokens, color aliases/palettes) as part of building a new one, or supplies a screenshot, mockup, reference URL, brand guideline, or the name of an existing published theme (editor, terminal, or otherwise) as the basis for a theme's look. Make sure to trigger this even if the user doesn't say "design-tokens", "Style Dictionary", or "theme" explicitly — a request to reskin, rebrand, or restyle the product to match some visual reference, in the context of Kong's design-tokens theming system, should trigger this skill too.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch
---

# Theme Creation

Authors a new theme for `@kong/design-tokens` (a Style Dictionary package: primitive color
palette → semantic tokens → component tokens, guarded by `themes.spec.mjs`). The hard part isn't
the mechanics — bundled scripts handle those deterministically — it's **faithfully matching a
visual identity**: not just colors, but component character (button padding/radius/states, card
elevation, input shape, typography). That judgment work is where your attention goes.

The work splits cleanly, and this skill is built around the split:
- **Mechanical, done by scripts** — scaffolding the theme directory exhaustive-and-empty directly
  from the canonical token tree (no donor theme, no placeholder colors), listing the live token
  set, rendering a real-component preview, tracking what's still unfilled, tearing down. You don't
  hand-do these, so they can't be forgotten or done half-way.
- **Judgment, done by you (with the `frontend-design` skill)** — perceiving the source, deriving a
  cohesive palette + component treatments with taste, and confirming the *rendered* result matches.

All paths assume the working directory is `packages/design-tokens/` unless noted. The scaffold and
unfilled-report commands (`pnpm theme:scaffold`, `pnpm themes:unfilled`) are what this flow uses;
the preview script is `node ../skills/theme-creation/scripts/preview.mjs` (relative to the package
dir). `pnpm themes:sync` exists too, but it's a repo-maintenance command for reconciling *existing*
themes when a token is added to `tokens/source/**`/`tokens/components/**` — out of scope for
creating one new theme (see the Scope guardrail below), so this flow never calls it.

## Scope guardrail

This skill creates exactly **one new theme** and touches only its **two co-located files**:
`themes/<new>/<new>.theme.json` and `themes/<new>/<new>.alias.color.json`. That's the whole
footprint — `themes.spec.mjs` no longer needs editing, because it treats every theme in `themes/`
as exhaustive by default (only `classic-day`/`classic-night` are opted out as semantic-only), so a
new theme is covered by the guards automatically. `theme:scaffold` makes exactly these two files;
`theme:scaffold <name> --teardown` reverts them. Every existing theme/palette file is a read-only
reference. Nothing else is in scope — not `themes.spec.mjs`, `README.md`, `docs/**`, `config.mjs`,
`_manifest.alias.color.json`, other packages — even if it looks helpful; flag it, don't fix it.
Generated `dist/themes/<new>.*` output is expected, not a violation. Before finishing, `git status`
in the repo root: the only source changes should be the two theme files (in-repo path), or nothing
at all (standalone path, after teardown).

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

Kebab-case (`acme-day`, not `AcmeDay`/`acme_day`), and not already present in `themes/`. The
scaffold command enforces both and errors clearly if either fails — but check up front so you don't
walk the user through Step 2.5's design brief before discovering the name is taken.

## Step 2.5 — Gather the design brief

Get concrete design intent before scaffolding — a vague sense produces a "close enough" theme that
misses the request. Establish (from what the user said, or by asking):
- **Light, dark, or a day/night pair, or a single standalone theme** — these are independent
  themes; there is no structural coupling between a "day" and "night" name. A day/night pair is
  just two full themes you choose to author together and (usually, not necessarily) share a
  palette between. Also establish **full theme vs. narrow override** (a handful of tokens → use
  `references/minimal-overrides.md` instead of this flow).
- **The source of the look** — exact brand colors, a screenshot/mockup, a URL to emulate, an
  existing published theme to port (VS Code/editor/terminal — fetch its real source, never
  reconstruct from memory), or verbal direction ("dark, moody, high-contrast"). Any of these is
  real direction.

`references/design-inputs.md` covers *how* to work each source (inspecting screenshots, pulling
real `getComputedStyle` values from a URL, porting a VS Code theme, when to lean on the
**frontend-design** skill). Read it now if the brief is anything beyond an exact hex code. Don't
re-ask for what the user already gave — confirm your reading of it.

## Step 3 — Scaffold (deterministic)

Run the scaffold command. It generates the new theme **directly from the canonical token tree** —
no donor theme copied, no `#FF00FF` placeholder:
- every **semantic** token (`tokens/source/**`) is seeded with its real default value — a safe,
  sensible starting point;
- every **component** token (`tokens/components/**`) is seeded as an **empty slot** for you to fill
  deliberately — a component token's value is a genuine design decision (e.g. an alert's danger
  background is a light tint, not the strong semantic danger color) and can't be safely defaulted;
- the **palette** is seeded from `classic-day`'s real neutral values, so the theme builds, renders,
  and can publish to the preview npm channel immediately.

The result is exhaustive by construction — no classification step, no template to compare against.

```sh
# from packages/design-tokens/
pnpm theme:scaffold <name>
```

This also prints the component-grouped token inventory (re-print anytime with
`pnpm theme:scaffold <name> --inventory`) — use it as the backbone of the Step 3.5 design spec.
`pnpm themes:unfilled <name>` reports every component slot still empty and every palette family
still identical to the seed, so nothing gets forgotten silently.

For a **day/night pair**: scaffold both names independently, author the day theme fully, then —
since dark mode is typically the same palette with a handful of tokens re-pointed to darker
steps (`token-model.md`) — copy the finished day theme's palette into the night theme's
`<name>.alias.color.json` as a starting point, and re-point only the tokens that should change.
This is a convenience, not a requirement: if the user wants genuinely different palettes for day
and night, author each independently.

## Step 3.5 — Write the design spec, and confirm it

Turn the brief + the scaffold's grouped inventory into a short structured spec, **presented in
chat (never written to a repo file)**. This is the artifact Step 4 executes against; writing a
section per dimension forces an explicit decision — including "unchanged" — instead of relying on
remembering what matters this time. Use `references/component-tokens.md` as the mental model.

- **Colors** — always an actively-derived section: background/surface hierarchy, borders,
  supporting hues, status colors, *not* just the one named brand color. A single hex is a
  starting point for a cohesive palette, never a ceiling. (This is the "one button recolored"
  failure mode — a color-only theme reads as the same UI tinted.)
- **Component match (the components the source shows)** — the part that most decides whether it
  *looks like* the source, and the one that's most often gotten wrong. For each key component the
  source shows (especially buttons, cards, input-type elements, badges, alerts, etc.), write a row whose
  right-hand side names *which Kong component + tokens reproduce it*, and whose left-hand side
  covers **both** halves of the treatment — never color alone:
    - *Color*: fill, text, border, and the hover/active/focus/disabled states.
    - *Geometry* (a REQUIRED field on every row, not an afterthought): `border-radius`,
      `border-width`, `padding-x`/`padding-y`, `font-size`, `font-weight`, `line-height` — each set
      to the value you measured (`getComputedStyle`), or the literal word **"unchanged"** if the
      source genuinely matches the template. A row that lists color but leaves geometry blank is an
      incomplete row: a button that is the right color and radius but the wrong padding/weight/size
      still doesn't read as the source (the exact miss that shipped once — color+radius done,
      `--kui-button-padding-*`/`-font-weight`/`-font-size-*` left at Kong's compact defaults).
  **Map by visual equivalence, not by role name**: the source's most prominent call-to-action
  becomes Kong's `primary` button and must reproduce that button's exact treatment — even if its
  color is a bright "accent-looking" one — see `component-tokens.md` "Match the source's components
  — don't recolor by role name" for the gold-pill failure this rule prevents. Set both the component
  token and its semantic fallback so it renders on whatever Kongponents version the user runs (also
  in `component-tokens.md`).
- **System propagation (every other component the source does NOT show)** — a REQUIRED spec
  section, not optional breadth. The scaffold inventory lists ~100 component groups; a source shows
  a handful. Every remaining family must carry the **same brand character** you just established,
  *derived* from what the source did let you determine — not left at Kong's defaults (a theme whose
  buttons are on-brand but whose checkboxes, switches, inputs, and cards are still Kong-gray reads
  as half-finished). Walk the inventory family by family and give each a derived treatment or an
  explicit "neutral — unchanged"; no family left un-considered. `component-tokens.md` "Propagate the
  brand across the whole component system" is the how — the derivation rules (brand hue → all "on"
  states, roundedness, focus rings, density) and which families to cover.
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

1. **`themes/<new>/<new>.alias.color.json`** — replace the seeded classic-day values with the
   theme's real palette. Keep the exact key set; set each changed `$description` to
   `"Alias for <VALUE>."` exactly (this one *is* guard-checked). Run
   `pnpm themes:unfilled <name>` to see which families are still unchanged from the seed — nothing
   should be left unintentionally identical to classic-day's neutrals. (Skip for a night variant —
   use the day theme's finished palette per Step 3.)
2. **`themes/<new>/<new>.theme.json`** — set values across every dimension the spec addressed:
   - *Color tokens* (`{color.alias.*}` refs): point each at the step whose role/contrast fits
     *this* palette — the scaffolded value is `tokens/source`'s shared default mapping, not a
     decision specific to this theme; don't just keep it unexamined.
   - *Component match*: for each component-match row in the spec, set the component tokens **and**
     the semantic tokens they fall back to (per `component-tokens.md`) so the treatment renders on
     whatever Kongponents version the user runs. Set the **geometry** tokens alongside the color
     ones — for a button that means `--kui-button-padding-x/y-*`, `-border-radius-*`,
     `-font-weight`, `-font-size-*`, `-line-height-*`, not just the color tokens; the primary
     button's fill/text/border **and** radius/padding/weight/size must reproduce the source's
     primary CTA. The scaffold inventory grouped these by component so you can do one component at
     a time. `pnpm themes:unfilled <name>` lists every component slot still empty — work it down to
     zero (or a deliberate "neutral — unchanged" you've accounted for in the spec).
   - *System propagation*: work the "every other component" spec section too — set the
     selected/checked/active fills, focus rings, radii, and densities of the unshown component
     families to the derived brand values (per `component-tokens.md` "Propagate the brand across
     the whole component system"). A theme whose buttons are branded but whose checkboxes/switches/
     inputs/cards are still Kong-default is not finished.
   - *Literal tokens* (radius, shadow, padding, font-family, etc.): set the ones the spec called
     for. Typeface change = global find/replace of the one font-stack string across all
     `-font-family` tokens.
   - *Literal colors you introduce* (focus rings, overlays, shadows) must derive from the new
     palette (exact palette channels — see `component-tokens.md`). For a literal hex or numeric
     `rgb()`/`rgba()`, the off-source-color guard rejects an off-palette value at build time — but
     it does **not** parse `color-mix()`, `hsl()`, or CSS color keywords, so a `color-mix()` shadow
     specifically needs the same care without that safety net (see `token-model.md` "Other
     invariants" for exactly what the guard does and doesn't catch).
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
   install. (Its own generated files land in `packages/skills/theme-creation-workspace/preview/`,
   which is gitignored — you don't need to clean those up.) Navigate a browser tool to the printed
   `http://localhost:<port>/index.html`, screenshot it **to a path outside the repo entirely**
   (e.g. your scratch/tmp directory) — a screenshot saved anywhere inside the repo tree, even a
   gitignored one, is still a scope leak an agent should avoid creating — and view it next to the
   source.

   **Preview against the Kongponents version the user actually runs.** A version only consumes the
   tokens *it* was built to read — a published version may read only the semantic fallback, so
   component tokens (button radius/padding, per-appearance colors, etc.) won't show and a correct
   theme looks under-changed. Observed concretely: the published `latest` consumes **none** of the
   `--kui-button-*` component tokens — not geometry (`-padding-*`/`-border-radius-*`/`-font-*`) and
   not per-appearance colors (`-secondary`/`-tertiary`) — it hardcodes button geometry and derives
   secondary/tertiary from the primary semantic tier. So a two-tone brand or a distinct button
   density **cannot be verified on `latest`**; you must preview against the build that consumes the
   component tokens. Set both tiers (Step 3.5) so it renders on either, and pass
   `--kongponents <version|tag>` (or `--kongponents-css`/`--kongponents-esm` for a PR/canary build)
   to match the target — ask the user which build they run if you don't know. If the source's
   component character isn't showing, first rule out version skew — don't "fix" a theme that's
   already right — but don't hide behind it either: if the target version consumes the tokens and
   it still doesn't match, the theme is wrong.

   **Acceptance bar — this is the check the whole skill exists for.** Put the themed panel next to
   the source and compare the key components directly, component by component: does the themed
   **primary button** match the source's primary CTA in fill, text color, border, **and geometry**
   (radius, padding, font-weight, font-size)? Confirm geometry by reading it back with
   `getComputedStyle` on the themed component — a px-for-px check, not an eyeball — because a
   wrong-density button is easy to miss visually at a glance. Secondary/tertiary/danger buttons?
   Card surface and elevation? Inputs? Then check the **propagated** components the source never
   showed — checkbox/radio/switch checked fills, input focus rings, selected tabs/rows — do they
   carry the brand, or are they still Kong-gray? A "close enough" that leaves the most visible
   component visibly unlike the source (wrong color, wrong shape, wrong density), or that leaves
   whole component families un-branded, is **not done**, not a rendering caveat. Name each mismatch
   and go back to Step 3.5/4 to fix it (re-map the role, set the missing tier, set the geometry,
   propagate the brand).

**Get the user's sign-off on the rendered result** (the screenshots + grep), not just the planned
spec, before calling it done. If no browser tool is available, restate the confirmed values —
color *and* component/typography, component by component against the source — and have the user
preview the CSS themselves; don't declare victory on guards alone.

**A good preview does not prove completeness.** An unfilled component token compiles to nothing at
all (never `--x: ;` or `--x: initial;`), so it falls through to its semantic default exactly as
gracefully as a *deliberately* unbranded family would — the preview can't tell those two cases
apart. Run `pnpm themes:unfilled <name>` before calling it done; it's the only check that actually
distinguishes "still empty" from "intentionally at the default."

## Step 6A — In-repo: done

`git status` should show exactly the new `themes/<new>/` directory (its two files) — commit those
(no `themes.spec.mjs` change; it classifies the new theme as exhaustive automatically).
`dist/themes/<new>.*` regenerates on build; nothing to extract. **No `kong-konnect/portal`
override is needed for a theme created by this skill** — that concern applies *only* to changes to
`classic-day`/`classic-night`.

## Step 6B — Standalone: extract, then tear down

1. **Iterate** on Steps 4–5.5 with the user until the preview looks right.
2. **Extract** the deliverable: `dist/themes/<new>.css` (a self-contained
   `@layer kui.theme { [data-kui-theme="<new>"] {…} }` block; also `.mjs`/`.cjs`/`.d.ts` if they
   want the JS object). Ask where to copy it. Verify it's fully resolved — no `{color.alias…}`,
   no `var(--kui-color-alias…)`, no `: undefined;`; if any appear, rebuild before handing off.
3. **Tear down** — leave the repo exactly as it started:
   ```sh
   pnpm theme:scaffold <name> --teardown
   pnpm --filter @kong/design-tokens test   # confirm green
   ```
   Then `git status` — no lingering diff in `packages/design-tokens/`.
