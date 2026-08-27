import { cache } from "react"

interface GoogleReview {
  rating?: number
  text?: { text?: string }
  relativePublishTimeDescription?: string
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
}

export interface PlaceData {
  rating: number
  totalRatings: number
  reviews: PlaceReview[]
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
      reviews: (data.reviews ?? [])
        .filter((r) => r.text?.text && r.rating === 5)
        .map((r) => ({
          authorName: r.authorAttribution?.displayName ?? "Cliente",
          authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
          rating: r.rating ?? 5,
          text: r.text!.text!,
          relativeTime: r.relativePublishTimeDescription ?? "",
        })),
    }
  } catch {
    return null
  }
})
