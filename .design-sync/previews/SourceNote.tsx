import { MotionGlobalConfig, SourceNote } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const UnderFigure = () => (
  <Page>
    <p className="t-stat m-0">16</p>
    <p className="mt-6 mb-0 text-inkstone">Olympic pools a day, at 40 ML/day.</p>
    <SourceNote>Han et al. (2026); International Energy Agency (2025)</SourceNote>
  </Page>
);

export const Guideline = () => (
  <Page>
    <SourceNote>Infrastructure NSW (2026), NSW data centre guidelines</SourceNote>
  </Page>
);
