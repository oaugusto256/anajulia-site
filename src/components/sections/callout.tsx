const items = [
  "A vida mudou e você sente que ainda está tentando encontrar seu lugar diante dessas mudanças.",
  "Tem carregado responsabilidades, preocupações e problemas que parecem difíceis de sustentar sozinho(a).",
  "Cuida de muitas pessoas e tarefas, mas encontra pouco espaço para cuidar de si.",
  "Vive um momento de perda, luto, adoecimento, maternidade ou outras transformações que têm impactado sua forma de ver e viver a vida.",
  "Sente que algo precisa mudar, mas ainda não sabe por onde começar.",
];

function WaveIcon() {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 6 }}
    >
      <path
        d="M1 6 C3.5 1, 6.5 1, 10 6 C13.5 11, 16.5 11, 19 6"
        stroke="rgba(253,251,247,0.65)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Callout() {
  return (
    <section
      style={{
        background: "var(--color-oliva)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        className="callout-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "start",
        }}
      >
        {/* Left: title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{
              display: "block",
              width: 32,
              height: 1,
              background: "rgba(253,251,247,0.4)",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
              lineHeight: 1.4,
              color: "rgba(253,251,247,0.95)",
              margin: 0,
            }}
          >
            Talvez você esteja vivendo algo parecido...
          </p>
        </div>

        {/* Right: list + paragraph */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {items.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  paddingBottom: i < items.length - 1 ? 18 : 0,
                  borderBottom: i < items.length - 1 ? "1px solid rgba(253,251,247,0.12)" : "none",
                }}
              >
                <WaveIcon />
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "rgba(253,251,247,0.85)",
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              lineHeight: 1.75,
              color: "rgba(253,251,247,0.65)",
              margin: 0,
              fontStyle: "italic",
              borderTop: "1px solid rgba(253,251,247,0.15)",
              paddingTop: 24,
            }}
          >
            A psicoterapia pode ser um espaço para compreender o que está acontecendo, acolher o sofrimento e construir novas formas de atravessar esse momento.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .callout-grid {
            grid-template-columns: 1fr 1.4fr !important;
          }
        }
      `}</style>
    </section>
  );
}
