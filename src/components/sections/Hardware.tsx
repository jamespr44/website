"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { TdpTrend } from "@/components/viz/TdpTrend";
import { figures } from "@/content/chapters";

export function Hardware() {
  return (
    <Section
      id="hardware"
      kicker="Hardware limits"
      title={<>The hardware ceiling is coming down.</>}
      lede={
        <>
          ASHRAE’s facility water classes set the supply temperatures IT equipment will accept, and the higher classes
          (W27, S30) permit warm-water operation. The direction of travel, though, is down, not up.
        </>
      }
    >
      <div className="mt-16 grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="rounded-3xl border border-line bg-card/60 p-6 md:p-8">
          <TdpTrend />
          <SourceNote>Shape after Vertiv &amp; Open Compute Project (2026). Indicative, not to scale</SourceNote>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display text-8xl font-semibold text-water">
            <Counter value={figures.tcsSetpointC} /> °C
          </p>
          <p className="mt-3 text-muted">
            The durable coolant target that silicon and system vendors have converged on. Next-generation accelerators
            need cooler fluid than many current facility designs assume.
          </p>
          <p className="mt-6 text-muted">
            The driver is accelerator <Term k="TDP" />, which has diverged sharply from <Term k="CPU" /> trends over the
            past decade.
          </p>
          <SourceNote>ASHRAE TC 9.9 (2021); Vertiv &amp; Open Compute Project (2026)</SourceNote>
        </Reveal>
      </div>

      <div className="mt-24">
        <Reveal>
          <h3 className="max-w-2xl font-display text-3xl font-semibold">
            Running warmer isn’t free on the IT side either.
          </h3>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Reveal className="rounded-3xl border border-line bg-card/40 p-8">
            <p className="font-display text-6xl font-semibold text-heat">
              +<Counter value={figures.gheniItPowerPct} decimals={2} suffix="%" />
            </p>
            <p className="mt-3 text-muted">
              IT power across an {figures.gheniDeltaK} K rise in <Term k="TCS" /> temperature, measured on an
              operational direct liquid-cooled system.
            </p>
            <SourceNote>Gheni et al. (2026)</SourceNote>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-line bg-card/40 p-8">
            <p className="font-display text-6xl font-semibold text-heat">
              +<Counter value={figures.stahlhutPowerPct} decimals={1} suffix="%" />
            </p>
            <p className="mt-3 text-muted">Additional server power as coolant rises from 30 to 50 °C.</p>
            <SourceNote>Stahlhut et al. (2025)</SourceNote>
          </Reveal>
        </div>
        <Reveal className="mt-12">
          <Prose>
            <p>
              The net position depends on climate. The annual chiller energy penalty of a low TCS setpoint is severe in
              hot zones and negligible in cold ones.
            </p>
          </Prose>
        </Reveal>
      </div>
    </Section>
  );
}
