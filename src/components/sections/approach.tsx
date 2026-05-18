import { approach } from "@/content/site-content"

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

        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.9rem, 3.5vw, 3rem)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--color-preto)", margin: 0, textWrap: "balance" as const, maxWidth: "20ch" }}>
          {approach.title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "60ch" }}>
          {approach.body.map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.65, color: "var(--color-cinza)", margin: 0 }}>
              {para}
            </p>
          ))}
        </div>

        <a
          href={approach.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--color-oliva-light)",
            color: "var(--color-offwhite)",
            borderRadius: 999,
            padding: "12px 24px",
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          {approach.cta.label} →
        </a>
      </div>
    </section>
  )
}
