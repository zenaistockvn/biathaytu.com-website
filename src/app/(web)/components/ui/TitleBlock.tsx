import React from 'react';
import styles from './TitleBlock.module.css';

interface TitleBlockProps {
  title: React.ReactNode;
  /** Dòng in hoa nhỏ bên dưới tiêu đề, như "TRAPPISTES" dưới "Nos Bières" của Chimay. */
  kicker?: React.ReactNode;
  /** Dòng nhỏ phía trên tiêu đề (tuỳ chọn). */
  eyebrow?: React.ReactNode;
  /** Icon nét mảnh đặt bên trái, xem LineIcons.tsx. */
  icon?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  /** `hero`: trang chủ; `page`: hero trang con. */
  size?: 'hero' | 'page' | 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
  id?: string;
  className?: string;
}

/** Cụm tiêu đề chuẩn của site. Màu kế thừa từ khối chứa (tự đảo trên dải tối). */
export default function TitleBlock({
  title,
  kicker,
  eyebrow,
  icon,
  as: Tag = 'h2',
  size,
  align = 'left',
  id,
  className = '',
}: TitleBlockProps) {
  const sizeClass = styles[size ?? Tag];
  return (
    <div className={`${styles.block} ${align === 'center' ? styles.center : ''} ${className}`.trim()}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <div>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <Tag id={id} className={`${styles.title} ${sizeClass}`}>{title}</Tag>
        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      </div>
    </div>
  );
}
