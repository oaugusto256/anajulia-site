import assert from "node:assert/strict"
import { classifyChannel } from "../src/lib/channel.ts"

const self = "psicoanajulia.com.br"

// [utm_source, referrer, expected]
const cases: [string | null, string, string][] = [
  ["GBP", "", "gbp"],
  ["instagram", "https://www.google.com/", "instagram"],
  ["  ", "https://chatgpt.com/", "ai_chatgpt"],
  ["", "", "direct"],
  [null, "", "direct"],
  [null, "not a url", "direct"],
  [null, "https://www.google.com/", "organic_search"],
  [null, "https://www.google.com.br/", "organic_search"],
  [null, "https://gemini.google.com/app", "ai_gemini"],
  [null, "https://www.bing.com/search?q=x", "organic_search"],
  [null, "https://duckduckgo.com/", "organic_search"],
  [null, "https://br.search.yahoo.com/", "organic_search"],
  [null, "https://www.ecosia.org/", "organic_search"],
  [null, "https://chatgpt.com/", "ai_chatgpt"],
  [null, "https://chat.openai.com/", "ai_chatgpt"],
  [null, "https://www.perplexity.ai/", "ai_perplexity"],
  [null, "https://claude.ai/", "ai_claude"],
  [null, "https://copilot.microsoft.com/", "ai_copilot"],
  [null, "https://l.instagram.com/", "instagram"],
  [null, "https://instagram.com/", "instagram"],
  [null, "https://m.facebook.com/", "facebook"],
  [null, "https://l.facebook.com/", "facebook"],
  [null, "https://notgoogle.com/", "referral"],
  [null, "https://doctoralia.com.br/x", "referral"],
  [null, "https://psicoanajulia.com.br/luto-e-perdas", "internal"],
  [null, "https://www.psicoanajulia.com.br/", "internal"],
]

for (const [utmSource, referrer, expected] of cases) {
  assert.equal(
    classifyChannel({ utmSource, referrer, selfHost: self }),
    expected,
    `utm_source=${JSON.stringify(utmSource)} referrer=${JSON.stringify(referrer)}`,
  )
}
console.log(`check-channel: ${cases.length} cases passed`)
