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
 * @param raw - A candidate value such as `{color.alias.blue.50}`. Non-string input (e.g. `undefined`/`null` from a malformed token) yields null.
 * @returns `{ family, step }` (step is null for singletons), or null if not a ref.
 */
export function parseAliasRef(raw: unknown): { family: string, step: string | null } | null {
  if (typeof raw !== 'string') return null
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

/**
 * True when every entry in a parsed theme file is a `{ $value }` record — the
 * shape all downstream code (`exportThemeJson`, `builderTokens`, `deriveEffectiveCss`)
 * assumes. A hand-edited or corrupted file can have a bare-string entry
 * (`"kui-space-40": "16px"`) instead; letting that in causes `exportThemeJson`
 * to throw when writing `$value` onto a string primitive.
 * @param value - The parsed JSON to check (already known to be a non-null object).
 */
export function isValidThemeJson(value: Record<string, unknown>): value is ThemeJson {
  return Object.values(value).every(
    (entry) => entry !== null && typeof entry === 'object' && typeof (entry as { $value?: unknown }).$value === 'string',
  )
}

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
 * Values containing CSS-structural characters (`{`, `}`, `;`) — which can only come from
 * malformed/adversarial input, never a valid single declaration value — are skipped rather
 * than emitted, so they can't break out of the declaration or inject additional rules.
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
    const raw = tokenOverrides[key] ?? entry?.$value
    if (!raw) continue
    const resolved = resolveValue(raw, aliasJson, aliasOverrides)
    if (!resolved) continue
    // A valid single CSS declaration value never contains these characters; their presence
    // means the (likely hand-edited) value is trying to break out of the declaration or
    // inject additional rules, so drop it instead of emitting it.
    if (/[{};]/.test(resolved)) continue
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

/** True when a raw token value is an alias reference (i.e. a color token). Non-string input returns false. */
export function isColorToken(rawValue: unknown): boolean {
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
    // Guard against a malformed entry (e.g. a bare string instead of `{ $value }`) reaching
    // here via a path that bypassed loadFiles's validation, such as a corrupted localStorage
    // restore — assigning a property onto a string primitive throws in strict mode.
    if (clone[key] && typeof clone[key] === 'object') clone[key].$value = value
    else clone[key] = { $value: value }
  }
  return JSON.stringify(clone, null, 2)
}

/**
 * Serializes a value to pretty-printed JSON text, honoring the insertion
 * order of `Map` entries verbatim instead of the plain-object enumeration
 * order JS engines force on integer-like string keys (which would put
 * `'10'`..`'100'` ahead of a leading-zero key like `'05'` regardless of
 * insertion order). Only `Map`, array, and plain-object/primitive values
 * are expected; anything else falls back to `JSON.stringify`.
 * @param value - The value to serialize.
 * @param indentLevel - Current nesting depth, used to compute indentation.
 */
function stringifyOrdered(value: unknown, indentLevel: number): string {
  const pad = '  '.repeat(indentLevel)
  const padIn = '  '.repeat(indentLevel + 1)
  if (value instanceof Map) {
    if (!value.size) return '{}'
    const lines = [...value.entries()].map(
      ([k, v]) => `${padIn}${JSON.stringify(String(k))}: ${stringifyOrdered(v, indentLevel + 1)}`,
    )
    return `{\n${lines.join(',\n')}\n${pad}}`
  }
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    const lines = value.map((v) => `${padIn}${stringifyOrdered(v, indentLevel + 1)}`)
    return `[\n${lines.join(',\n')}\n${pad}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (!entries.length) return '{}'
    const lines = entries.map(([k, v]) => `${padIn}${JSON.stringify(k)}: ${stringifyOrdered(v, indentLevel + 1)}`)
    return `{\n${lines.join(',\n')}\n${pad}}`
  }
  return JSON.stringify(value)
}

/**
 * Rebuilds a stepped alias family as a `Map` with its step keys in canonical
 * ascending numeric order (e.g. `05, 10, 20, …, 100`). A `Map` is used
 * because plain JS objects always enumerate integer-like keys ('10'..'100')
 * ascending ahead of leading-zero keys ('05'), regardless of insertion
 * order — which is exactly what makes the repo's jsonc sort-keys lint flag
 * these files until `eslint --fix` reorders them. Non-stepped families
 * (singletons with `$value`/`$description` directly) are returned unchanged.
 * @param fam - A family entry, either a singleton leaf or a step map.
 */
function sortedStepFamily(fam: AliasEntry): AliasEntry | Map<string, AliasLeaf> {
  const stepKeys = Object.keys(fam).filter((k) => /^\d+$/.test(k))
  if (!stepKeys.length) return fam
  const out = new Map<string, AliasLeaf>()
  for (const k of stepKeys.sort((a, b) => Number(a) - Number(b))) {
    out.set(k, (fam as Record<string, AliasLeaf>)[k])
  }
  for (const k of Object.keys(fam)) {
    if (!/^\d+$/.test(k)) out.set(k, (fam as Record<string, AliasLeaf>)[k])
  }
  return out
}

/**
 * Serializes the alias palette with Layer 1 overrides applied.
 * Output is pretty-printed 2-space JSON with step keys in canonical
 * ascending numeric order (see {@link sortedStepFamily}); a custom
 * serializer ({@link stringifyOrdered}) is used because `JSON.stringify`
 * would otherwise re-reorder integer-like keys itself.
 * @param aliasJson - The loaded alias palette.
 * @param aliasOverrides - Layer 1 overrides keyed by `family.step` or `family`.
 */
export function exportAliasJson(aliasJson: AliasJson, aliasOverrides: Record<string, string>): string {
  const clone: AliasJson = JSON.parse(JSON.stringify(aliasJson))
  for (const [key, hex] of Object.entries(aliasOverrides)) {
    const [family, step] = key.split('.')
    const entry = clone.color.alias[family]
    if (!entry || typeof entry !== 'object') continue
    if (step) {
      const leaf = (entry as Record<string, AliasLeaf>)[step]
      if (leaf && typeof leaf === 'object') leaf.$value = hex
    } else if (typeof (entry as AliasLeaf).$value === 'string') {
      (entry as AliasLeaf).$value = hex
    }
  }
  const aliasMap = new Map<string, AliasEntry | Map<string, AliasLeaf>>()
  for (const [family, entry] of Object.entries(clone.color.alias)) {
    aliasMap.set(family, sortedStepFamily(entry))
  }
  const root = new Map<string, unknown>()
  root.set('color', new Map<string, unknown>([
    ...(clone.color.$type !== undefined ? [['$type', clone.color.$type] as [string, unknown]] : []),
    ['alias', aliasMap],
  ]))
  return stringifyOrdered(root, 0)
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
