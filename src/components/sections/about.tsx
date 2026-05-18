"use client";

import { useState } from "react";
import Image from "next/image";
import { about } from "@/content/site-content";

export function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="sobre"
      style={{
        background: "var(--color-off-white-2)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        className="about-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(40px, 6vw, 80px)",
        }}
      >
        {/* Photo */}
        <div style={{ position: "relative", maxWidth: 480 }}>
          <div
            style={{
              aspectRatio: "4/5",
              borderRadius: 6,
              overflow: "hidden",
              background: "var(--color-oliva-soft)",
              position: "relative",
            }}
          >
            <Image
              src="/fotos/IMG_8114.jpg"
              alt={about.photo.alt}
              fill
              sizes="(max-width: 979px) min(480px, 100vw), min(480px, 40vw)"
              style={{
                objectFit: "cover",
                objectPosition: about.photo.objectPosition,
              }}
            />
          </div>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
            {about.eyebrow}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--color-preto)",
              margin: 0,
            }}
          >
            {about.title}
          </h2>

          {/* Lead — Cormorant italic */}
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "clamp(1.2rem, 1.4vw, 1.2rem)",
              lineHeight: 1.25,
              color: "var(--color-preto)",
              margin: 0,
            }}
          >
            {about.lead}
          </p>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--color-cinza)",
              margin: 0,
            }}
          >
            {about.body}
          </p>

          {/* Trajectory toggle */}
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--color-preto)",
              padding: "4px 0",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              color: "var(--color-preto)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                display: "inline-block",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              +
            </span>
            {expanded ? about.expandToggle.openLabel : about.expandToggle.closedLabel}
          </button>

          {/* Trajectory expand */}
          <div
            style={{
              maxHeight: expanded ? 2400 : 0,
              overflow: "hidden",
              transition: "max-height 0.55s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
                paddingTop: 16,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "var(--color-cinza)",
                  margin: 0,
                }}
              >
                {about.trajectory.intro}
              </p>

              {about.trajectory.sections.map((section, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h4
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
                      fontWeight: 500,
                      color: "var(--color-preto)",
                      margin: 0,
                    }}
                  >
                    {section.title}
                  </h4>
                  {section.body.map((para, j) => (
                    <p
                      key={j}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: 15,
                        lineHeight: 1.65,
                        color: "var(--color-cinza)",
                        margin: 0,
                      }}
                    >
                      {para}
                    </p>
                  ))}
                  {"cta" in section && section.cta && (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={section.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          borderRadius: 999,
                          padding: "10px 24px",
                          fontFamily: "var(--font-inter)",
                          fontSize: 14,
                          color: "var(--color-preto)",
                          border: "1px solid var(--color-preto)",
                          background: "transparent",
                          textDecoration: "none",
                        }}
                      >
                        {section.cta.label}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 980px) {
          .about-grid {
            grid-template-columns: 0.85fr 1.15fr !important;
            align-items: start;
          }
        }
      `}</style>
    </section>
  );
}
