"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";

// Helper to generate an A4-like texture with optional text printed on it.
function makeA4Texture(text: string) {
  // Use a relatively high DPI to give the texture enough resolution.
  const dpi = 200;
  const w = Math.round(8.27 * dpi); // A4 width in inches (210 mm)
  const h = Math.round(11.69 * dpi); // A4 height in inches (297 mm)

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  // Paint a paper‑like off‑white background.
  ctx.fillStyle = "#f7f7f4";
  ctx.fillRect(0, 0, w, h);

  // Add a bit of noise to mimic paper grain.
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i + 0] = Math.min(255, Math.max(0, img.data[i + 0] + n));
    img.data[i + 1] = Math.min(255, Math.max(0, img.data[i + 1] + n));
    img.data[i + 2] = Math.min(255, Math.max(0, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  // Draw the supplied text.
  ctx.fillStyle = "#111";
  ctx.font = `${Math.round(dpi * 0.26)}px system-ui, -apple-system, Segoe UI, Arial`;
  ctx.textBaseline = "top";
  const margin = Math.round(dpi * 0.6);
  const lines = text.split("\\n");
  let y = margin;
  for (const line of lines) {
    ctx.fillText(line, margin, y);
    y += Math.round(dpi * 0.38);
  }

  // Optional guide marks.
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function MobiusPaper() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Memoize the texture so it's only created once on the client.
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return makeA4Texture("YOUR TEXT HERE\\nSecond line\\nThird line");
  }, []);

  // Build a Möbius strip geometry using Three.js's ParametricGeometry helper.
  const geometry = useMemo(() => {
    const W = 0.28; // half the paper width (in world units)
    const R = 0.9; // radius of the loop
    const slices = 240;
    const stacks = 40;
    const func = (u: number, v: number, target: THREE.Vector3) => {
      const U = u * Math.PI * 2;
      const V = (v - 0.5) * 2 * W;
      const x = (R + V * Math.cos(U / 2)) * Math.cos(U);
      const y = (R + V * Math.cos(U / 2)) * Math.sin(U);
      const z = V * Math.sin(U / 2);
      // Swap axes for a nicer initial orientation.
      target.set(x, z, y);
    };
    // Dynamically require ParametricGeometry from examples to avoid SSR issues.
    const { ParametricGeometry } = require("three/examples/jsm/geometries/ParametricGeometry.js");
    const g = new ParametricGeometry(func, slices, stacks);
    g.computeVertexNormals();
    return g as unknown as THREE.BufferGeometry;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture ?? undefined,
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide
      }),
    [texture]
  );

  // Animate the rotation; the OrbitControls allow manual override.
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.25;
    meshRef.current.rotation.y = t * 0.35;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function Page() {
  return (
    <main style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 1.2, 3.2], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />
        <MobiusPaper />
        <OrbitControls enablePan={false} minDistance={2.0} maxDistance={6.0} />
      </Canvas>
    </main>
  );
}
