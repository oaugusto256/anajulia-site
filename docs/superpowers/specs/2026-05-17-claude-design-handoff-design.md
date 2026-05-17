# Design Spec — Claude Design Handoff Implementation

**Date:** 2026-05-17
**Branch:** feat/claude-design-handoff
**Approach:** Delta implementation — upgrade existing components to match the handoff prototype, add missing sections

## Visual Source of Truth

- Desktop: `/Users/otavioaugusto/Downloads/anajulia-site-handoff/project/index.html`
- Mobile: `/Users/otavioaugusto/Downloads/anajulia-site-handoff/project/mobile-preview.html`
- Content: `/Users/otavioaugusto/Downloads/anajulia-site-handoff/project/site-content.ts`

All visual decisions follow these files. Do not invent or deviate from the prototype.

---

## Execution Strategy: Layered (3 Waves)

### Wave 1 — Foundation
Global changes that must land before any component work. Touch once; all subsequent sections inherit.

### Wave 2 — Structure
New sections, major layout overhauls, nav and hero rebuilds.

### Wave 3 — Polish
Accordion replacements, minor section upgrades, verification passes.

---

## Wave 1 — Foundation

### 1.1 Color Tokens (globals.css)

Add to `@theme inline` alongside existing tokens:

```css
--color-off-white-2: #F6F2EA;   /* alt section background */
--color-oliva-2: #5C7060;       /* hover accent */
--color-oliva-light: #7B8F7F;   /* floating WhatsApp button bg */
--color-oliva-soft: #E8E9E1;    /* photo placeholder bg */
--color-warm: #C9B998;          /* warm accent (reserved) */
```

Tailwind utility names: `bg-off-white-2`, `bg-oliva-light`, `bg-oliva-soft`, `text-oliva-light`, etc.

### 1.2 Typography (layout.tsx + globals.css)

Add **Cormorant Garamond** via `next/font/google` alongside existing Playfair Display and Inter:

```ts
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})
```

Expose as CSS variable `--font-cormorant` and Tailwind token `font-cormorant`.

Usage: pull-quotes (Support section), mission quote, About lead paragraph.

Font stack remains:
- `--font-heading` → Playfair Display (headings, titles)
- `--font-cormorant` → Cormorant Garamond (italic decorative text)
- `--font-body` → Inter (body, UI)

### 1.3 Content Migration (site-copy.ts → site-content.ts)

Replace `src/content/site-copy.ts` entirely with the handoff's `site-content.ts` structure. The new file exports typed objects per section. Key additions over the current file:

| Export | Status | Key new fields |
|--------|--------|----------------|
| `brand` | NEW | `symbol` (Ψ), `kicker`, `crp`, `contact.whatsapp`, `contact.instagram` |
| `nav` | REPLACE | 5 links (Trajetória, Abordagem, Serviços, FAQ, Contato), `cta.href` with WhatsApp pre-fill |
| `hero` | REPLACE | `eyebrow`, `title.plain` + `title.italic`, `stamp`, `metrics[]`, `photo.objectPosition` |
| `support` | NEW | `pullQuote`, `intro`, `bullets[]` (strong + rest) |
| `about` | REPLACE | `expandToggle` labels, `trajectory.sections[]` with `title` + `body[]`, trajectory `cta` |
| `approach` | REPLACE | `body[]` (array), `cta` typed |
| `services` | REPLACE | `items[].icon` (Lucide name), `items[].id` |
| `reviews` | NEW | `eyebrow`, `rating` ("5,0"), `stars` (5), `source` ("Avaliações Google") |
| `mission` | REPLACE | `quote` (full text), no CTA |
| `faq` | REPLACE | `items[].id`, `cta` typed |
| `footer` | REPLACE | `brand` block, `columns[]` (3 columns with links), `legal` |
| `floatingWhatsapp` | REPLACE | `href`, `ariaLabel` |

All components update their import path from `@/content/site-copy` to `@/content/site-content`.

---

## Wave 2 — Structure

### 2.1 Nav (nav.tsx) — Full Rebuild

