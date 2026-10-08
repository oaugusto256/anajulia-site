import type { Metadata } from "next"
import { brand, privacy } from "@/content/site-content"
import { Footer } from "@/components/sections/footer"
import { JsonLd } from "@/components/seo/json-ld"
import { TopicSection } from "@/components/topic/topic-section"
import { formatReviewDate } from "@/components/topic/review-line"
import { ScrollTracker } from "@/components/ui/scroll-tracker"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"
import { graph, webPageNode } from "@/lib/schema"
import { buildMetadata } from "@/lib/seo"

const PATH = "/privacidade"

export const metadata: Metadata = buildMetadata({
  title: privacy.seo.title,
  description: privacy.seo.description,
  path: PATH,
})

export default function PrivacyPage() {
  return (
    <>
      <main>
        <JsonLd data={graph(webPageNode({ path: PATH, name: privacy.title, description: privacy.seo.description }))} />
        <ScrollTracker />
        <article
          style={{
            maxWidth: "68ch",
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 60px) clamp(40px, 6vw, 72px)",
            boxSizing: "content-box",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--color-preto)",
              margin: "0 0 12px",
            }}
          >
            {privacy.title}
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "var(--color-cinza)", margin: "0 0 48px" }}>
            {privacy.updatedLabel} <time dateTime={privacy.updatedAt}>{formatReviewDate(privacy.updatedAt)}</time>
          </p>
          {privacy.sections.map((section) => (
            <TopicSection key={section.heading} {...section} />
          ))}
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 16, margin: 0 }}>
            <a href={`mailto:${brand.contact.email}`} style={{ color: "var(--color-oliva)" }}>
              {brand.contact.email}
            </a>
          </p>
        </article>
        <Footer />
      </main>
      <WhatsAppFloat />
    </>
  )
}
