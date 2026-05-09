"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { useToastStore } from '@/stores/useToastStore';
import ZaloCTA from './ZaloCTA';

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
  /** Show full CTA buttons (for product listing page) */
  showCTA?: boolean;
}

function formatPrice(price: number | null): string {
  if (!price) return '';
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

/**
 * Unified product card used across homepage featured grid and /san-pham listing.
 * Uses .product-card-v2 CSS classes for consistent styling.
 */
export default function ProductCard({
  id, name, slug, images, price, description,
  abv, ibu, volume, haravan_url, category, showCTA = true,
}: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);
  
  const href = `/san-pham/${slug || id}`;
  const isWine = category === 'vang';

  const handleAddCart = () => {
    if (!price) return;
    addItem({
      id,
      name,
      slug: slug || id,
      price,
      image: images?.[0] || '',
      quantity: 1,
    });
    showToast(`✓ Đã thêm ${name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!price) return;
    addItem({
      id,
      name,
      slug: slug || id,
      price,
      image: images?.[0] || '',
      quantity: 1,
    });
    router.push('/dat-hang');
  };

  return (
    <div className={`product-card-v2${isWine ? ' wine-card' : ''}`}>
      <Link href={href} className="card-image">
        {images?.[0] ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--web-text-muted)',
          }}>
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

        {/* Meta tags */}
        {(abv || ibu || volume) && (
          <div className="card-meta">
            {abv && <span className="card-meta-tag">ABV {abv}%</span>}
            {ibu && <span className="card-meta-tag">IBU {ibu}</span>}
            {volume && <span className="card-meta-tag">{volume}</span>}
          </div>
        )}

        {/* Price */}
        {price && (
          <div className={`card-price${isWine ? ' card-price-wine' : ''}`}>
            {formatPrice(price)}
          </div>
        )}

        {/* CTA */}
        {showCTA && (
          <div className="card-actions card-actions-dual" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {price ? (
              <>
                <button
                  onClick={handleAddCart}
                  style={{ flex: 1, textAlign: 'center', fontSize: '14px', padding: '10px', border: '1px solid var(--web-primary)', backgroundColor: 'transparent', color: 'var(--web-primary)', cursor: 'pointer', borderRadius: 'var(--web-radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Thêm vào giỏ"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary"
                  style={{ flex: 3, textAlign: 'center', fontSize: '14px', padding: '10px 16px', border: 'none', cursor: 'pointer' }}
                >
                  Mua Ngay
                </button>
              </>
            ) : (
              <ZaloCTA productName={name} label="Nhận ưu đãi sỉ/lẻ" variant="outline" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
