# SEO Improvements & Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete favicon set, structured data, sitemap, robots.txt, canonicalization, and OG social image to the Ana Julia Vognach landing page.

**Architecture:** All changes live in `src/app/` (Next.js App Router conventions) and `public/`. Metadata is centralized in `layout.tsx`. PNG favicons are generated once via a Node script using `sharp` (already a Next.js transitive dependency) and committed as static assets. The OG image is generated at build time via `src/app/opengraph-image.tsx` using Next.js `ImageResponse` with Node.js runtime so it can read the local photo via `fs`.

**Tech Stack:** Next.js 16 App Router, TypeScript, sharp (PNG generation), next/og (ImageResponse), schema.org JSON-LD.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `public/favicon.svg` | Create | SVG favicon — primary for modern browsers |
| `public/favicon-32x32.png` | Generate | PNG fallback, committed as static asset |
| `public/favicon-16x16.png` | Generate | PNG fallback, committed as static asset |
| `public/apple-touch-icon.png` | Generate | iOS home screen bookmark (180×180) |
| `public/site.webmanifest` | Create | Web app manifest |
| `scripts/generate-favicons.mjs` | Create | One-time PNG generation script (not shipped) |
| `src/app/layout.tsx` | Modify | metadataBase, canonical, twitter, icons, JSON-LD |
| `src/app/sitemap.ts` | Create | Serves `/sitemap.xml` |
| `src/app/robots.ts` | Create | Serves `/robots.txt` |
| `src/app/opengraph-image.tsx` | Create | Serves `/opengraph-image` at 1200×630 |

---

## Task 1: Create feature branch

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout -b feat/seo-favicon
```

Expected output: `Switched to a new branch 'feat/seo-favicon'`

---

## Task 2: Create SVG favicon

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Create the SVG file**

Create `public/favicon.svg` with this exact content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#F5F2ED"/>
  <circle cx="50" cy="50" r="44" fill="none" stroke="#6B7C5C" stroke-width="2"/>
  <text
    x="50"
    y="67"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="50"
    fill="#6B7C5C"
  >Ψ</text>
</svg>
```

- [ ] **Step 2: Verify the SVG renders correctly**

Open `public/favicon.svg` in a browser (drag and drop the file). You should see a white/offwhite square with an olive circle border and the Greek letter Ψ centered inside. If the Ψ appears clipped or misaligned, adjust the `y` attribute (try values between 63–70).

---

## Task 3: Generate PNG favicons

**Files:**
- Create: `scripts/generate-favicons.mjs`
- Generate: `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`

- [ ] **Step 1: Create the generator script**

Create `scripts/generate-favicons.mjs`:

```js
import sharp from "sharp"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const svg = readFileSync(resolve(root, "public/favicon.svg"))

await Promise.all([
  sharp(svg).resize(16, 16).png().toFile(resolve(root, "public/favicon-16x16.png")),
  sharp(svg).resize(32, 32).png().toFile(resolve(root, "public/favicon-32x32.png")),
  sharp(svg).resize(180, 180).png().toFile(resolve(root, "public/apple-touch-icon.png")),
])

console.log("Favicons generated: 16x16, 32x32, apple-touch-icon (180x180)")
```

- [ ] **Step 2: Add the script to package.json**

In `package.json`, add to the `"scripts"` block:

```json
"generate-favicons": "node scripts/generate-favicons.mjs"
```

- [ ] **Step 3: Run the generator**

```bash
npm run generate-favicons
```

Expected output:
```
Favicons generated: 16x16, 32x32, apple-touch-icon (180x180)
```

If you see `Error: Input file is missing`, verify the path to `public/favicon.svg` is correct. If you see SVG-related errors, make sure the SVG file is valid (no syntax errors).

- [ ] **Step 4: Verify the PNG files exist**

```bash
ls -lh public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png
```

Expected: Three files, each a few KB.

- [ ] **Step 5: Commit**

```bash
git add public/favicon.svg public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png scripts/generate-favicons.mjs package.json
git commit -m "feat: add favicon SVG and generate PNG variants"
```

---

## Task 4: Create web manifest

**Files:**
- Create: `public/site.webmanifest`

- [ ] **Step 1: Create the manifest file**

Create `public/site.webmanifest`:

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

