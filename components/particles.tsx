"use client";

import { useEffect, useRef } from "react";

type Props = {
  density?: number; // particles per 10k px^2
  speed?: number; // base speed multiplier
  className?: string;
};

export default function ParticlesCanvas({
  density = 0.6,
  speed = 1,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runningRef = useRef(false);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number }[]
  >([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const parent = canvas.parentElement;
    if (!parent) return;

    function fit() {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(width, height);
    }

    function seed(w: number, h: number) {
      const area = w * h;
      const count = Math.min(
        250,
        Math.max(30, Math.floor((area / 10000) * density))
      );
      particlesRef.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4 * speed,
        vy: (Math.random() - 0.5) * 0.4 * speed,
      }));
    }

    function step() {
      if (!runningRef.current) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const pts = particlesRef.current;
      const pointer = pointerRef.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // pointer repulsion
        if (pointer) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const r = 120;
          if (d2 < r * r) {
            const f = (r - Math.sqrt(d2)) / r;
            p.vx += (dx / (Math.sqrt(d2) + 0.0001)) * 0.08 * f;
            p.vy += (dy / (Math.sqrt(d2) + 0.0001)) * 0.08 * f;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // bounds + soft wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle =
          getComputedStyle(document.documentElement).getPropertyValue(
            "--color-muted-foreground"
          ) || "rgba(0,0,0,.5)";
        ctx.fill();
      }

      // subtle linking lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i],
            b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            ctx.globalAlpha = Math.max(0, 1 - d2 / (120 * 120)) * 0.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle =
              getComputedStyle(document.documentElement).getPropertyValue(
                "--color-border"
              ) || "rgba(0,0,0,.15)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      requestAnimationFrame(step);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    function onPointerLeave() {
      pointerRef.current = null;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    resizeObserverRef.current = new ResizeObserver(fit);
    resizeObserverRef.current.observe(parent);

    ioRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        runningRef.current = entry.isIntersecting;
        if (runningRef.current) requestAnimationFrame(step);
      },
      { threshold: 0.05 }
    );
    ioRef.current.observe(canvas);

    fit();

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      resizeObserverRef.current?.disconnect();
      ioRef.current?.disconnect();
      runningRef.current = false;
    };
  }, [density, speed]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

export { ParticlesCanvas };
