import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ShapeType } from '../types';
import { Settings2, Heart, Box, Circle, Flower2, Maximize2, Minimize2 } from 'lucide-react';

const OverlayUI: React.FC = () => {
  const { shape, setShape, color, setColor, loveMode } = useAppStore();
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  const shapes = [
    { type: ShapeType.SPHERE, icon: <Circle size={18} /> },
    { type: ShapeType.CUBE, icon: <Box size={18} /> },
    { type: ShapeType.HEART, icon: <Heart size={18} /> },
    { type: ShapeType.FLOWER, icon: <Flower2 size={18} /> },
  ];

  return (
    <>
      {/* Love Mode Overlay */}
      <div 
        className={`pointer-events-none fixed inset-0 flex items-center justify-center z-40 transition-all duration-700 ease-in-out ${
          loveMode ? 'opacity-100 scale-100 bg-pink-900/20' : 'opacity-0 scale-90'
        }`}
      >
        <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)] animate-bounce">
            老婆我爱你
            </h1>
            <p className="text-white/80 mt-4 text-xl tracking-widest font-light animate-pulse">
                (Finger Heart Detected)
            </p>
        </div>
      </div>

      {/* Main Controls Panel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-lg">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-4 transition-all hover:bg-black/70">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/90">
                <Settings2 size={20} className="text-purple-400" />
                <span className="font-medium tracking-wide text-sm">Particle Control</span>
            </div>
            
            <button 
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-full text-white/70 transition-colors"
                title="Toggle Fullscreen"
            >
                {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-between">
            {/* Shape Selectors */}
            <div className="flex gap-2 bg-black/40 p-1 rounded-xl">
                {shapes.map((s) => (
                    <button
                        key={s.type}
                        onClick={() => setShape(s.type)}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                            shape === s.type 
                            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                        title={s.type}
                    >
                        {s.icon}
                    </button>
                ))}
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-3 bg-black/40 p-2 pr-4 rounded-xl">
                <div className="relative overflow-hidden w-8 h-8 rounded-full border-2 border-white/20 shadow-inner">
                    <input 
                        type="color" 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                </div>
                <span className="text-xs text-white/60 uppercase font-mono">{color}</span>
            </div>
          </div>
          
          <div className="text-[10px] text-white/30 text-center font-mono pt-2 border-t border-white/5">
             Gestures: Pinch to Condense • Open to Explode • Finger Heart for Surprise
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlayUI;
