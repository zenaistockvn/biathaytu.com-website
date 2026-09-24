import React from 'react';
import Image from 'next/image';
import OutlineWordmark from './OutlineWordmark';
import TitleBlock from './TitleBlock';
import styles from './PhotoHero.module.css';

interface PhotoHeroProps {
  image: { src: string; alt: string; position?: string };
  title: React.ReactNode;
  kicker?: React.ReactNode;
  eyebrow?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  /** Chữ viền rỗng tràn đáy hero. Mặc định "BENEDIKTINER"; false để tắt. */
  wordmark?: string | false;
  size?: 'full' | 'medium';
  titleId?: string;
}

/**
 * Hero ảnh tràn màn hình kiểu chimay.com (trang chủ, trang Chimay Bleue): ảnh chính hãng,
 * lớp phủ tối phía chữ để đạt AA, chữ viền rỗng khổng lồ tràn đáy. Header trong suốt nằm đè lên.
 */
export default function PhotoHero({
  image,
  title,
  kicker,
  eyebrow,
  children,
  actions,
  wordmark = 'BENEDIKTINER',
  size = 'full',
  titleId,
}: PhotoHeroProps) {
  return (
    <section className={`${styles.hero} ${styles[size]}`} data-surface="ink" aria-labelledby={titleId}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className={styles.image}
        style={image.position ? { objectPosition: image.position } : undefined}
      />
      <div className={styles.overlay} aria-hidden="true" />
      {/* Tách lớp: .container toàn cục đặt lại padding, nên khoảng đệm dọc nằm ở lớp ngoài. */}
      <div className={styles.inner}>
        <div className="container">
          <div className={styles.copy}>
            <TitleBlock as="h1" size="hero" id={titleId} title={title} kicker={kicker} eyebrow={eyebrow} />
            {children ? <div className={styles.body}>{children}</div> : null}
            {actions ? <div className={styles.actions}>{actions}</div> : null}
          </div>
        </div>
      </div>
      {wordmark ? <OutlineWordmark text={wordmark} className={styles.wordmark} /> : null}
    </section>
  );
}
