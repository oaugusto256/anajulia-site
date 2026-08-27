# Plan — Testimonials: newest-first ordering + review date

Date: 2026-08-27
Branch: `feat/testimonials-latest-reviews` (off `fix/testimonials-google-places-caching`, PR #10)
Scope: bounded. Recommendation **A** from the spike — sort the 5 Places API
reviews by publish date, and surface each review's date in the UI.

## Background (spike result)

Google Places API (New) `places/{id}` returns **at most 5 reviews**, ranked by
relevance, with **no sort parameter and no pagination**. Confirmed against the
live place (`userRatingCount: 12`, 5 returned; `?rankPreference=NEWEST` and
`?reviews_sort=newest` both rejected/ignored).

Each review already carries:
- `publishTime` — ISO 8601 absolute timestamp (e.g. `2026-08-07T01:18:16Z`)
- `relativePublishTimeDescription` — localized relative string ("2 weeks ago")

So we cannot fetch reviews outside the relevance top-5, but we can order the 5
we get by date and display each date. No API/field-mask change needed —
`publishTime` is already in the `reviews` payload.

## Goal

1. Reviews render newest-first.
2. Each review card shows the date it was written, styled to match the
   editorial/calm tone (month + year, pt-BR).

## Non-goals

- Google Business Profile API / OAuth (option B) — separate future effort.
- Third-party scrapers (option C).
- Showing more than 5 reviews.
- Changing the 5-star / has-text filter.

## Changes

### 1. `src/lib/google-places.ts`

**Types**
- `GoogleReview`: add `publishTime?: string`.
- `PlaceReview`: add
  - `publishTime: string` — raw ISO, for `<time dateTime>`.
  - `publishedLabel: string` — formatted pt-BR month + year, capitalized
    (e.g. `"Agosto de 2026"`). Empty string when `publishTime` missing.

**Extract a pure mapper** (testable, no network):

```ts
export function normalizeReviews(raw: GoogleReview[]): PlaceReview[]
```

- filter: `r.text?.text && r.rating === 5` (unchanged)
- map: existing fields + `publishTime: r.publishTime ?? ""` +
  `publishedLabel: formatPublishedLabel(r.publishTime)`
- sort: `b.publishTime.localeCompare(a.publishTime)` — ISO 8601 sorts
  lexicographically = chronologically, newest first. Missing dates (`""`)
  sort last.

`formatPublishedLabel(iso?: string)`:
- `""` when falsy or `Number.isNaN(Date.parse(iso))`
- else `Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })`,
  first letter upper-cased.

`getPlaceData` calls `normalizeReviews(data.reviews ?? [])` instead of the
inline filter/map.

### 2. `src/components/ui/testimonials-carousel.tsx`

- Under the stars row (before the quote `<p>`), add a subtle date line:

```tsx
{review.publishedLabel && (
  <time
    dateTime={review.publishTime}
    style={{
      fontFamily: "var(--font-inter)",
      fontSize: 12,
      color: "var(--color-cinza)",
      letterSpacing: "0.02em",
    }}
  >
    {review.publishedLabel}
  </time>
)}
```

- No change to `truncate`, arrows, dots, Google link.
- The commented-out author block stays as-is (out of scope).

### 3. No content-source change

Dates come from the API, not copy — `site-content.ts` untouched, "no hardcoded
copy" rule respected.

## Testing

Node 24 ships `node:test` — no new dependency.

- `src/lib/google-places.test.ts` (run via `node --test`):
  - `normalizeReviews` orders newest-first given out-of-order fixture.
  - drops non-5-star and empty-text entries.
  - `publishedLabel` formats a known ISO to `"Agosto de 2026"`.
  - review with no `publishTime` → `publishedLabel === ""` and sorts last.
- Add `"test": "node --test"` script to `package.json` (or run ad hoc).
- `npx tsc --noEmit` — clean.
- `npm run build` — `/` stays `○ Static`, Revalidate `1d`.
- Grep prerendered `.next/server/app/index.html`: newest reviewer
  (Luana Mendes, 2026-08-07) appears first; a `<time` date label present.

## Rollout

- Commit on `feat/testimonials-latest-reviews`.
- PR targets `fix/testimonials-google-places-caching` (or `main` if #10
  merged first).
- No env / Vercel changes.

## Risk

- Low. Pure additive: two optional fields, one sort, one `<time>` element.
- If `publishTime` ever absent for all reviews, order falls back to API
  relevance order and no date renders — same as today.
