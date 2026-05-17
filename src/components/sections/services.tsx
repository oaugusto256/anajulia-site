"use client"

import { useState } from "react"
import {
  Monitor, User, Briefcase, BatteryLow, Baby, Sunset, ClipboardList,
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
        {/* Header: 2-col desktop */}
        <div
          className="services-header"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: "clamp(40px, 5vw, 64px)" }}
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
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.65, color: "var(--color-cinza)", paddingBottom: 24, paddingLeft: 48, maxWidth: "68ch", margin: 0 }}>
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
