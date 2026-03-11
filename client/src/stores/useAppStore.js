import { create } from 'zustand';

const BOOT_PHASE = Object.freeze({
  IDLE: 'idle',
  PRELOADING: 'preloading',
  READY: 'ready',
  ERROR: 'error'
});

export const useAppStore = create((set) => ({
  bootPhase: BOOT_PHASE.IDLE,
  bootProgress: 0,
  bootError: null,
  isReducedMotion: false,
  lenisInstance: null,
  assetRegistry: null,
  assetLoader: null,
  setBootPhase: (bootPhase) => set({ bootPhase }),
  setBootProgress: (bootProgress) => set({ bootProgress }),
  setLenisInstance: (lenisInstance) => set({ lenisInstance }),
  setAssetRegistry: (assetRegistry) => set({ assetRegistry }),
  setAssetLoader: (assetLoader) => set({ assetLoader }),
  setReducedMotion: (isReducedMotion) => set({ isReducedMotion }),
  setBootError: (error) =>
    set({
      bootPhase: BOOT_PHASE.ERROR,
      bootError: error instanceof Error ? error.message : 'Unknown bootstrap error'
    })
}));

export { BOOT_PHASE };
