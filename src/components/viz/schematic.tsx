/**
 * Shared parts for the editorial schematics: hairline technical drawings on the page tokens, with the data hues
 * carried only by flowing water and refrigerant. Everything reads CSS variables, so the same drawing works on white
 * sections and `.band-dark` bands.
 */

import { seeded } from "@/lib/random";

export const hue = {
  warm: "var(--heat)",
  cool: "var(--water)",
  hot: "var(--hot)",
  water: "var(--muted)",
  off: "var(--track)",
} as const;

/** Pattern and marker definitions; `id` keeps them unique when several drawings share a page. */
export function Defs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={`${id}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" strokeWidth="0.8" strokeOpacity="0.55" />
      </pattern>
      <pattern id={`${id}-fins`} width="4" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="var(--ink)" strokeWidth="0.7" strokeOpacity="0.6" />
      </pattern>
    </defs>
  );
}

/** A pipe run: a quiet track, plus animated dashes in the flow colour while it carries water. */
export function Flow({
  d,
  active = true,
  color,
  width = 2.5,
  dotted = false,
}: {
  d: string;
  active?: boolean;
  color: string;
  width?: number;
  dotted?: boolean;
}) {
  return (
    <g>
      <path d={d} fill="none" stroke={hue.off} strokeWidth={width + 4} strokeLinejoin="round" />
      {active && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinejoin="round"
          strokeLinecap={dotted ? "round" : "butt"}
          className="pipe-flow"
          style={dotted ? { strokeDasharray: "0.1 8" } : undefined}
        />
      )}
    </g>
  );
}

/** Axial fan seen from above: shroud, spinning blades, hub. */
export function FanTop({ cx, cy, r = 18, spin = true }: { cx: number; cy: number; r?: number; spin?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--bg)" stroke="var(--ink)" />
      <g className={spin ? "fan-spin" : ""}>
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            d={`M${cx} ${cy} Q ${cx + r * 0.2} ${cy - r * 0.5} ${cx} ${cy - r * 0.85} Q ${cx - r * 0.35} ${cy - r * 0.5} ${cx} ${cy}`}
            fill="var(--ink)"
            fillOpacity="0.8"
            transform={`rotate(${a} ${cx} ${cy})`}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={r * 0.14} fill="var(--bg)" stroke="var(--ink)" />
    </g>
  );
}

/** Axial fan seen edge-on in a section: a blade that flattens and flips as it turns. */
export function FanSide({ cx, cy, w = 90, spin = true }: { cx: number; cy: number; w?: number; spin?: boolean }) {
  return (
    <g>
      <line x1={cx} y1={cy} x2={cx} y2={cy + 18} stroke="var(--ink)" />
      <rect x={cx - 7} y={cy - 5} width="14" height="10" fill="var(--bg)" stroke="var(--ink)" />
      <g className={spin ? "blade-spin" : ""}>
        <path
          d={`M${cx - w / 2} ${cy + 2} L${cx} ${cy - 3} L${cx + w / 2} ${cy - 8} L${cx} ${cy + 3} Z`}
          fill="var(--ink)"
        />
      </g>
    </g>
  );
}

/** Arrow line from (x1,y1) to (x2,y2) with a head at the end, in one colour. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = "var(--ink)",
  width = 1.25,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 7;
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)];
  const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} />
      <path d={`M${x2} ${y2} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} Z`} fill={color} />
    </g>
  );
}

/** Bowtie valve. Closed shows the oxblood state. */
export function Valve({
  x,
  y,
  closed = false,
  vertical = false,
}: {
  x: number;
  y: number;
  closed?: boolean;
  vertical?: boolean;
}) {
  const c = closed ? "var(--hot)" : "var(--ink)";
  return (
    <g transform={`translate(${x} ${y}) rotate(${vertical ? 90 : 0})`}>
      <path d="M-11 -8 L0 0 L-11 8 Z M11 -8 L0 0 L11 8 Z" fill={closed ? c : "var(--bg)"} stroke={c} />
    </g>
  );
}

/** Hairline leader line from a point on the drawing to a label. */
export function Callout({
  from,
  to,
  children,
  anchor = "start",
  tone = "var(--ink)",
}: {
  from: [number, number];
  to: [number, number];
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  tone?: string;
}) {
  return (
    <g>
      <circle cx={from[0]} cy={from[1]} r="2" fill="var(--ink)" />
      <path d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]}`} stroke="var(--ink)" strokeWidth="0.75" fill="none" />
      <text
        x={to[0] + (anchor === "start" ? 6 : anchor === "end" ? -6 : 0)}
        y={to[1] + 4}
        fontSize="11.5"
        textAnchor={anchor}
        fill={tone}
      >
        {children}
      </text>
    </g>
  );
}

/** Deterministic dots for vapour, mist and rain; the CSS `drift-dot` class animates them. */
export function makeDots(seed: number, n: number, box: { x: number; y: number; w: number; h: number }) {
  const rand = seeded(seed);
  return Array.from({ length: n }, () => ({
    x: box.x + rand() * box.w,
    y: box.y + rand() * box.h,
    r: 0.6 + rand() * 1,
    delay: rand(),
    jitter: rand() * 2 - 1,
  }));
}
