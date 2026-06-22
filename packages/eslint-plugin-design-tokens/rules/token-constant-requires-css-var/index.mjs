import {
  DEFAULT_IMPORT_SOURCES,
  KUI_IDENTIFIER_PATTERN,
  kuiIdentifierToCssVar,
} from '../../utilities/index.mjs'

/** Identifier can be safely auto-fixed in this expression position. */
const AUTOFIX = 'fix'

/** Identifier must be reported but cannot be auto-fixed without changing semantics. */
const REPORT_ONLY = 'report'

/**
 * Token name prefix that is excluded from this rule.
 * `KUI_BREAKPOINT_*` constants represent viewport breakpoints (pixel widths).
 * CSS custom properties are not valid inside a `@media` query, so shouldn't be enforced with a var() fallback.
 */
const KUI_EXCLUDED_PREFIX = 'KUI_BREAKPOINT_'

/**
 * TypeScript "transparent" wrapper node types — present when @typescript-eslint/parser
 * parses the SFC `<script>` block. They wrap an inner expression without changing its
 * runtime value, so the rule unwraps them to reach the underlying Identifier.
 * These types are not in the estree Node union, so callers compare against a widened string.
 *
 * @param {string} nodeType
 * @returns {boolean}
 */
function isTsWrapperType(nodeType) {
  return nodeType === 'TSAsExpression' // `x as T`
    || nodeType === 'TSSatisfiesExpression' // `x satisfies T`
    || nodeType === 'TSNonNullExpression' // `x!`
    || nodeType === 'TSTypeAssertion' // `<T>x`
}

/**
 * Returns `true` when the TemplateLiteral expression slot at `exprIndex` is
 * already in the form `` `var(<expectedCssVar>, ${IDENTIFIER})` `` for the
 * specific token, so we can skip it on subsequent lint passes (idempotency).
 *
 * Requires the exact CSS var name so that a mismatched wrapper such as
 * `` `var(--kui-color-text-primary, ${KUI_COLOR_TEXT_INVERSE})` `` is NOT
 * treated as already-wrapped and continues to be reported.
 *
 * @param {import('estree').TemplateLiteral} templateNode
 * @param {number} exprIndex - Index of the expression slot to inspect
 * @param {string} expectedCssVar - Full CSS custom property name, e.g. `--kui-color-text-inverse`
 * @returns {boolean}
 */
function isAlreadyWrappedSlot(templateNode, exprIndex, expectedCssVar) {
  const priorText = templateNode.quasis[exprIndex]?.value?.cooked ?? ''
  const nextText = templateNode.quasis[exprIndex + 1]?.value?.cooked ?? ''
  const escaped = expectedCssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  /**
   * Allow optional whitespace after `var(`, around the custom property name, and
   * before the comma — CSS is whitespace-tolerant in these positions. trimStart()
   * before startsWith(')') keeps permissiveness for trailing content like
   * `) !important` while also accepting a space before the closing paren.
   */
  return new RegExp(`var\\(\\s*${escaped}\\s*,\\s*$`).test(priorText) && nextText.trimStart().startsWith(')')
}

/**
 * If `node` is directly an Identifier — or an Identifier wrapped only in
 * TypeScript transparent wrappers (see `isTsWrapperType`) — returns that
 * Identifier. Otherwise returns `null`.
 *
 * Used to detect the case where a TemplateLiteral slot's expression is a bare
 * token reference so the caller can supply parent-template context for the
 * token-specific idempotency check.
 *
 * @param {import('estree').Node} node
 * @returns {import('estree').Identifier | null}
 */
function asDirectIdentifier(node) {
  if (isTsWrapperType(/** @type {string} */ (node.type))) {
    return asDirectIdentifier(/** @type {{ expression: import('estree').Node }} */ (node).expression)
  }
  return node.type === 'Identifier' ? /** @type {import('estree').Identifier} */ (node) : null
}

