"use client"

import { useFadeIn } from "@/lib/use-fade-in"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useFadeIn()
  return (
    <div
      ref={ref}
      className={cn("fade-hidden", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
