"use client";

import ZaloCTA from './ZaloCTA';
import { BRAND, BRAND_TEL_HREF } from '@/lib/brand';

interface ProductOrderActionsProps {
  product: {
    id: string;
    name: string;
  };
}

export default function ProductOrderActions({ product }: ProductOrderActionsProps) {
  return (
    <section
      className="product-actions detail-product-actions"
      aria-labelledby="product-consultation-title"
      style={{
        marginTop: '24px',
        padding: '24px',
        borderRadius: '14px',
        border: '1px solid var(--web-border)',
        background: 'var(--web-bg-warm)',
      }}
    >
      <div style={{ flex: '1 1 100%' }}>
        <h3 id="product-consultation-title" style={{ margin: '0 0 8px', fontSize: '20px', color: 'var(--web-ink)' }}>
          Chọn kênh đặt hàng
        </h3>
        <p style={{ margin: 0, color: 'var(--web-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
          Website không tạo đơn hàng trực tuyến. German Taste xác nhận đơn qua Zalo, Fanpage hoặc hotline.
        </p>
      </div>

      <ZaloCTA
        productId={product.id}
        productName={product.name}
        label="Đặt qua Zalo"
      />

      <a
        href={BRAND.socialLinks.messenger}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
      >
        Nhắn Fanpage
      </a>

      <a href={BRAND_TEL_HREF} className="btn-outline">
        Gọi {BRAND.hotline}
      </a>
    </section>
  );
}
