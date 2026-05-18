import { mission } from "@/content/site-content";

export function Mission() {
  return (
    <section
      id="missao"
      style={{
        background: "var(--color-oliva)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "rgba(253,251,247,0.8)",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            alignSelf: "center",
          }}
        >
          {mission.eyebrow}
        </p>

        <blockquote
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
            lineHeight: 1.35,
            color: "rgba(253,251,247,0.95)",
            maxWidth: "65ch",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "normal",
              fontSize: "4rem",
              color: "rgba(253,251,247,0.95)",
              lineHeight: 0.5,
            }}
          >
            &ldquo;
          </span>
          {mission.quote}
          <span
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "normal",
              fontSize: "4rem",
              color: "rgba(253,251,247,0.95)",
              lineHeight: 0.5,
            }}
          >
            &rdquo;
          </span>
        </blockquote>
      </div>
    </section>
  );
}
