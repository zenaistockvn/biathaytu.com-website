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
  validateDateOfBirth,
  validateFullName,
} from '@/utils/ageVerification';

type GateStatus = 'form' | 'success' | 'denied';

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
  const [status, setStatus] = useState<GateStatus>('form');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [greetingName, setGreetingName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const isExemptPath = EXEMPT_PATHS.has(pathname);

  // Quyết định gate trước paint đầu tiên sau hydration. Pre-paint script trong layout
  // đã che nội dung cho human chưa xác minh, nên không có flash nội dung phía sau.
  useLayoutEffect(() => {
    setMounted(true);

    const crawler = isSearchCrawlerUserAgent(window.navigator.userAgent || '');
    if (isExemptPath || crawler || isAgeVerified()) {
      setIsOpen(false);
      document.documentElement.removeAttribute('data-age-gate');
      return;
    }

    setStatus('form');
    setIsOpen(true);
  }, [isExemptPath, pathname]);

  useLayoutEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.documentElement.setAttribute('data-age-gate', 'active');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => nameInputRef.current?.focus());
    } else {
      document.documentElement.removeAttribute('data-age-gate');
      document.body.style.overflow = '';
    }

    const handleReset = () => {
      clearAgeVerification();
      setFullName('');
      setDob('');
      setGreetingName('');
      setErrorMsg('');
      setStatus('form');
      setIsOpen(true);
    };

    window.addEventListener('resetAgeVerification', handleReset);
    return () => {
      window.removeEventListener('resetAgeVerification', handleReset);
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);

  // Focus trap + vô hiệu hóa Escape. Không có click-outside close.
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
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');

    const nameValidation = validateFullName(fullName);
    if (!nameValidation.valid) {
      setErrorMsg(nameValidation.error || 'Vui lòng nhập đầy đủ họ và tên.');
      nameInputRef.current?.focus();
      return;
    }

    const ageValidation = validateDateOfBirth(dob);
    if (!ageValidation.valid) {
      if (ageValidation.age >= 0 && ageValidation.age < 18 && dob) {
        setStatus('denied');
        setErrorMsg('');
        setFullName('');
        setDob('');
        return;
      }

      setErrorMsg(ageValidation.error || 'Ngày sinh không hợp lệ.');
      return;
    }

    // Chỉ lưu cờ xác minh; tuyệt đối không lưu/gửi tên hoặc ngày sinh.
    setAgeVerifiedStatus();
    setGreetingName(nameValidation.normalizedName);
    setStatus('success');

    window.setTimeout(() => {
      setFullName('');
      setDob('');
      setGreetingName('');
      setIsOpen(false);
    }, 900);
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
        backgroundColor: '#070b12',
        backgroundImage: 'radial-gradient(circle at center, #172036 0%, #070b12 72%)',
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
          maxWidth: '540px',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '18px',
          padding: 'clamp(22px, 5vw, 34px)',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.55)',
          color: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <Image
            src="/logo.png"
            alt="Bia Thầy Tu"
            width={120}
            height={60}
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
              minWidth: '56px',
              height: '34px',
              padding: '0 12px',
              borderRadius: '999px',
              border: '2px solid #f59e0b',
              color: '#fbbf24',
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
            margin: '0 0 10px',
            textAlign: 'center',
            color: '#fbbf24',
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: 800,
            fontFamily: 'var(--font-serif, serif)',
          }}
        >
          Khai Báo Độ Tuổi
        </h2>

        <p
          id="age-gate-description"
          style={{
            margin: '0 auto 22px',
            maxWidth: '440px',
            textAlign: 'center',
            color: '#cbd5e1',
            fontSize: '14px',
            lineHeight: 1.65,
          }}
        >
          Website có nội dung về rượu, bia. Vui lòng khai báo họ tên và ngày sinh trước khi truy cập hoặc tìm kiếm thông tin sản phẩm.
        </p>

        {status === 'success' && (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: '18px',
              borderRadius: '12px',
              textAlign: 'center',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              color: '#d1fae5',
              lineHeight: 1.6,
            }}
          >
            Xin chào <strong>{greetingName}</strong>. Cảm ơn bạn đã xác nhận thông tin.
          </div>
        )}

        {status === 'denied' && (
          <div
            role="alert"
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.55)',
              color: '#fecaca',
              textAlign: 'center',
              fontSize: '15px',
              lineHeight: 1.65,
            }}
          >
            Rất tiếc, nội dung này chỉ dành cho người từ đủ 18 tuổi.
          </div>
        )}

        {status === 'form' && (
          <form onSubmit={handleSubmit} noValidate>
            {errorMsg && (
              <div
                role="alert"
                style={{
                  marginBottom: '16px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(248, 113, 113, 0.55)',
                  color: '#fecaca',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              >
                {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="age-gate-full-name"
                style={{ display: 'block', marginBottom: '7px', color: '#e2e8f0', fontSize: '13px', fontWeight: 700 }}
              >
                Họ và tên <span aria-hidden="true" style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                ref={nameInputRef}
                id="age-gate-full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                minLength={3}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  minHeight: '48px',
                  padding: '12px 14px',
                  borderRadius: '9px',
                  border: '1px solid #475569',
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: '16px',
                }}
              />
              <div style={{ marginTop: '5px', color: '#94a3b8', fontSize: '12px' }}>
                Bắt buộc tối thiểu 2 từ. Họ tên chỉ được xử lý tạm thời trong trình duyệt để hiển thị lời chào, không được gửi về server hoặc lưu vào database.
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="age-gate-dob"
                style={{ display: 'block', marginBottom: '7px', color: '#e2e8f0', fontSize: '13px', fontWeight: 700 }}
              >
                Ngày sinh <span aria-hidden="true" style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                id="age-gate-dob"
                name="dateOfBirth"
                type="date"
                required
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  minHeight: '48px',
                  padding: '12px 14px',
                  borderRadius: '9px',
                  border: '1px solid #475569',
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: '16px',
                  colorScheme: 'dark',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                minHeight: '50px',
                padding: '13px 16px',
                border: 0,
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                color: '#111827',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Xác nhận &amp; tiếp tục
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', lineHeight: 1.6 }}>
          Xem{' '}
          <Link
            href="/chinh-sach-bao-mat"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fbbf24', textDecoration: 'underline' }}
          >
            Chính sách bảo mật
          </Link>{' '}
          và{' '}
          <Link
            href="/chinh-sach-kiem-soat-do-tuoi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fbbf24', textDecoration: 'underline' }}
          >
            Chính sách kiểm soát độ tuổi
          </Link>.
        </div>
      </div>
    </div>
  );
}
