import { missionCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { FadeIn } from "@/components/ui/fade-in"

export function Mission() {
  return (
    <SectionContainer className="bg-oliva-escuro">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-offwhite/60">
          {missionCopy.label}
        </p>
        <h2 className="font-heading mb-8 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-offwhite">
          {missionCopy.title}
        </h2>
        <p className="mb-10 text-base leading-[1.9] text-offwhite/80">
          {missionCopy.content}
        </p>
        <WhatsAppButton
          messageKey="schedule"
          label={missionCopy.cta}
          variant="inverse"
        />
        </div>
      </FadeIn>
    </SectionContainer>
  )
}
