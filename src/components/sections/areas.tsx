"use client";

import { useState } from "react";
import Link from "next/link";
import { Monitor, User, Briefcase, BatteryLow, Baby, Sunset, ClipboardList, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { areas } from "@/content/site-content";
import { AccordionItem } from "@/components/ui/accordion-item";

const iconMap: Record<string, LucideIcon> = {
  monitor: Monitor,
  person: User,
  briefcase: Briefcase,
  "person-fatigue": BatteryLow,
  "person-with-child": Baby,
  horizon: Sunset,
  clipboard: ClipboardList,
  compass: Compass,
};

export function Areas({ topicLinks = {} }: { topicLinks?: Record<string, string> }) {
  const [openId, setOpenId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      id="areas"
      style={{
        background: "var(--color-off-white)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
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
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 28,
              height: 1,
              background: "var(--color-oliva)",
              flexShrink: 0,
            }}
          />
          {areas.eyebrow}
        </h2>

        <div>
          {areas.items.map((item) => {
            const Icon = iconMap[item.icon] ?? Monitor;
            const topicHref = topicLinks[item.id];
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
                    <span
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "clamp(1.15rem, 1.7vw, 1.5rem)",
                        color: "var(--color-preto)",
                        fontWeight: 500,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                }
              >
                <div style={{ paddingBottom: 24, paddingLeft: 48, maxWidth: "68ch", display: "flex", flexDirection: "column", gap: 12 }}>
                  {(Array.isArray(item.body) ? item.body : [item.body]).map((p, j) => (
                    <p
                      key={j}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: "var(--color-cinza)",
                        margin: 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                  {topicHref && (
                    <Link
                      href={topicHref}
                      aria-label={`${areas.linkLabel}: ${item.title}`}
                      style={{
                        alignSelf: "flex-start",
                        fontFamily: "var(--font-inter)",
                        fontSize: 14,
                        color: "var(--color-preto)",
                        textDecoration: "none",
                        borderBottom: "1px solid var(--color-preto)",
                        paddingBottom: 2,
                      }}
                    >
                      {areas.linkLabel}
                    </Link>
                  )}
                </div>
              </AccordionItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
