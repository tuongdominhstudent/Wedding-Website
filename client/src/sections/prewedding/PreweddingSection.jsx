import React from 'react';
import { useEffect, useRef } from 'react';
import { PREWEDDING_ASSETS } from './preweddingAssets';
import styles from './PreweddingSection.module.css';

function PreweddingSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    const video = videoRef.current;

    if (!root || !video) {
      return undefined;
    }

    video.defaultMuted = true;
    video.muted = true;

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

  return (
    <section
      ref={sectionRef}
      id="prewedding-section"
      className={styles.section}
      aria-label="Prewedding video section"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Prewedding Film</p>
          <h2 className={styles.title}>A Quiet Chapter Before The Day</h2>
          <p className={styles.lede}>
            Một thước phim nhỏ để giữ lại những khoảnh khắc dịu dàng nhất trước khi chúng ta bước
            vào ngày cưới.
          </p>
          <div className={styles.details} aria-label="Prewedding notes">
            <span className={styles.pill}>Mobile first</span>
            <span className={styles.pill}>Muted autoplay</span>
            <span className={styles.pill}>Viewport-aware</span>
          </div>
        </div>

        <div className={styles.frame}>
          <video
            ref={videoRef}
            className={styles.video}
            src={PREWEDDING_ASSETS.video}
            playsInline
            muted
            loop
            preload="metadata"
            aria-label="Prewedding video"
          />
          <p className={styles.caption}>Our prewedding film</p>
        </div>
      </div>
    </section>
  );
}

export default PreweddingSection;
