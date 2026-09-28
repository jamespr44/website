/**
 * The design brief and every assumption behind the indicative estimates. All values are concept-stage: chosen to be
 * reasonable for a first pass, and to be replaced by the design study's hourly simulation on real weather data.
 */

/** The (hypothetical) facility the proposal is written for. */
export const brief = {
  project: "Warm water cooling plant for an AI data centre",
  location: "Western Sydney, NSW",
  itLoadMW: 20,
  cooling: "Direct-to-chip liquid cooling",
  tcsSupplyC: 30,
  tcsClass: "ASHRAE S30",
  redundancy: "N+1",
  /** Design dry-bulb for plant sizing. Penrith recorded 48.9 °C in January 2020. */
  designDryBulbC: 47,
  stage: "Concept design",
  year: 2026,
} as const;

/** Assumptions used by `src/lib/estimate.ts`. Changing a value here changes every derived figure on the page. */
export const assumptions = {
  /** Electrical losses, lighting and other non-cooling overhead, as a fraction of IT power. */
  otherOverhead: 0.05,
  /** Dry cooler fans and TCS/condenser pumps, as a fraction of IT power. */
  dryFanPump: 0.03,
  /** Extra pump and fan power while the adiabatic sprays run. */
  adiabaticPumpExtra: 0.005,
  /** Chiller COP rejecting dry (condenser water up to 55 °C). */
  chillerCopDry: 5.0,
  /** Chiller COP with adiabatically pre-cooled condenser air (lower condensing temperature). */
  chillerCopAdiabatic: 6.0,
  /** Conservative: whenever the chiller runs it carries the whole IT load. */
  chillerLoadFraction: 1,
  /** Water evaporated per kWh of heat rejected while the adiabatic pre-coolers spray. */
  adiabaticLPerKWh: 0.5,
  /** Cooling-tower baseline: evaporation per kWh of heat rejected, every hour (drift and blowdown excluded). */
  towerLPerKWh: 1.45,
  /** Cooling-tower baseline: tower fans and pumps, as a fraction of IT power. */
  towerFanPump: 0.025,
  /** Unit sizes for the indicative equipment schedule. */
  dryCoolerUnitMW: 1.4,
  chillerUnitMW: 4.5,
} as const;

/**
 * Approximate Western Sydney monthly mean daily max / min dry-bulb (°C), January first. Rounded from long-term
 * averages for the Penrith–Richmond area; used only to shape the synthetic weather year.
 */
export const climateNormals = {
  max: [31.0, 29.8, 27.8, 24.8, 21.0, 18.0, 17.8, 19.8, 23.3, 26.0, 28.0, 30.0],
  min: [18.0, 18.1, 16.0, 12.0, 8.0, 5.5, 4.0, 4.8, 7.8, 10.8, 14.0, 16.3],
} as const;
