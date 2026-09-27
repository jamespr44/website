"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { useInView } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { concreteTexture, radialFade } from "./textures";

type Vec3 = [number, number, number];

type Props = {
  children: React.ReactNode;
  camera?: { position: Vec3; fov?: number };
  target?: Vec3;
  /** Radius of the ground disc. */
  ground?: number;
  /** Allow drag-to-orbit (only on devices with a fine pointer, so touch scrolling is never hijacked). */
  orbit?: boolean;
  className?: string;
  label: string;
};

function Ground({ radius }: { radius: number }) {
  const [map, alpha] = useMemo(() => {
    const m = concreteTexture().clone();
    m.repeat.set(radius / 4, radius / 4);
    m.needsUpdate = true;
    return [m, radialFade()];
  }, [radius]);
  return (
    // Drawn first and without depth writes, so particles and glass always composite over it.
    <mesh rotation-x={-Math.PI / 2} position-y={-0.001} receiveShadow renderOrder={-1}>
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial
        map={map}
        alphaMap={alpha}
        transparent
        depthWrite={false}
        color="#39414b"
        roughness={0.95}
      />
    </mesh>
  );
}

/**
 * Shared 3D stage: studio lighting built from light-formers (no HDR download), soft shadows and a fading
 * concrete ground. The canvas mounts the first time it nears the viewport and pauses when off-screen.
 */
export default function Scene({
  children,
  camera = { position: [8, 5, 10], fov: 35 },
  target = [0, 1, 0],
  ground = 12,
  orbit = true,
  className = "",
  label,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "300px 0px" });
  const reduced = useReducedMotionSafe();
  const [armed, setArmed] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    if (near) setArmed(true);
  }, [near]);
  useEffect(() => setFinePointer(window.matchMedia("(pointer: fine)").matches), []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={`relative ${className}`}
      // Feather the canvas edges into the page so the ground never shows a hard rectangle.
      style={{
        maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 72%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 72%, transparent 100%)",
      }}
    >
      {armed && (
        <Canvas
          shadows="percentage"
          dpr={[1, 1.75]}
          frameloop={!near ? "never" : reduced ? "demand" : "always"}
          camera={{ position: camera.position, fov: camera.fov ?? 35, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          onCreated={({ camera: cam }) => cam.lookAt(...target)}
        >
          <hemisphereLight args={["#cfe3ff", "#1a2330", 0.55]} />
          <directionalLight
            position={[8, 14, 6]}
            intensity={2.4}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0004}
            shadow-camera-left={-14}
            shadow-camera-right={14}
            shadow-camera-top={14}
            shadow-camera-bottom={-14}
          />
          <directionalLight position={[-10, 6, -8]} intensity={0.6} color="#8fb8ff" />
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={3} position={[0, 6, -8]} scale={[16, 4, 1]} color="#dfeaff" />
            <Lightformer
              form="rect"
              intensity={1.5}
              position={[-8, 3, 4]}
              rotation-y={Math.PI / 2}
              scale={[10, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.2}
              position={[8, 3, 4]}
              rotation-y={-Math.PI / 2}
              scale={[10, 3, 1]}
              color="#ffd9a8"
            />
            <Lightformer form="circle" intensity={4} position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={6} />
          </Environment>

          {children}
          <Ground radius={ground} />

          {orbit && finePointer && (
            <OrbitControls
              target={target}
              enablePan={false}
              enableZoom={false}
              enableDamping
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.15}
            />
          )}
        </Canvas>
      )}
      {!armed && <div className="absolute inset-0 animate-pulse rounded-3xl bg-white/[0.02]" />}
    </div>
  );
}