- [ ] **Step 2: Commit**

```bash
git add public/site.webmanifest
git commit -m "feat: add web app manifest"
```

---

## Task 5: Update layout.tsx metadata

**Files:**
- Modify: `src/app/layout.tsx`

The current `metadata` export in `src/app/layout.tsx` (lines 29–53) has no `metadataBase`, no `canonical`, no `twitter` card, and no `icons`. This task adds all four.

- [ ] **Step 1: Replace the metadata export**

In `src/app/layout.tsx`, replace the entire `export const metadata: Metadata = { ... }` block (lines 29–53) with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://psicoanajulia.com.br"),
  title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
  description:
    "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
  keywords: [
    "psicóloga florianópolis",
    "psicóloga campeche",
    "saúde mental e trabalho",
    "psicoterapia para adultos",
    "equilíbrio carreira e maternidade",
    "psicologia sistêmica",
    "supervisão clínica para psicólogos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
    description:
      "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho.",
    url: "https://psicoanajulia.com.br",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ana Julia Vognach | Psicóloga Clínica em Florianópolis",
    description:
      "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
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
  robots: {
    index: true,
    follow: true,
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors. If you see `Type ... is not assignable`, check that `icons.other` is typed correctly — it accepts `{ rel: string; url: string }` or an array of those.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add metadataBase, canonical, twitter card, and icon metadata"
```

---

## Task 6: Add JSON-LD structured data

**Files:**
- Modify: `src/app/layout.tsx`

JSON-LD is injected as an inline `<script>` tag inside `<body>`. In Next.js App Router, placing it at the top of `<body>` (before other children) is the recommended pattern — Google crawlers pick it up regardless of position, and it avoids potential head-injection conflicts with Next.js's internal head management.

- [ ] **Step 1: Add JSON-LD constant before the RootLayout function**

In `src/app/layout.tsx`, add this constant just before `export default function RootLayout`:

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Psychologist",
  name: "Ana Julia Vognach",
  inLanguage: "pt-BR",
  description:
    "Psicoterapia para adultos em Florianópolis e online. Especialista em burnout, maternidade, luto e saúde mental no trabalho. CRP 12/30269.",
  url: "https://psicoanajulia.com.br",
  telephone: "+5551982831876",
  priceRange: "$$",
  hasCredential: "CRP/SC 12/30269",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Florianópolis",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  areaServed: ["Florianópolis", "Sul da Ilha", "Campeche"],
  knowsAbout: [
    "burnout",
    "maternidade",
    "luto",
    "saúde mental no trabalho",
    "psicoterapia para adultos",
    "psicologia sistêmica",
  ],
  sameAs: ["https://maps.app.goo.gl/yx6VRRiSPBZc5SBH7?g_st=iw"],
}
```

- [ ] **Step 2: Inject the script tag at the top of `<body>`**

In `src/app/layout.tsx`, add the `<script>` tag as the first child of `<body>`, before the existing GA scripts:

```tsx
<body suppressHydrationWarning className="bg-offwhite font-body antialiased">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
  {process.env.NEXT_PUBLIC_GA_ID && (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </>
  )}
  <ScrollTracker />
  <Nav />
  {children}
  <WhatsAppFloat />
</body>
```

Keep everything inside `<body>` exactly as it was (GA scripts, ScrollTracker, Nav, children, WhatsAppFloat).

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Verify JSON-LD appears in the page source**

```bash
npm run dev
```

Then in another terminal:

```bash
curl -s http://localhost:3000 | grep -A 5 'application/ld+json'
```

Expected: The JSON-LD script block appears in the output with `"@type":"Psychologist"`.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add JSON-LD Psychologist structured data"
```

---

## Task 7: Create sitemap and robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

Next.js App Router serves these automatically at `/sitemap.xml` and `/robots.txt` when these files exist.

- [ ] **Step 1: Create sitemap.ts**

Create `src/app/sitemap.ts`:

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

- [ ] **Step 2: Create robots.ts**

Create `src/app/robots.ts`:

```ts
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://psicoanajulia.com.br/sitemap.xml",
  }
}
```

- [ ] **Step 3: Verify both routes work**

With `npm run dev` still running:

```bash
curl -s http://localhost:3000/sitemap.xml
```

Expected: XML output containing `<loc>https://psicoanajulia.com.br</loc>`.

