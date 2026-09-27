"use client";

import type { PlantState } from "@/lib/plantModes";
import { Defs, FanTop, Flow, hue, makeDots, Valve } from "./schematic";

const mist = makeDots(31, 30, { x: 750, y: 172, w: 200, h: 8 });

// Pipe routes (the same topology as the plant control logic in lib/plantModes.ts)
const R = {
  itOut: "M160 190 H260",
  bypass: "M260 190 H740",
  toEvap: "M260 190 V262 H390",
  evapToIt: "M390 280 H300 V300 H160",
  dcToIt: "M740 305 H700 V400 H100 V330",
  condOut: "M590 305 H620 V230 H740",
  condReturn: "M740 270 H660 V330 H590",
  water: "M860 90 V168",
};

function Legend({
  x,
  y,
  color,
  dotted,
  children,
}: {
  x: number;
  y: number;
  color: string;
  dotted?: boolean;
  children: string;
}) {
  return (
    <g>
      <line
        x1={x}
        x2={x + 26}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth="3"
        strokeLinecap={dotted ? "round" : "butt"}
        strokeDasharray={dotted ? "0.1 6" : undefined}
      />
      <text x={x + 34} y={y + 4} fontSize="11" fill="var(--muted)">
        {children}
      </text>
    </g>
  );
}

export function PlantSchematic({ state }: { state: PlantState }) {
  const { chiller, adiabatic, adiabaticLockedOut } = state;

  return (
    <svg
      viewBox="0 0 1000 470"
      role="img"
      aria-label={`Plant schematic. Mode: ${state.headline}. ${state.detail}`}
      className="h-auto w-full"
      fontFamily="inherit"
    >
      <Defs id="pl" />

      {/* Pipework */}
      <Flow d={R.itOut} color={hue.warm} />
      <Flow d={R.bypass} color={hue.warm} active={!chiller} />
      <Flow d={R.toEvap} color={hue.warm} active={chiller} />
      <Flow d={R.evapToIt} color={hue.cool} active={chiller} />
      <Flow d={R.dcToIt} color={hue.cool} active={!chiller} />
      <Flow d={R.condOut} color={hue.hot} active={chiller} />
      <Flow d={R.condReturn} color={hue.warm} active={chiller} />
      <Flow d={R.water} color={hue.water} active={adiabatic} dotted width={2} />
      <text
        x="330"
        y="180"
        fontSize="11"
        fill={chiller ? "var(--faint)" : "var(--ink)"}
        style={{ transition: "fill 0.4s" }}
      >
        Chiller bypass · water-side free cooling
      </text>

      {/* IT load */}
      <rect x="40" y="150" width="120" height="180" fill="var(--bg)" stroke="var(--ink)" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <line x1="52" x2="148" y1={166 + i * 20} y2={166 + i * 20} stroke="var(--line)" />
          <circle cx="140" cy={160 + i * 20} r="1.8" fill={i % 3 === 0 ? "var(--sage-line)" : "var(--ink)"} />
        </g>
      ))}
      <text x="40" y="132" fontSize="12" fill="var(--ink)">
        IT load
      </text>
      <text x="40" y="146" fontSize="11" fill="var(--muted)">
        TCS loop · 30 °C supply
      </text>

      {/* Chiller */}
      <g style={{ opacity: chiller ? 1 : 0.45, transition: "opacity 0.6s" }}>
        <rect x="390" y="250" width="200" height="40" fill="var(--bg)" stroke="var(--ink)" />
        <rect x="390" y="300" width="200" height="40" fill="var(--bg)" stroke="var(--ink)" />
        {[258, 270, 282, 308, 320, 332].map((y) => (
          <line key={y} x1="400" x2="580" y1={y} y2={y} stroke="var(--ink)" strokeOpacity="0.35" />
        ))}
        <line x1="440" x2="440" y1="242" y2="250" stroke="var(--ink)" />
        <circle cx="440" cy="222" r="20" fill="var(--bg)" stroke="var(--ink)" />
        <g className={chiller ? "fan-spin" : ""}>
          {[0, 90, 180, 270].map((a) => (
            <path
              key={a}
              d="M440 222 Q 448 212 442 204"
              fill="none"
              stroke="var(--ink)"
              transform={`rotate(${a} 440 222)`}
            />
          ))}
        </g>
      </g>
      <text x="470" y="220" fontSize="12" fill="var(--ink)">
        High-temp chiller
      </text>
      <text x="470" y="234" fontSize="11" fill={chiller ? "var(--hot)" : "var(--muted)"}>
        {chiller ? "running · LCWT to 55 °C" : "bypassed"}
      </text>
      <text x="390" y="358" fontSize="11" fill="var(--muted)">
        evaporator above · condenser below
      </text>

      {/* Dry coolers */}
      <rect x="740" y="180" width="220" height="140" fill="var(--bg)" stroke="var(--ink)" />
      <rect x="750" y="250" width="200" height="50" fill="url(#pl-fins)" stroke="var(--ink)" strokeWidth="0.75" />
      <FanTop cx={790} cy={214} />
      <FanTop cx={850} cy={214} />
      <FanTop cx={910} cy={214} />
      <line x1="745" x2="955" y1="168" y2="168" stroke={adiabatic ? "var(--muted)" : "var(--ink)"} strokeWidth="2" />
      {[770, 810, 850, 890, 930].map((x) => (
        <path key={x} d={`M${x - 3} 170 L${x + 3} 170 L${x} 176 Z`} fill="var(--ink)" />
      ))}
      {adiabatic &&
        mist.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="var(--muted)"
            className="drift-dot"
            style={
              {
                "--dx": `${d.jitter * 6}px`,
                "--dy": "70px",
                "--dur": "1.5s",
                "--delay": `${-d.delay * 1.5}s`,
                "--o": 0.8,
              } as React.CSSProperties
            }
          />
        ))}
      <text x="740" y="340" fontSize="12" fill="var(--ink)">
        Dry coolers
      </text>
      <text x="740" y="354" fontSize="11" fill="var(--muted)">
        {adiabatic ? "adiabatic assist on" : "dry"}
      </text>

      {/* Community water and its gate */}
      <rect x="820" y="30" width="80" height="60" fill="var(--bg)" stroke="var(--ink)" />
      <line x1="820" x2="900" y1="52" y2="52" stroke="var(--line)" />
      <Valve x={860} y={128} vertical closed={adiabaticLockedOut} />
      <text x="912" y="48" fontSize="12" fill="var(--ink)">
        Community
      </text>
      <text x="912" y="62" fontSize="12" fill="var(--ink)">
        water
      </text>
      <text x="876" y="132" fontSize="11" fill={adiabaticLockedOut ? "var(--hot)" : "var(--muted)"}>
        {adiabaticLockedOut ? "gate closed" : adiabatic ? "gate open" : "not needed"}
      </text>

      {/* Legend */}
      <Legend x={40} y={446} color={hue.warm}>
        Warm water
      </Legend>
      <Legend x={200} y={446} color={hue.cool}>
        30 °C supply
      </Legend>
      <Legend x={360} y={446} color={hue.hot}>
        Condenser water, up to 55 °C
      </Legend>
      <Legend x={620} y={446} color={hue.water} dotted>
        Community water
      </Legend>
    </svg>
  );
}
