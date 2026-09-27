import { MotionGlobalConfig, Callout, Defs } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const LabelledPart = () => (
  <Page>
    <svg viewBox="0 0 360 160" width={576} fontFamily="inherit">
      <Defs id="co" />
      <rect x="30" y="50" width="150" height="60" fill="url(#co-hatch)" stroke="var(--ink)" />
      <Callout from={[180, 80]} to={[230, 50]}>
        Fill pack
      </Callout>
      <Callout from={[30, 110]} to={[60, 140]} tone="var(--muted)">
        Basin below
      </Callout>
    </svg>
  </Page>
);

export const AnchorEnd = () => (
  <Page>
    <svg viewBox="0 0 360 120" width={576} fontFamily="inherit">
      <circle cx="260" cy="70" r="26" fill="var(--bg)" stroke="var(--ink)" />
      <Callout from={[236, 62]} to={[150, 30]} anchor="end">
        Two-stage compressor
      </Callout>
    </svg>
  </Page>
);
