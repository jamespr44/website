"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { useScrub } from "@/lib/useScrub";
import { seeded } from "@/lib/random";

const WEEKS = 52;
const HOURS = 24;
const STEPS = 60;

// Heat-and-humidity "stress" per hour of the year: southern-hemisphere summer peak plus an afternoon peak plus noise.
const rand = seeded(2050);
const scores: number[] = [];
for (let h = 0; h < HOURS; h++) {
  for (let w = 0; w < WEEKS; w++) {
    const seasonal = Math.cos((2 * Math.PI * (w - 2)) / WEEKS);
    const diurnal = Math.cos((2 * Math.PI * (h - 15)) / HOURS);
    scores.push(0.55 * seasonal + 0.35 * diurnal + 0.3 * (rand() * 2 - 1));
  }
}

const toStep = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * STEPS);

const eras = [
  { at: 0, label: "1980", text: "Constraints cluster in summer afternoons." },
  { at: 0.45, label: "2024", text: "Forty-five years of observations show constrained hours rising significantly." },
  { at: 0.8, label: "2050", text: "Projections through mid-century expand the constrained region further." },
];

export function FreeCoolingWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrub(ref);
  const reduced = useReducedMotionSafe();
  const [step, setStep] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setStep(toStep(v)));
  // Pick up the initial value too (e.g. reduced motion pins progress at 1).
  useEffect(() => setStep(toStep(progress.get())), [progress]);
  const p = step / STEPS;

  const threshold = 0.85 - p * 0.5;
  const year = Math.round(1980 + p * 70);
  const era = [...eras].reverse().find((e) => p >= e.at) ?? eras[0];
  const constrained = useMemo(() => scores.map((s) => s > threshold), [threshold]);

  const cw = 12;
  const ch = 9;

  return (
    <div ref={ref} className={reduced ? "relative" : "relative h-[260vh]"}>
      <div className={`flex flex-col justify-center py-16 ${reduced ? "" : "sticky top-0 h-svh"}`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest text-faint uppercase">
              Hours when heat and humidity constrain free cooling
            </p>
            <p className="mt-2 font-display text-6xl font-semibold tabular-nums md:text-7xl">{year}</p>
          </div>
          <div className="flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-free/70" /> free cooling available
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-heat" /> constrained
            </span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${WEEKS * cw} ${HOURS * ch + 24}`}
          role="img"
          aria-label={`Illustrative year of hours, ${year}: the free-cooling window shrinks as constrained hours spread from summer afternoons.`}
          className="mt-6 h-auto w-full"
        >
          {constrained.map((c, i) => {
            const h = Math.floor(i / WEEKS);
            const w = i % WEEKS;
            return (
              <rect
                key={i}
                x={w * cw + 1}
                y={h * ch + 1}
                width={cw - 2}
                height={ch - 2}
                rx={1.5}
                fill={c ? "var(--heat)" : "var(--free)"}
                opacity={c ? 0.95 : 0.28}
                style={{ transition: "fill 0.4s, opacity 0.4s" }}
              />
            );
          })}
          {["Jan", "Apr", "Jul", "Oct"].map((m, i) => (
            <text key={m} x={i * 13 * cw} y={HOURS * ch + 18} fontSize="11" fill="var(--faint)">
              {m}
            </text>
          ))}
        </svg>
        <div className="mt-3 flex justify-between text-[11px] text-faint">
          <span>Rows: hour of day, midnight at top · Columns: weeks of the year</span>
          <span>Illustrative pattern, not observed data</span>
        </div>

        <motion.p
          key={era.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-xl text-lg text-muted"
        >
          {era.text}
        </motion.p>
      </div>
    </div>
  );
}
