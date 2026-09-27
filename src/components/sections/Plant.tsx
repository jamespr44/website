"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, AnimatePresence, motion, type AnimationPlaybackControls } from "motion/react";
import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Term";
import { PlantSchematic } from "@/components/viz/PlantSchematic";
import { ADIABATIC_LIMIT_C, FREE_COOLING_LIMIT_C, selectMode, type WaterState } from "@/lib/plantModes";

const T_MIN = 10;
const T_MAX = 42;
const pct = (t: number) => ((t - T_MIN) / (T_MAX - T_MIN)) * 100;

/** Illustrative hot summer day: 21 °C at 3 am, 34 °C at 3 pm. */
const summerDay = (hour: number) => 27.5 + 6.5 * Math.sin((2 * Math.PI * (hour - 9)) / 24);

const modes = [
  {
    n: 1,
    title: "Dry coolers + water-side free cooling",
    body: "The chiller is bypassed whenever ambient conditions let the dry coolers hold the supply setpoint unaided.",
    active: (s: ReturnType<typeof selectMode>) => !s.chiller,
    tone: "free",
  },
  {
    n: 2,
    title: "High-temperature chiller",
    body: "Mechanical cooling only when free cooling can’t hold the setpoint, e.g. Carrier 19MV4 with leaving condenser water to 55 °C.",
    active: (s: ReturnType<typeof selectMode>) => s.chiller,
    tone: "heat",
  },
  {
    n: 3,
    title: "Gated adiabatic pre-cooling",
    body: "A third mode, gated on the state of the local water system rather than only on the plant’s needs.",
    active: (s: ReturnType<typeof selectMode>) => s.adiabatic,
    tone: "water",
  },
] as const;

const toneClass = {
  free: "border-free/60 bg-free/[0.08] text-free",
  heat: "border-heat/60 bg-heat/[0.08] text-heat",
  water: "border-water/60 bg-water/[0.08] text-water",
} as const;

export function Plant() {
  const [temp, setTemp] = useState(22);
  const [water, setWater] = useState<WaterState>("normal");
  const [hour, setHour] = useState<number | null>(null);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const sliderId = useId();
  const state = selectMode(temp, water);

  const stop = () => {
    playback.current?.stop();
    playback.current = null;
    setHour(null);
  };

  const playDay = () => {
    stop();
    playback.current = animate(0, 24, {
      duration: 14,
      ease: "linear",
      onUpdate: (h) => {
        setHour(h);
        setTemp(Math.round(summerDay(h) * 2) / 2);
      },
      onComplete: () => {
        playback.current = null;
        setHour(null);
      },
    });
  };

  useEffect(() => () => playback.current?.stop(), []);

  const clock = hour === null ? null : `${String(Math.floor(hour) % 24).padStart(2, "0")}:00`;

  return (
    <Section
      id="plant"
      kicker="The proposed plant"
      title={<>Three modes. Water only when the community can spare it.</>}
      lede={
        <>
          A warm chilled water skid supplying <Term k="TCS" /> water at 30 °C. It rejects heat through dry coolers,
          engages mechanical cooling only when it has to, and treats adiabatic assist as a third mode that is{" "}
          <span className="text-ink">triggered by the state of the local water system</span>.
        </>
      }
    >
      <div className="mt-14 rounded-3xl border border-line bg-card/60 p-4 sm:p-6 md:p-8">
        <PlantSchematic state={state} />
        <div className="mt-8 grid gap-8 border-t border-line pt-8 lg:grid-cols-3">
          {/* Controls */}
          <div>
            <label htmlFor={sliderId} className="flex items-baseline justify-between text-sm text-muted">
              <span>
                Ambient <Term k="dryBulb" />
              </span>
              <span className="font-display text-4xl font-semibold text-ink tabular-nums">{temp.toFixed(1)} °C</span>
            </label>
            <input
              id={sliderId}
              type="range"
              min={T_MIN}
              max={T_MAX}
              step={0.5}
              value={temp}
              onChange={(e) => {
                stop();
                setTemp(Number(e.target.value));
              }}
              className="mt-3"
              aria-valuetext={`${temp} degrees Celsius`}
            />
            <div className="relative mt-2 h-2 overflow-hidden rounded-full" aria-hidden>
              <div
                className="absolute inset-y-0 left-0 bg-free/70"
                style={{ width: `${pct(FREE_COOLING_LIMIT_C)}%` }}
              />
              <div
                className="absolute inset-y-0 bg-water/60"
                style={{
                  left: `${pct(FREE_COOLING_LIMIT_C)}%`,
                  width: `${pct(ADIABATIC_LIMIT_C) - pct(FREE_COOLING_LIMIT_C)}%`,
                }}
              />
              <div className="absolute inset-y-0 right-0 bg-heat/70" style={{ left: `${pct(ADIABATIC_LIMIT_C)}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-faint">
              <span>free cooling ≤ {FREE_COOLING_LIMIT_C} °C</span>
              <span>adiabatic band</span>
              <span>chiller &gt; {ADIABATIC_LIMIT_C} °C</span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-3 text-sm text-muted">Community water system</p>
              <div role="radiogroup" aria-label="Community water system state" className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["normal", "Supply normal"],
                    ["constrained", "Constrained / drought restrictions"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={water === key}
                    onClick={() => setWater(key)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm leading-snug transition-colors ${
                      water === key
                        ? key === "normal"
                          ? "border-water bg-water/10 text-ink"
                          : "border-hot bg-hot/10 text-ink"
                        : "border-line text-muted hover:border-faint"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={hour === null ? playDay : stop}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-line bg-bg/60 px-5 py-3 text-sm transition-colors hover:border-water hover:text-water"
            >
              <span aria-hidden>{hour === null ? "▶" : "■"}</span>
              {hour === null ? "Play a hot Sydney summer day" : `Stop · ${clock}`}
            </button>
          </div>

          <div aria-live="polite" className="rounded-2xl border border-line bg-bg/50 p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.headline}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs tracking-widest text-faint uppercase">Active mode</p>
                <p data-testid="plant-mode" className="mt-1 font-display text-2xl font-semibold">
                  {state.headline}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{state.detail}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className={`rounded-full border px-3 py-1 ${state.chiller ? toneClass.heat : toneClass.free}`}>
                Chiller: {state.chiller ? "running" : "bypassed"}
              </span>
              <span
                className={`rounded-full border px-3 py-1 ${
                  state.adiabatic
                    ? toneClass.water
                    : state.adiabaticLockedOut
                      ? "border-hot/60 bg-hot/[0.08] text-hot"
                      : "border-line text-muted"
                }`}
              >
                Water: {state.adiabatic ? "triggered" : state.adiabaticLockedOut ? "locked out" : "none"}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-faint">
          Thresholds and the summer-day profile are illustrative, chosen to show the control idea. They are not results
          of the design study.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {modes.map((m) => {
          const on = m.active(state);
          return (
            <motion.div
              key={m.n}
              animate={{ opacity: on ? 1 : 0.55, y: on ? -4 : 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl border p-6 transition-colors ${on ? toneClass[m.tone] : "border-line bg-card/40 text-muted"}`}
            >
              <p className="text-xs tracking-widest uppercase">Mode {m.n}</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{m.body}</p>
            </motion.div>
          );
        })}
      </div>

      <Reveal className="mt-16">
        <Prose>
          <p>
            The study assesses the plant hour by hour in Sydney, against a chiller-less case and an evaporative cooling
            tower baseline, on three measures: <span className="text-ink">energy</span>,{" "}
            <span className="text-ink">water</span> and <span className="text-ink">water-scarcity cost</span>.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
