import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

/**
 * Vite dev-only plugin that proxies arbitrary URLs through `/preview-proxy?url=<encoded>`,
 * rewriting HTML/CSS/JS responses so all sub-resource loads also go through the proxy.
 *
 * Two request formats:
 *  - Query-string: `?url=https%3A%2F%2F...`  — used for HTML pages, CSS, JS, images
 *  - Path-based: `/https/host/path`          — used as importmap values; importmap spec
 *    requires prefix entries to end with `/`, which the `?url=` form's path cannot satisfy
 */
export function previewProxyPlugin(): Plugin {
  return {
    name: 'preview-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/preview-proxy', async (req: IncomingMessage, res: ServerResponse) => {
        const rawUrl = req.url ?? ''
        const qIdx = rawUrl.indexOf('?')

        let urlParam: string | null
        if (qIdx !== -1) {
          urlParam = new URLSearchParams(rawUrl.slice(qIdx)).get('url')
        } else if (rawUrl.startsWith('/') && rawUrl.length > 1) {
          // /https/host/path → https://host/path
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

        try {
          new URL(urlParam)
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
            // Node's fetch decodes the body, so these would cause the browser to decode again
            'transfer-encoding',
            'content-encoding',
            'content-length',
            // Prevent upstream cookies from being set on localhost
            'set-cookie',
          ])

          res.statusCode = upstream.status

          for (const [key, value] of upstream.headers.entries()) {
            if (!STRIP_HEADERS.has(key.toLowerCase())) {
              res.setHeader(key, value)
            }
          }

          // Sanitize Host header to prevent a crafted value from breaking injected scripts
          const rawHost = (Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host) ?? 'localhost:5173'
          const safeHost = rawHost.replace(/[^a-zA-Z0-9.\-:[\]]/g, '')
          const proxyBase = `http://${safeHost}`

          // Use the final URL after redirects so relative sub-resource URLs resolve correctly
          const pageUrl = upstream.url || urlParam

          const isHtml = contentType.includes('text/html') || contentType.includes('application/xhtml+xml')

          if (isHtml) {
            const finalUrl = new URL(pageUrl)
            const origin = `${finalUrl.protocol}//${finalUrl.host}`
            const safeOrigin = origin.replace(/["'<>&]/g, (c) => `&#${c.charCodeAt(0)};`)
            let html = await upstream.text()

            // Use the hash from the *original* urlParam: Node.js fetch() strips fragment
            // identifiers (they're never sent to the server), so finalUrl.hash is always empty.
            // If the user passed e.g. https://example.com/#/button we must restore #/button so
            // SPA hash-mode routers see the correct initial route.
            const requestedHash = (() => { try { return new URL(urlParam).hash } catch { return '' } })()
            const originalPath = finalUrl.pathname + finalUrl.search + (requestedHash || finalUrl.hash)

            // Importmap key must be absolute (not `/assets/`) because relative keys are normalized
            // against document.baseURI (our <base> tag → target origin), but import() in a module
            // resolves against the module's own origin (proxyBase). Absolute keys bypass baseURI.
            //
            // Importmap value uses path-based proxy format so it can end with `/` as the spec
            // requires for prefix entries. The `?url=` form's path is `/preview-proxy` (no `/`).
            const encodedOrigin = origin.replace('://', '/') // 'https://host' → 'https/host'
            const assetsProxyBase = `${proxyBase}/preview-proxy/${encodedOrigin}/assets/`
            const importMapTag = `<script type="importmap">${JSON.stringify({ imports: { [`${proxyBase}/assets/`]: assetsProxyBase } })}</script>`

            // Injected first in <head> so they run before any page scripts:
            //   1. importmap — SPA frameworks use dynamic import('/assets/…'); without this the
            //      browser resolves those against localhost and 404s.
            //   2. history.replaceState — SPA routers read location.pathname; we must restore the
            //      original path or the router renders its 404 page. Must be absolute to avoid
            //      SecurityError (relative URLs resolve against <base> → cross-origin).
            //   3. fetch/XHR/SRI overrides — route runtime network requests through the proxy and
            //      strip integrity checks on dynamically-created elements (e.g. Nuxt route chunks).
            const spaPath = `${proxyBase}${escapeForJsString(originalPath)}`
            const safeOriginJs = escapeForJsString(origin)
            const networkOverrideScript = `<script>(function(){
  // Restore original path so SPA routers (Vue Router, React Router…) see the correct route.
  // Must be an absolute same-origin URL; relative URLs resolve against <base> → SecurityError.
  try{history.replaceState(null,'','${spaPath}');}catch(e){}

  var _b='${proxyBase}';    // proxy base, e.g. http://localhost:5173
  var _o='${safeOriginJs}'; // target origin, e.g. https://example.com

  // Rewrites any URL to a proxy URL. Three input forms are handled:
  //   absolute cross-origin  https://other.com/… → /preview-proxy?url=…
  //   protocol-relative      //other.com/…       → /preview-proxy?url=https://other.com/…
  //   root-relative          /path               → /preview-proxy?url=<origin>/path
  // Same-origin and non-string values are returned unchanged.
  function _p(u){
    if(typeof u!=='string')return u;
    if(/^https?:\\/\\//i.test(u)&&u.indexOf(_b)!==0)return _b+'/preview-proxy?url='+encodeURIComponent(u);
    if(u.indexOf('//')=== 0)return _b+'/preview-proxy?url='+encodeURIComponent('https:'+u);
    if(u.charAt(0)==='/')return _b+'/preview-proxy?url='+encodeURIComponent(_o+u);
    return u;
  }

  // Intercept window.fetch — handles string URLs, URL objects, and Request objects.
  var _f=window.fetch;
  window.fetch=function(input,init){
    if(typeof input==='string')return _f(_p(input),init);
    if(typeof URL!=='undefined'&&input instanceof URL)return _f(new URL(_p(input.href)),init);
    if(input&&typeof input.url==='string'){var pu=_p(input.url);if(pu!==input.url)return _f(new Request(pu,input),init);}
    return _f(input,init);
  };

  // Intercept XMLHttpRequest.open — rewrites the URL (argument index 1) in-place.
  var _x=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u){
    var a=Array.prototype.slice.call(arguments);a[1]=typeof u==='string'?_p(u):u;return _x.apply(this,a);
  };

  // Route dynamically-created <script src> and <link href> elements through the proxy.
  // Vite's __vitePreload creates these elements at runtime (route-chunk lazy loading).
  // The URLs resolve against document.baseURI (<base href> = target origin) so they become
  // absolute cross-origin URLs that CORS would block.
  // Two layers: setAttribute intercept (covers .setAttribute('src'|'href',…)) and
  // prototype property override (covers direct .src/.href = '…' assignments).
  var _sa=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(n,v){
    var nl=n.toLowerCase();
    if(nl==='integrity')return;
    var tag=this.tagName?this.tagName.toUpperCase():'';
    if(typeof v==='string'){
      if(nl==='src'&&(tag==='SCRIPT'||tag==='IMG'||tag==='VIDEO'||tag==='AUDIO'||tag==='SOURCE'||tag==='IFRAME'))
        return _sa.call(this,n,_p(v));
      if(nl==='href'&&tag==='LINK')
        return _sa.call(this,n,_p(v));
    }
    return _sa.call(this,n,v);
  };
  try{
    var _noop=function(){};
    var _empty=function(){return '';};
    Object.defineProperty(HTMLScriptElement.prototype,'integrity',{set:_noop,get:_empty,configurable:true});
    Object.defineProperty(HTMLLinkElement.prototype,'integrity',{set:_noop,get:_empty,configurable:true});
  }catch(e){}
  try{
    var _sd=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,'src');
    if(_sd&&_sd.set)Object.defineProperty(HTMLScriptElement.prototype,'src',{
      set:function(v){_sd.set.call(this,typeof v==='string'?_p(v):v);},get:_sd.get,configurable:true
    });
  }catch(e){}
  try{
    var _ld=Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype,'href');
    if(_ld&&_ld.set)Object.defineProperty(HTMLLinkElement.prototype,'href',{
      set:function(v){_ld.set.call(this,typeof v==='string'?_p(v):v);},get:_ld.get,configurable:true
    });
  }catch(e){}

  // Intercept window.location navigation so the proxied page cannot escape the proxy.
  // SPA routers (Vue Router, React Router…) sometimes call location.replace/assign or
  // set location.href when their base URL initialization detects a mismatch — without
  // these interceptors the page navigates out of the proxy to the original origin.
  //
  // For cross-origin URLs that contain a hash fragment (e.g. https://netlify.app/#/route),
  // we extract just the hash so that hash-mode routers continue to work without triggering
  // a full page reload. Cross-origin URLs without a hash are routed through the proxy.
  function _pn(u){
    if(typeof u!=='string')return u;
    if(/^https?:\\/\\//i.test(u)&&u.indexOf(_b)!==0){
      var hi=u.indexOf('#');return hi!==-1?u.slice(hi):_b+'/preview-proxy?url='+encodeURIComponent(u);
    }
    if(u.indexOf('//')=== 0)return _b+'/preview-proxy?url='+encodeURIComponent('https:'+u);
    if(u.charAt(0)==='/')return _b+'/preview-proxy?url='+encodeURIComponent(_o+u);
    return u;
  }
  try{var _lr=window.location.replace.bind(window.location);window.location.replace=function(u){_lr(_pn(u));};}catch(e){}
  try{var _la=window.location.assign.bind(window.location);window.location.assign=function(u){_la(_pn(u));};}catch(e){}
  try{
    var _hd=Object.getOwnPropertyDescriptor(Location.prototype,'href');
    if(_hd&&_hd.set)Object.defineProperty(Location.prototype,'href',{set:function(u){_hd.set.call(this,_pn(u));},get:_hd.get,configurable:true});
  }catch(e){}

  // Intercept history.replaceState/pushState: cross-origin absolute URLs with a hash
  // (e.g. https://netlify.app/#/route) are collapsed to just the hash so hash-mode
  // routers stay on the proxy URL. Other cross-origin URLs are proxied via _p().
  function _ph(u){
    if(typeof u!=='string'||!u)return u;
    if(/^https?:\\/\\//i.test(u)&&u.indexOf(_b)!==0){
      var hi=u.indexOf('#');return hi!==-1?u.slice(hi):_p(u);
    }
    return u;
  }
  try{var _hR=history.replaceState.bind(history);history.replaceState=function(s,t,u){try{_hR(s,t,_ph(u));}catch(e){}};} catch(e){}
  try{var _hP=history.pushState.bind(history);history.pushState=function(s,t,u){try{_hP(s,t,_ph(u));}catch(e){}};} catch(e){}
})();</script>`

            // <base> first (relative URL base), then importmap (must precede all module scripts)
            if (!/<base[\s>]/i.test(html)) {
              html = html.replace(/(<head[^>]*>)/i, `$1\n  <base href="${safeOrigin}/">\n  ${importMapTag}\n  ${networkOverrideScript}`)
            } else {
              html = html.replace(/(<head[^>]*>)/i, `$1\n  ${importMapTag}\n  ${networkOverrideScript}`)
            }

            html = rewriteHtmlResources(html, pageUrl, proxyBase)

            // postMessage bridge: pings parent on load so it can (re-)inject overrides, and
            // listens for kui-inject-css messages to update the token override style tag.
            const headScript = `<script>(function(){
  window.parent.postMessage({type:'kui-frame-ready'},'*');
  window.addEventListener('message',function(e){
    if(!e.data||e.data.type!=='kui-inject-css')return;
    var s=document.getElementById('kong-design-token-overrides');
    if(!s){s=document.createElement('style');s.id='kong-design-token-overrides';(document.head||document.documentElement).appendChild(s);}
    s.textContent=e.data.css||'';
  });
})();</script>`
            html = html.replace(/<\/head>/i, `  <style id="tb-token-overrides"></style>\n  ${headScript}\n</head>`)

            // Intercept link clicks so in-frame navigation stays proxied.
            // Uses capture phase (true) so it runs before any page-level click handlers.
            const interceptScript = `<script>(function(){
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a'):null;
    if(!a||!a.href)return;
    var abs=a.href;
    if(!abs.match(/^https?:\\/\\//))return;
    // Let the browser handle new-tab, Ctrl/Cmd/Shift clicks natively
    if(a.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey)return;
    // Same-page hash navigation — let the browser handle it (no full reload needed)
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
            let css = await upstream.text()
            css = rewriteCssResources(css, pageUrl, proxyBase)
            res.setHeader('content-type', contentType.includes('charset') ? contentType : `${contentType}; charset=utf-8`)
            res.end(css)
          } else if (contentType.includes('javascript') || contentType.includes('ecmascript') || /\.[cm]?js(\?|$)/.test(urlParam)) {
            // Rewrite import specifiers so the module graph resolves through the proxy rather than
            // the original origin — without this `import './chunk.js'` 404s against localhost.
            let js = await upstream.text()
            js = rewriteJsImports(js, pageUrl, proxyBase)
            const ct = contentType || 'application/javascript'
            res.setHeader('content-type', ct.includes('charset') ? ct : `${ct}; charset=utf-8`)
            res.end(js)
          } else {
            const buffer = await upstream.arrayBuffer()
            res.end(Buffer.from(buffer))
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          // Clear any headers already forwarded from the upstream response before sending error
          for (const name of res.getHeaderNames()) res.removeHeader(name)
          res.writeHead(502, { 'content-type': 'text/plain' })
          res.end(`Proxy error: ${message}`)
        }
      })
    },
  }
}

/** Escapes a string for safe embedding in a single-quoted JS string literal. */
function escapeForJsString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

/** Resolves `url` against `base`, returning it unchanged for special schemes. */
function absoluteUrl(url: string, base: string): string {
  const t = url.trim()
  if (!t || /^(data:|blob:|javascript:|#|mailto:|tel:)/i.test(t)) return t
  try {
    return new URL(t, base).href
  } catch {
    return t
  }
}

/** Returns an absolute proxy URL. Uses `proxyBase` so the `<base>` tag can't re-resolve it. */
function toProxiedUrl(url: string, base: string, proxyBase: string): string {
  const abs = absoluteUrl(url, base)
  if (abs === url.trim()) return url // special scheme or parse failure — leave unchanged
  if (abs.includes('/preview-proxy?url=')) return abs // already proxied
  return `${proxyBase}/preview-proxy?url=${encodeURIComponent(abs)}`
}

/**
 * Rewrites resource URLs in HTML so assets load through the proxy.
 *
 * - `<link href>`: proxied + `integrity=` stripped (SRI hashes no longer match after rewriting)
 * - `<script src>`: proxied + `integrity=` stripped
 * - Inline `<script type="module">` bodies: import specifiers rewritten via `rewriteJsImports`
 * - Inline `<style>` bodies: `url()` / `@import` rewritten via `rewriteCssResources`
 * - `<img>`, `<source>`, `<video>`, `<audio>` `src` / `srcset`: proxied
 * - `<meta http-equiv="refresh">`: redirect URL proxied
 * - `<a href>`: NOT rewritten — the click interceptor handles navigation
 */
function rewriteHtmlResources(html: string, pageUrl: string, proxyBase: string): string {
  const proxy = (url: string) => toProxiedUrl(url, pageUrl, proxyBase)

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
      a = a.replace(/\s+integrity\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
      return `${open}${a}${close}`
    },
  )

  html = html.replace(
    /<script([^>]*)>([\s\S]*?)<\/script[^>]*>/gi,
    (_match, attrs: string, body: string) => {
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
        rewrittenAttrs = rewrittenAttrs.replace(/\s+integrity\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
      }
      const isModule = /\btype\s*=\s*["']module["']/i.test(attrs)
      const rewrittenBody = isModule && body.trim() ? rewriteJsImports(body, pageUrl, proxyBase) : body
      return `<script${rewrittenAttrs}>${rewrittenBody}</script>`
    },
  )

  // Nuxt/Next font optimization injects @font-face with url(/_fonts/…) in inline <style> tags.
  // Without this pass, those fonts are fetched directly from the target origin and hit CORS.
  html = html.replace(
    /<style([^>]*)>([\s\S]*?)<\/style>/gi,
    (_, attrs: string, body: string) => {
      if (/\btype\s*=\s*["'](?!text\/css)[^"']*["']/i.test(attrs)) return _
      const rewritten = rewriteCssResources(body, pageUrl, proxyBase)
      return `<style${attrs}>${rewritten}</style>`
    },
  )

  html = html.replace(
    /(<(?:img|source|video|audio)[^>]*?\s)(src)(\s*=\s*)("([^"]*?)"|'([^']*?)')/gi,
    (_, before, attr, eq, _quoted, dq, sq) => {
      const val = dq ?? sq ?? ''
      const q = dq !== undefined ? '"' : "'"
      return `${before}${attr}${eq}${q}${proxy(val)}${q}`
    },
  )

  // data: URIs contain commas in their base64 payload — use parseSrcset instead of split(',')
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

  html = html.replace(
    /(<meta[^>]+http-equiv\s*=\s*["']refresh["'][^>]+content\s*=\s*["'][^"']*?url=)([^"'\s;>]+)/gi,
    (_, prefix, url) => `${prefix}${proxy(url)}`,
  )

  return html
}

/**
 * Rewrites ES module import/export specifiers so the module graph resolves through the proxy.
 *
 * Four passes in order:
 *  1. Relative `.js` strings after `[`, `,`, `(` — Vite's `__vite__mapDeps` arrays; no `import`
 *     keyword present so keyword passes miss them.
 *  2–4. `from"url"`, `import"url"` (side-effect), `import("url")` (dynamic, including chunk-name
 *     comment form). String ranges are recomputed before each pass so expanded proxy URLs don't
 *     shift the guard. Negative lookbehind `(?<!\.)` prevents property-access false matches.
 */
function rewriteJsImports(js: string, jsUrl: string, proxyBase: string): string {
  const proxy = (url: string) => toProxiedUrl(url, jsUrl, proxyBase)

  // Pass 1: relative chunk strings in array/call positions (Vite __vite__mapDeps)
  js = js.replace(
    /(?<=[[,(])\s*(["'])(\.\.?\/[^"'\n\\]*\.(?:[cm]?js))\1/g,
    (match, q: string, url: string) => match.replace(`${q}${url}${q}`, `${q}${proxy(url)}${q}`),
  )

  /** Recomputed before each pass so earlier URL expansions don't misalign the guard. */
  function computeStringRanges(src: string): Array<[number, number]> {
    const ranges: Array<[number, number]> = []
    const LITERAL_RE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g
    for (const m of src.matchAll(LITERAL_RE)) {
      ranges.push([m.index!, m.index! + m[0].length])
    }
    return ranges
  }

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

  // Pass 2: static specifiers — `from"url"` / `from "url"`
  let ranges = computeStringRanges(js)
  js = js.replace(
    /(?<!\.)\bfrom\s*(["'])([^"'\n\\]+)\1/g,
    (match, q: string, url: string, offset: number) =>
      inString(offset, ranges) ? match : `from ${q}${proxy(url)}${q}`,
  )

  // Pass 3: side-effect imports — recompute ranges after Pass 2 expansions
  ranges = computeStringRanges(js)
  js = js.replace(
    /(?<!\.)\bimport\s*(["'])([^"'\n\\]+)\1/g,
    (match, q: string, url: string, offset: number) =>
      inString(offset, ranges) ? match : `import ${q}${proxy(url)}${q}`,
  )

  // Pass 4: dynamic imports, including `import(/* chunkName */ "url")` annotation form
  ranges = computeStringRanges(js)
  js = js.replace(
    /(?<!\.)\bimport\s*\(\s*(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)?(["'])([^"'\n\\]+)\1\s*\)/g,
    (match, q: string, url: string, offset: number) =>
      inString(offset, ranges) ? match : `import(${q}${proxy(url)}${q})`,
  )

  return js
}

/**
 * Splits a `srcset` value into individual entries without splitting inside data: URIs,
 * whose base64 payload contains commas.
 */
function parseSrcset(val: string): string[] {
  const parts: string[] = []
  let rest = val
  while (rest.length > 0) {
    const trimmed = rest.trimStart()
    if (/^data:/i.test(trimmed)) {
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

/** Rewrites `url()` and `@import` references in CSS to go through the proxy. */
function rewriteCssResources(css: string, cssUrl: string, proxyBase: string): string {
  css = css.replace(
    /@import\s*(["'])([^"'\n]+)\1/gi,
    (_, q, url) => `@import ${q}${toProxiedUrl(url, cssUrl, proxyBase)}${q}`,
  )
  css = css.replace(
    /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/gi,
    (_, quote, url) => `url(${quote}${toProxiedUrl(url, cssUrl, proxyBase)}${quote})`,
  )
  return css
}
