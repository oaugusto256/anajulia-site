import { services } from "@/content/site-content";

export function Services() {

  return (
    <section
      id="servicos"
      style={{
        background: "var(--color-off-white-2)",
        borderTop: "1px solid var(--color-linhas)",
        paddingTop: "clamp(32px, 4vw, 52px)",
        paddingBottom: "clamp(16px, 2vw, 24px)",
        paddingLeft: "clamp(20px, 5vw, 60px)",
        paddingRight: "clamp(20px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header: 2-col desktop */}
        <div
          className="services-header"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
            marginBottom: "clamp(40px, 5vw, 64px)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--color-oliva)",
                marginBottom: 28,
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
              {services.eyebrow}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "var(--color-preto)",
                margin: 0,
              }}
            >
              {services.title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--color-cinza)",
                maxWidth: "48ch",
                margin: 0,
                marginTop: 10,
              }}
            >
              {services.intro}
            </p>
          </div>
          <div className="services-group" style={{ marginTop: 32 }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "var(--color-preto)",
                margin: 0,
              }}
            >
              {services.title2}
            </h2>
            {(Array.isArray(services.intro2) ? services.intro2 : [services.intro2]).map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: i === 0 ? 16 : 12,
                  lineHeight: 1.65,
                  color: i === 0 ? "var(--color-cinza)" : "var(--color-oliva-light)",
                  maxWidth: "48ch",
                  margin: 0,
                  marginTop: i === 0 ? 10 : 6,
                  fontStyle: i === 0 ? "normal" : "italic",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (min-width: 900px) {
          .services-header {
            grid-template-columns: 1fr 1fr !important;
            align-items: start;
          }
          .services-group {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
