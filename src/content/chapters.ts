/** Chapter order drives the progress rail and section ids. */
export const chapters = [
  { id: "intro", label: "Introduction" },
  { id: "pressure", label: "The pressure" },
  { id: "evaporation", label: "Why towers drink" },
  { id: "timing", label: "The metric hides the timing" },
  { id: "layers", label: "Who switches, and on what" },
  { id: "dry", label: "Dry rejection" },
  { id: "adiabatic", label: "Adiabatic assist" },
  { id: "hardware", label: "The hardware ceiling" },
  { id: "crossing", label: "Where the lines cross" },
  { id: "gap", label: "The gap" },
  { id: "plant", label: "The proposed plant" },
  { id: "now", label: "Why it matters now" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const chapterIndex = (id: ChapterId) => chapters.findIndex((c) => c.id === id);

/** Figures quoted in the review, kept in one place. */
export const figures = {
  towerLitresPerKWh: { low: 1.4, high: 1.5, mid: 1.45 },
  requestMLPerDay: { low: 5, high: 40 },
  requestVsLargestCustomer: 20,
  wueSpreadPct: 100,
  talukderReductionPct: 25,
  talukderPueLimit: 1.5,
  karimiWueDropPct: 66,
  karimiPueRisePct: 13,
  yangAirDropK: 9.4,
  yangCondensingDropK: 7.2,
  yangMistApproachK: 0.5,
  gheniItPowerPct: 3.15,
  gheniDeltaK: 8,
  stahlhutPowerPct: 8.5,
  tcsSetpointC: 30,
  chillerLcwtC: 55,
  olympicPoolML: 2.5,
} as const;
