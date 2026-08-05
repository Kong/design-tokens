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
  return `javascript:${encodeURIComponent(BOOKMARKLET_TEMPLATE.replace(/__EMBED_URL__/g, embedUrl))}`
}
