/**
 * Portfolio home content. The role, bio and contact links are first-draft placeholders: edit them to suit.
 * Contact links render only when present, so an empty list hides the section.
 */

export const profile = {
  name: "James Gianoutsos",
  role: "Engineer · data centre cooling and water",
  bio: [
    "I design cooling for data centres that have to live with their neighbours: plant that rejects heat to the air, and uses water only when the community can spare it.",
    "This portfolio collects design work at concept stage, each with its reasoning, its assumptions and the evidence behind it.",
  ],
  contact: [
    // { label: "Email", href: "mailto:you@example.com" },
    // { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
  ] as { label: string; href: string }[],
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  kind: string;
  year: number;
  tags: string[];
  href: string;
};

export const projects: Project[] = [
  {
    slug: "warm-water-cooling",
    title: "Cooling the cloud without draining the tap",
    summary:
      "Concept design for a 20 MW AI data centre in Western Sydney: a 30 °C warm water plant with dry coolers, a high-temperature chiller, and adiabatic assist gated on the state of the community's water supply.",
    kind: "Concept design proposal",
    year: 2026,
    tags: ["Data centres", "Heat rejection", "Water", "Controls"],
    href: "/projects/warm-water-cooling",
  },
];
