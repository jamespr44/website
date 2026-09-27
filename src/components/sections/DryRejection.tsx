"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LiquidText } from "@/components/ui/LiquidText";
import { Counter } from "@/components/ui/Counter";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { FreeCoolingWindow } from "@/components/viz/FreeCoolingWindow";
import { figures } from "@/content/chapters";

export function DryRejection() {
  return (
    <Section
      id="dry"
      kicker="Elevated-temperature dry rejection"
      title={<>Dry cooling works. The question is where.</>}
      lede={
        <>
          Rejecting heat without evaporation is established practice. Hot-water-cooled facilities date back to IBM’s
          Aquasar, and chiller-less plants running on warm supply water have been instrumented and reported.
        </>
      }
    >
      <div className="mt-16 grid gap-14 sm:grid-cols-2 sm:gap-10">
        <Reveal className="border-t border-rule pt-7">
          <p className="t-label">Water</p>
          <p className="t-stat mt-6">
            <LiquidText>
              −<Counter value={figures.karimiWueDropPct} suffix="%" />
            </LiquidText>
          </p>
          <p className="mt-7 text-muted">
            Measured <Term k="WUE" /> of a chiller-less warm-water plant compared with conventional evaporative plant.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-rule pt-7">
          <p className="t-label">Energy</p>
          <p className="t-stat mt-6">
            <LiquidText>
              +<Counter value={figures.karimiPueRisePct} suffix="%" />
            </LiquidText>
          </p>
          <p className="mt-7 text-muted">
            The price paid: roughly 13% higher <Term k="PUE" />.
          </p>
        </Reveal>
      </div>
      <SourceNote>Karimi et al. (2022); Zimmermann et al. (2012)</SourceNote>

      <Reveal className="mt-24">
        <Prose>
          <p>
            <span>The limiting factor is climate.</span> Across forty-five years of observations, the hours in which
            combined heat and humidity constrain <Term k="freeCooling" /> have risen significantly, and they are
            projected to keep expanding through mid-century.
          </p>
          <p>
            That analysis concerns air-side economisation, but the mechanism is the same for water-side rejection:
            ambient conditions set the achievable temperature, and ambient conditions are moving. Heat also accumulates
            around large facilities and their heat-rejection plant, which moves them further.
          </p>
        </Prose>
      </Reveal>

      <FreeCoolingWindow />
      <SourceNote className="-mt-8">
        Trend direction: Karamperidou et al. (2026). Local heat build-up: Liu et al. (2009); Marinoni et al. (2026)
      </SourceNote>

      <Reveal className="mt-20">
        <Prose>
          <p>
            The strongest operating precedents sit in cool or continental climates, where <Term k="dryBulb" />{" "}
            temperature falls below the required supply temperature for most of the year. Whether the same architecture
            holds in a warm, humid climate like Sydney’s, where the rejection floor is much higher, isn’t established by
            that evidence.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
