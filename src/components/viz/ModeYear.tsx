"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { selectMode, type WaterState } from "@/lib/plantModes";
import { estimates, HOURS_PER_YEAR, monthOf, type ModeKey } from "@/lib/estimate";

/** Three displayed modes; chiller hours with adiabatic assist fold into "chiller". */
type Shown = "free" | "adiabatic" | "chiller";

const modes: { key: Shown; label: string; color: string }[] = [
  // Free cooling is most of the year; dimmed so the hours that use water or the chiller stand out.
  { key: "free", label: "Free cooling", color: "color-mix(in srgb, var(--sage) 38%, var(--bg))" },
  { key: "adiabatic", label: "Adiabatic assist", color: "var(--amber)" },
  { key: "chiller", label: "Chiller", color: "var(--oxblood)" },
];

const color = Object.fromEntries(modes.map((m) => [m.key, m.color])) as Record<Shown, string>;
const label = Object.fromEntries(modes.map((m) => [m.key, m.label])) as Record<Shown, string>;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthStart = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const DAYS = 365;

const fold = (k: ModeKey): Shown => (k === "chillerAdiabatic" ? "chiller" : k);

function shownMode(t: number, water: WaterState): Shown {
  const s = selectMode(t, water);
  return s.chiller ? "chiller" : s.adiabatic ? "adiabatic" : "free";
}

const fmtH = (n: number) => n.toLocaleString("en-AU");

/**
 * The modelled year hour by hour: one column per day, one row per hour, coloured by the plant's mode. A toggle
 * switches between community water supply normal all year and drought restrictions all year.
 */
