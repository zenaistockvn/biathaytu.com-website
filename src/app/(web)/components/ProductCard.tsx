"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import { hasWhiteCanvas } from '@/lib/data/productImages';
import { getDisplayProductImage } from '../utils/productImages';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
  price: number | null;
  description?: string | null;
  abv?: string | null;
  ibu?: number | null;
  volume?: string | null;
  haravan_url?: string | null;
  /** 'bia' | 'vang' | 'phu-kien' */
  category?: string | null;
  highlightLabel?: string | null;
  quickTags?: string[];
  cardId?: string;
  /** Show detail CTA (for product listing page) */
  showCTA?: boolean;
  /** Kept for compatibility with legacy callers. */
  showReferencePriceNote?: boolean;
}

/**
 * Thẻ sản phẩm dùng chung (trang chủ, /san-pham, bài viết), theo kiểu danh sách bia của Chimay:
 * ảnh trên nền xám, tên in hoa, thông số một dòng, giá bán lẻ. Cả thẻ là một link duy nhất.
 */
export default function ProductCard({
  id, name, slug, images, price, description,
  abv, ibu, volume, category, highlightLabel, quickTags, cardId, showCTA = true,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const href = `/san-pham/${slug || id}`;
  const primaryImage = getDisplayProductImage({ images, category });
  const specs = [abv ? `${abv}% vol.` : null, ibu ? `IBU ${ibu}` : null, volume].filter(Boolean).join(' · ');

  return (
    <Link id={cardId} href={href} className={styles.card} aria-label={`Xem chi tiết ${name}`}>
      <div className={styles.media}>
        {highlightLabel && <span className={styles.badge}>{highlightLabel}</span>}

        {primaryImage && !imageFailed ? (
          <Image
            src={primaryImage}
            alt={name}
            fill
            className={`${styles.image}${hasWhiteCanvas(primaryImage) ? ' product-image-blend' : ''}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={styles.empty}>
            Đang cập nhật hình
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        {specs && <p className={styles.specs}>{specs}</p>}

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        {quickTags && quickTags.length > 0 && (
          <p className={styles.tags}>{quickTags.join(' · ')}</p>
        )}

        {price !== null && (
          <p className={styles.price}>
            <span className={styles.priceLabel}>Giá bán lẻ</span>
            {formatPrice(price)}
          </p>
        )}

        {showCTA && (
          <span className={styles.cue} aria-hidden="true">
            Khám phá sản phẩm
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
          </span>
        )}
      </div>
    </Link>
  );
}
