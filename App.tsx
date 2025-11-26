import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Particles from './components/Particles';
import HandTracker from './components/HandTracker';
import OverlayUI from './components/OverlayUI';

const Scene: React.FC = () => {
  return (
    <>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={true} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="blue" intensity={1} />
      
      <Particles />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Logic & UI Layers */}
      <HandTracker />
      <OverlayUI />
    </div>
  );
};

export default App;
