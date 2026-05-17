"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { aboutCopy } from "@/content/site-copy"
import { SectionContainer } from "@/components/ui/section-container"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export function About() {
  const [expanded, setExpanded] = useState(false)

  return (
    <SectionContainer id="sobre" className="bg-stone">
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
        {/* Text — 60% */}
        <div className="flex flex-col gap-6 md:flex-[1.5]">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-oliva">
            {aboutCopy.label}
          </p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] text-preto">
            {aboutCopy.title}
          </h2>
          {aboutCopy.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-base leading-[1.9] text-cinza">
              {paragraph}
            </p>
          ))}

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="flex items-center gap-2 text-sm text-preto underline underline-offset-4 transition-colors hover:text-oliva"
          >
            {aboutCopy.expandCta}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {/* Expanded trajectory */}
          {expanded && (
            <div className="flex flex-col gap-8 border-t border-linhas pt-6">
              <p className="text-base italic leading-[1.9] text-cinza">
                {aboutCopy.trajectory.intro}
              </p>
              {aboutCopy.trajectory.sections.map((section) => (
                <div key={section.title} className="flex flex-col gap-4">
                  <h3 className="font-heading text-xl font-semibold text-preto">
                    {section.title}
                  </h3>
                  {section.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-base leading-[1.9] text-cinza">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
              <WhatsAppButton
                messageKey="schedule"
                label={aboutCopy.trajectory.cta}
              />
            </div>
          )}
        </div>

        {/* Photo — 40% */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:flex-[1]">
          <Image
            src="/fotos/IMG_8114.jpg"
            alt="Ana Julia Vognach em seu consultório"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </div>
    </SectionContainer>
  )
}
