"use client";

import ZaloCTA from './ZaloCTA';

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
      <h3 id="product-consultation-title" style={{ margin: '0 0 16px', fontSize: '20px', color: 'var(--web-ink)' }}>
        Quan tâm sản phẩm này?
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <a href="tel:0899191313" className="btn-primary detail-btn-buy shimmer-effect">
          Gọi 0899.191.313
        </a>

        <ZaloCTA
          productId={product.id}
          productName={product.name}
          label="Chat Zalo"
          variant="outline"
        />

        <a href="#tu-van-san-pham" className="btn-outline">
          Để lại thông tin tư vấn
        </a>
      </div>
    </section>
  );
}
