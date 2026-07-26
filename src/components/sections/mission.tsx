import { mission } from "@/content/site-content";

export function Mission() {
  const [lead, ...rest] = mission.paragraphs;

  return (
    <section
      id="missao"
      style={{
        background: "var(--color-oliva)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "rgba(253,251,247,0.6)",
            marginBottom: 48,
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
              background: "rgba(253,251,247,0.4)",
              flexShrink: 0,
            }}
          />
          {mission.eyebrow}
        </p>

        {/* 2-col grid: lead à esquerda · restante à direita */}
        <div
          className="mission-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* Lead — destaque */}
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.25rem, 2.2vw, 1.7rem)",
              lineHeight: 1.45,
              color: "rgba(253,251,247,0.95)",
              margin: 0,
            }}
          >
            {lead}
          </p>

          {/* Parágrafos restantes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {rest.map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "rgba(253,251,247,0.78)",
                  margin: 0,
                  borderTop: i > 0 ? "1px solid rgba(253,251,247,0.1)" : "none",
                  paddingTop: i > 0 ? 20 : 0,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (min-width: 860px) {
          .mission-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
    </section>
  );
}