/**
 * Recursively walks a v-bind expression tree, calling `onIdentifier` for each
 * `Identifier` node that should be inspected for KUI token usage.
 *
 * The `ctx` parameter propagates through the tree and is downgraded from
 * `AUTOFIX` to `REPORT_ONLY` when entering contexts where replacing an
 * Identifier with a backtick template literal would be unsafe (e.g. inside an
 * existing TemplateLiteral, a BinaryExpression, or a CallExpression argument).
 *
 * @param {import('estree').Node | null | undefined} node - Current AST node
 * @param {string} ctx - Either `AUTOFIX` or `REPORT_ONLY`
 * @param {(id: import('estree').Identifier, ctx: string, slot?: { parentTemplate?: import('estree').TemplateLiteral, slotIndex?: number, parentShorthandProp?: import('estree').Property }) => void} onIdentifier
 */
function walkExpression(node, ctx, onIdentifier) {
  if (!node) return

  /**
   * Unwrap TypeScript transparent wrappers (e.g. `KUI_X as string`, `KUI_X!`),
   * preserving the current autofix/report context.
   */
  if (isTsWrapperType(/** @type {string} */ (node.type))) {
    walkExpression(/** @type {{ expression: import('estree').Node }} */ (node).expression, ctx, onIdentifier)
    return
  }

  switch (node.type) {
    case 'Identifier':
      onIdentifier(/** @type {import('estree').Identifier} */ (node), ctx)
      break

    case 'ConditionalExpression': {
      const n = /** @type {import('estree').ConditionalExpression} */ (node)
      /** Walk value branches only; the boolean test is not a style value. */
      walkExpression(n.consequent, ctx, onIdentifier)
      walkExpression(n.alternate, ctx, onIdentifier)
      break
    }

    case 'LogicalExpression': {
      const n = /** @type {import('estree').LogicalExpression} */ (node)
      walkExpression(n.left, ctx, onIdentifier)
      walkExpression(n.right, ctx, onIdentifier)
      break
    }

    case 'ObjectExpression': {
      const n = /** @type {import('estree').ObjectExpression} */ (node)
      for (const prop of n.properties) {
        if (prop.type !== 'Property') continue
        /** SpreadElement is not walked — shape is unknown at static analysis time. */
        const p = /** @type {import('estree').Property} */ (prop)
        if (p.shorthand && p.value.type === 'Identifier') {
          /**
           * Shorthand { KUI_X }: replacing just the identifier drops the key,
           * yielding `{ \`var(...)\` }` — invalid JS. Pass the Property node so the
           * fixer can produce the expanded form: `{ KUI_X: \`var(...)\` }`.
           */
          onIdentifier(/** @type {import('estree').Identifier} */ (p.value), ctx, { parentShorthandProp: p })
        } else {
          walkExpression(p.value, ctx, onIdentifier)
        }
      }
      break
    }

    case 'ArrayExpression': {
      const n = /** @type {import('estree').ArrayExpression} */ (node)
      for (const el of n.elements) {
        if (el) walkExpression(el, ctx, onIdentifier)
      }
      break
    }

    case 'TemplateLiteral': {
      const n = /** @type {import('estree').TemplateLiteral} */ (node)
      /**
       * Replacing an Identifier inside `${}` with another backtick string would
       * nest backticks (invalid JS), so all slots are REPORT_ONLY. When the slot
       * expression is a direct Identifier (possibly TS-wrapped), pass the template
       * + slot index so `handleIdentifier` can run a token-specific idempotency
       * check (e.g. `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`).
       * Nested expressions (ternary, call, etc.) never get slot context — they are
       * always reported without the idempotency escape.
       */
      n.expressions.forEach((expr, i) => {
        const directId = asDirectIdentifier(expr)
        if (directId) {
          onIdentifier(directId, REPORT_ONLY, { parentTemplate: n, slotIndex: i })
        } else {
          walkExpression(expr, REPORT_ONLY, onIdentifier)
        }
      })
      break
    }

    case 'CallExpression': {
      const n = /** @type {import('estree').CallExpression} */ (node)
      /**
       * Arguments are REPORT_ONLY: the function may expect a raw color value
       * (e.g. darken(), rgba()) and wrapping in var() would break it.
       */
      for (const arg of n.arguments) {
        walkExpression(arg, REPORT_ONLY, onIdentifier)
      }
      break
    }

    case 'BinaryExpression': {
      const n = /** @type {import('estree').BinaryExpression} */ (node)
      /** String concat or arithmetic — wrapping changes the resulting value type. */
      walkExpression(n.left, REPORT_ONLY, onIdentifier)
      walkExpression(n.right, REPORT_ONLY, onIdentifier)
      break
    }

    /** Standard optional-chaining wrapper (e.g. `a?.b`). */
    case 'ChainExpression': {
      const n = /** @type {import('estree').ChainExpression} */ (node)
      walkExpression(n.expression, ctx, onIdentifier)
      break
    }

    case 'AssignmentExpression': {
      const n = /** @type {import('estree').AssignmentExpression} */ (node)
      walkExpression(n.right, REPORT_ONLY, onIdentifier)
      break
    }

    case 'MemberExpression': {
      const n = /** @type {import('estree').MemberExpression} */ (node)
      /** Walk the object side only; property names are not value references. */
      walkExpression(n.object, REPORT_ONLY, onIdentifier)
      break
    }

    case 'SequenceExpression': {
      const n = /** @type {import('estree').SequenceExpression} */ (node)
      const last = n.expressions.length - 1
      n.expressions.forEach((expr, i) => {
        walkExpression(expr, i === last ? ctx : REPORT_ONLY, onIdentifier)
      })
      break
    }

    default:
      /** Unknown or unhandled node type — stop recursing. */
      break
  }
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce CSS custom property var() fallback for KUI design tokens in Vue template v-bind expressions',
      url: 'https://github.com/Kong/design-tokens/blob/main/eslint-plugin/README.md',
    },
    fixable: 'code',
    hasSuggestions: false,
    schema: [{
      type: 'object',
      properties: {
        importSources: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
      },
      additionalProperties: false,
    }],
    messages: {
      wrapInVar:
        "Kong design token '{{local}}' must be wrapped in a CSS custom property fallback. " +
        'Use `var(--{{cssVar}}, ${{{local}}})` so DOM-level theme overrides (e.g., light/dark mode) take effect.',
      wrapInVarNoFix:
        "Kong design token '{{local}}' must be wrapped in a CSS custom property fallback, " +
        'but cannot be auto-fixed in this expression context. ' +
        'Manually change to: `var(--{{cssVar}}, ${{{local}}})` at the binding site ' +
        'so DOM-level theme overrides (e.g., light/dark mode) take effect.',
      wrapInVarScriptSetup:
        "Kong design token '{{imported}}' is stored in variable '{{local}}' which flows into this style binding. " +
        'Wrap the token at the template binding site: `var(--{{cssVar}}, ${{{local}}})`, or use the import directly ' +
        'so DOM-level theme overrides (e.g., light/dark mode) take effect.',
    },
  },

  create(context) {
    const importSources = context.options[0]?.importSources ?? DEFAULT_IMPORT_SOURCES

    /**
     * Maps each tracked local name to the canonical imported name.
     * e.g. `import { KUI_COLOR_TEXT_INVERSE as myColor }` → `{ 'myColor' → 'KUI_COLOR_TEXT_INVERSE' }`
     * @type {Map<string, string>}
     */
    const trackedImports = new Map()

    /**
     * Maps script-setup variable names to the import local name they were
     * initialised from, for one-hop script detection.
     * e.g. `const c = KUI_X` (where `KUI_X` is in trackedImports) → `{ 'c' → 'KUI_X' }`
     * @type {Map<string, string>}
     */
    const trackedScriptVars = new Map()

    /** @type {{ defineTemplateBodyVisitor?: Function } | undefined} */
    const parserServices =
      context.sourceCode?.parserServices ?? /** @type {any} */ (context).parserServices

    if (!parserServices?.defineTemplateBodyVisitor) {
      /**
       * vue-eslint-parser is not configured; no-op for plain JS/TS files.
       * .vue files linted without vue-eslint-parser fail to parse before rules
       * run, so there is nothing useful to report here.
       */
      return {}
    }

    /**
     * Source range of the <script setup> block, used to restrict one-hop variable
     * tracking to declarations actually reachable from the template. Three states:
     *   [number, number] — <script setup> found; track only declarations inside it
     *   null             — SFC has no <script setup> (Options API); track nothing
     *   undefined        — getDocumentFragment unavailable; fall back to scope-only check
     */
    const df = /** @type {any} */ (parserServices).getDocumentFragment?.()
    const scriptSetupEl = /** @type {any[] | undefined} */ (df?.children)?.find(
      /**
       * Match on n.name (normalized lowercase) not n.rawName (source casing) so
       * <Script setup> / <SCRIPT SETUP> are still recognized.
       */
      (/** @type {any} */ n) => n.type === 'VElement'
        && n.name === 'script'
        && n.startTag?.attributes?.some((/** @type {any} */ a) => a.key?.name === 'setup'),
    )
    /** @type {readonly [number, number] | null | undefined} */
    const scriptSetupRange = !df ? undefined : scriptSetupEl ? /** @type {any} */ (scriptSetupEl).range : null

    /**
     * Whether `node` is a module-scope declarator reachable from the template —
     * the only place a one-hop `const c = KUI_X` alias can flow into a style binding.
     * Excludes function-scoped locals and (when a <script setup> range is known)
     * declarations outside it, e.g. module-scope consts in an Options API `<script>`.
     *
     * @param {import('estree').VariableDeclarator} node
     * @returns {boolean}
     */
    function isTemplateReachableDeclarator(node) {
      if (context.sourceCode.getScope(node).type !== 'module') return false
      /** No <script setup> block (Options API): module-scope vars are not template-exposed. */
      if (scriptSetupRange === null) return false
      /** getDocumentFragment unavailable: the module-scope check above is sufficient. */
      if (scriptSetupRange === undefined) return true
      const [start, end] = /** @type {import('estree').VariableDeclarator & { range: [number, number] }} */ (node).range
      return start >= scriptSetupRange[0] && end <= scriptSetupRange[1]
    }

    /**
     * Reports a KUI token Identifier found inside a v-bind expression.
     *
     * The identifier resolves either to a directly-imported token (autofixable)
     * or a one-hop `<script setup>` alias of one (report-only). In both cases the
     * canonical imported name yields the CSS var, so the idempotency check runs once.
     *
     * @param {import('estree').Identifier} idNode - The token identifier node
     * @param {string} ctx - Either `AUTOFIX` or `REPORT_ONLY`
     * @param {object} [slot] - Positional context, when present
     * @param {import('estree').TemplateLiteral} [slot.parentTemplate] - Enclosing template literal, if the identifier is its direct expression
     * @param {number} [slot.slotIndex] - Expression slot index within `parentTemplate`
     * @param {import('estree').Property} [slot.parentShorthandProp] - Enclosing shorthand Property node, if any
     */
    function handleIdentifier(idNode, ctx, { parentTemplate, slotIndex, parentShorthandProp } = {}) {
      const localName = idNode.name

      /**
       * Resolve the canonical imported token name: either a direct import (or its
       * local alias), or a one-hop `<script setup>` variable initialised from one.
       */
      const directImport = trackedImports.get(localName)
      const importedName = directImport ?? trackedImports.get(trackedScriptVars.get(localName) ?? '')
      if (!importedName) return

      const cssVar = kuiIdentifierToCssVar(importedName)
      /** Strip the leading `--` for display in the message. */
      const cssVarNoPrefix = cssVar.slice(2)

      /**
       * Idempotency: when the identifier is the direct expression of a TemplateLiteral
       * slot, skip it only if the slot is already wrapped with the CORRECT CSS var for
       * THIS token. A mismatched wrapper like `var(--kui-color-text-primary, ${KUI_COLOR_TEXT_INVERSE})`
       * does NOT satisfy idempotency and falls through to be reported.
       */
      if (parentTemplate !== undefined && slotIndex !== undefined
        && isAlreadyWrappedSlot(parentTemplate, slotIndex, cssVar)) {
        return
      }

      /**
       * One-hop script-setup alias: report at the binding site, never autofixed
       * (fixing the declaration or inlining the alias would change semantics).
       */
      if (!directImport) {
        context.report({
          node: idNode,
          messageId: 'wrapInVarScriptSetup',
          data: { imported: importedName, local: localName, cssVar: cssVarNoPrefix },
        })
        return
      }

      /** Direct import: autofixable when the expression position is safe. */
      if (ctx === AUTOFIX) {
        context.report({
          node: idNode,
          messageId: 'wrapInVar',
          data: { local: localName, cssVar: cssVarNoPrefix },
          fix(fixer) {
            const wrapped = `\`var(${cssVar}, \${${localName}})\``
            /** Shorthand { KUI_X } must keep its key: expand to { KUI_X: `var(...)` }. */
            if (parentShorthandProp) {
              return fixer.replaceText(parentShorthandProp, `${localName}: ${wrapped}`)
            }
            return fixer.replaceText(idNode, wrapped)
          },
        })
      } else {
        context.report({
          node: idNode,
          messageId: 'wrapInVarNoFix',
          data: { local: localName, cssVar: cssVarNoPrefix },
        })
      }
    }

    const templateVisitor = {
      /** Fires for every `:prop="..."` and `v-bind="..."` attribute in the template. */
      'VAttribute[directive=true][key.name.name="bind"]'(
        /** @type {any} */ node,
      ) {
        const valueContainer = node.value
        if (!valueContainer?.expression) return

        /**
         * Identifier nodes that resolve to a template-local variable — a `v-for`
         * item, scoped-slot prop, etc. (vue-eslint-parser sets `ref.variable` for
         * these). Such a name shadows any same-named token import, so it must be
         * skipped to avoid a false positive on e.g. `v-for="KUI_X in list"`.
         */
        const templateScoped = new Set(
          /** @type {any[]} */ (valueContainer.references ?? [])
            .filter((/** @type {any} */ ref) => ref.variable != null)
            .map((/** @type {any} */ ref) => ref.id),
        )

        walkExpression(valueContainer.expression, AUTOFIX, (idNode, ctx, slot) => {
          if (templateScoped.has(idNode)) return
          handleIdentifier(idNode, ctx, slot)
        })
      },
    }

    const scriptVisitor = {
      /** Collects KUI_ named imports from configured import sources. */
      ImportDeclaration(/** @type {import('estree').ImportDeclaration} */ node) {
        if (!importSources.includes(/** @type {string} */ (node.source.value))) return
        /** Skip `import type { ... }` — type-only imports have no runtime value. */
        if (/** @type {any} */ (node).importKind === 'type') return

        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') continue
          /** Skip per-specifier `import { type KUI_X }` (TypeScript syntax). */
          if (/** @type {any} */ (specifier).importKind === 'type') continue

          const imported = /** @type {import('estree').ImportSpecifier} */ (specifier).imported
          const importedName = /** @type {string} */ (
            'name' in imported ? imported.name : /** @type {any} */ (imported).value
          )
          const localName = specifier.local.name

          if (!KUI_IDENTIFIER_PATTERN.test(importedName)) continue
          if (importedName.startsWith(KUI_EXCLUDED_PREFIX)) continue

          trackedImports.set(localName, importedName)
        }
      },

      /**
       * Detects `const c = KUI_X` in `<script setup>` (one-hop alias detection).
       * Only simple `Identifier = Identifier` initialisers that are reachable from
       * the template are tracked (see `isTemplateReachableDeclarator`).
       */
      VariableDeclarator(/** @type {import('estree').VariableDeclarator} */ node) {
        if (node.id?.type !== 'Identifier') return
        if (!node.init) return

        /**
         * Unwrap TS transparent wrappers on the initializer so aliases such as
         * `const c = KUI_X as string` or `const c = KUI_X!` are tracked, matching
         * how the template side unwraps them. Non-Identifier initializers (e.g.
         * `ref(KUI_X)`, object literals) resolve to null and are correctly ignored.
         */
        const initId = asDirectIdentifier(node.init)
        if (!initId) return
        if (!isTemplateReachableDeclarator(node)) return
        if (!trackedImports.has(initId.name)) return

        trackedScriptVars.set(
          /** @type {import('estree').Identifier} */ (node.id).name,
          initId.name,
        )
      },
    }

    return parserServices.defineTemplateBodyVisitor(templateVisitor, scriptVisitor)
  },
}

export default rule
