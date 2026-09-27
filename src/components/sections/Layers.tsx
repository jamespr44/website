"use client";

import { motion } from "motion/react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Term } from "@/components/ui/Term";
import { figures } from "@/content/chapters";

type Layer = {
  tier: string;
  title: string;
  signal: string;
  who: string;
  body: React.ReactNode;
  gap?: boolean;
};

const layers: Layer[] = [
  {
    tier: "Fleet layer",
    title: "Workload scheduling",
    signal: "Signal: regional water stress",
    who: "Talukder et al., 2026",
    body: (
      <>
        Moves workload between sites according to spatial and temporal water stress, and counts the off-site water used
        in electricity generation. Cuts stress-adjusted water use by up to {figures.talukderReductionPct}%. There are
        two limits. Dry cooling helps stressed regions only at <Term k="PUE" /> ≤ {figures.talukderPueLimit}, and it
        backfires where the power itself comes from water-stressed sources. Hyperscale AI loads are also near-constant,
        so there is little workload to move.
      </>
    ),
  },
  {
    tier: "Facility layer",
    title: "Cooling-mode flexibility",
    signal: "Signal: internal to the facility",
    who: "Gnibga et al., 2024",
    body: (
      <>
        The closest prior work on switching between cooling modes. It trades off water, energy, carbon and cost, but the
        switching criterion comes from inside the facility, not from the state of the community’s water system.
      </>
    ),
  },
  {
    tier: "Plant control layer",
    title: "Adiabatic assist gated on community water state",
    signal: "Signal: the local supply system",
    who: "Unaddressed · this work",
    gap: true,
    body: (
      <>
        The plant itself decides when it may use water, triggered by the state of the public supply it draws from. It
        doesn’t depend on moving workload, and it doesn’t wait for the facility’s own needs.
      </>
    ),
  },
];

export function Layers() {
  return (
    <Section
      id="layers"
      kicker="Who switches, and on what signal"
      title={<>The nearest work acts at the wrong layer.</>}
      lede={
        <>
          Earlier work has already used water stress as a signal, and has already switched between cooling modes. The
          two have not yet been combined at the layer where heat is actually rejected.
        </>
      }
    >
      <div className="mt-20 border-t border-rule">
        {layers.map((l, i) => (
          <motion.article
            key={l.tier}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.25, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
            className={`grid gap-5 border-b border-line py-8 md:grid-cols-[200px_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10 ${
              l.gap ? "panel -mx-4 px-4 sm:-mx-8 sm:px-8 md:mx-0 md:px-6" : ""
            }`}
          >
            <p className="t-label m-0">
              {String(i + 1).padStart(2, "0")} — {l.tier}
            </p>
            <div>
              <h3 className="t-sub m-0">
                <LiquidText block zoom={1.6}>
                  {l.title}
                </LiquidText>
              </h3>
              <p className="t-label mt-4 mb-0 text-muted">{l.signal}</p>
              <p className="t-label mt-1 mb-0">{l.who}</p>
            </div>
            <p className="m-0 leading-[1.58] text-muted">{l.body}</p>
          </motion.article>
        ))}
      </div>
      <Reveal className="mt-12">
        <Prose>
          <p>
            The layer each of them acts at is what leaves the gap open. Scheduling is a reasonable lever for
            non-hyperscale deployments, but a facility running AI training or inference can’t shift its heat. Its plant
            has to decide.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
