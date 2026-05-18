# Claude Design Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing landing page to exactly match the Claude design handoff prototype, using a delta approach (add what's missing, upgrade what's different).

**Architecture:** Three waves — Wave 1 (Foundation: tokens + font + content migration), Wave 2 (Structure: nav, hero, support, footer), Wave 3 (Polish: accordion, services, reviews, about, mission, faq, floats). Each wave is stable and testable before the next starts.

**Tech Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS v4 · next/font · Lucide React · CSS-only accordion animation

**Visual source of truth:**
- Desktop: `/Users/otavioaugusto/Downloads/anajulia-site-handoff/project/index.html`
- Mobile: `/Users/otavioaugusto/Downloads/anajulia-site-handoff/project/mobile-preview.html`
- Content: `/Users/otavioaugusto/Downloads/anajulia-site-handoff/project/site-content.ts`
- Design spec: `docs/superpowers/specs/2026-05-17-claude-design-handoff-design.md`

---

## File Map

### Created
- `src/content/site-content.ts` — replaces site-copy.ts; full typed content per section
- `src/components/sections/support.tsx` — new section between Hero and About
- `src/components/ui/accordion-item.tsx` — CSS-only accordion (replaces @base-ui accordion)
- `src/components/ui/nav-drawer.tsx` — full-screen mobile drawer extracted from nav

### Modified
- `src/app/globals.css` — add 4 new color tokens + `--font-cormorant` variable
- `src/app/layout.tsx` — add Cormorant Garamond via next/font, add `cormorant.variable` to `<html>`
- `src/app/page.tsx` — import and render `<Support />` between `<Hero />` and `<About />`
- `src/components/sections/nav.tsx` — brand mark, blur, scroll border, use NavDrawer
- `src/components/sections/hero.tsx` — CSS grid, metrics row, stamp, ribbon
- `src/components/sections/about.tsx` — photo caption overlay, Cormorant lead, trajectory toggle
- `src/components/sections/approach.tsx` — centered block, no glyph, 2-paragraph body
- `src/components/sections/services.tsx` — Lucide icons, CSS accordion, no numbers
- `src/components/sections/testimonials.tsx` — replace quotes with static 5,0 rating + Google badge
- `src/components/sections/mission.tsx` — verify + remove card/CTA if present
- `src/components/sections/faq.tsx` — CSS accordion, ghost CTA below
- `src/components/sections/footer.tsx` — ink bg, 4-column grid
- `src/components/ui/whatsapp-float.tsx` — restyle to oliva-light circle
- `src/components/ui/whatsapp-button.tsx` — pill shape, trailing arrow

### Deleted
- `src/content/site-copy.ts` — replaced by site-content.ts
- `src/components/ui/accordion.tsx` — replaced by accordion-item.tsx

---

## Wave 1 — Foundation

### Task 1: Color Tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add 4 new tokens to the `@theme inline` block**

Open `src/app/globals.css`. Find the existing project tokens block that ends with:
```css
  --font-body: var(--font-inter);
}
```

Insert these 4 lines immediately before the closing `}` of `@theme inline`:

```css
  --color-off-white-2: #F6F2EA;
  --color-oliva-2: #5C7060;
  --color-oliva-light: #7B8F7F;
  --color-oliva-soft: #E8E9E1;
```

Also add the cormorant font variable (it will be populated in Task 2):
```css
  --font-cormorant: var(--font-cormorant);
```

- [ ] **Step 2: Verify build compiles**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

Expected: no output (no errors)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add off-white-2, oliva-light, oliva-2, oliva-soft color tokens"
```

---

### Task 2: Typography — Cormorant Garamond

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Import Cormorant_Garamond from next/font and add it to the HTML element**

Replace the current font import section in `src/app/layout.tsx`. Current state:
```tsx
import { Inter, Playfair_Display } from "next/font/google"
```

New state:
```tsx
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
```

Add after the `playfair` declaration:
```tsx
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})
```

Then update the `<html>` className to include `cormorant.variable`:
```tsx
<html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Verify font loads in dev**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npm run dev &
sleep 5 && curl -s http://localhost:3000 | grep -i cormorant | head -5
```

Expected: some reference to the font in the HTML

Kill the dev server after verification: `pkill -f "next dev"` (or leave running for subsequent tasks)

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Cormorant Garamond via next/font"
```

---

### Task 3: Content Migration — site-copy.ts → site-content.ts

**Files:**
- Create: `src/content/site-content.ts`
- Modify: ALL section components (update import paths)
- Delete: `src/content/site-copy.ts` (after all imports updated)

- [ ] **Step 1: Copy the handoff site-content.ts into the project**

```bash
cp /Users/otavioaugusto/Downloads/anajulia-site-handoff/project/site-content.ts \
   /Users/otavioaugusto/projects/anajulia-site/src/content/site-content.ts
```

- [ ] **Step 2: Verify the file was copied correctly**

```bash
head -20 /Users/otavioaugusto/projects/anajulia-site/src/content/site-content.ts
```

Expected: Shows the `site-content.ts` header comment and first exports.

