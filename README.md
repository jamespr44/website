# James Gianoutsos · portfolio

A portfolio site. The home page (`/`) introduces James and lists projects; each project has its own route.

The first project, [`/projects/warm-water-cooling`](src/app/projects/warm-water-cooling/page.tsx), is _Cooling the
cloud without draining the tap_: a concept design proposal for a 20 MW AI data centre in Western Sydney. It proposes a
30 °C warm chilled water plant with dry coolers, a high-temperature chiller, and adiabatic assist gated on the state
of the community's water supply. It runs in thirteen chapters: summary, brief, two context chapters drawn from the
literature, options appraisal, the proposed plant, heat rejection, the chiller, control strategy, indicative
performance, compliance and risk, and next steps.

The literature review this proposal grew out of is kept on the `shelf/literature-review` branch.

Built with Next.js 15 (App Router), Tailwind CSS v4, [Motion](https://motion.dev) for animation and
[Lenis](https://lenis.darkroom.engineering) for smooth scrolling. The equipment is drawn as editorial schematics in
hand-built SVG: a cooling tower, an adiabatic dry cooler, the chiller's refrigeration cycle and the full plant. They
are animated by CSS (flowing pipes, fans, vapour and mist) and follow the page's colour tokens.

An earlier real-time 3D (three.js) version of the equipment is kept on the `shelf/3d-models` branch.

## Design

Editorial monochrome on a black page: white and grey type on square corners, with 75px pills as the only rounded
shape and no shadows. Colour appears in only two places:

- the iridescent liquid (`src/lib/liquid.ts`), a moving temperature field on a hot-to-cold ramp: oxblood, orange,
  amber, yellow, sage, blue. It fills the hero backdrop and, through `LiquidText`, the key figures. One shared
  offscreen renderer (`src/lib/liquidRenderer.ts`) paints every figure, so the liquid reads as one sheet behind the
  page. The hero renders at full display resolution and steps down only if frames run slow.
- charts and schematics, using three of those hues: sage for free cooling and water saved, amber for heat, and
  oxblood for mechanical cooling, 55 °C water and breaches.

Every colour is a CSS token in `src/app/globals.css`, and `:root` holds the black palette. Sections are separated by
hairline rules; `.panel` gives a raised `#111` surface for the few things that need emphasis. `.band-dark` survives
only as an alias, so a light theme would be a matter of redefining the tokens.

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

| What                                                  | Where                                                   |
| ----------------------------------------------------- | ------------------------------------------------------- |
| Home page name, role, bio, contact links and projects | `src/content/profile.ts`                                |
| Proposal chapter copy                                 | `src/components/sections/*.tsx`, one per chapter        |
| Chapter order and index labels                        | `src/content/chapters.ts` → `chapters`                  |
| Figures cited from the literature                     | `src/content/chapters.ts` → `figures`                   |
| Design brief and every modelling assumption           | `src/content/design.ts`                                 |
| Indicative performance model                          | `src/lib/estimate.ts`                                   |
| Plant-mode thresholds (interactive plant and model)   | `src/lib/plantModes.ts`                                 |
| Glossary tooltips                                     | `src/content/glossary.ts`                               |
| Equipment schematics                                  | `src/components/viz/*Schematic.tsx`, `ChillerCycle.tsx` |
| Colours and fonts                                     | `src/app/globals.css`                                   |

The performance figures (hours per mode, water, PUE, chiller hours, equipment counts) are **indicative, concept-stage
estimates**, and the page labels them as such. `src/lib/estimate.ts` runs a seeded synthetic Western Sydney year,
hour by hour, through the plant's control logic in two scenarios (supply normal all year, drought restrictions all
year) and compares them with a cooling-tower baseline. Change an assumption in `src/content/design.ts` and every
derived figure on the page follows. Replace the synthetic year with measured weather data when the design study runs.

With `prefers-reduced-motion` enabled (Windows "Animation effects" off, macOS "Reduce motion"), smooth scrolling, the
hero parallax, reveals and counters are switched off. Two things deliberately stay live:

- the scroll-pinned scenes (the crossing chart and the chiller tour), because the reader drives
  them with their own scrolling;
- the liquid, which drifts at about a third of its normal speed instead of freezing.
