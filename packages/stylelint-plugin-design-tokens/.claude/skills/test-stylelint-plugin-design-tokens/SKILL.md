---
name: test-stylelint-plugin-design-tokens
description: Write, extend, or fix tests for @kong/stylelint-plugin-design-tokens (packages/stylelint-plugin-design-tokens). Use when adding test coverage or fixtures for the stylelint rules use-proper-token or token-var-usage, covering an edge case in either, adding a brand-new stylelint rule to the plugin (which must ship with tests), or debugging that package's vitest suite. Do NOT use for packages/eslint-plugin-design-tokens — that package uses ESLint's own RuleTester and an unrelated harness.
---

# Testing the Kong stylelint plugin

All paths are relative to `packages/stylelint-plugin-design-tokens/`.

A suite already exists (added in commit `ef5d5a9`). Your job is to make new tests match it, not to
invent a second style. Read these before writing anything:

| File | What it establishes |
|---|---|
| `test/test-utils.mjs` | the lint helper — the only way a rule spec touches stylelint |
| `test/test-fixtures.mjs` | the single home for every CSS/SCSS snippet |
| `rules/use-proper-token/index.spec.mjs` | template for a **non-fixable** rule |
| `rules/token-var-usage/index.spec.mjs` | template for a **fixable** rule (autofix + stability) |
| `index.spec.mjs` | entry exports, helper guard, fixture duplicate-detection |
| `utilities/extract-tokens-from-value.spec.mjs` | plain unit-test style, no stylelint |

Stack: Vitest 4, plain `.mjs`, ESM, no TypeScript, no build step. There is **deliberately no
rule-tester package** — `stylelint-vitest-rule-tester` and `jest-preset-stylelint` were both
evaluated and rejected. Do not add either.

## Hard rule: one home for every snippet

**No spec file may contain a CSS or SCSS string literal.** Every snippet lives in
`test/test-fixtures.mjs`, grouped by rule and outcome; specs reference it by name.

```js
export const USE_PROPER_TOKEN = { valid: { ... }, invalid: { ... } }
export const TOKEN_VAR_USAGE  = { valid: { ... }, invalid: { ... } }
export const MALFORMED = { unclosedBlock: '.a { color: red' }   // helper guard only
export const TOKEN_VALUES = { ... }                             // bare values for unit tests
```

- `valid` entries are plain strings.
- `invalid` entries **for a fixable rule** are `{ code, output }`. `output` is the verified autofix
  result; `output: null` means "reported, but the fix deliberately declines to act".
- Expected autofix output is CSS too — it belongs in the fixtures file, never inline in a spec.
- **Per-case rationale comments live in the fixtures file**, next to the snippet they explain. That
  is where `KNOWN BUG (Sn)` / `KNOWN LIMITATION (Sn)` annotations go, not in the spec.
- Specs iterate with `it.each(Object.entries(GROUP))` so loop-based invariants and individual cases
  derive from the same entries — adding a fixture cannot silently skip a check.
- Use `%s` on the entry **key** in `it.each` titles so the reporter shows `bareToken`, not a wrapped
  CSS string. Pass `name` into assertion messages (`` expect(x, `${name} …`) ``) so a failure says
  which fixture broke — and so `name` is never an unused variable.
- `index.spec.mjs` has a meta-test rejecting two fixture names holding an identical snippet. Keep it
  working; it is the guard against the duplication this file exists to prevent.

**Add fixtures first, then write the spec that consumes them.**

## The helper API

```js
const linter = createRuleLinter(plugin)   // plugin = a rule module's default export
linter.lint(code, { options })            // { warnings, messages, output } — NO autofix
linter.fix(code, { options })             // the rewritten source string
linter.lintAndFix(code, { options })      // messages from pass 1, output from pass 2
linter.messages / linter.meta / linter.ruleName
```

`lintCss(code, { rule, ruleName, fix, options, syntax })` is the primitive underneath. It is used
directly **only** in `index.spec.mjs`. Never bypass the helper to call `stylelint.lint` in a rule
spec — see mechanic 2.

## Five mechanics that will bite you

1. **Stylelint suppresses the warning once a fix runs.** `isFixApplied()` in
   `stylelint/lib/utils/report.mjs` invokes the `fix` callback and returns early *without* recording
   a warning. One `lint({ fix: true })` can therefore never assert both the message and the fixed
   output — hence `lintAndFix`'s two passes. This holds **even when the fix callback changes
   nothing** (that is why `standaloneInterpolation` asserts byte-identical source rather than
   "no fix ran").
