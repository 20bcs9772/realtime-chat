"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  speed?: number; // 0.5 - 2.0 typical
  density?: number; // 0.3 - 1.2 typical
  fontSize?: number; // px
  color?: string; // rgba color
  trailAlpha?: number; // 0.05 - 0.2 typical
};

const CHARSET =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function MatrixRain({
  className,
  speed = 1.0,
  density = 0.8,
  fontSize = 14,
  color = "rgba(0, 255, 135, 0.7)",
  trailAlpha = 0.15,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dropsRef = useRef<number[]>([]);
  const colsRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas.parentElement || canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const colWidth = fontSize;
      const cols = Math.max(1, Math.floor(clientWidth / colWidth));
      colsRef.current = cols;
      dropsRef.current = new Array(cols)
        .fill(0)
        .map(() => Math.floor(Math.random() * clientHeight));
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);

    let lastTime = performance.now();
    const render = (t: number) => {
      const dt = Math.min(50, t - lastTime);
      lastTime = t;

      // fade to create trail
      ctx.fillStyle = `rgba(0,0,0,${Math.max(0, Math.min(1, trailAlpha))})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const colWidth = fontSize;
      const cols = colsRef.current;
      const rows = Math.ceil(
        canvas.height / (fontSize * (window.devicePixelRatio || 1))
      );
      const baseStep = Math.max(1, (dt / (16.67 / speed)) | 0);

      for (let i = 0; i < cols; i++) {
        const x = i * colWidth;
        const char = CHARSET.charAt((Math.random() * CHARSET.length) | 0);
        ctx.fillStyle = color;
        const y = dropsRef.current[i] * fontSize;
        ctx.fillText(char, x, y);

        // advance drop with density and speed
        const advance = Math.max(
          1,
          Math.round(baseStep * (0.6 + Math.random() * 0.8))
        );
        if (y > canvas.height || Math.random() > 0.98 - density * 0.02) {
          dropsRef.current[i] = 0;
        } else {
          dropsRef.current[i] += advance;
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [speed, density, fontSize, color, trailAlpha]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
