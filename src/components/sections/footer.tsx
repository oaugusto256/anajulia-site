import { footer, brand } from "@/content/site-content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contato"
      style={{
        background: "#111111",
        padding: "clamp(60px, 8vw, 80px) clamp(20px, 5vw, 60px) 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Main columns */}
        <div
          className="footer-columns"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            paddingBottom: "clamp(48px, 6vw, 64px)",
          }}
        >
          {/* Col 1: Brand */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(253,251,247,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(253,251,247,0.8)",
                fontFamily: "var(--font-playfair)",
                fontSize: 20,
              }}
            >
              {brand.symbol}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: 17,
                  color: "rgba(253,251,247,0.9)",
                  lineHeight: 1.3,
                }}
              >
                {footer.brand.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(253,251,247,0.6)",
                  marginTop: 4,
                }}
              >
                {footer.brand.sub}
              </div>
            </div>
          </div>

          {/* Cols 2–4: Contato, Navegação, Atendimento */}
          {footer.columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(253,251,247,0.6)",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {col.links.map((link, i) => {
                  const href = (link as { href?: string | null }).href;
                  const icon = (link as { icon?: string }).icon;
                  const external = (link as { external?: boolean }).external;

                  return (
                    <li key={i}>
                      {href ? (
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: 14,
                            color: "rgba(253,251,247,0.8)",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            lineHeight: 1.4,
                          }}
                        >
                          {icon && <FooterIcon name={icon} />}
                          {link.label}
                        </a>
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: 14,
                            color: "rgba(253,251,247,0.8)",
                            lineHeight: 1.4,
                          }}
                        >
                          {link.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal bar */}
        <div
          style={{
            borderTop: "1px solid rgba(253,251,247,0.15)",
            padding: "20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px 20px" }}>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12.5,
                color: "rgba(253,251,247,0.55)",
              }}
            >
              {footer.legal.copyright.replace("{YEAR}", String(year))}
            </span>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12.5,
                color: "rgba(253,251,247,0.35)",
              }}
            >
              ·
            </span>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12.5,
                color: "rgba(253,251,247,0.55)",
              }}
            >
              Desenvolvido por{" "}
              <a
                href="https://github.com/oaugusto256"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 12.5,
                  color: "rgba(253,251,247,0.7)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Otávio Silva
              </a>
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 12.5,
              color: "rgba(253,251,247,0.55)",
            }}
          >
            {footer.legal.registry}
          </span>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .footer-columns {
            grid-template-columns: 1.2fr 1fr 1fr 1fr !important;
            gap: 56px !important;
            align-items: start;
          }
        }
        @media (max-width: 899px) {
          .footer-columns {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-columns > div:first-child,
          .footer-columns > div:nth-child(2) {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterIcon({ name }: { name: string }) {
  const style: React.CSSProperties = {
    width: 16,
    height: 16,
    flexShrink: 0,
    color: "rgba(253,251,247,0.7)",
  };

  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  }
  if (name === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  return null;
}
