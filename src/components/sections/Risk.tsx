"use client";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SourceNote } from "@/components/ui/SourceNote";
import { brief } from "@/content/design";

const register: [string, string, string][] = [
  [
    `Heatwave beyond the ${brief.designDryBulbC} °C design day, with water restricted`,
    "Chillers at their highest lift; dry cooler capacity derates.",
    "N+1 chillers and dry coolers; design day close to the Penrith record; agreed emergency provisions with the utility, logged.",
  ],
  [
    "Next-generation hardware needs supply below 30 °C",
    "Fewer free-cooling hours, more chiller energy.",
    "Chillers sized for the full IT load; setpoint reset tested in the design study.",
  ],
  [
    "Humid heat weakens adiabatic pre-cooling",
    "Chiller runs more often than the dry-bulb model suggests.",
    "Design study models wet-bulb depression hour by hour; the chiller covers any shortfall.",
  ],
  [
    "Controls fault or lost utility signal",
    "Gate state uncertain.",
    "Gate fails closed; watchdog on the feed; manual overrides logged.",
  ],
  [
    "Water quality in the pre-coolers",
    "Microbial growth in wetted media.",
    "Units drained when idle; water treatment and a water risk management plan.",
  ],
  [
    "Refrigerant leakage",
    "Direct emissions.",
    "Low-GWP refrigerant, leak detection and a refrigerant management plan.",
  ],
];

export function Risk() {
  return (
    <Section id="risk" kicker="Compliance and risk" title={<>The gate is becoming a requirement, not a preference.</>}>
      <div className="mt-24 grid gap-14 md:grid-cols-2 md:gap-10">
        <Reveal className="border-t border-rule pt-7">
          <p className="t-label m-0">Commonwealth</p>
          <p className="mt-6 mb-0 text-lg leading-[1.58] text-inkstone">
            Sustainable water use is, for the first time, an explicit expectation of new data centre and AI
            infrastructure developments.
          </p>
          <SourceNote>Department of Industry, Science and Resources (2026)</SourceNote>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-rule pt-7">
          <p className="t-label m-0">New South Wales</p>
          <p className="mt-6 mb-0 text-lg leading-[1.58] text-inkstone">
            Facilities that use potable water must be designed to reduce water use under drought restrictions. The gate
            does exactly that, and its log shows it.
          </p>
          <SourceNote>Infrastructure NSW (2026), NSW data centre guidelines</SourceNote>
        </Reveal>
      </div>

      <Reveal className="mt-24">
        <p className="t-label m-0 border-b border-rule pb-3">Risk register · concept</p>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Risk register</caption>
            <thead>
              <tr className="border-b border-line">
                {["Risk", "Consequence", "Mitigation"].map((c) => (
                  <th key={c} scope="col" className="t-label py-3 pr-4 font-normal text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {register.map(([risk, consequence, mitigation]) => (
                <tr key={risk} className="border-b border-line align-top">
                  <th scope="row" className="w-[34%] py-4 pr-4 font-normal leading-[1.5]">
                    {risk}
                  </th>
                  <td className="w-[26%] py-4 pr-4 text-sm leading-[1.5] text-muted">{consequence}</td>
                  <td className="py-4 text-sm leading-[1.5]">{mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
