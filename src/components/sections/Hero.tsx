"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { seeded } from "@/lib/random";

const rand = seeded(7);
const vapour = Array.from({ length: 28 }, () => ({
  left: rand() * 100,
  size: 40 + rand() * 140,
  delay: rand() * 10,
  duration: 12 + rand() * 10,
  drift: (rand() - 0.5) * 120,
}));

const headline = ["Cooling", "the", "cloud", "without", "draining", "the", "tap."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);
  const glow = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  return (
    <header
      ref={ref}
      id="intro"
      data-chapter="intro"
      className="relative flex min-h-svh items-center overflow-hidden px-5 sm:px-8 md:pl-28"
    >
      {/* Heat below, deep water above */}
      <motion.div
        aria-hidden
        style={{ scale: glow }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_55%_at_50%_110%,rgba(245,158,11,0.35),transparent_60%),radial-gradient(ellipse_60%_50%_at_80%_0%,rgba(56,189,248,0.18),transparent_60%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {!reduced &&
          vapour.map((p, i) => (
            <motion.span
              key={i}
              className="absolute bottom-[-20%] rounded-full bg-white/[0.05] blur-2xl"
              style={{ left: `${p.left}%`, width: p.size, height: p.size }}
              animate={{ y: ["0vh", "-130vh"], x: [0, p.drift], opacity: [0, 1, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
      </div>

      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-6xl py-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mb-8 text-xs font-medium tracking-[0.3em] text-water uppercase"
        >
          Literature review · Data centre heat rejection
        </motion.p>
        <h1 className="max-w-5xl font-display text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl lg:text-8xl">
          {headline.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
              <motion.span
                className={`inline-block ${word === "tap." ? "bg-gradient-to-r from-water to-cyan-200 bg-clip-text text-transparent" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
              {i < headline.length - 1 && " "}
            </span>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="mt-10 max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            Optimised warm chilled water cooling with trigger-based adiabatic assist: minimising data centre water
            impact on constrained community supply.
          </p>
          <p className="mt-6 text-sm tracking-wide text-faint">James Gianoutsos</p>
        </motion.div>
      </motion.div>

      <motion.a
        href="#pressure"
        aria-label="Scroll to begin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.25em] text-muted uppercase"
      >
        Scroll
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 block h-4 bg-water"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </header>
  );
}
