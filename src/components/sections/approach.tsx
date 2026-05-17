import { approachCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { FadeIn } from "@/components/ui/fade-in"

export function Approach() {
  return (
    <SectionContainer className="bg-offwhite">
      <FadeIn>
        <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-oliva">
          {approachCopy.label}
        </p>
        <h2 className="font-heading mb-8 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
          {approachCopy.title}
        </h2>
        {approachCopy.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-6 text-base leading-[1.9] text-cinza">
            {paragraph}
          </p>
        ))}
        <WhatsAppButton messageKey="schedule" label={approachCopy.cta} />
        </div>
      </FadeIn>
    </SectionContainer>
  )
}
