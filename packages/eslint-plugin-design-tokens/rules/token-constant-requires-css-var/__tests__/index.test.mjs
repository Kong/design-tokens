import { describe, it } from 'vitest'
import { RuleTester } from 'eslint'
import vueParser from 'vue-eslint-parser'
import * as tsParser from '@typescript-eslint/parser'
import rule from '../index.mjs'

// Wire up vitest's describe/it so RuleTester integrates with the vitest reporter
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

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

// SFC source helpers

/**
 * Builds a minimal `<script setup>` + `<template>` SFC string.
 * @param {object} [parts]
 * @param {string} [parts.script] - `<script setup>` body
 * @param {string} [parts.template] - `<template>` body
 * @param {string} [parts.lang] - Optional `lang` attribute (e.g. `'ts'`)
 */
function sfc({ script = '', template = '', lang } = {}) {
  return [
    `<script setup${lang ? ` lang="${lang}"` : ''}>`,
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
 * @param {string} [lang] - Optional `<script setup>` lang (e.g. `'ts'`)
 */
function withImport(varName, template, alias, lang) {
  const specifier = alias ? `${varName} as ${alias}` : varName
  return sfc({
    script: `import { ${specifier} } from '@kong/design-tokens'`,
    template,
    lang,
  })
}

/** TypeScript variant of {@link sfc} (`<script setup lang="ts">`). */
function sfcTs({ script = '', template = '' } = {}) {
  return sfc({ script, template, lang: 'ts' })
}

/**
 * TypeScript variant of {@link withImport} (`<script setup lang="ts">`).
 * @param {string} varName - The exported constant name (e.g. `KUI_COLOR_TEXT_INVERSE`)
 * @param {string} template - The `<template>` body
 * @param {string} [alias] - Optional local alias (`import { varName as alias }`)
 */
function withImportTs(varName, template, alias) {
  return withImport(varName, template, alias, 'ts')
}

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

    /**
     * MemberExpression property name — KUI token is the key, not the value reference.
     * `walkExpression` only walks the object side of a MemberExpression, not the property.
     */
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

    /**
     * Idempotency with import alias — the CSS var is derived from the canonical imported
     * name, not the local alias, so the already-wrapped form must be recognised as valid.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${myColor})`" />',
        'myColor',
      ),
    },

    /**
     * Idempotency is whitespace-tolerant — extra spaces inside var() are valid CSS
     * and must not cause a false re-report after a developer manually writes the binding.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var( --kui-color-text-inverse , ${KUI_COLOR_TEXT_INVERSE} )`" />',
      ),
    },

    /**
     * Options API `<script>` (no setup attribute) — module-scope KUI aliases must not
     * be tracked because they are not directly accessible in the template; the template
     * `myColor` refers to a prop/data/computed property, not the module-level const.
     */
    {
      filename: 'test.vue',
      code: [
        '<script>',
        "import { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
        'const myColor = KUI_COLOR_TEXT_INVERSE',
        "export default { props: ['myColor'] }",
        '</script>',
        '<template>',
        '<div :color="myColor" />',
        '</template>',
      ].join('\n'),
    },

    /**
     * KUI_BREAKPOINT_* tokens are excluded — they are viewport pixel widths, not CSS
     * custom properties, so DOM-level theming does not apply.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_BREAKPOINT_PHABLET',
        '<div :style="{ maxWidth: KUI_BREAKPOINT_PHABLET }" />',
      ),
    },

    // KUI_BREAKPOINT_* with alias — exclusion covers the canonical imported name
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_BREAKPOINT_PHABLET',
        '<div :style="{ maxWidth: bp }" />',
        'bp',
      ),
    },

    /**
     * Shadowing: a `v-for` item that happens to share a token's name resolves to
     * the loop variable, not the import, so it must not be flagged.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div v-for="KUI_COLOR_TEXT_INVERSE in colors" :key="KUI_COLOR_TEXT_INVERSE" :color="KUI_COLOR_TEXT_INVERSE" />',
      ),
    },

    /**
     * Shadowing: a scoped-slot prop that shares a token's name resolves to the
     * slot variable, not the import.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<Comp><template #default="{ KUI_COLOR_TEXT_INVERSE }"><div :color="KUI_COLOR_TEXT_INVERSE" /></template></Comp>',
      ),
    },

    /**
     * Script-setup alias already wrapped with correct CSS var — theming works,
     * so this is idempotent and must not be reported.
     */
    {
      filename: 'test.vue',
      code: sfc({
        script: [
          "import { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
          'const myColor = KUI_COLOR_TEXT_INVERSE',
        ].join('\n'),
        template: '<div :color="`var(--kui-color-text-inverse, ${myColor})`" />',
      }),
    },

    /**
     * Function-scoped `const local = KUI_X` must not be tracked — template binding
     * uses a different `myColor` (e.g. from a prop) and this would be a false positive.
     */
    {
      filename: 'test.vue',
      code: sfc({
        script: [
          "import { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
          'function helper() { const myColor = KUI_COLOR_TEXT_INVERSE; return myColor }',
        ].join('\n'),
        template: '<div :color="myColor" />',
      }),
    },

    // Idempotency across token families — the rule must not re-report already-fixed bindings
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_FONT_SIZE_30',
        '<div :style="{ fontSize: `var(--kui-font-size-30, ${KUI_FONT_SIZE_30})` }" />',
      ),
    },

    // Idempotency for multiple tokens in one object — both slots already wrapped
    {
      filename: 'test.vue',
      code: sfc({
        script: "import { KUI_SPACE_40, KUI_BORDER_RADIUS_20 } from '@kong/design-tokens'",
        template: '<div :style="{ padding: `var(--kui-space-40, ${KUI_SPACE_40})`, borderRadius: `var(--kui-border-radius-20, ${KUI_BORDER_RADIUS_20})` }" />',
      }),
    },
  ],

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

    /**
     * Object shorthand property { KUI_X } — fixer must expand to { KUI_X: `var(...)` }
     * because replacing only the identifier drops the key and yields invalid JS.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div v-bind="{ KUI_COLOR_TEXT_INVERSE }" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div v-bind="{ KUI_COLOR_TEXT_INVERSE: `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` }" />',
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
      errors: [{ messageId: 'wrapInVarNoFix', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    // Token family coverage — same autofix transform applies to all KUI_ prefixes

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

    // REPORT_ONLY — no autofix because rewriting would change expression semantics

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

    /**
     * Multi-token TemplateLiteral — both tokens reported, no autofix. Adjacent slots
     * share quasi boundaries (quasis[1] is simultaneously the suffix of slot 0 and the
     * prefix of slot 1), so per-token replacement ranges overlap. ESLint rejects
     * overlapping fixes; a whole-template rewrite would be needed instead.
     * Manual fix: `:padding="'var(--kui-space-0, ' + KUI_SPACE_0 + ') var(--kui-space-70, ' + KUI_SPACE_70 + ')'"`.
     */
    {
      filename: 'test.vue',
      code: sfc({
        script: "import { KUI_SPACE_0, KUI_SPACE_70 } from '@kong/design-tokens'",
        template: '<div :padding="`${KUI_SPACE_0} ${KUI_SPACE_70}`" />',
      }),
      errors: [
        { messageId: 'wrapInVarNoFix', data: { local: 'KUI_SPACE_0', cssVar: 'kui-space-0' } },
        { messageId: 'wrapInVarNoFix', data: { local: 'KUI_SPACE_70', cssVar: 'kui-space-70' } },
      ],
      output: null,
    },

    /**
     * Mismatched CSS var: wraps the token with the WRONG custom property.
     * `var(--kui-color-text-primary, ${KUI_COLOR_TEXT_INVERSE})` must be caught
     * because the theme override targets the wrong property and theming will not work.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-primary, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
      errors: [{ messageId: 'wrapInVarNoFix', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    /**
     * Mismatched CSS var with import alias — alias resolves to the canonical imported name,
     * so the wrong var is still caught even when a local alias is used.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-primary, ${myColor})`" />',
        'myColor',
      ),
      errors: [{ messageId: 'wrapInVarNoFix', data: { local: 'myColor', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    /**
     * Token nested inside a TemplateLiteral slot expression (not a direct Identifier).
     * `asDirectIdentifier` returns null for the ConditionalExpression, so the slot
     * context is NOT passed and idempotency is not checked — the nested token is always reported.
     */
    {
      filename: 'test.vue',
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${cond ? KUI_COLOR_TEXT_INVERSE : \'red\'})`" />',
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

/**
 * TypeScript SFCs — requires a second RuleTester that delegates <script lang="ts">
 * to @typescript-eslint/parser, which produces TS-specific AST nodes (TSAsExpression,
 * TSNonNullExpression, importKind) that the rule handles explicitly.
 */
const tsTester = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
})

