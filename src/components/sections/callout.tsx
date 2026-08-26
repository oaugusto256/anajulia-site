const items = [
  "Tem carregado responsabilidades, preocupações e problemas que parecem difíceis de enfrentar sozinho(a).",
  "Tem a sensação de que está sempre tentando dar conta de tudo, mas nunca parece ser suficiente.",
  "Cuida de muitas pessoas e tarefas, mas encontra pouco espaço para cuidar de si.",
  "Vive um momento de perda, luto, adoecimento, maternidade ou outras transformações que têm impactado sua forma de ver e viver a vida.",
  "Sente-se triste, angustiado(a) ou percebe que já não se reconhece como antes.",
  "A vida mudou e você sente que perdeu o sentido das coisas, sem saber exatamente como reencontrar o seu caminho.",
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
      style={{ flexShrink: 0, marginTop: 4 }}
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "clamp(32px, 4vw, 48px)" }}>
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

        {/* Grid 2 linhas × 3 colunas */}
        <ul
          className="callout-items"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 14,
          }}
        >
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "16px 18px",
                borderRadius: 6,
                background: "rgba(253,251,247,0.06)",
                border: "1px solid rgba(253,251,247,0.10)",
              }}
            >
              <WaveIcon />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(253,251,247,0.85)",
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* Parágrafo final */}
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
            lineHeight: 1.7,
            color: "rgba(253,251,247,0.80)",
            margin: 0,
            marginTop: "clamp(32px, 4vw, 48px)",
            textAlign: "center",
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          A psicoterapia pode ser um espaço para compreender o que está acontecendo, acolher os sentimentos e encontrar novas formas de lidar com os desafios desse momento.
        </p>
      </div>

      <style>{`
        @media (min-width: 680px) {
          .callout-items {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
