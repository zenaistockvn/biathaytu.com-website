'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/config/navigation';
import {
  COMPANY_CONFIG,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';
import { CONTACT_TOGGLE_EVENT } from './MobileBottomNav';
import styles from './FloatingZaloCTA.module.css';

export default function FloatingZaloCTA() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const zaloUrl = getCompanyZaloUrl();
  const telHref = getCompanyTelHref();

  const isBitburger = pathname.includes('bitburger');
  const messengerUrl = isBitburger
    ? 'https://m.me/1042222495647480'
    : 'https://m.me/1106668052525470';

  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  // Nút "Liên hệ" của thanh điều hướng dưới (mobile) mở cùng bảng này.
  useEffect(() => {
    const toggle = () => setIsExpanded((value) => !value);
    window.addEventListener(CONTACT_TOGGLE_EVENT, toggle);
    return () => window.removeEventListener(CONTACT_TOGGLE_EVENT, toggle);
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!rootRef.current?.contains(target) && !target.closest?.('[data-contact-toggle]')) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  return (
    <div ref={rootRef} className={styles.root} aria-label="Liên hệ nhanh">
      {isExpanded && (
        <div className={styles.panel} role="menu" aria-label="Các kênh liên hệ">
          <div className={styles.head}>
            <strong>Liên hệ Bia Thầy Tu</strong>
            <span>Tư vấn sản phẩm &amp; hợp tác</span>
          </div>

          {zaloUrl ? (
            <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className={styles.item} role="menuitem">
              <span className={styles.mark} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" /><path d="M9 8.5h6l-6 5h6" /></svg></span>
              <span className={styles.text}><strong>Mở Zalo</strong><small>Chat tư vấn</small></span>
            </a>
          ) : null}

          {telHref ? (
            <a href={telHref} className={styles.item} role="menuitem">
              <span className={styles.mark} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg></span>
              <span className={styles.text}><strong>Điện thoại</strong><small>{COMPANY_CONFIG.hotline}</small></span>
            </a>
          ) : null}

          <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className={styles.item} role="menuitem">
            <span className={styles.mark} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3C7 3 3 6.7 3 11.3c0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.9.3 1.8.4 2.7.4 5 0 9-3.7 9-8.3S17 3 12 3Z" /><path d="m7.5 13 3-3.2 2.3 2.2 3.7-3.2" /></svg></span>
            <span className={styles.text}><strong>Messenger</strong><small>Nhắn tin fanpage</small></span>
          </a>

          <Link href={NAV.contact.href} className={styles.item} role="menuitem">
            <span className={styles.mark} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg></span>
            <span className={styles.text}><strong>{NAV.contact.label}</strong><small>{COMPANY_CONFIG.showroomAddress}</small></span>
          </Link>
        </div>
      )}

      <button
        type="button"
        className={`${styles.trigger}${isExpanded ? ` ${styles.open}` : ''}`}
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Đóng menu liên hệ' : 'Mở menu liên hệ'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span>Liên hệ</span>
      </button>
    </div>
  );
}