- [ ] **Step 3: Verify TypeScript compiles the new file**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -30
```

Expected: errors only about `@/content/site-copy` imports in components (not about the new file itself)

- [ ] **Step 4: Update imports in all section components**

Run this to find all files that import from site-copy:

```bash
grep -rl "from \"@/content/site-copy\"" /Users/otavioaugusto/projects/anajulia-site/src/
```

For each file found, we will update imports individually in the next tasks (Task 4 onward updates imports as we rebuild each component). For now, note which files need updating.

- [ ] **Step 5: Commit new content file**

```bash
git add src/content/site-content.ts
git commit -m "feat: add handoff site-content.ts as source of truth for all copy"
```

---

## Wave 2 — Structure

### Task 4: Nav — Full Rebuild

**Files:**
- Modify: `src/components/sections/nav.tsx`
- Create: `src/components/ui/nav-drawer.tsx`

- [ ] **Step 1: Create the NavDrawer component**

Create `src/components/ui/nav-drawer.tsx`:

```tsx
"use client"

import { useEffect } from "react"
import { nav, brand } from "@/content/site-content"

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "var(--color-offwhite)",
        display: "flex",
        flexDirection: "column",
        transform: open ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.45s ease",
        overscrollBehavior: "contain",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid var(--color-linhas)",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid var(--color-linhas)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-oliva)",
              fontFamily: "var(--font-playfair)",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {brand.symbol}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 17, color: "var(--color-preto)", lineHeight: 1.2 }}>
              {brand.name}
            </div>
            <div style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 14, color: "var(--color-oliva)", lineHeight: 1 }}>
              {brand.kicker}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fechar menu"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "1px solid var(--color-linhas)",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 18,
            color: "var(--color-preto)",
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Links */}
      <nav
        aria-label="Menu de navegação"
        style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px" }}
      >
        {nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 24,
              letterSpacing: "-0.02em",
              color: "var(--color-preto)",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-linhas)",
              textDecoration: "none",
              display: "block",
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* CTA pinned to bottom */}
      <div style={{ padding: "24px 20px", paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
        <a
          href={nav.cta.href}
          onClick={onClose}
          style={{
            display: "block",
            textAlign: "center",
            background: "var(--color-oliva-light)",
            color: "var(--color-offwhite)",
            borderRadius: 999,
            padding: "14px 28px",
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          {nav.cta.label}
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rebuild nav.tsx**

Replace the entire content of `src/components/sections/nav.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { nav, brand } from "@/content/site-content"
import { NavDrawer } from "@/components/ui/nav-drawer"

export function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          width: "100%",
          height: 78,
          background: "color-mix(in oklab, var(--color-offwhite) 88%, transparent)",
          backdropFilter: "blur(10px) saturate(140%)",
          WebkitBackdropFilter: "blur(10px) saturate(140%)",
          borderBottom: scrolled ? "1px solid var(--color-linhas)" : "1px solid transparent",
          transition: "border-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1px solid var(--color-linhas)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-oliva)",
                fontFamily: "var(--font-playfair)",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {brand.symbol}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 17, color: "var(--color-preto)", lineHeight: 1.2 }}>
                {brand.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 14, color: "var(--color-oliva)", lineHeight: 1 }}>
                  {brand.kicker}
                </span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-cinza)", lineHeight: 1 }}>
                  {brand.sub}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop nav links (≥900px) */}
          <nav
            aria-label="Navegação principal"
            className="hidden"
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 14,
                  color: "var(--color-cinza)",
                  textDecoration: "none",
                  position: "relative",
                  paddingBottom: 2,
                }}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href={nav.cta.href}
            className="hidden"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              background: "var(--color-oliva-light)",
              color: "var(--color-offwhite)",
              borderRadius: 999,
              padding: "8px 20px",
              textDecoration: "none",
              transition: "background 0.2s",
              display: "none",
            }}
          >
            {nav.cta.label}
          </a>

          {/* Mobile burger */}
          <button
            aria-label={drawerOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "1px solid var(--color-linhas)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-preto)",
            }}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="0" y1="1" x2="18" y2="1" />
              <line x1="0" y1="7" x2="18" y2="7" />
              <line x1="0" y1="13" x2="18" y2="13" />
            </svg>
          </button>
        </div>
      </header>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <style>{`
        @media (min-width: 900px) {
          .nav-link { display: inline-block !important; }
          .nav-desktop-cta { display: inline-block !important; }
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 1px;
          background: var(--color-oliva);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-link:hover { color: var(--color-preto) !important; }
      `}</style>
    </>
  )
}
```

> **Note on nav desktop visibility:** The desktop nav links and CTA use `className="hidden"` from Tailwind (which sets `display:none`). The `<style>` block uses a media query to override this at ≥900px. This avoids adding a Tailwind `md:flex` breakpoint collision — the component is entirely client-side so this is safe.
>
> **Alternative simpler approach:** Use Tailwind's responsive classes instead. Replace `className="hidden"` on the desktop nav with `className="hidden min-[900px]:flex"` and on the desktop CTA with `className="hidden min-[900px]:inline-block"`. Remove the `@media` rule from the `<style>` block. Either approach works — the Tailwind approach is cleaner.

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 4: Visual check in browser**

Start dev server if not running: `npm run dev`
Open http://localhost:3000 and verify:
- Nav shows Ψ mark, name, kicker, CRP
- Blur effect visible on scroll
- Border-bottom appears on scroll
- Mobile: burger opens full-screen drawer with links and CTA

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/nav.tsx src/components/ui/nav-drawer.tsx
git commit -m "feat: redesign nav with brand mark, blur backdrop, full-screen mobile drawer"
```

---

### Task 5: Hero — Layout Upgrade

**Files:**
- Modify: `src/components/sections/hero.tsx`

The current hero has `italicHighlight`, `supportText`, and `supportList` content that moves to the new Support section. The new hero has: CSS grid, metrics row, stamp, ribbon badge.

- [ ] **Step 1: Rewrite hero.tsx**

Replace the entire content of `src/components/sections/hero.tsx`:

```tsx
import Image from "next/image"
import { hero } from "@/content/site-content"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        background: "var(--color-offwhite)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
        }}
        className="hero-grid"
      >
        {/* Mobile: photo first */}
        <div className="hero-photo-mobile" style={{ order: -1, display: "none" }}>
          <HeroPhoto />
        </div>

        {/* Text column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--color-oliva)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ display: "inline-block", width: 28, height: 1, background: "var(--color-oliva)" }} />
            {hero.eyebrow}
          </p>

          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)",
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: "var(--color-preto)",
              margin: 0,
            }}
          >
            {hero.title.plain}{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-oliva)" }}>
              {hero.title.italic}
            </em>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--color-cinza)",
              maxWidth: "56ch",
              marginBottom: 12,
            }}
          >
            {hero.subtitle}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <WhatsAppButton messageKey="schedule" label={hero.cta.label} />
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 13,
                color: "var(--color-cinza)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-oliva)",
                  flexShrink: 0,
                }}
              />
              Atendimento online · de onde você estiver
            </span>
          </div>

          {/* Metrics row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: "1px solid var(--color-linhas)",
              paddingTop: 32,
              marginTop: 8,
              gap: 16,
            }}
          >
            {hero.metrics.map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                    color: "var(--color-preto)",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {m.value.replace("+", "")}
                  {m.value.includes("+") && (
                    <sup style={{ color: "var(--color-oliva)", fontSize: "0.6em" }}>+</sup>
                  )}
                  {m.value.includes("%") && (
                    <sup style={{ color: "var(--color-oliva)", fontSize: "0.6em" }}>%</sup>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 12,
                    color: "var(--color-cinza)",
                    lineHeight: 1.4,
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo column — desktop only */}
        <div className="hero-photo-desktop">
          <HeroPhoto />
        </div>
      </div>

      <style>{`
        @media (min-width: 980px) {
          .hero-grid {
            grid-template-columns: 1.05fr 0.95fr !important;
            grid-template-rows: auto;
            align-items: start;
          }
          .hero-photo-mobile { display: none !important; }
          .hero-photo-desktop { display: block !important; }
        }
        @media (max-width: 979px) {
          .hero-photo-desktop { display: none !important; }
          .hero-photo-mobile { display: block !important; }
        }
      `}</style>
    </section>
  )
}

function HeroPhoto() {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "4/5",
        maxWidth: 560,
        borderRadius: 6,
        overflow: "visible",
        background: "var(--color-oliva-soft)",
      }}
    >
      {/* Photo */}
      <div style={{ borderRadius: 6, overflow: "hidden", height: "100%", position: "relative" }}>
        <Image
          src="/fotos/IMG_8209.jpg"
          alt={hero.photo.alt}
          fill
          priority
          sizes="(max-width: 979px) min(380px, 100vw), min(560px, 48vw)"
          style={{ objectFit: "cover", objectPosition: hero.photo.objectPosition }}
        />
      </div>

      {/* Stamp — bottom-left overlay */}
      <div
        style={{
          position: "absolute",
          bottom: -28,
          left: -28,
          width: 132,
          height: 132,
          borderRadius: "50%",
          background: "var(--color-offwhite)",
          border: "1px solid var(--color-linhas)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
          zIndex: 2,
        }}
        className="hero-stamp"
      >
        <span style={{ fontFamily: "var(--font-inter)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-cinza)" }}>
          Desde
        </span>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 22, color: "var(--color-oliva)", lineHeight: 1 }}>
          2018
        </span>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 11, color: "var(--color-oliva)", lineHeight: 1.3, maxWidth: 80, textAlign: "center" }}>
          {hero.stamp.line1}<br />{hero.stamp.line2}
        </span>
      </div>

      {/* Ribbon — top-right */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: -10,
          background: "var(--color-preto)",
          color: "var(--color-offwhite)",
          borderRadius: 999,
          padding: "5px 14px",
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          zIndex: 2,
          whiteSpace: "nowrap",
        }}
      >
        {hero.metrics[1].value}
      </div>

      <style>{`
        @media (max-width: 979px) {
          .hero-stamp {
            width: 80px !important;
            height: 80px !important;
            bottom: -10px !important;
            left: -10px !important;
          }
        }
      `}</style>
    </div>
  )
}
```

> **Note on metrics rendering:** The `hero.metrics` array has values like `"5+"`, `"CRP 12/30269"`, and `"100%"`. The display logic checks for `+` and `%` in the value string to render superscripts. The `CRP 12/30269` metric will render as-is (no superscript). The ribbon shows `hero.metrics[1].value` which is `"CRP 12/30269"`.

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Visual check**

Open http://localhost:3000. Verify:
- Desktop: 2-column grid, text left, photo right
- Photo has stamp (bottom-left) and ribbon badge (top-right)
- Metrics row with 3 columns below text
- Mobile: photo above text

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat: upgrade hero with CSS grid, metrics row, stamp, and CRP ribbon"
```

