"use client";

import ZaloCTA from './ZaloCTA';
import { COMPANY_CONFIG, getCompanyTelHref } from '@/config/company';
import { formatPrice } from '@/utils/formatPrice';
import styles from './ProductOrderActions.module.css';

interface ProductOrderActionsProps {
  product: {
    id: string;
    name: string;
    price: number | null;
  };
}

/** Khối giá và liên hệ trên trang chi tiết: phẳng, góc vuông, nút gọi / Zalo / để lại thông tin. */
export default function ProductOrderActions({ product }: ProductOrderActionsProps) {
  const telHref = getCompanyTelHref() || '/lien-he';

  return (
    <section
      className={styles.box}
      aria-labelledby="product-consultation-title"
    >
      {product.price !== null && (
        <p className={styles.price}>
          <span className={styles.priceLabel}>Giá bán lẻ</span>
          {formatPrice(product.price)}
        </p>
      )}
      <h2 id="product-consultation-title" className={styles.title}>
        Quan tâm sản phẩm này?
      </h2>

      <div className={styles.row}>
        <a href={telHref} className="btn-primary">
          Gọi {COMPANY_CONFIG.hotline}
        </a>

        <ZaloCTA
          productId={product.id}
          productName={product.name}
          label="Chat Zalo"
          variant="outline"
        />

        <a href="#tu-van-san-pham" className="btn-link">
          Để lại thông tin tư vấn
        </a>
      </div>
    </section>
  );
}
