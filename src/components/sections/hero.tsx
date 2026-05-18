import Image from "next/image";
import { hero } from "@/content/site-content";

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        background: "var(--color-offwhite)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
        }}
        className="hero-grid"
      >
        {/* Photo — shown first on mobile via CSS order */}
        <div className="hero-photo-wrap" style={{ position: "relative", maxWidth: 560 }}>
          <div
            style={{
              borderRadius: 6,
              overflow: "hidden",
              aspectRatio: "4/5",
              position: "relative",
              background: "var(--color-oliva-soft)",
            }}
          >
            <Image
              src="/fotos/IMG_8209.jpg"
              alt={hero.photo.alt}
              fill
              priority
              sizes="(max-width: 979px) min(380px, 100vw), min(560px, 48vw)"
              style={{ objectFit: "cover", objectPosition: hero.photo.objectPosition }}
            />
          </div>

          {/* Stamp */}
          <div
            className="hero-stamp"
            style={{
              position: "absolute",
              bottom: -28,
              left: -28,
              width: 132,
              height: 132,
              borderRadius: "50%",
              background: "var(--color-offwhite)",
              border: "1px solid var(--color-linhas)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 2,
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--color-cinza)",
              }}
            >
              Desde
            </span>
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 22,
                color: "var(--color-oliva)",
                lineHeight: 1,
              }}
            >
              2018
            </span>
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 11,
                color: "var(--color-oliva)",
                lineHeight: 1.3,
                maxWidth: 80,
                textAlign: "center",
              }}
            >
              {hero.stamp.line1}
              <br />
              {hero.stamp.line2}
            </span>
          </div>
        </div>

        {/* Text column */}
        <div className="hero-text" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--color-oliva)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: 0,
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
            {hero.eyebrow}
          </p>

          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)",
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: "var(--color-preto)",
              margin: 0,
            }}
          >
            {hero.title.plain}{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-oliva)" }}>
              {hero.title.italic}
            </em>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--color-cinza)",
              maxWidth: "56ch",
              margin: 0,
            }}
          >
            {hero.subtitle}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <a
              href={hero.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta"
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
              {hero.cta.label} →
            </a>
          </div>

          {/* Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: "1px solid var(--color-linhas)",
              paddingTop: 32,
              marginTop: 8,
              gap: 16,
            }}
          >
            {hero.metrics.map((m) => {
              const hasSup = m.value.endsWith("+") || m.value.endsWith("%");
              const base = hasSup ? m.value.slice(0, -1) : m.value;
              const sup = hasSup ? m.value.slice(-1) : null;
              return (
                <div key={m.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                      color: "var(--color-preto)",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {base}
                    {sup && (
                      <sup style={{ color: "var(--color-oliva)", fontSize: "0.55em" }}>{sup}</sup>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 12,
                      color: "var(--color-cinza)",
                      lineHeight: 1.4,
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          grid-template-areas: "photo" "text";
        }
        .hero-photo-wrap { grid-area: photo; }
        .hero-text { grid-area: text; }

        @media (min-width: 980px) {
          .hero-grid {
            grid-template-columns: 1.05fr 0.95fr !important;
            grid-template-areas: "text photo" !important;
            align-items: start;
          }
          .hero-photo-wrap {
            max-width: 560px !important;
          }
        }
        .hero-cta:hover { background: var(--color-oliva) !important; }
        @media (max-width: 979px) {
          .hero-stamp {
            width: 80px !important;
            height: 80px !important;
            bottom: -10px !important;
            left: -10px !important;
          }
          .hero-stamp span:last-child {
            font-size: 9px !important;
            max-width: 60px !important;
          }
          .hero-stamp span:nth-child(2) {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
