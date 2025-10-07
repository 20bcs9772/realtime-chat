"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import SkillModal from "@/components/skill-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MorphingShape from "@/components/morphing-shape"
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('./3d-section'), {
  ssr: false,
});

export default function FrontendSection() {
  const [open, setOpen] = useState(false)
  const [boxBig, setBoxBig] = useState(false)

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Frontend & Animation</h2>
          <p className="mt-2 text-muted-foreground">
            Stacked demos: morphing & draggable shape, responsive layout preview, and a Shadcn box with size toggle.
          </p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Learn more
        </Button>
      </div>

      {/* Row 1: Framer Motion morph + drag */}
      <Card className="mt-6 p-5">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground mb-3">{"Click to morph, drag the shape"}</div>
            <motion.div
              drag
              dragConstraints={{ left: -60, right: 60, top: -60, bottom: 60 }}
              whileTap={{ scale: 0.98 }}
              className="grid place-items-center h-[220px] bg-muted/40 rounded-md"
            >
              <MorphingShape />
            </motion.div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Framer Motion</h3>
            <p className="mt-2 text-muted-foreground">
              Smooth spring transitions, drag interactions, and shape morphing for delightful micro‑interactions.
            </p>
          </div>
        </div>
      </Card>

      {/* Row 2: Responsive UI preview */}
      <Card className="mt-6 p-5">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground mb-3">{"Resize preview (stack → columns)"}</div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <ThreeScene />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Responsive UI</h3>
            <p className="mt-2 text-muted-foreground">
              Mobile‑first layouts using Tailwind responsive utilities with semantic tokens for consistent theming.
            </p>
          </div>
        </div>
      </Card>

      {/* Row 3: Shadcn interactive box with dynamic size */}
      <Card className="mt-6 p-5">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground mb-3">{"Click the box to change its dimensions"}</div>
            <div className="grid place-items-center h-[220px]">
              <motion.button
                aria-label="Toggle box size"
                onClick={() => setBoxBig((b) => !b)}
                animate={{ width: boxBig ? 160 : 96, height: boxBig ? 160 : 96, borderRadius: boxBig ? 24 : 8 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
                className="bg-primary/90 text-primary-foreground"
                style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Shadcn/UI</h3>
            <p className="mt-2 text-muted-foreground">
              Accessible components with motion‑powered interactions. This box animates size and radius on click.
            </p>
          </div>
        </div>
      </Card>

      <SkillModal
        open={open}
        onClose={() => setOpen(false)}
        title="Frontend & Animation"
        description="Built with React, Next.js App Router, Tailwind CSS, Shadcn/UI, and Framer Motion."
        github="#"
        demo="#"
      />
    </div>
  )
}
