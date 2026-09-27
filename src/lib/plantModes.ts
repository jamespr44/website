/**
 * Illustrative control logic for the three-mode warm chilled water plant.
 * The thresholds are placeholders chosen to show the idea. They are not results from the design study.
 */

export type WaterState = "normal" | "constrained";

export const TCS_SETPOINT_C = 30;
/** Assumed dry-cooler approach: the dry cooler holds the setpoint only while dry-bulb ≤ setpoint − approach. */
export const DRY_APPROACH_K = 5;
export const FREE_COOLING_LIMIT_C = TCS_SETPOINT_C - DRY_APPROACH_K;
/** Upper bound of the band where adiabatic pre-cooling alone can keep the chiller off. */
export const ADIABATIC_LIMIT_C = 32;

export type PlantState = {
  dryCoolers: true;
  chiller: boolean;
  adiabatic: boolean;
  adiabaticLockedOut: boolean;
  headline: string;
  detail: string;
};

export function selectMode(dryBulbC: number, water: WaterState): PlantState {
  const waterAvailable = water === "normal";

  if (dryBulbC <= FREE_COOLING_LIMIT_C) {
    return {
      dryCoolers: true,
      chiller: false,
      adiabatic: false,
      adiabaticLockedOut: !waterAvailable,
      headline: "Free cooling",
      detail: "Dry coolers hold 30 °C unaided. The chiller is bypassed and no water is used.",
    };
  }

  if (dryBulbC <= ADIABATIC_LIMIT_C) {
    return waterAvailable
      ? {
          dryCoolers: true,
          chiller: false,
          adiabatic: true,
          adiabaticLockedOut: false,
          headline: "Adiabatic assist",
          detail:
            "Water is available, so pre-cooling the inlet air keeps the chiller off. It uses a little water, only while it's needed.",
        }
      : {
          dryCoolers: true,
          chiller: true,
          adiabatic: false,
          adiabaticLockedOut: true,
          headline: "High-temperature chiller",
          detail:
            "Community supply is constrained, so adiabatic assist is locked out. The chiller carries the load with zero water use.",
        };
  }

  return {
    dryCoolers: true,
    chiller: true,
    adiabatic: waterAvailable,
    adiabaticLockedOut: !waterAvailable,
    headline: waterAvailable ? "Chiller + adiabatic assist" : "High-temperature chiller",
    detail: waterAvailable
      ? "Too hot for dry coolers alone. The chiller runs, and pre-cooled air lowers its condensing temperature."
      : "Too hot for dry coolers alone, and water is locked out. The chiller rejects heat at up to 55 °C LCWT.",
  };
}
