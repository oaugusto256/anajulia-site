import { brand, topicPageUi } from "@/content/site-content"

// timeZone UTC: reviewedAt is a date-only ISO string; formatting in the build
// machine's zone (e.g. UTC−3) would shift it to the previous day.
const reviewDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" })

export function formatReviewDate(iso: string): string {
  return reviewDate.format(new Date(`${iso}T00:00:00Z`))
}

export function ReviewLine({ reviewedAt }: { reviewedAt: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: 13,
        lineHeight: 1.6,
        color: "var(--color-cinza)",
        borderTop: "1px solid var(--color-linhas)",
        paddingTop: 20,
        margin: "0 0 48px",
      }}
    >
      {topicPageUi.reviewedByLabel} {brand.name} · {brand.crp} ·{" "}
      <time dateTime={reviewedAt}>{formatReviewDate(reviewedAt)}</time>
    </p>
  )
}
