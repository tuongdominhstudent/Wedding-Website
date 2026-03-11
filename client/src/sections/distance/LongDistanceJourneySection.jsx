import { Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from '../../motion/gsap/gsapConfig';
import LongDistanceGlobeScene from './LongDistanceGlobeScene';
import { LONG_DISTANCE_SECTION } from './longDistanceJourney.constants';
import styles from './LongDistanceJourneySection.module.css';

function buildLineState(progress) {
  const thresholds = LONG_DISTANCE_SECTION.revealThresholds;

  return {
    distanceVisible: progress >= thresholds.distance,
    tripsVisible: progress >= thresholds.trips,
    daysVisible: progress >= thresholds.days,
    homeVisible: progress >= thresholds.home,
    tripsValue: Math.round(
      gsap.utils.clamp(0, 1, (progress - thresholds.trips) / 0.18) * LONG_DISTANCE_SECTION.counters.trips
    ),
    daysValue: Math.round(
      gsap.utils.clamp(0, 1, (progress - thresholds.days) / 0.2) * LONG_DISTANCE_SECTION.counters.days
    )
  };
}

function LongDistanceJourneySection() {
  const [progress, setProgress] = useState(0);
  const isMobile = window.matchMedia('(max-width: 64rem)').matches;
  const lineState = useMemo(() => buildLineState(progress), [progress]);

  useLayoutEffect(() => {
    const root = document.getElementById('long-distance-journey');

    if (!root) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const progressState = { value: 0 };
      const pinDistanceMultiplier = isMobile
        ? LONG_DISTANCE_SECTION.pinDistanceMobile
        : LONG_DISTANCE_SECTION.pinDistanceDesktop;

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none'
        },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * pinDistanceMultiplier}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline.to(progressState, {
        value: 1,
        duration: 1,
        onUpdate: () => {
          setProgress(progressState.value);
        }
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="long-distance-journey"
      className={styles.section}
      aria-label="Long distance journey from Hanoi to Moscow"
    >
      <div className={styles.stage}>
        <div className={styles.copyColumn}>
          <div className={styles.copyStack}>
            <div className={`${styles.textLine} ${lineState.distanceVisible ? styles.textLineActive : ''}`}>
              <div className={styles.statLine}>
                Hơn 9000<span className={styles.unit}>km</span>
              </div>
            </div>

            <div className={`${styles.textLine} ${lineState.tripsVisible ? styles.textLineActive : ''}`}>
              <div className={styles.statLine}>
                {lineState.tripsValue}<span className={styles.unit}>chuyến đi</span>
              </div>
            </div>

            <div className={`${styles.textLine} ${lineState.daysVisible ? styles.textLineActive : ''}`}>
              <div className={styles.statLine}>
                {lineState.daysValue}<span className={styles.unit}>ngày yêu xa</span>
              </div>
            </div>

            <div className={`${styles.textLine} ${lineState.homeVisible ? styles.textLineActive : ''}`}>
              <div className={styles.finalLine}>
                <span>Và chúng ta đã về </span>
                <span className={styles.finalLineBreak}>chung một nhà</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sceneColumn}>
          <div className={styles.canvasFrame}>
            <Canvas
              className={styles.globeCanvas}
              camera={{ position: [0.3, 0.12, 8.2], fov: 28 }}
              dpr={[1, 1.8]}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <LongDistanceGlobeScene progress={progress} isMobile={isMobile} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LongDistanceJourneySection;
