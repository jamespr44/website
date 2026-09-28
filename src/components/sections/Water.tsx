"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { CoolingTowerSchematic } from "@/components/viz/CoolingTowerSchematic";
import { WueProfiles } from "@/components/viz/WueProfiles";
import { figures } from "@/content/chapters";
import { brief } from "@/content/design";

const MIN_MW = 10;
const MAX_MW = 200;

/** Litres evaporated per day for a continuous heat load. */
const litresPerDay = (mw: number, lPerKWh: number = figures.towerLitresPerKWh.mid) => mw * 1000 * 24 * lPerKWh;

const fmt = (n: number) => Math.round(n).toLocaleString("en-AU");

const largest = figures.requestMLPerDay.high / figures.requestVsLargestCustomer; // implied ≈ 2 ML/day

const bars = [
  { label: "Largest existing customer", value: largest, tone: "bg-muted" },
  { label: "Smallest data centre request", value: figures.requestMLPerDay.low, tone: "bg-ink" },
  { label: "Largest data centre request", value: figures.requestMLPerDay.high, tone: "bg-ink" },
];

export function Water() {
  const [mw, setMw] = useState<number>(brief.itLoadMW);
  const sliderId = useId();
  const litres = litresPerDay(mw);

  return (
    <Section
      id="water"
      kicker="Context · the water problem"
      title={<>Cooling towers drink, and they drink most when water is scarcest.</>}
      lede={
        <>
          Cooling is the overwhelming share of a data centre’s on-site water use, and the conventional plant, the
          evaporative cooling tower, consumes water by thermodynamic necessity.
        </>
      }
    >
      <div className="mt-24 grid gap-14 md:grid-cols-2 md:gap-10">
        <Reveal className="flex flex-col gap-7 border-t border-rule pt-7">
          <p className="t-stat m-0">
            <LiquidText>
              <Counter value={figures.requestMLPerDay.low} />–<Counter value={figures.requestMLPerDay.high} />
            </LiquidText>
          </p>
          <p className="m-0 max-w-[340px] leading-normal">
            <Term k="ML" /> per day sought by individual data centre applications to Australian water utilities, up to
            about {figures.requestVsLargestCustomer} times the draw of the largest existing customer.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="t-label m-0 flex justify-between border-b border-line pb-3">
            <span>Daily water demand</span>
            <span className="text-muted">ML / day</span>
          </p>
          <div className="mt-7 space-y-6">
            {bars.map((b, i) => (
              <div key={b.label} className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-x-5 gap-y-2">
                <span className="col-span-2 text-sm">{b.label}</span>
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
        </Reveal>
      </div>
      <SourceNote>
        Water Services Association of Australia (2025); Han et al. (2026). The largest-customer figure is implied: 1/20
        of the upper request.
      </SourceNote>

      <div className="mt-24 grid items-start gap-14 md:grid-cols-[1fr_0.95fr]">
        <div className="space-y-10">
          <Reveal>
            <p className="t-stat whitespace-nowrap">
              <LiquidText>1.4–1.5</LiquidText>{" "}
              <span className="text-[0.38em] font-light tracking-normal text-muted">L/kWh</span>
            </p>
            <p className="mt-7 mb-0 max-w-[420px] text-muted">
              Evaporated for every kilowatt-hour of heat a tower rejects, before drift and blowdown. The heat leaves as
              the latent heat of the vapour, so the only way to save the water is to change the mechanism.
            </p>
          </Reveal>

          <Reveal className="border-t border-rule pt-7">
            <label htmlFor={sliderId} className="t-label flex items-baseline justify-between gap-4">
              <span>Heat rejected, running continuously</span>
              <span className="t-sub whitespace-nowrap tabular-nums">{mw} MW</span>
            </label>
            <input
              id={sliderId}
              type="range"
              min={MIN_MW}
              max={MAX_MW}
              step={10}
              value={mw}
              onChange={(e) => setMw(Number(e.target.value))}
              className="mt-4"
              aria-valuetext={`${mw} megawatts`}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="t-label text-faint">Evaporated per day</p>
                <p data-testid="litres-per-day" className="t-sub mt-1 tabular-nums">
                  {fmt(litres)} L
                </p>
              </div>
              <div>
                <p className="t-label text-faint">Equivalent to</p>
                <p className="t-sub mt-1 tabular-nums">{(litres / 1e6 / figures.olympicPoolML).toFixed(2)}</p>
                <p className="mt-1 text-xs text-faint">Olympic pools per day</p>
              </div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-faint">
              MW × 1,000 × 24 h × 1.45 L/kWh. Starts at this brief’s {brief.itLoadMW} MW.
            </p>
          </Reveal>
          <SourceNote>ASHRAE (2020); Mytton (2021)</SourceNote>
        </div>

        <figure className="m-0 w-full border-t border-rule pt-6 md:sticky md:top-24">
          <CoolingTowerSchematic intensity={(mw - MIN_MW) / (MAX_MW - MIN_MW)} />
          <figcaption className="t-caption mt-3 text-faint">
            Induced-draft cooling tower in section. The vapour plume follows the heat load.
          </figcaption>
        </figure>
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="t-sub m-0 max-w-[760px]">
            A year’s average can’t see a heatwave. Supply fails on <span className="italic">coincidence</span>, not on
            total draw.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <Prose>
            <p>
              The reporting metric, <Term k="WUE" />, averages over a whole year. A plant that draws heavily through a
              heatwave reports the same figure as one that draws steadily, but the impact lands on one local supply
              system, at the moment it is most stretched. This design is judged on when it uses water, not only on how
              much.
            </p>
          </Prose>
        </Reveal>
        <div className="mt-14">
          <WueProfiles />
          <SourceNote>Concept after Li et al. (2025); Han et al. (2026); Lei &amp; Masanet (2022)</SourceNote>
        </div>
      </div>
    </Section>
  );
}
