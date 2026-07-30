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

/**
 * Hardens a token CSS block so its custom-property declarations win the cascade on
 * an arbitrary target page — even one that declares the same `--kui-*` properties in
 * its own stylesheets. Applied only to the CSS we *inject* (bookmarklet sidebar and
 * dev iframe preview); the copyable/exported block stays clean.
 *
 * Two levers, in increasing cost:
 * 1. **`!important` on every declaration** — beats any normal-weight declaration of the
 *    same property regardless of specificity or source order. Idempotent: declarations
 *    that already carry `!important` are left with a single one.
 * 2. **Specificity bump `:root` → `:root:root`** — same element (still the document root,
 *    so tokens inherit everywhere, including teleported KModal/KToaster/etc.), but raised
 *    from (0,1,0) to (0,2,0) so we also win the tiebreak against a target page's own
 *    `!important :root` declaration. This is the minimal bump above `:root`; we
 *    deliberately avoid `:root body` (relocates tokens off the document root onto a
 *    subtree — the pattern the theming docs warn against) and larger hammers like
 *    `:root:root:root`.
 *
 * Not covered (out of scope for token overrides): a target rule that sets a *consuming*
 * property directly and important (e.g. `.btn { color: red !important }` with no `var()`),
 * and `@layer`ed important declarations. Custom selectors (via {@link applySelector}) keep
 * their own specificity and just gain `!important`.
 *
 * Assumes values contain no literal `;`, `{`, or `}` (true for token/alias values) — a
 * `url(data:…;…)` value would be split by the declaration regex.
 *
 * @param css - A token CSS block (`:root { --kui-…: …; }`), possibly with a custom selector.
 */
export function hardenCssPrecedence(css: string): string {
  if (!css) return ''
  return css
    // Bump the specificity of every `:root` selector block. Matching the whole run of
    // consecutive `:root` and collapsing to exactly two keeps this idempotent.
    .replace(/(?::root)+(?=\s*\{)/g, ':root:root')
    // Force every custom-property declaration to win the cascade (idempotent).
    .replace(/(--[\w-]+\s*:\s*[^;{}]+?)(?:\s*!important)?\s*;/g, '$1 !important;')
}
