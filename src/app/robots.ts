import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// Search/retrieval agents that cite or link to the site. Listed explicitly so the
// policy is visible, even though "*" already allows them.
const SEARCH_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Bingbot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: SEARCH_AGENTS, allow: "/" },
      // Training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) are allowed via "*".
      // To opt out of AI training without affecting search, add:
      // { userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot"], disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
