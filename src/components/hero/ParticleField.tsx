import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 800;
const MAX_DISTANCE = 1.5;

export const ParticleScene: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const colorEmerald = new THREE.Color('#2d8a6e');
    const colorEmeraldSoft = new THREE.Color('#3ba886');
    const colorWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      const randColor = Math.random();
      let c = colorEmerald;
      if (randColor > 0.8) c = colorWhite;
      else if (randColor > 0.4) c = colorEmeraldSoft;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, velocities: vel, colors: col };
  }, []);

  const linesGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    // Pre-allocate buffer for maximum possible lines (approximation for performance)
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 20 * 3), 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;
    
    const mouse3D = new THREE.Vector3(
      mousePosition.x * 10,
      mousePosition.y * 5,
      0
    );

    let lineIndex = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      positions[i3 + 2] += velocities[i3 + 2];

      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      const dx = mouse3D.x - px;
      const dy = mouse3D.y - py;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);

      if (distToMouse < 4) {
        positions[i3] += dx * 0.003;
        positions[i3 + 1] += dy * 0.003;
      }

      if (positions[i3] > 10 || positions[i3] < -10) velocities[i3] *= -1;
      if (positions[i3 + 1] > 5 || positions[i3 + 1] < -5) velocities[i3 + 1] *= -1;
      if (positions[i3 + 2] > 5 || positions[i3 + 2] < -5) velocities[i3 + 2] *= -1;

      // Draw lines for a subset to keep performance high
      if (i % 2 === 0) {
        for (let j = i + 1; j < PARTICLE_COUNT; j += 4) {
          const j3 = j * 3;
          const p2x = positions[j3];
          const p2y = positions[j3 + 1];
          const p2z = positions[j3 + 2];

          const dist = Math.sqrt(
            Math.pow(px - p2x, 2) +
            Math.pow(py - p2y, 2) +
            Math.pow(pz - p2z, 2)
          );

          if (dist < MAX_DISTANCE && lineIndex < linePositions.length - 6) {
            linePositions[lineIndex++] = px;
            linePositions[lineIndex++] = py;
            linePositions[lineIndex++] = pz;
            
            linePositions[lineIndex++] = p2x;
            linePositions[lineIndex++] = p2y;
            linePositions[lineIndex++] = p2z;
          }
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial color="#2d8a6e" transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
      {[...Array(4)].map((_, i) => (
        <mesh key={`orb-${i}`} position={[(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#3ba886" transparent opacity={0.15} />
        </mesh>
      ))}
    </>
  );
};

export const ParticleField: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 2]}
      >
        <ParticleScene mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};
