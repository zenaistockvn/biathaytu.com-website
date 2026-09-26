"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import { hasWhiteCanvas } from '@/lib/data/productImages';
import { getDisplayProductImage } from '../utils/productImages';
import { formatAbv, splitProductName } from '../utils/productName';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
  price: number | null;
  /** Không hiện trên thẻ (mô tả SEO dài, bị cắt giữa chữ); giữ cho các nơi gọi cũ. */
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
  /**
   * `compact`: thẻ nằm dưới tiêu đề dòng bia (danh mục /san-pham), tên dòng đã có ở tiêu đề nhóm nên
   * thẻ chỉ ghi quy cách, thông số, giá; nhỏ gọn để xếp 2 cột trên mobile, 4 cột trên desktop.
   */
  variant?: 'default' | 'compact';
  /** Thẻ compact: tên riêng khi SKU khác tên chung của nhóm (vd. "Bitburger 0.0% Alkoholfrei"). */
  variantLabel?: string | null;
}

/**
 * Thẻ sản phẩm dùng chung (trang chủ, /san-pham, bài viết), theo kiểu danh sách bia của Chimay:
 * ảnh trên nền xám, tên dòng bia, quy cách, thông số một dòng, giá bán lẻ. Cả thẻ là một link duy nhất.
 */
export default function ProductCard({
  id, name, slug, images, price,
  abv, ibu, volume, category, highlightLabel, quickTags, cardId, showCTA = true, variant = 'default', variantLabel = null,
}: ProductCardProps) {
  const compact = variant === 'compact';
  const [imageFailed, setImageFailed] = useState(false);

  const href = `/san-pham/${slug || id}`;
  const primaryImage = getDisplayProductImage({ images, category });
  const { title, pack } = splitProductName(name);
  const abvText = formatAbv(abv);
  // Quy cách đã ghi dung tích thì không lặp lại dung tích ở dòng thông số.
  const specs = [abvText ? `${abvText} vol.` : null, ibu ? `IBU ${ibu}` : null, pack ? null : volume].filter(Boolean).join(' · ');

  return (
    <Link id={cardId} href={href} className={`${styles.card}${compact ? ` ${styles.compact}` : ''}`} aria-label={`Xem chi tiết ${name}`}>
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
        {compact ? (
          <h3 className={styles.name}>
            {variantLabel && pack ? <span className={styles.variantLabel}>{variantLabel}</span> : null}
            {pack ?? title}
          </h3>
        ) : (
          <h3 className={styles.name}>
            {title}
            {pack && <span className={styles.pack}>{pack}</span>}
          </h3>
        )}
        {specs && <p className={styles.specs}>{specs}</p>}

        {quickTags && quickTags.length > 0 && (
          <p className={styles.tags}>{quickTags.join(' · ')}</p>
        )}

        {price !== null && (
          <p className={styles.price}>
            <span className={styles.priceLabel}>Giá bán lẻ</span>
            {formatPrice(price)}
          </p>
        )}

        {showCTA && !compact && (
          <span className={styles.cue} aria-hidden="true">
            Khám phá sản phẩm
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
          </span>
        )}
      </div>
    </Link>
  );
}
