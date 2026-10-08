import Link from "next/link"
import { topicPageUi, type TopicPage } from "@/content/site-content"
import { findTopicPage, isPublished, topicPath } from "@/lib/topics"

export function RelatedTopics({ slugs }: { slugs: string[] }) {
  const pages = slugs
    .map((slug) => findTopicPage(slug))
    .filter((page): page is TopicPage => page !== undefined && isPublished(page))
  if (pages.length === 0) return null

  return (
    <nav aria-label={topicPageUi.relatedHeading} style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-oliva)",
          margin: "0 0 16px",
        }}
      >
        {topicPageUi.relatedHeading}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {pages.map((page) => (
          <li key={page.slug}>
            <Link
              href={topicPath(page)}
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "1.1rem",
                color: "var(--color-preto)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-linhas)",
              }}
            >
              {page.hero.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
