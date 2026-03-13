import React from 'react';
import { CALENDAR_ASSETS } from './calendarAssets';
import { CALENDAR_SECTION } from './calendar.constants';
import styles from './CalendarSection.module.css';

function CalendarSection() {
  return (
    <section id="calendar-section" className={styles.section} aria-label="Wedding date calendar section">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div>
            <p className={styles.eyebrow}>{CALENDAR_SECTION.eyebrow}</p>
            <h2 className={styles.title}>{CALENDAR_SECTION.title}</h2>
            <p className={styles.subtitle}>{CALENDAR_SECTION.subtitle}</p>
          </div>

          <div className={styles.metaRow} aria-label="Wedding date highlights">
            <article className={styles.metaCard}>
              <p className={styles.metaLabel}>{CALENDAR_SECTION.detailLabel}</p>
              <p className={styles.metaValue}>{CALENDAR_SECTION.detailValue}</p>
            </article>
          </div>
        </div>

        <div className={styles.gallery}>
          <div className={styles.heroCard}>
            <img
              src={CALENDAR_ASSETS.heroPortrait}
              alt="Wedding portrait with save-the-date styling"
              className={styles.heroImage}
            />
          </div>

          <div className={styles.supportGrid}>
            <div className={styles.calendarCard}>
              <img
                src={CALENDAR_ASSETS.calendarArt}
                alt="Calendar artwork highlighting the wedding date"
                className={styles.calendarArt}
              />
              <div className={styles.calendarStamp} aria-hidden="true">
                <span>10<br />07</span>
              </div>
            </div>

            <div className={styles.supportCard}>
              <img
                src={CALENDAR_ASSETS.invitationPortrait}
                alt="Wedding invitation portrait"
                className={styles.supportImage}
              />
            </div>

            <div className={styles.supportCard}>
              <img
                src={CALENDAR_ASSETS.shapePortrait}
                alt="Editorial wedding portrait"
                className={styles.supportImage}
              />
            </div>
          </div>
        </div>

        <p className={styles.note}>{CALENDAR_SECTION.note}</p>
      </div>
    </section>
  );
}

export default CalendarSection;
