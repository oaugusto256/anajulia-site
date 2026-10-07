"use client";

import { useState } from "react";
import { services } from "@/content/site-content";

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="servicos"
      style={{
        background: "var(--color-off-white-2)",
        borderTop: "1px solid var(--color-linhas)",
        paddingTop: "clamp(32px, 4vw, 52px)",
        paddingBottom: "clamp(40px, 5vw, 72px)",
        paddingLeft: "clamp(20px, 5vw, 60px)",
        paddingRight: "clamp(20px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Eyebrow */}
        <h2
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--color-oliva)",
            marginBottom: 24,
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
        </h2>

        {/* Accordion */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {services.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                key={i}
                style={{
                  borderBottom: "1px solid var(--color-linhas)",
                }}
              >
                <h3 style={{ margin: 0, font: "inherit" }}>
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "20px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                      fontWeight: 500,
                      color: isOpen ? "var(--color-oliva)" : "var(--color-preto)",
                      lineHeight: 1.3,
                      transition: "color 0.2s",
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "1px solid var(--color-linhas)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-oliva)",
                      fontSize: 18,
                      fontWeight: 300,
                      lineHeight: 1,
                      transition: "transform 0.25s",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                </h3>

                {/* Content */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.28s ease",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ paddingBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                      {(Array.isArray(item.body) ? item.body : [item.body]).map((p, j) => (
                        <p
                          key={j}
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: j === (Array.isArray(item.body) ? item.body.length - 1 : 0) && item.title === "Psicoterapia de Grupo" && j > 0
                              ? "var(--color-oliva-light)"
                              : "var(--color-cinza)",
                            margin: 0,
                            fontStyle: item.title === "Psicoterapia de Grupo" && j > 0 ? "italic" : "normal",
                          }}
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Observação */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--color-cinza)",
            fontStyle: "italic",
            marginTop: 28,
          }}
        >
          {services.tagline}
        </p>
      </div>
    </section>
  );
}
