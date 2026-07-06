import StyleDictionary from 'style-dictionary'
import { logVerbosityLevels } from 'style-dictionary/enums'
import { writeFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const _breakpointSource = JSON.parse(
  readFileSync(new URL('../tokens/source/breakpoint/index.json', import.meta.url), 'utf-8'),
)

/**
 * Flat `kui-breakpoint-*` → pixel value map, derived from the canonical breakpoint source tokens.
 * Exported so consumers (e.g. drift-guard tests) can identify which tokens are build-injected
 * rather than defined in source theme files.
 */
export const THEME_BREAKPOINTS = Object.fromEntries(
  Object.entries(_breakpointSource.breakpoint)
    .filter(([key]) => !key.startsWith('$'))
    .filter(([, token]) => token.$value !== undefined)
    .map(([name, token]) => [`kui-breakpoint-${name}`, token.$value]),
)

/**
 * The ONLY non-exhaustive themes: they contain every SEMANTIC token and ZERO component tokens.
 *
 * `classic-day` is the default theme (the resolved `:root` exports) and `classic-night` is its dark
 * counterpart — identical alias palette, with a handful of semantic tokens (text/border/background)
 * re-pointed to darker steps. Both deliberately set no component tokens, so every component falls
 * through to its semantic default via the `var()` chain.
 *
 * This is the single source of truth for the classification — the drift guard (`themes.spec.mjs`)
 * and `themes:sync` both import it so a semantic-only theme is never accidentally synced with
 * component tokens. `theme:scaffold` does NOT import this: every new theme it generates is always
 * exhaustive by construction (component tokens are genuine per-theme design decisions with no safe
 * default — see `theme-scaffold.mjs`'s module docstring). Making a scaffolded theme semantic-only
 * is a deliberate, manual follow-up: delete its component-token entries, then add its name here.
 */
export const SEMANTIC_ONLY_THEMES = ['classic-day', 'classic-night']

/**
 * Convert a kebab-case theme filename to a camelCase JS export identifier.
 * @param {string} name - Kebab-case name (no .json extension)
 * @returns {string}
 */
function toExportName(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/**
 * Pure decision for which color-alias palette (if any) a theme build includes — the testable core of
 * `aliasIncludesForTheme` (no filesystem access).
 *
 * Each theme resolves its `{color.alias.*}` references against its OWN palette
 * (`themes/<name>/<name>.alias.color.json`), so themes share step names with theme-specific values.
 * A theme that references aliases but has no palette is a hard error — no silent fallback. A theme
 * with no alias refs needs no palette. Alias usage is detected from token `$value`s (not raw text —
 * avoids false positives from a `{color.alias.*}` mention inside a `$description`).
 *
 * @param {string} name - Theme name.
 * @param {boolean} paletteExists - Whether `themes/<name>/<name>.alias.color.json` exists.
 * @param {Record<string, { $value?: unknown }> | null} themeObj - Parsed theme (only read when no palette).
 * @returns {string[]} Style Dictionary `include` globs (0 or 1 palette file).
 * @throws {Error} when the theme references aliases but has no palette.
 */
export function aliasIncludesFor(name, paletteExists, themeObj) {
  if (paletteExists) return [`./themes/${name}/${name}.alias.color.json`]
  const usesAliases = Object.values(themeObj ?? {}).some(
    entry => entry && typeof entry.$value === 'string' && entry.$value.includes('{color.alias.'),
  )
  if (usesAliases) {
    throw new Error(
      `Theme "${name}" references {color.alias.*} but themes/${name}/${name}.alias.color.json is missing. ` +
      'Every alias-using theme must have a matching palette file (see ALIAS-COLOR-MAPPING-GUIDE.md).',
    )
  }
  return []
}

/**
 * Resolve the color-alias include list for a single theme build (IO wrapper around `aliasIncludesFor`).
 * @param {string} name - Theme name matching `themes/${name}/${name}.theme.json`.
 * @returns {string[]} Style Dictionary `include` globs (0 or 1 palette file).
 */
function aliasIncludesForTheme(name) {
  const paletteExists = existsSync(`./themes/${name}/${name}.alias.color.json`)
  const themeObj = paletteExists ? null : JSON.parse(readFileSync(`./themes/${name}/${name}.theme.json`, 'utf-8'))
  return aliasIncludesFor(name, paletteExists, themeObj)
}

/**
 * Auto-discover the theme directories in `themes/`. Every theme MUST live at
 * `themes/<theme-name>/<theme-name>.theme.json`; entries prefixed with `_` (e.g. the shared
 * `_manifest.alias.color.json` file) are treated as internal and skipped. Adding a conforming
 * `themes/<name>/<name>.theme.json` is sufficient to include it in the next build. A theme directory
 * that does NOT contain its matching `<name>.theme.json`, OR a stray non-`_` FILE sitting directly
 * in `themes/` (e.g. a theme mistakenly authored at the old flat `themes/<name>.theme.json` path),
 * is a hard error so it can never be silently skipped or mis-built.
 * @param {string} [themesRoot] - Path to the themes directory (override for testing).
 * @returns {Promise<Array<{ name: string, exportName: string }>>}
 * @throws {Error} when a non-`_` entry in `themes/` isn't a conforming theme directory.
 */
export async function discoverThemes(themesRoot = './themes') {
  const entries = await readdir(themesRoot, { withFileTypes: true })
  const relevant = entries.filter(e => !e.name.startsWith('_'))

  // Enforce the `<theme-name>/<theme-name>.theme.json` convention — fail loudly rather than
  // skip/mis-build. A stray FILE directly in themes/ (not a directory at all) is exactly as
  // non-conforming as a directory missing its `<name>.theme.json`, so both are checked and
  // reported together instead of the file silently never being considered a theme.
  const nonConforming = relevant
    .filter(e => !e.isDirectory() || !existsSync(join(themesRoot, e.name, `${e.name}.theme.json`)))
    .map(e => e.name)
    .sort()
  if (nonConforming.length) {
    throw new Error(
      'Entries in themes/ do not follow the required `<theme-name>/<theme-name>.theme.json` layout: ' +
      `${nonConforming.join(', ')}. See README.md "Creating a new theme".`,
    )
  }

  const themeDirs = relevant.map(e => e.name).sort()
  return themeDirs.map(name => ({ name, exportName: toExportName(name) }))
}

// ── Preprocessor registration ─────────────────────────────────────────────────
// Must run once before any StyleDictionary instance is built.

/**
 * Injects (or overrides) the canonical breakpoint tokens into a merged SD token dictionary.
 * Runs after all source/include files are merged, so theme-defined breakpoint values are
 * replaced by the fixed values from the breakpoint source file.
 * Marking each token `isSource: true` ensures it passes all format filters in createThemePlatforms.
 * Exported for unit testing.
 * @param {Record<string, unknown>} dictionary - Merged SD token dictionary (DTCG format).
 * @returns {Record<string, unknown>}
 */
export function injectThemeBreakpoints(dictionary) {
  const result = { ...dictionary }
  for (const [name, value] of Object.entries(THEME_BREAKPOINTS)) {
    result[name] = { $value: value, isSource: true }
  }
  return result
}

StyleDictionary.registerPreprocessor({
  name: 'inject-theme-breakpoints',
  preprocessor: injectThemeBreakpoints,
})

// ── Format registrations ──────────────────────────────────────────────────────
// Must run once before any StyleDictionary instance is built.

StyleDictionary.registerFormat({
  name: 'css/kui-theme',
  /**
   * Emits `@layer kui.theme { [data-kui-theme="name"] { ... } }`.
   * Uses `token.$value` (resolved) — alias references in theme files resolve
   * because alias token files are included in each per-theme SD instance.
   */
  format: async function({ dictionary, options }) {
    const { themeName } = options
    const header =
      '/**\n' +
      ` * @kong/design-tokens — ${themeName} theme\n` +
      ' * GENERATED FILE — do not edit by hand. Run `pnpm build:themes` to regenerate.\n' +
      ' */\n'
    const vars = dictionary.allTokens
      .map(token => `    --${token.path.join('-')}: ${token.$value};`)
      .join('\n')
    return `${header}@layer kui.theme {\n  [data-kui-theme="${themeName}"] {\n${vars}\n  }\n}\n`
  },
})

StyleDictionary.registerFormat({
  name: 'js/kui-theme-esm',
  format: async function({ dictionary, options }) {
    const { exportName } = options
    const header =
      '/**\n' +
      ` * @kong/design-tokens — ${exportName}\n` +
      ' * GENERATED FILE — do not edit by hand. Run `pnpm build:themes` to regenerate.\n' +
      ' */\n'
    const entries = dictionary.allTokens
      .map(token => `  '--${token.path.join('-')}': ${JSON.stringify(token.$value)},`)
      .join('\n')
    return `${header}export const ${exportName} = {\n${entries}\n}\n`
  },
})

StyleDictionary.registerFormat({
  name: 'js/kui-theme-cjs',
  format: async function({ dictionary, options }) {
    const { exportName } = options
    const header =
      '/**\n' +
      ` * @kong/design-tokens — ${exportName}\n` +
      ' * GENERATED FILE — do not edit by hand. Run `pnpm build:themes` to regenerate.\n' +
      ' */\n'
    const entries = dictionary.allTokens
      .map(token => `  '--${token.path.join('-')}': ${JSON.stringify(token.$value)},`)
      .join('\n')
    return `${header}'use strict'\nconst ${exportName} = {\n${entries}\n}\nmodule.exports = { ${exportName} }\n`
  },
})

StyleDictionary.registerFormat({
  name: 'typescript/kui-theme-declarations',
  format: async function({ options }) {
    const { exportName } = options
    return (
      '/**\n' +
      ` * @kong/design-tokens — ${exportName} type declarations\n` +
      ' * GENERATED FILE — do not edit by hand.\n' +
      ' */\n' +
      `export declare const ${exportName}: Readonly<Record<string, string>>\n`
    )
  },
})

// ── Platform factory ──────────────────────────────────────────────────────────

/** A token belongs in a theme's compiled output: real source data, and an actual value to emit. */
const isCompiledThemeToken = (token) => token.isSource === true && token.$value !== ''

/**
 * Creates Style Dictionary platform configs for a single named theme.
 *
 * An unfilled component token (`$value: ''` — a real, expected state for an in-progress exhaustive
 * theme) is OMITTED from compiled output entirely, never emitted as `--x: ;` or `--x: initial;`.
 * This matters more than it looks: per the CSS Custom Properties spec, `var(--x, fallback)` only
 * uses `fallback` when `--x` is the "guaranteed-invalid value" (never declared for that element at
 * all). An explicitly empty value (`--x: ;`) is a normal value in its own right, so it would NOT
 * trigger the fallback — the component→semantic fallback chain breaks silently (e.g. `border-radius`
 * computes to the browser's initial value, not the theme's semantic radius). Writing `--x: initial;`
 * instead does reach guaranteed-invalid, but as an ACTIVE reset scoped to this theme's rule — it
 * would override a value a host app, a nested theme, or a spread-in base object legitimately set for
 * that same property, which is worse. True omission is the only form with no such side effect: it's
 * exactly what a semantic-only theme (`classic-day`/`classic-night`) already does for every component
 * token, and it's why that fallthrough has always worked correctly. This was latent until this
 * refactor: every theme published before now always filled every component token with a real value,
 * so no compiled theme ever emitted an empty one.
 * @param {string} name - Theme name matching `themes/${name}/${name}.theme.json`
 * @param {string} exportName - JS identifier for the exported theme object
 * @param {string} [buildPath] - Where compiled output is written (override for testing).
 * @returns {Record<string, object>} SD `platforms` config object
 */
export function createThemePlatforms(name, exportName, buildPath = 'dist/themes/') {
  return {
    [`theme-css/${name}`]: {
      buildPath,
      files: [{
        destination: `${name}.css`,
        format: 'css/kui-theme',
        filter: isCompiledThemeToken,
        options: { themeName: name },
      }],
    },
    [`theme-js/${name}`]: {
      buildPath,
      files: [
        {
          destination: `${name}.mjs`,
          format: 'js/kui-theme-esm',
          filter: isCompiledThemeToken,
          options: { exportName },
        },
        {
          destination: `${name}.d.ts`,
          format: 'typescript/kui-theme-declarations',
          filter: isCompiledThemeToken,
          options: { exportName },
        },
        {
          destination: `${name}.cjs`,
          format: 'js/kui-theme-cjs',
          filter: isCompiledThemeToken,
          options: { exportName },
        },
        {
          destination: `${name}.d.cts`,
          format: 'typescript/kui-theme-declarations',
          filter: isCompiledThemeToken,
          options: { exportName },
        },
      ],
    },
  }
}

// ── Build action ──────────────────────────────────────────────────────────────

const HEADER =
  '/**\n' +
  ' * @kong/design-tokens — themes index\n' +
  ' * GENERATED FILE — do not edit by hand. Run `pnpm build:tokens` to regenerate.\n' +
  ' */\n'

async function buildAllThemes() {
  const themes = await discoverThemes()

  // Pre-flight: resolve every theme's alias include BEFORE writing anything, so a misconfigured
  // theme fails atomically rather than leaving a partial dist/ (missing index.mjs / later themes).
  // Resolved once here and reused below — no second filesystem pass per theme.
  const includesByTheme = new Map(themes.map(({ name }) => [name, aliasIncludesForTheme(name)]))

  await mkdir('dist/themes', { recursive: true })

  for (const { name, exportName } of themes) {
    const sd = new StyleDictionary({
      log: { verbosity: logVerbosityLevels.verbose },
      source: [`./themes/${name}/${name}.theme.json`],
      include: includesByTheme.get(name),
      preprocessors: ['inject-theme-breakpoints'],
      platforms: createThemePlatforms(name, exportName),
    })
    await sd.buildAllPlatforms()
  }

  const indexMjs =
    HEADER +
    themes.map(({ name, exportName }) => `export { ${exportName} } from './${name}.mjs'`).join('\n') +
    '\n'

  const indexDts =
    HEADER +
    themes.map(({ name, exportName }) => `export { ${exportName} } from './${name}.js'`).join('\n') +
    '\n'

  // CJS counterparts so the package's `require` export condition resolves to real CommonJS (mirrors the
  // `.` and `./tokens/themeable-tokens` exports). `.d.cts` gives `require` consumers CJS-correct types.
  const indexCjs =
    HEADER +
    '\'use strict\'\n' +
    'module.exports = {\n' +
    themes.map(({ name, exportName }) => `  ${exportName}: require('./${name}.cjs').${exportName},`).join('\n') +
    '\n}\n'

  const indexDcts =
    HEADER +
    themes.map(({ name, exportName }) => `export { ${exportName} } from './${name}.cjs'`).join('\n') +
    '\n'

  await writeFile('dist/themes/index.mjs', indexMjs, 'utf-8')
  await writeFile('dist/themes/index.d.ts', indexDts, 'utf-8')
  await writeFile('dist/themes/index.cjs', indexCjs, 'utf-8')
  await writeFile('dist/themes/index.d.cts', indexDcts, 'utf-8')

  console.log(`Built ${themes.length} themes.`)
}

StyleDictionary.registerAction({
  name: 'build-themes',
  do: buildAllThemes,
  undo: async () => {},
})

/** SD platform that triggers theme builds as a side-effect action. */
export const themesPlatform = {
  buildPath: 'dist/themes/',
  transforms: [],
  files: [],
  actions: ['build-themes'],
}
