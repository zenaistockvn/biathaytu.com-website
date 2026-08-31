"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import { getDisplayProductImage } from '../utils/productImages';

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
 * Unified product card used across homepage featured grid and /san-pham listing.
 * The entire card is a single accessible link to avoid nested interactive controls.
 */
export default function ProductCard({
  id, name, slug, images, price, description,
  abv, ibu, volume, category, highlightLabel, quickTags, cardId, showCTA = true,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const href = `/san-pham/${slug || id}`;
  const isWine = category === 'vang';
  const primaryImage = getDisplayProductImage({ images, category });
  const cardClassName = `product-card-v2${isWine ? ' wine-card' : ''}${highlightLabel ? ' product-card-highlight' : ''}`;

  return (
    <Link
      id={cardId}
      href={href}
      className={cardClassName}
      aria-label={`Xem chi tiết ${name}`}
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      <div className="card-image">
        {highlightLabel && (
          <span className="card-promo-badge">{highlightLabel}</span>
        )}

        {primaryImage && !imageFailed ? (
          <Image
            src={primaryImage}
            alt={name}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="card-image-empty">
            Đang cập nhật hình
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-name">{name}</h3>

        {description && (
          <p className="card-description">{description}</p>
        )}

        {price !== null && (
          <p className={`card-price${isWine ? ' card-price-wine' : ''}`}>
            <span style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 600, color: 'var(--web-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Giá bán lẻ
            </span>
            {formatPrice(price)}
          </p>
        )}

        {quickTags && quickTags.length > 0 && (
          <div className="card-quick-tags">
            {quickTags.map((tag) => (
              <span key={tag} className="card-quick-tag">{tag}</span>
            ))}
          </div>
        )}

        {(abv || ibu || volume) && (
          <div className="card-meta">
            {abv && <span className="card-meta-tag">ABV {abv}%</span>}
            {ibu && <span className="card-meta-tag">IBU {ibu}</span>}
            {volume && <span className="card-meta-tag">{volume}</span>}
          </div>
        )}

        {showCTA && (
          <div className="card-actions" aria-hidden="true">
            <span className="card-link-cue">
              Khám phá sản phẩm
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
