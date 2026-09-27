import { MotionGlobalConfig, Term } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const InSentence = () => (
  <Page>
    <p className="m-0 max-w-[520px] text-lg leading-[1.58] text-inkstone">
      Water use is reported as <Term k="WUE" />, alongside <Term k="PUE" /> for energy, measured against the{" "}
      <Term k="IT" /> load.
    </p>
  </Page>
);

export const CustomLabel = () => (
  <Page>
    <p className="m-0 max-w-[520px] text-lg leading-[1.58] text-inkstone">
      Above 25 °C <Term k="dryBulb">dry-bulb</Term>, the dry coolers need help from <Term k="adiabatic">adiabatic</Term>{" "}
      pre-cooling.
    </p>
  </Page>
);
