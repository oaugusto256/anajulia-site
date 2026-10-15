export function TopicCta({
  label,
  href,
  location,
  variant = "solid",
}: {
  label: string
  href: string
  /** data-wa-location value for whatsapp_click tracking */
  location: string
  /** "outline": secondary call inside a section, quieter than the page's main CTA */
  variant?: "solid" | "outline"
}) {
  const outline = variant === "outline"
  return (
    <div
      data-wa-location={location}
      style={outline ? { marginTop: 6 } : { textAlign: "center", margin: "8px 0 56px" }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          fontFamily: "var(--font-inter)",
          fontSize: 15,
          borderRadius: 999,
          padding: "14px 28px",
          textDecoration: "none",
          background: outline ? "transparent" : "var(--color-oliva-2)",
          color: outline ? "var(--color-oliva-2)" : "var(--color-offwhite)",
          border: "1px solid var(--color-oliva-2)",
        }}
      >
        {label}
      </a>
    </div>
  )
}
