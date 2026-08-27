import { cache } from "react"

interface GoogleReview {
  rating?: number
  text?: { text?: string }
  relativePublishTimeDescription?: string
  publishTime?: string
  authorAttribution?: {
    displayName?: string
    photoUri?: string
  }
}

interface GooglePlaceResponse {
  rating?: number
  userRatingCount?: number
  reviews?: GoogleReview[]
}

export interface PlaceReview {
  authorName: string
  authorPhotoUrl: string | null
  rating: number
  text: string
  relativeTime: string
  /** Raw ISO 8601 timestamp from Google, or "" when absent. For <time dateTime>. */
  publishTime: string
  /** Formatted pt-BR month + year, e.g. "Agosto de 2026". "" when no date. */
  publishedLabel: string
}

export interface PlaceData {
  rating: number
  totalRatings: number
  reviews: PlaceReview[]
}

/** Format a Google ISO timestamp as a capitalized pt-BR "month de year" label. */
export function formatPublishedLabel(iso?: string): string {
  if (!iso || Number.isNaN(Date.parse(iso))) return ""
  const label = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/**
 * Filter to 5-star reviews with text, map to PlaceReview, and order newest-first.
 * ISO 8601 timestamps sort lexicographically, so a string compare is chronological;
 * reviews without a publishTime sort last.
 */
export function normalizeReviews(raw: GoogleReview[]): PlaceReview[] {
  return raw
    .filter((r) => r.text?.text && r.rating === 5)
    .map((r) => ({
      authorName: r.authorAttribution?.displayName ?? "Cliente",
      authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? 5,
      text: r.text!.text!,
      relativeTime: r.relativePublishTimeDescription ?? "",
      publishTime: r.publishTime ?? "",
      publishedLabel: formatPublishedLabel(r.publishTime),
    }))
    .sort((a, b) => b.publishTime.localeCompare(a.publishTime))
}

export const getPlaceData = cache(async (): Promise<PlaceData | null> => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!apiKey || !placeId) return null

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
      // revalidate: refetch from Google at most once per 24h (Vercel Data Cache,
      // shared across instances, persists across deploys).
      // tags: lets you force a refresh on demand via revalidateTag("google-reviews").
      next: { revalidate: 86400, tags: ["google-reviews"] },
    })

    if (!res.ok) return null

    const data: GooglePlaceResponse = await res.json()

    return {
      rating: data.rating ?? 5.0,
      totalRatings: data.userRatingCount ?? 0,
      reviews: normalizeReviews(data.reviews ?? []),
    }
  } catch {
    return null
  }
})
