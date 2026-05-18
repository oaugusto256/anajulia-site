import { reviews } from "@/content/site-content"
import { getPlaceData, type PlaceReview } from "@/lib/google-places"

export async function Testimonials() {
  const placeData = await getPlaceData()

  const rating = placeData?.rating ?? reviews.rating
  const totalRatings = placeData?.totalRatings ?? 0
  const reviewCards = placeData?.reviews ?? []

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
          maxWidth: 1100,
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

        {/* Stars */}
        <div
          aria-label={`${reviews.stars} estrelas`}
          style={{ display: "flex", gap: 4, color: "var(--color-oliva)", fontSize: 22 }}
        >
          {Array.from({ length: reviews.stars }).map((_, i) => (
            <span key={i} aria-hidden="true">★</span>
          ))}
        </div>

        {/* Rating number */}
        <div
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            fontWeight: 500,
            color: "var(--color-preto)",
            lineHeight: 1,
          }}
        >
          {typeof rating === "number" ? rating.toFixed(1).replace(".", ",") : reviews.rating}
          {totalRatings > 0 && (
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                fontWeight: 400,
                color: "var(--color-cinza)",
                marginLeft: 12,
              }}
            >
              ({totalRatings} avaliações)
            </span>
          )}
        </div>

        {/* Google badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--color-linhas)",
            borderRadius: 999,
            padding: "6px 14px",
          }}
        >
          <GoogleColorIcon />
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 12.5, color: "var(--color-cinza)" }}>
            {reviews.source}
          </span>
        </div>

        {/* Review cards */}
        {reviewCards.length > 0 && (
          <div
            className="reviews-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 16,
              width: "100%",
              marginTop: 16,
              textAlign: "left",
            }}
          >
            {reviewCards.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 700px) {
          .reviews-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1000px) {
          .reviews-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}

function ReviewCard({ review }: { review: PlaceReview }) {
  return (
    <div
      style={{
        background: "var(--color-off-white-2)",
        border: "1px solid var(--color-linhas)",
        borderRadius: 8,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AuthorAvatar name={review.authorName} photoUrl={review.authorPhotoUrl} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--color-preto)",
              lineHeight: 1.2,
            }}
          >
            {review.authorName}
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 11.5,
              color: "var(--color-cinza)",
              lineHeight: 1,
            }}
          >
            {review.relativeTime}
          </span>
        </div>
      </div>

      {/* Stars */}
      <div style={{ display: "flex", gap: 2, color: "var(--color-oliva)", fontSize: 13 }}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <span key={i} aria-hidden="true">★</span>
        ))}
      </div>

      {/* Text */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--color-cinza)",
          margin: 0,
        }}
      >
        {review.text}
      </p>
    </div>
  )
}

function AuthorAvatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const initial = name.charAt(0).toUpperCase()

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        width={36}
        height={36}
        style={{ borderRadius: "50%", flexShrink: 0, objectFit: "cover" }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "var(--color-oliva-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-playfair)",
        fontSize: 15,
        color: "var(--color-oliva)",
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  )
}

function GoogleColorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Google">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
