import { BOOKMARKLET_TEMPLATE } from './preview-bookmarklet'

/**
 * Builds the single unified bookmarklet's `javascript:` href, resolved at runtime so
 * `__EMBED_URL__` points at the actual deployment origin (works for both localhost dev and
 * GitHub Pages). Shared by every bookmarklet-install UI so there's exactly one place that
 * knows how to build it.
 */
export function buildBookmarkletHref(): string {
  if (typeof window === 'undefined') return '#'
  const embedUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/embedded?embedded=1`
  const href = `javascript:${encodeURIComponent(BOOKMARKLET_TEMPLATE.replace(/__EMBED_URL__/g, embedUrl))}`
  return isJavascriptScheme(href) ? href : '#'
}

/**
 * Returns true only if `href` is a `javascript:` URI, after stripping the ASCII
 * whitespace/control characters browsers ignore when parsing a URL scheme (the
 * classic `jav\tascript:` / leading-newline bypass for naive prefix checks).
 */
export function isJavascriptScheme(href: string): boolean {
  const normalized = href.replace(/[\t\n\r ]/g, '').toLowerCase()
  return normalized.startsWith('javascript:')
}
