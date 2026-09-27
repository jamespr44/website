import { MotionGlobalConfig, ChillerCycle } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

const Cycle = ({ step }: { step: number }) => (
  <Page>
    <div className="max-w-[760px]">
      <ChillerCycle step={step} />
    </div>
  </Page>
);

export const WholeCycle = () => <Cycle step={0} />;
export const Evaporator = () => <Cycle step={1} />;
export const Compressor = () => <Cycle step={2} />;
export const Condenser = () => <Cycle step={3} />;
export const ExpansionValve = () => <Cycle step={4} />;
