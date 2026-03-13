import React from 'react';
import { useState } from 'react';
import { getRegisteredSections } from '../config/sectionRegistry';
import LongDistanceJourneySection from './distance/LongDistanceJourneySection';
import FirstsJourneySection from './firsts/FirstsJourneySection';
import GiftQrSection from './gift/GiftQrSection';
import IntroSection from './intro/IntroSection';
import LogisticsSection from './logistics/LogisticsSection';
import CalendarSection from './calendar/CalendarSection';
import PreweddingSection from './prewedding/PreweddingSection';
import styles from './StoryRoot.module.css';

const SECTION_COMPONENTS = Object.freeze({
  firsts: FirstsJourneySection,
  'long-distance': LongDistanceJourneySection,
  prewedding: PreweddingSection,
  calendar: CalendarSection,
  logistics: LogisticsSection,
  gift: GiftQrSection
});

function StoryRoot({ isBootReady }) {
  const [isStoryUnlocked, setIsStoryUnlocked] = useState(false);
  const storySections = getRegisteredSections()
    .filter((section) => section.id !== 'intro')
    .map((section) => ({
      ...section,
      Component: SECTION_COMPONENTS[section.id]
    }))
    .filter((section) => typeof section.Component === 'function');

  return (
    <section id="story-root" className={styles.storyRoot} aria-label="Wedding story canvas">
      <div id="story-sections" className={styles.sectionMount}>
        <IntroSection
          isBootReady={isBootReady}
          onSequenceComplete={() => {
            setIsStoryUnlocked(true);
          }}
        />
        {isStoryUnlocked
          ? storySections.map(({ id, Component }) => <Component key={id} />)
          : null}
        <section className={styles.nextSectionPlaceholder} aria-hidden="true" />
      </div>
    </section>
  );
}

export default StoryRoot;
