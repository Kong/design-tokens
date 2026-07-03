# Working from design inputs (screenshots, URLs, brand guidelines)

Most theme requests come with *some* description of the desired look, ranging from an exact
hex code to "make it feel more premium." This file covers how to turn whatever the user gives
you into the concrete inputs Step 4 needs (alias hex values, and which tokens should re-point
to a different step). Gather this **before** Step 3 (picking a template) — see Step 2.5 in
`SKILL.md`.

## What to ask for, if the user hasn't already said

Don't guess at colors or style from a vague request ("make it look nice") — ask. A short set of
questions gets you further than iterating blind:

- **Light, dark, or a day/night pair?** Determines the template class alongside scope (below).
- **A full theme (own color system, every component individually overridable by default) or a
  narrow override** (e.g. "just this customer's primary button")? This decides whether you're
  heading into Step 3's full template flow (which defaults to exhaustive — don't separately ask
  whether every component should be overridable) or the "Minimal/partial overrides" shortcut in
  Step 6B.
- **Exact brand/accent colors, if they have them** (hex codes, a brand guideline PDF, a Figma
  library). This is the fastest path — skip straight to plugging real values into the palette
  once you have hex codes; no visual inspection needed.
- **Any visual reference** — a screenshot, mockup, exported design comp, or a URL of a site/page
  whose look they want to emulate. See below for how to work each of these.
- **An existing published theme to port/emulate** — e.g. a VS Code theme like `One Dark Pro`,
  another editor/terminal theme, or a published palette (Tailwind/shadcn, etc.). See "Porting an
  existing published theme" below.

## Screenshots and mockups (image files)

Read image files directly — the Read tool renders them, so you can visually inspect them the
same way a person would. When inspecting one, look for:

- **Primary/accent color** — the color used for primary buttons, links, or the single most
  prominent brand accent.
- **Background/surface hierarchy** — page background vs. card/surface background vs. any
  elevated surface, and whether the overall feel is light or dark.
