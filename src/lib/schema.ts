import { areas, brand, faq, hero, meta, services } from "@/content/site-content"
import { SITE_URL, absoluteUrl } from "@/lib/seo"
import { asText } from "@/lib/text"

export type JsonLdNode = Record<string, unknown>

export const ids = {
  person: `${SITE_URL}/#person`,
  practice: `${SITE_URL}/#practice`,
  website: `${SITE_URL}/#website`,
}

export function pageId(path: string, fragment: string): string {
  return path === "/" ? `${SITE_URL}/#${fragment}` : `${SITE_URL}${path}#${fragment}`
}

export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes }
}

const photoUrl = absoluteUrl(`/${hero.photo.src}`)
const loc = brand.location

function personNode(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": ids.person,
    name: brand.name,
    jobTitle: brand.jobTitle,
    image: photoUrl,
    url: SITE_URL,
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: brand.credentials.license.name,
        credentialCategory: "license",
        recognizedBy: { "@type": "Organization", name: brand.credentials.license.issuer },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: brand.credentials.residency.name,
        credentialCategory: "residency",
      },
    ],
    knowsAbout: [
      ...areas.items.map((item) => item.title),
      ...services.items.map((item) => item.title),
      ...brand.knowsAboutExtra,
    ],
    sameAs: [brand.contact.instagram.href, loc.gbpUrl],
    worksFor: { "@id": ids.practice },
  }
}

function practiceNode(): JsonLdNode {
  return {
    "@type": "Psychologist",
    "@id": ids.practice,
    name: brand.name,
    description: meta.description,
    url: SITE_URL,
    image: photoUrl,
    telephone: `+${brand.contact.whatsapp.raw}`,
    email: brand.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${loc.streetAddress} — ${loc.complement}`,
      addressLocality: loc.city,
      addressRegion: loc.region,
      postalCode: loc.postalCode,
      addressCountry: loc.country,
    },
    ...(loc.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: loc.geo.lat, longitude: loc.geo.lng } }
      : {}),
    openingHoursSpecification: loc.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [
      { "@type": "City", name: loc.areaServed.city },
      ...loc.areaServed.places.map((name) => ({ "@type": "Place", name })),
      { "@type": "Country", name: loc.areaServed.country },
    ],
    founder: { "@id": ids.person },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: services.eyebrow,
      itemListElement: services.items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: asText(item.body),
          availableChannel: services.channels.map((name) => ({
            "@type": "ServiceChannel",
            name,
            serviceUrl: brand.contact.whatsapp.href,
          })),
        },
      })),
    },
    sameAs: [loc.gbpUrl, brand.contact.instagram.href],
  }
}

function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name: brand.name,
    url: SITE_URL,
    inLanguage: meta.language,
    publisher: { "@id": ids.person },
  }
}

export function siteGraph(): JsonLdNode {
  return graph(personNode(), practiceNode(), websiteNode())
}

export function webPageNode({
  path,
  name,
  description,
  about,
}: {
  path: string
  name: string
  description: string
  about?: JsonLdNode
}): JsonLdNode {
  return {
    "@type": "WebPage",
    "@id": pageId(path, "webpage"),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: meta.language,
    isPartOf: { "@id": ids.website },
    ...(about ? { about } : {}),
  }
}

export function faqPageNode(
  items: { question: string; answer: string | string[] }[],
  path: string,
): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": pageId(path, "faq"),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: asText(item.answer) },
    })),
  }
}

export function homeGraph(): JsonLdNode {
  return graph(
    webPageNode({
      path: "/",
      name: meta.title,
      description: meta.description,
      about: { "@id": ids.practice },
    }),
    faqPageNode(faq.items, "/"),
  )
}
