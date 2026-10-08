# SEO, AI Visibility & Measurement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site easier to find and choose in Google and AI assistants, with four topic pages and rich structured data, and measure which channels produce WhatsApp contacts. PostHog runs alongside GA4 first, then replaces it.

**Architecture:** All copy and facts stay in `src/content/site-content.ts`. Small pure modules in `src/lib/` (`seo`, `schema`, `topics`, `whatsapp`, `channel`, `llms`, `text`) turn that content into metadata, JSON-LD, sitemap/robots/llms.txt and analytics props. Topic pages are one statically generated dynamic route (`src/app/[topic]/page.tsx`) gated by a `draft | published` status. Analytics stays behind the `src/lib/analytics.ts` facade. PostHog loads lazily on idle and goes through a first-party `/ingest` rewrite.

**Tech Stack:** Next.js 16.3.1 App Router, React 19, TypeScript, inline styles + Tailwind v4 preflight, pnpm, posthog-js, Node ≥ 22.18 (native TS type stripping for check scripts).

**Spec:** `docs/superpowers/specs/2026-10-07-seo-ai-visibility-analytics-design.md`

## Global Constraints

- All copy lives in `src/content/site-content.ts` (and mirrored in `docs/CONTENT_SOURCE.md`). No hardcoded user-visible strings in components. (CLAUDE.md calls it `site-copy.ts`; the real file is `site-content.ts`.)
- New copy (topic pages, privacy page, link labels, WhatsApp messages, schema/llms wording) is **drafted by Claude and must be approved by Ana Julia** before publishing. It ships as `status: "draft"` (topic pages) or is listed in `docs/CONTENT_SOURCE.md` under `DRAFT — revisão Ana Julia`.
- YMYL / CFP (Resolução CFP 01/2023): no promises of cure or results, no diagnosis claims, no comparative claims, no testimonials used as promotion in page copy.
- Minimal JS, no visual redesign. Heading changes are markup-only (keep existing inline styles; reset margins/font on new heading wrappers).
- `SITE_URL = "https://psicoanajulia.com.br"`.
- Home title: `Psicóloga Online e Presencial em Florianópolis | Ana Julia Vognach`. Home description: `Psicoterapia online para o Brasil e exterior, e presencial em Florianópolis. Apoio especializado em transições de vida, saúde mental, luto e maternidade.`
- Title template: `%s | Ana Julia Vognach`. `<title>` ≤ 60 chars (home exempt, see Decisions), meta description ≤ 160 chars.
- `src/content/site-content.ts` and `src/lib/channel.ts` must stay **erasable-only TypeScript** (no `enum`, `namespace`, parameter properties) and **import nothing**, because Node check scripts import them directly.
- Event names unchanged: `whatsapp_click`, `faq_expand`, `services_expand`, `scroll_75`.
- PostHog config exactly: `api_host: "/ingest"`, `ui_host: "https://eu.posthog.com"`, `persistence: "memory"`, `disable_session_recording: true`, `person_profiles: "identified_only"`, `capture_pageview: "history_change"`, `autocapture: true`. Never call `identify()`.
- Package manager: pnpm. Verification commands: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm check:seo` (against `pnpm start`), `pnpm check:channel`.
- Out of scope: blog/MDX/CMS, hreflang, session replay, consent banner, Ads import, visual redesign.

## Decisions made in this plan (flag to user at review)

1. **Home title is 66 chars**, which breaks the spec's own "≤ 60" check. The spec also names that exact title as canonical, so the plan keeps it: `check-seo` reports `/` as a WARN rather than a FAIL. Every other page is held strictly to ≤ 60.
2. **Self-referrer → `"internal"`** in `classifyChannel` (spec: "excluding self" then falls to `direct`). Without this, a full reload or a hard navigation inside the site would re-label the visit as `direct`, because PostHog persistence is memory-only.
3. **`faq_expand` / `services_expand` fire on expand only.** Today they also fire on collapse.
4. **`ScrollTracker` moves from the layout into each page** so `scroll_75` fires once per page view, including after client-side navigation.
5. **Collapsed accordion bodies get `inert`** so keyboard users can't tab into hidden links (Áreas cards gain links in Task 7).
6. Small new content keys not named in the spec are needed so components hold no literals: `brand.jobTitle`, `brand.credentials`, `brand.knowsAboutExtra`, `brand.location.areaServed`, `services.channels`, `footer.address`, `footer.legal.privacyLink`, `llmsTxt`, `topicPageUi.breadcrumbAriaLabel`. New wording among them goes to Ana's review list.
7. Helper module `src/lib/topics.ts` and `src/lib/text.ts` and `src/lib/llms.ts` added (not in spec file map) to keep route files thin.

## Review Focus

1. **Draft leakage:** a draft topic page must not show up anywhere a crawler or visitor could find it: not in the sitemap, not in llms.txt, not as an Áreas link, not in any page's `related`. Pinned in Task 7 (`check-seo` scans every indexable page's HTML for `href="/<draft-slug>"`).
2. **Re-attribution on internal navigation:** a visit that came from ChatGPT, followed by a hard reload or full navigation inside the site, must not be reported as `direct`. Pinned in Task 9 (`check-channel` cases for `www.` and bare self-host → `internal`).
3. **Trailing-slash duplicates:** `skipTrailingSlashRedirect: true` is global, so `/luto-e-perdas/` must either redirect to `/luto-e-perdas` or return a canonical without the slash. Pinned in Task 10 (`check-seo` site check).
4. **Review date off by one day:** `reviewedAt: "2026-10-07"` must render as "7 de outubro de 2026" even when the build machine sits at UTC−3. Pinned in Task 7 (format with `timeZone: "UTC"`; `check-seo` compares against a UTC-formatted date; build with `TZ=America/Sao_Paulo`).
5. **Analytics across client-side navigation:** `scroll_75` must fire once per page view and `topic` must reflect the current page after `Link` navigation. PostHog's first `$pageview` must already carry `channel`. Pinned in Task 10 (manual browser procedure with exact expected events).

---

### Task 1: Verification script + metadata single source

**Files:**
- Create: `scripts/check-seo.mjs`
- Create: `src/lib/seo.ts`
- Modify: `package.json` (scripts)
- Modify: `tsconfig.json` (exclude `scripts`)
- Modify: `src/content/site-content.ts:53-57` (`meta.title`, `meta.description`)
- Modify: `src/app/layout.tsx:31-76` (metadata)
- Modify: `src/app/page.tsx` (export metadata)

**Interfaces:**
- Produces: `SITE_URL: string`, `absoluteUrl(path: string): string` (returns `SITE_URL` for `"/"`, else `SITE_URL + path`), `buildMetadata(input: { title: string; description: string; path: string; image?: string; absoluteTitle?: boolean }): Metadata` from `src/lib/seo.ts`.
- Produces: `scripts/check-seo.mjs` with registries `pageChecks: Array<(path: string, html: string, kind: "home" | "indexable" | "draft") => void>`, `siteChecks: Array<(pages: {path, kind}[], bodies: Map<string,string>) => Promise<void>>`, `extraPages: {path, kind}[]`, helpers `get(path)`, `fail(where, msg)`, `warn(where, msg)`, `count(html, re)`, `attr(tag, name)`, `findTag(html, re)`, `decode(s)`. Later tasks insert new checks **above the `// ── run ──` marker**.

- [ ] **Step 1: Confirm tooling**

Run: `node --version`
Expected: `v22.18.0` or newer (or any v23.6+/v24). If older, stop and ask the user to upgrade Node; the check scripts rely on native type stripping.

If `node_modules/next/dist/docs/` exists, read the pages for `generateMetadata`, `generateStaticParams`, `dynamicParams`, `robots`, `sitemap`, and Route Handlers before editing. Otherwise use nextjs.org/docs (v16). Key Next 16 facts this plan assumes: page `params` is a `Promise`; `metadata.title` accepts `{ absolute }` and `{ default, template }`; Route Handlers accept `export const dynamic = "force-static"`.

- [ ] **Step 2: Write the check script (fails first)**

Create `scripts/check-seo.mjs`:

```js
#!/usr/bin/env node
// SEO smoke check against a running production build.
// Usage: pnpm build && pnpm start   (in another terminal)  then  pnpm check:seo
// BASE_URL defaults to http://localhost:3000. Exits non-zero on any failure.

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
    TITLE_LENGTH_EXEMPT.has(path) ? warn(path, msg) : fail(path, msg)
  }

  const description = attr(findTag(html, /<meta[^>]+name="description"[^>]*>/), "content")
  if (!description) fail(path, "missing meta description")
  else if (description.length > DESCRIPTION_MAX) fail(path, `description is ${description.length} chars (> ${DESCRIPTION_MAX})`)

  const robots = attr(findTag(html, /<meta[^>]+name="robots"[^>]*>/), "content") ?? ""
  const noindex = robots.includes("noindex")
  if (kind === "draft" && !noindex) fail(path, "draft page is missing noindex")
  if (kind !== "draft" && noindex) fail(path, "indexable page has noindex")
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
```

Add to `package.json` `scripts`:

```json
"check:seo": "node scripts/check-seo.mjs",
"check:channel": "node scripts/check-channel.ts"
```

In `tsconfig.json` change `"exclude": ["node_modules"]` to `"exclude": ["node_modules", "scripts"]` (check scripts import `.ts` files with explicit extensions, which the app's tsconfig rejects).

- [ ] **Step 3: Run it against the current build to see it fail**

Run: `pnpm build`, then `pnpm start` in the background, then `pnpm check:seo`.
Expected: FAIL lines for `/`: `missing og:site_name` and `meta keywords should not be rendered`; WARN for title length 66. Stop the server.

- [ ] **Step 4: Create `src/lib/seo.ts`**

```ts
import type { Metadata } from "next"
import { brand, meta } from "@/content/site-content"

export const SITE_URL = "https://psicoanajulia.com.br"

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`
}

