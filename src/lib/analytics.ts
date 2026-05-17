declare const gtag: (
  command: string,
  action: string,
  params?: Record<string, string>
) => void

export function trackWhatsappClick(label: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", "whatsapp_click", { event_label: label })
  }
}

export function trackFaqExpand(question: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", "faq_expand", { event_label: question })
  }
}

export function trackServicesExpand(service: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", "services_expand", { event_label: service })
  }
}

export function trackScroll75() {
  if (typeof gtag !== "undefined") {
    gtag("event", "scroll_75")
  }
}
