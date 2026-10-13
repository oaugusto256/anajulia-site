export function TopicCta({
  label,
  href,
  location,
}: {
  label: string
  href: string
  /** data-wa-location value for whatsapp_click tracking */
  location: string
}) {
  return (
    <div data-wa-location={location} style={{ textAlign: "center", margin: "8px 0 56px" }}>
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
          background: "var(--color-oliva-light)",
          color: "var(--color-offwhite)",
          border: "1px solid var(--color-oliva-light)",
        }}
      >
        {label}
      </a>
    </div>
  )
}
