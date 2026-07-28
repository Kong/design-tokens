/** Rounds and clamps a number to the 0–255 byte range. */
function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)))
}

/** Converts a 0–255 int to a 2-char uppercase hex pair. */
function toHex2(n: number): string {
  return clampByte(n).toString(16).padStart(2, '0').toUpperCase()
}

/**
 * Parses a HEX or RGB(A) color string into a canonical uppercase hex string.
 * Accepts `#abc`, `#aabbcc`, `#aabbccdd`, the same without a leading `#`,
 * `rgb(r,g,b)`, `rgba(r,g,b,a)`, and bare `r,g,b` / `r,g,b,a`. Passes `transparent` through.
 * Returns `#RRGGBB` (or `#RRGGBBAA` when alpha < 1) uppercase, or null if unparseable.
 * @param input - The raw color string (any case; surrounding whitespace ignored). Accepts
 * `null`/`undefined` defensively (e.g. from optional token values) and returns `null` for them.
 */
export function normalizeColor(input: string | null | undefined): string | null {
  if (typeof input !== 'string') return null
  const s = input.trim()
  if (!s) return null
  if (s.toLowerCase() === 'transparent') return 'transparent'

  const hex = s.replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    const [r, g, b] = hex.split('')
    return `#${(r + r + g + g + b + b).toUpperCase()}`
  }
  if (/^[0-9a-f]{6}$/i.test(hex)) return `#${hex.toUpperCase()}`
  if (/^[0-9a-f]{8}$/i.test(hex)) {
    const up = hex.toUpperCase()
    return up.slice(6) === 'FF' ? `#${up.slice(0, 6)}` : `#${up}`
  }

  const m = s.match(/^(?:rgba?\s*\(\s*)?(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)?$/i)
  if (m) {
    const r = toHex2(Number(m[1]))
    const g = toHex2(Number(m[2]))
    const b = toHex2(Number(m[3]))
    if (m[4] !== undefined) {
      const a = Number(m[4])
      if (a < 1) return `#${r}${g}${b}${toHex2(a * 255)}`
    }
    return `#${r}${g}${b}`
  }
  return null
}

/**
 * Formats a canonical hex color as an `rgb()` / `rgba()` string. Passes `transparent`
 * through and returns the input unchanged when it is not a hex color.
 * @param color - A `#RRGGBB` or `#RRGGBBAA` hex string, or `transparent`.
 */
export function toRgbString(color: string): string {
  if (typeof color !== 'string') return ''
  const s = color.trim()
  if (s.toLowerCase() === 'transparent') return 'transparent'
  const hex = s.replace(/^#/, '')
  const at = (i: number) => parseInt(hex.slice(i, i + 2), 16)
  if (/^[0-9a-f]{6}$/i.test(hex)) return `rgb(${at(0)}, ${at(2)}, ${at(4)})`
  if (/^[0-9a-f]{8}$/i.test(hex)) {
    const a = +(at(6) / 255).toFixed(2)
    return `rgba(${at(0)}, ${at(2)}, ${at(4)}, ${a})`
  }
  return color
}

/** True when the input parses as a color (hex, rgb(a), or `transparent`). */
export function isValidColor(input: string): boolean {
  return normalizeColor(input) !== null
}

/**
 * Returns a 6-digit `#RRGGBB` hex safe for a native `<input type="color">`
 * (which cannot represent alpha or `transparent`). Falls back to `fallback`.
 * @param color - Any color value.
 * @param fallback - Hex to use when color is transparent/invalid (default `#000000`).
 */
export function toPickerHex(color: string, fallback = '#000000'): string {
  const n = normalizeColor(color)
  if (!n || n === 'transparent') return fallback
  return n.length >= 7 ? n.slice(0, 7) : fallback
}
