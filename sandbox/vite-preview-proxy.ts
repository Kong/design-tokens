import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

/**
 * Vite dev-only plugin that proxies arbitrary URLs through the dev server at
 * `/preview-proxy?url=<encoded>`, rewriting HTML and CSS responses so that all
 * sub-resource loads (scripts, stylesheets, fonts, images) also go through the
 * proxy — eliminating cross-origin CORS blocks on the proxied page's assets.
 *
 * Injection strategy:
 *  - `<script src>`, inline `<script type="module">` bodies, `<link href>` → absolute proxy URLs
 *  - `<img src>`, `<source src>`, `<video src>`, `<audio src>`, `srcset=` → absolute proxy URLs
 *  - CSS `url()` and `@import` references → absolute proxy URLs
 *  - `<base>` tag kept so `<a href>` relative links resolve correctly for the click interceptor
 *  - Absolute proxy URLs are used (not path-relative) so the `<base>` tag can't re-resolve them
 */
export function previewProxyPlugin(): Plugin {
  return {
    name: 'preview-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/preview-proxy', async (req: IncomingMessage, res: ServerResponse) => {
        const rawUrl = req.url ?? ''
        const qIdx = rawUrl.indexOf('?')

        // Two URL formats are accepted:
        //   • Query-string: ?url=https%3A%2F%2F...    (used for HTML pages, CSS, etc.)
        //   • Path-based:   /https/host/path...       (used by the import-map value so
        //     the mapped URL's path can end with `/`, which import maps require for
        //     prefix entries — the ?url=... form has path /preview-proxy, not /.)
        let urlParam: string | null
        if (qIdx !== -1) {
          urlParam = new URLSearchParams(rawUrl.slice(qIdx)).get('url')
        } else if (rawUrl.startsWith('/') && rawUrl.length > 1) {
          // /https/kongponents.konghq.com/assets/foo.js → https://kongponents.konghq.com/assets/foo.js
          const withoutSlash = rawUrl.slice(1)
          const firstSlash = withoutSlash.indexOf('/')
          if (firstSlash !== -1) {
            const protocol = withoutSlash.slice(0, firstSlash).toLowerCase()
            if (protocol === 'http' || protocol === 'https') {
              urlParam = `${protocol}://${withoutSlash.slice(firstSlash + 1)}`
            } else {
              urlParam = null
            }
          } else {
            urlParam = null
          }
        } else {
          urlParam = null
        }

        if (!urlParam) {
          res.writeHead(400, { 'content-type': 'text/plain' })
          res.end('Missing ?url= parameter or valid /protocol/host/path')
          return
        }

        let targetUrl: URL
        try {
          targetUrl = new URL(urlParam)
        } catch {
          res.writeHead(400, { 'content-type': 'text/plain' })
          res.end('Invalid URL')
          return
        }

        try {
          const upstream = await fetch(urlParam, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; KUITokenPreview/1.0)',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            redirect: 'follow',
          })

          const contentType = upstream.headers.get('content-type') ?? ''

          const STRIP_HEADERS = new Set([
            'content-security-policy',
            'content-security-policy-report-only',
            'x-frame-options',
            'x-content-type-options',
            // Node's fetch decodes the body before we read it, so these wire-encoding
            // headers would cause the browser to attempt a second decode pass.
            'transfer-encoding',
            'content-encoding',
            'content-length',
            // Prevent upstream Set-Cookie from being applied to localhost
            'set-cookie',
          ])

          res.statusCode = upstream.status

          for (const [key, value] of upstream.headers.entries()) {
            if (!STRIP_HEADERS.has(key.toLowerCase())) {
              res.setHeader(key, value)
            }
          }

          // Derive the proxy origin from the request's Host header so rewritten URLs
          // are absolute and won't be affected by the <base> tag on the proxied page.
          // Sanitize the host value to prevent a crafted Host header from breaking injected scripts.
          const rawHost = (Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host) ?? 'localhost:5173'
          const safeHost = rawHost.replace(/[^a-zA-Z0-9.\-:[\]]/g, '')
          const proxyBase = `http://${safeHost}`

          // Use upstream.url (the final URL after redirects) as the rewriting base so that
          // relative sub-resource URLs in the response resolve against the correct origin.
          const pageUrl = upstream.url || urlParam

          const isHtml = contentType.includes('text/html') || contentType.includes('application/xhtml+xml')

          if (isHtml) {
            // Re-derive origin from the final URL so <base href> points to the right place
            // after any http→https or www→apex redirects.
            const finalUrl = new URL(pageUrl)
            const origin = `${finalUrl.protocol}//${finalUrl.host}`
            // HTML-encode characters that could break the attribute value
            const safeOrigin = origin.replace(/["'<>&]/g, (c) => `&#${c.charCodeAt(0)};`)
            let html = await upstream.text()

            // The path+search+hash from the original URL, used below to fix SPA routing.
            const originalPath = finalUrl.pathname + finalUrl.search + finalUrl.hash

            // Import map: redirects root-relative `/assets/…` dynamic import() calls to the
            // proxy. Without this, `import('/assets/page.lean.js')` inside a proxied module
            // resolves against the proxy's own origin (localhost) and 404s.
            //
            // Key: absolute URL `${proxyBase}/assets/` — must be absolute (not `/assets/`)
            //   because `/assets/` keys are normalized against document.baseURI (our <base>
            //   tag → target origin), while import() in a module resolves against the module's
            //   own URL origin (proxyBase). Absolute keys bypass baseURI normalization.
            //
            // Value: uses the path-based proxy format `/preview-proxy/https/host/assets/`
            //   instead of the query-string format `?url=…` because the import-map spec
            //   requires prefix map VALUES to have a path ending in `/`. The ?url= form has
            //   path `/preview-proxy` (no trailing slash), which the browser rejects.
            //   The path-based format is `/preview-proxy/https/kongponents.konghq.com/assets/`
            //   whose path does end with `/` ✓. The middleware parses this back to a URL.
            //
            // Trailing-slash keys act as URL prefix maps (HTML spec § import maps).
            // The importmap must appear before any <script type="module"> or modulepreload.
            const encodedOrigin = origin.replace('://', '/') // 'https://host' → 'https/host'
            const assetsProxyBase = `${proxyBase}/preview-proxy/${encodedOrigin}/assets/`
            const importMapTag = `<script type="importmap">${JSON.stringify({ imports: { [`${proxyBase}/assets/`]: assetsProxyBase } })}</script>`

            // Inject as the FIRST elements inside <head> so they run before any scripts:
            //
            // 1. importmap — redirects root-relative /assets/ imports to the proxy so that
            //    dynamic import('/assets/…') in SPA frameworks resolves correctly.
            //
            // 2. history.replaceState — rewrites location.pathname to the original page path
            //    so SPA client-side routers (VitePress, Vue Router, React Router…) see
            //    the correct route. Without this, the router reads /preview-proxy as the
            //    path, matches nothing, and renders its 404 page.
            //    history.replaceState resolves relative URLs against document.baseURI (our
            //    <base> tag), which would make them cross-origin (SecurityError). Use an
            //    absolute same-origin URL (proxyBase + path) so the browser accepts it.
            //
            // 3. fetch/XHR override — rewrites all cross-origin URLs at runtime so that
            //    network requests (API calls, hashmap.json, etc.) go through the proxy.
            //    _p() handles three cases:
            //      a) Absolute cross-origin https:// URLs — proxy directly.
            //      b) Protocol-relative //host/… URLs — prepend https: then proxy.
            //      c) Root-relative /path URLs — the <base> tag makes these resolve to
            //         the target origin; prepend origin before proxying.
            const spaPath = `${proxyBase}${originalPath.replace(/'/g, "\\'")}`
            // JS-safe origin (origin contains only protocol/host chars, no quotes needed)
            const safeOriginJs = origin.replace(/'/g, "\\'")
            const networkOverrideScript = `<script>(function(){
  try{history.replaceState(null,'','${spaPath}');}catch(e){}
  var _b='${proxyBase}';
  var _o='${safeOriginJs}';
  function _p(u){
    if(typeof u!=='string')return u;
    if(/^https?:\\/\\//i.test(u)&&u.indexOf(_b)!==0)return _b+'/preview-proxy?url='+encodeURIComponent(u);
    if(u.indexOf('//')=== 0)return _b+'/preview-proxy?url='+encodeURIComponent('https:'+u);
    if(u.charAt(0)==='/')return _b+'/preview-proxy?url='+encodeURIComponent(_o+u);
    return u;
  }
  var _f=window.fetch;
  window.fetch=function(input,init){
    if(typeof input==='string')return _f(_p(input),init);
    if(typeof URL!=='undefined'&&input instanceof URL)return _f(new URL(_p(input.href)),init);
    if(input&&typeof input.url==='string'){var pu=_p(input.url);if(pu!==input.url)return _f(new Request(pu,input),init);}
    return _f(input,init);
  };
  var _x=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u){
    var a=Array.prototype.slice.call(arguments);a[1]=typeof u==='string'?_p(u):u;return _x.apply(this,a);
  };
  // Strip SRI integrity checks at the DOM level so that dynamically-created
  // <script> and <link> elements (e.g. Nuxt/Next route-chunk loading) do not
  // block because the proxy rewrites JS content, changing the hash.
  var _sa=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(n,v){
    if(n.toLowerCase()==='integrity')return;
    return _sa.call(this,n,v);
  };
  try{
    var _noop=function(){};
    var _empty=function(){return '';};
    Object.defineProperty(HTMLScriptElement.prototype,'integrity',{set:_noop,get:_empty,configurable:true});
    Object.defineProperty(HTMLLinkElement.prototype,'integrity',{set:_noop,get:_empty,configurable:true});
  }catch(e){}
})();</script>`

            // Inject <base> + importmap + the network override at the start of <head>.
            // <base> must come first so relative URL resolution uses the target origin.
            // importmap must precede all module scripts and modulepreload links.
            if (!/<base[\s>]/i.test(html)) {
              html = html.replace(/(<head[^>]*>)/i, `$1\n  <base href="${safeOrigin}/">\n  ${importMapTag}\n  ${networkOverrideScript}`)
            } else {
              html = html.replace(/(<head[^>]*>)/i, `$1\n  ${importMapTag}\n  ${networkOverrideScript}`)
            }

            // Rewrite resource-loading attributes so sub-resources go through the proxy
            // (avoids CORS blocks). Uses absolute proxy URLs so the <base> tag above
            // doesn't accidentally re-resolve them against the target origin.
            html = rewriteHtmlResources(html, pageUrl, proxyBase)

            // Inject the override style tag + postMessage bridge before </head>.
            const headScript = `<script>(function(){
  // Ping the parent so it can re-inject CSS token overrides after every navigation.
  window.parent.postMessage({type:'kui-frame-ready'},'*');
  // Accept CSS pushes from the parent (used by the customizer watcher).
  window.addEventListener('message',function(e){
    if(!e.data||e.data.type!=='kui-inject-css')return;
    var s=document.getElementById('tb-token-overrides');
    if(!s){s=document.createElement('style');s.id='tb-token-overrides';(document.head||document.documentElement).appendChild(s);}
    s.textContent=e.data.css||'';
  });
})();</script>`
            html = html.replace(/<\/head>/i, `  <style id="tb-token-overrides"></style>\n  ${headScript}\n</head>`)

            // Intercept link clicks so in-frame navigation stays proxied.
            const interceptScript = `<script>(function(){
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a'):null;
    if(!a||!a.href)return;
    var abs=a.href;
    if(!abs.match(/^https?:\\/\\//))return;
    if(a.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey)return;
    var frag=abs.indexOf('#');
    if(frag!==-1&&abs.slice(0,frag)===location.href.split('#')[0])return;
    e.preventDefault();
    location.href='${proxyBase}/preview-proxy?url='+encodeURIComponent(abs);
  },true);
})();</script>`
            html = html.replace(/<\/body>/i, `${interceptScript}\n</body>`)

            res.setHeader('content-type', 'text/html; charset=utf-8')
            res.end(html)
          } else if (contentType.includes('text/css')) {
            // Rewrite url() and @import in CSS so fonts, images, and other assets go through the proxy.
            let css = await upstream.text()
            css = rewriteCssResources(css, pageUrl, proxyBase)
            res.setHeader('content-type', contentType.includes('charset') ? contentType : `${contentType}; charset=utf-8`)
            res.end(css)
          } else if (contentType.includes('javascript') || contentType.includes('ecmascript') || /\.[cm]?js(\?|$)/.test(urlParam)) {
            // Rewrite ES module import/export specifiers so module scripts can be
            // served same-origin. Without this, `import './chunk.js'` inside a proxied
            // module would resolve against the proxy URL (localhost) instead of the
            // target origin, breaking the entire module graph.
            let js = await upstream.text()
            js = rewriteJsImports(js, pageUrl, proxyBase)
            const ct = contentType || 'application/javascript'
            res.setHeader('content-type', ct.includes('charset') ? ct : `${ct}; charset=utf-8`)
            res.end(js)
          } else {
            // Images, fonts, binary assets: stream unchanged.
            const buffer = await upstream.arrayBuffer()
            res.end(Buffer.from(buffer))
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          // Remove any headers already buffered from the upstream response
          // (e.g. set-cookie from a partial forward) before sending the error.
          for (const name of res.getHeaderNames()) res.removeHeader(name)
          res.writeHead(502, { 'content-type': 'text/plain' })
          res.end(`Proxy error: ${message}`)
        }
      })
    },
  }
}

