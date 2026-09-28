"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { EstimateNote, SourceNote } from "@/components/ui/SourceNote";
import { GapMatrix, type MatrixRow } from "@/components/viz/GapMatrix";
import { estimates as e } from "@/lib/estimate";

const criteria = ["Annual water", "Water in drought", "Energy", `Holds 30 °C year-round`, "Compliance"];

const ml = (v: number) => `${Math.round(v)} ML/yr`;

const options: MatrixRow[] = [
  {
    who: "A · Evaporative cooling towers",
    note: `The baseline. ${ml(e.tower.waterML)}, heaviest in heatwaves. PUE ${e.tower.pue.toFixed(2)}.`,
    marks: ["no", "no", "yes", "yes", "no"],
  },
  {
    who: "B · Towers + fleet workload shifting",
    note: "Moves load to less stressed regions. AI training and inference are near-constant, so little can move.",
    marks: ["part", "part", "yes", "yes", "part"],
  },
  {
    who: "C · Chiller-less dry cooling",
    note: `No water, lowest plant cost, but can’t hold 30 °C for ${Math.round((1 - e.freeShare) * 100)}% of the year.`,
    marks: ["yes", "yes", "yes", "no", "part"],
  },
  {
    who: "D · Dry coolers + chiller, never wet",
    note: `No water at all. Chiller runs ${e.drought.hours.chiller.toLocaleString("en-AU")} h/yr. PUE ${e.drought.pue.toFixed(2)}.`,
    marks: ["yes", "yes", "part", "yes", "yes"],
  },
  {
    who: "E · Proposed: dry + chiller + gated adiabatic",
    note: `${ml(e.normal.waterML)} in a normal year, none in a drought. PUE ${e.normal.pue.toFixed(2)}; becomes D under restrictions.`,
    marks: ["part", "yes", "yes", "yes", "yes"],
    self: true,
  },
];

export function Options() {
  return (
    <Section
      id="options"
      kicker="Options appraisal"
      title={<>Five ways to reject 20 MW. One keeps both the water and the energy.</>}
      lede={
        <>
          Each option is scored against the brief. The towers win on energy and lose on water; a plant that never uses
          water wins on water and pays in chiller energy. The proposal takes the water only when it is cheap for the
          community to give.
        </>
      }
    >
      <Reveal className="mt-16">
        <GapMatrix
          criteria={criteria}
          rows={options}
          rowHeader="Option"
          caption="Heat rejection options scored against the design criteria"
        />
        <p className="t-caption mt-5 text-faint">✓ meets the criterion · ◐ partly · – does not.</p>
        <EstimateNote>Water, chiller hours and PUE from the model under Indicative performance</EstimateNote>
      </Reveal>

      <div className="mt-24 grid gap-12 md:grid-cols-2 md:gap-10">
        <Reveal className="border-t border-rule pt-7">
          <p className="t-label m-0">Why not move the load?</p>
          <p className="mt-4 mb-0 leading-[1.58] text-muted">
            Stress-aware scheduling cuts stress-adjusted water use by up to a quarter across a fleet, but it needs load
            that can wait or travel. A facility running AI training or inference can’t shift its heat. Its plant has to
            decide.
          </p>
          <SourceNote>Talukder et al. (2026)</SourceNote>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-rule pt-7">
          <p className="t-label m-0">Why not switch on the plant’s own needs?</p>
          <p className="mt-4 mb-0 leading-[1.58] text-muted">
            Cooling-mode switching is established, but the switching signal has always come from inside the facility.
            Here it comes from the community’s water system, so the plant stops drawing water at the moment the supply
            is restricted.
          </p>
          <SourceNote>Gnibga et al. (2024)</SourceNote>
        </Reveal>
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="t-label m-0">Precedents</p>
          <Prose className="mt-6">
            <p>
              The pieces of the proposal have each been built and measured somewhere. None of the published work
              combines them at a 30 °C setpoint, in a warm, humid climate, with the switch at the plant.
            </p>
          </Prose>
        </Reveal>
        <Reveal className="mt-10">
          <GapMatrix />
          <p className="t-caption mt-5 text-faint">✓ addressed · ◐ partly · – not addressed.</p>
        </Reveal>
      </div>
    </Section>
  );
}
