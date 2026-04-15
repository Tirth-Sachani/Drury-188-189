"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const CoffeeBlob = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 8;
    meshRef.current.rotation.y = Math.sin(t / 4) / 8;
    meshRef.current.rotation.z = Math.sin(t / 4) / 10;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 100, 100]}>
        <MeshDistortMaterial
          color="#E6C9A8" // Crema color
          speed={2}
          distort={0.4}
          radius={1}
          metalness={0.2}
          roughness={0.4}
        />
      </Sphere>
    </Float>
  );
};

const LiquidCanvas = () => {
  return (
    <div className="absolute top-0 right-0 w-full h-full -z-10 opacity-20 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <CoffeeBlob />
      </Canvas>
    </div>
  );
};

export default LiquidCanvas;
