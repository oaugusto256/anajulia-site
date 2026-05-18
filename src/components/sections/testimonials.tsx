import { reviews } from "@/content/site-content";
import { getPlaceData } from "@/lib/google-places";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";

export async function Testimonials() {
  const placeData = await getPlaceData();
  const reviewCards = placeData?.reviews ?? [];
  const placeId = process.env.GOOGLE_PLACE_ID ?? "";
  const mapsUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : "https://www.google.com/maps";

  return (
    <section
      id="avaliacoes"
      style={{
        background: "var(--color-offwhite)",
        borderTop: "1px solid var(--color-linhas)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--color-cinza)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {reviews.eyebrow}
        </p>

        {/* Stars + rating number + Google attribution */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div
            aria-label={`${Math.round(placeData?.rating ?? reviews.stars)} estrelas`}
            style={{ display: "flex", gap: 4, color: "var(--color-gold)", fontSize: 22 }}
          >
            {Array.from({ length: Math.round(placeData?.rating ?? reviews.stars) }).map((_, i) => (
              <span key={i} aria-hidden="true">★</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 500, color: "var(--color-preto)", lineHeight: 1 }}>
              {placeData ? placeData.rating.toFixed(1).replace(".", ",") : reviews.rating}
            </span>
            <span style={{ width: 1, height: 18, background: "var(--color-linhas)", display: "inline-block" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <GoogleColorIcon />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: 12.5, color: "var(--color-cinza)" }}>
                no Google
              </span>
            </span>
          </div>
        </div>

        {/* Carousel with Google link at bottom, or static badge fallback */}
        {reviewCards.length > 0 ? (
          <TestimonialsCarousel reviews={reviewCards} mapsUrl={mapsUrl} />
        ) : (
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
            }}
          >
            <GoogleColorIcon />
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12.5,
                color: "var(--color-cinza)",
              }}
            >
              {reviews.source}
            </span>
          </a>
        )}
      </div>
    </section>
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
