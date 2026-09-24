import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockTone } from './SplitBlock';
import styles from './CategoryTile.module.css';

interface CategoryTileProps {
  href: string;
  image: { src: string; alt: string; position?: string };
  title: React.ReactNode;
  kicker?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: BlockTone;
}

/** Ô danh mục lớn kiểu "Nos bières / Nos fromages" của Chimay: ảnh trên, khối màu có icon dưới. */
export default function CategoryTile({ href, image, title, kicker, icon, tone = 'ink' }: CategoryTileProps) {
  const onInk = tone === 'ink' || tone === 'accent';
  return (
    <Link href={href} className={styles.tile}>
      <span className={styles.media}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          className={styles.image}
          style={image.position ? { objectPosition: image.position } : undefined}
        />
      </span>
      <span className={`${styles.panel} ${styles[tone]}`} data-surface={onInk ? 'ink' : undefined}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <span>
          <h3 className={styles.title}>{title}</h3>
          {kicker ? <span className={styles.kicker}>{kicker}</span> : null}
        </span>
      </span>
    </Link>
  );
}

/** Lưới hai ô, xếp một cột trên mobile. */
export function CategoryTileGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.grid} ${className}`.trim()}>{children}</div>;
}
