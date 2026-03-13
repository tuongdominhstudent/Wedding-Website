import calendarArt from '../../assets/firsts/date.webp';
import heroPortrait from '../../assets/weddingPhotos/hero.webp';
import invitationPortrait from '../../assets/weddingPhotos/1.webp';
import shapePortrait from '../../assets/weddingPhotos/2.webp';
import { getSectionPreloadStrategy } from '../../config/sectionRegistry';

export const CALENDAR_ASSETS = Object.freeze({
  calendarArt,
  heroPortrait,
  invitationPortrait,
  shapePortrait
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

export function registerCalendarAssets(registry) {
  const tier = getSectionPreloadStrategy('calendar');

  Object.entries(CALENDAR_ASSETS).forEach(([key, src]) => {
    registry.register({
      id: `calendar-${key}`,
      sectionId: 'calendar',
      tier,
      load: () => preloadImage(src)
    });
  });
}
