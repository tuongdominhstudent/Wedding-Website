const QUALITY = Object.freeze({
  mobile: {
    dpr: [1, 1.5],
    antialias: false
  },
  desktop: {
    dpr: [1, 2],
    antialias: true
  }
});

export function getQualityProfile() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  return isMobile ? QUALITY.mobile : QUALITY.desktop;
}
