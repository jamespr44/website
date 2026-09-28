"use client";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Term";
import { brief } from "@/content/design";

const parameters: [string, React.ReactNode][] = [
  ["Facility", <>AI training and inference data centre (hypothetical client)</>],
  ["Site", brief.location],
  ["IT load", <>{brief.itLoadMW} MW, near-constant. AI load can’t be shifted to another hour or another site.</>],
  [
    "Cooling",
    <>
      {brief.cooling}. <Term k="TCS" /> supply {brief.tcsSupplyC} °C ({brief.tcsClass}).
    </>,
  ],
  ["Redundancy", <>{brief.redundancy} on heat rejection and on chillers</>],
  [
    "Design ambient",
    <>
      {brief.designDryBulbC} °C <Term k="dryBulb" />. Penrith recorded 48.9 °C in January 2020.
    </>,
  ],
  ["Water", <>Potable supply from the local utility, subject to drought restrictions</>],
];

const criteria: [string, React.ReactNode][] = [
  ["Water", <>Minimise potable water use, and use none at all while the community supply is restricted.</>],
  ["Reliability", <>Hold {brief.tcsSupplyC} °C supply on the design day with any one unit out of service.</>],
  [
    "Energy",
    <>
      Stay within a few per cent of a cooling tower plant’s annual <Term k="PUE" />.
    </>,
  ],
  [
    "Compliance",
    <>
      Meet the Commonwealth expectation of sustainable water use, and the NSW requirement to reduce water use under
      drought restrictions.
    </>,
  ],
  ["Future-proofing", <>Keep working as the climate warms and as next-generation hardware asks for cooler water.</>],
];

export function Brief() {
  return (
    <Section
      id="brief"
      kicker="Design brief"
      title={<>A hot site, a constant load, a shared water supply.</>}
      lede={
        <>
          The client and site are hypothetical, and chosen to be difficult: a warm, humid climate where dry cooling is
          least proven, and a load that never lets up.
        </>
      }
    >
      <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-10">
        <Reveal className="border-t border-rule pt-7">
          <p className="t-label m-0">Brief</p>
          <dl className="m-0 mt-6">
            {parameters.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-b border-line py-4">
                <dt className="t-label pt-1 text-muted">{k}</dt>
                <dd className="m-0 leading-normal">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-rule pt-7">
          <p className="t-label m-0">Design criteria</p>
          <ol className="m-0 mt-6 p-0">
            {criteria.map(([k, v], i) => (
              <li key={k} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-b border-line py-4">
                <span className="t-label pt-1 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-normal">
                  <span className="text-ink">{k}.</span> <span className="text-muted">{v}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
