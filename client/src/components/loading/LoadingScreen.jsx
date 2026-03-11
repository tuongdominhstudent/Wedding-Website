import { useEffect, useRef, useState } from 'react';
import backgroundImage from '../../assets/background-loading-screen.webp';
import riderImage from '../../assets/character-loading-screen.webp';
import { gsap } from '../../motion/gsap/gsapConfig';
import { MOTION } from '../../motion/constants';
import { PRELOADER_CONFIG } from '../../config/preloaderConfig';
import styles from './LoadingScreen.module.css';

function LoadingScreen({ isActive }) {
  const containerRef = useRef(null);
  const riderTrackRef = useRef(null);
  const riderBodyRef = useRef(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!isMounted || !isActive || !riderTrackRef.current || !riderBodyRef.current) {
      return undefined;
    }

    const viewportWidth = window.innerWidth;
    const riderWidth = riderTrackRef.current.getBoundingClientRect().width;
    const minX = -riderWidth * 1.15;
    const maxX = viewportWidth + riderWidth * 0.25;

    const riderTimeline = gsap.timeline();
    riderTimeline.fromTo(
      riderTrackRef.current,
      { x: minX },
      {
        x: maxX,
        duration: PRELOADER_CONFIG.simulatedMinDurationMs / 1000,
        ease: 'none'
      }
    );

    const riderBodyTween = gsap.to(riderBodyRef.current, {
      y: -6,
      rotation: -1.5,
      duration: PRELOADER_CONFIG.riderBobDuration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '45% 75%',
      force3D: true
    });

    return () => {
      riderTimeline.kill();
      riderBodyTween.kill();
    };
  }, [isActive, isMounted]);

  useEffect(() => {
    if (!isMounted || isActive || !containerRef.current) {
      return undefined;
    }

    const exitTimeline = gsap.timeline({
      defaults: {
        ease: MOTION.easings.smoothInOut
      },
      onComplete: () => {
        setIsMounted(false);
      }
    });

    exitTimeline.to(containerRef.current, {
      autoAlpha: 0,
      duration: PRELOADER_CONFIG.exitDuration
    });

    return () => {
      exitTimeline.kill();
    };
  }, [isActive, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.overlay} aria-live="polite" aria-busy={isActive}>
      <div className={styles.sceneLayer}>
        <img
          className={styles.background}
          src={backgroundImage}
          alt=""
          draggable="false"
          loading="eager"
          decoding="async"
        />
        <div ref={riderTrackRef} className={styles.riderTrack} aria-hidden="true">
          <div ref={riderBodyRef} className={styles.riderBody}>
            <img className={styles.rider} src={riderImage} alt="" draggable="false" loading="eager" />
          </div>
        </div>
        <div className={styles.sceneScrim} />
      </div>

      <div className={styles.loader} role="status" aria-label="loading">
        <span className={styles.loaderText}>loading</span>
        <span className={styles.load} />
      </div>
    </div>
  );
}

export default LoadingScreen;
