"use client"

import { useEffect, useRef } from "react"
import { trackScroll75 } from "@/lib/analytics"

export function ScrollTracker() {
  const fired = useRef(false)

  useEffect(() => {
    function handleScroll() {
      if (fired.current) return
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (scrolled / total >= 0.75) {
        fired.current = true
        trackScroll75()
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return null
}
