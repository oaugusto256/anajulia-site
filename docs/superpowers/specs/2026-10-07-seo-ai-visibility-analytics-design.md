# SEO, AI Visibility & Measurement — Design Spec

**Date:** 2026-10-07
**Project:** Ana Julia Vognach — Clinical Psychologist Website
**Status:** Approved in conversation — pending written-spec review
**Supersedes (partially):** `2026-05-18-seo-favicon-design.md` §2–§4 (metadata, JSON-LD, sitemap/robots)

---

## 1. Intent

**Goal:** Increase how often the site is found and chosen — in Google (organic + local pack + AI Overviews) and in AI assistants (ChatGPT, Claude, Gemini, Perplexity) — and **prove** that this produces new patients, not just traffic.

**Success criteria**
- Every indexable URL has: one `h1`, semantic `h2/h3` outline, canonical, unique title/description, valid JSON-LD.
- Four topic pages live (after Ana Julia's copy approval), each targeting one área de atuação.
- Structured data validates in Google Rich Results Test with no errors.
- AI search/retrieval crawlers explicitly allowed; `/llms.txt` served.
- Lighthouse mobile ≥ 90 (performance, SEO, accessibility) on home and topic pages.
- PostHog reports `whatsapp_click` segmented by channel (incl. AI assistants) and landing page.
- A lead log connects WhatsApp conversations to new patients by source, reviewed monthly.

**Constraints**
- All copy lives in `src/content/site-content.ts` (and `CONTENT_SOURCE.md`). No hardcoded strings in components.
- New copy (topic pages, privacy page, link labels, WhatsApp messages) is **drafted by Claude and must be approved by Ana Julia** before publishing. This is an explicit, scoped exception to the "never invent copy" rule.
- Health content (YMYL) and CFP advertising rules (Resolução CFP 01/2023): no outcome promises, no diagnosis claims, no testimonials used as promotion inside page copy.
- Minimal JS, no visual redesign. Heading changes are markup-only.
- Stack note: project runs **Next.js 16.3.1** (CLAUDE.md says 15). Verify App Router APIs (`generateStaticParams`, `generateMetadata`, `robots`, `sitemap`, route handlers) against Next 16 docs before implementing.

---

## 2. Current state (audit, 2026-10-07)

| Area | Finding |
|---|---|
| Headings | Only `h1` (hero) and two `h2` (approach, about). Services, Areas, FAQ, Testimonials, Mission titles are `<p>`/`<span>`. FAQ questions are `<span>` inside buttons. About uses `h4` under `h2`. |
| Metadata | Title/description/OG hardcoded in `layout.tsx`; diverges from `meta` in `site-content.ts`. |
| JSON-LD | Single `Psychologist` node; no image, email, street address, hours, Person entity, services, WebSite, or FAQPage. |
| Pages | One URL competing for burnout, maternidade, luto, psico-oncologia. |
| Location | City only; no street address despite presencial attendance. |
| AI crawlers | robots allows `*`; no explicit policy; no `llms.txt`. |
| Sitemap | `lastModified: new Date()` changes on every build. |
| Analytics | GA4 via gtag + Vercel Analytics. `accordion-item.tsx` calls `gtag` directly, bypassing `src/lib/analytics.ts`. No channel attribution, no link from click to patient. |
| Good | Accordion content is in the DOM when collapsed (crawlable); SSR; canonical; OG image; GBP link. |

---

## 3. Foundation fixes (home page)

### 3.1 Metadata single source
- New `src/lib/seo.ts`:
  - `SITE_URL = "https://psicoanajulia.com.br"`
  - `buildMetadata({ title, description, path, image? }): Metadata` — sets `alternates.canonical`, `openGraph` (url, title, description, `siteName`, `locale: "pt_BR"`, `type: "website"`, image), `twitter` (`summary_large_image`).
- `meta` in `site-content.ts` becomes the source of all metadata strings. The current live values from `layout.tsx` become canonical:
  - title: `Psicóloga Online e Presencial em Florianópolis | Ana Julia Vognach`
  - description: `Psicoterapia online para o Brasil e exterior, e presencial em Florianópolis. Apoio especializado em transições de vida, saúde mental, luto e maternidade.`
- Root layout: `title: { default: meta.title, template: "%s | Ana Julia Vognach" }`.
- `keywords` removed from the home metadata (ignored by Google). `meta.keywords` may remain in content as reference.

### 3.2 Semantic headings (markup-only, zero visual change)
Swap tags, keep existing classes/inline styles:

| Element | Today | New |
|---|---|---|
| Hero title | `h1` | `h1` (unchanged) |
| Section titles acting as eyebrows — Services, Areas, Testimonials, FAQ, Mission | `p` / `span` | `h2` |
| Service item titles, área item titles | `span` | `h3` |
| FAQ question | `span` inside `button` | `<h3><button>…</button></h3>` (WAI-ARIA accordion pattern) |
| About trajectory subtitle | `h4` | `h3` |

`AccordionItem` gains an optional `headingLevel` prop (default `3`) that wraps the trigger button in the heading element. Heading elements must reset browser default margins/font so visuals are unchanged.

### 3.3 Internal links
Each Áreas card gets a subtle text link to its topic page (label from `areas.linkLabel`, drafted copy, e.g. "Saiba mais"). Uses existing text-link styling. Rendered only when the matching topic page is `published`.

### 3.4 Sitemap
- `site-content.ts` exports `contentUpdatedAt: string` (ISO date), updated manually on content changes.
- `sitemap.ts` lists home + each **published** topic page + `/privacidade`. Home and privacy use `contentUpdatedAt`; topic pages use their `reviewedAt`.

### 3.5 Location
Add to `brand`:

```ts
location: {
  streetAddress: "Rodovia SC-405, 4397",
  complement: "Shopping Oka Floripa, Torre Sol, Sala 114",
  neighborhood: "Campeche",
  city: "Florianópolis",
  region: "SC",
  postalCode: "88065-000",
  country: "BR",
  geo: undefined as { lat: number; lng: number } | undefined, // fill from GBP when available; omitted from schema while undefined
  hours: [{ days: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "20:00" }],
  hoursLabel: "Segunda a sexta, 8h às 20h",
  gbpUrl: "https://maps.app.goo.gl/yx6VRRiSPBZc5SBH7?g_st=iw",
}
```

Footer renders an `<address>` block (street, complement, bairro/cidade/UF, CEP) and the hours label. The street string must match the Google Business Profile exactly; verify against GBP during implementation.

### 3.6 Shared component fixes required by multi-page
- Nav, nav drawer, and footer anchor links change from `#x` to `/#x` (content-level change in `site-content.ts`).
- `WhatsAppFloat` moves from `layout.tsx` into each page and accepts an `href` prop, so topic pages can pass a source-aware message.

---

## 4. Structured data

### 4.1 Module
- `src/lib/schema.ts`: pure builder functions reading from `site-content.ts`. No copy literals other than schema vocabulary.
- `src/components/seo/json-ld.tsx`: server component `<JsonLd data={object} />` rendering `<script type="application/ld+json">` with `JSON.stringify` and `<` escaped as `<`.

### 4.2 Global graph (root layout)
One `@graph` with stable `@id`s under `SITE_URL`:

- **`#person` — `Person`**
  - `name`, `jobTitle: "Psicóloga Clínica"`, `image` (absolute hero photo URL), `url`
  - `hasCredential`: `EducationalOccupationalCredential` for CRP/SC 12/30269 (`credentialCategory: "license"`, `recognizedBy: Conselho Regional de Psicologia – 12ª Região`) and the Oncology Multiprofessional Residency (`credentialCategory: "residency"`)
  - `knowsAbout`: all áreas + psicoterapia individual/casal/familiar/grupo + psicologia sistêmica
  - `sameAs`: Instagram, GBP
  - `worksFor`: `{ "@id": "#practice" }`
- **`#practice` — `Psychologist`**
  - `name`, `url`, `image`, `telephone`, `email`, `priceRange: "$$"`
  - `address`: `PostalAddress` from `brand.location` (`streetAddress` = street + " — " + complement)
  - `geo` only if defined
  - `openingHoursSpecification` from `brand.location.hours`
  - `areaServed`: `City` Florianópolis, `Place` Sul da Ilha, `Place` Campeche, `Country` Brasil
  - `founder`: `{ "@id": "#person" }`
  - `hasOfferCatalog`: `OfferCatalog` with 4 `Offer` → `Service` (Individual, Casal, Familiar, Grupo; names/descriptions from `services.items`), each with `availableChannel` (online + presencial)
  - `sameAs`: GBP, Instagram
- **`#website` — `WebSite`**: `name`, `url`, `inLanguage: "pt-BR"`, `publisher: { "@id": "#person" }`

### 4.3 Per-page
- **Home:** `WebPage` (`about: #practice`, `isPartOf: #website`) + `FAQPage` from `faq.items`.
- **Topic page:** `MedicalWebPage` (`about` topic name, `audience: Patient`, `reviewedBy: #person`, `lastReviewed: reviewedAt`, `isPartOf: #website`) + `FAQPage` from the page's FAQ + `BreadcrumbList` (Início → topic).
- **Privacy:** `WebPage` only.

### 4.4 Excluded
- `aggregateRating` / `Review` from Google Places: self-serving review markup is ignored by Google for LocalBusiness. Visual testimonials remain.
- `MedicalBusiness`: `Psychologist` is already the specific subtype.

---

## 5. AI search visibility

### 5.1 robots.ts
- `userAgent: "*"`, `allow: "/"`.
- Explicit allow rules for search/retrieval agents: `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Googlebot`, `Bingbot`.
- Training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`) allowed (covered by `*`). Code comment documents how to disallow them.
- `sitemap: ${SITE_URL}/sitemap.xml`.

### 5.2 /llms.txt
- `src/app/llms.txt/route.ts`, statically generated (`dynamic = "force-static"`), `Content-Type: text/plain; charset=utf-8`.
- Markdown generated from `site-content.ts`: H1 name; blockquote summary (who, CRP, online + presencial, address, hours); "Áreas de atuação" with links to **published** topic pages; "Serviços"; "Perguntas frequentes" (Q + A); "Agendamento" (WhatsApp link, email).

### 5.3 Copy patterns for citation (rules for topic-page drafts)
- Each section opens with a direct 1–2 sentence answer.
- Concrete facts in plain text: CRP, residency, "online para todo o Brasil e exterior", address, how sessions work.
- Question-style `h2` matching real queries (e.g. "Como saber se estou com burnout?").
- Visible review line: "Revisado por Ana Julia Vognach · CRP/SC 12/30269 · {data}".
- CFP-compliant: no promises of cure/results, no diagnosis by reading, no comparative claims.

### 5.4 Off-site checklist (manual, not code)
1. Google Business Profile: primary category Psicólogo, services list, description, photos, periodic posts, website link with `?utm_source=gbp&utm_medium=organic`.
2. Doctoralia and Psicologia Viva (or equivalent) profiles with identical name, address, phone (NAP).
3. Instagram bio link with `?utm_source=instagram&utm_medium=social`.
4. Ask satisfied patients for Google reviews (within CFP ethics).
5. Google Search Console: submit sitemap, request indexing of each new page.
6. Bing Webmaster Tools: verify site, submit sitemap (feeds ChatGPT search / Copilot).

---

## 6. Topic pages

### 6.1 Route
- `src/app/[topic]/page.tsx`, `generateStaticParams` from `topicPages` (all statuses), `dynamicParams = false`.
- `generateMetadata` via `buildMetadata` with `seo.title` / `seo.description`; `robots: { index: false, follow: true }` when `status === "draft"`.

### 6.2 Content model (`site-content.ts`)

```ts
export type TopicPage = {
  slug: string;
  areaId: string; // matches areas.items[].id
  status: "draft" | "published";
  seo: { title: string; description: string };
  breadcrumbLabel: string;
  hero: { eyebrow: string; title: string; intro: string };
  sections: { heading: string; paragraphs: string[] }[];
  faq: { id: string; question: string; answer: string }[];
  cta: { label: string; whatsappMessage: string };
  reviewedAt: string; // ISO date
  related: string[]; // slugs
};

export const topicPages: TopicPage[] = [/* 4 pages */];
export const topicPageUi = {
  breadcrumbHome: string,
  reviewedByLabel: string, // "Revisado por"
  relatedHeading: string,  // "Outras áreas"
  faqHeading: string,
};
```

WhatsApp `href` is derived from `cta.whatsappMessage` with a helper `whatsappHref(message)` in `src/lib/whatsapp.ts` (uses `brand.contact.whatsapp.raw`, `encodeURIComponent`).

### 6.3 Pages and slugs

| Slug | areaId | Topic |
|---|---|---|
| `burnout-saude-mental-trabalho` | `clinica-do-trabalho` | Saúde mental e trabalho, burnout |
| `maternidade-parentalidade` | `psicoterapia-maes` | Maternidade, parentalidade e família |
| `luto-e-perdas` | `luto-transicoes` | Luto e perdas |
| `psico-oncologia-cuidados-paliativos` | `psico-oncologia` | Psico-oncologia e cuidados paliativos |

### 6.4 Draft gate
`status: "draft"` → page builds and is reachable by URL (for review on Vercel preview), but: `noindex`, excluded from sitemap and `llms.txt`, no link from home Áreas, not in other pages' `related`. `published` enables all.

### 6.5 Layout (existing tokens/components only)
1. `Nav`
2. Breadcrumb (`nav aria-label="breadcrumb"`, small caps style): Início › {breadcrumbLabel}
3. Text hero: eyebrow, `h1` title, intro in Cormorant italic lead style
4. Sections: `h2` + paragraphs, reading width ~68ch
5. Soft CTA block (ghost button) after section 2; primary CTA at end
6. FAQ (`AccordionItem`, `h3` triggers, `faq_expand` tracking)
7. Review line (Revisado por …)
8. Related topics (published only)
9. `Footer`, `WhatsAppFloat` with the page's message

Root element carries `data-topic={slug}` for analytics.

### 6.6 Copy drafting workflow
- Claude drafts 4 pages, pt-BR, ~800–1200 words each, based on existing área copy, approach, and FAQ tone; following §5.3.
- Drafts are written to `CONTENT_SOURCE.md` under "DRAFT — revisão Ana Julia" and mirrored into `site-content.ts` with `status: "draft"`.
- Also drafted for review: `areas.linkLabel`, `topicPageUi` labels, per-page WhatsApp messages (pattern: "Olá, Ana Julia. Vi sua página sobre {tema} e gostaria de agendar uma conversa inicial."), privacy page.
- Publishing = Ana's approval → flip `status`, set `reviewedAt`, bump `contentUpdatedAt`.

---

## 7. Measurement (PostHog replaces GA)

### 7.1 Analytics facade
- `src/lib/analytics.ts` remains the only interface. Signatures:
  - `trackWhatsappClick(location: string)`
  - `trackFaqExpand(id: string)`
  - `trackServicesExpand(id: string)`
  - `trackScroll75()`
- Each adds `page_path` and `topic` (from closest `[data-topic]` or `document.body` context) automatically.
- During Phase A, events fan out to PostHog and gtag; Phase B removes gtag.
- `accordion-item.tsx` direct `gtag` call replaced with facade calls.

### 7.2 PostHog client
- Dependency: `posthog-js`.
- `src/components/analytics/analytics-provider.tsx` (client): when `NEXT_PUBLIC_POSTHOG_KEY` is set, `requestIdleCallback` (fallback `setTimeout`) → `import("posthog-js")` → `init`. No-op otherwise. Events fired before init are queued in-module and flushed after init.
- Config:
  ```ts
  {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    persistence: "memory",
    disable_session_recording: true,
    person_profiles: "identified_only",
    capture_pageview: "history_change",
    autocapture: true,
  }
  ```
- `identify()` is never called. No form inputs exist; if added later, they must be excluded from autocapture.
- `next.config.ts` rewrites: `/ingest/static/:path*` → `https://eu-assets.i.posthog.com/static/:path*`, `/ingest/:path*` → `https://eu.i.posthog.com/:path*`; `skipTrailingSlashRedirect: true`.

### 7.3 Channel attribution
- `src/lib/channel.ts`: pure `classifyChannel({ utmSource, referrer, selfHost }): string`.
  1. `utm_source` present → its value (lowercased).
  2. Referrer host (excluding self):
     - `google.*`, `bing.com`, `duckduckgo.com`, `search.yahoo.com`, `ecosia.org` → `organic_search`
     - `chatgpt.com`, `chat.openai.com` → `ai_chatgpt`
     - `perplexity.ai` → `ai_perplexity`
     - `gemini.google.com` → `ai_gemini` (checked before `google.*`)
     - `claude.ai` → `ai_claude`
     - `copilot.microsoft.com` → `ai_copilot`
     - `instagram.com`, `l.instagram.com` → `instagram`
     - `facebook.com`, `l.facebook.com`, `m.facebook.com` → `facebook`
     - any other → `referral`
  3. No referrer → `direct`.
- On init: `posthog.register({ channel, landing_page })` (super properties for the session).

### 7.4 Events
Existing names kept for continuity: `whatsapp_click` {location, page_path, topic}, `faq_expand` {id, page_path, topic}, `services_expand` {id, page_path}, `scroll_75` {page_path, topic}. Plus PostHog `$pageview` and autocapture.

### 7.5 PostHog dashboard (manual setup, documented)
- Funnel: `$pageview` → `scroll_75` → `whatsapp_click`, breakdown `channel`.
- Trend: `whatsapp_click` by `landing_page` and by `topic`.
- Trend: `$pageview` where `channel` starts with `ai_`.

### 7.6 Lead → patient log (manual)
Google Sheet columns: data do contato · origem (from source-aware WhatsApp message or "como me encontrou?") · virou paciente (s/n) · data da 1ª sessão. Reviewed monthly against PostHog `whatsapp_click` by channel/topic.

### 7.7 Migration
- **Phase A:** ship PostHog alongside GA; run 2–4 weeks; compare pageviews/click counts.
- **Phase B:** remove gtag `Script`s, `NEXT_PUBLIC_GA_ID` (code + `.env.local.example`), `@vercel/analytics` and `<Analytics />`.

### 7.8 Privacy page
- Route `/privacidade`, copy in `site-content.ts` (`privacy`), drafted by Claude, reviewed by Ana.
- Covers: anonymous cookieless analytics via PostHog (EU), no session recording, Google reviews display, WhatsApp contact, data controller (Ana Julia Vognach, CNPJ from footer), contact email for LGPD requests.
- Linked from the footer legal line. Indexable. `WebPage` schema.

---

## 8. File map

| File | Change |
|---|---|
| `src/content/site-content.ts` | `meta` reconciled; `brand.location`; `contentUpdatedAt`; `areas.linkLabel`; `TopicPage` type, `topicPages`, `topicPageUi`; `privacy`; nav/footer anchors `/#x` |
| `CONTENT_SOURCE.md` | Draft section for new copy |
| `src/lib/seo.ts` | new — `SITE_URL`, `buildMetadata` |
| `src/lib/schema.ts` | new — graph + per-page builders |
| `src/lib/whatsapp.ts` | new — `whatsappHref(message)` |
| `src/lib/channel.ts` | new — `classifyChannel` |
| `src/lib/analytics.ts` | PostHog + gtag fan-out, context props |
| `src/components/seo/json-ld.tsx` | new |
| `src/components/analytics/analytics-provider.tsx` | new |
| `src/components/ui/accordion-item.tsx` | heading wrapper, facade tracking |
| `src/components/ui/whatsapp-float.tsx` | `href` prop |
| `src/components/sections/{services,areas,faq,testimonials,mission,about,footer}.tsx` | heading tags; area links; footer address + privacy link |
| `src/components/topic/*` | new — breadcrumb, topic hero, topic section, review line, related |
| `src/app/layout.tsx` | metadata via `buildMetadata`, global graph, provider, float removed, (Phase B) GA/Vercel removed |
| `src/app/page.tsx` | home WebPage + FAQPage JSON-LD, `WhatsAppFloat` |
| `src/app/[topic]/page.tsx` | new |
| `src/app/privacidade/page.tsx` | new |
| `src/app/llms.txt/route.ts` | new |
| `src/app/robots.ts`, `src/app/sitemap.ts` | updated |
| `next.config.ts` | PostHog rewrites |
| `scripts/check-seo.mjs` | new — verification |
| `.env.local.example` | `NEXT_PUBLIC_POSTHOG_KEY`; (Phase B) GA removed |

---

## 9. Verification

`scripts/check-seo.mjs` (Node, no dependencies), run against `pnpm build && pnpm start`, `BASE_URL` default `http://localhost:3000`. Exits non-zero on failure.

For every URL in `/sitemap.xml` plus every draft slug:
- HTTP 200
- exactly one `<h1>`
- `<link rel="canonical">` equals `SITE_URL + path`
- every `application/ld+json` block parses; expected `@type`s present (home: `Person`, `Psychologist`, `WebSite`, `WebPage`, `FAQPage`; topic: `MedicalWebPage`, `FAQPage`, `BreadcrumbList`)
- `<title>` ≤ 60 chars, meta description ≤ 160 chars
- drafts: `noindex` present and URL absent from sitemap; published: no `noindex`

Also: `/robots.txt` 200 and contains `OAI-SearchBot`; `/llms.txt` 200, `text/plain`, contains no draft slugs; unknown slug returns 404.

Unit-level: `scripts/check-channel.ts` imports `src/lib/channel.ts` directly (Node 24 native type stripping; `channel.ts` must use only erasable TS syntax and relative-free, dependency-free code) and asserts every mapping in §7.3, including `gemini.google.com` → `ai_gemini` precedence over `google.*`. Run with `node scripts/check-channel.ts`.

Manual after deploy: Google Rich Results Test (home + one topic page), Schema.org validator, Lighthouse mobile ≥ 90, PostHog live events showing `channel`, GSC + Bing sitemap submission.

---

## 10. Phasing

1. **Foundation** — seo.ts, metadata, headings, location, anchors, float prop, sitemap/robots, llms.txt, JSON-LD graph, verification script.
2. **Topic pages** — route, components, drafted copy as `draft`, area links (hidden until published), privacy page.
3. **Measurement Phase A** — PostHog provider, rewrites, channel, facade fan-out.
4. **Content approval** — Ana reviews drafts; publish.
5. **Measurement Phase B** — remove GA and Vercel Analytics (2–4 weeks after phase 3).
6. **Off-site checklist** — manual, any time after phase 1.

## 11. Out of scope
- Blog / MDX / CMS.
- English or other locales (`hreflang`).
- Session replay, A/B testing, feature flags.
- Consent banner (cookieless design avoids it).
- Google Ads conversion import.
- Visual redesign of existing sections.
