import { MotionGlobalConfig, FreeCoolingWindow } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;
const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--bg)", color: "var(--ink)", padding: 24 }}>{children}</div>
);

// Scroll-pinned scene: the card shows its static final state, which the component renders under reduced motion.
const mm = window.matchMedia.bind(window);
window.matchMedia = (q: string) =>
  q.includes("prefers-reduced-motion")
    ? ({
        matches: true,
        media: q,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent: () => false,
      } as MediaQueryList)
    : mm(q);

export const FinalState = () => (
  <Page>
    <FreeCoolingWindow />
  </Page>
);
