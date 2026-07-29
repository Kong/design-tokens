/**
 * Replaces the `:root` selector in a CSS block with a custom selector.
 * Returns the original CSS unchanged when `selector` is empty or is `:root`.
 *
 * @param css - A `:root { … }` CSS block.
 * @param selector - The replacement selector, e.g. `[data-theme="dark"]`.
 */
export function applySelector(css: string, selector: string): string {
  const s = selector.trim()
  if (!css || !s || s === ':root') return css
  return css.replace(/^:root\b/m, s)
}
