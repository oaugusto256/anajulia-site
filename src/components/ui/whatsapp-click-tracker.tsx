"use client"

import { useEffect } from "react"
import { trackWhatsappClick } from "@/lib/analytics"

// Where on the page the clicked link lives, e.g. "hero", "faq", "nav", "float".
function linkLocation(link: Element): string {
  const tagged = link.closest("[data-wa-location]")
  if (tagged) return tagged.getAttribute("data-wa-location") ?? "unknown"
  if (link.closest("header")) return "nav"
  if (link.closest("footer")) return "footer"
  return link.closest("section[id]")?.id ?? "unknown"
}

export function WhatsAppClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null
      const link = target?.closest('a[href^="https://wa.me/"]')
      if (link) trackWhatsappClick(linkLocation(link))
    }
    document.addEventListener("click", handleClick, { capture: true })
    return () => document.removeEventListener("click", handleClick, { capture: true })
  }, [])

  return null
}
