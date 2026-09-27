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
        <p className="t-caption mt-5 text-faint">
          ✓ addressed · ◐ partly · – not addressed. Summarised from the review.
        </p>
      </Reveal>

      <Reveal className="mt-20">
        <figure className="panel m-0 px-6 py-12 md:px-14 md:py-16">
          <p className="t-label m-0">The research question</p>
          <blockquote className="t-whisper mx-0 mt-8 mb-0 max-w-[900px] !text-[clamp(30px,4.2vw,54px)]">
            For a 30 °C <Term k="TCS" /> setpoint in a warm, humid climate, how many hours a year can a dry cooler hold
            that setpoint unaided, and what is the energy penalty when a high-temperature chiller covers the rest?
          </blockquote>
        </figure>
      </Reveal>
    </Section>
  );
}
