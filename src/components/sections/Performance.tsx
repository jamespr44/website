"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Term";
import { EstimateNote } from "@/components/ui/SourceNote";
import { ModeYear } from "@/components/viz/ModeYear";
import { WaterComparison } from "@/components/viz/WaterComparison";
import { assumptions as a, brief } from "@/content/design";
import { DRY_APPROACH_K, ADIABATIC_LIMIT_C } from "@/lib/plantModes";
import { estimates as e, HOURS_PER_YEAR } from "@/lib/estimate";

const itKWh = brief.itLoadMW * 1000 * HOURS_PER_YEAR;
const wue = (ml: number) => ((ml * 1e6) / itKWh).toFixed(2);
const pct = (v: number) => `${Math.round(v * 100)}%`;
const h = (n: number) => n.toLocaleString("en-AU");

const results = [
  {
    name: "A · Cooling towers",
    water: e.tower.waterML,
    peak: e.tower.peakDayWaterML,
    pue: e.tower.pue,
    chiller: "—",
  },
  {
    name: "E · Proposed, supply normal",
    water: e.normal.waterML,
    peak: e.normal.peakDayWaterML,
    pue: e.normal.pue,
    chiller: h(e.normal.hours.chiller + e.normal.hours.chillerAdiabatic),
    self: true,
  },
  {
    name: "E · Proposed, drought year (= D)",
    water: e.drought.waterML,
    peak: e.drought.peakDayWaterML,
    pue: e.drought.pue,
    chiller: h(e.drought.hours.chiller),
  },
];

const assumptionRows: [string, string][] = [
  ["Weather", `Synthetic hourly year matched to Western Sydney monthly means; peak ${e.maxTempC.toFixed(1)} °C`],
  ["IT load", `${brief.itLoadMW} MW, constant, all 8,760 hours`],
  ["Dry cooler approach", `${DRY_APPROACH_K} K: free cooling up to ${brief.tcsSupplyC - DRY_APPROACH_K} °C dry-bulb`],
  ["Adiabatic band", `Pre-cooling keeps the chiller off up to ${ADIABATIC_LIMIT_C} °C dry-bulb`],
  ["Adiabatic water", `${a.adiabaticLPerKWh} L per kWh of heat rejected while spraying`],
  [
    "Chiller COP",
    `${a.chillerCopDry} dry, ${a.chillerCopAdiabatic} with pre-cooled air; carries the full load when running`,
  ],
  ["Fans and pumps", `${pct(a.dryFanPump)} of IT (+${(a.adiabaticPumpExtra * 100).toFixed(1)}% while spraying)`],
  ["Other overhead", `${pct(a.otherOverhead)} of IT: electrical losses, lighting, offices`],
  [
    "Tower baseline",
    `${a.towerLPerKWh} L/kWh evaporated every hour; fans and pumps ${(a.towerFanPump * 100).toFixed(1)}% of IT`,
  ],
];

export function Performance() {
  return (
    <Section
      id="performance"
      kicker="Indicative performance"
      title={
        <>
          {pct(e.waterSavedShare)} less water, for {(e.pueRise * 100).toFixed(1)}% more energy.
        </>
      }
      lede={
        <>
          A first-pass hourly model: every hour of a synthetic Western Sydney year run through the plant’s control
          logic, once with the community supply normal all year and once with drought restrictions all year.
        </>
      }
    >
      <Reveal className="mt-16">
        <ModeYear />
        <EstimateNote>Hover or drag across the year to read an hour</EstimateNote>
      </Reveal>

      <Reveal className="mt-20">
        <Prose>
          <p>
            Free cooling carries winter, spring, autumn and every night. The warm hours cluster on summer afternoons,
            exactly when a cooling tower would be drawing hardest. With water available, adiabatic assist absorbs most
            of them; under restrictions the chiller takes them all, and the plant uses no water.
          </p>
        </Prose>
      </Reveal>

      <Reveal className="mt-20">
        <WaterComparison />
        <EstimateNote>Tower evaporation only; drift and blowdown would add to the baseline</EstimateNote>
      </Reveal>

      <Reveal className="mt-20">
        <p className="t-label m-0 border-b border-rule pb-3">Results</p>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Indicative annual results by scenario</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="t-label py-3 pr-4 font-normal text-muted">
                  Scenario
                </th>
                {["Water, ML/yr", "Peak day, ML", "WUE, L/kWh", "PUE", "Chiller h/yr"].map((c) => (
                  <th key={c} scope="col" className="t-label py-3 pr-4 text-right font-normal text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.name} className={r.self ? "panel" : "border-b border-line"}>
                  <th scope="row" className="py-4 pr-4 pl-3 font-normal">
                    {r.name}
                  </th>
                  <td className="py-4 pr-4 text-right tabular-nums">{r.water.toFixed(0)}</td>
                  <td className="py-4 pr-4 text-right tabular-nums">{r.peak.toFixed(2)}</td>
                  <td className="py-4 pr-4 text-right tabular-nums">{wue(r.water)}</td>
                  <td className="py-4 pr-4 text-right tabular-nums">{r.pue.toFixed(3)}</td>
                  <td className="py-4 pr-4 text-right tabular-nums">{r.chiller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EstimateNote>
          <Term k="WUE" /> and <Term k="PUE" /> are annual; peak day is the highest single day of water use
        </EstimateNote>
      </Reveal>

      <div className="mt-24 grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
        <Reveal>
          <p className="t-label m-0">Method and assumptions</p>
          <p className="mt-5 mb-0 leading-[1.58] text-muted">
            Every figure on this page comes from one small model with the assumptions listed here, kept in the site’s
            source so they can be checked and changed. It is deliberately simple and conservative on the chiller. It is
            not a substitute for the hourly design study on measured weather, which is the next step.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="m-0 border-t border-rule">
            {assumptionRows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 border-b border-line py-3">
                <dt className="t-label pt-0.5 text-muted">{k}</dt>
                <dd className="m-0 text-sm leading-[1.5]">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
