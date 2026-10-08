import type { MetadataRoute } from "next"
import { contentUpdatedAt } from "@/content/site-content"
import { absoluteUrl } from "@/lib/seo"
import { publishedTopicPages, topicPath } from "@/lib/topics"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: contentUpdatedAt, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/privacidade"), lastModified: contentUpdatedAt, changeFrequency: "yearly", priority: 0.3 },
    ...publishedTopicPages().map((page) => ({
      url: absoluteUrl(topicPath(page)),
      lastModified: page.reviewedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
