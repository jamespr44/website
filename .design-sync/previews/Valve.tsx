import { MotionGlobalConfig, Valve, Flow, hue } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const OpenAndClosed = () => (
  <Page>
    <svg viewBox="0 0 320 120" width={512} fontFamily="inherit">
      <Flow d="M20 40 H140" color={hue.water} dotted width={2} />
      <Valve x={80} y={40} />
      <text x="150" y="44" fontSize="11" fill="var(--muted)">
        gate open
      </text>
      <Flow d="M20 90 H140" color={hue.water} active={false} width={2} />
      <Valve x={80} y={90} closed />
      <text x="150" y="94" fontSize="11" fill="var(--hot)">
        gate closed
      </text>
    </svg>
  </Page>
);

export const Vertical = () => (
  <Page>
    <svg viewBox="0 0 160 120" width={256} fontFamily="inherit">
      <Flow d="M60 10 V110" color={hue.water} dotted width={2} />
      <Valve x={60} y={60} vertical />
      <text x="78" y="64" fontSize="11" fill="var(--muted)">
        not needed
      </text>
    </svg>
  </Page>
);
