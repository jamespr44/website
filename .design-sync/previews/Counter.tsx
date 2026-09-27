import { MotionGlobalConfig, Counter } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const Litres = () => (
  <Page>
    <p className="t-label m-0 text-muted">Evaporated per day</p>
    <p className="mt-3 mb-0 text-[44px] leading-none font-light tabular-nums">
      <Counter value={3480000} suffix=" L" />
    </p>
  </Page>
);

export const Percentage = () => (
  <Page>
    <p className="t-stat m-0">
      <Counter value={3.15} decimals={2} prefix="+" suffix="%" />
    </p>
  </Page>
);

export const Temperature = () => (
  <Page>
    <p className="t-stat m-0">
      <Counter value={30} suffix=" °C" />
    </p>
  </Page>
);
