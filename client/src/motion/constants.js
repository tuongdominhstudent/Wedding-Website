export const MOTION = Object.freeze({
  durations: {
    instant: 0,
    fast: 0.28,
    base: 0.6,
    slow: 1,
    cinematic: 1.4
  },
  easings: {
    standard: 'power2.out',
    smoothInOut: 'power2.inOut',
    dramaticOut: 'expo.out',
    softIn: 'sine.in'
  },
  scroll: {
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1
  },
  lenis: {
    duration: 1.1,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.05,
    smoothWheel: true,
    smoothTouch: false
  }
});
