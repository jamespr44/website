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
    <div className="border-t border-rule pt-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn((o) => !o)}
          className={`pill ${on ? "bg-ink text-bg" : ""}`}
        >
          <span className="relative h-[14px] w-[26px] rounded-[75px] border border-current">
            <motion.span
              layout
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className={`absolute top-[2px] size-2 rounded-full bg-current ${on ? "right-[2px]" : "left-[2px]"}`}
            />
          </span>
          Adiabatic pre-cooling {on ? "on" : "off"}
        </button>
        <p className="t-caption m-0 text-faint">Example ambient: {AMBIENT} °C, humid-hot afternoon</p>
      </div>

      <div className="relative -mx-2 mt-4 md:-mx-4">
        <DryCooler3D spray={on} />
        <div className="t-label pointer-events-none absolute top-3 left-3 bg-bg px-3 py-2">
          <span className="text-faint">Air entering coil</span>{" "}
          <span className="tabular-nums">{air.toFixed(1)} °C</span>
        </div>
        <p className="pointer-events-none absolute right-3 bottom-3 hidden text-[11px] text-faint md:block">
          Drag to orbit
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="t-label text-faint">Entering air</p>
          <p className="t-sub mt-1 tabular-nums">{air.toFixed(1)} °C</p>
          <p className="text-xs text-faint">up to −{figures.yangAirDropK} K with spray</p>
        </div>
        <div>
          <p className="t-label text-faint">Condensing temp.</p>
          <p className="t-sub mt-1 tabular-nums">{on ? `−${figures.yangCondensingDropK}` : "0.0"} K</p>
          <p className="text-xs text-faint">reduction, up to {figures.yangCondensingDropK} K</p>
        </div>
        <div>
          <p className="t-label text-faint">Mist approach</p>
          <p className="t-sub mt-1 tabular-nums">{figures.yangMistApproachK} K</p>
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
