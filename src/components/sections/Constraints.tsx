"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { TdpTrend } from "@/components/viz/TdpTrend";
import { CrossingChart } from "@/components/viz/CrossingChart";
import { figures } from "@/content/chapters";

const responses = [
  {
    title: "Fix the setpoint at 30 °C",
    body: "The durable target vendors have converged on. Designing for warmer water would buy free-cooling hours the next hardware generation takes back.",
  },
  {
    title: "Keep a chiller",
    body: "A chiller-less plant only works where the air is reliably cooler than the supply. In Western Sydney it isn’t, and the gap is widening.",
  },
  {
    title: "Size for the hot tail",
    body: "Plant is sized for a 47 °C design day, close to the 48.9 °C recorded at Penrith, so a warming climate eats into margin before it eats into capacity.",
  },
];

export function Constraints() {
  return (
    <Section
      id="constraints"
      kicker="Context · floor and ceiling"
      title={<>The climate raises the floor. The hardware lowers the ceiling.</>}
      lede={
        <>
          ASHRAE’s warm-water classes (W27, S30) let IT equipment accept warmer supply water, which is what makes dry
          heat rejection possible. But the next generation of accelerators needs cooler fluid, not warmer.
        </>
      }
    >
      <div className="mt-16 grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="border-t border-rule pt-7">
          <TdpTrend />
          <SourceNote>Shape after Vertiv &amp; Open Compute Project (2026). Indicative, not to scale</SourceNote>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="t-stat mt-6">
            <LiquidText>
              <Counter value={figures.tcsSetpointC} /> °C
            </LiquidText>
          </p>
          <p className="mt-7 text-muted">
            The coolant target silicon and system vendors have converged on, driven by accelerator <Term k="TDP" />.
            Running warmer isn’t free on the IT side either: server power rises about {figures.stahlhutPowerPct}% as
            coolant goes from 30 to 50 °C.
          </p>
          <SourceNote>
            ASHRAE TC 9.9 (2021); Vertiv &amp; Open Compute Project (2026); Stahlhut et al. (2025)
          </SourceNote>
        </Reveal>
      </div>

      <Reveal className="mt-24">
        <Prose>
          <p>
            Meanwhile the hours in which heat and humidity limit <Term k="freeCooling" /> have risen over forty-five
            years of observations, and are projected to keep rising. A dry cooler can only hold its setpoint while the
            air is cooler than the water.
          </p>
        </Prose>
      </Reveal>

      <CrossingChart />
      <SourceNote>
        Conceptual diagram. Direction of trends: Karamperidou et al. (2026); Vertiv &amp; Open Compute Project (2026);
        Han et al. (2026)
      </SourceNote>

      <div className="mt-24">
        <Reveal>
          <p className="t-label m-0">Design response</p>
        </Reveal>
        <div className="mt-6 grid gap-12 md:grid-cols-3 md:gap-10">
          {responses.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08} className="border-t border-rule pt-6">
              <h3 className="m-0 text-lg font-normal">{r.title}</h3>
              <p className="mt-3 mb-0 text-sm leading-[1.55] text-muted">{r.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
