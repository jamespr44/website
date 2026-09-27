"use client";

import { motion } from "motion/react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
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
      <div className="relative mt-16 space-y-5">
        <div
          aria-hidden
          className="absolute top-6 bottom-6 left-[1.35rem] w-px bg-gradient-to-b from-line via-line to-water/60 md:left-[1.85rem]"
        />
        {layers.map((l, i) => (
          <motion.article
            key={l.tier}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`relative grid gap-4 rounded-3xl border p-6 pl-16 md:grid-cols-[14rem_1fr] md:p-8 md:pl-20 ${
              l.gap ? "border-water/60 bg-water/[0.07]" : "border-line bg-card/50"
            }`}
          >
            <motion.span
              aria-hidden
              className={`absolute top-8 left-4 grid size-6 place-items-center rounded-full border text-[10px] font-semibold md:left-6 ${
                l.gap ? "border-water bg-water text-bg" : "border-faint bg-bg text-muted"
              }`}
              animate={
                l.gap ? { boxShadow: ["0 0 0 0 rgba(56,189,248,0.6)", "0 0 0 14px rgba(56,189,248,0)"] } : undefined
              }
              transition={l.gap ? { duration: 1.8, repeat: Infinity } : undefined}
            >
              {i + 1}
            </motion.span>
            <div>
              <p className={`text-xs tracking-widest uppercase ${l.gap ? "text-water" : "text-faint"}`}>{l.tier}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight font-semibold">{l.title}</h3>
              <p className="mt-3 text-xs text-muted">{l.signal}</p>
              <p className={`mt-1 text-xs ${l.gap ? "font-semibold text-water" : "text-faint"}`}>{l.who}</p>
            </div>
            <p className="leading-relaxed text-muted">{l.body}</p>
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
