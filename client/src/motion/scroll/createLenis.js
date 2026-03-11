import Lenis from 'lenis';
import { MOTION } from '../constants';

export function createLenis(options = {}) {
  return new Lenis({
    duration: MOTION.lenis.duration,
    smoothWheel: MOTION.lenis.smoothWheel,
    smoothTouch: MOTION.lenis.smoothTouch,
    wheelMultiplier: MOTION.lenis.wheelMultiplier,
    touchMultiplier: MOTION.lenis.touchMultiplier,
    ...options
  });
}
