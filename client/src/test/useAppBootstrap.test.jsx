import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppBootstrap } from '../hooks/useAppBootstrap';
import { ASSET_TIER } from '../services/assets/assetRegistry';
import { BOOT_PHASE, DEFERRED_ASSET_PHASE, resetAppStore, useAppStore } from '../stores/useAppStore';

const {
  registerIntroAssetsMock,
  registerFirstsAssetsMock,
  registerLongDistanceAssetsMock,
  registerPreweddingAssetsMock,
  registerCalendarAssetsMock,
  lenisMock,
  tickerAdd,
  tickerRemove,
  lagSmoothing,
  scrollTriggerUpdate
} = vi.hoisted(() => ({
  registerIntroAssetsMock: vi.fn(),
  registerFirstsAssetsMock: vi.fn(),
  registerLongDistanceAssetsMock: vi.fn(),
  registerPreweddingAssetsMock: vi.fn(),
  registerCalendarAssetsMock: vi.fn(),
  lenisMock: {
    stop: vi.fn(),
    start: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    destroy: vi.fn(),
    scrollTo: vi.fn(),
    resize: vi.fn(),
    raf: vi.fn()
  },
  tickerAdd: vi.fn(),
  tickerRemove: vi.fn(),
  lagSmoothing: vi.fn(),
  scrollTriggerUpdate: vi.fn()
}));

vi.mock('../sections/intro/introAssets', () => ({
  registerIntroAssets: (registry) => registerIntroAssetsMock(registry)
}));

vi.mock('../sections/firsts/firstsJourneyAssets', () => ({
  registerFirstsAssets: (registry) => registerFirstsAssetsMock(registry)
}));

vi.mock('../sections/distance/longDistanceJourneyAssets', () => ({
  registerLongDistanceAssets: (registry) => registerLongDistanceAssetsMock(registry)
}));

vi.mock('../sections/prewedding/preweddingAssets', () => ({
  registerPreweddingAssets: (registry) => registerPreweddingAssetsMock(registry)
}));

vi.mock('../sections/calendar/calendarAssets', () => ({
  registerCalendarAssets: (registry) => registerCalendarAssetsMock(registry)
}));

vi.mock('../motion/scroll/createLenis', () => ({
  createLenis: () => lenisMock
}));

vi.mock('../motion/gsap/gsapConfig', () => ({
  initializeGsap: vi.fn(),
  ScrollTrigger: {
    update: scrollTriggerUpdate
  },
  gsap: {
    ticker: {
      add: tickerAdd,
      remove: tickerRemove,
      lagSmoothing
    }
  }
}));

vi.mock('../config/preloaderConfig', () => ({
  PRELOADER_CONFIG: {
    simulatedMinDurationMs: 0
  }
}));

function BootstrapHarness() {
  useAppBootstrap();
  return null;
}

function registerAsset(registry, id, tier, resolvedValue, log) {
  registry.register({
    id,
    tier,
    sectionId: tier === ASSET_TIER.BLOCKING ? 'intro' : 'firsts',
    load: vi.fn(async () => {
      log.push(id);
      return resolvedValue;
    })
  });
}

describe('useAppBootstrap', () => {
  beforeEach(() => {
    resetAppStore();
    registerIntroAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'intro-video', ASSET_TIER.BLOCKING, 'intro-video', []);
    });
    registerFirstsAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'firsts-photo', ASSET_TIER.DEFERRED, 'firsts-photo', []);
    });
    registerLongDistanceAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'distance-model', ASSET_TIER.DEFERRED, 'distance-model', []);
    });
    registerPreweddingAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'prewedding-video', ASSET_TIER.DEFERRED, 'prewedding-video', []);
    });
    registerCalendarAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'calendar-hero', ASSET_TIER.DEFERRED, 'calendar-hero', []);
    });
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
    window.requestAnimationFrame = vi.fn((callback) => {
      callback(0);
      return 1;
    });
    window.scrollTo = vi.fn();
    window.history.scrollRestoration = 'auto';
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetAppStore();
  });

  it('reaches ready after blocking assets complete and keeps deferred assets idle until requested', async () => {
    const loadOrder = [];

    registerIntroAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'intro-video', ASSET_TIER.BLOCKING, 'intro-video', loadOrder);
    });
    registerFirstsAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'firsts-photo', ASSET_TIER.DEFERRED, 'firsts-photo', loadOrder);
    });
    registerLongDistanceAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'distance-model', ASSET_TIER.DEFERRED, 'distance-model', loadOrder);
    });
    registerPreweddingAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'prewedding-video', ASSET_TIER.DEFERRED, 'prewedding-video', loadOrder);
    });
    registerCalendarAssetsMock.mockImplementation((registry) => {
      registerAsset(registry, 'calendar-hero', ASSET_TIER.DEFERRED, 'calendar-hero', loadOrder);
    });

    render(<BootstrapHarness />);

    await waitFor(() => {
      expect(useAppStore.getState().bootPhase).toBe(BOOT_PHASE.READY);
    });

    expect(loadOrder).toEqual(['intro-video']);
    expect(useAppStore.getState().deferredAssetPhase).toBe(DEFERRED_ASSET_PHASE.IDLE);

    await act(async () => {
      await useAppStore.getState().loadDeferredAssets();
    });

    expect(loadOrder).toEqual(['intro-video', 'firsts-photo', 'distance-model', 'prewedding-video', 'calendar-hero']);
    expect(useAppStore.getState().deferredAssetPhase).toBe(DEFERRED_ASSET_PHASE.READY);
    expect(useAppStore.getState().deferredAssetProgress).toBe(1);
  });
});
