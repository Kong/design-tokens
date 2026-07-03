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
- **A full theme (own color system + optionally every component) or a narrow override** (e.g.
  "just this customer's primary button")? This decides whether you're heading into Step 3's
  full template flow or the "Minimal/partial overrides" shortcut in Step 6B.
- **Exact brand/accent colors, if they have them** (hex codes, a brand guideline PDF, a Figma
  library). This is the fastest path — skip straight to plugging real values into the palette
  once you have hex codes; no visual inspection needed.
- **Any visual reference** — a screenshot, mockup, exported design comp, or a URL of a site/page
  whose look they want to emulate. See below for how to work each of these.

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
