"use client";
import { Button } from "@/components/ui/button";
import ParticlesCanvas from "@/components/particles";
import MatrixRain from "@/components/matrix-rain";

export default function Hero() {
  return (
    <section className="relative container mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="absolute inset-0 z-0">
        <ParticlesCanvas
          className="absolute inset-0"
          density={0.45}
          speed={0.7}
        />
        <MatrixRain
          className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none"
          speed={0.1}
          density={0.2}
          fontSize={13}
          color="#e1e1e1"
          trailAlpha={0.2}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 2px)",
          }}
        />
      </div>
      <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-pretty relative">
            <span className="relative">
              Madhav Bansal
              <span
                aria-hidden
                className="absolute inset-0 -z-10 blur-md"
              />
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
              boxShadow:
                "inset 0 0 20px #9d9e9d, 0 0 24px #9d9e8e",
            }}
          />
          <img
            alt="Preview placeholder"
            className="h-full w-full object-cover opacity-10"
            src="/abstract-minimal-code-pattern.jpg"
          />
        </div>
      </div>
    </section>
  );
}
