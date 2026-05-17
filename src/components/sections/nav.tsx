"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { navCopy } from "@/content/site-copy"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-linhas bg-offwhite">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 md:px-8">
        <span className="font-heading text-base font-semibold text-preto">
          {navCopy.name}
        </span>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {navCopy.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cinza transition-colors hover:text-preto"
            >
              {link.label}
            </a>
          ))}
          <WhatsAppButton messageKey="schedule" label={navCopy.cta} />
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex items-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? (
            <X className="h-5 w-5 text-preto" />
          ) : (
            <Menu className="h-5 w-5 text-preto" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-linhas bg-offwhite px-5 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4" aria-label="Menu mobile">
            {navCopy.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base text-cinza"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <WhatsAppButton
              messageKey="schedule"
              label={navCopy.cta}
              className="mt-2 text-center"
            />
          </nav>
        </div>
      )}
    </header>
  )
}
