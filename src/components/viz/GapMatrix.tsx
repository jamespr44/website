"use client";

import { motion } from "motion/react";

type Mark = "yes" | "part" | "no";

const criteria = [
  "Non-evaporative (dry) rejection",
  "30 °C TCS with elevated LCWT",
  "Warm, humid climate like Sydney",
  "Mode switching at the plant",
  "Driven by community water state",
];

const rows: { who: string; note: string; marks: Mark[]; self?: boolean }[] = [
  {
    who: "Karimi et al., 2022",
    note: "Chiller-less warm-water plant, hot-arid climate",
    marks: ["yes", "part", "no", "no", "no"],
  },
  {
    who: "Jin et al., 2024",
    note: "Water-side economisation over 8,760 h, cooling towers at conventional CHW temperatures",
    marks: ["no", "no", "no", "yes", "no"],
  },
  {
    who: "Gnibga et al., 2024",
    note: "Cooling-mode flexibility, internal switching criterion",
    marks: ["part", "no", "no", "yes", "no"],
  },
  {
    who: "Talukder et al., 2026",
    note: "Stress-aware workload scheduling at the fleet layer",
    marks: ["part", "no", "no", "no", "yes"],
  },
  {
    who: "This work",
    note: "Three-mode warm chilled water plant, Sydney, hourly",
    marks: ["yes", "yes", "yes", "yes", "yes"],
    self: true,
  },
];

function Cell({ m, delay, self }: { m: Mark; delay: number; self?: boolean }) {
  const label = m === "yes" ? "Addressed" : m === "part" ? "Partly addressed" : "Not addressed";
  return (
    <motion.span
      role="img"
      aria-label={label}
      title={label}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
      className={`grid size-8 place-items-center rounded-full text-sm font-bold ${
        m === "yes"
          ? self
            ? "bg-water text-bg shadow-[0_0_24px_rgba(56,189,248,0.6)]"
            : "bg-free/80 text-bg"
          : m === "part"
            ? "border border-heat/70 text-heat"
            : "border border-line text-faint"
      }`}
    >
      {m === "yes" ? "✓" : m === "part" ? "◐" : "–"}
    </motion.span>
  );
}

export function GapMatrix() {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left">
        <caption className="sr-only">Prior work against the criteria the design study requires</caption>
        <thead>
          <tr>
            <th scope="col" className="w-64 pb-4 text-xs font-medium tracking-widest text-faint uppercase">
              Work
            </th>
            {criteria.map((c) => (
              <th key={c} scope="col" className="px-2 pb-4 text-center text-xs leading-snug font-medium text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <motion.tr
              key={r.who}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: ri * 0.08 }}
              className={r.self ? "bg-water/[0.08]" : "bg-card/50"}
            >
              <th
                scope="row"
                className={`rounded-l-2xl py-4 pr-4 pl-5 align-top font-normal ${r.self ? "border-y border-l border-water/50" : ""}`}
              >
                <span className={`block font-semibold ${r.self ? "text-water" : "text-ink"}`}>{r.who}</span>
                <span className="mt-1 block text-xs leading-snug text-faint">{r.note}</span>
              </th>
              {r.marks.map((m, ci) => (
                <td
                  key={ci}
                  className={`px-2 py-4 text-center align-middle ${ci === r.marks.length - 1 ? "rounded-r-2xl" : ""} ${
                    r.self ? `border-y border-water/50 ${ci === r.marks.length - 1 ? "border-r" : ""}` : ""
                  }`}
                >
                  <span className="inline-grid">
                    <Cell m={m} self={r.self} delay={0.2 + ri * 0.08 + ci * 0.06} />
                  </span>
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
