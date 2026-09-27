"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Term } from "@/components/ui/Term";
import { brief } from "@/content/design";

const stages = [
  {
    n: "01",
    title: "Hourly design study",
    body: "Replace the synthetic year with measured Western Sydney weather, dry-bulb and wet-bulb, and today’s and projected climates. Compare against the chiller-less and cooling-tower baselines on energy, water and water-scarcity cost.",
  },
  {
    n: "02",
    title: "Equipment selection",
    body: "Select dry coolers and chillers at the design day; replace the assumed COPs and fan power with manufacturers’ part-load data.",
  },
  {
    n: "03",
    title: "Controls and the utility",
    body: "Detail the sequence of operations, and agree the restriction signal, its source and its failure behaviour with the water utility.",
  },
  {
    n: "04",
    title: "Basis of design",
    body: "Issue the basis of design report, plant schematics, sequence of operations and performance report for schematic design.",
  },
];

export function Next() {
  return (
    <>
      <Section id="next" kicker="Validation and next steps" title={<>What the design study has to answer.</>}>
        <Reveal className="mt-20">
          <figure className="panel m-0 px-6 py-12 md:px-14 md:py-16">
            <p className="t-label m-0">The design question</p>
            <blockquote className="t-whisper mx-0 mt-8 mb-0 max-w-[900px] !text-[clamp(30px,4.2vw,54px)]">
              For a {brief.tcsSupplyC} °C <Term k="TCS" /> setpoint in a warm, humid climate, how many hours a year can
              a dry cooler hold that setpoint unaided, and what is the energy penalty when a high-temperature chiller
              covers the rest?
            </blockquote>
          </figure>
        </Reveal>

        <ol className="m-0 mt-20 grid gap-12 p-0 md:grid-cols-2 md:gap-x-10 md:gap-y-14">
          {stages.map((s, i) => (
            <li key={s.n} className="list-none">
              <Reveal delay={(i % 2) * 0.08} className="border-t border-rule pt-6">
                <p className="t-label m-0 text-muted">{s.n}</p>
                <h3 className="mt-3 mb-0 text-lg font-normal">{s.title}</h3>
                <p className="mt-3 mb-0 text-sm leading-[1.55] text-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-40">
          <p className="m-0 text-[clamp(52px,9vw,124px)] leading-[0.86] font-normal tracking-[-0.04em]">
            <LiquidText block zoom={1.3}>
              Reject heat to the air.
              <br />
              <span className="font-light text-muted">Use water only when the community can spare it.</span>
            </LiquidText>
          </p>
        </Reveal>
      </Section>

      <footer className="border-t border-line px-4 pt-10 pb-12 sm:px-8">
        <div className="mx-auto grid max-w-[1078px] gap-8 md:grid-cols-3">
          <div className="t-caption space-y-2 text-muted">
            <p className="m-0 text-ink">James Gianoutsos</p>
            <p className="m-0">
              {brief.stage} proposal, {brief.year}
            </p>
          </div>
          <p className="t-caption m-0 text-muted">
            Client and site are hypothetical. Performance figures are concept-stage estimates; cited figures are from
            the published literature.
          </p>
          <div className="flex flex-wrap gap-3 justify-self-start md:justify-self-end">
            <Link href="/" className="pill pill-sm">
              All projects
            </Link>
            <a href="#intro" className="pill pill-sm">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
