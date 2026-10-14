"use client";

import { useState } from "react";
import type { PlaceReview } from "@/lib/google-places";

const MAX_CHARS = 280;

function truncate(text: string) {
  if (text.length <= MAX_CHARS) return text;
  return text.slice(0, MAX_CHARS).trimEnd() + "…";
}

const arrowStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "1px solid var(--color-linhas)",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "var(--color-oliva)",
  padding: 0,
  flexShrink: 0,
};

export function TestimonialsCarousel({
  reviews,
  mapsUrl,
}: {
  reviews: PlaceReview[];
  mapsUrl: string;
}) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (index: number) => {
    if (index === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 200);
  };

  const prev = () => goTo(current === 0 ? reviews.length - 1 : current - 1);
  const next = () => goTo(current === reviews.length - 1 ? 0 : current + 1);

  const review = reviews[current];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          style={{
            background: "var(--color-off-white-2)",
            border: "1px solid var(--color-linhas)",
            borderRadius: 8,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            textAlign: "left",
          }}
        >
          {/* Stars */}
          <div style={{ display: "flex", gap: 2, color: "var(--color-gold)", fontSize: 14 }}>
            {Array.from({ length: review.rating }).map((_, i) => (
              <span key={i} aria-hidden="true">
                ★
              </span>
            ))}
          </div>
          {/* Text */}
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 14.5,
              lineHeight: 1.65,
              fontStyle: "italic",
              color: "var(--color-cinza)",
              margin: 0,
            }}
          >
            <span
              style={{
                fontSize: 25,
                fontStyle: "normal",
                fontFamily: "var(--font-playfair)",
                lineHeight: 0,
              }}
            >
              &ldquo;
            </span>
            {truncate(review.text)}
            <span
              style={{
                fontSize: 25,
                fontStyle: "normal",
                fontFamily: "var(--font-playfair)",
                lineHeight: 0,
              }}
            >
              &rdquo;
            </span>
          </p>
        </div>
      </div>

      {/* Arrows + dots */}
      {reviews.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={prev} aria-label="Depoimento anterior" style={arrowStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div style={{ display: "flex", alignItems: "center" }}>
            {reviews.map((_, i) => (
              // 24×24 hit area (WCAG 2.5.8 target size) around the 6px visual dot.
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir para depoimento ${i + 1}`}
                style={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: i === current ? 22 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: i === current ? "var(--color-oliva)" : "var(--color-linhas)",
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                />
              </button>
            ))}
          </div>

          <button onClick={next} aria-label="Próximo depoimento" style={arrowStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Google link at bottom */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--color-linhas)",
          borderRadius: 999,
          padding: "6px 14px",
          textDecoration: "none",
          marginTop: 4,
        }}
      >
        <GoogleColorIcon />
        <span
          style={{ fontFamily: "var(--font-inter)", fontSize: 12.5, color: "var(--color-cinza)" }}
        >
          Ver todas avaliações
        </span>
      </a>
    </div>
  );
}

function GoogleColorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
