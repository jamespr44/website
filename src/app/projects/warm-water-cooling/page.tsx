import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Hero } from "@/components/sections/Hero";
import { Summary } from "@/components/sections/Summary";
import { Brief } from "@/components/sections/Brief";
import { Water } from "@/components/sections/Water";
import { Constraints } from "@/components/sections/Constraints";
import { Options } from "@/components/sections/Options";
import { Plant } from "@/components/sections/Plant";
import { Rejection } from "@/components/sections/Rejection";
import { Chiller } from "@/components/sections/Chiller";
import { Controls } from "@/components/sections/Controls";
import { Performance } from "@/components/sections/Performance";
import { Risk } from "@/components/sections/Risk";
import { Next } from "@/components/sections/Next";

const title = "Cooling the cloud without draining the tap";
const description =
  "Concept design proposal for a 20 MW AI data centre in Western Sydney: a 30 °C warm water plant with dry coolers, a high-temperature chiller and adiabatic assist gated on the state of the community's water supply.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article" },
};

export default function WarmWaterCooling() {
  return (
    <>
      <Header label="Concept design proposal · 2026" />
      <main>
        <Hero />
        <Summary />
        <Brief />
        <Water />
        <Constraints />
        <Options />
        <Plant />
        <Rejection />
        <Chiller />
        <Controls />
        <Performance />
        <Risk />
        <Next />
      </main>
    </>
  );
}
