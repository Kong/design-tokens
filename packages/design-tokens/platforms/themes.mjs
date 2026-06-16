import StyleDictionary from 'style-dictionary'
import { logVerbosityLevels } from 'style-dictionary/enums'
import { writeFile, mkdir, readdir } from 'node:fs/promises'

/**
 * Convert a kebab-case theme filename to a camelCase JS export identifier.
 * @param {string} name - Kebab-case name (no .json extension)
 * @returns {string}
 */
function toExportName(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/**
 * Auto-discover all theme JSON files in `themes/`, excluding those prefixed
 * with `_` (internal/template files). Adding a new `.json` file to that
 * directory is sufficient to include it in the next build.
 * @returns {Promise<Array<{ name: string, exportName: string }>>}
 */
export async function discoverThemes() {
  const files = await readdir('./themes')
  return files
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .sort()
    .map(f => ({ name: f.slice(0, -5), exportName: toExportName(f.slice(0, -5)) }))
}

// ── Format registrations ──────────────────────────────────────────────────────
// Must run once before any StyleDictionary instance is built.

StyleDictionary.registerFormat({
  name: 'css/kui-theme',
  /**
   * Emits `@layer kui.theme { [data-kui-theme="name"] { ... } }`.
   * Uses `token.value` (resolved) — alias references in theme files resolve
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
 * @param {string} name - Theme name matching `themes/${name}.json`
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
  await mkdir('dist/themes', { recursive: true })

  const themes = await discoverThemes()

  for (const { name, exportName } of themes) {
    const sd = new StyleDictionary({
      log: { verbosity: logVerbosityLevels.verbose },
      source: [`./themes/${name}.json`],
      include: ['./tokens/alias/**/*.json'],
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
