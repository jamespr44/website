"use client";

import { Defs, Flow, hue, Valve } from "./schematic";

type Part = "evaporator" | "compressor" | "condenser" | "valve";
const PARTS: (Part | null)[] = [null, "evaporator", "compressor", "condenser", "valve"];

/** Tag that inverts when its component is the step being described. */
function Tag({ x, y, active, children }: { x: number; y: number; active: boolean; children: React.ReactNode }) {
  const w = String(children).length * 6.7 + 20;
  return (
    <g>
      <rect
        x={x}
        y={y - 15}
        width={w}
        height="22"
        rx="11"
        fill={active ? "var(--ink)" : "var(--bg)"}
        stroke="var(--ink)"
        style={{ transition: "fill 0.4s" }}
      />
      <text
        x={x + w / 2}
        y={y}
        fontSize="11.5"
        textAnchor="middle"
        fill={active ? "var(--bg)" : "var(--ink)"}
        style={{ transition: "fill 0.4s" }}
      >
        {children}
      </text>
    </g>
  );
}

/** Heat-exchanger shell with its tube bundle. */
function Shell({ x, y, w, h, bold }: { x: number; y: number; w: number; h: number; bold: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--bg)" stroke="var(--ink)" strokeWidth={bold ? 2 : 1} />
      {[0.28, 0.5, 0.72].map((f) => (
        <line
          key={f}
          x1={x + 10}
          x2={x + w - 10}
          y1={y + h * f}
          y2={y + h * f}
          stroke="var(--ink)"
          strokeOpacity="0.45"
        />
      ))}
    </g>
  );
}

/**
 * The vapour-compression cycle of the high-temperature chiller. `step` (0–4) matches the chapter's scroll steps:
 * 0 shows the whole cycle; 1–4 bring one component forward.
 */
export function ChillerCycle({ step }: { step: number }) {
  const focus = PARTS[step] ?? null;
  const dim = (p: Part) => ({ opacity: focus && focus !== p ? 0.3 : 1, transition: "opacity 0.6s" });
  const bold = (p: Part) => focus === p;

  return (
    <svg
      viewBox="0 0 760 470"
      role="img"
      aria-label="Refrigeration cycle of the chiller: the evaporator absorbs heat from the IT loop, the two-stage compressor raises the refrigerant's pressure, the condenser rejects the heat to condenser water at up to 55 °C, and the expansion valve drops the pressure again."
      className="h-auto w-full"
      fontFamily="inherit"
    >
      <Defs id="cc" />

      {/* Pressure sides */}
      <rect x="0" y="0" width="760" height="222" fill="var(--bg-raised)" />
      <text x="14" y="22" fontSize="11" fill="var(--muted)">
        High-pressure side
      </text>
      <text x="14" y="460" fontSize="11" fill="var(--muted)">
        Low-pressure side
      </text>

      {/* Refrigerant loop */}
      <Flow d="M175 305 V175" color={hue.cool} />
      <Flow d="M225 125 H420" color={hue.hot} />
      <Flow d="M600 155 V212" color={hue.warm} />
      <Flow d="M600 248 V335 H340" color={hue.cool} dotted width={3} />

      {/* Evaporator + TCS water */}
      <g style={dim("evaporator")}>
        <Shell x={70} y={305} w={270} h={60} bold={bold("evaporator")} />
        <Flow d="M8 318 H70" color={hue.warm} />
        <Flow d="M70 352 H8" color={hue.cool} />
        <text x="10" y="302" fontSize="11" fill="var(--muted)">
          Warm TCS return
        </text>
        <text x="10" y="380" fontSize="11" fill="var(--muted)">
          30 °C to the IT loop
        </text>
        <Tag x={70} y={410} active={bold("evaporator")}>
          1 · Evaporator
        </Tag>
      </g>

      {/* Compressor + motor */}
      <g style={dim("compressor")}>
        <rect x="88" y="108" width="40" height="34" fill="var(--bg)" stroke="var(--ink)" />
        <circle
          cx="175"
          cy="125"
          r="48"
          fill="var(--bg)"
          stroke="var(--ink)"
          strokeWidth={bold("compressor") ? 2 : 1}
        />
        <g className="fan-spin">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path
              key={a}
              d="M175 125 Q 190 105 178 84"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.2"
              transform={`rotate(${a} 175 125)`}
            />
          ))}
        </g>
        <circle cx="175" cy="125" r="6" fill="var(--ink)" />
        <Tag x={100} y={202} active={bold("compressor")}>
          2 · Two-stage compressor
        </Tag>
      </g>

      {/* Condenser + condenser water */}
      <g style={dim("condenser")}>
        <Shell x={420} y={95} w={270} h={60} bold={bold("condenser")} />
        <Flow d="M690 106 H752" color={hue.hot} />
        <Flow d="M752 144 H690" color={hue.warm} />
        <text x="752" y="88" fontSize="11" fill="var(--muted)" textAnchor="end">
          Up to 55 °C → dry coolers
        </text>
        <text x="752" y="172" fontSize="11" fill="var(--muted)" textAnchor="end">
          Return from dry coolers
        </text>
        <Tag x={420} y={62} active={bold("condenser")}>
          3 · Condenser
        </Tag>
      </g>

      {/* Expansion valve */}
      <g style={dim("valve")}>
        <Valve x={600} y={230} vertical />
        <Tag x={622} y={270} active={bold("valve")}>
          4 · Expansion valve
        </Tag>
      </g>

      {/* Refrigerant legend */}
      <g fontSize="11" fill="var(--muted)">
        <line x1="420" x2="444" y1="410" y2="410" stroke={hue.cool} strokeWidth="3" />
        <text x="450" y="414">
          Low-pressure vapour
        </text>
        <line x1="420" x2="444" y1="430" y2="430" stroke={hue.hot} strokeWidth="3" />
        <text x="450" y="434">
          Hot gas
        </text>
        <line x1="580" x2="604" y1="430" y2="430" stroke={hue.warm} strokeWidth="3" />
        <text x="610" y="434">
          Liquid
        </text>
      </g>
    </svg>
  );
}
