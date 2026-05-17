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
          flexShrink: 0,
        }}
      >
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
        style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px", overflowY: "auto" }}
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
      <div style={{ padding: "24px 20px", paddingBottom: "max(24px, calc(24px + env(safe-area-inset-bottom)))", flexShrink: 0 }}>
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
          }}
        >
          {nav.cta.label}
        </a>
      </div>
    </div>
  )
}
