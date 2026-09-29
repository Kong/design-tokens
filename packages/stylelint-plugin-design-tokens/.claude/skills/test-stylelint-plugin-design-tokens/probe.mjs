#!/usr/bin/env node
/**
 * Fixture probe for @kong/stylelint-plugin-design-tokens' test suite.
 *
 * Every expected value in `test/test-fixtures.mjs` must be a value the rule *produced*, never one a
 * human predicted. This script is how you produce them:
 *
 *   probe.mjs snippet '<scss>'   ad-hoc: messages + autofix for one snippet
 *   probe.mjs record --rule R    paste-ready `{ code, output }` for every invalid fixture
 *   probe.mjs verify             recorded fixtures vs. actual behavior; exit 1 on drift
 *
 * It deliberately reuses `test/test-utils.mjs` rather than calling `stylelint.lint` itself, so the
 * two-pass report/fix split and the CssSyntaxError guard behave exactly as they do in a spec.
 */

import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
// .claude/skills/test-stylelint-plugin-design-tokens/ -> package root
const PKG = resolve(HERE, '../../..')

const { createRuleLinter } = await import(join(PKG, 'test/test-utils.mjs'))
const FIXTURES = await import(join(PKG, 'test/test-fixtures.mjs'))

/** Short rule key -> { plugin module, fixture group }. Add a row when a rule is added. */
const RULES = {
  'use-proper-token': {
    plugin: (await import(join(PKG, 'rules/use-proper-token/index.mjs'))).default,
    fixtures: FIXTURES.USE_PROPER_TOKEN,
    fixable: false,
  },
  'token-var-usage': {
    plugin: (await import(join(PKG, 'rules/token-var-usage/index.mjs'))).default,
    fixtures: FIXTURES.TOKEN_VAR_USAGE,
    fixable: true,
  },
}

// ---------------------------------------------------------------------------
// arg parsing
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2)
const command = argv.shift() ?? 'help'

/** Valued flag `--name value`; splices both so the remainder is the snippet. */
const flag = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? undefined : argv.splice(i, 2)[1]
}

const ruleFlag = flag('rule')

const ruleKeys = (() => {
  if (!ruleFlag || ruleFlag === 'all') return Object.keys(RULES)
  const keys = ruleFlag.split(',').map(key => key.trim())
  const unknown = keys.filter(key => !RULES[key])
  if (unknown.length) {
    console.error(`Unknown rule(s): ${unknown.join(', ')}. Known: ${Object.keys(RULES).join(', ')}`)
    process.exit(2)
  }
  return keys
})()

/** Snippet from positional args, or stdin when none were given. */
const readSnippet = () => {
  if (argv.length) return argv.join(' ')
  const stdin = readFileSync(0, 'utf8')
  if (!stdin.trim()) {
    console.error('No snippet given. Pass it as an argument or on stdin.')
    process.exit(2)
  }
  return stdin.trimEnd()
}

// ---------------------------------------------------------------------------
// output helpers
// ---------------------------------------------------------------------------

/** Strip the ` (<ruleName>)` suffix `ruleMessages()` appends, for readable console output. */
const bare = text => text.replace(/\s*\([^()]*stylelint-plugin-design-tokens\/[^()]*\)$/, '')

/** Render a snippet as the JS literal the fixtures file wants: single-quoted, or joined lines. */
const asLiteral = (code) => {
  if (!code.includes('\n')) return `'${code.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  const lines = code.split('\n').map(line => `    '${line.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`)
  return ['[', ...lines, "  ].join('\\n')"].join('\n')
}

const indent = (text, pad = '  ') => text.split('\n').map(line => pad + line).join('\n')

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------

