import { ProgressRail } from "@/components/ui/ProgressRail";
import { Hero } from "@/components/sections/Hero";
import { Pressure } from "@/components/sections/Pressure";
import { Evaporation } from "@/components/sections/Evaporation";
import { Timing } from "@/components/sections/Timing";
import { Layers } from "@/components/sections/Layers";
import { DryRejection } from "@/components/sections/DryRejection";
import { Adiabatic } from "@/components/sections/Adiabatic";
import { Hardware } from "@/components/sections/Hardware";
import { Crossing } from "@/components/sections/Crossing";
import { Gap } from "@/components/sections/Gap";
import { Plant } from "@/components/sections/Plant";
import { Now } from "@/components/sections/Now";

export default function Home() {
  return (
    <>
      <ProgressRail />
      <main>
        <Hero />
        <Pressure />
        <Evaporation />
        <Timing />
        <Layers />
        <DryRejection />
        <Adiabatic />
        <Hardware />
        <Crossing />
        <Gap />
        <Plant />
        <Now />
      </main>
    </>
  );
}
