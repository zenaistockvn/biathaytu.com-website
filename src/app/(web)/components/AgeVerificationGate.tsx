'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  clearAgeVerification,
  isAgeVerified,
  setAgeVerifiedStatus,
} from '@/utils/ageVerification';

const EXEMPT_PATHS = new Set([
  '/chinh-sach-bao-mat',
  '/chinh-sach-cookie',
  '/chinh-sach-kiem-soat-do-tuoi',
]);

const UNDERAGE_EXIT_URL = 'https://www.google.com/';

export default function AgeVerificationGate() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const adultButtonRef = useRef<HTMLButtonElement>(null);

  const isExemptPath = EXEMPT_PATHS.has(pathname);

  useLayoutEffect(() => {
    setMounted(true);

    if (isExemptPath || isAgeVerified()) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  }, [isExemptPath, pathname]);

  useLayoutEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => adultButtonRef.current?.focus());
    } else {
      document.body.style.overflow = '';
    }

    const handleReset = () => {
      clearAgeVerification();
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
    window.location.replace(UNDERAGE_EXIT_URL);
  };

  return (
    <div
      className="age-gate-overlay"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-description"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(13, 25, 17, 0.94)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        className="age-gate-card"
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#14241A',
          border: '1px solid rgba(210, 180, 91, 0.28)',
          borderRadius: '18px',
          padding: 'clamp(24px, 5vw, 36px)',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.4)',
          color: '#F4F1E9',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <Image
            src="/logo.png"
            alt="Bia Thầy Tu"
            width={112}
            height={56}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <span
            aria-label="Chỉ dành cho người từ đủ 18 tuổi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '58px',
              height: '36px',
              padding: '0 12px',
              borderRadius: '999px',
              border: '1px solid #D2B45B',
              color: '#E7CE7A',
              background: 'rgba(210, 180, 91, 0.08)',
              fontWeight: 800,
              fontSize: '16px',
            }}
          >
            18+
          </span>
        </div>

        <h2
          id="age-gate-title"
          style={{
            margin: '0 0 12px',
            textAlign: 'center',
            color: '#F4F1E9',
            fontSize: 'clamp(24px, 6vw, 30px)',
            fontWeight: 800,
            fontFamily: 'var(--font-serif, serif)',
          }}
        >
          Bạn đã đủ 18 tuổi chưa?
        </h2>

        <p
          id="age-gate-description"
          style={{
            margin: '0 auto 24px',
            maxWidth: '420px',
            textAlign: 'center',
            color: '#B9C4BC',
            fontSize: '14px',
            lineHeight: 1.65,
          }}
        >
          Website có nội dung giới thiệu sản phẩm bia và đồ uống có cồn. Vui lòng xác nhận độ tuổi để tiếp tục.
        </p>

        <div style={{ display: 'grid', gap: '12px' }}>
          <button
            ref={adultButtonRef}
            type="button"
            onClick={handleAdultConfirm}
            style={{
              width: '100%',
              minHeight: '54px',
              padding: '14px 18px',
              border: '1px solid #D2B45B',
              borderRadius: '10px',
              background: '#D2B45B',
              color: '#14241A',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.16)',
            }}
          >
            Tôi đã đủ 18 tuổi
          </button>

          <button
            type="button"
            onClick={handleUnderage}
            style={{
              width: '100%',
              minHeight: '50px',
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(244, 241, 233, 0.22)',
              background: 'rgba(244, 241, 233, 0.03)',
              color: '#DCE4DE',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Chưa đủ 18 tuổi
          </button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#9DAAA1', fontSize: '12px', lineHeight: 1.6 }}>
          Xác nhận được lưu trong cookie thiết yếu trong 30 ngày. Xem{' '}
          <Link
            href="/chinh-sach-kiem-soat-do-tuoi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#D2B45B', textDecoration: 'underline' }}
          >
            Chính sách kiểm soát độ tuổi
          </Link>.
        </div>
      </div>
    </div>
  );
}
