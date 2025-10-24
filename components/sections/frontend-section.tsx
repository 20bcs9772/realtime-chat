"use client";

import type React from "react";
import { useState } from "react";
import SkillModal from "@/components/skill-modal";

// import { MicroInteractionsPanel } from "./frontend/micro-interactions-panel";
import { Interactive3DUIPanel } from "./frontend/interactive-3d-ui-panel";
// import GSAPScrollSmoother from "./gsap-scroll-smoother";

function FullBleed({
  children,
  bg = "",
  className = "",
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
}) {
  // break out of container to true viewport width
  return (
    <section
      className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] ${bg} ${className}`}
    >
      {children}
    </section>
  );
}

export default function FrontendSection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 py-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Frontend & Animation
          </h2>
          <p className="mt-2 text-muted-foreground">
            Four full-screen interactive demos: Motion micro-interactions, an
            interactive 3D UI, smooth scrolling with GSAP, and dynamic parallax
            effects.
          </p>
        </div>
        <button
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted/40"
          onClick={() => setOpen(true)}
        >
          Learn more
        </button>
      </div>

      {/* Panel 1: Motion Micro‑Interactions */}
      {/* <FullBleed bg="border-y">
        <MicroInteractionsPanel />
      </FullBleed> */}

      {/* Panel 2: Interactive 3D UI */}
      <FullBleed>
        <Interactive3DUIPanel
          title="Interactive 3D UI"
          subtitle="Scroll to zoom & orbit. Hover to highlight."
        />
      </FullBleed>
{/* 
      <FullBleed className="border-t">
        <GSAPScrollSmoother />
      </FullBleed> */}

      <SkillModal
        open={open}
        onClose={() => setOpen(false)}
        title="Frontend & Animation"
        description="React, Next.js App Router, Tailwind CSS, Shadcn/UI, Framer Motion, GSAP, and three.js."
        github="#"
        demo="#"
      />
    </div>
  );
}
