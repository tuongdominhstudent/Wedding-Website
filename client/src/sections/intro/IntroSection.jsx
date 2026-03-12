import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, gsap } from '../../motion/gsap/gsapConfig';
import { useAppStore } from '../../stores/useAppStore';
import DarkVeil from '../../components/effects/DarkVeil';
import { INTRO_ASSETS } from './introAssets';
import { INTRO_SEQUENCE } from './intro.constants';
import styles from './IntroSection.module.css';

function IntroSection({ isBootReady, onSequenceComplete }) {
  const lenisInstance = useAppStore((state) => state.lenisInstance);

  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const videoShellRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const centerCardRef = useRef(null);
  const ringPathRef = useRef(null);
  const curvedLabelRef = useRef(null);
  const titleRef = useRef(null);
  const indicatorRef = useRef(null);
  const revealTimelineRef = useRef(null);
  const hasRevealedRef = useRef(false);
  const hasExitedRef = useRef(false);

  const [phase, setPhase] = useState('video');
  const [isSequenceDone, setIsSequenceDone] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [showEscapeAction, setShowEscapeAction] = useState(false);
  const [showFallbackStill, setShowFallbackStill] = useState(false);
  const hasArmedUnmuteRef = useRef(false);

  useEffect(() => {
    if (!isBootReady || !lenisInstance || isSequenceDone) {
      return undefined;
    }

    lenisInstance.stop();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      lenisInstance.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isBootReady, isSequenceDone, lenisInstance]);

  useEffect(() => {
    if (!isSequenceDone || !lenisInstance) {
      return;
    }

    lenisInstance.start();
    lenisInstance.resize?.();
    ScrollTrigger.refresh(true);
  }, [isSequenceDone, lenisInstance]);

  useEffect(() => {
    if (!isBootReady || isSequenceDone) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setShowEscapeAction(true);
    }, INTRO_SEQUENCE.escapeDelayMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isBootReady, isSequenceDone]);

  const completeIntroExit = (reason) => {
    if (hasExitedRef.current) {
      return;
    }

    hasExitedRef.current = true;
    setIsSequenceDone(true);
    onSequenceComplete?.(reason);
  };

  const attemptVideoPlay = () => {
    const video = videoRef.current;
    if (!video || phase !== 'video') {
      return;
    }

    video.defaultMuted = true;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise?.then) {
      playPromise.catch(() => {
        setPhase('fallback');
        setShowFallbackStill(true);
      });
    }
  };

  useEffect(() => {
    if (!isBootReady || hasArmedUnmuteRef.current) {
      return undefined;
    }

    hasArmedUnmuteRef.current = true;

    const tryUnmute = () => {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      video.muted = false;
      video.defaultMuted = false;
    };

    const onFirstGesture = () => {
      tryUnmute();
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('touchstart', onFirstGesture, { passive: true });
    window.addEventListener('keydown', onFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [isBootReady]);

  useEffect(() => {
    if (!isBootReady || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    video.currentTime = 0;
    attemptVideoPlay();
  }, [isBootReady]);

  useEffect(() => {
    if (!isSequenceDone || !rootRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShowIndicator(entry.isIntersecting && entry.intersectionRatio > 0.45);
      },
      { threshold: [0, 0.45, 0.65, 1] }
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [isSequenceDone]);

  const runRevealSequence = () => {
    if (!videoRef.current || !videoShellRef.current || hasRevealedRef.current || hasExitedRef.current) {
      return;
    }

    hasRevealedRef.current = true;
    setPhase('revealing');

    const video = videoRef.current;
    const isMobile = window.matchMedia('(max-width: 48rem)').matches;
    const mobilePercent = isMobile ? { xPercent: -50, yPercent: -50 } : {};
    const sideOffsetX = isMobile
      ? INTRO_SEQUENCE.sideCardOffsetXMobile
      : INTRO_SEQUENCE.sideCardOffsetXDesktop;
    const sideCardLift = isMobile
      ? INTRO_SEQUENCE.sideCardLiftMobile
      : INTRO_SEQUENCE.sideCardLiftDesktop;
    const sideCardDrop = isMobile
      ? INTRO_SEQUENCE.sideCardDropMobile
      : INTRO_SEQUENCE.sideCardDropDesktop;
    const photoShiftX = isMobile
      ? INTRO_SEQUENCE.photoShiftXMobile
      : INTRO_SEQUENCE.photoShiftXDesktop;
    const photoShiftY = isMobile
      ? INTRO_SEQUENCE.photoShiftYMobile
      : INTRO_SEQUENCE.photoShiftYDesktop;
    const stackShiftX = isMobile
      ? INTRO_SEQUENCE.stackShiftXMobile
      : INTRO_SEQUENCE.stackShiftXDesktop;
    const centerCardShiftX = isMobile
      ? INTRO_SEQUENCE.centerCardShiftXMobile
      : INTRO_SEQUENCE.centerCardShiftXDesktop;
    const centerCardShiftY = isMobile
      ? INTRO_SEQUENCE.centerCardShiftYMobile
      : INTRO_SEQUENCE.centerCardShiftYDesktop;
    const centerShiftX = isMobile
      ? INTRO_SEQUENCE.videoCardShiftXMobile
      : INTRO_SEQUENCE.videoCardShiftXDesktop;
    const centerScale = isMobile
      ? INTRO_SEQUENCE.videoCardScaleMobile
      : INTRO_SEQUENCE.videoCardScaleDesktop;
    const centerShiftY = isMobile
      ? INTRO_SEQUENCE.videoCardShiftYMobile
      : INTRO_SEQUENCE.videoCardShiftYDesktop;

    video.pause();
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.max(0, video.duration - 0.04);
    }

    const ringLength = ringPathRef.current?.getTotalLength?.() || 0;

    gsap.set([leftCardRef.current, rightCardRef.current, centerCardRef.current], {
      autoAlpha: 0,
      ...mobilePercent,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.8
    });
    gsap.set([ringPathRef.current, curvedLabelRef.current, indicatorRef.current], {
      autoAlpha: 0,
      y: 18
    });
    gsap.set(titleRef.current, {
      autoAlpha: 0,
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 18
    });

    if (ringPathRef.current && ringLength > 0) {
      gsap.set(ringPathRef.current, {
        strokeDasharray: ringLength,
        strokeDashoffset: ringLength
      });
    }

    revealTimelineRef.current = gsap.timeline({
      defaults: {
        ease: 'power3.inOut'
      },
      onComplete: () => {
        setPhase('final');
        setIsSequenceDone(true);
        setShowIndicator(true);
        completeIntroExit('completed');
      }
    });

    revealTimelineRef.current
      .to(videoShellRef.current, {
        scale: centerScale,
        x: stackShiftX + centerShiftX,
        y: centerShiftY,
        duration: 1.3,
        borderRadius: 24
      })
      .to(
        centerCardRef.current,
        {
          autoAlpha: 1,
          ...mobilePercent,
          x: stackShiftX + centerCardShiftX,
          y: centerCardShiftY,
          scale: 1,
          duration: 0.55
        },
        '-=0.45'
      )
      .to(
        videoShellRef.current,
        {
          autoAlpha: 0,
          duration: 0.45
        },
        '<'
      )
      .to(
        leftCardRef.current,
        {
          autoAlpha: 1,
          ...mobilePercent,
          x: stackShiftX - sideOffsetX + photoShiftX,
          y: centerCardShiftY - sideCardLift + photoShiftY,
          rotation: -14,
          scale: 1,
          duration: 1.4,
          ease: 'expo.out'
        },
        '-=0.5'
      )
      .to(
        rightCardRef.current,
        {
          autoAlpha: 1,
          ...mobilePercent,
          x: stackShiftX + sideOffsetX + photoShiftX,
          y: centerCardShiftY + sideCardDrop + photoShiftY,
          rotation: 12,
          scale: 1,
          duration: 1.4,
          ease: 'expo.out'
        },
        '<'
      )
      .to(
        ringPathRef.current,
        {
          autoAlpha: 1,
          y: 0,
          strokeDashoffset: 0,
          duration: INTRO_SEQUENCE.ringDrawDuration,
          ease: 'power2.out'
        },
        '-=1.1'
      )
      .to(
        curvedLabelRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7
        },
        '-=0.95'
      )
      .to(
        titleRef.current,
        {
          autoAlpha: 1,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          duration: 0.85
        },
        '-=0.5'
      )
      .to(
        indicatorRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65
        },
        '-=0.15'
      );
  };

  useEffect(
    () => () => {
      revealTimelineRef.current?.kill();
    },
    []
  );

  const handleEscapeAction = () => {
    const video = videoRef.current;
    revealTimelineRef.current?.kill();
    if (video) {
      video.pause();
    }

    setPhase('fallback');
    setShowFallbackStill(true);
    setShowIndicator(true);
    completeIntroExit('escaped');
  };

  const handleVideoFailure = () => {
    if (hasExitedRef.current) {
      return;
    }

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    setPhase('fallback');
    setShowFallbackStill(true);
  };

  return (
    <section ref={rootRef} className={styles.introSection} data-phase={phase} aria-label="Intro section">
      <div className={styles.landscapeGuard}>
        <p>Vui lòng xoay dọc màn hình để tiếp tục.</p>
      </div>

      <div className={styles.introCanvas}>
        <div className={styles.backgroundEffect} aria-hidden="true">
          <DarkVeil
            speed={0.44}
            noiseIntensity={0.028}
            scanlineIntensity={0.022}
            scanlineFrequency={1.12}
            warpAmount={0.12}
            colorA="#320010"
            colorB="#490018"
            colorC="#9d806e"
          />
        </div>

        <div className={styles.ringWrap} aria-hidden="true">
          <svg className={styles.ringSvg} viewBox="0 0 420 420">
            <circle ref={ringPathRef} cx="210" cy="210" r="162" className={styles.ringPath} />
          </svg>
        </div>

        <div ref={curvedLabelRef} className={styles.curvedLabel} aria-hidden="true">
          <svg viewBox="0 0 420 180" className={styles.curvedSvg}>
            <defs>
              <path id="intro-curve-path" d="M 88 128 Q 210 76 332 128" />
            </defs>
            <text className={styles.curvedText}>
              <textPath href="#intro-curve-path" startOffset="50%" textAnchor="middle">
                EVERYTHINGSHAPE
              </textPath>
            </text>
          </svg>
        </div>

        <div ref={leftCardRef} className={`${styles.sideCard} ${styles.leftCard}`}>
          <img src={INTRO_ASSETS.leftImage} alt="" loading="eager" decoding="async" />
        </div>

        <div ref={rightCardRef} className={`${styles.sideCard} ${styles.rightCard}`}>
          <img src={INTRO_ASSETS.rightImage} alt="" loading="eager" decoding="async" />
        </div>

        <div ref={centerCardRef} className={styles.centerCard}>
          <img src={INTRO_ASSETS.lastFrame} alt="" loading="eager" decoding="async" />
        </div>

        <div ref={videoShellRef} className={styles.videoShell}>
          {showFallbackStill ? (
            <img
              className={styles.fallbackStill}
              src={INTRO_ASSETS.lastFrame}
              alt="Khoanh khac mo dau"
              loading="eager"
              decoding="async"
            />
          ) : (
            <video
              ref={videoRef}
              className={styles.introVideo}
              src={INTRO_ASSETS.video}
              playsInline
              preload="auto"
              autoPlay
              muted
              onLoadedData={attemptVideoPlay}
              onEnded={runRevealSequence}
              onError={handleVideoFailure}
            />
          )}
          {showEscapeAction && !isSequenceDone ? (
            <button type="button" className={styles.escapeButton} onClick={handleEscapeAction}>
              {INTRO_SEQUENCE.romanticContinueLabel}
            </button>
          ) : null}
        </div>

        <h1 ref={titleRef} className={styles.title}>
          Tấm ảnh đầu tiên
        </h1>

        <div
          ref={indicatorRef}
          className={`${styles.scrollIndicator} ${showIndicator ? styles.visible : ''}`}
          aria-hidden={!showIndicator}
        >
          <span>SCROLL DOWN</span>
          <span className={styles.arrow} />
        </div>
      </div>
    </section>
  );
}

export default IntroSection;
