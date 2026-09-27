"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { chapters, type ChapterId } from "@/content/chapters";

export function ProgressRail() {
  const [active, setActive] = useState<ChapterId>("intro");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as ChapterId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-water via-heat to-hot"
      />
      <nav aria-label="Chapters" className="fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 md:block">
        <ol className="flex flex-col gap-3">
          {chapters.map((c, i) => {
            const isActive = c.id === active;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex items-center gap-3 py-0.5"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-500 ${
                      isActive ? "w-6 bg-water" : "w-2 bg-faint group-hover:bg-muted"
                    }`}
                  />
                  <span
                    className={`pointer-events-none -translate-x-1 rounded bg-bg/80 px-1.5 py-0.5 text-xs whitespace-nowrap opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                      isActive ? "text-ink" : "text-muted"
                    }`}
                  >
                    <span className="mr-1.5 tabular-nums text-faint">{String(i).padStart(2, "0")}</span>
                    {c.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
