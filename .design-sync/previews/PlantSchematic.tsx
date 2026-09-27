import { MotionGlobalConfig, PlantSchematic, selectMode } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const FreeCooling = () => (
  <Page>
    <PlantSchematic state={selectMode(22, "normal")} />
  </Page>
);

export const AdiabaticAssist = () => (
  <Page>
    <PlantSchematic state={selectMode(29, "normal")} />
  </Page>
);

export const GateClosed = () => (
  <Page>
    <PlantSchematic state={selectMode(29, "constrained")} />
  </Page>
);

export const ChillerRunning = () => (
  <Page>
    <PlantSchematic state={selectMode(36, "normal")} />
  </Page>
);