---

### Task 6: Support Section — New Component

**Files:**
- Create: `src/components/sections/support.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create support.tsx**

Create `src/components/sections/support.tsx`:

```tsx
import { support } from "@/content/site-content"

export function Support() {
  return (
    <section
      id="suporte"
      style={{
        background: "var(--color-offwhite)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(40px, 6vw, 80px)",
        }}
        className="support-grid"
      >
        {/* Pull-quote */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              lineHeight: 1.25,
              color: "var(--color-preto)",
              maxWidth: "22ch",
              margin: 0,
              position: "relative",
              paddingTop: "2rem",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "3.2em",
                color: "var(--color-oliva)",
                lineHeight: 0.6,
              }}
            >
              "
            </span>
            {support.pullQuote}
          </p>
        </div>

        {/* Intro + bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--color-cinza)",
              maxWidth: "50ch",
              margin: 0,
            }}
          >
            {support.intro}
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {support.bullets.map((bullet, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "14px 1fr",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "1px solid var(--color-linhas)",
                  fontFamily: "var(--font-inter)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--color-cinza)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--color-oliva)",
                    marginTop: 8,
                    flexShrink: 0,
                  }}
                />
                <span>
                  <strong style={{ color: "var(--color-preto)", fontWeight: 600 }}>{bullet.strong}</strong>
                  {bullet.rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @media (min-width: 980px) {
          .support-grid {
            grid-template-columns: 1.05fr 1fr !important;
            gap: clamp(60px, 8vw, 120px) !important;
          }
        }
      `}</style>
    </section>
  )
}
```

- [ ] **Step 2: Add Support to page.tsx**

Edit `src/app/page.tsx`. Add the `Support` import and render it between `<Hero />` and `<About />`:

```tsx
import { Hero } from "@/components/sections/hero"
import { Support } from "@/components/sections/support"
import { About } from "@/components/sections/about"
import { Approach } from "@/components/sections/approach"
import { Services } from "@/components/sections/services"
import { Mission } from "@/components/sections/mission"
import { Testimonials } from "@/components/sections/testimonials"
import { FAQ } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <Support />
      <About />
      <Approach />
      <Services />
      <Mission />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 4: Visual check**

Open http://localhost:3000. Scroll past hero and verify:
- New Support section visible with large italic pull-quote on left
- 3 bullets on right with oliva dots
- Intro text above bullets

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/support.tsx src/app/page.tsx
git commit -m "feat: add Support section with Cormorant pull-quote and bullet frentes"
```

---

### Task 7: Footer — Rebuild

**Files:**
- Modify: `src/components/sections/footer.tsx`

- [ ] **Step 1: Read the current footer**

Read `src/components/sections/footer.tsx` to understand current structure before rewriting.

- [ ] **Step 2: Rewrite footer.tsx**

Replace entire content of `src/components/sections/footer.tsx`:

```tsx
import { footer, brand } from "@/content/site-content"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contato"
      style={{
        background: "#111111",
        padding: "clamp(60px, 8vw, 80px) clamp(20px, 5vw, 60px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Main columns grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            paddingBottom: "clamp(48px, 6vw, 64px)",
          }}
          className="footer-columns"
        >
          {/* Col 1: Brand */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(253,251,247,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(253,251,247,0.8)",
                fontFamily: "var(--font-playfair)",
                fontSize: 20,
              }}
            >
              {brand.symbol}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 17, color: "rgba(253,251,247,0.9)", lineHeight: 1.3 }}>
                {footer.brand.name}
              </div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(253,251,247,0.6)", marginTop: 4 }}>
                {footer.brand.sub}
              </div>
            </div>
          </div>

          {/* Col 2–4: Contato, Navegação, Atendimento */}
          {footer.columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(253,251,247,0.6)",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link, i) => (
                  <li key={i}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: 14,
                          color: "rgba(253,251,247,0.8)",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          lineHeight: 1.4,
                        }}
                      >
                        {link.icon && <FooterIcon name={link.icon} />}
                        {link.label}
                      </a>
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: 14,
                          color: "rgba(253,251,247,0.8)",
                          lineHeight: 1.4,
                        }}
                      >
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal bar */}
        <div
          style={{
            borderTop: "1px solid rgba(253,251,247,0.15)",
            padding: "20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 12.5, color: "rgba(253,251,247,0.55)" }}>
            {footer.legal.copyright.replace("{YEAR}", String(year))}
          </span>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 12.5, color: "rgba(253,251,247,0.55)" }}>
            {footer.legal.registry}
          </span>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .footer-columns {
            grid-template-columns: 1.2fr 1fr 1fr 1fr !important;
            gap: 56px !important;
            align-items: start;
          }
          .footer-columns > div:first-child {
            align-items: flex-start;
            text-align: left;
          }
        }
        @media (max-width: 899px) {
          .footer-columns {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-columns > div:first-child,
          .footer-columns > div:nth-child(2) {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  )
}

function FooterIcon({ name }: { name: string }) {
  const style = { width: 16, height: 16, flexShrink: 0, color: "rgba(253,251,247,0.7)" }

  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    )
  }

  if (name === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
      </svg>
    )
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    )
  }

  return null
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors (if there are type errors on `link.icon` or `link.external`, those are expected since the handoff's `footer` type has mixed link shapes — use `(link as any).icon` and `(link as any).external` temporarily, or add type guards)

If type errors appear on `link.icon` or `link.external`, update the rendering:
```tsx
const icon = (link as { icon?: string }).icon
const external = (link as { external?: boolean }).external
```

- [ ] **Step 4: Visual check**

Open http://localhost:3000 and scroll to footer. Verify:
- Ink background
- Desktop: 4-column grid (brand, Contato, Navegação, Atendimento)
- Mobile: brand + contato full-width, then Navegação + Atendimento side-by-side
- Legal bar with copyright + registry

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/footer.tsx
git commit -m "feat: rebuild footer with ink background and 4-column grid"
```

---

## Wave 3 — Polish

### Task 8: AccordionItem Component

**Files:**
- Create: `src/components/ui/accordion-item.tsx`
- Delete: `src/components/ui/accordion.tsx` (after Services and FAQ are updated in Tasks 9 and 13)

- [ ] **Step 1: Create accordion-item.tsx**

Create `src/components/ui/accordion-item.tsx`:

```tsx
"use client"

import type { ReactNode } from "react"

interface AccordionItemProps {
  id: string
  trigger: ReactNode
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
  analyticsEvent?: string
}

export function AccordionItem({
  id,
  trigger,
  children,
  isOpen,
  onToggle,
  analyticsEvent,
}: AccordionItemProps) {
  function handleToggle() {
    if (analyticsEvent && typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", analyticsEvent, { item_id: id })
    }
    onToggle()
  }

  return (
    <div
      aria-expanded={isOpen}
      style={{ borderBottom: "1px solid var(--color-linhas)" }}
    >
      <button
        type="button"
        id={`accordion-trigger-${id}`}
        aria-controls={`accordion-body-${id}`}
        aria-expanded={isOpen}
        onClick={handleToggle}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 28px",
          alignItems: "center",
          width: "100%",
          padding: "20px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
          transition: "padding-inline-start 0.25s ease",
          paddingInlineStart: isOpen ? 8 : 4,
        }}
      >
        {trigger}
        <span
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            color: "var(--color-oliva)",
            fontSize: 14,
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.35s ease",
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>

      <div
        id={`accordion-body-${id}`}
        role="region"
        aria-labelledby={`accordion-trigger-${id}`}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.5s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/accordion-item.tsx
git commit -m "feat: add CSS-only AccordionItem component (grid-template-rows animation)"
```

---

### Task 9: Services — Icons + Accordion Upgrade

**Files:**
- Modify: `src/components/sections/services.tsx`

The icon field in site-content's `services.items` uses semantic names (`"monitor"`, `"person"`, `"briefcase"`, etc.). We map these to Lucide components.

- [ ] **Step 1: Read current services.tsx**

Read `src/components/sections/services.tsx` to understand current structure.

- [ ] **Step 2: Rewrite services.tsx**

Replace entire content of `src/components/sections/services.tsx`:

```tsx
"use client"

import { useState } from "react"
import {
  Monitor,
  User,
  Briefcase,
  BatteryLow,
  Baby,
  Sunset,
  ClipboardList,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { services } from "@/content/site-content"
import { AccordionItem } from "@/components/ui/accordion-item"

const iconMap: Record<string, LucideIcon> = {
  monitor: Monitor,
  person: User,
  briefcase: Briefcase,
  "person-fatigue": BatteryLow,
  "person-with-child": Baby,
  horizon: Sunset,
  clipboard: ClipboardList,
}

export function Services() {
  const [openId, setOpenId] = useState<string | null>(null)

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="servicos"
      style={{
        background: "var(--color-off-white-2)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header: 2-col desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
            marginBottom: "clamp(40px, 5vw, 64px)",
          }}
          className="services-header"
        >
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-oliva)", marginBottom: 12 }}>
              {services.eyebrow}
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.9rem, 3.5vw, 3rem)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--color-preto)", margin: 0 }}>
              {services.title}
            </h2>
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.65, color: "var(--color-cinza)", maxWidth: "48ch", margin: 0 }}>
            {services.intro}
          </p>
        </div>

        {/* Accordion list */}
        <div>
          {services.items.map((item) => {
            const Icon = iconMap[item.icon] ?? Monitor
            return (
              <AccordionItem
                key={item.id}
                id={item.id}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
                analyticsEvent="services_expand"
                trigger={
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <Icon
                      size={28}
                      strokeWidth={1.5}
                      style={{ color: "var(--color-oliva)", flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.15rem, 1.7vw, 1.5rem)", color: "var(--color-preto)", fontWeight: 500 }}>
                      {item.title}
                    </span>
                  </div>
                }
              >
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.65, color: "var(--color-cinza)", paddingBottom: 24, paddingLeft: 48, maxWidth: "68ch" }}>
                  {item.body}
                </p>
              </AccordionItem>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .services-header {
            grid-template-columns: 1fr 1fr !important;
            align-items: end;
          }
        }
      `}</style>
    </section>
  )
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 4: Visual check**

Open http://localhost:3000 and scroll to Services. Verify:
- No numbers in accordion triggers
- Each item has Lucide icon + serif title + + chevron
- Click opens one item, closes previous
- + rotates to ×

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/services.tsx
git commit -m "feat: upgrade services with Lucide icons and CSS accordion"
```

---

### Task 10: Reviews — Static Rating Rebuild

**Files:**
- Modify: `src/components/sections/testimonials.tsx`

- [ ] **Step 1: Rewrite testimonials.tsx**

Replace entire content of `src/components/sections/testimonials.tsx`:

```tsx
import { reviews } from "@/content/site-content"

export function Testimonials() {
  return (
    <section
      id="avaliacoes"
      style={{
        background: "var(--color-offwhite)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {/* Eyebrow */}
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-cinza)", margin: 0 }}>
          {reviews.eyebrow}
        </p>

        {/* Stars */}
        <div
          aria-label={`${reviews.stars} estrelas`}
          style={{ display: "flex", gap: 4, letterSpacing: "0.06em", color: "var(--color-oliva)", fontSize: 22 }}
        >
          {Array.from({ length: reviews.stars }).map((_, i) => (
            <span key={i} aria-hidden="true">★</span>
          ))}
        </div>

        {/* Rating */}
        <div
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            fontWeight: 500,
            color: "var(--color-preto)",
            lineHeight: 1,
          }}
        >
          {reviews.rating}
        </div>

        {/* Google badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--color-linhas)",
            borderRadius: 999,
            padding: "6px 14px",
          }}
        >
          {/* Google SVG logo */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Google">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 12.5, color: "var(--color-cinza)" }}>
            {reviews.source}
          </span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Visual check**

Scroll to Reviews section. Verify:
- No quote testimonials
- Eyebrow text visible
- 5 oliva stars
- Large Playfair "5,0" rating
- Google badge pill

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/testimonials.tsx
git commit -m "feat: replace testimonial quotes with static Google rating block"
```

---

### Task 11: About — Trajectory + Photo Caption

**Files:**
- Modify: `src/components/sections/about.tsx`

- [ ] **Step 1: Read current about.tsx**

Read `src/components/sections/about.tsx` to understand current structure.

- [ ] **Step 2: Rewrite about.tsx**

Replace entire content of `src/components/sections/about.tsx`:

```tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { about } from "@/content/site-content"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function About() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section
      id="sobre"
      style={{
        background: "var(--color-off-white-2)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(40px, 6vw, 80px)",
        }}
        className="about-grid"
      >
        {/* Photo */}
        <div style={{ position: "relative", maxWidth: 480 }}>
          <div style={{ aspectRatio: "4/5", borderRadius: 6, overflow: "hidden", background: "var(--color-oliva-soft)", position: "relative" }}>
            <Image
              src="/fotos/IMG_8114.jpg"
              alt={about.photo.alt}
              fill
              sizes="(max-width: 979px) min(480px, 100vw), min(480px, 40vw)"
              style={{ objectFit: "cover", objectPosition: about.photo.objectPosition }}
            />
          </div>

          {/* Caption overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(253,251,247,0.92)",
              backdropFilter: "blur(6px)",
              borderRadius: 999,
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 15, color: "var(--color-oliva)" }}>Ψ</span>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-preto)" }}>
              CRP 12/30269
            </span>
          </div>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-oliva)", margin: 0 }}>
            {about.eyebrow}
          </p>

          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--color-preto)", margin: 0 }}>
            {about.title}
          </h2>

          {/* Lead — Cormorant italic */}
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55, color: "var(--color-preto)", margin: 0 }}>
            {about.lead}
          </p>

          <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.65, color: "var(--color-cinza)", margin: 0 }}>
            {about.body}
          </p>

          {/* Trajectory toggle */}
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--color-preto)",
              padding: "4px 0",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              color: "var(--color-preto)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
            }}
          >
            <span style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease", display: "inline-block", fontSize: 16 }}>
              +
            </span>
            {expanded ? about.expandToggle.openLabel : about.expandToggle.closedLabel}
          </button>

          {/* Trajectory expand */}
          <div
            style={{
              maxHeight: expanded ? 2400 : 0,
              overflow: "hidden",
              transition: "max-height 0.55s ease",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingTop: 16 }}>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.65, color: "var(--color-cinza)", margin: 0 }}>
                {about.trajectory.intro}
              </p>

              {about.trajectory.sections.map((section, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h4 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)", fontWeight: 500, color: "var(--color-preto)", margin: 0 }}>
                    {section.title}
                  </h4>
                  {section.body.map((para, j) => (
                    <p key={j} style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.65, color: "var(--color-cinza)", margin: 0 }}>
                      {para}
                    </p>
                  ))}
                  {section.cta && (
                    <div style={{ marginTop: 8 }}>
                      <WhatsAppButton messageKey="schedule" label={section.cta.label} variant="ghost" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 980px) {
          .about-grid {
            grid-template-columns: 0.85fr 1.15fr !important;
            align-items: start;
          }
        }
      `}</style>
    </section>
  )
}
```

> **Note:** The `WhatsAppButton` currently only accepts a `messageKey` prop. The `variant="ghost"` prop may not exist yet — check `src/components/ui/whatsapp-button.tsx`. If it doesn't support `variant`, either add it in Task 15 first, or temporarily use the default variant here and update after Task 15.

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -30
```

