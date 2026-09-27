"use client";

import { motion } from "motion/react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { figures } from "@/content/chapters";

const largest = figures.requestMLPerDay.high / figures.requestVsLargestCustomer; // implied ≈ 2 ML/day

const bars = [
  {
    label: "Largest existing single customer",
    value: largest,
    note: "implied: 1/20 of the upper request",
    tone: "bg-muted/60",
  },
  { label: "Smallest data centre request", value: figures.requestMLPerDay.low, tone: "bg-water/70" },
  {
    label: "Largest data centre request",
    value: figures.requestMLPerDay.high,
    tone: "bg-gradient-to-r from-water via-heat to-hot",
  },
];

export function Pressure() {
  return (
    <Section
      id="pressure"
      kicker="The pressure"
      title={<>Data centres are growing faster than the water systems that serve them.</>}
      lede={
        <>
          Cooling is the overwhelming share of a facility’s on-site water use, and almost all of that is lost to
          evaporation. It is also the largest single non-
          <Term k="IT" /> electrical load.
        </>
      }
    >
      <div className="mt-20 grid gap-12 md:grid-cols-3">
        <Reveal className="border-t border-line pt-6">
          <p className="font-display text-6xl font-semibold text-water md:text-7xl">
            <Counter value={figures.requestMLPerDay.low} />–<Counter value={figures.requestMLPerDay.high} />
          </p>
          <p className="mt-3 text-muted">
            <Term k="ML" /> per day sought by individual data centre applications to Australian water utilities.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-line pt-6">
          <p className="font-display text-6xl font-semibold text-heat md:text-7xl">
            ~<Counter value={figures.requestVsLargestCustomer} suffix="×" />
          </p>
          <p className="mt-3 text-muted">
            The upper request compared with the draw of the largest existing single customer.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="border-t border-line pt-6">
          <p className="font-display text-6xl font-semibold text-ink md:text-7xl">
            <Counter value={figures.requestMLPerDay.high / figures.olympicPoolML} />
          </p>
          <p className="mt-3 text-muted">Olympic pools a day, at 40 ML/day.</p>
        </Reveal>
      </div>
      <SourceNote>
        Han et al. (2026); International Energy Agency (2025); Mytton (2021); Siddik et al. (2021); ASHRAE (2020)
      </SourceNote>

      <div className="mt-20 rounded-3xl border border-line bg-card/60 p-6 md:p-10">
        <p className="mb-8 text-sm tracking-wide text-muted">Daily water demand, ML/day</p>
        <div className="space-y-7">
          {bars.map((b, i) => (
            <div key={b.label}>
              <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
                <span className="text-ink">
                  {b.label}
                  {b.note && <span className="ml-2 text-xs text-faint">({b.note})</span>}
                </span>
                <span className="font-semibold tabular-nums">{b.value} ML</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className={`h-full origin-left rounded-full ${b.tone}`}
                  style={{ width: `${(b.value / figures.requestMLPerDay.high) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.4, delay: 0.2 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
        <SourceNote>Water Services Association of Australia (2025)</SourceNote>
      </div>

      <div className="mt-20 grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <blockquote className="border-l-2 border-heat pl-6 font-display text-2xl leading-snug text-ink md:text-3xl">
            “Current water plans do not and cannot account for them.”
          </blockquote>
          <p className="mt-4 pl-6 text-sm text-faint">Water Services Association of Australia, 2025</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Prose>
            <p>
              These connection requests are on a scale utilities have not planned for. The Commonwealth has, for the
              first time, made sustainable water use an explicit expectation of new data centre developments.
            </p>
            <p>
              Evaporative cooling towers are the conventional way to reject that heat. They consume water{" "}
              <em className="text-ink">by thermodynamic necessity</em>, not through poor design.
            </p>
          </Prose>
        </Reveal>
      </div>
    </Section>
  );
}
