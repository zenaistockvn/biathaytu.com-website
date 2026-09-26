'use client';

import styles from './CookieResetButtons.module.css';

export default function CookieResetButtons() {
  const handleResetAge = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('resetAgeVerification'));
  };

  const handleResetCookie = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('resetCookieConsent'));
  };

  return (
    <div className={styles.box}>
      <button type="button" className={`${styles.button} ${styles.accent}`} onClick={handleResetAge}>
        Cài đặt lại xác nhận độ tuổi
      </button>

      <button type="button" className={styles.button} onClick={handleResetCookie}>
        Cài đặt lại quyền cookie
      </button>
    </div>
  );
}