const commands = {
  /** Ad-hoc: what does each rule report for this snippet, and what does its fix produce? */
  async snippet() {
    const code = readSnippet()
    console.log(`input:\n${indent(code)}\n`)

    for (const key of ruleKeys) {
      const linter = createRuleLinter(RULES[key].plugin)
      const { messages, output } = await linter.lintAndFix(code)

      console.log(`[${key}]  ${messages.length} message(s)${RULES[key].fixable ? '' : '  (not fixable)'}`)
      for (const message of messages) console.log(`  - ${bare(message)}`)
      console.log(output === code ? '  fix: (unchanged)' : `  fix:\n${indent(output, '    ')}`)
      console.log()
    }
  },

  /**
   * Print the actual behavior of every invalid fixture as a paste-ready fixtures entry.
   * Use this to author a new fixture's `output`, or to re-record after an intentional change:
   * write `{ code, output: null }` first, run this, paste what it prints.
   */
  async record() {
    for (const key of ruleKeys) {
      const { plugin, fixtures, fixable } = RULES[key]
      const linter = createRuleLinter(plugin)

      console.log(`// ===== ${key} — invalid =====`)
      for (const [name, entry] of Object.entries(fixtures.invalid)) {
        const code = typeof entry === 'string' ? entry : entry.code
        const { messages, output } = await linter.lintAndFix(code)

        console.log(`\n// reports ${messages.length}:`)
        for (const message of messages) console.log(`//   ${bare(message)}`)

        if (!fixable) {
          console.log(`${name}: ${asLiteral(code)},`)
          continue
        }
        const unchanged = output === code
        if (unchanged) {
          console.log('// fix declined to act — record `output: null`')
        }
        console.log(`${name}: {`)
        console.log(`  code: ${asLiteral(code)},`)
        console.log(`  output: ${unchanged ? 'null' : asLiteral(output)},`)
        console.log('},')
      }
      console.log()
    }
  },

  /**
   * Cross-check recorded fixtures against live behavior. Catches a predicted-not-produced
   * `output`, a `valid` fixture that actually reports, and the two autofix invariants.
   * Exits 1 on any drift. Cheaper than a full vitest run while iterating on a rule.
   */
  async verify() {
    let failures = 0
    const fail = (label, detail) => {
      failures++
      console.log(`FAIL  ${label}\n${indent(detail, '        ')}`)
    }

    for (const key of ruleKeys) {
      const { plugin, fixtures, fixable } = RULES[key]
      const linter = createRuleLinter(plugin)
      console.log(`--- ${key} ---`)

      for (const [name, code] of Object.entries(fixtures.valid)) {
        const { messages, output } = await linter.lintAndFix(code)
        if (messages.length) fail(`${key}/valid/${name} reports`, messages.map(bare).join('\n'))
        // A valid fixture must survive a fix pass byte-identical.
        if (output !== code) fail(`${key}/valid/${name} was rewritten`, output)
      }

      for (const [name, entry] of Object.entries(fixtures.invalid)) {
        const code = typeof entry === 'string' ? entry : entry.code
        const recorded = typeof entry === 'string' ? undefined : entry.output
        const { messages, output } = await linter.lintAndFix(code)

        if (!messages.length) fail(`${key}/invalid/${name} reports nothing`, code)

        if (!fixable) {
          if (output !== code) fail(`${key}/invalid/${name} rewritten by a non-fixable rule`, output)
          continue
        }

        const expected = recorded ?? code
        if (output !== expected) {
          fail(`${key}/invalid/${name} output drift`, `recorded: ${expected}\nactual:   ${output}`)
        }

        // Invariant 1 — stable fixpoint, for EVERY invalid fixture.
        const twice = await linter.fix(output)
        if (twice !== output) fail(`${key}/invalid/${name} not a stable fixpoint`, twice)

        // Invariant 2 — only fixtures the rule actually rewrites can become clean.
        if (recorded !== null) {
          const after = await linter.lint(output)
          if (after.messages.length) {
            fail(`${key}/invalid/${name} still reports after fixing`, after.messages.map(bare).join('\n'))
          }
        }
      }
    }

    console.log(failures ? `\n${failures} failure(s)` : '\nall fixtures match live behavior')
    process.exitCode = failures ? 1 : 0
  },

  /** `extractTokensFromValue(value)` — the gate both rules share. */
  async tokens() {
    const { extractTokensFromValue } = await import(join(PKG, 'utilities/index.mjs'))
    const value = argv.join(' ') || readSnippet()
    console.log(JSON.stringify(extractTokensFromValue(value)))
  },

  /** Query PROPERTY_TOKEN_MAP; no argument lists every enforced property. */
  async map() {
    const { PROPERTY_TOKEN_MAP } = await import(join(PKG, 'rules/use-proper-token/token-map.mjs'))
    const property = argv[0]
    const render = allowed => (allowed.length ? allowed.join(', ') : '(no token allowed)')

    if (!property) {
      for (const [mapKey, allowed] of Object.entries(PROPERTY_TOKEN_MAP)) {
        console.log(`${mapKey}: ${render(allowed)}`)
      }
      return
    }

    // A map key may be a comma-joined group of properties; the rule splits on ',' to match.
    const mapKey = Object.keys(PROPERTY_TOKEN_MAP).find(k => k.split(',').some(p => p === property))
    if (!mapKey) {
      console.log(`'${property}' is NOT in PROPERTY_TOKEN_MAP — use-proper-token skips it entirely.`)
      process.exitCode = 1
      return
    }
    console.log(`'${property}' (key '${mapKey}'): ${render(PROPERTY_TOKEN_MAP[mapKey])}`)
  },

  async help() {
    console.log(`
Fixture probe for @kong/stylelint-plugin-design-tokens.

  probe.mjs snippet '<scss>'    messages + autofix for one ad-hoc snippet
  probe.mjs record              paste-ready fixture entries for every invalid fixture
  probe.mjs verify              recorded fixtures vs. live behavior; exit 1 on drift
  probe.mjs tokens '<value>'    extractTokensFromValue() on one CSS value
  probe.mjs map [property]      query PROPERTY_TOKEN_MAP

Flags:
  --rule <${Object.keys(RULES).join('|')}|all>   default all

Snippet source: positional args, or stdin (heredoc).
`.trim())
  },
}

const handler = commands[command]

if (!handler) {
  console.error(`Unknown command '${command}'. Try: ${Object.keys(commands).join(', ')}`)
  process.exit(2)
}

await handler()
