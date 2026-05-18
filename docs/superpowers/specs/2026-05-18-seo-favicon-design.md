# SEO Improvements & Favicon — Design Spec

**Date:** 2026-05-18
**Project:** Ana Julia Vognach — Clinical Psychologist Landing Page
**Status:** Approved

---

## Scope

Five independent improvements to be delivered on a dedicated branch (`feat/seo-favicon`):

1. Favicon set
2. Metadata & canonicalization
3. JSON-LD structured data
4. sitemap.xml + robots.txt
5. OG image for social sharing

---

## Context

- **Domain:** `psicoanajulia.com.br`
- **Google Business Profile:** `https://maps.app.goo.gl/yx6VRRiSPBZc5SBH7?g_st=iw`
- **Target audience:** Portuguese-speaking Brazilians, local SEO focus on Florianópolis / Sul da Ilha
- **Current gaps:** no canonical, no sitemap, no robots.txt, no structured data, no OG image, no proper favicon set

---

## 1. Favicon Set

**Goal:** Replace the default `src/app/favicon.ico` with a complete, branded icon set matching the nav logo.

**Design:** Greek letter Ψ (Psi) centered inside a circle border. Stroke and text color: `#6B7C5C` (oliva). Background: `#F5F2ED` (offwhite). Font: Playfair Display.

**Files to create:**

| File | Size | Format | Purpose |
|------|------|--------|---------|
| `/public/favicon.svg` | — | SVG | Primary favicon for modern browsers |
| `/public/favicon-32x32.png` | 32×32 | PNG | Fallback for older browsers |
| `/public/favicon-16x16.png` | 16×16 | PNG | Fallback small size |
| `/public/apple-touch-icon.png` | 180×180 | PNG | iOS home screen bookmark |
| `/public/site.webmanifest` | — | JSON | Web app manifest |

**`site.webmanifest` content:**
```json
{
  "name": "Ana Julia Vognach | Psicóloga Clínica",
  "short_name": "Ana Julia",
  "icons": [
    { "src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ],
  "theme_color": "#6B7C5C",
  "background_color": "#F5F2ED",
  "display": "browser"
}
```

**`layout.tsx` metadata update — `icons` field:**
```ts
icons: {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
  ],
  apple: "/apple-touch-icon.png",
  other: { rel: "manifest", url: "/site.webmanifest" },
},
```

**SVG structure:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#F5F2ED"/>
  <circle cx="50" cy="50" r="44" fill="none" stroke="#6B7C5C" stroke-width="2"/>
  <text x="50" y="66" text-anchor="middle" font-family="serif"
        font-size="48" fill="#6B7C5C">Ψ</text>
</svg>
```

The PNG files are generated from the SVG using a Node.js script (sharp or canvas) run once at setup, then committed as static assets.

---

## 2. Metadata & Canonicalization

**File:** `src/app/layout.tsx`

**Changes to the `metadata` export:**

```ts
metadataBase: new URL("https://psicoanajulia.com.br"),

alternates: {
  canonical: "/",
},

twitter: {
  card: "summary_large_image",
  title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
  description: "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
},
```

The existing `openGraph` block gets `url: "https://psicoanajulia.com.br"` and `images` pointing to the OG image (see Section 5).

No other metadata changes — existing title, description, keywords, and robots stay as-is.

---

## 3. JSON-LD Structured Data

**File:** `src/app/layout.tsx`

Added as an inline `<script type="application/ld+json">` in the `<head>` via Next.js.

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Psychologist",
  "name": "Ana Julia Vognach",
  "inLanguage": "pt-BR",
  "description": "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
  "url": "https://psicoanajulia.com.br",
  "telephone": "+5551982831876",
  "priceRange": "$$",
  "hasCredential": "CRP/SC 12/30269",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Florianópolis",
    "addressRegion": "SC",
    "addressCountry": "BR"
  },
  "areaServed": [
    "Florianópolis",
    "Sul da Ilha",
    "Campeche"
  ],
  "knowsAbout": [
    "burnout",
    "maternidade",
    "luto",
    "saúde mental no trabalho",
    "psicoterapia para adultos",
    "psicologia sistêmica"
  ],
  "sameAs": [
    "https://maps.app.goo.gl/yx6VRRiSPBZc5SBH7?g_st=iw"
  ]
}
```

**Key decisions:**
- `@type: "Psychologist"` — schema.org type names are always English (spec requirement, invisible to users)
- `inLanguage: "pt-BR"` — explicitly signals content language to Google
- All values in Portuguese — description, areas, topics
- `sameAs` links to Google Business Profile — primary local ranking signal

---

## 4. sitemap.xml + robots.txt

**Files:** `src/app/sitemap.ts` and `src/app/robots.ts`

Next.js App Router serves these at `/sitemap.xml` and `/robots.txt` automatically at build time.

**`sitemap.ts`:**
```ts
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://psicoanajulia.com.br",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ]
}
```

**`robots.ts`:**
```ts
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://psicoanajulia.com.br/sitemap.xml",
  }
}
```

---

## 5. OG Image (Social Sharing)

**File:** `src/app/opengraph-image.tsx`

Next.js `ImageResponse` generates a 1200×630 image served at `/opengraph-image`. Referenced in `openGraph.images` in `layout.tsx`.

**Photo used:** `IMG_8209.jpg` (from `/public/fotos/`)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  [Photo — left half,    │  [offwhite background]   │
│   portrait crop]        │                           │
│                         │  psicóloga clínica  ←italic olive│
│                         │                           │
│                         │  Ana Julia          ←large Playfair│
│                         │  Vognach                  │
│                         │                           │
│                         │  ────────────────         │
│                         │                           │
│                         │  Psicoterapia para        │
│                         │  adultos em               │
│                         │  Florianópolis            │
│                         │                           │
│                         │  psicoanajulia.com.br ←small│
└────────────────────────────────────────────────────┘
```

**Colors:** offwhite `#F5F2ED` background, oliva `#6B7C5C` for kicker and URL, preto `#1A1A18` for name, cinza `#6B6B6B` for tagline.

**`layout.tsx` openGraph update:**
```ts
openGraph: {
  ...existing fields,
  url: "https://psicoanajulia.com.br",
  images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
},
```

---

## Out of Scope

- No blog, CMS, or additional pages
- No `FAQPage` schema (marginal benefit given GBP already exists)
- No `hreflang` (site is pt-BR only)
- Google Search Console submission — manual step after deployment, not code

---

## Post-Launch Manual Steps

1. Submit `https://psicoanajulia.com.br/sitemap.xml` to Google Search Console
2. Verify the site in Google Search Console (DNS TXT record or HTML file method)
3. Request indexing for the homepage URL in Search Console
