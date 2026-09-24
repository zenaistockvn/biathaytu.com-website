import React from 'react';
import Image from 'next/image';
import { Button } from './Button';
import OutlineWordmark from './OutlineWordmark';
import TitleBlock from './TitleBlock';
import styles from './SplitBlock.module.css';

export type BlockTone = 'ink' | 'accent' | 'gold' | 'mist';

interface SplitBlockProps {
  image: { src: string; alt: string; position?: string };
  tone?: BlockTone;
  /** Đảo vị trí: khối màu bên trái, ảnh bên phải. */
  reverse?: boolean;
  title: React.ReactNode;
  kicker?: React.ReactNode;
  as?: 'h2' | 'h3';
  children?: React.ReactNode;
  action?: { href: string; label: string; external?: boolean };
  /** Chữ viền rỗng chạy dọc mép ảnh, sát đường nối (như chữ "CHIMAY" dọc của Chimay). */
  wordmark?: boolean;
  id?: string;
  className?: string;
}

/**
 * Section chia đôi kiểu chimay.com: nửa ảnh tràn mép, nửa khối màu phẳng.
 * Trên mobile ảnh xếp trên, khối màu dưới.
 */
export default function SplitBlock({
  image,
  tone = 'ink',
  reverse = false,
  title,
  kicker,
  as = 'h2',
  children,
  action,
  wordmark = false,
  id,
  className = '',
}: SplitBlockProps) {
  const onInk = tone === 'ink' || tone === 'accent';
  return (
    <section id={id} className={`${styles.split} ${reverse ? styles.reverse : ''} ${className}`.trim()}>
      <div className={styles.media}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 899px) 100vw, 50vw"
          className={styles.image}
          style={image.position ? { objectPosition: image.position } : undefined}
        />
        {wordmark ? <OutlineWordmark orientation="vertical" className={styles.wordmark} /> : null}
      </div>
      <div className={`${styles.panel} ${styles[tone]}`} data-surface={onInk ? 'ink' : undefined}>
        <div className={styles.content}>
          <TitleBlock as={as} size="h2" title={title} kicker={kicker} />
          {children ? <div className={styles.body}>{children}</div> : null}
          {action ? (
            <Button
              href={action.href}
              variant={onInk ? 'light' : 'dark'}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className={styles.action}
            >
              {action.label}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
