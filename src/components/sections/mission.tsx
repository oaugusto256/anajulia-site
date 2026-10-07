import { mission } from "@/content/site-content";

export function Mission() {
  const [lead, ...rest] = mission.paragraphs;

  return (
    <section
      id="missao"
      style={{
        background: "var(--color-oliva)",
        padding: "clamp(72px, 10vw, 120px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 32,
        }}
      >
        {/* Eyebrow */}
        <h2
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "rgba(253,251,247,0.5)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ display: "inline-block", width: 24, height: 1, background: "rgba(253,251,247,0.35)" }} />
          {mission.eyebrow}
          <span style={{ display: "inline-block", width: 24, height: 1, background: "rgba(253,251,247,0.35)" }} />
        </h2>

        {/* Lead */}
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
            lineHeight: 1.4,
            color: "rgba(253,251,247,0.95)",
            margin: 0,
          }}
        >
          {lead}
        </p>

        {/* Linha separadora */}
        <span
          style={{
            display: "block",
            width: 40,
            height: 1,
            background: "rgba(253,251,247,0.25)",
          }}
        />

        {/* Parágrafos restantes */}
        {rest.map((p, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
              lineHeight: 1.85,
              color: "rgba(253,251,247,0.72)",
              margin: 0,
            }}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
