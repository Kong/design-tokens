/**
 * Every CSS/SCSS snippet used by this package's specs lives here, so that near-identical
 * fixtures cannot multiply across suites and so the `it.each` loops derive from the same
 * source as the individual cases.
 *
 * Shape:
 * - `valid` entries are plain strings (no warnings, and autofix must leave them untouched).
 * - `invalid` entries for a fixable rule are `{ code, output }`, where `output` is the
 *   verified autofix result and `null` means "reported, but deliberately left unchanged".
 *
 * Every `output` below was produced by running the rule, not predicted.
 */

export const USE_PROPER_TOKEN = {
  valid: {
    // Canonical happy path. Also proves the `--`/`$` spelling of one token dedupes to a
    // single extracted token rather than being checked (and reported) twice.
    colorTextOnColor: '.a { color: var(--kui-color-text-primary, $kui-color-text-primary); }',
    spaceOnPadding: '.a { padding: var(--kui-space-40, $kui-space-40); }',
    // Trailing `(?:-[a-z0-9-]+)?` group in the allow-list regex
    variantSuffix: '.a { color: $kui-color-text-primary-strong; }',
    // Leading `(?:[a-z0-9-]+-)?` component group AND the variant suffix in one token
    componentPrefixAndVariant: '.a { background-color: var(--kui-button-color-background-hover, $kui-button-color-background-hover); }',
    // Real shipped component tokens, not synthetic ones. All 342 shipped tokens were checked
    // against every mapped property: the greedy component-prefix group produces zero spurious
    // matches, so it does not need "hardening".
    methodComponentToken: '.a { background-color: $kui-method-color-background-get; }',
    navigationComponentToken: '.a { border-color: $kui-navigation-color-border; }',
    backgroundShorthand: '.a { background: $kui-color-background-danger; }',
    // Property with two allowed categories — this hits the second one
    breakpointOnWidth: '.a { width: $kui-breakpoint-tablet; }',
    shadowOnBoxShadow: '.a { box-shadow: $kui-shadow-md; }',
    // PROPERTY_TOKEN_MAP is an allow-list of *enforced* properties; anything absent is skipped
    unmappedProperty: '.a { transition: $kui-animation-duration-20; }',
    // Fails the `hasToken` gate, so the rule returns before the map lookup
    nonKongVariable: '.a { color: $my-custom-color; }',
    noVariable: '.a { color: red; }',
    // KNOWN LIMITATION (S5): both rules use only `walkDecls`, so at-rule params are invisible.
    // Pinned as not-covered so adding `walkAtRules` has to update this deliberately.
    atRuleParams: '.a { @include spacing($kui-space-40); }',
    // KNOWN LIMITATION (S3): `decl.prop` keeps its source case but PROPERTY_TOKEN_MAP keys are
    // lowercase, so an uppercase property name silently escapes enforcement.
    uppercasePropertyName: '.a { BACKGROUND-COLOR: $kui-space-40; }',
  },

  invalid: {
    // A text token on a background property — the README's own "incorrect usage" example
    textTokenBothSigils: '.a { background-color: var(--kui-color-text-primary, $kui-color-text-primary); }',
    textTokenCssSigil: '.a { background-color: var(--kui-color-text-primary); }',
    textTokenScssSigil: '.a { background-color: $kui-color-text-primary; }',
    // Properties mapped to `[]` reject *every* token: `appropriateTokens` is empty, so
    // `.some()` is vacuously false for anything extracted.
    spaceTokenOnTop: '.a { top: var(--kui-space-40, $kui-space-40); }',
    spaceTokenOnInset: '.a { inset: $kui-space-40; }',
    spaceTokenOnBackgroundSize: '.a { background-size: $kui-space-40; }',
    // Two distinct bad tokens in one declaration produce two separate warnings
    twoBadTokensOnColor: '.a { color: $kui-space-40 $kui-border-width-10; }',
    // ...but the same token twice is deduped to one
    sameBadTokenTwice: '.a { color: $kui-space-40 $kui-space-40; }',
    // The appropriate token is filtered out; only the inappropriate one reports
    mixedGoodAndBadOnPadding: '.a { padding: $kui-space-40 $kui-color-text-primary; }',
    // `height: ['icon-size']` only — spacing tokens are rejected there. Intentional, if surprising.
    spaceTokenOnHeight: '.a { height: $kui-space-40; }',
    // The `font-*` categories are not interchangeable
    fontSizeTokenOnFontFamily: '.a { font-family: $kui-font-size-30; }',
    // KNOWN BUG (S3): a false positive. `extractTokensFromValue` matches case-insensitively
    // (`gi`) and preserves the matched case, but the allow-list regexes are built without the
    // `i` flag, so an uppercase token can never match and is always reported.
    uppercaseToken: '.a { color: $kui-COLOR-TEXT-PRIMARY; }',
  },
}

