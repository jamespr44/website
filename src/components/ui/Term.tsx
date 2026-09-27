"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { glossary, type GlossaryKey } from "@/content/glossary";

/** Glossary term with a tooltip that opens on hover, focus or tap. */
export function Term({ k, children }: { k: GlossaryKey; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const entry = glossary[k];

  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="cursor-help border-b border-dotted border-water/70 text-inherit decoration-0 transition-colors hover:text-water"
      >
        {children ?? entry.term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 block w-64 max-w-[75vw] -translate-x-1/2 rounded-xl border border-line bg-raised/95 p-3 text-left font-sans text-sm leading-snug font-normal text-muted shadow-2xl shadow-black/50 backdrop-blur"
          >
            <span className="mb-1 block font-semibold text-ink">{entry.term}</span>
            {entry.def}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
