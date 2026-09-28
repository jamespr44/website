"use client";

import { motion } from "motion/react";
import { estimates as e } from "@/lib/estimate";

type Bar = { label: string; value: number; baseline?: boolean };

const annual: Bar[] = [
  { label: "A · Cooling towers", value: e.tower.waterML, baseline: true },
  { label: "E · Proposed, supply normal", value: e.normal.waterML },
  { label: "E · Proposed, drought year", value: e.drought.waterML },
];

const peak: Bar[] = [
  { label: "A · Cooling towers", value: e.tower.peakDayWaterML, baseline: true },
  { label: "E · Proposed, supply normal", value: e.normal.peakDayWaterML },
  { label: "E · Proposed, drought year", value: e.drought.peakDayWaterML },
];

function Bars({ title, unit, bars, decimals }: { title: string; unit: string; bars: Bar[]; decimals: number }) {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <figure className="m-0">
      <figcaption className="t-label flex justify-between border-b border-line pb-3">
        <span>{title}</span>
        <span className="text-muted">{unit}</span>
      </figcaption>
      <div className="mt-6 space-y-5">
        {bars.map((b, i) => (
          <div key={b.label} className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-x-5 gap-y-2">
            <span className="col-span-2 text-sm">{b.label}</span>
            <div className="h-3.5 bg-track" title={`${b.label}: ${b.value.toFixed(decimals)} ${unit}`}>
              {b.value > 0 && (
                <motion.div
                  className={`h-full origin-left rounded-r-[4px] ${b.baseline ? "bg-muted" : "bg-ink"}`}
                  style={{ width: `max(${(b.value / max) * 100}%, 3px)` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.25, delay: 0.15 + i * 0.2, ease: [0.19, 1, 0.22, 1] }}
                />
              )}
            </div>
            <span className="text-right tabular-nums">{b.value.toFixed(decimals)}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/** Annual and peak-day water for the tower baseline and the proposed plant in both water scenarios. */
export function WaterComparison() {
  return (
    <div className="grid gap-14 border-t border-rule pt-7 md:grid-cols-2 md:gap-10">
      <Bars title="Annual water" unit="ML / yr" bars={annual} decimals={0} />
      <Bars title="Peak day" unit="ML / day" bars={peak} decimals={2} />
    </div>
  );
}
