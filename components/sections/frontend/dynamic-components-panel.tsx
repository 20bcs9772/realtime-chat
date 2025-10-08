"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion, LayoutGroup } from "framer-motion"
import { FullScreenSection } from "./fullscreen-section"
import { ParticlesCanvas } from "@/components/particles"

type Item = { id: number; title: string; tag: "UI" | "Animation" | "Data" }

const SAMPLE: Item[] = [
  { id: 1, title: "Animated Accordion", tag: "UI" },
  { id: 2, title: "Motion Layout Grid", tag: "Animation" },
  { id: 3, title: "Search Suggestions", tag: "Data" },
  { id: 4, title: "Toast System", tag: "UI" },
  { id: 5, title: "Chart Transitions", tag: "Animation" },
  { id: 6, title: "Typeahead", tag: "Data" },
]

export function DynamicComponentsPanel() {
  const [active, setActive] = useState<"All" | Item["tag"]>("All")
  const items = useMemo(() => (active === "All" ? SAMPLE : SAMPLE.filter((i) => i.tag === active)), [active])

  const tabs: ("All" | Item["tag"])[] = ["All", "UI", "Animation", "Data"]

  return (
    <FullScreenSection id="dynamic-components" ariaLabel="Dynamic components">
      <ParticlesCanvas className="pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        <LayoutGroup>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActive(t)} className="relative rounded-full border px-4 py-2 text-sm">
                {t}
                {active === t && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {items.map((i) => (
                <motion.div
                  key={i.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -16 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="rounded-lg border bg-card p-5 text-card-foreground"
                >
                  <h4 className="text-base font-semibold">{i.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">Category: {i.tag}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </FullScreenSection>
  )
}
