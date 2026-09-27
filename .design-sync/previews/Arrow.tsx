import { MotionGlobalConfig, Arrow, hue } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const AirPaths = () => (
  <Page>
    <svg viewBox="0 0 320 150" width={512} fontFamily="inherit">
      <Arrow x1={20} y1={30} x2={140} y2={30} />
      <Arrow x1={20} y1={70} x2={140} y2={70} color={hue.warm} width={1.5} />
      <Arrow x1={20} y1={110} x2={140} y2={110} color={hue.cool} width={1.5} />
      <Arrow x1={230} y1={140} x2={230} y2={20} color={hue.warm} />
      <text x="150" y="74" fontSize="11" fill="var(--muted)">
        Ambient 35 °C
      </text>
      <text x="150" y="114" fontSize="11" fill="var(--muted)">
        Pre-cooled
      </text>
    </svg>
  </Page>
);
