# Cooling the cloud without draining the tap

An interactive, scroll-driven version of James Gianoutsos’s literature review, _Optimised Warm Chilled Water Cooling
with Trigger-Based Adiabatic Assist: Minimising Data Centre Water Impact on Constrained Community Supply_.

The page walks a reader through the argument in thirteen chapters. It starts with why cooling towers consume water,
moves through the rising climate floor and falling hardware ceiling, tours a high-temperature chiller, covers the
research gap, and finishes with an interactive three-mode plant.

Built with Next.js 15 (App Router), Tailwind CSS v4, [Motion](https://motion.dev) for animation and
[Lenis](https://lenis.darkroom.engineering) for smooth scrolling. The equipment is drawn as editorial schematics in
hand-built SVG: a cooling tower, an adiabatic dry cooler, the chiller's refrigeration cycle and the full plant. They
are animated by CSS (flowing pipes, fans, vapour and mist) and follow the page's colour tokens.

An earlier real-time 3D (three.js) version of the equipment is kept on the `shelf/3d-models` branch.

## Design

Editorial monochrome: black, white and grey type on square corners, with 75px pills as the only rounded shape and
no shadows. Colour appears in only two places:

- the iridescent liquid (`src/lib/liquid.ts`). It fills the hero backdrop and, through `LiquidText`, the key figures.
  One shared offscreen renderer (`src/lib/liquidRenderer.ts`) paints every figure, so the liquid reads as one sheet
  behind the page.
- charts and schematics, using the same three hues: sage for free cooling and water saved, amber for heat, and
  oxblood for mechanical cooling, 55 °C water and breaches.

Every colour is a CSS token in `src/app/globals.css`. `.band-dark` swaps the tokens for black sections, so a site-wide
dark mode is mostly a matter of applying the same swap at the root.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # production build
npm run format   # Prettier
```

## Deploying

- **Vercel:** import the repository at vercel.com/new. It needs no configuration.
- **Netlify:** import the repository. The build command is `npm run build`, and Netlify detects the Next.js runtime
  automatically.

## Editing content

| What                                                | Where                                                   |
| --------------------------------------------------- | ------------------------------------------------------- |
| Chapter copy                                        | `src/components/sections/*.tsx`, one per chapter        |
| Quoted figures (percentages, L/kWh, ML/day, …)      | `src/content/chapters.ts` → `figures`                   |
| Chapter order and progress-rail labels              | `src/content/chapters.ts` → `chapters`                  |
| Glossary tooltips                                   | `src/content/glossary.ts`                               |
| Plant-mode thresholds for the interactive schematic | `src/lib/plantModes.ts`                                 |
| Equipment schematics                                | `src/components/viz/*Schematic.tsx`, `ChillerCycle.tsx` |
| Colours and fonts                                   | `src/app/globals.css`                                   |

The plant thresholds, the free-cooling heatmap and the WUE profiles are **illustrative**, and the page labels them as
such. Replace them with results from the design study as they become available.

Every animation respects `prefers-reduced-motion`. With it enabled, scenes render their final state and smooth
scrolling is disabled.
