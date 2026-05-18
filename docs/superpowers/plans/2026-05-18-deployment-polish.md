# Deployment Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add LICENSE, `.env.local.example`, and a proper README to the `feat/deployment-polish` branch, then open a PR.

**Architecture:** Three independent file changes — a new LICENSE, a new env template, and a full README rewrite. No code changes. Each task commits independently.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Google Places API, Google Analytics, Vercel.

---

### Task 1: MIT LICENSE

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Create the LICENSE file**

Create `LICENSE` at the project root with this exact content:

```
MIT License

Copyright (c) 2026 Otávio Augusto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "chore: add MIT license"
```

---

### Task 2: Environment Variable Template

**Files:**
- Create: `.env.local.example`

- [ ] **Step 1: Create the template file**

Create `.env.local.example` at the project root:

```
# Google Places API — used to fetch reviews for the testimonials section
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_PLACE_ID=your_google_place_id_here

# Google Analytics — measurement ID from your GA4 property
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

- [ ] **Step 2: Commit**

```bash
git add .env.local.example
git commit -m "chore: add env variable template"
```

---

### Task 3: README Rewrite

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite README.md**

Replace the entire content of `README.md` with:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for developers and maintainers"
```

---

### Task 4: Open Pull Request

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/deployment-polish
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create \
  --title "feat: deployment polish — LICENSE, env template, README" \
  --body "$(cat <<'EOF'
## Summary

- Add MIT license (© 2026 Otávio Augusto)
- Add `.env.local.example` with all required environment variables documented
- Rewrite README for both developers and future maintainers

## No code changes

All changes are documentation and configuration only. No functional impact.

## Checklist

- [ ] LICENSE file present at root
- [ ] `.env.local.example` matches all vars in `.env.local`
- [ ] README renders correctly on GitHub
- [ ] Deploy badge URL resolves after DNS is live

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
