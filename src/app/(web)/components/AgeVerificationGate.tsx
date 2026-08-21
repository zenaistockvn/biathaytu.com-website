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
        backgroundColor: '#0D1911',
        backgroundImage: 'radial-gradient(circle at center, #1D3325 0%, #0D1911 72%)',
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
          maxWidth: '520px',
          backgroundColor: '#14241A',
          border: '1px solid rgba(143, 191, 156, 0.28)',
          borderRadius: '18px',
          padding: 'clamp(24px, 5vw, 36px)',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.45)',
          color: '#F4F1E9',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <Image
            src="/logo.png"
            alt="Bia Thầy Tu"
            width={112}
            height={56}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
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
              border: '1.5px solid #D2B45B',
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
          Bạn đã đủ 18 tuổi?
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

        {status === 'prompt' ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            <button
              ref={adultButtonRef}
              type="button"
              onClick={handleAdultConfirm}
              style={{
                width: '100%',
                minHeight: '54px',
                padding: '14px 18px',
                border: '1px solid #A7CDB1',
                borderRadius: '10px',
                background: '#8FBF9C',
                color: '#14241A',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
              }}
            >
              Tôi từ đủ 18 tuổi
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
              Tôi chưa đủ 18 tuổi
            </button>
          </div>
        ) : (
          <div
            role="alert"
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(186, 26, 26, 0.14)',
              border: '1px solid rgba(239, 116, 116, 0.52)',
              color: '#FAD6D6',
              textAlign: 'center',
              fontSize: '15px',
              lineHeight: 1.65,
            }}
          >
            Rất tiếc, nội dung này chỉ dành cho người từ đủ 18 tuổi.
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#9DAAA1', fontSize: '12px', lineHeight: 1.6 }}>
          Khi tiếp tục, bạn xác nhận mình từ đủ 18 tuổi. Xem{' '}
          <Link
            href="/chinh-sach-kiem-soat-do-tuoi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8FBF9C', textDecoration: 'underline' }}
          >
            Chính sách kiểm soát độ tuổi
          </Link>.
        </div>
      </div>
    </div>
  );
}
