import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { generatePositions } from '../utils/geometry';

const Particles: React.FC = () => {
  const { shape, color, expansion } = useAppStore();
  
  // We keep two buffers: current positions and target positions
  const count = 4000;
  
  // Generate target positions based on selected shape
  const targetPositions = useMemo(() => generatePositions(shape), [shape]);
  
  // Initial positions (random cloud)
  const currentPositions = useMemo(() => new Float32Array(count * 3), []);
  
  const pointsRef = useRef<THREE.Points>(null);
  
  // Initialize current positions once
  useMemo(() => {
    for(let i=0; i<count*3; i++) {
        currentPositions[i] = (Math.random() - 0.5) * 10;
    }
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Smooth damp factor
    const speed = 3.0 * delta;
    
    // Expansion factor adds noise/spread
    // If expansion is 0 (pinched), particles are tight on the shape.
    // If expansion is 1 (open hand), particles explode outwards or have high jitter.
    
    const spreadMultiplier = 1 + (expansion * 4); // 1x to 5x spread
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Target coordinates
      let tx = targetPositions[ix];
      let ty = targetPositions[iy];
      let tz = targetPositions[iz];
      
      // Apply expansion/explosion effect
      // We push the target away from center based on expansion
      tx *= spreadMultiplier;
      ty *= spreadMultiplier;
      tz *= spreadMultiplier;

      // Add some noise based on expansion for "shaking" effect
      if (expansion > 0.8) {
          tx += (Math.random() - 0.5) * 0.5;
          ty += (Math.random() - 0.5) * 0.5;
          tz += (Math.random() - 0.5) * 0.5;
      }

      // Linear interpolation (Lerp) towards target
      positions[ix] += (tx - positions[ix]) * speed;
      positions[iy] += (ty - positions[iy]) * speed;
      positions[iz] += (tz - positions[iz]) * speed;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotate the whole system slowly
    pointsRef.current.rotation.y += delta * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
};

export default Particles;