```bash
curl -s http://localhost:3000/robots.txt
```

Expected:
```
User-Agent: *
Allow: /
Sitemap: https://psicoanajulia.com.br/sitemap.xml
```

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt via Next.js App Router"
```

---

## Task 8: Create OG image

**Files:**
- Create: `src/app/opengraph-image.tsx`

This file is a Next.js special route that auto-serves at `/opengraph-image` and is automatically referenced by the `openGraph.images` field added in Task 5.

`export const runtime = "nodejs"` is required because we use `fs.readFileSync` to load the local photo. The Edge runtime does not support `fs`.

The photo used is `public/fotos/IMG_8209.jpg`.

- [ ] **Step 1: Create the OG image file**

Create `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"
export const alt = "Ana Julia Vognach | Psicóloga Clínica em Florianópolis"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  const imageBuffer = readFileSync(
    join(process.cwd(), "public/fotos/IMG_8209.jpg")
  )
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#F5F2ED",
        }}
      >
        {/* Left: photo */}
        <div
          style={{
            display: "flex",
            width: "50%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={base64Image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>

        {/* Right: text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            width: "50%",
          }}
        >
          <span
            style={{
              color: "#6B7C5C",
              fontSize: 22,
              fontStyle: "italic",
              marginBottom: 16,
            }}
          >
            psicóloga clínica
          </span>

          <span
            style={{
              color: "#1A1A18",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 32,
            }}
          >
            Ana Julia Vognach
          </span>

          <div
            style={{
              width: 56,
              height: 2,
              background: "#6B7C5C",
              marginBottom: 32,
            }}
          />

          <span
            style={{
              color: "#6B6B6B",
              fontSize: 22,
              lineHeight: 1.5,
            }}
          >
            Psicoterapia para adultos em Florianópolis e online.
          </span>

          <span
            style={{
              color: "#6B7C5C",
              fontSize: 18,
              marginTop: 48,
            }}
          >
            psicoanajulia.com.br
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Verify the OG image route works**

With `npm run dev` running:

```bash
curl -s -o /tmp/og-test.png -w "%{http_code}" http://localhost:3000/opengraph-image
```

Expected: `200`. Then open `/tmp/og-test.png` in Preview to visually inspect the image.

- [ ] **Step 4: Commit**

```bash
git add src/app/opengraph-image.tsx
git commit -m "feat: add OG image for social sharing (IMG_8209, 1200x630)"
```

---

## Task 9: Final verification

- [ ] **Step 1: Run a production build**

```bash
npm run build
```

Expected: Build completes with no errors. You should see `/opengraph-image`, `/sitemap.xml`, and `/robots.txt` listed as routes in the output.

- [ ] **Step 2: Validate structured data**

Copy the full page HTML source from `http://localhost:3000` (after `npm run dev`) and paste into [https://validator.schema.org](https://validator.schema.org). Expected: No errors on the Psychologist schema.

Alternatively:
```bash
curl -s http://localhost:3000 | python3 -c "
import sys, json, re
html = sys.stdin.read()
m = re.search(r'application/ld\+json[^>]*>(.*?)</script>', html, re.DOTALL)
if m: print(json.dumps(json.loads(m.group(1)), indent=2, ensure_ascii=False))
"
```

Expected: Clean JSON output with `"@type": "Psychologist"` and all fields populated.

- [ ] **Step 3: Check favicon appears in browser tab**

Open `http://localhost:3000` in Chrome. The browser tab should show the Ψ icon instead of the default Next.js icon.

- [ ] **Step 4: Final commit and push**

```bash
git push -u origin feat/seo-favicon
```

---

## Post-Deployment Manual Steps (not code)

After merging and the site is live at `psicoanajulia.com.br`:

1. Go to [Google Search Console](https://search.google.com/search-console) → Add property → `https://psicoanajulia.com.br`
2. Verify ownership (DNS TXT record method recommended — add via Hostgator cPanel)
3. Submit sitemap: Sitemaps → `https://psicoanajulia.com.br/sitemap.xml` → Submit
4. Request indexing: URL Inspection → `https://psicoanajulia.com.br` → Request Indexing
