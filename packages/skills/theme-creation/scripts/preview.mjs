#!/usr/bin/env node
/**
 * preview.mjs — the render-and-compare loop for the theme-creation skill.
 *
 * Builds a side-by-side "Original vs. themed" component gallery and serves it over a local HTTP
 * server (NOT file://), then prints the URL. Every prior version of this skill tried to verify
 * visual fidelity with a hand-rolled file:// HTML page and Playwright, and it failed every time
 * (file:// blocked, screenshots landing nowhere). HTTP + a prebuilt gallery fixes both: navigate
 * to the printed URL with a browser tool and screenshot it, or open it yourself.
 *
 * Each column is an isolated iframe rendering REAL @kong/kongponents components loaded from a CDN
 * (esm.sh + unpkg) — no npm install, no build. The first column is always unthemed Original
 * (Kongponents' own baked-in design-tokens defaults); each subsequent column is the same real
 * components with one theme's --kui-* values layered on via a `data-kui-theme` wrapper. Requires
 * outbound HTTPS to the CDN.
 *
 * Usage (after `pnpm --filter @kong/design-tokens build:tokens`):
 *   node preview.mjs <theme-name> [<theme-name>...] [--port 8747] [--kongponents <version|tag>]
 *       [--kongponents-css <url>] [--kongponents-esm <url>]
 *
 * Pass one theme name for a two-column Original vs. themed view, or several to compare them all
 * at once (e.g. a day/night pair): `preview.mjs acme-day acme-night` renders
 * Original | acme-day | acme-night as three columns on one page/server — handy since developers
 * typically want to eyeball light and dark together rather than run two separate previews.
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

const args = process.argv.slice(2)
const opt = (f, d) => {
  const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d
}
// Every flag takes a value, so anything else on the command line is a positional theme name.
// Walking the args and skipping each flag+value pair (rather than "not preceded by a flag") keeps
// this correct as more theme names are added, and mirrors how opt() reads a flag's value. An
// unrecognized `--flag` is rejected outright rather than silently skipped — otherwise its value
// (e.g. a typo'd `--kongponent 9.60.6`) falls through to the next iteration and gets swallowed as
// a bogus positional theme name, surfacing a confusing "must be kebab-case" error instead of the
// real problem. A bare `--` is the conventional end-of-options separator (`pnpm run <script> --
// <args>` forwards it literally into argv) — not a theme name and not an unknown flag, so it's
// skipped rather than rejected.
const VALUE_FLAGS = new Set(['--port', '--kongponents', '--kongponents-css', '--kongponents-esm'])
const names = []
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--') continue
  if (a.startsWith('--')) {
    if (!VALUE_FLAGS.has(a)) {
      console.error(`Unknown flag "${a}".`)
      process.exit(1)
    }
    i++
    continue
  }
  names.push(a)
}
const uniqueNames = [...new Set(names)]
if (!uniqueNames.length) {
  console.error('Usage: node preview.mjs <theme-name> [<theme-name>...] [--port N] [--kongponents <version|tag>]')
  process.exit(1)
}

// `opt('--port', null)` distinguishes "flag absent" (null, use the 8747 default) from "flag
// present with a falsy-looking value" (e.g. --port 0) — `Number(opt('--port', 0)) || 8747` would
// silently discard an explicit --port 0 and fall back to 8747 since 0 is falsy. Port 0 itself is
// rejected outright rather than passed through: Node's http server treats 0 as "bind any free OS
// port," which would silently diverge from the workspace dir and URLs this script prints (both
// keyed on the literal requested port), not from any 1-65535 port a caller actually intends.
const portArg = opt('--port', null)
// Require a plain decimal-digit string before calling Number() on it — `Number()` also accepts
// hex (`0x1F`), exponential (`8e3`), and other JS numeric-literal forms, which would silently
// resolve to a different port than the digits the caller typed instead of failing validation.
if (portArg !== null && !/^\d+$/.test(portArg)) {
  console.error(`--port "${portArg}" must be a plain decimal integer.`)
  process.exit(1)
}
const port = portArg === null ? 8747 : Number(portArg)
if (port < 1 || port > 65535) {
  console.error(`--port "${portArg}" must be between 1 and 65535.`)
  process.exit(1)
}

// Namespace the generated workspace by port: two servers must bind different ports to run
// concurrently at all (same port throws EADDRINUSE), so keying the workspace dir on port
// guarantees any two running instances never share a directory or clobber each other's files.
const OUT = join(SKILL_DIR, '..', 'theme-creation-workspace', 'preview', String(port))

// Each name flows into a filesystem path (dist/themes/${name}.css below) and, unescaped, into the
// generated HTML (data-kui-theme="${name}" and the <h2> label) — mirror theme-scaffold.mjs's
// KEBAB_CASE rule so neither a path-traversal segment nor an HTML/attribute-breaking value can
// reach either sink. A real theme name is always kebab-case anyway, so this never rejects a
// legitimate one.
const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*$/
// Report every invalid name together (same reasoning as the missing-CSS check below): a typo in
// one of several names shouldn't hide a second typo that only surfaces after the first is fixed.
const invalidNames = uniqueNames.filter((name) => !KEBAB_CASE.test(name))
if (invalidNames.length) {
  console.error('Theme name(s) must be kebab-case (lowercase letters/digits, hyphen-separated):')
  invalidNames.forEach((name) => console.error(`  ${name}`))
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

// Resolve every theme's compiled CSS up front and report all missing ones together, rather than
// failing on the first, so a typo among several names doesn't hide the rest.
const missing = uniqueNames
  .map((n) => join(PKG, 'dist', 'themes', `${n}.css`))
  .filter((p) => !existsSync(p))
if (missing.length) {
  console.error(`Missing compiled theme CSS — run \`pnpm --filter @kong/design-tokens build:tokens\` first:`)
  missing.forEach((p) => console.error(`  ${p}`))
  process.exit(1)
}

const gallery = readFileSync(GALLERY, 'utf8')
  .replaceAll('__KONGPONENTS_CSS__', kpCss)
  .replaceAll('__KONGPONENTS_ESM__', kpEsm)
const page = (themeCssTag, themeAttr) => gallery.replaceAll('__THEME_CSS__', themeCssTag).replaceAll('__THEME_ATTR__', themeAttr)

const columns = [
  '<div class="col"><h2>Original (unthemed)</h2><iframe src="default.html"></iframe></div>',
  ...uniqueNames.map((name) => `<div class="col"><h2>${name}</h2><iframe src="themed-${name}.html"></iframe></div>`),
].join('\n    ')
const indexHtml = `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { margin:0; font-family: system-ui, sans-serif; }
  .bar { display:flex; overflow-x:auto; }
  .col { flex:1 0 360px; min-width:360px; }
  .col h2 { margin:0; padding:8px 24px; font-size:13px; text-transform:uppercase; letter-spacing:.06em;
    background:#f4f4f5; color:#555; border-bottom:1px solid #e4e4e7; }
  iframe { width:100%; height:calc(100vh - 34px); border:0; border-right:1px solid #e4e4e7; }
</style></head><body>
  <div class="bar">
    ${columns}
  </div>
</body></html>\n`

// This server only ever needs to hand back the files generated below. Rather than building a
// filesystem path out of the request URL (tainted input) and then trying to prove the result can't
// escape OUT, route by exact lookup against a fixed table of real paths computed here, at startup,
// from constants and the already-validated (KEBAB_CASE) theme names — no request data ever reaches
// a path-construction or filesystem call, so there's no path-injection flow to sanitize away in
// the first place. Building this table only needs the (already-validated) names, not the files
// themselves — the request handler existsSync-checks each file per request regardless.
const ROUTES = new Map([
  ['', join(OUT, 'index.html')],
  ['index.html', join(OUT, 'index.html')],
  ['default.html', join(OUT, 'default.html')],
])
for (const name of uniqueNames) {
  ROUTES.set(`themed-${name}.html`, join(OUT, `themed-${name}.html`))
  ROUTES.set(`${name}.css`, join(OUT, `${name}.css`))
}
const types = { '.html': 'text/html', '.css': 'text/css' }
const server = createServer((req, res) => {
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
})

// Bind the port BEFORE touching OUT: if another instance is already listening on this port, this
// throws EADDRINUSE and exits without writing a single file, instead of racing ahead to
// overwrite the live instance's workspace out from under it (mkdirSync/writeFileSync are
// synchronous and would otherwise all run to completion before an async .listen() failure could
// ever be observed).
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use by another preview instance — pass a different --port.`)
  } else {
    console.error(err)
  }
  process.exit(1)
})
server.listen(port, '127.0.0.1', () => {
  // Wrapped in try/catch (unlike a top-level script, a synchronous throw inside an event callback
  // isn't caught by server.on('error', ...) — it would otherwise surface as a raw uncaught
  // exception instead of the clean console.error + exit(1) every other failure in this script uses
  // (e.g. an unwritable workspace dir, or dist/themes/<name>.css vanishing between the earlier
  // existsSync check and this copy, if a build happens to run concurrently).
  try {
    mkdirSync(OUT, { recursive: true })
    // Default panel: Kongponents' own baked-in defaults (no theme CSS, no wrapper attr).
    writeFileSync(join(OUT, 'default.html'), page('', ''))
    // One themed panel per theme: its compiled CSS + a data-kui-theme wrapper over the same real
    // components. `name` is KEBAB_CASE-validated above, so `${name}.css`/`themed-${name}.html` are
    // safe filenames and a safe relative href/attribute value.
    for (const name of uniqueNames) {
      copyFileSync(join(PKG, 'dist', 'themes', `${name}.css`), join(OUT, `${name}.css`))
      writeFileSync(join(OUT, `themed-${name}.html`), page(`<link rel="stylesheet" href="${name}.css">`, `data-kui-theme="${name}"`))
    }
    writeFileSync(join(OUT, 'index.html'), indexHtml)
  } catch (err) {
    console.error(`Failed to write the preview workspace (${OUT}): ${err.message}`)
    process.exit(1)
  }

  console.log(`\nPreview serving at:  http://localhost:${port}/index.html`)
  console.log(`  original panel only: http://localhost:${port}/default.html`)
  for (const name of uniqueNames) {
    console.log(`  ${name} panel only:  http://localhost:${port}/themed-${name}.html`)
  }
  console.log(`\nKongponents:  ${kpVersion}${kpVersion === 'latest' ? ' (published — may not consume newer component tokens; pass --kongponents <build> to preview those)' : ''}`)
  console.log('Screenshot the index URL with a browser tool and compare against the source, or open it.')
  console.log('Run `pnpm themes:unfilled <name>` to check for empty component slots or palette families')
  console.log('still unchanged from the classic-day seed before treating this preview as final. Ctrl-C to stop.')
})
