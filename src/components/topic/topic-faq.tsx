"use client"

import { useState } from "react"
import type { TopicPage } from "@/content/site-content"
import { AccordionItem } from "@/components/ui/accordion-item"

export function TopicFaq({ heading, items }: { heading: string; items: TopicPage["faq"] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section style={{ marginTop: 24, marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-oliva)",
          margin: "0 0 24px",
        }}
      >
        {heading}
      </h2>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          isOpen={openId === item.id}
          onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
          analyticsEvent="faq_expand"
          trigger={
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                fontWeight: 500,
                color: "var(--color-preto)",
                lineHeight: 1.3,
              }}
            >
              {item.question}
            </span>
          }
        >
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--color-cinza)",
              margin: 0,
              paddingBottom: 24,
              paddingRight: 32,
            }}
          >
            {item.answer}
          </p>
        </AccordionItem>
      ))}
    </section>
  )
}
