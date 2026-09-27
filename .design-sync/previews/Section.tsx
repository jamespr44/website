import { MotionGlobalConfig, Section, Prose, SourceNote } from "warm-water-cooling";

// Cards show finished states (entrance animations skipped) on the black page the system is designed for.
MotionGlobalConfig.skipAnimations = true;

export const Chapter = () => (
  <Section
    id="water"
    kicker="Where the water goes"
    title={<>The heat leaves in the water.</>}
    lede="A cooling tower works by evaporating water. The heat goes out as the latent heat of the vapour, so water consumption is built into how the tower works."
  />
);

export const WithBody = () => (
  <Section id="options" kicker="Options appraisal" title={<>Nobody has asked the question at 30 °C.</>}>
    <div className="mt-16 md:ml-[240px]">
      <Prose>
        <p className="m-0">
          The nearest published method resolves economisation hours hour by hour across dozens of cities, but with
          cooling towers at conventional chilled-water temperatures.
        </p>
      </Prose>
      <SourceNote>Jin et al. (2024)</SourceNote>
    </div>
  </Section>
);
