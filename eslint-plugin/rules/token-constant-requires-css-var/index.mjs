import {
  KUI_IDENTIFIER_PATTERN,
  KUI_IMPORT_SOURCE,
  kuiIdentifierToCssVar,
} from '../../utilities/index.mjs'

/** Identifier can be safely auto-fixed in this expression position. */
const AUTOFIX = 'fix'

/** Identifier must be reported but cannot be auto-fixed without changing semantics. */
const REPORT_ONLY = 'report'

/**
 * Returns `true` when the TemplateLiteral expression slot at `exprIndex` is
 * already in the form `` `var(--kui-..., ${IDENTIFIER})` ``, so we can skip
 * it on subsequent lint passes (idempotency).
 *
 * @param {import('estree').TemplateLiteral} templateNode
 * @param {number} exprIndex - Index of the expression slot to inspect
 * @returns {boolean}
 */
function isAlreadyWrappedSlot(templateNode, exprIndex) {
  const priorText = templateNode.quasis[exprIndex]?.value?.cooked ?? ''
  const nextText = templateNode.quasis[exprIndex + 1]?.value?.cooked ?? ''
  return /var\(--kui-[a-z0-9-]+,\s*$/.test(priorText) && nextText.startsWith(')')
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
 * @param {(id: import('estree').Identifier, ctx: string) => void} onIdentifier
 */
function walkExpression(node, ctx, onIdentifier) {
  if (!node) return

  // TypeScript-specific transparent wrappers (present when @typescript-eslint/parser
  // is used for the SFC <script> block). These types are not in the estree Node union,
  // so we widen to `any` before comparing to avoid an TS2367 "no overlap" error.
  const nodeType = /** @type {string} */ (node.type)
  if (nodeType === 'TSAsExpression' || nodeType === 'TSNonNullExpression' || nodeType === 'TSTypeAssertion') {
    walkExpression(/** @type {{ expression: import('estree').Node }} */ (node).expression, ctx, onIdentifier)
    return
  }

  switch (node.type) {
    case 'Identifier':
      onIdentifier(/** @type {import('estree').Identifier} */ (node), ctx)
      break

    case 'ConditionalExpression': {
      const n = /** @type {import('estree').ConditionalExpression} */ (node)
      // Walk value branches only; the boolean test is not a style value
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
        if (prop.type === 'Property') {
          walkExpression(prop.value, ctx, onIdentifier)
        }
        // SpreadElement is not walked — shape is unknown at static analysis time
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
      // Replacing an Identifier inside `${}` with another backtick string would
      // nest backticks — not valid JS. Check idempotency first; otherwise report.
      n.expressions.forEach((expr, i) => {
        if (isAlreadyWrappedSlot(n, i)) return
        walkExpression(expr, REPORT_ONLY, onIdentifier)
      })
      break
    }

    case 'CallExpression': {
      const n = /** @type {import('estree').CallExpression} */ (node)
      // Arguments are REPORT_ONLY: the function may expect a raw color value
      // (e.g. darken(), rgba()) and wrapping in var() would break it.
      for (const arg of n.arguments) {
        walkExpression(arg, REPORT_ONLY, onIdentifier)
      }
      break
    }

    case 'BinaryExpression': {
      const n = /** @type {import('estree').BinaryExpression} */ (node)
      // String concat or arithmetic — wrapping changes the resulting value type
      walkExpression(n.left, REPORT_ONLY, onIdentifier)
      walkExpression(n.right, REPORT_ONLY, onIdentifier)
      break
    }

    // Standard optional-chaining wrapper (e.g. `a?.b`)
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
      // Walk the object side only; property names are not value references
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
      // Unknown or unhandled node type — stop recursing
      break
  }
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce CSS custom property var() fallback for KUI design tokens in Vue template v-bind expressions',
      url: 'https://github.com/Kong/design-tokens/blob/main/eslint-plugin/README.md',
    },
    fixable: 'code',
    hasSuggestions: false,
    schema: [],
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
      // vue-eslint-parser is not configured; no-op for plain JS/TS files.
      // Warn when linting a .vue file so misconfigured setups are caught early.
      const filename = context.filename ?? /** @type {any} */ (context).getFilename?.() ?? ''
      if (filename.endsWith('.vue')) {
        console.warn(
          `[@kong/design-tokens] token-constant-requires-css-var: vue-eslint-parser is not active for "${filename}". ` +
          'Add vue-eslint-parser (or eslint-plugin-vue, which ships it) as the parser in your ESLint config.',
        )
      }
      return {}
    }

    /**
     * Reports a KUI token Identifier found inside a v-bind expression.
     * Issues an autofix when `ctx === AUTOFIX`; reports without fix otherwise.
     *
     * @param {import('estree').Identifier} idNode - The token identifier node
     * @param {string} ctx - Either `AUTOFIX` or `REPORT_ONLY`
     */
    function handleIdentifier(idNode, ctx) {
      const localName = idNode.name

      // Case 1: directly-imported KUI token (e.g. KUI_X or its local alias)
      const importedName = trackedImports.get(localName)
      if (importedName) {
        const cssVar = kuiIdentifierToCssVar(importedName)
        const cssVarNoPrefix = cssVar.slice(2) // strip leading '--' for the message

        if (ctx === AUTOFIX) {
          context.report({
            node: idNode,
            messageId: 'wrapInVar',
            data: { local: localName, cssVar: cssVarNoPrefix },
            fix(fixer) {
              // Replace the bare Identifier with a template-literal var() fallback
              return fixer.replaceText(idNode, `\`var(${cssVar}, \${${localName}})\``)
            },
          })
        } else {
          context.report({
            node: idNode,
            messageId: 'wrapInVarNoFix',
            data: { local: localName, cssVar: cssVarNoPrefix },
          })
        }
        return
      }

      // Case 2: script-setup variable initialised from a tracked KUI token
      const sourceImportLocal = trackedScriptVars.get(localName)
      if (!sourceImportLocal) return
      const sourceImportedName = trackedImports.get(sourceImportLocal)
      if (!sourceImportedName) return

      const cssVar = kuiIdentifierToCssVar(sourceImportedName)
      context.report({
        node: idNode,
        messageId: 'wrapInVarScriptSetup',
        data: {
          imported: sourceImportedName,
          local: localName,
          cssVar: cssVar.slice(2),
        },
      })
    }

    const templateVisitor = {
      /** Fires for every `:prop="..."` and `v-bind="..."` attribute in the template. */
      'VAttribute[directive=true][key.name.name="bind"]'(
        /** @type {any} */ node,
      ) {
        const valueContainer = node.value
        if (!valueContainer?.expression) return
        walkExpression(valueContainer.expression, AUTOFIX, handleIdentifier)
      },
    }

    const scriptVisitor = {
      /** Collects KUI_ named imports from `@kong/design-tokens`. */
      ImportDeclaration(/** @type {import('estree').ImportDeclaration} */ node) {
        if (node.source.value !== KUI_IMPORT_SOURCE) return
        // Skip `import type { ... }` — type-only imports have no runtime value
        if (/** @type {any} */ (node).importKind === 'type') return

        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') continue
          // Skip per-specifier `import { type KUI_X }` (TypeScript syntax)
          if (/** @type {any} */ (specifier).importKind === 'type') continue

          const imported = /** @type {import('estree').ImportSpecifier} */ (specifier).imported
          const importedName = /** @type {string} */ (
            'name' in imported ? imported.name : /** @type {any} */ (imported).value
          )
          const localName = specifier.local.name

          if (!KUI_IDENTIFIER_PATTERN.test(importedName)) continue

          trackedImports.set(localName, importedName)
        }
      },

      /**
       * Detects `const c = KUI_X` in `<script setup>` (one-hop variable detection).
       * Only simple `Identifier = Identifier` initialisers are tracked.
       */
      VariableDeclarator(/** @type {import('estree').VariableDeclarator} */ node) {
        if (node.init?.type !== 'Identifier') return
        if (node.id?.type !== 'Identifier') return

        const initName = /** @type {import('estree').Identifier} */ (node.init).name
        if (!trackedImports.has(initName)) return

        trackedScriptVars.set(
          /** @type {import('estree').Identifier} */ (node.id).name,
          initName,
        )
      },
    }

    return parserServices.defineTemplateBodyVisitor(templateVisitor, scriptVisitor)
  },
}

export default rule
