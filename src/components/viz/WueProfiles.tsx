"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
// Two illustrative facilities with the same annual draw (1,200 units)
const steady = Array(12).fill(100) as number[];
const peaked = [190, 175, 130, 90, 65, 55, 50, 55, 70, 95, 95, 130];
const HEADROOM = 150;
const MAX = 210;

type Profile = "steady" | "peaked";

export function WueProfiles() {
  const [profile, setProfile] = useState<Profile>("steady");
  const data = profile === "steady" ? steady : peaked;
  const breaches = data.filter((v) => v > HEADROOM).length;

  // Measure the container so the SVG uses 1 unit = 1 CSS px and text stays legible at any width.
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 500 ? 240 : 300;
  const pad = { l: 16, r: 16, t: 20, b: 36 };
  const bw = (W - pad.l - pad.r) / 12;
  const yOf = (v: number) => pad.t + (1 - v / MAX) * (H - pad.t - pad.b);

  return (
    <div className="rounded-3xl border border-line bg-card/60 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="radiogroup"
          aria-label="Facility draw profile"
          className="inline-flex rounded-full border border-line bg-bg/60 p-1 text-sm"
        >
          {(
            [
              ["steady", "Facility A · steady"],
              ["peaked", "Facility B · heatwave-peaked"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="radio"
              aria-checked={profile === key}
              onClick={() => setProfile(key)}
              className={`relative rounded-full px-4 py-2 transition-colors ${profile === key ? "text-bg" : "text-muted hover:text-ink"}`}
            >
              {profile === key && (
                <motion.span
                  layoutId="wue-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
        <span className="rounded-full border border-water/40 bg-water/10 px-3 py-1 text-xs text-water">
          Annual WUE: identical
        </span>
      </div>

      <div ref={box} className="mt-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Monthly water draw for ${profile === "steady" ? "a steady" : "a heatwave-peaked"} facility against local supply headroom. ${breaches} months exceed headroom.`}
          className="h-auto w-full"
        >
          {data.map((v, i) => {
            const over = v > HEADROOM;
            return (
              <g key={i}>
                <motion.rect
                  x={pad.l + i * bw + bw * 0.18}
                  width={bw * 0.64}
                  rx={4}
                  initial={false}
                  animate={{ y: yOf(v), height: H - pad.b - yOf(v), fill: over ? "var(--hot)" : "var(--water)" }}
                  transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.03 }}
                  opacity={0.9}
                />
                <text x={pad.l + i * bw + bw / 2} y={H - 12} textAnchor="middle" fontSize="12" fill="var(--faint)">
                  {months[i]}
                </text>
              </g>
            );
          })}
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={yOf(HEADROOM)}
            y2={yOf(HEADROOM)}
            stroke="var(--heat)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <text x={W - pad.r} y={yOf(HEADROOM) - 8} textAnchor="end" fontSize="12" fill="var(--heat)">
            local supply headroom
          </text>
        </svg>
      </div>

      <p className="mt-4 min-h-[3rem] text-sm text-muted" aria-live="polite">
        {breaches === 0
          ? "Facility A draws the same every month and never exceeds the local headroom."
          : `Facility B uses the same water over the year, but it exceeds local headroom in ${breaches} summer months, exactly when supply is tightest.`}
      </p>
      <p className="text-xs text-faint">Illustrative profiles to show the concept. Not measured data.</p>
    </div>
  );
}
