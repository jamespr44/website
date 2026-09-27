import { MotionGlobalConfig, FanSide, Arrow, hue } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const InStack = () => (
  <Page>
    <svg viewBox="0 0 240 140" width={384} fontFamily="inherit">
      <path d="M60 130 V60 M180 60 V130" stroke="var(--ink)" fill="none" />
      <FanSide cx={120} cy={100} w={104} />
      <Arrow x1={100} y1={70} x2={100} y2={20} color={hue.warm} />
      <Arrow x1={140} y1={70} x2={140} y2={20} color={hue.warm} />
    </svg>
  </Page>
);
