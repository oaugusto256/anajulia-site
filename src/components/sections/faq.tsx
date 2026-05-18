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
        <p style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-oliva)",
          marginBottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <span style={{ display: "inline-block", width: 28, height: 1, background: "var(--color-oliva)", flexShrink: 0 }} />
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
                <span style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
                  fontWeight: 500,
                  color: "var(--color-preto)",
                  lineHeight: 1.3,
                  textAlign: "left",
                }}>
                  {item.question}
                </span>
              }
            >
              <p style={{
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--color-cinza)",
                paddingBottom: 24,
                paddingRight: 32,
                maxWidth: "68ch",
                margin: 0,
              }}>
                {item.answer}
              </p>
            </AccordionItem>
          ))}
        </div>

        {/* Ghost CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a
            href={faq.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="faq-ghost-cta"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              color: "var(--color-preto)",
              border: "1px solid var(--color-preto)",
              borderRadius: 999,
              padding: "10px 24px",
              textDecoration: "none",
            }}
          >
            {faq.cta.label}
          </a>
        </div>

        <style>{`
          .faq-ghost-cta:hover {
            background: var(--color-preto) !important;
            color: var(--color-offwhite) !important;
          }
        `}</style>
      </div>
    </section>
  )
}
