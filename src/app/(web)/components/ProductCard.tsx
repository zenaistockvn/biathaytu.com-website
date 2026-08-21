"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDisplayProductImage } from '../utils/productImages';
import ZaloCTA from './ZaloCTA';
import { BRAND } from '@/lib/brand';
import { formatPrice, formatUnitPrice, RETAIL_PRICE_NOTE } from '@/lib/pricing';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
  price: number | null;
  description?: string | null;
  shortDescription?: string;
  imageTodo?: string;
  abv?: string | null;
  ibu?: number | null;
  volume?: string | null;
  haravan_url?: string | null;
  category?: string | null;
  highlightLabel?: string | null;
  quickTags?: string[];
  cardId?: string;
  showCTA?: boolean;
  showReferencePriceNote?: boolean;
}

function getSafeHighlightLabel(label?: string | null): string | null {
  const clean = label?.trim();
  if (!clean) return null;
  if (/^tặng\s+kèm\b/i.test(clean)) return clean;
  if (/\b(?:ưu\s*đãi|giảm|sale|còn)\b/i.test(clean) || /\d+[.,]?\d*\s*(?:%|k\b)/i.test(clean)) return null;
  return clean;
}

/** Unified retail card. Checkout is intentionally external via Zalo/Fanpage. */
export default function ProductCard({
  id, name, slug, images, price, shortDescription,
  abv, ibu, volume, category, highlightLabel, quickTags, cardId, showCTA = true,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const href = `/san-pham/${slug || id}`;
  const isWine = category === 'vang';
  const primaryImage = getDisplayProductImage({ images, category });
  const safeHighlightLabel = getSafeHighlightLabel(highlightLabel);
  const cardClassName = `product-card-v2${isWine ? ' wine-card' : ''}${safeHighlightLabel ? ' product-card-highlight' : ''}`;
  const formattedPrice = formatPrice(price);
  const unitPrice = formatUnitPrice({ price, name, volume, category });

  return (
    <article id={cardId} className={cardClassName}>
      <Link
        href={href}
        aria-label={`Xem chi tiết ${name}`}
        style={{ color: 'inherit', textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        <div className="card-image">
          {safeHighlightLabel && <span className="card-promo-badge">{safeHighlightLabel}</span>}

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
            <div className="card-image-empty">Đang cập nhật hình</div>
          )}
        </div>

        <div className="card-body">
          <h3 className="card-name">{name}</h3>

          {shortDescription && <p className="card-description">{shortDescription}</p>}

          {quickTags && quickTags.length > 0 && (
            <div className="card-quick-tags">
              {quickTags.map((tag) => <span key={tag} className="card-quick-tag">{tag}</span>)}
            </div>
          )}

          {(abv || ibu || volume) && (
            <div className="card-meta">
              {abv && <span className="card-meta-tag">ABV {abv}%</span>}
              {ibu && <span className="card-meta-tag">IBU {ibu}</span>}
              {volume && <span className="card-meta-tag">{volume}</span>}
            </div>
          )}

          {formattedPrice && (
            <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
              <div className={`card-price${isWine ? ' card-price-wine' : ''}`}>{formattedPrice}</div>
              <div style={{ fontSize: '13px', color: 'var(--web-text-muted)', lineHeight: 1.45 }}>{unitPrice}</div>
              <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--web-text-muted)', lineHeight: 1.4 }}>{RETAIL_PRICE_NOTE}</div>
            </div>
          )}
        </div>
      </Link>

      {showCTA && formattedPrice && (
        <div className="card-actions" style={{ padding: '0 24px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <ZaloCTA productId={id} productName={name} label="Đặt qua Zalo" />
          <a
            href={BRAND.socialLinks.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            aria-label={`Nhắn Fanpage về ${name}`}
          >
            Nhắn Fanpage
          </a>
        </div>
      )}
    </article>
  );
}
