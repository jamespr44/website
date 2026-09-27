"use client";

import { useEffect, useRef, useState } from "react";
import { createLiquid, liquidTime } from "@/lib/liquid";

/**
 * Full-bleed iridescent liquid. Renders at the display's full resolution and steps down only if frames run slow; pauses
 * off-screen; drifts slowly for reduced motion (see liquidTime). Without WebGL it falls back to a drifting CSS gradient.
 */
export function IridescentBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const liquid = createLiquid(canvas);
    if (!liquid) {
      setFailed(true);
      return;
    }

    // Pixels per CSS pixel. Starts sharp (capped at 2× so 4K laptops don't melt) and drops by a quarter whenever most
    // of a 40-frame window runs below ~40 fps.
    let scale = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => liquid.resize(canvas.clientWidth * scale, canvas.clientHeight * scale);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let visible = true;
    let last = 0;
    let frames = 0;
    let slow = 0;
    const loop = (now: number) => {
      const dt = last ? now - last : 0;
      last = now;
      if (dt > 0 && dt < 1000) {
        frames++;
        if (dt > 25) slow++;
        if (frames === 40) {
          if (slow > 24 && scale > 0.5) {
            scale = Math.max(0.5, scale * 0.75);
            resize();
          }
          frames = slow = 0;
        }
      }
      liquid.render(liquidTime());
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0;
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    // A hidden tab pauses rAF; don't count the gap as a slow frame.
    const onVisibility = () => (last = 0);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div aria-hidden className={`liquid-backdrop absolute inset-0 ${failed ? "liquid-drift" : ""} ${className}`}>
      {!failed && <canvas ref={ref} className="block h-full w-full" />}
    </div>
  );
}
