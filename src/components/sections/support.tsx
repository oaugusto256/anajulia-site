import { support } from "@/content/site-content"

export function Support() {
  return (
    <section
      id="suporte"
      style={{
        background: "var(--color-offwhite)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(40px, 6vw, 80px)",
        }}
        className="support-grid"
      >
        {/* Pull-quote */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              lineHeight: 1.25,
              color: "var(--color-preto)",
              maxWidth: "22ch",
              margin: 0,
              position: "relative",
              paddingTop: "2.5rem",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "3.2em",
                color: "var(--color-oliva)",
                lineHeight: 0.6,
              }}
            >
              "
            </span>
            {support.pullQuote}
          </p>
        </div>

        {/* Intro + bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--color-cinza)",
              maxWidth: "50ch",
              margin: 0,
            }}
          >
            {support.intro}
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {support.bullets.map((bullet, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "14px 1fr",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "1px solid var(--color-linhas)",
                  fontFamily: "var(--font-inter)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--color-cinza)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--color-oliva)",
                    marginTop: 8,
                    flexShrink: 0,
                  }}
                />
                <span>
                  <strong style={{ color: "var(--color-preto)", fontWeight: 600 }}>{bullet.strong}</strong>
                  {bullet.rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @media (min-width: 980px) {
          .support-grid {
            grid-template-columns: 1.05fr 1fr !important;
            gap: clamp(60px, 8vw, 120px) !important;
          }
        }
      `}</style>
    </section>
  )
}
