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

    this.items.set(asset.id, asset);
  }

  unregister(assetId) {
    this.items.delete(assetId);
  }

  clear() {
    this.items.clear();
  }

  list() {
    return Array.from(this.items.values());
  }
}
