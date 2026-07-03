# Token model — condensed reference

This is a self-contained recap of how tokens and themes fit together in
`packages/design-tokens/`, so you can work even before reading the full repo docs. Each section
points to the authoritative source — read that source before making a change you're unsure
about, since this file is a summary, not the spec.

Authoritative sources (in the `packages/design-tokens/` directory):
- `README.md` — §"Token Tiers", §"Themes", §"Creating a new theme", §"Theme `$description`
  authoring rules"
- `docs/ALIAS-COLOR-MAPPING-GUIDE.md` — the deep dive on color palettes and theme mechanics
- `themes.spec.mjs` — the guards that actually enforce all of this (read it to see exactly what
  will fail and why)

## The three tiers

```
primitive alias palette   →   semantic tokens         →   component tokens
tokens/alias/color/**         tokens/source/**             tokens/components/**
(hex values, per-theme)       ({color.alias.*} refs)       (names only, $value: "")
never exported                exported to CSS/SCSS/JS      override slots, no CSS value
```

1. **Alias tokens** (`tokens/alias/color/<theme>.alias.json`) hold raw hex values behind a
   standardized set of names, e.g. `color.alias.gray.60 = "#..."`. They're never emitted as
   `--kui-*` custom properties — they only exist so Style Dictionary can resolve references at
   build time.
2. **Semantic tokens** (`tokens/source/**`) have concrete values that reference an alias, e.g.
   `kui-color-background-primary = {color.alias.gray.70}`. These are exported to every format
   (CSS, SCSS, JS/TS, JSON). Includes both "scale" tokens (`--kui-color-*`, `--kui-space-*`,
   `--kui-border-radius-*`) and "concept" tokens (`--kui-method-*`, `--kui-status-*`,
   `--kui-navigation-*`, `--kui-icon-*`) — concept tokens are still semantic, not component,
   even though they're consumed inside components.
3. **Component tokens** (`tokens/components/**`) are declared with `$value: ""` — pure,
   value-less override slots. Every Kongponent references its component token first, falling
   through to the semantic default via `var()`:
   ```scss
   border-radius: var(--kui-button-border-radius-medium, var(--kui-border-radius-30, $kui-border-radius-30));
   ```
   A theme that never sets a component token renders byte-identical to the un-themed default.

## What a theme actually is

A theme = **two files sharing a base name**:

| File | Role |
|---|---|
| `themes/<name>.theme.json` | Flat map of `--kui-*` token → `{ $value, $description }`. Values are literal (scale tokens) or reference a standardized alias step (color tokens), e.g. `"{color.alias.electric_lime.60}"`. |
| `tokens/alias/color/<name>.alias.json` | The theme's color **palette** — maps every standardized alias step to a concrete hex value for this theme. |

Two themes can share token→step mappings but differ in palette (different colors behind the
same step names), or share a palette but differ in which steps tokens point to (that's how
`classic-day`/`classic-night` differ — see below). The `.theme.json` file says *which step*;
the `.alias.json` file says *what hex that step is* for this theme.

Both filename suffixes are **enforced literally** by the build and by `themes.spec.mjs` — a
`.json` in `themes/` not ending in `.theme.json` (and not `_`-prefixed) is a hard build error; a
theme that references `{color.alias.*}` with no matching `<name>.alias.json` also hard-errors
(no silent fallback).

## Theme classes

Declared explicitly in `themes.spec.mjs` — not derivable from the filename:

- **`EXHAUSTIVE_THEMES`** (`konnect-day`, `konnect-night`): must contain **exactly**
  `KUI_THEMEABLE_TOKENS` — every semantic token *and* every component token. Nothing missing,
  nothing extra.
- **`SEMANTIC_ONLY_THEMES`** (`classic-day`, `classic-night`): must contain every semantic
  token and **zero** component tokens. Components fall through to their semantic default.

These two are described symmetrically above purely as *what each class technically requires* —
that is **not** the same as saying a new theme should be authored by weighing the two options.
**When actually authoring a new theme, exhaustive is the default and is not a decision to make
with the user**; semantic-only is reserved for a theme the user explicitly asked to have
components fall through to semantic defaults. See `SKILL.md` Step 3 for the full rule — this
section only documents what each class technically enforces, not which one to pick.

