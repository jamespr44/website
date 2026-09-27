"use client";

import { motion } from "motion/react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { figures } from "@/content/chapters";

const largest = figures.requestMLPerDay.high / figures.requestVsLargestCustomer; // implied ≈ 2 ML/day

const bars = [
  { label: "Largest existing customer", value: largest, tone: "bg-muted" },
  { label: "Smallest data centre request", value: figures.requestMLPerDay.low, tone: "bg-ink" },
  { label: "Largest data centre request", value: figures.requestMLPerDay.high, tone: "bg-ink" },
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
      <div className="mt-24 grid gap-14 md:grid-cols-3 md:gap-10">
        <Reveal className="flex flex-col gap-7 border-t border-rule pt-7">
          <p className="t-stat m-0">
            <LiquidText>
              <Counter value={figures.requestMLPerDay.low} />–<Counter value={figures.requestMLPerDay.high} />
            </LiquidText>
          </p>
          <p className="m-0 max-w-[280px] leading-normal">
            <Term k="ML" /> per day sought by individual data centre applications to Australian water utilities.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-7 border-t border-rule pt-7">
          <p className="t-stat m-0">
            <LiquidText>
              ~<Counter value={figures.requestVsLargestCustomer} suffix="×" />
            </LiquidText>
          </p>
          <p className="m-0 max-w-[280px] leading-normal">
            The upper request compared with the draw of the largest existing single customer.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="flex flex-col gap-7 border-t border-rule pt-7">
          <p className="t-stat m-0">
            <LiquidText>
              <Counter value={figures.requestMLPerDay.high / figures.olympicPoolML} />
            </LiquidText>
          </p>
          <p className="m-0 max-w-[280px] leading-normal">Olympic pools a day, at 40 ML/day.</p>
        </Reveal>
      </div>
      <SourceNote>
        Han et al. (2026); International Energy Agency (2025); Mytton (2021); Siddik et al. (2021); ASHRAE (2020)
      </SourceNote>

      <div className="mt-24">
        <p className="t-label m-0 flex justify-between border-b border-line pb-3">
          <span>Daily water demand</span>
          <span className="text-muted">ML / day</span>
        </p>
        <div className="mt-7 space-y-6">
          {bars.map((b, i) => (
            <div
              key={b.label}
              className="grid grid-cols-[minmax(0,1fr)_48px] items-center gap-x-6 gap-y-2 md:grid-cols-[280px_minmax(0,1fr)_60px]"
            >
              <span className="col-span-2 md:col-span-1">{b.label}</span>
              <div className="h-3.5 bg-track">
                <motion.div
                  className={`h-full origin-left ${b.tone}`}
                  style={{ width: `${(b.value / figures.requestMLPerDay.high) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.25, delay: 0.15 + i * 0.2, ease: [0.19, 1, 0.22, 1] }}
                />
              </div>
              <span className="text-right tabular-nums">{b.value}</span>
            </div>
          ))}
        </div>
        <SourceNote>
          Water Services Association of Australia (2025). The largest-customer figure is implied: 1/20 of the upper
          request.
        </SourceNote>
      </div>

      <div className="mt-24 grid gap-12 border-t border-rule pt-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <blockquote className="m-0 text-[clamp(28px,3.6vw,45px)] leading-[1.15] font-light tracking-[-0.01em]">
            “Current water plans do not and cannot account for them.”
          </blockquote>
          <p className="t-caption mt-5 text-faint">Water Services Association of Australia, 2025</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Prose>
            <p>
              These connection requests are on a scale utilities have not planned for. The Commonwealth has, for the
              first time, made sustainable water use an explicit expectation of new data centre developments.
            </p>
            <p>
              Evaporative cooling towers are the conventional way to reject that heat. They consume water{" "}
              <em>by thermodynamic necessity</em>, not through poor design.
            </p>
          </Prose>
          <a href="#evaporation" className="pill mt-8">
            Why towers drink
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
