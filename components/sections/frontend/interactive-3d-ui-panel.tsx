"use client";

import type React from "react";
import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  useGLTF,
  OrbitControls,
} from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticlesCanvas } from "@/components/particles";
import type * as THREE from "three";

function CameraRig({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  useFrame((_, dt) => {
    const t = Math.max(0, Math.min(1, progressRef.current));
    const targetFov = 50 - t * 18; // zoom in
    camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 6);
    const targetPos = {
      x: Math.sin(t * Math.PI) * 0.6,
      y: 0.4 + t * 0.15,
      z: 2.4 - t * 0.9,
    };
    camera.position.x +=
      (targetPos.x - camera.position.x) * Math.min(1, dt * 4);
    camera.position.y +=
      (targetPos.y - camera.position.y) * Math.min(1, dt * 4);
    camera.position.z +=
      (targetPos.z - camera.position.z) * Math.min(1, dt * 4);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}

function GLTFModel({
  url,
  hoveredRef,
  progressRef,
  baseScale = 0.9,
}: {
  url: string;
  hoveredRef: React.MutableRefObject<boolean>;
  progressRef: React.MutableRefObject<number>;
  baseScale?: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(url);

  useFrame((_, dt) => {
    const t = progressRef.current;
    const targetRotY = t * Math.PI * 1.2;
    const targetScale = hoveredRef.current ? baseScale * 1.08 : baseScale;
    if (group.current) {
      group.current.rotation.y +=
        (targetRotY - group.current.rotation.y) * Math.min(1, dt * 4);
      const s = group.current.scale;
      s.setScalar(s.x + (targetScale - s.x) * Math.min(1, dt * 6));
    }
  });

  return (
    <primitive
      object={scene}
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoveredRef.current = true;
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        hoveredRef.current = false;
      }}
      position={[0, -0.2, 0]}
      scale={baseScale}
    />
  );
}

function FallbackModel({
  hoveredRef,
  progressRef,
}: {
  hoveredRef: React.MutableRefObject<boolean>;
  progressRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((_, dt) => {
    const t = progressRef.current;
    const targetRotY = t * Math.PI * 1.2;
    if (meshRef.current) {
      meshRef.current.rotation.y +=
        (targetRotY - meshRef.current.rotation.y) * Math.min(1, dt * 4);
      const targetScale = hoveredRef.current ? 1.08 : 1.0;
      const s = meshRef.current.scale;
      s.setScalar(s.x + (targetScale - s.x) * Math.min(1, dt * 6));
    }
    // material morph
    if (matRef.current) {
      const targetMetal = hoveredRef.current ? 0.55 : 0.3;
      const targetRough = hoveredRef.current ? 0.18 : 0.25;
      matRef.current.metalness +=
        (targetMetal - matRef.current.metalness) * Math.min(1, dt * 6);
      matRef.current.roughness +=
        (targetRough - matRef.current.roughness) * Math.min(1, dt * 6);
    }
  });
  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoveredRef.current = true;
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        hoveredRef.current = false;
      }}
    >
      <torusKnotGeometry args={[0.5, 0.18, 180, 24]} />
      <meshStandardMaterial
        ref={matRef}
        color="hsl(210 90% 60%)"
        metalness={0.3}
        roughness={0.25}
      />
    </mesh>
  );
}

export function Interactive3DUIPanel({
  modelUrl,
  title = "Interactive 3D UI",
  subtitle = "Scroll to explore motion, lighting, and interaction",
}: {
  modelUrl?: string;
  title?: string;
  subtitle?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef(false);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"], // 0 -> at top of wrapper, 1 -> at end of wrapper
  });
  const progressMotion = useTransform(scrollYProgress, [0, 1], [0, 1]);

  progressMotion.on("change", (v) => {
    progressRef.current = v;
  });

  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [1, 1, 0.2, 0]
  );

  return (
    <section id="interactive-3d-ui" aria-label="Interactive 3D UI">
      <div ref={wrapperRef} className="relative h-[400vh]">
        <div className="sticky top-0 h-screen w-screen overflow-hidden">
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0.4, 2.4], fov: 50 }}
              gl={{ antialias: true }}
              onCreated={({ gl }) => {
                gl.setClearColor("transparent");
              }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[2.4, 2.2, 1.2]} intensity={1.1} />
              <Environment preset="studio" />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
              />
              <Suspense fallback={null}>
                {modelUrl ? (
                  <GLTFModel
                    url={modelUrl}
                    hoveredRef={hoveredRef}
                    progressRef={progressRef}
                  />
                ) : (
                  <FallbackModel
                    hoveredRef={hoveredRef}
                    progressRef={progressRef}
                  />
                )}
              </Suspense>
              <ContactShadows
                position={[0, -0.6, 0]}
                opacity={0.3}
                scale={10}
                blur={2.2}
                far={2}
              />
              <CameraRig progressRef={progressRef} />
            </Canvas>
          </div>

          <ParticlesCanvas className="pointer-events-none absolute inset-0 opacity-40" />

          <motion.div
            style={{ opacity: headerOpacity }}
            className="relative z-10 mx-auto max-w-2xl px-6 text-center py-10 mt-5"
          >
            <h2 className="text-balance text-3xl md:text-5xl font-semibold">
              {title}
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground">
              {subtitle}
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              Tip: Hover the model and keep scrolling
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
