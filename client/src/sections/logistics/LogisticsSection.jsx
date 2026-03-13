import React from 'react';
import { LOGISTICS_SECTION } from './logistics.constants';
import styles from './LogisticsSection.module.css';

function LogisticsSection() {
  return (
    <section id="logistics-section" className={styles.section} aria-label="Wedding logistics section">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{LOGISTICS_SECTION.eyebrow}</p>
          <h2 className={styles.title}>{LOGISTICS_SECTION.title}</h2>
        </div>

        <div className={styles.grid}>
          <article className={styles.card} aria-label="Wedding date and time">
            <p className={styles.label}>{LOGISTICS_SECTION.dateLabel}</p>
            <p className={styles.value}>{LOGISTICS_SECTION.dateValue}</p>
            <div className={styles.spacer} aria-hidden="true" />
            <p className={styles.label}>{LOGISTICS_SECTION.timeLabel}</p>
            <p className={styles.value}>{LOGISTICS_SECTION.timeValue}</p>
          </article>

          <article className={styles.card} aria-label="Wedding venue and map">
            <p className={styles.label}>{LOGISTICS_SECTION.venueLabel}</p>
            <p className={styles.value}>{LOGISTICS_SECTION.venueValue}</p>
            <div className={styles.spacer} aria-hidden="true" />
            <p className={styles.label}>{LOGISTICS_SECTION.addressLabel}</p>
            <p className={styles.address}>
              {LOGISTICS_SECTION.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>

            <div className={styles.mapWrap}>
              <iframe
                className={styles.map}
                title={LOGISTICS_SECTION.mapEmbedTitle}
                src={LOGISTICS_SECTION.mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              className={styles.mapAction}
              href={LOGISTICS_SECTION.openMapUrl}
              target="_blank"
              rel="noreferrer"
            >
              {LOGISTICS_SECTION.openMapLabel}
            </a>
          </article>
        </div>

        <p className={styles.note}>{LOGISTICS_SECTION.note}</p>
      </div>
    </section>
  );
}

export default LogisticsSection;