There is no third "unchecked" bucket in the actual code — every theme file on disk must land in
exactly one of these two arrays or the classification guard fails the build.

`classic-day` is the default look (identical to the un-themed `:root` export — the main build
in `config.mjs` resolves against `classic-day.alias.json`). `classic-night` is its dark
counterpart: an **identical palette** to `classic-day`, with ~20 text/border/background tokens
in the theme file re-pointed to darker alias steps. Dark mode here is a *semantic re-point*, not
a new set of colors — prefer that pattern for day/night pairs over inventing new palette values.

This isn't unique to the semantic-only pair: verified directly against the repo's own files,
`konnect-day.alias.json` and `konnect-night.alias.json` are likewise byte-identical — the
exhaustive class follows the same day/night convention (re-point `.theme.json` tokens, keep the
`.alias.json` palette unchanged) even though it isn't called out separately in
`docs/ALIAS-COLOR-MAPPING-GUIDE.md`, which only narrates the `classic-*` pair explicitly.

## The standardized alias step set

Defined by `tokens/alias/color/_manifest.json` — **names only**, no values. 13 groups / 113
keys total:

- Stepped families (11 steps each: `05, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`): `aqua`,
  `blue`, `electric_lime` (underscore, not hyphen), `gray`, `green`, `orange`, `pink`, `purple`,
  `red`, `yellow`.
- Direct-value singletons (no steps): `black`, `white`, `transparent`.

