"use client";

import { Section, Prose } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Term";
import { SourceNote } from "@/components/ui/SourceNote";
import { SprayCooling } from "@/components/viz/SprayCooling";

export function Adiabatic() {
  return (
    <Section
      id="adiabatic"
      kicker="Adiabatic assist"
      title={<>A little water, only when it counts.</>}
      lede={
        <>
          Spraying or misting water into the air entering a dry cooler pre-cools it. That lets the plant reach
          approaches a dry coil can’t, without the constant draw of a cooling tower.
        </>
      }
    >
      <div className="mt-16">
        <SprayCooling />
        <SourceNote>Yang et al. (2021)</SourceNote>
      </div>
      <Reveal className="mt-16">
        <Prose>
          <p>
            <Term k="adiabatic">Adiabatic</Term> assist still uses water. That is why this design treats it as a{" "}
            <span className="text-ink">third mode, triggered on demand</span> rather than as a default. The trigger is
            the state of the local water system, not only the needs of the plant.
          </p>
        </Prose>
      </Reveal>
    </Section>
  );
}
