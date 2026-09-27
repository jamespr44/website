# design-sync notes

## How this repo syncs
- The repo is a Next.js site, not a published library.
  - `.design-sync/entry.ts` is the DS barrel: the reusable UI primitives, schematic kit, schematics and charts.
  - Page chapters (`src/components/sections/*`), `Header` and `SmoothScroll` are deliberately left out.
- `node .design-sync/build-lib.mjs` (the `buildCmd`) builds `.ds-lib/`, a package-shaped copy the converter reads. Run it before every converter/driver run. It contains:
  - an esbuild ESM entry, with React external;
  - tsc `.d.ts` files, with `@/` aliases rewritten to relative paths;
  - the Tailwind-compiled stylesheet. It scans `src/`, the previews and `conventions.md`, plus a small `@source inline` safelist of layout utilities.
- Converter deps live in `.ds-sync/node_modules`: esbuild, ts-morph, @types/react, @tailwindcss/cli@4 and playwright@1.63.0.
  - Chromium comes from `/opt/pw-browsers`. Run validate/capture with `DS_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
- `extraFonts` points at `@fontsource-variable/inter`, the site's font.

## Preview conventions
- The card chrome is white, but every token assumes a black page. Each preview wraps its cells in a local `Page` div with `background: var(--bg)`.
- Entrance animations use motion `whileInView`, and capture screenshots before they finish.
  - `entry.ts` re-exports `MotionGlobalConfig`, excluded from components through `componentSrcMap: null`.
  - Previews set `MotionGlobalConfig.skipAnimations = true`.
- `CrossingChart` and `FreeCoolingWindow` are scroll-pinned scenes. Their previews stub `matchMedia("(prefers-reduced-motion)")` so the component renders its own static final state.
  - The stub must be a full MediaQueryList-shaped object. Spreading a real one drops the methods, and React then logs a recoverable render error.
- `CrossingChart` (900x1100) and `SprayCooling` (900x860) need taller viewports, or their content crops.
- Wide cards use `cardMode: "column"`.

## Known render warns
- None outstanding.

## Re-sync risks
- `build-lib.mjs` relies on:
  - tsc emitting declarations for `entry.ts`, with `rootDir` set to the repo root, so types land under `.ds-lib/types/.design-sync/`;
  - a regex rewrite of `@/` imports.
  A new alias would need adding there.
- The Tailwind safelist in `build-lib.mjs` is hand-picked. Classes the design agent uses outside it, and outside the site and previews, will not exist.
- `Section.id` and `Term.k` are unions taken from `src/content/chapters.ts` and `glossary.ts`, so the `.d.ts` changes when those change.
- **Stale since the site change:** the `matchMedia` stub in the `CrossingChart` and `FreeCoolingWindow` previews no longer works. The site now keeps those scenes scroll-driven under reduced motion, so the stub doesn't produce a final state.
  - The cards will render the scenes at scroll progress 0.
  - Rework both previews before the next upload: for example, scroll the card to the scene's end on mount. Then re-grade them.
