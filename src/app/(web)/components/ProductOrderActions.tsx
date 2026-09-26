"use client";

import ZaloCTA from './ZaloCTA';
import { COMPANY_CONFIG, getCompanyTelHref } from '@/config/company';
import styles from './ProductOrderActions.module.css';

interface ProductOrderActionsProps {
  product: {
    id: string;
    name: string;
  };
}

/**
 * Khối liên hệ trên trang chi tiết: phẳng, góc vuông, nút gọi / Zalo / để lại thông tin.
 * Giá nằm ở hàng giá ngay dưới tên sản phẩm (audit D3), không lặp lại ở đây.
 */
export default function ProductOrderActions({ product }: ProductOrderActionsProps) {
  const telHref = getCompanyTelHref() || '/lien-he';

  return (
    <section
      className={styles.box}
      aria-labelledby="product-consultation-title"
    >
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
          label="Mở Zalo"
          variant="outline"
        />

        <a href="#tu-van-san-pham" className="btn-link">
          Để lại thông tin tư vấn
        </a>
      </div>
    </section>
  );
}
