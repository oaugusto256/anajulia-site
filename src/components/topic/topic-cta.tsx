export function TopicCta({
  label,
  href,
  variant,
  location,
}: {
  label: string
  href: string
  variant: "primary" | "ghost"
  /** data-wa-location value for whatsapp_click tracking */
  location: string
}) {
  const colors =
    variant === "primary"
      ? { background: "var(--color-oliva-light)", color: "var(--color-offwhite)", border: "1px solid var(--color-oliva-light)" }
      : { background: "transparent", color: "var(--color-preto)", border: "1px solid var(--color-preto)" }
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
          ...colors,
        }}
      >
        {label}
      </a>
    </div>
  )
}
