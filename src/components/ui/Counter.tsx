"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export function Counter({ value, decimals = 0, prefix = "", suffix = "", duration = 1.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.19, 1, 0.22, 1],
      onUpdate: (v) => (el.textContent = `${prefix}${format(v, decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduced, value, decimals, prefix, suffix, duration]);

  // The server renders the final value, so the number is readable without JS.
  return (
    <span ref={ref} className={className}>
      {`${prefix}${format(value, decimals)}${suffix}`}
    </span>
  );
}
