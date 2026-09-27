"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useScrub } from "@/lib/useScrub";

// Geometry (viewBox 800 × 450). The floor rises and the ceiling falls; they cross at T_CROSS.
const X0 = 60;
const X1 = 760;
const floorY = (t: number) => 380 - 260 * t;
const ceilY = (t: number) => 110 + 200 * t;
const T_CROSS = 270 / 460;
const XC = X0 + (X1 - X0) * T_CROSS;
const YC = floorY(T_CROSS);

const SCAN = [0.5, 0.85] as const;
const P_CROSS = SCAN[0] + (SCAN[1] - SCAN[0]) * T_CROSS;

const steps: { range: number[]; out: number[]; kicker: string; text: React.ReactNode }[] = [
  {
    range: [0, 0.2, 0.26],
    out: [1, 1, 0],
    kicker: "The ceiling",
    text: <>Hardware sets the warmest supply water it will accept, and that ceiling is heading down, towards 30 °C.</>,
  },
  {
    range: [0.22, 0.28, 0.46, 0.52],
    out: [0, 1, 1, 0],
    kicker: "The floor",
    text: (
      <>
        Climate sets the lowest temperature a dry cooler can reach. With rising heat, humidity and local heat build-up,
        that floor is heading up.
      </>
    ),
  },
  {
    range: [0.48, 0.54, 0.7, 0.76],
    out: [0, 1, 1, 0],
    kicker: "The window",
    text: (
      <>
        Between them is the free-cooling window. A dry cooler holds a 30 °C loop only while the dry-bulb sits several
        degrees below it.
      </>
    ),
  },
  {
    range: [0.72, 0.78, 1],
    out: [0, 1, 1],
    kicker: "The crossing",
    text: (
      <>
        Once the floor rises above the ceiling, mechanical cooling is no longer an efficiency option. It becomes a
        requirement. The literature doesn’t resolve what happens where they cross.
      </>
    ),
  },
];

/** Piecewise-linear interpolation, clamped at both ends. */
function lerp(v: number, xs: number[], ys: number[]) {
  if (v <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (v <= xs[i]) return ys[i - 1] + ((v - xs[i - 1]) / (xs[i] - xs[i - 1])) * (ys[i] - ys[i - 1]);
  }
  return ys[ys.length - 1];
}

function Step({ progress, s }: { progress: MotionValue<number>; s: (typeof steps)[number] }) {
  const yOut = s.out.map((o, i) => (o === 1 ? 0 : i === 0 ? 24 : -24));
  const opacity = useTransform(progress, (v) => lerp(v, s.range, s.out));
  const y = useTransform(progress, (v) => lerp(v, s.range, yOut));
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <p className="t-label m-0">{s.kicker}</p>
      <p className="mt-4 mb-0 text-[clamp(22px,2.3vw,30px)] leading-[1.25] font-light tracking-[-0.01em]">{s.text}</p>
    </motion.div>
  );
}

export function CrossingChart() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrub(ref);

  const ceilDraw = useTransform(p, [0.02, 0.24], [0, 1]);
  const floorDraw = useTransform(p, [0.28, 0.5], [0, 1]);
  const reveal = useTransform(p, [...SCAN], [0, 1]);
  const scanX = useTransform(p, [...SCAN], [X0, X1]);
  const scanOpacity = useTransform(p, [SCAN[0] - 0.02, SCAN[0], SCAN[1], SCAN[1] + 0.03], [0, 1, 1, 0]);
  const crossOpacity = useTransform(p, [P_CROSS - 0.02, P_CROSS], [0, 1]);
  const requiredOpacity = useTransform(p, [0.86, 0.92], [0, 1]);

  return (
    <div ref={ref} className="relative h-[380vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 py-10 md:grid md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-12">
        <div className="relative order-2 min-h-[12rem] md:order-1 md:min-h-[16rem]">
          {steps.map((s) => (
            <Step key={s.kicker} progress={p} s={s} />
          ))}
        </div>

        <svg
          viewBox="0 0 800 450"
          role="img"
          aria-label="Chart: the climate-set rejection floor rises and the hardware-set supply ceiling falls. Where they cross, mechanical cooling becomes a requirement."
          className="order-1 h-auto w-full md:order-2"
        >
          <defs>
            <clipPath id="scanClip">
              <motion.rect x={X0} y="0" width={X1 - X0} height="450" style={{ scaleX: reveal, originX: 0 }} />
            </clipPath>
            <linearGradient id="reqFill" x1="0" x2="1">
              <stop offset="0" stopColor="var(--hot)" stopOpacity="0.55" />
              <stop offset="1" stopColor="var(--hot)" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Axes */}
          <line x1={X0} x2={X0} y1="40" y2="410" stroke="var(--line)" />
          <line x1={X0} x2={X1} y1="410" y2="410" stroke="var(--line)" />
          <text x={X0} y="30" fontSize="13" fill="var(--faint)">
            temperature ↑
          </text>
          <text x={X1} y="436" textAnchor="end" fontSize="13" fill="var(--faint)">
            time →
          </text>

          {/* Regions revealed by the scan */}
          <g clipPath="url(#scanClip)">
            <polygon points={`${X0},${ceilY(0)} ${XC},${YC} ${X0},${floorY(0)}`} fill="var(--sage)" opacity="0.3" />
            <polygon points={`${XC},${YC} ${X1},${ceilY(1)} ${X1},${floorY(1)}`} fill="url(#reqFill)" />
          </g>
          <motion.text style={{ opacity: reveal }} x={X0 + 30} y={250} fontSize="15" fill="var(--free)">
            free-cooling window
          </motion.text>
          <motion.g style={{ opacity: requiredOpacity }}>
            <text x={X1 - 12} y={205} textAnchor="end" fontSize="15" fill="var(--ink)">
              mechanical cooling
            </text>
            <text x={X1 - 12} y={225} textAnchor="end" fontSize="15" fill="var(--ink)">
              required
            </text>
          </motion.g>

          {/* Lines */}
          <motion.path
            d={`M${X0} ${ceilY(0)} L${X1} ${ceilY(1)}`}
            stroke="var(--ink)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            style={{ pathLength: ceilDraw }}
          />
          <motion.path
            d={`M${X0} ${floorY(0)} L${X1} ${floorY(1)}`}
            stroke="var(--heat)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            style={{ pathLength: floorDraw }}
          />
          <motion.text style={{ opacity: ceilDraw }} x={X0 + 8} y={ceilY(0) - 14} fontSize="14" fill="var(--ink)">
            hardware-set supply ceiling
          </motion.text>
          <motion.text style={{ opacity: floorDraw }} x={X0 + 8} y={floorY(0) + 24} fontSize="14" fill="var(--heat)">
            climate-set rejection floor
          </motion.text>

          {/* Scan line */}
          <motion.line
            x1={0}
            x2={0}
            y1="40"
            y2="410"
            stroke="var(--ink)"
            strokeOpacity="0.35"
            strokeDasharray="4 6"
            style={{ x: scanX, opacity: scanOpacity }}
          />

          {/* Crossing point */}
          <motion.g style={{ opacity: crossOpacity }}>
            <circle cx={XC} cy={YC} r="22" fill="var(--hot)" opacity="0.2" />
            <circle cx={XC} cy={YC} r="7" fill="var(--ink)" />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
