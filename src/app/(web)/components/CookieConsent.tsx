'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { STORAGE_KEYS } from '@/constants/compliance';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function getCookieConsentPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    if (!stored) return null;
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getCookieConsentPreferences();
    if (!existing) {
      setIsVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }

    const handleResetCookie = () => {
      const prefs = getCookieConsentPreferences();
      if (prefs) {
        setAnalytics(prefs.analytics);
        setMarketing(prefs.marketing);
      }
      setShowCustomize(true);
      setIsVisible(true);
    };

    window.addEventListener('resetCookieConsent', handleResetCookie);
    return () => window.removeEventListener('resetCookieConsent', handleResetCookie);
  }, []);

  if (!mounted || !isVisible) return null;

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectOptional = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    savePreferences({ essential: true, analytics, marketing });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '560px',
        margin: '0 auto',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        color: '#f8fafc',
        fontSize: '13px',
      }}
      role="region"
      aria-label="Cài đặt Cookie và Quyền riêng tư"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '18px' }}>🍪</span>
        <strong style={{ fontSize: '15px', color: '#fbbf24' }}>Cài Đặt Cookie & Quyền Riêng Tư</strong>
      </div>

      <p style={{ color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
        Website sử dụng Cookie cần thiết để vận hành và Cookie tùy chọn để phân tích lượt truy cập, hỗ trợ tiếp thị. Bạn có thể tự do lựa chọn và tùy chỉnh quyền riêng tư của mình.{' '}
        <Link href="/chinh-sach-cookie" style={{ color: '#fbbf24', textDecoration: 'underline' }}>
          Chính sách Cookie
        </Link>
      </p>

      {showCustomize && (
        <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <strong>Cookie Bắt Buộc (Essential)</strong>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Duy trì xác minh độ tuổi và các chức năng vận hành cốt lõi</div>
            </div>
            <input type="checkbox" checked disabled style={{ cursor: 'not-allowed' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <strong>Cookie Phân Tích (Analytics)</strong>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Giúp cải thiện hiệu năng và trải nghiệm người dùng</div>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Cookie Tiếp Thị (Marketing)</strong>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Hỗ trợ đo lường quảng cáo Facebook / TikTok</div>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end' }}>
        {!showCustomize ? (
          <>
            <button
              onClick={() => setShowCustomize(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid #475569',
                backgroundColor: 'transparent',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Tùy chỉnh
            </button>
            <button
              onClick={handleRejectOptional}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid #475569',
                backgroundColor: '#334155',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Từ chối tùy chọn
            </button>
            <button
              onClick={handleAcceptAll}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#d97706',
                color: '#000',
                cursor: 'pointer',
                fontWeight: '700',
              }}
            >
              Chấp nhận tất cả
            </button>
          </>
        ) : (
          <button
            onClick={handleSaveCustom}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#d97706',
              color: '#000',
              cursor: 'pointer',
              fontWeight: '700',
            }}
          >
            Lưu lựa chọn của tôi
          </button>
        )}
      </div>
    </div>
  );
}
