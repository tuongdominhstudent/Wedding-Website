import React from 'react';
import styles from './SectionBand.module.css';

const SEPARATOR = '\u00A0\u00A0\u25C6\u00A0\u00A0'; // ◆ with spacing
const REPEAT_COUNT = 6;

function buildTrackText(text) {
  return Array.from({ length: REPEAT_COUNT }, () => text).join(SEPARATOR) + SEPARATOR;
}

function SectionBand({ text }) {
  const trackText = buildTrackText(text);
  return (
    <div className={styles.band} aria-hidden="true">
      <div className={styles.track}>
        <span className={styles.item}>{trackText}</span>
        <span className={styles.item} aria-hidden="true">{trackText}</span>
      </div>
    </div>
  );
}

export default SectionBand;
