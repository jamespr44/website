"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { createLiquid, liquidTime } from "@/lib/liquid";

/** Full-bleed iridescent liquid. Renders at half resolution, pauses off-screen, holds a still frame for reduced motion. */
export function IridescentBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionSafe();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const liquid = createLiquid(canvas);
    if (!liquid) {
      setFailed(true);
      return;
    }

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      liquid.resize(canvas.clientWidth * scale, canvas.clientHeight * scale);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let visible = true;
    const loop = () => {
      liquid.render(liquidTime());
      if (visible && !reduced) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 ${className}`}
      style={{
        background:
          "radial-gradient(60% 70% at 20% 30%, rgb(160,224,171), transparent 70%), radial-gradient(55% 65% at 70% 55%, rgb(255,172,46), transparent 70%), radial-gradient(70% 70% at 80% 10%, rgb(165,45,37), transparent 70%), #0a0605",
      }}
    >
      {!failed && <canvas ref={ref} className="block h-full w-full" />}
    </div>
  );
}
