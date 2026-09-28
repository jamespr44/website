"use client";

import { useState } from "react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Term";
import { brief } from "@/content/design";
import { ADIABATIC_LIMIT_C, FREE_COOLING_LIMIT_C } from "@/lib/plantModes";

const sequence: { mode: string; enters: string; leaves: string; plant: string }[] = [
  {
    mode: "1 · Free cooling",
    enters: `Dry-bulb ≤ ${FREE_COOLING_LIMIT_C} °C`,
    leaves: `Dry-bulb > ${FREE_COOLING_LIMIT_C} °C for 15 min`,
    plant: `Chillers bypassed. Dry cooler fans modulate on ${brief.tcsSupplyC} °C supply. Sprays off.`,
  },
  {
    mode: "3 · Adiabatic assist",
    enters: `Dry-bulb > ${FREE_COOLING_LIMIT_C} °C and the water gate is open`,
    leaves: `Dry-bulb < ${FREE_COOLING_LIMIT_C - 1} °C, or the gate closes`,
    plant: "Sprays staged unit by unit on supply temperature. Chillers stay off.",
  },
  {
    mode: "2 · Chiller",
    enters: `Dry-bulb > ${ADIABATIC_LIMIT_C} °C, or > ${FREE_COOLING_LIMIT_C} °C with the gate closed`,
    leaves: `Dry-bulb < ${ADIABATIC_LIMIT_C - 1} °C (or < ${FREE_COOLING_LIMIT_C - 1} °C, gate closed); 20 min minimum run`,
    plant:
      "Chillers staged on load. Dry coolers reject condenser water at up to 55 °C. Sprays only if the gate is open.",
  },
];

const inputs = [
  { key: "restrictions", label: "Drought restrictions in force", source: "Utility restriction level" },
  { key: "tank", label: "Break tank below reserve", source: "On-site level transmitter" },
  { key: "operator", label: "Operator lockout", source: "Plant control system" },
  { key: "signal", label: "Restriction signal lost", source: "Watchdog on the utility feed" },
] as const;

type InputKey = (typeof inputs)[number]["key"];

function WaterGate() {
  const [on, setOn] = useState<Record<InputKey, boolean>>({
    restrictions: false,
    tank: false,
    operator: false,
    signal: false,
  });
  const blockers = inputs.filter((i) => on[i.key]);
  const open = blockers.length === 0;

  return (
    <div className="grid gap-10 border-t border-rule pt-7 md:grid-cols-[1.2fr_0.8fr] md:gap-14">
      <div>
        <p className="t-label m-0">Inputs · any one closes the gate</p>
        <ul className="m-0 mt-5 p-0">
          {inputs.map((i) => (
            <li key={i.key} className="flex items-center justify-between gap-4 border-b border-line py-3">
              <span>
                <span className="block">{i.label}</span>
                <span className="t-caption block text-faint">{i.source}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={on[i.key]}
                aria-label={i.label}
                onClick={() => setOn((s) => ({ ...s, [i.key]: !s[i.key] }))}
                className={`pill pill-sm min-w-[64px] shrink-0 ${on[i.key] ? "bg-ink text-bg" : ""}`}
              >
                {on[i.key] ? "Yes" : "No"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div aria-live="polite" className="flex flex-col justify-center">
        <p className="t-label m-0">Water gate</p>
        <p data-testid="water-gate" className="t-sub mt-3 mb-0 flex items-center gap-4">
          <span aria-hidden className={`inline-block size-4 rounded-full ${open ? "bg-sage" : "bg-oxblood"}`} />
          {open ? "Open" : "Closed"}
        </p>
        <p className="mt-4 mb-0 leading-[1.5] text-muted">
          {open
            ? "Adiabatic assist is permitted. The plant may use water in modes 2 and 3 when the weather calls for it."
            : `Adiabatic assist is locked out (${blockers.map((b) => b.label.toLowerCase()).join("; ")}). The chiller carries the load, and the plant uses no water.`}
        </p>
      </div>
    </div>
  );
}

export function Controls() {
  return (
    <Section
      id="controls"
      kicker="Control strategy"
      title={<>The community’s water system holds the switch.</>}
      lede={
        <>
          The plant chooses its mode from the weather. Whether it may use water is decided by a separate gate that
          watches the local supply, and fails closed.
        </>
      }
    >
      <Reveal className="mt-20">
        <p className="t-label m-0 border-b border-rule pb-3">Sequence of operations · concept</p>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Sequence of operations</caption>
            <thead>
              <tr className="border-b border-line">
                {["Mode", "Enters when", "Leaves when", "Plant"].map((h) => (
                  <th key={h} scope="col" className="t-label py-3 pr-4 font-normal text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sequence.map((r) => (
                <tr key={r.mode} className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-normal whitespace-nowrap">
                    {r.mode}
                  </th>
                  <td className="py-4 pr-4 text-sm leading-[1.5]">{r.enters}</td>
                  <td className="py-4 pr-4 text-sm leading-[1.5]">{r.leaves}</td>
                  <td className="py-4 text-sm leading-[1.5] text-muted">{r.plant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-caption mt-5 text-faint">
          Setpoints, deadbands and timers are concept-stage and are tuned in the design study. <Term k="dryBulb" /> is
          measured at the dry cooler inlets, shielded from their own exhaust.
        </p>
      </Reveal>

      <Reveal className="mt-24">
        <WaterGate />
      </Reveal>

      <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
        {[
          {
            t: "Fails closed",
            b: "Lose the utility signal, the tank level or the controller, and the gate shuts. The safe state for the community is a dry plant.",
          },
          {
            t: "Costs energy, never capacity",
            b: "The chillers carry the full load without water, so closing the gate can raise PUE but can never let the supply temperature drift.",
          },
          {
            t: "Separable and auditable",
            b: "The gate is its own logic block with its own log of restriction state and spray hours, so compliance can be shown, not asserted.",
          },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.08} className="border-t border-rule pt-6">
            <h3 className="m-0 text-lg font-normal">{c.t}</h3>
            <p className="mt-3 mb-0 text-sm leading-[1.55] text-muted">{c.b}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <Prose>
          <p>
            Keeping the gate separate from the mode logic is the point of the design. Earlier work switched cooling
            modes on signals from inside the facility; here the signal comes from the supply the plant draws on, and
            nothing the plant needs can override it.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
