"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { WueProfiles } from "@/components/viz/WueProfiles";
import { figures } from "@/content/chapters";

export function Timing() {
  return (
    <Section
      id="timing"
      kicker="The metric hides the timing"
      title={<>A year’s average can’t see a heatwave.</>}
      lede={
        <>
          The dominant reporting metric, <Term k="WUE" />, aggregates across a whole year. A facility that draws heavily
          during a heatwave and lightly in winter reports the same figure as one that draws steadily.
        </>
      }
    >
      <div className="mt-16">
        <WueProfiles />
        <SourceNote>Concept after Li et al. (2025)</SourceNote>
      </div>

      <div className="mt-24 grid gap-12 md:grid-cols-[0.8fr_1fr] md:items-center">
        <Reveal>
          <p className="font-display text-8xl font-semibold text-heat md:text-9xl">
            <Counter value={figures.wueSpreadPct} suffix="%" />
          </p>
          <p className="mt-3 max-w-sm text-muted">
            The relative spread in estimated WUE across ten facility archetypes and fifteen climate zones.
          </p>
          <SourceNote>Lei &amp; Masanet (2022)</SourceNote>
        </Reveal>
        <Reveal delay={0.1}>
          <Prose>
            <p>
              WUE isn’t a technology-independent number. A single figure can’t be carried from one climate or cooling
              configuration to another.
            </p>
            <p>
              The reporting side reaches the same conclusion: current disclosure practice is insufficient to support the
              comparisons routinely made from it (Privette et al., 2026).
            </p>
          </Prose>
        </Reveal>
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="mb-8 text-sm tracking-widest text-faint uppercase">The debate</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-line bg-card/40 p-8">
            <p className="text-xs tracking-widest text-muted uppercase">Gaster, 2026</p>
            <p className="mt-4 font-display text-2xl leading-snug">
              “The data center water problem is soluble.” On annual volumes, data centre water use is modest next to
              agricultural and municipal demand.
            </p>
            <p className="mt-4 text-sm text-faint">A fair reading of the aggregate figures.</p>
          </Reveal>
          <Reveal delay={0.12} className="rounded-3xl border border-hot/40 bg-hot/[0.06] p-8">
            <p className="text-xs tracking-widest text-hot uppercase">Han et al., 2026</p>
            <p className="mt-4 font-display text-2xl leading-snug">
              Impacts fall on individual public water systems, not national totals. Stress is greatest where consumption
              coincides with constrained supply.
            </p>
            <p className="mt-4 text-sm text-faint">The scale at which supply actually fails.</p>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <p className="mt-12 text-center font-display text-3xl text-balance md:text-4xl">
            Supply fails on <span className="text-hot italic">coincidence</span>, not on total draw.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
