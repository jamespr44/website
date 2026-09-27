"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import Scene from "./Scene";
import { Pipe } from "./parts";
import { ChillerModel, nozzles } from "./Chiller3D";
import { DryCoolerModel } from "./DryCooler3D";
import type { PlantState } from "@/lib/plantModes";

type Vec3 = [number, number, number];

const CHILLER_X = -1.5;
const CHILLER_S = 0.85;
const DC_X = 5.5;
const DC_Z = 1.5;
const TANK: Vec3 = [4.6, 0, -5.2];

const world = (p: Vec3): Vec3 => [CHILLER_X + p[0] * CHILLER_S, p[1] * CHILLER_S, p[2] * CHILLER_S];
const EVAP_IN = world(nozzles.evapIn);
const EVAP_OUT = world(nozzles.evapOut);
const COND_OUT = world(nozzles.condOut);
const COND_IN = world(nozzles.condIn);

const WARM = "#fb923c";
const COOL = "#38bdf8";
const HOT = "#f43f5e";
const AMBER = "#f59e0b";

// Pipe routes (see the plant schematic for the same topology in 2D)
const R = {
  itOut: [
    [-6.9, 0.3, 0.9],
    [-4.6, 0.3, 0.9],
  ] as Vec3[],
  toEvap: [
    [-4.6, 0.3, 0.9],
    [-4.1, 0.3, 0.9],
    [-4.1, EVAP_IN[1], 0.9],
    [-4.1, EVAP_IN[1], EVAP_IN[2]],
    EVAP_IN,
  ] as Vec3[],
  bypass: [
    [-4.6, 0.3, 0.9],
    [-4.6, 0.3, 3.4],
    [1.6, 0.3, 3.4],
    [1.6, 0.3, 0.25],
    [1.6, 1.0, 0.25],
    [2.6, 1.0, 0.25],
  ] as Vec3[],
  evapToIt: [
    EVAP_OUT,
    [-3.8, EVAP_OUT[1], EVAP_OUT[2]],
    [-3.8, 1.3, EVAP_OUT[2]],
    [-3.8, 1.3, 0.3],
    [-6.9, 1.3, 0.3],
  ] as Vec3[],
  dcToIt: [
    [2.3, 0.6, 0.2],
    [1.2, 0.6, 0.2],
    [1.2, 0.6, 3.0],
    [-6.2, 0.6, 3.0],
    [-6.2, 0.6, 0.3],
    [-6.9, 0.6, 0.3],
  ] as Vec3[],
  condToDc: [
    COND_OUT,
    [-4.0, COND_OUT[1], COND_OUT[2]],
    [-4.0, 0.3, COND_OUT[2]],
    [-4.0, 0.3, -3.4],
    [1.6, 0.3, -3.4],
    [1.6, 0.3, -0.25],
    [1.6, 1.0, -0.25],
    [2.6, 1.0, -0.25],
  ] as Vec3[],
  dcToCond: [
    [2.3, 0.6, -0.2],
    [1.2, 0.6, -0.2],
    [1.2, 0.6, -3.0],
    [-4.4, 0.6, -3.0],
    [-4.4, 0.6, COND_IN[2]],
    [-4.4, COND_IN[1], COND_IN[2]],
    COND_IN,
  ] as Vec3[],
  supplyA: [
    [2.6, 1.0, 0],
    [2.6, 1.0, -2.0],
    [2.95, 1.0, -2.0],
  ] as Vec3[],
  supplyB: [
    [2.6, 1.0, 0],
    [2.6, 1.0, 2.0],
    [2.95, 1.0, 2.0],
  ] as Vec3[],
  returnA: [
    [2.95, 0.6, -1.0],
    [2.3, 0.6, -1.0],
    [2.3, 0.6, 0],
  ] as Vec3[],
  returnB: [
    [2.95, 0.6, 1.0],
    [2.3, 0.6, 1.0],
    [2.3, 0.6, 0],
  ] as Vec3[],
  water: [
    [TANK[0] - 0.92, 0.3, TANK[2]],
    [2.7, 0.3, TANK[2]],
    [2.7, 2.1, TANK[2]],
    [2.7, 2.1, 2.85],
  ] as Vec3[],
};

