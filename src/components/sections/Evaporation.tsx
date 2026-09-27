"use client";

import { useId, useState } from "react";
import dynamic from "next/dynamic";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SourceNote } from "@/components/ui/SourceNote";
import { figures } from "@/content/chapters";

const CoolingTower3D = dynamic(() => import("@/components/three/CoolingTower3D"), { ssr: false });

const MIN_MW = 10;
const MAX_MW = 500;

/** Litres evaporated per day for a continuous heat load. */
export const litresPerDay = (mw: number, lPerKWh: number = figures.towerLitresPerKWh.mid) => mw * 1000 * 24 * lPerKWh;

const fmt = (n: number) => Math.round(n).toLocaleString("en-AU");

export function Evaporation() {
  const [mw, setMw] = useState(100);
  const sliderId = useId();
  const litres = litresPerDay(mw);
  const low = litresPerDay(mw, figures.towerLitresPerKWh.low);
  const high = litresPerDay(mw, figures.towerLitresPerKWh.high);

  return (
    <Section
      id="evaporation"
      kicker="Why towers drink"
      title={<>The heat leaves in the water.</>}
      lede={
        <>
          A cooling tower works by evaporating water. The heat goes out as the latent heat of the vapour, so water
          consumption is built into how the tower works. You can’t operate the same mechanism differently to save water.
          You have to change the mechanism.
        </>
      }
    >
      <div className="mt-16 grid items-start gap-12 md:grid-cols-[1fr_0.9fr]">
        <div className="space-y-10">
          <Reveal>
            <p className="font-display text-6xl font-semibold whitespace-nowrap text-water sm:text-7xl md:text-8xl">
              1.4–1.5 <span className="text-2xl text-muted sm:text-3xl md:text-4xl">L/kWh</span>
            </p>
            <p className="mt-3 text-muted">
              Water evaporated for every kilowatt-hour of heat rejected, before drift and blowdown losses are added.
            </p>
          </Reveal>

          <Reveal className="rounded-3xl border border-line bg-card/60 p-6 md:p-8">
            <label htmlFor={sliderId} className="flex items-baseline justify-between gap-4 text-sm text-muted">
              <span>Heat rejected, running continuously</span>
              <span className="font-display text-3xl font-semibold whitespace-nowrap text-ink tabular-nums">
                {mw} MW
              </span>
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
                <p className="text-xs tracking-widest text-faint uppercase">Evaporated per day</p>
                <p
                  data-testid="litres-per-day"
                  className="mt-1 font-display text-4xl font-semibold text-water tabular-nums"
                >
                  {fmt(litres)} L
                </p>
                <p className="mt-1 text-xs text-faint">
                  range {fmt(low)}–{fmt(high)} L
                </p>
              </div>
              <div>
                <p className="text-xs tracking-widest text-faint uppercase">Equivalent to</p>
                <p className="mt-1 font-display text-4xl font-semibold text-ink tabular-nums">
                  {(litres / 1e6 / figures.olympicPoolML).toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-faint">Olympic pools per day</p>
              </div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-faint">
              MW × 1,000 × 24 h × 1.45 L/kWh. Evaporation only. Drift and blowdown add more.
            </p>
          </Reveal>

          <Prose>
            <p>
              That consumption is large, and more importantly it’s <em className="text-ink">concentrated</em>: it lands
              on one local supply system at a time, and it peaks when the weather is hottest.
            </p>
          </Prose>
          <SourceNote>ASHRAE (2020); Mytton (2021)</SourceNote>
        </div>

        <div className="relative mx-auto w-full md:sticky md:top-20">
          <CoolingTower3D intensity={(mw - MIN_MW) / (MAX_MW - MIN_MW)} />
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-[11px] whitespace-nowrap text-faint">
            Plume and fan speed follow the heat load<span className="hidden md:inline"> · drag to orbit</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
