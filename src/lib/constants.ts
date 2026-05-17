const WHATSAPP_NUMBER = "5551982831876"

export const WHATSAPP_MESSAGES = {
  schedule:
    "Olá, Ana Julia. Vi seu site e gostaria de agendar uma conversa inicial.",
  question:
    "Olá, Ana Julia. Vi seu site e gostaria de tirar uma dúvida sobre como funciona o seu acompanhamento antes de agendar.",
}

export function whatsappUrl(message: keyof typeof WHATSAPP_MESSAGES): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGES[message]
  )}`
}
