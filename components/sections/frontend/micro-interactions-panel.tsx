"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FullScreenSection } from "./fullscreen-section"
import { ParticlesCanvas } from "@/components/particles"

function RippleButton() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  return (
    <button
      onClick={(e) => {
        const rect = (e.target as HTMLButtonElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setRipples((r) => [...r, { id: Date.now(), x, y }])
        setTimeout(() => setRipples((r) => r.slice(1)), 600)
      }}
      className="relative overflow-hidden rounded-md bg-primary px-6 py-3 text-primary-foreground shadow-md"
    >
      <span className="relative z-10 font-medium">Click Ripple</span>
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.4, scale: 0 }}
            animate={{ opacity: 0, scale: 8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none absolute aspect-square w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/30"
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </AnimatePresence>
    </button>
  )
}

function ToggleMorph() {
  const [on, setOn] = useState(false)
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="group inline-flex items-center gap-3 rounded-full border px-4 py-2 bg-card text-card-foreground"
      aria-pressed={on}
    >
      <motion.span
        initial={false}
        animate={{ backgroundColor: on ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
        className="grid h-6 w-10 place-items-center rounded-full"
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="h-5 w-5 rounded-full bg-background shadow"
          style={{ alignSelf: on ? "flex-end" : "flex-start" }}
        />
      </motion.span>
      <motion.span
        initial={false}
        animate={{ color: on ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
        className="text-sm font-medium"
      >
        {on ? "On" : "Off"}
      </motion.span>
    </button>
  )
}

function TiltCard() {
  return (
    <motion.div
      className="rounded-xl border bg-card/60 p-6 backdrop-blur-md will-change-transform"
      onMouseMove={(e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width - 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `rotateX(${py * -8}deg) rotateY(${px * 10}deg) translateZ(0)`
      }}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)")}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <h4 className="text-lg font-semibold">Card Tilt</h4>
      <p className="mt-2 text-sm text-muted-foreground">
        Subtle 3D-tilt feedback that feels responsive and delightful.
      </p>
    </motion.div>
  )
}

export function MicroInteractionsPanel() {
  return (
    <FullScreenSection id="micro-interactions" ariaLabel="Micro interactions">
      <ParticlesCanvas className="pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
        <div className="flex items-center justify-center">
          <RippleButton />
        </div>
        <div className="flex items-center justify-center">
          <ToggleMorph />
        </div>
        <div className="flex items-center justify-center">
          <TiltCard />
        </div>
      </div>
    </FullScreenSection>
  )
}
