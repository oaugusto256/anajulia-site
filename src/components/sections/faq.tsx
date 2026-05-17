"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { trackFaqExpand } from "@/lib/analytics"

export function FAQ() {
  return (
    <SectionContainer id="faq" className="bg-stone">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-heading mb-10 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
          {faqCopy.title}
        </h2>
        <Accordion className="mb-10 w-full">
          {faqCopy.items.map((item, index) => (
            <AccordionItem
              key={item.question}
              className="border-linhas"
            >
              <AccordionTrigger
                className="text-left text-base font-medium text-preto hover:text-oliva hover:no-underline"
                onClick={() => trackFaqExpand(item.question)}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-[1.7] text-cinza">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <WhatsAppButton messageKey="question" label={faqCopy.cta} />
      </div>
    </SectionContainer>
  )
}
