// Single analytics interface. Phase A: events go to PostHog and GA4 (gtag).
// Phase B removes the gtag branch.

declare const gtag: ((command: string, action: string, params?: Record<string, string>) => void) | undefined

type Props = Record<string, string>
type CaptureClient = { capture: (event: string, props: Props, options?: { timestamp?: Date }) => unknown }

const posthogEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
// Events fired before PostHog finishes loading (it loads on idle) are kept here.
const MAX_QUEUE = 50
const queue: [string, Props, number][] = []
let client: CaptureClient | null = null

export function setAnalyticsClient(next: CaptureClient) {
  client = next
  for (const [event, props, at] of queue.splice(0)) next.capture(event, props, { timestamp: new Date(at) })
}

function pageContext(): Props {
  const props: Props = { page_path: window.location.pathname }
  const topic = document.querySelector("[data-topic]")?.getAttribute("data-topic")
  if (topic) props.topic = topic
  return props
}

function track(event: string, extra: Props = {}) {
  if (typeof window === "undefined") return
  const props = { ...extra, ...pageContext() }
  if (typeof gtag !== "undefined") gtag("event", event, props)
  if (client) client.capture(event, props)
  else if (posthogEnabled && queue.length < MAX_QUEUE) queue.push([event, props, Date.now()])
}

export function trackWhatsappClick(location: string) {
  track("whatsapp_click", { location })
}

export function trackFaqExpand(id: string) {
  track("faq_expand", { id })
}

export function trackServicesExpand(id: string) {
  track("services_expand", { id })
}

export function trackScroll75() {
  track("scroll_75")
}
