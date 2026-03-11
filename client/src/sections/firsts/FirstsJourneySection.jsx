import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../motion/gsap/gsapConfig';
import { FIRSTS_ASSETS } from './firstsJourneyAssets';
import { FIRSTS_SECTION } from './firstsJourney.constants';
import styles from './FirstsJourneySection.module.css';

function FirstsJourneySection() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const revealPathRef = useRef(null);
  const roadMaskPathRef = useRef(null);
  const riderGroupRef = useRef(null);
  const riderBobRef = useRef(null);
  const titleRef = useRef(null);
  const storyPanelRef = useRef(null);
  const storyContentRef = useRef(null);
  const storyLabelRef = useRef(null);
  const storyTextRef = useRef(null);
  const labelRefs = useRef([]);
  const activeStoryIdRef = useRef(null);
  const activeStoryIndexRef = useRef(-1);
  const [milestonePositions, setMilestonePositions] = useState([]);
  const [activeStoryId, setActiveStoryId] = useState(null);

  const milestones = useMemo(() => FIRSTS_SECTION.milestones, []);
  const storyMilestones = useMemo(() => milestones.filter((milestone) => milestone.story), [milestones]);
  const activeStory = useMemo(
    () => storyMilestones.find((milestone) => milestone.id === activeStoryId) || null,
    [activeStoryId, storyMilestones]
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const revealPath = revealPathRef.current;
    const roadMaskPath = roadMaskPathRef.current;
    const riderGroup = riderGroupRef.current;
    const riderBob = riderBobRef.current;

    if (!root || !stage || !svg || !path || !revealPath || !roadMaskPath || !riderGroup || !riderBob) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 48rem)').matches;
      const pathLength = path.getTotalLength();
      const riderState = { progress: 0 };
      const currentScale = isMobile ? FIRSTS_SECTION.riderScaleMobile : FIRSTS_SECTION.riderScaleDesktop;
      const storyActivationBuffer = FIRSTS_SECTION.storyActivationBuffer;

      const projectPoint = (point) => {
        const svgPoint = svg.createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;
        const transformed = svgPoint.matrixTransform(path.getScreenCTM());
        const stageBox = stage.getBoundingClientRect();

        return {
          x: transformed.x - stageBox.left,
          y: transformed.y - stageBox.top
        };
      };

      const updateRiderPosition = () => {
        const lengthAtProgress = pathLength * riderState.progress;
        const current = path.getPointAtLength(lengthAtProgress);

        riderGroup.setAttribute(
          'transform',
          `translate(${current.x} ${current.y}) scale(${currentScale})`
        );

        if (!isMobile && storyMilestones.length > 0) {
          let currentIndex = activeStoryIndexRef.current;

          if (currentIndex === -1) {
            if (riderState.progress >= storyMilestones[0].progress + storyActivationBuffer) {
              currentIndex = 0;
            }
          } else {
            const currentStory = storyMilestones[currentIndex];
            const nextStory = storyMilestones[currentIndex + 1] || null;
            const previousStory = storyMilestones[currentIndex - 1] || null;

            if (nextStory && riderState.progress >= nextStory.progress + storyActivationBuffer) {
              currentIndex += 1;
            } else if (
              riderState.progress < currentStory.progress - storyActivationBuffer
            ) {
              currentIndex = previousStory ? currentIndex - 1 : -1;
            }
          }

          const nextStoryId = currentIndex >= 0 ? storyMilestones[currentIndex].id : null;

          if (activeStoryIdRef.current !== nextStoryId) {
            activeStoryIndexRef.current = currentIndex;
            activeStoryIdRef.current = nextStoryId;
            setActiveStoryId(nextStoryId);
          }
        }

        milestones.forEach((milestone, index) => {
          const element = labelRefs.current[index];
          if (!element) {
            return;
          }

          const reveal = gsap.utils.clamp(
            0,
            1,
            (riderState.progress - milestone.progress) / FIRSTS_SECTION.milestoneRevealWindow
          );
          const easedReveal = gsap.parseEase('back.out(1.7)')(reveal);
          const opacity = reveal;
          const y = 22 - easedReveal * 22;
          const scale = 0.78 + easedReveal * 0.22;

          gsap.set(element, {
            autoAlpha: opacity,
            y,
            scale
          });
        });
      };

      const computeMilestonePositions = () => {
        const positions = milestones.map((milestone) => {
          const point = path.getPointAtLength(pathLength * milestone.progress);
          const projected = projectPoint(point);
          const dx = isMobile ? milestone.dx * 0.56 : milestone.dx;
          const dy = isMobile ? milestone.dy * 0.7 : milestone.dy;

          return {
            id: milestone.id,
            x: projected.x + dx,
            y: projected.y + dy,
            align: milestone.align
          };
        });

        setMilestonePositions(positions);
      };

      computeMilestonePositions();

      gsap.set(svg, {
        autoAlpha: 0
      });

      gsap.set(path, {
        autoAlpha: 0.18
      });

      gsap.set(revealPath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      gsap.set(roadMaskPath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      gsap.set(titleRef.current, {
        autoAlpha: 0,
        y: 18
      });

      if (storyPanelRef.current) {
        gsap.set(storyPanelRef.current, {
          autoAlpha: 0
        });
      }

      if (storyContentRef.current) {
        gsap.set(storyContentRef.current, {
          autoAlpha: 0,
          y: 14
        });
      }

      labelRefs.current.forEach((element) => {
        if (!element) {
          return;
        }

        gsap.set(element, {
          autoAlpha: 0,
          y: 18,
          scale: 0.72
        });
      });

      gsap.to(riderBob, {
        y: -9,
        duration: 0.82,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 70%'
      });

      updateRiderPosition();

      const pinDistanceMultiplier = isMobile
        ? FIRSTS_SECTION.pinDistanceMobile
        : FIRSTS_SECTION.pinDistanceDesktop;

      const enterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      enterTimeline.to(
        svg,
        {
          autoAlpha: 1,
          duration: 0.35,
          ease: 'power2.out'
        },
        0
      );

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none'
        },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * pinDistanceMultiplier}`,
          pin: true,
          scrub: 1.05,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline.to(
        [revealPath, roadMaskPath],
        {
          strokeDashoffset: 0,
          duration: 1
        },
        0
      );

      timeline.to(
        titleRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.12
        },
        0.02
      );

      timeline.to(
        riderState,
        {
          progress: 1,
          duration: 1,
          onUpdate: updateRiderPosition
        },
        0
      );

      const handleRefresh = () => {
        computeMilestonePositions();
        updateRiderPosition();
      };

      ScrollTrigger.addEventListener('refresh', handleRefresh);

      return () => {
        ScrollTrigger.removeEventListener('refresh', handleRefresh);
        enterTimeline.scrollTrigger?.kill();
        enterTimeline.kill();
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [milestones, storyMilestones]);

  useLayoutEffect(() => {
    const panel = storyPanelRef.current;
    const content = storyContentRef.current;
    const label = storyLabelRef.current;
    const text = storyTextRef.current;

    if (!panel || !content || !label || !text || window.matchMedia('(max-width: 64rem)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.killTweensOf([panel, content, label, text]);

      if (!activeStory) {
        const hideTimeline = gsap.timeline({
          defaults: {
            ease: 'power2.out'
          }
        });

        hideTimeline
          .to(content, {
            autoAlpha: 0,
            y: 10,
            duration: 0.18
          })
          .to(
            panel,
            {
              autoAlpha: 0,
              duration: 0.16
            },
            '-=0.05'
          );
        return;
      }

      label.textContent = activeStory.label;
      text.textContent = activeStory.story;

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out'
        }
      });

      timeline
        .to(panel, {
          autoAlpha: 1,
          duration: 0.16
        })
        .fromTo(
          content,
          {
            autoAlpha: 0,
            y: 12
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.28
          }
        );
    }, panel);

    return () => ctx.revert();
  }, [activeStory]);

  return (
    <section ref={rootRef} className={styles.section} aria-label="Nhung cai dau tien">
      <div ref={stageRef} className={styles.stage}>
        <header ref={titleRef} className={styles.header}>
          <p className={styles.eyebrow}>Journey of Firsts</p>
          <h2 className={styles.title}>NHỮNG CÁI ĐẦU TIÊN</h2>
        </header>

        <div className={styles.textureLayer} aria-hidden="true" />

        <aside ref={storyPanelRef} className={styles.storyPanel} aria-hidden={!activeStory}>
          <div ref={storyContentRef} className={styles.storyContent}>
            <p ref={storyLabelRef} className={styles.storyLabel} />
            <p ref={storyTextRef} className={styles.storyText} />
          </div>
        </aside>

        <svg
          ref={svgRef}
          className={styles.roadSvg}
          viewBox={FIRSTS_SECTION.viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <mask id="firsts-road-reveal-mask">
              <rect width="100%" height="100%" fill="black" />
              <path
                ref={roadMaskPathRef}
                d={FIRSTS_SECTION.path}
                className={styles.roadMaskPath}
              />
            </mask>
          </defs>

          <path ref={pathRef} id={FIRSTS_SECTION.pathId} className={styles.roadPathGhost} d={FIRSTS_SECTION.path} />
          <path
            className={styles.roadPath}
            d={FIRSTS_SECTION.path}
            mask="url(#firsts-road-reveal-mask)"
          />
          <path ref={revealPathRef} className={styles.roadPathReveal} d={FIRSTS_SECTION.path} />

          <g ref={riderGroupRef} className={styles.riderGroup}>
            <g ref={riderBobRef}>
              <image
                href={FIRSTS_ASSETS.rider}
                x="-128"
                y="-84"
                width="256"
                height="168"
                preserveAspectRatio="xMidYMid meet"
                className={styles.riderImage}
              />
            </g>
          </g>
        </svg>

        <div className={styles.labelsLayer} aria-hidden="true">
          {milestones.map((milestone, index) => {
            const position = milestonePositions[index];
            if (!position) {
              return null;
            }

            return (
              <div
                key={milestone.id}
                ref={(element) => {
                  labelRefs.current[index] = element;
                }}
                className={`${styles.milestone} ${
                  position?.align === 'left' ? styles.alignLeft : styles.alignRight
                }`}
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`
                }}
              >
                <span>{milestone.label}</span>
                {milestone.photoKey ? (
                  <img
                    className={styles.milestonePhoto}
                    src={FIRSTS_ASSETS.milestonePhotos[milestone.photoKey]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FirstsJourneySection;
