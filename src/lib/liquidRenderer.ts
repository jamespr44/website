"use client";

import { createLiquid, liquidTime, type Liquid } from "./liquid";

/**
 * One offscreen liquid shared by every liquid-filled figure. It is sized to the viewport's aspect, so each figure can
 * copy the patch "behind" it and the page reads as one continuous sheet of liquid. Frames are drawn only while an
 * animated subscriber is on screen.
 */
export type LiquidSubscriber = {
  /** Copy the part of the shared liquid this subscriber needs. */
  draw: (source: HTMLCanvasElement, viewportW: number, viewportH: number) => void;
  /** Draw once when shown instead of animating (reduced motion). */
  still: boolean;
};

const WIDTH = 720;
let liquid: Liquid | null | undefined;
const visible = new Set<LiquidSubscriber>();
let raf = 0;

function ensure(): Liquid | null {
  if (liquid !== undefined) return liquid;
  liquid = createLiquid(document.createElement("canvas"), { ink: 0.35, vignette: 0 });
  return liquid;
}

function sizeToViewport(l: Liquid) {
  const h = Math.round((WIDTH * window.innerHeight) / Math.max(1, window.innerWidth));
  if (l.canvas.width !== WIDTH || l.canvas.height !== h) l.resize(WIDTH, h);
}

function paint(subs: Iterable<LiquidSubscriber>) {
  const l = ensure();
  if (!l) return;
  sizeToViewport(l);
  l.render(liquidTime());
  for (const s of subs) s.draw(l.canvas, window.innerWidth, window.innerHeight);
}

function loop() {
  const animated = [...visible].filter((s) => !s.still);
  if (animated.length === 0) {
    raf = 0;
    return;
  }
  paint(animated);
  raf = requestAnimationFrame(loop);
}

/** Returns false when WebGL is unavailable (the caller should fall back to a CSS fill). */
export function liquidAvailable() {
  return ensure() !== null;
}

export function setLiquidVisible(sub: LiquidSubscriber, isVisible: boolean) {
  if (!isVisible) {
    visible.delete(sub);
    return;
  }
  visible.add(sub);
  if (sub.still) paint([sub]);
  else if (!raf) raf = requestAnimationFrame(loop);
}
