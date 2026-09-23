'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  COMPANY_CONFIG,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';

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

  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
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
    <div ref={rootRef} className="brand-contact-root" aria-label="Liên hệ nhanh">
      {isExpanded && (
        <div className="brand-contact-panel" role="menu" aria-label="Các kênh liên hệ">
          <div className="brand-contact-panel-head">
            <strong>Liên hệ Bia Thầy Tu</strong>
            <span>Tư vấn sản phẩm &amp; hợp tác</span>
          </div>

          {zaloUrl ? (
            <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="brand-contact-item" role="menuitem">
              <span className="brand-contact-mark" aria-hidden="true">Z</span>
              <span><strong>Zalo</strong><small>Chat tư vấn</small></span>
            </a>
          ) : null}

          {telHref ? (
            <a href={telHref} className="brand-contact-item" role="menuitem">
              <span className="brand-contact-mark" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg></span>
              <span><strong>Điện thoại</strong><small>{COMPANY_CONFIG.hotline}</small></span>
            </a>
          ) : null}

          <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className="brand-contact-item" role="menuitem">
            <span className="brand-contact-mark" aria-hidden="true">M</span>
            <span><strong>Messenger</strong><small>Nhắn tin fanpage</small></span>
          </a>
        </div>
      )}

      <button
        type="button"
        className={`brand-contact-trigger${isExpanded ? ' is-open' : ''}`}
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
