import { MotionGlobalConfig, Flow, hue } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const PipeStates = () => (
  <Page>
    <svg viewBox="0 0 420 200" width={672} fontFamily="inherit">
      <Flow d="M20 30 H300" color={hue.warm} />
      <Flow d="M20 75 H300" color={hue.cool} />
      <Flow d="M20 120 H300" color={hue.hot} />
      <Flow d="M20 165 H300" color={hue.warm} active={false} />
      {[
        [30, "Warm water"],
        [75, "30 °C supply"],
        [120, "Condenser water"],
        [165, "Inactive run"],
      ].map(([y, t]) => (
        <text key={t} x="316" y={Number(y) + 4} fontSize="11" fill="var(--muted)">
          {t}
        </text>
      ))}
    </svg>
  </Page>
);

export const RoutedAndDotted = () => (
  <Page>
    <svg viewBox="0 0 420 180" width={672} fontFamily="inherit">
      <Flow d="M20 40 H180 V140 H400" color={hue.cool} />
      <Flow d="M300 10 V90" color={hue.water} dotted width={2} />
      <text x="310" y="30" fontSize="11" fill="var(--muted)">
        Community water
      </text>
    </svg>
  </Page>
);
