"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { animate, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { figures } from "@/content/chapters";

const AMBIENT = 35;
const DryCooler3D = dynamic(() => import("@/components/three/DryCooler3D"), { ssr: false });

function useAnimatedNumber(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  const reduced = useReducedMotionSafe();
  useEffect(() => {
    if (reduced) {
      from.current = target;
      setV(target);
      return;
    }
    const c = animate(from.current, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (x) => {
        from.current = x;
        setV(x);
      },
    });
    return () => c.stop();
  }, [target, reduced]);
  return v;
}

export function SprayCooling() {
  const [on, setOn] = useState(false);
  const air = useAnimatedNumber(on ? AMBIENT - figures.yangAirDropK : AMBIENT);

  return (
    <div className="rounded-3xl border border-line bg-card/60 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn((o) => !o)}
          className="flex items-center gap-3 rounded-full border border-line bg-bg/60 py-2 pr-5 pl-2 text-sm"
        >
          <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-water" : "bg-faint/50"}`}>
            <motion.span layout className={`absolute top-1 size-4 rounded-full bg-ink ${on ? "right-1" : "left-1"}`} />
          </span>
          Adiabatic pre-cooling {on ? "on" : "off"}
        </button>
        <p className="text-xs text-faint">Example ambient: {AMBIENT} °C, humid-hot afternoon</p>
      </div>

      <div className="relative -mx-2 mt-4 md:-mx-4">
        <DryCooler3D spray={on} />
        <div className="pointer-events-none absolute top-3 left-3 rounded-xl border border-line bg-bg/70 px-3 py-2 text-xs backdrop-blur">
          <span className="text-faint">Air entering coil</span>{" "}
          <span className={`font-semibold tabular-nums ${on ? "text-water" : "text-heat"}`}>{air.toFixed(1)} °C</span>
        </div>
        <p className="pointer-events-none absolute right-3 bottom-3 hidden text-[11px] text-faint md:block">
          Drag to orbit
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">Entering air</p>
          <p className={`mt-1 font-display text-4xl font-semibold tabular-nums ${on ? "text-water" : "text-heat"}`}>
            {air.toFixed(1)} °C
          </p>
          <p className="text-xs text-faint">up to −{figures.yangAirDropK} K with spray</p>
        </div>
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">Condensing temp.</p>
          <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-ink">
            {on ? `−${figures.yangCondensingDropK}` : "0.0"} K
          </p>
          <p className="text-xs text-faint">reduction, up to {figures.yangCondensingDropK} K</p>
        </div>
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">Mist approach</p>
          <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-ink">
            {figures.yangMistApproachK} K
          </p>
          <p className="text-xs text-faint">to wet-bulb, at best</p>
        </div>
      </div>
      <p className="mt-6 text-xs text-faint">
        The reductions are the maxima reported, and depend on how far the wet-bulb sits below the dry-bulb. Humid air
        leaves less room.
      </p>
    </div>
  );
}
