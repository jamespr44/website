/**
 * Indicative annual performance of the proposed plant. A seeded synthetic weather year for Western Sydney is run hour
 * by hour through the plant's control logic (`selectMode`), once with community water supply normal all year and once
 * with drought restrictions in force all year, and compared with an evaporative cooling-tower baseline.
 *
 * This is a concept-stage estimate. The synthetic year only matches long-term monthly means; it is not a typical
 * meteorological year (TMY) file, and the design study replaces it with real hourly weather data.
 */

import { assumptions as a, brief, climateNormals } from "@/content/design";
import { selectMode, type WaterState } from "@/lib/plantModes";
import { seeded } from "@/lib/random";

export const HOURS_PER_YEAR = 8760;
const DAYS = 365;
const monthStartDay = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Month index (0–11) for a day of the year. */
export const monthOf = (day: number) => monthStartDay.findLastIndex((start) => day >= start);

/** Interpolates a monthly normal to a day of the year, treating each month's value as its mid-point. */
function daily(values: readonly number[], day: number) {
  const mids = monthStartDay.map((s, m) => s + monthLength[m] / 2);
  for (let m = 0; m < 12; m++) {
    const next = (m + 1) % 12;
    const from = mids[m];
    const to = next === 0 ? mids[0] + DAYS : mids[next];
    const d = day < mids[0] ? day + DAYS : day;
    if (d >= from && d < to) return values[m] + ((values[next] - values[m]) * (d - from)) / (to - from);
  }
  return values[0];
}

/** Diurnal shape from 0 (minimum, 06:00) to 1 (maximum, 15:00). */
function diurnal(hour: number) {
  if (hour >= 6 && hour <= 15) return 0.5 - 0.5 * Math.cos((Math.PI * (hour - 6)) / 9);
  const sinceMax = (hour - 15 + 24) % 24;
  return 0.5 + 0.5 * Math.cos((Math.PI * sinceMax) / 15);
}

/** 8,760 hourly dry-bulb temperatures (°C), January 1st 00:00 first. Deterministic. */
export function syntheticYear(seed = 2026): number[] {
  const rand = seeded(seed);
  const gauss = () => {
    const u = Math.max(rand(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  const temps: number[] = [];
  let anomaly = 0;
  for (let day = 0; day < DAYS; day++) {
    const summer = 0.5 + 0.5 * Math.cos((2 * Math.PI * (day - 15)) / DAYS);
    anomaly = 0.7 * anomaly + gauss() * (1.8 + 1.4 * summer);
    // Hot westerly days push the maximum up much further than cool changes pull it down.
    const maxAnomaly = anomaly > 0 ? anomaly * (1 + 0.9 * summer) : anomaly;
    const tMax = daily(climateNormals.max, day) + maxAnomaly;
    const tMin = daily(climateNormals.min, day) + anomaly * 0.6;
    for (let h = 0; h < 24; h++) temps.push(tMin + (tMax - tMin) * diurnal(h) + gauss() * 0.4);
  }
  return temps;
}

export type ModeKey = "free" | "adiabatic" | "chiller" | "chillerAdiabatic";

export type ScenarioResult = {
  hours: Record<ModeKey, number>;
  monthlyHours: Record<ModeKey, number>[];
  waterML: number;
  peakDayWaterML: number;
  pue: number;
  chillerMWh: number;
};

const modeOf = (s: ReturnType<typeof selectMode>): ModeKey =>
  s.chiller ? (s.adiabatic ? "chillerAdiabatic" : "chiller") : s.adiabatic ? "adiabatic" : "free";

const emptyHours = (): Record<ModeKey, number> => ({ free: 0, adiabatic: 0, chiller: 0, chillerAdiabatic: 0 });

export function runScenario(temps: number[], water: WaterState): ScenarioResult {
  const it = brief.itLoadMW;
  const hours = emptyHours();
  const monthlyHours = Array.from({ length: 12 }, emptyHours);
  let waterL = 0;
  let dayL = 0;
  let peakDayL = 0;
  let facilityMWh = 0;
  let chillerMWh = 0;

  temps.forEach((t, i) => {
    const state = selectMode(t, water);
    const mode = modeOf(state);
    hours[mode]++;
    monthlyHours[monthOf(Math.floor(i / 24))][mode]++;

    const cop = state.adiabatic ? a.chillerCopAdiabatic : a.chillerCopDry;
    const compressor = state.chiller ? (it * a.chillerLoadFraction) / cop : 0;
    const fansPumps = it * (a.dryFanPump + (state.adiabatic ? a.adiabaticPumpExtra : 0));
    const heatRejectedMW = it + compressor;
    const litres = state.adiabatic ? heatRejectedMW * 1000 * a.adiabaticLPerKWh : 0;

    waterL += litres;
    dayL += litres;
    chillerMWh += compressor;
    facilityMWh += it * (1 + a.otherOverhead) + fansPumps + compressor;
    if (i % 24 === 23) {
      peakDayL = Math.max(peakDayL, dayL);
      dayL = 0;
    }
  });

  return {
    hours,
    monthlyHours,
    waterML: waterL / 1e6,
    peakDayWaterML: peakDayL / 1e6,
    pue: facilityMWh / (it * temps.length),
    chillerMWh,
  };
}

/** Evaporative cooling tower with water-side economiser: evaporates every hour of the year. */
export function towerBaseline(hours = HOURS_PER_YEAR) {
  const perDayML = (brief.itLoadMW * 1000 * 24 * a.towerLPerKWh) / 1e6;
  return {
    waterML: (perDayML * hours) / 24,
    peakDayWaterML: perDayML,
    pue: 1 + a.otherOverhead + a.towerFanPump,
  };
}

const temps = syntheticYear();

/** The estimates quoted on the page, computed once. */
export const estimates = (() => {
  const normal = runScenario(temps, "normal");
  const drought = runScenario(temps, "constrained");
  const tower = towerBaseline(temps.length);
  const freeShare = normal.hours.free / temps.length;
  return {
    temps,
    maxTempC: Math.max(...temps),
    normal,
    drought,
    tower,
    freeShare,
    waterSavedShare: 1 - normal.waterML / tower.waterML,
    pueRise: normal.pue / tower.pue - 1,
  };
})();

/** Indicative equipment counts for the schedule: duty units to meet the load, plus N+1. */
export const schedule = (() => {
  const heatRejectMW = brief.itLoadMW * (1 + 1 / a.chillerCopDry);
  const dryDuty = Math.ceil(heatRejectMW / a.dryCoolerUnitMW);
  const chillerDuty = Math.ceil(brief.itLoadMW / a.chillerUnitMW);
  return { heatRejectMW, dryDuty, dryTotal: dryDuty + 1, chillerDuty, chillerTotal: chillerDuty + 1 };
})();
