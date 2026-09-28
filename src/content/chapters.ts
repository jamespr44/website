/** Chapter order drives the progress rail and section ids. */
export const chapters = [
  { id: "intro", label: "Cover" },
  { id: "summary", label: "Summary" },
  { id: "brief", label: "Design brief" },
  { id: "water", label: "Context: the water problem" },
  { id: "constraints", label: "Context: floor and ceiling" },
  { id: "options", label: "Options appraisal" },
  { id: "system", label: "The proposed plant" },
  { id: "rejection", label: "Heat rejection" },
  { id: "chiller", label: "Mechanical cooling" },
  { id: "controls", label: "Control strategy" },
  { id: "performance", label: "Indicative performance" },
  { id: "risk", label: "Compliance and risk" },
  { id: "next", label: "Validation and next steps" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const chapterIndex = (id: ChapterId) => chapters.findIndex((c) => c.id === id);

/** Figures cited from the literature, kept in one place. */
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
