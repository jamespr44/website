import { MotionGlobalConfig, DryCoolerSchematic } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const SprayOn = () => (
  <Page>
    <div className="max-w-[760px]">
      <DryCoolerSchematic spray ambient={35} atCoil={25.6} />
    </div>
  </Page>
);

export const Dry = () => (
  <Page>
    <div className="max-w-[760px]">
      <DryCoolerSchematic spray={false} ambient={35} atCoil={35} />
    </div>
  </Page>
);
