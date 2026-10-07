export function TopicSection({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
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
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.75, color: "var(--color-cinza)", margin: 0 }}
        >
          {p}
        </p>
      ))}
    </section>
  )
}
