---
name: theme-creation
description: Use this skill whenever the user wants to create, add, author, or scaffold a new theme for the @kong/design-tokens package — including phrases like "add a new theme", "create a theme like konnect-day", "make a dark/light variant", "I need a brand theme for a customer", "a new data-kui-theme", "I need a standalone theme CSS file for another app", "match this screenshot/mockup", "make our theme look like this site/URL", "here are our brand colors", "port/emulate an existing theme", "make a theme like One Dark Pro", or "match this VS Code/editor/terminal theme". Also use it if the user wants to modify how an existing theme relates to tokens (semantic vs component tokens, color aliases/palettes) as part of building a new one, or supplies a screenshot, mockup, reference URL, brand guideline, or the name of an existing published theme (editor, terminal, or otherwise) as the basis for a theme's look. Make sure to trigger this even if the user doesn't say "design-tokens", "Style Dictionary", or "theme" explicitly — a request to reskin, rebrand, or restyle the product to match some visual reference, in the context of Kong's design-tokens theming system, should trigger this skill too.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch
---

# Theme Creation

This skill authors a new theme for `@kong/design-tokens` — a Style Dictionary package with a
strict three-tier token pipeline (primitive color palette → semantic tokens → component
tokens) and several automated consistency guards. Getting a theme right by hand is easy to get
subtly wrong (a missed token, a stale description, a color that doesn't trace back to the
theme's own palette); the guards catch these, but it's much faster to follow the grain of the
system than to fight the guards after the fact.

All paths below assume a working directory of `packages/design-tokens/` inside the
`design-tokens` monorepo, unless noted otherwise.

## Scope guardrail — read this before touching any file

This skill creates exactly **one new theme**. It never modifies an existing theme, an existing
palette, or any other file in the repo, with one narrow, explicit exception. Concretely:

- **Only ever create or edit `themes/<new>.theme.json` and `tokens/alias/color/<new>.alias.json`**
  — the two files belonging to the theme you were asked to create. Every existing theme/palette
  file (`konnect-day.theme.json`, `classic-day.alias.json`, etc.) is a **copy source only** — read
  it, `cp` from it, never write to it. If you find yourself about to edit an existing theme or
  palette file (including to "fix" something you notice while copying it), stop — that's outside
  this skill's scope. Say so and ask the user, don't do it silently.
- **The one narrow exception**: `themes.spec.mjs` requires a **single-line, additive edit** —
  appending `'<new>'` to exactly one of `EXHAUSTIVE_THEMES` or `SEMANTIC_ONLY_THEMES` (Step 4.5).
  Touch nothing else in that file: not the other array, not an existing entry, not any other
  test. This edit is required purely to *register* the new theme with the guards — it's
  instrumentation for the theme you're building, not a general-purpose edit.
- **No other repo file is in scope** — not `README.md`, not `docs/**`, not `config.mjs`, not
  `platforms/**`, not `_manifest.json`, not `package.json`, not any other package in the
  monorepo. Even something that looks helpful (documenting the new theme in the README, adding a
  changelog entry, "fixing" an unrelated doc discrepancy you noticed along the way — including
  the ones this skill itself calls out in `references/authoring-checklist.md`) is out of scope
  unless the user explicitly asks for it separately. Flag anything you notice; don't fix it here.
- **Generated build/test artifacts are expected, not a violation.** Running the build and test
  suite (Step 5) will produce `dist/themes/<new>.*` and, if you classified the theme under
  `SEMANTIC_ONLY_THEMES`, a golden snapshot at `__snapshots__/themes/<new>.css`. These are the new
  theme's own derived output — not edits to any other file — so don't stop and ask about them
  mid-iteration. They're just not source, and on the standalone path they get deleted during
  tear-down (Step 6B) along with the two source files.
- **Verify scope before finishing, on both paths.** Run `git status` / `git diff` in the repo
  root and confirm the only *source* changes are: the new theme's two files (new, untracked), and
  a single added/removed line in `themes.spec.mjs`. Anything else in that diff means you've gone
  out of scope — undo it before calling the work done. On the standalone path, Step 6B's
  tear-down also removes the generated artifacts above and reverts the `themes.spec.mjs` line, so
  a finished standalone run should leave **zero** diff anywhere in the repo.

## Step 0 — Read before you build a mental model from memory

Even if you've done this before, skim these first — the guards are the actual spec, and this
skill's own summaries can drift from them:

- `packages/design-tokens/README.md` — §"Token Tiers", §"Themes", §"Creating a new theme"
- `packages/design-tokens/docs/ALIAS-COLOR-MAPPING-GUIDE.md`
- `references/token-model.md` (in this skill) — a condensed version of the above two
- `references/authoring-checklist.md` (in this skill) — a linear checklist, plus a "Known
  documentation discrepancies" section flagging a couple of dead links/phantom commands
  elsewhere in the repo's own docs, so you don't chase them
- `references/design-inputs.md` (in this skill) — how to work from a screenshot, mockup, "match
  this URL" request, or brand guideline; read it whenever the user gives you anything beyond an
  exact hex code (see Step 2.5)

## Step 1 — Ask which path, before doing anything else

There are two fundamentally different outcomes, and they lead to different amounts of permanent
change to this repo. Don't guess — ask:

1. **In-repo theme.** The theme's `.theme.json` and `.alias.json` files are authored and
   **committed** into `packages/design-tokens/`, exactly like `konnect-day` or `classic-night`.
   Choose this when the theme is meant to ship as part of `@kong/design-tokens` itself (a new
   Kong product surface, a new officially-supported theme).
2. **Standalone theme.** The user only wants the equivalent of
   `dist/themes/<theme>.css` — a single CSS file to drop into some *other* application. Nothing
   permanent is added to this repo. Choose this when the theme is for an external app, a
   one-off customer/brand override, or an experiment that shouldn't live in this package
   long-term.

If it's genuinely unclear which the user wants, ask directly: "Should this theme be checked
into the design-tokens repo permanently, or do you just need a standalone CSS file for another
app?" Everything downstream branches on the answer, so don't proceed on an assumption.

## Step 2 — Validate the theme name (both paths)

Themes are named in **kebab-case**, matching existing themes (`konnect-day`,
`classic-night`). Before doing anything else:

1. List `packages/design-tokens/themes/` and confirm the proposed name doesn't already exist
   as `<name>.theme.json`.
2. Confirm the name is kebab-case: lowercase, hyphen-separated, no underscores or camelCase.

If either check fails, tell the user and ask for a different name — don't silently rename or
proceed with a collision. (For a standalone theme this still matters: the temporary scaffold
files use the same naming convention, and a collision would clobber an existing theme.)

## Step 2.5 — Gather design intent and sources of truth

Before picking a template or touching any token value, get a concrete design brief — proceeding
on a vague sense of what the user wants produces a theme that's "close enough" and misses the
actual request. Establish, from what the user has already said or by asking:

- **Light, dark, or a day/night pair**, and **full theme vs. a narrow override** (a handful of
  tokens, not a whole color system) — these two answers drive the template-class decision in
  Step 3. (Don't separately ask whether every component should be individually overridable —
  Step 3 defaults to the exhaustive, every-component class unless the user explicitly asks for
  semantic-only/component-fallback behavior.)
- **Exact brand/accent colors**, if the user has them — the fastest path, since you can skip
  straight to plugging real values into the palette.
- **Any visual reference**: a screenshot, mockup, exported design comp, or a URL of a page whose
  look they want to emulate.
- **An existing published theme to port/emulate** — e.g. "make it look like `One Dark Pro`"
  (a VS Code theme), another editor/terminal theme, or a published palette (Tailwind/shadcn,
  etc.). Fetch its real source rather than working from memory of the name.
- **Verbal style guidance** with no visual artifact ("dark, moody, high-contrast") — this still
  counts as real direction; don't treat "no screenshot" as "no design direction."

If the user already supplied any of this in their request, don't re-ask for it — confirm your
reading of it instead. For everything about *how* to inspect a screenshot, work from a URL using
browser tooling, port an existing published theme, handle verbal-only guidance, and when to
bring in the **frontend-design** skill for aesthetic judgment calls, see
`references/design-inputs.md` — read it now if the user gave you anything beyond an exact hex
code to work from.

**What this step produces**: a concrete mapping of design inputs onto actual token decisions —
which hex values go into the palette (Step 4.3) and which tokens re-point to a different step
(Step 4.4) — confirmed with the user before Step 4 if any part of the translation involved
judgment (an estimated color, a derived accent scale) rather than an exact value they gave you.

## Step 3 — Pick a template to copy

Never author a theme from scratch — copy the closest existing theme. **Default to the
exhaustive class without asking** — copy `konnect-day` / `konnect-night` (every themeable
token, including component tokens, so every Kongponent is individually overridable). Don't
present exhaustive vs. semantic-only as a choice for the user to make.

**The template is a structural donor only — never a color or style source.** Copying
`konnect-day.theme.json` (or any other existing theme's files) exists purely to get the
complete *token key set* and the *mechanics* of how a theme file is shaped — it is not a hint,
a starting point, or a fallback for what the new theme should actually look like. Every alias
hex value and every token re-point in the copied files must come from Step 2.5's design brief;
never leave a value as whatever `konnect-day`/`classic-day`/etc. happened to ship with just
because the brief didn't explicitly call it out, and never reach for "this looks close to
konnect's blue" as a substitute for a real decision. Treat an under-specified value the same
way you'd treat a missing one — derive it from the brief's stated direction (brand hue, light/
dark, mood), don't borrow it from the template. **The one exception**: if the user explicitly
asked to **literally reuse** a *specific* existing theme's values — "base this on classic-night,"
"reuse konnect-day's greys," "make it like konnect-day but blue" — that named theme's values (or,
for a partial ask like "reuse konnect-day's greys," *only the specific family named*, not the
whole palette) become part of the design brief itself, treated as a confirmed design input (like
a ported theme, see `design-inputs.md`) rather than an implicit copy-source default. **Don't
extend this to mood/vibe language that merely references another theme's name** — "it should
feel like classic-night" or "something like konnect-day's energy" is a *verbal* design input
(see `design-inputs.md`'s "Verbal-only guidelines"), not permission for literal value reuse;
independently derive values from that mood the same as any other verbal guidance, and if it's
ambiguous whether the user means "copy these exact values" or "capture this feeling," ask before
assuming literal reuse — the two produce very different results and the wrong guess is expensive
to unwind after Step 4.

- **Semantic-only** (every semantic token, zero component tokens — like `classic-day` /
  `classic-night`, where components fall through to their semantic default) applies whenever the
  user's own request says, in substance, that individual components shouldn't be separately
  overridable — the test is the *meaning*, not a match against one exact phrase. Treat any of
  these as clearing the bar (not an exhaustive list, just calibration): "I don't need
  per-component overrides," "just theme the base colors, don't worry about button/card stuff,"
  "keep it simple, no component-level styling," "just the color system," as well as the more
  direct "semantic-only" / "components should fall through to defaults." Don't require the user
  to use the skill's own vocabulary — if their own words describe semantic-only's actual
  behavior, that counts as explicit, even if they never say "semantic-only." What does *not*
  count: a request that's simply short or informal ("keep it simple") **with no accompanying
  statement about components** — that's under-specified, not an opt-out, and defaults to
  exhaustive. When genuinely unsure whether a request is describing scope (full-theme-vs-
  narrow-override, see above) or class (exhaustive-vs-semantic-only), ask which one they mean
  rather than guessing — these are two different axes and a wrong guess sends the theme down a
  structurally different path (a real registered theme vs. a hand-authored CSS override).

**If Step 2.5 established this is a narrow override**, not a full color system or component set,
don't force it through the exhaustive/semantic-only machinery below — both existing theme
classes are guard-enforced to contain *every* token in their tier (see Step 4.5), so a sparse
`.theme.json` will fail the build, not degrade gracefully. For a standalone deliverable, the
efficient path is to hand-author a small CSS block directly, entirely outside `themes/` — see
"Minimal/partial overrides" under Step 6B. For an in-repo theme, a genuinely partial override
isn't representable in the current two-bucket system at all; say so and ask the user whether they
actually want a full theme or a smaller, non-thematic override living elsewhere (e.g. an
app-level stylesheet).

**Building a light/dark pair?** Treat the dark variant as a **re-point of tokens only** —
`classic-day`/`classic-night` and `konnect-day`/`konnect-night` all have **byte-identical alias
palettes** in the real repo; 100% of the day/night difference lives in which alias step each
`.theme.json` token points to, never in the palette's hex values. **That fact describes those
existing templates, not a value source for your new theme** — your new day theme's palette will
have its own, different hex values (per Step 4 item 3's design-brief rule), and it's *that*
palette — not `konnect-day`'s or `classic-day`'s original one — the night variant must copy
unchanged. Concretely: author the new day theme's palette first, then copy *that* `.alias.json`
for the night variant unchanged (don't edit its hex values in Step 4 item 3), and do all the
"make it darker" work in Step 4 item 4 by re-pointing individual tokens to different (already
darker) steps in that same, already-recolored palette. Only invent genuinely new palette values
if the user explicitly wants different hues — not just different lightness — between the two.

## Step 4 — Author the theme

Both paths follow the same authoring mechanics; only what happens afterward differs.

1. `cp themes/<from>.theme.json themes/<new>.theme.json`
2. `cp tokens/alias/color/<from>.alias.json tokens/alias/color/<new>.alias.json` — do this even
   if you think the theme won't need its own palette. Almost every theme references
   `{color.alias.*}`, and a theme with no matching palette file is a **hard build error**, not
   a graceful fallback.
3. Edit `tokens/alias/color/<new>.alias.json`: go through the file and set every alias step's
   hex `$value` deliberately from Step 2.5's design brief — per the Step 3 rule, the values you
   copied in are the *template's* colors, not a default for this theme, so don't leave any step
   unedited just because the brief didn't call it out by name; derive it from the brief's
   overall direction instead. **Unless** `<new>` is the dark counterpart of a day theme you're
   also creating/already have (see Step 3's light/dark guidance), in which case leave *that*
   file's values identical to the *day theme you just authored* (not the original template) and
   do all the work in item 4 below. Keep the exact key set from `_manifest.json` — don't add or
   remove entries. Update each changed `$description` to read `"Alias for <VALUE>."` exactly —
   this one **is** guard-checked (`themes.spec.mjs`'s `$description` guard applies to
   `.alias.json` files only).
4. Edit `themes/<new>.theme.json`, both the color and non-color tokens:
   - **Color tokens** (`{color.alias.*}` references): choose which alias step each points to
     based on the contrast/role it needs to play in *this theme's own new palette* (see
     `token-model.md`'s "Mapping a design input onto the palette") — don't default to mirroring
     the template's re-point choices just because they came along with the file you copied. This
     is also where a dark variant does 100% of its work (re-point text/border/background/shadow
     tokens to darker steps already present in the unchanged palette).
   - **Non-color tokens with literal values** — `--kui-border-radius-*`, `--kui-shadow-*`,
     `--kui-space-*`, and similar scale tokens hold a literal `$value` in the theme file, not an
     alias reference (see `token-model.md`'s tier description). If Step 2.5's brief said anything
     about corner rounding, shadow/elevation depth, or density (a screenshot, URL, or ported
     theme almost always does — see `design-inputs.md`), this is the step where that actually
     gets applied: edit the specific literal `$value`s the brief called for. Skipping this and
     only touching color tokens is the most common way a theme "passes" authoring while still
     rendering with the template's original corner rounding and shadow depth — the guards check
     completeness and description formatting, not whether a radius/shadow value matches the
     brief, so this has to be done deliberately here, not caught later.

   Follow the `$description` rules in
   `references/token-model.md` (match the semantic source, stay value-agnostic, omit for pure
   scale tokens — judge by the token's *tier*, not by whether its name contains a scale-sounding
   word: `kui-border-radius-30` omits it, but `kui-button-border-radius-large` and
   `kui-alert-border-radius` keep one because they're component/concept tokens, not bare scale
   tokens). **Unlike the palette's `$description`, nothing guards a theme token's `$description`
   correctness** — no test checks that it matches the semantic source or stays value-agnostic, so
   get it right the first time rather than relying on `pnpm test` to catch a mistake here.
5. Classify `<new>` in `packages/design-tokens/themes.spec.mjs`: add its name to
   `EXHAUSTIVE_THEMES` or `SEMANTIC_ONLY_THEMES`, matching the class you chose in Step 3. Every
   theme file on disk must appear in exactly one of these two arrays, or the classification
   guard fails the build — there's no "draft," "unchecked," or partial-coverage state in the
   test suite; both arrays require every token in their tier to be present, not just the ones
   this theme changes. **This is the one file outside `themes/<new>.theme.json` and
   `tokens/alias/color/<new>.alias.json` this skill ever touches, and only via this single added
   array entry** — see the scope guardrail at the top of this document. Don't reorder, reformat,
   or otherwise touch any other line in `themes.spec.mjs`.

For the full checklist form of these steps (with checkboxes), see
`references/authoring-checklist.md`.

## Step 5 — Build and verify

```sh
pnpm --filter @kong/design-tokens test    # pretest runs build:tokens automatically
pnpm --filter @kong/design-tokens lint
```

`pnpm test` rebuilds tokens first (via its `pretest` script), so you don't need a separate build
step. If a guard fails, its message names the exact problem (missing/extra tokens, a stale
`$description`, an off-source color) — fix that specific thing and re-run rather than guessing
broadly.

**A correction, if you were about to reach for the sandbox to preview this theme: don't.** The
sandbox (`pnpm --filter @kong/design-tokens sandbox`) only displays the package's base/default
token values as generic swatches — it has no theme selector and doesn't apply `themes/*.theme.json`
files to rendered components at all, regardless of what you just created. It's useful for
browsing the overall token catalog, but it will not show you this theme. See Step 5.5 for how to
actually preview and validate a new theme's rendered output.

## Step 5.5 — Verify the theme actually matches the design brief

Passing `pnpm test`/`pnpm lint` only proves the theme is *structurally* compliant — every token
present, descriptions correctly formatted, colors traceable to the theme's own palette. None of
that confirms the theme *looks like* what the user asked for in Step 2.5. A theme can pass every
guard and still have the wrong shade of blue (a legitimate, on-palette, but wrong color — the
guards can't tell the difference), insufficient contrast (not guarded at all — see
`token-model.md`), or corners that aren't as rounded as a reference screenshot showed. Close that
gap explicitly, especially when Step 2.5 involved anything beyond an exact hex code the user
handed you directly.

1. **Confirm the specific values landed correctly — color AND non-color.** For each value that
   mattered most in Step 2.5 (primary/accent colors, but also any corner-rounding/shadow/density
   direction the brief established), grep the compiled output for the exact resolved value and
   compare it against what was confirmed. Don't stop at the color example — repeat this for
   every token family the brief touched:
   ```sh
   grep -in -- "--kui-color-background-primary:" dist/themes/<new>.css
   grep -in -- "--kui-border-radius-30:" dist/themes/<new>.css
   grep -in -- "--kui-shadow-20:" dist/themes/<new>.css
   ```
   (Substitute the actual token names Step 4 edited — these three are illustrative, not
   exhaustive.) This catches two distinct guard-invisible failure modes: a color token re-pointed
   to the wrong (but still on-palette) alias step, and a non-color token left at the template's
   literal value because Step 4's non-color edit was skipped or incomplete — both technically
   valid, visibly wrong.
2. **If Step 2.5 involved a screenshot, mockup, reference URL, or a ported theme, do an actual
   visual comparison — and make sure the test markup can actually show a non-color mismatch.**
   For a ported theme, the "reference" to compare against is a rendering of the *source* theme
   itself (its marketplace screenshots, or one you took by installing it) — treat it exactly like
   a screenshot reference from here on. Build a small throwaway HTML file **outside the repo
   entirely** (a scratch/tmp directory, not anywhere under `packages/design-tokens/`) that
   `<link>`s the compiled theme CSS via its **absolute path** (e.g.
   `<link rel="stylesheet" href="file:///abs/path/to/dist/themes/<new>.css">`), sets
   `data-kui-theme="<new>"`, and includes a few representative elements (a button, a card-like
   container, some body text) that explicitly apply the theme's shadow/radius/spacing tokens
   (`box-shadow: var(--kui-shadow-*)`, `border-radius: var(--kui-border-radius-*)`,
   `padding: var(--kui-space-*)`), not just color properties — a button or card with only
   background/text/border color set will render "correctly" even if its radius or shadow is
   still the template's, because the test markup never asked for those properties. Keeping this
   file outside the repo means it never risks tripping the scope guardrail's `git status` check —
   there's nothing to remember to delete before Step 6A/6B. Then:
   - If a browser automation tool is available (see `design-inputs.md`), navigate to the file and
     screenshot it, then view that screenshot next to the original reference (the Read tool
     renders images) and compare them directly — explicitly check corner rounding, shadow depth,
     and padding/density on the button and card elements, not just overall color, since color is
     the property an eyeballed comparison naturally anchors on first.
   - If no browser tool is available, at minimum restate the confirmed values next to the
     original reference in words — **explicitly including** the corner-rounding, shadow, and
     spacing tokens the brief called for, not only color — and have the user preview the compiled
     CSS in their own environment before calling the theme finalized. Don't declare victory on
     guard-passing alone when a visual reference exists and you have no way to actually render it.
3. **Get sign-off on the rendered result, not just the planned values.** Step 2.5 confirms
   *planned* values before Step 4 runs; this step confirms the *actual, built* result. Present
   what you found — the grep comparisons (color and non-color), and the screenshot comparison or
   its written equivalent (covering shadow/radius/spacing, not just color) — and get the user's
   confirmation before treating either path (6A or 6B) as done.

## Step 6A — In-repo path: you're done

Once tests and lint pass **and Step 5.5's comparison is confirmed with the user**, the theme is
complete. Before considering it done, run `git status` / `git diff` and confirm the changes are
exactly: two new files (`themes/<new>.theme.json`, `tokens/alias/color/<new>.alias.json`) and one
added line in `themes.spec.mjs` — per the scope guardrail at the top of this document. These are
meant to be committed. `dist/themes/<new>.{css,mjs,cjs,d.ts,d.cts}` will regenerate on every
build; there's nothing further to extract.

Mention to the user: if this theme changes `primary`/`accent` color tokens, or introduces a
similarly brand-derived default, the Kong Konnect Dev Portal customization plugin
(`kong-konnect/portal`) may need a matching override so the new default doesn't leak into
customer-branded surfaces — that repo is outside this skill's scope, but worth flagging.

## Step 6B — Standalone path: iterate, extract, then remove all trace

The standalone path uses the exact same authoring mechanics (Step 4) so the user gets the real
build and guards to validate against — but nothing in `packages/design-tokens/` is meant to
survive past this session. Treat what you created in Step 4 as a **temporary scaffold**: the
same scope guardrail from the top of this document still applies for the full duration of steps
1-4 below — you're still only ever touching the new theme's two files plus the one
`themes.spec.mjs` line, and step 4 (tear-down) is what puts that line and both files back to
nothing. (If the user only wants a handful of tokens overridden rather than a full theme, skip
this entire flow — see "Minimal/partial overrides" at the end of this step instead.)

1. **Iterate.** Re-run Step 5's build/test loop and Step 5.5's brief-comparison as the user
   tweaks values, for as long as they want. The scaffold theme behaves exactly like a real one
   during this phase (same guards, same compiled output), which is the point — it's the fastest
   way to get a trustworthy, fully-resolved CSS output to hand off. (Remember the sandbox
   doesn't preview this theme — use Step 5.5's screenshot/grep approach instead.)
2. **Confirm finalization.** Don't extract until Step 5.5's comparison is done and the user says
   the theme looks right.
3. **Extract.** Once finalized, copy the build output to wherever the user wants it:
   - `dist/themes/<new>.css` is almost always what they need — a self-contained
     `@layer kui.theme { [data-kui-theme="<new>"] { --kui-...: ...; } }` block they can drop
     into their own app's build and activate with `data-kui-theme="<new>"` on any element.
   - If they also want to compose the theme at runtime in JS (not just load static CSS), copy
     `dist/themes/<new>.mjs` / `.cjs` / `.d.ts` too — these export a plain
     `Readonly<Record<string, string>>` object.
   - Ask where they want the file(s) copied to if it isn't already clear (their app's repo path,
     or just returned/printed if they're working outside a specific project).
4. **Remove every trace of the scaffold.** This is not optional — the point of the standalone
   path is that `packages/design-tokens/` ends the session exactly as it started:
   - Delete `themes/<new>.theme.json`
   - Delete `tokens/alias/color/<new>.alias.json`
   - Remove `<new>` from whichever classification array you added it to in `themes.spec.mjs`
   - Delete the generated `dist/themes/<new>.*` files
   - If `<new>` was classified under `SEMANTIC_ONLY_THEMES`, also delete
     `__snapshots__/themes/<new>.css` — that test loops over the array and auto-writes a golden
     snapshot for every theme in it, not just `classic-day`/`classic-night`, so a scaffold theme
     leaves one behind too.
   - Re-run `pnpm --filter @kong/design-tokens test` and confirm it's green, and confirm
     `git status` shows no lingering diff in `packages/design-tokens/`.

Verify the CSS you handed off is fully resolved before calling it done — open it and check
there are no unresolved `{color.alias...}` references, no `var(--kui-color-alias...)` (aliases
should never leak into output), and no `: undefined;` values. If anything looks unresolved, the
build step was skipped or ran against stale scaffolding — rebuild before handing off.

### Minimal/partial overrides

If the user only wants a handful of tokens overridden (e.g. "just recolor this customer's
primary button"), not a full color system or component set, skip the scaffold/iterate/extract/
tear-down flow above entirely — it's needless overhead for a small edit, and the theme classes
in this repo can't represent "partial" anyway (both `EXHAUSTIVE_THEMES` and
`SEMANTIC_ONLY_THEMES` require every token in their tier to be present; see Step 4.5). Instead,
hand-write a small CSS block directly, using real `--kui-*` token names — verify each name is
real (see below), don't guess or invent one:

```css
[data-kui-theme="<new>"] {
  --kui-color-background-primary: #123456;
  --kui-button-color-background-primary: #123456;
}
```

This relies on ordinary CSS cascade: any `--kui-*` custom property not set here simply inherits
its existing value, so you never need to enumerate the full token set for a targeted override.
Skip Steps 4-5 and the numbered scaffold flow above entirely for this case.

**Confirming a token name exists.** Don't rely on memory or guessing for a token name, whether
for a minimal override above or while hand-editing a full scaffold. After any build
(`pnpm --filter @kong/design-tokens build:tokens`), the authoritative list is
`dist/tokens/themeable-tokens/index.mjs`'s `KUI_THEMEABLE_TOKENS` export — the same list
`themes.spec.mjs`'s own guards check against:

```sh
node -e "import('./dist/tokens/themeable-tokens/index.mjs').then(m => console.log(m.KUI_THEMEABLE_TOKENS.map(t => t.name).join('\n')))"
```

A theme file that sets a name not in this list fails the guarded build's drift check as an
"EXTRA token" (not silently dropped) — but for a hand-authored standalone CSS snippet, which
isn't guard-checked at all, a typo'd or invented token name would silently do nothing in the
consumer's app, so verify names up front rather than after the fact.
