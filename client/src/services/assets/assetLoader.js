export class AssetLoader {
  constructor(registry) {
    this.registry = registry;
  }

  async loadAll(onProgress) {
    const assets = this.registry.list();
    const total = assets.length;

    if (typeof onProgress === 'function') {
      onProgress(total === 0 ? 1 : 0);
    }

    if (total === 0) {
      return [];
    }

    let completed = 0;
    const results = [];

    for (const asset of assets) {
      const data = await asset.load();
      completed += 1;
      results.push({ id: asset.id, data });

      if (typeof onProgress === 'function') {
        onProgress(completed / total);
      }
    }

    return results;
  }
}
