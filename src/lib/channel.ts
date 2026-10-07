// Erasable TypeScript only and no imports: scripts/check-channel.ts runs this file
// directly with Node's native type stripping.

export type ChannelInput = {
  utmSource: string | null
  referrer: string
  selfHost: string
}

// Order matters: gemini.google.com must win over the generic google.* rule below.
const REFERRER_RULES: { channel: string; domains: string[] }[] = [
  { channel: "ai_gemini", domains: ["gemini.google.com"] },
  { channel: "ai_chatgpt", domains: ["chatgpt.com", "chat.openai.com"] },
  { channel: "ai_perplexity", domains: ["perplexity.ai"] },
  { channel: "ai_claude", domains: ["claude.ai"] },
  { channel: "ai_copilot", domains: ["copilot.microsoft.com"] },
  { channel: "instagram", domains: ["instagram.com"] },
  { channel: "facebook", domains: ["facebook.com"] },
  { channel: "organic_search", domains: ["bing.com", "duckduckgo.com", "search.yahoo.com", "ecosia.org"] },
]

// google.com, google.com.br, www.google.de, …
const GOOGLE_HOST = /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/

const stripWww = (host: string) => host.toLowerCase().replace(/^www\./, "")
const hostIs = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

export function classifyChannel({ utmSource, referrer, selfHost }: ChannelInput): string {
  const utm = utmSource?.trim().toLowerCase()
  if (utm) return utm
  if (!referrer) return "direct"

  let host: string
  try {
    host = stripWww(new URL(referrer).hostname)
  } catch {
    return "direct"
  }

  // A reload or full navigation inside the site: keep it out of "direct".
  if (host === stripWww(selfHost)) return "internal"

  for (const rule of REFERRER_RULES) {
    if (rule.domains.some((domain) => hostIs(host, domain))) return rule.channel
  }
  if (GOOGLE_HOST.test(host)) return "organic_search"
  return "referral"
}
