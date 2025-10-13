"use client";
import { Button } from "@/components/ui/button";
import MatrixRain from "@/components/matrix-rain";
import FullViewportSection from "@/components/sections/full-viewport-section";

export default function Hero() {
  return (
    <FullViewportSection id="hero" className="snap-start">
      <div className="absolute inset-0 z-0">
        <MatrixRain
          className="absolute inset-0 pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-screen"
          speed={0.001}
          density={0.22}
          fontSize={16}
          trailAlpha={0.18}
          darkColor="#595959"
          lightColor="#454545"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.18) 100%), repeating-linear-gradient(0deg, color-mix(in oklch, var(--color-foreground) 6%, transparent) 0 1px, transparent 1px 2px)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklch, var(--color-background) 0%, transparent) 0%, var(--color-background) 80%)",
          }}
        />
      </div>

      <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-pretty relative">
            <span className="relative">
              Madhav Bansal
              <span aria-hidden className="absolute inset-0 -z-10 blur-md" />
            </span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Full Stack Developer — crafting high-performance UIs and robust
            backends for web, mobile, and cloud.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
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
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="rounded-md border px-2 py-1">React</span>
            <span className="rounded-md border px-2 py-1">Next.js</span>
            <span className="rounded-md border px-2 py-1">Node.js</span>
            <span className="rounded-md border px-2 py-1">Payload CMS</span>
            <span className="rounded-md border px-2 py-1">AWS</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border bg-card aspect-[16/12]">
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Interactive portfolio
              </p>
              <p className="mt-1 text-2xl font-semibold">Modular Skill Demos</p>
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg"
            style={{
              border: "1px solid #9d9e9d",
              boxShadow: "inset 0 0 20px #9d9e9d, 0 0 24px #9d9e8e",
            }}
          />
          <img
            alt="Preview placeholder"
            className="h-full w-full object-cover opacity-10"
            src="/abstract-minimal-code-pattern.jpg"
          />
        </div>
      </div>
    </FullViewportSection>
  );
}
