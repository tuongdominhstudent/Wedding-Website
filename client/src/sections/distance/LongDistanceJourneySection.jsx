import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from '../../motion/gsap/gsapConfig';
import LongDistanceGlobeScene from './LongDistanceGlobeScene';
import { LONG_DISTANCE_SECTION } from './longDistanceJourney.constants';
import styles from './LongDistanceJourneySection.module.css';
import heroImage from '../../assets/weddingPhotos/hero.webp';
import invitationImage from '../../assets/weddingPhotos/1.webp';
import shapeImage from '../../assets/weddingPhotos/2.webp';
import brideImage from '../../assets/weddingPhotos/bride.webp';
import groomImage from '../../assets/weddingPhotos/groom.webp';

const FILL_START = 0.92;

function LongDistanceJourneySection() {
  // Ref-based progress — no React reconciliation on every scroll tick
  const progressRef = useRef(0);
  // textVisible state: flips only once at the 0.7 fill threshold
  const [textVisible, setTextVisible] = useState(false);
  const isMobile = window.matchMedia('(max-width: 64rem)').matches;

  // Previous flag values — avoid redundant DOM writes
  const prevFlagsRef = useRef({
    distanceVisible: false,
    tripsVisible: false,
    daysVisible: false,
    homeVisible: false,
    textVisible: false
  });

  // DOM element refs for direct imperative updates (zero React reconciliation)
  const fillOverlayRef = useRef(null);
  const heroImgRef = useRef(null);
  const tripsSpanRef = useRef(null);
  const daysSpanRef = useRef(null);
  const distanceLineRef = useRef(null);
  const tripsLineRef = useRef(null);
  const daysLineRef = useRef(null);
  const homeLineRef = useRef(null);

  // Precomputed fill-circle diagonal (updated on resize)
  const diagonalRef = useRef(Math.hypot(window.innerWidth, window.innerHeight) * 1.1);

  // Moscow screen position — written by R3F scene each frame
  const moscowPosRef = useRef({ x: window.innerWidth * 0.72, y: window.innerHeight * 0.38 });
  const canvasFrameRef = useRef(null);
  const canvasRectRef = useRef(null);
  const handleMoscowPos = useCallback((x, y) => {
    if (!canvasRectRef.current && canvasFrameRef.current) {
      canvasRectRef.current = canvasFrameRef.current.getBoundingClientRect();
    }
    const offset = canvasRectRef.current ?? { left: 0, top: 0 };
    moscowPosRef.current = { x: offset.left + x, y: offset.top + y };
  }, []);

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
            const p = progressState.value;
            progressRef.current = p;

            const thresholds = LONG_DISTANCE_SECTION.revealThresholds;
            const flags = prevFlagsRef.current;

            // Text line active classes — only toggle on threshold crossing
            const distanceVisible = p >= thresholds.distance;
            if (distanceVisible !== flags.distanceVisible) {
              flags.distanceVisible = distanceVisible;
              distanceLineRef.current?.classList.toggle(styles.textLineActive, distanceVisible);
            }

            const tripsVisible = p >= thresholds.trips;
            if (tripsVisible !== flags.tripsVisible) {
              flags.tripsVisible = tripsVisible;
              tripsLineRef.current?.classList.toggle(styles.textLineActive, tripsVisible);
            }

            const daysVisible = p >= thresholds.days;
            if (daysVisible !== flags.daysVisible) {
              flags.daysVisible = daysVisible;
              daysLineRef.current?.classList.toggle(styles.textLineActive, daysVisible);
            }

            const homeVisible = p >= thresholds.home;
            if (homeVisible !== flags.homeVisible) {
              flags.homeVisible = homeVisible;
              homeLineRef.current?.classList.toggle(styles.textLineActive, homeVisible);
            }

            // Counter values — direct textContent (no React reconciliation per digit)
            if (tripsSpanRef.current) {
              const tripsValue = Math.round(
                gsap.utils.clamp(0, 1, (p - thresholds.trips) / 0.18) * LONG_DISTANCE_SECTION.counters.trips
              );
              tripsSpanRef.current.textContent = tripsValue;
            }

            if (daysSpanRef.current) {
              const daysValue = Math.round(
                gsap.utils.clamp(0, 1, (p - thresholds.days) / 0.2) * LONG_DISTANCE_SECTION.counters.days
              );
              daysSpanRef.current.textContent = daysValue;
            }

            // Fill overlay — direct clipPath update (no React reconciliation per frame)
            const fillFactor = Math.max(0, (p - FILL_START) / (1 - FILL_START));
            if (fillOverlayRef.current) {
              if (fillFactor > 0) {
                const radius = diagonalRef.current * fillFactor;
                const { x, y } = moscowPosRef.current;
                fillOverlayRef.current.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;
                fillOverlayRef.current.style.display = '';
              } else {
                fillOverlayRef.current.style.display = 'none';
              }
            }

            // Hero image opacity — direct style update
            if (heroImgRef.current) {
              heroImgRef.current.style.opacity = Math.max(0, Math.min(1, (fillFactor - 0.3) / 0.7));
            }

            // Text overlay transition — state update happens only once
            const shouldShowText = fillFactor >= 0.7;
            if (shouldShowText !== flags.textVisible) {
              flags.textVisible = shouldShowText;
              setTextVisible(shouldShowText);
            }
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

  // Invalidate cached canvas rect and recompute fill diagonal on resize
  useEffect(() => {
    const handleResize = () => {
      canvasRectRef.current = null;
      diagonalRef.current = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <section
        id="long-distance-journey"
        className={styles.section}
        aria-label="Long distance journey from Hanoi to Moscow"
      >
        <div className={styles.stage}>
          <div className={styles.copyColumn}>
            <div className={styles.copyStack}>
              <div ref={distanceLineRef} className={styles.textLine}>
                <div className={styles.statLine}>
                  Hơn 9000<span className={styles.unit}>km</span>
                </div>
              </div>

              <div ref={tripsLineRef} className={styles.textLine}>
                <div className={styles.statLine}>
                  <span ref={tripsSpanRef}>0</span><span className={styles.unit}>chuyến đi</span>
                </div>
              </div>

              <div ref={daysLineRef} className={styles.textLine}>
                <div className={styles.statLine}>
                  <span ref={daysSpanRef}>0</span><span className={styles.unit}>ngày yêu xa</span>
                </div>
              </div>

              <div ref={homeLineRef} className={styles.textLine}>
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
                  <LongDistanceGlobeScene
                    progressRef={progressRef}
                    isMobile={isMobile}
                    onMoscowPos={handleMoscowPos}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>

        {/* Always in DOM — shown/hidden via direct style.display in GSAP onUpdate */}
        <div
          ref={fillOverlayRef}
          className={styles.fillOverlay}
          style={{ display: 'none' }}
        >
          <div className={styles.heroPanel}>
            <img
              ref={heroImgRef}
              src={heroImage}
              alt=""
              className={styles.heroImage}
              style={{ opacity: 0 }}
            />
            <div className={`${styles.textOverlay} ${textVisible ? styles.textOverlayVisible : ''}`}>
              <p className={styles.saveTheDate}>Save the Date</p>
              <p className={styles.ourLabel}>Our</p>
              <h1 className={styles.weddingTitle}>WEDDING</h1>
              <p className={styles.coupleName}>Minh Tường — Thảo Nguyên</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.postSection} aria-label="Wedding invitation details">
        <div className={styles.invitationSection} aria-label="Wedding invitation section">
          <p className={styles.invitationLabel}>WEDDING INVITATION 2027</p>
        </div>

        <div className={styles.invitationImageSection} aria-label="Wedding invitation photo">
          <img src={invitationImage} alt="Wedding invitation portrait" className={styles.invitationImage} />
        </div>

        <div className={styles.shapeSection} aria-label="Everything shape section">
          <h2 className={styles.shapeTitle}>EVERYTHINGSHAPE</h2>
          <img src={shapeImage} alt="Editorial wedding portrait" className={styles.shapeImage} />
        </div>

        <section className={styles.invitationDetailSection} aria-label="Invitation details">
          <div className={styles.invitationHeader}>
            <p className={styles.invitationKicker}>THƯ MỜI TIỆC CƯỚI</p>
            <div className={styles.invitationDivider} aria-hidden="true" />
            <p className={styles.invitationTime}>THỨ BẢY - 10:00</p>
            <p className={styles.invitationDate}>10/7/2027</p>
            <div className={styles.invitationDivider} aria-hidden="true" />
          </div>

          <div className={styles.invitationSplit}>
            <article className={styles.invitationSide}>
              <p className={styles.invitationSideLabel}>NHÀ GÁI</p>
              <img src={brideImage} alt="Bride portrait" className={styles.invitationPortrait} />
              <p className={styles.invitationRole}>BRIDE</p>
            </article>

            <article className={styles.invitationSide}>
              <p className={styles.invitationSideLabel}>NHÀ TRAI</p>
              <img src={groomImage} alt="Groom portrait" className={styles.invitationPortrait} />
              <p className={styles.invitationRole}>GROOM</p>
            </article>
          </div>

          <p className={styles.invitationNames}>
            <span>Thảo Nguyên</span>
            <span className={styles.heartIcon} aria-hidden="true">♥</span>
            <span>Minh Tường</span>
          </p>

          <p className={styles.invitationSignature}>Everythingshape</p>
        </section>
      </section>
    </>
  );
}

export default LongDistanceJourneySection;
