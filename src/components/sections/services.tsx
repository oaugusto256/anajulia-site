"use client"

import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { servicesCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { trackServicesExpand } from "@/lib/analytics"

export function Services() {
  return (
    <SectionContainer id="servicos" className="bg-stone">
      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        {/* Accordion — 60% */}
        <div className="flex flex-col gap-8 md:flex-[1.5]">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-oliva">
              {servicesCopy.label}
            </p>
            <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
              {servicesCopy.title}
            </h2>
          </div>
          <Accordion multiple={false} className="w-full">
            {servicesCopy.items.map((item, index) => (
              <AccordionItem
                key={item.title}
                value={`item-${index}`}
                className="border-linhas"
              >
                <AccordionTrigger
                  className="text-left text-base font-medium text-preto hover:text-oliva hover:no-underline"
                  onClick={() => trackServicesExpand(item.title)}
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-[1.7] text-cinza">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <WhatsAppButton messageKey="schedule" label={servicesCopy.cta} />
        </div>

        {/* Photo — 40% | appears above on mobile (order-first), right on desktop */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:flex-[1] md:self-start md:sticky md:top-24 order-first md:order-last">
          <Image
            src="/fotos/IMG_8194.jpg"
            alt="Consultório de Ana Julia Vognach"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </SectionContainer>
  )
}
