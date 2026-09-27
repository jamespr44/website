import { MotionGlobalConfig, LiquidText, Counter } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const KeyFigure = () => (
  <Page>
    <div className="max-w-[320px] border-t border-rule pt-6">
      <p className="t-stat m-0">
        <LiquidText>5–40</LiquidText>
      </p>
      <p className="mt-6 mb-0 text-inkstone">
        ML per day sought by individual data centre applications to Australian water utilities.
      </p>
    </div>
  </Page>
);

export const FigureWithUnit = () => (
  <Page>
    <p className="t-stat m-0">
      <LiquidText>1.4–1.5</LiquidText> <span className="t-sub text-muted">L/kWh</span>
    </p>
  </Page>
);

export const Headline = () => (
  <Page>
    <h2 className="t-whisper m-0 max-w-[700px]">
      <LiquidText block zoom={1.3}>
        Three modes. Water only when the community can spare it.
      </LiquidText>
    </h2>
  </Page>
);

export const WithCounter = () => (
  <Page>
    <p className="t-stat m-0">
      <LiquidText>
        <Counter value={66} prefix="−" suffix="%" />
      </LiquidText>
    </p>
  </Page>
);
