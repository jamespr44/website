"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { flowStripes, softDot } from "./textures";
import { useStage } from "./stage";

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ materials */

/**
 * Additive glow that leaves the canvas alpha untouched. Plain AdditiveBlending also adds alpha, which on a
 * transparent canvas hides the page behind and makes glows look like dark smoke.
 */
export const glowBlend = {
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.SrcAlphaFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.ZeroFactor,
  blendDstAlpha: THREE.OneFactor,
} as const;

export const paint = (color: string, rough = 0.45, metal = 0.35) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

/* ------------------------------------------------------------------ pipes */

/** Orthogonal pipe run through `points`, with rounded elbows of radius `bend`. */
function pipeCurve(points: Vec3[], bend: number) {
  const pts = points.map((p) => new THREE.Vector3(...p));
  const path = new THREE.CurvePath<THREE.Vector3>();
  let cursor = pts[0].clone();
  for (let i = 1; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[i + 1];
    if (!next) {
      path.add(new THREE.LineCurve3(cursor, cur));
      break;
    }
    const inDir = cur
      .clone()
      .sub(pts[i - 1])
      .normalize();
    const outDir = next.clone().sub(cur).normalize();
    const r = Math.min(bend, cur.distanceTo(pts[i - 1]) / 2, next.distanceTo(cur) / 2);
    const a = cur.clone().addScaledVector(inDir, -r);
    const b = cur.clone().addScaledVector(outDir, r);
    path.add(new THREE.LineCurve3(cursor, a));
    path.add(new THREE.QuadraticBezierCurve3(a, cur, b));
    cursor = b;
  }
  return path;
}

type PipeProps = {
  points: Vec3[];
  radius?: number;
  color?: string;
  /** Colour of the moving flow bands; the pipe is static and dimmed when inactive. */
  flow?: string;
  active?: boolean;
  speed?: number;
  insulated?: boolean;
};

