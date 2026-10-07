import { areas, brand, faq, llmsTxt, services, whatsappMessages } from "@/content/site-content"
import { SITE_URL, absoluteUrl } from "@/lib/seo"
import { asText } from "@/lib/text"
import { publishedTopicForArea, topicPath } from "@/lib/topics"
import { whatsappHref } from "@/lib/whatsapp"

export function buildLlmsTxt(): string {
  const loc = brand.location
  const lines = [
    `# ${brand.name}`,
    "",
    `> ${llmsTxt.summary}`,
    `> ${brand.crp} · ${loc.streetAddress}, ${loc.complement}, ${loc.neighborhood}, ${loc.city} – ${loc.region}, ${loc.postalCode} · ${loc.hoursLabel}`,
    "",
    `## ${llmsTxt.areasHeading}`,
    "",
    ...areas.items.map((item) => {
      const page = publishedTopicForArea(item.id)
      const title = page ? `[${item.title}](${absoluteUrl(topicPath(page))})` : item.title
      return `- ${title}: ${asText(item.body)}`
    }),
    "",
    `## ${llmsTxt.servicesHeading}`,
    "",
    services.tagline,
    "",
    ...services.items.map((item) => `- ${item.title}: ${asText(item.body)}`),
    "",
    `## ${llmsTxt.faqHeading}`,
    "",
    ...faq.items.flatMap((item) => [`### ${item.question}`, "", asText(item.answer), ""]),
    `## ${llmsTxt.contactHeading}`,
    "",
    `- ${llmsTxt.whatsappLabel}: ${whatsappHref(whatsappMessages.schedule)}`,
    `- ${llmsTxt.emailLabel}: ${brand.contact.email}`,
    `- ${llmsTxt.siteLabel}: ${SITE_URL}`,
  ]
  return `${lines.join("\n")}\n`
}