If `variant` prop doesn't exist on `WhatsAppButton`, note the error and proceed without it for now (remove the `variant="ghost"` prop). It will be added in Task 15.

- [ ] **Step 4: Visual check**

Scroll to About section. Verify:
- Photo on left (desktop), photo caption overlay visible
- Cormorant italic lead paragraph
- "Conheça mais" toggle button
- Clicking expands trajectory text with 2 chapters
- Ghost CTA at end of chapter 2

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/about.tsx
git commit -m "feat: upgrade about with photo caption, Cormorant lead, trajectory expand toggle"
```

---

### Task 12: Mission — Verify and Simplify

**Files:**
- Modify: `src/components/sections/mission.tsx` (if changes needed)

- [ ] **Step 1: Read current mission.tsx**

Read `src/components/sections/mission.tsx`.

- [ ] **Step 2: Compare against spec**

The spec requires:
- Full-width olive background
- Cormorant Garamond italic quote
- `clamp(1.4rem, 2.6vw, 2rem)`, line-height 1.35, max-width 28ch
- Eyebrow left-aligned in off-white 80% opacity
- No side card, no CTA

- [ ] **Step 3: Update mission.tsx to match spec**

Rewrite `src/components/sections/mission.tsx` to match spec exactly:

```tsx
import { mission } from "@/content/site-content"

