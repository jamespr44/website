"use client";

import { Arrow, Callout, Defs, FanSide, Flow, hue, makeDots } from "./schematic";

const mistL = makeDots(21, 26, { x: 168, y: 150, w: 30, h: 20 });
const mistR = makeDots(22, 26, { x: 482, y: 150, w: 30, h: 20 });
const ROWS = [190, 235, 280];
// Coil faces: the V-bank's outer surfaces, as functions of height.
const faceL = (y: number) => 208 + (y - 130) * (104 / 192);
const faceR = (y: number) => 472 - (y - 130) * (104 / 192);

/** V-bank adiabatic dry cooler in cross-section. With `spray` on, mist pre-cools the air before the coils. */
export function DryCoolerSchematic({ spray, ambient, atCoil }: { spray: boolean; ambient: number; atCoil: number }) {
  const cooled = spray ? hue.cool : hue.warm;
  return (
    <svg
      viewBox="0 0 680 420"
      role="img"
      aria-label={`Cross-section of a V-bank dry cooler. Adiabatic spray is ${spray ? "on: mist cools the entering air" : "off: hot air enters the coils directly"}. Air reaches the coil at ${atCoil.toFixed(1)} °C.`}
      className="h-auto w-full"
      fontFamily="inherit"
    >
      <Defs id="dc" />

      {/* Frame and legs */}
      <rect x="180" y="322" width="320" height="10" fill="var(--bg)" stroke="var(--ink)" />
      {[196, 484].map((x) => (
        <line key={x} x1={x} x2={x} y1="332" y2="395" stroke="var(--ink)" />
      ))}
      <line x1="0" x2="680" y1="395" y2="395" stroke="var(--line)" />

      {/* V-bank coils */}
      <polygon points="312,322 330,322 226,130 208,130" fill="url(#dc-hatch)" stroke="var(--ink)" />
      <polygon points="368,322 350,322 454,130 472,130" fill="url(#dc-hatch)" stroke="var(--ink)" />

      {/* Fan deck, fan and exhaust */}
      <rect x="196" y="116" width="288" height="14" fill="var(--bg)" stroke="var(--ink)" />
      <rect x="286" y="86" width="108" height="30" fill="var(--bg)" stroke="var(--ink)" />
      <FanSide cx={340} cy={100} w={96} />
      <Arrow x1={318} y1={80} x2={318} y2={36} color={hue.warm} />
      <Arrow x1={362} y1={80} x2={362} y2={36} color={hue.warm} />
      <text x="378" y="44" fontSize="11.5" fill="var(--ink)">
        Warm air out
      </text>

      {/* Spray headers, nozzles and mist */}
      {[
        { x: 160, dir: 1, dots: mistL },
        { x: 520, dir: -1, dots: mistR },
      ].map(({ x, dir, dots }) => (
        <g key={x}>
          <circle cx={x} cy="150" r="7" fill={spray ? "var(--muted)" : "var(--bg)"} stroke="var(--ink)" />
          <path d={`M${x + dir * 7} 154 L${x + dir * 15} 160 L${x + dir * 9} 164 Z`} fill="var(--ink)" />
          {spray &&
            dots.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={d.r + 0.4}
                fill="var(--muted)"
                className="drift-dot"
                style={
                  {
                    "--dx": `${dir * (18 + d.jitter * 8)}px`,
                    "--dy": `${110 + d.jitter * 20}px`,
                    "--dur": "1.6s",
                    "--delay": `${-d.delay * 1.6}s`,
                    "--o": 0.75,
                  } as React.CSSProperties
                }
              />
            ))}
        </g>
      ))}

      {/* Air entering both faces */}
      {ROWS.map((y) => (
        <g key={y}>
          <line x1="24" y1={y} x2="130" y2={y} stroke={hue.warm} strokeWidth="1.5" />
          <Arrow x1={130} y1={y} x2={faceL(y) - 8} y2={y} color={cooled} width={1.5} />
          <line x1="656" y1={y} x2="550" y2={y} stroke={hue.warm} strokeWidth="1.5" />
          <Arrow x1={550} y1={y} x2={faceR(y) + 8} y2={y} color={cooled} width={1.5} />
        </g>
      ))}

      {/* Process water */}
      <Flow d="M20 372 H330 V336" color={hue.warm} />
      <Flow d="M350 336 V372 H660" color={hue.cool} />

      {/* Temperatures and labels */}
      <text x="24" y="172" fontSize="12" fill="var(--ink)">
        Ambient {ambient.toFixed(1)} °C
      </text>
      <text x="24" y="306" fontSize="12" fill="var(--ink)">
        At the coil {atCoil.toFixed(1)} °C
      </text>
      <text x="24" y="362" fontSize="11" fill="var(--muted)">
        Warm process water in
      </text>
      <text x="656" y="362" fontSize="11" fill="var(--muted)" textAnchor="end">
        Cooled water out
      </text>
      <Callout from={[462, 150]} to={[560, 150]}>
        Finned coil
      </Callout>
      <Callout from={[527, 146]} to={[560, 118]}>
        Spray header
      </Callout>
      {spray && (
        <Callout from={[188, 196]} to={[150, 112]} anchor="end" tone="var(--ink)">
          Mist cools the air
        </Callout>
      )}
    </svg>
  );
}
