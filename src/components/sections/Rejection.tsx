"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { SprayCooling } from "@/components/viz/SprayCooling";
import { figures } from "@/content/chapters";
import { assumptions } from "@/content/design";
import { DRY_APPROACH_K, FREE_COOLING_LIMIT_C } from "@/lib/plantModes";

const choices = [
  {
    title: "Dry coolers, not hybrid towers",
    body: "A hybrid tower still wets its fill by default. A dry cooler is dry by default and wet only by exception, which is the order the brief asks for.",
  },
  {
    title: "Pre-cooling on the inlet air",
    body: "Water is sprayed or misted into the air entering the coil, never onto the coil, so the heat exchanger stays dry and scale-free, and each unit can be isolated.",
  },
  {
    title: `A ${DRY_APPROACH_K} K approach`,
    body: `Coils sized so the dry coolers hold ${FREE_COOLING_LIMIT_C + DRY_APPROACH_K} °C supply unaided up to ${FREE_COOLING_LIMIT_C} °C ambient. A closer approach buys free-cooling hours at the cost of coil area and fan power.`,
  },
];

export function Rejection() {
  return (
    <Section
      id="rejection"
      kicker="Heat rejection · modes 1 and 3"
      title={<>Dry by default. A little water, only when it counts.</>}
      lede={
        <>
          Rejecting heat without evaporation is established practice, from IBM’s Aquasar to instrumented chiller-less
          plants. Adiabatic pre-cooling extends it into the hours a dry coil alone can’t reach.
        </>
      }
    >
      <div className="mt-16 grid gap-14 sm:grid-cols-2 sm:gap-10">
        <Reveal className="border-t border-rule pt-7">
          <p className="t-label">Water</p>
          <p className="t-stat mt-6">
            <LiquidText>
              −<Counter value={figures.karimiWueDropPct} suffix="%" />
            </LiquidText>
          </p>
          <p className="mt-7 text-muted">
            Measured <Term k="WUE" /> of a chiller-less warm-water plant against conventional evaporative plant, in a
            hot, arid climate.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-rule pt-7">
          <p className="t-label">Energy</p>
          <p className="t-stat mt-6">
            <LiquidText>
              +<Counter value={figures.karimiPueRisePct} suffix="%" />
            </LiquidText>
          </p>
          <p className="mt-7 text-muted">
            The price paid there: roughly 13% higher <Term k="PUE" />. The proposal keeps that price down by pre-cooling
            when water is available instead of running harder.
          </p>
        </Reveal>
      </div>
      <SourceNote>Karimi et al. (2022); Zimmermann et al. (2012)</SourceNote>

      <div className="mt-24 grid gap-12 md:grid-cols-3 md:gap-10">
        {choices.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08} className="border-t border-rule pt-6">
            <h3 className="m-0 text-lg font-normal">{c.title}</h3>
            <p className="mt-3 mb-0 text-sm leading-[1.55] text-muted">{c.body}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-24">
        <SprayCooling />
        <SourceNote>Yang et al. (2021)</SourceNote>
      </div>
      <Reveal className="mt-16">
        <Prose>
          <p>
            <Term k="adiabatic">Adiabatic</Term> assist still uses water, about {assumptions.adiabaticLPerKWh} L per kWh
            of heat while it sprays, against {assumptions.towerLPerKWh} L for a tower every hour of the year. That is
            why it is the plant’s third mode, not its default, and why the decision to use it belongs to the water
            system rather than to the plant.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