export function Mission() {
  return (
    <section
      id="missao"
      style={{
        background: "var(--color-oliva)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(253,251,247,0.8)", marginBottom: 32 }}>
          {mission.eyebrow}
        </p>

        <blockquote
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
            lineHeight: 1.35,
            color: "rgba(253,251,247,0.95)",
            maxWidth: "28ch",
            margin: 0,
          }}
        >
          "{mission.quote}"
        </blockquote>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Visual check**

Scroll to Mission. Verify: olive background, Cormorant italic quote, no card, no CTA.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/mission.tsx
git commit -m "feat: simplify mission to olive block with Cormorant italic quote, remove card and CTA"
```

---

### Task 13: FAQ — Accordion Upgrade

**Files:**
- Modify: `src/components/sections/faq.tsx`

- [ ] **Step 1: Read current faq.tsx**

Read `src/components/sections/faq.tsx` to understand current structure.

- [ ] **Step 2: Rewrite faq.tsx**

Replace entire content of `src/components/sections/faq.tsx`:

```tsx
"use client"

import { useState } from "react"
import { faq } from "@/content/site-content"
import { AccordionItem } from "@/components/ui/accordion-item"

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq"
      style={{
        background: "var(--color-offwhite)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-oliva)", marginBottom: 40 }}>
          {faq.eyebrow}
        </p>

        <div>
          {faq.items.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
              analyticsEvent="faq_expand"
              trigger={
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)", fontWeight: 500, color: "var(--color-preto)", lineHeight: 1.3 }}>
                  {item.question}
                </span>
              }
            >
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.6, color: "var(--color-cinza)", paddingBottom: 24, paddingRight: 32, maxWidth: "68ch", margin: 0 }}>
                {item.answer}
              </p>
            </AccordionItem>
          ))}
        </div>

        {/* Ghost CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a
            href={faq.cta.href}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              color: "var(--color-preto)",
              border: "1px solid var(--color-preto)",
              borderRadius: 999,
              padding: "10px 24px",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {faq.cta.label}
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Visual check**

Scroll to FAQ. Verify: Playfair questions, + chevron rotates, ghost CTA below list.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/faq.tsx
git commit -m "feat: upgrade FAQ with CSS accordion and ghost CTA"
```

---

### Task 14: Floating WhatsApp — Restyle

**Files:**
- Modify: `src/components/ui/whatsapp-float.tsx`

- [ ] **Step 1: Read current whatsapp-float.tsx**

Read `src/components/ui/whatsapp-float.tsx`.

- [ ] **Step 2: Rewrite whatsapp-float.tsx**

Replace entire content of `src/components/ui/whatsapp-float.tsx`:

```tsx
import { floatingWhatsapp } from "@/content/site-content"

export function WhatsAppFloat() {
  return (
    <a
      href={floatingWhatsapp.href}
      aria-label={floatingWhatsapp.ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 22,
        right: 22,
        zIndex: 50,
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: "var(--color-oliva-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 14px 40px rgba(74,93,78,0.22)",
        textDecoration: "none",
        transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
      className="whatsapp-float"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--color-offwhite)" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>

      <style>{`
        .whatsapp-float:hover {
          background: var(--color-oliva) !important;
          transform: translateY(-2px);
          box-shadow: 0 20px 50px rgba(74,93,78,0.3) !important;
        }
      `}</style>
    </a>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Visual check**

Look at bottom-right of page. Verify: oliva-light circle with white WhatsApp icon.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/whatsapp-float.tsx
git commit -m "feat: restyle floating WhatsApp button to oliva-light circle"
```

---

### Task 15: WhatsApp Button — Pill + Ghost Variant

**Files:**
- Modify: `src/components/ui/whatsapp-button.tsx`

- [ ] **Step 1: Read current whatsapp-button.tsx**

Read `src/components/ui/whatsapp-button.tsx` to understand current props.

- [ ] **Step 2: Add ghost variant and pill shape**

The button needs to support `variant?: "primary" | "ghost"`. Rewrite `src/components/ui/whatsapp-button.tsx`:

```tsx
"use client"

import { trackWhatsapp } from "@/lib/analytics"
import { WHATSAPP_LINKS } from "@/lib/constants"

interface WhatsAppButtonProps {
  messageKey: keyof typeof WHATSAPP_LINKS
  label: string
  variant?: "primary" | "ghost"
  className?: string
}

export function WhatsAppButton({
  messageKey,
  label,
  variant = "primary",
  className,
}: WhatsAppButtonProps) {
  const href = WHATSAPP_LINKS[messageKey]

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "12px 24px",
    fontFamily: "var(--font-inter)",
    fontSize: 15,
    fontWeight: 500,
    textDecoration: "none",
    transition: "background 0.2s, color 0.2s, transform 0.15s",
    cursor: "pointer",
    border: "1px solid transparent",
  }

  const primaryStyle: React.CSSProperties = {
    ...baseStyle,
    background: "var(--color-oliva-light)",
    color: "var(--color-offwhite)",
    borderColor: "transparent",
  }

  const ghostStyle: React.CSSProperties = {
    ...baseStyle,
    background: "transparent",
    color: "var(--color-preto)",
    borderColor: "var(--color-preto)",
  }

  const style = variant === "ghost" ? ghostStyle : primaryStyle

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={className}
      onClick={() => trackWhatsapp(messageKey)}
    >
      {label}
      <span
        aria-hidden="true"
        style={{ display: "inline-block", transition: "transform 0.15s ease" }}
        className="wa-arrow"
      >
        →
      </span>

      <style>{`
        a:hover .wa-arrow { transform: translateX(3px); }
        a[style*="oliva-light"]:hover { background: var(--color-oliva) !important; }
        a[style*="transparent"]:hover { background: var(--color-preto) !important; color: var(--color-offwhite) !important; }
      `}</style>
    </a>
  )
}
```

> **Note:** Check `src/lib/constants.ts` and `src/lib/analytics.ts` to verify the exact exports expected — specifically `WHATSAPP_LINKS` and `trackWhatsapp`. If the exports are named differently (e.g., `WHATSAPP_URLS`), update the import accordingly. Do not change the constants or analytics files.

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors. If `WHATSAPP_LINKS` doesn't exist, read `src/lib/constants.ts` and update the import name to match what's there.

- [ ] **Step 4: Visual check**

Check hero CTA and nav CTA. Verify: pill shape, oliva-light background, trailing arrow.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/whatsapp-button.tsx
git commit -m "feat: update WhatsApp button to pill shape with ghost variant and trailing arrow"
```

---

### Task 16: Approach — Minor Alignment Fix

**Files:**
- Modify: `src/components/sections/approach.tsx`

- [ ] **Step 1: Read current approach.tsx**

Read `src/components/sections/approach.tsx`.

- [ ] **Step 2: Rewrite approach.tsx**

Replace entire content:

```tsx
import { approach } from "@/content/site-content"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Approach() {
  return (
    <section
      id="abordagem"
      style={{
        background: "var(--color-offwhite)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-oliva)", margin: 0 }}>
          {approach.eyebrow}
        </p>

        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.9rem, 3.5vw, 3rem)",
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "var(--color-preto)",
            margin: 0,
            textWrap: "balance",
            maxWidth: "16ch",
          }}
        >
          {approach.title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "60ch" }}>
          {approach.body.map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.65, color: "var(--color-cinza)", margin: 0 }}>
              {para}
            </p>
          ))}
        </div>

        <WhatsAppButton messageKey="schedule" label={approach.cta.label} />
      </div>
    </section>
  )
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Visual check**

Scroll to Approach section. Verify: centered, no glyph above eyebrow, 2 paragraphs, CTA.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/approach.tsx
git commit -m "feat: center approach section and update to site-content imports"
```

---

### Task 17: Cleanup — Remove old files

**Files:**
- Delete: `src/content/site-copy.ts`
- Delete: `src/components/ui/accordion.tsx`

- [ ] **Step 1: Verify no remaining imports of site-copy**

```bash
grep -r "site-copy" /Users/otavioaugusto/projects/anajulia-site/src/ 2>/dev/null
```

Expected: no output. If any files still import from `site-copy`, update them now before deleting.

- [ ] **Step 2: Verify no remaining imports of accordion.tsx (old)**

```bash
grep -r "from \"@/components/ui/accordion\"" /Users/otavioaugusto/projects/anajulia-site/src/ 2>/dev/null
```

Expected: no output (Services and FAQ now use `accordion-item`).

- [ ] **Step 3: Delete old files**

```bash
rm /Users/otavioaugusto/projects/anajulia-site/src/content/site-copy.ts
rm /Users/otavioaugusto/projects/anajulia-site/src/components/ui/accordion.tsx
```

- [ ] **Step 4: Full TypeScript check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npx tsc --noEmit 2>&1
```

Expected: no errors

- [ ] **Step 5: Build check**

```bash
cd /Users/otavioaugusto/projects/anajulia-site && npm run build 2>&1 | tail -20
```

Expected: successful build with no errors

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove legacy site-copy.ts and accordion.tsx"
```

---

## Self-Review

### Spec Coverage Check

| Spec item | Task |
|-----------|------|
| Color tokens (off-white-2, oliva-light, oliva-2, oliva-soft) | Task 1 |
| Cormorant Garamond font | Task 2 |
| site-content.ts migration | Task 3 |
| Nav: brand mark Ψ, blur, scroll border | Task 4 |
| Nav: full-screen mobile drawer | Task 4 |
| Hero: CSS grid, stamp, ribbon, metrics | Task 5 |
| Support section | Task 6 |
| Footer: ink, 4-column | Task 7 |
| AccordionItem (CSS-only) | Task 8 |
| Services: Lucide icons, no numbers | Task 9 |
| Reviews → static 5,0 + Google badge | Task 10 |
| About: photo caption, Cormorant lead, trajectory toggle | Task 11 |
| Mission: simplify, remove card/CTA | Task 12 |
| FAQ: CSS accordion, ghost CTA | Task 13 |
| Float WA: restyle to oliva-light | Task 14 |
| WA button: pill + ghost variant | Task 15 |
| Approach: centered, no glyph | Task 16 |
| Cleanup | Task 17 |

All spec items covered. No gaps.

### Type Consistency

- `AccordionItem` props defined in Task 8: `id`, `trigger`, `children`, `isOpen`, `onToggle`, `analyticsEvent?` — used in Tasks 9 and 13 with matching names.
- `WhatsAppButton` new prop: `variant?: "primary" | "ghost"` — used in Task 11.
- All content imports from `@/content/site-content` (not `site-copy`).
- `footer.columns[].links[].href` can be `null` (static text items in Atendimento) — handled with `link.href ? <a> : <span>` in Task 7.