**Desktop (≥900px):** Sticky header, 78px tall. Three-column: brand | links | CTA.
- Background: `color-mix(in oklab, off-white 88%, transparent)` + `backdrop-filter: blur(10px) saturate(140%)`
- Border-bottom: transparent at top, `--linhas` after scroll (JS scroll listener, `scrolled` class)
- Brand: circular mark (38px, border `--linhas`) containing Ψ SVG (16px, oliva) + name (Playfair 17px) + kicker (Cormorant italic 14px, oliva) + sub CRP (Inter 11px, uppercase, cinza)
- Nav links: 5 items, 14px Inter, underline scales in from left on hover (oliva, `scaleX`)
- CTA: pill button (oliva-light bg → oliva on hover), "Agendar conversa"

**Mobile (<900px):** Brand + circular burger button (42px, border `--linhas`). Links and CTA hidden.

**Mobile Drawer:**
- `position: fixed; inset: 0; z-index: 70`
- Slides from top: `translateY(-100%) → translateY(0)`, 0.45s ease
- Off-white background, full-height flex column
- Top bar mirrors nav height (78px), contains brand + close button (same circular style as burger)
- Links: Playfair 24px, `letter-spacing: -0.02em`, `padding: 12px 0`, `border-bottom: 1px solid --linhas`
- CTA: full-width pill, pinned to bottom (`margin-top: auto`)
- `overscroll-behavior: contain`
- Respects `env(safe-area-inset-top)` padding

### 2.2 Hero (hero.tsx) — Layout Upgrade

**Desktop (≥980px):** CSS grid, `1.05fr 0.95fr`, two rows. Text: col 1 row 1. Photo: col 2 rows 1–2. Metrics: col 1 row 2.

**Mobile:** Stack order (per `mobileOrder`): photo → eyebrow → title → subtitle → CTA → metrics.

**Eyebrow:** "Psicologia Clínica" — Inter 12px, uppercase, letter-spacing 0.18em, oliva, with 28px line before text.

**Title:** Playfair 500, `clamp(2.4rem, 5.4vw, 4.6rem)`, `line-height: 1.04`, `letter-spacing: -0.035em`. Last word ("saúde mental.") rendered in Playfair italic, oliva color.

**Subtitle:** "Para quem busca…" — Inter, cinza, `max-width: 56ch`, `margin-bottom: 36px`.

**CTA row:** Primary pill button + secondary note ("Atendimento online · de onde você estiver" with 6px oliva dot).

**Photo container:**
- `aspect-ratio: 4/5`, `border-radius: 6px`, `overflow: hidden`, `background: oliva-soft`
- `object-position: center 30%`
- Max-width: 560px desktop, 380px mobile

**Stamp (circular overlay, bottom-left of photo):**
- 132px circle (80px mobile), off-white bg, border `--linhas`, subtle shadow
- Position: `bottom: -28px; left: -28px` (desktop), `-10px/-10px` mobile
- Content: "DESDE" (uppercase, 10px, cinza) + "Cuidado em saúde mental" (Playfair 13px, oliva)

**Ribbon (top-right of photo):**
- Pill, ink bg, off-white text, 11px uppercase, letter-spacing 0.18em
- Content: "CRP 12/30269"
- Position: `top: 20px; right: -10px`

**Metrics row (below text column, desktop; below photo, mobile):**
- 3-column grid, `border-top: 1px solid --linhas`, `padding-top: 32px`
- Values: "5+" / "CRP 12/30269" / "100%" in Playfair `clamp(1.6rem, 2.6vw, 2.1rem)`
- Labels: 12px Inter, cinza, `margin-top: 8px`
- "+" superscripts in oliva

### 2.3 Support Section (support.tsx) — New Component

New section between Hero and About. Background: off-white. Top divider: 1px `--linhas`.

**Desktop (≥980px):** Two-column grid `1.05fr 1fr`, gap `clamp(60px, 8vw, 120px)`. Left: pull-quote. Right: intro + bullets.

**Mobile:** Single column stack.

