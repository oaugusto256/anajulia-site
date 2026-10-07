import { topicPages, type TopicPage } from "@/content/site-content"

export function isPublished(page: TopicPage): boolean {
  return page.status === "published"
}

export function publishedTopicPages(): TopicPage[] {
  return topicPages.filter(isPublished)
}

export function findTopicPage(slug: string): TopicPage | undefined {
  return topicPages.find((page) => page.slug === slug)
}

export function publishedTopicForArea(areaId: string): TopicPage | undefined {
  return topicPages.find((page) => page.areaId === areaId && isPublished(page))
}

export function topicPath(page: TopicPage): string {
  return `/${page.slug}`
}
