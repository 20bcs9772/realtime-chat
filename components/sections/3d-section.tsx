"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type Props = {
  className?: string;
};

export default function ThreeScene({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0.6, 0.8, 2.6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights — soft studio
    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.8);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(5, 10, 7.5);
    dir.castShadow = true;
    scene.add(dir);

    // Controls — damped, but we’ll also add custom hover scroll cues
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 6;

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let model: THREE.Object3D | null = null;

    function markHoverable(root: THREE.Object3D) {
      root.traverse((obj: any) => {
        if ((obj as THREE.Mesh).isMesh) {
          obj.userData._baseScale = obj.scale.clone();
          obj.userData._hoverable = true;
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
    }

    // GLTF Loader with fallback geometry if load fails
    const loader = new GLTFLoader();
    const modelPath = "/assets/3d/duck.glb"; // sample built-in model per v0 guidelines

    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1.2, 1.2, 1.2);
        model.rotation.set(0, Math.PI * 0.2, 0);
        scene.add(model);
        markHoverable(model);
      },
      undefined,
      () => {
        // Fallback if model missing
        const geo = new THREE.TorusKnotGeometry(0.5, 0.18, 128, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setStyle("hsl(220 10% 60%)"),
          metalness: 0.3,
          roughness: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        model = mesh;
        scene.add(mesh);
      }
    );

    // Scroll-based parallax within this section
    let scrollProgress = 0;
    function onScroll() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const visible = Math.min(1, Math.max(0, 1 - rect.top / vh)); // 0..1 as it enters
      scrollProgress = visible;
    }
    onScroll();

    // Pointer move for subtle orbit and hover highlight
    function onPointerMove(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    // Animate
    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      // gentle idle rotation and scroll parallax
      if (model) {
        model.rotation.y += 0.003;
        // parallax the camera a touch based on scroll
        const targetZ = THREE.MathUtils.lerp(2.6, 1.8, scrollProgress);
        camera.position.z += (targetZ - camera.position.z) * 0.08;

        // hover scaling
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        let hovered: THREE.Object3D | null = null;
        for (const it of intersects) {
          if ((it.object as any).userData?._hoverable) {
            hovered = it.object;
            break;
          }
        }
        // scale hovered mesh up slightly
        if (hovered) {
          const mesh = hovered as any;
          const base = mesh.userData._baseScale as THREE.Vector3;
          mesh.scale.lerp(
            new THREE.Vector3(base.x * 1.08, base.y * 1.08, base.z * 1.08),
            0.2
          );
        }
        // softly return other meshes to base scale
        model.traverse((obj: any) => {
          if (obj.userData?._hoverable && obj !== hovered) {
            const base = obj.userData._baseScale as THREE.Vector3;
            obj.scale.lerp(base, 0.2);
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // Resize
    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      window.removeEventListener("scroll", onScroll);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      container.removeChild(renderer.domElement);
      renderer.dispose();
      // dispose geometries/materials
      scene.traverse((obj) => {
        if ((obj as any).geometry) (obj as any).geometry.dispose?.();
        if ((obj as any).material) {
          const m = (obj as any).material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
          else m.dispose?.();
        }
      });
    };
  }, []);

  return <div ref={mountRef} className={className ?? "w-full h-dvh"} />;
}
