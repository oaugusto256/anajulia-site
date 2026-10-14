#!/usr/bin/env node
// SEO smoke check against a running production build.
// Usage: pnpm build && pnpm start   (in another terminal)  then  pnpm check:seo
// BASE_URL defaults to http://localhost:3000. Exits non-zero on any failure.
import { brand, contentUpdatedAt, faq, topicPages } from "../src/content/site-content.ts"

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
// h3: 4 services + 4 áreas + 7 FAQ questions.
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  const h2 = count(html, /<h2[\s>]/g)
  const h3 = count(html, /<h3[\s>]/g)
  if (h2 < 7) fail(path, `expected ≥ 7 <h2>, found ${h2}`)
  if (h3 < 14) fail(path, `expected ≥ 14 <h3>, found ${h3}`)
  if (/<h4[\s>]/.test(html)) fail(path, "unexpected <h4> (About trajectory should be <h3>)")
})

// ── JSON-LD ──
function ldNodes(path, html) {
  const nodes = []
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data
    try {
      data = JSON.parse(m[1])
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`)
      continue
    }
    nodes.push(...(data["@graph"] ?? [data]))
  }
  return nodes
}

function ldTypes(path, html) {
  const types = new Set()
  for (const node of ldNodes(path, html)) {
    for (const t of [node["@type"]].flat()) if (t) types.add(t)
  }
  return types
}

const GLOBAL_TYPES = ["Person", "MedicalBusiness", "WebSite"]
const EXPECTED_TYPES = { home: [...GLOBAL_TYPES, "WebPage", "FAQPage"] }

pageChecks.push((path, html, kind) => {
  const types = ldTypes(path, html)
  for (const t of EXPECTED_TYPES[kind] ?? GLOBAL_TYPES) {
    if (!types.has(t)) fail(path, `JSON-LD missing @type ${t}`)
  }
})

// ── home: entity links (sameAs) ──
const SAME_AS_REQUIRED = [brand.location.gbpUrl, brand.location.doctoraliaUrl, brand.contact.instagram.href]
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  for (const type of ["Person", "MedicalBusiness"]) {
    const node = ldNodes(path, html).find((n) => [n["@type"]].flat().includes(type))
    const sameAs = node?.sameAs ?? []
    for (const url of SAME_AS_REQUIRED) {
      if (!url) fail(path, `${type}.sameAs: required URL is undefined in site-content`)
      else if (!sameAs.includes(url)) fail(path, `${type}.sameAs missing ${url}`)
    }
    if (new Set(sameAs).size !== sameAs.length) fail(path, `${type}.sameAs has duplicates`)
    for (const url of sameAs) {
      if (/maps\.app\.goo\.gl|share\.google/.test(url)) fail(path, `${type}.sameAs uses a share short link: ${url}`)
    }
  }
})

// ── home: insurance FAQ (Search Console: "psicólogo unimed" queries) ──
const INSURANCE_FAQ_ID = "plano-de-saude"
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  const item = faq.items.find((i) => i.id === INSURANCE_FAQ_ID)
  if (!item) return fail(path, `faq.items has no "${INSURANCE_FAQ_ID}"`)
  const ids = faq.items.map((i) => i.id)
  if (ids.indexOf(INSURANCE_FAQ_ID) !== ids.indexOf("pagamento") + 1) fail(path, `"${INSURANCE_FAQ_ID}" must come right after "pagamento"`)
  // Strip <script> blocks: the FAQPage JSON-LD repeats the question, which would mask a missing accordion item.
  const visibleHtml = decode(html.replace(/<script[\s\S]*?<\/script>/g, ""))
  if (!visibleHtml.includes(item.question)) fail(path, "insurance FAQ question not rendered")
  const faqPage = ldNodes(path, html).find((n) => n["@type"] === "FAQPage")
  const questions = (faqPage?.mainEntity ?? []).map((q) => q.name)
  if (!questions.includes(item.question)) fail(path, "insurance FAQ missing from FAQPage JSON-LD")
  if (/Entrego recibos/.test(faq.items.find((i) => i.id === "pagamento")?.answer ?? "")) fail(path, 'pagamento answer still says "Entrego recibos" (topic pages use nota fiscal)')
})
siteChecks.push(async () => {
  const item = faq.items.find((i) => i.id === INSURANCE_FAQ_ID)
  if (!item) return
  const llms = await get("/llms.txt")
  if (!llms.body.includes(`### ${item.question}`)) fail("/llms.txt", "insurance FAQ missing")
})

// ── home: local intent in metadata (Search Console: "psicologa campeche" is the top query) ──
const HOME_TITLE_HARD_MAX = 70
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")
  const description = attr(findTag(html, /<meta[^>]+name="description"[^>]*>/), "content") ?? ""
  if (!title.includes("Campeche")) fail(path, "home <title> should mention Campeche")
  if (title.length > HOME_TITLE_HARD_MAX) fail(path, `home title is ${title.length} chars (> ${HOME_TITLE_HARD_MAX})`)
  for (const term of ["Campeche", "Sul da Ilha", "Burnout"]) {
    if (!description.includes(term)) fail(path, `home meta description should mention ${term}`)
  }
})

// ── robots, llms.txt, sitemap dates ──
const draftSlugs = () => topicPages.filter((p) => p.status === "draft").map((p) => p.slug)

