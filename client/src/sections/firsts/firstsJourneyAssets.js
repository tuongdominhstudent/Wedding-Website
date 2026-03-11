import ridingAsset from '../../assets/riding.webp';
import dateAsset from '../../assets/firsts/date.webp';
import flowerAsset from '../../assets/firsts/flower.webp';
import hangOutAsset from '../../assets/firsts/hangOut.webp';
import holdHandAsset from '../../assets/firsts/holdHand.webp';
import tripAsset from '../../assets/firsts/trip.webp';

export const FIRSTS_ASSETS = Object.freeze({
  rider: ridingAsset,
  milestonePhotos: Object.freeze({
    hangOut: hangOutAsset,
    holdHand: holdHandAsset,
    date: dateAsset,
    flower: flowerAsset,
    trip: tripAsset
  })
});

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(src);
    image.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    image.src = src;
  });
}

export function registerFirstsAssets(registry) {
  registry.register({
    id: 'firsts-rider-image',
    load: () => preloadImage(FIRSTS_ASSETS.rider)
  });

  Object.entries(FIRSTS_ASSETS.milestonePhotos).forEach(([key, src]) => {
    registry.register({
      id: `firsts-milestone-${key}`,
      load: () => preloadImage(src)
    });
  });
}
