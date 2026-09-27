"use client";

import { motion } from "motion/react";

const W = 600;
const H = 300;
const pad = { l: 40, r: 110, t: 20, b: 36 };
const years = [2015, 2020, 2025, 2030];
const x = (yr: number) => pad.l + ((yr - 2015) / 15) * (W - pad.l - pad.r);
const y = (v: number) => pad.t + (1 - v) * (H - pad.t - pad.b);

// Normalised, indicative shapes only (no absolute values)
const cpu = (t: number) => 0.12 + 0.18 * t;
const gpu = (t: number) => 0.14 + 0.8 * Math.pow(t, 2.1);

const path = (f: (t: number) => number) =>
  Array.from({ length: 31 }, (_, i) => {
    const t = i / 30;
    return `${i === 0 ? "M" : "L"}${x(2015 + t * 15).toFixed(1)} ${y(f(t)).toFixed(1)}`;
  }).join(" ");

const draw = (delay: number) => ({
  initial: { pathLength: 0 },
  whileInView: { pathLength: 1 },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 2, delay, ease: [0.65, 0, 0.35, 1] as const },
});

export function TdpTrend() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Indicative trend: GPU and ASIC thermal design power has diverged sharply upward from CPU since 2015."
      className="h-auto w-full"
    >
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} stroke="var(--line)" />
      <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--line)" />
      <text
        x={pad.l - 14}
        y={pad.t + 70}
        textAnchor="middle"
        fontSize="11"
        fill="var(--faint)"
        transform={`rotate(-90 ${pad.l - 14} ${pad.t + 70})`}
      >
        TDP (indicative)
      </text>
      {years.map((yr) => (
        <text key={yr} x={x(yr)} y={H - pad.b + 20} textAnchor="middle" fontSize="11" fill="var(--faint)">
          {yr}
        </text>
      ))}

      <motion.path
        d={path(cpu)}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="3"
        strokeLinecap="round"
        {...draw(0.2)}
      />
      <motion.path
        d={path(gpu)}
        fill="none"
        stroke="var(--hot)"
        strokeWidth="3.5"
        strokeLinecap="round"
        {...draw(0.5)}
      />

      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.3 }}
      >
        <text x={x(2030) + 8} y={y(gpu(1)) + 4} fontSize="12" fill="var(--hot)">
          GPU / ASIC
        </text>
        <text x={x(2030) + 8} y={y(cpu(1)) + 4} fontSize="12" fill="var(--muted)">
          CPU
        </text>
      </motion.g>
    </svg>
  );
}
