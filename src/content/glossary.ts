export const glossary = {
  ASIC: {
    term: "ASIC",
    def: "Application-specific integrated circuit: a chip built for one job, such as AI inference.",
  },
  CPU: { term: "CPU", def: "Central processing unit." },
  GPU: {
    term: "GPU",
    def: "Graphics processing unit, the workhorse of AI training and inference.",
  },
  IT: { term: "IT", def: "Information technology: the servers, storage and network the facility exists to run." },
  LCWT: {
    term: "LCWT",
    def: "Leaving condenser water temperature. A higher LCWT lets a chiller reject its heat to warmer air.",
  },
  PUE: {
    term: "PUE",
    def: "Power usage effectiveness: total facility energy ÷ IT energy. 1.0 would mean zero overhead.",
  },
  TCS: {
    term: "TCS",
    def: "Technology cooling system: the liquid loop that carries heat away from the IT equipment.",
  },
  TDP: {
    term: "TDP",
    def: "Thermal design power: the heat a chip is designed to dissipate at sustained load.",
  },
  TPU: { term: "TPU", def: "Tensor processing unit: an accelerator designed for machine-learning workloads." },
  WUE: {
    term: "WUE",
    def: "Water usage effectiveness: annual site water use (L) ÷ IT energy (kWh).",
  },
  ML: { term: "ML", def: "Megalitre: one million litres. An Olympic pool holds about 2.5 ML." },
  dryBulb: {
    term: "dry-bulb",
    def: "Ordinary air temperature, as read by a dry thermometer. It sets the limit for a dry cooler.",
  },
  wetBulb: {
    term: "wet-bulb",
    def: "The temperature air can be cooled to by evaporating water into it. It is the limit for a cooling tower.",
  },
  freeCooling: {
    term: "free cooling",
    def: "Rejecting heat directly to ambient air without running a chiller's compressor.",
  },
  adiabatic: {
    term: "adiabatic",
    def: "Evaporative pre-cooling: water is sprayed or misted into the air entering a dry cooler, lowering its temperature.",
  },
} as const;

export type GlossaryKey = keyof typeof glossary;
