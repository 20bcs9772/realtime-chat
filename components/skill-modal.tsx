"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type SkillModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description: string
  github?: string
  demo?: string
}

export default function SkillModal({ open, onClose, title, description, github, demo }: SkillModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      window.addEventListener("keydown", onKey)
    }
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-modal-title"
      className="fixed inset-0 z-[60] grid place-items-center p-4"
    >
      <div className="fixed inset-0 bg-foreground/40" onClick={onClose} aria-hidden />
      <Card className="relative z-[61] w-full max-w-xl bg-card text-card-foreground shadow-lg border">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 id="skill-modal-title" className="text-lg font-semibold">
              {title}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              ✕
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {github && (
              <Button asChild variant="secondary">
                <a href={github} target="_blank" rel="noreferrer">
                  View GitHub
                </a>
              </Button>
            )}
            {demo && (
              <Button asChild>
                <a href={demo} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
