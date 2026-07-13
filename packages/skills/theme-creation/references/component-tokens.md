# Component tokens — designing visual identity, not just recoloring

A theme that only sets semantic color tokens (`--kui-color-*`) recolors the system but leaves
every component's *shape* — button padding, corner radius, input height, card elevation, the feel
of a hover or focus state — at the template's defaults. That's why a color-only theme reads as
"the same UI, tinted" rather than a distinct brand. Component tokens are how you theme the shape.
This file is the mental model for using them with taste; `theme:scaffold` prints the actual live
list grouped by component (Step 3.5), and `token-model.md` covers the tier mechanics.

## The two tiers, and how a component resolves a value

Every Kongponent reads its **component token** first and falls back to a **semantic token**:

```
border-radius: var(--kui-button-border-radius-medium, var(--kui-border-radius-30, 6px));
                    └─ component token (per-component) ┘   └─ semantic fallback ┘
```

So you have two levers, and choosing between them is a real design decision:

- **Set the semantic token** (`--kui-border-radius-30`, `--kui-color-background-primary`) to change
  that value *everywhere* it's used — the whole system shifts together. Use this for system-wide
  identity: the brand's overall roundedness, the primary brand color, the type scale.
- **Set the component token** (`--kui-button-border-radius-medium`) to make *one component* differ
  from the system default — pill-shaped buttons on an otherwise low-radius UI, a flatter card, an
  input taller than the base rhythm. Use this when the reference treats a component specially.

A good theme usually does both: establish the system identity via semantic tokens, then override
the handful of component tokens where the reference's components visibly diverge from that system
default. Reasoning only at the semantic tier misses component character; reasoning only at the
component tier is 900 one-off decisions with no coherent system underneath.

**Set both tiers so it renders regardless of which token the installed component consumes.** A
given Kongponents version only reads the tokens *it* was built against — an older/published
version may read only the semantic fallback (`--kui-color-background-primary`), a newer one the
component token (`--kui-button-color-background-primary`). If you set only the component token, the
button can render un-themed on the version the user actually runs; if you set only the semantic
token, you can't give the component a treatment that differs from the system. So for each key
component treatment, set the component token **and** the semantic token it falls back to, to the
same intended result — unless the source deliberately treats the component differently from the
system (then the component token carries the difference, and you preview against a version that
consumes it). This is what makes the theme match on real components, not just in the compiled CSS.

## Match the source's components — don't recolor by role name

This is the rule that most often decides whether a theme actually *looks like* the source. Kong's
token roles have names (`primary`, `accent`, `danger`…), but **you map by visual equivalence, not
by name**: find the source's most prominent, identity-defining button — its main call-to-action —
and make Kong's **primary** button reproduce *that button's exact treatment* (fill, text color,
border, radius, padding), even if that fill is a bright color you'd instinctively call an "accent."

The failure to avoid, from a real run: a site whose signature CTA is a **gold pill with navy
text**, themed by mechanically routing the brand's *darker* navy into `primary` (because "navy is
the primary brand color") and shunting the gold off to `accent`/badge tokens — producing navy
rectangular buttons that look nothing like the site, even though every extracted color was
"correct." The brand color being navy does **not** mean the primary *button* is navy; the primary
button is whatever the source's primary button actually is. Match the component you can see.

Concretely, before assigning colors to roles, list the source's actual buttons and pick which Kong
role each maps to by appearance: source's dominant CTA → `primary`; its lower-emphasis button →
`secondary`; its outline/text button → `tertiary`; destructive → `danger`. Then reproduce each
one's full treatment. If a role has no counterpart in the source, derive a coherent one; but never
leave the *most visible* component looking unlike the source because its color didn't land in the
role its name suggested.

## Read a component as a unit across its states

When the reference shows a button, don't extract "the button is blue." Extract the whole unit —
because that's what makes it read as *that* button:

- **Fill / text / border** for each state: default, **hover**, **active**, **focus**, **disabled**.
  A brand's buttons are defined as much by how they respond as by their resting color. The token
  names follow a regular pattern — e.g. `--kui-button-color-background-primary`,
  `-primary-hover`, `-primary-active`, `-primary-disabled`, and the matching `-color-text-*` and
  `-color-border-*`. `theme:scaffold`'s grouped inventory lists them together per component.
- **Shape**: `border-radius`, `border-width`, and `padding-x` / `padding-y` (chunky vs. compact).
- **Type**: `font-size`, `line-height`, and where present `font-family` / weight.
- **Focus ring**: the `-shadow-focus` token — its color, spread, and offset are a strong identity
  signal (a tight 2px ring vs. a soft 4px glow). It scaffolds as an empty slot with no default to
  inherit, so you're composing a literal `box-shadow`/`rgba()` value from scratch — build it from
  an exact channel of a palette step (see below), not an arbitrary tint.