function Racks() {
  const mats = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: "#14181e", roughness: 0.55, metalness: 0.5 }),
      door: new THREE.MeshStandardMaterial({ color: "#232a33", roughness: 0.35, metalness: 0.7 }),
      ledG: new THREE.MeshStandardMaterial({ color: "#34d399", emissive: "#34d399", emissiveIntensity: 2 }),
      ledB: new THREE.MeshStandardMaterial({ color: "#38bdf8", emissive: "#38bdf8", emissiveIntensity: 2 }),
    }),
    [],
  );
  return (
    <group position={[-7.5, 0, 0]}>
      <mesh position-y={0.05} receiveShadow>
        <boxGeometry args={[1.5, 0.1, 3.0]} />
        <meshStandardMaterial color="#39414a" roughness={0.8} />
      </mesh>
      {[-0.9, -0.3, 0.3, 0.9].map((z) => (
        <group key={z} position={[0, 0.1, z]}>
          <mesh position-y={1.05} material={mats.body} castShadow receiveShadow>
            <boxGeometry args={[1.1, 2.1, 0.58]} />
          </mesh>
          <mesh position={[0.555, 1.05, 0]} material={mats.door}>
            <boxGeometry args={[0.01, 1.95, 0.5]} />
          </mesh>
          {Array.from({ length: 10 }, (_, i) => (
            <mesh
              key={i}
              position={[0.565, 0.3 + i * 0.17, -0.15 + (i % 3) * 0.05]}
              material={i % 3 ? mats.ledB : mats.ledG}
            >
              <boxGeometry args={[0.005, 0.02, 0.04]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Tank({ locked, active }: { locked: boolean; active: boolean }) {
  return (
    <group position={TANK}>
      <mesh position-y={1.25} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 2.5, 48]} />
        <meshStandardMaterial color="#d8dde0" roughness={0.6} metalness={0.1} />
      </mesh>
      {[0.5, 1.1, 1.7, 2.3].map((y) => (
        <mesh key={y} position-y={y} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.905, 0.025, 8, 48]} />
          <meshStandardMaterial color="#aab3bb" roughness={0.5} />
        </mesh>
      ))}
      <mesh position-y={2.55}>
        <cylinderGeometry args={[0.6, 0.9, 0.12, 48]} />
        <meshStandardMaterial color="#c3c9ce" roughness={0.6} />
      </mesh>
      {/* gate valve */}
      <group position={[3.2 - TANK[0], 0.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color={locked ? "#ef4444" : active ? "#38bdf8" : "#6b7784"}
            emissive={locked ? "#ef4444" : "#000"}
            emissiveIntensity={locked ? 0.6 : 0}
          />
        </mesh>
        <mesh position-y={0.3}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#8f98a3" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position-y={0.45} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.13, 0.025, 8, 24]} />
          <meshStandardMaterial color={locked ? "#ef4444" : "#8f98a3"} />
        </mesh>
      </group>
    </group>
  );
}

function Tag({ position, title, sub, tone }: { position: Vec3; title: string; sub?: string; tone: string }) {
  return (
    <Html position={position} center distanceFactor={11} zIndexRange={[10, 0]}>
      <div
        className="pointer-events-none hidden rounded-xl border px-3 py-1.5 text-center whitespace-nowrap backdrop-blur sm:block"
        style={{ borderColor: tone, background: "rgba(5,11,20,0.72)" }}
      >
        <div className="text-[13px] font-semibold" style={{ color: tone }}>
          {title}
        </div>
        {sub && <div className="text-[11px] text-[#8ea3bb]">{sub}</div>}
      </div>
    </Html>
  );
}

function Plant({ state }: { state: PlantState }) {
  const { chiller, adiabatic, adiabaticLockedOut } = state;
  return (
    <group>
      <Racks />
      <ChillerModel position={[CHILLER_X, 0, 0]} scale={CHILLER_S} running={chiller} />
      {[-DC_Z, DC_Z].map((z) => (
        <DryCoolerModel
          key={z}
          position={[DC_X, 0, z]}
          length={5}
          fans={3}
          spray={adiabatic}
          fanSpeed={chiller ? 8 : 6}
          connections={false}
        />
      ))}
      <Tank locked={adiabaticLockedOut} active={adiabatic} />

      <Pipe points={R.itOut} flow={WARM} insulated />
      <Pipe points={R.toEvap} flow={WARM} active={chiller} insulated />
      <Pipe points={R.bypass} flow={WARM} active={!chiller} insulated />
      <Pipe points={R.evapToIt} flow={COOL} active={chiller} insulated />
      <Pipe points={R.dcToIt} flow={COOL} active={!chiller} insulated />
      <Pipe points={R.condToDc} flow={HOT} active={chiller} />
      <Pipe points={R.dcToCond} flow={AMBER} active={chiller} />
      <Pipe points={R.supplyA} flow={chiller ? HOT : WARM} />
      <Pipe points={R.supplyB} flow={chiller ? HOT : WARM} />
      <Pipe points={R.returnA} flow={chiller ? AMBER : COOL} />
      <Pipe points={R.returnB} flow={chiller ? AMBER : COOL} />
      <Pipe points={R.water} radius={0.07} color="#3c4a58" flow="#7dd3fc" active={adiabatic} />

      <Tag position={[-7.5, 2.9, 0]} title="IT load" sub="TCS loop · 30 °C" tone="#e7eef7" />
      <Tag
        position={[CHILLER_X, 2.75, 0]}
        title="High-temp chiller"
        sub={chiller ? "running" : "bypassed"}
        tone={chiller ? AMBER : "#8ea3bb"}
      />
      <Tag
        position={[DC_X + 0.6, 3.3, 3.3]}
        title="Dry coolers"
        sub={adiabatic ? "adiabatic assist on" : "dry"}
        tone="#34d399"
      />
      <Tag
        position={[TANK[0], 3.6, TANK[2]]}
        title="Community water"
        sub={adiabaticLockedOut ? "gate closed" : adiabatic ? "gate open" : "not needed"}
        tone={adiabaticLockedOut ? "#ef4444" : "#7dd3fc"}
      />
    </group>
  );
}

export default function Plant3D({ state }: { state: PlantState }) {
  return (
    <Scene
      label={`3D plant model. Mode: ${state.headline}. ${state.detail}`}
      camera={{ position: [11, 10.5, 14], fov: 36 }}
      target={[-0.8, 0.6, -0.3]}
      ground={15}
      className="aspect-[4/3] w-full md:aspect-[16/9]"
    >
      <Plant state={state} />
    </Scene>
  );
}
