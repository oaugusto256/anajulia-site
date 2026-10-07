import { brand } from "@/content/site-content"

/** wa.me link with a pre-filled message (plain text, encoded here). */
export function whatsappHref(message: string): string {
  return `https://wa.me/${brand.contact.whatsapp.raw}?text=${encodeURIComponent(message)}`
}