type BuildMetadataInput = {
  title: string
  description: string
  /** Path starting with "/", e.g. "/" or "/luto-e-perdas". */
  path: string
  image?: string
  /** Use the title as-is, without the " | Ana Julia Vognach" suffix (home page). */
  absoluteTitle?: boolean
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${brand.name}`
  const url = absoluteUrl(path)
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: fullTitle,
      description,
      siteName: meta.openGraph.siteName,
      locale: meta.openGraph.locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  }
}
```

- [ ] **Step 5: Reconcile `meta` in `site-content.ts`**

Replace `meta.title` and `meta.description` with:

```ts
  title: "Psicóloga Online e Presencial em Florianópolis | Ana Julia Vognach",
  description:
    "Psicoterapia online para o Brasil e exterior, e presencial em Florianópolis. Apoio especializado em transições de vida, saúde mental, luto e maternidade.",
```

Leave `meta.keywords` in place (reference only).

- [ ] **Step 6: Root layout metadata**

In `src/app/layout.tsx` add `import { brand, meta } from "@/content/site-content"` and replace the whole `export const metadata` object with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: meta.title, template: `%s | ${brand.name}` },
  description: meta.description,
  openGraph: {
    siteName: meta.openGraph.siteName,
    locale: meta.openGraph.locale,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: { rel: "manifest", url: "/site.webmanifest" },
  },
  robots: { index: true, follow: true },
}
```

and `import { SITE_URL } from "@/lib/seo"`. No canonical in the layout: each page sets its own.

- [ ] **Step 7: Home page metadata**

At the top of `src/app/page.tsx`:

```ts
import type { Metadata } from "next"
import { meta } from "@/content/site-content"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: meta.title,
  description: meta.description,
  path: "/",
  absoluteTitle: true,
})
```

- [ ] **Step 8: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`, start `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s), 1 warning(s)` (home title length). Also `curl -s localhost:3000 | grep -o '<title>[^<]*</title>'` prints the 66-char title exactly once (no double suffix). Stop the server.

- [ ] **Step 9: Commit**

```bash
git add scripts/check-seo.mjs src/lib/seo.ts package.json tsconfig.json src/content/site-content.ts src/app/layout.tsx src/app/page.tsx
git commit -m "feat(seo): single metadata source and check-seo script"
```

---

### Task 2: Location, multi-page anchors, WhatsApp helper, per-page float and scroll tracker

**Files:**
- Create: `src/lib/whatsapp.ts`
- Modify: `src/content/site-content.ts` (`brand.location`, `contentUpdatedAt`, nav/footer anchors, `footer.address`)
- Modify: `src/components/ui/whatsapp-float.tsx`
- Modify: `src/components/sections/nav.tsx`, `src/components/ui/nav-drawer.tsx` (use `Link`)
- Modify: `src/components/sections/footer.tsx` (address block, `Link` for internal links)
- Modify: `src/app/layout.tsx` (remove `WhatsAppFloat`, `ScrollTracker`)
- Modify: `src/app/page.tsx` (add `ScrollTracker`, `WhatsAppFloat`)
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: `check-seo` registries (Task 1).
- Produces: `whatsappHref(message: string): string`; `WhatsAppFloat({ href?: string })`; `brand.location` shape below; `contentUpdatedAt: string` (ISO date).

- [ ] **Step 1: Add the failing checks**

At the top of `scripts/check-seo.mjs` (after the comment header) add:

```js
import { brand } from "../src/content/site-content.ts"
```

Insert above `// ── run ──`:

```js
// ── home: location + anchors + float ──
pageChecks.push((path, html, kind) => {
  if (kind !== "home") return
  if (!/<address[\s>]/.test(html)) fail(path, "footer <address> missing")
  if (!html.includes(brand.location.postalCode)) fail(path, "postal code missing from footer")
  if (/href="#/.test(html)) fail(path, 'found same-page href="#…" (use "/#…" so links work from other pages)')
  if (!/data-wa-location="float"/.test(html)) fail(path, "floating WhatsApp button missing")
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm check:seo` (with the Task 1 build running).
Expected: crash with `brand.location` undefined (TypeError on `postalCode`). That counts as failing.

- [ ] **Step 3: Content changes in `site-content.ts`**

Inside `brand`, after `contact`, add:

```ts
  location: {
    streetAddress: "Rodovia SC-405, 4397",
    complement: "Shopping Oka Floripa, Torre Sol, Sala 114",
    neighborhood: "Campeche",
    city: "Florianópolis",
    region: "SC",
    postalCode: "88065-000",
    country: "BR",
    /** Preencher a partir do Google Business Profile; omitido do schema enquanto undefined. */
    geo: undefined as { lat: number; lng: number } | undefined,
    hours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    hoursLabel: "Segunda a sexta, 8h às 20h",
    gbpUrl: "https://maps.app.goo.gl/yx6VRRiSPBZc5SBH7?g_st=iw",
    areaServed: {
      city: "Florianópolis",
      places: ["Sul da Ilha", "Campeche"],
      country: "Brasil",
    },
  },
```

After the `META` block add:

```ts
/** Data da última alteração de conteúdo (ISO). Atualizar manualmente — usada no sitemap. */
export const contentUpdatedAt = "2026-10-07";
```

Change `nav.links` hrefs to `"/#abordagem"`, `"/#servicos"`, `"/#sobre"`, `"/#faq"`, `"/#contato"`. Change footer `Navegação` hrefs to `"/#sobre"`, `"/#abordagem"`, `"/#servicos"`, `"/#faq"`.

Inside `footer`, after `columns`, add:

```ts
  address: {
    postalCodePrefix: "CEP",
  },
```

- [ ] **Step 4: `src/lib/whatsapp.ts`**

```ts
import { brand } from "@/content/site-content"

/** wa.me link with a pre-filled message (plain text, encoded here). */
export function whatsappHref(message: string): string {
  return `https://wa.me/${brand.contact.whatsapp.raw}?text=${encodeURIComponent(message)}`
}
```

- [ ] **Step 5: `WhatsAppFloat` accepts `href`**

In `src/components/ui/whatsapp-float.tsx` change the signature and anchor:

```tsx
export function WhatsAppFloat({ href = floatingWhatsapp.href }: { href?: string }) {
  return (
    <a
      href={href}
```

(rest unchanged).

- [ ] **Step 6: Move float + scroll tracker into the page**

In `src/app/layout.tsx` remove the `WhatsAppFloat` and `ScrollTracker` imports and their JSX (`<ScrollTracker />`, `<WhatsAppFloat />`). Keep `WhatsAppClickTracker` (document-level listener).

`src/app/page.tsx` body becomes:

```tsx
export default function Home() {
  return (
    <>
      <main>
        <ScrollTracker />
        <Hero />
        <Callout />
        <Approach />
        <Services />
        <Areas />
        <About />
        <Mission />
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
      <WhatsAppFloat />
    </>
  )
}
```

with imports `import { ScrollTracker } from "@/components/ui/scroll-tracker"` and `import { WhatsAppFloat } from "@/components/ui/whatsapp-float"`. Keep `export const revalidate = 86400`.

- [ ] **Step 7: `Link` for internal nav**

In `src/components/sections/nav.tsx` add `import Link from "next/link"` and replace the desktop link `<a key={link.href} href={link.href} className="nav-link" style={…}>` … `</a>` with `<Link key={link.href} href={link.href} className="nav-link" style={…}>` … `</Link>` (same props and style). In `src/components/ui/nav-drawer.tsx` do the same for the `nav.links.map` anchor (keep `onClick={onClose}`). The WhatsApp CTAs stay `<a>`.

- [ ] **Step 8: Footer address + internal `Link`**

In `src/components/sections/footer.tsx` add `import Link from "next/link"`. Inside the brand column, after the `<div>` holding name and `footer.brand.sub`, add:

```tsx
            <address
              style={{
                fontStyle: "normal",
                fontFamily: "var(--font-inter)",
                fontSize: 13,
                lineHeight: 1.6,
                color: "rgba(253,251,247,0.6)",
                marginTop: 8,
              }}
            >
              {brand.location.streetAddress}
              <br />
              {brand.location.complement}
              <br />
              {brand.location.neighborhood}, {brand.location.city} – {brand.location.region}
              <br />
              {footer.address.postalCodePrefix} {brand.location.postalCode}
              <br />
              {brand.location.hoursLabel}
            </address>
```

In the links loop, hoist the anchor style to a constant above `return` in `Footer`:

```tsx
  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter)",
    fontSize: 14,
    color: "rgba(253,251,247,0.8)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 8,
    lineHeight: 1.4,
  };
