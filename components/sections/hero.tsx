"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative container mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-pretty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Madhav Bansal
          </motion.h1>
          <motion.p
            className="mt-3 text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Full Stack Developer — crafting high-performance UIs and robust backends for web, mobile, and cloud.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild>
              <a href="#skills">Explore Skills</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="mailto:bansalmadhav787@gmail.com">Email Me</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#" aria-disabled="true">
                Download Resume
              </a>
            </Button>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span className="rounded-md border px-2 py-1">React</span>
            <span className="rounded-md border px-2 py-1">Next.js</span>
            <span className="rounded-md border px-2 py-1">Node.js</span>
            <span className="rounded-md border px-2 py-1">Payload CMS</span>
            <span className="rounded-md border px-2 py-1">AWS</span>
          </motion.div>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-lg border bg-card aspect-[16/12]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Interactive portfolio</p>
              <p className="mt-1 text-2xl font-semibold">Modular Skill Demos</p>
            </div>
          </div>
          <img
            alt="Preview placeholder"
            className="h-full w-full object-cover opacity-10"
            src="/abstract-minimal-code-pattern.jpg"
          />
        </motion.div>
      </div>
    </section>
  )
}
