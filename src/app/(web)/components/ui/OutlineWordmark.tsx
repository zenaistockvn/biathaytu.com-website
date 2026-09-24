import styles from './OutlineWordmark.module.css';

interface OutlineWordmarkProps {
  text?: string;
  /** horizontal: tràn ngang đáy hero như chữ "CHIMAY". vertical: chạy dọc đường nối của khối chia đôi. */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Chữ viền rỗng khổng lồ, trang trí thuần tuý (aria-hidden). SVG kéo giãn chữ cho vừa khung
 * (textLength) nên luôn tràn đúng bề rộng, không phụ thuộc cỡ màn hình.
 */
export default function OutlineWordmark({ text = 'BENEDIKTINER', orientation = 'horizontal', className = '' }: OutlineWordmarkProps) {
  if (orientation === 'vertical') {
    return (
      <svg className={`${styles.wordmark} ${styles.vertical} ${className}`} viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <text x="0" y="0" transform="translate(88 1000) rotate(-90)" textLength="1000" lengthAdjust="spacingAndGlyphs" className={styles.text}>
          {text}
        </text>
      </svg>
    );
  }

  return (
    <svg className={`${styles.wordmark} ${styles.horizontal} ${className}`} viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {/* Đường chân chữ ở y=96: chữ hoa không có phần dưới dòng, nên chân chữ nằm sát đáy khung mà không bị cắt. */}
      <text x="0" y="96" textLength="1000" lengthAdjust="spacingAndGlyphs" className={styles.text}>
        {text}
      </text>
    </svg>
  );
}
