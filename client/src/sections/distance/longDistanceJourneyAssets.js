import earthModelAsset from '../../assets/model/earth.glb?url';
import planeModelAsset from '../../assets/model/plane.glb?url';

export const LONG_DISTANCE_ASSETS = Object.freeze({
  earthModel: earthModelAsset,
  planeModel: planeModelAsset
});

function preloadAsset(src) {
  return fetch(src, { credentials: 'same-origin' }).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to preload asset: ${src}`);
    }

    return response.blob();
  });
}

export function registerLongDistanceAssets(registry) {
  registry.register({
    id: 'long-distance-earth-model',
    load: () => preloadAsset(LONG_DISTANCE_ASSETS.earthModel)
  });

  registry.register({
    id: 'long-distance-plane-model',
    load: () => preloadAsset(LONG_DISTANCE_ASSETS.planeModel)
  });
}
