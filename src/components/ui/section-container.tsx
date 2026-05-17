import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionContainer({
  children,
  className,
  id,
}: SectionContainerProps) {
  return (
    <section id={id} className={cn("w-full", className)}>
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 md:px-8 md:py-[120px]">
        {children}
      </div>
    </section>
  )
}