tsTester.run(`${RULE_NAME} (TypeScript)`, rule, {
  valid: [
    // `import type { KUI_X }` — declaration-level type-only import is not tracked
    {
      filename: 'test.vue',
      code: sfcTs({
        script: "import type { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
        template: '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      }),
    },

    // `${KUI_X as string}` in an already-correct var() slot — idempotency through a TS cast
    {
      filename: 'test.vue',
      code: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE as string})`" />',
      ),
    },

    // `${KUI_X satisfies T}` in an already-correct var() slot — idempotency through `satisfies`
    {
      filename: 'test.vue',
      code: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE satisfies string})`" />',
      ),
    },
  ],

  invalid: [
    // TSAsExpression — autofix unwraps the cast to reach the identifier; cast is preserved in output
    {
      filename: 'test.vue',
      code: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE as string" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` as string" />',
      ),
    },

    // TSNonNullExpression — autofix unwraps `!`; non-null assertion is preserved in output
    {
      filename: 'test.vue',
      code: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE!" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`!" />',
      ),
    },

    // TSSatisfiesExpression — autofix unwraps `satisfies`; the satisfies clause is preserved
    {
      filename: 'test.vue',
      code: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE satisfies string" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` satisfies string" />',
      ),
    },

    /**
     * One-hop alias with a TS `satisfies` initializer — the wrapper must be unwrapped
     * so the alias is tracked and the template binding is reported.
     */
    {
      filename: 'test.vue',
      code: sfcTs({
        script: [
          "import { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
          'const myColor = KUI_COLOR_TEXT_INVERSE satisfies string',
        ].join('\n'),
        template: '<div :color="myColor" />',
      }),
      errors: [{ messageId: 'wrapInVarScriptSetup', data: { imported: 'KUI_COLOR_TEXT_INVERSE', local: 'myColor', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    // `${KUI_X as string}` in a var() slot with the WRONG custom property — still caught
    {
      filename: 'test.vue',
      code: withImportTs(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-primary, ${KUI_COLOR_TEXT_INVERSE as string})`" />',
      ),
      errors: [{ messageId: 'wrapInVarNoFix', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    // Mixed import `{ KUI_SPACE_40, type KUI_COLOR_TEXT_INVERSE }` — only the value specifier is reported
    {
      filename: 'test.vue',
      code: sfcTs({
        script: "import { KUI_SPACE_40, type KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
        template: '<div :style="{ padding: KUI_SPACE_40, color: KUI_COLOR_TEXT_INVERSE }" />',
      }),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_SPACE_40', cssVar: 'kui-space-40' } }],
      output: sfcTs({
        script: "import { KUI_SPACE_40, type KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
        template: '<div :style="{ padding: `var(--kui-space-40, ${KUI_SPACE_40})`, color: KUI_COLOR_TEXT_INVERSE }" />',
      }),
    },

    /**
     * One-hop alias with a TS `as` cast initializer — the wrapper must be unwrapped
     * so the alias is still tracked and the template binding is reported.
     */
    {
      filename: 'test.vue',
      code: sfcTs({
        script: [
          "import { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
          'const myColor = KUI_COLOR_TEXT_INVERSE as string',
        ].join('\n'),
        template: '<div :color="myColor" />',
      }),
      errors: [{ messageId: 'wrapInVarScriptSetup', data: { imported: 'KUI_COLOR_TEXT_INVERSE', local: 'myColor', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },

    /**
     * One-hop alias with a TS non-null `!` initializer — same unwrapping requirement.
     */
    {
      filename: 'test.vue',
      code: sfcTs({
        script: [
          "import { KUI_COLOR_TEXT_INVERSE } from '@kong/design-tokens'",
          'const myColor = KUI_COLOR_TEXT_INVERSE!',
        ].join('\n'),
        template: '<div :color="myColor" />',
      }),
      errors: [{ messageId: 'wrapInVarScriptSetup', data: { imported: 'KUI_COLOR_TEXT_INVERSE', local: 'myColor', cssVar: 'kui-color-text-inverse' } }],
      output: null,
    },
  ],
})

// Note: TSTypeAssertion (`<Type>expr` syntax) is NOT tested. In a Vue template
// attribute expression `:<prop>="<Type>expr"`, the parser sees `<Type>` as an
// HTML open-tag rather than a cast, making this syntax unreachable in the binding
// context where the rule runs. The TSAsExpression and TSNonNullExpression cases
// above already exercise the shared unwrap code path in both walkExpression and
// asDirectIdentifier.

/**
 * Shorthand for an SFC that imports one token from `@kong/portal-design-tokens`.
 * @param {string} varName - The exported constant name (e.g. `KUI_COLOR_TEXT_INVERSE`)
 * @param {string} template - The `<template>` body
 */
function withPortalImport(varName, template) {
  return sfc({
    script: `import { ${varName} } from '@kong/portal-design-tokens'`,
    template,
  })
}

/**
 * importSources option — controls which packages the rule tracks token imports from.
 * Default: ['@kong/design-tokens', '@kong/portal-design-tokens']
 */
tester.run(`${RULE_NAME} (importSources option)`, rule, {
  valid: [
    // Default options: import from @kong/portal-design-tokens IS tracked — already wrapped is valid
    {
      filename: 'test.vue',
      code: withPortalImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // importSources restricted to @kong/design-tokens only — portal import is NOT tracked (no error)
    {
      filename: 'test.vue',
      options: [{ importSources: ['@kong/design-tokens'] }],
      code: withPortalImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      ),
    },

    // importSources restricted to @kong/portal-design-tokens only — design-tokens import is NOT tracked
    {
      filename: 'test.vue',
      options: [{ importSources: ['@kong/portal-design-tokens'] }],
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      ),
    },
  ],

  invalid: [
    // Default options: import from @kong/portal-design-tokens IS flagged (same as @kong/design-tokens)
    {
      filename: 'test.vue',
      code: withPortalImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: withPortalImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // importSources: ['@kong/portal-design-tokens'] — portal import IS flagged, design-tokens is NOT
    {
      filename: 'test.vue',
      options: [{ importSources: ['@kong/portal-design-tokens'] }],
      code: withPortalImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      ),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: withPortalImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      ),
    },

    // Fully custom importSources: ['my-company/design-tokens'] — only that source is tracked
    {
      filename: 'test.vue',
      options: [{ importSources: ['my-company/design-tokens'] }],
      code: sfc({
        script: "import { KUI_COLOR_TEXT_INVERSE } from 'my-company/design-tokens'",
        template: '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      }),
      errors: [{ messageId: 'wrapInVar', data: { local: 'KUI_COLOR_TEXT_INVERSE', cssVar: 'kui-color-text-inverse' } }],
      output: sfc({
        script: "import { KUI_COLOR_TEXT_INVERSE } from 'my-company/design-tokens'",
        template: '<div :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />',
      }),
    },
  ],
})

// Fully custom importSources: ['my-company/design-tokens'] — @kong/design-tokens is NOT tracked
tester.run(`${RULE_NAME} (fully custom importSources — kong package not tracked)`, rule, {
  valid: [
    {
      filename: 'test.vue',
      options: [{ importSources: ['my-company/design-tokens'] }],
      code: withImport(
        'KUI_COLOR_TEXT_INVERSE',
        '<div :color="KUI_COLOR_TEXT_INVERSE" />',
      ),
    },
  ],
  invalid: [],
})
