"use client"

import { useEffect } from "react"
import { setAnalyticsClient } from "@/lib/analytics"
import { classifyChannel } from "@/lib/channel"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

/** Loads PostHog on idle, after the page is interactive. No-op without a key. */
export function AnalyticsProvider() {
  useEffect(() => {
    if (!POSTHOG_KEY) return
    let cancelled = false

    async function start() {
      const { default: posthog } = await import("posthog-js")
      if (cancelled || !POSTHOG_KEY) return
      const session = {
        channel: classifyChannel({
          utmSource: new URLSearchParams(window.location.search).get("utm_source"),
          referrer: document.referrer,
          selfHost: window.location.hostname,
        }),
        landing_page: window.location.pathname,
      }
      posthog.init(POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://eu.posthog.com",
        persistence: "memory",
        disable_session_recording: true,
        person_profiles: "identified_only",
        capture_pageview: "history_change",
        autocapture: true,
        // Runs before the initial $pageview is sent, so it already carries channel.
        loaded: (ph) => ph.register(session),
      })
      setAnalyticsClient(posthog)
    }

    const run = () => {
      start().catch(() => {})
    }
    let idleHandle: number | undefined
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined
    if ("requestIdleCallback" in window) idleHandle = window.requestIdleCallback(run)
    else timeoutHandle = setTimeout(run, 1)

    return () => {
      cancelled = true
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle)
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle)
    }
  }, [])

  return null
}
