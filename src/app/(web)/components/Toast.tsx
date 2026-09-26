'use client';
import { useToastStore } from '@/stores/useToastStore';
import styles from './Toast.module.css';

/** Thông báo ngắn; vị trí nằm ở `.toast-container` (web.css) để né thanh điều hướng dưới trên mobile. */
export default function Toast() {
  const { message, visible, hide } = useToastStore();

  if (!visible) return null;

  return (
    <div
      className="toast-container"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.item} data-surface="ink">
        <span>{message}</span>
        <button type="button" className={styles.close} onClick={hide} aria-label="Đóng thông báo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </div>
  );
}
