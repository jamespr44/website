import { MotionGlobalConfig, Prose, Term } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const BodyCopy = () => (
  <Page>
    <Prose>
      <p>
        Cooling is the overwhelming share of a facility’s on-site water use, and almost all of that is lost to
        evaporation.
      </p>
      <p>
        A warm chilled water skid supplies <Term k="TCS">TCS</Term> water at 30 °C and rejects heat through dry coolers.
      </p>
    </Prose>
  </Page>
);
