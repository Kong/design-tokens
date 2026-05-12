/**
 * Read a query param from the hash-mode URL (e.g. `/#/customize?o=abc`).
 * In hash routing, `window.location.search` is empty — params live inside the hash.
 */
export function getHashParam(key: string): string | null {
  if (typeof window === 'undefined') return null
  const h = window.location.hash // "#/customize?o=abc"
  const qi = h.indexOf('?')
  return qi >= 0 ? new URLSearchParams(h.slice(qi + 1)).get(key) : null
}

/**
 * Set/delete query params inside the hash fragment and call `history.replaceState`.
 * Returns the full new URL (origin + pathname + new hash) for use as a share link.
 * Pass `null` as a value to delete that param.
 */
export function setHashParams(updates: Record<string, string | null>): string {
  const h = window.location.hash // "#/customize" or "#/customize?old=x"
  const qi = h.indexOf('?')
  const path = h.slice(1, qi >= 0 ? qi : undefined) // "/customize"
  const params = new URLSearchParams(qi >= 0 ? h.slice(qi + 1) : '')
  for (const [k, v] of Object.entries(updates)) {
    if (v !== null) params.set(k, v)
    else params.delete(k)
  }
  const qs = params.toString()
  const newHash = '#' + path + (qs ? '?' + qs : '')
  history.replaceState(null, '', window.location.pathname + newHash)
  return window.location.origin + window.location.pathname + newHash
}