```

and render internal links with `Link`:

```tsx
                      {href ? (
                        href.startsWith("/") ? (
                          <Link href={href} style={linkStyle}>
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            style={linkStyle}
                          >
                            {icon && <FooterIcon name={icon} />}
                            {link.label}
                          </a>
                        )
                      ) : (
```

- [ ] **Step 9: Verify the street against GBP**

Open `brand.location.gbpUrl` in a browser and compare the street line character by character with `streetAddress` + `complement`. If it differs, use the GBP form in `site-content.ts` and tell the user.

- [ ] **Step 10: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`. Manually load `/`, click a nav link → smooth scroll to section still works; floating button visible. Stop server.

- [ ] **Step 11: Commit**

```bash
git add -A src scripts
git commit -m "feat(seo): address, multi-page anchors, per-page WhatsApp float"
```

---

### Task 3: Semantic headings (markup only) + accordion via facade

**Files:**
- Modify: `src/components/ui/accordion-item.tsx`
- Modify: `src/components/sections/services.tsx`, `areas.tsx`, `faq.tsx`, `testimonials.tsx`, `mission.tsx`, `about.tsx`
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: `trackFaqExpand(id: string)`, `trackServicesExpand(id: string)` from `src/lib/analytics.ts` (existing).
- Produces: `AccordionItem` props `{ id: string; trigger: ReactNode; children: ReactNode; isOpen: boolean; onToggle: () => void; analyticsEvent?: "faq_expand" | "services_expand"; headingLevel?: 2 | 3 | 4 }`. Trigger button is wrapped in `<h{headingLevel}>`; body region is `inert` while closed.

- [ ] **Step 1: Add the failing check**

Insert above `// ── run ──` in `scripts/check-seo.mjs`:

```js
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm check:seo` (current build running).
Expected: FAIL `expected ≥ 7 <h2>, found 2` and `expected ≥ 14 <h3>, found 0`.

- [ ] **Step 3: Rewrite `AccordionItem`**

Replace the top of `src/components/ui/accordion-item.tsx` through the opening `<button` with:

```tsx
"use client"

import type { ReactNode } from "react"
import { trackFaqExpand, trackServicesExpand } from "@/lib/analytics"

type AccordionEvent = "faq_expand" | "services_expand"

const trackers: Record<AccordionEvent, (id: string) => void> = {
  faq_expand: trackFaqExpand,
  services_expand: trackServicesExpand,
}

interface AccordionItemProps {
  id: string
  trigger: ReactNode
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
  analyticsEvent?: AccordionEvent
  /** Heading level wrapping the trigger (WAI-ARIA accordion pattern). */
  headingLevel?: 2 | 3 | 4
}

export function AccordionItem({
  id,
  trigger,
  children,
  isOpen,
  onToggle,
  analyticsEvent,
  headingLevel = 3,
}: AccordionItemProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4"

  function handleToggle() {
    if (analyticsEvent && !isOpen) trackers[analyticsEvent](id)
    onToggle()
  }

  return (
    <div style={{ borderBottom: "1px solid var(--color-linhas)" }}>
      <Heading style={{ margin: 0, font: "inherit" }}>
        <button
```

Close `</Heading>` right after the `</button>`. On the body region `div` (`id={\`accordion-body-${id}\`}`) add `inert={!isOpen}`. Everything else stays.

- [ ] **Step 4: Section headings**

Change only the tag name; keep every style prop:
- `services.tsx`: eyebrow `<p …>` → `<h2 …>` (closing tag too). Wrap the item `<button …>…</button>` in `<h3 style={{ margin: 0, font: "inherit" }}>…</h3>`. Replace the hardcoded tagline text with `{services.tagline}`.
- `areas.tsx`: eyebrow `<p>` → `<h2>`. Item titles become `h3` through `AccordionItem` (default level).
- `faq.tsx`: eyebrow `<p>` → `<h2>`. Questions become `h3` through `AccordionItem`.
- `testimonials.tsx`: eyebrow `<p>` → `<h2>`.
- `mission.tsx`: eyebrow `<p>` → `<h2>`.
- `about.tsx`: trajectory `<h4>` → `<h3>`.

Tailwind preflight already resets heading `font-size`/`font-weight`/`margin`, and each converted element sets its own font, size and margin inline, so nothing should shift visually.

- [ ] **Step 5: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`.
Visual: take a full-page screenshot of `/` at 390px and 1280px wide before (on `main`, `git stash` or a second worktree) and after. Compare the Services, Áreas, Testimonials, FAQ, Mission and About sections: they should look identical. Keyboard: Tab through the FAQ. Focus should land on each question and never inside a collapsed answer. Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A src scripts
git commit -m "feat(seo): semantic heading outline, accordion headings and facade tracking"
```

---

### Task 4: Structured data graph (global + home)

**Files:**
- Create: `src/lib/text.ts`
- Create: `src/lib/schema.ts`
- Create: `src/components/seo/json-ld.tsx`
- Modify: `src/content/site-content.ts` (`brand.jobTitle`, `brand.credentials`, `brand.knowsAboutExtra`, `services.channels`)
- Modify: `src/app/layout.tsx` (replace inline `jsonLd`)
- Modify: `src/app/page.tsx` (home graph)
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: `SITE_URL`, `absoluteUrl` (Task 1); `brand.location` (Task 2).
- Produces: `asText(v: string | string[]): string`; from `schema.ts`: `type JsonLdNode = Record<string, unknown>`, `ids: { person: string; practice: string; website: string }`, `pageId(path: string, fragment: string): string`, `graph(...nodes: JsonLdNode[]): JsonLdNode`, `webPageNode(input: { path: string; name: string; description: string; about?: JsonLdNode }): JsonLdNode`, `faqPageNode(items: { question: string; answer: string | string[] }[], path: string): JsonLdNode`, `siteGraph(): JsonLdNode`, `homeGraph(): JsonLdNode`; `<JsonLd data={object} />`.

- [ ] **Step 1: Add the failing check**

Insert above `// ── run ──`:

```js
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm check:seo`.
Expected: FAIL for `/`: missing `Person`, `WebSite`, `WebPage`, `FAQPage`.

- [ ] **Step 3: Content keys**

In `brand` (after `crp`) add:

```ts
  jobTitle: "Psicóloga Clínica",
  credentials: {
    license: {
      name: "CRP/SC 12/30269",
      issuer: "Conselho Regional de Psicologia – 12ª Região",
    },
    residency: {
      name: "Residência Multiprofissional em Saúde – Oncologia",
    },
  },
  knowsAboutExtra: ["Psicologia sistêmica"],
```

In `services` (after `tagline`) add:

```ts
  channels: ["Atendimento online", "Atendimento presencial em Florianópolis"],
```

Add `credentials.residency.name` and `services.channels` to Ana's review list (Task 6 writes that list).

- [ ] **Step 4: `src/lib/text.ts`**

```ts
/** Content fields are either one paragraph or a list of paragraphs. */
export function asText(value: string | string[]): string {
  return Array.isArray(value) ? value.join(" ") : value
}
```

- [ ] **Step 5: `src/lib/schema.ts`**

```ts
import { areas, brand, faq, hero, meta, services } from "@/content/site-content"
import { SITE_URL, absoluteUrl } from "@/lib/seo"
import { asText } from "@/lib/text"

export type JsonLdNode = Record<string, unknown>

export const ids = {
  person: `${SITE_URL}/#person`,
  practice: `${SITE_URL}/#practice`,
  website: `${SITE_URL}/#website`,
}

export function pageId(path: string, fragment: string): string {
  return path === "/" ? `${SITE_URL}/#${fragment}` : `${SITE_URL}${path}#${fragment}`
}

export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes }
}

const photoUrl = absoluteUrl(`/${hero.photo.src}`)
const loc = brand.location

function personNode(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": ids.person,
    name: brand.name,
    jobTitle: brand.jobTitle,
    image: photoUrl,
    url: SITE_URL,
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: brand.credentials.license.name,
        credentialCategory: "license",
        recognizedBy: { "@type": "Organization", name: brand.credentials.license.issuer },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: brand.credentials.residency.name,
        credentialCategory: "residency",
      },
    ],
    knowsAbout: [
      ...areas.items.map((item) => item.title),
      ...services.items.map((item) => item.title),
      ...brand.knowsAboutExtra,
    ],
    sameAs: [brand.contact.instagram.href, loc.gbpUrl],
    worksFor: { "@id": ids.practice },
  }
}

