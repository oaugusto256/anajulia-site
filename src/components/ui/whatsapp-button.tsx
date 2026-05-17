"use client"

import { trackWhatsappClick } from "@/lib/analytics"
import { whatsappUrl, WHATSAPP_MESSAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  messageKey: keyof typeof WHATSAPP_MESSAGES
  label: string
  className?: string
  variant?: "primary" | "inverse"
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
        "inline-block rounded-[10px] px-6 py-3.5 text-sm font-medium transition-all duration-200 hover:-translate-y-px hover:opacity-[0.94]",
        variant === "primary" &&
          "bg-oliva text-offwhite",
        variant === "inverse" &&
          "bg-offwhite text-preto",
        className
      )}
    >
      {label}
    </a>
  )
}
