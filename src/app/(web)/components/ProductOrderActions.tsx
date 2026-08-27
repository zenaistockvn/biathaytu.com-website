"use client";

import ZaloCTA from './ZaloCTA';
import { COMPANY_CONFIG, getCompanyTelHref } from '@/config/company';

interface ProductOrderActionsProps {
  product: {
    id: string;
    name: string;
  };
}

export default function ProductOrderActions({ product }: ProductOrderActionsProps) {
  const telHref = getCompanyTelHref() || '/lien-he';

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

      <div className="detail-actions-row">
        <a href={telHref} className="btn-primary detail-btn-buy">
          Gọi {COMPANY_CONFIG.hotline}
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
