import { topicPages, type TopicPage } from "@/content/site-content"

export function isPublished(page: TopicPage): boolean {
  return page.status === "published"
}

export function publishedTopicPages(): TopicPage[] {
  return topicPages.filter(isPublished)
}

// Drafts exist on local builds and Vercel previews for review (spec 6.4),
// but must 404 in production until Ana Julia approves them.
export function servableTopicPages(): TopicPage[] {
  return process.env.VERCEL_ENV === "production" ? publishedTopicPages() : topicPages
}

export function findTopicPage(slug: string): TopicPage | undefined {
  return servableTopicPages().find((page) => page.slug === slug)
}

export function publishedTopicForArea(areaId: string): TopicPage | undefined {
  return topicPages.find((page) => page.areaId === areaId && isPublished(page))
}

export function topicPath(page: TopicPage): string {
  return `/${page.slug}`
}
