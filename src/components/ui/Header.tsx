"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { chapters, type ChapterId } from "@/content/chapters";

const ease = [0.19, 1, 0.22, 1] as const;

/**
 * Transparent fixed header. `mix-blend-mode: difference` keeps it legible over white, black and the hero backdrop
 * without ever changing colour. The Index pill opens a full-screen chapter list.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ChapterId>("intro");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-white mix-blend-difference"
      />
      <header className="fixed inset-x-0 top-0 z-40 grid h-[66px] grid-cols-[1fr_auto] items-center px-4 text-white mix-blend-difference sm:px-8 md:grid-cols-3">
        <a href="#intro" className="justify-self-start text-[15px] transition-opacity duration-300 hover:opacity-60">
          James Gianoutsos
        </a>
        <span className="t-label hidden justify-self-center md:block">Literature review · 2026</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="chapter-index"
          className="pill pill-sm justify-self-end border-white/40 text-white hover:bg-white hover:text-black"
        >
          Index
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="chapter-index"
            aria-label="Chapters"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease }}
            className="band-dark fixed inset-0 z-[60] overflow-y-auto px-4 pt-[66px] pb-12 sm:px-8"
          >
            <div className="fixed inset-x-0 top-0 flex h-[66px] items-center justify-between px-4 sm:px-8">
              <span className="text-[15px]">Index</span>
              <button type="button" onClick={() => setOpen(false)} className="pill pill-sm" autoFocus>
                Close
              </button>
            </div>
            <ol className="mx-auto mt-10 max-w-[1078px] border-t border-line">
              {chapters.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.03, ease }}
                  className="border-b border-line"
                >
                  <a
                    href={`#${c.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={c.id === active ? "location" : undefined}
                    className={`flex items-baseline gap-6 py-3 transition-opacity duration-300 hover:opacity-100 md:py-4 ${
                      c.id === active ? "opacity-100" : "opacity-55"
                    }`}
                  >
                    <span className="t-label w-8 tabular-nums">{String(i).padStart(2, "0")}</span>
                    <span className="text-[28px] leading-[1.15] font-light tracking-[-0.01em] md:text-[45px]">
                      {c.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ol>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
