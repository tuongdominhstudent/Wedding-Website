import preweddingVideo from '../../assets/preweddingVideo.webm';
import { getSectionPreloadStrategy } from '../../config/sectionRegistry';

export const PREWEDDING_ASSETS = Object.freeze({
  video: preweddingVideo
});

function preloadVideo(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const onLoadedMetadata = () => {
      cleanup();
      resolve(src);
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to preload video: ${src}`));
    };
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
      video.src = '';
      video.load();
    };

    video.preload = 'metadata';
    video.playsInline = true;
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('error', onError);
    video.src = src;
    video.load();
  });
}

export function registerPreweddingAssets(registry) {
  const tier = getSectionPreloadStrategy('prewedding');

  registry.register({
    id: 'prewedding-video',
    sectionId: 'prewedding',
    tier,
    load: () => preloadVideo(PREWEDDING_ASSETS.video)
  });
}
