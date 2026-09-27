import { MotionGlobalConfig, IridescentBackdrop } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped).
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const HeroBackdrop = () => (
  <div className="relative h-[480px] overflow-hidden bg-bg">
    <IridescentBackdrop />
    <div className="relative flex h-full flex-col justify-end p-8">
      <p className="t-label m-0 text-white">Literature review · 2026</p>
      <h1 className="t-sub mt-4 mb-0 max-w-[620px] text-white">
        Optimised warm chilled water cooling with trigger-based adiabatic assist
      </h1>
    </div>
  </div>
);

export const Panel = () => (
  <Page>
    <div className="relative h-[220px] max-w-[420px] overflow-hidden">
      <IridescentBackdrop />
    </div>
  </Page>
);