/**
 * Makes a URL absolute given a base URL.
 * Returns the original string unchanged for special schemes that should not be proxied.
 */
function absoluteUrl(url: string, base: string): string {
  const t = url.trim()
  if (!t || /^(data:|blob:|javascript:|#|mailto:|tel:)/i.test(t)) return t
  try {
    return new URL(t, base).href
  } catch {
    return t
  }
}

/**
 * Returns an absolute proxy URL for a given resource URL.
 * Uses proxyBase (e.g. http://localhost:5173) so the URL is absolute and won't be
 * re-resolved by a <base> tag on the proxied page.
 */
function toProxiedUrl(url: string, base: string, proxyBase: string): string {
  const abs = absoluteUrl(url, base)
  if (abs === url.trim()) return url // special scheme or parse failure — leave unchanged
  if (abs.includes('/preview-proxy?url=')) return abs // already proxied
  return `${proxyBase}/preview-proxy?url=${encodeURIComponent(abs)}`
}

/**
 * Rewrites resource URLs in HTML so assets load through the proxy.
 *
 * - `<link href>`: always proxied (stylesheets, preload, prefetch, modulepreload).
 * - `<script src>` (classic and module): proxied so scripts aren't CORS-blocked.
 * - Inline `<script type="module">` bodies: JS import specifiers rewritten via rewriteJsImports.
 * - `<img src>`, `<source src>`, `<video src>`, `<audio src>`: proxied so media isn't CORS-blocked.
 * - `srcset=`: each entry in the comma-separated list is proxied individually.
 * - `<meta http-equiv="refresh">`: the redirect URL is proxied so navigation stays in-frame.
 * - `<a href>`: NOT rewritten — the click interceptor handles link navigation.
 */
function rewriteHtmlResources(html: string, pageUrl: string, proxyBase: string): string {
  const proxy = (url: string) => toProxiedUrl(url, pageUrl, proxyBase)

  // Rewrite href= on <link> elements (stylesheets, preload, prefetch, modulepreload).
  // Also strip integrity= attributes: the proxy rewrites JS/CSS content, invalidating
  // any SRI hash the upstream page set.
  html = html.replace(
    /(<link)([^>]*?)(>)/gi,
    (match, open: string, attrs: string, close: string) => {
      const hasHref = /\shref\s*=\s*["'][^"']*["']/i.test(attrs)
      if (!hasHref) return match
      let a = attrs.replace(
        /(\shref)(\s*=\s*)("([^"]*?)"|'([^']*?)')/i,
        (_, attr, eq, _quoted, dq, sq) => {
          const val = dq ?? sq ?? ''
          const q = dq !== undefined ? '"' : "'"
          return `${attr}${eq}${q}${proxy(val)}${q}`
        },
      )
      // Strip integrity= — SRI hashes no longer match after proxy content rewriting
      a = a.replace(/\s+integrity\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
      return `${open}${a}${close}`
    },
  )

  // Rewrite src= on all <script> tags (classic and module), rewrite import specifiers
  // inside inline <script type="module"> blocks, and rewrite inline <style> bodies.
  // Also strip integrity= from <script> tags whose src we rewrite.
  html = html.replace(
    /<script([^>]*)>([\s\S]*?)<\/script>/gi,
    (match, attrs: string, body: string) => {
      const hasSrc = /\ssrc\s*=\s*["'][^"']*["']/i.test(attrs)
      let rewrittenAttrs = attrs
      if (hasSrc) {
        rewrittenAttrs = attrs.replace(
          /(\ssrc)(\s*=\s*)("([^"]*?)"|'([^']*?)')/i,
          (_, attr, eq, _quoted, dq, sq) => {
            const val = dq ?? sq ?? ''
            const q = dq !== undefined ? '"' : "'"
            return `${attr}${eq}${q}${proxy(val)}${q}`
          },
        )
        // Strip integrity= — SRI hash no longer matches after proxy rewriting
        rewrittenAttrs = rewrittenAttrs.replace(/\s+integrity\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
      }
      // Rewrite import specifiers inside inline module scripts
      const isModule = /\btype\s*=\s*["']module["']/i.test(attrs)
      const rewrittenBody = isModule && body.trim() ? rewriteJsImports(body, pageUrl, proxyBase) : body
      return `<script${rewrittenAttrs}>${rewrittenBody}</script>`
    },
  )

  // Rewrite url() and @import inside inline <style> blocks.
  // Nuxt/Next font optimization injects @font-face rules with url(/_fonts/…) in inline
  // <style> tags — these are never loaded through the proxy's CSS rewriter, so without
  // this pass the browser fetches fonts directly from the target origin and hits CORS.
  html = html.replace(
    /<style([^>]*)>([\s\S]*?)<\/style>/gi,
    (_, attrs: string, body: string) => {
      // Skip importmap / application/* types — they are not CSS
      if (/\btype\s*=\s*["'](?!text\/css)[^"']*["']/i.test(attrs)) return _
      const rewritten = rewriteCssResources(body, pageUrl, proxyBase)
      return `<style${attrs}>${rewritten}</style>`
    },
  )

  // Rewrite src= on <img>, <source>, <video>, and <audio> elements
  html = html.replace(
    /(<(?:img|source|video|audio)[^>]*?\s)(src)(\s*=\s*)("([^"]*?)"|'([^']*?)')/gi,
    (_, before, attr, eq, _quoted, dq, sq) => {
      const val = dq ?? sq ?? ''
      const q = dq !== undefined ? '"' : "'"
      return `${before}${attr}${eq}${q}${proxy(val)}${q}`
    },
  )

  // Rewrite srcset= on <img> and <source> elements.
  // Srcset values are comma-separated `url descriptor` pairs, e.g. "hero.jpg 1x, hero@2x.jpg 2x".
  // data: URIs contain commas in their base64 payload, so we can't naively split on every comma.
  html = html.replace(
    /(<(?:img|source)[^>]*?\s)(srcset)(\s*=\s*)("([^"]*?)"|'([^']*?)')/gi,
    (_, before, attr, eq, _quoted, dq, sq) => {
      const val = dq ?? sq ?? ''
      const q = dq !== undefined ? '"' : "'"
      const rewritten = parseSrcset(val)
        .map((part) => {
          const trimmed = part.trim()
          const spaceIdx = trimmed.search(/\s/)
          if (spaceIdx === -1) return proxy(trimmed)
          return `${proxy(trimmed.slice(0, spaceIdx))} ${trimmed.slice(spaceIdx + 1).trim()}`
        })
        .join(', ')
      return `${before}${attr}${eq}${q}${rewritten}${q}`
    },
  )

  // Rewrite <meta http-equiv="refresh" content="N;url=..."> so in-frame redirects stay proxied.
  html = html.replace(
    /(<meta[^>]+http-equiv\s*=\s*["']refresh["'][^>]+content\s*=\s*["'][^"']*?url=)([^"'\s;>]+)/gi,
    (_, prefix, url) => `${prefix}${proxy(url)}`,
  )

  return html
}

/**
 * Rewrites ES module import/export specifiers in JavaScript so the module
 * graph resolves through the proxy rather than the original origin.
 *
 * Four passes, in order:
 *
 * 1. Rewrite relative-path string literals that look like JS chunks
 *    (e.g. `"./SomeComp.Bxyz.js"`) in array/function-call contexts only.
 *    Vite stores these in `__vite__mapDeps` arrays for lazy-loaded routes —
 *    they never appear next to an `import` keyword so the later keyword
 *    passes would miss them entirely.
 *
 * 2–4. Rewrite `from"url"`, `import"url"` (side-effect), and `import("url")`
 *    (dynamic) keyword specifiers. Before each pass, string/template-literal
 *    byte ranges are recomputed on the current source so the guard remains
 *    accurate after earlier passes expand URLs (changing byte offsets).
 *    Negative lookbehind `(?<!\.)` prevents `.from"url"` / `.import("url")`
 *    property-access patterns from being treated as module keywords.
 *    Dynamic import pass also handles `import(/* comment *\/ "url")` forms
 *    used by webpack/rollup chunk-name annotations.
 */
function rewriteJsImports(js: string, jsUrl: string, proxyBase: string): string {
  const proxy = (url: string) => toProxiedUrl(url, jsUrl, proxyBase)

  // ── Pass 1: rewrite relative-path chunk strings ───────────────────────────
  // Targets relative .js strings that appear after `[`, `,`, or `(` — the only
  // syntactic positions where Vite stores lazy-chunk URLs (e.g. __vite__mapDeps
  // arrays). This avoids accidentally rewriting data strings like grammar rules
  // or locale files that happen to end in .js.
  js = js.replace(
    /(?<=[[,(])\s*(["'])(\.\.?\/[^"'\n\\]*\.(?:[cm]?js))\1/g,
    (match, q: string, url: string) => match.replace(`${q}${url}${q}`, `${q}${proxy(url)}${q}`),
  )

  /**
   * Computes string/template-literal byte ranges in `src`.
   * Recomputed before each keyword pass so expanded proxy URLs don't shift
   * the guard's understanding of where string literals end.
   */
  function computeStringRanges(src: string): Array<[number, number]> {
    const ranges: Array<[number, number]> = []
    const LITERAL_RE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g
    for (const m of src.matchAll(LITERAL_RE)) {
      ranges.push([m.index!, m.index! + m[0].length])
    }
    return ranges
  }

  /** True when `pos` falls inside a known string literal range (binary search). */
  function inString(pos: number, ranges: Array<[number, number]>): boolean {
    let lo = 0
    let hi = ranges.length - 1
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      const [start, end] = ranges[mid]
      if (pos < start) hi = mid - 1
      else if (pos >= end) lo = mid + 1
      else return true
    }
    return false
  }

  // ── Pass 2: static specifiers — `from"url"` / `from "url"` ───────────────
  // (?<!\.) prevents property accesses like `obj.from"url"` from matching.
  // \s* handles minified bundles that omit the space between `from` and `"`.
  // String ranges are recomputed fresh here so Pass 1's URL expansions don't
  // misalign the guard.
  let ranges = computeStringRanges(js)
  js = js.replace(
    /(?<!\.)\bfrom\s*(["'])([^"'\n\\]+)\1/g,
    (match, q: string, url: string, offset: number) =>
      inString(offset, ranges) ? match : `from ${q}${proxy(url)}${q}`,
  )

  // ── Pass 3: side-effect imports — `import"url"` / `import "url"` ─────────
  // Recompute ranges: Pass 2 may have expanded specifiers, shifting offsets.
  ranges = computeStringRanges(js)
  js = js.replace(
    /(?<!\.)\bimport\s*(["'])([^"'\n\\]+)\1/g,
    (match, q: string, url: string, offset: number) =>
      inString(offset, ranges) ? match : `import ${q}${proxy(url)}${q}`,
  )

  // ── Pass 4: dynamic imports — `import("url")` and `import(/*…*/ "url")` ──
  // The optional block-comment pattern handles webpack/rollup chunk-name
  // annotations: import(/* webpackChunkName: "vendor" */ "./vendor.js").
  // Recompute ranges again for the same reason as Pass 3.
  ranges = computeStringRanges(js)
  js = js.replace(
    /(?<!\.)\bimport\s*\(\s*(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)?(["'])([^"'\n\\]+)\1\s*\)/g,
    (match, q: string, url: string, offset: number) =>
      inString(offset, ranges) ? match : `import(${q}${proxy(url)}${q})`,
  )

  return js
}

/**
 * Splits a `srcset` attribute value into individual entries without breaking
 * data URIs, which contain commas in their base64 payload.
 * Regular entries end at a comma that follows an optional `w`/`x` descriptor.
 */
function parseSrcset(val: string): string[] {
  const parts: string[] = []
  let rest = val
  while (rest.length > 0) {
    const trimmed = rest.trimStart()
    if (/^data:/i.test(trimmed)) {
      // Consume the data: URI (including its base64 commas) up to the optional
      // descriptor, then the separating comma or end-of-string.
      const m = rest.match(/^(\s*data:[^\s,]+(?:,[^\s,]+)*(?:\s+\d+(?:\.\d+)?[wx])?)\s*(?:,|$)/i)
      if (m) {
        parts.push(m[1]); rest = rest.slice(m[0].length); continue
      }
    }
    const comma = rest.indexOf(',')
    if (comma === -1) {
      parts.push(rest); break
    }
    parts.push(rest.slice(0, comma))
    rest = rest.slice(comma + 1)
  }
  return parts
}

/**
 * Rewrites url() and @import references in CSS so fonts, images, and other assets
 * load through the proxy.
 */
function rewriteCssResources(css: string, cssUrl: string, proxyBase: string): string {
  // Rewrite @import "url" and @import 'url' (bare-string form, without url() wrapper).
  // This covers Google Fonts, inter-stylesheet imports, and CSS framework imports.
  // Media queries after the URL (e.g. @import "style.css" screen) are preserved
  // because they fall outside the regex match.
  css = css.replace(
    /@import\s*(["'])([^"'\n]+)\1/gi,
    (_, q, url) => `@import ${q}${toProxiedUrl(url, cssUrl, proxyBase)}${q}`,
  )

  // Rewrite url() function references (stylesheets, fonts, images, backgrounds).
  // Also handles @import url("...") since the url() is matched here.
  css = css.replace(
    /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/gi,
    (_, quote, url) => `url(${quote}${toProxiedUrl(url, cssUrl, proxyBase)}${quote})`,
  )

  return css
}
