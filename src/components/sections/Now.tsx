"use client";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SourceNote } from "@/components/ui/SourceNote";

export function Now() {
  return (
    <>
      <Section
        id="now"
        kicker="Why it matters now"
        title={<>The gate is becoming a requirement, not a preference.</>}
        className="overflow-hidden"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
          {[0, 3, 6].map((d) => (
            <span
              key={d}
              className="ripple absolute size-[70vmin] rounded-full border border-water/30"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-line bg-card/60 p-8 backdrop-blur">
            <p className="text-xs tracking-widest text-faint uppercase">Commonwealth</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              For the first time, sustainable water use is an explicit expectation of new data centre and AI
              infrastructure developments.
            </p>
            <SourceNote>Department of Industry, Science and Resources (2026)</SourceNote>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-water/40 bg-water/[0.06] p-8 backdrop-blur">
            <p className="text-xs tracking-widest text-water uppercase">New South Wales</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Facilities that use potable water must be{" "}
              <span className="text-ink">designed to reduce water use under drought restrictions</span>.
            </p>
            <SourceNote>Infrastructure NSW (2026), NSW data centre guidelines</SourceNote>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <p className="max-w-3xl text-xl leading-relaxed text-muted">
            That makes a separable gating layer a compliance requirement as well as an engineering and ethical one.
          </p>
        </Reveal>

        <Reveal className="mt-32 text-center">
          <p className="mx-auto max-w-4xl font-display text-4xl leading-tight font-semibold text-balance md:text-6xl">
            Reject heat to the air.
            <br />
            <span className="bg-gradient-to-r from-water to-cyan-200 bg-clip-text text-transparent">
              Use water only when the community can spare it.
            </span>
          </p>
        </Reveal>
      </Section>

      <footer className="border-t border-line px-5 py-12 sm:px-8 md:pl-28">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-faint md:flex-row">
          <p>
            <span className="text-muted">James Gianoutsos</span> · Literature review: Optimised Warm Chilled Water
            Cooling with Trigger-Based Adiabatic Assist
          </p>
          <a href="#intro" className="hover:text-water">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
