import { MotionGlobalConfig, FanTop } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const Bank = () => (
  <Page>
    <svg viewBox="0 0 260 90" width={416} fontFamily="inherit">
      <rect x="10" y="10" width="240" height="70" fill="none" stroke="var(--ink)" />
      <FanTop cx={60} cy={45} r={24} />
      <FanTop cx={130} cy={45} r={24} />
      <FanTop cx={200} cy={45} r={24} spin={false} />
    </svg>
  </Page>
);
