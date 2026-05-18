# Ana Julia Vognach — Psicóloga Clínica

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://psicoanajulia.com.br)

Professional landing page for Ana Julia Vognach, clinical psychologist based in Florianópolis (Sul da Ilha), SC. Focused on burnout, motherhood, grief, mental health at work, and adult psychotherapy.

The site is designed to feel editorial, emotionally safe, and human — not like a generic SaaS or template.

---

## Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) (App Router) | Framework |
| TypeScript | Language |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | UI components |
| [Lucide React](https://lucide.dev) | Icons |
| Google Places API | Fetching real reviews for testimonials |
| Google Analytics (GA4) | Analytics and conversion tracking |
| [Vercel](https://vercel.com) | Hosting and CI/CD |

---

## Local Setup

**1. Clone the repo**

```bash
git clone https://github.com/oaugusto256/anajulia-site.git
cd anajulia-site
```

**2. Configure environment variables**

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values (see [Environment Variables](#environment-variables) below).

**3. Install dependencies**

```bash
npm install
```

**4. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_PLACES_API_KEY` | Yes | Google Places API key — used to fetch reviews for the testimonials section |
| `GOOGLE_PLACE_ID` | Yes | Google Place ID of Ana Julia's business profile |
| `NEXT_PUBLIC_GA_ID` | Yes | Google Analytics 4 Measurement ID (format: `G-XXXXXXXXXX`) |

To get a Google Places API key: [Google Cloud Console](https://console.cloud.google.com) → Enable Places API → Create credentials.

---

## Deployment

The site is deployed on [Vercel](https://vercel.com) at [psicoanajulia.com.br](https://psicoanajulia.com.br).

**Hosting setup:**
1. Import the repo into Vercel and set `main` as the production branch
2. Add all environment variables in Vercel → Project Settings → Environment Variables
3. Vercel handles HTTPS automatically via Let's Encrypt

**DNS setup (Hostgator):**
1. Add the domain in Vercel dashboard → Settings → Domains
2. Vercel provides an A record and a CNAME for `www`
3. Add those records in Hostgator's cPanel → DNS Zone Editor
4. Propagation takes a few minutes to a few hours

Every push to `main` triggers an automatic redeploy.

---

## License

[MIT](./LICENSE) — © 2026 Otávio Augusto
