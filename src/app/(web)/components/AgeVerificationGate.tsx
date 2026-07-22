'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAgeVerified, setAgeVerifiedStatus, validateDateOfBirth, clearAgeVerification } from '@/utils/ageVerification';

export default function AgeVerificationGate() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Prevent SSR / hydration mismatch
    setMounted(true);
    if (pathname === '/chua-du-tuoi') {
      setIsOpen(false);
      return;
    }
    
    const verified = isAgeVerified();
    if (!verified) {
      setIsOpen(true);
    }
  }, [pathname]);

  // Handle body scroll locking & custom event for reset
  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus initial input
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }

    const handleReset = () => {
      clearAgeVerification();
      setName('');
      setDob('');
      setConfirmed(false);
      setErrorMsg('');
      setIsOpen(true);
    };

    window.addEventListener('resetAgeVerification', handleReset);
    return () => {
      window.removeEventListener('resetAgeVerification', handleReset);
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);

  // Trap focus and prevent Escape key bypass
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setErrorMsg('Vui lòng hoàn thành xác nhận độ tuổi để tiếp tục.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!mounted || !isOpen || pathname === '/chua-du-tuoi') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Vui lòng nhập họ và tên hợp lệ (ít nhất 2 ký tự).');
      return;
    }

    if (!dob) {
      setErrorMsg('Vui lòng chọn ngày sinh.');
      return;
    }

    if (!confirmed) {
      setErrorMsg('Vui lòng tích chọn xác nhận thông tin là chính xác.');
      return;
    }

    const validation = validateDateOfBirth(dob);

    if (!validation.valid) {
      if (validation.age > 0 && validation.age < 18) {
        // Under 18 -> redirect to neutral page immediately
        setIsOpen(false);
        router.replace('/chua-du-tuoi');
        return;
      }
      setErrorMsg(validation.error || 'Ngày sinh không hợp lệ.');
      return;
    }

    // Success -> set age verified status without storing name or DOB
    setAgeVerifiedStatus();
    setIsOpen(false);
  };

  const handleUnderageClick = () => {
    setIsOpen(false);
    router.replace('/chua-du-tuoi');
  };

  return (
    <div
      className="age-gate-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#070b12',
        backgroundImage: 'radial-gradient(circle at center, #131b2e 0%, #070b12 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      ref={modalRef}
    >
      <div
        className="age-gate-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '32px 24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
          color: '#f8fafc',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/images/logo.png"
            alt="Bia Thầy Tu Logo"
            width={120}
            height={60}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Title */}
        <h1
          id="age-gate-title"
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#fbbf24',
            marginBottom: '12px',
            fontFamily: 'var(--font-serif, serif)',
          }}
        >
          Xác Nhận Độ Tuổi
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: '1.6',
            marginBottom: '24px',
          }}
        >
          Website chứa thông tin về sản phẩm đồ uống có cồn. Vui lòng xác nhận bạn từ đủ 18 tuổi trở lên để tiếp tục truy cập.
        </p>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'left',
            }}
            role="alert"
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="gate-fullname"
              style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#cbd5e1' }}
            >
              Họ và tên <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              ref={nameInputRef}
              id="gate-fullname"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="gate-dob"
              style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#cbd5e1' }}
            >
              Ngày sinh <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="gate-dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input
              id="gate-confirm"
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="gate-confirm" style={{ fontSize: '13px', color: '#cbd5e1', cursor: 'pointer', lineHeight: '1.5' }}>
              Tôi xác nhận các thông tin trên là chính xác và hoàn toàn chịu trách nhiệm.
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: '#d97706',
                backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#000',
                fontWeight: '700',
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Tôi đã đủ 18 tuổi
            </button>

            <button
              type="button"
              onClick={handleUnderageClick}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                fontWeight: '500',
                fontSize: '14px',
                border: '1px solid #334155',
                cursor: 'pointer',
              }}
            >
              Tôi chưa đủ 18 tuổi
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
          Xem chi tiết{' '}
          <Link
            href="/chinh-sach-bao-mat"
            style={{ color: '#fbbf24', textDecoration: 'underline' }}
            onClick={() => setIsOpen(false)}
          >
            Chính sách bảo mật
          </Link>{' '}
          và{' '}
          <Link
            href="/chinh-sach-kiem-soat-do-tuoi"
            style={{ color: '#fbbf24', textDecoration: 'underline' }}
            onClick={() => setIsOpen(false)}
          >
            Chính sách kiểm soát độ tuổi
          </Link>.
        </div>
      </div>
    </div>
  );
}
