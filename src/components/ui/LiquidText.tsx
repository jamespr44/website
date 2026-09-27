"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { liquidAvailable, setLiquidVisible, type LiquidSubscriber } from "@/lib/liquidRenderer";

/** How much wider than the figure the sampled patch is, so each number shows several colours of the liquid. */
const ZOOM = 2.4;

/**
 * Fills its text with the hero's moving liquid. The text stays real (selectable, read by screen readers); a canvas
 * behind it is knocked out through the glyphs by a blend-mode ink layer (see `.liquid-text` in globals.css).
 */
export function LiquidText({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionSafe();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!el || !canvas || !ctx) return;
    if (!liquidAvailable()) {
      setFallback(true);
      return;
    }

    const size = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    const sub: LiquidSubscriber = {
      still: reduced,
      draw(source, vw, vh) {
        const r = el.getBoundingClientRect();
        const kx = source.width / vw;
        const ky = source.height / vh;
        const sw = Math.min(source.width, r.width * kx * ZOOM);
        const sh = Math.min(source.height, r.height * ky * ZOOM);
        const cx = (r.left + r.width / 2) * kx;
        const cy = (r.top + r.height / 2) * ky;
        const sx = Math.min(Math.max(0, cx - sw / 2), source.width - sw);
        const sy = Math.min(Math.max(0, cy - sh / 2), source.height - sh);
        ctx.drawImage(source, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      },
    };
    const io = new IntersectionObserver(([e]) => setLiquidVisible(sub, e.isIntersecting));
    io.observe(el);

    return () => {
      io.disconnect();
      ro.disconnect();
      setLiquidVisible(sub, false);
    };
  }, [reduced]);

  return (
    <span ref={wrap} className={`liquid-text ${fallback ? "liquid-fallback" : ""}`}>
      <canvas ref={canvasRef} aria-hidden className="liquid-canvas" />
      <span className="liquid-ink">{children}</span>
    </span>
  );
}
