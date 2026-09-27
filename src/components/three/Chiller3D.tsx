"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Scene from "./Scene";
import { glowBlend, Pipe } from "./parts";
import { brushedTexture, softDot } from "./textures";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

type Vec3 = [number, number, number];

/* Layout (metres, unit centred on the origin, long axis on x) */
const SHELL_L = 3.6;
const EVAP = { y: 0.9, z: 0.55, r: 0.55 };
const COND = { y: 0.85, z: -0.62, r: 0.5 };
const COMP_Y = 1.95;
const VALVE: Vec3 = [1.55, 0.25, 0];

/** Water nozzle ends on the −x waterboxes, for connecting pipes. */
export const nozzles = {
  evapIn: [-2.3, EVAP.y + 0.22, EVAP.z] as Vec3,
  evapOut: [-2.3, EVAP.y - 0.22, EVAP.z] as Vec3,
  condOut: [-2.3, COND.y + 0.2, COND.z] as Vec3,
  condIn: [-2.3, COND.y - 0.2, COND.z] as Vec3,
};

export type ChillerPart = "evaporator" | "compressor" | "condenser" | "valve";

const HIGHLIGHT: Record<ChillerPart, string> = {
  evaporator: "#38bdf8",
  compressor: "#f43f5e",
  condenser: "#f59e0b",
  valve: "#a78bfa",
};

function useGlow(part: ChillerPart, highlight: ChillerPart | null | undefined, mat: THREE.MeshStandardMaterial) {
  const reduced = useReducedMotionSafe();
  useFrame((_, dt) => {
    const on = highlight === part;
    const target = on ? 0.18 : 0;
    mat.emissive.set(HIGHLIGHT[part]);
    mat.emissiveIntensity = reduced ? target : THREE.MathUtils.damp(mat.emissiveIntensity, target, 5, dt);
  });
}

type ModelProps = {
  running?: boolean;
  /** See-through shells with refrigerant flow inside. */
  xray?: boolean;
  highlight?: ChillerPart | null;
  position?: Vec3;
  scale?: number;
};

