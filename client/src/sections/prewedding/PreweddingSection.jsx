import React from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../../motion/gsap/gsapConfig';
import { PREWEDDING_ASSETS } from './preweddingAssets';
import styles from './PreweddingSection.module.css';

function PreweddingSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const copyRailRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    const video = videoRef.current;

    if (!root || !video) {
      return undefined;
    }

    const playIfPossible = () => {
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playIfPossible();
          return;
        }

        video.pause();
      },
      {
        threshold: 0.45
      }
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(copyRailRef.current, {
        autoAlpha: 0,
        y: 22
      });

      gsap.set(stageRef.current, {
        autoAlpha: 0,
        y: 34,
        scale: 0.94,
        rotateZ: -1.2
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out'
        },
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          toggleActions: 'play none none reverse'
        }
      });

      timeline
        .to(copyRailRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8
        })
        .to(
          stageRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            duration: 1.05
          },
          '-=0.5'
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="prewedding-section"
      className={styles.section}
      aria-label="Prewedding video section"
    >
      <div className={styles.backdropGlow} aria-hidden="true" />
      <div className={styles.inner}>
        <div ref={copyRailRef} className={styles.copyRail}>
          <p className={styles.kicker}>Prewedding Film</p>
          <h2 className={styles.title}>
            Lời hẹn ước ở
            <span className={styles.titleLine}>xứ sở Bạch dương</span>
          </h2>
          <p className={styles.lede}>
            Dành hết cho em <span className={styles.heart} aria-hidden="true">♥</span>
          </p>
        </div>

        <div ref={stageRef} className={styles.stage}>
          <div className={styles.sideMark} aria-hidden="true">
            Film 2027
          </div>
          <video
            ref={videoRef}
            className={styles.video}
            src={PREWEDDING_ASSETS.video}
            playsInline
            loop
            preload="metadata"
            aria-label="Prewedding video"
          />
        </div>
      </div>
    </section>
  );
}

export default PreweddingSection;