export function Pipe({
  points,
  radius = 0.12,
  color = "#8e99a4",
  flow = "#38bdf8",
  active = true,
  speed = 0.8,
  insulated = false,
}: PipeProps) {
  const reduced = useReducedMotionSafe();
  const stage = useStage();
  const key = JSON.stringify(points);
  const { geo, flowGeo, length } = useMemo(() => {
    const curve = pipeCurve(points, radius * 3);
    const segs = Math.max(24, Math.round(curve.getLength() * 16));
    return {
      geo: new THREE.TubeGeometry(curve as unknown as THREE.Curve<THREE.Vector3>, segs, radius, 20, false),
      flowGeo: new THREE.TubeGeometry(curve as unknown as THREE.Curve<THREE.Vector3>, segs, radius * 1.04, 20, false),
      length: curve.getLength(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the serialised points
  }, [key, radius]);

  const stripeMat = useMemo(() => {
    const map = flowStripes().clone();
    map.needsUpdate = true;
    map.repeat.set(length / 0.9, 1);
    // On a white stage additive light vanishes, so the bands are painted instead.
    return new THREE.MeshBasicMaterial({
      map,
      color: flow,
      transparent: true,
      opacity: stage === "light" ? 1 : 0.9,
      ...(stage === "light" ? { blending: THREE.NormalBlending } : glowBlend),
      depthWrite: false,
    });
  }, [length, flow, stage]);

  useFrame((_, dt) => {
    // Bands are 0.9 m apart, so this moves them at `speed` m/s from the first point towards the last.
    if (active && !reduced) stripeMat.map!.offset.x -= (dt * speed) / 0.9;
  });

  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial
          color={insulated ? (stage === "light" ? "#f4f4f4" : "#d9dde2") : color}
          roughness={insulated ? 0.8 : 0.35}
          metalness={insulated ? 0 : 0.7}
          emissive={active ? flow : "#000"}
          emissiveIntensity={active && stage === "dark" ? 0.12 : 0}
        />
      </mesh>
      {active && <mesh geometry={flowGeo} material={stripeMat} />}
      {/* flanges at the ends */}
      {[points[0], points[points.length - 1]].map((p, i) => (
        <mesh key={i} position={p} rotation={endRotation(points, i === 0)}>
          <cylinderGeometry args={[radius * 1.45, radius * 1.45, radius * 0.5, 24]} />
          <meshStandardMaterial color="#5d6772" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function endRotation(points: Vec3[], start: boolean): [number, number, number] {
  const [a, b] = start ? [points[0], points[1]] : [points[points.length - 1], points[points.length - 2]];
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  const e = new THREE.Euler().setFromQuaternion(q);
  return [e.x, e.y, e.z];
}

/* ------------------------------------------------------------------ fans */

type FanProps = { radius?: number; speed?: number; position?: Vec3; stack?: number };

/** Axial fan in a shroud, with a wire guard, viewed from above. */
export function Fan({ radius = 0.8, speed = 6, position = [0, 0, 0], stack = 0.35 }: FanProps) {
  const rotor = useRef<THREE.Group>(null);
  const reduced = useReducedMotionSafe();
  useFrame((_, dt) => {
    if (rotor.current && !reduced) rotor.current.rotation.y -= dt * speed;
  });
  const blades = 6;
  return (
    <group position={position}>
      {/* shroud */}
      <mesh position-y={stack / 2} castShadow>
        <cylinderGeometry args={[radius * 1.06, radius * 1.1, stack, 48, 1, true]} />
        <meshStandardMaterial color="#39424d" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={stack} rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius * 1.06, 0.03, 8, 48]} />
        <meshStandardMaterial color="#6f7a86" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* rotor */}
      <group ref={rotor} position-y={stack * 0.55}>
        <mesh>
          <cylinderGeometry args={[radius * 0.16, radius * 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#20262d" metalness={0.5} roughness={0.5} />
        </mesh>
        {Array.from({ length: blades }, (_, i) => (
          <group key={i} rotation-y={(i / blades) * Math.PI * 2}>
            <mesh position-x={radius * 0.55} rotation-x={0.35}>
              <boxGeometry args={[radius * 0.8, 0.015, radius * 0.22]} />
              <meshStandardMaterial color="#2a3139" metalness={0.3} roughness={0.55} />
            </mesh>
          </group>
        ))}
      </group>
      {/* guard rings and spokes */}
      {[0.35, 0.65, 0.95].map((f) => (
        <mesh key={f} position-y={stack + 0.02} rotation-x={Math.PI / 2}>
          <torusGeometry args={[radius * f, 0.008, 6, 48]} />
          <meshStandardMaterial color="#9aa4ae" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position-y={stack + 0.02} rotation-y={(i * Math.PI) / 4}>
          <boxGeometry args={[radius * 2, 0.01, 0.012]} />
          <meshStandardMaterial color="#9aa4ae" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ particles */

export type Emitter = {
  /** Spawn box centre and half-extents. */
  origin: Vec3;
  extent: Vec3;
  velocity: Vec3;
  /** Random velocity added per particle, per axis. */
  jitter: Vec3;
  life: number;
  gravity?: number;
  /** Horizontal drag (0 = none), lets plumes slow and spread. */
  drag?: number;
};

type ParticleProps = {
  emitter: Emitter;
  count: number;
  /** 0 → 1: fraction of particles that are alive. */
  rate?: number;
  size?: number;
  color?: string;
  /** Optional colour at end of life (e.g. hot air cooling). */
  colorEnd?: string;
  opacity?: number;
  /** Additive glow; defaults to true on a dark stage and false on a light one. */
  additive?: boolean;
};

/** Lightweight CPU particle system on a single Points draw call. */
export function Particles({
  emitter,
  count,
  rate = 1,
  size = 0.3,
  color = "#ffffff",
  colorEnd,
  opacity = 1,
  additive,
}: ParticleProps) {
  const reduced = useReducedMotionSafe();
  const stage = useStage();
  const glow = additive ?? stage === "dark";
  const state = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 4); // RGBA: alpha carries the fade
    const vel = new Float32Array(count * 3);
    const age = new Float32Array(count);
    for (let i = 0; i < count; i++) age[i] = -Math.random() * emitter.life; // staggered starts
    return { pos, col, vel, age };
  }, [count, emitter.life]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(state.pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(state.col, 4));
    return g;
  }, [state]);

  const c0 = useMemo(() => new THREE.Color(color), [color]);
  const c1 = useMemo(() => new THREE.Color(colorEnd ?? color), [color, colorEnd]);
  const tmp = useMemo(() => new THREE.Color(), []);

  const spawn = (i: number) => {
    const { origin: o, extent: e, velocity: v, jitter: j } = emitter;
    const k = i * 3;
    state.pos[k] = o[0] + (Math.random() * 2 - 1) * e[0];
    state.pos[k + 1] = o[1] + (Math.random() * 2 - 1) * e[1];
    state.pos[k + 2] = o[2] + (Math.random() * 2 - 1) * e[2];
    state.vel[k] = v[0] + (Math.random() * 2 - 1) * j[0];
    state.vel[k + 1] = v[1] + (Math.random() * 2 - 1) * j[1];
    state.vel[k + 2] = v[2] + (Math.random() * 2 - 1) * j[2];
  };

  useFrame((_, rawDt) => {
    const dt = reduced ? 0 : Math.min(rawDt, 0.05);
    const alive = Math.round(count * rate);
    const { life, gravity = 0, drag = 0 } = emitter;
    for (let i = 0; i < count; i++) {
      const k = i * 3;
      const before = state.age[i];
      state.age[i] += dt;
      if (before < 0 && state.age[i] >= 0) spawn(i); // staggered first launch
      if (state.age[i] >= life || (reduced && state.age[i] < 0)) {
        state.age[i] = reduced ? Math.random() * life : 0;
        spawn(i);
        if (reduced) {
          state.pos[k] += state.vel[k] * state.age[i];
          state.pos[k + 1] += state.vel[k + 1] * state.age[i];
          state.pos[k + 2] += state.vel[k + 2] * state.age[i];
        }
      }
      const t = state.age[i] / life;
      const a = i * 4;
      if (i >= alive || state.age[i] < 0) {
        state.col[a + 3] = 0;
        continue;
      }
      state.vel[k + 1] -= gravity * dt;
      state.vel[k] *= 1 - drag * dt;
      state.vel[k + 2] *= 1 - drag * dt;
      state.pos[k] += state.vel[k] * dt;
      state.pos[k + 1] += state.vel[k + 1] * dt;
      state.pos[k + 2] += state.vel[k + 2] * dt;
      tmp.copy(c0).lerp(c1, t);
      state.col[a] = tmp.r;
      state.col[a + 1] = tmp.g;
      state.col[a + 2] = tmp.b;
      state.col[a + 3] = Math.sin(Math.PI * t) * opacity;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  });

  return (
    <points geometry={geo} frustumCulled={false} renderOrder={10}>
      <pointsMaterial
        map={softDot()}
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        {...(glow ? glowBlend : { blending: THREE.NormalBlending })}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ small bits */

/** Simple handrail around a rectangle at height y. */
export function Handrail({ w, d, y, h = 0.9 }: { w: number; d: number; y: number; h?: number }) {
  const mat = useMemo(() => paint("#e0b43c", 0.5, 0.4), []);
  const posts: Vec3[] = [];
  const nx = Math.max(2, Math.round(w / 1.2));
  const nz = Math.max(2, Math.round(d / 1.2));
  for (let i = 0; i <= nx; i++) {
    const x = -w / 2 + (i * w) / nx;
    posts.push([x, 0, -d / 2], [x, 0, d / 2]);
  }
  for (let i = 1; i < nz; i++) {
    const z = -d / 2 + (i * d) / nz;
    posts.push([-w / 2, 0, z], [w / 2, 0, z]);
  }
  return (
    <group position-y={y}>
      {posts.map((p, i) => (
        <mesh key={i} position={[p[0], h / 2, p[2]]} material={mat}>
          <cylinderGeometry args={[0.025, 0.025, h, 8]} />
        </mesh>
      ))}
      {[h, h / 2].map((yy) => (
        <group key={yy} position-y={yy}>
          <mesh position-z={-d / 2} rotation-z={Math.PI / 2} material={mat}>
            <cylinderGeometry args={[0.025, 0.025, w, 8]} />
          </mesh>
          <mesh position-z={d / 2} rotation-z={Math.PI / 2} material={mat}>
            <cylinderGeometry args={[0.025, 0.025, w, 8]} />
          </mesh>
          <mesh position-x={-w / 2} rotation-x={Math.PI / 2} material={mat}>
            <cylinderGeometry args={[0.025, 0.025, d, 8]} />
          </mesh>
          <mesh position-x={w / 2} rotation-x={Math.PI / 2} material={mat}>
            <cylinderGeometry args={[0.025, 0.025, d, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
