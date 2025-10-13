"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  speed?: number; // 0.5 - 2.0 typical
  density?: number; // 0.3 - 1.2 typical
  fontSize?: number; // px
  color?: string; // rgba color (overrides theme colors if provided)
  trailAlpha?: number; // 0.05 - 0.2 typical
  lightColor?: string;
  darkColor?: string;
};

const CHARSET =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function MatrixRain({
  className,
  speed = 1.0,
  density = 0.8,
  fontSize = 14,
  color, // when provided, use directly
  trailAlpha = 0.15,
  lightColor = "rgba(0, 120, 60, 0.7)", // visible on light bg
  darkColor = "rgba(0, 255, 135, 0.7)", // original green for dark
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dropsRef = useRef<number[]>([]);
  const colsRef = useRef<number>(0);

  const textColorRef = useRef<string>(color || darkColor);
  const fadeFillRef = useRef<string>("rgba(0,0,0,0.15)");

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const updateThemeColors = () => {
      if (color) {
        textColorRef.current = color;
        // keep a neutral fade; trails look fine over both modes when overriding color explicitly
        fadeFillRef.current = `rgba(0,0,0,${Math.max(
          0,
          Math.min(1, trailAlpha)
        )})`;
        return;
      }
      const isDark = document.documentElement.classList.contains("dark");
      textColorRef.current = isDark ? darkColor : lightColor;
      fadeFillRef.current = isDark
        ? `rgba(0,0,0,${Math.max(0, Math.min(1, trailAlpha))})`
        : `rgba(255,255,255,${Math.max(0, Math.min(1, trailAlpha))})`;
    };

    updateThemeColors();
    const mo = new MutationObserver(updateThemeColors);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      const parent = canvas.parentElement || canvas;
      const { clientWidth, clientHeight } = parent;
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

      ctx.fillStyle = fadeFillRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const colWidth = fontSize;
      const cols = colsRef.current;
      const baseStep = Math.max(1, (dt / (16.67 / speed)) | 0);

      for (let i = 0; i < cols; i++) {
        const x = i * colWidth;
        const char = CHARSET.charAt((Math.random() * CHARSET.length) | 0);
        ctx.fillStyle = textColorRef.current; // live color
        const y = dropsRef.current[i] * fontSize;
        ctx.fillText(char, x, y);

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
      mo.disconnect();
    };
  }, [speed, density, fontSize, color, trailAlpha, lightColor, darkColor]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