2. **A fixture syntax error is NOT in `parseErrors`.** Stylelint reports `CssSyntaxError` as an
   ordinary `warnings[]` entry, so a typo'd fixture yields exactly one warning and silently
   satisfies a count assertion. `test/test-utils.mjs` filters warnings whose `rule !== ruleName` and
   throws. This is what `index.spec.mjs`'s "test helper" describe block guards.
3. **`customSyntax: 'postcss-scss'` is mandatory**, and is defaulted inside `lintCss` so no spec can
   forget it. Stylelint does not infer syntax from a filename (`getPostcssResult.mjs` is
   `customSyntax ?? cssSyntax()`). Without it, `color: #{$kui-x}`, `// line comments` and
   `#{$prop}:` all throw `CssSyntaxError`. `$var: value` and `--x: $kui-x` happen to parse either
   way.
4. **Assert message text via the rule's own `messages`**, never a retyped string — `ruleMessages()`
   appends ` (<ruleName>)` and the suffix must stay in sync. For a parameterised message, build
   expectations from `messages.unexpected(token, property)`, as `use-proper-token`'s `EXPECTED` map
   does.
5. **`meta.fixable` is load-bearing, not documentation.** `report()` *throws* if a rule passes a
   `fix` callback while `meta.fixable` is falsy. A non-fixable rule should still get a test
   asserting a `fix: true` pass leaves the source untouched.

## Per-rule reporting shapes differ — don't assume

- **`use-proper-token`** reports **once per offending token**, so one declaration can produce
  several warnings, all sharing the identical node range and differing only in `text`.
- **`token-var-usage`** reports **once per declaration** no matter how many tokens are wrong, and
  its single message never names the token.

A new rule's spec must *establish* which shape it has rather than copying either blindly. Use
`probe.mjs snippet` to find out.

## Two autofix invariants — keep them apart

A fixture the rule reports but deliberately does not fix can never become clean, so the two
invariants need different case sets. This is easy to get wrong.

- **Stable fixpoint** — every invalid fixture: `fix(fix(code)) === fix(code)`. This is what proves a
  buggy fix cannot grow without bound across repeated `--fix` runs.
- **No longer reports after fixing** — only fixtures where `output !== null`. Filter with
  `Object.entries(invalid).filter(([, { output }]) => output !== null)`.

Also assert `valid` fixtures survive a fix pass byte-identical.

## Probe: produce expected values, never predict them

Every expected value must be one the rule **produced**. `probe.mjs` is that tool. It imports
`test/test-utils.mjs` and `test/test-fixtures.mjs`, so its two-pass split and `CssSyntaxError` guard behave
exactly as a spec's do.

```bash
node .claude/skills/test-stylelint-plugin-design-tokens/probe.mjs help
```

| Command | Use |
|---|---|
| `snippet '<scss>'` | ad-hoc: messages + autofix per rule for one snippet. Start here when exploring a new edge case. |
| `record --rule R` | prints paste-ready `{ code, output }` for every invalid fixture, with the messages as comments. Write `{ code, output: null }` first, run this, paste what it prints. |
| `verify` | cross-checks recorded fixtures against live behavior — output drift, a `valid` fixture that reports, and both autofix invariants. Exit 1 on drift. Faster than vitest while iterating. |
| `tokens '<value>'` | `extractTokensFromValue()` on one CSS value |
| `map [property]` | query `PROPERTY_TOKEN_MAP`; no arg lists every enforced property |

`--rule use-proper-token|token-var-usage|all` (default `all`) on the first three. Snippets come from
argv or stdin, so a heredoc works for multi-line SCSS.

`record` renders multi-line snippets in the `[...].join('\n')` form the fixtures file already uses,
and prints `output: null` when the fix declines to act.

**When you add a rule, add a row to `RULES` in `probe.mjs`** (plugin module, fixture group,
`fixable`) or `record`/`verify` will not see it.

## Policy: pin current behavior, don't fix rules in a test PR

Standing decision from the repo owner. When a test reveals behavior that looks wrong:

1. Assert what the rule **actually does**.
2. Annotate the fixture with `KNOWN BUG (Sn)` / `KNOWN LIMITATION (Sn)`, naming the cause and the
   suggested fix.
3. Report it to the user for triage.