/** Two-stage centrifugal chiller: evaporator and condenser shells side by side, compressor and motor on top. */
export function ChillerModel({
  running = true,
  xray = false,
  highlight = null,
  position = [0, 0, 0],
  scale = 1,
}: ModelProps) {
  const mats = useMemo(() => {
    const shell = (color: string) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.38,
        metalness: 0.45,
        transparent: xray,
        opacity: xray ? 0.3 : 1,
        depthWrite: !xray,
      });
    return {
      evap: shell("#c6ccd3"),
      cond: shell("#c6ccd3"),
      comp: new THREE.MeshStandardMaterial({ color: "#44505e", roughness: 0.35, metalness: 0.7 }),
      motor: new THREE.MeshStandardMaterial({
        map: brushedTexture(),
        color: "#8c96a1",
        roughness: 0.3,
        metalness: 0.85,
      }),
      waterbox: new THREE.MeshStandardMaterial({ color: "#2c3e57", roughness: 0.45, metalness: 0.5 }),
      skid: new THREE.MeshStandardMaterial({ color: "#2a3038", roughness: 0.6, metalness: 0.5 }),
      valve: new THREE.MeshStandardMaterial({ color: "#8f98a3", roughness: 0.35, metalness: 0.8 }),
      wheel: new THREE.MeshStandardMaterial({ color: "#c0392b", roughness: 0.5, metalness: 0.3 }),
      panel: new THREE.MeshStandardMaterial({ color: "#d9dde1", roughness: 0.5, metalness: 0.2 }),
      screen: new THREE.MeshStandardMaterial({
        color: "#0b1622",
        emissive: running ? "#38bdf8" : "#0b1622",
        emissiveIntensity: 0.7,
      }),
    };
  }, [xray, running]);

  useGlow("evaporator", highlight, mats.evap);
  useGlow("condenser", highlight, mats.cond);
  useGlow("compressor", highlight, mats.comp);
  useGlow("valve", highlight, mats.valve);

  const shell = (s: { y: number; z: number; r: number }, mat: THREE.Material) => (
    <group>
      <mesh position={[0, s.y, s.z]} rotation-z={Math.PI / 2} material={mat} castShadow={!xray} receiveShadow>
        <cylinderGeometry args={[s.r, s.r, SHELL_L, 48, 1]} />
      </mesh>
      {[-1, 1].map((e) => (
        <group key={e} position={[(e * SHELL_L) / 2, s.y, s.z]}>
          {/* tube-sheet flange, waterbox and dished head */}
          <mesh rotation-z={Math.PI / 2} material={mats.waterbox}>
            <torusGeometry args={[s.r + 0.05, 0.04, 10, 48]} />
          </mesh>
          <mesh position-x={e * 0.14} rotation-z={Math.PI / 2} material={mats.waterbox} castShadow>
            <cylinderGeometry args={[s.r + 0.03, s.r + 0.03, 0.28, 48]} />
          </mesh>
          <mesh position-x={e * 0.28} scale={[0.32, 1, 1]} material={mats.waterbox} castShadow>
            <sphereGeometry args={[s.r + 0.03, 32, 16, e > 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI]} />
          </mesh>
        </group>
      ))}
      {/* saddles */}
      {[-1.3, 1.3].map((x) => (
        <mesh key={x} position={[x, (s.y - s.r) / 2 + 0.1, s.z]} material={mats.skid}>
          <boxGeometry args={[0.18, s.y - s.r + 0.05, s.r * 1.4]} />
        </mesh>
      ))}
    </group>
  );

  const nozzle = (p: Vec3) => (
    <group position={[p[0] + 0.15, p[1], p[2]]}>
      <mesh rotation-z={Math.PI / 2} material={mats.waterbox}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 24]} />
      </mesh>
      <mesh position-x={-0.15} rotation-z={Math.PI / 2} material={mats.valve}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
      </mesh>
    </group>
  );

  return (
    <group position={position} scale={scale}>
      {/* skid */}
      {[-0.95, 0.95].map((z) => (
        <mesh key={z} position={[0, 0.08, z]} material={mats.skid} castShadow receiveShadow>
          <boxGeometry args={[SHELL_L + 0.6, 0.16, 0.18]} />
        </mesh>
      ))}

      {shell(EVAP, mats.evap)}
      {shell(COND, mats.cond)}
      {Object.values(nozzles).map((p, i) => (
        <group key={i}>{nozzle(p)}</group>
      ))}

      {/* compressor: two impeller stages, then the motor */}
      <group position-y={COMP_Y}>
        {[
          { x: -0.9, r: 0.5, l: 0.42 },
          { x: -0.4, r: 0.45, l: 0.38 },
        ].map((st) => (
          <group key={st.x} position-x={st.x}>
            <mesh rotation-z={Math.PI / 2} material={mats.comp} castShadow>
              <cylinderGeometry args={[st.r, st.r, st.l, 40]} />
            </mesh>
            <mesh rotation-y={Math.PI / 2} material={mats.comp} castShadow>
              <torusGeometry args={[st.r - 0.02, 0.1, 16, 48]} />
            </mesh>
          </group>
        ))}
        <mesh position-x={0.35} rotation-z={Math.PI / 2} material={mats.motor} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 1.1, 40]} />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position-x={-0.1 + i * 0.11} rotation-z={Math.PI / 2} material={mats.comp}>
            <cylinderGeometry args={[0.385, 0.385, 0.025, 40]} />
          </mesh>
        ))}
        <mesh position-x={0.95} rotation-z={Math.PI / 2} material={mats.comp}>
          <cylinderGeometry args={[0.3, 0.36, 0.12, 40]} />
        </mesh>
        {/* compressor supports down to the shells */}
        {[-0.65, 0.5].map((x) => (
          <mesh key={x} position={[x, -0.32, 0]} material={mats.skid}>
            <boxGeometry args={[0.14, 0.35, 0.5]} />
          </mesh>
        ))}
      </group>

      {/* suction (evaporator → compressor eye) and discharge (compressor → condenser) */}
      <Pipe
        points={[
          [-1.5, EVAP.y + EVAP.r - 0.04, EVAP.z],
          [-1.5, COMP_Y, EVAP.z],
          [-1.5, COMP_Y, 0],
          [-1.1, COMP_Y, 0],
        ]}
        radius={0.19}
        color="#4d5a68"
        active={false}
      />
      <Pipe
        points={[
          [-0.4, 2.2, -0.3],
          [-0.4, 2.2, COND.z],
          [-0.4, COND.y + COND.r - 0.04, COND.z],
        ]}
        radius={0.16}
        color="#4d5a68"
        active={false}
      />
      {/* liquid line with expansion valve */}
      <Pipe
        points={[
          [1.55, COND.y - COND.r + 0.04, COND.z],
          [1.55, VALVE[1], COND.z],
          [1.55, VALVE[1], EVAP.z],
          [1.55, EVAP.y - EVAP.r + 0.04, EVAP.z],
        ]}
        radius={0.06}
        color="#6b7784"
        active={false}
      />
      <group position={VALVE}>
        <mesh material={mats.valve} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.26]} />
        </mesh>
        <mesh position-y={0.2} material={mats.valve}>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        </mesh>
        <mesh position-y={0.31} rotation-x={Math.PI / 2} material={mats.wheel}>
          <torusGeometry args={[0.09, 0.02, 8, 24]} />
        </mesh>
      </group>

      {/* control panel */}
      <group position={[SHELL_L / 2 + 0.62, 0.95, -0.05]} rotation-y={Math.PI / 2}>
        <mesh material={mats.panel} castShadow>
          <boxGeometry args={[0.55, 0.75, 0.16]} />
        </mesh>
        <mesh position={[0, 0.12, 0.081]} material={mats.screen}>
          <planeGeometry args={[0.36, 0.24]} />
        </mesh>
        <mesh position={[0, -0.55, -0.05]} material={mats.skid}>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
        </mesh>
      </group>

      {xray && running && <RefrigerantFlow />}
    </group>
  );
}

