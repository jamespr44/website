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
  },
  {
    n: 2,
    title: "High-temperature chiller",
    body: "Mechanical cooling only when free cooling can’t hold the setpoint, e.g. Carrier 19MV4 with leaving condenser water to 55 °C.",
    active: (s: ReturnType<typeof selectMode>) => s.chiller,
  },
  {
    n: 3,
    title: "Gated adiabatic pre-cooling",
    body: "A third mode, gated on the state of the local water system rather than only on the plant’s needs.",
    active: (s: ReturnType<typeof selectMode>) => s.adiabatic,
  },
] as const;

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
          engages mechanical cooling only when it has to, and treats adiabatic assist as a third mode that is triggered
          by the state of the local water system.
        </>
      }
    >
      <div className="mt-20 border-t border-rule pt-6">
        <PlantSchematic state={state} />

        <div className="mt-10 grid gap-12 border-t border-line pt-10 lg:grid-cols-3 lg:gap-10">
          <div>
            <label htmlFor={sliderId} className="t-label flex items-baseline justify-between gap-4">
              <span>
                Ambient <Term k="dryBulb" />
              </span>
              <span className="t-sub tabular-nums">{temp.toFixed(1)} °C</span>
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
              className="mt-4"
              aria-valuetext={`${temp} degrees Celsius`}
            />
            <div className="relative mt-1 h-1.5" aria-hidden>
              <div className="absolute inset-y-0 left-0 bg-sage" style={{ width: `${pct(FREE_COOLING_LIMIT_C)}%` }} />
              <div
                className="absolute inset-y-0 bg-amber"
                style={{
                  left: `${pct(FREE_COOLING_LIMIT_C)}%`,
                  width: `${pct(ADIABATIC_LIMIT_C) - pct(FREE_COOLING_LIMIT_C)}%`,
                }}
              />
              <div className="absolute inset-y-0 right-0 bg-oxblood" style={{ left: `${pct(ADIABATIC_LIMIT_C)}%` }} />
            </div>
            <div className="t-caption mt-2 flex justify-between text-faint">
              <span>free cooling ≤ {FREE_COOLING_LIMIT_C} °C</span>
              <span>adiabatic band</span>
              <span>chiller &gt; {ADIABATIC_LIMIT_C} °C</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-6">
            <div>
              <p className="t-label mt-0 mb-3">Community water system</p>
              <div role="radiogroup" aria-label="Community water system state" className="pill-group">
                {(
                  [
                    ["normal", "Supply normal"],
                    ["constrained", "Drought restrictions"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={water === key}
                    onClick={() => setWater(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={hour === null ? playDay : stop} className="pill">
              {hour === null ? "Play a hot Sydney summer day" : `Stop · ${clock}`}
            </button>
          </div>

          <div aria-live="polite" className="border-t border-rule pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.headline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <p className="t-label m-0">Active mode</p>
                <p data-testid="plant-mode" className="t-sub mt-2 mb-0">
                  {state.headline}
                </p>
                <p className="mt-3 mb-0 leading-[1.5] text-muted">{state.detail}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="t-caption rounded-[75px] border border-rule px-3.5 py-1.5">
                Chiller {state.chiller ? "running" : "bypassed"}
              </span>
              <span
                className={`t-caption rounded-[75px] border px-3.5 py-1.5 ${
                  state.adiabaticLockedOut ? "border-oxblood text-oxblood" : "border-rule"
                }`}
              >
                Water {state.adiabatic ? "triggered" : state.adiabaticLockedOut ? "locked out" : "not used"}
              </span>
            </div>
          </div>
        </div>
        <p className="t-caption mt-8 text-faint">
          Thresholds and the summer-day profile are illustrative, chosen to show the control idea. They are not results
          of the design study.
        </p>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {modes.map((m) => {
          const on = m.active(state);
          return (
            <div
              key={m.n}
              className={`pt-5 transition-colors duration-500 ${on ? "border-t-2 border-rule text-ink" : "border-t border-line text-faint"}`}
            >
              <p className="t-label m-0">Mode {m.n}</p>
              <h3 className="mt-2 mb-0 text-lg font-normal">{m.title}</h3>
              <p className="mt-3 mb-0 text-sm leading-[1.5]">{m.body}</p>
            </div>
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
