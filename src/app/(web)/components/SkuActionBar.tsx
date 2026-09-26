import ZaloCTA from './ZaloCTA';
import { getCompanyTelHref } from '@/config/company';
import styles from './SkuActionBar.module.css';

/**
 * Thanh cố định đáy trên trang SKU dưới 769px (audit D3), thay MobileBottomNav: hai nút luôn trong tầm tay.
 * Nhãn "Gọi tư vấn" thay cho "Gọi đặt hàng" của D3: website chưa đăng ký bán hàng với Bộ Công Thương
 * nên không dùng lời gọi đặt hàng (chủ dự án, 26/09/2026).
 */
export default function SkuActionBar({ productId, productName }: { productId: string; productName: string }) {
  const telHref = getCompanyTelHref() || '/lien-he';

  return (
    <div className={styles.bar} role="group" aria-label="Liên hệ về sản phẩm">
      <a href={telHref} className={`btn-primary ${styles.button}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
        Gọi tư vấn
      </a>
      <ZaloCTA productId={productId} productName={productName} label="Mở Zalo" variant="outline" className={styles.button} />
    </div>
  );
}
