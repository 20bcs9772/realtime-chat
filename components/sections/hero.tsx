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

      <div className="relative z-10 grid gap-8 md:gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-pretty leading-tight relative">
              <span className="relative">
                Madhav Bansal
                <span aria-hidden className="absolute inset-0 -z-10 blur-md" />
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
              Full Stack Developer — crafting high-performance UIs and robust
              backends for web, mobile, and cloud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <a href="#skills">Explore Skills</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/about">About Me</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="rounded-md border px-2 py-1">React</span>
            <span className="rounded-md border px-2 py-1">Next.js</span>
            <span className="rounded-md border px-2 py-1">Node.js</span>
            <span className="rounded-md border px-2 py-1">AWS</span>
          </div>
        </div>

        <div className="relative space-y-4">
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 to-accent/10 aspect-[16/12] flex flex-col items-center justify-center p-6 md:p-8">
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Interactive Portfolio
                  </p>
                  <p className="mt-2 text-2xl md:text-3xl font-bold text-pretty">
                    Modular Skill Demos
                  </p>
                </div>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Scroll down to explore interactive demonstrations of my
                  technical expertise
                </p>
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
              alt="Code pattern background"
              className="h-full w-full object-cover opacity-5"
              src="/abstract-minimal-code-pattern.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">2+</div>
              <p className="text-xs text-muted-foreground mt-1">
                Years Experience
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">10+</div>
              <p className="text-xs text-muted-foreground mt-1">
                Projects Built
              </p>
            </div>
          </div>
        </div>
      </div>
    </FullViewportSection>
  );
}
