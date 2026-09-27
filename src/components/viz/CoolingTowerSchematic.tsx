"use client";

import { Arrow, Callout, Defs, FanSide, Flow, hue, makeDots } from "./schematic";

const plume = makeDots(11, 40, { x: 212, y: 96, w: 96, h: 10 });
const rain = makeDots(12, 22, { x: 138, y: 374, w: 244, h: 8 });
const louvres = Array.from({ length: 8 }, (_, i) => 386 + i * 11);

/** Induced-draft cooling tower in section. `intensity` (0 → 1) thickens and speeds the vapour plume. */
export function CoolingTowerSchematic({ intensity }: { intensity: number }) {
  const shown = Math.round(10 + intensity * 30);
  const dur = 4.6 - intensity * 2;

  return (
    <svg
      viewBox="0 0 560 560"
      role="img"
      aria-label="Section through an induced-draft cooling tower. Warm water is sprayed over the fill, air is drawn in through louvres, and evaporated water leaves the fan stack as a vapour plume."
      className="h-auto w-full"
      fontFamily="inherit"
    >
      <Defs id="ct" />

      {/* Vapour plume */}
      {plume.slice(0, shown).map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={4 + d.r * 3}
          fill="var(--muted)"
          className="drift-dot"
          style={
            {
              "--dx": `${d.jitter * 34}px`,
              "--dy": `-${80 + d.r * 20}px`,
              "--dur": `${dur}s`,
              "--delay": `${-d.delay * dur}s`,
              "--o": 0.28,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Fan stack and fan */}
      <path d="M200 180 V112 M320 112 V180" stroke="var(--ink)" fill="none" />
      <line x1="194" x2="206" y1="112" y2="112" stroke="var(--ink)" />
      <line x1="314" x2="326" y1="112" y2="112" stroke="var(--ink)" />
      <FanSide cx={260} cy={160} w={104} />

      {/* Casing */}
      <rect x="110" y="180" width="300" height="300" fill="none" stroke="var(--ink)" />
      {/* Drift eliminator */}
      <rect x="120" y="212" width="280" height="16" fill="url(#ct-fins)" stroke="var(--ink)" strokeWidth="0.75" />
      {/* Spray header and nozzles */}
      <Flow d="M540 262 H138" color={hue.warm} />
      {[160, 200, 240, 280, 320, 360].map((x) => (
        <g key={x}>
          <path d={`M${x - 4} 266 L${x + 4} 266 L${x} 273 Z`} fill="var(--ink)" />
          <path
            d={`M${x} 275 L${x - 12} 292 M${x} 275 L${x} 294 M${x} 275 L${x + 12} 292`}
            stroke="var(--heat)"
            strokeWidth="0.8"
          />
        </g>
      ))}
      {/* Fill pack */}
      <rect x="130" y="300" width="260" height="70" fill="url(#ct-hatch)" stroke="var(--ink)" />
      {/* Falling water */}
      {rain.map((d, i) => (
        <line
          key={i}
          x1={d.x}
          x2={d.x}
          y1={d.y}
          y2={d.y + 7}
          stroke="var(--water)"
          strokeWidth="1.2"
          className="drift-dot"
          style={
            {
              "--dy": "92px",
              "--dur": "0.9s",
              "--delay": `${-d.delay * 0.9}s`,
              "--o": 0.8,
            } as React.CSSProperties
          }
        />
      ))}
      {/* Louvred air inlets */}
      {louvres.map((y) => (
        <g key={y}>
          <line x1="104" y1={y} x2="120" y2={y + 8} stroke="var(--ink)" strokeWidth="0.9" />
          <line x1="416" y1={y} x2="400" y2={y + 8} stroke="var(--ink)" strokeWidth="0.9" />
        </g>
      ))}
      <Arrow x1={26} y1={408} x2={96} y2={408} />
      <Arrow x1={26} y1={446} x2={96} y2={446} />
      <text x="26" y="394" fontSize="11.5" fill="var(--ink)">
        Air in
      </text>

      {/* Basin */}
      <rect x="100" y="480" width="320" height="50" fill="none" stroke="var(--ink)" />
      <rect x="101" y="494" width="318" height="35" fill="var(--sage)" fillOpacity="0.35" />
      <line x1="101" x2="419" y1="494" y2="494" stroke="var(--water)" />
      <Flow d="M420 512 H540" color={hue.cool} />
      <Flow d="M10 506 H100" color={hue.water} dotted width={2} />
      <line x1="0" x2="560" y1="538" y2="538" stroke="var(--line)" />

      {/* Labels */}
      <Callout from={[300, 70]} to={[338, 46]}>
        Vapour · ≈1.45 L/kWh evaporated
      </Callout>
      <Callout from={[320, 150]} to={[430, 150]}>
        Fan draws air up
      </Callout>
      <Callout from={[400, 220]} to={[430, 206]}>
        Drift eliminator
      </Callout>
      <text x="446" y="252" fontSize="11.5" fill="var(--ink)">
        Warm water in
      </text>
      <Callout from={[390, 335]} to={[430, 335]}>
        Fill pack
      </Callout>
      <Callout from={[410, 430]} to={[430, 430]}>
        Louvres
      </Callout>
      <text x="446" y="532" fontSize="11.5" fill="var(--ink)">
        Cooled water out
      </text>
      <text x="10" y="494" fontSize="11.5" fill="var(--muted)">
        Make-up water
      </text>
      <text x="100" y="556" fontSize="11" fill="var(--muted)">
        Drift and blowdown add further losses
      </text>
    </svg>
  );
}
