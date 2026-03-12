import introVideo from '../../assets/firstMeet.webm';
import introLastFrame from '../../assets/lastFrame.webp';
import introLeftImage from '../../assets/left.webp';
import introRightImage from '../../assets/right.webp';
import { getSectionPreloadStrategy } from '../../config/sectionRegistry';

export const INTRO_ASSETS = Object.freeze({
  video: introVideo,
  lastFrame: introLastFrame,
  leftImage: introLeftImage,
  rightImage: introRightImage
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

function preloadVideo(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const onLoadedData = () => {
      cleanup();
      resolve(src);
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to preload video: ${src}`));
    };
    const cleanup = () => {
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onError);
      video.src = '';
      video.load();
    };

    video.preload = 'auto';
    video.playsInline = true;
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onError);
    video.src = src;
    video.load();
  });
}

export function registerIntroAssets(registry) {
  const tier = getSectionPreloadStrategy('intro');

  registry.register({
    id: 'intro-video',
    sectionId: 'intro',
    tier,
    load: () => preloadVideo(INTRO_ASSETS.video)
  });

  registry.register({
    id: 'intro-last-frame-image',
    sectionId: 'intro',
    tier,
    load: () => preloadImage(INTRO_ASSETS.lastFrame)
  });

  registry.register({
    id: 'intro-left-image',
    sectionId: 'intro',
    tier,
    load: () => preloadImage(INTRO_ASSETS.leftImage)
  });

  registry.register({
    id: 'intro-right-image',
    sectionId: 'intro',
    tier,
    load: () => preloadImage(INTRO_ASSETS.rightImage)
  });
}
