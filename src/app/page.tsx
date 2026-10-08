import type { Metadata } from "next"
import { areas, meta } from "@/content/site-content"
import { publishedTopicForArea, topicPath } from "@/lib/topics"
import { buildMetadata } from "@/lib/seo"
import { homeGraph } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = buildMetadata({
  title: meta.title,
  description: meta.description,
  path: "/",
  absoluteTitle: true,
})

import { Hero } from "@/components/sections/hero"
import { Callout } from "@/components/sections/callout"
import { About } from "@/components/sections/about"
import { Approach } from "@/components/sections/approach"
import { Services } from "@/components/sections/services"
import { Areas } from "@/components/sections/areas"
import { Mission } from "@/components/sections/mission"
import { Testimonials } from "@/components/sections/testimonials"
import { FAQ } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"
import { ScrollTracker } from "@/components/ui/scroll-tracker"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"

// Regenerate the page (and any server-side fetches it makes, e.g. Google Places
// reviews) at most once per 24h. Between regenerations Vercel serves cached HTML
// with zero function work and zero external API calls.
export const revalidate = 86400

// Resolved on the server so draft topic copy never enters the client bundle.
const topicLinks: Record<string, string> = {}
for (const item of areas.items) {
  const topic = publishedTopicForArea(item.id)
  if (topic) topicLinks[item.id] = topicPath(topic)
}

export default function Home() {
  return (
    <>
      <main>
        <JsonLd data={homeGraph()} />
        <ScrollTracker />
        <Hero />
        <Callout />
        <Approach />
        <Services />
        <Areas topicLinks={topicLinks} />
        <About />
        <Mission />
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
      <WhatsAppFloat />
    </>
  )
}
