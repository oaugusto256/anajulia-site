"use client"

import type { ReactNode } from "react"
import { trackFaqExpand, trackServicesExpand } from "@/lib/analytics"

type AccordionEvent = "faq_expand" | "services_expand"

const trackers: Record<AccordionEvent, (id: string) => void> = {
  faq_expand: trackFaqExpand,
  services_expand: trackServicesExpand,
}

interface AccordionItemProps {
  id: string
  trigger: ReactNode
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
  analyticsEvent?: AccordionEvent
  /** Heading level wrapping the trigger (WAI-ARIA accordion pattern). */
  headingLevel?: 2 | 3 | 4
}

export function AccordionItem({
  id,
  trigger,
  children,
  isOpen,
  onToggle,
  analyticsEvent,
  headingLevel = 3,
}: AccordionItemProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4"

  function handleToggle() {
    if (analyticsEvent && !isOpen) trackers[analyticsEvent](id)
    onToggle()
  }

  return (
    <div style={{ borderBottom: "1px solid var(--color-linhas)" }}>
      <Heading style={{ margin: 0, font: "inherit" }}>
      <button
        type="button"
        id={`accordion-trigger-${id}`}
        aria-controls={`accordion-body-${id}`}
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="accordion-trigger"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 28px",
          alignItems: "center",
          width: "100%",
          padding: "20px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
          paddingInlineStart: isOpen ? 8 : 4,
          transition: "padding-inline-start 0.25s ease",
        }}
      >
        {trigger}
        <span
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            color: "var(--color-oliva)",
            fontSize: 20,
            fontWeight: 300,
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.35s ease",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
      </Heading>

      <div
        id={`accordion-body-${id}`}
        role="region"
        inert={!isOpen}
        aria-labelledby={`accordion-trigger-${id}`}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.5s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          {children}
        </div>
      </div>

      <style>{`
        .accordion-trigger:hover {
          background: rgba(74, 93, 78, 0.05);
        }
      `}</style>
    </div>
  )
}
