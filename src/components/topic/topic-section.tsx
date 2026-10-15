import type { TopicPage } from "@/content/site-content"
import { TopicCta } from "@/components/topic/topic-cta"
import { whatsappHref } from "@/lib/whatsapp"

const textStyle = { fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.75, color: "var(--color-cinza)", margin: 0 }

export function TopicSection({ heading, paragraphs, cta }: TopicPage["sections"][number]) {
  return (
    <section style={{ marginBottom: 48, display: "flex", flexDirection: "column", gap: 14 }}>
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)",
          fontWeight: 500,
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          color: "var(--color-preto)",
          margin: 0,
        }}
      >
        {heading}
      </h2>
      {paragraphs.map((p, i) =>
        typeof p === "string" ? (
          <p key={i} style={textStyle}>
            {p}
          </p>
        ) : (
          <ul key={i} style={{ ...textStyle, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {p.items.map((item) => (
              <li key={item.label}>
                <strong style={{ fontWeight: 500, color: "var(--color-preto)" }}>{item.label}</strong> {item.text}
              </li>
            ))}
          </ul>
        ),
      )}
      {cta && (
        <TopicCta label={cta.label} href={whatsappHref(cta.whatsappMessage)} location="topic-section" variant="outline" />
      )}
    </section>
  )
}