/* ------------------------------------------------------------------ refrigerant loop */

const LOOP: Vec3[] = [
  [1.45, EVAP.y, EVAP.z], // evaporator (boiling)
  [-1.5, EVAP.y, EVAP.z],
  [-1.5, COMP_Y, EVAP.z], // suction
  [-1.5, COMP_Y, 0],
  [-1.0, COMP_Y, 0], // compressor stages
  [-0.4, COMP_Y, 0],
  [-0.4, 2.2, -0.3],
  [-0.4, 2.2, COND.z], // discharge
  [-0.4, COND.y, COND.z],
  [1.55, COND.y, COND.z], // condenser
  [1.55, VALVE[1], COND.z], // liquid line
  [1.55, VALVE[1], 0], // expansion valve
  [1.55, VALVE[1], EVAP.z],
  [1.45, EVAP.y, EVAP.z],
];

const cold = new THREE.Color("#38bdf8");
const hot = new THREE.Color("#f43f5e");
const warm = new THREE.Color("#f59e0b");

function RefrigerantFlow() {
  const reduced = useReducedMotionSafe();
  const N = 320;
  const { curve, stops } = useMemo(() => {
    const path = new THREE.CurvePath<THREE.Vector3>();
    const lens: number[] = [0];
    for (let i = 1; i < LOOP.length; i++) {
      const seg = new THREE.LineCurve3(new THREE.Vector3(...LOOP[i - 1]), new THREE.Vector3(...LOOP[i]));
      path.add(seg);
      lens.push(lens[i - 1] + seg.getLength());
    }
    const total = lens[lens.length - 1];
    // fraction of the loop at: compressor inlet, compressor outlet, condenser end, valve
    return {
      curve: path,
      stops: { compIn: lens[4] / total, compOut: lens[6] / total, condEnd: lens[9] / total, valve: lens[11] / total },
    };
  }, []);

  const { geo, u, jitter } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return {
      geo: g,
      u: Float32Array.from({ length: N }, (_, i) => i / N),
      jitter: Float32Array.from({ length: N * 3 }, () => (Math.random() * 2 - 1) * 0.07),
    };
  }, []);

  const colourAt = (t: number, out: THREE.Color) => {
    if (t < stops.compIn) return out.copy(cold);
    if (t < stops.compOut) return out.copy(cold).lerp(hot, (t - stops.compIn) / (stops.compOut - stops.compIn));
    if (t < stops.condEnd) return out.copy(hot).lerp(warm, (t - stops.compOut) / (stops.condEnd - stops.compOut));
    if (t < stops.valve) return out.copy(warm);
    return out.copy(cold);
  };

  const p = useMemo(() => new THREE.Vector3(), []);
  const c = useMemo(() => new THREE.Color(), []);

  useFrame((_, dt) => {
    const pos = geo.attributes.position.array as Float32Array;
    const col = geo.attributes.color.array as Float32Array;
    for (let i = 0; i < N; i++) {
      if (!reduced) u[i] = (u[i] + dt * 0.07) % 1;
      curve.getPointAt(u[i], p);
      pos[i * 3] = p.x + jitter[i * 3];
      pos[i * 3 + 1] = p.y + jitter[i * 3 + 1];
      pos[i * 3 + 2] = p.z + jitter[i * 3 + 2];
      colourAt(u[i], c);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial map={softDot()} size={0.13} vertexColors transparent depthWrite={false} {...glowBlend} />
    </points>
  );
}

/* ------------------------------------------------------------------ explainer scene */

type Shot = { pos: Vec3; look: Vec3 };

export const shots: Shot[] = [
  { pos: [5.6, 3.6, 6.4], look: [0, 1.1, 0] },
  { pos: [2.4, 1.9, 4.6], look: [-0.2, 0.9, 0.5] },
  { pos: [2.4, 4.2, 4.6], look: [-0.5, 1.8, 0] },
  { pos: [2.6, 2.9, -4.9], look: [0, 0.9, -0.6] },
  { pos: [2.3, 1.1, 3.4], look: [1.5, 0.4, 0] },
];

function CameraRig({ step }: { step: number }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(...shots[0].look));
  const reduced = useReducedMotionSafe();
  useFrame((_, dt) => {
    const s = shots[step] ?? shots[0];
    const k = reduced ? 1 : 1 - Math.exp(-dt * 2.5);
    camera.position.lerp(new THREE.Vector3(...s.pos), k);
    look.current.lerp(new THREE.Vector3(...s.look), k);
    camera.lookAt(look.current);
  });
  return null;
}

