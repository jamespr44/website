"use client";

import { type RefObject } from "react";
import { useScroll, type MotionValue } from "motion/react";

/**
 * Scroll progress (0 → 1) through a tall "pinned" container. It stays live under reduced motion: the reader drives it
 * with their own scrolling, so nothing moves unless they do.
 */
export function useScrub(target: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  return scrollYProgress;
}
