import { describe, expect, it, vi } from 'vitest';
import { AssetRegistry, ASSET_TIER } from '../services/assets/assetRegistry';
import { AssetLoader } from '../services/assets/assetLoader';
import { clearSectionRegistry, getSectionPreloadStrategy } from '../config/sectionRegistry';

describe('AssetLoader', () => {
  it('loads only the requested tier and reports deterministic progress', async () => {
    const registry = new AssetRegistry();
    const loader = new AssetLoader(registry);
    const loadEvents = [];
    const progress = [];

    registry.register({
      id: 'intro-image',
      sectionId: 'intro',
      tier: getSectionPreloadStrategy('intro'),
      load: vi.fn(async () => {
        loadEvents.push('intro-image');
        return 'intro-image';
      })
    });

    registry.register({
      id: 'firsts-photo',
      sectionId: 'firsts',
      tier: getSectionPreloadStrategy('firsts'),
      load: vi.fn(async () => {
        loadEvents.push('firsts-photo');
        return 'firsts-photo';
      })
    });

    const blockingResults = await loader.loadByTier(ASSET_TIER.BLOCKING, (value) => {
      progress.push(value);
    });

    expect(blockingResults).toEqual([{ id: 'intro-image', data: 'intro-image' }]);
    expect(loadEvents).toEqual(['intro-image']);
    expect(progress).toEqual([0, 1]);
  });

  it('rejects invalid preload strategies in the section contract', () => {
    const registry = new AssetRegistry();

    expect(() =>
      registry.register({
        id: 'broken-asset',
        tier: 'eagerest',
        load: async () => 'broken'
      })
    ).toThrow(/valid tier/i);
  });

  it('exposes deferred assets without blocking boot-oriented loads', () => {
    clearSectionRegistry();

    expect(getSectionPreloadStrategy('intro')).toBe(ASSET_TIER.BLOCKING);
    expect(getSectionPreloadStrategy('firsts')).toBe(ASSET_TIER.DEFERRED);
    expect(getSectionPreloadStrategy('long-distance')).toBe(ASSET_TIER.DEFERRED);
  });
});
