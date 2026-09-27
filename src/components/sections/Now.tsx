"use client";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { SourceNote } from "@/components/ui/SourceNote";

export function Now() {
  return (
    <>
      <Section
        id="now"
        tone="dark"
        kicker="Why it matters now"
        title={<>The gate is becoming a requirement, not a preference.</>}
      >
        <div className="mt-24 grid gap-14 md:grid-cols-2 md:gap-10">
          <Reveal className="border-t border-rule pt-7">
            <p className="t-label m-0">Commonwealth</p>
            <p className="mt-6 mb-0 text-lg leading-[1.58] text-inkstone">
              For the first time, sustainable water use is an explicit expectation of new data centre and AI
              infrastructure developments.
            </p>
            <SourceNote>Department of Industry, Science and Resources (2026)</SourceNote>
          </Reveal>
          <Reveal delay={0.1} className="border-t border-rule pt-7">
            <p className="t-label m-0">New South Wales</p>
            <p className="mt-6 mb-0 text-lg leading-[1.58] text-inkstone">
              Facilities that use potable water must be designed to reduce water use under drought restrictions.
            </p>
            <SourceNote>Infrastructure NSW (2026), NSW data centre guidelines</SourceNote>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <p className="t-sub m-0 max-w-[760px] text-muted">
            That makes a separable gating layer a compliance requirement as well as an engineering and ethical one.
          </p>
        </Reveal>

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

      <footer className="band-dark border-t border-line px-4 pt-10 pb-12 sm:px-8">
        <div className="mx-auto grid max-w-[1078px] gap-8 md:grid-cols-3">
          <div className="t-caption space-y-2 text-muted">
            <p className="m-0 text-ink">James Gianoutsos</p>
            <p className="m-0">Literature review, 2026</p>
          </div>
          <p className="t-caption m-0 text-muted">
            Optimised Warm Chilled Water Cooling with Trigger-Based Adiabatic Assist: Minimising Data Centre Water
            Impact on Constrained Community Supply
          </p>
          <a href="#intro" className="pill pill-sm justify-self-start md:justify-self-end">
            Back to top
          </a>
        </div>
      </footer>
    </>
  );
}
