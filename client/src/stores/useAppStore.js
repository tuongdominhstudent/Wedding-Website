import { create } from 'zustand';

const BOOT_PHASE = Object.freeze({
  IDLE: 'idle',
  PRELOADING: 'preloading',
  READY: 'ready',
  ERROR: 'error'
});

export const DEFERRED_ASSET_PHASE = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error'
});

const INITIAL_RUNTIME_STATE = Object.freeze({
  bootPhase: BOOT_PHASE.IDLE,
  bootProgress: 0,
  bootError: null,
  isReducedMotion: false,
  lenisInstance: null,
  assetRegistry: null,
  assetLoader: null,
  deferredAssetPhase: DEFERRED_ASSET_PHASE.IDLE,
  deferredAssetProgress: 0,
  deferredAssetError: null
});

export const useAppStore = create((set) => ({
  ...INITIAL_RUNTIME_STATE,
  setBootPhase: (bootPhase) => set({ bootPhase }),
  setBootProgress: (bootProgress) => set({ bootProgress }),
  setLenisInstance: (lenisInstance) => set({ lenisInstance }),
  setAssetRegistry: (assetRegistry) => set({ assetRegistry }),
  setAssetLoader: (assetLoader) => set({ assetLoader }),
  setReducedMotion: (isReducedMotion) => set({ isReducedMotion }),
  setDeferredAssetPhase: (deferredAssetPhase) => set({ deferredAssetPhase }),
  setDeferredAssetProgress: (deferredAssetProgress) => set({ deferredAssetProgress }),
  setDeferredAssetError: (error) =>
    set({
      deferredAssetPhase: DEFERRED_ASSET_PHASE.ERROR,
      deferredAssetError: error instanceof Error ? error.message : 'Unknown deferred asset error'
    }),
  setDeferredAssetLoader: (loadDeferredAssets) => set({ loadDeferredAssets }),
  loadDeferredAssets: async () => [],
  setBootError: (error) =>
    set({
      bootPhase: BOOT_PHASE.ERROR,
      bootError: error instanceof Error ? error.message : 'Unknown bootstrap error'
    })
}));

export function resetAppStore() {
  useAppStore.setState({
    ...INITIAL_RUNTIME_STATE,
    loadDeferredAssets: async () => [],
    setBootPhase: useAppStore.getState().setBootPhase,
    setBootProgress: useAppStore.getState().setBootProgress,
    setLenisInstance: useAppStore.getState().setLenisInstance,
    setAssetRegistry: useAppStore.getState().setAssetRegistry,
    setAssetLoader: useAppStore.getState().setAssetLoader,
    setReducedMotion: useAppStore.getState().setReducedMotion,
    setDeferredAssetPhase: useAppStore.getState().setDeferredAssetPhase,
    setDeferredAssetProgress: useAppStore.getState().setDeferredAssetProgress,
    setDeferredAssetError: useAppStore.getState().setDeferredAssetError,
    setDeferredAssetLoader: useAppStore.getState().setDeferredAssetLoader,
    setBootError: useAppStore.getState().setBootError
  });
}

export { BOOT_PHASE };
