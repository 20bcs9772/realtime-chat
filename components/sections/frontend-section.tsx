"use client";

import type React from "react";
import { Interactive3DUIPanel } from "./frontend/interactive-3d-ui-panel";

function FullBleed({
  children,
  bg = "",
  className = "",
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
}) {
  return (
    <section
      className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] ${bg} ${className}`}
    >
      {children}
    </section>
  );
}

export default function FrontendSection() {
  return (
    <div>
      <FullBleed>
        <Interactive3DUIPanel
          title="Interactive 3D UI"
          subtitle="Scroll to zoom & orbit. Hover to highlight."
        />
      </FullBleed>
    </div>
  );
}
