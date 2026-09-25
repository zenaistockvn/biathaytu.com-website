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
  /** Ghi nguồn ảnh chính hãng, hiện nhỏ ở góc. */
  credit?: { href: string; label: string };
  /** Gắn data-hero-reveal lên từng khối chữ để component bọc ngoài chạy hiệu ứng hiện dần. */
  reveal?: boolean;
  ref?: React.Ref<HTMLElement>;
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
  credit,
  reveal = false,
  ref,
}: PhotoHeroProps) {
  const revealAttr = reveal ? { 'data-hero-reveal': '' } : {};
  return (
    <section ref={ref} className={`${styles.hero} ${styles[size]}${wordmark ? '' : ` ${styles.noWordmark}`}`} data-surface="ink" aria-labelledby={titleId}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        // Ảnh đầu trang là phần tử LCP; không có mức ưu tiên cao thì trình duyệt xếp sau font và JS.
        fetchPriority="high"
        sizes="100vw"
        className={styles.image}
        style={image.position ? { objectPosition: image.position } : undefined}
      />
      <div className={styles.overlay} aria-hidden="true" />
      {/* Tách lớp: .container toàn cục đặt lại padding, nên khoảng đệm dọc nằm ở lớp ngoài. */}
      <div className={styles.inner}>
        <div className="container">
          <div className={styles.copy}>
            <div {...revealAttr}>
              <TitleBlock as="h1" size="hero" id={titleId} title={title} kicker={kicker} eyebrow={eyebrow} />
            </div>
            {children ? <div className={styles.body} {...revealAttr}>{children}</div> : null}
            {actions ? <div className={styles.actions} {...revealAttr}>{actions}</div> : null}
          </div>
        </div>
      </div>
      {wordmark ? <OutlineWordmark text={wordmark} className={styles.wordmark} /> : null}
      {credit ? (
        <a className={styles.credit} href={credit.href} target="_blank" rel="noopener noreferrer">
          {credit.label}
        </a>
      ) : null}
    </section>
  );
}
