"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { IridescentBackdrop } from "@/components/ui/IridescentBackdrop";
import { brief } from "@/content/design";

const ease = [0.19, 1, 0.22, 1] as const;
const lines = ["Cooling", "the cloud"];

const facts = [
  ["Facility", `${brief.itLoadMW} MW IT, AI`],
  ["Location", brief.location],
  ["TCS supply", `${brief.tcsSupplyC} °C`],
  ["Stage", brief.stage],
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0]);

  return (
    <section
      ref={ref}
      id="intro"
      data-chapter="intro"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black px-4 text-white"
    >
      <IridescentBackdrop />

      <motion.div style={{ y, opacity }} className="relative flex flex-col items-center gap-9 text-center">
        <h1 className="t-display m-0">
          {lines.map((line, i) => (
            <span key={line} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.25, delay: 0.2 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.25, delay: 0.9, ease }}
          className="t-label m-0 max-w-[560px] leading-[1.6] text-white/85"
        >
          A concept design proposal: a warm chilled water plant that rejects heat to the air and uses water only when
          the community can spare it
        </motion.p>
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.25, delay: 1.1, ease }}
          className="m-0 grid grid-cols-2 gap-x-10 gap-y-4 border-t border-white/40 pt-5 text-left sm:grid-cols-4"
        >
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="t-caption text-white/70">{k}</dt>
              <dd className="m-0 mt-1 text-[15px]">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <a
        href="#summary"
        aria-label="Scroll down to begin"
        className="absolute bottom-6 left-4 block size-[104px] sm:bottom-9 sm:left-8 md:size-[112px]"
      >
        <svg viewBox="0 0 112 112" className="badge-spin absolute inset-0 size-full" aria-hidden>
          <defs>
            <path id="badge-circle" d="M56,56 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text fill="currentColor" fontSize="10.5" letterSpacing="3.2">
            <textPath href="#badge-circle">SCROLL DOWN · SCROLL DOWN · SCROLL DOWN ·</textPath>
          </text>
        </svg>
        <svg viewBox="0 0 112 112" className="absolute inset-0 size-full" aria-hidden>
          <path d="M56 44 L56 68 M48 60 L56 68 L64 60" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </a>
      <p className="t-caption absolute right-4 bottom-10 m-0 text-white/80 sm:right-8 sm:bottom-12">
        {brief.stage} · {brief.year} · James Gianoutsos
      </p>
    </section>
  );
}
