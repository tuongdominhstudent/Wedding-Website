import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '../constants';

let isGsapInitialized = false;

export function initializeGsap() {
  if (isGsapInitialized) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    duration: MOTION.durations.base,
    ease: MOTION.easings.standard
  });

  ScrollTrigger.config({
    ignoreMobileResize: true
  });

  isGsapInitialized = true;
}

export { gsap, ScrollTrigger };
