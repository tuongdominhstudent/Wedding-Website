import { useState } from 'react';
import LongDistanceJourneySection from './distance/LongDistanceJourneySection';
import FirstsJourneySection from './firsts/FirstsJourneySection';
import IntroSection from './intro/IntroSection';
import styles from './StoryRoot.module.css';

function StoryRoot({ isBootReady }) {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <section id="story-root" className={styles.storyRoot} aria-label="Wedding story canvas">
      <div id="story-sections" className={styles.sectionMount}>
        <IntroSection
          isBootReady={isBootReady}
          onSequenceComplete={() => {
            setIsIntroComplete(true);
          }}
        />
        {isIntroComplete ? <FirstsJourneySection /> : null}
        {isIntroComplete ? <LongDistanceJourneySection /> : null}
        <section className={styles.nextSectionPlaceholder} aria-hidden="true" />
      </div>
    </section>
  );
}

export default StoryRoot;
