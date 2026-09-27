"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { seeded } from "@/lib/random";

const rand = seeded(42);
const plume = Array.from({ length: 22 }, () => ({
  x: 150 + (rand() - 0.5) * 90,
  r: 10 + rand() * 18,
  delay: rand() * 4,
  drift: (rand() - 0.5) * 60,
}));
const rain = Array.from({ length: 16 }, () => ({ x: 95 + rand() * 110, delay: rand() * 1.4 }));

/** Hyperbolic cooling tower: heat enters at the base and leaves as vapour. `intensity` runs 0 → 1. */
export function CoolingTower({ intensity }: { intensity: number }) {
  const reduced = useReducedMotionSafe();
  const visible = Math.max(4, Math.round(plume.length * (0.25 + intensity * 0.75)));
  const speed = 4.5 - intensity * 2;

  return (
    <svg
      viewBox="0 -60 300 440"
      overflow="visible"
      role="img"
      aria-label="Cooling tower: heat enters at the base and leaves as evaporated water vapour"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="tower" x1="0" x2="1">
          <stop offset="0" stopColor="#1b2a40" />
          <stop offset="0.5" stopColor="#2a3d58" />
          <stop offset="1" stopColor="#15223a" />
        </linearGradient>
        <linearGradient id="heatIn" gradientUnits="userSpaceOnUse" x1="8" x2="70" y1="0" y2="0">
          <stop offset="0" stopColor="var(--hot)" />
          <stop offset="1" stopColor="var(--heat)" />
        </linearGradient>
        <radialGradient id="vapour">
          <stop offset="0" stopColor="#e7eef7" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e7eef7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Vapour plume */}
      {!reduced &&
        plume
          .slice(0, visible)
          .map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              r={p.r}
              fill="url(#vapour)"
              initial={{ cy: 120, opacity: 0 }}
              animate={{ cy: [120, -50], cx: [p.x, p.x + p.drift], opacity: [0, 0.9, 0], scale: [0.6, 1.8] }}
              transition={{ duration: speed, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
      {reduced && <ellipse cx="150" cy="70" rx="70" ry="40" fill="url(#vapour)" />}

      {/* Tower shell */}
      <path
        d="M95 110 C 118 190, 118 230, 70 340 L 230 340 C 182 230, 182 190, 205 110 Z"
        fill="url(#tower)"
        stroke="#3b5270"
        strokeWidth="1.5"
      />
      <ellipse cx="150" cy="110" rx="55" ry="9" fill="#0a1422" stroke="#3b5270" strokeWidth="1.5" />

      {/* Falling water inside */}
      {!reduced &&
        rain.map((d, i) => (
          <motion.line
            key={i}
            x1={d.x}
            x2={d.x}
            stroke="var(--water)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ y1: 250, y2: 262, opacity: 0 }}
            animate={{ y1: [250, 320], y2: [262, 332], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.1, delay: d.delay, repeat: Infinity, ease: "easeIn" }}
          />
        ))}

      {/* Basin */}
      <rect x="60" y="336" width="180" height="16" rx="3" fill="var(--water-deep)" opacity="0.8" />

      {/* Heat in */}
      <motion.path
        d="M8 300 H 70"
        stroke="url(#heatIn)"
        strokeWidth="6"
        strokeLinecap="round"
        animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <path d="M62 292 L 76 300 L 62 308 Z" fill="var(--heat)" />
      <text x="8" y="285" fill="var(--heat)" fontSize="12" fontFamily="var(--font-sans)">
        heat in
      </text>
      <text x="150" y="-40" textAnchor="middle" fill="var(--muted)" fontSize="12" fontFamily="var(--font-sans)">
        latent heat leaves as vapour
      </text>
    </svg>
  );
}