export function ModeYear() {
  const [water, setWater] = useState<WaterState>("normal");
  const [hover, setHover] = useState<{ day: number; hour: number } | null>(null);
  const grid = useMemo(() => estimates.temps.map((t) => shownMode(t, water)), [water]);
  const result = water === "normal" ? estimates.normal : estimates.drought;
  const totals: Record<Shown, number> = { free: 0, adiabatic: 0, chiller: 0 };
  (Object.keys(result.hours) as ModeKey[]).forEach((k) => (totals[fold(k)] += result.hours[k]));

  // Merge consecutive days of the same mode into one rect per hour row, so the SVG stays light.
  const runs = useMemo(() => {
    const out: { x: number; y: number; w: number; mode: Shown }[] = [];
    for (let hour = 0; hour < 24; hour++) {
      let start = 0;
      for (let day = 1; day <= DAYS; day++) {
        const prev = grid[(day - 1) * 24 + hour];
        if (day === DAYS || grid[day * 24 + hour] !== prev) {
          out.push({ x: start, y: hour, w: day - start, mode: prev });
          start = day;
        }
      }
    }
    return out;
  }, [grid]);

  const hovered = hover
    ? { ...hover, t: estimates.temps[hover.day * 24 + hover.hour], mode: grid[hover.day * 24 + hover.hour] }
    : null;
  const dateOf = (day: number) => `${day - monthStart[monthOf(day)] + 1} ${monthNames[monthOf(day)]}`;

  return (
    <div className="border-t border-rule pt-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="radiogroup" aria-label="Community water supply" className="pill-group">
          {(
            [
              ["normal", "Supply normal"],
              ["constrained", "Drought year"],
            ] as const
          ).map(([key, text]) => (
            <button key={key} type="button" role="radio" aria-checked={water === key} onClick={() => setWater(key)}>
              {text}
            </button>
          ))}
        </div>
        <ul className="m-0 flex flex-wrap gap-x-6 gap-y-2 p-0" aria-label="Legend">
          {modes.map((m) => (
            <li key={m.key} className="t-caption flex list-none items-center gap-2 text-muted">
              <span aria-hidden className="inline-block size-2.5 rounded-full" style={{ background: m.color }} />
              {m.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-8 grid grid-cols-[28px_minmax(0,1fr)] gap-x-2">
        <div className="t-caption relative text-faint" aria-hidden>
          {[0, 6, 12, 18].map((h) => (
            <span
              key={h}
              className="absolute right-0 -translate-y-1/2 tabular-nums"
              style={{ top: `${(h / 24) * 100}%` }}
            >
              {String(h).padStart(2, "0")}
            </span>
          ))}
        </div>
        <div className="relative">
          <svg
            viewBox={`0 0 ${DAYS} 24`}
            preserveAspectRatio="none"
            className="block h-[200px] w-full md:h-[260px]"
            shapeRendering="crispEdges"
            role="img"
            aria-label={`Plant mode for each hour of the modelled year: ${modes.map((m) => `${label[m.key]} ${fmtH(totals[m.key])} hours`).join(", ")}.`}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const day = Math.min(DAYS - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * DAYS)));
              const hour = Math.min(23, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * 24)));
              setHover({ day, hour });
            }}
            onPointerLeave={() => setHover(null)}
          >
            {runs.map((r) => (
              <rect key={`${r.y}-${r.x}`} x={r.x} y={r.y} width={r.w} height={1} fill={color[r.mode]} />
            ))}
            {monthStart.slice(1).map((d) => (
              <line
                key={d}
                x1={d}
                x2={d}
                y1={0}
                y2={24}
                stroke="var(--bg)"
                strokeWidth={0.6}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {hovered && (
              <rect
                x={hovered.day}
                y={hovered.hour}
                width={1}
                height={1}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
          {hovered && (
            <div
              className="pointer-events-none absolute z-10 w-48 bg-raised px-3.5 py-3 text-xs leading-normal outline outline-1 outline-white/20"
              style={{
                left: `${Math.min(80, (hovered.day / DAYS) * 100)}%`,
                top: `${(hovered.hour / 24) * 100}%`,
                transform: "translate(8px, 12px)",
              }}
            >
              <span className="block text-muted">
                {dateOf(hovered.day)} · {String(hovered.hour).padStart(2, "0")}:00
              </span>
              <span className="mt-1 block text-ink tabular-nums">{hovered.t.toFixed(1)} °C dry-bulb</span>
              <span className="mt-1 flex items-center gap-2 text-ink">
                <span
                  aria-hidden
                  className="inline-block size-2 rounded-full"
                  style={{ background: color[hovered.mode] }}
                />
                {label[hovered.mode]}
              </span>
            </div>
          )}
          <div className="t-caption relative mt-2 h-4 text-faint" aria-hidden>
            {monthStart.map((d, i) => (
              <span
                key={d}
                className={`absolute ${i % 2 ? "hidden sm:inline" : ""}`}
                style={{ left: `${(d / DAYS) * 100}%` }}
              >
                {monthNames[i]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="t-label m-0 flex justify-between border-b border-line pb-3">
          <span>Hours per year by mode</span>
          <span className="text-muted">of {fmtH(HOURS_PER_YEAR)}</span>
        </p>
        <div className="mt-5 flex h-3.5 w-full gap-[2px]" aria-hidden>
          {modes.map((m) =>
            totals[m.key] > 0 ? (
              <motion.div
                key={m.key}
                layout
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="h-full first:rounded-l-[4px] last:rounded-r-[4px]"
                style={{ background: m.color, flexGrow: totals[m.key], flexBasis: 0 }}
              />
            ) : null,
          )}
        </div>
        <dl className="mt-5 grid grid-cols-3 gap-6">
          {modes.map((m) => (
            <div key={m.key}>
              <dt className="t-caption flex items-center gap-2 text-muted">
                <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: m.color }} />
                {m.label}
              </dt>
              <dd data-testid={`hours-${m.key}`} className="m-0 mt-1 text-lg tabular-nums">
                {fmtH(totals[m.key])} h
                <span className="ml-2 text-sm text-faint">{((totals[m.key] / HOURS_PER_YEAR) * 100).toFixed(0)}%</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