siteChecks.push(async () => {
  const robots = await get("/robots.txt")
  if (robots.res.status !== 200) fail("/robots.txt", `status ${robots.res.status}`)
  for (const agent of ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"]) {
    if (!robots.body.includes(agent)) fail("/robots.txt", `missing ${agent}`)
  }
  if (!robots.body.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("/robots.txt", "missing Sitemap line")

  const llms = await get("/llms.txt")
  if (llms.res.status !== 200) fail("/llms.txt", `status ${llms.res.status}`)
  if (!(llms.res.headers.get("content-type") ?? "").startsWith("text/plain")) fail("/llms.txt", "content-type is not text/plain")
  if (!llms.body.startsWith(`# ${brand.name}`)) fail("/llms.txt", "must start with '# <name>'")
  for (const slug of draftSlugs()) if (llms.body.includes(`/${slug}`)) fail("/llms.txt", `lists draft page ${slug}`)

  const sitemap = await get("/sitemap.xml")
  const homeLastmod = sitemap.body.match(/<loc>https:\/\/psicoanajulia\.com\.br\/?<\/loc>\s*<lastmod>([^<]+)</)?.[1]
  if (!homeLastmod?.startsWith(contentUpdatedAt)) fail("/sitemap.xml", `home lastmod ${homeLastmod} != ${contentUpdatedAt}`)
  for (const slug of draftSlugs()) if (sitemap.body.includes(`/${slug}<`)) fail("/sitemap.xml", `lists draft page ${slug}`)
})

// ── topic pages ──
for (const slug of draftSlugs()) extraPages.push({ path: `/${slug}`, kind: "draft" })

const reviewDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" })
const topicBySlug = new Map(topicPages.map((p) => [p.slug, p]))

pageChecks.push((path, html) => {
  const page = topicBySlug.get(path.slice(1))
  if (!page) return
  const types = ldTypes(path, html)
  for (const t of ["MedicalWebPage", "FAQPage", "BreadcrumbList"]) {
    if (!types.has(t)) fail(path, `JSON-LD missing @type ${t}`)
  }
  if (!html.includes(`data-topic="${page.slug}"`)) fail(path, "missing data-topic")
  const expectedDate = reviewDate.format(new Date(`${page.reviewedAt}T00:00:00Z`))
  if (!html.includes(`>${expectedDate}</time>`)) fail(path, `review date should read "${expectedDate}"`)
  const float = findTag(html, /<a[^>]+data-wa-location="float"[^>]*>/)
  const text = float ? new URL(attr(float, "href")).searchParams.get("text") : null
  if (text !== page.cta.whatsappMessage) fail(path, `float WhatsApp message is ${JSON.stringify(text)}`)
})

siteChecks.push(async (pages, bodies) => {
  // Draft leakage: no indexable page may link to a draft topic.
  for (const { path, kind } of pages) {
    if (kind === "draft") continue
    for (const slug of draftSlugs()) {
      if (bodies.get(path)?.includes(`href="/${slug}"`)) fail(path, `links to draft page /${slug}`)
    }
  }
  const missing = await get("/nao-existe")
  if (missing.res.status !== 404) fail("/nao-existe", `expected 404, got ${missing.res.status}`)
})

// ── privacy page ──
siteChecks.push(async (pages, bodies) => {
  if (!pages.some((p) => p.path === "/privacidade")) fail("/sitemap.xml", "missing /privacidade")
  if (!bodies.get("/")?.includes('href="/privacidade"')) fail("/", "footer has no link to /privacidade")
})
pageChecks.push((path, html) => {
  if (path !== "/privacidade") return
  if (!ldTypes(path, html).has("WebPage")) fail(path, "JSON-LD missing @type WebPage")
})

// ── trailing slash + analytics proxy ──
siteChecks.push(async (pages) => {
  for (const { path } of pages) {
    if (path === "/") continue
    const { res, body } = await get(`${path}/`)
    if (res.status >= 300 && res.status < 400) {
      const location = new URL(res.headers.get("location") ?? "", BASE_URL).pathname
      if (location !== path) fail(`${path}/`, `redirects to ${location}, expected ${path}`)
    } else if (res.status === 200) {
      const canonical = attr(findTag(body, /<link[^>]+rel="canonical"[^>]*>/), "href")
      if (stripSlash(canonical ?? "") !== SITE_URL + path) fail(`${path}/`, `canonical ${canonical} should be ${SITE_URL + path}`)
    } else if (res.status !== 404) {
      fail(`${path}/`, `unexpected status ${res.status}`)
    }
  }
  const ingest = await get("/ingest/static/array.js")
  if (ingest.res.status !== 200) fail("/ingest/static/array.js", `proxy status ${ingest.res.status}`)
})

// ── draft topic copy must not reach client JS ──
siteChecks.push(async (_pages, bodies) => {
  const home = bodies.get("/") ?? ""
  const srcs = [...new Set([...home.matchAll(/<script[^>]+src="(\/_next\/static\/[^"]+\.js[^"]*)"/g)].map((m) => m[1]))]
  const drafts = topicPages.filter((p) => p.status === "draft")
  for (const src of srcs) {
    const { body } = await get(src)
    for (const d of drafts) {
      if (body.includes(d.slug)) fail(src, `client JS contains draft slug ${d.slug}`)
      if (body.includes(d.hero.intro)) fail(src, `client JS contains draft intro of ${d.slug}`)
    }
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