function practiceNode(): JsonLdNode {
  return {
    "@type": "Psychologist",
    "@id": ids.practice,
    name: brand.name,
    description: meta.description,
    url: SITE_URL,
    image: photoUrl,
    telephone: `+${brand.contact.whatsapp.raw}`,
    email: brand.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${loc.streetAddress} — ${loc.complement}`,
      addressLocality: loc.city,
      addressRegion: loc.region,
      postalCode: loc.postalCode,
      addressCountry: loc.country,
    },
    ...(loc.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: loc.geo.lat, longitude: loc.geo.lng } }
      : {}),
    openingHoursSpecification: loc.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [
      { "@type": "City", name: loc.areaServed.city },
      ...loc.areaServed.places.map((name) => ({ "@type": "Place", name })),
      { "@type": "Country", name: loc.areaServed.country },
    ],
    founder: { "@id": ids.person },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: services.eyebrow,
      itemListElement: services.items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: asText(item.body),
          availableChannel: services.channels.map((name) => ({
            "@type": "ServiceChannel",
            name,
            serviceUrl: brand.contact.whatsapp.href,
          })),
        },
      })),
    },
    sameAs: [loc.gbpUrl, brand.contact.instagram.href],
  }
}

function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name: brand.name,
    url: SITE_URL,
    inLanguage: meta.language,
    publisher: { "@id": ids.person },
  }
}

export function siteGraph(): JsonLdNode {
  return graph(personNode(), practiceNode(), websiteNode())
}

export function webPageNode({
  path,
  name,
  description,
  about,
}: {
  path: string
  name: string
  description: string
  about?: JsonLdNode
}): JsonLdNode {
  return {
    "@type": "WebPage",
    "@id": pageId(path, "webpage"),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: meta.language,
    isPartOf: { "@id": ids.website },
    ...(about ? { about } : {}),
  }
}

export function faqPageNode(
  items: { question: string; answer: string | string[] }[],
  path: string,
): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": pageId(path, "faq"),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: asText(item.answer) },
    })),
  }
}

export function homeGraph(): JsonLdNode {
  return graph(
    webPageNode({
      path: "/",
      name: meta.title,
      description: meta.description,
      about: { "@id": ids.practice },
    }),
    faqPageNode(faq.items, "/"),
  )
}
```

- [ ] **Step 6: `src/components/seo/json-ld.tsx`**

```tsx
/** Renders JSON-LD; "<" is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
```

- [ ] **Step 7: Wire it**

`src/app/layout.tsx`: delete the `const jsonLd = {…}` object and the inline `<script type="application/ld+json" …/>`; add `import { JsonLd } from "@/components/seo/json-ld"`, `import { siteGraph } from "@/lib/schema"` and render `<JsonLd data={siteGraph()} />` as the first child of `<body>`.

`src/app/page.tsx`: import `JsonLd` and `homeGraph`; render `<JsonLd data={homeGraph()} />` as the first child of `<main>`.

- [ ] **Step 8: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`. Also paste `curl -s localhost:3000 | grep -o '<script type="application/ld+json">[^<]*'` output into https://validator.schema.org (manual) → no errors. Stop server.

- [ ] **Step 9: Commit**

```bash
git add -A src scripts
git commit -m "feat(seo): Person/Psychologist/WebSite graph and home FAQPage JSON-LD"
```

---

### Task 5: Topic content model, sitemap, robots, llms.txt

**Files:**
- Create: `src/lib/topics.ts`
- Create: `src/lib/llms.ts`
- Create: `src/app/llms.txt/route.ts`
- Modify: `src/content/site-content.ts` (`TopicPage`, `topicPages`, `topicPageUi`, `areas.linkLabel`, `llmsTxt`)
- Modify: `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: `absoluteUrl`, `SITE_URL` (Task 1), `whatsappHref` (Task 2), `asText` (Task 4), `contentUpdatedAt` (Task 2).
- Produces: `type TopicPage` (exact shape below), `topicPages: TopicPage[]`, `topicPageUi`, `areas.linkLabel`; from `topics.ts`: `isPublished(p: TopicPage): boolean`, `publishedTopicPages(): TopicPage[]`, `findTopicPage(slug: string): TopicPage | undefined`, `publishedTopicForArea(areaId: string): TopicPage | undefined`, `topicPath(p: TopicPage): string`; `buildLlmsTxt(): string`.

- [ ] **Step 1: Add the failing checks**

Change the import line at the top of `scripts/check-seo.mjs` to:

```js
import { brand, contentUpdatedAt, topicPages } from "../src/content/site-content.ts"
```

Insert above `// ── run ──`:

```js
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm check:seo`.
Expected: `contentUpdatedAt`/`topicPages` import resolves to `undefined` → `topicPages.filter` TypeError. That counts as failing.

- [ ] **Step 3: Content model**

In `site-content.ts` `areas`, add after `eyebrow`:

```ts
  /** Link do card para a página do tema (só aparece quando a página está publicada). */
  linkLabel: "Saiba mais",
```

Before the `CONTEÚDO COMPLETO` block add:

```ts
// ────────────────────────────────────────────────────────────────
// TOPIC PAGES · uma página por área de atuação
// ────────────────────────────────────────────────────────────────

export type TopicPage = {
  slug: string;
  /** Corresponde a areas.items[].id */
  areaId: string;
  /** "draft": acessível pela URL, mas noindex, fora do sitemap/llms.txt e sem links internos. */
  status: "draft" | "published";
  seo: { title: string; description: string };
  breadcrumbLabel: string;
  hero: { eyebrow: string; title: string; intro: string };
  sections: { heading: string; paragraphs: string[] }[];
  faq: { id: string; question: string; answer: string }[];
  cta: { label: string; whatsappMessage: string };
  /** Data ISO (AAAA-MM-DD) da última revisão por Ana Julia. */
  reviewedAt: string;
  /** Slugs de outras páginas de tema. */
  related: string[];
};

export const topicPages: TopicPage[] = [];

export const topicPageUi = {
  breadcrumbHome: "Início",
  breadcrumbAriaLabel: "Você está em",
  reviewedByLabel: "Revisado por",
  relatedHeading: "Outras áreas",
  faqHeading: "Perguntas frequentes",
};

// ────────────────────────────────────────────────────────────────
// LLMS.TXT · resumo para assistentes de IA
// ────────────────────────────────────────────────────────────────

export const llmsTxt = {
  summary:
    "Ana Julia Vognach é psicóloga clínica (CRP/SC 12/30269), especialista em Oncologia por Residência Multiprofissional em Saúde. Atende adolescentes, adultos e idosos online, para todo o Brasil e exterior, e presencialmente em Florianópolis, no Campeche (Sul da Ilha).",
  areasHeading: "Áreas de atuação",
  servicesHeading: "Serviços",
  faqHeading: "Perguntas frequentes",
  contactHeading: "Agendamento",
  whatsappLabel: "WhatsApp",
  emailLabel: "E-mail",
  siteLabel: "Site",
};
```

- [ ] **Step 4: `src/lib/topics.ts`**

```ts
import { topicPages, type TopicPage } from "@/content/site-content"

export function isPublished(page: TopicPage): boolean {
  return page.status === "published"
}

export function publishedTopicPages(): TopicPage[] {
  return topicPages.filter(isPublished)
}

export function findTopicPage(slug: string): TopicPage | undefined {
  return topicPages.find((page) => page.slug === slug)
}

export function publishedTopicForArea(areaId: string): TopicPage | undefined {
  return topicPages.find((page) => page.areaId === areaId && isPublished(page))
}

export function topicPath(page: TopicPage): string {
  return `/${page.slug}`
}
```

- [ ] **Step 5: Sitemap**

Replace `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next"
import { contentUpdatedAt } from "@/content/site-content"
import { absoluteUrl } from "@/lib/seo"
import { publishedTopicPages, topicPath } from "@/lib/topics"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: contentUpdatedAt, changeFrequency: "monthly", priority: 1 },
    ...publishedTopicPages().map((page) => ({
      url: absoluteUrl(topicPath(page)),
      lastModified: page.reviewedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
```

- [ ] **Step 6: Robots**

Replace `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// Search/retrieval agents that cite or link to the site. Listed explicitly so the
// policy is visible, even though "*" already allows them.
const SEARCH_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Bingbot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: SEARCH_AGENTS, allow: "/" },
      // Training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) are allowed via "*".
      // To opt out of AI training without affecting search, add:
      // { userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot"], disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 7: llms.txt builder + route**

`src/lib/llms.ts`:

```ts
import { areas, brand, faq, llmsTxt, services, whatsappMessages } from "@/content/site-content"
import { SITE_URL, absoluteUrl } from "@/lib/seo"
import { asText } from "@/lib/text"
import { publishedTopicForArea, topicPath } from "@/lib/topics"
import { whatsappHref } from "@/lib/whatsapp"

export function buildLlmsTxt(): string {
  const loc = brand.location
  const lines = [
    `# ${brand.name}`,
    "",
    `> ${llmsTxt.summary}`,
    `> ${brand.crp} · ${loc.streetAddress}, ${loc.complement}, ${loc.neighborhood}, ${loc.city} – ${loc.region}, ${loc.postalCode} · ${loc.hoursLabel}`,
    "",
    `## ${llmsTxt.areasHeading}`,
    "",
    ...areas.items.map((item) => {
      const page = publishedTopicForArea(item.id)
      const title = page ? `[${item.title}](${absoluteUrl(topicPath(page))})` : item.title
      return `- ${title}: ${asText(item.body)}`
    }),
    "",
    `## ${llmsTxt.servicesHeading}`,
    "",
    services.tagline,
    "",
    ...services.items.map((item) => `- ${item.title}: ${asText(item.body)}`),
    "",
    `## ${llmsTxt.faqHeading}`,
    "",
    ...faq.items.flatMap((item) => [`### ${item.question}`, "", asText(item.answer), ""]),
    `## ${llmsTxt.contactHeading}`,
    "",
    `- ${llmsTxt.whatsappLabel}: ${whatsappHref(whatsappMessages.schedule)}`,
    `- ${llmsTxt.emailLabel}: ${brand.contact.email}`,
    `- ${llmsTxt.siteLabel}: ${SITE_URL}`,
  ]
  return `${lines.join("\n")}\n`
}
```

`src/app/llms.txt/route.ts`:

```ts
import { buildLlmsTxt } from "@/lib/llms"

export const dynamic = "force-static"

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
```

- [ ] **Step 8: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`. Build output lists `/llms.txt` as static (○). `curl -s localhost:3000/llms.txt` reads as clean Markdown. Stop server.

- [ ] **Step 9: Commit**

```bash
git add -A src scripts
git commit -m "feat(seo): topic content model, stable sitemap, AI-aware robots and llms.txt"
```

---

### Task 6: Draft copy for the four topic pages (for Ana's review)

**Files:**
- Modify: `src/content/site-content.ts` (`topicPages` entries, all `status: "draft"`)
- Modify: `docs/CONTENT_SOURCE.md` (new section `DRAFT — revisão Ana Julia`)

**Interfaces:**
- Consumes: `TopicPage` type (Task 5).
- Produces: 4 `TopicPage` entries with the slugs/areaIds below. Task 7 renders them.

This task is writing, not code. The skeleton below is fixed: slugs, SEO strings, headings, FAQ questions, WhatsApp messages. Write the prose (`hero.intro`, `sections[].paragraphs`, `faq[].answer`) under these rules:

- pt-BR, 800–1200 words per page in total (intro + sections + FAQ answers).
- Base it on the existing área copy (`areas.items`), `approach.body`, `about`, `faq` and `support`. Match their calm, warm, non-marketing tone. Use "você" and the "a(o)" gender-inclusive pattern the site already uses.
- Open every section with a direct 1–2 sentence answer to its heading, then add 1–2 short paragraphs (2–4 sentences each).
- Put concrete facts in plain text: CRP/SC 12/30269, Residência Multiprofissional em Saúde (Oncologia), "online para todo o Brasil e exterior", presencial at Shopping Oka Floripa, Campeche, sessions by video call through a secure link, payment via PIX/transfer with receipts for reimbursement.
- CFP / YMYL: no promise of cure or results ("vai superar", "garante", "resolve"), no self-diagnosis checklists presented as diagnosis, no comparison with other professionals, no testimonials, no mention of prices. When describing symptoms, say they *may* indicate something and that evaluation happens in session.
- Each "Como funciona o atendimento" section must say: first conversation is a short no-commitment chat (from `faq.items` "conversa-antes"), online or presencial, and how to schedule (WhatsApp).
- FAQ answers: 2–4 sentences, plain string (not array).

- [ ] **Step 1: Page skeletons in `site-content.ts`**

Replace `export const topicPages: TopicPage[] = [];` with four entries in this order. `reviewedAt: "2026-10-07"` for all (it is reset on approval). Fill every `"…"` prose field following the rules above. Do not commit until none remain:

| field | burnout-saude-mental-trabalho | maternidade-parentalidade | luto-e-perdas | psico-oncologia-cuidados-paliativos |
|---|---|---|---|---|
| areaId | `clinica-do-trabalho` | `psicoterapia-maes` | `luto-transicoes` | `psico-oncologia` |
| seo.title (≤ 39 chars) | Burnout e Saúde Mental no Trabalho | Psicóloga para Maternidade e Família | Psicoterapia para Luto e Perdas | Psico-Oncologia e Cuidados Paliativos |
| seo.description | Psicoterapia para burnout, esgotamento e sofrimento ligado ao trabalho. Atendimento online para todo o Brasil e presencial em Florianópolis (Campeche). | Psicoterapia na gestação, no puerpério e na parentalidade: apoio a mães, pais e famílias. Online para todo o Brasil e presencial em Florianópolis. | Acompanhamento psicológico no luto, no luto antecipatório e em outras perdas. Psicoterapia online para todo o Brasil e presencial em Florianópolis. | Apoio psicológico para pessoas em tratamento oncológico, com doenças graves, e seus familiares. Online para todo o Brasil e presencial em Florianópolis. |
| breadcrumbLabel | Saúde mental e trabalho | Maternidade e parentalidade | Luto e perdas | Psico-oncologia |
| hero.eyebrow | Áreas de atuação | Áreas de atuação | Áreas de atuação | Áreas de atuação |
| hero.title | Burnout e saúde mental no trabalho | Maternidade, parentalidade e família | Luto e perdas | Psico-oncologia e cuidados paliativos |
| section headings (5) | Como saber se estou com burnout? · Burnout é a mesma coisa que estresse? · Quando o trabalho invade a vida pessoal · Como a psicoterapia pode ajudar · Como funciona o atendimento | O que é normal sentir no puerpério? · Como conciliar maternidade, carreira e identidade? · Psicoterapia na gestação e no pós-parto · Orientação parental e terapia familiar · Como funciona o atendimento | O que é o luto? · Existe um tempo certo para o luto? · O que é luto antecipatório? · Como a psicoterapia acompanha o luto · Como funciona o atendimento | O que é psico-oncologia? · Como lidar com o diagnóstico de câncer? · Apoio psicológico para familiares e cuidadores · O que são cuidados paliativos? · Como funciona o atendimento |
| faq (id → question) | `burnout-diagnostico` → Preciso ter um diagnóstico para começar? · `burnout-online` → O atendimento online é indicado para quem está esgotada(o)? · `burnout-duracao` → Quanto tempo dura o acompanhamento? | `maternidade-bebe` → Posso fazer a sessão online com o bebê por perto? · `maternidade-pais` → Você atende pais e casais também? · `maternidade-quando` → Quando procurar ajuda no pós-parto? | `luto-quando` → Quando procurar psicoterapia depois de uma perda? · `luto-morte` → O luto só acontece quando alguém morre? · `luto-online` → Posso fazer psicoterapia para o luto online? | `onco-tratamento` → Você atende pacientes durante o tratamento? · `onco-familia` → Familiares também podem fazer acompanhamento? · `onco-online` → É possível fazer as sessões online durante o tratamento? |
| cta.label | Agendar conversa inicial | Agendar conversa inicial | Agendar conversa inicial | Agendar conversa inicial |
| cta.whatsappMessage | Olá, Ana Julia. Vi sua página sobre saúde mental e trabalho e gostaria de agendar uma conversa inicial. | Olá, Ana Julia. Vi sua página sobre maternidade e parentalidade e gostaria de agendar uma conversa inicial. | Olá, Ana Julia. Vi sua página sobre luto e perdas e gostaria de agendar uma conversa inicial. | Olá, Ana Julia. Vi sua página sobre psico-oncologia e gostaria de agendar uma conversa inicial. |
| related | `luto-e-perdas`, `maternidade-parentalidade` | `burnout-saude-mental-trabalho`, `luto-e-perdas` | `psico-oncologia-cuidados-paliativos`, `maternidade-parentalidade` | `luto-e-perdas`, `burnout-saude-mental-trabalho` |

Example of the shape (first entry, prose elided only in this plan):

```ts
  {
    slug: "burnout-saude-mental-trabalho",
    areaId: "clinica-do-trabalho",
    status: "draft",
    seo: {
      title: "Burnout e Saúde Mental no Trabalho",
      description:
        "Psicoterapia para burnout, esgotamento e sofrimento ligado ao trabalho. Atendimento online para todo o Brasil e presencial em Florianópolis (Campeche).",
    },
    breadcrumbLabel: "Saúde mental e trabalho",
    hero: {
      eyebrow: "Áreas de atuação",
      title: "Burnout e saúde mental no trabalho",
      intro: "<1–2 sentence lead, Cormorant italic>",
    },
    sections: [
      { heading: "Como saber se estou com burnout?", paragraphs: ["<direct answer>", "<detail>"] },
      // … 4 more, headings exactly as in the table
    ],
    faq: [
      { id: "burnout-diagnostico", question: "Preciso ter um diagnóstico para começar?", answer: "<2–4 sentences>" },
      // … 2 more
    ],
    cta: {
      label: "Agendar conversa inicial",
      whatsappMessage:
        "Olá, Ana Julia. Vi sua página sobre saúde mental e trabalho e gostaria de agendar uma conversa inicial.",
    },
    reviewedAt: "2026-10-07",
    related: ["luto-e-perdas", "maternidade-parentalidade"],
  },
```

- [ ] **Step 2: Self-check the prose**

Run: `grep -nE "garant|cura|resolve|vai superar|melhor psic|<" src/content/site-content.ts`
Expected: no hits inside `topicPages` (`<` hits mean a placeholder is left). Count words per page (paste each page's text into `wc -w`): 800–1200.

- [ ] **Step 3: Mirror into `docs/CONTENT_SOURCE.md`**

Append a section:

```md
---

# DRAFT — revisão Ana Julia

> Textos redigidos por Claude em 2026-10-07. Nada aqui é publicado (indexado ou linkado) antes da aprovação.
> Para publicar uma página: trocar `status` para `"published"`, atualizar `reviewedAt` e `contentUpdatedAt` em `src/content/site-content.ts`.

## Novos rótulos e mensagens
- Link dos cards de Áreas: "Saiba mais"
- Topic pages: "Início", "Você está em", "Revisado por", "Outras áreas", "Perguntas frequentes"
- Resumo para IA (llms.txt): <copy llmsTxt.summary>
- Credencial: "Residência Multiprofissional em Saúde – Oncologia"
- Canais de atendimento: "Atendimento online", "Atendimento presencial em Florianópolis"

## Página: Burnout e saúde mental no trabalho (/burnout-saude-mental-trabalho)
<full text: SEO title, description, intro, each heading + paragraphs, FAQ Q/A, WhatsApp message>

## Página: Maternidade, parentalidade e família (/maternidade-parentalidade)
<…same structure…>

## Página: Luto e perdas (/luto-e-perdas)
<…>

## Página: Psico-oncologia e cuidados paliativos (/psico-oncologia-cuidados-paliativos)
<…>
```

Replace every `<…>` with the real text from `site-content.ts`. The final file must contain no angle-bracket placeholders.

- [ ] **Step 4: Verify types**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/site-content.ts docs/CONTENT_SOURCE.md
git commit -m "content: draft topic pages for Ana Julia's review"
```

---

### Task 7: Topic page route, components, area links

**Files:**
- Create: `src/app/[topic]/page.tsx`
- Create: `src/components/topic/breadcrumb.tsx`, `topic-hero.tsx`, `topic-section.tsx`, `topic-cta.tsx`, `topic-faq.tsx`, `review-line.tsx`, `related-topics.tsx`
- Modify: `src/lib/schema.ts` (add `topicGraph`)
- Modify: `src/components/sections/areas.tsx` (link to published topic)
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: `buildMetadata`, `absoluteUrl` (T1); `whatsappHref`, `WhatsAppFloat({href})` (T2); `AccordionItem` (T3); `graph`, `pageId`, `faqPageNode`, `ids`, `JsonLd` (T4); `TopicPage`, `topicPageUi`, `findTopicPage`, `isPublished`, `topicPath`, `publishedTopicForArea`, `areas.linkLabel` (T5); topic entries (T6).
- Produces: `topicGraph(page: TopicPage): JsonLdNode`; `formatReviewDate(iso: string): string`; route `/<slug>` for every `topicPages` entry, 404 for others; `<main data-topic={slug}>`.

- [ ] **Step 1: Add the failing checks**

Insert above `// ── run ──`:

```js
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm build` (topic entries exist now), `pnpm start` in background, `pnpm check:seo`.
Expected: FAIL `status 404` for each of the four draft slugs. Stop server.

- [ ] **Step 3: `topicGraph` in `schema.ts`**

Change the content import to `import { areas, brand, faq, hero, meta, services, topicPageUi, type TopicPage } from "@/content/site-content"`, add `import { topicPath } from "@/lib/topics"`, and append:

```ts
export function topicGraph(page: TopicPage): JsonLdNode {
  const path = topicPath(page)
  const url = absoluteUrl(path)
  return graph(
    {
      "@type": "MedicalWebPage",
      "@id": pageId(path, "webpage"),
      url,
      name: page.hero.title,
      description: page.seo.description,
      inLanguage: meta.language,
      isPartOf: { "@id": ids.website },
      about: { "@type": "Thing", name: page.breadcrumbLabel },
      audience: { "@type": "Patient" },
      reviewedBy: { "@id": ids.person },
      lastReviewed: page.reviewedAt,
      breadcrumb: { "@id": pageId(path, "breadcrumb") },
    },
    faqPageNode(page.faq, path),
    {
      "@type": "BreadcrumbList",
      "@id": pageId(path, "breadcrumb"),
      itemListElement: [
        { "@type": "ListItem", position: 1, name: topicPageUi.breadcrumbHome, item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: page.breadcrumbLabel, item: url },
      ],
    },
  )
}
```

- [ ] **Step 4: Components**

`src/components/topic/breadcrumb.tsx`:

```tsx
import Link from "next/link"
import { topicPageUi } from "@/content/site-content"

export function Breadcrumb({ label }: { label: string }) {
  return (
    <nav aria-label={topicPageUi.breadcrumbAriaLabel} style={{ marginBottom: 40 }}>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-cinza)",
        }}
      >
        <li>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            {topicPageUi.breadcrumbHome}
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" style={{ color: "var(--color-oliva)" }}>
          {label}
        </li>
      </ol>
    </nav>
  )
}
```

`src/components/topic/topic-hero.tsx`:

```tsx
import type { TopicPage } from "@/content/site-content"

export function TopicHero({ eyebrow, title, intro }: TopicPage["hero"]) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 56 }}>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-oliva)",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ display: "inline-block", width: 28, height: 1, background: "var(--color-oliva)", flexShrink: 0 }} />
        {eyebrow}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 500,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "var(--color-preto)",
          margin: 0,
          textWrap: "balance",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontSize: "clamp(1.25rem, 1.8vw, 1.45rem)",
          lineHeight: 1.35,
          color: "var(--color-preto)",
          margin: 0,
        }}
      >
        {intro}
      </p>
    </div>
  )
}
```

`src/components/topic/topic-section.tsx`:

```tsx
export function TopicSection({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <section style={{ marginBottom: 48, display: "flex", flexDirection: "column", gap: 14 }}>
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)",
          fontWeight: 500,
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          color: "var(--color-preto)",
          margin: 0,
        }}
      >
        {heading}
      </h2>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.75, color: "var(--color-cinza)", margin: 0 }}
        >
          {p}
        </p>
      ))}
    </section>
  )
}
```

`src/components/topic/topic-cta.tsx`:

```tsx
export function TopicCta({
  label,
  href,
  variant,
  location,
}: {
  label: string
  href: string
  variant: "primary" | "ghost"
  /** data-wa-location value for whatsapp_click tracking */
  location: string
}) {
  const colors =
    variant === "primary"
      ? { background: "var(--color-oliva-light)", color: "var(--color-offwhite)", border: "1px solid var(--color-oliva-light)" }
      : { background: "transparent", color: "var(--color-preto)", border: "1px solid var(--color-preto)" }
  return (
    <div data-wa-location={location} style={{ textAlign: "center", margin: "8px 0 56px" }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          fontFamily: "var(--font-inter)",
          fontSize: 15,
          borderRadius: 999,
          padding: "14px 28px",
          textDecoration: "none",
          ...colors,
        }}
      >
        {label}
      </a>
    </div>
  )
}
```

`src/components/topic/topic-faq.tsx`:

```tsx
"use client"

import { useState } from "react"
import type { TopicPage } from "@/content/site-content"
import { AccordionItem } from "@/components/ui/accordion-item"

export function TopicFaq({ heading, items }: { heading: string; items: TopicPage["faq"] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section style={{ marginTop: 24, marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-oliva)",
          margin: "0 0 24px",
        }}
      >
        {heading}
      </h2>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          isOpen={openId === item.id}
          onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
          analyticsEvent="faq_expand"
          trigger={
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                fontWeight: 500,
                color: "var(--color-preto)",
                lineHeight: 1.3,
              }}
            >
              {item.question}
            </span>
          }
        >
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--color-cinza)",
              margin: 0,
              paddingBottom: 24,
              paddingRight: 32,
            }}
          >
            {item.answer}
          </p>
        </AccordionItem>
      ))}
    </section>
  )
}
```

`src/components/topic/review-line.tsx`:

```tsx
import { brand, topicPageUi } from "@/content/site-content"

// timeZone UTC: reviewedAt is a date-only ISO string; formatting in the build
// machine's zone (e.g. UTC−3) would shift it to the previous day.
const reviewDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" })

export function formatReviewDate(iso: string): string {
  return reviewDate.format(new Date(`${iso}T00:00:00Z`))
}

export function ReviewLine({ reviewedAt }: { reviewedAt: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: 13,
        lineHeight: 1.6,
        color: "var(--color-cinza)",
        borderTop: "1px solid var(--color-linhas)",
        paddingTop: 20,
        margin: "0 0 48px",
      }}
    >
      {topicPageUi.reviewedByLabel} {brand.name} · {brand.crp} ·{" "}
      <time dateTime={reviewedAt}>{formatReviewDate(reviewedAt)}</time>
    </p>
  )
}
```

`src/components/topic/related-topics.tsx`:

```tsx
import Link from "next/link"
import { topicPageUi, type TopicPage } from "@/content/site-content"
import { findTopicPage, isPublished, topicPath } from "@/lib/topics"

export function RelatedTopics({ slugs }: { slugs: string[] }) {
  const pages = slugs
    .map((slug) => findTopicPage(slug))
    .filter((page): page is TopicPage => page !== undefined && isPublished(page))
  if (pages.length === 0) return null

  return (
    <nav aria-label={topicPageUi.relatedHeading} style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-oliva)",
          margin: "0 0 16px",
        }}
      >
        {topicPageUi.relatedHeading}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {pages.map((page) => (
          <li key={page.slug}>
            <Link
              href={topicPath(page)}
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "1.1rem",
                color: "var(--color-preto)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-linhas)",
              }}
            >
              {page.hero.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 5: Route `src/app/[topic]/page.tsx`**

```tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { topicPageUi, topicPages } from "@/content/site-content"
import { Footer } from "@/components/sections/footer"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/topic/breadcrumb"
import { RelatedTopics } from "@/components/topic/related-topics"
import { ReviewLine } from "@/components/topic/review-line"
import { TopicCta } from "@/components/topic/topic-cta"
import { TopicFaq } from "@/components/topic/topic-faq"
import { TopicHero } from "@/components/topic/topic-hero"
import { TopicSection } from "@/components/topic/topic-section"
import { ScrollTracker } from "@/components/ui/scroll-tracker"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"
import { topicGraph } from "@/lib/schema"
import { buildMetadata } from "@/lib/seo"
import { findTopicPage, topicPath } from "@/lib/topics"
import { whatsappHref } from "@/lib/whatsapp"

type Props = { params: Promise<{ topic: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return topicPages.map((page) => ({ topic: page.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findTopicPage((await params).topic)
  if (!page) return {}
  return {
    ...buildMetadata({ title: page.seo.title, description: page.seo.description, path: topicPath(page) }),
    ...(page.status === "draft" ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function TopicRoute({ params }: Props) {
  const page = findTopicPage((await params).topic)
  if (!page) notFound()

  const href = whatsappHref(page.cta.whatsappMessage)
  const leading = page.sections.slice(0, 2)
  const trailing = page.sections.slice(2)

  return (
    <>
      <main data-topic={page.slug}>
        <JsonLd data={topicGraph(page)} />
        <ScrollTracker />
        <article
          style={{
            maxWidth: "68ch",
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 60px) clamp(40px, 6vw, 72px)",
            boxSizing: "content-box",
          }}
        >
          <Breadcrumb label={page.breadcrumbLabel} />
          <TopicHero {...page.hero} />
          {leading.map((section) => (
            <TopicSection key={section.heading} {...section} />
          ))}
          <TopicCta label={page.cta.label} href={href} variant="ghost" location="topic-soft" />
          {trailing.map((section) => (
            <TopicSection key={section.heading} {...section} />
          ))}
          <TopicCta label={page.cta.label} href={href} variant="primary" location="topic-end" />
          <TopicFaq heading={topicPageUi.faqHeading} items={page.faq} />
          <ReviewLine reviewedAt={page.reviewedAt} />
          <RelatedTopics slugs={page.related} />
        </article>
        <Footer />
      </main>
      <WhatsAppFloat href={href} />
    </>
  )
}
```

- [ ] **Step 6: Áreas link (published only)**

In `src/components/sections/areas.tsx` add `import Link from "next/link"` and `import { publishedTopicForArea, topicPath } from "@/lib/topics"`. Inside the map, after `const Icon = …`, add `const topic = publishedTopicForArea(item.id);`. In the body `div`, after the paragraphs map, add:

```tsx
                  {topic && (
                    <Link
                      href={topicPath(topic)}
                      aria-label={`${areas.linkLabel}: ${item.title}`}
                      style={{
                        alignSelf: "flex-start",
                        fontFamily: "var(--font-inter)",
                        fontSize: 14,
                        color: "var(--color-preto)",
                        textDecoration: "none",
                        borderBottom: "1px solid var(--color-preto)",
                        paddingBottom: 2,
                      }}
                    >
                      {areas.linkLabel}
                    </Link>
                  )}
```

- [ ] **Step 7: Verify (including the time-zone case)**

Run: `pnpm exec tsc --noEmit && pnpm lint && TZ=America/Sao_Paulo pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`; the build lists the four slugs as SSG (●). Open `/luto-e-perdas` at 390px and 1280px: single readable column, breadcrumb, two CTAs, FAQ opens, the "Revisado por" line has the right date, the float opens WhatsApp with the luto message. View source: `<meta name="robots" content="noindex, follow">`.

Temporarily set `status: "published"` on `luto-e-perdas` and rebuild. `check:seo` must pass. The page should now appear in `/sitemap.xml` and `/llms.txt`, and the Luto card on `/` should show "Saiba mais". Revert to `"draft"`. Stop server.

- [ ] **Step 8: Commit**

```bash
git add -A src scripts
git commit -m "feat(seo): topic page route with MedicalWebPage, FAQ and breadcrumb schema"
```

---

### Task 8: Privacy page

**Files:**
- Create: `src/app/privacidade/page.tsx`
- Modify: `src/content/site-content.ts` (`privacy`, `footer.legal.privacyLink`)
- Modify: `src/components/sections/footer.tsx` (legal link)
- Modify: `src/app/sitemap.ts`
- Modify: `docs/CONTENT_SOURCE.md` (draft section)
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: `buildMetadata` (T1), `WhatsAppFloat`, `ScrollTracker` (T2), `graph`, `webPageNode`, `JsonLd` (T4), `TopicSection` (T7), `contentUpdatedAt`.
- Produces: indexable `/privacidade` route; `privacy` content object.

- [ ] **Step 1: Add the failing check**

Insert above `// ── run ──`:

```js
// ── privacy page ──
siteChecks.push(async (pages, bodies) => {
  if (!pages.some((p) => p.path === "/privacidade")) fail("/sitemap.xml", "missing /privacidade")
  if (!bodies.get("/")?.includes('href="/privacidade"')) fail("/", "footer has no link to /privacidade")
})
pageChecks.push((path, html) => {
  if (path !== "/privacidade") return
  if (!ldTypes(path, html).has("WebPage")) fail(path, "JSON-LD missing @type WebPage")
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm check:seo`.
Expected: FAIL `missing /privacidade` and `footer has no link to /privacidade`.

- [ ] **Step 3: Content (draft for Ana)**

In `footer.legal` add:

```ts
    privacyLink: { label: "Política de privacidade", href: "/privacidade" },
```

Before `CONTEÚDO COMPLETO` add:

```ts
// ────────────────────────────────────────────────────────────────
// PRIVACIDADE · /privacidade (rascunho para revisão de Ana Julia)
// ────────────────────────────────────────────────────────────────

export const privacy = {
  seo: {
    title: "Política de Privacidade",
    description:
      "Como este site trata dados: estatísticas anônimas de navegação, contato pelo WhatsApp e seus direitos previstos na LGPD.",
  },
  title: "Política de privacidade",
  updatedLabel: "Atualizada em",
  updatedAt: "2026-10-07",
  sections: [
    {
      heading: "Quem é responsável pelos dados",
      paragraphs: [
        "Este site é mantido por Ana Julia Vognach, psicóloga clínica (CRP/SC 12/30269), CNPJ 67.100.449/0001-00, responsável pelo tratamento dos dados descritos nesta página.",
      ],
    },
    {
      heading: "Estatísticas de visita",
      paragraphs: [
        "Para entender como o site é encontrado e utilizado, coletamos estatísticas anônimas de navegação com a ferramenta PostHog, com dados hospedados na União Europeia. Registramos, por exemplo, quais páginas foram visitadas, de onde a visita veio (como uma busca no Google ou um assistente de inteligência artificial) e se um botão de WhatsApp foi clicado.",
        "Essa coleta não usa cookies, não grava a tela nem a sessão de navegação e não identifica quem visita o site. Os dados não são vendidos nem usados para publicidade.",
        "Durante um período de transição, também utilizamos o Google Analytics e o Vercel Analytics. O Google Analytics pode armazenar cookies no seu navegador; você pode bloqueá-los nas configurações do navegador sem prejuízo ao uso do site.",
      ],
    },
    {
      heading: "Avaliações do Google",
      paragraphs: [
        "As avaliações exibidas no site são públicas e vêm do perfil de Ana Julia Vognach no Google. Elas são mostradas como foram publicadas, com o nome que cada pessoa escolheu exibir no Google.",
      ],
    },
    {
      heading: "Contato pelo WhatsApp",
      paragraphs: [
        "Ao clicar em um botão de WhatsApp, você é direcionada(o) ao aplicativo com uma mensagem sugerida, que pode ser editada antes do envio. As conversas acontecem diretamente no WhatsApp, sujeitas à política de privacidade do aplicativo, e são tratadas com o sigilo previsto no Código de Ética Profissional do Psicólogo.",
      ],
    },
    {
      heading: "Seus direitos",
      paragraphs: [
        "Você pode solicitar informações, correção ou exclusão dos seus dados pessoais, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), escrevendo para o e-mail abaixo.",
      ],
    },
  ],
};
```

Mirror the full text into the `DRAFT — revisão Ana Julia` section of `docs/CONTENT_SOURCE.md` under `## Página: Política de privacidade (/privacidade)`.

- [ ] **Step 4: Route `src/app/privacidade/page.tsx`**

```tsx
import type { Metadata } from "next"
import { brand, privacy } from "@/content/site-content"
import { Footer } from "@/components/sections/footer"
import { JsonLd } from "@/components/seo/json-ld"
import { TopicSection } from "@/components/topic/topic-section"
import { formatReviewDate } from "@/components/topic/review-line"
import { ScrollTracker } from "@/components/ui/scroll-tracker"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"
import { graph, webPageNode } from "@/lib/schema"
import { buildMetadata } from "@/lib/seo"

const PATH = "/privacidade"

export const metadata: Metadata = buildMetadata({
  title: privacy.seo.title,
  description: privacy.seo.description,
  path: PATH,
})

export default function PrivacyPage() {
  return (
    <>
      <main>
        <JsonLd data={graph(webPageNode({ path: PATH, name: privacy.title, description: privacy.seo.description }))} />
        <ScrollTracker />
        <article
          style={{
            maxWidth: "68ch",
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 60px) clamp(40px, 6vw, 72px)",
            boxSizing: "content-box",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--color-preto)",
              margin: "0 0 12px",
            }}
          >
            {privacy.title}
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "var(--color-cinza)", margin: "0 0 48px" }}>
            {privacy.updatedLabel} <time dateTime={privacy.updatedAt}>{formatReviewDate(privacy.updatedAt)}</time>
          </p>
          {privacy.sections.map((section) => (
            <TopicSection key={section.heading} {...section} />
          ))}
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 16, margin: 0 }}>
            <a href={`mailto:${brand.contact.email}`} style={{ color: "var(--color-oliva)" }}>
              {brand.contact.email}
            </a>
          </p>
        </article>
        <Footer />
      </main>
      <WhatsAppFloat />
    </>
  )
}
```

- [ ] **Step 5: Footer link + sitemap**

In `footer.tsx`, in the legal bar's left group, after the "Desenvolvido por" `<span>`, add:

```tsx
            <Link
              href={footer.legal.privacyLink.href}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12.5,
                color: "rgba(253,251,247,0.7)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              {footer.legal.privacyLink.label}
            </Link>
```

In `src/app/sitemap.ts`, after the home entry add:

```ts
    { url: absoluteUrl("/privacidade"), lastModified: contentUpdatedAt, changeFrequency: "yearly", priority: 0.3 },
```

- [ ] **Step 6: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`. Check `/privacidade` at 390px. Stop server.

- [ ] **Step 7: Commit**

```bash
git add -A src scripts docs/CONTENT_SOURCE.md
git commit -m "feat: privacy page (draft copy) linked from footer"
```

---

### Task 9: Channel classification

**Files:**
- Create: `src/lib/channel.ts`
- Create: `scripts/check-channel.ts`

**Interfaces:**
- Produces: `type ChannelInput = { utmSource: string | null; referrer: string; selfHost: string }`, `classifyChannel(input: ChannelInput): string`. Returns the lowercased `utm_source`, or one of `organic_search | ai_chatgpt | ai_perplexity | ai_gemini | ai_claude | ai_copilot | instagram | facebook | referral | internal | direct`.

- [ ] **Step 1: Write the failing test `scripts/check-channel.ts`**

```ts
import assert from "node:assert/strict"
import { classifyChannel } from "../src/lib/channel.ts"

const self = "psicoanajulia.com.br"

// [utm_source, referrer, expected]
const cases: [string | null, string, string][] = [
  ["GBP", "", "gbp"],
  ["instagram", "https://www.google.com/", "instagram"],
  ["  ", "https://chatgpt.com/", "ai_chatgpt"],
  ["", "", "direct"],
  [null, "", "direct"],
  [null, "not a url", "direct"],
  [null, "https://www.google.com/", "organic_search"],
  [null, "https://www.google.com.br/", "organic_search"],
  [null, "https://gemini.google.com/app", "ai_gemini"],
  [null, "https://www.bing.com/search?q=x", "organic_search"],
  [null, "https://duckduckgo.com/", "organic_search"],
  [null, "https://br.search.yahoo.com/", "organic_search"],
  [null, "https://www.ecosia.org/", "organic_search"],
  [null, "https://chatgpt.com/", "ai_chatgpt"],
  [null, "https://chat.openai.com/", "ai_chatgpt"],
  [null, "https://www.perplexity.ai/", "ai_perplexity"],
  [null, "https://claude.ai/", "ai_claude"],
  [null, "https://copilot.microsoft.com/", "ai_copilot"],
  [null, "https://l.instagram.com/", "instagram"],
  [null, "https://instagram.com/", "instagram"],
  [null, "https://m.facebook.com/", "facebook"],
  [null, "https://l.facebook.com/", "facebook"],
  [null, "https://notgoogle.com/", "referral"],
  [null, "https://doctoralia.com.br/x", "referral"],
  [null, "https://psicoanajulia.com.br/luto-e-perdas", "internal"],
  [null, "https://www.psicoanajulia.com.br/", "internal"],
]

for (const [utmSource, referrer, expected] of cases) {
  assert.equal(
    classifyChannel({ utmSource, referrer, selfHost: self }),
    expected,
    `utm_source=${JSON.stringify(utmSource)} referrer=${JSON.stringify(referrer)}`,
  )
}
console.log(`check-channel: ${cases.length} cases passed`)
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm check:channel`
Expected: FAIL `Cannot find module '…/src/lib/channel.ts'`.

- [ ] **Step 3: Implement `src/lib/channel.ts`**

```ts
// Erasable TypeScript only and no imports: scripts/check-channel.ts runs this file
// directly with Node's native type stripping.

export type ChannelInput = {
  utmSource: string | null
  referrer: string
  selfHost: string
}

// Order matters: gemini.google.com must win over the generic google.* rule below.
const REFERRER_RULES: { channel: string; domains: string[] }[] = [
  { channel: "ai_gemini", domains: ["gemini.google.com"] },
  { channel: "ai_chatgpt", domains: ["chatgpt.com", "chat.openai.com"] },
  { channel: "ai_perplexity", domains: ["perplexity.ai"] },
  { channel: "ai_claude", domains: ["claude.ai"] },
  { channel: "ai_copilot", domains: ["copilot.microsoft.com"] },
  { channel: "instagram", domains: ["instagram.com"] },
  { channel: "facebook", domains: ["facebook.com"] },
  { channel: "organic_search", domains: ["bing.com", "duckduckgo.com", "search.yahoo.com", "ecosia.org"] },
]

// google.com, google.com.br, www.google.de, …
const GOOGLE_HOST = /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/

const stripWww = (host: string) => host.toLowerCase().replace(/^www\./, "")
const hostIs = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

export function classifyChannel({ utmSource, referrer, selfHost }: ChannelInput): string {
  const utm = utmSource?.trim().toLowerCase()
  if (utm) return utm
  if (!referrer) return "direct"

  let host: string
  try {
    host = stripWww(new URL(referrer).hostname)
  } catch {
    return "direct"
  }

  // A reload or full navigation inside the site: keep it out of "direct".
  if (host === stripWww(selfHost)) return "internal"

  for (const rule of REFERRER_RULES) {
    if (rule.domains.some((domain) => hostIs(host, domain))) return rule.channel
  }
  if (GOOGLE_HOST.test(host)) return "organic_search"
  return "referral"
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm check:channel && pnpm exec tsc --noEmit`
Expected: `check-channel: 26 cases passed`, no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/channel.ts scripts/check-channel.ts
git commit -m "feat(analytics): referrer/UTM channel classification"
```

---

### Task 10: PostHog (Phase A) via the analytics facade

**Files:**
- Modify: `package.json` (add `posthog-js`)
- Modify: `src/lib/analytics.ts`
- Create: `src/components/analytics/analytics-provider.tsx`
- Modify: `src/app/layout.tsx` (mount provider)
- Modify: `next.config.ts` (rewrites, `skipTrailingSlashRedirect`)
- Modify: `.env.local.example`
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: `classifyChannel` (T9).
- Produces: unchanged facade `trackWhatsappClick(location: string)`, `trackFaqExpand(id: string)`, `trackServicesExpand(id: string)`, `trackScroll75()`; new `setAnalyticsClient(client: { capture(event: string, props: Record<string, string>): void }): void`; `<AnalyticsProvider />`.

- [ ] **Step 1: Add the failing check (trailing slash + ingest proxy)**

Insert above `// ── run ──`:

```js
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm check:seo` (current build running).
Expected: FAIL `/ingest/static/array.js: proxy status 404`.

- [ ] **Step 3: Dependency + config**

Run: `pnpm add posthog-js`

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // First-party proxy for PostHog (EU) so ad blockers and CSP don't drop events.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://eu-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://eu.i.posthog.com/:path*" },
    ];
  },
  // PostHog API paths end with "/"; Next must not redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
```

Append to `.env.local.example`:

```
# PostHog (EU) — project API key; analytics is disabled when unset
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxx
```

- [ ] **Step 4: Facade `src/lib/analytics.ts`**

Replace the whole file:

```ts
// Single analytics interface. Phase A: events go to PostHog and GA4 (gtag).
// Phase B removes the gtag branch.

declare const gtag: ((command: string, action: string, params?: Record<string, string>) => void) | undefined

type Props = Record<string, string>
type CaptureClient = { capture: (event: string, props: Props) => void }

const posthogEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
// Events fired before PostHog finishes loading (it loads on idle) are kept here.
const MAX_QUEUE = 50
const queue: [string, Props][] = []
let client: CaptureClient | null = null

export function setAnalyticsClient(next: CaptureClient) {
  client = next
  for (const [event, props] of queue.splice(0)) next.capture(event, props)
}

function pageContext(): Props {
  const props: Props = { page_path: window.location.pathname }
  const topic = document.querySelector("[data-topic]")?.getAttribute("data-topic")
  if (topic) props.topic = topic
  return props
}

function track(event: string, extra: Props = {}) {
  if (typeof window === "undefined") return
  const props = { ...extra, ...pageContext() }
  if (typeof gtag !== "undefined") gtag("event", event, props)
  if (client) client.capture(event, props)
  else if (posthogEnabled && queue.length < MAX_QUEUE) queue.push([event, props])
}

export function trackWhatsappClick(location: string) {
  track("whatsapp_click", { location })
}

export function trackFaqExpand(id: string) {
  track("faq_expand", { id })
}

export function trackServicesExpand(id: string) {
  track("services_expand", { id })
}

export function trackScroll75() {
  track("scroll_75")
}
```

- [ ] **Step 5: Provider `src/components/analytics/analytics-provider.tsx`**

```tsx
"use client"

import { useEffect } from "react"
import { setAnalyticsClient } from "@/lib/analytics"
import { classifyChannel } from "@/lib/channel"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

/** Loads PostHog on idle, after the page is interactive. No-op without a key. */
export function AnalyticsProvider() {
  useEffect(() => {
    if (!POSTHOG_KEY) return
    let cancelled = false

    async function start() {
      const { default: posthog } = await import("posthog-js")
      if (cancelled || !POSTHOG_KEY) return
      const session = {
        channel: classifyChannel({
          utmSource: new URLSearchParams(window.location.search).get("utm_source"),
          referrer: document.referrer,
          selfHost: window.location.hostname,
        }),
        landing_page: window.location.pathname,
      }
      posthog.init(POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://eu.posthog.com",
        persistence: "memory",
        disable_session_recording: true,
        person_profiles: "identified_only",
        capture_pageview: "history_change",
        autocapture: true,
        // Runs before the initial $pageview is sent, so it already carries channel.
        loaded: (ph) => ph.register(session),
      })
      setAnalyticsClient(posthog)
    }

    if ("requestIdleCallback" in window) window.requestIdleCallback(() => void start())
    else setTimeout(() => void start(), 1)

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
```

In `src/app/layout.tsx` import it and render `<AnalyticsProvider />` next to `<WhatsAppClickTracker />`.

- [ ] **Step 6: Verify automated checks (no key)**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm check:channel && pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`. Build output: first-load JS for `/` grows by under ~2 kB (posthog-js is a separate lazy chunk). Stop server.

- [ ] **Step 7: Verify in a browser with a key (Review Focus 5)**

Put a real `NEXT_PUBLIC_POSTHOG_KEY` in `.env.local` (ask the user for it if absent; skip this step and say so if they have none). `pnpm build && pnpm start`. In Chrome DevTools → Network, filter `ingest`:
1. Open `http://localhost:3000/?utm_source=Test`. The first `/ingest/e/` (or `/ingest/i/v0/e/`) request with event `$pageview` has `channel: "test"` and `landing_page: "/"`.
2. Scroll to the bottom: exactly one `scroll_75` with `page_path: "/"` and no `topic`.
3. Go to `/luto-e-perdas` with the address bar (draft, still reachable). Scroll to the bottom: one `scroll_75` with `topic: "luto-e-perdas"`. Expand an FAQ: `faq_expand` with `id` and `topic`. Collapse it: no event.
4. Click the breadcrumb "Início" (client-side navigation). You should see a `$pageview` for `/`. Scroll to the bottom: a new `scroll_75` with `page_path: "/"` and **no** `topic`.
5. Click the floating WhatsApp button: `whatsapp_click` with `location: "float"`.
6. Unset the key, rebuild, reload: no `/ingest` requests and no console errors.

Record the observed events in the commit message body. If step 1's `$pageview` lacks `channel`, move `posthog.register(session)` into a `before_send` hook that merges `session` into `event.properties`, and re-check.

- [ ] **Step 8: Commit**

```bash
git add -A package.json pnpm-lock.yaml next.config.ts .env.local.example src scripts
git commit -m "feat(analytics): PostHog alongside GA via facade, first-party proxy, channel attribution"
```

---

### Task 11: Measurement & off-site runbook

**Files:**
- Create: `docs/MEASUREMENT.md`

**Interfaces:**
- Consumes: event and property names from Tasks 9–10; publishing procedure from Task 6.

- [ ] **Step 1: Write `docs/MEASUREMENT.md`**

```md
# Medição, publicação e checklist externo

## Eventos (PostHog, projeto EU)
| Evento | Propriedades |
|---|---|
| `$pageview` | automático; super-propriedades `channel`, `landing_page` |
| `whatsapp_click` | `location`, `page_path`, `topic` (páginas de tema) |
| `faq_expand` | `id`, `page_path`, `topic` |
| `services_expand` | `id`, `page_path` |
| `scroll_75` | `page_path`, `topic` |

`channel`: valor de `utm_source` (minúsculo) ou `organic_search`, `ai_chatgpt`, `ai_perplexity`, `ai_gemini`, `ai_claude`, `ai_copilot`, `instagram`, `facebook`, `referral`, `internal`, `direct`.

## Dashboard (configurar uma vez no PostHog)
1. Funil: `$pageview` → `scroll_75` → `whatsapp_click`, breakdown por `channel`, janela de conversão 1 dia.
2. Tendência: `whatsapp_click` (total), breakdown por `landing_page`; segunda série com breakdown por `topic`.
3. Tendência: `$pageview` com filtro `channel` começando com `ai_`, breakdown por `channel`.

## Registro de contatos → pacientes (Google Sheet)
Colunas: `data do contato` · `origem` (mensagem do WhatsApp — ex.: "Vi sua página sobre luto…" — ou resposta a "como me encontrou?") · `virou paciente (s/n)` · `data da 1ª sessão`.
Revisão mensal: comparar contagem de linhas por origem com `whatsapp_click` por `channel`/`topic` no mesmo mês.

## Publicar uma página de tema (após aprovação de Ana Julia)
1. Em `src/content/site-content.ts`: `status: "published"`, `reviewedAt` = data da aprovação, `contentUpdatedAt` = hoje.
2. Atualizar `docs/CONTENT_SOURCE.md` (mover o texto para fora da seção DRAFT).
3. `pnpm build && pnpm start` + `pnpm check:seo` sem falhas.
4. Após o deploy: Google Search Console → Inspeção de URL → solicitar indexação; Rich Results Test na URL.

## Migração GA → PostHog
- Fase A (atual): PostHog e GA4 em paralelo por 2–4 semanas. Comparar pageviews e `whatsapp_click` semanais; diferença esperada < 15% (GA usa cookies, PostHog não).
- Fase B: remover GA e Vercel Analytics (plano, Task 12).

## Verificação manual após cada deploy relevante
- Google Rich Results Test: home e uma página de tema publicada → sem erros.
- validator.schema.org: home → sem erros.
- Lighthouse mobile (home e uma página de tema): Performance, SEO, Acessibilidade ≥ 90.
- PostHog → Activity: eventos chegando com `channel`.

## Checklist externo (manual, a qualquer momento)
1. Google Business Profile: categoria principal Psicólogo; lista de serviços; descrição; fotos; posts periódicos; link do site `https://psicoanajulia.com.br/?utm_source=gbp&utm_medium=organic`.
2. Doctoralia e Psicologia Viva (ou equivalente): nome, endereço e telefone idênticos ao site (NAP).
3. Bio do Instagram: `https://psicoanajulia.com.br/?utm_source=instagram&utm_medium=social`.
4. Pedir avaliações no Google a pacientes satisfeitos, dentro da ética do CFP (sem incentivo, sem roteiro).
5. Google Search Console: enviar `sitemap.xml`; solicitar indexação de cada página nova.
6. Bing Webmaster Tools: verificar o site e enviar `sitemap.xml` (alimenta ChatGPT search e Copilot).
```

- [ ] **Step 2: Commit**

```bash
git add docs/MEASUREMENT.md
git commit -m "docs: measurement, publishing and off-site runbook"
```

---

### Task 12: Measurement Phase B — remove GA and Vercel Analytics

> **Do not execute until 2–4 weeks after Task 10 is deployed to production, and only after the user confirms the PostHog numbers look right.** Run this as its own branch and PR.

**Files:**
- Modify: `src/app/layout.tsx` (remove gtag `Script`s, `<Analytics />`, imports)
- Modify: `src/lib/analytics.ts` (remove gtag branch)
- Modify: `package.json` (remove `@vercel/analytics`)
- Modify: `.env.local.example` (remove GA block)
- Modify: `src/content/site-content.ts` + `docs/CONTENT_SOURCE.md` (privacy transition paragraph, `privacy.updatedAt`)
- Modify: `scripts/check-seo.mjs`

**Interfaces:**
- Consumes: facade (T10), privacy content (T8).
- Produces: no GA/Vercel analytics anywhere.

- [ ] **Step 1: Add the failing check**

Insert above `// ── run ──`:

```js
// ── Phase B: no Google Analytics / Vercel Analytics ──
pageChecks.push((path, html) => {
  if (/googletagmanager\.com|gtag\(|_vercel\/insights/.test(html)) fail(path, "GA or Vercel Analytics still present")
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `NEXT_PUBLIC_GA_ID=G-TEST pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: FAIL `GA or Vercel Analytics still present` on every page.

- [ ] **Step 3: Remove**

- `src/app/layout.tsx`: delete `import { Analytics } from "@vercel/analytics/next"`, `import Script from "next/script"`, the `{process.env.NEXT_PUBLIC_GA_ID && (…)}` block and `<Analytics />`.
- `src/lib/analytics.ts`: delete the `declare const gtag` line, the `if (typeof gtag !== "undefined") …` line, and change the header comment to `// Single analytics interface (PostHog).`
- Run: `pnpm remove @vercel/analytics`
- `.env.local.example`: delete the two Google Analytics lines.
- `privacy.sections` "Estatísticas de visita": delete the third paragraph (the transition one). Set `privacy.updatedAt` to today; mirror in `docs/CONTENT_SOURCE.md`.
- `grep -rn "gtag\|GA_ID\|vercel/analytics" src .env.local.example` → no hits.

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm check:channel && NEXT_PUBLIC_GA_ID=G-TEST pnpm build`, `pnpm start` in background, `pnpm check:seo`.
Expected: `0 failure(s)`. Remind the user to delete `NEXT_PUBLIC_GA_ID` in Vercel project settings.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(analytics): remove GA4 and Vercel Analytics (Phase B)"
```
