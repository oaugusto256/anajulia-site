"use client"

import { trackWhatsappClick } from "@/lib/analytics"
import { whatsappUrl, WHATSAPP_MESSAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  messageKey: keyof typeof WHATSAPP_MESSAGES
  label: string
  className?: string
  variant?: "primary" | "ghost"
}

export function WhatsAppButton({
  messageKey,
  label,
  className,
  variant = "primary",
}: WhatsAppButtonProps) {
  return (
    <a
      href={whatsappUrl(messageKey)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir WhatsApp: ${label}`}
      onClick={() => trackWhatsappClick(label)}
      className={cn(
        "group inline-flex items-center gap-2 rounded-[999px] px-6 py-3.5 text-sm font-medium transition-all duration-200",
        variant === "primary" && [
          "bg-[var(--color-oliva-light)] text-[var(--color-offwhite)]",
          "hover:bg-[var(--color-oliva)]",
        ],
        variant === "ghost" && [
          "border border-[var(--color-preto)] bg-transparent text-[var(--color-preto)]",
          "hover:bg-[var(--color-preto)] hover:text-[var(--color-offwhite)]",
        ],
        className
      )}
    >
      {label}
      <span
        className="inline-block transition-transform duration-200 group-hover:translate-x-[3px]"
        aria-hidden="true"
      >
        →
      </span>
    </a>
  )
}
