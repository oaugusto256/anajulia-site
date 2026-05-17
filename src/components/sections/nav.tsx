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

          {/* Desktop nav links — hidden on mobile via CSS */}
          <nav
            aria-label="Navegação principal"
            style={{ display: "none" }}
            className="nav-desktop-links"
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 14,
                  color: "var(--color-cinza)",
                  textDecoration: "none",
                  position: "relative",
                  paddingBottom: 2,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA — hidden on mobile via CSS */}
          <a
            href={nav.cta.href}
            className="nav-desktop-cta"
            style={{
              display: "none",
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              background: "var(--color-oliva-light)",
              color: "var(--color-offwhite)",
              borderRadius: 999,
              padding: "8px 20px",
              textDecoration: "none",
            }}
          >
            {nav.cta.label}
          </a>

          {/* Mobile burger */}
          <button
            aria-label={drawerOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="nav-mobile-burger"
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
          .nav-desktop-links {
            display: flex !important;
            align-items: center;
            gap: 32px;
          }
          .nav-desktop-cta {
            display: inline-block !important;
          }
          .nav-mobile-burger {
            display: none !important;
          }
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
        .nav-desktop-cta:hover { background: var(--color-oliva) !important; }
      `}</style>
    </>
  )
}
