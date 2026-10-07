import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { topicPageUi, topicPages } from "@/content/site-content"
import { Footer } from "@/components/sections/footer"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/topic/breadcrumb"
import { RelatedTopics } from "@/components/topic/related-topics"
import { ReviewLine } from "@/components/topic/review-line"
import { TopicCta } from "@/components/topic/topic-cta"
import { TopicFaq } from "@/components/topic/topic-faq"
import { TopicHero } from "@/components/topic/topic-hero"
import { TopicSection } from "@/components/topic/topic-section"
import { ScrollTracker } from "@/components/ui/scroll-tracker"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"
import { topicGraph } from "@/lib/schema"
import { buildMetadata } from "@/lib/seo"
import { findTopicPage, topicPath } from "@/lib/topics"
import { whatsappHref } from "@/lib/whatsapp"

type Props = { params: Promise<{ topic: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return topicPages.map((page) => ({ topic: page.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findTopicPage((await params).topic)
  if (!page) return {}
  return {
    ...buildMetadata({ title: page.seo.title, description: page.seo.description, path: topicPath(page) }),
    ...(page.status === "draft" ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function TopicRoute({ params }: Props) {
  const page = findTopicPage((await params).topic)
  if (!page) notFound()

  const href = whatsappHref(page.cta.whatsappMessage)
  const leading = page.sections.slice(0, 2)
  const trailing = page.sections.slice(2)

  return (
    <>
      <main data-topic={page.slug}>
        <JsonLd data={topicGraph(page)} />
        <ScrollTracker />
        <article
          style={{
            maxWidth: "68ch",
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 60px) clamp(40px, 6vw, 72px)",
            boxSizing: "content-box",
          }}
        >
          <Breadcrumb label={page.breadcrumbLabel} />
          <TopicHero {...page.hero} />
          {leading.map((section) => (
            <TopicSection key={section.heading} {...section} />
          ))}
          <TopicCta label={page.cta.label} href={href} variant="ghost" location="topic-soft" />
          {trailing.map((section) => (
            <TopicSection key={section.heading} {...section} />
          ))}
          <TopicCta label={page.cta.label} href={href} variant="primary" location="topic-end" />
          <TopicFaq heading={topicPageUi.faqHeading} items={page.faq} />
          <ReviewLine reviewedAt={page.reviewedAt} />
          <RelatedTopics slugs={page.related} />
        </article>
        <Footer />
      </main>
      <WhatsAppFloat href={href} />
    </>
  )
}
