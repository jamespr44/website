"use client";

import { type RefObject } from "react";
import { useMotionValue, useScroll, type MotionValue } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Scroll progress (0 → 1) through a tall "pinned" container.
 * With reduced motion enabled, it returns 1 so scenes render their final state.
 */
export function useScrub(target: RefObject<HTMLElement | null>): MotionValue<number> {
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  return reduced ? done : scrollYProgress;
}
