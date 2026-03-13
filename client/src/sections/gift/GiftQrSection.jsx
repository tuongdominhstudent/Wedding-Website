import React from 'react';
import { GIFT_SECTION } from './gift.constants';
import styles from './GiftQrSection.module.css';

function GiftQrSection() {
  return (
    <section id="gift-qr-section" className={styles.section} aria-label="Wedding gift QR section">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{GIFT_SECTION.eyebrow}</p>
          <h2 className={styles.title}>{GIFT_SECTION.title}</h2>
          <p className={styles.body}>{GIFT_SECTION.body}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.qrBox} aria-label={GIFT_SECTION.qrLabel}>
            <div className={styles.qrInner} aria-hidden="true" />
          </div>

          <div className={styles.meta}>
            <p className={styles.metaLabel}>{GIFT_SECTION.accountLabel}</p>
            <p className={styles.metaValue}>{GIFT_SECTION.accountName}</p>
            <p className={styles.metaValue}>{GIFT_SECTION.accountNumber}</p>
            <p className={styles.metaValue}>{GIFT_SECTION.bankName}</p>
          </div>
        </div>

        <p className={styles.note}>{GIFT_SECTION.note}</p>
      </div>
    </section>
  );
}

export default GiftQrSection;
