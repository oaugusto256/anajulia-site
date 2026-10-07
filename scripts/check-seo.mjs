#!/usr/bin/env node
// SEO smoke check against a running production build.
// Usage: pnpm build && pnpm start   (in another terminal)  then  pnpm check:seo
// BASE_URL defaults to http://localhost:3000. Exits non-zero on any failure.
import { brand } from "../src/content/site-content.ts"

const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const SITE_URL = "https://psicoanajulia.com.br"
const TITLE_MAX = 60
const DESCRIPTION_MAX = 160
// The approved home title is 66 chars (spec §3.1). Google truncates by pixel
// width, so it is reported as a warning instead of failing the run.
const TITLE_LENGTH_EXEMPT = new Set(["/"])

const failures = []
const warnings = []
const fail = (where, msg) => failures.push(`${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`${where}: ${msg}`)

async function get(path) {
  const res = await fetch(BASE_URL + path, { redirect: "manual" })
  return { res, body: await res.text() }
}

function decode(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
}

const count = (html, re) => (html.match(re) ?? []).length
const findTag = (html, re) => html.match(re)?.[0] ?? null
function attr(tag, name) {
  if (!tag) return null
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`))
  return m ? decode(m[1]) : null
}
const stripSlash = (url) => url.replace(/\/$/, "")
const sitemapPaths = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)

/** @type {Array<(path: string, html: string, kind: "home" | "indexable" | "draft") => void>} */
const pageChecks = []
/** @type {Array<(pages: {path: string, kind: string}[], bodies: Map<string, string>) => Promise<void>>} */
const siteChecks = []
/** Pages not listed in the sitemap that must still be checked (e.g. draft topic pages). */
const extraPages = []

// ── common page checks ──
pageChecks.push((path, html, kind) => {
  const h1 = count(html, /<h1[\s>]/g)
  if (h1 !== 1) fail(path, `expected exactly 1 <h1>, found ${h1}`)

  const canonical = attr(findTag(html, /<link[^>]+rel="canonical"[^>]*>/), "href")
  const expected = SITE_URL + path
  if (!canonical) fail(path, "missing canonical")
  else if (stripSlash(canonical) !== stripSlash(expected)) fail(path, `canonical ${canonical} != ${expected}`)

  const ogUrl = attr(findTag(html, /<meta[^>]+property="og:url"[^>]*>/), "content")
  if (!ogUrl || stripSlash(ogUrl) !== stripSlash(expected)) fail(path, `og:url ${ogUrl} != ${expected}`)
  if (!findTag(html, /<meta[^>]+property="og:site_name"[^>]*>/)) fail(path, "missing og:site_name")
  if (findTag(html, /<meta[^>]+name="keywords"[^>]*>/)) fail(path, "meta keywords should not be rendered")

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")
  if (!title) fail(path, "missing <title>")
  else if (title.length > TITLE_MAX) {
    const msg = `title is ${title.length} chars (> ${TITLE_MAX}): ${title}`
    if (TITLE_LENGTH_EXEMPT.has(path)) warn(path, msg)
    else fail(path, msg)
  }

  const description = attr(findTag(html, /<meta[^>]+name="description"[^>]*>/), "content")
  if (!description) fail(path, "missing meta description")
  else if (description.length > DESCRIPTION_MAX) fail(path, `description is ${description.length} chars (> ${DESCRIPTION_MAX})`)

  const robots = attr(findTag(html, /<meta[^>]+name="robots"[^>]*>/), "content") ?? ""
  const noindex = robots.includes("noindex")
  if (kind === "draft" && !noindex) fail(path, "draft page is missing noindex")
  if (kind !== "draft" && noindex) fail(path, "indexable page has noindex")
})

// ── home: location + anchors + float ──
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  if (!/<address[\s>]/.test(html)) fail(path, "footer <address> missing")
  if (!html.includes(brand.location.postalCode)) fail(path, "postal code missing from footer")
  if (/href="#/.test(html)) fail(path, 'found same-page href="#…" (use "/#…" so links work from other pages)')
  if (!/data-wa-location="float"/.test(html)) fail(path, "floating WhatsApp button missing")
})

// ── home: heading outline ──
// h2: approach, about, services, areas, mission, testimonials, faq.
// h3: 4 services + 4 áreas + 6 FAQ questions.
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  const h2 = count(html, /<h2[\s>]/g)
  const h3 = count(html, /<h3[\s>]/g)
  if (h2 < 7) fail(path, `expected ≥ 7 <h2>, found ${h2}`)
  if (h3 < 14) fail(path, `expected ≥ 14 <h3>, found ${h3}`)
  if (/<h4[\s>]/.test(html)) fail(path, "unexpected <h4> (About trajectory should be <h3>)")
})

// ── JSON-LD ──
function ldTypes(path, html) {
  const types = new Set()
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data
    try {
      data = JSON.parse(m[1])
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`)
      continue
    }
    for (const node of data["@graph"] ?? [data]) {
      for (const t of [node["@type"]].flat()) if (t) types.add(t)
    }
  }
  return types
}

const GLOBAL_TYPES = ["Person", "Psychologist", "WebSite"]
const EXPECTED_TYPES = { home: [...GLOBAL_TYPES, "WebPage", "FAQPage"] }

pageChecks.push((path, html, kind) => {
  const types = ldTypes(path, html)
  for (const t of EXPECTED_TYPES[kind] ?? GLOBAL_TYPES) {
    if (!types.has(t)) fail(path, `JSON-LD missing @type ${t}`)
  }
})

// ── run ──
async function main() {
  const sitemap = await get("/sitemap.xml")
  if (sitemap.res.status !== 200) fail("/sitemap.xml", `status ${sitemap.res.status}`)
  const pages = [
    ...sitemapPaths(sitemap.body).map((path) => ({ path, kind: path === "/" ? "home" : "indexable" })),
    ...extraPages,
  ]
  const bodies = new Map()
  for (const page of pages) {
    const { res, body } = await get(page.path)
    if (res.status !== 200) {
      fail(page.path, `status ${res.status}`)
      continue
    }
    bodies.set(page.path, body)
    for (const check of pageChecks) check(page.path, body, page.kind)
  }
  for (const check of siteChecks) await check(pages, bodies)

  for (const w of warnings) console.warn(`WARN  ${w}`)
  for (const f of failures) console.error(`FAIL  ${f}`)
  console.log(`check-seo: ${pages.length} page(s), ${failures.length} failure(s), ${warnings.length} warning(s)`)
  process.exit(failures.length ? 1 : 0)
}

await main()
