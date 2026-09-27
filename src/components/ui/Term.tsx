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
        className="cursor-help border-b border-dotted border-current text-inherit decoration-0 transition-opacity duration-300 hover:opacity-60"
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
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 block w-64 max-w-[75vw] -translate-x-1/2 bg-raised px-4 py-3.5 text-left font-sans text-xs leading-normal font-normal tracking-normal text-[#9a9a9a] outline outline-1 outline-white/20"
          >
            <span className="mb-1 block text-white">{entry.term}</span>
            {entry.def}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
