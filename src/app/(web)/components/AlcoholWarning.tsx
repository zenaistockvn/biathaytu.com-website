import { DEFAULT_ALCOHOL_WARNING } from '@/constants/compliance';
import styles from './AlcoholWarning.module.css';

interface AlcoholWarningProps {
  /** `footer`: dòng trong thanh vàng cuối trang; `checkout`: khối cảnh báo đầu trang pháp lý. */
  variant?: 'footer' | 'checkout';
  customText?: string;
  className?: string;
}

/** Cảnh báo đồ uống có cồn bắt buộc. Kiểu nằm trong AlcoholWarning.module.css, không đặt style inline. */
export default function AlcoholWarning({ variant = 'checkout', customText, className = '' }: AlcoholWarningProps) {
  const text = customText || DEFAULT_ALCOHOL_WARNING;

  if (variant === 'footer') {
    return (
      <div className={`${styles.footer} ${className}`.trim()}>
        <span className={styles.badge} aria-hidden="true">18+</span>
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.checkout} ${className}`.trim()} role="alert">
      <strong className={styles.checkoutTitle}>Cảnh báo tuân thủ quy định bán bia lẻ:</strong>
      <span>{text}</span>
    </div>
  );
}
