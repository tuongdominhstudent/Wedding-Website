import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from '../../motion/gsap/gsapConfig';
import LongDistanceGlobeScene from './LongDistanceGlobeScene';
import { LONG_DISTANCE_SECTION } from './longDistanceJourney.constants';
import styles from './LongDistanceJourneySection.module.css';
import heroImage from '../../assets/weddingPhotos/hero.webp';

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
  const [textVisible, setTextVisible] = useState(false);
  const isMobile = window.matchMedia('(max-width: 64rem)').matches;
  const lineState = useMemo(() => buildLineState(progress), [progress]);

  // Moscow screen position is updated each frame from the R3F scene (no re-render needed)
  const moscowPosRef = useRef({ x: window.innerWidth * 0.72, y: window.innerHeight * 0.38 });
  // Cache the canvas frame's page offset so projected coords can be translated to section-relative coords.
  // Read once when the fill starts (section is pinned so position doesn't change during animation).
  const canvasFrameRef = useRef(null);
  const canvasRectRef = useRef(null);
  const handleMoscowPos = useCallback((x, y) => {
    if (!canvasRectRef.current && canvasFrameRef.current) {
      canvasRectRef.current = canvasFrameRef.current.getBoundingClientRect();
    }
    const offset = canvasRectRef.current ?? { left: 0, top: 0 };
    moscowPosRef.current = { x: offset.left + x, y: offset.top + y };
  }, []);

  const FILL_START = 0.92;
  const fillFactor = Math.max(0, (progress - FILL_START) / (1 - FILL_START));

  // Trigger text CSS transitions once the fill is substantial
  useEffect(() => {
    if (fillFactor >= 0.7 && !textVisible) {
      setTextVisible(true);
    }
    if (fillFactor < 0.05) {
      setTextVisible(false);
    }
  }, [fillFactor, textVisible]);

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

      timeline
        .to(progressState, {
          value: 1,
          duration: 0.93,
          onUpdate: () => {
            setProgress(progressState.value);
          }
        })
        // Hold at the end so the user has time to see the full image before the section unpins
        .to({}, { duration: 0.07 });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [isMobile]);

  // Invalidate cached canvas rect on resize so Moscow overlay origin stays accurate
  useEffect(() => {
    const handleResize = () => { canvasRectRef.current = null; };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <div className={styles.canvasFrame} ref={canvasFrameRef}>
            <Canvas
              className={styles.globeCanvas}
              camera={{ position: [0.3, 0.12, 8.2], fov: 28 }}
              dpr={[1, 1.8]}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <LongDistanceGlobeScene progress={progress} isMobile={isMobile} onMoscowPos={handleMoscowPos} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {fillFactor > 0 && (
        <div
          className={styles.fillOverlay}
          style={{
            clipPath: `circle(${
              Math.hypot(window.innerWidth, window.innerHeight) * 1.1 * fillFactor
            }px at ${moscowPosRef.current.x}px ${moscowPosRef.current.y}px)`
          }}
        >
          <img
            src={heroImage}
            alt=""
            className={styles.heroImage}
            style={{ opacity: Math.max(0, Math.min(1, (fillFactor - 0.3) / 0.7)) }}
          />
          <div className={`${styles.textOverlay} ${textVisible ? styles.textOverlayVisible : ''}`}>
            <p className={styles.saveTheDate}>Save the Date</p>
            <h1 className={styles.weddingTitle}>WEDDING</h1>
            <p className={styles.coupleName}>Minh Tường — Thảo Nguyên</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default LongDistanceJourneySection;
