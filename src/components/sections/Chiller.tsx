"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent } from "motion/react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { useScrub } from "@/lib/useScrub";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { figures } from "@/content/chapters";
import { ChillerCycle } from "@/components/viz/ChillerCycle";

const steps: { kicker: string; tone: string; title: string; body: React.ReactNode }[] = [
  {
    kicker: "Overview",
    tone: "#e7eef7",
    title: "A heat pump for the whole plant",
    body: (
      <>
        When the dry coolers can’t hold 30 °C on their own, the chiller takes the heat out of the IT loop and lifts it
        to a temperature the dry coolers can reject. Follow the refrigerant round the loop as you scroll.
      </>
    ),
  },
  {
    kicker: "1 · Evaporator",
    tone: "#38bdf8",
    title: "Heat goes into boiling refrigerant",
    body: (
      <>
        Warm water returning from the IT loop flows through tubes in the evaporator. Refrigerant around the tubes boils
        at low pressure and absorbs the heat, so the loop leaves at a steady 30 °C.
      </>
    ),
  },
  {
    kicker: "2 · Compressor",
    tone: "#f43f5e",
    title: "Two centrifugal stages do the lifting",
    body: (
      <>
        The compressor squeezes the refrigerant vapour, raising its pressure and temperature. This is where the
        chiller’s electricity goes. The bigger the lift between the evaporator and condenser, the more work it has to
        do.
      </>
    ),
  },
  {
    kicker: "3 · Condenser",
    tone: "#f59e0b",
    title: "Heat comes out at up to 55 °C",
    body: (
      <>
        Hot refrigerant condenses on the condenser tubes and heats the condenser water to as much as 55 °C. That is far
        above any Sydney air temperature, so dry coolers can reject it without evaporating a drop.
      </>
    ),
  },
  {
    kicker: "4 · Expansion valve",
    tone: "#a78bfa",
    title: "Pressure drops, and the cycle repeats",
    body: (
      <>
        The liquid refrigerant passes through an expansion valve. Its pressure falls, it cools sharply, and it flows
        back into the evaporator to pick up more heat.
      </>
    ),
  },
];

export function Chiller() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrub(ref);
  const reduced = useReducedMotionSafe();
  const [step, setStep] = useState(0);
  useMotionValueEvent(progress, "change", (v) =>
    setStep(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)))),
  );
  const s = steps[step];

  return (
    <Section
      id="chiller"
      tone="dark"
      kicker="Mode 2 · Mechanical cooling"
      title={<>When the air isn’t enough: the chiller.</>}
      lede={
        <>
          Past the crossing, the plant needs mechanical cooling. The design uses a high-temperature, two-stage
          centrifugal chiller with magnetic bearings, able to deliver <Term k="LCWT" /> up to {figures.chillerLcwtC} °C.
        </>
      }
    >
      <div ref={ref} className={reduced ? "mt-16" : "relative mt-16 h-[480vh]"}>
        <div
          className={
            reduced
              ? "grid gap-8 md:grid-cols-[0.8fr_1.2fr]"
              : "sticky top-0 flex h-svh flex-col justify-center gap-4 py-6 md:grid md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-10"
          }
        >
          <div className="order-2 md:order-1">
            {reduced ? (
              <ol className="space-y-6">
                {steps.map((st) => (
                  <li key={st.kicker}>
                    <p className="t-label">{st.kicker}</p>
                    <p className="mt-1 text-xl">{st.title}</p>
                    <p className="mt-2 text-muted">{st.body}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <div className="mb-5 flex gap-2" aria-hidden>
                  {steps.map((st, i) => (
                    <span
                      key={st.kicker}
                      className="h-px flex-1 transition-colors duration-500"
                      style={{ background: i <= step ? "var(--ink)" : "var(--line)" }}
                    />
                  ))}
                </div>
                <div className="relative min-h-[13rem] md:min-h-[16rem]" aria-live="polite">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={s.kicker}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <p className="t-label">{s.kicker}</p>
                      <p className="t-sub mt-3">{s.title}</p>
                      <p className="mt-4 leading-relaxed text-muted md:text-lg">{s.body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
          <div className="order-1 w-full md:order-2">
            <ChillerCycle step={reduced ? 0 : step} />
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-14 md:grid-cols-2 md:gap-10">
        <Reveal className="border-t border-rule pt-7">
          <p className="t-label">Why 55 °C matters</p>
          <p className="mt-4 leading-relaxed text-muted">
            A conventional chiller rejects heat at temperatures that need a cooling tower. Leaving the condenser at up
            to 55 °C keeps the rejection side dry, so even Mode 2 uses no evaporative water.
          </p>
          <SourceNote>Carrier (n.d.), AquaEdge 19MV4</SourceNote>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-rule pt-7">
          <p className="t-label">The price: energy</p>
          <p className="mt-4 leading-relaxed text-muted">
            Every hour the chiller runs costs compressor power. The annual chiller energy penalty of a low TCS setpoint
            is severe in hot climates and negligible in cold ones, which is why the hours it must run in Sydney matter.
          </p>
          <SourceNote>Vertiv &amp; Open Compute Project (2026)</SourceNote>
        </Reveal>
      </div>
      <Reveal className="mt-12">
        <Prose>
          <p>
            The chiller is the plant’s fallback, not its default. It runs only when free cooling can’t hold the
            setpoint. How many hours that is, and what they cost, is the question the design study answers.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
