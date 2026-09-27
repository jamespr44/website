"use client";

import { useMemo } from "react";
import * as THREE from "three";
import Scene from "./Scene";
import { Fan, Handrail, Particles, Pipe, type Emitter } from "./parts";
import { concreteTexture, corrugatedTexture, louvreTexture } from "./textures";

const CELL_W = 3;
const DEPTH = 3.4;
const BASIN_H = 0.7;
const LOUVRE_TOP = 1.9;
const DECK = 3.4;
const CELLS = [-CELL_W / 2, CELL_W / 2];

/** Two-cell induced-draft cooling tower, the kind found beside data centres. */
function Tower({ intensity }: { intensity: number }) {
  const mats = useMemo(() => {
    const bump = corrugatedTexture().clone();
    bump.repeat.set(10, 1);
    bump.needsUpdate = true;
    const louvre = louvreTexture().clone();
    louvre.repeat.set(1, 6);
    louvre.needsUpdate = true;
    const conc = concreteTexture().clone();
    conc.repeat.set(1.5, 0.4);
    conc.needsUpdate = true;
    return {
      casing: new THREE.MeshStandardMaterial({
        color: "#c9cdc8",
        roughness: 0.6,
        metalness: 0.15,
        bumpMap: bump,
        bumpScale: 2.5,
      }),
      louvre: new THREE.MeshStandardMaterial({ map: louvre, roughness: 0.7, metalness: 0.3 }),
      basin: new THREE.MeshStandardMaterial({ map: conc, color: "#a4a9ae", roughness: 0.9 }),
      deck: new THREE.MeshStandardMaterial({ color: "#6d7680", roughness: 0.5, metalness: 0.6 }),
      water: new THREE.MeshStandardMaterial({
        color: "#0e4f6b",
        roughness: 0.08,
        metalness: 0.2,
        emissive: "#0b3a52",
        emissiveIntensity: 0.4,
      }),
    };
  }, []);

  const fanSpeed = 3 + intensity * 7;
  const totalW = CELL_W * 2;

  const plume = (x: number): Emitter => ({
    origin: [x, DECK + 1.15, 0],
    extent: [0.7, 0.1, 0.7],
    velocity: [0.25, 1.2 + intensity * 0.8, 0],
    jitter: [0.55, 0.35, 0.55],
    life: 5,
    drag: 0.25,
  });

  return (
    <group>
      {/* basin */}
      <mesh position={[0, BASIN_H / 2, 0]} material={mats.basin} castShadow receiveShadow>
        <boxGeometry args={[totalW + 0.3, BASIN_H, DEPTH + 0.3]} />
      </mesh>
      <mesh position={[0, BASIN_H + 0.005, DEPTH / 2 + 0.08]} rotation-x={-Math.PI / 2} material={mats.water}>
        <planeGeometry args={[totalW, 0.12]} />
      </mesh>

      {CELLS.map((x) => (
        <group key={x} position-x={x}>
          {/* upper casing */}
          <mesh position={[0, (LOUVRE_TOP + DECK) / 2, 0]} material={mats.casing} castShadow receiveShadow>
            <boxGeometry args={[CELL_W - 0.04, DECK - LOUVRE_TOP, DEPTH]} />
          </mesh>
          {/* louvred air inlets front and back */}
          {[1, -1].map((side) => (
            <mesh
              key={side}
              position={[0, (BASIN_H + LOUVRE_TOP) / 2, (side * DEPTH) / 2]}
              rotation-y={side === 1 ? 0 : Math.PI}
              material={mats.louvre}
              receiveShadow
            >
              <planeGeometry args={[CELL_W - 0.1, LOUVRE_TOP - BASIN_H]} />
            </mesh>
          ))}
          {/* corner posts */}
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <mesh
                key={`${sx}${sz}`}
                position={[(sx * (CELL_W - 0.1)) / 2, (BASIN_H + LOUVRE_TOP) / 2, (sz * DEPTH) / 2]}
                material={mats.deck}
              >
                <boxGeometry args={[0.1, LOUVRE_TOP - BASIN_H, 0.1]} />
              </mesh>
            )),
          )}
          <Fan position={[0, DECK, 0]} radius={1.1} stack={1.1} speed={fanSpeed} />
          <Particles
            emitter={plume(x)}
            count={260}
            rate={0.25 + intensity * 0.75}
            size={2.6}
            color="#8a939b"
            opacity={0.13}
          />
        </group>
      ))}

      {/* inner louvre sides (dark interior) */}
      <mesh position={[0, (BASIN_H + LOUVRE_TOP) / 2, 0]}>
        <boxGeometry args={[totalW - 0.2, LOUVRE_TOP - BASIN_H - 0.02, DEPTH - 0.1]} />
        <meshStandardMaterial color="#0d1218" roughness={1} />
      </mesh>

      {/* deck, rail and ladder */}
      <mesh position={[0, DECK + 0.03, 0]} material={mats.deck} castShadow receiveShadow>
        <boxGeometry args={[totalW + 0.2, 0.06, DEPTH + 0.2]} />
      </mesh>
      <Handrail w={totalW + 0.1} d={DEPTH + 0.1} y={DECK + 0.06} />
      <group position={[-totalW / 2 - 0.25, 0, 0.6]}>
        {[-0.22, 0.22].map((z) => (
          <mesh key={z} position={[0, DECK / 2 + 0.5, z]} material={mats.deck}>
            <boxGeometry args={[0.05, DECK + 1, 0.05]} />
          </mesh>
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <mesh key={i} position={[0, 0.4 + i * 0.3, 0]} rotation-x={Math.PI / 2} material={mats.deck}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 6]} />
          </mesh>
        ))}
      </group>

      {/* hot water in (from the plant) and cooled water out */}
      <Pipe
        points={[
          [totalW / 2 + 2.2, 0.35, 1.0],
          [totalW / 2 + 0.6, 0.35, 1.0],
          [totalW / 2 + 0.6, DECK - 0.4, 1.0],
          [totalW / 2 - 0.01, DECK - 0.4, 1.0],
        ]}
        radius={0.16}
        flow="#e08a00"
        speed={0.6 + intensity}
      />
      <Pipe
        points={[
          [totalW / 2 + 0.14, 0.35, -1.0],
          [totalW / 2 + 2.2, 0.35, -1.0],
        ]}
        radius={0.16}
        flow="#4f9a5c"
        speed={0.6 + intensity}
      />
    </group>
  );
}

export default function CoolingTower3D({ intensity }: { intensity: number }) {
  return (
    <Scene
      label="3D model of a two-cell induced-draft cooling tower. Warm water enters at the top, fans draw air through louvres, and a plume of evaporated water rises from the fan stacks."
      camera={{ position: [9.5, 6, 11], fov: 36 }}
      target={[0.4, 2.8, 0]}
      ground={11}
      className="aspect-[4/5] w-full md:aspect-square"
    >
      <Tower intensity={intensity} />
    </Scene>
  );
}
