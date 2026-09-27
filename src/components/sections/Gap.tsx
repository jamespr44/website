"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Term";
import { GapMatrix } from "@/components/viz/GapMatrix";

export function Gap() {
  return (
    <Section
      id="gap"
      kicker="The gap"
      title={<>Nobody has asked the question at 30 °C, in a humid subtropical climate, at the plant.</>}
    >
      <Reveal className="mt-14">
        <Prose>
          <p>
            The nearest published method resolves economisation hours hour by hour across dozens of cities, but with
            cooling towers at conventional chilled-water temperatures. There, the rejection floor never binds. The
            nearest water-scarcity work conditions water use on stress, but at the fleet scheduling layer, not the plant
            control layer.
          </p>
        </Prose>
      </Reveal>

      <Reveal className="mt-14">
        <GapMatrix />
        <p className="mt-4 text-xs text-faint">✓ addressed · ◐ partly · – not addressed. Summarised from the review.</p>
      </Reveal>

      <Reveal className="mt-20">
        <figure className="relative overflow-hidden rounded-3xl border border-water/40 bg-gradient-to-br from-water/[0.12] to-transparent p-8 md:p-12">
          <p className="text-xs tracking-[0.25em] text-water uppercase">The research question</p>
          <blockquote className="mt-5 font-display text-2xl leading-snug text-balance md:text-4xl">
            For a 30 °C <Term k="TCS" /> setpoint in a warm, humid climate, how many hours a year can a dry cooler hold
            that setpoint unaided, and what is the energy penalty when a high-temperature chiller covers the rest?
          </blockquote>
        </figure>
      </Reveal>
    </Section>
  );
}
