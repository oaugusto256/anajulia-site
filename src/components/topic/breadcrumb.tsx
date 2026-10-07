import Link from "next/link"
import { topicPageUi } from "@/content/site-content"

export function Breadcrumb({ label }: { label: string }) {
  return (
    <nav aria-label={topicPageUi.breadcrumbAriaLabel} style={{ marginBottom: 40 }}>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-cinza)",
        }}
      >
        <li>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            {topicPageUi.breadcrumbHome}
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" style={{ color: "var(--color-oliva)" }}>
          {label}
        </li>
      </ol>
    </nav>
  )
}
