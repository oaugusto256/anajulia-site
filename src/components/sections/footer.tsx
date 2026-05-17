import { Mail } from "lucide-react"
import { footerCopy } from "@/content/site-copy"

function InstagramIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="w-full bg-preto">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-heading text-base font-semibold text-offwhite">
            {footerCopy.name}
          </p>
          <p className="mt-1 text-sm text-offwhite/50">{footerCopy.crp}</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a
            href={footerCopy.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Ana Julia Vognach"
            className="flex items-center gap-2 text-sm text-offwhite/60 transition-colors hover:text-offwhite"
          >
            <InstagramIcon />
            {footerCopy.instagram}
          </a>
          <a
            href={`mailto:${footerCopy.email}`}
            aria-label={`Enviar e-mail para ${footerCopy.email}`}
            className="flex items-center gap-2 text-sm text-offwhite/60 transition-colors hover:text-offwhite"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {footerCopy.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
