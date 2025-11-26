export enum ShapeType {
  SPHERE = 'Sphere',
  CUBE = 'Cube',
  HEART = 'Heart',
  FLOWER = 'Flower',
}

export interface ParticleState {
  shape: ShapeType;
  color: string;
  expansion: number; // 0 to 1 based on hand open/close
  loveMode: boolean; // Triggered by specific gesture
}

export type Vector3 = [number, number, number];
