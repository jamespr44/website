// The public design-system surface synced to Claude Design. The site is not a published library, so this barrel
// (built into .ds-lib/ by build-lib.mjs) stands in for a package entry. Page chapters, the header and smooth
// scrolling are page-specific and deliberately left out.

// Layout, type and motion primitives
export { Section, Prose } from "../src/components/ui/Section";
export { Reveal } from "../src/components/ui/Reveal";
export { LiquidText } from "../src/components/ui/LiquidText";
export { IridescentBackdrop } from "../src/components/ui/IridescentBackdrop";
export { Counter } from "../src/components/ui/Counter";
export { SourceNote } from "../src/components/ui/SourceNote";
export { Term } from "../src/components/ui/Term";

// Schematic drawing kit (SVG parts; render inside an <svg>)
export { Defs, Flow, FanTop, FanSide, Arrow, Valve, Callout, hue, makeDots } from "../src/components/viz/schematic";

// Equipment schematics
export { CoolingTowerSchematic } from "../src/components/viz/CoolingTowerSchematic";
export { DryCoolerSchematic } from "../src/components/viz/DryCoolerSchematic";
export { ChillerCycle } from "../src/components/viz/ChillerCycle";
export { PlantSchematic } from "../src/components/viz/PlantSchematic";
export { SprayCooling } from "../src/components/viz/SprayCooling";

// Data charts
export { CrossingChart } from "../src/components/viz/CrossingChart";
export { WueProfiles } from "../src/components/viz/WueProfiles";
export { FreeCoolingWindow } from "../src/components/viz/FreeCoolingWindow";
export { GapMatrix } from "../src/components/viz/GapMatrix";
export { TdpTrend } from "../src/components/viz/TdpTrend";

// Lets static preview cards skip entrance animations (MotionGlobalConfig.skipAnimations = true); not a component.
export { MotionGlobalConfig } from "motion/react";

// Plant control logic that PlantSchematic renders
export { selectMode } from "../src/lib/plantModes";
