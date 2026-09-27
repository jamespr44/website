# Warm Water Cooling: conventions

This is an editorial design system for the scrolling literature review "Optimised Warm Chilled Water Cooling with Trigger-Based Adiabatic Assist":

- black pages;
- white and grey Inter type, square corners and no shadows;
- colour only in data and in the iridescent "liquid".

## Setup

- **Page:** link `styles.css`; it sets `body { background: var(--bg); color: var(--ink); font-family: var(--font-sans) }`. Every token assumes a **black page**, so never place components on a white container.
  - If you build inside your own wrapper, give it `className="bg-bg text-ink"`.
- **Wrapper:** no provider is needed.
- **Motion:** `Reveal`, `Section`, `Counter`, `GapMatrix` and `TdpTrend` animate in when scrolled into view.
  - For a static mock-up, set `WarmWaterCooling.MotionGlobalConfig.skipAnimations = true` once, before rendering.
- **Scroll scenes:** `CrossingChart` and `FreeCoolingWindow` are scroll-pinned scenes, 380vh and 260vh tall. Only use them in a long scrolling page.

## Styling idiom

Style with Tailwind utilities built on the tokens and the component classes below. Use no other colours.

| Purpose | Use |
|---|---|
| Surfaces | `bg-bg` (black #000), `bg-raised` / `.panel` (#111 raised block with a hairline outline) |
| Text | `text-ink` (white), `text-inkstone` (body copy), `text-muted` (secondary), `text-faint` (captions) |
| Rules | `border-t border-rule` (white rule above a figure), `border-line` (18% white hairline) |
| Data hues (charts only) | sage `--sage` / `text-sage` / `bg-sage` = free cooling, water saved; amber `--amber` = heat; oxblood `--oxblood` = mechanical cooling, 55 °C, breaches |
| SVG strokes | `var(--heat)` warm water, `var(--water)` 30 °C supply, `var(--hot)` condenser, `var(--track)` idle pipe; or the exported `hue.warm / hue.cool / hue.hot / hue.water / hue.off` |

**Type classes.** Pair each class with the element shown; do not set font sizes by hand.

| Class | Use it for |
|---|---|
| `.t-display` | 225px display line |
| `.t-whisper` | 78px light headline (h2) |
| `.t-stat` | 94px key figure |
| `.t-sub` | 39px light subheading |
| `.t-label` | 12px kicker or label |
| `.t-caption` | 11px caption |

**Controls.**
- `.pill` is a ghost pill button, the only rounded shape; `.pill-sm` is its small size.
- `.pill-group` is a segmented control made of `<button role="radio" aria-checked>` children.

**Layout.** Content columns are `mx-auto max-w-[1078px]`; body copy is `max-w-[600px]`.

## Components

- **`Section`**: a whole chapter. It has a kicker, a liquid headline and a lede; `id` must be one of its chapter ids.
- **`Prose`**: body copy.
- **`SourceNote`**: a "Source · …" caption.
- **`Term`**: a glossary tooltip; `k` must be a glossary key such as `"TCS"` or `"WUE"`.
- **`LiquidText`**: wraps key figures and headlines so they fill with the moving liquid.
  - Short figures take the default `zoom`.
  - For headlines use `block zoom={1.3}`.
- **`IridescentBackdrop`**: an absolute-fill hero backdrop. Put it inside a `relative overflow-hidden` box.
- **Schematic kit:** `Defs`, `Flow`, `FanTop`, `FanSide`, `Arrow`, `Valve` and `Callout` are SVG parts. Render them inside your own `<svg viewBox>`.
  - Include `<Defs id="x" />` once, then reference its patterns as `url(#x-hatch)` or `url(#x-fins)`.
- **Equipment:**
  - `PlantSchematic` takes `state={selectMode(dryBulbC, "normal" | "constrained")}`.
  - `CoolingTowerSchematic` takes `intensity` (0–1).
  - `DryCoolerSchematic` takes `spray`, `ambient` and `atCoil`.
  - `ChillerCycle` takes `step` (0–4).

Read `styles.css` and `components/<group>/<Name>/<Name>.prompt.md` before styling.

## Example

```jsx
const { LiquidText, SourceNote } = window.WarmWaterCooling;

<section className="bg-bg text-ink px-8 py-32">
  <div className="mx-auto grid max-w-[1078px] gap-10 md:grid-cols-2">
    <div className="border-t border-rule pt-7">
      <p className="t-stat m-0"><LiquidText>−66%</LiquidText></p>
      <p className="mt-6 mb-0 text-inkstone">Less water with dry rejection and a water-gated adiabatic mode.</p>
      <SourceNote>Illustrative</SourceNote>
    </div>
    <div className="panel p-8">
      <p className="t-label m-0 text-muted">Research question</p>
      <p className="t-sub mt-4 mb-0">When should the plant spend water?</p>
      <button className="pill pill-sm mt-8">Read the review</button>
    </div>
  </div>
</section>
```
