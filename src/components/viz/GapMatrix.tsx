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

function Cell({ m, delay }: { m: Mark; delay: number }) {
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
      className={`grid size-7 place-items-center rounded-full text-[13px] ${
        m === "yes" ? "bg-ink text-bg" : m === "part" ? "border border-rule text-ink" : "text-faint"
      }`}
    >
      {m === "yes" ? "✓" : m === "part" ? "◐" : "–"}
    </motion.span>
  );
}

export function GapMatrix() {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">Prior work against the criteria the design study requires</caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="t-label w-64 pb-4 font-normal">
              Work
            </th>
            {criteria.map((c) => (
              <th key={c} scope="col" className="t-label px-2 pb-4 text-center font-normal text-muted">
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
              transition={{ duration: 1, delay: ri * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className={r.self ? "panel" : "border-b border-line"}
            >
              <th scope="row" className="py-5 pr-4 pl-3 align-top font-normal">
                <span className="block">{r.who}</span>
                <span className="t-caption mt-1 block text-muted">{r.note}</span>
              </th>
              {r.marks.map((m, ci) => (
                <td key={ci} className="px-2 py-5 text-center align-middle">
                  <span className="inline-grid">
                    <Cell m={m} delay={0.2 + ri * 0.08 + ci * 0.06} />
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
