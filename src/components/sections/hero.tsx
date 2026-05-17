import Image from "next/image"
import { heroCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function Hero() {
  return (
    <SectionContainer className="bg-offwhite">
      <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* Text — 60% */}
        <div className="flex flex-col gap-6 md:flex-[1.5]">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-oliva">
            {heroCopy.label}
          </p>
          <h1
            className="font-heading text-[clamp(2.75rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-preto"
          >
            {heroCopy.title}
          </h1>
          <p className="text-base leading-[1.9] text-cinza">
            {heroCopy.subtitle}
          </p>
          <p className="border-l-2 border-oliva pl-4 text-base italic leading-[1.9] text-preto">
            {heroCopy.italicHighlight}
          </p>
          <p className="text-base leading-[1.9] text-cinza">
            {heroCopy.supportText}
          </p>
          <ul className="flex flex-col gap-2">
            {heroCopy.supportList.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-[1.7] text-cinza">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oliva" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <WhatsAppButton messageKey="schedule" label={heroCopy.cta} />
          </div>
        </div>

        {/* Photo — 40% */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-auto md:flex-[1] md:self-stretch">
          <Image
            src="/fotos/IMG_8209.jpg"
            alt="Ana Julia Vognach, psicóloga clínica"
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </SectionContainer>
  )
}