**Pull-quote:**
- Cormorant Garamond italic 300, `clamp(1.6rem, 3vw, 2.4rem)`, `line-height: 1.25`, `max-width: 22ch`
- Decorative opening quote (") rendered as a `::before` pseudo-element: `font-size: 3.2em`, oliva, `line-height: 0.6`, `margin-bottom: 16px`
- Text: "Você sente que está tentando equilibrar múltiplos papéis, mas vive sob uma sensação constante de esgotamento ou fragmentação?"

**Intro text:** cinza, `line-height: 1.6`, `max-width: 50ch`, `margin-top: 8px`.

**Bullets list:** 3 items, each a grid `14px 1fr` with 6px oliva dot + text. Items separated by `border-bottom: 1px solid --linhas`. Bold `<strong>` followed by regular text.

### 2.4 Footer (footer.tsx) — Rebuild

Background: `#111111` (ink). Text: off-white at 80% opacity.

**Desktop (≥900px):** 4-column grid `1.2fr 1fr 1fr 1fr`, gap 56px.
**Mobile:** Single column, with Navegação and Atendimento side-by-side (2-col) on a second row.

**Column 1 — Brand block:** Centered. Ψ mark (transparent bg, off-white 25% border) → Playfair name (off-white) → CRP (off-white 60%, uppercase, 11px).

**Column 2 — Contato:** Section header (uppercase, 11px, off-white 60%). Three links with inline icons (WhatsApp SVG, email icon, Instagram icon): WhatsApp number, email, Instagram handle.

**Column 3 — Navegação:** Links to #sobre, #abordagem, #servicos, #faq.

**Column 4 — Atendimento:** Four static text items (no links): "100% online", "Adultos · Brasil", "Segunda a sexta", "Resposta em até 24h".

**Legal bar:** Full-width, `grid-column: 1 / -1`, border-top off-white 15%, flex space-between. Copyright + registry. Font: 12.5px, off-white 55%.

---

## Wave 3 — Polish

### 3.1 Shared AccordionItem Component (accordion-item.tsx)

New `"use client"` component. Replaces `@base-ui` accordion in both Services and FAQ.

```tsx
interface AccordionItemProps {
  id: string
  trigger: ReactNode
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
  analyticsEvent?: string
}
```

Body animation: `display: grid; grid-template-rows: 0fr` → `1fr` on open. Inner div: `overflow: hidden`. Transition: `grid-template-rows 0.5s cubic-bezier(.2,.7,.2,1)`.

Chevron (+ icon): `transition: transform 0.35s ease`. When open: `rotate(45deg)`.

Parent component manages `openId: string | null` state. On toggle: if same id, close; else open new.

Remove `src/components/ui/accordion.tsx` (old @base-ui wrapper).

### 3.2 Services (services.tsx) — Icon + Accordion Upgrade

Header: 2-column grid desktop (eyebrow+title left, intro right). Below: accordion list.

Each item trigger: `36px icon | title (Playfair, clamp(1.15rem, 1.7vw, 1.5rem)) | + chevron`.
- Icon: Lucide component, 28px, oliva color
- Hover: `padding-inline` shifts from 4px to 12px (smooth transition)

Icon mapping (Lucide names):
- `atendimento-online` → `Monitor`
- `psicoterapia-adultos` → `User`
- `clinica-do-trabalho` → `Briefcase`
- `burnout` → `BatteryLow`
- `psicoterapia-maes` → `Baby`
- `luto-transicoes` → `Sunset`
- `saude-mental-empresas` → `ClipboardList`

Body text: cinza, `padding-left: 82px` desktop (46px mobile), `max-width: 68ch`.

Analytics: fire `services_expand` event on open.

### 3.3 Reviews/Testimonials (testimonials.tsx) — Rebuild as Static Rating

Remove all testimonial quote cards. New content: centered block, `max-width: 720px`.

- Eyebrow: "O que dizem sobre o meu acompanhamento" (centered, no line prefix)
- 5 star icons (★, oliva, 22px, letter-spacing 0.06em)
- Rating: "5,0" in Playfair, `clamp(3rem, 6vw, 5rem)`, ink
- Google badge: pill with border (`--linhas`), Google SVG logo (16px, full color) + "Avaliações Google" (12.5px, cinza)

### 3.4 About (about.tsx) — Trajectory + Photo Caption

**Photo caption overlay:**
- Position: `bottom: 16px; left: 16px`
- Pill: off-white 92% + `backdrop-filter: blur(6px)`
- Content: Ψ (oliva, Playfair 15px) + "CRP 12/30269" (uppercase, 11.5px, letter-spacing 0.14em)

**About lead paragraph:** Cormorant Garamond italic, 1.2rem, ink (not cinza).

**Trajectory toggle:**
- `<button>` text variant (no bg, border-bottom 1px ink)
- + icon (14px SVG), rotates 45° when open
- aria-expanded on button

**Trajectory expand:** `max-height: 0 → 2400px`, `overflow: hidden`, transition 0.55s ease. Two chapters, each with h4 (Playfair 1.25rem) + paragraphs (cinza). Ghost CTA at end of chapter 2.

### 3.5 Mission (mission.tsx) — Verify + Simplify

Confirm current implementation matches: full-width olive section, Cormorant italic quote (`clamp(1.4rem, 2.6vw, 2rem)`, line-height 1.35, max-width 28ch), eyebrow left-aligned in off-white 80%, no side card, no CTA. Remove any card/CTA if present.

### 3.6 FAQ (faq.tsx) — Accordion Upgrade

Use new `AccordionItem`. Question trigger: Playfair 500, `clamp(1.05rem, 1.4vw, 1.25rem)`, full-width grid `1fr 28px`. Chevron: oliva, 14px.
Answer: cinza, `line-height: 1.6`, `max-width: 68ch`, `padding-right: 32px`.
Ghost CTA centered below list: "Tenho uma dúvida específica" → WhatsApp with question-specific message.
Analytics: fire `faq_expand` event on open.

### 3.7 Floating WhatsApp Button (whatsapp-float.tsx) — Restyle

- 58px circle, `background: oliva-light (#7B8F7F)`, hover → oliva
- WhatsApp SVG icon 28px, off-white
- Shadow: `0 14px 40px rgba(74,93,78,0.22)`
- Hover: `translateY(-2px)`, shadow deepens
- Position: `fixed; bottom: 22px; right: 22px; z-index: 50`
- aria-label from `floatingWhatsapp.ariaLabel`

### 3.8 WhatsApp Button (whatsapp-button.tsx) — Visual Restyle

Current button uses `rounded-[10px]` and `bg-oliva`. Handoff uses pill shape and oliva-light bg.

- Shape: `rounded-full` (border-radius 999px)
- Primary: `bg-oliva-light text-offwhite` → hover `bg-oliva`
- Ghost variant: transparent, ink border → hover ink bg + off-white text
- Add trailing arrow icon (→, 16px) that shifts `translateX(3px)` on hover
- Keep `messageKey` API and `constants.ts` unchanged — URLs are correct

### 3.9 Approach (approach.tsx) — Minor Alignment

Ensure: centered block `max-width: 780px; margin: 0 auto`. Text center-aligned. No glyph/icon above eyebrow. Two body paragraphs. Primary CTA below.

---

## Files Summary

### Created
- `src/content/site-content.ts` (replaces site-copy.ts)
- `src/components/sections/support.tsx`
- `src/components/ui/accordion-item.tsx`
- `src/components/ui/nav-drawer.tsx`
- `docs/superpowers/specs/2026-05-17-claude-design-handoff-design.md`

### Modified
- `src/app/layout.tsx` — add Cormorant Garamond font
- `src/app/globals.css` — new color tokens + font variable
- `src/app/page.tsx` — add `<Support />`, update imports to site-content
- `src/components/sections/nav.tsx`
- `src/components/sections/hero.tsx`
- `src/components/sections/about.tsx`
- `src/components/sections/approach.tsx`
- `src/components/sections/services.tsx`
- `src/components/sections/testimonials.tsx`
- `src/components/sections/mission.tsx`
- `src/components/sections/faq.tsx`
- `src/components/sections/footer.tsx`
- `src/components/ui/whatsapp-float.tsx`
- `src/components/ui/whatsapp-button.tsx`

### Deleted
- `src/content/site-copy.ts`
- `src/components/ui/accordion.tsx`

---

## Constraints

- No new npm dependencies — Lucide React already installed, Cormorant via next/font (no bundle cost)
- All text from `site-content.ts` — no hardcoded copy in components
- CSS-only accordion — no @base-ui, no Radix accordion
- Mobile-first at every component
- Hydration: accordion and drawer are `"use client"` components; everything else stays server-rendered where possible
- Analytics events preserved: `whatsapp_click`, `faq_expand`, `services_expand`, `scroll_75`
