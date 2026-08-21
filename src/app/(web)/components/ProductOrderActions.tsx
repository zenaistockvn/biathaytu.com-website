"use client";

import ZaloCTA from './ZaloCTA';
import { Button } from './ui/Button';

interface ProductOrderActionsProps {
  product: {
    id: string;
    name: string;
  };
}

export default function ProductOrderActions({ product }: ProductOrderActionsProps) {
  return (
    <div className="product-actions detail-product-actions">
      <div className="detail-buy-block">
        <Button
          href="/lien-he"
          variant="primary"
          className="detail-btn-buy shimmer-effect"
        >
          Liên hệ tư vấn
        </Button>
      </div>
      <ZaloCTA productId={product.id} productName={product.name} label="Nhắn Zalo tư vấn" />
    </div>
  );
}
