import * as THREE from 'three';
import { ShapeType } from '../types';

const COUNT = 4000;

const getRandomPointInSphere = (): number[] => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * 2; // radius 2
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return [x, y, z];
};

const getRandomPointInCube = (): number[] => {
  const s = 3; 
  return [(Math.random() - 0.5) * s, (Math.random() - 0.5) * s, (Math.random() - 0.5) * s];
};

const getRandomPointInHeart = (): number[] => {
    // 3D Heart formula rejection sampling
    // (x^2 + 9y^2/4 + z^2 - 1)^3 - x^2z^3 - 9y^2z^3/80 <= 0
    let x, y, z;
    while (true) {
        x = (Math.random() * 3) - 1.5;
        y = (Math.random() * 3) - 1.5;
        z = (Math.random() * 3) - 1.5;
        
        const a = x * x + (9/4) * y * y + z * z - 1;
        if (a * a * a - x * x * z * z * z - (9/80) * y * y * z * z * z <= 0) {
             // Scale it up slightly and rotate to stand up
             return [x * 2, z * 2, y * 2]; // Swapped Y and Z for visual orientation
        }
    }
}

const getRandomPointInFlower = (): number[] => {
    // Parametric flower-like shape
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI;
    const r = 2 + Math.sin(5 * u) * Math.sin(5 * v); // 5 petals
    
    const x = r * Math.sin(v) * Math.cos(u) * 0.5;
    const y = r * Math.sin(v) * Math.sin(u) * 0.5;
    const z = r * Math.cos(v) * 0.5 + (Math.random() - 0.5); // Add depth
    return [x, y, z];
}

export const generatePositions = (shape: ShapeType): Float32Array => {
  const positions = new Float32Array(COUNT * 3);
  
  for (let i = 0; i < COUNT; i++) {
    let point: number[];
    switch (shape) {
      case ShapeType.SPHERE:
        point = getRandomPointInSphere();
        break;
      case ShapeType.CUBE:
        point = getRandomPointInCube();
        break;
      case ShapeType.HEART:
        point = getRandomPointInHeart();
        break;
      case ShapeType.FLOWER:
        point = getRandomPointInFlower();
        break;
      default:
        point = getRandomPointInSphere();
    }
    
    positions[i * 3] = point[0];
    positions[i * 3 + 1] = point[1];
    positions[i * 3 + 2] = point[2];
  }
  
  return positions;
};
