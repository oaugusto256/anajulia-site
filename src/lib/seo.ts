import type { Metadata } from "next"
import { brand, meta } from "@/content/site-content"

export const SITE_URL = "https://psicoanajulia.com.br"

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`
}

type BuildMetadataInput = {
  title: string
  description: string
  /** Path starting with "/", e.g. "/" or "/luto-e-perdas". */
  path: string
  image?: string
  /** Use the title as-is, without the " | Ana Julia Vognach" suffix (home page). */
  absoluteTitle?: boolean
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${brand.name}`
  const url = absoluteUrl(path)
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: fullTitle,
      description,
      siteName: meta.openGraph.siteName,
      locale: meta.openGraph.locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  }
}
