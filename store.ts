import { create } from 'zustand';
import { ShapeType, ParticleState } from './types';

interface AppState extends ParticleState {
  setShape: (shape: ShapeType) => void;
  setColor: (color: string) => void;
  setExpansion: (expansion: number) => void;
  setLoveMode: (active: boolean) => void;
  toggleLoveMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  shape: ShapeType.HEART,
  color: '#ff69b4',
  expansion: 0.5,
  loveMode: false,
  setShape: (shape) => set({ shape, loveMode: shape === ShapeType.HEART ? false : false }), // Reset love mode if manually changing shape
  setColor: (color) => set({ color }),
  setExpansion: (expansion) => set({ expansion }),
  setLoveMode: (active) => set((state) => {
    // Only trigger state update if changed to avoid re-renders
    if (state.loveMode === active) return {};
    return { 
        loveMode: active, 
        shape: active ? ShapeType.HEART : state.shape,
        color: active ? '#ff0000' : state.color
    };
  }),
  toggleLoveMode: () => set((state) => ({ loveMode: !state.loveMode })),
}));
