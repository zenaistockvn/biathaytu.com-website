"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import { Button } from './ui/Button';
import { getDisplayProductImage } from '../utils/productImages';

function getPerItemPrice(name: string, price: number): string | null {
  const match = name.match(/(?:thùng|két|hộp|set)?\s*(\d+)\s*(chai|lon)/i);
  if (match) {
    const qty = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (qty > 1) {
      const perItem = Math.round(price / qty);
      return `~${formatPrice(perItem)}/${unit}`;
    }
  }
  return null;
}

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
  /** Show brochure-site price disclaimer directly below the displayed price */
  showReferencePriceNote?: boolean;
}

/**
 * Unified product card used across homepage featured grid and /san-pham listing.
 * Uses .product-card-v2 CSS classes for consistent styling.
 */
export default function ProductCard({
  id, name, slug, images, price, description,
  abv, ibu, volume, category, highlightLabel, quickTags, cardId, showCTA = true,
  showReferencePriceNote = false,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const href = `/san-pham/${slug || id}`;
  const isWine = category === 'vang';
  const primaryImage = getDisplayProductImage({ images, category });
  const cardClassName = `product-card-v2${isWine ? ' wine-card' : ''}${highlightLabel ? ' product-card-highlight' : ''}`;

  return (
    <div id={cardId} className={cardClassName}>
      <Link href={href} className="card-image">
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
      </Link>

      <div className="card-body">
        <Link href={href}>
          <h3 className="card-name">{name}</h3>
        </Link>

        {description && (
          <p className="card-description">{description}</p>
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

        {price && (
          <>
            <div className={`card-price${isWine ? ' card-price-wine' : ''}`}>
              {formatPrice(price)}
              {getPerItemPrice(name, price) && (
                <span className="card-unit-price">
                  ({getPerItemPrice(name, price)})
                </span>
              )}
            </div>
            {showReferencePriceNote && (
              <p
                className="card-price-note"
                style={{
                  margin: '6px 0 0',
                  fontSize: '12px',
                  lineHeight: 1.45,
                  color: 'var(--web-text-muted)',
                }}
              >
                Giá tham khảo — vui lòng liên hệ để được báo giá và đặt hàng.
              </p>
            )}
          </>
        )}

        {showCTA && (
          <div className="card-actions">
            <Button
              href={href}
              variant="primary"
              className="card-btn-buy shimmer-effect"
            >
              Xem chi tiết
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
