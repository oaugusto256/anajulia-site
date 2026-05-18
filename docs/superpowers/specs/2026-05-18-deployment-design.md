# Deployment & Repository Polish — Design Spec

**Date:** 2026-05-18
**Project:** Ana Julia Vognach — Clinical Psychologist Landing Page
**Status:** Approved

---

## Scope

Four independent areas to complete before the site goes live:

1. Vercel deployment connected to GitHub
2. DNS configuration via Hostgator pointing to Vercel
3. README rewrite for developers and maintainers
4. MIT LICENSE file

---

## 1. Vercel Deployment

**What:** Import the GitHub repo into Vercel and configure environment variables.

**Steps:**
- Import `anajulia-site` repo from GitHub in the Vercel dashboard
- Set deployment branch to `main`
- Add required environment variables:
  - `NEXT_PUBLIC_GA_ID` — Google Analytics measurement ID
  - `GOOGLE_MAPS_API_KEY` — Google Places API key (server-side)
  - Any other vars present in `.env.local`
- Verify build succeeds and preview URL loads correctly
- Post-deploy: confirm GA events fire (`whatsapp_click`, `faq_expand`, `scroll_75`, `services_expand`)

**CI/CD:** Every push to `main` triggers an automatic redeploy. No additional config needed.

---

## 2. DNS Configuration

**Domain:** `psicoanajulia.com.br` (purchased at Hostgator)

**Flow:**
1. In Vercel dashboard: Settings → Domains → Add `psicoanajulia.com.br`
2. Vercel provides DNS records (A record + CNAME for `www`)
3. In Hostgator cPanel: DNS Zone Editor → add those records
4. Wait for propagation (minutes to a few hours)
5. Vercel automatically provisions HTTPS via Let's Encrypt

**Records to add at Hostgator:**
- `@` A record → Vercel IP (provided by Vercel)
- `www` CNAME → `cname.vercel-dns.com`

---

## 3. README Rewrite

**Audience:** Developers (portfolio/recruiters) and future maintainers.

**Structure:**

```
# Ana Julia Vognach — Psicóloga Clínica

[Live URL badge] [License badge]

One-line description of the project.

## About
2-3 sentences: what the site is, who it's for, what problem it solves.

## Stack
Table: Technology | Purpose
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Google Places API (testimonials)
- Google Analytics
- Vercel (hosting)

## Local Setup
1. Clone the repo
2. Copy .env.local.example → .env.local and fill in values
3. npm install
4. npm run dev → http://localhost:3000

## Environment Variables
Table: Variable | Required | Description
- NEXT_PUBLIC_GA_ID | Yes | Google Analytics Measurement ID
- GOOGLE_MAPS_API_KEY | Yes | Google Places API key for testimonials

## Deployment
Brief paragraph: Vercel + Hostgator DNS, psicoanajulia.com.br

## License
MIT
```

---

## 4. MIT License

**File:** `LICENSE` at project root

**Content:** Standard MIT license text, copyright holder: Otávio Augusto, year 2026.

---

## 5. `.env.local.example` File

**File:** `.env.local.example` at project root

A template with all required variable names and placeholder values so future developers know what to configure. The actual `.env.local` remains gitignored.

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## Out of Scope

- No blog, CMS, or additional pages
- No robots.txt or sitemap changes (can be addressed post-launch)
