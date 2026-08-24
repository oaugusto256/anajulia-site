import Image from "next/image";
import { approach } from "@/content/site-content";

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
        className="approach-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
        }}
      >
        {/* Text column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
            <span
              style={{
                display: "inline-block",
                width: 28,
                height: 1,
                background: "var(--color-oliva)",
                flexShrink: 0,
              }}
            />
            {approach.eyebrow}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "var(--color-preto)",
              margin: 0,
              textWrap: "balance" as const,
            }}
          >
            {approach.title}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {approach.body.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--color-cinza)",
                  margin: 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>

          <a
            href={approach.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="approach-cta"
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
              alignSelf: "flex-start",
            }}
          >
            {approach.cta.label} →
          </a>
        </div>

        {/* Photo column */}
        <div
          style={{
            borderRadius: 8,
            overflow: "hidden",
            aspectRatio: "4/3",
            position: "relative",
          }}
        >
          <Image
            src="/fotos/consultorio.jpg"
            alt="Consultório de Ana Julia Vognach — espaço de atendimento presencial em Florianópolis"
            fill
            sizes="(max-width: 860px) 100vw, 48vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      <style>{`
        .approach-cta:hover {
          background: var(--color-oliva) !important;
        }
        @media (min-width: 860px) {
          .approach-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
