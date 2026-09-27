"use client";

import { useMemo } from "react";
import * as THREE from "three";
import Scene from "./Scene";
import { Fan, Particles, Pipe } from "./parts";
import { brushedTexture, finTexture } from "./textures";

type Vec3 = [number, number, number];

const W = 2.3;
const H = 2.35;
const LEG = 0.6;
const TILT = Math.atan2(0.8, 1.6);
const PANEL_H = Math.hypot(0.8, 1.6);

type ModelProps = {
  length?: number;
  fans?: number;
  spray?: boolean;
  fanSpeed?: number;
  /** Show the hot-water feed and return at the end of the unit. */
  connections?: boolean;
  position?: Vec3;
};

/** V-bank adiabatic dry cooler: two finned coils in a V, fans on top, spray headers outside each coil. */
export function DryCoolerModel({
  length = 6,
  fans = 3,
  spray = false,
  fanSpeed = 6,
  connections = true,
  position = [0, 0, 0],
}: ModelProps) {
  const mats = useMemo(() => {
    const fin = finTexture().clone();
    fin.repeat.set(length * 1.5, 1);
    fin.needsUpdate = true;
    const brushed = brushedTexture();
    return {
      coil: new THREE.MeshStandardMaterial({ map: fin, roughness: 0.5, metalness: 0.3, color: "#e6edf2" }),
      frame: new THREE.MeshStandardMaterial({ map: brushed, color: "#b3bcc5", roughness: 0.45, metalness: 0.8 }),
      panel: new THREE.MeshStandardMaterial({ color: "#dfe3e6", roughness: 0.5, metalness: 0.3 }),
      dark: new THREE.MeshStandardMaterial({ color: "#1b222a", roughness: 0.8 }),
      nozzle: new THREE.MeshStandardMaterial({ color: "#1f2a36", roughness: 0.4, metalness: 0.6 }),
    };
  }, [length]);

  const fanXs = Array.from({ length: fans }, (_, i) => -length / 2 + (length / fans) * (i + 0.5));
  const nozzleXs = Array.from({ length: Math.round(length / 0.6) }, (_, i) => -length / 2 + 0.3 + i * 0.6);

  return (
    <group position={position}>
      {/* legs and base rails */}
      {[-length / 2 + 0.1, 0, length / 2 - 0.1].flatMap((x) =>
        [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x, LEG / 2, (s * (W - 0.1)) / 2]} material={mats.frame} castShadow>
            <boxGeometry args={[0.1, LEG, 0.1]} />
          </mesh>
        )),
      )}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, LEG, (s * (W - 0.1)) / 2]} material={mats.frame} castShadow>
          <boxGeometry args={[length, 0.12, 0.1]} />
        </mesh>
      ))}

      {/* V-bank coils */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[0, LEG + 0.1 + 0.8, s * 0.65]}
          rotation-x={s * TILT}
          material={mats.coil}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[length - 0.2, PANEL_H, 0.12]} />
        </mesh>
      ))}
      {/* drain tray at the bottom of the V, dark plenum inside */}
      <mesh position={[0, LEG + 0.12, 0]} material={mats.frame}>
        <boxGeometry args={[length - 0.1, 0.1, 0.7]} />
      </mesh>
      <mesh position={[0, LEG + 0.95, 0]} material={mats.dark}>
        <boxGeometry args={[length - 0.3, 1.5, 0.3]} />
      </mesh>
      {/* end panels */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * length) / 2, LEG + 0.9, 0]} material={mats.panel} castShadow>
          <boxGeometry args={[0.06, 1.75, W]} />
        </mesh>
      ))}
      {/* fan deck */}
      <mesh position={[0, H + 0.03, 0]} material={mats.panel} castShadow receiveShadow>
        <boxGeometry args={[length + 0.06, 0.08, W + 0.06]} />
      </mesh>
      {fanXs.map((x) => (
        <Fan key={x} position={[x, H + 0.07, 0]} radius={0.82} stack={0.32} speed={fanSpeed} />
      ))}

      {/* adiabatic spray headers and nozzles */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Pipe
            points={[
              [-length / 2 - 0.2, H - 0.25, s * 1.35],
              [length / 2 - 0.15, H - 0.25, s * 1.35],
            ]}
            radius={0.05}
            color="#3c4a58"
            flow="#5f6b75"
            active={spray}
            speed={1.2}
          />
          {nozzleXs.map((x) => (
            <mesh key={x} position={[x, H - 0.34, s * 1.33]} rotation-x={s * 0.6} material={mats.nozzle}>
              <cylinderGeometry args={[0.025, 0.035, 0.12, 8]} />
            </mesh>
          ))}
          <Particles
            emitter={{
              origin: [0, H - 0.45, s * 1.28],
              extent: [length / 2 - 0.3, 0.05, 0.04],
              velocity: [0, -0.55, -s * 0.55],
              jitter: [0.12, 0.3, 0.18],
              life: 1.5,
            }}
            count={Math.round(length * 70)}
            rate={spray ? 1 : 0}
            size={0.42}
            color="#7b8a96"
            opacity={0.22}
          />
        </group>
      ))}

      {/* process connections */}
      {connections && (
        <>
          <Pipe
            points={[
              [-length / 2 - 1.8, 0.3, 0.45],
              [-length / 2 - 0.4, 0.3, 0.45],
              [-length / 2 - 0.4, 1.9, 0.45],
              [-length / 2 - 0.03, 1.9, 0.45],
            ]}
            radius={0.1}
            flow="#e08a00"
          />
          <Pipe
            points={[
              [-length / 2 - 0.03, 0.95, -0.45],
              [-length / 2 - 0.7, 0.95, -0.45],
              [-length / 2 - 0.7, 0.3, -0.45],
              [-length / 2 - 1.8, 0.3, -0.45],
            ]}
            radius={0.1}
            flow="#4f9a5c"
          />
        </>
      )}
    </group>
  );
}

/** Air drawn in through the coils; it turns from hot to cool as it passes through the mist. */
function Airflow({ spray }: { spray: boolean }) {
  return (
    <>
      {[-1, 1].map((s) => (
        <Particles
          key={s}
          emitter={{
            origin: [0, 1.5, s * 3.4],
            extent: [2.6, 0.6, 0.4],
            velocity: [0, 0.05, -s * 1.7],
            jitter: [0.05, 0.08, 0.2],
            life: 1.35,
          }}
          count={160}
          size={0.2}
          color="#e08a00"
          colorEnd={spray ? "#4f9a5c" : "#e08a00"}
          opacity={0.9}
        />
      ))}
      <Particles
        emitter={{
          origin: [0, H + 0.6, 0],
          extent: [2.4, 0.1, 0.6],
          velocity: [0, 1.6, 0],
          jitter: [0.15, 0.3, 0.15],
          life: 1.6,
        }}
        count={90}
        size={0.22}
        color={spray ? "#9a9a9a" : "#e08a00"}
        opacity={0.35}
      />
    </>
  );
}

export default function DryCooler3D({ spray }: { spray: boolean }) {
  return (
    <Scene
      label={`3D model of a V-bank dry cooler with adiabatic spray ${spray ? "on: mist pre-cools the incoming air" : "off: hot air enters the coils directly"}.`}
      camera={{ position: [7.6, 4.4, 8.6], fov: 34 }}
      target={[0, 1.3, 0]}
      ground={9}
      className="aspect-[4/3] w-full md:aspect-[16/9]"
    >
      <DryCoolerModel spray={spray} />
      <Airflow spray={spray} />
    </Scene>
  );
}
