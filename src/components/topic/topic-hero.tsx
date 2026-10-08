import type { TopicPage } from "@/content/site-content"

export function TopicHero({ eyebrow, title, intro }: TopicPage["hero"]) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 56 }}>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-oliva)",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ display: "inline-block", width: 28, height: 1, background: "var(--color-oliva)", flexShrink: 0 }} />
        {eyebrow}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 500,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "var(--color-preto)",
          margin: 0,
          textWrap: "balance",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontSize: "clamp(1.25rem, 1.8vw, 1.45rem)",
          lineHeight: 1.35,
          color: "var(--color-preto)",
          margin: 0,
        }}
      >
        {intro}
      </p>
    </div>
  )
}
