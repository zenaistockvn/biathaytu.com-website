'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  clearAgeVerification,
  isAgeVerified,
  isSearchCrawlerUserAgent,
  setAgeVerifiedStatus,
} from '@/utils/ageVerification';
import styles from './AgeVerificationGate.module.css';

type GateStatus = 'prompt' | 'denied';

const EXEMPT_PATHS = new Set([
  '/chinh-sach-bao-mat',
  '/chinh-sach-cookie',
  '/chinh-sach-kiem-soat-do-tuoi',
  '/chua-du-tuoi',
]);

export default function AgeVerificationGate() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<GateStatus>('prompt');
  const modalRef = useRef<HTMLDivElement>(null);
  const adultButtonRef = useRef<HTMLButtonElement>(null);

  const isExemptPath = EXEMPT_PATHS.has(pathname);

  useLayoutEffect(() => {
    setMounted(true);

    const crawler = isSearchCrawlerUserAgent(window.navigator.userAgent || '');
    if (isExemptPath || crawler || isAgeVerified()) {
      setIsOpen(false);
      document.documentElement.removeAttribute('data-age-gate');
      return;
    }

    setStatus('prompt');
    setIsOpen(true);
  }, [isExemptPath, pathname]);

  useLayoutEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.documentElement.setAttribute('data-age-gate', 'active');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => adultButtonRef.current?.focus());
    } else {
      document.documentElement.removeAttribute('data-age-gate');
      document.body.style.overflow = '';
    }

    const handleReset = () => {
      clearAgeVerification();
      setStatus('prompt');
      setIsOpen(true);
    };

    window.addEventListener('resetAgeVerification', handleReset);
    return () => {
      window.removeEventListener('resetAgeVerification', handleReset);
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const overlay = modalRef.current;
    const root = overlay?.parentElement;
    const siblings = root
      ? (Array.from(root.children) as HTMLElement[]).filter((element) => element !== overlay)
      : [];

    siblings.forEach((element) => element.setAttribute('inert', ''));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (event.key !== 'Tab' || !overlay) return;

      const focusables = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null || element.getClientRects().length > 0);

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !overlay.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      siblings.forEach((element) => element.removeAttribute('inert'));
    };
  }, [isOpen]);

  if (!mounted || !isOpen || isExemptPath) return null;

  const handleAdultConfirm = () => {
    setAgeVerifiedStatus();
    setIsOpen(false);
  };

  const handleUnderage = () => {
    clearAgeVerification();
    setStatus('denied');
  };

  return (
    <div
      className={`age-gate-overlay ${styles.overlay}`}
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-description"
    >
      {/* Như cổng tuổi của chimay.com: ảnh thương hiệu tối phía sau, hộp trắng vuông ở giữa. */}
      <Image src="/images/brand/benediktiner-official/home-hero.jpg" alt="" fill priority sizes="100vw" className={styles.backdrop} />
      <div className={styles.shade} aria-hidden="true" />

      <div className={`age-gate-card ${styles.card}`}>
        <Image src="/logo.png" alt="Bia Thầy Tu" width={88} height={88} priority className={styles.crest} />

        <span className={styles.badge} aria-label="Chỉ dành cho người từ đủ 18 tuổi">18+</span>

        <h2 id="age-gate-title" className={styles.title}>
          Bạn đã đủ 18 tuổi?
        </h2>

        <p id="age-gate-description" className={styles.description}>
          Website có nội dung giới thiệu sản phẩm bia và đồ uống có cồn. Vui lòng xác nhận độ tuổi để tiếp tục.
        </p>

        {status === 'prompt' ? (
          <div className={styles.actions}>
            <button ref={adultButtonRef} type="button" onClick={handleAdultConfirm} className="btn-dark">
              Tôi đã đủ 18 tuổi
            </button>
            <button type="button" onClick={handleUnderage} className="btn-outline">
              Tôi chưa đủ 18 tuổi
            </button>
          </div>
        ) : (
          <div role="alert" className={styles.denied}>
            Rất tiếc, nội dung này chỉ dành cho người từ đủ 18 tuổi.
          </div>
        )}

        <p className={styles.policy}>
          Khi tiếp tục, bạn xác nhận mình từ đủ 18 tuổi. Xem{' '}
          <Link href="/chinh-sach-kiem-soat-do-tuoi" target="_blank" rel="noopener noreferrer">
            Chính sách kiểm soát độ tuổi
          </Link>.
        </p>
      </div>
    </div>
  );
}
