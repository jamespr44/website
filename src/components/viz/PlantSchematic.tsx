"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { PlantState } from "@/lib/plantModes";
import { seeded } from "@/lib/random";

const rand = seeded(55);
const mist = Array.from({ length: 26 }, () => ({ x: 655 + rand() * 190, delay: rand() * 1.3 }));

const OFF = "var(--faint)";

function Pipe({ d, active, color }: { d: string; active: boolean; color: string }) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={OFF}
        strokeOpacity="0.25"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke={active ? color : OFF}
        strokeOpacity={active ? 1 : 0.35}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "pipe-flow" : ""}
        style={{ transition: "stroke 0.5s, stroke-opacity 0.5s" }}
      />
    </g>
  );
}

function Fan({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="22" fill="var(--bg)" stroke="var(--ink)" />
      <g className="fan-spin">
        {[0, 120, 240].map((a) => (
          <ellipse
            key={a}
            cx={cx}
            cy={cy - 10}
            rx="5"
            ry="11"
            fill="var(--muted)"
            transform={`rotate(${a} ${cx} ${cy})`}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r="3" fill="var(--ink)" />
    </g>
  );
}

export function PlantSchematic({ state }: { state: PlantState }) {
  const reduced = useReducedMotionSafe();
  const { chiller, adiabatic, adiabaticLockedOut } = state;

  return (
    <svg
      viewBox="0 0 900 440"
      role="img"
      aria-label={`Plant schematic. Mode: ${state.headline}. ${state.detail}`}
      className="h-auto w-full"
    >
      {/* Community water supply + gate */}
      <text x="750" y="18" textAnchor="middle" fontSize="12" fill="var(--muted)">
        community water supply
      </text>
      <Pipe d="M750 26 V 124" active={adiabatic} color="var(--water)" />
      <g transform="translate(750 70)">
        <path
          d="M-14 -10 L0 0 L-14 10 Z M14 -10 L0 0 L14 10 Z"
          fill={adiabaticLockedOut ? "var(--hot)" : adiabatic ? "var(--water)" : OFF}
          style={{ transition: "fill 0.4s" }}
        />
        <AnimatePresence>
          {adiabaticLockedOut && (
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <rect
                x="22"
                y="-12"
                width="118"
                height="24"
                rx="12"
                fill="var(--hot)"
                fillOpacity="0.15"
                stroke="var(--hot)"
              />
              <text x="81" y="4" textAnchor="middle" fontSize="11" fill="var(--hot)" fontWeight="400">
                gate closed
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </g>

      {/* Nozzle header */}
      <line
        x1="655"
        x2="845"
        y1="128"
        y2="128"
        stroke={adiabatic ? "var(--water)" : OFF}
        strokeWidth="5"
        strokeLinecap="round"
        style={{ transition: "stroke 0.4s" }}
      />
      {[675, 715, 755, 795, 835].map((x) => (
        <path key={x} d={`M${x - 4} 131 L${x + 4} 131 L${x} 140 Z`} fill={adiabatic ? "var(--water)" : OFF} />
      ))}

      {/* Dry cooler */}
      <rect
        x="640"
        y="150"
        width="220"
        height="150"
        rx="12"
        fill="var(--bg-raised)"
        stroke={state.dryCoolers ? "var(--free)" : "var(--ink)"}
        strokeOpacity="0.7"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1="652" x2="848" y1={218 + i * 8} y2={218 + i * 8} stroke="var(--line)" strokeWidth="1.5" />
      ))}
      <Fan cx={690} cy={182} />
      <Fan cx={750} cy={182} />
      <Fan cx={810} cy={182} />
      <text x="750" y="322" textAnchor="middle" fontSize="13" fill="var(--free)" fontWeight="400">
        Dry coolers
      </text>
      <text x="750" y="338" textAnchor="middle" fontSize="11" fill="var(--muted)">
        reject heat to ambient air
      </text>

      {/* Mist */}
      <AnimatePresence>
        {adiabatic &&
          !reduced &&
          mist.map((m, i) => (
            <motion.circle
              key={i}
              r="2"
              fill="var(--water)"
              initial={{ cx: m.x, cy: 142, opacity: 0 }}
              animate={{ cy: [142, 296], opacity: [0, 0.9, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: m.delay, repeat: Infinity, ease: "easeIn" }}
            />
          ))}
      </AnimatePresence>
      {adiabatic && reduced && (
        <rect x="645" y="142" width="210" height="154" rx="10" fill="var(--water)" opacity="0.1" />
      )}

      {/* Rack / IT load */}
      <rect x="30" y="140" width="140" height="180" rx="10" fill="var(--bg-raised)" stroke="var(--ink)" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect x="44" y={154 + i * 20} width="112" height="13" rx="3" fill="var(--track)" />
          <circle cx="146" cy={160.5 + i * 20} r="2" fill={i % 3 === 0 ? "var(--free)" : "var(--water)"} />
        </g>
      ))}
      <text x="100" y="112" textAnchor="middle" fontSize="13" fill="var(--ink)" fontWeight="400">
        IT load
      </text>
      <text x="100" y="128" textAnchor="middle" fontSize="11" fill="var(--muted)">
        TCS loop · 30 °C supply
      </text>

      {/* Bypass (free cooling) */}
      <Pipe d="M170 180 H 640" active={!chiller} color="var(--free)" />
      <text
        x="405"
        y="168"
        textAnchor="middle"
        fontSize="11"
        fill={!chiller ? "var(--free)" : "var(--faint)"}
        style={{ transition: "fill 0.4s" }}
      >
        chiller bypass: water-side free cooling
      </text>

      {/* Chiller path */}
      <Pipe d="M170 270 H 340" active={chiller} color="var(--water)" />
      <Pipe d="M520 270 H 600 V 255 H 640" active={chiller} color="var(--heat)" />
      <rect
        x="340"
        y="226"
        width="180"
        height="96"
        rx="12"
        fill={chiller ? "var(--track)" : "var(--bg-raised)"}
        stroke={chiller ? "var(--heat)" : "var(--ink)"}
        style={{ transition: "fill 0.4s, stroke 0.4s" }}
      />
      <g transform="translate(372 274)">
        <circle r="16" fill="var(--bg)" stroke={chiller ? "var(--heat)" : "var(--ink)"} />
        <g className={chiller ? "fan-spin" : ""}>
          <path d="M0 -10 L3 0 L0 10 L-3 0 Z" fill={chiller ? "var(--heat)" : "var(--ink)"} />
        </g>
      </g>
      <text
        x="460"
        y="266"
        textAnchor="middle"
        fontSize="13"
        fill={chiller ? "var(--heat)" : "var(--muted)"}
        fontWeight="400"
      >
        High-temp
      </text>
      <text
        x="460"
        y="282"
        textAnchor="middle"
        fontSize="13"
        fill={chiller ? "var(--heat)" : "var(--muted)"}
        fontWeight="400"
      >
        chiller
      </text>
      <text x="460" y="302" textAnchor="middle" fontSize="10.5" fill="var(--faint)">
        LCWT to 55 °C
      </text>
      <text x="580" y="244" textAnchor="middle" fontSize="10" fill={chiller ? "var(--heat)" : "var(--faint)"}>
        55 °C
      </text>

      {/* Return */}
      <Pipe d="M845 300 V 400 H 100 V 320" active color="var(--water)" />
      <text x="420" y="424" textAnchor="middle" fontSize="11" fill="var(--faint)">
        return
      </text>
    </svg>
  );
}
