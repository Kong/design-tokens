import { describe, it } from 'vitest'
import { RuleTester } from 'eslint'
import vueParser from 'vue-eslint-parser'
import rule from '../index.mjs'

// Wire up vitest's describe/it so RuleTester integrates with the vitest reporter
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it

const tester = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
})

const RULE_NAME = '@kong/design-tokens/token-constant-requires-css-var'

// ---------------------------------------------------------------------------
// SFC source helpers
// ---------------------------------------------------------------------------

/** Builds a minimal `<script setup>` + `<template>` SFC string. */
function sfc({ script = '', template = '' } = {}) {
  return [
    '<script setup>',
    script.trim(),
    '</script>',
    '<template>',
    template.trim(),
    '</template>',
  ].join('\n')
}

/**
 * Shorthand for an SFC that imports one token from `@kong/design-tokens`.
 * @param {string} varName - The exported constant name (e.g. `KUI_COLOR_TEXT_INVERSE`)
 * @param {string} template - The `<template>` body
 * @param {string} [alias] - Optional local alias (`import { varName as alias }`)
 */
function withImport(varName, template, alias) {
  const specifier = alias ? `${varName} as ${alias}` : varName
  return sfc({
    script: `import { ${specifier} } from '@kong/design-tokens'`,
    template,
  })
}