Never land a red suite. Fixing a pinned bug later is then a one-string edit to that fixture's
`output`.

### Current inventory of pinned issues

Recognise these instead of re-discovering them. Each one is annotated at its own fixture in
`test/test-fixtures.mjs` — grep `KNOWN BUG` / `KNOWN LIMITATION` there for the per-case reasoning.

| | Issue |
|---|---|
| **S1** | `token-var-usage` autofix double-wraps: `var(--kui-x,$kui-x)` → `var(--kui-x, var(--kui-x, $kui-x))`. The guard checks `primaryProperty.startsWith('--')`, which `--kui-*` also satisfies. Fix: `&& primaryProperty !== cssToken`. |
| **S2** | autofix emits broken CSS for `--custom-prop: $kui-x`. Sass never substitutes an SCSS variable inside a custom-property value, so the token survives verbatim. The interpolated form is required — the rule *accepts* it but never *produces* it. |
| **S3** | four inconsistent case-sensitivity behaviors. `extractTokensFromValue` uses the `gi` flag while callers' allow-list regexes do not, producing a `use-proper-token` false positive on uppercase tokens. Dropping the `i` flag is the clean fix. |
| **S4** | autofix rewrites `$var:` definitions and SCSS map literals, breaking downstream `map.get()` / `math.div()` / `darken()`. Needs a product decision. |
| **S5** | at-rule params are never inspected — both rules use only `walkDecls`. |
| **S6** | multi-line `var()` is collapsed onto one line. |
| **S7** | dead comma-split map lookup. |
| **S8** | the README documents a `disableFix` option no rule reads; options are never validated. |
| **S9** | `meta.url` 404s on both rules. |

## Plugin wiring facts

- `config.plugins` accepts **inline plugin objects** — non-string entries pass through
  `augmentConfig.mjs` untouched — so specs import the rule directly with no config file on disk.
- `index.mjs` default-exports an **array** of both plugins, and stylelint flattens a nested
  `plugins: [pluginsArray]`. That is the shape a real consumer's `plugins: ['@kong/…']` resolves to,
  and `index.spec.mjs` covers it.
- Rule names must contain `/` or stylelint rejects them as un-namespaced.

## Definition of done

1. **Suite green** — this package's `test` script.
2. **Lint clean** — its `lint` script. Style comes from the root flat config: **no semicolons**,
   single quotes, 2-space indent, trailing commas on multiline, `object-curly-spacing: always`.
3. **Mutation check.** A first-time suite that passes vacuously is worse than none. Temporarily
   break the rule under test, confirm the suite goes red, then restore. Verified examples:

   | Rule | Mutation that must turn the suite red |
   |---|---|
   | `use-proper-token` | `const inappropriateTokens = valueTokens.filter(() => false)` |
   | `token-var-usage` | `return true` as the first line of `isTokenProperlyWrapped` |

4. **No raw CSS literal left in any spec** — this must come back empty:

   ```bash
   grep -rn "'\.[a-z] {" --include='*.spec.mjs' .
   ```

5. **Nothing test-related is published.** `npm pack --dry-run` must list no `*.spec.mjs`,
   `test/test-utils.mjs` or `test/test-fixtures.mjs`. The `test-*.mjs` helpers sit at the package root
   (outside the `files` whitelist) for exactly this reason, and `files` carries
   `"!**/*.spec.mjs"`. **Do not co-locate helpers under `rules/`** — that directory is whitelisted.
6. **`node .claude/skills/test-stylelint-plugin-design-tokens/probe.mjs verify`** reports
   `all fixtures match live behavior`.

## Adding a brand-new rule

It must ship with tests. Order of work:

1. `rules/<name>/index.mjs` — `stylelint.createPlugin(ruleName, ruleFunction)`, `ruleName`
   namespaced with `/`, `meta.fixable` matching reality (mechanic 5).
2. Add it to the `index.mjs` default-export array, and update `index.spec.mjs`'s ruleName-order and
   `meta.fixable` assertions — both pin the exact array.
3. Add a `<NAME>` fixture group to `test/test-fixtures.mjs`, and register it in `index.spec.mjs`'s
   `fixtures` duplicate-detection `groups` map.
4. Add a row to `RULES` in `probe.mjs`.
5. Explore with `probe.mjs snippet`, record with `probe.mjs record`, then write
   `rules/<name>/index.spec.mjs` from whichever existing spec matches its fixability.
6. Run the definition-of-done list above, mutation check included.
