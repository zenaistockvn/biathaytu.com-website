"use client";

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import ZaloCTA from './ZaloCTA';

import { useToastStore } from '@/stores/useToastStore';

interface ProductOrderActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | null;
    images: string[] | null;
  };
}

export default function ProductOrderActions({ product }: ProductOrderActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);

  const handleAddCart = () => {
    if (!product.price) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: 1,
    });
    showToast(`✓ Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!product.price) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: 1,
    });
    router.push('/dat-hang');
  };

  return (
    <div className="product-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {product.price && (
        <div style={{ display: 'flex', gap: '8px', flex: '1 1 auto' }}>
          <button
            onClick={handleAddCart}
            style={{ flex: 1, textAlign: 'center', fontSize: '16px', padding: '16px', border: '2px solid var(--web-primary)', backgroundColor: 'transparent', color: 'var(--web-primary)', cursor: 'pointer', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
            title="Thêm vào giỏ"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Giỏ Hàng
          </button>
          <button
            onClick={handleBuyNow}
            className="btn-primary"
            style={{ flex: 2, padding: '16px 24px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Mua Ngay
          </button>
        </div>
      )}
      <ZaloCTA productId={product.id} productName={product.name} label="💬 Nhắn Zalo báo giá" />
    </div>
  );
}
