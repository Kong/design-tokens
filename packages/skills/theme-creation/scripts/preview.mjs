#!/usr/bin/env node
/**
 * preview.mjs — the render-and-compare loop for the theme-creation skill.
 *
 * Builds a side-by-side "default vs. themed" component gallery and serves it over a local HTTP
 * server (NOT file://), then prints the URL. Every prior version of this skill tried to verify
 * visual fidelity with a hand-rolled file:// HTML page and Playwright, and it failed every time
 * (file:// blocked, screenshots landing nowhere). HTTP + a prebuilt gallery fixes both: navigate
 * to the printed URL with a browser tool and screenshot it, or open it yourself.
 *
 * The two panels are isolated iframes rendering REAL @kong/kongponents components loaded from a
 * CDN (esm.sh + unpkg) — no npm install, no build. Left = unthemed default (Kongponents' own
 * baked-in design-tokens defaults); right = the same real components with your theme's --kui-*
 * values layered on via a `data-kui-theme` wrapper. Requires outbound HTTPS to the CDN.
 *
 * Usage (after `pnpm --filter @kong/design-tokens build:tokens`):
 *   node preview.mjs <theme-name> [--port 8747] [--kongponents <version|tag>]
 *       [--kongponents-css <url>] [--kongponents-esm <url>]
 *
 * --kongponents defaults to `latest`. Override it with a version/dist-tag (e.g. `9.60.6`, `next`)
 * or, for a canary / draft-PR build that isn't on the normal registry path, pass explicit
 * --kongponents-css and --kongponents-esm URLs. This matters because a Kongponents version only
 * consumes the tokens it was built to read: if your theme sets granular component tokens that
 * published Kongponents doesn't consume yet, point this at the build that does.
 *
 * Then screenshot http://localhost:<port>/index.html with a browser tool and compare against the
 * source. Ctrl-C to stop the server.
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createServer } from 'node:http'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(SCRIPT_DIR, '..')
const PKG = join(SKILL_DIR, '..', '..', 'design-tokens')
const GALLERY = join(SKILL_DIR, 'assets', 'gallery.html')
const OUT = join(SKILL_DIR, '..', 'theme-creation-workspace', 'preview')

const args = process.argv.slice(2)
const opt = (f, d) => {
  const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d
}
const name = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'))
const port = Number(opt('--port', 0)) || 8747
if (!name) {
  console.error('Usage: node preview.mjs <theme-name> [--port N] [--kongponents <version|tag>]'); process.exit(1)
}

// `name` flows into a filesystem path (dist/themes/${name}.css below) and, unescaped, into the
// generated HTML (data-kui-theme="${name}" and the <h2> label) — mirror theme-scaffold.mjs's
// KEBAB_CASE rule so neither a path-traversal segment nor an HTML/attribute-breaking value can
// reach either sink. A real theme name is always kebab-case anyway, so this never rejects a
// legitimate one.
const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*$/
if (!KEBAB_CASE.test(name)) {
  console.error(`Theme name "${name}" must be kebab-case (lowercase letters/digits, hyphen-separated).`)
  process.exit(1)
}

// These three flags are substituted verbatim into gallery.html: kpCss into a double-quoted href
// attribute, kpEsm into a single-quoted JS string inside a <script type="module"> (see gallery.html
// lines 22/76). Unvalidated, a value containing `"`, `'`, `<`, or whitespace could break out of
// that context and inject HTML/JS into the locally-served preview page. Restrict each to a charset
// that can't escape its context, rather than trying to escape after the fact.
const DIST_TAG_OR_SEMVER = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/
const kpVersion = opt('--kongponents', 'latest')
if (!DIST_TAG_OR_SEMVER.test(kpVersion)) {
  console.error(`--kongponents "${kpVersion}" must be a plain version/dist-tag (letters, digits, dot, hyphen, underscore).`)
  process.exit(1)
}
const SAFE_HTTPS_URL = /^https:\/\/[^\s"'<>`\\]+$/
function validatedUrl(flag, value) {
  if (!SAFE_HTTPS_URL.test(value)) {
    console.error(`${flag} "${value}" must be an https URL with no quotes, angle brackets, or whitespace.`)
    process.exit(1)
  }
  return value
}
const kpCss = validatedUrl('--kongponents-css', opt('--kongponents-css', `https://unpkg.com/@kong/kongponents@${kpVersion}/dist/kongponents.css`))
const kpEsm = validatedUrl('--kongponents-esm', opt('--kongponents-esm', `https://esm.sh/@kong/kongponents@${kpVersion}?external=vue,vue-router`))

const themeCss = join(PKG, 'dist', 'themes', `${name}.css`)
if (!existsSync(themeCss)) {
  console.error(`${themeCss} not found — run \`pnpm --filter @kong/design-tokens build:tokens\` first.`)
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })
copyFileSync(themeCss, join(OUT, 'theme.css'))

const gallery = readFileSync(GALLERY, 'utf8')
  .replaceAll('__KONGPONENTS_CSS__', kpCss)
  .replaceAll('__KONGPONENTS_ESM__', kpEsm)
const page = (themeCssTag, themeAttr) => gallery.replaceAll('__THEME_CSS__', themeCssTag).replaceAll('__THEME_ATTR__', themeAttr)
// Default panel: Kongponents' own baked-in defaults (no theme CSS, no wrapper attr).
writeFileSync(join(OUT, 'default.html'), page('', ''))
// Themed panel: the theme's compiled CSS + a data-kui-theme wrapper over the same real components.
writeFileSync(join(OUT, 'themed.html'), page('<link rel="stylesheet" href="theme.css">', `data-kui-theme="${name}"`))

writeFileSync(join(OUT, 'index.html'), `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { margin:0; font-family: system-ui, sans-serif; }
  .bar { display:flex; }
  .col { flex:1; min-width:0; }
  .col h2 { margin:0; padding:8px 24px; font-size:13px; text-transform:uppercase; letter-spacing:.06em;
    background:#f4f4f5; color:#555; border-bottom:1px solid #e4e4e7; }
  iframe { width:100%; height:calc(100vh - 34px); border:0; border-right:1px solid #e4e4e7; }
</style></head><body>
  <div class="bar">
    <div class="col"><h2>Default (unthemed)</h2><iframe src="default.html"></iframe></div>
    <div class="col"><h2>${name}</h2><iframe src="themed.html"></iframe></div>
  </div>
</body></html>\n`)

// This server only ever needs to hand back these four generated files. Rather than building a
// filesystem path out of the request URL (tainted input) and then trying to prove the result can't
// escape OUT, route by exact lookup against a fixed table of real paths computed here, at startup,
// from constants — no request data ever reaches a path-construction or filesystem call, so there's
// no path-injection flow to sanitize away in the first place.
const ROUTES = new Map([
  ['', join(OUT, 'index.html')],
  ['index.html', join(OUT, 'index.html')],
  ['default.html', join(OUT, 'default.html')],
  ['themed.html', join(OUT, 'themed.html')],
  ['theme.css', join(OUT, 'theme.css')],
])
const types = { '.html': 'text/html', '.css': 'text/css' }
createServer((req, res) => {
  let decoded
  try {
    decoded = decodeURIComponent(req.url)
  } catch {
    // malformed percent-encoding (e.g. a bare "%") throws URIError — reject instead of crashing
    // the whole server on one bad request.
    res.writeHead(400); res.end('bad request'); return
  }
  const key = decoded.split('?')[0].replace(/^\/+/, '')
  const file = ROUTES.get(key)
  if (!file || !existsSync(file)) {
    res.writeHead(404); res.end('not found'); return
  }
  const ext = file.slice(file.lastIndexOf('.'))
  res.writeHead(200, { 'content-type': types[ext] || 'application/octet-stream' })
  res.end(readFileSync(file))
}).listen(port, '127.0.0.1', () => {
  console.log(`\nPreview serving at:  http://localhost:${port}/index.html`)
  console.log(`  default panel only: http://localhost:${port}/default.html`)
  console.log(`  themed panel only:  http://localhost:${port}/themed.html`)
  console.log(`\nKongponents:  ${kpVersion}${kpVersion === 'latest' ? ' (published — may not consume newer component tokens; pass --kongponents <build> to preview those)' : ''}`)
  console.log('Screenshot the index URL with a browser tool and compare against the source, or open it.')
  console.log('Run `pnpm themes:unfilled <name>` to check for empty component slots or palette families')
  console.log('still unchanged from the classic-day seed before treating this preview as final. Ctrl-C to stop.')
})