// ---------------------------------------------------------------------------
// Valid cases — must produce zero errors
// ---------------------------------------------------------------------------
tester.run(RULE_NAME, rule, {
  valid: [
    // Already properly wrapped — idempotency check
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // Already wrapped inside a ternary branch
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        "<div :color=\"cond ? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` : 'red'\" />",
      ),
    },

    // Identifier not imported from @kong/design-tokens
    {
      filename: 'test.vue',
      code: sfc({
        script: "const myColor = '#fff'",
        template: '<div :color="myColor" />',
      }),
    },

    // Import from a different package — not tracked
    {
      filename: 'test.vue',
      code: sfc({
        script: "import { KUI_COLOR_TEXT_INVERSE } from 'other-package'",
        template: '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      }),
    },

    // KUI token in v-if — not a v-bind style value
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div v-if="KUI_COLOR_TEXT_INVERSE" />',
      ),
    },

    // KUI token in mustache interpolation — not a v-bind
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div>{{ KUI_COLOR_TEXT_INVERSE }}</div>',
      ),
    },

    // Namespace import — not individually tracked
    {
      filename: 'test.vue',
      code: sfc({
        script: "import * as tokens from '@kong/design-tokens'",
        template: '<div :color="tokens.KUI_COLOR_TEXT_INVERSE" />',
      }),
    },

    // Static (non-binding) attribute — no colon
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div color="someStaticValue" />',
      ),
    },

    // v-on directive — not a v-bind, never visited by the rule
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div @click="handler(KUI_COLOR_TEXT_INVERSE)" />',
      ),
    },

    // MemberExpression property name — KUI token is the key, not the value reference
    // `walkExpression` only walks the object side of a MemberExpression, not the property.
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="theme.KUI_COLOR_TEXT_INVERSE" />',
      ),
    },

    // Partially wrapped ternary — the already-wrapped branch is idempotent (no re-report)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="cond ? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` : `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — must report errors (with or without autofix)
  // ---------------------------------------------------------------------------
  invalid: [
    // Simple: bare identifier as the whole binding expression
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // Import alias: CSS var uses canonical name, fallback uses local alias
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="myColor" />',
        'myColor',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'myColor', cssVar: 'kui-color-text-inverse' } }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${myColor})`" />',
        'myColor',
      ),
    },

    // Ternary: both branches are the same KUI token — two separate fixes
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="cond ? KUI_COLOR_TEXT_INVERSE : KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar' }, { messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="cond ? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` : `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // Ternary: two DIFFERENT KUI tokens in consequent and alternate — independent CSS vars
    {
      filename: 'test.vue',
      code: sfc({
        script: "import { KUI_COLOR_TEXT_INVERSE, KUI_COLOR_BACKGROUND_PRIMARY } from '@kong/design-tokens'",
        template: '<div :color="cond ? KUI_COLOR_TEXT_INVERSE : KUI_COLOR_BACKGROUND_PRIMARY" />',
      }),
      errors: [
        { messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } },
        { messageId: 'wrapInVar', data: { local: 'KUI_COLOR_BACKGROUND_PRIMARY', cssVar: 'kui-color-background-primary' } },
      ],
      output: sfc({
        script: "import { KUI_COLOR_TEXT_INVERSE, KUI_COLOR_BACKGROUND_PRIMARY } from '@kong/design-tokens'",
        template: '<div :color="cond ? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` : `var(--kui-color-background-primary, ${KUI_COLOR_BACKGROUND_PRIMARY})`" />',
      }),
    },

    // Partially wrapped ternary: only the unwrapped branch is reported and fixed
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="cond ? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` : KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="cond ? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` : `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // Object: `:style="{ color: KUI_X }"`
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :style="{ color: KUI_COLOR_TEXT_INVERSE }" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :style="{ color: `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` }" />',
      ),
    },

    // Object with two KUI values — both fixed in a single pass
    {
      filename: 'test.vue',
      code: sfc({
        script: "import { KUI_COLOR_TEXT_INVERSE, KUI_COLOR_BACKGROUND_PRIMARY } from '@kong/design-tokens'",
        template: '<div :style="{ color: KUI_COLOR_TEXT_INVERSE, background: KUI_COLOR_BACKGROUND_PRIMARY }" />',
      }),
      errors: [{ messageId: 'wrapInVar' }, { messageId: 'wrapInVar' }],
      output: sfc({
        script: "import { KUI_COLOR_TEXT_INVERSE, KUI_COLOR_BACKGROUND_PRIMARY } from '@kong/design-tokens'",
        template: '<div :style="{ color: `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`, background: `var(--kui-color-background-primary, ${KUI_COLOR_BACKGROUND_PRIMARY})` }" />',
      }),
    },

    // Array element
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :style="[baseStyle, KUI_COLOR_TEXT_INVERSE]" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :style="[baseStyle, `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`]" />',
      ),
    },

    // LogicalExpression (??) — autofix the right-hand operand
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="theme.color ?? KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="theme.color ?? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // LogicalExpression (||) — autofix the right-hand operand
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="theme.color || KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="theme.color || `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // Dynamic argument (:[propName])
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :[propName]="KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :[propName]="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // v-bind without argument (object spread syntax)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div v-bind="{ color: KUI_COLOR_TEXT_INVERSE }" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div v-bind="{ color: `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` }" />',
      ),
    },

    // SequenceExpression — last element gets AUTOFIX context; earlier ones are REPORT_ONLY
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="(sideEffect(), KUI_COLOR_TEXT_INVERSE)" />',
      ),
      errors: [{ messageId: 'wrapInVar' }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="(sideEffect(), `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`)" />',
      ),
    },

    // AssignmentExpression — always REPORT_ONLY (wrapping the assigned value changes semantics)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="(x = KUI_COLOR_TEXT_INVERSE)" />',
      ),
      errors: [{ messageId: 'wrapInVarNoFix' }],
      output: null,
    },

    // ---------------------------------------------------------------------------
    // Token family coverage — same autofix transform applies to all KUI_ prefixes
    // ---------------------------------------------------------------------------

    // KUI_FONT_SIZE — typography scale tokens
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_FONT_SIZE_30',
        '<div :style="{ fontSize: KUI_FONT_SIZE_30 }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_FONT_SIZE_30', cssVar: 'kui-font-size-30' } }],
      output: withImport(
        'KUI_FONT_SIZE_30',
        '<div :style="{ fontSize: `var(--kui-font-size-30, ${KUI_FONT_SIZE_30})` }" />',
      ),
    },

    // KUI_BORDER_RADIUS — shape tokens
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_BORDER_RADIUS_20',
        '<div :style="{ borderRadius: KUI_BORDER_RADIUS_20 }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_BORDER_RADIUS_20', cssVar: 'kui-border-radius-20' } }],
      output: withImport(
        'KUI_BORDER_RADIUS_20',
        '<div :style="{ borderRadius: `var(--kui-border-radius-20, ${KUI_BORDER_RADIUS_20})` }" />',
      ),
    },

    // KUI_FONT_WEIGHT — weight scale tokens
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_FONT_WEIGHT_BOLD',
        '<div :style="{ fontWeight: KUI_FONT_WEIGHT_BOLD }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_FONT_WEIGHT_BOLD', cssVar: 'kui-font-weight-bold' } }],
      output: withImport(
        'KUI_FONT_WEIGHT_BOLD',
        '<div :style="{ fontWeight: `var(--kui-font-weight-bold, ${KUI_FONT_WEIGHT_BOLD})` }" />',
      ),
    },

    // KUI_LINE_HEIGHT — line height tokens
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_LINE_HEIGHT_40',
        '<div :style="{ lineHeight: KUI_LINE_HEIGHT_40 }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_LINE_HEIGHT_40', cssVar: 'kui-line-height-40' } }],
      output: withImport(
        'KUI_LINE_HEIGHT_40',
        '<div :style="{ lineHeight: `var(--kui-line-height-40, ${KUI_LINE_HEIGHT_40})` }" />',
      ),
    },

    // KUI_Z_INDEX — z-index tokens
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_Z_INDEX_10',
        '<div :style="{ zIndex: KUI_Z_INDEX_10 }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_Z_INDEX_10', cssVar: 'kui-z-index-10' } }],
      output: withImport(
        'KUI_Z_INDEX_10',
        '<div :style="{ zIndex: `var(--kui-z-index-10, ${KUI_Z_INDEX_10})` }" />',
      ),
    },

    // KUI_SPACE — spacing tokens (also confirms numeric suffix handling)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_SPACE_40',
        '<div :style="{ padding: KUI_SPACE_40 }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_SPACE_40', cssVar: 'kui-space-40' } }],
      output: withImport(
        'KUI_SPACE_40',
        '<div :style="{ padding: `var(--kui-space-40, ${KUI_SPACE_40})` }" />',
      ),
    },

    // KUI_BREAKPOINT — breakpoint tokens (word-only suffix, no numbers)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_BREAKPOINT_PHABLET',
        '<div :style="{ maxWidth: KUI_BREAKPOINT_PHABLET }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_BREAKPOINT_PHABLET', cssVar: 'kui-breakpoint-phablet' } }],
      output: withImport(
        'KUI_BREAKPOINT_PHABLET',
        '<div :style="{ maxWidth: `var(--kui-breakpoint-phablet, ${KUI_BREAKPOINT_PHABLET})` }" />',
      ),
    },

    // ---------------------------------------------------------------------------
    // REPORT_ONLY — no autofix because rewriting would change expression semantics
    // ---------------------------------------------------------------------------

    // Inside TemplateLiteral (no autofix: would nest backticks)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`${KUI_COLOR_TEXT_INVERSE}`" />',
      ),
      errors: [{ messageId: 'wrapInVarNoFix', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    // BinaryExpression (no autofix: changes string semantics)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        "<div :color=\"KUI_COLOR_TEXT_INVERSE + '!important'\" />",
      ),
      errors: [{ messageId: 'wrapInVarNoFix', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    // CallExpression argument (no autofix: could break color helpers like darken/rgba)
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="darken(KUI_COLOR_TEXT_INVERSE)" />',
      ),
      errors: [{ messageId: 'wrapInVarNoFix', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    // Script-setup variable (`const c = KUI_X`) — detected, no autofix
    {
      filename: 'test.vue',
      code: sfc({
        script: [
          "import { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
          'const myColor = KUI_COLOR_TEXT_INVERSE',
        ].join('\n'),
        template: '<div :color="myColor" />',
      }),
      errors: [{ messageId: 'wrapInVarScriptSetup', data: { imported: 'KUI_COLOR_TEXT_INVERSE', local: 'myColor', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },
  ],
})

// ---------------------------------------------------------------------------
// Idempotency: the fixer output must itself be a valid (no-error) input.
// tester.run() must be called at the top level (not inside it()) because it
// internally calls describe() which vitest forbids inside test blocks.
// ---------------------------------------------------------------------------
tester.run(`${RULE_NAME} (idempotency)`, rule, {
  valid: [
    {
      filename: 'test.vue',
      name: 'does not re-report already-fixed color token',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },
    {
      filename: 'test.vue',
      name: 'does not re-report already-fixed font-size token',
      code: withImport(
        'KUI_FONT_SIZE_30',
        '<div :style="{ fontSize: `var(--kui-font-size-30, ${KUI_FONT_SIZE_30})` }" />',
      ),
    },
    {
      filename: 'test.vue',
      name: 'does not re-report already-fixed space token inside object',
      code: sfc({
        script: "import { KUI_SPACE_40, KUI_BORDER_RADIUS_20 } from '@kong/design-tokens'",
        template: '<div :style="{ padding: `var(--kui-space-40, ${KUI_SPACE_40})`, borderRadius: `var(--kui-border-radius-20, ${KUI_BORDER_RADIUS_20})` }" />',
      }),
    },
  ],
  invalid: [],
})

// ---------------------------------------------------------------------------
// TypeScript note
// ---------------------------------------------------------------------------
// `import type { KUI_X }` (type-only imports with no runtime value) are skipped
// by the rule via `importKind === 'type'`. Testing that branch requires
// @typescript-eslint/parser as the script-block parser for vue-eslint-parser,
// which would add an extra devDependency. That coverage is left to integration
// tests in the consumer project.
