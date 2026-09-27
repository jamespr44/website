# Cooling the cloud without draining the tap

An interactive, scroll-driven version of James Gianoutsos’s literature review, _Optimised Warm Chilled Water Cooling
with Trigger-Based Adiabatic Assist: Minimising Data Centre Water Impact on Constrained Community Supply_.

The page walks a reader through the argument in thirteen chapters. It starts with why cooling towers consume water,
moves through the rising climate floor and falling hardware ceiling, tours a high-temperature chiller, covers the
research gap, and finishes with an interactive three-mode plant.

Built with Next.js 15 (App Router), Tailwind CSS v4, [Motion](https://motion.dev) for animation and
[Lenis](https://lenis.darkroom.engineering) for smooth scrolling. The equipment is modelled in real-time 3D with
[three.js](https://threejs.org) via React Three Fiber: a cooling tower, an adiabatic dry cooler, a centrifugal
chiller and the full plant. All models are built procedurally in code, so there are no model or texture downloads.
Charts are hand-built SVG.

The 3D bundles load lazily when a scene nears the viewport, and each canvas pauses when off-screen.

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

| What                                                | Where                                            |
| --------------------------------------------------- | ------------------------------------------------ |
| Chapter copy                                        | `src/components/sections/*.tsx`, one per chapter |
| Quoted figures (percentages, L/kWh, ML/day, …)      | `src/content/chapters.ts` → `figures`            |
| Chapter order and progress-rail labels              | `src/content/chapters.ts` → `chapters`           |
| Glossary tooltips                                   | `src/content/glossary.ts`                        |
| Plant-mode thresholds for the interactive schematic | `src/lib/plantModes.ts`                          |
| 3D equipment models and lighting                    | `src/components/three/*`                         |
| Colours and fonts                                   | `src/app/globals.css`                            |

The plant thresholds, the free-cooling heatmap and the WUE profiles are **illustrative**, and the page labels them as
such. Replace them with results from the design study as they become available.

Every animation respects `prefers-reduced-motion`. With it enabled, scenes render their final state and smooth
scrolling is disabled.
