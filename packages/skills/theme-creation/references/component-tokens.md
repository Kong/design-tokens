# Component tokens — designing visual identity, not just recoloring

A theme that only sets semantic color tokens (`--kui-color-*`) recolors the system but leaves
every component's *shape* — button padding, corner radius, input height, card elevation, the feel
of a hover or focus state — at the template's defaults. That's why a color-only theme reads as
"the same UI, tinted" rather than a distinct brand. Component tokens are how you theme the shape.
This file is the mental model for using them with taste; `scaffold.mjs` prints the actual live
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
  `-color-border-*`. `scaffold.mjs`'s grouped inventory lists them together per component.
- **Shape**: `border-radius`, `border-width`, and `padding-x` / `padding-y` (chunky vs. compact).
- **Type**: `font-size`, `line-height`, and where present `font-family` / weight.
- **Focus ring**: the `-shadow-focus` token — its color, spread, and offset are a strong identity
  signal (a tight 2px ring vs. a soft 4px glow), and it's a literal-color token that won't trace
  to a fresh palette until you re-express it (scaffold flags these).

The same lens applies to the other high-signal components: **card / surface** (background,
border, radius, padding, and the elevation `-shadow`), **input** (background, border, radius,
padding, focus ring), and **badge / alert / tabs** (the accent and status treatments). If you can
answer "what are this reference's buttons, cards, and inputs, in every state," you've captured
most of its visual identity.

## Deriving, not inventing — and confirming

Translate the reference into these tokens the same way `design-inputs.md` describes for color:
extract exact values where you can (a `getComputedStyle` read of a real button's padding/radius/
box-shadow from a URL is exact, not a guess), and where the reference doesn't show something,
mark it "unchanged" rather than inventing it. Two component tokens deserve special care:

- **States you can't see in a static reference.** A screenshot rarely shows hover/active. Derive
  them coherently from the resting color (hover usually one step stronger/darker, active one more)
  rather than leaving them at the template's — a themed default button with an un-themed hover is
  a jarring, common miss. This is a `frontend-design` judgment call; lean on that skill.
- **Elevation and focus rings** carry literal colors in the template; re-express them against the
  new palette (scaffold lists exactly which tokens) or the build's off-source-color guard rejects
  them. That guard is strict and worth knowing precisely: every `#hex` or numeric `rgb()/rgba()`
  a theme token emits must **exactly equal** a hex value present in the theme's own palette (white,
  black, and `transparent` are always allowed). So a focus ring like `0 0 0 4px rgba(R,G,B,.15)`
  must use the R,G,B of an actual palette step (e.g. your neutral `gray.90`), not an arbitrary
  tint — pick the palette color the effect should derive from and use its exact channels.

Because a lot of this is aesthetic judgment (deriving states, matching a "feel"), it's exactly
what Step 3.5's spec + the Step 5.5 Kongponents preview exist for: decide the component treatments
explicitly, confirm the spec, then look at the real components rendered under the theme and check
the buttons/cards/inputs actually match the reference — including their states — before calling it
done.
