import { useEffect } from 'react';
import { gsap, initializeGsap, ScrollTrigger } from '../motion/gsap/gsapConfig';
import { createLenis } from '../motion/scroll/createLenis';
import { PRELOADER_CONFIG } from '../config/preloaderConfig';
import { AssetRegistry } from '../services/assets/assetRegistry';
import { AssetLoader } from '../services/assets/assetLoader';
import { registerLongDistanceAssets } from '../sections/distance/longDistanceJourneyAssets';
import { registerFirstsAssets } from '../sections/firsts/firstsJourneyAssets';
import { registerIntroAssets } from '../sections/intro/introAssets';
import { BOOT_PHASE, useAppStore } from '../stores/useAppStore';

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function resetScrollPosition(lenisInstance) {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  lenisInstance?.scrollTo?.(0, {
    immediate: true,
    force: true
  });
}

export function useAppBootstrap() {
  const setBootPhase = useAppStore((state) => state.setBootPhase);
  const setBootProgress = useAppStore((state) => state.setBootProgress);
  const setLenisInstance = useAppStore((state) => state.setLenisInstance);
  const setAssetRegistry = useAppStore((state) => state.setAssetRegistry);
  const setAssetLoader = useAppStore((state) => state.setAssetLoader);
  const setReducedMotion = useAppStore((state) => state.setReducedMotion);
  const setBootError = useAppStore((state) => state.setBootError);

  useEffect(() => {
    let isCancelled = false;
    const previousScrollRestoration = window.history.scrollRestoration;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(reducedMotionQuery.matches);

    const onReducedMotionChange = (event) => {
      setReducedMotion(event.matches);
    };

    reducedMotionQuery.addEventListener('change', onReducedMotionChange);

    initializeGsap();
    setBootPhase(BOOT_PHASE.PRELOADING);

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = createLenis();
    lenis.stop();
    resetScrollPosition(lenis);
    window.requestAnimationFrame(() => {
      resetScrollPosition(lenis);
    });
    setLenisInstance(lenis);

    const onTicker = (time) => {
      lenis.raf(time * 1000);
    };
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);
    gsap.ticker.add(onTicker);
    gsap.ticker.lagSmoothing(0);

    const registry = new AssetRegistry();
    registerIntroAssets(registry);
    registerFirstsAssets(registry);
    registerLongDistanceAssets(registry);
    const loader = new AssetLoader(registry);
    setAssetRegistry(registry);
    setAssetLoader(loader);

    Promise.all([
      loader.loadAll((progress) => {
        setBootProgress(progress);
      }),
      wait(PRELOADER_CONFIG.simulatedMinDurationMs)
    ])
      .then(() => {
        if (isCancelled) {
          return;
        }
        resetScrollPosition(lenis);
        setBootProgress(1);
        setBootPhase(BOOT_PHASE.READY);
        lenis.start();
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        setBootError(error);
      });

    return () => {
      isCancelled = true;
      gsap.ticker.remove(onTicker);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
      setLenisInstance(null);
    };
  }, [
    setAssetLoader,
    setAssetRegistry,
    setBootError,
    setBootPhase,
    setBootProgress,
    setLenisInstance,
    setReducedMotion
  ]);
}
