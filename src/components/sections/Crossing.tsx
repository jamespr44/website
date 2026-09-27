"use client";

import { Section } from "@/components/ui/Section";
import { SourceNote } from "@/components/ui/SourceNote";
import { CrossingChart } from "@/components/viz/CrossingChart";

export function Crossing() {
  return (
    <Section
      id="crossing"
      kicker="Where the lines cross"
      title={<>Two trends, heading for each other.</>}
      lede={<>The climate is raising the floor. The hardware is lowering the ceiling. Keep scrolling.</>}
    >
      <CrossingChart />
      <SourceNote>
        Conceptual diagram. Direction of trends: Karamperidou et al. (2026); Vertiv &amp; Open Compute Project (2026);
        Han et al. (2026)
      </SourceNote>
    </Section>
  );
}
