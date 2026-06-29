import StyleDictionary from 'style-dictionary'
import { logVerbosityLevels } from 'style-dictionary/enums'
import { writeFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'

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
 * Each theme resolves its `{color.alias.*}` references against its OWN palette (`<name>.json`), so
 * themes share step names with theme-specific values. A theme that references aliases but has no
 * palette is a hard error — no silent fallback. A theme with no alias refs
 * needs no palette. Alias usage is detected from token `$value`s (not raw text — avoids false
 * positives from a `{color.alias.*}` mention inside a `$description`).
 *
 * @param {string} name - Theme name.
 * @param {boolean} paletteExists - Whether `tokens/alias/color/<name>.json` exists.
 * @param {Record<string, { $value?: unknown }> | null} themeObj - Parsed theme (only read when no palette).
 * @returns {string[]} Style Dictionary `include` globs (0 or 1 palette file).
 * @throws {Error} when the theme references aliases but has no palette.
 */
export function aliasIncludesFor(name, paletteExists, themeObj) {
  if (paletteExists) return [`./tokens/alias/color/${name}.json`]
  const usesAliases = Object.values(themeObj ?? {}).some(
    entry => entry && typeof entry.$value === 'string' && entry.$value.includes('{color.alias.'),
  )
  if (usesAliases) {
    throw new Error(
      `Theme "${name}" references {color.alias.*} but tokens/alias/color/${name}.json is missing. ` +
      'Every alias-using theme must have a matching palette file (see ALIAS-COLOR-MAPPING-GUIDE.md).',
    )
  }
  return []
}

/**
 * Resolve the color-alias include list for a single theme build (IO wrapper around `aliasIncludesFor`).
 * @param {string} name - Theme name matching `themes/${name}.theme.json`.
 * @returns {string[]} Style Dictionary `include` globs (0 or 1 palette file).
 */
function aliasIncludesForTheme(name) {
  const paletteExists = existsSync(`./tokens/alias/color/${name}.json`)
  const themeObj = paletteExists ? null : JSON.parse(readFileSync(`./themes/${name}.theme.json`, 'utf-8'))
  return aliasIncludesFor(name, paletteExists, themeObj)
}

/**
 * Auto-discover the theme files in `themes/`. Every theme JSON MUST be named `<theme-name>.theme.json`;
 * files prefixed with `_` are treated as internal/templates and skipped. Adding a conforming
 * `<name>.theme.json` to that directory is sufficient to include it in the next build. A `.json` file
 * that does NOT match the convention is a hard error so it can never be silently skipped or mis-built.
 * @returns {Promise<Array<{ name: string, exportName: string }>>}
 * @throws {Error} when a non-`_` `.json` file does not end in `.theme.json`.
 */
export async function discoverThemes() {
  const files = await readdir('./themes')
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('_'))

  // Enforce the `<theme-name>.theme.json` naming convention — fail loudly rather than skip/mis-build.
  const nonConforming = jsonFiles.filter(f => !f.endsWith('.theme.json')).sort()
  if (nonConforming.length) {
    throw new Error(
      'Theme file(s) do not match the required `<theme-name>.theme.json` naming convention: ' +
      `${nonConforming.join(', ')}. Rename each (e.g. \`my-theme.theme.json\`). ` +
      'See README.md "Creating a new theme".',
    )
  }

  return jsonFiles
    .sort()
    .map(f => {
      const name = f.slice(0, -'.theme.json'.length)
      return { name, exportName: toExportName(name) }
    })
}

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

/**
 * Creates Style Dictionary platform configs for a single named theme.
 * @param {string} name - Theme name matching `themes/${name}.theme.json`
 * @param {string} exportName - JS identifier for the exported theme object
 * @returns {Record<string, object>} SD `platforms` config object
 */
export function createThemePlatforms(name, exportName) {
  return {
    [`theme-css/${name}`]: {
      buildPath: 'dist/themes/',
      files: [{
        destination: `${name}.css`,
        format: 'css/kui-theme',
        filter: (token) => token.isSource === true,
        options: { themeName: name },
      }],
    },
    [`theme-js/${name}`]: {
      buildPath: 'dist/themes/',
      files: [
        {
          destination: `${name}.mjs`,
          format: 'js/kui-theme-esm',
          filter: (token) => token.isSource === true,
          options: { exportName },
        },
        {
          destination: `${name}.d.ts`,
          format: 'typescript/kui-theme-declarations',
          filter: (token) => token.isSource === true,
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
      source: [`./themes/${name}.theme.json`],
      include: includesByTheme.get(name),
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

  await writeFile('dist/themes/index.mjs', indexMjs, 'utf-8')
  await writeFile('dist/themes/index.d.ts', indexDts, 'utf-8')

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