function Label({ position, children, tone }: { position: Vec3; children: React.ReactNode; tone: string }) {
  return (
    <Html position={position} center zIndexRange={[10, 0]}>
      <span
        className="rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap backdrop-blur"
        style={{ borderColor: tone, color: tone, background: "rgba(5,11,20,0.7)" }}
      >
        {children}
      </span>
    </Html>
  );
}

const PARTS: (ChillerPart | null)[] = [null, "evaporator", "compressor", "condenser", "valve"];

const PART_LABELS: Record<ChillerPart, { at: Vec3; text: string }> = {
  evaporator: { at: [0.4, EVAP.y + EVAP.r + 0.2, EVAP.z + 0.3], text: "Evaporator" },
  compressor: { at: [-0.6, COMP_Y + 0.75, 0], text: "Two-stage compressor" },
  condenser: { at: [0.4, COND.y + COND.r + 0.25, COND.z - 0.3], text: "Condenser" },
  valve: { at: [VALVE[0], VALVE[1] + 0.55, VALVE[2] + 0.4], text: "Expansion valve" },
};

export default function Chiller3D({ step }: { step: number }) {
  return (
    <Scene
      label="3D model of a two-stage centrifugal chiller, with see-through shells showing refrigerant flowing from the evaporator through the compressor and condenser to the expansion valve."
      camera={{ position: shots[0].pos, fov: 38 }}
      target={shots[0].look}
      ground={7}
      orbit={false}
      className="h-full w-full"
    >
      <CameraRig step={step} />
      <ChillerModel xray highlight={PARTS[step]} />
      {PARTS[step] && (
        <Label position={PART_LABELS[PARTS[step]!].at} tone={HIGHLIGHT[PARTS[step]!]}>
          {PART_LABELS[PARTS[step]!].text}
        </Label>
      )}
      {/* water connections */}
      <Pipe
        points={[[-4.2, nozzles.evapIn[1], nozzles.evapIn[2]], nozzles.evapIn]}
        radius={0.13}
        flow="#fb923c"
        speed={0.7}
      />
      <Pipe
        points={[nozzles.evapOut, [-4.2, nozzles.evapOut[1], nozzles.evapOut[2]]]}
        radius={0.13}
        flow="#38bdf8"
        speed={0.7}
      />
      <Pipe
        points={[nozzles.condOut, [-4.2, nozzles.condOut[1], nozzles.condOut[2]]]}
        radius={0.13}
        flow="#f43f5e"
        speed={0.7}
      />
      <Pipe
        points={[[-4.2, nozzles.condIn[1], nozzles.condIn[2]], nozzles.condIn]}
        radius={0.13}
        flow="#f59e0b"
        speed={0.7}
      />
      <Label position={[-3.6, nozzles.evapOut[1] - 0.3, EVAP.z + 0.2]} tone="#38bdf8">
        TCS out · 30 °C
      </Label>
      <Label position={[-3.6, nozzles.condOut[1] + 0.35, COND.z - 0.2]} tone="#f43f5e">
        to dry coolers · ≤55 °C
      </Label>
    </Scene>
  );
}