Every palette file must contain **exactly** this key set — no missing, no extra (the "manifest
drift" guard). Adding a wholly new color family or step requires updating `_manifest.json` *and*
every existing palette, which is out of scope for "add a new theme" — a new theme reuses the
existing step set with new values.

### Mapping a design input onto the palette

Once you have a concrete color (from a hex code, a screenshot estimate, a `getComputedStyle`
read, or a value pulled from a ported theme's source — see `design-inputs.md`), you're
choosing a **family** and a **step** within that family's
existing 11-step ramp (or a singleton), not inventing a new key. This applies just as much to
the palette file you copied as a Step 3 template: its shipped values are a structural
placeholder, not a source for this section's family/step decisions (see `SKILL.md` Step 3) —
every value below should trace back to the design brief, not to whatever the template already
had at that key.

- **Pick the family by hue category**, not by which family a competing theme happens to use for
  a similar purpose. The family names (`blue`, `red`, `green`, `orange`, etc.) are just labels,
  but semantic tokens that mean something conceptually (e.g. an "info" or "link" color usually
  resolving to a `blue.*` step, a "danger" color to `red.*`) read as broken if a theme repoints
  them to a wildly different hue family — nothing in the guards stops you from putting a bright
  pink hex under the `gray` family, but doing so would make every semantic token built on `gray`
  look wrong for reasons that aren't obvious from the code. If a brand's exact hue doesn't match
  any family cleanly (e.g. a teal that's between `aqua` and `green`), pick whichever family the
  theme's *other* uses of that hue-region already lean toward, and don't worry about a literal
  name/hue mismatch beyond that.
- **Pick the step by lightness/contrast role, not by copying a step number from another theme.**
  Steps run light (`05`) to dark (`100`) within a family; the right step for, say, a primary
  button background is whichever value gives you the contrast/prominence that role needs in
  *this* theme's context — a brand's "primary blue" might land at `blue.60` in one palette and
  `blue.70` in another depending on what else that palette's `blue` family looks like.
- **You may need to derive several related steps**, not just the one exact brand hex, if the
  theme is exhaustive (many tokens across many steps of the same family) or if you want a
  believable full ramp (e.g. hover/active states one step darker/lighter than the base). Keep
  the ramp visually consistent — evenly spaced lightness/saturation, not just the one exact value
  the user gave you with arbitrary neighbors.
- **Contrast is not guarded.** Nothing in `themes.spec.mjs` checks text/background contrast
  ratios — the guards only check completeness, description accuracy, and off-source colors (and
  only for the color formats they can pattern-match; see below). If accessibility matters for
  this theme (it usually does), verify contrast yourself — visually, or by calculating it — for
  any text/background pairing you introduce.

## Palette value rules

- `$value`: uppercase 6-digit hex (`#FFFFFF`), or the literal string `transparent` for that one
  singleton.
- `$description`: **always** `"Alias for <VALUE>."`, derived mechanically from the value — never
  hand-written, never omitted. The guard compares it exactly.

## `$description` rules for theme token files

**Unlike the palette's `$description` (which is guard-checked — see above), nothing in
`themes.spec.mjs` verifies a theme token's `$description`.** These rules are convention, not
enforced by any test — get them right the first time rather than counting on `pnpm test` to
catch a mistake here:

- If present, must **match the semantic token's description** from `tokens/source/**` — don't
  invent new wording for the same concept.
- Must be **value-agnostic** — describe what the token controls, never what value it holds
  right now (no colors, no pixel values, no step names in the text).
- **Omit entirely** for pure scale tokens (`--kui-space-*`, `--kui-border-radius-0`…`-50`,
  `--kui-border-width-*`, `--kui-icon-size-*`, `--kui-line-height-*`, `--kui-letter-spacing-*`)
  — the name already carries the meaning. Judge this by **tier, not by substring** — a token
  name containing a scale-sounding word isn't necessarily a bare scale token:
  `kui-border-radius-30` omits `$description`, but `kui-button-border-radius-large` (a
  component token) and `kui-alert-border-radius` (a concept token) both keep one in the real
  theme files, because their meaning isn't fully carried by the name alone once it's scoped to
  a specific component or concept.
- Component tokens set in a theme file may carry `$description` too; copy it from the token's
  definition in `tokens/components/**`.

## Other invariants worth knowing before you start

- **"No off-source colors" — guard coverage is narrower than the invariant's name suggests.**
  Every color a compiled theme renders should trace back to a step in *that theme's own*
  palette, including colors embedded in composite `box-shadow` / `rgba()` values — but the
  actual guard (`themes.spec.mjs`) only pattern-matches literal `#hex` codes and numeric
  `rgba()`/`rgb()` triples. It does **not** catch `hsl()`/`hsla()`, CSS color keywords (`white`,
  `red`, etc.), or non-numeric `color-mix()` expressions — those would silently pass even if
  off-palette. Stick to `{color.alias.*}` references or literal hex/`rgba()` values built from a
  real palette value so the guard can actually verify what you wrote; don't treat a passing
  `pnpm test` as proof an `hsl()` or keyword color is on-palette.
- **Breakpoints are build-injected, never authored.** `platforms/themes.mjs` injects the 5
  canonical `kui-breakpoint-*` tokens into every theme at build time. Don't add them to a
  `.theme.json` file yourself — the drift guard excludes them from what it expects you to have
  written, and CSS custom properties can't be used inside `@media` anyway, so a theme cannot
  override responsive behavior.
- **`primary` and `accent` colors carry Kong-branded defaults.** `--kui-color-*-primary` and
  `--kui-color-*-accent` tokens ship a Kong brand color so the Kong Konnect Dev Portal (a
  customer-branded surface) doesn't leak Kong's brand unless overridden. If a new theme changes
  these, or you're adding a similar brand-derived token, flag that the
  `kong-konnect/portal` customization plugin may need a matching override — this skill doesn't
  touch that repo, but the person merging the theme should know.
- **Every classified theme file must define its FULL token set — not just the tokens it
  changes.** This is easy to get backwards: the repo's README describes theme authoring in terms
  of "override" semantics, but the actual guards in `themes.spec.mjs` require
  `EXHAUSTIVE_THEMES` to contain exactly every themeable token and `SEMANTIC_ONLY_THEMES` to
  contain every semantic token — nothing may be missing, in either bucket. In practice this is
  handled for you: copying a same-class template in Step 4 gives you a complete file, and you
  only *edit* the subset of values that should differ. Don't interpret "you only need to change
  what differs" as "you may omit what doesn't differ" — a theme file with tokens missing (rather
  than present but unchanged) fails the drift guard. The `[data-kui-theme]` CSS cascade / `var()`
  fallback behavior described elsewhere in this doc governs runtime behavior for *component*
  tokens (which are legitimately absent from semantic-only themes) and for genuinely
  hand-authored partial CSS outside this guarded pipeline (see the skill's "Minimal/partial
  overrides" section) — not for a semantic or exhaustive theme file's own completeness.
