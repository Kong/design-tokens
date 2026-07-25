/** A single alias leaf value with optional description. */
interface AliasLeaf {
  /** The resolved value, e.g. a hex string. */
  $value: string
  /** Optional human-readable description. */
  $description?: string
}

/** An alias family: either a singleton leaf or a map of step name → leaf. */
export type AliasEntry = AliasLeaf | Record<string, AliasLeaf>

/** Parsed `*.alias.color.json` shape. */
export interface AliasJson {
  /** The `color` group containing the alias tree. */
  color: {
    /** Style Dictionary type marker (unused at runtime). */
    $type?: string
    /** Map of family name → alias entry. */
    alias: Record<string, AliasEntry>
  }
}

/** Matches a one-level alias reference `{color.alias.family[.step]}`. */
const ALIAS_REF = /^\{color\.alias\.([a-z_]+)(?:\.([0-9]+))?\}$/i

/**
 * Parses an alias reference string into its family and optional step.
 * @param raw - A candidate value such as `{color.alias.blue.50}`.
 * @returns `{ family, step }` (step is null for singletons), or null if not a ref.
 */
export function parseAliasRef(raw: string): { family: string, step: string | null } | null {
  const m = ALIAS_REF.exec(raw.trim())
  if (!m) return null
  return { family: m[1], step: m[2] ?? null }
}

/**
 * Resolves a token value one level: alias refs become their hex value
 * (honoring `aliasOverrides` first), everything else is returned unchanged.
 * @param raw - The raw token value (may be an alias ref or a literal).
 * @param aliasJson - The loaded alias palette.
 * @param aliasOverrides - Layer 1 overrides keyed by `family.step` or `family`.
 */
export function resolveValue(
  raw: string,
  aliasJson: AliasJson,
  aliasOverrides: Record<string, string>,
): string {
  const ref = parseAliasRef(raw)
  if (!ref) return raw
  const key = ref.step ? `${ref.family}.${ref.step}` : ref.family
  if (aliasOverrides[key]) return aliasOverrides[key]
  const entry = aliasJson.color.alias[ref.family]
  if (!entry) return raw
  if (ref.step) {
    const leaf = (entry as Record<string, AliasLeaf>)[ref.step]
    return leaf?.$value ?? raw
  }
  return (entry as AliasLeaf).$value ?? raw
}

/** Parsed `*.theme.json` shape: token key → value record. */
export type ThemeJson = Record<string, { $value: string, $description?: string }>

/** Converts a theme.json token key to its CSS custom property name. */
function toCssVar(key: string): string {
  return `--${key}`
}

/**
 * Builds a `:root { … }` block from the theme, resolving alias refs and applying
 * both override layers. Layer 2 (`tokenOverrides`) wins over the theme base value;
 * the winner is then resolved through Layer 1 (`aliasOverrides`). Empty values are
 * skipped so the semantic fallback chain still resolves at runtime.
 * @param themeJson - The loaded theme token map.
 * @param aliasJson - The loaded alias palette.
 * @param aliasOverrides - Layer 1 overrides keyed by `family.step` or `family`.
 * @param tokenOverrides - Layer 2 overrides keyed by token key (no `--` prefix).
 * @returns A `:root { … }` string, or `''` when no token resolves to a value.
 */
export function deriveEffectiveCss(
  themeJson: ThemeJson,
  aliasJson: AliasJson,
  aliasOverrides: Record<string, string>,
  tokenOverrides: Record<string, string>,
): string {
  const lines: string[] = []
  for (const [key, entry] of Object.entries(themeJson)) {
    const raw = tokenOverrides[key] ?? entry.$value
    if (!raw) continue
    const resolved = resolveValue(raw, aliasJson, aliasOverrides)
    if (!resolved) continue
    lines.push(`  ${toCssVar(key)}: ${resolved};`)
  }
  if (!lines.length) return ''
  return `:root {\n${lines.join('\n')}\n}`
}

/** A flattened alias entry for palette-panel rendering. */
export interface AliasFlatEntry {
  /** Family name, e.g. `blue`. */
  family: string
  /** Step name, or null for singletons. */
  step: string | null
  /** Override/lookup key: `family.step` or `family`. */
  key: string
  /** The base hex value from the loaded palette. */
  baseHex: string
}

/** True when a raw token value is an alias reference (i.e. a color token). */
export function isColorToken(rawValue: string): boolean {
  return parseAliasRef(rawValue) !== null
}

/**
 * Flattens the alias tree into a list of entries for UI rendering.
 * @param aliasJson - The loaded alias palette.
 */
export function flattenAliases(aliasJson: AliasJson): AliasFlatEntry[] {
  const out: AliasFlatEntry[] = []
  for (const [family, entry] of Object.entries(aliasJson.color.alias)) {
    if (typeof (entry as AliasLeaf).$value === 'string') {
      out.push({ family, step: null, key: family, baseHex: (entry as AliasLeaf).$value })
    } else {
      for (const [step, leaf] of Object.entries(entry as Record<string, AliasLeaf>)) {
        out.push({ family, step, key: `${family}.${step}`, baseHex: leaf.$value })
      }
    }
  }
  return out
}

/**
 * Serializes the theme with Layer 2 overrides applied. Overridden tokens keep
 * their `$description`; only `$value` changes. Output is pretty-printed 2-space JSON.
 * @param themeJson - The loaded theme token map.
 * @param tokenOverrides - Layer 2 overrides keyed by token key.
 */
export function exportThemeJson(themeJson: ThemeJson, tokenOverrides: Record<string, string>): string {
  const clone: ThemeJson = JSON.parse(JSON.stringify(themeJson))
  for (const [key, value] of Object.entries(tokenOverrides)) {
    if (clone[key]) clone[key].$value = value
  }
  return JSON.stringify(clone, null, 2)
}

/**
 * Serializes the alias palette with Layer 1 overrides applied.
 * Output is pretty-printed 2-space JSON.
 * @param aliasJson - The loaded alias palette.
 * @param aliasOverrides - Layer 1 overrides keyed by `family.step` or `family`.
 */
export function exportAliasJson(aliasJson: AliasJson, aliasOverrides: Record<string, string>): string {
  const clone: AliasJson = JSON.parse(JSON.stringify(aliasJson))
  for (const [key, hex] of Object.entries(aliasOverrides)) {
    const [family, step] = key.split('.')
    const entry = clone.color.alias[family]
    if (!entry) continue
    if (step) {
      const leaf = (entry as Record<string, AliasLeaf>)[step]
      if (leaf) leaf.$value = hex
    } else {
      (entry as AliasLeaf).$value = hex
    }
  }
  return JSON.stringify(clone, null, 2)
}

/** A token row prepared for the builder token list. */
export interface BuilderToken {
  /** Token key without `--`, e.g. `kui-button-color-background-primary`. */
  key: string
  /** CSS custom property name, e.g. `--kui-button-color-background-primary`. */
  cssVar: string
  /** The current raw value (Layer 2 override if set, else theme base). */
  rawValue: string
  /** True when the token is alias-referenced (color token). */
  isColor: boolean
  /** The resolved value after alias lookup. */
  derivedValue: string
  /** Where the current value comes from. */
  source: 'inherited' | 'overridden' | 'empty'
}
