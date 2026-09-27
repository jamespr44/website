import { MotionGlobalConfig, Reveal } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

export const FadeUp = () => (
  <Page>
    <Reveal className="border-t border-rule pt-7">
      <p className="t-label m-0">New South Wales</p>
      <p className="mt-6 mb-0 max-w-[420px] text-lg leading-[1.58] text-inkstone">
        Facilities that use potable water must be designed to reduce water use under drought restrictions.
      </p>
    </Reveal>
  </Page>
);

export const Staggered = () => (
  <Page>
    <div className="grid gap-10 md:grid-cols-2">
      <Reveal className="border-t border-rule pt-7">
        <p className="t-label m-0">Commonwealth</p>
        <p className="mt-6 mb-0 text-lg leading-[1.58] text-inkstone">
          Sustainable water use is now an explicit expectation.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="border-t border-rule pt-7">
        <p className="t-label m-0">New South Wales</p>
        <p className="mt-6 mb-0 text-lg leading-[1.58] text-inkstone">
          Potable-water sites must cut use under restrictions.
        </p>
      </Reveal>
    </div>
  </Page>
);
