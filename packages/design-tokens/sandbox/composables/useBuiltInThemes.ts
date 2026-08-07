import { THEMES } from './useTokens'

/**
 * Raw source text of every `themes/<id>/<id>.theme.json` file, bundled at build time via
 * Vite's raw-import glob. Resolved relative to this file's own location, so it works
 * identically in dev (`pnpm sandbox:open`) and the static `BUILD_SANDBOX=true` GitHub Pages
 * build — no runtime fetch, no new copy step, no base-path/CORS concerns.
 */
const themeModules = import.meta.glob('../../themes/*/*.theme.json', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/** Raw source text of every `themes/<id>/<id>.alias.color.json` file — see {@link themeModules}. */
const aliasModules = import.meta.glob('../../themes/*/*.alias.color.json', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/** Extracts the theme id (the `themes/<id>/` directory segment) from a glob-resolved path. */
function idFromPath(path: string): string {
  const match = path.match(/\/themes\/([^/]+)\//)
  if (!match) throw new Error(`Could not derive a theme id from glob path "${path}"`)
  return match[1]
}

/** Builds a theme-id → raw-text map from an already-resolved `import.meta.glob` record. */
function buildIdMap(modules: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>()
  for (const [path, text] of Object.entries(modules)) map.set(idFromPath(path), text)
  return map
}

const themeTextById = buildIdMap(themeModules)
const aliasTextById = buildIdMap(aliasModules)

/**
 * A built-in theme's raw source files, ready to feed straight into
 * `useThemeBuilder().loadFiles()` — the exact same shape the file-upload path already produces.
 */
export interface BuiltInTheme {
  /** Kebab-case theme id, matching `useTokens.ts`'s `THEMES`. */
  id: string
  /** Human-readable label, matching `useTokens.ts`'s `THEMES`. */
  label: string
  /** Raw contents of `themes/<id>/<id>.theme.json`. */
  themeText: string
  /** Raw contents of `themes/<id>/<id>.alias.color.json`. */
  aliasText: string
  /** Source theme.json filename, for display and the exported download name. */
  themeFileName: string
  /** Source alias.color.json filename, for display and the exported download name. */
  aliasFileName: string
}

/**
 * Every built-in theme's raw source files, in the same order/labels as `useTokens.ts`'s
 * `THEMES` — lets the Theme Builder load a real repo theme without a file upload.
 */
export const BUILT_IN_THEMES: BuiltInTheme[] = THEMES.map((theme) => {
  const themeText = themeTextById.get(theme.id)
  const aliasText = aliasTextById.get(theme.id)
  if (!themeText || !aliasText) {
    throw new Error(`Missing bundled theme source files for "${theme.id}"`)
  }
  return {
    id: theme.id,
    label: theme.label,
    themeText,
    aliasText,
    themeFileName: `${theme.id}.theme.json`,
    aliasFileName: `${theme.id}.alias.color.json`,
  }
})
