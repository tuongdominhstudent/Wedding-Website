export const ASSET_TIER = Object.freeze({
  BLOCKING: 'blocking',
  DEFERRED: 'deferred'
});

export class AssetRegistry {
  constructor() {
    this.items = new Map();
  }

  register(asset) {
    if (!asset?.id || typeof asset.load !== 'function') {
      throw new Error('Asset registration requires an id and a load() function');
    }

    if (this.items.has(asset.id)) {
      throw new Error(`Asset with id "${asset.id}" is already registered`);
    }

    const tier = asset.tier ?? ASSET_TIER.BLOCKING;
    if (!Object.values(ASSET_TIER).includes(tier)) {
      throw new Error(`Asset "${asset.id}" must use a valid tier`);
    }

    this.items.set(asset.id, {
      ...asset,
      tier
    });
  }

  unregister(assetId) {
    this.items.delete(assetId);
  }

  clear() {
    this.items.clear();
  }

  list(filters = {}) {
    const { tier, sectionId } = filters;

    return Array.from(this.items.values()).filter((asset) => {
      if (tier && asset.tier !== tier) {
        return false;
      }

      if (sectionId && asset.sectionId !== sectionId) {
        return false;
      }

      return true;
    });
  }
}