export const TOKEN_VAR_USAGE = {
  valid: {
    wrapped: '.a { color: var(--kui-color-text-primary, $kui-color-text-primary); }',
    // The interpolated form, which is what a custom property actually needs
    wrappedInterpolatedCustomProperty: '.a { --vc-white: var(--kui-color-text-inverse, #{$kui-color-text-inverse}); }',
    wrappedInterpolatedStandardProperty: '.a { color: var(--kui-color-text-primary, #{$kui-color-text-primary}); }',
    twoWrappedTokens: '.a { margin: var(--kui-space-40, $kui-space-40) var(--kui-space-60, $kui-space-60); }',
    // The token is recognised even nested two parens deep
    nestedFallbackChain: '.a { color: var(--vc-a, var(--kui-color-text-primary, $kui-color-text-primary)); }',
    noVariable: '.a { color: red; }',
    nonKongVariable: '.a { color: $my-brand-color; }',
    // KNOWN LIMITATION (S3): the token regex is case-sensitive, so uppercase tokens are
    // invisible to this rule entirely — the opposite of how use-proper-token treats them.
    uppercaseToken: '.a { color: $KUI-COLOR-TEXT-PRIMARY; }',
    // KNOWN LIMITATION (S5): `walkDecls` never visits at-rule params
    atRuleParams: '.a { @include spacing($kui-space-40); }',
  },

  invalid: {
    // No enclosing `var(` at all — the `varStartIndex === -1` branch
    bareToken: {
      code: '.a { color: $kui-color-text-primary; }',
      output: '.a { color: var(--kui-color-text-primary, $kui-color-text-primary); }',
    },
    // KNOWN BUG (S1): the fix double-wraps. The guard at rules/token-var-usage/index.mjs:245
    // is commented as excluding "a kui- token reference" but only checks
    // `primaryProperty.startsWith('--')`, which `--kui-*` also satisfies. The output is valid
    // CSS and stable, but it is not the flat form the README advertises.
    // Suggested fix: `&& primaryProperty !== cssToken`.
    missingSpace: {
      code: '.a { color: var(--kui-color-text-primary,$kui-color-text-primary); }',
      output: '.a { color: var(--kui-color-text-primary, var(--kui-color-text-primary, $kui-color-text-primary)); }',
    },
    // Same S1 double-wrap via the extra-spaces path
    extraSpaces: {
      code: '.a { color: var(--kui-color-text-primary,  $kui-color-text-primary); }',
      output: '.a { color: var(--kui-color-text-primary, var(--kui-color-text-primary, $kui-color-text-primary)); }',
    },
    // Reported, but the fix deliberately bails so the developer picks the right form
    // (README limitation #2). Stylelint still treats the no-op callback as "fixed", which is
    // why this case asserts the source is byte-identical rather than asserting no fix ran.
    standaloneInterpolation: {
      code: '.a { color: #{$kui-color-text-primary}; }',
      output: null,
    },
    // The fallback-rewrite branch working as designed: a non-kui primary property is preserved
    nonKongPrimaryProperty: {
      code: '.a { color: var(--vc-white, $kui-color-text-inverse); }',
      output: '.a { color: var(--vc-white, var(--kui-color-text-inverse, $kui-color-text-inverse)); }',
    },
    // The `lastClosingParenBeforeToken > varStartIndex` guard stops the fix from swallowing
    // the already-closed `var(--x)` that precedes the token
    tokenAfterClosedVar: {
      code: '.a { margin: var(--x) $kui-space-40; }',
      output: '.a { margin: var(--x) var(--kui-space-40, $kui-space-40); }',
    },
    // Two offending tokens still produce only ONE warning — see the per-declaration note in the spec
    twoBareTokens: {
      code: '.a { margin: $kui-space-40 $kui-space-60; }',
      output: '.a { margin: var(--kui-space-40, $kui-space-40) var(--kui-space-60, $kui-space-60); }',
    },
    // Exercises the descending-sort offset logic when applying multiple replacements
    threeBareTokens: {
      code: '.a { padding: $kui-space-40 $kui-space-60 $kui-space-80; }',
      output: '.a { padding: var(--kui-space-40, $kui-space-40) var(--kui-space-60, $kui-space-60) var(--kui-space-80, $kui-space-80); }',
    },
    // The same token, one occurrence correct and one not: the correct one must be left alone
    sameTokenWrappedAndBare: {
      code: '.a { margin: var(--kui-space-40, $kui-space-40) $kui-space-40; }',
      output: '.a { margin: var(--kui-space-40, $kui-space-40) var(--kui-space-40, $kui-space-40); }',
    },
    mixedWrappedAndBareSiblings: {
      code: '.a { margin: var(--kui-space-40, $kui-space-40) $kui-space-60; }',
      output: '.a { margin: var(--kui-space-40, $kui-space-40) var(--kui-space-60, $kui-space-60); }',
    },
    shorthandWithLiteral: {
      code: '.a { border: 1px solid $kui-color-border; }',
      output: '.a { border: 1px solid var(--kui-color-border, $kui-color-border); }',
    },
    // README limitation #3 warns that complex expressions "may not be properly detected".
    // This one is handled correctly — pinned so a refactor cannot silently regress it.
    tokenInsideCalc: {
      code: '.a { width: calc(100% - $kui-space-40); }',
      output: '.a { width: calc(100% - var(--kui-space-40, $kui-space-40)); }',
    },
    nestedSelector: {
      code: '.a { &:hover { color: $kui-color-text-primary; } }',
      output: '.a { &:hover { color: var(--kui-color-text-primary, $kui-color-text-primary); } }',
    },
    // KNOWN BUG (S2): this fix emits broken CSS. Sass does not evaluate SCSS variables inside
    // custom property values, so the output compiles verbatim with `$kui-space-40` never
    // substituted — an invalid fallback. The interpolated form is what belongs here, and the
    // rule accepts it (see valid.wrappedInterpolatedCustomProperty) but never produces it.
    customPropertyDefinition: {
      code: '.a { --x: $kui-space-40; }',
      output: '.a { --x: var(--kui-space-40, $kui-space-40); }',
    },
    // KNOWN BUG (S4): `walkDecls` visits SCSS variable declarations and the rule has no
    // `decl.prop.startsWith('$')` guard, so definitions get rewritten too. Arguably useful
    // here, but it breaks the moment anyone writes `darken($alias, 10%)`.
    scssVariableDefinition: {
      code: '$alias: $kui-color-text-primary;',
      output: '$alias: var(--kui-color-text-primary, $kui-color-text-primary);',
    },
    // KNOWN BUG (S4), worse: the map value becomes an unquoted string, so `map.get()` returns
    // `var(...)` and any downstream `math.div()`, `darken()` or `+` fails to compile.
    scssMapLiteral: {
      code: '$spacing: (small: $kui-space-40);',
      output: '$spacing: (small: var(--kui-space-40, $kui-space-40));',
    },
    // KNOWN LIMITATION (S6, README limitation #1): a multi-line var() is collapsed onto one
    // line, because the fix reassembles it from `.trim()`ed parts. It also hits the S1 bug.
    multiLineVar: {
      code: [
        '.a {',
        '  font-size: var(',
        '    --kui-font-size-40,',
        '    $kui-font-size-40',
        '  );',
        '}',
      ].join('\n'),
      output: [
        '.a {',
        '  font-size: var(--kui-font-size-40, var(--kui-font-size-40, $kui-font-size-40));',
        '}',
      ].join('\n'),
    },
  },
}

/** Not valid CSS. Used only to prove the lint helper rejects malformed fixtures. */
export const MALFORMED = {
  unclosedBlock: '.a { color: red',
}

/** Values for the extractTokensFromValue unit tests. */
export const TOKEN_VALUES = {
  bothSigilsSameToken: 'var(--kui-color-text-primary, $kui-color-text-primary)',
  twoDistinctTokens: '$kui-space-40 $kui-space-60',
  uppercaseToken: '$kui-COLOR-TEXT-PRIMARY',
  uppercasePrefix: '$KUI-SPACE-40',
  surroundedByLiterals: '1px solid $kui-color-border',
  noToken: 'red',
}
