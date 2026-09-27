"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { EstimateNote } from "@/components/ui/SourceNote";
import { brief } from "@/content/design";
import { estimates as e } from "@/lib/estimate";

const stats = [
  {
    value: <Counter value={Math.round(e.freeShare * 100)} suffix="%" />,
    text: "of the year on free cooling: dry coolers alone, no chiller and no water.",
  },
  {
    value: <Counter value={Math.round(e.waterSavedShare * 100)} prefix="−" suffix="%" />,
    text: `water against an evaporative cooling tower plant: about ${Math.round(e.normal.waterML)} ML a year instead of ${Math.round(e.tower.waterML)} ML.`,
  },
  {
    value: <Counter value={0} suffix=" ML" />,
    text: "in a drought year. With restrictions in force, the plant runs entirely dry.",
  },
  {
    value: <Counter value={e.pueRise * 100} decimals={1} prefix="+" suffix="%" />,
    text: `facility energy for that saving: annualised PUE ${e.normal.pue.toFixed(2)} against ${e.tower.pue.toFixed(2)} for the tower plant.`,
  },
];

export function Summary() {
  return (
    <Section
      id="summary"
      kicker="Summary"
      title={<>Reject heat to the air. Use water only when the community can spare it.</>}
      lede={
        <>
          This proposal sets out a cooling plant for a {brief.itLoadMW} MW liquid-cooled AI data centre in{" "}
          {brief.location}. It supplies <Term k="TCS" /> water at {brief.tcsSupplyC} °C from dry coolers, falls back to
          a high-temperature chiller, and treats adiabatic assist as a third mode that the local water supply can switch
          off.
        </>
      }
    >
      <div className="mt-24 grid gap-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-16 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="flex flex-col gap-6 border-t border-rule pt-7">
            <p className="t-stat m-0 !text-[clamp(56px,6vw,80px)] whitespace-nowrap">
              <LiquidText>{s.value}</LiquidText>
            </p>
            <p className="m-0 leading-normal text-muted">{s.text}</p>
          </Reveal>
        ))}
      </div>
      <EstimateNote>
        Hourly model of a synthetic Western Sydney year; method and assumptions under{" "}
        <a href="#performance" className="underline underline-offset-2">
          Indicative performance
        </a>
      </EstimateNote>

      <Reveal className="mt-24">
        <figure className="panel m-0 px-6 py-12 md:px-14 md:py-16">
          <p className="t-label m-0">Recommendation</p>
          <p className="t-sub mt-8 mb-0 max-w-[900px]">
            Adopt the three-mode warm water plant, with the adiabatic mode permitted only while the community water
            system is unrestricted, and take it to an hourly design study on measured weather data.
          </p>
        </figure>
      </Reveal>

      <Reveal className="mt-16">
        <Prose>
          <p>
            A cooling tower plant is the cheapest to run, but it evaporates water every hour of the year, and most of
            all on the hottest days, when the local supply is under the most pressure. A plant with no water at all
            avoids that, but pays for it in chiller energy through every warm afternoon.
          </p>
          <p>
            The proposed plant sits between them. It keeps most of the tower plant’s efficiency, uses a small fraction
            of its water, and hands the decision to use that water to the state of the supply it draws from.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
