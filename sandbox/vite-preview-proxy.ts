import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

/**
 * Vite dev-only plugin that proxies arbitrary URLs through the dev server at
 * `/preview-proxy?url=<encoded>`, rewriting HTML and CSS responses so that all
 * sub-resource loads (scripts, stylesheets, fonts, images) also go through the
 * proxy — eliminating cross-origin CORS blocks on the proxied page's assets.
 *
 * Injection strategy:
 *  - `<script src>`, `<link href>`, `<img src>`, `<source src>` → absolute proxy URLs
 *  - CSS `url()` references → absolute proxy URLs
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
        const urlParam = qIdx !== -1 ? new URLSearchParams(rawUrl.slice(qIdx)).get('url') : null

        if (!urlParam) {
          res.writeHead(400, { 'content-type': 'text/plain' })
          res.end('Missing ?url= parameter')
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
            'transfer-encoding',
            'content-encoding',
            'content-length',
          ])

          res.statusCode = upstream.status

          for (const [key, value] of upstream.headers.entries()) {
            if (!STRIP_HEADERS.has(key.toLowerCase())) {
              res.setHeader(key, value)
            }
          }

          // Derive the proxy origin from the request's Host header so rewritten URLs
          // are absolute and won't be affected by the <base> tag on the proxied page.
          const proxyBase = `http://${req.headers.host ?? 'localhost:5173'}`
          const pageUrl = urlParam

          if (contentType.includes('text/html')) {
            const origin = `${targetUrl.protocol}//${targetUrl.host}`
            let html = await upstream.text()

            // Inject <base> at the start of <head> so <a href> relative links resolve
            // against the target origin — required for the click interceptor to work.
            if (!/<base[\s>]/i.test(html)) {
              html = html.replace(/(<head[^>]*>)/i, `$1\n  <base href="${origin}/">`)
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
            // Rewrite url() in CSS so fonts, images, and other assets go through the proxy.
            let css = await upstream.text()
            css = rewriteCssResources(css, pageUrl, proxyBase)
            res.setHeader('content-type', contentType.includes('charset') ? contentType : `${contentType}; charset=utf-8`)
            res.end(css)
          } else {
            // JS, images, fonts, etc.: stream unchanged.
            // JS fetch() / dynamic imports will still hit CORS but those can't be rewritten.
            const buffer = await upstream.arrayBuffer()
            res.end(Buffer.from(buffer))
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
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
 * - `<link href>`: always proxied (stylesheets, preload, prefetch).
 * - `<script src>` without `type="module"`: proxied so classic scripts aren't
 *   blocked by CORS. Safe because classic scripts don't use ES module relative
 *   imports that would mis-resolve against the proxy URL.
 * - `<script type="module" src>`: NOT proxied — ES modules use relative imports
 *   that would resolve against the proxy URL instead of the original origin,
 *   breaking the module graph. Module scripts that fail CORS still render the
 *   SSR HTML, which is sufficient for token preview.
 * - `<a href>`: NOT rewritten — the click interceptor handles link navigation.
 */
function rewriteHtmlResources(html: string, pageUrl: string, proxyBase: string): string {
  const proxy = (url: string) => toProxiedUrl(url, pageUrl, proxyBase)

  // Rewrite href= on <link> elements
  html = html.replace(
    /(<link[^>]*?\s)(href)(\s*=\s*)("([^"]*?)"|'([^']*?)')/gi,
    (_, before, attr, eq, _quoted, dq, sq) => {
      const val = dq ?? sq ?? ''
      const q = dq !== undefined ? '"' : "'"
      return `${before}${attr}${eq}${q}${proxy(val)}${q}`
    },
  )

  // Rewrite src= on classic <script> tags (no type="module")
  html = html.replace(
    /<script([^>]*)>/gi,
    (match, attrs: string) => {
      // Skip module scripts — their relative imports would break if proxied
      if (/\btype\s*=\s*["']module["']/i.test(attrs)) return match
      // Only rewrite if there's an src attribute
      const rewritten = attrs.replace(
        /(\ssrc)(\s*=\s*)("([^"]*?)"|'([^']*?)')/i,
        (_, attr, eq, _quoted, dq, sq) => {
          const val = dq ?? sq ?? ''
          const q = dq !== undefined ? '"' : "'"
          return `${attr}${eq}${q}${proxy(val)}${q}`
        },
      )
      return `<script${rewritten}>`
    },
  )

  return html
}

/**
 * Rewrites url() references in CSS so fonts, images, and other assets load through the proxy.
 */
function rewriteCssResources(css: string, cssUrl: string, proxyBase: string): string {
  return css.replace(
    /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/gi,
    (_, quote, url) => `url(${quote}${toProxiedUrl(url, cssUrl, proxyBase)}${quote})`,
  )
}
