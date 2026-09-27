import { MotionGlobalConfig, Defs } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const Patterns = () => (
  <Page>
    <svg viewBox="0 0 360 120" width={576} fontFamily="inherit">
      <Defs id="swatch" />
      <rect x="20" y="20" width="140" height="60" fill="url(#swatch-hatch)" stroke="var(--ink)" />
      <rect x="200" y="20" width="140" height="60" fill="url(#swatch-fins)" stroke="var(--ink)" />
      <text x="20" y="102" fontSize="11" fill="var(--muted)">
        #swatch-hatch · fill pack, coils
      </text>
      <text x="200" y="102" fontSize="11" fill="var(--muted)">
        #swatch-fins · fins, eliminators
      </text>
    </svg>
  </Page>
);