- **Text and border contrast** — how strong text-on-background contrast is (this hints at which
  alias steps to use for text/border tokens — see `token-model.md`'s tier guidance).
- **Corner rounding** — sharp corners, subtly rounded, or fully pill-shaped — maps to which
  `--kui-border-radius-*` step (or component-specific radius token) the theme should re-point to.
- **Shadow/elevation depth** — flat/flush design vs. heavy drop shadows — maps to
  `--kui-shadow-*` tokens.
- **Density** — tight vs. generous spacing — maps to `--kui-space-*` tokens, though be cautious
  changing the space scale globally since it affects layout broadly, not just color.

**Be honest about precision.** Visually reading a color off a screenshot gives you a close
estimate, not a lab-accurate value — screen calibration, compression artifacts, and lighting in
a photographed mockup all introduce drift. For colors that matter most (primary/accent, the
ones every user will stare at), state your estimated hex and ask the user to confirm or correct
it before you commit it to a palette file, rather than silently locking in a guess. If the user
can export exact values (a Figma "inspect" panel, a brand guideline's hex codes), those beat any
visual estimate — ask if in doubt.

## "Emulate this page" URLs

If a browser automation tool is available in your environment (for example, a Playwright MCP
server exposing `browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, and
`browser_evaluate`), use it:

1. Navigate to the URL.
2. Take a screenshot (and/or an accessibility snapshot) and inspect it exactly like an uploaded
   mockup (see above).
3. If `browser_evaluate` (or equivalent JS-execution access) is available, prefer pulling real
   `getComputedStyle` values for a few key elements (primary button background, link color, page
   background, body text color) over eyeballing a screenshot — this gives you actual hex/rgb
   values instead of an estimate, removing the "be honest about precision" caveat above entirely
   for whatever you can extract this way.

If no browser tool is available, don't guess at a site's visual identity from memory of the
brand — use a text-fetching tool to confirm you have the right site/page, then ask the user for
a screenshot instead. Never invent colors for a real, named company's site from general
knowledge; brand colors change, and a wrong guess baked into a theme is worse than asking.

## Porting an existing published theme

Sometimes the "reference" isn't a screenshot or a URL but the **name of an existing, published
theme** the user wants emulated — most commonly a code editor theme ("make it look like
`One Dark Pro`"), but the same approach applies to any published palette with an inspectable
source: other editor themes, terminal color schemes, a Tailwind/shadcn palette, etc. VS Code
themes are used as the worked example below because they're common and their source is public
and structured, but treat the pattern as general.

**Get the real source, never memory — same rule as a named company's URL above.** Don't
reconstruct a well-known theme's colors from general knowledge; fetch its actual published
definition. For a VS Code theme, that's the extension's theme JSON in its source repository —
e.g. `One Dark Pro`'s are at `github.com/Binaryify/OneDark-Pro`, under `themes/*.json`. Two
things to nail down before extracting anything:

- **Which variant?** Many themes ship several (`One Dark Pro` alone has `OneDark-Pro`,
  `-darker`, `-flat`, `-mix`, `-night-flat`) — confirm the exact one the user means rather than
  guessing from the base name.
- **Light or dark?** Almost always answered by the theme itself (and by the variant chosen) —
  this directly answers Step 2.5's light/dark/day-night question, no separate question needed.

**A VS Code theme JSON has two different color sections — only one of them maps.** `colors` is
a flat object of UI/"workbench" keys (editor chrome, buttons, panels, borders) — this is what
maps onto Kong's semantic roles, the same way a screenshot's visible UI does. `tokenColors` is
an array of syntax-highlighting rules for source code — it has no Kong equivalent (there's no
"keyword" or "string literal" token in a design-token system) and is generally **not** mapped;
at most, skim it for a representative accent hue if `colors` alone doesn't surface one clearly.

A few representative `colors` keys and the Kong role they typically inform (starting points,
not an exhaustive or authoritative mapping — judge each theme's own key set on its own terms):

| VS Code `colors` key | Typical Kong role |
|---|---|
| `editor.background`, `editorGroupHeader.tabsBackground` | Background hierarchy (page vs. surface) |
| `editor.foreground`, `foreground` | Text color |
| `button.background` | Primary |
| `focusBorder`, `textLink.foreground` | Accent / link |
| `panel.border`, `editorGroup.border` | Border |

**Colors are exact; everything else still needs your eyes.** Because the source JSON's hex
values are literal, the "be honest about precision" estimate caveat above doesn't apply to
color — you're not eyeballing a value, you're reading one. What *does* still require visual
inspection is everything a theme JSON doesn't encode for a web app at all: shadow/elevation
depth, padding/density on buttons and cards, corner rounding, and the theme's overall feel.
Render the theme (the extension's marketplace screenshots are usually enough; failing that,
install it and take one yourself) and read it exactly like an uploaded screenshot — see
"Screenshots and mockups" above for the property → token-family mapping
(`--kui-shadow-*`, `--kui-space-*`, `--kui-border-radius-*`). A code editor doesn't really have
"button padding" or "card elevation" in the first place, so deriving believable values for
those from a theme's general mood is a `frontend-design`-level judgment call, not extraction —
flag it as such and confirm with the user rather than presenting a guess as read-off fact.

**Hand-off.** Once you have concrete colors and a read on the non-color properties, both
recombine with every other intake path exactly the same way: colors go through
`token-model.md`'s "Mapping a design input onto the palette" (family + step selection);
non-color properties go through the same screenshot property → token-family guidance above.
Nothing about a ported theme changes Steps 3 onward.

## Verbal-only guidelines

A request like "dark, moody, high-contrast" or "playful, pastel, rounded" with no visual artifact
is still real design direction — don't treat it as "no direction, so proceed however." Two
options, depending on how confident you are:

- If the guidance clearly implies specific choices (e.g. "playful and rounded" → larger
  `border-radius` steps, warmer/more saturated hues), propose concrete values and confirm before
  writing files.
- If it's too vague to turn into values confidently (e.g. "make it pop" with no other context),
  ask a narrowing question rather than picking an arbitrary interpretation.

## Turning judgment calls into values

Once you have concrete color(s), most of the remaining work — picking the right alias family and
step for a hex value, deciding how many related shades to derive — is mechanical; see
`token-model.md`'s "Mapping a design input onto the palette" section.

Some of it isn't mechanical, though: deriving a plausible full accent scale from a single brand
hex, judging whether a translated "vibe" (e.g. "premium," "playful") actually reads as such once
rendered, and balancing contrast/accessibility trade-offs are genuine aesthetic judgment calls.
For those, invoke the **frontend-design** skill rather than relying purely on your own instinct
— it exists specifically to make those calls more reliably than an ungrounded guess. Reach for
it whenever you're doing more than "the user gave me an exact value, I'm plugging it in
verbatim."

## Confirm before you build

If translating the input involved any judgment call (an estimated color, a derived accent scale,
a "vibe" → concrete-values translation), summarize the resulting hex values and which tokens
they'll apply to, and confirm with the user **before** running Step 4's file edits. A
build+test+lint cycle is cheap to repeat, but re-doing several rounds of guesswork is not — a
quick confirmation up front is the efficient path.

This is a pre-build check on the *planned* values, not the finished result — after Step 5's
build, SKILL.md's Step 5.5 closes the loop with a comparison against the *actual, rendered*
output (grepping the compiled CSS for the confirmed values, and a real screenshot comparison via
a throwaway HTML file if you had a visual reference here). Both checks matter: this one catches
a bad translation before you spend a build cycle on it; Step 5.5 catches everything that can
still go wrong between a confirmed plan and the compiled result (a mis-pointed token, a step
picked from the wrong family, etc.).
