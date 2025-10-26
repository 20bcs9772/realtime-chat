"use client"

import type React from "react"
import { cn } from "@/lib/utils"

type Props = {
  id?: string
  ariaLabel?: string
  className?: string
  children: React.ReactNode
}

export default function FullViewportSection({ id, ariaLabel, className = "", children }: Props) {
  // Full-bleed 100vw and min-h-screen while centered; breaks out of container constraints.
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] min-h-screen",
        "bg-background text-foreground flex items-center",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8 py-10 md:py-14">{children}</div>
    </section>
  )
}