The same lens applies to the other high-signal components: **card / surface** (background,
border, radius, padding, and the elevation `-shadow`), **input** (background, border, radius,
padding, focus ring), and **badge / alert / tabs** (the accent and status treatments). If you can
answer "what are this reference's buttons, cards, and inputs, in every state," you've captured
most of its visual identity.

## Propagate the brand across the whole component system

A source shows you a handful of components — buttons, maybe a card, maybe an input. The scaffold
inventory lists ~100 component groups. The gap between those is the second-most-common miss (after
recoloring by role name): theming only the components you can literally see and leaving every other
family — checkbox, radio, input-switch, select, file-upload, tabs, table, pagination, stepper,
tooltip, toaster, modal, pop, slideout — at Kong's defaults. The result is a theme whose buttons
are unmistakably the brand and whose form controls are unmistakably Kong. That reads as
half-finished, and it's wrong: a real design system applies one identity everywhere.

**The fix is inference, not fabrication.** You are not inventing new looks for the unshown
components — you are *propagating* the identity you already extracted from the shown ones. From the
components the source did reveal, you can determine a small set of identity signals; carry each into
every other family:

- **Brand/accent hue for "on" states.** Whatever color the source's primary control uses for its
  active/selected fill (the primary button's fill, a checked toggle, a selected chip) is the color
  every other component's *checked / selected / active / in-range* state should use:
  checkbox/radio `-color-background-checked`, `input-switch-color-background-selected`,
  `select-item`/`dropdown-item`/`tabs`/`table-row` selected backgrounds, stepper selected, date-
  picker selected day. Kong's template points these at neutral grays — repoint them to the brand.
- **Roundedness.** The radius you established on buttons/cards is a system trait: apply the matching
  step to `input`, `select`, `modal`, `pop`, `tooltip`, `toaster`, `card`, `checkbox` (a pill-
  button brand usually still wants softly-rounded, not pill, inputs — scale the trait sensibly per
  component, don't literally copy one radius everywhere).
- **Focus-ring treatment.** The ring shape you chose (tight vs. soft, and its hue) belongs on every
  `-shadow-focus` token, not just the button's — inputs, checkboxes, radios, tabs, links all share
  one focus language in a coherent system.
- **Density and border weight.** If the source's controls are generously padded or use a heavier
  border, carry that to inputs, dropzones, and other bordered/padded controls.
- **Surface hierarchy.** The page/surface/elevated backgrounds and border color you derived apply to
  every surface component (`card`, `modal`, `pop`, `slideout`, `toaster`, `table`, `input`
  backgrounds), and the flat-vs-shadowed choice applies to all their `-shadow` tokens.

Go through the scaffold inventory family by family and give each a derived treatment or an explicit
"neutral — the identity implies no change here." The bar is that **no component family is left
un-considered by default**. Status/method concept tokens (`--kui-status-*`, `--kui-method-*`) are
the usual legitimate "neutral" — they encode fixed semantic meaning (HTTP methods, status codes)
and follow the palette's hue families automatically; you rarely repoint them, but say so rather
than skipping them silently.

## Deriving, not inventing — and confirming

Translate the reference into these tokens the same way `design-inputs.md` describes for color:
extract exact values where you can (a `getComputedStyle` read of a real button's padding/radius/
box-shadow from a URL is exact, not a guess), and where the reference doesn't show something,
mark it "unchanged" rather than inventing it. Two component tokens deserve special care:

- **States you can't see in a static reference.** A screenshot rarely shows hover/active. Derive
  them coherently from the resting color (hover usually one step stronger/darker, active one more)
  rather than leaving them at the template's — a themed default button with an un-themed hover is
  a jarring, common miss. This is a `frontend-design` judgment call; lean on that skill.
- **Elevation and focus rings** have no default to inherit — they scaffold empty, so any literal
  color you compose for them (a `box-shadow`, an `rgba()` overlay) must derive from the new palette
  or the build's off-source-color guard rejects it. That guard is strict and worth knowing
  precisely: every `#hex` or numeric `rgb()/rgba()` a theme token emits must **exactly equal** a
  hex value present in the theme's own palette (white, black, and `transparent` are always
  allowed). So a focus ring like `0 0 0 4px rgba(R,G,B,.15)` must use the R,G,B of an actual
  palette step (e.g. your neutral `gray.90`), not an arbitrary tint — pick the palette color the
  effect should derive from and use its exact channels.

Because a lot of this is aesthetic judgment (deriving states, matching a "feel"), it's exactly
what Step 3.5's spec + the Step 5.5 Kongponents preview exist for: decide the component treatments
explicitly, confirm the spec, then look at the real components rendered under the theme and check
the buttons/cards/inputs actually match the reference — including their states — before calling it
done.
