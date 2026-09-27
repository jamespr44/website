"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { seeded } from "@/lib/random";
import { figures } from "@/content/chapters";

const AMBIENT = 35;
const rand = seeded(9);
const mist = Array.from({ length: 30 }, () => ({
  x: 150 + rand() * 170,
  delay: rand() * 1.2,
  dx: (rand() - 0.5) * 30,
}));

function useAnimatedNumber(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  const reduced = useReducedMotionSafe();
  useEffect(() => {
    if (reduced) {
      from.current = target;
      setV(target);
      return;
    }
    const c = animate(from.current, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (x) => {
        from.current = x;
        setV(x);
      },
    });
    return () => c.stop();
  }, [target, reduced]);
  return v;
}

export function SprayCooling() {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotionSafe();
  const air = useAnimatedNumber(on ? AMBIENT - figures.yangAirDropK : AMBIENT);

  return (
    <div className="rounded-3xl border border-line bg-card/60 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn((o) => !o)}
          className="flex items-center gap-3 rounded-full border border-line bg-bg/60 py-2 pr-5 pl-2 text-sm"
        >
          <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-water" : "bg-faint/50"}`}>
            <motion.span layout className={`absolute top-1 size-4 rounded-full bg-ink ${on ? "right-1" : "left-1"}`} />
          </span>
          Adiabatic pre-cooling {on ? "on" : "off"}
        </button>
        <p className="text-xs text-faint">Example ambient: {AMBIENT} °C, humid-hot afternoon</p>
      </div>

      <svg
        viewBox="0 0 520 260"
        role="img"
        aria-label={`Dry cooler with spray pre-cooling ${on ? "on" : "off"}. Entering air ${air.toFixed(1)} °C.`}
        className="mt-6 h-auto w-full"
      >
        <defs>
          <linearGradient id="airHot" gradientUnits="userSpaceOnUse" x1="10" x2="140" y1="0" y2="0">
            <stop offset="0" stopColor="var(--hot)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--heat)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="airCool" gradientUnits="userSpaceOnUse" x1="10" x2="140" y1="0" y2="0">
            <stop offset="0" stopColor="var(--heat)" stopOpacity="0.8" />
            <stop offset="1" stopColor="var(--water)" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Air arrows */}
        {[80, 130, 180].map((y, i) => (
          <g key={y}>
            <line
              x1="10"
              x2="140"
              y1={y}
              y2={y}
              stroke={on ? "url(#airCool)" : "url(#airHot)"}
              strokeWidth="4"
              strokeLinecap="round"
              className={reduced ? "" : "pipe-flow"}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            <path d={`M140 ${y - 7} L152 ${y} L140 ${y + 7} Z`} fill={on ? "var(--water)" : "var(--heat)"} />
          </g>
        ))}
        <text x="10" y="220" fontSize="12" fill="var(--muted)">
          entering air
        </text>

        {/* Nozzle header */}
        <line x1="150" x2="330" y1="40" y2="40" stroke="var(--water-deep)" strokeWidth="6" strokeLinecap="round" />
        {[170, 210, 250, 290].map((x) => (
          <path key={x} d={`M${x - 4} 42 L${x + 4} 42 L${x} 52 Z`} fill="var(--water)" opacity={on ? 1 : 0.4} />
        ))}

        {/* Mist */}
        <AnimatePresence>
          {on &&
            !reduced &&
            mist.map((m, i) => (
              <motion.circle
                key={i}
                r="2.2"
                fill="var(--water)"
                initial={{ cx: m.x, cy: 52, opacity: 0 }}
                animate={{ cy: [52, 220], cx: [m.x, m.x + m.dx], opacity: [0, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.3, delay: m.delay, repeat: Infinity, ease: "easeIn" }}
              />
            ))}
        </AnimatePresence>
        {on && reduced && <rect x="150" y="52" width="180" height="170" fill="var(--water)" opacity="0.08" />}

        {/* Coil */}
        <rect x="340" y="40" width="90" height="190" rx="8" fill="#15223a" stroke="#3b5270" />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1="350" x2="420" y1={52 + i * 12.5} y2={52 + i * 12.5} stroke="#3b5270" strokeWidth="1.5" />
        ))}
        <text x="385" y="252" textAnchor="middle" fontSize="12" fill="var(--muted)">
          dry cooler coil
        </text>
        <path d="M430 135 H 500" stroke="var(--muted)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M494 128 L506 135 L494 142 Z" fill="var(--muted)" opacity="0.5" />
      </svg>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">Entering air</p>
          <p className={`mt-1 font-display text-4xl font-semibold tabular-nums ${on ? "text-water" : "text-heat"}`}>
            {air.toFixed(1)} °C
          </p>
          <p className="text-xs text-faint">up to −{figures.yangAirDropK} K with spray</p>
        </div>
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">Condensing temp.</p>
          <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-ink">
            {on ? `−${figures.yangCondensingDropK}` : "0.0"} K
          </p>
          <p className="text-xs text-faint">reduction, up to {figures.yangCondensingDropK} K</p>
        </div>
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">Mist approach</p>
          <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-ink">
            {figures.yangMistApproachK} K
          </p>
          <p className="text-xs text-faint">to wet-bulb, at best</p>
        </div>
      </div>
      <p className="mt-6 text-xs text-faint">
        The reductions are the maxima reported, and depend on how far the wet-bulb sits below the dry-bulb. Humid air
        leaves less room.
      </p>
    </div>
  );
}
